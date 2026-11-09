import { Container } from '@/components/layout/Container'

import { UnsubscribeButton } from './UnsubscribeButton'

export const metadata = { title: 'Suchabo abmelden — Nora Immobilien AG' }

export default async function SuchaboAbmeldenPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams

  return (
    <Container>
      <section className="py-16 md:py-24">
        {token ? (
          <UnsubscribeButton token={token} />
        ) : (
          <>
            <h1 className="nora-h1 max-w-xl">Dieser Link ist unvollständig.</h1>
            <p className="nora-lead mt-6 max-w-xl">Bitte verwenden Sie den Abmeldelink aus einer unserer E-Mails.</p>
          </>
        )}
      </section>
    </Container>
  )
}
