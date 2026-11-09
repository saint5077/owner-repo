import { getPayloadClient } from '@/lib/payload'
import { sendEmail } from '@/lib/email/send'
import { ConfirmationEmail } from '@/lib/email/templates/Confirmation'
import { NotificationEmail, type NotificationField } from '@/lib/email/templates/Notification'

import { generateReferenceNumber } from './reference-number'

type SubmissionType = 'verwaltung' | 'ersteinschaetzung' | 'schaden' | 'besichtigung' | 'allgemein'

const BETREFF_LABEL: Record<SubmissionType, string> = {
  verwaltung: 'Verwaltung anfragen',
  ersteinschaetzung: 'Ersteinschätzung (Verkauf)',
  schaden: 'Schaden',
  besichtigung: 'Besichtigung anfragen',
  allgemein: 'Allgemeine Anfrage',
}

type CreateSubmissionInput = {
  type: SubmissionType
  data: Record<string, unknown>
  senderEmail: string
  senderName: string
  notificationFields: NotificationField[]
  nachricht?: string
  betreffZusatz?: string
  anhaengeIds?: number[]
  zustaendigePerson?: number
}

/**
 * Gemeinsamer Ablauf für alle sechs Formulare (Briefing §9): `submissions`-Dokument anlegen
 * (Local API mit `overrideAccess: true` — Server Actions sind der einzig vorgesehene Schreibweg,
 * siehe `Submissions.ts`/`access/index.ts`), Referenznummer erzeugen, Empfänger- und
 * Bestätigungs-E-Mail versenden. Ein fehlender Empfänger in `siteSettings` blockiert die
 * Anfrage nicht — fällt auf die allgemeine Firmenadresse zurück und loggt eine Warnung.
 */
export async function createSubmission(input: CreateSubmissionInput): Promise<{ referenznummer: string }> {
  const payload = await getPayloadClient()
  const siteSettings = await payload.findGlobal({ slug: 'siteSettings' }).catch(() => null)

  const empfaenger =
    siteSettings?.empfaengerEmails?.[input.type as keyof typeof siteSettings.empfaengerEmails] ||
    siteSettings?.firma?.email ||
    process.env.EMAIL_FROM ||
    'info@nora-immobilien.ch'

  if (!siteSettings?.empfaengerEmails?.[input.type as keyof typeof siteSettings.empfaengerEmails]) {
    console.warn(
      `[submissions] Kein Empfänger für Formulartyp "${input.type}" in siteSettings.empfaengerEmails konfiguriert — falle auf ${empfaenger} zurück.`,
    )
  }

  let referenznummer = generateReferenceNumber(input.type)
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      await payload.create({
        collection: 'submissions',
        overrideAccess: true,
        data: {
          type: input.type,
          data: input.data,
          referenznummer,
          status: 'neu',
          ...(input.anhaengeIds?.length ? { anhaenge: input.anhaengeIds } : {}),
          ...(input.zustaendigePerson ? { zustaendigePerson: input.zustaendigePerson } : {}),
        },
      })
      break
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      if (message.includes('unique') && attempt < 2) {
        referenznummer = generateReferenceNumber(input.type)
        continue
      }
      throw error
    }
  }

  const betreff = `[${BETREFF_LABEL[input.type]}${input.betreffZusatz ? ` – ${input.betreffZusatz}` : ''}] ${referenznummer}`

  await sendEmail({
    to: empfaenger,
    subject: betreff,
    replyTo: input.senderEmail,
    react: NotificationEmail({
      titel: BETREFF_LABEL[input.type],
      referenznummer,
      felder: input.notificationFields,
      nachricht: input.nachricht,
    }),
  })

  await sendEmail({
    to: input.senderEmail,
    subject: `Ihre Anfrage bei Nora Immobilien — ${referenznummer}`,
    react: ConfirmationEmail({ referenznummer }),
  })

  return { referenznummer }
}
