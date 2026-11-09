import { defineConfig, devices } from '@playwright/test'

/**
 * Read environment variables from file. Explizit `.env.local`, da `dotenv/config` ohne Pfadangabe
 * nur `.env` lädt (gibt es in diesem Projekt nicht, siehe DECISIONS.md) — ohne diesen Fix fehlten
 * Payload-Local-API-Aufrufen aus E2E-Tests heraus PAYLOAD_SECRET/DATABASE_URL (derselbe Fix wie
 * in `vitest.setup.ts`; der `pnpm dev`-Webserver selbst ist davon nicht betroffen, da Next.js
 * `.env.local` ohnehin automatisch lädt).
 * https://github.com/motdotla/dotenv
 */
import { config } from 'dotenv'

config({ path: '.env.local' })

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests/e2e',
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /**
   * Immer 1 Worker, nicht nur auf CI. Alle E2E-Tests laufen gegen dieselbe echte lokale
   * Postgres-Entwicklungsdatenbank (DECISIONS.md #12) — es gibt keine Transaktions-Isolation
   * pro Test. Tests, die auf globale Zustände prüfen (z. B. "3 Objekte gefunden." in
   * objekte-filter.e2e.spec.ts), würden unter parallelen Workern durch zeitgleich laufende
   * Tests, die temporäre `properties`/`searchAlerts`-Dokumente anlegen (objekt-detail.e2e.spec.ts,
   * suchabo-opt-in.e2e.spec.ts), zufällig fehlschlagen — genau das in Phase 8 beobachtet und
   * hier behoben, statt die Assertions unzuverlässig zu lockern.
   */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], channel: 'chromium' },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    reuseExistingServer: true,
    url: 'http://localhost:3000',
  },
})
