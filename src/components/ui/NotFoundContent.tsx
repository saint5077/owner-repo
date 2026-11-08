import Link from 'next/link'

import { HausOffeneTuer } from '@/components/drawings'

/**
 * Gemeinsamer Inhalt für `(frontend)/not-found.tsx` (rendert innerhalb des normalen Root-Layouts,
 * Header/Footer bereits vorhanden) und `global-not-found.tsx` (rendert eigenständig, siehe dort) —
 * Briefing §6 „Rechtliches, 404, Fehler": sagen was passiert ist, kein Technik-Jargon, hilfreiche Links.
 */
export function NotFoundContent() {
  return (
    <div className="nora-grid items-center gap-y-10 py-16 md:py-24">
      <div className="col-span-12 md:col-span-6 md:pr-8">
        <h1 className="nora-h2">Diese Seite gibt es nicht.</h1>
        <p className="nora-lead mt-4">
          Der Link ist entweder veraltet, oder Sie haben sich vertippt. Hier geht es weiter:
        </p>
        <ul className="nora-prose mt-6 flex flex-col gap-2">
          <li>
            <Link href="/" className="hover:text-fensterladen">
              Zur Startseite
            </Link>
          </li>
          <li>
            <Link href="/objekte" className="hover:text-fensterladen">
              Freie Objekte ansehen
            </Link>
          </li>
          <li>
            <Link href="/kontakt" className="hover:text-fensterladen">
              Kontakt aufnehmen
            </Link>
          </li>
        </ul>
      </div>
      <div className="col-span-12 md:col-span-6">
        <HausOffeneTuer className="w-full max-w-sm text-tinte" />
      </div>
    </div>
  )
}
