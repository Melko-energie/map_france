import express from 'express'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth.js'
import departmentsRouter from './routes/departments.js'

const app = express()

app.use(express.json())
app.use(cookieParser())

app.get('/api/health', (req, res) => res.json({ ok: true }))

app.use('/api/auth', authRouter)
app.use('/api/departments', departmentsRouter)

// 404 — keep this LAST; later tasks mount routers above it
app.use((req, res) => res.status(404).json({ error: 'Route introuvable' }))

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err)
  if (res.headersSent) return next(err)
  const status = err.status ?? err.statusCode ?? 500
  res.status(status).json({ error: status < 500 ? 'Requête invalide' : 'Erreur interne du serveur' })
})

export default app
