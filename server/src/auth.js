import jwt from 'jsonwebtoken'

export const COOKIE_NAME = 'melko_admin'

export function signToken(adminId) {
  return jwt.sign({ sub: String(adminId) }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token) {
  if (!token) return null
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    return null
  }
}

export function requireAdmin(req, res, next) {
  const payload = verifyToken(req.cookies[COOKIE_NAME])
  if (!payload) return res.status(401).json({ error: 'Non autorisé' })
  req.adminId = Number(payload.sub)
  next()
}
