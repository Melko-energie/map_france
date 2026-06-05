import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

// Doit correspondre à test.env.DATABASE_URL dans vitest.config.js
export const TEST_DB_URL = 'file:./test.db'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default function setup() {
  execSync('npx prisma db push --force-reset --skip-generate', {
    env: {
      ...process.env,
      DATABASE_URL: TEST_DB_URL,
      // Prisma 6 bloque --force-reset quand il détecte un environnement
      // d'agent IA ; ce consentement ne concerne que la base de TEST.
      PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION: 'yes',
    },
    cwd: path.resolve(__dirname, '..'), // toujours server/, peu importe d'où npm test est lancé
    stdio: 'inherit',
  })
}
