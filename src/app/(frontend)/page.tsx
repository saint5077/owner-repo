import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import './styles.css'

/**
 * Platzhalter — das eigentliche Frontend (Design, Zeichnungsmodul, Inhalte) entsteht in Phase 3/4.
 * Phase 2 liefert nur das Backend; diese Seite bestätigt, dass Next.js + Payload zusammenspielen.
 */
export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  return (
    <div className="home flex min-h-screen flex-col items-center justify-center gap-6 p-12 text-center">
      <h1 className="text-3xl font-semibold">Nora Immobilien AG — Konzept-Vorschau</h1>
      <p className="max-w-prose text-sm opacity-80">
        Phase 2 abgeschlossen: Next.js und Payload CMS sind verbunden und das Backend ist eingerichtet.
        {user ? ` Angemeldet als ${user.email}.` : ' Das öffentliche Frontend folgt in Phase 3.'}
      </p>
      <a
        className="rounded border border-current px-4 py-2 text-sm no-underline"
        href={payloadConfig.routes.admin}
        rel="noopener noreferrer"
        target="_blank"
      >
        Zum Admin-Panel
      </a>
    </div>
  )
}
