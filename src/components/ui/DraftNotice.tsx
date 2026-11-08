import type { ReactNode } from 'react'

/**
 * Kennzeichnet unbestätigten Entwurfsinhalt im Produkt selbst (nicht nur in CONTENT_TODO.md) —
 * bewusst als ruhiger Fliesstext-Satz, keine Eyebrow-Label-über-Headline-Konstruktion und keine
 * Grossbuchstaben (DESIGN.md §10 "Vermeiden"). Platzierung: direkt nach dem betroffenen Inhalt.
 */
export function DraftNotice({ children }: { children?: ReactNode }) {
  return (
    <p className="nora-prose mt-3 text-[15px] text-tinte-hell">
      {children ?? 'Entwurf — noch nicht vom Kunden bestätigt.'}
    </p>
  )
}

/** Grössere, umrandete Variante für ganze Abschnitte (z. B. die Notfall-Box). Kein Radius/Schatten. */
export function DraftBox({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="border border-sandstein/40 px-6 py-5">
      {title ? <p className="nora-h3 mb-2">{title}</p> : null}
      <div className="nora-prose text-[15px] text-tinte-hell">{children}</div>
    </div>
  )
}
