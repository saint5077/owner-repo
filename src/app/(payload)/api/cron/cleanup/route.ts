import { NextResponse, type NextRequest } from 'next/server'

import { getPayloadClient } from '@/lib/payload'

const AUFBEWAHRUNG_MONATE = 12
const SUCHABO_UNBESTAETIGT_TAGE = 7

/**
 * Täglicher Löschjob (Briefing §8): alte `submissions` (+ Anhänge) und unbestätigte `searchAlerts`.
 * Durch `CRON_SECRET` geschützt (Vercel sendet `Authorization: Bearer <CRON_SECRET>` bei
 * konfigurierten Cron Jobs). Die eigentliche zeitgesteuerte Auslösung ist eine Vercel-Projekt-
 * Einstellung (`vercel.json`/Dashboard) und damit Sache von Phase 9 — diese Route ist dafür schon
 * korrekt und eigenständig aufrufbar/testbar.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const secret = process.env.CRON_SECRET
  const auth = request.headers.get('authorization')
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 })
  }

  const payload = await getPayloadClient()

  const grenzeSubmissions = new Date()
  grenzeSubmissions.setMonth(grenzeSubmissions.getMonth() - AUFBEWAHRUNG_MONATE)

  const alteAnfragen = await payload.find({
    collection: 'submissions',
    where: { createdAt: { less_than: grenzeSubmissions.toISOString() } },
    limit: 1000,
    depth: 1,
    overrideAccess: true,
  })

  let geloeschteAnfragen = 0
  let geloeschteAnhaenge = 0
  for (const anfrage of alteAnfragen.docs) {
    for (const anhang of anfrage.anhaenge ?? []) {
      const id = typeof anhang === 'object' ? anhang.id : anhang
      await payload.delete({ collection: 'media', id, overrideAccess: true }).catch(() => undefined)
      geloeschteAnhaenge += 1
    }
    await payload.delete({ collection: 'submissions', id: anfrage.id, overrideAccess: true })
    geloeschteAnfragen += 1
  }

  const grenzeSuchabo = new Date()
  grenzeSuchabo.setDate(grenzeSuchabo.getDate() - SUCHABO_UNBESTAETIGT_TAGE)

  const unbestaetigteSuchabos = await payload.find({
    collection: 'searchAlerts',
    where: {
      and: [{ bestaetigtAm: { exists: false } }, { createdAt: { less_than: grenzeSuchabo.toISOString() } }],
    },
    limit: 1000,
    overrideAccess: true,
  })
  for (const abo of unbestaetigteSuchabos.docs) {
    await payload.delete({ collection: 'searchAlerts', id: abo.id, overrideAccess: true })
  }

  return NextResponse.json({
    geloeschteAnfragen,
    geloeschteAnhaenge,
    geloeschteSuchabos: unbestaetigteSuchabos.docs.length,
  })
}
