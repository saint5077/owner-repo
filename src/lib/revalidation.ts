import { revalidatePath } from 'next/cache'

/**
 * Payload-Hooks laufen innerhalb der Route-Handler-Anfrage, die `/api/[...slug]/route.ts`
 * bedient — `revalidatePath` ist dort laut Next-Doku gültig ("Server Functions and Route
 * Handlers"). Ausserhalb eines Request-Kontexts (z. B. `pnpm seed`, das Payloads Local API
 * direkt ohne HTTP-Anfrage nutzt) ist die Funktion nicht verfügbar — der try/catch verhindert,
 * dass der Seed deshalb fehlschlägt (siehe DECISIONS.md #26).
 */
export function revalidatePaths(paths: string[]) {
  for (const path of paths) {
    try {
      revalidatePath(path)
    } catch {
      // kein Request-Kontext vorhanden — nichts zu invalidieren.
    }
  }
}

/** Betrifft gemeinsames Layout (Header/Footer) auf jeder Seite — z. B. bei siteSettings-Änderungen. */
export function revalidateLayoutAll() {
  try {
    revalidatePath('/', 'layout')
  } catch {
    // kein Request-Kontext vorhanden.
  }
}
