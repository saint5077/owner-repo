import { Container } from '@/components/layout/Container'
import { DraftNotice } from '@/components/ui/DraftNotice'
import { Prose } from '@/components/ui/Prose'
import { getPayloadClient } from '@/lib/payload'
import { pageMetadata } from '@/lib/seo'

export const revalidate = 86400

export const metadata = pageMetadata({
  title: 'Datenschutz',
  description: 'Datenschutzerklärung der Nora Immobilien AG nach Schweizer Recht (revDSG).',
  dePath: '/datenschutz',
})

export default async function DatenschutzPage() {
  const payload = await getPayloadClient()
  const legal = await payload.findGlobal({ slug: 'legal' }).catch(() => null)

  return (
    <Container>
      <section className="py-10 md:py-16">
        <h1 className="nora-h1">Datenschutz</h1>
        {legal?.statusHinweis ? <DraftNotice>{legal.statusHinweis}</DraftNotice> : null}
      </section>
      <section className="border-t border-sandstein/30 py-14 md:py-20">
        <Prose data={legal?.datenschutz} />
      </section>
    </Container>
  )
}
