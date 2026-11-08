import type { CSSProperties } from 'react'
import { useId } from 'react'

type LogoProps = {
  className?: string
  title?: string
  style?: CSSProperties
}

/**
 * SVG-Nachzeichnung von reference/assets/logo.png (73×138 px, einzige je vorhandene Auflösung).
 * Koordinaten stammen aus einer pixelgenauen Analyse der Originaldatei (Zeilen-/Spalten-
 * Laufweitenanalyse, siehe DECISIONS.md) — Silhouette, Fensterraster (3 Fenster je Etage, 3
 * Etagen) und das breite Ladengeschoss-Fenster unten sind 1:1 aus dem Original übernommen, nicht
 * neu gestaltet (Briefing §2.4: Logo nie verändern oder neu interpretieren). viewBox 0 0 73 138
 * entspricht exakt dem Pixelraster der Vorlage.
 */
export function Logo({ className, title = 'Nora Immobilien AG', style }: LogoProps) {
  const maskId = useId()

  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 73 138"
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      {/* Satteldach */}
      <polygon points="36,0 1,35 71,35" fill="var(--color-logo-rot, #e92624)" />

      {/* Baukörper mit Fensterraster — Fenster/Ladengeschoss-Öffnung als Maskenausschnitt,
          damit das Logo auf jedem Hintergrund (auch dunkel, z. B. Admin-Sidebar) transparent bleibt. */}
      <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="35" width="73" height="103">
        <rect x="0" y="35" width="73" height="103" fill="#fff" />
        {/* Etage 1 */}
        <rect x="8" y="48" width="13" height="20" fill="#000" />
        <rect x="30" y="48" width="13" height="20" fill="#000" />
        <rect x="51" y="48" width="14" height="20" fill="#000" />
        {/* Etage 2 */}
        <rect x="8" y="78" width="13" height="20" fill="#000" />
        <rect x="30" y="78" width="13" height="20" fill="#000" />
        <rect x="51" y="78" width="14" height="20" fill="#000" />
        {/* Etage 3 — die mittlere Fensterachse setzt sich hier als Hauseingang bis zum Boden fort */}
        <rect x="8" y="107" width="13" height="19" fill="#000" />
        <rect x="51" y="107" width="14" height="19" fill="#000" />
        <rect x="29" y="107" width="14" height="28" fill="#000" />
      </mask>
      <rect x="0" y="35" width="73" height="103" fill="var(--color-logo-grau, #b4b4b6)" mask={`url(#${maskId})`} />
    </svg>
  )
}
