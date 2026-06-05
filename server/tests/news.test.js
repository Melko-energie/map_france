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
  tag: 'Réglementation',
  title: 'Nouveau contrôle PNCEE',
  body: 'Renforcement des contrôles sur les fiches BAR-TH.',
}

describe('news CRUD', () => {
  it('rejects without auth', async () => {
    expect((await request(app).post('/api/news').send(valid)).status).toBe(401)
    expect((await request(app).put('/api/news/1').send(valid)).status).toBe(401)
    expect((await request(app).delete('/api/news/1')).status).toBe(401)
  })

  it('creates news and exposes it on the public department detail', async () => {
    const res = await agent.post('/api/news').send(valid)
    expect(res.status).toBe(201)
    const detail = await request(app).get('/api/departments/31')
    expect(detail.body.news.length).toBe(1)
    expect(detail.body.news[0].title).toBe(valid.title)
  })

  it('rejects invalid payloads', async () => {
    const res = await agent.post('/api/news').send({ ...valid, title: '' })
    expect(res.status).toBe(400)
  })

  it('rejects unknown department', async () => {
    const res = await agent.post('/api/news').send({ ...valid, departmentCode: 'XX' })
    expect(res.status).toBe(400)
  })

  it('404s on non-numeric id', async () => {
    expect((await agent.put('/api/news/abc').send(valid)).status).toBe(404)
    expect((await agent.delete('/api/news/1abc')).status).toBe(404)
  })

  it('updates and deletes news', async () => {
    const created = await agent.post('/api/news').send(valid)
    const updated = await agent
      .put(`/api/news/${created.body.id}`)
      .send({ ...valid, title: 'Titre modifié' })
    expect(updated.status).toBe(200)
    expect(updated.body.title).toBe('Titre modifié')
    const del = await agent.delete(`/api/news/${created.body.id}`)
    expect(del.status).toBe(200)
    const again = await agent.delete(`/api/news/${created.body.id}`)
    expect(again.status).toBe(404)
  })
})
