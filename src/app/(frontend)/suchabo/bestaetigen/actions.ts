'use server'

import { getPayloadClient } from '@/lib/payload'

export async function confirmSearchAlert(token: string): Promise<'confirmed' | 'invalid'> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'searchAlerts',
    where: { bestaetigungsToken: { equals: token } },
    limit: 1,
    overrideAccess: true,
  })
  const alert = result.docs[0]
  if (!alert) return 'invalid'

  await payload.update({
    collection: 'searchAlerts',
    id: alert.id,
    overrideAccess: true,
    data: { bestaetigtAm: new Date().toISOString() },
  })
  return 'confirmed'
}
