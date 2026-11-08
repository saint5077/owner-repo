import Link from 'next/link'

import { Container } from '@/components/layout/Container'
import { FormShapeFooter, SelectField, TextField, TextareaField } from '@/components/forms/FieldShape'

export const revalidate = 86400

export const metadata = { title: 'Schaden melden — Nora Immobilien AG' }

const SCHRITTE = [
  { nr: 1, titel: 'Notfall?' },
  { nr: 2, titel: 'Liegenschaft und Wohnung' },
  { nr: 3, titel: 'Kategorie und Beschreibung' },
  { nr: 4, titel: 'Fotos' },
  { nr: 5, titel: 'Erreichbarkeit und Kontaktdaten' },
]

/**
 * Statische Feld-„Form" der mehrstufigen Schadenmeldung (Briefing §9.3) — die eigentliche
 * Schritt-für-Schritt-Logik inkl. Validierung, Upload und Versand kommt in Phase 6. Hier stehen
 * alle Schritte bereits sichtbar untereinander, damit Layout/Feldraster jetzt geprüft werden kann.
 */
export default function SchadenmeldungPage() {
  return (
    <Container>
      <section className="py-10 md:py-16">
        <p className="nora-nav-label text-tinte-hell">
          <Link href="/mieterservice" className="hover:text-fensterladen">
            Mieterservice
          </Link>{' '}
          / Schaden melden
        </p>
        <h1 className="nora-h1 mt-3 max-w-2xl">Schaden melden</h1>
        <p className="nora-lead mt-6">
          Handelt es sich um einen Notfall, beachten Sie bitte zuerst die Notfall-Hinweise im{' '}
          <Link href="/mieterservice" className="hover:text-fensterladen">
            Mieterservice
          </Link>
          .
        </p>
      </section>

      <div className="flex flex-col gap-14 border-t border-sandstein/30 py-14 md:py-20">
        {SCHRITTE.map((schritt) => (
          <div key={schritt.nr}>
            <p className="nora-nav-label text-tinte-hell">{schritt.nr}</p>
            <h2 className="nora-h2 mt-1">{schritt.titel}</h2>

            <div className="nora-grid mt-6 gap-y-5">
              {schritt.nr === 1 ? (
                <div className="col-span-12 md:col-span-6">
                  <SelectField label="Ist dies ein Notfall?" options={['Nein', 'Ja']} />
                </div>
              ) : null}

              {schritt.nr === 2 ? (
                <>
                  <div className="col-span-12 md:col-span-6">
                    <TextField label="Liegenschaft (Adresse)" />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <TextField label="Wohnung" />
                  </div>
                </>
              ) : null}

              {schritt.nr === 3 ? (
                <>
                  <div className="col-span-12 md:col-span-6">
                    <SelectField
                      label="Kategorie"
                      options={[
                        'Sanitär',
                        'Heizung',
                        'Elektro',
                        'Küche/Geräte',
                        'Fenster/Türen',
                        'Lift',
                        'Allgemeinflächen',
                        'Anderes',
                      ]}
                    />
                  </div>
                  <div className="col-span-12">
                    <TextareaField label="Beschreibung" />
                  </div>
                </>
              ) : null}

              {schritt.nr === 4 ? (
                <div className="col-span-12">
                  <label className="block">
                    <span className="nora-nav-label mb-2 block text-tinte-hell">
                      Fotos (bis zu 5, JPG/PNG/HEIC, je max. 8 MB)
                    </span>
                    <input type="file" disabled multiple className="nora-prose w-full border border-sandstein/50 bg-weiss px-4 py-3 text-[15px]" />
                  </label>
                </div>
              ) : null}

              {schritt.nr === 5 ? (
                <>
                  <div className="col-span-12 md:col-span-6">
                    <TextField label="Erreichbarkeit (Telefon)" type="tel" />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <SelectField label="Zutritt bei Abwesenheit erlaubt?" options={['Nein', 'Ja']} />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <TextField label="Name" />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <TextField label="E-Mail" type="email" />
                  </div>
                  <FormShapeFooter />
                </>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </Container>
  )
}
