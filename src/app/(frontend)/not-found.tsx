import { Container } from '@/components/layout/Container'
import { NotFoundContent } from '@/components/ui/NotFoundContent'

export const metadata = { title: 'Seite nicht gefunden — Nora Immobilien AG' }

/**
 * Greift, wenn innerhalb des (frontend)-Baums `notFound()` geworfen wird oder ein Pfad unterhalb
 * dieser Gruppe nicht existiert. Für wirklich beliebige, nicht zuordenbare URLs (dieses Projekt
 * hat mehrere Root-Layouts — (frontend) und (payload) — und damit kein gemeinsames Root-Layout,
 * von dem aus Next ein globales 404 zusammensetzen könnte) übernimmt `app/global-not-found.tsx`.
 */
export default function NotFound() {
  return (
    <Container>
      <NotFoundContent />
    </Container>
  )
}
