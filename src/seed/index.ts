import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload, type Payload } from 'payload'

import config from '../payload.config'
import type { Property } from '../payload-types'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const referenceAssets = path.resolve(dirname, '../../reference/assets')

function readFile(fileName: string, mimetype: string) {
  const filePath = path.join(referenceAssets, fileName)
  const data = fs.readFileSync(filePath)
  return { data, mimetype, name: fileName, size: data.length }
}

async function upsertMediaFromAsset(
  payload: Payload,
  fileName: string,
  mimetype: string,
  alt: string,
) {
  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: fileName } },
    limit: 1,
  })
  if (existing.docs[0]) return existing.docs[0]
  return payload.create({
    collection: 'media',
    data: { alt },
    file: readFile(fileName, mimetype),
  })
}

async function upsertAdminUser(payload: Payload) {
  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD
  if (!email || !password) {
    console.warn('SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD nicht gesetzt — überspringe Admin-Seed.')
    return
  }
  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
  })
  if (existing.docs[0]) {
    console.log(`Admin-Benutzer ${email} existiert bereits.`)
    return
  }
  await payload.create({
    collection: 'users',
    data: { email, password, role: 'admin', name: 'Admin' },
  })
  console.log(`Admin-Benutzer ${email} angelegt.`)
}

async function upsertTeamMember(
  payload: Payload,
  name: string,
  photo: Awaited<ReturnType<typeof upsertMediaFromAsset>>,
  reihenfolge: number,
) {
  const existing = await payload.find({
    collection: 'team',
    where: { name: { equals: name } },
    limit: 1,
  })
  const data = {
    name,
    // Rolle bewusst leer: auf der Live-Site nirgends genannt (DECISIONS.md #9, CONTENT_TODO.md).
    foto: photo.id,
    reihenfolge,
  }
  if (existing.docs[0]) {
    return payload.update({ collection: 'team', id: existing.docs[0].id, data })
  }
  return payload.create({ collection: 'team', data })
}

type ServiceSeed = {
  serviceType: 'bewirtschaftung' | 'stockwerkeigentum' | 'erstvermietung' | 'verkauf'
  contentStatus: 'bestaetigt' | 'entwurf'
  claim: string
  einleitung: string
  punkte: string[]
  zeichnungsvariante: 'mfh' | 'schnitt' | 'neubau' | 'efh'
  // FAQ ist auf allen vier Seiten Entwurf (DESIGN.md §11 — geht über die Phase-0-Textbasis
  // hinaus) und wird auf der Seite selbst sichtbar als Entwurf markiert, unabhängig von
  // contentStatus. Keine tagesaktuellen Zahlen (z. B. Referenzzinssatz) — Briefing §6.
  faq: { frage: string; antwort: string }[]
}

// Wortlaut 1:1 aus reference/content/*.md übernommen (DESIGN.md §11) — nicht generisch erfunden.
const SERVICES: ServiceSeed[] = [
  {
    serviceType: 'bewirtschaftung',
    contentStatus: 'bestaetigt',
    claim: 'Wir betreuen Ihre Immobilie, als wäre es unsere eigene.',
    einleitung:
      'Bei der Bewirtschaftung der uns anvertrauten Geschäfts- und Wohnliegenschaften haben Zuverlässigkeit und Genauigkeit erste Priorität. Als Ihr Ansprechpartner für sämtliche Bewirtschaftungsaufgaben gehören die folgenden Aufgaben zu unseren Stärken:',
    punkte: [
      'Vermietung',
      'Abnahme und Übergabe von Mietobjekten',
      'Laufender Unterhalt',
      'Werterhaltung',
      'Mietzinskontrolle',
      'Zahlungsverkehr',
      'Kreditoren- und Debitorenbuchhaltung',
      'jährliche Bilanz und Erfolgsrechnung',
    ],
    zeichnungsvariante: 'mfh',
    faq: [
      {
        frage: 'Wie läuft die Übernahme meiner Liegenschaft ab?',
        antwort:
          'Nach einem persönlichen Kennenlerngespräch erstellen wir eine transparente Offerte. Nach Ihrer Zusage übernehmen wir die Unterlagen und sind ab sofort Ihr direkter Ansprechpartner.',
      },
      {
        frage: 'Wie oft erhalte ich eine Abrechnung?',
        antwort:
          'Sie erhalten jährlich eine Bilanz und Erfolgsrechnung. Ein unterjähriges Reporting richten wir auf Wunsch ein.',
      },
      {
        frage: 'Wer kümmert sich um Reparaturen und Notfälle?',
        antwort:
          'Wir koordinieren Hauswartung und Handwerkeraufträge. Für Schäden an gemieteten Wohnungen steht der Mieterschaft unser Mieterservice zur Verfügung.',
      },
      {
        frage: 'Was passiert bei einem Mieterwechsel?',
        antwort:
          'Vermietung sowie Abnahme und Übergabe von Mietobjekten gehören zu unserem Leistungsumfang — von der Ausschreibung bis zur Schlüsselübergabe.',
      },
      {
        frage: 'Bleibe ich über meine Liegenschaft informiert, auch wenn Sie sie verwalten?',
        antwort:
          'Ja. Wir legen Wert auf persönliche Betreuung und einen direkten Ansprechpartner — Sie erreichen uns jederzeit.',
      },
    ],
  },
  {
    serviceType: 'erstvermietung',
    contentStatus: 'bestaetigt',
    claim: 'Mit Rat und Tat, auch wenn’s mal nicht alltäglich ist.',
    einleitung:
      'Im Zusammenhang mit den professionellen Vermietungstätigkeiten im Bereich von Wohn- und Geschäftsliegenschaften stehen wir Ihnen mit unserer langjährigen Erfahrung kompetent mit Rat und Tat zur Seite. Dazu gehören vor allem:',
    punkte: [
      'Ermittlung des Mietzinses unter Berücksichtigung der Marktsituation und Vermietbarkeit',
      'Schaltung und Koordination von Inseraten in Printmedien und Internet',
      'Besichtigungstermine mit Mietinteressenten sowie die Bonitätsprüfung der Interessenten',
      'Ausarbeitung von Mietverträgen',
      'Objektübergaben',
    ],
    zeichnungsvariante: 'neubau',
    faq: [
      {
        frage: 'Wie wird der Mietzins für mein Objekt festgelegt?',
        antwort:
          'Wir ermitteln ihn anhand der aktuellen Marktsituation und der Vermietbarkeit Ihres Objekts — nicht anhand pauschaler Werte ohne Objektkenntnis.',
      },
      {
        frage: 'Wie läuft die Mieterauswahl ab?',
        antwort:
          'Nach Besichtigungen mit Mietinteressenten führen wir eine Bonitätsprüfung durch und wählen nach nachvollziehbaren Kriterien aus.',
      },
      {
        frage: 'Wo wird mein Objekt inseriert?',
        antwort: 'Wir schalten und koordinieren Inserate in Printmedien und im Internet.',
      },
      {
        frage: 'Wie lange dauert es bis zur Vermietung?',
        antwort:
          'Das hängt von Objekt und Marktlage ab — eine pauschale Zusage können wir ohne Objektkenntnis nicht machen.',
      },
      {
        frage: 'Was beinhaltet die Objektübergabe?',
        antwort: 'Ein Übergabeprotokoll mit Zählerständen sowie die Schlüsselübergabe an die neue Mieterschaft.',
      },
    ],
  },
  {
    serviceType: 'verkauf',
    contentStatus: 'bestaetigt',
    claim: 'Eigenheim oder Renditeliegenschaft.',
    einleitung:
      'Im Zusammenhang mit dem professionellen Verkauf bzw. Erwerb von Renditeliegenschaften, Einfamilienhäusern, Stockwerkeinheiten sowie Gewerbe- und/oder Industrieobjekten stehen wir Ihnen mit unserer langjährigen Erfahrung kompetent mit Rat und Tat zur Seite. Dazu gehören vor allem:',
    punkte: [
      'Beratung über den Verkaufspreis',
      'Erstellung von Verkaufsdokumentationen',
      'Schaltung und Koordination von Inseraten in Printmedien und Internet',
      'Vermittlung von Kauf-/Verkaufsinteressenten',
      'Beratung und Ausarbeitung von Kaufverträgen',
      'Erledigung sämtlicher Formalitäten (u. a. auch mit Behörden und Ämtern)',
    ],
    zeichnungsvariante: 'efh',
    faq: [
      {
        frage: 'Wie wird der Verkaufspreis ermittelt?',
        antwort:
          'Wir beraten Sie auf Basis von Lage, Zustand und Marktlage Ihrer Liegenschaft — eine pauschale Online-Schätzung ersetzt das nicht.',
      },
      {
        frage: 'Bleibt der Verkauf diskret?',
        antwort:
          'Ja. Wir stimmen die Vermarktung mit Ihnen ab, auch ein diskreter Verkauf ohne öffentliche Referenzen ist möglich.',
      },
      {
        frage: 'Welche Unterlagen braucht es für den Verkauf?',
        antwort:
          'Die Verkaufsdokumentation erstellen wir für Sie. Grundbuchauszug, Pläne und weitere Unterlagen beschaffen wir nach Bedarf.',
      },
      {
        frage: 'Wie läuft die Beurkundung ab?',
        antwort: 'Wir begleiten Sie bis zur notariellen Beurkundung und zur Übergabe der Liegenschaft.',
      },
      {
        frage: 'Kann ich auch eine Renditeliegenschaft verkaufen lassen?',
        antwort:
          'Ja — wir begleiten den Verkauf von Renditeliegenschaften, Einfamilienhäusern, Stockwerkeinheiten sowie Gewerbe- und Industrieobjekten.',
      },
    ],
  },
  {
    // Alte Seite liefert hier nur Fliesstext, keine Liste — die Liste unten ist ein Entwurf
    // nach dem Muster der anderen drei Leistungen (DESIGN.md §11), kein wörtliches Zitat.
    serviceType: 'stockwerkeigentum',
    contentStatus: 'entwurf',
    claim: 'Wir verwalten nicht nur, sondern wir kümmern uns.',
    einleitung:
      'Die Verwaltung von Stockwerkeigentum schliesst nebst der Organisation und Durchführung der ordentlichen Stockwerkeigentümerversammlungen auf Wunsch auch die Koordination und Leitung von Delegiertensitzungen mit ein. Ferner sind wir bei Bedarf auch gerne bereit, Sie bei der Interessenwahrung gegenüber General- und Bauunternehmungen sowie Handwerkern aktiv zu unterstützen. Wir kümmern uns um Versicherungsfälle und Schadenregulierungen, den Unterhalt der Liegenschaft und selbstverständlich um die Buchführung.',
    punkte: [
      'Organisation und Leitung der Eigentümerversammlung, Protokollführung',
      'Budget und Jahresrechnung',
      'Äufnung und Verwaltung des Erneuerungsfonds',
      'Reglement und Hausordnung',
      'Unterhalt der gemeinschaftlichen Teile',
      'Versicherungen und Schadenregulierung',
    ],
    zeichnungsvariante: 'schnitt',
    faq: [
      {
        frage: 'Wie oft findet die Eigentümerversammlung statt?',
        antwort:
          'Mindestens einmal jährlich als ordentliche Versammlung. Bei Bedarf organisieren wir zusätzlich ausserordentliche Versammlungen.',
      },
      {
        frage: 'Wer erstellt Budget und Jahresrechnung?',
        antwort: 'Wir erstellen beides und legen sie der Eigentümerversammlung zur Genehmigung vor.',
      },
      {
        frage: 'Was ist der Erneuerungsfonds und wie wird er verwaltet?',
        antwort:
          'Der Erneuerungsfonds sichert künftige Sanierungen der Liegenschaft. Wir äufnen und verwalten ihn für die Gemeinschaft.',
      },
      {
        frage: 'Was passiert bei einem Schaden am Gemeinschaftseigentum?',
        antwort: 'Versicherungsfälle und Schadenregulierung für die gemeinschaftlichen Teile übernehmen wir.',
      },
      {
        frage: 'Kann ich als Stockwerkeigentümer:in Anträge für die Versammlung stellen?',
        antwort:
          'Ja, eine Traktandierung ist möglich. Die Fristen dafür richten sich nach dem Reglement Ihrer Gemeinschaft.',
      },
    ],
  },
]

function richTextFromParagraphs(paragraphs: string[]) {
  return {
    root: {
      type: 'root',
      format: '' as const,
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        format: '' as const,
        indent: 0,
        version: 1,
        direction: 'ltr' as const,
        children: [{ type: 'text', format: 0, text, version: 1 }],
      })),
    },
  }
}

async function upsertService(payload: Payload, svc: ServiceSeed) {
  const existing = await payload.find({
    collection: 'services',
    where: { serviceType: { equals: svc.serviceType } },
    limit: 1,
  })
  const data = {
    serviceType: svc.serviceType,
    contentStatus: svc.contentStatus,
    claim: svc.claim,
    einleitung: richTextFromParagraphs([svc.einleitung]),
    leistungsgruppen: [
      {
        titel: 'Was wir übernehmen',
        punkte: svc.punkte.map((text) => ({ text })),
      },
    ],
    zeichnungsvariante: svc.zeichnungsvariante,
    faq: svc.faq.map((f) => ({ frage: f.frage, antwort: richTextFromParagraphs([f.antwort]) })),
    _status: 'published' as const,
  }
  if (existing.docs[0]) {
    return payload.update({ collection: 'services', id: existing.docs[0].id, data })
  }
  return payload.create({ collection: 'services', data })
}

type PropertySeed = {
  title: string
  objektstatus: 'verfuegbar' | 'reserviert'
  angebotsart: 'miete' | 'kauf'
  objektart: NonNullable<Property['objektart']>
  kreis: NonNullable<Property['kreis']>
  zimmer: number
  wohnflaecheM2: number
  nettomiete?: number
  kaufpreis?: number
}

const EXAMPLE_PROPERTIES: PropertySeed[] = [
  {
    title: '3.5-Zimmer-Wohnung, Zürich Kreis 4',
    objektstatus: 'verfuegbar',
    angebotsart: 'miete',
    objektart: 'wohnung',
    kreis: '4',
    zimmer: 3.5,
    wohnflaecheM2: 78,
    nettomiete: 2180,
  },
  {
    title: 'Attikawohnung mit Terrasse, Zürich Kreis 8',
    objektstatus: 'verfuegbar',
    angebotsart: 'kauf',
    objektart: 'attika',
    kreis: '8',
    zimmer: 4.5,
    wohnflaecheM2: 142,
    kaufpreis: 2450000,
  },
  {
    title: 'Studio, Zürich Kreis 3',
    objektstatus: 'reserviert',
    angebotsart: 'miete',
    objektart: 'studio',
    kreis: '3',
    zimmer: 1.5,
    wohnflaecheM2: 38,
    nettomiete: 1350,
  },
]

async function upsertExampleProperty(payload: Payload, p: PropertySeed) {
  const existing = await payload.find({
    collection: 'properties',
    where: { title: { equals: p.title } },
    limit: 1,
  })
  const data = {
    title: p.title,
    objektstatus: p.objektstatus,
    angebotsart: p.angebotsart,
    objektart: p.objektart,
    adresse: { ort: 'Zürich' },
    adressePublicAnzeigen: false,
    kreis: p.kreis,
    zimmer: p.zimmer,
    wohnflaecheM2: p.wohnflaecheM2,
    nettomiete: p.nettomiete,
    nebenkosten: p.nettomiete ? { betrag: Math.round(p.nettomiete * 0.12), typ: 'akonto' as const } : undefined,
    kaufpreis: p.kaufpreis,
    isExample: true,
    _status: 'published' as const,
  }
  if (existing.docs[0]) {
    return payload.update({ collection: 'properties', id: existing.docs[0].id, data })
  }
  return payload.create({ collection: 'properties', data })
}

async function seedSiteSettings(payload: Payload) {
  await payload.updateGlobal({
    slug: 'siteSettings',
    data: {
      firma: {
        name: 'Nora Immobilien AG',
        adresse: { strasse: 'Langstrasse 14', plz: '8004', ort: 'Zürich' },
        telefon: '+41 44 495 70 70',
        email: 'info@nora-immobilien.ch',
        // uid / handelsregisterNr / mwstNr bewusst leer — CONTENT_TODO.md (Zefix-Prüfung ausstehend).
      },
      demoBannerText: 'Konzept-Vorschau von Axion – nicht die offizielle Website der Nora Immobilien AG.',
    },
  })
}

async function seedHome(payload: Payload) {
  await payload.updateGlobal({
    slug: 'home',
    data: {
      heroLead:
        'Seit 1979 bewirtschaften, vermieten und verkaufen wir Liegenschaften in Zürich – als kleines, unabhängiges Team in Privatbesitz.',
      wegweiser: [
        { label: 'Ich besitze eine Liegenschaft', linkZiel: '/bewirtschaftung' },
        { label: 'Ich wohne in einer Liegenschaft von Nora', linkZiel: '/mieterservice' },
        { label: 'Ich suche eine Wohnung', linkZiel: '/objekte' },
      ],
      // Entwurf nach Briefing §6.1.5 — auf der Seite selbst sichtbar als unbestätigt markiert
      // (DESIGN.md §11, CONTENT_TODO.md).
      ablaufSchritte: [
        {
          schritt: 'Kennenlernen',
          beschreibung: 'Ein persönliches Gespräch, in dem wir Ihre Liegenschaft und Ihre Anliegen kennenlernen.',
        },
        {
          schritt: 'Offerte',
          beschreibung: 'Sie erhalten eine transparente Offerte für die gewünschten Leistungen.',
        },
        {
          schritt: 'Übergabe',
          beschreibung: 'Wir übernehmen die Unterlagen und organisieren einen reibungslosen Wechsel.',
        },
        {
          schritt: 'Laufende Betreuung',
          beschreibung: 'Ab sofort sind wir Ihr direkter Ansprechpartner für Ihre Liegenschaft.',
        },
      ],
      _status: 'published',
    },
  })
}

async function seedAbout(payload: Payload) {
  await payload.updateGlobal({
    slug: 'about',
    data: {
      // Wortlaut nah an reference/content/home.md (Haltungsabschnitt der alten Seite),
      // Rechtschreibung/Grossschreibung korrigiert — keine neu erfundenen Aussagen.
      haltungText: richTextFromParagraphs([
        'Als kleines und engagiertes Team gehen wir sehr persönlich auf Ihre Bedürfnisse ein.',
        '100 % in privatem Besitz zählt für uns nur die Partnerschaft mit unserer Kundschaft. Um Ihre Privatsphäre zu schützen, verzichten wir auf Referenzobjekte auf dieser Website und freuen uns stattdessen auf ein persönliches Gespräch mit Ihnen.',
        'Nora Immobilien AG wurde 1979 gegründet und ist Mitglied des Schweizerischen Verbands der Immobilien-Treuhänder (SVIT) sowie der FIABCI, der International Real Estate Federation.',
      ]),
    },
  })
}

async function seedTenantService(payload: Payload) {
  await payload.updateGlobal({
    slug: 'tenantService',
    data: {
      notfallStatusHinweis: 'Entwurf – vor Go-live fachlich/rechtlich prüfen lassen.',
      notfallText: richTextFromParagraphs([
        'Polizei: 117 — Feuerwehr: 118 — Sanität: 144 — Europäischer Notruf: 112',
        'Pikett- bzw. Notfallnummer ausserhalb der Bürozeiten: [[TODO: vom Kunden erhalten]]',
        'Bei Gasgeruch: kein offenes Feuer, keine elektrischen Schalter betätigen, Fenster öffnen, Gebäude verlassen und von draussen 118 oder den Gas-Notruf des zuständigen Versorgers [[TODO: Nummer vom Kunden erhalten]] anrufen.',
      ]),
      faq: [
        {
          frage: 'Wie melde ich einen Schaden?',
          antwort: richTextFromParagraphs(['Über das Formular «Schaden melden» auf dieser Seite.']),
        },
        {
          frage: 'Was mache ich bei einem Notfall ausserhalb der Bürozeiten?',
          antwort: richTextFromParagraphs(['Beachten Sie die Notfall-Hinweise oben auf dieser Seite.']),
        },
        {
          frage: 'Wo finde ich Formulare wie Kündigung oder Untermietgesuch?',
          antwort: richTextFromParagraphs([
            'Im Abschnitt «Formulare zum Download» weiter unten, sobald diese hinterlegt sind.',
          ]),
        },
        {
          frage: 'Wie lange im Voraus muss ich kündigen?',
          antwort: richTextFromParagraphs([
            'Die Kündigungsfrist richtet sich nach Ihrem Mietvertrag. Bei Fragen wenden Sie sich direkt an uns.',
          ]),
        },
        {
          frage: 'Darf ich Haustiere halten oder untervermieten?',
          antwort: richTextFromParagraphs([
            'Das richtet sich nach Mietvertrag und Hausordnung. Im Zweifel fragen Sie bitte vorher bei uns nach.',
          ]),
        },
      ],
    },
  })
}

async function seedLegal(payload: Payload) {
  await payload.updateGlobal({
    slug: 'legal',
    data: {
      statusHinweis: 'Entwurf – vor Go-live prüfen lassen',
      impressum: richTextFromParagraphs([
        'Entwurf – vor Go-live juristisch prüfen lassen.',
        'Verantwortlich für den Inhalt dieser Website:',
        'Nora Immobilien AG, Langstrasse 14, 8004 Zürich, Schweiz',
        'Telefon: +41 44 495 70 70, E-Mail: info@nora-immobilien.ch',
        '[[TODO: UID nach Zefix-Prüfung einfügen]]',
        '[[TODO: Handelsregistereintrag und vertretungsberechtigte Personen einfügen]]',
        '[[TODO: MWST-Nummer einfügen]]',
      ]),
      datenschutz: richTextFromParagraphs([
        'Entwurf – vor Go-live juristisch prüfen lassen.',
        'Diese Datenschutzerklärung informiert gemäss revDSG (Bundesgesetz über den Datenschutz, in Kraft seit 1. September 2023) darüber, wie die Nora Immobilien AG personenbezogene Daten bearbeitet, die über diese Website erhoben werden.',
        'Bearbeitete Daten: Angaben aus Kontakt- und Anfrageformularen, Schadenmeldungen, Suchabos sowie technische Server-Logs. Es werden keine Cookies zu Marketing- oder Tracking-Zwecken gesetzt; das eingesetzte Web-Analytics ist cookielos, weshalb kein Cookie-Banner erforderlich ist.',
        'Zwecke: Bearbeitung von Anfragen, Mieterservice, Suchabo-Benachrichtigungen, Betrieb und Sicherheit der Website.',
        'Aufbewahrung: Anfragen und Anhänge werden grundsätzlich nach 12 Monaten gelöscht [[TODO: mit Kunde bestätigen]], unbestätigte Suchabos nach 7 Tagen.',
        'Auftragsbearbeiter: Vercel (Hosting), Neon (Datenbank), Resend (E-Mail-Versand), Cloudflare (Spam-Schutz), Upstash (Rate-Limiting), swisstopo (Geokodierung/Kartendarstellung).',
        'Bekanntgabe ins Ausland: Einzelne Auftragsbearbeiter verarbeiten Daten in den USA. Es gelten die Standardvertragsklauseln bzw. das Swiss-U.S. Data Privacy Framework [[TODO: Zertifizierungen der jeweiligen Anbieter vor Go-live prüfen]].',
        'Rechte der betroffenen Personen: Auskunft, Berichtigung, Löschung und Einschränkung der Bearbeitung gemäss revDSG. Anfragen richten Sie an info@nora-immobilien.ch.',
      ]),
    },
  })
}

async function main() {
  const payload = await getPayload({ config })

  console.log('Seed: Admin-Benutzer …')
  await upsertAdminUser(payload)

  console.log('Seed: Team-Fotos …')
  const karinPhoto = await upsertMediaFromAsset(
    payload,
    'team-karin-gentinetta.jpg',
    'image/jpeg',
    'Karin Gentinetta',
  )
  const alexanderPhoto = await upsertMediaFromAsset(
    payload,
    'team-alexander-sauter.jpg',
    'image/jpeg',
    'Alexander Sauter',
  )

  console.log('Seed: Team …')
  await upsertTeamMember(payload, 'Karin Gentinetta', karinPhoto, 1)
  await upsertTeamMember(payload, 'Alexander Sauter', alexanderPhoto, 2)

  console.log('Seed: Leistungen …')
  for (const svc of SERVICES) {
    await upsertService(payload, svc)
  }

  console.log('Seed: Beispielobjekte …')
  for (const p of EXAMPLE_PROPERTIES) {
    await upsertExampleProperty(payload, p)
  }

  console.log('Seed: siteSettings, home, about, tenantService, legal …')
  await seedSiteSettings(payload)
  await seedHome(payload)
  await seedAbout(payload)
  await seedTenantService(payload)
  await seedLegal(payload)

  console.log('Seed abgeschlossen.')
  process.exit(0)
}

main().catch((err) => {
  console.error('Seed fehlgeschlagen:', err)
  process.exit(1)
})
