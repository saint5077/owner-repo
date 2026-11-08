import Link from 'next/link'

import { Container } from '@/components/layout/Container'
import { Prose } from '@/components/ui/Prose'
import { DraftBox, DraftNotice } from '@/components/ui/DraftNotice'
import { getPayloadClient } from '@/lib/payload'

export const revalidate = 86400

export const metadata = { title: 'Mieterservice — Nora Immobilien AG' }

export default async function MieterservicePage() {
  const payload = await getPayloadClient()
  const tenantService = await payload.findGlobal({ slug: 'tenantService' }).catch(() => null)

  return (
    <>
      <Container>
        <section className="nora-grid items-center gap-y-8 py-10 md:py-16">
          <div className="col-span-12 md:col-span-7">
            <h1 className="nora-h1">Mieterservice</h1>
            <p className="nora-lead mt-6">
              Schaden melden, Notfall-Hinweise und Formulare für die Mieterschaft von Nora Immobilien.
            </p>
            <Link
              href="/mieterservice/schadenmeldung"
              className="nora-button-label mt-8 inline-block bg-fensterladen px-6 py-3 text-weiss hover:opacity-90"
            >
              Schaden melden
            </Link>
          </div>
        </section>
      </Container>

      <section className="border-t border-sandstein/30 py-14 md:py-20">
        <Container>
          <DraftBox title="Notfall">
            <Prose data={tenantService?.notfallText} className="text-[15px]" />
          </DraftBox>
          {tenantService?.notfallStatusHinweis ? (
            <p className="nora-nav-label mt-3 text-tinte-hell">{tenantService.notfallStatusHinweis}</p>
          ) : null}
        </Container>
      </section>

      <section className="border-t border-sandstein/30 py-14 md:py-20">
        <Container>
          <h2 className="nora-h2">Formulare zum Download</h2>
          <p className="nora-prose mt-4 text-tinte-hell">
            Formulare wie Kündigung, Untermiete oder die Checkliste zur Wohnungsabgabe folgen in Kürze.
          </p>
        </Container>
      </section>

      {tenantService?.faq && tenantService.faq.length > 0 ? (
        <section className="border-t border-sandstein/30 py-14 md:py-20">
          <Container>
            <h2 className="nora-h2">Häufige Fragen</h2>
            <dl className="mt-8 flex flex-col gap-8">
              {tenantService.faq.map((eintrag) => (
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
    </>
  )
}
