# Melko Rebrand + Backend + Admin Space — Design Spec

## Overview

Transform the existing frontend-only "Administration Fiscale" map portal into the **Melko Energie Conseil — Observatoire des refus CEE par département**:

1. **Full Melko rebrand** of the public site (theme + content) per the brand DNA (`ui/melko-brand-dna (1).html`)
2. **Backend** in `server/` (currently empty): Node + Express + Prisma + SQLite
3. **Admin space** at `/admin/*` inside the existing React app, protected by a single admin login, with CRUD on refusals, department info, and news

## Architecture

Single SPA (existing `ui/` Vite app) + Express API (`server/`).

- API listens on `:3001`; Vite dev server proxies `/api` → `:3001` (no CORS config needed)
- SQLite database file lives in `server/` (gitignored); Prisma is the ORM
- Auth: JWT in an httpOnly cookie; one admin account seeded from `.env`

## Data Model (Prisma schema)

```prisma
model Department {
  code           String    @id            // "01".."95", "2A", "2B", "971".."976"
  name           String
  note           String?                  // free-text commentary shown on dept page
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
  date           DateTime                 // date du refus
  motif          String                   // motif du refus
  typeOperation  String                   // type d'opération (ex: BAR-TH-171)
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

**Seeding:**
- All 101 departments seeded from the existing `DEPARTMENT_NAMES` list in `ui/src/data/departments.js`
- Admin user created from `ADMIN_EMAIL` / `ADMIN_PASSWORD` env vars (bcrypt-hashed) if absent
- A handful of sample refusals so the map isn't empty on first run

## API (Express)

| Method & Route | Auth | Purpose |
|---|---|---|
| `GET /api/departments` | public | All departments with `refusalCount` (feeds the choropleth) |
| `GET /api/departments/:code` | public | Department detail: info + refusals + news + computed stats |
| `PUT /api/departments/:code` | admin | Update note + contact block |
| `GET /api/refusals?department=&motif=&page=` | admin | Paginated, filterable list |
| `POST /api/refusals` | admin | Create refusal |
| `PUT /api/refusals/:id` | admin | Update refusal |
| `DELETE /api/refusals/:id` | admin | Delete refusal |
| `POST /api/news` / `PUT /api/news/:id` / `DELETE /api/news/:id` | admin | CRUD news |
| `POST /api/auth/login` | — | Sets httpOnly JWT cookie |
| `POST /api/auth/logout` | — | Clears cookie |
| `GET /api/auth/me` | — | Returns admin identity or 401 |

- Request validation with **zod**; invalid input → `400 { error }`
- Auth middleware verifies the JWT cookie; unauthorized → `401 { error }`
- Unknown department code → `404 { error }`

## Public Site (Melko rebrand)

### Theme (from brand DNA)

| Token | Value |
|---|---|
| Forêt (primary) | `#3F8A3D` (dark `#2A5C29`, light `#6FA86D`) |
| Saphir (secondary) | `#1B5F8C` (dark `#0E3D5C`, light `#4E83AB`) |
| Encre (content) | `#0E1A24` (+ ink opacity ramp 90/70/50/30/12/08/05/02) |
| Papier (base) | `#FAF8F4` |
| Display font | Instrument Serif (italic for accents) |
| Body font | Inter |
| Mono font | JetBrains Mono (labels, data, uppercase micro-labels) |

Visual language: paper-grain SVG noise overlay, cards with 18px radius + inset 0.5px hairline (`ink-08`), hover = Forêt hairline + slight lift, pill buttons (Encre bg → Forêt-dark hover), serif italic headline accents.

Replaces the DaisyUI "statelier" theme and all `--surface-*` Material tokens in `ui/src/index.css`. Google Fonts import switches to Instrument Serif + Inter + JetBrains Mono. Material Symbols icons may remain for utility icons.

### Content

- **Header:** Melko logo (green dot + serif wordmark "Melko Energie · Conseil"), nav: Carte, Départements, (right) Espace Admin link
- **HomePage:**
  - Hero: "Observatoire des refus CEE par département" + subline, Melko styling
  - Map section: France SVG becomes a **choropleth** — fill scale in Forêt tints by refusal count (0 = paper/neutral), Saphir on hover; legend shows count ranges; data from `GET /api/departments`
  - Below map: aggregate stats (total refusals, departments affected, top motif) + latest refusals list (replaces the old fiscal news bento)
- **DepartmentPage:** per department —
  - Computed stats: total refusals, breakdown by motif, breakdown by type d'opération
  - Refusal list: date, motif, type d'opération, commentaire
  - Department note + contact block (if set)
  - News items (if any)
  - Data from `GET /api/departments/:code`
- **Footer:** Melko branding + headline "L'énergie au cœur des plus beaux projets — conseil CEE pour le tertiaire premium."
- The old mock data file `ui/src/data/departments.js` shrinks to the name list only (used by the map tooltip and seeds); all stats/contacts/news mock data is removed.

## Admin Space (`/admin/*`)

Same React app, same Melko theme.

| Route | Content |
|---|---|
| `/admin/login` | Email + password form; error display; redirects to `/admin` on success |
| `/admin` | Dashboard: total refusals, refusals this month, departments affected, recent refusals table |
| `/admin/refusals` | Full table (date, département, motif, type d'opération, commentaire) with department + motif filters and pagination; "Ajouter" button + edit/delete per row; create/edit via modal form (département select, date picker, motif, type d'opération, commentaire) with delete confirmation |
| `/admin/departments` | Department list with search; selecting one opens an editor for note + contact block, and management of that department's news items (add/edit/delete) |

- **Route guard:** layout component calls `GET /api/auth/me`; unauthenticated → redirect to `/admin/login`
- Logout button in admin header

## Error Handling

- API: zod validation errors → 400; missing auth → 401; missing resources → 404; all errors `{ error: string }`
- Frontend: fetch failures show inline error states (public pages degrade gracefully if API is down — map renders neutral with an error banner)

## Testing

- **API integration tests** (Vitest + supertest, separate test SQLite DB): auth flow (login/me/logout, wrong password), refusals CRUD incl. validation failures and auth rejection, departments endpoints with computed counts
- Frontend remains without tests (consistent with current project state)

## Dev Workflow

- `server/`: `npm install`, `npx prisma migrate dev`, `npm run seed`, `npm run dev` (port 3001)
- `ui/`: `npm run dev` (Vite, proxies `/api`)
- `server/.env`: `DATABASE_URL`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`
- `server/.env.example` committed; `.env` and `*.db` gitignored
