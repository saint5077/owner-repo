import { z } from 'zod'

/** Bot-Falle: Feld bleibt für Menschen unsichtbar, ein Bot füllt es meist trotzdem aus. */
export const honeypotSchema = z.object({
  website: z.string().max(0, 'Spam erkannt.').optional().or(z.literal('')),
})

const kontaktfelder = {
  name: z.string().trim().min(2, 'Bitte geben Sie Ihren Namen an.'),
  telefon: z.string().trim().optional().or(z.literal('')),
  email: z.string().trim().email('Bitte geben Sie eine gültige E-Mail-Adresse an.'),
}

export const verwaltungSchema = z.object({
  ...honeypotSchema.shape,
  turnstileToken: z.string().min(1, 'Bitte bestätigen Sie, dass Sie kein Roboter sind.'),
  artDerLiegenschaft: z.enum(['mehrfamilienhaus', 'stockwerkeigentum', 'gemischt', 'gewerbe', 'einfamilienhaus']),
  anzahlEinheiten: z.coerce.number().int().positive().optional().or(z.literal('')),
  ort: z.string().trim().min(2, 'Bitte geben Sie einen Ort an.'),
  heutigeSituation: z.enum(['selbstVerwaltet', 'andereVerwaltung', 'neubau']),
  gewuenschterBeginn: z.string().trim().optional().or(z.literal('')),
  rueckrufZeitfenster: z.string().trim().optional().or(z.literal('')),
  nachricht: z.string().trim().optional().or(z.literal('')),
  ...kontaktfelder,
})
export type VerwaltungInput = z.infer<typeof verwaltungSchema>

export const ersteinschaetzungSchema = z.object({
  ...honeypotSchema.shape,
  turnstileToken: z.string().min(1, 'Bitte bestätigen Sie, dass Sie kein Roboter sind.'),
  objektart: z.enum(['eigenheim', 'renditeliegenschaft', 'stockwerkeinheit', 'gewerbeIndustrieobjekt']),
  ort: z.string().trim().min(2, 'Bitte geben Sie einen Ort an.'),
  zimmer: z.coerce.number().positive().optional().or(z.literal('')),
  flaeche: z.coerce.number().positive().optional().or(z.literal('')),
  baujahr: z.coerce.number().int().positive().optional().or(z.literal('')),
  zustand: z.string().trim().optional().or(z.literal('')),
  zeithorizont: z.enum(['sofort', 'sechsMonate', 'offen']),
  nachricht: z.string().trim().optional().or(z.literal('')),
  ...kontaktfelder,
})
export type ErsteinschaetzungInput = z.infer<typeof ersteinschaetzungSchema>

export const schadenmeldungSchema = z.object({
  ...honeypotSchema.shape,
  turnstileToken: z.string().min(1, 'Bitte bestätigen Sie, dass Sie kein Roboter sind.'),
  notfall: z.enum(['nein', 'ja']),
  liegenschaftAdresse: z.string().trim().min(2, 'Bitte geben Sie die Adresse der Liegenschaft an.'),
  wohnung: z.string().trim().optional().or(z.literal('')),
  kategorie: z.enum([
    'sanitaer',
    'heizung',
    'elektro',
    'kuecheGeraete',
    'fensterTueren',
    'lift',
    'allgemeinflaechen',
    'anderes',
  ]),
  beschreibung: z.string().trim().min(10, 'Bitte beschreiben Sie den Schaden etwas genauer.'),
  fotoKeys: z.array(z.string()).max(5, 'Maximal 5 Fotos.').default([]),
  erreichbarkeitTelefon: z.string().trim().min(4, 'Bitte geben Sie eine Telefonnummer an, damit wir Sie bei Rückfragen erreichen.'),
  zutrittErlaubt: z.enum(['nein', 'ja']),
  name: kontaktfelder.name,
  email: kontaktfelder.email,
})
export type SchadenmeldungInput = z.infer<typeof schadenmeldungSchema>

export const besichtigungSchema = z.object({
  ...honeypotSchema.shape,
  turnstileToken: z.string().min(1, 'Bitte bestätigen Sie, dass Sie kein Roboter sind.'),
  propertySlug: z.string().min(1),
  anzahlPersonen: z.enum(['1', '2', '3', '4+']),
  wunschtermin1: z.string().trim().optional().or(z.literal('')),
  wunschtermin2: z.string().trim().optional().or(z.literal('')),
  nachricht: z.string().trim().optional().or(z.literal('')),
  ...kontaktfelder,
})
export type BesichtigungInput = z.infer<typeof besichtigungSchema>

export const SUCHABO_OBJEKTARTEN = [
  'wohnung',
  'maisonette',
  'attika',
  'studio',
  'einfamilienhaus',
  'reihenhaus',
  'buero',
  'gewerbe',
] as const
export const SUCHABO_KREISE = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12',
] as const

export const suchaboSchema = z.object({
  ...honeypotSchema.shape,
  turnstileToken: z.string().min(1, 'Bitte bestätigen Sie, dass Sie kein Roboter sind.'),
  email: kontaktfelder.email,
  angebotsart: z.enum(['miete', 'kauf', 'beide']),
  zimmerVon: z.coerce.number().optional().or(z.literal('')),
  zimmerBis: z.coerce.number().optional().or(z.literal('')),
  preisBis: z.coerce.number().positive().optional().or(z.literal('')),
  objektart: z.array(z.enum(SUCHABO_OBJEKTARTEN)).optional().default([]),
  kreis: z.array(z.enum(SUCHABO_KREISE)).optional().default([]),
})
export type SuchaboInput = z.infer<typeof suchaboSchema>

export const ANLIEGEN_VALUES = [
  'verwaltung',
  'stockwerkeigentum',
  'erstvermietung',
  'verkauf',
  'mieteranliegen',
  'allgemein',
] as const

export const allgemeinSchema = z.object({
  ...honeypotSchema.shape,
  turnstileToken: z.string().min(1, 'Bitte bestätigen Sie, dass Sie kein Roboter sind.'),
  anliegen: z.enum(ANLIEGEN_VALUES),
  nachricht: z.string().trim().min(5, 'Bitte geben Sie eine Nachricht ein.'),
  ...kontaktfelder,
})
export type AllgemeinInput = z.infer<typeof allgemeinSchema>
