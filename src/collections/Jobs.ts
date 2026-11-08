import type { CollectionConfig } from 'payload'

import { isLoggedIn } from '../access'
import { seoField } from '../fields/seo'
import { slugField } from '../fields/slug'

/** Stellen — optional, nur sichtbar wenn Stellen existieren (Briefing §4). */
export const Jobs: CollectionConfig = {
  slug: 'jobs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'pensum', 'published'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return { published: { equals: true } }
    },
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    slugField('title'),
    { name: 'pensum', type: 'text', admin: { description: 'z. B. "80–100%"' } },
    { name: 'beschreibung', type: 'richText', localized: true },
    { name: 'published', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    seoField,
  ],
}
