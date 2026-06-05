import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'
import prisma from '../src/db.js'
import { resetData, loggedInAgent } from './helpers.js'

beforeAll(async () => {
  await resetData()
  await prisma.refusal.createMany({
    data: [
      { departmentCode: '31', date: new Date('2026-01-10'), motif: 'Pièces manquantes', typeOperation: 'BAR-TH-171' },
      { departmentCode: '31', date: new Date('2026-02-11'), motif: 'Pièces manquantes', typeOperation: 'BAT-TH-116' },
      { departmentCode: '31', date: new Date('2026-03-12'), motif: 'Hors délai', typeOperation: 'BAR-TH-171' },
    ],
  })
})

describe('GET /api/departments', () => {
  it('returns departments with refusal counts and global stats', async () => {
    const res = await request(app).get('/api/departments')
    expect(res.status).toBe(200)
    const d31 = res.body.departments.find((d) => d.code === '31')
    expect(d31.name).toBe('Haute-Garonne')
    expect(d31.refusalCount).toBe(3)
    expect(res.body.stats.totalRefusals).toBe(3)
    expect(res.body.stats.departmentsAffected).toBe(1)
    expect(res.body.stats.topMotif).toBe('Pièces manquantes')
    expect(res.body.stats.latestRefusals.length).toBe(3)
    expect(res.body.stats.latestRefusals[0].department.name).toBe('Haute-Garonne')
  })
})

describe('GET /api/departments/:code', () => {
  it('returns detail with refusals and computed stats', async () => {
    const res = await request(app).get('/api/departments/31')
    expect(res.status).toBe(200)
    expect(res.body.refusals.length).toBe(3)
    expect(res.body.stats.total).toBe(3)
    expect(res.body.stats.byMotif['Pièces manquantes']).toBe(2)
    expect(res.body.stats.byTypeOperation['BAR-TH-171']).toBe(2)
  })

  it('404s on unknown code', async () => {
    const res = await request(app).get('/api/departments/XX')
    expect(res.status).toBe(404)
  })

  it('returns zeroed stats for a department without refusals', async () => {
    const res = await request(app).get('/api/departments/75')
    expect(res.status).toBe(200)
    expect(res.body.stats.total).toBe(0)
    expect(res.body.stats.byMotif).toEqual({})
    expect(res.body.stats.byTypeOperation).toEqual({})
  })
})

describe('PUT /api/departments/:code', () => {
  it('rejects without auth', async () => {
    const res = await request(app).put('/api/departments/31').send({ note: 'test' })
    expect(res.status).toBe(401)
  })

  it('updates note and contact when authenticated', async () => {
    const agent = await loggedInAgent()
    const res = await agent.put('/api/departments/31').send({
      note: 'Département pilote',
      contactName: 'Agence Toulouse',
      contactPhone: '05 61 00 00 00',
    })
    expect(res.status).toBe(200)
    expect(res.body.note).toBe('Département pilote')
    const detail = await request(app).get('/api/departments/31')
    expect(detail.body.contactName).toBe('Agence Toulouse')
  })

  it('404s on unknown code with auth', async () => {
    const agent = await loggedInAgent()
    const res = await agent.put('/api/departments/XX').send({ note: 'x' })
    expect(res.status).toBe(404)
  })

  it('clears a field when null is sent explicitly', async () => {
    const agent = await loggedInAgent()
    await agent.put('/api/departments/31').send({ contactPhone: '05 61 00 00 00' })
    const cleared = await agent.put('/api/departments/31').send({ contactPhone: null })
    expect(cleared.status).toBe(200)
    expect(cleared.body.contactPhone).toBeNull()
  })
})
