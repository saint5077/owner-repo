import type { GlobalConfig } from 'payload'

import { anyoneRead, isLoggedIn } from '../access'
import { seoField } from '../fields/seo'

export const About: GlobalConfig = {
  slug: 'about',
  access: {
    read: anyoneRead,
    update: isLoggedIn,
  },
  fields: [
    { name: 'haltungText', type: 'richText', localized: true },
    {
      name: 'geschichteMeilensteine',
      type: 'array',
      fields: [
        { name: 'jahr', type: 'number' },
        { name: 'text', type: 'text', localized: true },
      ],
      admin: { description: 'Optional — nur falls der Kunde Meilensteine bestätigt (CONTENT_TODO.md).' },
    },
    seoField,
  ],
}
