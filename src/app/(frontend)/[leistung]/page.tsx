import { notFound } from 'next/navigation'
import Link from 'next/link'

import type { Service } from '@/payload-types'
import { Container } from '@/components/layout/Container'
import { Einfamilienhaus, MFHAnsicht, NeubauBalkone, StockwerkSchnitt } from '@/components/drawings'
import { DraftNotice } from '@/components/ui/DraftNotice'
import { Prose } from '@/components/ui/Prose'
import { TeamMember } from '@/components/team/TeamMember'
import { JsonLd } from '@/components/seo/JsonLd'
import { buildBreadcrumbJsonLd, buildServiceJsonLd } from '@/lib/jsonld'
import { getPayloadClient } from '@/lib/payload'
import { pageMetadata } from '@/lib/seo'

import { LeistungForm } from './LeistungForm'

export const revalidate = 86400
export const dynamicParams = false

const DRAWING = { mfh: MFHAnsicht, schnitt: StockwerkSchnitt, neubau: NeubauBalkone, efh: Einfamilienhaus }

const SLUGS: Service['serviceType'][] = ['bewirtschaftung', 'stockwerkeigentum', 'erstvermietung', 'verkauf']

const LABEL: Record<Service['serviceType'], string> = {
  bewirtschaftung: 'Bewirtschaftung',
  stockwerkeigentum: 'Stockwerkeigentum',
  erstvermietung: 'Erstvermietung',
  verkauf: 'Verkauf',
}

function isLeistung(value: string): value is Service['serviceType'] {
  return (SLUGS as string[]).includes(value)
}

export function generateStaticParams() {
  return SLUGS.map((leistung) => ({ leistung }))
}

export async function generateMetadata({ params }: { params: Promise<{ leistung: string }> }) {
  const { leistung } = await params
  if (!isLeistung(leistung)) return {}
  const service = await getService(leistung)
  return pageMetadata({
    title: LABEL[leistung],
    description: service?.seo?.description ?? service?.claim,
    dePath: `/${leistung}`,
    enPath: leistung === 'bewirtschaftung' ? '/en/bewirtschaftung' : undefined,
  })
}

async function getService(leistung: Service['serviceType']) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'services',
    where: { serviceType: { equals: leistung } },
    limit: 1,
  })
  return result.docs[0] ?? null
}

async function getAblaufSchritte() {
  const payload = await getPayloadClient()
  const home = await payload.findGlobal({ slug: 'home' }).catch(() => null)
  return home?.ablaufSchritte ?? null
}

export default async function LeistungPage({ params }: { params: Promise<{ leistung: string }> }) {
  const { leistung } = await params
  if (!isLeistung(leistung)) notFound()

  const service = await getService(leistung)
  if (!service) notFound()

  const istBewirtschaftung = leistung === 'bewirtschaftung'
  const ablaufSchritte = istBewirtschaftung ? await getAblaufSchritte() : null

  const Drawing = service.zeichnungsvariante ? DRAWING[service.zeichnungsvariante] : null
  const leistungsgruppe = service.leistungsgruppen?.[0]
  const istVerkauf = leistung === 'verkauf'

  return (
    <>
      <JsonLd data={buildServiceJsonLd(service, `/${leistung}`)} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Startseite', path: '/' },
          { name: LABEL[leistung], path: `/${leistung}` },
        ])}
      />
      <Container>
        <section className="nora-grid items-center gap-y-10 py-10 md:py-16">
          <div className="col-span-12 md:col-span-6 md:pr-8">
            <p className="nora-nav-label text-tinte-hell">
              <Link href="/" className="hover:text-fensterladen">
                Startseite
              </Link>{' '}
              / Leistungen
            </p>
            <h1 className="nora-h1 mt-3">{LABEL[leistung]}</h1>
            {service.claim ? <p className="nora-lead mt-4">{service.claim}</p> : null}
          </div>
          <div className="col-span-12 md:col-span-6">
            {Drawing ? <Drawing className="w-full text-tinte" /> : null}
          </div>
        </section>
      </Container>

      <section className="border-t border-sandstein/30 py-14 md:py-20">
        <Container>
          <Prose data={service.einleitung} />

          {leistungsgruppe?.punkte && leistungsgruppe.punkte.length > 0 ? (
            <div className="mt-10">
              <h2 className="nora-h2">{leistungsgruppe.titel ?? 'Was wir übernehmen'}</h2>
              <ul className="nora-grid mt-6 gap-y-3">
                {leistungsgruppe.punkte.map((punkt) => (
                  <li key={punkt.id} className="nora-prose col-span-12 border-t border-sandstein/30 py-3 md:col-span-6">
                    {punkt.text}
                  </li>
                ))}
              </ul>
              {service.contentStatus === 'entwurf' ? (
                <DraftNotice>
                  Entwurf — diese Liste stammt nicht wörtlich von der alten Website und braucht fachliche
                  Freigabe.
                </DraftNotice>
              ) : null}
            </div>
          ) : null}
        </Container>
      </section>

      {ablaufSchritte && ablaufSchritte.length > 0 ? (
        <section className="border-t border-sandstein/30 py-14 md:py-20">
          <Container>
            <h2 className="nora-h2">So übernehmen wir Ihre Liegenschaft</h2>
            <ol className="nora-grid mt-8 gap-y-8">
              {ablaufSchritte.map((schritt, i) => (
                <li key={schritt.id} className="col-span-12 md:col-span-3">
                  <p className="nora-nav-label text-tinte-hell">{i + 1}</p>
                  <p className="nora-h3 mt-1">{schritt.schritt}</p>
                  <p className="nora-prose mt-2 text-[15px] text-tinte-hell">{schritt.beschreibung}</p>
                </li>
              ))}
            </ol>
            <DraftNotice>Entwurf — noch nicht vom Kunden bestätigt.</DraftNotice>
          </Container>
        </section>
      ) : null}

      {service.faq && service.faq.length > 0 ? (
        <section className="border-t border-sandstein/30 py-14 md:py-20">
          <Container>
            <h2 className="nora-h2">Häufige Fragen</h2>
            <dl className="mt-8 flex flex-col gap-8">
              {service.faq.map((eintrag) => (
                <div key={eintrag.id} className="border-t border-sandstein/30 pt-6">
                  <dt className="nora-h3">{eintrag.frage}</dt>
                  <dd className="mt-2">
                    <Prose data={eintrag.antwort} />
                  </dd>
                </div>
              ))}
            </dl>
            <DraftNotice>Entwurf — braucht fachliche Freigabe, bevor diese Seite live geht.</DraftNotice>
          </Container>
        </section>
      ) : null}

      <section className="border-t border-sandstein/30 py-14 md:py-20">
        <Container>
          <div className="nora-grid gap-y-10">
            <div className="col-span-12 md:col-span-7">
              <h2 className="nora-h2">{istVerkauf ? 'Ersteinschätzung anfragen' : 'Verwaltung anfragen'}</h2>
              <div className="mt-6">
                <LeistungForm variant={istVerkauf ? 'ersteinschaetzung' : 'verwaltung'} />
              </div>
            </div>

            {service.ansprechperson && typeof service.ansprechperson === 'object' ? (
              <div className="col-span-12 md:col-span-4 md:col-start-9">
                <p className="nora-nav-label mb-4 text-tinte-hell">Ihre Ansprechperson</p>
                <TeamMember member={service.ansprechperson} />
              </div>
            ) : null}
          </div>
        </Container>
      </section>
    </>
  )
}
