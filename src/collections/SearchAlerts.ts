import type { CollectionConfig } from 'payload'

import { isLoggedIn, nobodyCreate } from '../access'

/** Privat. Double-Opt-in-Tokens werden serverseitig erzeugt (Phase 6) — kein öffentliches create. */
export const SearchAlerts: CollectionConfig = {
  slug: 'searchAlerts',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'bestaetigtAm', 'sprache'],
  },
  access: {
    read: isLoggedIn,
    create: nobodyCreate,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  fields: [
    { name: 'email', type: 'email', required: true },
    {
      type: 'group',
      name: 'kriterien',
      fields: [
        {
          name: 'angebotsart',
          type: 'select',
          options: [
            { label: 'Miete', value: 'miete' },
            { label: 'Kauf', value: 'kauf' },
          ],
        },
        {
          name: 'objektart',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Wohnung', value: 'wohnung' },
            { label: 'Maisonette', value: 'maisonette' },
            { label: 'Attika', value: 'attika' },
            { label: 'Studio', value: 'studio' },
            { label: 'Einfamilienhaus', value: 'einfamilienhaus' },
            { label: 'Reihenhaus', value: 'reihenhaus' },
            { label: 'Büro', value: 'buero' },
            { label: 'Gewerbe', value: 'gewerbe' },
            { label: 'Parkplatz', value: 'parkplatz' },
            { label: 'Einstellhallenplatz', value: 'einstellhallenplatz' },
            { label: 'Lager/Bastelraum', value: 'lager' },
          ],
        },
        { name: 'zimmerVon', type: 'number', admin: { step: 0.5 } },
        { name: 'zimmerBis', type: 'number', admin: { step: 0.5 } },
        { name: 'preisBis', type: 'number' },
        { name: 'flaecheAb', type: 'number' },
        {
          name: 'kreis',
          type: 'select',
          hasMany: true,
          options: Array.from({ length: 12 }, (_, i) => ({
            label: `Kreis ${i + 1}`,
            value: String(i + 1),
          })),
        },
        { name: 'verfuegbarAb', type: 'date' },
      ],
    },
    {
      name: 'sprache',
      type: 'select',
      defaultValue: 'de',
      options: [
        { label: 'Deutsch', value: 'de' },
        { label: 'Englisch', value: 'en' },
      ],
    },
    {
      name: 'bestaetigungsToken',
      type: 'text',
      unique: true,
      admin: { readOnly: true, description: 'Double-Opt-in-Token (Phase 6).' },
    },
    {
      name: 'abmeldeToken',
      type: 'text',
      unique: true,
      admin: { readOnly: true },
    },
    { name: 'bestaetigtAm', type: 'date' },
  ],
}
