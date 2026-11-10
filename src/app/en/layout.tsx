import type { ReactNode } from 'react'

import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { MobileActionBar } from '@/components/layout/MobileActionBar'
import { SkipLink } from '@/components/layout/SkipLink'
import { Container } from '@/components/layout/Container'
import { DraftBox } from '@/components/ui/DraftNotice'
import { getPayloadClient } from '@/lib/payload'

import { archivo, literata } from '../(frontend)/fonts'
import '../(frontend)/styles.css'

// Siehe (frontend)/layout.tsx — dieselbe fail-safe-Logik, eigenes Root-Layout (DECISIONS.md #5x).
const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE !== 'false'

export const metadata = {
  title: { default: 'Nora Immobilien AG', template: '%s — Nora Immobilien AG' },
  description:
    'Property management, condominium management, first letting and sales in Zurich — since 1979. A small, independent, privately owned team.',
  robots: isDemo ? { index: false, follow: false } : { index: true, follow: true },
}

/**
 * Eigenes Root-Layout, kein next-intl-Routing (DECISIONS.md #5x) — nur zwei Seiten sind diese
 * Phase tatsächlich übersetzt (Startseite, Bewirtschaftung), daher ein bewusst schlanker,
 * eigenständiger Baum statt einer vollständigen [locale]-Migration der ganzen Seite.
 */
export default async function EnglishLayout({ children }: { children: ReactNode }) {
  const payload = await getPayloadClient()
  const siteSettings = await payload.findGlobal({ slug: 'siteSettings' }).catch(() => null)
  const telefon = siteSettings?.firma?.telefon ?? undefined

  return (
    <html lang="en" className={`${archivo.variable} ${literata.variable}`}>
      <body>
        <SkipLink locale="en" />
        <Header telefon={telefon} locale="en" />
        <main id="hauptinhalt" className="pt-16 md:pt-20">
          <Container>
            <div className="pt-6">
              <DraftBox title="English — translation in progress">
                This page is a working translation of content the client has confirmed in German. It has not
                yet been reviewed by a native English speaker and should not be sent to anyone as a finished
                page. Only the homepage and the Property Management page have an English version so far.
              </DraftBox>
            </div>
          </Container>
          {children}
        </main>
        <Footer siteSettings={siteSettings} locale="en" />
        <MobileActionBar telefon={telefon} locale="en" />
      </body>
    </html>
  )
}
