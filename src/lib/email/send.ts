import { render } from '@react-email/render'
import { Resend } from 'resend'
import type { ReactElement } from 'react'

type SendEmailInput = {
  to: string
  subject: string
  react: ReactElement
  replyTo?: string
}

/**
 * Resend-Versand mit Konsolen-Fallback ohne `RESEND_API_KEY` (identisches Muster zu Payloads
 * eigenem E-Mail-Adapter, der beim Seed ohne Konfiguration bereits "Email will be written to
 * console" loggt) — so funktioniert die gesamte Formularlogik lokal ohne echtes Resend-Konto.
 * Im Demo-Modus (`NEXT_PUBLIC_DEMO_MODE=true`) geht JEDE E-Mail ausschliesslich an
 * `DEMO_RECIPIENT`, nie an echte Empfänger (Briefing §13) — unabhängig davon, ob ein echter
 * Resend-Key gesetzt ist.
 */
export async function sendEmail({ to, subject, react, replyTo }: SendEmailInput): Promise<void> {
  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE !== 'false'
  const demoRecipient = process.env.DEMO_RECIPIENT
  const resolvedTo = demoMode && demoRecipient ? demoRecipient : to
  const from = process.env.EMAIL_FROM || 'info@nora-immobilien.ch'

  const html = await render(react)
  const text = await render(react, { plainText: true })

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.log(
      `[email:console-fallback] an=${resolvedTo}${demoMode && demoRecipient && resolvedTo !== to ? ` (eigentlich: ${to})` : ''} betreff="${subject}"\n${text}`,
    )
    return
  }

  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from,
    to: resolvedTo,
    subject: demoMode && demoRecipient && resolvedTo !== to ? `[Demo, eigentlich an ${to}] ${subject}` : subject,
    html,
    text,
    replyTo,
  })
  if (error) {
    console.error('[email:resend-error]', error)
    throw new Error('E-Mail-Versand fehlgeschlagen.')
  }
}
