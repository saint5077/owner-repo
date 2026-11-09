import { Container } from '@/components/layout/Container'

import { ConfirmButton } from './ConfirmButton'

export const metadata = { title: 'Suchabo bestätigen — Nora Immobilien AG' }

export default async function SuchaboBestaetigenPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams

  return (
    <Container>
      <section className="py-16 md:py-24">
        {token ? (
          <ConfirmButton token={token} />
        ) : (
          <>
            <h1 className="nora-h1 max-w-xl">Dieser Link ist unvollständig.</h1>
            <p className="nora-lead mt-6 max-w-xl">Bitte verwenden Sie den Link aus der Bestätigungs-E-Mail.</p>
          </>
        )}
      </section>
    </Container>
  )
}
