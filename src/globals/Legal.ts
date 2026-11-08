import type { GlobalConfig } from 'payload'

import { anyoneRead, isLoggedIn } from '../access'

export const Legal: GlobalConfig = {
  slug: 'legal',
  access: {
    read: anyoneRead,
    update: isLoggedIn,
  },
  fields: [
    {
      name: 'statusHinweis',
      type: 'text',
      defaultValue: 'Entwurf – vor Go-live prüfen lassen',
      admin: { position: 'sidebar' },
    },
    { name: 'impressum', type: 'richText', localized: true },
    { name: 'datenschutz', type: 'richText', localized: true },
  ],
}
