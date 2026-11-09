'use server'

import { getPayloadClient } from '@/lib/payload'
import { guardSubmission } from '@/lib/forms/guard'
import { sendEmail } from '@/lib/email/send'
import { SuchaboBestaetigenEmail } from '@/lib/email/templates/Suchabo'
import { generateToken } from '@/lib/search-alerts/tokens'
import { suchaboSchema, type SuchaboInput } from '@/lib/forms/schemas'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export async function submitSuchabo(input: SuchaboInput): Promise<{ ok: true } | { ok: false; message: string }> {
  const parsed = suchaboSchema.safeParse(input)
  if (!parsed.data) return { ok: false, message: 'Bitte überprüfen Sie Ihre Eingaben.' }
  if (parsed.data.website) return { ok: true } // Honeypot — stiller Erfolg

  const guard = await guardSubmission('suchabo', parsed.data.turnstileToken)
  if (!guard.ok) return { ok: false, message: guard.message }

  const payload = await getPayloadClient()

  // Erneute Anmeldung mit derselben Adresse aktualisiert die Kriterien und verschickt eine neue
  // Bestätigungsmail, statt einen Duplikat-Fehler zu werfen (kein Double-Opt-in-Spam-Vektor, da
  // ohnehin niemand ohne Bestätigung aktiv wird).
  const existing = await payload.find({
    collection: 'searchAlerts',
    where: { email: { equals: parsed.data.email } },
    limit: 1,
    overrideAccess: true,
  })

  const bestaetigungsToken = generateToken()
  const kriterien = {
    angebotsart: parsed.data.angebotsart === 'beide' ? undefined : parsed.data.angebotsart,
    objektart: parsed.data.objektart,
    zimmerVon: parsed.data.zimmerVon || undefined,
    zimmerBis: parsed.data.zimmerBis || undefined,
    preisBis: parsed.data.preisBis || undefined,
    kreis: parsed.data.kreis,
  }

  if (existing.docs[0]) {
    await payload.update({
      collection: 'searchAlerts',
      id: existing.docs[0].id,
      overrideAccess: true,
      data: { kriterien, bestaetigungsToken, bestaetigtAm: null },
    })
  } else {
    await payload.create({
      collection: 'searchAlerts',
      overrideAccess: true,
      data: {
        email: parsed.data.email,
        kriterien,
        bestaetigungsToken,
        abmeldeToken: generateToken(),
      },
    })
  }

  await sendEmail({
    to: parsed.data.email,
    subject: 'Bitte bestätigen Sie Ihr Suchabo',
    react: SuchaboBestaetigenEmail({ bestaetigenUrl: `${SITE_URL}/suchabo/bestaetigen?token=${bestaetigungsToken}` }),
  })

  return { ok: true }
}
