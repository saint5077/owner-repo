import type { CollectionConfig } from 'payload'

import { anyoneRead, isLoggedIn } from '../access'

export const Downloads: CollectionConfig = {
  slug: 'downloads',
  admin: {
    useAsTitle: 'titel',
    defaultColumns: ['titel', 'kategorie'],
  },
  access: {
    read: anyoneRead,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  fields: [
    { name: 'titel', type: 'text', required: true, localized: true },
    {
      name: 'kategorie',
      type: 'select',
      required: true,
      options: [
        { label: 'Mieterschaft', value: 'mieterschaft' },
        { label: 'Eigentümerschaft', value: 'eigentuemerschaft' },
        { label: 'STWEG', value: 'stweg' },
      ],
    },
    { name: 'datei', type: 'upload', relationTo: 'media', required: true },
  ],
}
