'use server'

import { createSubmission } from '@/lib/forms/create-submission'
import { guardSubmission } from '@/lib/forms/guard'
import { allgemeinSchema, type AllgemeinInput } from '@/lib/forms/schemas'

const ANLIEGEN_LABEL: Record<AllgemeinInput['anliegen'], string> = {
  verwaltung: 'Verwaltung',
  stockwerkeigentum: 'Stockwerkeigentum',
  erstvermietung: 'Erstvermietung',
  verkauf: 'Verkauf / Ersteinschätzung',
  mieteranliegen: 'Mieteranliegen',
  allgemein: 'Allgemein',
}

export async function submitAllgemeineAnfrage(
  input: AllgemeinInput,
): Promise<{ ok: true; referenznummer: string } | { ok: false; message: string }> {
  const parsed = allgemeinSchema.safeParse(input)
  if (!parsed.data) return { ok: false, message: 'Bitte überprüfen Sie Ihre Eingaben.' }
  if (parsed.data.website) return { ok: true, referenznummer: 'AN-0000-0000' } // Honeypot getroffen — stiller Erfolg

  const guard = await guardSubmission('allgemein', parsed.data.turnstileToken)
  if (!guard.ok) return { ok: false, message: guard.message }

  const { referenznummer } = await createSubmission({
    type: 'allgemein',
    data: parsed.data,
    senderEmail: parsed.data.email,
    senderName: parsed.data.name,
    nachricht: parsed.data.nachricht,
    betreffZusatz: ANLIEGEN_LABEL[parsed.data.anliegen],
    notificationFields: [
      { label: 'Anliegen', value: ANLIEGEN_LABEL[parsed.data.anliegen] },
      { label: 'Name', value: parsed.data.name },
      { label: 'Telefon', value: parsed.data.telefon || '–' },
      { label: 'E-Mail', value: parsed.data.email },
    ],
  })

  return { ok: true, referenznummer }
}
