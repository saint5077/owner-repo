import Link from 'next/link'

type MobileActionBarProps = { telefon?: string; locale?: 'de' | 'en' }

export function MobileActionBar({ telefon, locale = 'de' }: MobileActionBarProps) {
  const t =
    locale === 'en'
      ? { anrufen: 'Call', schaden: 'Report damage', objekte: 'Properties' }
      : { anrufen: 'Anrufen', schaden: 'Schaden melden', objekte: 'Objekte' }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-sandstein/30 bg-weiss lg:hidden print:hidden">
      <div className="grid grid-cols-3">
        {telefon ? (
          <a
            href={`tel:${telefon.replace(/\s|\(0\)/g, '')}`}
            className="nora-nav-label flex flex-col items-center gap-1 py-2.5 text-tinte"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.25">
              <path d="M4 3h3l1.5 4L6.5 8.5a9 9 0 0 0 5 5L13 11.5l4 1.5v3a2 2 0 0 1-2.2 2A15 15 0 0 1 2 4.2 2 2 0 0 1 4 3Z" />
            </svg>
            {t.anrufen}
          </a>
        ) : (
          <span />
        )}
        <Link href="/mieterservice/schadenmeldung" className="nora-nav-label flex flex-col items-center gap-1 py-2.5 text-tinte">
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.25">
            <path d="M10 3 2 17h16L10 3Z" />
            <line x1="10" y1="8.5" x2="10" y2="12.5" />
            <circle cx="10" cy="14.5" r="0.6" fill="currentColor" stroke="none" />
          </svg>
          {t.schaden}
        </Link>
        <Link href="/objekte" className="nora-nav-label flex flex-col items-center gap-1 py-2.5 text-tinte">
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.25">
            <rect x="4" y="7" width="12" height="10" />
            <polygon points="3,7 10,2 17,7" />
            <rect x="8.5" y="11" width="3" height="6" />
          </svg>
          {t.objekte}
        </Link>
      </div>
    </div>
  )
}
