/**
 * Cloudflare Turnstile-Serververifikation. In der Entwicklung sind standardmässig Cloudflares
 * eigene, öffentlich dokumentierte "Always passes"-Testschlüssel gesetzt (Site-Key
 * `1x00000000000000000000AA`, Secret `1x0000000000000000000000000000000AA`) — kein echtes
 * Secret, sicher in `.env.local`/`.env.example`. Gegen den echten `siteverify`-Endpunkt
 * verifiziert (nicht nur angenommen): ein erster Versuch mit einem zu kurzen, aus der Erinnerung
 * geratenen Secret scheiterte mit `invalid-input-secret` — das korrekte, 35 Zeichen lange Secret
 * stammt direkt aus Cloudflares Testing-Dokumentation. Produktion braucht einen echten
 * Turnstile-Schlüssel (Phase 9, `request_credential`).
 */
export async function verifyTurnstile(token: string, remoteIp?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA'
  if (!token) return false

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret,
        response: token,
        ...(remoteIp ? { remoteip: remoteIp } : {}),
      }),
    })
    const data = (await res.json()) as { success: boolean }
    return data.success === true
  } catch (error) {
    console.error('[turnstile] Verifikation fehlgeschlagen', error)
    return false
  }
}
