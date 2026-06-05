import { Router } from 'express'
import { z } from 'zod'
import prisma from '../db.js'
import { requireAdmin } from '../auth.js'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const departments = await prisma.department.findMany({
      include: { _count: { select: { refusals: true } } },
      orderBy: { code: 'asc' },
    })
    const totalRefusals = departments.reduce((sum, d) => sum + d._count.refusals, 0)
    const departmentsAffected = departments.filter((d) => d._count.refusals > 0).length
    const motifGroups = await prisma.refusal.groupBy({
      by: ['motif'],
      _count: { motif: true },
      orderBy: { _count: { motif: 'desc' } },
      take: 1,
    })
    const latestRefusals = await prisma.refusal.findMany({
      orderBy: [{ date: 'desc' }, { id: 'desc' }],
      take: 5,
      include: { department: { select: { name: true } } },
    })
    res.json({
      departments: departments.map((d) => ({
        code: d.code,
        name: d.name,
        refusalCount: d._count.refusals,
      })),
      stats: {
        totalRefusals,
        departmentsAffected,
        topMotif: motifGroups[0]?.motif ?? null,
        latestRefusals,
      },
    })
  } catch (err) {
    next(err)
  }
})

router.get('/:code', async (req, res, next) => {
  try {
    const dept = await prisma.department.findUnique({
      where: { code: req.params.code },
      include: {
        refusals: { orderBy: [{ date: 'desc' }, { id: 'desc' }] },
        news: { orderBy: { createdAt: 'desc' } },
      },
    })
    if (!dept) return res.status(404).json({ error: 'Département introuvable' })
    const byMotif = {}
    const byTypeOperation = {}
    for (const r of dept.refusals) {
      byMotif[r.motif] = (byMotif[r.motif] ?? 0) + 1
      byTypeOperation[r.typeOperation] = (byTypeOperation[r.typeOperation] ?? 0) + 1
    }
    res.json({ ...dept, stats: { total: dept.refusals.length, byMotif, byTypeOperation } })
  } catch (err) {
    next(err)
  }
})

const updateSchema = z.object({
  note: z.string().nullish(),
  contactName: z.string().nullish(),
  contactAddress: z.string().nullish(),
  contactPhone: z.string().nullish(),
  contactEmail: z.string().nullish(),
})

// Sémantique PATCH volontaire : les champs absents (undefined) sont conservés,
// les champs envoyés à null sont effacés. La route reste en PUT par cohérence avec le plan.
router.put('/:code', requireAdmin, async (req, res, next) => {
  try {
    const parsed = updateSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ error: 'Données invalides' })
    const existing = await prisma.department.findUnique({ where: { code: req.params.code } })
    if (!existing) return res.status(404).json({ error: 'Département introuvable' })
    const dept = await prisma.department.update({
      where: { code: req.params.code },
      data: parsed.data,
    })
    res.json(dept)
  } catch (err) {
    next(err)
  }
})

export default router
