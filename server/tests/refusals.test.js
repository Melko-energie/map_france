import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'
import { resetData, loggedInAgent } from './helpers.js'

let agent

beforeAll(async () => {
  await resetData()
  agent = await loggedInAgent()
})

const valid = {
  departmentCode: '31',
  date: '2026-04-15',
  motif: 'Pièces justificatives manquantes',
  typeOperation: 'BAR-TH-171',
  commentaire: 'Cadre B manquant',
}

describe('refusals CRUD', () => {
  it('rejects all routes without auth', async () => {
    expect((await request(app).get('/api/refusals')).status).toBe(401)
    expect((await request(app).post('/api/refusals').send(valid)).status).toBe(401)
    expect((await request(app).put('/api/refusals/1').send(valid)).status).toBe(401)
    expect((await request(app).delete('/api/refusals/1')).status).toBe(401)
  })

  it('creates a refusal', async () => {
    const res = await agent.post('/api/refusals').send(valid)
    expect(res.status).toBe(201)
    expect(res.body.id).toBeDefined()
    expect(res.body.motif).toBe(valid.motif)
  })

  it('rejects missing motif with 400', async () => {
    const res = await agent.post('/api/refusals').send({ ...valid, motif: '' })
    expect(res.status).toBe(400)
  })

  it('rejects unknown department with 400', async () => {
    const res = await agent.post('/api/refusals').send({ ...valid, departmentCode: 'XX' })
    expect(res.status).toBe(400)
  })

  it('lists with department filter and pagination shape', async () => {
    await agent.post('/api/refusals').send({ ...valid, departmentCode: '75', motif: 'Hors délai' })
    const res = await agent.get('/api/refusals?department=75')
    expect(res.status).toBe(200)
    expect(res.body.items.length).toBe(1)
    expect(res.body.items[0].department.name).toBe('Paris')
    expect(res.body.total).toBe(1)
    expect(res.body.page).toBe(1)
  })

  it('filters by motif substring', async () => {
    const res = await agent.get('/api/refusals?motif=délai')
    expect(res.body.items.length).toBe(1)
  })

  it('updates a refusal', async () => {
    const created = await agent.post('/api/refusals').send(valid)
    const res = await agent
      .put(`/api/refusals/${created.body.id}`)
      .send({ ...valid, motif: 'Motif corrigé' })
    expect(res.status).toBe(200)
    expect(res.body.motif).toBe('Motif corrigé')
  })

  it('404s when updating a missing refusal', async () => {
    const res = await agent.put('/api/refusals/99999').send(valid)
    expect(res.status).toBe(404)
  })

  it('deletes a refusal', async () => {
    const created = await agent.post('/api/refusals').send(valid)
    const del = await agent.delete(`/api/refusals/${created.body.id}`)
    expect(del.status).toBe(200)
    const again = await agent.delete(`/api/refusals/${created.body.id}`)
    expect(again.status).toBe(404)
  })

  it('rejects invalid date with 400', async () => {
    expect((await agent.post('/api/refusals').send({ ...valid, date: 'garbage' })).status).toBe(400)
    expect((await agent.post('/api/refusals').send({ ...valid, date: null })).status).toBe(400)
    expect((await agent.post('/api/refusals').send({ ...valid, date: 0 })).status).toBe(400)
  })

  it('404s on non-numeric id', async () => {
    expect((await agent.put('/api/refusals/abc').send(valid)).status).toBe(404)
    expect((await agent.put('/api/refusals/1abc').send(valid)).status).toBe(404)
    expect((await agent.delete('/api/refusals/abc')).status).toBe(404)
  })
})
