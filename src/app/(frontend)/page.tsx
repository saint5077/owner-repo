import Link from 'next/link'

import { Container } from '@/components/layout/Container'
import { HeroFacade } from '@/components/drawings'
import { getPayloadClient } from '@/lib/payload'

export default async function HomePage() {
  const payload = await getPayloadClient()
  const home = await payload.findGlobal({ slug: 'home' }).catch(() => null)

  const heroLead =
    home?.heroLead ??
    'Seit 1979 bewirtschaften, vermieten und verkaufen wir Liegenschaften in Zürich – als kleines, unabhängiges Team in Privatbesitz.'

  return (
    <Container>
      <section className="nora-grid items-center gap-y-10 py-10 md:py-16">
        <div className="col-span-12 md:col-span-6 md:pr-8">
          <h1 className="nora-h1">Wir betreuen Ihre Immobilie, als wäre es unsere eigene.</h1>
          <p className="nora-lead mt-6">{heroLead}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/kontakt?anliegen=verwaltung"
              className="nora-button-label bg-fensterladen px-6 py-3 text-weiss hover:opacity-90"
            >
              Verwaltung anfragen
            </Link>
            <Link
              href="/objekte"
              className="nora-button-label border border-tinte px-6 py-3 text-tinte hover:border-fensterladen hover:text-fensterladen"
            >
              Freie Objekte ansehen
            </Link>
          </div>
        </div>

        <div className="col-span-12 md:col-span-6">
          <HeroFacade className="w-full text-tinte" />
        </div>
      </section>
    </Container>
  )
}
