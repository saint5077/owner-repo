/**
 * Prüft den tatsächlichen Dateityp anhand der Magic Bytes — nie anhand der Dateiendung oder des
 * vom Client gesendeten MIME-Typs, beides lässt sich beliebig fälschen (Briefing §9).
 */
export function detectImageType(bytes: Uint8Array): 'jpeg' | 'png' | 'heic' | null {
  if (bytes.length < 12) return null

  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'jpeg'

  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return 'png'

  // HEIC/HEIF: ISOBMFF-Box-Format — Bytes 4-8 sind "ftyp", die Marke danach beginnt mit "hei"/"mif1"/"msf1".
  const ftyp = String.fromCharCode(bytes[4], bytes[5], bytes[6], bytes[7])
  if (ftyp === 'ftyp') {
    const brand = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11])
    if (brand.startsWith('hei') || brand.startsWith('mif1') || brand.startsWith('msf1') || brand.startsWith('heix')) {
      return 'heic'
    }
  }

  return null
}

export const MAX_FOTO_BYTES = 8 * 1024 * 1024
