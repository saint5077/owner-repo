'use client'

import { useState } from 'react'

export function ShareButton({ title, url }: { title: string; url: string }) {
  const [kopiert, setKopiert] = useState(false)

  async function teilen() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
        return
      } catch {
        // Nutzer hat den nativen Teilen-Dialog abgebrochen — kein Fehlerzustand.
        return
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      setKopiert(true)
      setTimeout(() => setKopiert(false), 2500)
    } catch {
      // Clipboard-API nicht verfügbar (z. B. kein sicherer Kontext) — stiller Fallback.
    }
  }

  return (
    <button
      type="button"
      onClick={teilen}
      className="nora-nav-label border border-sandstein/50 px-4 py-2 hover:border-tinte"
    >
      {kopiert ? 'Link kopiert' : 'Teilen'}
    </button>
  )
}
