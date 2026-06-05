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
