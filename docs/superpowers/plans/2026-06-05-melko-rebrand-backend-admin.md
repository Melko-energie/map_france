# Melko Rebrand + Backend + Admin Space Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the frontend-only fiscal-administration map into the "Melko Energie Conseil — Observatoire des refus CEE", backed by an Express+Prisma+SQLite API with an authenticated admin space for CRUD on refusals, department info, and news.

**Architecture:** Single React SPA (`ui/`, existing Vite app) restyled to the Melko brand DNA + a new Express 5 API (`server/`) using Prisma ORM over a SQLite file DB. Vite proxies `/api` → `localhost:3001`. Admin routes live at `/admin/*` inside the SPA, guarded by a JWT httpOnly cookie issued by the API.

**Tech Stack:** Express 5, Prisma 6 (SQLite), zod 3, bcryptjs, jsonwebtoken, cookie-parser, Vitest + supertest (API tests), React 19, React Router 7, Tailwind 4 + DaisyUI 5.

**Spec:** `docs/superpowers/specs/2026-06-05-melko-rebrand-backend-admin-design.md`

**Working directory note:** All `server/` commands run from `C:\Users\KASMI Mohamed Yacine\dev2\map_france\server`, all `ui/` commands from `...\map_france\ui`. Commits run from the repo root.

---

## File Structure

```
server/
├── package.json
├── .gitignore
├── .env                  # local secrets (gitignored)
├── .env.example
├── vitest.config.js
├── prisma/
│   ├── schema.prisma
│   ├── seed.js
│   └── dev.db            # gitignored
├── src/
│   ├── index.js          # entry: listen on :3001
│   ├── app.js            # express app (mountable, testable)
│   ├── db.js             # PrismaClient singleton
│   ├── auth.js           # JWT helpers + requireAdmin middleware
│   └── routes/
│       ├── auth.js
│       ├── departments.js
│       ├── refusals.js
│       └── news.js
└── tests/
    ├── global-setup.js
    ├── helpers.js
    ├── auth.test.js
    ├── departments.test.js
    ├── refusals.test.js
    └── news.test.js

ui/src/
├── lib/api.js            # NEW fetch wrapper
├── index.css             # REWRITE: melko theme
├── App.jsx               # MODIFY: papier bg, z-stacking
├── router.jsx            # MODIFY: add admin routes
├── components/
│   ├── Header.jsx        # REWRITE: Melko branding
│   ├── Footer.jsx        # REWRITE: Melko branding
│   ├── Hero.jsx          # REWRITE: light papier style
│   ├── FranceMap.jsx     # REWRITE: choropleth
│   ├── MapLegend.jsx     # REWRITE: count buckets
│   ├── Sidebar.jsx       # DELETE
│   ├── StatCard.jsx      # DELETE
│   ├── ContactCard.jsx   # DELETE
│   └── NewsCard.jsx      # DELETE
├── pages/
│   ├── HomePage.jsx      # REWRITE: observatory + API data
│   ├── DepartmentPage.jsx# REWRITE: refusal stats + API data
│   └── admin/
│       ├── AdminLayout.jsx
│       ├── LoginPage.jsx
│       ├── DashboardPage.jsx
│       ├── RefusalsPage.jsx
│       └── DepartmentsAdminPage.jsx
└── data/
    └── departments.js    # SHRINK: names only
```

---

### Task 1: Scaffold server project + Prisma schema

**Files:**
- Create: `server/package.json`
- Create: `server/.gitignore`
- Create: `server/.env.example`
- Create: `server/.env`
- Create: `server/prisma/schema.prisma`

- [ ] **Step 1: Create `server/package.json`**

```json
{
  "name": "melko-server",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "node --watch --env-file=.env src/index.js",
    "start": "node --env-file=.env src/index.js",
    "seed": "node --env-file=.env prisma/seed.js",
    "test": "vitest run"
  }
}
```

- [ ] **Step 2: Create `server/.gitignore`**

```
node_modules/
.env
*.db
*.db-journal
```

- [ ] **Step 3: Create `server/.env.example`**

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="change-me-to-a-long-random-string"
ADMIN_EMAIL="admin@melko-energie.com"
ADMIN_PASSWORD="change-me"
```

- [ ] **Step 4: Create `server/.env`** (same content; pick a real random JWT_SECRET, e.g. 48 hex chars, and a real admin password)

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="<48+ random characters>"
ADMIN_EMAIL="admin@melko-energie.com"
ADMIN_PASSWORD="admin1234"
```

- [ ] **Step 5: Install dependencies**

Run (in `server/`):
```powershell
npm install express@^5 @prisma/client bcryptjs jsonwebtoken cookie-parser zod@^3
npm install -D prisma vitest supertest
```
Expected: both succeed, `package.json` gains dependencies.

- [ ] **Step 6: Create `server/prisma/schema.prisma`**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Department {
  code           String     @id
  name           String
  note           String?
  contactName    String?
  contactAddress String?
  contactPhone   String?
  contactEmail   String?
  refusals       Refusal[]
  news           NewsItem[]
}

model Refusal {
  id             Int        @id @default(autoincrement())
  departmentCode String
  department     Department @relation(fields: [departmentCode], references: [code])
  date           DateTime
  motif          String
  typeOperation  String
  commentaire    String?
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt
}

model NewsItem {
  id             Int        @id @default(autoincrement())
  departmentCode String
  department     Department @relation(fields: [departmentCode], references: [code])
  tag            String
  title          String
  body           String
  createdAt      DateTime   @default(now())
}

model AdminUser {
  id           Int    @id @default(autoincrement())
  email        String @unique
  passwordHash String
}
```

- [ ] **Step 7: Run the initial migration**

Run (in `server/`):
```powershell
npx prisma migrate dev --name init
```
Note: `prisma migrate` reads `.env` automatically. Expected output: "Your database is now in sync with your schema" + generated Prisma Client. `server/prisma/dev.db` and `server/prisma/migrations/` appear.

- [ ] **Step 8: Commit**

```powershell
git add server/package.json server/package-lock.json server/.gitignore server/.env.example server/prisma/schema.prisma server/prisma/migrations
git commit -m "feat(server): scaffold Express+Prisma project with SQLite schema"
```

---

### Task 2: Test infrastructure + app skeleton (TDD)

**Files:**
- Create: `server/vitest.config.js`
- Create: `server/tests/global-setup.js`
- Create: `server/tests/health.test.js`
- Create: `server/src/db.js`
- Create: `server/src/app.js`

- [ ] **Step 1: Create `server/vitest.config.js`**

```js
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    env: {
      DATABASE_URL: 'file:./test.db',
      JWT_SECRET: 'test-secret',
    },
    globalSetup: './tests/global-setup.js',
    fileParallelism: false,
  },
})
```

(`fileParallelism: false` because all test files share one SQLite file. The relative `file:./test.db` resolves against `prisma/schema.prisma`, so the test DB lands in `server/prisma/test.db` — already gitignored by `*.db`.)

- [ ] **Step 2: Create `server/tests/global-setup.js`**

```js
import { execSync } from 'node:child_process'

export default function setup() {
  execSync('npx prisma db push --force-reset --skip-generate', {
    env: { ...process.env, DATABASE_URL: 'file:./test.db' },
    stdio: 'inherit',
  })
}
```

- [ ] **Step 3: Write the failing test `server/tests/health.test.js`**

```js
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
```

- [ ] **Step 4: Run test to verify it fails**

Run (in `server/`): `npm test`
Expected: FAIL — `Cannot find module '../src/app.js'`

- [ ] **Step 5: Create `server/src/db.js`**

```js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default prisma
```

- [ ] **Step 6: Create `server/src/app.js`**

```js
import express from 'express'
import cookieParser from 'cookie-parser'

const app = express()

app.use(express.json())
app.use(cookieParser())

app.get('/api/health', (req, res) => res.json({ ok: true }))

// 404 — keep this LAST; later tasks mount routers above it
app.use((req, res) => res.status(404).json({ error: 'Route introuvable' }))

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Erreur interne du serveur' })
})

export default app
```

- [ ] **Step 7: Run test to verify it passes**

Run: `npm test`
Expected: PASS (2 tests)

- [ ] **Step 8: Commit**

```powershell
git add server/vitest.config.js server/tests server/src
git commit -m "feat(server): app skeleton with health route and test infrastructure"
```

---

### Task 3: Auth — login / logout / me (TDD)

**Files:**
- Create: `server/src/auth.js`
- Create: `server/src/routes/auth.js`
- Create: `server/tests/auth.test.js`
- Modify: `server/src/app.js`

- [ ] **Step 1: Write the failing tests `server/tests/auth.test.js`**

```js
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
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test`
Expected: auth tests FAIL with 404s (routes not mounted); health still passes.

- [ ] **Step 3: Create `server/src/auth.js`**

```js
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
```

- [ ] **Step 4: Create `server/src/routes/auth.js`**

```js
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
```

- [ ] **Step 5: Mount the router in `server/src/app.js`** — add the import and mount it ABOVE the 404 handler:

```js
import authRouter from './routes/auth.js'
// ...after the /api/health route:
app.use('/api/auth', authRouter)
```

- [ ] **Step 6: Run tests to verify pass**

Run: `npm test`
Expected: PASS (7 tests)

- [ ] **Step 7: Commit**

```powershell
git add server/src server/tests/auth.test.js
git commit -m "feat(server): admin auth with JWT httpOnly cookie"
```

---

### Task 4: Seed script

**Files:**
- Create: `server/prisma/seed.js`

- [ ] **Step 1: Create `server/prisma/seed.js`** (department list copied verbatim from `ui/src/data/departments.js`)

```js
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const DEPARTMENT_NAMES = {
  '01': 'Ain', '02': 'Aisne', '03': 'Allier', '04': 'Alpes-de-Haute-Provence',
  '05': 'Hautes-Alpes', '06': 'Alpes-Maritimes', '07': 'Ardèche', '08': 'Ardennes',
  '09': 'Ariège', '10': 'Aube', '11': 'Aude', '12': 'Aveyron',
  '13': 'Bouches-du-Rhône', '14': 'Calvados', '15': 'Cantal', '16': 'Charente',
  '17': 'Charente-Maritime', '18': 'Cher', '19': 'Corrèze', '2A': 'Corse-du-Sud',
  '2B': 'Haute-Corse', '21': 'Côte-d\'Or', '22': 'Côtes-d\'Armor', '23': 'Creuse',
  '24': 'Dordogne', '25': 'Doubs', '26': 'Drôme', '27': 'Eure',
  '28': 'Eure-et-Loir', '29': 'Finistère', '30': 'Gard', '31': 'Haute-Garonne',
  '32': 'Gers', '33': 'Gironde', '34': 'Hérault', '35': 'Ille-et-Vilaine',
  '36': 'Indre', '37': 'Indre-et-Loire', '38': 'Isère', '39': 'Jura',
  '40': 'Landes', '41': 'Loir-et-Cher', '42': 'Loire', '43': 'Haute-Loire',
  '44': 'Loire-Atlantique', '45': 'Loiret', '46': 'Lot', '47': 'Lot-et-Garonne',
  '48': 'Lozère', '49': 'Maine-et-Loire', '50': 'Manche', '51': 'Marne',
  '52': 'Haute-Marne', '53': 'Mayenne', '54': 'Meurthe-et-Moselle', '55': 'Meuse',
  '56': 'Morbihan', '57': 'Moselle', '58': 'Nièvre', '59': 'Nord',
  '60': 'Oise', '61': 'Orne', '62': 'Pas-de-Calais', '63': 'Puy-de-Dôme',
  '64': 'Pyrénées-Atlantiques', '65': 'Hautes-Pyrénées', '66': 'Pyrénées-Orientales',
  '67': 'Bas-Rhin', '68': 'Haut-Rhin', '69': 'Rhône', '70': 'Haute-Saône',
  '71': 'Saône-et-Loire', '72': 'Sarthe', '73': 'Savoie', '74': 'Haute-Savoie',
  '75': 'Paris', '76': 'Seine-Maritime', '77': 'Seine-et-Marne', '78': 'Yvelines',
  '79': 'Deux-Sèvres', '80': 'Somme', '81': 'Tarn', '82': 'Tarn-et-Garonne',
  '83': 'Var', '84': 'Vaucluse', '85': 'Vendée', '86': 'Vienne',
  '87': 'Haute-Vienne', '88': 'Vosges', '89': 'Yonne', '90': 'Territoire de Belfort',
  '91': 'Essonne', '92': 'Hauts-de-Seine', '93': 'Seine-Saint-Denis',
  '94': 'Val-de-Marne', '95': 'Val-d\'Oise',
  '971': 'Guadeloupe', '972': 'Martinique', '973': 'Guyane',
  '974': 'La Réunion', '976': 'Mayotte',
}

async function main() {
  for (const [code, name] of Object.entries(DEPARTMENT_NAMES)) {
    await prisma.department.upsert({
      where: { code },
      update: { name },
      create: { code, name },
    })
  }

  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  if (!email || !password) {
    throw new Error('ADMIN_EMAIL et ADMIN_PASSWORD doivent être définis dans .env')
  }
  await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash: await bcrypt.hash(password, 10) },
  })

  if ((await prisma.refusal.count()) === 0) {
    await prisma.refusal.createMany({
      data: [
        { departmentCode: '31', date: new Date('2026-03-12'), motif: 'Pièces justificatives manquantes', typeOperation: 'BAR-TH-171', commentaire: 'Attestation sur l\'honneur incomplète' },
        { departmentCode: '31', date: new Date('2026-04-02'), motif: 'Non-conformité de l\'opération', typeOperation: 'BAT-TH-116' },
        { departmentCode: '75', date: new Date('2026-02-20'), motif: 'Délai de dépôt dépassé', typeOperation: 'BAR-EN-101', commentaire: 'Dossier déposé hors délai PNCEE' },
        { departmentCode: '69', date: new Date('2026-05-05'), motif: 'Pièces justificatives manquantes', typeOperation: 'IND-UT-117' },
        { departmentCode: '33', date: new Date('2026-01-15'), motif: 'Incohérence des dates de travaux', typeOperation: 'BAR-TH-104' },
      ],
    })
  }

  const counts = {
    departments: await prisma.department.count(),
    admins: await prisma.adminUser.count(),
    refusals: await prisma.refusal.count(),
  }
  console.log('Seed terminé :', counts)
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
```

- [ ] **Step 2: Run the seed and verify output**

Run (in `server/`): `npm run seed`
Expected: `Seed terminé : { departments: 101, admins: 1, refusals: 5 }`

- [ ] **Step 3: Run it again to prove idempotence**

Run: `npm run seed`
Expected: same counts (no duplicates).

- [ ] **Step 4: Commit**

```powershell
git add server/prisma/seed.js
git commit -m "feat(server): idempotent seed (101 departments, admin user, sample refusals)"
```

---

### Task 5: Departments endpoints (TDD)

**Files:**
- Create: `server/tests/helpers.js`
- Create: `server/tests/departments.test.js`
- Create: `server/src/routes/departments.js`
- Modify: `server/src/app.js`

- [ ] **Step 1: Create `server/tests/helpers.js`** (shared fixtures for the remaining test files)

```js
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
```

- [ ] **Step 2: Write failing tests `server/tests/departments.test.js`**

```js
import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'
import prisma from '../src/db.js'
import { resetData, loggedInAgent } from './helpers.js'

beforeAll(async () => {
  await resetData()
  await prisma.refusal.createMany({
    data: [
      { departmentCode: '31', date: new Date('2026-01-10'), motif: 'Pièces manquantes', typeOperation: 'BAR-TH-171' },
      { departmentCode: '31', date: new Date('2026-02-11'), motif: 'Pièces manquantes', typeOperation: 'BAT-TH-116' },
      { departmentCode: '31', date: new Date('2026-03-12'), motif: 'Hors délai', typeOperation: 'BAR-TH-171' },
    ],
  })
})

describe('GET /api/departments', () => {
  it('returns departments with refusal counts and global stats', async () => {
    const res = await request(app).get('/api/departments')
    expect(res.status).toBe(200)
    const d31 = res.body.departments.find((d) => d.code === '31')
    expect(d31.name).toBe('Haute-Garonne')
    expect(d31.refusalCount).toBe(3)
    expect(res.body.stats.totalRefusals).toBe(3)
    expect(res.body.stats.departmentsAffected).toBe(1)
    expect(res.body.stats.topMotif).toBe('Pièces manquantes')
    expect(res.body.stats.latestRefusals.length).toBe(3)
    expect(res.body.stats.latestRefusals[0].department.name).toBe('Haute-Garonne')
  })
})

describe('GET /api/departments/:code', () => {
  it('returns detail with refusals and computed stats', async () => {
    const res = await request(app).get('/api/departments/31')
    expect(res.status).toBe(200)
    expect(res.body.refusals.length).toBe(3)
    expect(res.body.stats.total).toBe(3)
    expect(res.body.stats.byMotif['Pièces manquantes']).toBe(2)
    expect(res.body.stats.byTypeOperation['BAR-TH-171']).toBe(2)
  })

  it('404s on unknown code', async () => {
    const res = await request(app).get('/api/departments/XX')
    expect(res.status).toBe(404)
  })
})

describe('PUT /api/departments/:code', () => {
  it('rejects without auth', async () => {
    const res = await request(app).put('/api/departments/31').send({ note: 'test' })
    expect(res.status).toBe(401)
  })

  it('updates note and contact when authenticated', async () => {
    const agent = await loggedInAgent()
    const res = await agent.put('/api/departments/31').send({
      note: 'Département pilote',
      contactName: 'Agence Toulouse',
      contactPhone: '05 61 00 00 00',
    })
    expect(res.status).toBe(200)
    expect(res.body.note).toBe('Département pilote')
    const detail = await request(app).get('/api/departments/31')
    expect(detail.body.contactName).toBe('Agence Toulouse')
  })

  it('404s on unknown code with auth', async () => {
    const agent = await loggedInAgent()
    const res = await agent.put('/api/departments/XX').send({ note: 'x' })
    expect(res.status).toBe(404)
  })
})
```

- [ ] **Step 3: Run to verify failure** — `npm test` → departments tests FAIL with 404s.

- [ ] **Step 4: Create `server/src/routes/departments.js`**

```js
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
      orderBy: { date: 'desc' },
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
        refusals: { orderBy: { date: 'desc' } },
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
```

- [ ] **Step 5: Mount in `server/src/app.js`** above the 404 handler:

```js
import departmentsRouter from './routes/departments.js'
// ...
app.use('/api/departments', departmentsRouter)
```

- [ ] **Step 6: Run tests** — `npm test` → all PASS.

- [ ] **Step 7: Commit**

```powershell
git add server/src server/tests
git commit -m "feat(server): departments endpoints with refusal stats"
```

---

### Task 6: Refusals CRUD (TDD)

**Files:**
- Create: `server/tests/refusals.test.js`
- Create: `server/src/routes/refusals.js`
- Modify: `server/src/app.js`

- [ ] **Step 1: Write failing tests `server/tests/refusals.test.js`**

```js
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
  date: '2026-04-15',
  motif: 'Pièces justificatives manquantes',
  typeOperation: 'BAR-TH-171',
  commentaire: 'Cadre B manquant',
}

describe('refusals CRUD', () => {
  it('rejects all routes without auth', async () => {
    expect((await request(app).get('/api/refusals')).status).toBe(401)
    expect((await request(app).post('/api/refusals').send(valid)).status).toBe(401)
    expect((await request(app).put('/api/refusals/1').send(valid)).status).toBe(401)
    expect((await request(app).delete('/api/refusals/1')).status).toBe(401)
  })

  it('creates a refusal', async () => {
    const res = await agent.post('/api/refusals').send(valid)
    expect(res.status).toBe(201)
    expect(res.body.id).toBeDefined()
    expect(res.body.motif).toBe(valid.motif)
  })

  it('rejects missing motif with 400', async () => {
    const res = await agent.post('/api/refusals').send({ ...valid, motif: '' })
    expect(res.status).toBe(400)
  })

  it('rejects unknown department with 400', async () => {
    const res = await agent.post('/api/refusals').send({ ...valid, departmentCode: 'XX' })
    expect(res.status).toBe(400)
  })

  it('lists with department filter and pagination shape', async () => {
    await agent.post('/api/refusals').send({ ...valid, departmentCode: '75', motif: 'Hors délai' })
    const res = await agent.get('/api/refusals?department=75')
    expect(res.status).toBe(200)
    expect(res.body.items.length).toBe(1)
    expect(res.body.items[0].department.name).toBe('Paris')
    expect(res.body.total).toBe(1)
    expect(res.body.page).toBe(1)
  })

  it('filters by motif substring', async () => {
    const res = await agent.get('/api/refusals?motif=délai')
    expect(res.body.items.length).toBe(1)
  })

  it('updates a refusal', async () => {
    const created = await agent.post('/api/refusals').send(valid)
    const res = await agent
      .put(`/api/refusals/${created.body.id}`)
      .send({ ...valid, motif: 'Motif corrigé' })
    expect(res.status).toBe(200)
    expect(res.body.motif).toBe('Motif corrigé')
  })

  it('404s when updating a missing refusal', async () => {
    const res = await agent.put('/api/refusals/99999').send(valid)
    expect(res.status).toBe(404)
  })

  it('deletes a refusal', async () => {
    const created = await agent.post('/api/refusals').send(valid)
    const del = await agent.delete(`/api/refusals/${created.body.id}`)
    expect(del.status).toBe(200)
    const again = await agent.delete(`/api/refusals/${created.body.id}`)
    expect(again.status).toBe(404)
  })
})
```

- [ ] **Step 2: Run to verify failure** — `npm test` → refusals tests FAIL (404 instead of 401 etc.).

- [ ] **Step 3: Create `server/src/routes/refusals.js`**

```js
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
        orderBy: { date: 'desc' },
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
    const id = parseInt(req.params.id)
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
    const id = parseInt(req.params.id)
    const existing = await prisma.refusal.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ error: 'Refus introuvable' })
    await prisma.refusal.delete({ where: { id } })
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

export default router
```

(`parseInt('99999')` is fine; `parseInt('abc')` → `NaN` → `findUnique` returns null → 404. Acceptable.)

- [ ] **Step 4: Mount in `server/src/app.js`**:

```js
import refusalsRouter from './routes/refusals.js'
// ...
app.use('/api/refusals', refusalsRouter)
```

- [ ] **Step 5: Run tests** — `npm test` → all PASS.

- [ ] **Step 6: Commit**

```powershell
git add server/src server/tests/refusals.test.js
git commit -m "feat(server): refusals CRUD with filters and pagination"
```

---

### Task 7: News CRUD (TDD)

**Files:**
- Create: `server/tests/news.test.js`
- Create: `server/src/routes/news.js`
- Modify: `server/src/app.js`

- [ ] **Step 1: Write failing tests `server/tests/news.test.js`**

```js
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
```

- [ ] **Step 2: Run to verify failure** — `npm test` → news tests FAIL.

- [ ] **Step 3: Create `server/src/routes/news.js`**

```js
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
    const id = parseInt(req.params.id)
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
    const id = parseInt(req.params.id)
    const existing = await prisma.newsItem.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ error: 'Actualité introuvable' })
    await prisma.newsItem.delete({ where: { id } })
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

export default router
```

- [ ] **Step 4: Mount in `server/src/app.js`**:

```js
import newsRouter from './routes/news.js'
// ...
app.use('/api/news', newsRouter)
```

- [ ] **Step 5: Run tests** — `npm test` → all PASS.

- [ ] **Step 6: Commit**

```powershell
git add server/src server/tests/news.test.js
git commit -m "feat(server): news CRUD"
```

---

### Task 8: Server entry point + README

**Files:**
- Create: `server/src/index.js`
- Create: `server/README.md`

- [ ] **Step 1: Create `server/src/index.js`**

```js
import app from './app.js'

const port = process.env.PORT || 3001

app.listen(port, () => {
  console.log(`API Melko démarrée sur http://localhost:${port}`)
})
```

- [ ] **Step 2: Create `server/README.md`**

```markdown
# Melko API

API Express + Prisma (SQLite) pour l'observatoire des refus CEE.

## Démarrage

```powershell
cd server
npm install
copy .env.example .env   # puis éditer JWT_SECRET / ADMIN_EMAIL / ADMIN_PASSWORD
npx prisma migrate dev
npm run seed
npm run dev              # API sur http://localhost:3001
```

Le front (`ui/`, `npm run dev`) proxe automatiquement `/api` vers ce serveur.

## Scripts

- `npm run dev` — serveur avec rechargement (`node --watch`)
- `npm run seed` — départements + compte admin + refus d'exemple (idempotent)
- `npm test` — tests d'intégration (base SQLite séparée `prisma/test.db`)
```

- [ ] **Step 3: Smoke-test the server**

Run (in `server/`, background or second terminal): `npm run dev`
Then: `curl.exe http://localhost:3001/api/health`
Expected: `{"ok":true}`. Also `curl.exe http://localhost:3001/api/departments` returns 101 departments with seeded counts. Stop the server.

- [ ] **Step 4: Commit**

```powershell
git add server/src/index.js server/README.md
git commit -m "feat(server): entry point and README"
```

---

### Task 9: Vite proxy + frontend API client

**Files:**
- Modify: `ui/vite.config.js`
- Create: `ui/src/lib/api.js`

- [ ] **Step 1: Replace `ui/vite.config.js`**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
```

- [ ] **Step 2: Create `ui/src/lib/api.js`**

```js
export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

export async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(path, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'same-origin',
  })
  if (!res.ok) {
    let message = `Erreur ${res.status}`
    try {
      const data = await res.json()
      if (data.error) message = data.error
    } catch {
      // garder le message par défaut
    }
    throw new ApiError(message, res.status)
  }
  return res.json()
}
```

- [ ] **Step 3: Verify the build still passes**

Run (in `ui/`): `npm run build`
Expected: build succeeds.

- [ ] **Step 4: Commit**

```powershell
git add ui/vite.config.js ui/src/lib/api.js
git commit -m "feat(ui): API client and dev proxy to :3001"
```

---

### Task 10: Melko theme — fonts + CSS

**Files:**
- Modify: `ui/index.html`
- Rewrite: `ui/src/index.css`
- Modify: `ui/src/App.jsx`

- [ ] **Step 1: Replace `ui/index.html`**

```html
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Melko Energie · Observatoire des refus CEE</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 2: Replace `ui/src/index.css` entirely**

```css
@import "tailwindcss";
@plugin "daisyui" {
  themes: melko --default;
}

@plugin "daisyui/theme" {
  name: "melko";
  default: true;
  color-scheme: light;
  --color-base-100: #FAF8F4;
  --color-base-200: #F2EDE4;
  --color-base-300: #E6DFD2;
  --color-base-content: #0E1A24;
  --color-primary: #3F8A3D;
  --color-primary-content: #FAF8F4;
  --color-secondary: #1B5F8C;
  --color-secondary-content: #FAF8F4;
  --color-accent: #0E1A24;
  --color-accent-content: #FAF8F4;
  --color-neutral: #0E1A24;
  --color-neutral-content: #FAF8F4;
  --color-info: #4E83AB;
  --color-info-content: #FAF8F4;
  --color-success: #2A5C29;
  --color-success-content: #FAF8F4;
  --color-warning: #B45309;
  --color-warning-content: #FAF8F4;
  --color-error: #BA1A1A;
  --color-error-content: #FFFFFF;
  --radius-box: 1.125rem;
  --radius-btn: 999px;
  --radius-field: 0.625rem;
}

@theme {
  --font-display: 'Instrument Serif', Georgia, serif;
  --font-body: 'Inter', Helvetica, Arial, sans-serif;
  --font-brand-mono: 'JetBrains Mono', monospace;
}

/* === Palette Melko (ADN de marque) === */
:root {
  --m-foret: #3F8A3D;
  --m-foret-dark: #2A5C29;
  --m-foret-light: #6FA86D;
  --m-saphir: #1B5F8C;
  --m-saphir-dark: #0E3D5C;
  --m-saphir-light: #4E83AB;
  --m-encre: #0E1A24;
  --m-papier: #FAF8F4;

  --m-ink-90: rgba(14, 26, 36, 0.90);
  --m-ink-70: rgba(14, 26, 36, 0.70);
  --m-ink-50: rgba(14, 26, 36, 0.50);
  --m-ink-30: rgba(14, 26, 36, 0.30);
  --m-ink-12: rgba(14, 26, 36, 0.12);
  --m-ink-08: rgba(14, 26, 36, 0.08);
  --m-ink-05: rgba(14, 26, 36, 0.05);
  --m-ink-02: rgba(14, 26, 36, 0.025);
}

body {
  font-family: var(--font-body);
  background: var(--m-papier);
  color: var(--m-encre);
  margin: 0;
  -webkit-font-smoothing: antialiased;
}

/* Texture papier (derrière le contenu : le contenu est dans un wrapper z-1) */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  opacity: 0.32;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.055 0 0 0 0 0.102 0 0 0 0 0.141 0 0 0 0.05 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  mix-blend-mode: multiply;
  z-index: 0;
}

h1, h2, h3 {
  font-family: var(--font-display);
  font-weight: 400;
  letter-spacing: -0.02em;
}

/* Carte Melko : fond encre-02, hairline interne, lift au survol */
.m-card {
  background: var(--m-ink-02);
  box-shadow: inset 0 0 0 0.5px var(--m-ink-08);
  border-radius: 18px;
  transition: box-shadow 0.25s ease, transform 0.25s ease;
}
.m-card-hover:hover {
  box-shadow: inset 0 0 0 0.5px var(--m-foret), 0 4px 18px rgba(14, 26, 36, 0.04);
  transform: translateY(-1px);
}

/* Surface papier interne (comme le logo-stage de l'ADN) */
.m-stage {
  background: var(--m-papier);
  box-shadow: inset 0 0 0 0.5px var(--m-ink-05);
  border-radius: 12px;
}

/* Micro-label mono majuscules */
.m-label {
  font-family: var(--font-brand-mono);
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--m-ink-50);
}

/* Bouton pilule encre (ADN : .continue) */
.m-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: var(--m-encre);
  color: var(--m-papier);
  border: 0;
  padding: 12px 24px;
  border-radius: 999px;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
}
.m-btn:hover {
  background: var(--m-foret-dark);
}
.m-btn-foret { background: var(--m-foret); }
.m-btn-foret:hover { background: var(--m-foret-dark); }

.glass-nav {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

/* Départements de la carte */
.map-department {
  transition: fill 0.2s ease;
  cursor: pointer;
}
.map-department:hover {
  fill: var(--m-saphir) !important;
}

/* Material Symbols */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* Animation d'entrée */
@keyframes slideUpFadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-up {
  animation: slideUpFadeIn 300ms ease-out forwards;
}
```

(The `!important` on `.map-department:hover` is needed because the choropleth fill is an inline SVG attribute.)

- [ ] **Step 3: Replace `ui/src/App.jsx`** (wrapper gets `relative z-[1]` so the paper texture sits behind)

```jsx
import { Outlet } from 'react-router'
import Header from './components/Header'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col relative z-[1]">
      <Header />
      <main className="pt-20 flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
```

- [ ] **Step 4: Verify** — `npm run build` in `ui/` succeeds. (Pages still reference old vars like `--surface`; they render unstyled-ish until Tasks 11–14 — acceptable mid-flight, the build must just compile.)

- [ ] **Step 5: Commit**

```powershell
git add ui/index.html ui/src/index.css ui/src/App.jsx
git commit -m "feat(ui): Melko brand theme (palette, fonts, paper texture, card language)"
```

---

### Task 11: Header, Footer, Hero rebrand

**Files:**
- Rewrite: `ui/src/components/Header.jsx`
- Rewrite: `ui/src/components/Footer.jsx`
- Rewrite: `ui/src/components/Hero.jsx`

- [ ] **Step 1: Replace `ui/src/components/Header.jsx`**

```jsx
import { Link } from 'react-router'

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-40 bg-[#FAF8F4]/85 glass-nav border-b border-[var(--m-ink-08)]">
      <div className="flex justify-between items-center px-8 h-20 max-w-screen-2xl mx-auto">
        <Link to="/" className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-[var(--m-foret)] shadow-sm" aria-hidden="true" />
          <span className="font-display text-2xl tracking-tight">
            Melko <span className="italic text-[var(--m-foret)]">Energie</span>
          </span>
          <span className="m-label mt-1 hidden sm:inline">Conseil</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link to="/" className="hidden md:inline text-sm font-medium text-[var(--m-ink-70)] hover:text-[var(--m-encre)] transition-colors">
            Carte des refus
          </Link>
          <a href="/#derniers-refus" className="hidden md:inline text-sm font-medium text-[var(--m-ink-70)] hover:text-[var(--m-encre)] transition-colors">
            Derniers refus
          </a>
          <Link to="/admin" className="m-btn text-sm !py-2 !px-5">
            Espace Admin
          </Link>
        </nav>
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Replace `ui/src/components/Footer.jsx`**

```jsx
export default function Footer() {
  return (
    <footer className="border-t border-[var(--m-ink-08)] bg-[var(--m-ink-02)]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-12 py-16 max-w-7xl mx-auto">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-[var(--m-foret)]" aria-hidden="true" />
            <span className="font-display text-xl">
              Melko <span className="italic text-[var(--m-foret)]">Energie</span>
            </span>
          </div>
          <p className="font-display italic text-[var(--m-ink-70)] text-sm leading-relaxed">
            L'énergie au cœur des plus beaux projets — conseil CEE pour le tertiaire premium.
          </p>
        </div>
        <div>
          <h4 className="m-label mb-6">Observatoire</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="/" className="text-[var(--m-ink-70)] hover:text-[var(--m-foret)] transition-colors">Carte des refus</a></li>
            <li><a href="/#derniers-refus" className="text-[var(--m-ink-70)] hover:text-[var(--m-foret)] transition-colors">Derniers refus</a></li>
            <li><a href="/admin" className="text-[var(--m-ink-70)] hover:text-[var(--m-foret)] transition-colors">Espace Admin</a></li>
          </ul>
        </div>
        <div>
          <h4 className="m-label mb-6">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="https://melko-energie.com" className="text-[var(--m-ink-70)] hover:text-[var(--m-foret)] transition-colors font-brand-mono text-xs">melko-energie.com</a></li>
            <li><span className="text-[var(--m-ink-70)]">Conseil CEE · Tertiaire premium</span></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-12 py-6 border-t border-[var(--m-ink-08)] flex flex-col md:flex-row justify-between items-center text-xs text-[var(--m-ink-50)] gap-2">
        <p>© 2026 Melko Energie Conseil. Tous droits réservés.</p>
        <p className="font-brand-mono uppercase tracking-widest text-[10px]">Observatoire des refus CEE</p>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Replace `ui/src/components/Hero.jsx`** (light papier style, serif + italic accents; same prop API minus `decorativeIcon`)

```jsx
export default function Hero({ breadcrumbs, eyebrow, title, subtitle, description, children }) {
  return (
    <header className="py-16 lg:py-24 px-8 relative overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10 text-center">
        {breadcrumbs && (
          <nav className="mb-8 flex items-center justify-center gap-2 text-[var(--m-ink-50)] text-sm flex-wrap">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <span className="material-symbols-outlined text-xs">chevron_right</span>}
                {crumb.href ? (
                  <a href={crumb.href} className="hover:text-[var(--m-encre)] transition-colors">{crumb.label}</a>
                ) : (
                  <span className="text-[var(--m-encre)]">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && <div className="m-label mb-4">{eyebrow}</div>}
        <h1 className="font-display text-5xl md:text-6xl tracking-tight leading-none animate-slide-up">
          {title}
        </h1>
        {subtitle && (
          <span className="block font-display italic text-4xl md:text-5xl text-[var(--m-foret)] mt-2 animate-slide-up">
            {subtitle}
          </span>
        )}
        {description && (
          <p className="text-base text-[var(--m-ink-70)] max-w-2xl mx-auto leading-relaxed mt-6">
            {description}
          </p>
        )}
        {children}
      </div>
    </header>
  )
}
```

- [ ] **Step 4: Verify** — `npm run build` in `ui/` succeeds.

- [ ] **Step 5: Commit**

```powershell
git add ui/src/components/Header.jsx ui/src/components/Footer.jsx ui/src/components/Hero.jsx
git commit -m "feat(ui): rebrand header, footer, hero to Melko"
```

---

### Task 12: Choropleth map + legend

**Files:**
- Rewrite: `ui/src/components/FranceMap.jsx`
- Rewrite: `ui/src/components/MapLegend.jsx`

- [ ] **Step 1: Replace `ui/src/components/FranceMap.jsx`**

```jsx
import { useNavigate } from 'react-router'
import { getDepartmentName } from '../data/departments'
import FRANCE_PATHS from '../data/france-paths'

export const CHORO_SCALE = ['#C9DCC8', '#9DC29B', '#6FA86D', '#3F8A3D', '#2A5C29']
export const CHORO_ZERO = '#E9E4D8'

export function choroplethColor(count, max) {
  if (!count || !max) return CHORO_ZERO
  const idx = Math.min(CHORO_SCALE.length - 1, Math.floor((count / max) * CHORO_SCALE.length))
  return CHORO_SCALE[idx]
}

export default function FranceMap({ counts = {} }) {
  const navigate = useNavigate()
  const max = Math.max(0, ...Object.values(counts))

  return (
    <svg viewBox="130 50 400 380" className="w-full h-full max-h-[600px]">
      <g>
        {FRANCE_PATHS.map((dept) => (
          <g key={dept.id} onClick={() => navigate(`/department/${dept.id}`)}>
            <title>
              {`${getDepartmentName(dept.id) || dept.name} (${dept.id}) — ${counts[dept.id] || 0} refus`}
            </title>
            <path
              d={dept.d}
              className="map-department"
              fill={choroplethColor(counts[dept.id], max)}
              stroke="#FAF8F4"
              strokeWidth="0.8"
            />
          </g>
        ))}
      </g>
    </svg>
  )
}
```

- [ ] **Step 2: Replace `ui/src/components/MapLegend.jsx`**

```jsx
import { CHORO_SCALE, CHORO_ZERO } from './FranceMap'

export default function MapLegend({ max = 0 }) {
  const buckets = [{ color: CHORO_ZERO, label: 'Aucun refus' }]
  if (max > 0) {
    const step = max / CHORO_SCALE.length
    CHORO_SCALE.forEach((color, i) => {
      const from = Math.floor(i * step) + 1
      const to = i === CHORO_SCALE.length - 1 ? max : Math.floor((i + 1) * step)
      if (to >= from) {
        buckets.push({ color, label: from === to ? `${from} refus` : `${from} – ${to} refus` })
      }
    })
  }

  return (
    <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3 border-t border-[var(--m-ink-08)] pt-8">
      {buckets.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <span
            className="w-4 h-4 rounded-full shadow-[inset_0_0_0_0.5px_var(--m-ink-12)]"
            style={{ background: item.color }}
          />
          <span className="text-sm text-[var(--m-ink-70)]">{item.label}</span>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Verify** — `npm run build` in `ui/` succeeds.

- [ ] **Step 4: Commit**

```powershell
git add ui/src/components/FranceMap.jsx ui/src/components/MapLegend.jsx
git commit -m "feat(ui): choropleth France map colored by refusal counts"
```

---

### Task 13: HomePage — observatory

**Files:**
- Rewrite: `ui/src/pages/HomePage.jsx`

- [ ] **Step 1: Replace `ui/src/pages/HomePage.jsx`**

```jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import Hero from '../components/Hero'
import FranceMap from '../components/FranceMap'
import MapLegend from '../components/MapLegend'
import { api } from '../lib/api'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function HomePage() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    api('/api/departments').then(setData).catch((e) => setError(e.message))
  }, [])

  const counts = {}
  if (data) for (const d of data.departments) counts[d.code] = d.refusalCount
  const max = Math.max(0, ...Object.values(counts))
  const stats = data?.stats

  return (
    <>
      <Hero
        eyebrow="Observatoire CEE"
        title="Les refus de l'administration,"
        subtitle="département par département"
        description="Melko Energie Conseil cartographie les refus de dossiers CEE notifiés par l'administration. Cliquez sur un département pour le détail des motifs et des opérations concernées."
      >
        <div className="flex justify-center mt-8">
          <a href="#map" className="m-btn">
            Explorer la carte
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </a>
        </div>
      </Hero>

      {error && (
        <div className="max-w-3xl mx-auto px-8 mb-8">
          <div className="m-card p-4 text-sm text-error flex items-center gap-3">
            <span className="material-symbols-outlined">error</span>
            Impossible de charger les données ({error}). Vérifiez que l'API est démarrée (`server/`, port 3001).
          </div>
        </div>
      )}

      {/* Carte */}
      <section id="map" className="py-12 px-8">
        <div className="max-w-5xl mx-auto m-card m-card-hover p-8 lg:p-14">
          <div className="m-stage p-6">
            <FranceMap counts={counts} />
          </div>
          <MapLegend max={max} />
        </div>
      </section>

      {/* Statistiques */}
      <section className="py-12 px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="m-card m-card-hover p-6">
            <div className="font-display text-5xl">{stats ? stats.totalRefusals : '—'}</div>
            <div className="m-label mt-3">Refus recensés</div>
          </div>
          <div className="m-card m-card-hover p-6">
            <div className="font-display text-5xl">{stats ? stats.departmentsAffected : '—'}</div>
            <div className="m-label mt-3">Départements concernés</div>
          </div>
          <div className="m-card m-card-hover p-6">
            <div className="font-display italic text-2xl leading-tight">{stats?.topMotif ?? '—'}</div>
            <div className="m-label mt-3">Motif le plus fréquent</div>
          </div>
        </div>
      </section>

      {/* Derniers refus */}
      <section id="derniers-refus" className="py-12 px-8 pb-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl mb-8">
            Derniers <span className="italic text-[var(--m-foret)]">refus</span> enregistrés
          </h2>
          <div className="space-y-3">
            {(stats?.latestRefusals ?? []).map((r) => (
              <Link
                key={r.id}
                to={`/department/${r.departmentCode}`}
                className="m-card m-card-hover p-5 flex flex-col md:flex-row md:items-center gap-2 md:gap-6 block"
              >
                <span className="m-label shrink-0 w-32">{formatDate(r.date)}</span>
                <span className="font-medium shrink-0 md:w-44">{r.department.name} ({r.departmentCode})</span>
                <span className="font-brand-mono text-xs text-[var(--m-saphir)] shrink-0">{r.typeOperation}</span>
                <span className="text-[var(--m-ink-70)] text-sm">{r.motif}</span>
              </Link>
            ))}
            {stats && stats.latestRefusals.length === 0 && (
              <p className="text-[var(--m-ink-50)] italic">Aucun refus enregistré pour le moment.</p>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 2: Verify visually** — with `server` running (`npm run dev` in `server/`) and `npm run dev` in `ui/`, open http://localhost:5173 : Melko hero, choropleth tinted for seeded departments (31 darkest), stats cards show 5 / 4 / "Pièces justificatives manquantes", latest refusals listed.

- [ ] **Step 3: Commit**

```powershell
git add ui/src/pages/HomePage.jsx
git commit -m "feat(ui): observatory homepage fed by the API"
```

---

### Task 14: DepartmentPage + cleanup of dead components

**Files:**
- Rewrite: `ui/src/pages/DepartmentPage.jsx`
- Rewrite: `ui/src/data/departments.js`
- Delete: `ui/src/components/Sidebar.jsx`, `ui/src/components/StatCard.jsx`, `ui/src/components/ContactCard.jsx`, `ui/src/components/NewsCard.jsx`

- [ ] **Step 1: Replace `ui/src/pages/DepartmentPage.jsx`**

```jsx
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router'
import Hero from '../components/Hero'
import { api } from '../lib/api'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function BreakdownCard({ title, entries }) {
  const sorted = Object.entries(entries).sort((a, b) => b[1] - a[1])
  return (
    <div className="m-card p-6">
      <h3 className="m-label mb-4">{title}</h3>
      {sorted.length === 0 && <p className="text-sm text-[var(--m-ink-50)] italic">Aucune donnée</p>}
      <ul className="space-y-2">
        {sorted.map(([label, count]) => (
          <li key={label} className="flex justify-between items-baseline gap-4 text-sm">
            <span className="text-[var(--m-ink-70)]">{label}</span>
            <span className="font-display text-xl shrink-0">{count}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function DepartmentPage() {
  const { id } = useParams()
  const [dept, setDept] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    setDept(null)
    setError(null)
    api(`/api/departments/${id}`).then(setDept).catch((e) => setError(e))
  }, [id])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center px-8">
        <span className="material-symbols-outlined text-6xl text-[var(--m-ink-30)] mb-4">error</span>
        <h1 className="font-display text-3xl mb-2">
          {error.status === 404 ? 'Département introuvable' : 'Erreur de chargement'}
        </h1>
        <p className="text-[var(--m-ink-70)] mb-8">{error.message}</p>
        <Link to="/" className="m-btn">Retour à la carte</Link>
      </div>
    )
  }

  if (!dept) {
    return <div className="py-32 text-center text-[var(--m-ink-50)]">Chargement…</div>
  }

  const hasContact = dept.contactName || dept.contactAddress || dept.contactPhone || dept.contactEmail

  return (
    <>
      <Hero
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Départements', href: '/' },
          { label: `${dept.name} (${dept.code})` },
        ]}
        eyebrow="Refus CEE"
        title={dept.name}
        subtitle={`${dept.stats.total} refus recensé${dept.stats.total > 1 ? 's' : ''}`}
        description={dept.note || undefined}
      />

      <section className="max-w-5xl mx-auto px-8 pb-24 space-y-12">
        {/* Répartitions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BreakdownCard title="Refus par motif" entries={dept.stats.byMotif} />
          <BreakdownCard title="Refus par type d'opération" entries={dept.stats.byTypeOperation} />
        </div>

        {/* Liste des refus */}
        <div>
          <h2 className="font-display text-3xl mb-6">
            Détail des <span className="italic text-[var(--m-foret)]">refus</span>
          </h2>
          {dept.refusals.length === 0 ? (
            <p className="text-[var(--m-ink-50)] italic">Aucun refus enregistré pour ce département.</p>
          ) : (
            <div className="m-card overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th className="m-label">Date</th>
                    <th className="m-label">Motif</th>
                    <th className="m-label">Type d'opération</th>
                    <th className="m-label">Commentaire</th>
                  </tr>
                </thead>
                <tbody>
                  {dept.refusals.map((r) => (
                    <tr key={r.id}>
                      <td className="whitespace-nowrap">{formatDate(r.date)}</td>
                      <td>{r.motif}</td>
                      <td className="font-brand-mono text-xs text-[var(--m-saphir)]">{r.typeOperation}</td>
                      <td className="text-[var(--m-ink-70)]">{r.commentaire || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Contact + actualités */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hasContact && (
            <div className="m-card p-6">
              <h3 className="m-label mb-4">Contact Melko</h3>
              {dept.contactName && <p className="font-display text-xl mb-2">{dept.contactName}</p>}
              {dept.contactAddress && <p className="text-sm text-[var(--m-ink-70)] whitespace-pre-line mb-2">{dept.contactAddress}</p>}
              {dept.contactPhone && <p className="text-sm font-brand-mono">{dept.contactPhone}</p>}
              {dept.contactEmail && <p className="text-sm font-brand-mono text-[var(--m-saphir)]">{dept.contactEmail}</p>}
            </div>
          )}
          {dept.news.length > 0 && (
            <div className="m-card p-6 space-y-5">
              <h3 className="m-label">Actualités</h3>
              {dept.news.map((n) => (
                <article key={n.id}>
                  <span className="font-brand-mono text-[10px] uppercase tracking-widest text-[var(--m-foret)]">{n.tag}</span>
                  <h4 className="font-display text-lg mt-1">{n.title}</h4>
                  <p className="text-sm text-[var(--m-ink-70)] leading-relaxed">{n.body}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 2: Replace `ui/src/data/departments.js`** (names only — mock data removed)

```js
const DEPARTMENT_NAMES = {
  '01': 'Ain', '02': 'Aisne', '03': 'Allier', '04': 'Alpes-de-Haute-Provence',
  '05': 'Hautes-Alpes', '06': 'Alpes-Maritimes', '07': 'Ardèche', '08': 'Ardennes',
  '09': 'Ariège', '10': 'Aube', '11': 'Aude', '12': 'Aveyron',
  '13': 'Bouches-du-Rhône', '14': 'Calvados', '15': 'Cantal', '16': 'Charente',
  '17': 'Charente-Maritime', '18': 'Cher', '19': 'Corrèze', '2A': 'Corse-du-Sud',
  '2B': 'Haute-Corse', '21': 'Côte-d\'Or', '22': 'Côtes-d\'Armor', '23': 'Creuse',
  '24': 'Dordogne', '25': 'Doubs', '26': 'Drôme', '27': 'Eure',
  '28': 'Eure-et-Loir', '29': 'Finistère', '30': 'Gard', '31': 'Haute-Garonne',
  '32': 'Gers', '33': 'Gironde', '34': 'Hérault', '35': 'Ille-et-Vilaine',
  '36': 'Indre', '37': 'Indre-et-Loire', '38': 'Isère', '39': 'Jura',
  '40': 'Landes', '41': 'Loir-et-Cher', '42': 'Loire', '43': 'Haute-Loire',
  '44': 'Loire-Atlantique', '45': 'Loiret', '46': 'Lot', '47': 'Lot-et-Garonne',
  '48': 'Lozère', '49': 'Maine-et-Loire', '50': 'Manche', '51': 'Marne',
  '52': 'Haute-Marne', '53': 'Mayenne', '54': 'Meurthe-et-Moselle', '55': 'Meuse',
  '56': 'Morbihan', '57': 'Moselle', '58': 'Nièvre', '59': 'Nord',
  '60': 'Oise', '61': 'Orne', '62': 'Pas-de-Calais', '63': 'Puy-de-Dôme',
  '64': 'Pyrénées-Atlantiques', '65': 'Hautes-Pyrénées', '66': 'Pyrénées-Orientales',
  '67': 'Bas-Rhin', '68': 'Haut-Rhin', '69': 'Rhône', '70': 'Haute-Saône',
  '71': 'Saône-et-Loire', '72': 'Sarthe', '73': 'Savoie', '74': 'Haute-Savoie',
  '75': 'Paris', '76': 'Seine-Maritime', '77': 'Seine-et-Marne', '78': 'Yvelines',
  '79': 'Deux-Sèvres', '80': 'Somme', '81': 'Tarn', '82': 'Tarn-et-Garonne',
  '83': 'Var', '84': 'Vaucluse', '85': 'Vendée', '86': 'Vienne',
  '87': 'Haute-Vienne', '88': 'Vosges', '89': 'Yonne', '90': 'Territoire de Belfort',
  '91': 'Essonne', '92': 'Hauts-de-Seine', '93': 'Seine-Saint-Denis',
  '94': 'Val-de-Marne', '95': 'Val-d\'Oise',
  '971': 'Guadeloupe', '972': 'Martinique', '973': 'Guyane',
  '974': 'La Réunion', '976': 'Mayotte',
}

export function getDepartmentName(id) {
  return DEPARTMENT_NAMES[id] || null
}

export { DEPARTMENT_NAMES }
```

- [ ] **Step 3: Delete dead components**

```powershell
git rm ui/src/components/Sidebar.jsx ui/src/components/StatCard.jsx ui/src/components/ContactCard.jsx ui/src/components/NewsCard.jsx
```

- [ ] **Step 4: Verify** — `npm run build` in `ui/` succeeds (proves nothing still imports the deleted files). In the browser, click department 31 on the map → detail page shows 2 refusals from the seed.

- [ ] **Step 5: Commit**

```powershell
git add ui/src/pages/DepartmentPage.jsx ui/src/data/departments.js
git commit -m "feat(ui): department detail page from API; drop mock data and dead components"
```

---

### Task 15: Admin layout + login + routes

**Files:**
- Create: `ui/src/pages/admin/AdminLayout.jsx`
- Create: `ui/src/pages/admin/LoginPage.jsx`
- Create: `ui/src/pages/admin/DashboardPage.jsx` (placeholder, filled in Task 16)
- Create: `ui/src/pages/admin/RefusalsPage.jsx` (placeholder, filled in Task 17)
- Create: `ui/src/pages/admin/DepartmentsAdminPage.jsx` (placeholder, filled in Task 18)
- Modify: `ui/src/router.jsx`

- [ ] **Step 1: Create `ui/src/pages/admin/AdminLayout.jsx`**

```jsx
import { useEffect, useState } from 'react'
import { Outlet, NavLink, Link, useNavigate } from 'react-router'
import { api } from '../../lib/api'

const NAV = [
  { to: '/admin', label: 'Tableau de bord', end: true },
  { to: '/admin/refusals', label: 'Refus' },
  { to: '/admin/departments', label: 'Départements' },
]

export default function AdminLayout() {
  const [admin, setAdmin] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    api('/api/auth/me')
      .then(setAdmin)
      .catch(() => navigate('/admin/login', { replace: true }))
  }, [navigate])

  async function logout() {
    await api('/api/auth/logout', { method: 'POST' })
    navigate('/admin/login')
  }

  if (!admin) {
    return <div className="min-h-screen flex items-center justify-center text-[var(--m-ink-50)]">Chargement…</div>
  }

  return (
    <div className="min-h-screen relative z-[1]">
      <header className="border-b border-[var(--m-ink-08)] bg-[#FAF8F4]/85 glass-nav sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[var(--m-foret)]" aria-hidden="true" />
              <span className="font-display text-lg">
                Melko <span className="italic text-[var(--m-foret)]">Admin</span>
              </span>
            </Link>
            <nav className="flex items-center gap-5">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors ${
                      isActive ? 'text-[var(--m-foret)]' : 'text-[var(--m-ink-70)] hover:text-[var(--m-encre)]'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-brand-mono text-xs text-[var(--m-ink-50)] hidden sm:inline">{admin.email}</span>
            <button onClick={logout} className="m-btn text-xs !py-1.5 !px-4">Déconnexion</button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-8 py-10">
        <Outlet />
      </main>
    </div>
  )
}
```

- [ ] **Step 2: Create `ui/src/pages/admin/LoginPage.jsx`**

```jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { api } from '../../lib/api'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await api('/api/auth/login', { method: 'POST', body: { email, password } })
      navigate('/admin')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-8 relative z-[1]">
      <div className="m-card p-10 w-full max-w-sm">
        <Link to="/" className="flex items-center gap-3 justify-center mb-8">
          <span className="w-7 h-7 rounded-full bg-[var(--m-foret)]" aria-hidden="true" />
          <span className="font-display text-2xl">
            Melko <span className="italic text-[var(--m-foret)]">Energie</span>
          </span>
        </Link>
        <div className="m-label text-center mb-8">Espace Administration</div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="m-label block mb-2" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full bg-[var(--m-papier)]"
            />
          </div>
          <div>
            <label className="m-label block mb-2" htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full bg-[var(--m-papier)]"
            />
          </div>
          {error && <p className="text-error text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="m-btn m-btn-foret w-full justify-center">
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create the three placeholder pages** (replaced by Tasks 16–18)

`ui/src/pages/admin/DashboardPage.jsx`:
```jsx
export default function DashboardPage() {
  return <h1 className="font-display text-3xl">Tableau de bord</h1>
}
```

`ui/src/pages/admin/RefusalsPage.jsx`:
```jsx
export default function RefusalsPage() {
  return <h1 className="font-display text-3xl">Refus</h1>
}
```

`ui/src/pages/admin/DepartmentsAdminPage.jsx`:
```jsx
export default function DepartmentsAdminPage() {
  return <h1 className="font-display text-3xl">Départements</h1>
}
```

- [ ] **Step 4: Replace `ui/src/router.jsx`**

```jsx
import { createBrowserRouter } from 'react-router'
import App from './App'
import HomePage from './pages/HomePage'
import DepartmentPage from './pages/DepartmentPage'
import AdminLayout from './pages/admin/AdminLayout'
import LoginPage from './pages/admin/LoginPage'
import DashboardPage from './pages/admin/DashboardPage'
import RefusalsPage from './pages/admin/RefusalsPage'
import DepartmentsAdminPage from './pages/admin/DepartmentsAdminPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'department/:id', element: <DepartmentPage /> },
    ],
  },
  { path: '/admin/login', element: <LoginPage /> },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'refusals', element: <RefusalsPage /> },
      { path: 'departments', element: <DepartmentsAdminPage /> },
    ],
  },
])

export default router
```

- [ ] **Step 5: Verify manually** — with both servers running: `/admin` redirects to `/admin/login`; wrong password shows "Identifiants incorrects"; correct credentials (from `server/.env`) land on the dashboard placeholder; Déconnexion returns to login.

- [ ] **Step 6: Commit**

```powershell
git add ui/src/pages/admin ui/src/router.jsx
git commit -m "feat(ui): admin layout, login page and guarded routes"
```

---

### Task 16: Admin dashboard

**Files:**
- Rewrite: `ui/src/pages/admin/DashboardPage.jsx`

- [ ] **Step 1: Replace `ui/src/pages/admin/DashboardPage.jsx`**

```jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { api } from '../../lib/api'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    api('/api/departments').then(setData).catch((e) => setError(e.message))
  }, [])

  const stats = data?.stats

  return (
    <div className="space-y-10">
      <div>
        <div className="m-label mb-2">Tableau de bord</div>
        <h1 className="font-display text-4xl">
          Observatoire des <span className="italic text-[var(--m-foret)]">refus</span>
        </h1>
      </div>

      {error && <p className="text-error text-sm">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="m-card p-6">
          <div className="font-display text-5xl">{stats ? stats.totalRefusals : '—'}</div>
          <div className="m-label mt-3">Refus recensés</div>
        </div>
        <div className="m-card p-6">
          <div className="font-display text-5xl">{stats ? stats.departmentsAffected : '—'}</div>
          <div className="m-label mt-3">Départements concernés</div>
        </div>
        <div className="m-card p-6">
          <div className="font-display italic text-2xl leading-tight">{stats?.topMotif ?? '—'}</div>
          <div className="m-label mt-3">Motif le plus fréquent</div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl">Derniers refus</h2>
          <Link to="/admin/refusals" className="m-btn text-xs !py-1.5 !px-4">Gérer les refus</Link>
        </div>
        <div className="m-card overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="m-label">Date</th>
                <th className="m-label">Département</th>
                <th className="m-label">Type d'opération</th>
                <th className="m-label">Motif</th>
              </tr>
            </thead>
            <tbody>
              {(stats?.latestRefusals ?? []).map((r) => (
                <tr key={r.id}>
                  <td className="whitespace-nowrap">{formatDate(r.date)}</td>
                  <td>{r.department.name} ({r.departmentCode})</td>
                  <td className="font-brand-mono text-xs text-[var(--m-saphir)]">{r.typeOperation}</td>
                  <td>{r.motif}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify** — log in to `/admin`: stat cards + latest refusals table render with seed data.

- [ ] **Step 3: Commit**

```powershell
git add ui/src/pages/admin/DashboardPage.jsx
git commit -m "feat(ui): admin dashboard with global stats"
```

---

### Task 17: Admin refusals CRUD page

**Files:**
- Rewrite: `ui/src/pages/admin/RefusalsPage.jsx`

- [ ] **Step 1: Replace `ui/src/pages/admin/RefusalsPage.jsx`**

```jsx
import { useCallback, useEffect, useState } from 'react'
import { api } from '../../lib/api'

const EMPTY_FORM = { departmentCode: '', date: '', motif: '', typeOperation: '', commentaire: '' }

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function toInputDate(iso) {
  return new Date(iso).toISOString().slice(0, 10)
}

export default function RefusalsPage() {
  const [departments, setDepartments] = useState([])
  const [list, setList] = useState({ items: [], total: 0, page: 1, pageSize: 20 })
  const [filterDept, setFilterDept] = useState('')
  const [filterMotif, setFilterMotif] = useState('')
  const [page, setPage] = useState(1)
  const [error, setError] = useState(null)

  // null = modal fermé ; { id?, ...form } = création ou édition
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState(null)

  useEffect(() => {
    api('/api/departments').then((d) => setDepartments(d.departments)).catch((e) => setError(e.message))
  }, [])

  const load = useCallback(() => {
    const params = new URLSearchParams()
    if (filterDept) params.set('department', filterDept)
    if (filterMotif) params.set('motif', filterMotif)
    params.set('page', String(page))
    api(`/api/refusals?${params}`).then(setList).catch((e) => setError(e.message))
  }, [filterDept, filterMotif, page])

  useEffect(() => {
    load()
  }, [load])

  function openCreate() {
    setFormError(null)
    setEditing({ ...EMPTY_FORM, date: new Date().toISOString().slice(0, 10) })
  }

  function openEdit(r) {
    setFormError(null)
    setEditing({
      id: r.id,
      departmentCode: r.departmentCode,
      date: toInputDate(r.date),
      motif: r.motif,
      typeOperation: r.typeOperation,
      commentaire: r.commentaire || '',
    })
  }

  async function save(e) {
    e.preventDefault()
    setSaving(true)
    setFormError(null)
    const body = {
      departmentCode: editing.departmentCode,
      date: editing.date,
      motif: editing.motif,
      typeOperation: editing.typeOperation,
      commentaire: editing.commentaire || null,
    }
    try {
      if (editing.id) {
        await api(`/api/refusals/${editing.id}`, { method: 'PUT', body })
      } else {
        await api('/api/refusals', { method: 'POST', body })
      }
      setEditing(null)
      load()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function remove(r) {
    if (!window.confirm(`Supprimer le refus du ${formatDate(r.date)} (${r.department.name}) ?`)) return
    try {
      await api(`/api/refusals/${r.id}`, { method: 'DELETE' })
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  const totalPages = Math.max(1, Math.ceil(list.total / list.pageSize))

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="m-label mb-2">Gestion</div>
          <h1 className="font-display text-4xl">
            Les <span className="italic text-[var(--m-foret)]">refus</span>
          </h1>
        </div>
        <button onClick={openCreate} className="m-btn m-btn-foret">
          <span className="material-symbols-outlined text-base">add</span>
          Ajouter un refus
        </button>
      </div>

      {error && <p className="text-error text-sm">{error}</p>}

      {/* Filtres */}
      <div className="flex flex-wrap gap-3">
        <select
          value={filterDept}
          onChange={(e) => { setPage(1); setFilterDept(e.target.value) }}
          className="select select-bordered bg-[var(--m-papier)]"
        >
          <option value="">Tous les départements</option>
          {departments.map((d) => (
            <option key={d.code} value={d.code}>{d.code} — {d.name}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Filtrer par motif…"
          value={filterMotif}
          onChange={(e) => { setPage(1); setFilterMotif(e.target.value) }}
          className="input input-bordered bg-[var(--m-papier)] w-64"
        />
      </div>

      {/* Tableau */}
      <div className="m-card overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th className="m-label">Date</th>
              <th className="m-label">Département</th>
              <th className="m-label">Motif</th>
              <th className="m-label">Type d'opération</th>
              <th className="m-label">Commentaire</th>
              <th className="m-label text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.items.map((r) => (
              <tr key={r.id}>
                <td className="whitespace-nowrap">{formatDate(r.date)}</td>
                <td className="whitespace-nowrap">{r.department.name} ({r.departmentCode})</td>
                <td>{r.motif}</td>
                <td className="font-brand-mono text-xs text-[var(--m-saphir)]">{r.typeOperation}</td>
                <td className="text-[var(--m-ink-70)] max-w-xs truncate">{r.commentaire || '—'}</td>
                <td className="text-right whitespace-nowrap">
                  <button onClick={() => openEdit(r)} className="btn btn-ghost btn-xs" title="Modifier">
                    <span className="material-symbols-outlined text-base">edit</span>
                  </button>
                  <button onClick={() => remove(r)} className="btn btn-ghost btn-xs text-error" title="Supprimer">
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </td>
              </tr>
            ))}
            {list.items.length === 0 && (
              <tr><td colSpan="6" className="text-center text-[var(--m-ink-50)] italic py-8">Aucun refus</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="btn btn-ghost btn-sm">←</button>
          <span className="font-brand-mono text-xs">{page} / {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="btn btn-ghost btn-sm">→</button>
        </div>
      )}

      {/* Modal création / édition */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--m-ink-50)] p-4">
          <form onSubmit={save} className="m-card !bg-[var(--m-papier)] p-8 w-full max-w-lg space-y-4">
            <h2 className="font-display text-2xl mb-2">
              {editing.id ? 'Modifier le refus' : 'Nouveau refus'}
            </h2>
            <div>
              <label className="m-label block mb-2" htmlFor="f-dept">Département</label>
              <select
                id="f-dept"
                required
                value={editing.departmentCode}
                onChange={(e) => setEditing({ ...editing, departmentCode: e.target.value })}
                className="select select-bordered w-full bg-[var(--m-papier)]"
              >
                <option value="" disabled>Choisir…</option>
                {departments.map((d) => (
                  <option key={d.code} value={d.code}>{d.code} — {d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="m-label block mb-2" htmlFor="f-date">Date du refus</label>
              <input
                id="f-date"
                type="date"
                required
                value={editing.date}
                onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                className="input input-bordered w-full bg-[var(--m-papier)]"
              />
            </div>
            <div>
              <label className="m-label block mb-2" htmlFor="f-motif">Motif du refus</label>
              <input
                id="f-motif"
                type="text"
                required
                value={editing.motif}
                onChange={(e) => setEditing({ ...editing, motif: e.target.value })}
                className="input input-bordered w-full bg-[var(--m-papier)]"
              />
            </div>
            <div>
              <label className="m-label block mb-2" htmlFor="f-type">Type d'opération</label>
              <input
                id="f-type"
                type="text"
                required
                placeholder="ex : BAR-TH-171"
                value={editing.typeOperation}
                onChange={(e) => setEditing({ ...editing, typeOperation: e.target.value })}
                className="input input-bordered w-full bg-[var(--m-papier)]"
              />
            </div>
            <div>
              <label className="m-label block mb-2" htmlFor="f-comment">Commentaire (optionnel)</label>
              <textarea
                id="f-comment"
                rows="3"
                value={editing.commentaire}
                onChange={(e) => setEditing({ ...editing, commentaire: e.target.value })}
                className="textarea textarea-bordered w-full bg-[var(--m-papier)]"
              />
            </div>
            {formError && <p className="text-error text-sm">{formError}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setEditing(null)} className="btn btn-ghost">Annuler</button>
              <button type="submit" disabled={saving} className="m-btn m-btn-foret">
                {saving ? 'Enregistrement…' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify manually** — `/admin/refusals`: seed refusals listed; create one (pick a department, today's date, a motif, a type) → appears in table AND department's count increases on the public map after reload; edit it; filter by department; delete it with confirmation.

- [ ] **Step 3: Commit**

```powershell
git add ui/src/pages/admin/RefusalsPage.jsx
git commit -m "feat(ui): admin refusals CRUD with filters, pagination and modal form"
```

---

### Task 18: Admin departments page (info + news)

**Files:**
- Rewrite: `ui/src/pages/admin/DepartmentsAdminPage.jsx`

- [ ] **Step 1: Replace `ui/src/pages/admin/DepartmentsAdminPage.jsx`**

```jsx
import { useEffect, useState } from 'react'
import { api } from '../../lib/api'

const EMPTY_NEWS = { tag: '', title: '', body: '' }

export default function DepartmentsAdminPage() {
  const [departments, setDepartments] = useState([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null) // detail of selected department
  const [error, setError] = useState(null)

  const [info, setInfo] = useState(null) // form note + contact
  const [savingInfo, setSavingInfo] = useState(false)
  const [infoSaved, setInfoSaved] = useState(false)

  const [newsForm, setNewsForm] = useState(null) // null | { id?, tag, title, body }
  const [savingNews, setSavingNews] = useState(false)

  useEffect(() => {
    api('/api/departments').then((d) => setDepartments(d.departments)).catch((e) => setError(e.message))
  }, [])

  async function select(code) {
    setError(null)
    setNewsForm(null)
    setInfoSaved(false)
    try {
      const detail = await api(`/api/departments/${code}`)
      setSelected(detail)
      setInfo({
        note: detail.note || '',
        contactName: detail.contactName || '',
        contactAddress: detail.contactAddress || '',
        contactPhone: detail.contactPhone || '',
        contactEmail: detail.contactEmail || '',
      })
    } catch (e) {
      setError(e.message)
    }
  }

  async function saveInfo(e) {
    e.preventDefault()
    setSavingInfo(true)
    setInfoSaved(false)
    try {
      await api(`/api/departments/${selected.code}`, {
        method: 'PUT',
        body: {
          note: info.note || null,
          contactName: info.contactName || null,
          contactAddress: info.contactAddress || null,
          contactPhone: info.contactPhone || null,
          contactEmail: info.contactEmail || null,
        },
      })
      setInfoSaved(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSavingInfo(false)
    }
  }

  async function saveNews(e) {
    e.preventDefault()
    setSavingNews(true)
    try {
      const body = { departmentCode: selected.code, tag: newsForm.tag, title: newsForm.title, body: newsForm.body }
      if (newsForm.id) {
        await api(`/api/news/${newsForm.id}`, { method: 'PUT', body })
      } else {
        await api('/api/news', { method: 'POST', body })
      }
      setNewsForm(null)
      select(selected.code)
    } catch (err) {
      setError(err.message)
    } finally {
      setSavingNews(false)
    }
  }

  async function removeNews(n) {
    if (!window.confirm(`Supprimer l'actualité « ${n.title} » ?`)) return
    try {
      await api(`/api/news/${n.id}`, { method: 'DELETE' })
      select(selected.code)
    } catch (err) {
      setError(err.message)
    }
  }

  const filtered = departments.filter(
    (d) => d.name.toLowerCase().includes(search.toLowerCase()) || d.code.startsWith(search)
  )

  return (
    <div className="space-y-8">
      <div>
        <div className="m-label mb-2">Gestion</div>
        <h1 className="font-display text-4xl">
          Les <span className="italic text-[var(--m-foret)]">départements</span>
        </h1>
      </div>

      {error && <p className="text-error text-sm">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Liste */}
        <div className="m-card p-4 space-y-2 lg:sticky lg:top-24">
          <input
            type="text"
            placeholder="Rechercher…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-bordered input-sm w-full bg-[var(--m-papier)]"
          />
          <ul className="max-h-[60vh] overflow-y-auto divide-y divide-[var(--m-ink-08)]">
            {filtered.map((d) => (
              <li key={d.code}>
                <button
                  onClick={() => select(d.code)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors flex justify-between items-center ${
                    selected?.code === d.code
                      ? 'bg-[var(--m-foret)] text-[var(--m-papier)]'
                      : 'hover:bg-[var(--m-ink-05)]'
                  }`}
                >
                  <span>{d.code} — {d.name}</span>
                  {d.refusalCount > 0 && (
                    <span className="font-brand-mono text-xs opacity-70">{d.refusalCount}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Éditeur */}
        <div className="lg:col-span-2 space-y-6">
          {!selected && (
            <div className="m-card p-10 text-center text-[var(--m-ink-50)] italic">
              Sélectionnez un département pour modifier ses informations.
            </div>
          )}

          {selected && info && (
            <>
              <form onSubmit={saveInfo} className="m-card p-6 space-y-4">
                <h2 className="font-display text-2xl">
                  {selected.name} <span className="italic text-[var(--m-foret)]">({selected.code})</span>
                </h2>
                <div>
                  <label className="m-label block mb-2" htmlFor="d-note">Note (affichée sur la page publique)</label>
                  <textarea
                    id="d-note"
                    rows="3"
                    value={info.note}
                    onChange={(e) => setInfo({ ...info, note: e.target.value })}
                    className="textarea textarea-bordered w-full bg-[var(--m-papier)]"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="m-label block mb-2" htmlFor="d-cname">Nom du contact</label>
                    <input id="d-cname" type="text" value={info.contactName}
                      onChange={(e) => setInfo({ ...info, contactName: e.target.value })}
                      className="input input-bordered w-full bg-[var(--m-papier)]" />
                  </div>
                  <div>
                    <label className="m-label block mb-2" htmlFor="d-cphone">Téléphone</label>
                    <input id="d-cphone" type="text" value={info.contactPhone}
                      onChange={(e) => setInfo({ ...info, contactPhone: e.target.value })}
                      className="input input-bordered w-full bg-[var(--m-papier)]" />
                  </div>
                  <div>
                    <label className="m-label block mb-2" htmlFor="d-cmail">Email</label>
                    <input id="d-cmail" type="email" value={info.contactEmail}
                      onChange={(e) => setInfo({ ...info, contactEmail: e.target.value })}
                      className="input input-bordered w-full bg-[var(--m-papier)]" />
                  </div>
                  <div>
                    <label className="m-label block mb-2" htmlFor="d-caddr">Adresse</label>
                    <input id="d-caddr" type="text" value={info.contactAddress}
                      onChange={(e) => setInfo({ ...info, contactAddress: e.target.value })}
                      className="input input-bordered w-full bg-[var(--m-papier)]" />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-4">
                  {infoSaved && <span className="text-sm text-[var(--m-foret)]">Enregistré ✓</span>}
                  <button type="submit" disabled={savingInfo} className="m-btn m-btn-foret">
                    {savingInfo ? 'Enregistrement…' : 'Enregistrer'}
                  </button>
                </div>
              </form>

              {/* Actualités */}
              <div className="m-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl">Actualités</h3>
                  {!newsForm && (
                    <button onClick={() => setNewsForm({ ...EMPTY_NEWS })} className="m-btn text-xs !py-1.5 !px-4">
                      Ajouter
                    </button>
                  )}
                </div>

                {newsForm && (
                  <form onSubmit={saveNews} className="m-stage p-4 space-y-3">
                    <input
                      type="text" required placeholder="Tag (ex : Réglementation)"
                      value={newsForm.tag}
                      onChange={(e) => setNewsForm({ ...newsForm, tag: e.target.value })}
                      className="input input-bordered input-sm w-full bg-[var(--m-papier)]"
                    />
                    <input
                      type="text" required placeholder="Titre"
                      value={newsForm.title}
                      onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                      className="input input-bordered input-sm w-full bg-[var(--m-papier)]"
                    />
                    <textarea
                      required rows="3" placeholder="Contenu"
                      value={newsForm.body}
                      onChange={(e) => setNewsForm({ ...newsForm, body: e.target.value })}
                      className="textarea textarea-bordered w-full bg-[var(--m-papier)]"
                    />
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => setNewsForm(null)} className="btn btn-ghost btn-sm">Annuler</button>
                      <button type="submit" disabled={savingNews} className="m-btn text-xs !py-1.5 !px-4">
                        {savingNews ? '…' : 'Enregistrer'}
                      </button>
                    </div>
                  </form>
                )}

                {selected.news.length === 0 && !newsForm && (
                  <p className="text-sm text-[var(--m-ink-50)] italic">Aucune actualité.</p>
                )}
                <ul className="space-y-3">
                  {selected.news.map((n) => (
                    <li key={n.id} className="flex items-start justify-between gap-4">
                      <div>
                        <span className="font-brand-mono text-[10px] uppercase tracking-widest text-[var(--m-foret)]">{n.tag}</span>
                        <p className="font-medium">{n.title}</p>
                        <p className="text-sm text-[var(--m-ink-70)]">{n.body}</p>
                      </div>
                      <div className="shrink-0">
                        <button
                          onClick={() => setNewsForm({ id: n.id, tag: n.tag, title: n.title, body: n.body })}
                          className="btn btn-ghost btn-xs" title="Modifier"
                        >
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button onClick={() => removeNews(n)} className="btn btn-ghost btn-xs text-error" title="Supprimer">
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify manually** — `/admin/departments`: search "haute-g", select 31, set a note + contact, save → "Enregistré ✓"; add a news item; check the public page `/department/31` shows note, contact and news; edit + delete the news item.

- [ ] **Step 3: Commit**

```powershell
git add ui/src/pages/admin/DepartmentsAdminPage.jsx
git commit -m "feat(ui): admin department editor (note, contact, news CRUD)"
```

---

### Task 19: Final verification

- [ ] **Step 1: API tests** — in `server/`: `npm test` → all green.

- [ ] **Step 2: Frontend build & lint** — in `ui/`: `npm run build` and `npm run lint` → both pass (fix any straggler lint issues, e.g. unused imports left over from rewrites).

- [ ] **Step 3: End-to-end manual checklist** (both dev servers running):
  1. `/` — Melko theme everywhere (papier bg, serif headlines, paper grain), choropleth tinted, legend correct
  2. Click a tinted department → detail page with refusals
  3. Click an untinted department → "Aucun refus enregistré"
  4. Unknown URL `/department/XX` → "Département introuvable"
  5. `/admin` logged out → redirected to login; bad credentials → error; good credentials → dashboard
  6. Create / edit / delete a refusal; verify the map color updates after reload
  7. Edit department info + news; verify on the public department page
  8. Logout → `/admin` redirects to login again
  9. Stop the API → homepage shows the error banner instead of crashing

- [ ] **Step 4: Commit any final fixes**

```powershell
git add -A
git commit -m "chore: final fixes after end-to-end verification"
```
