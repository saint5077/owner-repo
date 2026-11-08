import { Suspense } from 'react'

import { Container } from '@/components/layout/Container'
import { KontaktBlock } from '@/components/contact/KontaktBlock'
import { AnliegenSelect } from '@/components/forms/AnliegenSelect'
import { FormShapeFooter, TextField, TextareaField } from '@/components/forms/FieldShape'
import { getPayloadClient } from '@/lib/payload'

export const revalidate = 86400

export const metadata = { title: 'Kontakt — Nora Immobilien AG' }

export default async function KontaktPage() {
  const payload = await getPayloadClient()
  const siteSettings = await payload.findGlobal({ slug: 'siteSettings' }).catch(() => null)

  return (
    <Container>
      <section className="py-10 md:py-16">
        <h1 className="nora-h1 max-w-2xl">Kontaktieren Sie uns</h1>
      </section>

      <div className="nora-grid gap-y-14 border-t border-sandstein/30 py-14 md:py-20">
        <div className="col-span-12 md:col-span-7">
          <div className="nora-grid gap-y-5">
            <div className="col-span-12">
              <Suspense fallback={null}>
                <AnliegenSelect />
              </Suspense>
            </div>
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

        <div className="col-span-12 md:col-span-4 md:col-start-9">
          <KontaktBlock siteSettings={siteSettings} />
        </div>
      </div>
    </Container>
  )
}
