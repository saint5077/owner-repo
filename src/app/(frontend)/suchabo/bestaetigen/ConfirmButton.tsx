'use client'

import { useState } from 'react'

import { confirmSearchAlert } from './actions'

/**
 * Bestätigung erfolgt bewusst erst durch einen expliziten Klick, nicht automatisch beim
 * Laden der Seite (GET) — E-Mail-Clients und Sicherheits-Scanner rufen verlinkte URLs oft
 * automatisch vorab auf ("Link-Prefetching"), was ein Suchabo sonst ohne menschliches Zutun
 * bestätigen würde.
 */
export function ConfirmButton({ token }: { token: string }) {
  const [status, setStatus] = useState<'idle' | 'pending' | 'confirmed' | 'invalid'>('idle')

  async function handleClick() {
    setStatus('pending')
    const result = await confirmSearchAlert(token)
    setStatus(result)
  }

  if (status === 'confirmed') {
    return (
      <>
        <h1 className="nora-h1 max-w-xl">Suchabo bestätigt.</h1>
        <p className="nora-lead mt-6 max-w-xl">Vielen Dank. Wir melden uns per E-Mail, sobald ein passendes Objekt frei wird.</p>
      </>
    )
  }

  if (status === 'invalid') {
    return (
      <>
        <h1 className="nora-h1 max-w-xl">Dieser Link ist nicht mehr gültig.</h1>
        <p className="nora-lead mt-6 max-w-xl">
          Möglicherweise wurde das Suchabo bereits bestätigt oder der Link ist abgelaufen. Richten Sie bei Bedarf ein
          neues Suchabo ein.
        </p>
      </>
    )
  }

  return (
    <>
      <h1 className="nora-h1 max-w-xl">Suchabo bestätigen</h1>
      <p className="nora-lead mt-6 max-w-xl">Bitte bestätigen Sie, dass Sie dieses Suchabo einrichten möchten.</p>
      <button
        type="button"
        onClick={handleClick}
        disabled={status === 'pending'}
        className="nora-button-label mt-8 bg-fensterladen px-6 py-3 text-weiss hover:opacity-90 disabled:opacity-60"
      >
        {status === 'pending' ? 'Wird bestätigt …' : 'Suchabo bestätigen'}
      </button>
    </>
  )
}
