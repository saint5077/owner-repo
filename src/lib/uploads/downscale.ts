const MAX_DIMENSION = 2560

/**
 * Verkleinert ein Bild clientseitig auf max. 2560 px (Briefing §9), bevor es hochgeladen wird.
 * HEIC-Dateien kann `<canvas>` in den meisten Browsern (ausser Safari) nicht dekodieren — in
 * diesem Fall wird stillschweigend die Originaldatei zurückgegeben; die serverseitige
 * Magic-Bytes-Prüfung und die 8-MB-Grenze greifen so oder so.
 */
export async function downscaleImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/heic' || file.type === 'image/heif') {
    return file
  }

  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height))
    if (scale >= 1) return file

    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    const ctx = canvas.getContext('2d')
    if (!ctx) return file
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)

    const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.85))
    if (!blob) return file
    return new File([blob], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' })
  } catch {
    return file
  }
}
