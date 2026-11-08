import type { Field } from 'payload'

export const seoField: Field = {
  name: 'seo',
  type: 'group',
  admin: { description: 'Metadata API (Phase 7) liest diese Felder pro Seite.' },
  fields: [
    { name: 'title', type: 'text', localized: true },
    { name: 'description', type: 'textarea', localized: true },
  ],
}
