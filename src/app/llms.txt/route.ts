import { getPayloadClient } from '@/lib/payload'
import { getSiteUrl } from '@/lib/seo'

/**
 * Nur bestätigte Fakten — dieselbe "nichts erfinden"-Regel wie überall sonst im Projekt gilt
 * hier mit voller Härte: UID, Handelsregister und Öffnungszeiten fehlen bewusst, solange sie in
 * CONTENT_TODO.md als unbestätigt geführt werden, statt als Platzhalter ausgegeben zu werden.
 */
export async function GET() {
  const payload = await getPayloadClient()
  const siteSettings = await payload.findGlobal({ slug: 'siteSettings' }).catch(() => null)
  const firma = siteSettings?.firma
  const base = getSiteUrl()

  const mitgliedschaften = (siteSettings?.mitgliedschaften ?? []).map((m) => m.name).filter(Boolean)

  const lines = [
    '# Nora Immobilien AG',
    '',
    `> ${firma?.name ?? 'Nora Immobilien AG'} ist ein kleines, unabhängiges, seit 1979 in Zürich tätiges Immobilienunternehmen in 100% Privatbesitz. Es bewirtschaftet Liegenschaften, verwaltet Stockwerkeigentum, vermietet Objekte erstmals und vermittelt Verkäufe von Wohn- und Renditeliegenschaften.`,
    '',
    '## Kontakt',
    '',
    firma?.adresse?.strasse ? `- Adresse: ${firma.adresse.strasse}, ${firma.adresse.plz ?? ''} ${firma.adresse.ort ?? ''}`.trim() : null,
    firma?.telefon ? `- Telefon: ${firma.telefon}` : null,
    firma?.email ? `- E-Mail: ${firma.email}` : null,
    mitgliedschaften.length > 0 ? `- Mitgliedschaften: ${mitgliedschaften.join(', ')}` : null,
    '',
    '## Leistungen',
    '',
    `- Bewirtschaftung: ${base}/bewirtschaftung`,
    `- Stockwerkeigentum: ${base}/stockwerkeigentum`,
    `- Erstvermietung: ${base}/erstvermietung`,
    `- Verkauf: ${base}/verkauf`,
    `- Objekte (Mieten/Kaufen): ${base}/objekte`,
    `- Mieterservice: ${base}/mieterservice`,
    '',
    '## Hinweis',
    '',
    '- Diese Übersicht nennt nur vom Kunden bestätigte Fakten. Weitere Angaben (Handelsregister, Öffnungszeiten) folgen, sobald sie bestätigt sind.',
  ].filter((line): line is string => line !== null)

  return new Response(lines.join('\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
