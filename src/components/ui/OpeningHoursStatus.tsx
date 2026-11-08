'use client'

import { useEffect, useState } from 'react'

import type { SiteSetting } from '@/payload-types'
import { getOpeningStatus, type OpeningStatus } from '@/lib/opening-hours'

type Props = { oeffnungszeiten: SiteSetting['oeffnungszeiten'] }

/** Rendert nichts, solange keine Öffnungszeiten gepflegt sind (aktuell der Fall) oder vor dem Mounten. */
export function OpeningHoursStatus({ oeffnungszeiten }: Props) {
  const [status, setStatus] = useState<OpeningStatus | null>(null)

  useEffect(() => {
    const update = () => setStatus(getOpeningStatus(oeffnungszeiten))
    update()
    const interval = setInterval(update, 60_000)
    return () => clearInterval(interval)
  }, [oeffnungszeiten])

  if (!status) return null

  return (
    <p className="nora-nav-label flex items-center gap-2">
      <span
        aria-hidden="true"
        className={`inline-block h-2 w-2 rounded-full ${status === 'offen' ? 'bg-fensterladen' : 'bg-sandstein'}`}
      />
      {status === 'offen' ? 'Jetzt geöffnet' : 'Jetzt geschlossen'}
    </p>
  )
}
