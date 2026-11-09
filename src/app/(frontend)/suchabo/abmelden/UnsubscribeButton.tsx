'use client'

import { useState } from 'react'

import { unsubscribeSearchAlert } from './actions'

export function UnsubscribeButton({ token }: { token: string }) {
  const [status, setStatus] = useState<'idle' | 'pending' | 'unsubscribed' | 'invalid'>('idle')

  async function handleClick() {
    setStatus('pending')
    const result = await unsubscribeSearchAlert(token)
    setStatus(result)
  }

  if (status === 'unsubscribed') {
    return (
      <>
        <h1 className="nora-h1 max-w-xl">Suchabo abgemeldet.</h1>
        <p className="nora-lead mt-6 max-w-xl">Sie erhalten keine weiteren Benachrichtigungen mehr.</p>
      </>
    )
  }

  if (status === 'invalid') {
    return (
      <>
        <h1 className="nora-h1 max-w-xl">Dieser Link ist nicht mehr gültig.</h1>
        <p className="nora-lead mt-6 max-w-xl">Das Suchabo wurde möglicherweise bereits abgemeldet.</p>
      </>
    )
  }

  return (
    <>
      <h1 className="nora-h1 max-w-xl">Suchabo abmelden</h1>
      <p className="nora-lead mt-6 max-w-xl">Möchten Sie dieses Suchabo wirklich abmelden?</p>
      <button
        type="button"
        onClick={handleClick}
        disabled={status === 'pending'}
        className="nora-button-label mt-8 border border-sandstein/50 px-6 py-3 hover:border-tinte disabled:opacity-60"
      >
        {status === 'pending' ? 'Wird abgemeldet …' : 'Suchabo abmelden'}
      </button>
    </>
  )
}
