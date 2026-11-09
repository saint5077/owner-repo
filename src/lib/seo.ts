import type { Metadata } from 'next'

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
}

type PageMetadataArgs = {
  title: string
  description?: string | null
  /** Pfad der deutschen Version, z. B. "/bewirtschaftung" oder "/" für die Startseite. */
  dePath: string
  /** Pfad der englischen Version, falls diese Phase sie übersetzt hat — sonst weglassen. */
  enPath?: string
  /** OG-Bild-Pfad, falls abweichend vom Next.js-Standard (`opengraph-image`-Konvention). */
  ogImage?: string
}

/**
 * Gemeinsamer Metadata-Baustein für canonical + hreflang. Nur Seiten mit echter englischer
 * Version (siehe DECISIONS.md #5x — Phase 7 übersetzt bewusst nur Startseite + Bewirtschaftung)
 * bekommen ein `en`-Alternate; alles andere bekommt nur ein Canonical, kein erfundenes
 * hreflang-Alternate auf eine nicht existierende Seite.
 */
export function pageMetadata({ title, description, dePath, enPath, ogImage }: PageMetadataArgs): Metadata {
  const languages: Record<string, string> = { 'de-CH': dePath }
  if (enPath) languages.en = enPath

  return {
    title,
    description: description ?? undefined,
    alternates: {
      canonical: dePath,
      languages,
    },
    openGraph: {
      title,
      description: description ?? undefined,
      images: ogImage ? [ogImage] : undefined,
      locale: 'de_CH',
      siteName: 'Nora Immobilien AG',
    },
  }
}

/** Dieselbe Hilfe für die (bisher zwei) echten englischen Seiten. */
export function pageMetadataEn({ title, description, enPath, dePath }: { title: string; description?: string | null; enPath: string; dePath: string }): Metadata {
  return {
    title,
    description: description ?? undefined,
    alternates: {
      canonical: enPath,
      languages: { 'de-CH': dePath, en: enPath },
    },
    openGraph: {
      title,
      description: description ?? undefined,
      locale: 'en',
      siteName: 'Nora Immobilien AG',
    },
  }
}
