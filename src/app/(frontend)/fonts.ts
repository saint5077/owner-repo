import { Archivo, Literata } from 'next/font/google'

/**
 * Archivo: Headlines/Navigation/Buttons/Daten. Variable Achse `wdth` wird explizit angefordert
 * (next/font/google lädt bei Variable Fonts standardmässig nur `wght`) — siehe DESIGN.md §5 und
 * DECISIONS.md für die Bestätigung, dass Archivo die `wdth`-Achse tatsächlich unterstützt.
 */
export const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'swap',
})

/** Literata: Fliesstext. */
export const literata = Literata({
  subsets: ['latin'],
  variable: '--font-literata',
  display: 'swap',
})
