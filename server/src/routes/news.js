import { Router } from 'express'
import { z } from 'zod'
import prisma from '../db.js'
import { requireAdmin } from '../auth.js'

const router = Router()
router.use(requireAdmin)

const newsSchema = z.object({
  departmentCode: z.string().min(1),
  tag: z.string().min(1),
  title: z.string().min(1),
  body: z.string().min(1),
})

async function validateBody(req, res) {
  const parsed = newsSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Données invalides' })
    return null
  }
  const dept = await prisma.department.findUnique({
    where: { code: parsed.data.departmentCode },
  })
  if (!dept) {
    res.status(400).json({ error: 'Code département inconnu' })
    return null
  }
  return parsed.data
}

function parseId(req, res) {
  const id = Number(req.params.id)
  if (!Number.isInteger(id) || id < 1) {
    res.status(404).json({ error: 'Actualité introuvable' })
    return null
  }
  return id
}

router.post('/', async (req, res, next) => {
  try {
    const data = await validateBody(req, res)
    if (!data) return
    const news = await prisma.newsItem.create({ data })
    res.status(201).json(news)
  } catch (err) {
    next(err)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const id = parseId(req, res)
    if (id === null) return
    const existing = await prisma.newsItem.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ error: 'Actualité introuvable' })
    const data = await validateBody(req, res)
    if (!data) return
    const news = await prisma.newsItem.update({ where: { id }, data })
    res.json(news)
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const id = parseId(req, res)
    if (id === null) return
    const existing = await prisma.newsItem.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ error: 'Actualité introuvable' })
    await prisma.newsItem.delete({ where: { id } })
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

export default router
