'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Nur Seiten, die diese Phase tatsächlich übersetzt hat — siehe CONTENT_TODO.md für die übrigen.
const EN_FOR_DE: Record<string, string> = { '/': '/en', '/bewirtschaftung': '/en/bewirtschaftung' }
const DE_FOR_EN: Record<string, string> = { '/en': '/', '/en/bewirtschaftung': '/bewirtschaftung' }

export function LanguageSwitch() {
  const pathname = usePathname() || '/'
  const isEnglish = pathname === '/en' || pathname.startsWith('/en/')
  const deHref = isEnglish ? (DE_FOR_EN[pathname] ?? '/') : pathname
  const enHref = isEnglish ? pathname : (EN_FOR_DE[pathname] ?? null)

  return (
    <div className="nora-nav-label flex items-center gap-3 text-tinte-hell">
      <Link
        href={deHref}
        aria-current={!isEnglish ? 'true' : undefined}
        className={!isEnglish ? 'text-tinte' : 'hover:text-fensterladen'}
      >
        DE
      </Link>
      {enHref ? (
        <Link
          href={enHref}
          aria-current={isEnglish ? 'true' : undefined}
          className={isEnglish ? 'text-tinte' : 'hover:text-fensterladen'}
        >
          EN
        </Link>
      ) : (
        // `opacity-50` schwächte den ohnehin schon gedämpften `text-tinte-hell`-Ton (vom
        // übergeordneten div geerbt) auf einen Kontrast von 2.16:1 ab — unter der WCAG-AA-
        // Schwelle von 4.5:1 (axe-core, Phase 8). "Deaktiviert" wird jetzt über `cursor-not-
        // allowed` und `aria-disabled` statt über Farbe vermittelt; die Textfarbe bleibt beim
        // bereits konformen `text-tinte-hell` (~6:1 auf Kalk, DESIGN.md §4).
        <span aria-disabled="true" className="cursor-not-allowed" title="Für diese Seite noch keine englische Version.">
          EN
        </span>
      )}
    </div>
  )
}
