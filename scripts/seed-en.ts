/**
 * Phase 7: schreibt echte, von Hand verfasste englische Übersetzungen für genau die beiden
 * Seiten, die diese Phase tatsächlich übersetzt (Startseite, Bewirtschaftung) — siehe
 * DECISIONS.md #5x "/en-Umfang bewusst auf zwei Seiten begrenzt". Alle anderen lokalisierten
 * Felder bleiben unübersetzt und fallen dank `localization.fallback: true` automatisch auf
 * Deutsch zurück (payload.config.ts), was auf noch nicht übersetzten Seiten korrekt und
 * sichtbar durch den DraftBox-Hinweis auf jeder /en-Seite eingeordnet ist.
 *
 * Kein neuer Inhalt wird erfunden — jede englische Formulierung ist eine Übersetzung bereits
 * bestätigten deutschen Inhalts aus der `services`/`home`-Collection, kein neuer Fakt.
 */
import { getPayload } from 'payload'

import config from '../src/payload.config'

async function main() {
  const payload = await getPayload({ config })

  console.log('EN-Inhalt: Bewirtschaftung …')
  const svc = await payload.find({
    collection: 'services',
    where: { serviceType: { equals: 'bewirtschaftung' } },
    limit: 1,
  })
  const doc = svc.docs[0]
  if (doc) {
    // WICHTIG: Array-Zeilen ohne `id` werden von Payload nicht aktualisiert, sondern komplett
    // ersetzt — das löscht dabei die zugehörigen fremdsprachigen `_locales`-Zeilen der ANDEREN
    // Sprache mit (hier: Deutsch), weil die Zeile selbst (nicht nur ihr Text) neu angelegt wird.
    // Deshalb werden hier die echten, bereits bestehenden Zeilen-IDs aus `doc` wiederverwendet,
    // nicht neue Objekte ohne ID geschrieben. Gefunden und korrigiert beim Homepage-Umbau, siehe
    // DECISIONS.md — vorher hatte dieses Skript die deutschen `punkte`-Texte der Bewirtschaftung
    // beim Ausführen von `pnpm seed:en` stillschweigend gelöscht.
    const bestehendeGruppe = doc.leistungsgruppen?.[0]
    const bestehendePunkte = bestehendeGruppe?.punkte ?? []
    const punkteEn = [
      'Letting',
      'Handover and return of rented units',
      'Ongoing maintenance',
      'Value preservation',
      'Rent control',
      'Payment processing',
      'Accounts payable and receivable',
      'Annual balance sheet and income statement',
    ]
    if (bestehendePunkte.length !== punkteEn.length) {
      throw new Error(
        `Erwartete ${punkteEn.length} 'punkte'-Zeilen bei Bewirtschaftung, gefunden: ${bestehendePunkte.length}. ` +
          `Zuerst 'pnpm seed' (DE) erneut ausführen, dann erst 'pnpm seed:en'.`,
      )
    }

    await payload.update({
      collection: 'services',
      id: doc.id,
      locale: 'en',
      data: {
        claim: 'We look after your property as if it were our own.',
        einleitung: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'In managing the commercial and residential properties entrusted to us, reliability and accuracy come first. As your point of contact for every aspect of property management, our strengths include the following:',
                    version: 1,
                  },
                ],
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
        leistungsgruppen: [
          {
            id: bestehendeGruppe?.id,
            titel: 'What we take care of',
            punkte: bestehendePunkte.map((punkt, i) => ({ id: punkt.id, text: punkteEn[i] })),
          },
        ],
      },
    })
    console.log('  … gespeichert.')
  } else {
    console.warn('  Bewirtschaftung-Dokument nicht gefunden — übersprungen.')
  }

  console.log('EN-Inhalt: Home (heroLead, Wegweiser, Ablauf) …')
  const home = await payload.findGlobal({ slug: 'home' })
  const bestehenderWegweiser = home?.wegweiser ?? []
  const bestehendeAblaufSchritte = home?.ablaufSchritte ?? []
  const wegweiserEn = [
    { label: 'I own a property', linkZiel: '/bewirtschaftung' },
    { label: 'I live in a property managed by Nora', linkZiel: '/mieterservice' },
    { label: 'I am looking for a home', linkZiel: '/objekte' },
  ]
  const ablaufSchritteEn = [
    {
      schritt: 'Getting acquainted',
      beschreibung: 'A personal conversation in which we get to know your property and your needs.',
    },
    {
      schritt: 'Proposal',
      beschreibung: 'You receive a transparent proposal for the services you require.',
    },
    {
      schritt: 'Handover',
      beschreibung: 'We take over the documents and organise a smooth transition.',
    },
    {
      schritt: 'Ongoing support',
      beschreibung: 'From day one, we are your direct point of contact for your property.',
    },
  ]
  if (bestehenderWegweiser.length !== wegweiserEn.length || bestehendeAblaufSchritte.length !== ablaufSchritteEn.length) {
    throw new Error(
      `Unerwartete Zeilenzahl bei 'home.wegweiser'/'home.ablaufSchritte'. ` +
        `Zuerst 'pnpm seed' (DE) erneut ausführen, dann erst 'pnpm seed:en'.`,
    )
  }

  await payload.updateGlobal({
    slug: 'home',
    locale: 'en',
    data: {
      heroLead:
        'Since 1979 we have been managing, letting and selling properties in Zurich — a small, independent, privately owned team.',
      wegweiser: bestehenderWegweiser.map((item, i) => ({ id: item.id, ...wegweiserEn[i] })),
      ablaufSchritte: bestehendeAblaufSchritte.map((item, i) => ({ id: item.id, ...ablaufSchritteEn[i] })),
    },
  })
  console.log('  … gespeichert.')

  console.log('EN-Inhalt abgeschlossen.')
  process.exit(0)
}

main().catch((err) => {
  console.error('EN-Seed fehlgeschlagen:', err)
  process.exit(1)
})
