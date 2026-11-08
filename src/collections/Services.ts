import type { CollectionConfig } from 'payload'

import { isLoggedIn, publishedOrLoggedIn } from '../access'
import { seoField } from '../fields/seo'

// Bewusst keine freie Page-Builder-Struktur — strukturierte Felder schützen das Design (Briefing §8).
export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'serviceType',
    defaultColumns: ['serviceType', 'contentStatus'],
    description: 'Genau vier Einträge, einer je fixer Leistungsroute (/bewirtschaftung etc.).',
  },
  versions: { drafts: true },
  access: {
    read: publishedOrLoggedIn,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  fields: [
    {
      name: 'serviceType',
      type: 'select',
      required: true,
      unique: true,
      options: [
        { label: 'Bewirtschaftung', value: 'bewirtschaftung' },
        { label: 'Stockwerkeigentum', value: 'stockwerkeigentum' },
        { label: 'Erstvermietung', value: 'erstvermietung' },
        { label: 'Verkauf', value: 'verkauf' },
      ],
    },
    {
      name: 'contentStatus',
      type: 'select',
      defaultValue: 'bestaetigt',
      options: [
        { label: 'Bestätigt (Kundentext aus Phase 0)', value: 'bestaetigt' },
        { label: 'Entwurf – braucht fachliche Freigabe', value: 'entwurf' },
      ],
      admin: {
        position: 'sidebar',
        description:
          'Siehe DESIGN.md §11: Bewirtschaftung/Erstvermietung/Verkauf sind wörtlich aus der alten Seite übernommen. Stockwerkeigentum-Liste ist ein Entwurf.',
      },
    },
    { name: 'claim', type: 'text', localized: true, admin: { description: 'Der kurze Leitsatz.' } },
    { name: 'einleitung', type: 'richText', localized: true },
    {
      name: 'leistungsgruppen',
      type: 'array',
      label: 'Was wir übernehmen',
      fields: [
        { name: 'titel', type: 'text', localized: true },
        {
          name: 'punkte',
          type: 'array',
          fields: [{ name: 'text', type: 'text', localized: true }],
        },
      ],
    },
    {
      name: 'ablauf',
      type: 'array',
      label: 'Ablauf (nur bei echter Abfolge)',
      fields: [
        { name: 'schritt', type: 'text', localized: true },
        { name: 'beschreibung', type: 'textarea', localized: true },
      ],
    },
    {
      name: 'faq',
      type: 'array',
      fields: [
        { name: 'frage', type: 'text', localized: true },
        { name: 'antwort', type: 'richText', localized: true },
      ],
    },
    {
      name: 'zeichnungsvariante',
      type: 'select',
      options: [
        { label: 'Mehrfamilienhaus-Ansicht (Bewirtschaftung)', value: 'mfh' },
        { label: 'Schnitt mit Geschossen (Stockwerkeigentum)', value: 'schnitt' },
        { label: 'Neubau mit Balkonen (Erstvermietung)', value: 'neubau' },
        { label: 'Einfamilienhaus (Verkauf)', value: 'efh' },
      ],
      admin: { description: 'Siehe DESIGN.md §8 Zeichnungsmodul.' },
    },
    seoField,
  ],
}
