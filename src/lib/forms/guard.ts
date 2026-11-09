import { headers } from 'next/headers'

import { checkRateLimit } from '@/lib/spam/rate-limit'
import { verifyTurnstile } from '@/lib/spam/turnstile'

/**
 * Gemeinsamer Spam-/Rate-Limit-Check für alle Server Actions (Briefing §9): IP aus
 * `x-forwarded-for` (von Vercels Edge-Netzwerk bzw. lokal `127.0.0.1`), Rate-Limit pro IP und
 * Formulartyp, Turnstile-Serververifikation. Der Honeypot wird direkt im jeweiligen Zod-Schema
 * geprüft (leeres Pflichtfeld) und braucht hier keine separate Behandlung.
 */
export async function guardSubmission(formType: string, turnstileToken: string): Promise<{ ok: true } | { ok: false; message: string }> {
  const headerList = await headers()
  const ip = headerList.get('x-forwarded-for')?.split(',')[0]?.trim() || headerList.get('x-real-ip') || '127.0.0.1'

  const { success } = await checkRateLimit(ip, formType)
  if (!success) {
    return { ok: false, message: 'Zu viele Anfragen in kurzer Zeit. Bitte versuchen Sie es in ein paar Minuten erneut.' }
  }

  const verified = await verifyTurnstile(turnstileToken, ip)
  if (!verified) {
    return { ok: false, message: 'Die Sicherheitsprüfung ist fehlgeschlagen. Bitte versuchen Sie es erneut.' }
  }

  return { ok: true }
}
