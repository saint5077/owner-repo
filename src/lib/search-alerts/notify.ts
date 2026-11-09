import type { Payload } from 'payload'

import type { Property } from '@/payload-types'
import { sendEmail } from '@/lib/email/send'
import { SuchaboAlertEmail } from '@/lib/email/templates/Suchabo'

import { matchesProperty } from './match'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

/**
 * Benachrichtigt alle bestätigten Suchabos, deren Kriterien zum soeben "verfügbar" gewordenen
 * Objekt passen (Briefing §8). Idempotent über `alertsSentAt` auf `properties` — wird dort schon
 * ein Wert gesetzt, läuft diese Funktion für dieses Objekt nie wieder, unabhängig von weiteren
 * Statuswechseln (bewusste Vereinfachung: ein Objekt löst Suchabo-Mails maximal einmal aus).
 */
export async function notifyMatchingSearchAlerts(payload: Payload, property: Property): Promise<number> {
  const confirmed = await payload.find({
    collection: 'searchAlerts',
    where: { bestaetigtAm: { exists: true } },
    limit: 1000,
    overrideAccess: true,
  })

  const matches = confirmed.docs.filter((alert) => matchesProperty(property, alert.kriterien))

  for (const alert of matches) {
    await sendEmail({
      to: alert.email,
      subject: `Passendes Objekt gefunden: ${property.title}`,
      react: SuchaboAlertEmail({
        objektTitel: property.title,
        objektUrl: `${SITE_URL}/objekte/${property.slug}`,
        abmeldenUrl: `${SITE_URL}/suchabo/abmelden?token=${alert.abmeldeToken}`,
      }),
    })
  }

  return matches.length
}
