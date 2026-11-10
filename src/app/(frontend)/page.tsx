import Link from 'next/link'

import type { Service } from '@/payload-types'
import { Container } from '@/components/layout/Container'
import { HeroFacade } from '@/components/drawings'
import { LeistungenIndex } from '@/components/home/LeistungenIndex'
import { PropertyCard } from '@/components/properties/PropertyCard'
import { TeamMember } from '@/components/team/TeamMember'
import { KontaktBlock } from '@/components/contact/KontaktBlock'
import { getPayloadClient } from '@/lib/payload'
import { getJahreSeitGruendung } from '@/lib/years'

// Sicherheitsnetz zusätzlich zur ereignisgesteuerten Revalidierung aus den Payload-Hooks
// (DECISIONS.md #11, #26) — korrigiert u. a. die Jahre-seit-1979-Zahl am 1. Januar von selbst.
export const revalidate = 86400

const SERVICE_ORDER: Service['serviceType'][] = ['bewirtschaftung', 'stockwerkeigentum', 'erstvermietung', 'verkauf']

export default async function HomePage() {
  const payload = await getPayloadClient()

  const [home, siteSettings, servicesResult, teamResult, objekteResult] = await Promise.all([
    payload.findGlobal({ slug: 'home' }).catch(() => null),
    payload.findGlobal({ slug: 'siteSettings' }).catch(() => null),
    payload.find({ collection: 'services', limit: 4 }).catch(() => null),
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
    `Seit ${jahre} Jahren bewirtschaften, vermieten und verkaufen wir Liegenschaften in Zürich – als kleines, unabhängiges Team in Privatbesitz.`

  return (
    <>
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

      <section className="border-t border-sandstein/30 py-14 md:py-20">
        <Container>
          <h2 className="nora-h2">Wie können wir Ihnen helfen?</h2>
          <ul className="nora-grid mt-8 gap-y-6">
            {(home?.wegweiser ?? []).map((item) => (
              <li key={item.id} className="col-span-12 md:col-span-4">
                <Link href={item.linkZiel ?? '/'} className="nora-h3 block hover:text-fensterladen">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-t border-sandstein/30 py-14 md:py-20">
        <Container>
          <ul className="nora-grid gap-y-10">
            <li className="col-span-12 sm:col-span-6 lg:col-span-3">
              <p className="nora-h3">Seit {jahre} Jahren</p>
              <p className="nora-prose mt-2 text-[15px] text-tinte-hell">
                in Zürich tätig — bewirtschaften, vermieten und verkaufen aus einer Hand.
              </p>
            </li>
            <li className="col-span-12 sm:col-span-6 lg:col-span-3">
              <p className="nora-h3">100 % in Privatbesitz</p>
              <p className="nora-prose mt-2 text-[15px] text-tinte-hell">
                Uns zählt die Partnerschaft mit unserer Kundschaft, kein Konzern im Hintergrund.
              </p>
            </li>
            <li className="col-span-12 sm:col-span-6 lg:col-span-3">
              <p className="nora-h3">Mitglied SVIT und FIABCI</p>
              <p className="nora-prose mt-2 text-[15px] text-tinte-hell">
                Schweizerischer Verband der Immobilien-Treuhänder und International Real Estate Federation.
              </p>
            </li>
            <li className="col-span-12 sm:col-span-6 lg:col-span-3">
              <p className="nora-h3">Diskretion</p>
              <p className="nora-prose mt-2 text-[15px] text-tinte-hell">
                Keine Referenzobjekte auf dieser Website — zum Schutz unserer Kundschaft.
              </p>
            </li>
          </ul>
        </Container>
      </section>

      {services.length > 0 ? (
        <section className="border-t border-sandstein/30 py-14 md:py-20">
          <Container>
            <h2 className="nora-h2">Leistungen</h2>
            <p className="nora-prose mt-2 text-tinte-hell">Unsere Kernkompetenzen im Überblick.</p>
            <div className="mt-8">
              <LeistungenIndex services={services} />
            </div>
          </Container>
        </section>
      ) : null}

      <section className="border-t border-sandstein/30 py-14 md:py-20">
        <Container>
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="nora-h2">Aktuelle Objekte</h2>
            <Link href="/objekte" className="nora-nav-label hover:text-fensterladen">
              Alle Objekte ansehen
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
              Zurzeit sind alle Objekte vergeben.{' '}
              <Link href="/suchabo" className="hover:text-fensterladen">
                Richten Sie ein Suchabo ein
              </Link>{' '}
              — wir melden uns, sobald etwas Passendes frei wird.
            </p>
          )}
        </Container>
      </section>

      {team.length > 0 ? (
        <section className="border-t border-sandstein/30 py-14 md:py-20">
          <Container>
            <h2 className="nora-h2">Team</h2>
            <p className="nora-prose mt-2 text-tinte-hell">
              {team.map((m) => m.name).join(' und ')} mit ihrem Team sind jederzeit für Ihre Anliegen da.
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
          <h2 className="nora-h2">Kontaktieren Sie uns</h2>
          <div className="mt-8">
            <KontaktBlock siteSettings={siteSettings} />
          </div>
        </Container>
      </section>
    </>
  )
}
