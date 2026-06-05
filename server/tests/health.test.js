import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'

describe('health', () => {
  it('responds on /api/health', async () => {
    const res = await request(app).get('/api/health')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ ok: true })
  })

  it('returns JSON 404 for unknown routes', async () => {
    const res = await request(app).get('/api/nope')
    expect(res.status).toBe(404)
    expect(res.body.error).toBeDefined()
  })
})
