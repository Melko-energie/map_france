# Melko Energie · Observatoire des refus CEE

Cartographie interactive des refus de dossiers CEE (Certificats d'Économies d'Énergie) notifiés par l'administration, département par département. Le site public présente une carte choroplèthe de la France ; un espace d'administration permet de gérer les refus, les informations départementales et les actualités.

> Identité visuelle : ADN de marque **Melko Energie Conseil** — palette Forêt `#3F8A3D` / Saphir `#1B5F8C` / Encre `#0E1A24` / Papier `#FAF8F4`, typographies Instrument Serif · Inter · JetBrains Mono.

## Fonctionnalités

**Site public**
- Carte de France choroplèthe : chaque département est teinté selon son nombre de refus (survol Saphir, clic → page détail) ; les départements d'outre-mer (971–976) sont listés sous la carte
- Statistiques globales : refus recensés, départements concernés, motif le plus fréquent, derniers refus enregistrés
- Page département : répartition des refus par motif et par type d'opération, liste détaillée, contact Melko et actualités

**Espace admin (`/admin`)**
- Connexion sécurisée (compte unique, cookie JWT httpOnly)
- Tableau de bord : indicateurs + derniers refus
- Gestion des refus : table filtrable (département, motif), pagination, création/édition par formulaire modal, suppression avec confirmation
- Gestion des départements : note publique, bloc contact, actualités (CRUD)

## Stack technique

| Couche | Technologies |
|---|---|
| Frontend | React 19 · Vite 8 · React Router 7 · Tailwind CSS 4 · DaisyUI 5 |
| Backend | Node.js · Express 5 · Prisma 6 · SQLite |
| Auth | JWT (cookie httpOnly, SameSite=Lax) · bcryptjs |
| Validation | zod |
| Tests | Vitest · Supertest (33 tests d'intégration API) |

## Structure du projet

```
map_france/
├── server/                  # API Express + Prisma (port 3001)
│   ├── prisma/              # schema.prisma, migrations, seed.js, dev.db (gitignoré)
│   ├── src/
│   │   ├── app.js           # app Express (testable, sans listen)
│   │   ├── index.js         # point d'entrée
│   │   ├── auth.js          # JWT + middleware requireAdmin
│   │   └── routes/          # auth, departments, refusals, news
│   └── tests/               # tests d'intégration (base SQLite séparée)
└── ui/                      # SPA React (port 5173, proxy /api → 3001)
    └── src/
        ├── components/      # Header, Footer, Hero, FranceMap, MapLegend
        ├── pages/           # HomePage, DepartmentPage
        ├── pages/admin/     # Login, Layout, Dashboard, Refusals, Departments
        ├── lib/             # client API, échelle choroplèthe
        └── data/            # noms des départements, tracés SVG
```

## Démarrage rapide

Prérequis : **Node.js ≥ 20.6** (utilisation de `node --env-file`).

### 1. API

```powershell
cd server
npm install
copy .env.example .env       # puis éditer JWT_SECRET / ADMIN_EMAIL / ADMIN_PASSWORD
npx prisma migrate dev       # crée prisma/dev.db
npm run seed                 # 101 départements + compte admin + refus d'exemple
npm run dev                  # http://localhost:3001
```

### 2. Frontend

```powershell
cd ui
npm install
npm run dev                  # http://localhost:5173 (proxy /api vers :3001)
```

Espace admin : `http://localhost:5173/admin` — identifiants définis dans `server/.env`.

## Variables d'environnement (`server/.env`)

| Variable | Description |
|---|---|
| `DATABASE_URL` | `file:./dev.db` (SQLite, relatif à `prisma/schema.prisma`) |
| `JWT_SECRET` | Secret de signature des jetons — **obligatoire**, longue chaîne aléatoire |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Compte admin créé par `npm run seed` |
| `PORT` | Port de l'API (défaut `3001`) |

## API

| Méthode & route | Accès | Description |
|---|---|---|
| `GET /api/departments` | public | Départements + nombre de refus + stats globales (carte) |
| `GET /api/departments/:code` | public | Détail : refus, stats par motif/type, contact, actualités |
| `PUT /api/departments/:code` | admin | Mise à jour note + contact (sémantique PATCH : `null` efface) |
| `GET/POST /api/refusals` · `PUT/DELETE /api/refusals/:id` | admin | CRUD refus (filtres `department`, `motif`, pagination `page`) |
| `POST /api/news` · `PUT/DELETE /api/news/:id` | admin | CRUD actualités |
| `POST /api/auth/login` · `POST /api/auth/logout` · `GET /api/auth/me` | — | Session admin |

Erreurs au format `{ "error": "…" }` avec les codes 400/401/404 appropriés.

## Tests

```powershell
cd server
npm test        # 33 tests (auth, departments, refusals, news) sur une base de test isolée
```

```powershell
cd ui
npm run lint
npm run build
```

## Notes de déploiement

- Le proxy Vite n'existe qu'en développement. En production, servir `ui/dist` depuis Express (le modèle cookie same-origin reste valable) **ou** héberger séparément en ajoutant CORS (`credentials: true`) et un cookie `SameSite=None; Secure`.
- Le cookie d'auth n'est `Secure` que si `NODE_ENV=production` — derrière un proxy TLS, penser à `app.set('trust proxy', 1)`.
- SQLite convient à ce volume ; Prisma permet de migrer vers PostgreSQL en changeant le `datasource` et `DATABASE_URL`.
