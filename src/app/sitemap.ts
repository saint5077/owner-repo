import type { MetadataRoute } from 'next'

import { getPayloadClient } from '@/lib/payload'
import { getSiteUrl } from '@/lib/seo'

const STATIC_DE: { path: string; priority?: number }[] = [
  { path: '/', priority: 1 },
  { path: '/bewirtschaftung', priority: 0.8 },
  { path: '/stockwerkeigentum', priority: 0.8 },
  { path: '/erstvermietung', priority: 0.8 },
  { path: '/verkauf', priority: 0.8 },
  { path: '/objekte', priority: 0.9 },
  { path: '/mieterservice' },
  { path: '/ueber-uns' },
  { path: '/kontakt' },
  { path: '/suchabo' },
  { path: '/impressum' },
  { path: '/datenschutz' },
]

// Nur Seiten, die diese Phase tatsächlich übersetzt hat (DECISIONS.md #5x).
const STATIC_EN: string[] = ['/en', '/en/bewirtschaftung']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl()
  const payload = await getPayloadClient()

  const properties = await payload
    .find({
      collection: 'properties',
      where: { objektstatus: { in: ['verfuegbar', 'reserviert'] } },
      limit: 1000,
      depth: 0,
    })
    .catch(() => ({ docs: [] as { slug?: string | null; updatedAt?: string }[] }))

  const entries: MetadataRoute.Sitemap = STATIC_DE.map(({ path, priority }) => ({
    url: `${base}${path}`,
    priority,
  }))

  for (const path of STATIC_EN) {
    entries.push({ url: `${base}${path}` })
  }

  for (const property of properties.docs) {
    if (!property.slug) continue
    entries.push({
      url: `${base}/objekte/${property.slug}`,
      lastModified: property.updatedAt ? new Date(property.updatedAt) : undefined,
    })
  }

  return entries
}
