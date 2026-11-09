'use server'

import { createSubmission } from '@/lib/forms/create-submission'
import { guardSubmission } from '@/lib/forms/guard'
import { schadenmeldungSchema, type SchadenmeldungInput } from '@/lib/forms/schemas'

const KATEGORIE_LABEL: Record<SchadenmeldungInput['kategorie'], string> = {
  sanitaer: 'Sanitär',
  heizung: 'Heizung',
  elektro: 'Elektro',
  kuecheGeraete: 'Küche/Geräte',
  fensterTueren: 'Fenster/Türen',
  lift: 'Lift',
  allgemeinflaechen: 'Allgemeinflächen',
  anderes: 'Anderes',
}

export async function submitSchadenmeldung(
  input: SchadenmeldungInput,
): Promise<{ ok: true; referenznummer: string } | { ok: false; message: string }> {
  const parsed = schadenmeldungSchema.safeParse(input)
  if (!parsed.data) return { ok: false, message: 'Bitte überprüfen Sie Ihre Eingaben.' }
  if (parsed.data.website) return { ok: true, referenznummer: 'SM-0000-0000' }

  const guard = await guardSubmission('schaden', parsed.data.turnstileToken)
  if (!guard.ok) return { ok: false, message: guard.message }

  const { referenznummer } = await createSubmission({
    type: 'schaden',
    data: parsed.data,
    senderEmail: parsed.data.email,
    senderName: parsed.data.name,
    nachricht: parsed.data.beschreibung,
    betreffZusatz: `${KATEGORIE_LABEL[parsed.data.kategorie]}${parsed.data.notfall === 'ja' ? ' – NOTFALL' : ''}`,
    anhaengeIds: parsed.data.fotoKeys.map(Number),
    notificationFields: [
      { label: 'Notfall', value: parsed.data.notfall === 'ja' ? 'JA' : 'Nein' },
      { label: 'Liegenschaft', value: parsed.data.liegenschaftAdresse },
      { label: 'Wohnung', value: parsed.data.wohnung || '–' },
      { label: 'Kategorie', value: KATEGORIE_LABEL[parsed.data.kategorie] },
      { label: 'Erreichbarkeit', value: parsed.data.erreichbarkeitTelefon },
      { label: 'Zutritt bei Abwesenheit erlaubt', value: parsed.data.zutrittErlaubt === 'ja' ? 'Ja' : 'Nein' },
      { label: 'Name', value: parsed.data.name },
      { label: 'E-Mail', value: parsed.data.email },
      { label: 'Fotos', value: String(parsed.data.fotoKeys.length) },
    ],
  })

  return { ok: true, referenznummer }
}
