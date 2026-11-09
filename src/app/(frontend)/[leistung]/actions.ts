'use server'

import { createSubmission } from '@/lib/forms/create-submission'
import { guardSubmission } from '@/lib/forms/guard'
import {
  ersteinschaetzungSchema,
  verwaltungSchema,
  type ErsteinschaetzungInput,
  type VerwaltungInput,
} from '@/lib/forms/schemas'

const SITUATION_LABEL: Record<VerwaltungInput['heutigeSituation'], string> = {
  selbstVerwaltet: 'Selbst verwaltet',
  andereVerwaltung: 'Andere Verwaltung',
  neubau: 'Neubau',
}

const LIEGENSCHAFT_LABEL: Record<VerwaltungInput['artDerLiegenschaft'], string> = {
  mehrfamilienhaus: 'Mehrfamilienhaus',
  stockwerkeigentum: 'Stockwerkeigentum',
  gemischt: 'Gemischt genutzt',
  gewerbe: 'Gewerbe',
  einfamilienhaus: 'Einfamilienhaus',
}

export async function submitVerwaltung(
  input: VerwaltungInput,
): Promise<{ ok: true; referenznummer: string } | { ok: false; message: string }> {
  const parsed = verwaltungSchema.safeParse(input)
  if (!parsed.data) return { ok: false, message: 'Bitte überprüfen Sie Ihre Eingaben.' }
  if (parsed.data.website) return { ok: true, referenznummer: 'VW-0000-0000' }

  const guard = await guardSubmission('verwaltung', parsed.data.turnstileToken)
  if (!guard.ok) return { ok: false, message: guard.message }

  const { referenznummer } = await createSubmission({
    type: 'verwaltung',
    data: parsed.data,
    senderEmail: parsed.data.email,
    senderName: parsed.data.name,
    nachricht: parsed.data.nachricht,
    betreffZusatz: parsed.data.ort,
    notificationFields: [
      { label: 'Art der Liegenschaft', value: LIEGENSCHAFT_LABEL[parsed.data.artDerLiegenschaft] },
      { label: 'Anzahl Einheiten', value: String(parsed.data.anzahlEinheiten || '–') },
      { label: 'Ort', value: parsed.data.ort },
      { label: 'Heutige Situation', value: SITUATION_LABEL[parsed.data.heutigeSituation] },
      { label: 'Gewünschter Beginn', value: parsed.data.gewuenschterBeginn || '–' },
      { label: 'Rückruf-Zeitfenster', value: parsed.data.rueckrufZeitfenster || '–' },
      { label: 'Name', value: parsed.data.name },
      { label: 'Telefon', value: parsed.data.telefon || '–' },
      { label: 'E-Mail', value: parsed.data.email },
    ],
  })

  return { ok: true, referenznummer }
}

const ZEITHORIZONT_LABEL: Record<ErsteinschaetzungInput['zeithorizont'], string> = {
  sofort: 'So bald wie möglich',
  sechsMonate: 'In den nächsten 6 Monaten',
  offen: 'Noch offen',
}

const OBJEKTART_LABEL: Record<ErsteinschaetzungInput['objektart'], string> = {
  eigenheim: 'Eigenheim',
  renditeliegenschaft: 'Renditeliegenschaft',
  stockwerkeinheit: 'Stockwerkeinheit',
  gewerbeIndustrieobjekt: 'Gewerbe-/Industrieobjekt',
}

export async function submitErsteinschaetzung(
  input: ErsteinschaetzungInput,
): Promise<{ ok: true; referenznummer: string } | { ok: false; message: string }> {
  const parsed = ersteinschaetzungSchema.safeParse(input)
  if (!parsed.data) return { ok: false, message: 'Bitte überprüfen Sie Ihre Eingaben.' }
  if (parsed.data.website) return { ok: true, referenznummer: 'EK-0000-0000' }

  const guard = await guardSubmission('ersteinschaetzung', parsed.data.turnstileToken)
  if (!guard.ok) return { ok: false, message: guard.message }

  const { referenznummer } = await createSubmission({
    type: 'ersteinschaetzung',
    data: parsed.data,
    senderEmail: parsed.data.email,
    senderName: parsed.data.name,
    nachricht: parsed.data.nachricht,
    betreffZusatz: parsed.data.ort,
    notificationFields: [
      { label: 'Objektart', value: OBJEKTART_LABEL[parsed.data.objektart] },
      { label: 'Ort', value: parsed.data.ort },
      { label: 'Zimmer', value: String(parsed.data.zimmer || '–') },
      { label: 'Fläche (m²)', value: String(parsed.data.flaeche || '–') },
      { label: 'Baujahr', value: String(parsed.data.baujahr || '–') },
      { label: 'Zustand', value: parsed.data.zustand || '–' },
      { label: 'Zeithorizont', value: ZEITHORIZONT_LABEL[parsed.data.zeithorizont] },
      { label: 'Name', value: parsed.data.name },
      { label: 'Telefon', value: parsed.data.telefon || '–' },
      { label: 'E-Mail', value: parsed.data.email },
    ],
  })

  return { ok: true, referenznummer }
}
