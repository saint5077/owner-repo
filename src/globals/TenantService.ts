import type { GlobalAfterChangeHook, GlobalConfig } from 'payload'

import { anyoneRead, isLoggedIn } from '../access'
import { seoField } from '../fields/seo'
import { revalidatePaths } from '../lib/revalidation'

const revalidateTenantService: GlobalAfterChangeHook = ({ doc }) => {
  revalidatePaths(['/mieterservice', '/mieterservice/schadenmeldung'])
  return doc
}

export const TenantService: GlobalConfig = {
  slug: 'tenantService',
  hooks: { afterChange: [revalidateTenantService] },
  access: {
    read: anyoneRead,
    update: isLoggedIn,
  },
  fields: [
    {
      name: 'notfallStatusHinweis',
      type: 'text',
      defaultValue: 'Entwurf – vor Go-live fachlich/rechtlich prüfen lassen.',
      admin: { position: 'sidebar' },
    },
    { name: 'notfallText', type: 'richText' },
    {
      name: 'faq',
      type: 'array',
      fields: [
        { name: 'frage', type: 'text', localized: true },
        { name: 'antwort', type: 'richText', localized: true },
      ],
    },
    seoField,
  ],
}
