import type { CollectionConfig } from 'payload'

import { anyoneRead, isLoggedIn } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: anyoneRead,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  upload: {
    crop: true,
    focalPoint: true,
    // Kein SVG-Upload erlaubt (Briefing §8).
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'application/pdf'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: { description: 'Alt-Text ist Pflicht (Barrierefreiheit, SEO).' },
    },
  ],
}
