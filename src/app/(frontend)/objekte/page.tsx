import Link from 'next/link'

import { Container } from '@/components/layout/Container'
import { LeererGrundriss } from '@/components/drawings'
import { PropertyCard } from '@/components/properties/PropertyCard'
import { ObjekteFilterBar } from '@/components/properties/ObjekteFilterBar'
import { LazyPropertyMap } from '@/components/properties/LazyPropertyMap'
import { propertyLocation } from '@/lib/property-location'
import { buildPropertyWhere, parsePropertyFilters, sortParam } from '@/lib/property-filters'
import { getPayloadClient } from '@/lib/payload'

export const metadata = { title: 'Objekte — Nora Immobilien AG' }

type SearchParams = Record<string, string | string[] | undefined>

/**
 * Filterung läuft serverseitig gegen die `properties`-Collection (Briefing §6) — kein
 * clientseitiges Array-Filtern einer vorab geladenen Liste. Kein `revalidate`-Intervall mehr:
 * die Seite liest `searchParams`, ist also dynamisch gerendert, und wird zusätzlich über
 * Payloads `afterChange`-Hook gezielt revalidiert (DECISIONS.md #26).
 */
export default async function ObjektePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const filters = parsePropertyFilters(params)

  const payload = await getPayloadClient()
  const result = await payload
    .find({
      collection: 'properties',
      where: buildPropertyWhere(filters),
      sort: sortParam(filters.sort),
      limit: 100,
    })
    .catch(() => null)
  const objekte = result?.docs ?? []

  const hatAktiveFilter = Boolean(
    filters.angebotsart ||
      filters.objektart?.length ||
      filters.kreis?.length ||
      filters.zimmerVon ||
      filters.zimmerBis ||
      filters.preisBis ||
      filters.flaecheAb ||
      filters.verfuegbarAb,
  )

  const markers = objekte.map(propertyLocation).filter((m): m is NonNullable<typeof m> => m !== null)

  return (
    <Container>
      <section className="py-10 md:py-16">
        <h1 className="nora-h1 max-w-2xl">Objekte</h1>
        <p className="nora-lead mt-6">
          Hier finden Sie eine Übersicht aller Liegenschaften, die aktuell zum Verkauf stehen oder vermietet
          werden.
        </p>
      </section>

      <div className="border-t border-sandstein/30 py-10">
        <ObjekteFilterBar filters={filters} />
      </div>

      <div
        aria-live="polite"
        className="nora-nav-label border-t border-sandstein/30 py-4 text-tinte-hell"
      >
        {objekte.length === 0
          ? 'Keine Objekte gefunden.'
          : objekte.length === 1
            ? '1 Objekt gefunden.'
            : `${objekte.length} Objekte gefunden.`}
      </div>

      <div className="pb-14 md:pb-20">
        {objekte.length > 0 ? (
          filters.ansicht === 'karte' ? (
            <div className="h-[480px] w-full md:h-[640px]">
              <LazyPropertyMap markers={markers} />
            </div>
          ) : (
            <div className="nora-grid gap-y-10">
              {objekte.map((property) => (
                <div key={property.id} className="col-span-12 sm:col-span-6 lg:col-span-4">
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="nora-grid items-center gap-y-8">
            <div className="col-span-12 md:col-span-6">
              <h2 className="nora-h2">
                {hatAktiveFilter
                  ? 'Keine Objekte entsprechen Ihren Kriterien.'
                  : 'Zurzeit sind alle Objekte vergeben.'}
              </h2>
              <p className="nora-prose mt-4 text-tinte-hell">
                {hatAktiveFilter
                  ? 'Versuchen Sie es mit weniger Filtern, oder richten Sie ein Suchabo ein — wir melden uns, sobald etwas Passendes frei wird.'
                  : 'Richten Sie ein Suchabo ein — wir melden uns, sobald etwas Passendes frei wird.'}
              </p>
              <Link
                href="/suchabo"
                className="nora-button-label mt-6 inline-block bg-fensterladen px-6 py-3 text-weiss hover:opacity-90"
              >
                Suchabo einrichten
              </Link>
            </div>
            <div className="col-span-12 md:col-span-6">
              <LeererGrundriss className="w-full max-w-sm text-tinte-hell" />
            </div>
          </div>
        )}
      </div>
    </Container>
  )
}
