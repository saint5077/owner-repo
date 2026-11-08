import Link from 'next/link'

import { Container } from '@/components/layout/Container'
import { LeererGrundriss } from '@/components/drawings'
import { PropertyCard } from '@/components/properties/PropertyCard'
import { getPayloadClient } from '@/lib/payload'

export const revalidate = 86400

export const metadata = { title: 'Objekte — Nora Immobilien AG' }

/**
 * Minimale Version für Phase 4 — Filter, Karte, Sortierung, URL-Query-State kommen in Phase 5.
 * Zeigt alle verfügbaren und reservierten Objekte als einfaches Kartenraster, damit der Link von
 * Startseite/Navigation/Aktionsleiste nicht ins Leere läuft (DECISIONS.md).
 */
export default async function ObjektePage() {
  const payload = await getPayloadClient()
  const result = await payload
    .find({
      collection: 'properties',
      where: { objektstatus: { in: ['verfuegbar', 'reserviert'] } },
      sort: '-createdAt',
      limit: 50,
    })
    .catch(() => null)
  const objekte = result?.docs ?? []

  return (
    <Container>
      <section className="py-10 md:py-16">
        <h1 className="nora-h1 max-w-2xl">Objekte</h1>
        <p className="nora-lead mt-6">
          Hier finden Sie eine Übersicht aller Liegenschaften, die aktuell zum Verkauf stehen oder vermietet
          werden.
        </p>
      </section>

      <div className="border-t border-sandstein/30 py-14 md:py-20">
        {objekte.length > 0 ? (
          <div className="nora-grid gap-y-10">
            {objekte.map((property) => (
              <div key={property.id} className="col-span-12 sm:col-span-6 lg:col-span-4">
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
        ) : (
          <div className="nora-grid items-center gap-y-8">
            <div className="col-span-12 md:col-span-6">
              <h2 className="nora-h2">Zurzeit sind alle Objekte vergeben.</h2>
              <p className="nora-prose mt-4 text-tinte-hell">
                Richten Sie ein Suchabo ein — wir melden uns, sobald etwas Passendes frei wird.
              </p>
              <Link
                href="/kontakt?anliegen=allgemein"
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
