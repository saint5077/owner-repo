import { notFound } from 'next/navigation'
import Link from 'next/link'

import type { Media } from '@/payload-types'
import { Container } from '@/components/layout/Container'
import { Einfamilienhaus, MFHAnsicht } from '@/components/drawings'
import { Gallery, type GalleryImage } from '@/components/properties/Gallery'
import { LazyPropertyMap } from '@/components/properties/LazyPropertyMap'
import { ShareButton } from '@/components/properties/ShareButton'
import { Prose } from '@/components/ui/Prose'
import { TeamMember } from '@/components/team/TeamMember'
import { FormShapeFooter, SelectField, TextField, TextareaField } from '@/components/forms/FieldShape'
import { formatCHF, formatFlaeche, formatOrt, formatZimmer } from '@/lib/format'
import { propertyLocation } from '@/lib/property-location'
import { getPayloadClient } from '@/lib/payload'

export const revalidate = 86400

const HAUS_OBJEKTARTEN = new Set(['einfamilienhaus', 'reihenhaus'])

const OBJEKTART_LABEL: Record<string, string> = {
  wohnung: 'Wohnung',
  maisonette: 'Maisonette',
  attika: 'Attikawohnung',
  studio: 'Studio',
  einfamilienhaus: 'Einfamilienhaus',
  reihenhaus: 'Reihenhaus',
  buero: 'Büro',
  gewerbe: 'Gewerbe',
  parkplatz: 'Parkplatz',
  einstellhallenplatz: 'Einstellhallenplatz',
  lager: 'Lager/Bastelraum',
}

const MERKMAL_LABEL: Record<string, string> = {
  'balkon-terrasse': 'Balkon/Terrasse',
  lift: 'Lift',
  'eigene-waschmaschine': 'Eigene Waschmaschine/Tumbler',
  geschirrspueler: 'Geschirrspüler',
  parkett: 'Parkett',
  'haustiere-erlaubt': 'Haustiere erlaubt',
  rollstuhlgaengig: 'Rollstuhlgängig',
  minergie: 'Minergie',
  gartensitzplatz: 'Gartensitzplatz',
  keller: 'Keller',
  estrich: 'Estrich',
  parkplatz: 'Parkplatz',
}

async function getProperty(slug: string) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'properties',
    where: { slug: { equals: slug }, objektstatus: { in: ['verfuegbar', 'reserviert', 'vermietet', 'verkauft'] } },
    limit: 1,
  })
  return result.docs[0] ?? null
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const property = await getProperty(slug)
  if (!property) return {}
  return {
    title: `${property.title} — Nora Immobilien AG`,
    description: formatOrt(property.kreis, property.adresse?.ort),
  }
}

export default async function ObjektDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const property = await getProperty(slug)
  if (!property) notFound()

  const images: GalleryImage[] = (property.galerie ?? [])
    .filter((m): m is Media => typeof m === 'object' && m !== null)
    .map((m) => ({ id: String(m.id), url: m.url ?? '', alt: m.alt ?? property.title, width: m.width, height: m.height }))
    .filter((img) => img.url)

  const dokumente = (property.dokumente ?? []).filter((m): m is Media => typeof m === 'object' && m !== null)

  const Fallback = property.objektart && HAUS_OBJEKTARTEN.has(property.objektart) ? Einfamilienhaus : MFHAnsicht

  const preis = property.preisAufAnfrage
    ? 'Preis auf Anfrage'
    : property.angebotsart === 'kauf'
      ? formatCHF(property.kaufpreis)
      : property.bruttomiete
        ? `${formatCHF(property.bruttomiete)} / Monat`
        : null

  const verfuegbarText =
    property.verfuegbarAb?.typ === 'sofort'
      ? 'Sofort'
      : property.verfuegbarAb?.typ === 'datum' && property.verfuegbarAb.datum
        ? new Intl.DateTimeFormat('de-CH', { dateStyle: 'long' }).format(new Date(property.verfuegbarAb.datum))
        : 'Nach Vereinbarung'

  const fakten: [string, string | null][] = [
    ['Objektart', property.objektart ? OBJEKTART_LABEL[property.objektart] : null],
    ['Zimmer', formatZimmer(property.zimmer)],
    ['Wohnfläche', formatFlaeche(property.wohnflaecheM2)],
    ['Nutzfläche', formatFlaeche(property.nutzflaecheM2)],
    ['Etage', property.etage ?? null],
    ['Baujahr', property.baujahr ? String(property.baujahr) : null],
    ['Renovation', property.renovationJahr ? String(property.renovationJahr) : null],
    ['Lage', formatOrt(property.kreis, property.adresse?.ort)],
    ['Verfügbar ab', verfuegbarText],
  ]

  const marker = propertyLocation(property)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nora-immobilien.ch'
  const pageUrl = `${siteUrl}/objekte/${property.slug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    url: pageUrl,
    description: formatOrt(property.kreis, property.adresse?.ort),
    ...(images[0] ? { image: images[0].url } : {}),
    ...(preis && !property.preisAufAnfrage
      ? {
          offers: {
            '@type': 'Offer',
            price: property.angebotsart === 'kauf' ? property.kaufpreis : property.bruttomiete,
            priceCurrency: 'CHF',
          },
        }
      : {}),
    numberOfRooms: property.zimmer ?? undefined,
    floorSize: property.wohnflaecheM2
      ? { '@type': 'QuantitativeValue', value: property.wohnflaecheM2, unitCode: 'MTK' }
      : undefined,
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.adresse?.ort ?? 'Zürich',
      addressRegion: 'ZH',
      addressCountry: 'CH',
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Container>
        <p className="nora-nav-label pt-6 text-tinte-hell print:hidden">
          <Link href="/" className="hover:text-fensterladen">
            Startseite
          </Link>{' '}
          /{' '}
          <Link href="/objekte" className="hover:text-fensterladen">
            Objekte
          </Link>
        </p>

        <div className="py-6 print:hidden">
          <Gallery images={images} fallback={<Fallback className="h-full w-full text-tinte-hell" />} />
        </div>

        {/* Druck-Titelbild: ruhiges Standbild statt der interaktiven Galerie/Lightbox-Buttons. */}
        <div className="hidden aspect-[16/9] w-full bg-weiss p-10 print:block">
          {images[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={images[0].url} alt={images[0].alt} className="h-full w-full object-contain" />
          ) : (
            <Fallback className="h-full w-full text-tinte-hell" />
          )}
        </div>
      </Container>

      <Container>
        <div className="nora-grid gap-y-10 py-10 md:py-14">
          <div className="col-span-12 md:col-span-7">
            <div className="flex items-start justify-between gap-4">
              <h1 className="nora-h1 text-[clamp(32px,3vw+20px,56px)]">{property.title}</h1>
              {property.isExample ? (
                <span className="nora-nav-label mt-2 shrink-0 border border-sandstein/50 px-2 py-0.5 text-tinte-hell print:hidden">
                  Beispiel
                </span>
              ) : null}
            </div>

            <dl className="nora-grid mt-8 gap-y-4">
              {fakten
                .filter(([, value]) => value)
                .map(([label, value]) => (
                  <div key={label} className="col-span-6 border-t border-sandstein/30 pt-3 sm:col-span-4">
                    <dt className="nora-nav-label text-tinte-hell">{label}</dt>
                    <dd className="nora-prose mt-1 text-[16px] tabular-nums">{value}</dd>
                  </div>
                ))}
            </dl>

            {property.merkmale && property.merkmale.length > 0 ? (
              <div className="mt-10">
                <h2 className="nora-h3">Ausstattung</h2>
                <ul className="nora-grid mt-4 gap-y-2">
                  {property.merkmale.map((m) => (
                    <li key={m} className="nora-prose col-span-6 text-[16px] sm:col-span-4">
                      {MERKMAL_LABEL[m] ?? m}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {property.beschreibung ? (
              <div className="mt-10">
                <h2 className="nora-h3">Beschreibung</h2>
                <Prose data={property.beschreibung} className="mt-4" />
              </div>
            ) : null}

            {property.lage ? (
              <div className="mt-10">
                <h2 className="nora-h3">Lage</h2>
                <Prose data={property.lage} className="mt-4" />
              </div>
            ) : null}

            {marker ? (
              <div className="mt-6 print:hidden">
                <div className="h-[320px] w-full">
                  <LazyPropertyMap markers={[marker]} />
                </div>
                {marker.approximate ? (
                  <p className="nora-prose mt-2 text-[14px] text-tinte-hell">
                    Zum Schutz der Privatsphäre zeigen wir nur die ungefähre Lage (Kreis {property.kreis}), keine
                    genaue Adresse.
                  </p>
                ) : null}
              </div>
            ) : null}

            {dokumente.length > 0 ? (
              <div className="mt-10 print:hidden">
                <h2 className="nora-h3">Dokumente</h2>
                <ul className="mt-4 flex flex-col gap-2">
                  {dokumente.map((doc) => (
                    <li key={doc.id}>
                      <a href={doc.url ?? undefined} download className="nora-prose text-[16px] underline hover:text-fensterladen">
                        {doc.alt}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <aside className="col-span-12 md:col-span-4 md:col-start-9">
            <div className="md:sticky md:top-24 print:hidden">
              <div className="border border-sandstein/40 p-6">
                {preis ? <p className="nora-h2">{preis}</p> : null}
                <a
                  href="#besichtigung"
                  className="nora-button-label mt-6 block bg-fensterladen px-6 py-3 text-center text-weiss hover:opacity-90"
                >
                  Besichtigung anfragen
                </a>
                {dokumente.length > 0 ? (
                  <a
                    href={dokumente[0].url ?? undefined}
                    download
                    className="nora-button-label mt-3 block border border-sandstein/50 px-6 py-3 text-center hover:border-tinte"
                  >
                    Dokumentation herunterladen
                  </a>
                ) : (
                  <p className="nora-prose mt-3 text-[14px] text-tinte-hell">
                    Dokumentation auf Anfrage.
                  </p>
                )}
                <div className="mt-4">
                  <ShareButton title={property.title} url={pageUrl} />
                </div>
              </div>

              {property.ansprechperson && typeof property.ansprechperson === 'object' ? (
                <div className="mt-8">
                  <p className="nora-nav-label mb-4 text-tinte-hell">Ihre Ansprechperson</p>
                  <TeamMember member={property.ansprechperson} />
                </div>
              ) : null}
            </div>
          </aside>
        </div>
      </Container>

      <section id="besichtigung" className="border-t border-sandstein/30 py-14 md:py-20 print:hidden">
        <Container>
          <h2 className="nora-h2">Besichtigung anfragen</h2>
          <div className="nora-grid mt-6 max-w-3xl gap-y-5">
            <div className="col-span-12 md:col-span-6">
              <TextField label="Name" />
            </div>
            <div className="col-span-12 md:col-span-6">
              <TextField label="Telefon" type="tel" />
            </div>
            <div className="col-span-12 md:col-span-6">
              <TextField label="E-Mail" type="email" />
            </div>
            <div className="col-span-12 md:col-span-6">
              <SelectField label="Anzahl Personen" options={['1', '2', '3', '4+']} />
            </div>
            <div className="col-span-12 md:col-span-6">
              <TextField label="Wunschtermin 1" type="datetime-local" />
            </div>
            <div className="col-span-12 md:col-span-6">
              <TextField label="Wunschtermin 2" type="datetime-local" />
            </div>
            <div className="col-span-12">
              <TextareaField label="Nachricht" />
            </div>
            <FormShapeFooter />
          </div>
        </Container>
      </section>
    </>
  )
}
