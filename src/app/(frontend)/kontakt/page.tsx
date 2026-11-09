import { Container } from '@/components/layout/Container'
import { KontaktBlock } from '@/components/contact/KontaktBlock'
import { getPayloadClient } from '@/lib/payload'
import { pageMetadata } from '@/lib/seo'

import { KontaktForm } from './KontaktForm'

export const revalidate = 86400

export const metadata = pageMetadata({
  title: 'Kontakt',
  description: 'Kontaktieren Sie Nora Immobilien AG — Langstrasse 14, 8004 Zürich, +41 44 495 70 70.',
  dePath: '/kontakt',
})

export default async function KontaktPage({
  searchParams,
}: {
  searchParams: Promise<{ anliegen?: string }>
}) {
  const payload = await getPayloadClient()
  const siteSettings = await payload.findGlobal({ slug: 'siteSettings' }).catch(() => null)
  const { anliegen } = await searchParams

  return (
    <Container>
      <section className="py-10 md:py-16">
        <h1 className="nora-h1 max-w-2xl">Kontaktieren Sie uns</h1>
      </section>

      <div className="nora-grid gap-y-14 border-t border-sandstein/30 py-14 md:py-20">
        <div className="col-span-12 md:col-span-7">
          <KontaktForm anliegenInitial={anliegen} />
        </div>

        <div className="col-span-12 md:col-span-4 md:col-start-9">
          <KontaktBlock siteSettings={siteSettings} />
        </div>
      </div>
    </Container>
  )
}
