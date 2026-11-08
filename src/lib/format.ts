const chf = new Intl.NumberFormat('de-CH', {
  style: 'currency',
  currency: 'CHF',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

/** CHF 2'450.– Schreibweise (Schweizer Typografie, DESIGN.md §5). */
export function formatCHF(amount: number | null | undefined): string | null {
  if (typeof amount !== 'number') return null
  return `${chf.format(amount)}.–`
}

/** 3.5 → "3½ Zimmer", 1 → "1 Zimmer" (echter Bruch, DESIGN.md §5). */
export function formatZimmer(zimmer: number | null | undefined): string | null {
  if (typeof zimmer !== 'number') return null
  const ganz = Math.floor(zimmer)
  const hatHalb = zimmer - ganz >= 0.5
  const zahl = hatHalb ? `${ganz || ''}½` : `${ganz}`
  return `${zahl} Zimmer`
}

export function formatFlaeche(m2: number | null | undefined): string | null {
  if (typeof m2 !== 'number') return null
  return `${new Intl.NumberFormat('de-CH').format(m2)} m²`
}

const KREIS_LABEL: Record<string, string> = Object.fromEntries(
  Array.from({ length: 12 }, (_, i) => [String(i + 1), `Kreis ${i + 1}`]),
)

export function formatOrt(kreis: string | null | undefined, ort: string | null | undefined): string {
  const kreisLabel = kreis ? KREIS_LABEL[kreis] : null
  if (kreisLabel && ort) return `${ort}, ${kreisLabel}`
  return ort ?? kreisLabel ?? 'Zürich'
}
