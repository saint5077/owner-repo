import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionBeforeChangeHook,
  CollectionConfig,
} from 'payload'

import { isLoggedIn, publishedOrLoggedIn } from '../access'
import { slugField } from '../fields/slug'
import { seoField } from '../fields/seo'
import { geocodeAddress } from '../lib/geocode'
import { revalidatePaths } from '../lib/revalidation'
import { notifyMatchingSearchAlerts } from '../lib/search-alerts/notify'

const KREISE = Array.from({ length: 12 }, (_, i) => ({
  label: `Kreis ${i + 1}`,
  value: String(i + 1),
}))

// Betrifft den Startseiten-Teaser "Aktuelle Objekte" und die /objekte-Liste; die Detailseite
// bekommt zusätzlich ihren eigenen Pfad invalidiert, damit eine Preisänderung o. Ä. sofort
// sichtbar wird, ohne auf die tägliche `revalidate = 86400`-Backstop zu warten (DECISIONS.md #26).
const revalidateProperty: CollectionAfterChangeHook = ({ doc }) => {
  const paths = ['/', '/objekte']
  if (doc?.slug) paths.push(`/objekte/${doc.slug}`)
  revalidatePaths(paths)
}
const revalidatePropertyOnDelete: CollectionAfterDeleteHook = ({ doc }) => {
  const paths = ['/', '/objekte']
  if (doc?.slug) paths.push(`/objekte/${doc.slug}`)
  revalidatePaths(paths)
}

/**
 * Suchabo-Benachrichtigung (Briefing §8, Phase 6): sobald ein Objekt erstmals "verfügbar" wird,
 * passende bestätigte Suchabos per E-Mail informieren. Idempotent über `alertsSentAt` — läuft
 * nie zweimal für dasselbe Objekt (`src/lib/search-alerts/notify.ts`).
 */
const notifySearchAlertsOnAvailable: CollectionAfterChangeHook = async ({ doc, previousDoc, req }) => {
  const wurdeGeradeVerfuegbar = doc.objektstatus === 'verfuegbar' && previousDoc?.objektstatus !== 'verfuegbar'
  if (!wurdeGeradeVerfuegbar || doc.alertsSentAt) return doc

  try {
    await notifyMatchingSearchAlerts(req.payload, doc)
    await req.payload.update({
      collection: 'properties',
      id: doc.id,
      data: { alertsSentAt: new Date().toISOString() },
      overrideAccess: true,
    })
  } catch (error) {
    console.error('[search-alerts] Benachrichtigung fehlgeschlagen', error)
  }
  return doc
}

/**
 * swisstopo-Geokodierung (Briefing §7/Umsetzungsplan Phase 5): befüllt `koordinaten` aus der
 * Adresse, sobald sich Strasse/PLZ/Ort ändern oder noch keine Koordinaten vorliegen. Läuft nur,
 * wenn tatsächlich eine Strasse gesetzt ist — die drei Demo-Objekte tragen bewusst keine
 * (erfundene) Strassenadresse, nur "Zürich, Kreis N" (DECISIONS.md Phase 0 §2), und lösen die
 * Geokodierung deshalb nie aus; die Detailseite zeigt für sie konsequent den Kreis-Näherungs-
 * Fallback statt eines Pins. Ein API-Fehler oder Kein-Treffer blockiert das Speichern nicht.
 */
const geocodeOnAddressChange: CollectionBeforeChangeHook = async ({ data, originalDoc }) => {
  const adresse = data.adresse as { strasse?: string; plz?: string; ort?: string } | undefined
  if (!adresse?.strasse) return data

  const alteAdresse = originalDoc?.adresse as { strasse?: string; plz?: string; ort?: string } | undefined
  const adresseGeaendert =
    !originalDoc ||
    alteAdresse?.strasse !== adresse.strasse ||
    alteAdresse?.plz !== adresse.plz ||
    alteAdresse?.ort !== adresse.ort
  const hatKoordinaten =
    typeof data.koordinaten?.lat === 'number' && typeof data.koordinaten?.lng === 'number'

  if (!adresseGeaendert && hatKoordinaten) return data

  const treffer = await geocodeAddress(adresse.strasse, adresse.plz, adresse.ort)
  if (treffer) {
    data.koordinaten = treffer
  }
  return data
}

export const Properties: CollectionConfig = {
  slug: 'properties',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'objektstatus', 'angebotsart', 'ort', 'isExample'],
  },
  versions: {
    drafts: true,
    maxPerDoc: 25,
  },
  hooks: {
    beforeChange: [geocodeOnAddressChange],
    afterChange: [revalidateProperty, notifySearchAlertsOnAvailable],
    afterDelete: [revalidatePropertyOnDelete],
  },
  access: {
    read: publishedOrLoggedIn,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    slugField('title'),
    {
      // Bewusst nicht "status" genannt: kollidiert sonst mit dem von Payload intern erzeugten
      // Draft/Publish-Enum "_status" (gleicher generierter Postgres-Enum-Name) — DECISIONS.md.
      name: 'objektstatus',
      type: 'select',
      required: true,
      defaultValue: 'entwurf',
      label: 'Status',
      options: [
        { label: 'Entwurf', value: 'entwurf' },
        { label: 'Verfügbar', value: 'verfuegbar' },
        { label: 'Reserviert', value: 'reserviert' },
        { label: 'Vermietet', value: 'vermietet' },
        { label: 'Verkauft', value: 'verkauft' },
      ],
    },
    {
      name: 'angebotsart',
      type: 'select',
      required: true,
      options: [
        { label: 'Miete', value: 'miete' },
        { label: 'Kauf', value: 'kauf' },
      ],
    },
    {
      name: 'objektart',
      type: 'select',
      required: true,
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
    {
      type: 'group',
      name: 'adresse',
      fields: [
        { name: 'strasse', type: 'text' },
        { name: 'plz', type: 'text' },
        { name: 'ort', type: 'text', defaultValue: 'Zürich' },
      ],
    },
    {
      name: 'adressePublicAnzeigen',
      type: 'checkbox',
      defaultValue: false,
      label: 'Adresse öffentlich anzeigen',
      admin: {
        description:
          'Wenn aus: auf der Detailseite nur ungefährer Kreis statt Pin/Adresse (Briefing §6 Objektdetail).',
      },
    },
    { name: 'kreis', type: 'select', options: KREISE },
    {
      type: 'group',
      name: 'koordinaten',
      admin: {
        description:
          'Wird in Phase 5 automatisch per swisstopo-Geokodierungs-Hook aus der Adresse befüllt. ' +
          'Als lat/lng-Zahlenpaar statt Payload-"point"-Feldtyp, da Letzterer die PostGIS-Erweiterung ' +
          'voraussetzt, die auf der lokalen Entwicklungsdatenbank nicht verfügbar ist (DECISIONS.md).',
      },
      fields: [
        { name: 'lat', type: 'number', admin: { readOnly: true, step: 0.000001 } },
        { name: 'lng', type: 'number', admin: { readOnly: true, step: 0.000001 } },
      ],
    },
    { name: 'zimmer', type: 'number', min: 0, admin: { step: 0.5 } },
    { name: 'wohnflaecheM2', type: 'number', label: 'Wohnfläche (m²)' },
    { name: 'nutzflaecheM2', type: 'number', label: 'Nutzfläche (m²)' },
    { name: 'etage', type: 'text' },
    { name: 'baujahr', type: 'number' },
    { name: 'renovationJahr', type: 'number', label: 'Renovation (Jahr)' },
    {
      type: 'group',
      name: 'verfuegbarAb',
      fields: [
        {
          name: 'typ',
          type: 'select',
          defaultValue: 'nachVereinbarung',
          options: [
            { label: 'Datum', value: 'datum' },
            { label: 'Sofort', value: 'sofort' },
            { label: 'Nach Vereinbarung', value: 'nachVereinbarung' },
          ],
        },
        {
          name: 'datum',
          type: 'date',
          admin: { condition: (_, siblingData) => siblingData?.typ === 'datum' },
        },
      ],
    },
    { name: 'nettomiete', type: 'number', admin: { description: 'CHF pro Monat' } },
    {
      type: 'group',
      name: 'nebenkosten',
      fields: [
        { name: 'betrag', type: 'number' },
        {
          name: 'typ',
          type: 'select',
          options: [
            { label: 'Akonto', value: 'akonto' },
            { label: 'Pauschal', value: 'pauschal' },
          ],
        },
      ],
    },
    {
      name: 'bruttomiete',
      type: 'number',
      admin: {
        readOnly: true,
        description: 'Berechnet aus Nettomiete + Nebenkosten (beforeChange-Hook).',
      },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            const netto = siblingData?.nettomiete
            const nk = siblingData?.nebenkosten?.betrag
            if (typeof netto === 'number' && typeof nk === 'number') return netto + nk
            if (typeof netto === 'number') return netto
            return undefined
          },
        ],
      },
    },
    { name: 'kaufpreis', type: 'number', admin: { description: 'CHF' } },
    { name: 'preisAufAnfrage', type: 'checkbox', defaultValue: false },
    {
      name: 'merkmale',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Balkon/Terrasse', value: 'balkon-terrasse' },
        { label: 'Lift', value: 'lift' },
        { label: 'Eigene Waschmaschine/Tumbler', value: 'eigene-waschmaschine' },
        { label: 'Geschirrspüler', value: 'geschirrspueler' },
        { label: 'Parkett', value: 'parkett' },
        { label: 'Haustiere erlaubt', value: 'haustiere-erlaubt' },
        { label: 'Rollstuhlgängig', value: 'rollstuhlgaengig' },
        { label: 'Minergie', value: 'minergie' },
        { label: 'Gartensitzplatz', value: 'gartensitzplatz' },
        { label: 'Keller', value: 'keller' },
        { label: 'Estrich', value: 'estrich' },
        { label: 'Parkplatz', value: 'parkplatz' },
      ],
    },
    { name: 'beschreibung', type: 'richText', localized: true },
    { name: 'lage', type: 'richText', localized: true },
    { name: 'galerie', type: 'upload', relationTo: 'media', hasMany: true },
    { name: 'grundrisse', type: 'upload', relationTo: 'media', hasMany: true },
    { name: 'dokumente', type: 'upload', relationTo: 'media', hasMany: true },
    {
      name: 'mediaLink',
      type: 'text',
      label: 'Video- bzw. 360°-Link',
      admin: { description: 'Externer Link (YouTube, Matterport o. ä.).' },
    },
    { name: 'ansprechperson', type: 'relationship', relationTo: 'team' },
    {
      name: 'besichtigungstermine',
      type: 'array',
      fields: [{ name: 'termin', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } }],
    },
    {
      name: 'portalLinks',
      type: 'array',
      label: 'Links zu Portal-Inseraten',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'url', type: 'text' },
      ],
    },
    seoField,
    {
      name: 'isExample',
      type: 'checkbox',
      defaultValue: false,
      label: 'Beispielobjekt (Demo)',
      admin: {
        position: 'sidebar',
        description: 'Wird vor dem Go-live gelöscht (Briefing §8). Zeigt Badge "Beispiel" im Demo-Modus.',
      },
    },
    {
      name: 'alertsSentAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Idempotenz-Marker für Suchabo-Benachrichtigungen (Phase 6).',
      },
    },
  ],
}
