import type { GlobalAfterChangeHook, GlobalConfig } from 'payload'

import { anyoneRead, isLoggedIn } from '../access'
import { revalidatePaths } from '../lib/revalidation'

const revalidateLegal: GlobalAfterChangeHook = ({ doc }) => {
  revalidatePaths(['/impressum', '/datenschutz'])
  return doc
}

export const Legal: GlobalConfig = {
  slug: 'legal',
  hooks: { afterChange: [revalidateLegal] },
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
