import type { CollectionConfig } from 'payload'

import { isLoggedIn, nobodyCreate } from '../access'

/**
 * Privat. Wird ausschliesslich von Server Actions über die Payload Local API angelegt
 * (Phase 6, `overrideAccess: true` nach serverseitiger Zod-Validierung + Spam-Schutz) —
 * nie direkt über die öffentliche REST-API, daher `create: nobodyCreate`.
 */
export const Submissions: CollectionConfig = {
  slug: 'submissions',
  admin: {
    useAsTitle: 'referenznummer',
    defaultColumns: ['referenznummer', 'type', 'status', 'createdAt'],
  },
  access: {
    read: isLoggedIn,
    create: nobodyCreate,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Verwaltung anfragen', value: 'verwaltung' },
        { label: 'Ersteinschätzung (Verkauf)', value: 'ersteinschaetzung' },
        { label: 'Schaden melden', value: 'schaden' },
        { label: 'Besichtigung anfragen', value: 'besichtigung' },
        { label: 'Allgemeine Anfrage', value: 'allgemein' },
      ],
    },
    {
      name: 'data',
      type: 'json',
      required: true,
      admin: { description: 'Formularfelder als JSON (Schema variiert je nach type).' },
    },
    { name: 'anhaenge', type: 'upload', relationTo: 'media', hasMany: true },
    { name: 'referenznummer', type: 'text', required: true, unique: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'neu',
      options: [
        { label: 'Neu', value: 'neu' },
        { label: 'In Bearbeitung', value: 'in-bearbeitung' },
        { label: 'Erledigt', value: 'erledigt' },
      ],
    },
    { name: 'zustaendigePerson', type: 'relationship', relationTo: 'team' },
    { name: 'interneNotizen', type: 'textarea' },
    // `datum` bewusst nicht dupliziert — Payloads automatisches `createdAt` erfüllt denselben Zweck.
  ],
  timestamps: true,
}
