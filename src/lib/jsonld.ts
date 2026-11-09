import type { Service, SiteSetting } from '@/payload-types'
import { getSiteUrl } from '@/lib/seo'

/**
 * RealEstateAgent-JSON-LD für die Organisation. Nimmt nur Felder auf, die `siteSettings`
 * tatsächlich bestätigt enthält — UID/Handelsregister/Öffnungszeiten sind laut CONTENT_TODO.md
 * noch nicht vom Kunden bestätigt und werden hier bewusst NICHT als leere Strings oder
 * Platzhalter ausgegeben, sondern einfach weggelassen (nichts erfinden gilt auch für
 * strukturierte Daten, die Google direkt als Fakt interpretiert).
 */
export function buildRealEstateAgentJsonLd(siteSettings: SiteSetting | null) {
  const firma = siteSettings?.firma
  if (!firma?.name) return null

  const address =
    firma.adresse?.strasse || firma.adresse?.plz || firma.adresse?.ort
      ? {
          '@type': 'PostalAddress',
          streetAddress: firma.adresse?.strasse ?? undefined,
          postalCode: firma.adresse?.plz ?? undefined,
          addressLocality: firma.adresse?.ort ?? undefined,
          addressCountry: 'CH',
        }
      : undefined

  const memberOf = (siteSettings?.mitgliedschaften ?? [])
    .filter((m) => m.name)
    .map((m) => ({ '@type': 'Organization', name: m.name, url: m.url ?? undefined }))

  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: firma.name,
    url: getSiteUrl(),
    telephone: firma.telefon ?? undefined,
    email: firma.email ?? undefined,
    address,
    foundingDate: '1979',
    areaServed: 'Zürich',
    memberOf: memberOf.length > 0 ? memberOf : undefined,
    sameAs: siteSettings?.googleBusinessUrl ? [siteSettings.googleBusinessUrl] : undefined,
  }
}

export function buildServiceJsonLd(service: Service, dePath: string) {
  if (!service.claim) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: service.claim,
    provider: { '@type': 'RealEstateAgent', name: 'Nora Immobilien AG' },
    areaServed: 'Zürich',
    url: `${getSiteUrl()}${dePath}`,
  }
}

export function buildBreadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${getSiteUrl()}${item.path}`,
    })),
  }
}
