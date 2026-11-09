import Link from 'next/link'

import { Container } from '@/components/layout/Container'
import { getPayloadClient } from '@/lib/payload'
import { pageMetadata } from '@/lib/seo'

import { SchadenmeldungForm } from './SchadenmeldungForm'

export const revalidate = 86400

export const metadata = pageMetadata({
  title: 'Schaden melden',
  description: 'Schaden an Ihrer Mietwohnung melden — Mieterservice der Nora Immobilien AG.',
  dePath: '/mieterservice/schadenmeldung',
})

export default async function SchadenmeldungPage() {
  const payload = await getPayloadClient()
  const tenantService = await payload.findGlobal({ slug: 'tenantService' }).catch(() => null)

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

      <div className="border-t border-sandstein/30 py-14 md:py-20">
        <SchadenmeldungForm notfallProse={tenantService?.notfallText} />
      </div>
    </Container>
  )
}
