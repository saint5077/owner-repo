import type { Field } from 'payload'

import { formatSlug } from '../utilities/formatSlug'

/** Auto-generiert aus `fieldToUse`, falls leer gelassen; manuell überschreibbar. */
export const slugField = (fieldToUse = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: 'Wird aus dem Titel generiert, falls leer gelassen.',
  },
  hooks: {
    beforeValidate: [
      ({ value, data, originalDoc }) => {
        if (value) return formatSlug(value)
        const source = (data?.[fieldToUse] ?? originalDoc?.[fieldToUse]) as string | undefined
        if (source) return formatSlug(source)
        return value
      },
    ],
  },
})
