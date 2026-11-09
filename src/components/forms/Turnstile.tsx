'use client'

import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: { sitekey: string; callback: (token: string) => void; 'expired-callback'?: () => void },
      ) => string
      remove: (widgetId: string) => void
    }
    onloadTurnstileCallback?: () => void
  }
}

let scriptPromise: Promise<void> | null = null
function loadTurnstileScript(): Promise<void> {
  if (scriptPromise) return scriptPromise
  scriptPromise = new Promise((resolve) => {
    if (window.turnstile) {
      resolve()
      return
    }
    window.onloadTurnstileCallback = () => resolve()
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback&render=explicit'
    script.async = true
    document.head.appendChild(script)
  })
  return scriptPromise
}

/**
 * Lädt das Turnstile-Skript erst, wenn das Widget tatsächlich ins Blickfeld scrollt (IntersectionObserver)
 * — nicht beim Seitenaufruf (Briefing §9 "erst laden, wenn das Formular in Sicht kommt"). Site-Key aus
 * `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, Standard in der Entwicklung ist Cloudflares öffentlicher
 * "Always passes"-Testschlüssel.
 */
export function Turnstile({ onToken }: { onToken: (token: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!visible || !containerRef.current) return
    let widgetId: string | undefined
    let cancelled = false
    loadTurnstileScript().then(() => {
      if (cancelled || !containerRef.current || !window.turnstile) return
      widgetId = window.turnstile.render(containerRef.current, {
        sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA',
        callback: onToken,
        'expired-callback': () => onToken(''),
      })
    })
    return () => {
      cancelled = true
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId)
    }
  }, [visible])

  return <div ref={containerRef} className="min-h-[65px]" data-testid="turnstile-widget" />
}
