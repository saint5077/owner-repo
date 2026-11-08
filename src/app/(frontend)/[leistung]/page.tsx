import { notFound } from 'next/navigation'
import Link from 'next/link'

import type { Service } from '@/payload-types'
import { Container } from '@/components/layout/Container'
import { Einfamilienhaus, MFHAnsicht, NeubauBalkone, StockwerkSchnitt } from '@/components/drawings'
import { DraftNotice } from '@/components/ui/DraftNotice'
import { Prose } from '@/components/ui/Prose'
import { TeamMember } from '@/components/team/TeamMember'
import { FormShapeFooter, SelectField, TextField, TextareaField } from '@/components/forms/FieldShape'
import { getPayloadClient } from '@/lib/payload'

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
  return { title: `${LABEL[leistung]} — Nora Immobilien AG` }
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

export default async function LeistungPage({ params }: { params: Promise<{ leistung: string }> }) {
  const { leistung } = await params
  if (!isLeistung(leistung)) notFound()

  const service = await getService(leistung)
  if (!service) notFound()

  const Drawing = service.zeichnungsvariante ? DRAWING[service.zeichnungsvariante] : null
  const leistungsgruppe = service.leistungsgruppen?.[0]
  const istVerkauf = leistung === 'verkauf'

  return (
    <>
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
              <div className="nora-grid mt-6 gap-y-5">
                {istVerkauf ? (
                  <>
                    <div className="col-span-12 md:col-span-6">
                      <SelectField
                        label="Objektart"
                        options={['Eigenheim', 'Renditeliegenschaft', 'Stockwerkeinheit', 'Gewerbe-/Industrieobjekt']}
                      />
                    </div>
                    <div className="col-span-12 md:col-span-6">
                      <TextField label="Ort" />
                    </div>
                    <div className="col-span-12 md:col-span-4">
                      <TextField label="Zimmer" type="number" />
                    </div>
                    <div className="col-span-12 md:col-span-4">
                      <TextField label="Fläche (m²)" type="number" />
                    </div>
                    <div className="col-span-12 md:col-span-4">
                      <TextField label="Baujahr" type="number" />
                    </div>
                    <div className="col-span-12">
                      <TextField label="Zustand" />
                    </div>
                    <div className="col-span-12">
                      <SelectField label="Zeithorizont" options={['So bald wie möglich', 'In den nächsten 6 Monaten', 'Noch offen']} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-span-12 md:col-span-6">
                      <SelectField
                        label="Art der Liegenschaft"
                        options={['Mehrfamilienhaus', 'Stockwerkeigentum', 'Gemischt genutzt', 'Gewerbe', 'Einfamilienhaus']}
                      />
                    </div>
                    <div className="col-span-12 md:col-span-6">
                      <TextField label="Anzahl Einheiten" type="number" />
                    </div>
                    <div className="col-span-12 md:col-span-6">
                      <TextField label="Ort" />
                    </div>
                    <div className="col-span-12 md:col-span-6">
                      <SelectField
                        label="Heutige Situation"
                        options={['Selbst verwaltet', 'Andere Verwaltung', 'Neubau']}
                      />
                    </div>
                    <div className="col-span-12 md:col-span-6">
                      <TextField label="Gewünschter Beginn" type="date" />
                    </div>
                    <div className="col-span-12 md:col-span-6">
                      <TextField label="Rückruf-Zeitfenster" />
                    </div>
                  </>
                )}
                <div className="col-span-12 md:col-span-6">
                  <TextField label="Name" />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <TextField label="Telefon" type="tel" />
                </div>
                <div className="col-span-12">
                  <TextField label="E-Mail" type="email" />
                </div>
                <div className="col-span-12">
                  <TextareaField label="Nachricht" />
                </div>
                <FormShapeFooter />
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
