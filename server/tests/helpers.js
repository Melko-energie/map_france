import request from 'supertest'
import bcrypt from 'bcryptjs'
import app from '../src/app.js'
import prisma from '../src/db.js'

export async function resetData() {
  await prisma.refusal.deleteMany()
  await prisma.newsItem.deleteMany()
  await prisma.adminUser.deleteMany()
  await prisma.department.upsert({ where: { code: '31' }, update: {}, create: { code: '31', name: 'Haute-Garonne' } })
  await prisma.department.upsert({ where: { code: '75' }, update: {}, create: { code: '75', name: 'Paris' } })
  await prisma.adminUser.create({
    data: { email: 'admin@test.com', passwordHash: await bcrypt.hash('secret123', 10) },
  })
}

export async function loggedInAgent() {
  const agent = request.agent(app)
  await agent.post('/api/auth/login').send({ email: 'admin@test.com', password: 'secret123' })
  return agent
}
