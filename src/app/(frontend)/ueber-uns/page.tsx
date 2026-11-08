import Image from 'next/image'

import { Container } from '@/components/layout/Container'
import { TeamMember } from '@/components/team/TeamMember'
import { Prose } from '@/components/ui/Prose'
import { getPayloadClient } from '@/lib/payload'
import { getJahreSeitGruendung } from '@/lib/years'

export const revalidate = 86400

export const metadata = { title: 'Über uns — Nora Immobilien AG' }

export default async function UeberUnsPage() {
  const payload = await getPayloadClient()
  const [about, teamResult] = await Promise.all([
    payload.findGlobal({ slug: 'about' }).catch(() => null),
    payload.find({ collection: 'team', sort: 'reihenfolge', limit: 10 }).catch(() => null),
  ])
  const team = teamResult?.docs ?? []
  const jahre = getJahreSeitGruendung()

  return (
    <>
      <Container>
        <section className="py-10 md:py-16">
          <h1 className="nora-h1 max-w-3xl">Ihr verlässlicher Partner seit 1979</h1>
          <p className="nora-lead mt-6">
            Seit {jahre} Jahren ein kleines, unabhängiges Team in Privatbesitz — mit einer klaren Haltung.
          </p>
        </section>
      </Container>

      <section className="border-t border-sandstein/30 py-14 md:py-20">
        <Container>
          <Prose data={about?.haltungText} />
        </Container>
      </section>

      {team.length > 0 ? (
        <section className="border-t border-sandstein/30 py-14 md:py-20">
          <Container>
            <h2 className="nora-h2">Team</h2>
            <div className="nora-grid mt-8 gap-y-10">
              {team.map((member) => (
                <div key={member.id} className="col-span-6 md:col-span-3">
                  <TeamMember member={member} />
                </div>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <section className="border-t border-sandstein/30 py-14 md:py-20">
        <Container>
          <h2 className="nora-h2">Mitgliedschaften</h2>
          <div className="mt-8 flex flex-wrap items-center gap-10">
            <div className="flex items-center gap-4">
              <Image src="/branding/logo-svit.png" alt="SVIT" width={120} height={63} className="h-auto w-28 object-contain" />
              <p className="nora-prose text-[15px] text-tinte-hell">
                Schweizerischer Verband
                <br />
                der Immobilien-Treuhänder
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Image
                src="/branding/logo-fiabci.png"
                alt="FIABCI"
                width={95}
                height={59}
                className="h-auto w-24 object-contain"
              />
              <p className="nora-prose text-[15px] text-tinte-hell">
                International
                <br />
                Real Estate Federation
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
