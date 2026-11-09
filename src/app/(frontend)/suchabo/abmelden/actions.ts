'use server'

import { getPayloadClient } from '@/lib/payload'

export async function unsubscribeSearchAlert(token: string): Promise<'unsubscribed' | 'invalid'> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'searchAlerts',
    where: { abmeldeToken: { equals: token } },
    limit: 1,
    overrideAccess: true,
  })
  const alert = result.docs[0]
  if (!alert) return 'invalid'

  await payload.delete({ collection: 'searchAlerts', id: alert.id, overrideAccess: true })
  return 'unsubscribed'
}
