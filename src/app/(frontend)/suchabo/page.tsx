import { Container } from '@/components/layout/Container'
import { LeererGrundriss } from '@/components/drawings'
import { FormShapeFooter, SelectField, TextField } from '@/components/forms/FieldShape'

export const metadata = { title: 'Suchabo — Nora Immobilien AG' }

/**
 * Feld-Optik wie die übrigen Formulare dieser Phase (DECISIONS.md #32) — Double-Opt-in,
 * Bestätigungs-/Abmeldelink und das Benachrichtigungs-Matching gegen `searchAlerts.kriterien`
 * folgen in Phase 6. Die Feldnamen hier entsprechen bewusst `SearchAlerts.kriterien`
 * (`src/collections/SearchAlerts.ts`), damit das spätere Matching 1:1 auf das trifft, was hier
 * abgefragt wird.
 */
export default function SuchaboPage() {
  return (
    <Container>
      <section className="nora-grid items-center gap-y-10 py-10 md:py-16">
        <div className="col-span-12 md:col-span-7">
          <h1 className="nora-h1">Suchabo einrichten</h1>
          <p className="nora-lead mt-6">
            Richten Sie ein Suchabo ein — wir melden uns per E-Mail, sobald ein passendes Objekt frei wird.
          </p>
        </div>
        <div className="col-span-12 md:col-span-5">
          <LeererGrundriss className="w-full max-w-sm text-tinte-hell" />
        </div>
      </section>

      <section className="border-t border-sandstein/30 py-14 md:py-20">
        <div className="nora-grid max-w-3xl gap-y-5">
          <div className="col-span-12 md:col-span-6">
            <SelectField label="Angebotsart" options={['Mieten', 'Kaufen', 'Beide']} />
          </div>
          <div className="col-span-12 md:col-span-6">
            <TextField label="E-Mail" type="email" />
          </div>
          <div className="col-span-12 md:col-span-4">
            <TextField label="Zimmer von" type="number" />
          </div>
          <div className="col-span-12 md:col-span-4">
            <TextField label="Zimmer bis" type="number" />
          </div>
          <div className="col-span-12 md:col-span-4">
            <TextField label="Preis bis (CHF)" type="number" />
          </div>
          <div className="col-span-12">
            <span className="nora-nav-label mb-2 block text-tinte-hell">Objektart</span>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {['Wohnung', 'Maisonette', 'Attika', 'Studio', 'Einfamilienhaus', 'Reihenhaus', 'Büro', 'Gewerbe'].map(
                (label) => (
                  <label key={label} className="nora-prose flex items-center gap-2 text-[15px]">
                    <input type="checkbox" disabled className="h-4 w-4 accent-sandstein" />
                    {label}
                  </label>
                ),
              )}
            </div>
          </div>
          <div className="col-span-12">
            <span className="nora-nav-label mb-2 block text-tinte-hell">Kreis</span>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {Array.from({ length: 12 }, (_, i) => String(i + 1)).map((k) => (
                <label key={k} className="nora-prose flex items-center gap-1.5 text-[15px]">
                  <input type="checkbox" disabled className="h-4 w-4 accent-sandstein" />
                  {k}
                </label>
              ))}
            </div>
          </div>
          <FormShapeFooter />
        </div>
      </section>
    </Container>
  )
}
