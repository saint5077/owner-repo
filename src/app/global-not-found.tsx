import Link from 'next/link'

import { Logo } from '@/components/branding/Logo'
import { Container } from '@/components/layout/Container'
import { NotFoundContent } from '@/components/ui/NotFoundContent'
import { archivo, literata } from './(frontend)/fonts'

import './(frontend)/styles.css'

export const metadata = { title: 'Seite nicht gefunden — Nora Immobilien AG' }

/**
 * `global-not-found.js` (experimental, next.config.ts: `experimental.globalNotFound`) — laut
 * Next-Doku nötig, weil dieses Projekt mehrere Root-Layouts hat ((frontend) und (payload), je
 * mit eigenem <html>/<body>) und es deshalb kein einzelnes Layout gibt, aus dem sich ein
 * normales `app/not-found.tsx` für wirklich beliebige, keiner Gruppe zuordenbare URLs
 * zusammensetzen liesse. Bewusst eigenständig und ohne Payload-Datenabhängigkeit (kein
 * `getPayloadClient()`-Aufruf) — die Doku warnt, dass diese Datei das normale Rendering umgeht,
 * daher hier nur statisches Markup statt des interaktiven `Header` (der Telefonnummer lädt).
 */
export default function GlobalNotFound() {
  return (
    <html lang="de-CH" className={`${archivo.variable} ${literata.variable}`}>
      <body>
        <header className="border-b border-sandstein/30 bg-kalk">
          <Container className="flex h-16 items-center md:h-20">
            <Link href="/" className="flex items-center gap-3" aria-label="Nora Immobilien AG — Startseite">
              <Logo className="h-9 w-auto text-tinte md:h-11" />
              <span className="nora-nav-label">Nora Immobilien</span>
            </Link>
          </Container>
        </header>
        <main>
          <Container>
            <NotFoundContent />
          </Container>
        </main>
      </body>
    </html>
  )
}
