import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionConfig } from 'payload'

import { anyoneRead, isLoggedIn } from '../access'
import { revalidatePaths } from '../lib/revalidation'

// Team erscheint auf der Startseite und auf /ueber-uns — DECISIONS.md #26.
const revalidateTeam: CollectionAfterChangeHook = ({ doc }) => {
  revalidatePaths(['/', '/ueber-uns'])
  return doc
}
const revalidateTeamOnDelete: CollectionAfterDeleteHook = ({ doc }) => {
  revalidatePaths(['/', '/ueber-uns'])
  return doc
}

export const Team: CollectionConfig = {
  slug: 'team',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'rolle', 'reihenfolge'],
  },
  hooks: {
    afterChange: [revalidateTeam],
    afterDelete: [revalidateTeamOnDelete],
  },
  access: {
    read: anyoneRead,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'rolle',
      type: 'text',
      admin: {
        description:
          'Rollenbezeichnung noch nicht vom Kunden bestätigt (siehe CONTENT_TODO.md) — leer lassen, bis geklärt.',
      },
    },
    { name: 'kurztext', type: 'textarea', localized: true },
    { name: 'foto', type: 'upload', relationTo: 'media' },
    { name: 'telefon', type: 'text' },
    { name: 'email', type: 'email' },
    {
      name: 'sprachen',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Deutsch', value: 'de' },
        { label: 'Englisch', value: 'en' },
        { label: 'Französisch', value: 'fr' },
        { label: 'Italienisch', value: 'it' },
      ],
    },
    { name: 'reihenfolge', type: 'number', defaultValue: 0 },
  ],
}
