import type { Property } from '@/payload-types'
import { Einfamilienhaus, MFHAnsicht } from '@/components/drawings'
import { formatCHF, formatOrt, formatZimmer, formatFlaeche } from '@/lib/format'

const HAUS_OBJEKTARTEN = new Set(['einfamilienhaus', 'reihenhaus'])

const STATUS_LABEL: Partial<Record<NonNullable<Property['objektstatus']>, string>> = {
  reserviert: 'Reserviert',
  vermietet: 'Vermietet',
  verkauft: 'Verkauft',
}

/**
 * Noch ohne Link auf eine Detailseite — /objekte/[slug] entsteht erst in Phase 5. Bis dahin ein
 * reines Infokärtchen, flach (kein Radius/Schatten, DESIGN.md §10 „Vermeiden“), getrennt durch
 * eine dünne Linie statt Kartenschatten. Ohne Galeriebild zeigt die Karte stellvertretend eine
 * Zeichnung aus dem Modul — passt zur Leitidee „Zeichnung statt Foto" auch dort, wo noch kein
 * Foto hinterlegt ist (DESIGN.md §5/§7).
 */
export function PropertyCard({ property }: { property: Property }) {
  const preis = property.preisAufAnfrage
    ? 'Preis auf Anfrage'
    : property.angebotsart === 'kauf'
      ? formatCHF(property.kaufpreis)
      : property.bruttomiete
        ? `${formatCHF(property.bruttomiete)} / Monat`
        : null

  const statusLabel = property.objektstatus ? STATUS_LABEL[property.objektstatus] : undefined
  const Drawing = property.objektart && HAUS_OBJEKTARTEN.has(property.objektart) ? Einfamilienhaus : MFHAnsicht

  return (
    <article className="border-t border-sandstein/30 pt-6">
      <div className="mb-4 aspect-[4/3] bg-weiss p-4">
        <Drawing className="h-full w-full text-tinte-hell" />
      </div>

      <div className="flex items-start justify-between gap-3">
        <h3 className="nora-h3">{property.title}</h3>
        {property.isExample ? (
          <span className="nora-nav-label shrink-0 border border-sandstein/50 px-2 py-0.5 text-tinte-hell">
            Beispiel
          </span>
        ) : null}
      </div>

      <p className="nora-prose mt-1 text-[15px] text-tinte-hell">
        {[formatZimmer(property.zimmer), formatFlaeche(property.wohnflaecheM2), formatOrt(property.kreis, property.adresse?.ort)]
          .filter(Boolean)
          .join(' — ')}
      </p>

      <div className="mt-2 flex items-center justify-between gap-3">
        {preis ? <p className="nora-nav-label tabular-nums">{preis}</p> : null}
        {statusLabel ? <p className="nora-nav-label text-tinte-hell">{statusLabel}</p> : null}
      </div>
    </article>
  )
}
