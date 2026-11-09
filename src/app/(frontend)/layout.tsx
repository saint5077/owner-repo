import type { ReactNode } from 'react'

import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { MobileActionBar } from '@/components/layout/MobileActionBar'
import { SkipLink } from '@/components/layout/SkipLink'
import { JsonLd } from '@/components/seo/JsonLd'
import { buildRealEstateAgentJsonLd } from '@/lib/jsonld'
import { getPayloadClient } from '@/lib/payload'
import { getSiteUrl } from '@/lib/seo'

import { archivo, literata } from './fonts'
import './styles.css'

export const metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: 'Immobilienverwaltung in Zürich seit 1979 | Nora Immobilien AG',
    template: '%s — Nora Immobilien AG',
  },
  description:
    'Immobilienverwaltung, Stockwerkeigentum, Erstvermietung und Verkauf in Zürich — seit 1979. Ein kleines, unabhängiges Team in Privatbesitz.',
  manifest: '/manifest.json',
  alternates: { canonical: '/', languages: { 'de-CH': '/', en: '/en' } },
  openGraph: { locale: 'de_CH', siteName: 'Nora Immobilien AG' },
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const payload = await getPayloadClient()
  const siteSettings = await payload.findGlobal({ slug: 'siteSettings' }).catch(() => null)
  const telefon = siteSettings?.firma?.telefon ?? undefined

  return (
    <html lang="de-CH" className={`${archivo.variable} ${literata.variable}`}>
      <body>
        <JsonLd data={buildRealEstateAgentJsonLd(siteSettings)} />
        <SkipLink />
        <Header telefon={telefon} />
        <main id="hauptinhalt" className="pt-16 md:pt-20">
          {children}
        </main>
        <Footer siteSettings={siteSettings} />
        <MobileActionBar telefon={telefon} />
      </body>
    </html>
  )
}
