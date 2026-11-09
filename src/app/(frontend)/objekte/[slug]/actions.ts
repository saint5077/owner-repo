'use server'

import { getPayloadClient } from '@/lib/payload'
import { createSubmission } from '@/lib/forms/create-submission'
import { guardSubmission } from '@/lib/forms/guard'
import { besichtigungSchema, type BesichtigungInput } from '@/lib/forms/schemas'

export async function submitBesichtigung(
  input: BesichtigungInput,
): Promise<{ ok: true; referenznummer: string } | { ok: false; message: string }> {
  const parsed = besichtigungSchema.safeParse(input)
  if (!parsed.data) return { ok: false, message: 'Bitte überprüfen Sie Ihre Eingaben.' }
  if (parsed.data.website) return { ok: true, referenznummer: 'BS-0000-0000' }

  const guard = await guardSubmission('besichtigung', parsed.data.turnstileToken)
  if (!guard.ok) return { ok: false, message: guard.message }

  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'properties',
    where: { slug: { equals: parsed.data.propertySlug } },
    limit: 1,
    depth: 1,
  })
  const property = result.docs[0]
  if (!property) return { ok: false, message: 'Dieses Objekt wurde nicht gefunden.' }

  const ansprechpersonId =
    property.ansprechperson && typeof property.ansprechperson === 'object' ? property.ansprechperson.id : undefined

  const { referenznummer } = await createSubmission({
    type: 'besichtigung',
    data: parsed.data,
    senderEmail: parsed.data.email,
    senderName: parsed.data.name,
    nachricht: parsed.data.nachricht,
    betreffZusatz: property.title,
    zustaendigePerson: ansprechpersonId,
    notificationFields: [
      { label: 'Objekt', value: property.title },
      { label: 'Anzahl Personen', value: parsed.data.anzahlPersonen },
      { label: 'Wunschtermin 1', value: parsed.data.wunschtermin1 || '–' },
      { label: 'Wunschtermin 2', value: parsed.data.wunschtermin2 || '–' },
      { label: 'Name', value: parsed.data.name },
      { label: 'Telefon', value: parsed.data.telefon || '–' },
      { label: 'E-Mail', value: parsed.data.email },
    ],
  })

  return { ok: true, referenznummer }
}
