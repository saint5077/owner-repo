import { Container } from '@/components/layout/Container'
import { LeererGrundriss } from '@/components/drawings'
import { pageMetadata } from '@/lib/seo'

import { SuchaboForm } from './SuchaboForm'

export const metadata = pageMetadata({
  title: 'Suchabo',
  description: 'Suchabo einrichten — wir informieren Sie, sobald eine passende Immobilie frei wird.',
  dePath: '/suchabo',
})

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
        <SuchaboForm />
      </section>
    </Container>
  )
}
