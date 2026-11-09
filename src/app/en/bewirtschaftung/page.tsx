import Link from 'next/link'

import { Container } from '@/components/layout/Container'
import { MFHAnsicht } from '@/components/drawings'
import { Prose } from '@/components/ui/Prose'
import { getPayloadClient } from '@/lib/payload'

export const revalidate = 86400

export const metadata = {
  title: 'Property Management',
  description:
    'We look after your property as if it were our own. Reliability and accuracy come first when managing the commercial and residential properties entrusted to us.',
  alternates: { canonical: '/en/bewirtschaftung', languages: { 'de-CH': '/bewirtschaftung', en: '/en/bewirtschaftung' } },
}

async function getService() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'services',
    where: { serviceType: { equals: 'bewirtschaftung' } },
    locale: 'en',
    limit: 1,
  })
  return result.docs[0] ?? null
}

export default async function EnglishBewirtschaftungPage() {
  const service = await getService()
  const leistungsgruppe = service?.leistungsgruppen?.[0]

  return (
    <>
      <Container>
        <section className="nora-grid items-center gap-y-10 py-10 md:py-16">
          <div className="col-span-12 md:col-span-6 md:pr-8">
            <p className="nora-nav-label text-tinte-hell">
              <Link href="/en" className="hover:text-fensterladen">
                Home
              </Link>{' '}
              / Services
            </p>
            <h1 className="nora-h1 mt-3">Property Management</h1>
            {service?.claim ? <p className="nora-lead mt-4">{service.claim}</p> : null}
          </div>
          <div className="col-span-12 md:col-span-6">
            <MFHAnsicht className="w-full text-tinte" />
          </div>
        </section>
      </Container>

      <section className="border-t border-sandstein/30 py-14 md:py-20">
        <Container>
          {service?.einleitung ? <Prose data={service.einleitung} /> : null}

          {leistungsgruppe?.punkte && leistungsgruppe.punkte.length > 0 ? (
            <div className="mt-10">
              <h2 className="nora-h2">{leistungsgruppe.titel ?? 'What we take care of'}</h2>
              <ul className="nora-grid mt-6 gap-y-3">
                {leistungsgruppe.punkte.map((punkt) => (
                  <li key={punkt.id} className="nora-prose col-span-12 border-t border-sandstein/30 py-3 md:col-span-6">
                    {punkt.text}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Container>
      </section>

      <section id="anfrage" className="border-t border-sandstein/30 py-14 md:py-20">
        <Container>
          <h2 className="nora-h2">Get in touch</h2>
          <p className="nora-prose mt-4 max-w-prose text-tinte-hell">
            Our enquiry form is currently only available in German. Please{' '}
            <Link href="/bewirtschaftung#anfrage" className="hover:text-fensterladen">
              use the German form
            </Link>{' '}
            — we are happy to reply in English — or reach us directly by phone or email, see the footer below.
          </p>
        </Container>
      </section>
    </>
  )
}
