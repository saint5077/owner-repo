/** Zufällige, URL-sichere Tokens für Double-Opt-in-Bestätigung und Abmeldung. */
export function generateToken(): string {
  const bytes = new Uint8Array(24)
  crypto.getRandomValues(bytes)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}
