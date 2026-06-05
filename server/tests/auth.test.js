import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import bcrypt from 'bcryptjs'
import app from '../src/app.js'
import prisma from '../src/db.js'

beforeAll(async () => {
  await prisma.adminUser.deleteMany()
  await prisma.adminUser.create({
    data: { email: 'admin@test.com', passwordHash: await bcrypt.hash('secret123', 10) },
  })
})

describe('auth', () => {
  it('rejects a wrong password with 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'wrong' })
    expect(res.status).toBe(401)
    expect(res.body.error).toBeDefined()
  })

  it('rejects malformed body with 400', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'not-an-email' })
    expect(res.status).toBe(400)
  })

  it('logs in, sets a cookie, and /me returns the identity', async () => {
    const agent = request.agent(app)
    const login = await agent
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'secret123' })
    expect(login.status).toBe(200)
    expect(login.headers['set-cookie'][0]).toContain('HttpOnly')
    const me = await agent.get('/api/auth/me')
    expect(me.status).toBe(200)
    expect(me.body.email).toBe('admin@test.com')
  })

  it('rejects /me without a cookie', async () => {
    const res = await request(app).get('/api/auth/me')
    expect(res.status).toBe(401)
  })

  it('logout clears the session', async () => {
    const agent = request.agent(app)
    await agent.post('/api/auth/login').send({ email: 'admin@test.com', password: 'secret123' })
    await agent.post('/api/auth/logout')
    const me = await agent.get('/api/auth/me')
    expect(me.status).toBe(401)
  })
})
