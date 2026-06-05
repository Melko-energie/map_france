import { Router } from 'express'
import { z } from 'zod'
import prisma from '../db.js'
import { requireAdmin } from '../auth.js'

const router = Router()
router.use(requireAdmin)

const refusalSchema = z.object({
  departmentCode: z.string().min(1),
  date: z.coerce.date(),
  motif: z.string().min(1),
  typeOperation: z.string().min(1),
  commentaire: z.string().nullish(),
})

async function validateBody(req, res) {
  const parsed = refusalSchema.safeParse(req.body)
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

router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const pageSize = 20
    const where = {}
    if (req.query.department) where.departmentCode = req.query.department
    if (req.query.motif) where.motif = { contains: req.query.motif }
    const [items, total] = await Promise.all([
      prisma.refusal.findMany({
        where,
        orderBy: [{ date: 'desc' }, { id: 'desc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { department: { select: { name: true } } },
      }),
      prisma.refusal.count({ where }),
    ])
    res.json({ items, total, page, pageSize })
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const data = await validateBody(req, res)
    if (!data) return
    const refusal = await prisma.refusal.create({ data })
    res.status(201).json(refusal)
  } catch (err) {
    next(err)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const id = Number.parseInt(req.params.id, 10)
    if (Number.isNaN(id)) return res.status(404).json({ error: 'Refus introuvable' })
    const existing = await prisma.refusal.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ error: 'Refus introuvable' })
    const data = await validateBody(req, res)
    if (!data) return
    const refusal = await prisma.refusal.update({ where: { id }, data })
    res.json(refusal)
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number.parseInt(req.params.id, 10)
    if (Number.isNaN(id)) return res.status(404).json({ error: 'Refus introuvable' })
    const existing = await prisma.refusal.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ error: 'Refus introuvable' })
    await prisma.refusal.delete({ where: { id } })
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

export default router
