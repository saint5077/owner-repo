import type { CollectionConfig } from 'payload'

import { isLoggedIn } from '../access'
import { seoField } from '../fields/seo'
import { slugField } from '../fields/slug'

/** Ratgeber — optional, nur sichtbar wenn Beiträge existieren (Briefing §4). */
export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'published', 'publishedDate'],
  },
  access: {
    // Nur veröffentlichte Beiträge sind öffentlich sichtbar; kein volles Draft/Version-System
    // nötig (Briefing verlangt das nur für properties/services/home).
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
    { name: 'excerpt', type: 'textarea', localized: true },
    { name: 'content', type: 'richText', localized: true },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'publishedDate', type: 'date' },
    { name: 'published', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    seoField,
  ],
}
