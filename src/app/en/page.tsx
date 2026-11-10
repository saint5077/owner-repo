import Link from 'next/link'

import type { Service } from '@/payload-types'
import { Container } from '@/components/layout/Container'
import { HeroFacade } from '@/components/drawings'
import { LeistungenIndex } from '@/components/home/LeistungenIndex'
import { PropertyCard } from '@/components/properties/PropertyCard'
import { TeamMember } from '@/components/team/TeamMember'
import { KontaktBlock } from '@/components/contact/KontaktBlock'
import { DraftNotice } from '@/components/ui/DraftNotice'
import { getPayloadClient } from '@/lib/payload'
import { getJahreSeitGruendung } from '@/lib/years'

export const revalidate = 86400

export const metadata = {
  title: 'Property Management in Zurich since 1979',
  description:
    'Property management, condominium management, first letting and sales in Zurich — a small, independent, privately owned team since 1979.',
  alternates: { canonical: '/en', languages: { 'de-CH': '/', en: '/en' } },
}

const SERVICE_ORDER: Service['serviceType'][] = ['bewirtschaftung', 'stockwerkeigentum', 'erstvermietung', 'verkauf']

export default async function EnglishHomePage() {
  const payload = await getPayloadClient()

  const [home, siteSettings, servicesResult, teamResult, objekteResult] = await Promise.all([
    payload.findGlobal({ slug: 'home', locale: 'en' }).catch(() => null),
    payload.findGlobal({ slug: 'siteSettings' }).catch(() => null),
    payload.find({ collection: 'services', limit: 4, locale: 'en' }).catch(() => null),
    payload.find({ collection: 'team', sort: 'reihenfolge', limit: 10 }).catch(() => null),
    payload
      .find({ collection: 'properties', where: { objektstatus: { equals: 'verfuegbar' } }, sort: '-createdAt', limit: 3 })
      .catch(() => null),
  ])

  const services = (servicesResult?.docs ?? []).sort(
    (a, b) => SERVICE_ORDER.indexOf(a.serviceType) - SERVICE_ORDER.indexOf(b.serviceType),
  )
  const team = teamResult?.docs ?? []
  const objekte = objekteResult?.docs ?? []
  const jahre = getJahreSeitGruendung()

  const heroLead =
    home?.heroLead ??
    `Since ${jahre} years we have been managing, letting and selling properties in Zurich – a small, independent, privately owned team.`

  return (
    <>
      <Container>
        <section className="nora-grid items-center gap-y-10 py-10 md:py-16">
          <div className="col-span-12 md:col-span-6 md:pr-8">
            <h1 className="nora-h1">We look after your property as if it were our own.</h1>
            <p className="nora-lead mt-6">{heroLead}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/bewirtschaftung#anfrage"
                className="nora-button-label bg-fensterladen px-6 py-3 text-weiss hover:opacity-90"
              >
                Request management
              </Link>
              <Link
                href="/objekte"
                className="nora-button-label border border-tinte px-6 py-3 text-tinte hover:border-fensterladen hover:text-fensterladen"
              >
                View available properties
              </Link>
            </div>
          </div>

          <div className="col-span-12 md:col-span-6">
            <HeroFacade className="w-full text-tinte" />
          </div>
        </section>
      </Container>

      <section className="border-t border-sandstein/30 py-14 md:py-20">
        <Container>
          <ul className="nora-grid gap-y-10">
            <li className="col-span-12 sm:col-span-6 lg:col-span-3">
              <p className="nora-h3">{jahre} years</p>
              <p className="nora-prose mt-2 text-[15px] text-tinte-hell">
                active in Zurich — managing, letting and selling, all from one hand.
              </p>
            </li>
            <li className="col-span-12 sm:col-span-6 lg:col-span-3">
              <p className="nora-h3">100% privately owned</p>
              <p className="nora-prose mt-2 text-[15px] text-tinte-hell">
                What matters to us is the partnership with our clients, not a corporate parent.
              </p>
            </li>
            <li className="col-span-12 sm:col-span-6 lg:col-span-3">
              <p className="nora-h3">Member of SVIT and FIABCI</p>
              <p className="nora-prose mt-2 text-[15px] text-tinte-hell">
                Swiss Association of Real Estate Trustees and International Real Estate Federation.
              </p>
            </li>
            <li className="col-span-12 sm:col-span-6 lg:col-span-3">
              <p className="nora-h3">Discretion</p>
              <p className="nora-prose mt-2 text-[15px] text-tinte-hell">
                No reference properties shown on this website — to protect our clients.
              </p>
            </li>
          </ul>
        </Container>
      </section>

      {services.length > 0 ? (
        <section className="border-t border-sandstein/30 py-14 md:py-20">
          <Container>
            <h2 className="nora-h2">Services</h2>
            <p className="nora-prose mt-2 text-tinte-hell">Our core competencies at a glance.</p>
            <div className="mt-8">
              <LeistungenIndex services={services} locale="en" />
            </div>
          </Container>
        </section>
      ) : null}

      {home?.ablaufSchritte && home.ablaufSchritte.length > 0 ? (
        <section className="border-t border-sandstein/30 py-14 md:py-20">
          <Container>
            <h2 className="nora-h2">How we take over your property</h2>
            <ol className="nora-grid mt-8 gap-y-8">
              {home.ablaufSchritte.map((schritt, i) => (
                <li key={schritt.id} className="col-span-12 md:col-span-3">
                  <p className="nora-nav-label text-tinte-hell">{i + 1}</p>
                  <p className="nora-h3 mt-1">{schritt.schritt}</p>
                  <p className="nora-prose mt-2 text-[15px] text-tinte-hell">{schritt.beschreibung}</p>
                </li>
              ))}
            </ol>
            <DraftNotice>Draft — not yet confirmed by the client.</DraftNotice>
          </Container>
        </section>
      ) : null}

      <section className="border-t border-sandstein/30 py-14 md:py-20">
        <Container>
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="nora-h2">Current properties</h2>
            <Link href="/objekte" className="nora-nav-label hover:text-fensterladen">
              View all properties
            </Link>
          </div>
          {objekte.length > 0 ? (
            <div className="nora-grid mt-8 gap-y-10">
              {objekte.map((property) => (
                <div key={property.id} className="col-span-12 sm:col-span-6 lg:col-span-4">
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          ) : (
            <p className="nora-prose mt-6 text-tinte-hell">
              All properties are currently let or sold.{' '}
              <Link href="/suchabo" className="hover:text-fensterladen">
                Set up a search alert
              </Link>{' '}
              — we will contact you as soon as something suitable becomes available.
            </p>
          )}
        </Container>
      </section>

      {team.length > 0 ? (
        <section className="border-t border-sandstein/30 py-14 md:py-20">
          <Container>
            <h2 className="nora-h2">Team</h2>
            <p className="nora-prose mt-2 text-tinte-hell">
              {team.map((m) => m.name).join(' and ')} and their team are here for you at any time.
            </p>
            <div className="nora-grid mt-8 gap-y-10">
              {team.map((member) => (
                <div key={member.id} className="col-span-6 md:col-span-3">
                  <TeamMember member={member} />
                </div>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <section className="border-t border-sandstein/30 py-14 md:py-20">
        <Container>
          <h2 className="nora-h2">Get in touch</h2>
          <div className="mt-8">
            <KontaktBlock siteSettings={siteSettings} />
          </div>
        </Container>
      </section>
    </>
  )
}
