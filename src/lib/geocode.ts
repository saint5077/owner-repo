/**
 * swisstopo SearchServer — Geokodierung von Objektadressen (Briefing §7). Öffentliche API,
 * kein Schlüssel nötig. Antwortform verifiziert gegen die echte API (nicht angenommen):
 * `results[0].attrs.lat` / `.lon`, siehe DECISIONS.md Phase 5.
 */
export async function geocodeAddress(
  strasse: string | null | undefined,
  plz: string | null | undefined,
  ort: string | null | undefined,
): Promise<{ lat: number; lng: number } | null> {
  const searchText = [strasse, plz, ort].filter(Boolean).join(' ').trim()
  if (!searchText) return null

  const url = `https://api3.geo.admin.ch/rest/services/api/SearchServer?${new URLSearchParams({
    type: 'locations',
    sr: '4326',
    origins: 'address',
    searchText,
  })}`

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) })
    if (!res.ok) return null
    const data = (await res.json()) as {
      results?: { attrs?: { lat?: number; lon?: number } }[]
    }
    const attrs = data.results?.[0]?.attrs
    if (typeof attrs?.lat !== 'number' || typeof attrs?.lon !== 'number') return null
    return { lat: attrs.lat, lng: attrs.lon }
  } catch {
    // Kein API-Fehler darf das Speichern der Liegenschaft blockieren — Koordinaten bleiben
    // leer und können im Admin manuell nachgetragen werden.
    return null
  }
}
