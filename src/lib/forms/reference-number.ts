const PREFIXE: Record<string, string> = {
  verwaltung: 'VW',
  ersteinschaetzung: 'EK',
  schaden: 'SM',
  besichtigung: 'BS',
  allgemein: 'AN',
}

// 36^4 = 1'679'616 mögliche Suffixe — der volle Wertebereich eines vierstelligen Base36-Strings.
const SUFFIX_RAUM = 36 ** 4

/**
 * Referenznummer im Format `XX-JJJJ-XXXX` (Briefing §9 Beispiel: SM-2026-7F3K) — Präfix nach
 * Formulartyp, aktuelles Jahr, vierstelliges Base36-Suffix aus `crypto.getRandomValues`.
 * Ein `Uint32`-Zufallswert wird per Modulo auf den vollen 36^4-Suffixraum abgebildet (der sich
 * ~2558-mal in 2^32 wiederholt — der dadurch entstehende Bias ist für eine Referenznummer
 * irrelevant, kein kryptografischer Anwendungsfall). Echte Eindeutigkeit erzwingt zusätzlich der
 * `unique`-Index auf `submissions.referenznummer`; ein Konflikt dort führt zu einem Neuversuch.
 */
export function generateReferenceNumber(type: keyof typeof PREFIXE | string): string {
  const prefix = PREFIXE[type] ?? 'AN'
  const year = new Date().getFullYear()
  const random = crypto.getRandomValues(new Uint32Array(1))[0] % SUFFIX_RAUM
  const suffix = random.toString(36).toUpperCase().padStart(4, '0')
  return `${prefix}-${year}-${suffix}`
}
