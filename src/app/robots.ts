import type { MetadataRoute } from 'next'

import { getSiteUrl } from '@/lib/seo'

/**
 * Head-Start auf Phase 9 (DECISIONS.md #5x): `NEXT_PUBLIC_DEMO_MODE` existiert als Variable noch
 * nicht (das Demo-Banner/die dreifache noindex-Sperre selbst sind Phase 9), aber `robots.ts`
 * braucht so oder so eine Entscheidung für den aktuellen, variablenlosen Zustand. Solange die
 * Variable fehlt oder "true" ist, gilt das als Vorschau/Demo → alles sperren. Erst ein explizites
 * `NEXT_PUBLIC_DEMO_MODE=false` (Go-live) schaltet frei. Damit muss Phase 9 diese Datei nicht
 * mehr anfassen.
 */
export default function robots(): MetadataRoute.Robots {
  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE !== 'false'

  if (isDemo) {
    return { rules: { userAgent: '*', disallow: '/' } }
  }

  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/suchabo/bestaetigen', '/suchabo/abmelden'] }],
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  }
}
