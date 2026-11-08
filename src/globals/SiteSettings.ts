import type { GlobalConfig } from 'payload'

import { anyoneRead, isLoggedIn } from '../access'

const WOCHENTAGE = [
  { label: 'Montag', value: 'mo' },
  { label: 'Dienstag', value: 'di' },
  { label: 'Mittwoch', value: 'mi' },
  { label: 'Donnerstag', value: 'do' },
  { label: 'Freitag', value: 'fr' },
  { label: 'Samstag', value: 'sa' },
  { label: 'Sonntag', value: 'so' },
]

export const SiteSettings: GlobalConfig = {
  slug: 'siteSettings',
  access: {
    read: anyoneRead,
    update: isLoggedIn,
  },
  fields: [
    {
      type: 'group',
      name: 'firma',
      fields: [
        { name: 'name', type: 'text', defaultValue: 'Nora Immobilien AG' },
        {
          type: 'group',
          name: 'adresse',
          fields: [
            { name: 'strasse', type: 'text' },
            { name: 'plz', type: 'text' },
            { name: 'ort', type: 'text', defaultValue: 'Zürich' },
          ],
        },
        { name: 'telefon', type: 'text' },
        { name: 'email', type: 'email' },
        {
          name: 'uid',
          type: 'text',
          admin: { description: 'Erst nach Zefix-Prüfung eintragen — siehe CONTENT_TODO.md.' },
        },
        { name: 'handelsregisterNr', type: 'text' },
        { name: 'mwstNr', type: 'text' },
      ],
    },
    {
      type: 'group',
      name: 'oeffnungszeiten',
      fields: [
        {
          name: 'regulaer',
          type: 'array',
          fields: [
            { name: 'tag', type: 'select', options: WOCHENTAGE },
            { name: 'geschlossen', type: 'checkbox', defaultValue: true },
            { name: 'von', type: 'text', admin: { condition: (_, s) => !s?.geschlossen } },
            { name: 'bis', type: 'text', admin: { condition: (_, s) => !s?.geschlossen } },
          ],
          admin: {
            description:
              'Noch nicht vom Kunden bestätigt (nur Drittverzeichnis-Quelle) — siehe CONTENT_TODO.md.',
          },
        },
        {
          name: 'ausnahmen',
          type: 'array',
          label: 'Ausnahmen / Feiertage',
          fields: [
            { name: 'datum', type: 'date' },
            { name: 'grund', type: 'text' },
            { name: 'geschlossen', type: 'checkbox', defaultValue: true },
          ],
        },
      ],
    },
    {
      name: 'notfallnummern',
      type: 'array',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'nummer', type: 'text' },
      ],
    },
    { name: 'googleBusinessUrl', type: 'text' },
    {
      name: 'mitgliedschaften',
      type: 'array',
      fields: [
        { name: 'name', type: 'text' },
        { name: 'logo', type: 'upload', relationTo: 'media' },
        { name: 'url', type: 'text' },
      ],
    },
    {
      type: 'group',
      name: 'empfaengerEmails',
      label: 'Empfänger-E-Mail je Formulartyp',
      fields: [
        { name: 'verwaltung', type: 'email' },
        { name: 'ersteinschaetzung', type: 'email' },
        { name: 'schaden', type: 'email' },
        { name: 'besichtigung', type: 'email' },
        { name: 'allgemein', type: 'email' },
      ],
    },
    {
      name: 'demoBannerText',
      type: 'text',
      defaultValue: 'Konzept-Vorschau von Axion – nicht die offizielle Website der Nora Immobilien AG.',
    },
  ],
}
