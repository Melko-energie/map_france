import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import prisma from '../db.js'
import { COOKIE_NAME, signToken, requireAdmin } from '../auth.js'

const router = Router()

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

router.post('/login', async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ error: 'Requête invalide' })
    const { email, password } = parsed.data
    const admin = await prisma.adminUser.findUnique({ where: { email } })
    if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
      return res.status(401).json({ error: 'Identifiants incorrects' })
    }
    res.cookie(COOKIE_NAME, signToken(admin.id), {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    res.json({ email: admin.email })
  } catch (err) {
    next(err)
  }
})

router.post('/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME)
  res.json({ ok: true })
})

router.get('/me', requireAdmin, async (req, res, next) => {
  try {
    const admin = await prisma.adminUser.findUnique({ where: { id: req.adminId } })
    if (!admin) return res.status(401).json({ error: 'Non autorisé' })
    res.json({ email: admin.email })
  } catch (err) {
    next(err)
  }
})

export default router
