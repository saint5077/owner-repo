import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import {
  Einfamilienhaus,
  HausOffeneTuer,
  HeroFacade,
  LeererGrundriss,
  MFHAnsicht,
  NeubauBalkone,
  StockwerkSchnitt,
} from '@/components/drawings'
import { Logo } from '@/components/branding/Logo'

/**
 * Nur für die Entwicklung — zeigt alle Zeichnungsmodul-Kompositionen nebeneinander für den
 * Selbstkritik-Screenshot-Durchgang (Briefing §0.3) und einen Wortumbruch-Stresstest bei
 * langen deutschen Komposita (Briefing §5: "nichts darf überlaufen"). Kein Nav-Link, nicht
 * Teil des produktiven Seitenbaums.
 */
export default function ZeichnungenPreviewPage() {
  if (process.env.NODE_ENV === 'production') {
    notFound()
  }

  const items: Array<{ label: string; node: ReactNode }> = [
    { label: 'Logo (SVG-Nachzeichnung)', node: <Logo className="h-32 w-auto text-tinte" /> },
    { label: 'Hero-Fassade (animiert)', node: <HeroFacade className="text-tinte" /> },
    { label: 'Mehrfamilienhaus-Ansicht — Bewirtschaftung', node: <MFHAnsicht className="text-tinte" /> },
    { label: 'Schnitt — Stockwerkeigentum', node: <StockwerkSchnitt className="text-tinte" /> },
    { label: 'Neubau mit Balkonen — Erstvermietung', node: <NeubauBalkone className="text-tinte" /> },
    { label: 'Einfamilienhaus — Verkauf', node: <Einfamilienhaus className="text-tinte" /> },
    { label: 'Leerer Grundriss — Objekte-Leerzustand', node: <LeererGrundriss className="text-tinte" /> },
    { label: 'Haus mit offener Tür — 404', node: <HausOffeneTuer className="text-tinte" /> },
  ]

  return (
    <div className="nora-container py-12">
      <h1 className="nora-h2 mb-8">Zeichnungsmodul — Vorschau (nur Entwicklung)</h1>

      <section className="mb-16">
        <h2 className="nora-h3 mb-4">Wortumbruch-Stresstest, 360 px Referenz</h2>
        <div className="max-w-[320px] border border-sandstein/40 p-4">
          <p className="nora-prose" lang="de-CH">
            Stockwerkeigentümergemeinschaft, Liegenschaftsbuchhaltung, Mehrfamilienhausbewirtschaftung,
            Mietzinsinkasso-Mahnwesen.
          </p>
        </div>
      </section>

      <div className="nora-grid gap-y-16">
        {items.map((item) => (
          <div key={item.label} className="col-span-12 md:col-span-6 lg:col-span-4">
            <p className="nora-nav-label mb-3 text-tinte-hell">{item.label}</p>
            <div className="border border-sandstein/30 p-6">{item.node}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
