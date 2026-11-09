import { Container } from '@/components/layout/Container'
import { DraftNotice } from '@/components/ui/DraftNotice'
import { Prose } from '@/components/ui/Prose'
import { getPayloadClient } from '@/lib/payload'
import { pageMetadata } from '@/lib/seo'

export const revalidate = 86400

export const metadata = pageMetadata({
  title: 'Impressum',
  description: 'Impressum der Nora Immobilien AG, Langstrasse 14, 8004 Zürich.',
  dePath: '/impressum',
})

export default async function ImpressumPage() {
  const payload = await getPayloadClient()
  const legal = await payload.findGlobal({ slug: 'legal' }).catch(() => null)

  return (
    <Container>
      <section className="py-10 md:py-16">
        <h1 className="nora-h1">Impressum</h1>
        {legal?.statusHinweis ? <DraftNotice>{legal.statusHinweis}</DraftNotice> : null}
      </section>
      <section className="border-t border-sandstein/30 py-14 md:py-20">
        <Prose data={legal?.impressum} />
      </section>
    </Container>
  )
}
