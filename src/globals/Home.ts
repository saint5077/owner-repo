import type { GlobalConfig } from 'payload'

import { isLoggedIn, publishedOrLoggedIn } from '../access'
import { seoField } from '../fields/seo'

export const Home: GlobalConfig = {
  slug: 'home',
  versions: { drafts: true },
  access: {
    read: publishedOrLoggedIn,
    update: isLoggedIn,
  },
  fields: [
    {
      name: 'heroLead',
      type: 'textarea',
      localized: true,
      admin: {
        description:
          'H1 ist der feste Kundenclaim (Briefing §6) — dies ist der Lead-Satz darunter.',
      },
    },
    {
      name: 'wegweiser',
      type: 'array',
      label: '"Wie können wir Ihnen helfen?" — drei Textlinks',
      minRows: 3,
      maxRows: 3,
      fields: [
        { name: 'label', type: 'text', localized: true },
        { name: 'linkZiel', type: 'text', admin: { description: 'Interner Pfad, z. B. /objekte' } },
      ],
    },
    {
      name: 'ablaufSchritte',
      type: 'array',
      label: '"So übernehmen wir Ihre Liegenschaft"',
      fields: [
        { name: 'schritt', type: 'text', localized: true },
        { name: 'beschreibung', type: 'textarea', localized: true },
      ],
    },
    seoField,
  ],
}
