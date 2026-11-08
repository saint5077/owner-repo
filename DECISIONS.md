# DECISIONS.md — Nora Immobilien AG

Entscheidungs-Log. Vernünftig entschieden statt nachgefragt (Briefing Abschnitt 0.5); nur echte
Blocker werden als Frage gestellt. Wird während des gesamten Projekts fortgeführt.

## Phase 0 — Bestandsaufnahme

1. **`/objekte`-Einbettung:** Kein Drittanbieter-Embed gefunden (kein homegate, ImmoScout24, newhome,
   Flatfox, Casasoft). Die alte Seite hat dort nur Navigation/Footer, keinerlei Objektinhalt.
   → Bestätigt den Plan aus Abschnitt 8 des Briefings: eigene `properties`-Collection in Payload,
   kein Portal-Import nötig. Kein offener Punkt.
2. **Leerzustand Objekte ist kein hypothetischer Fall, sondern der heutige Zustand.** Die Objektliste
   muss von Tag 1 an mit einem überzeugenden Leerzustand (Grundriss-Zeichnung + Suchabo-Hinweis)
   funktionieren, nicht nur als Rand-Fall behandelt werden. Für den Demo-Modus werden drei klar
   markierte Beispielobjekte geseedet (wie im Briefing §8 vorgesehen), damit die Vorschau nicht leer
   wirkt — sie zeigen aber, dass das Leerzustand-Design genauso sorgfältig sein muss wie die Liste.
3. **Sieben alte Stock-Hintergrundfotos (nicht nur das eine im Briefing erwartete) werden nicht
   übernommen**, siehe `DESIGN.md` §7. Nur die beiden Teamfotos werden weiterverwendet.
4. **Logo-Rot wird nicht zur sitewide Aktionsfarbe** (ersetzt Fensterladen-Grün nicht), siehe
   `DESIGN.md` §3. Begründung dort.
5. **Favicon wird neu erzeugt**, nicht aus der alten Datei übernommen (alte Datei ist ein 15×30-px-
   Ausschnitt ohne eigenständige Bildinformation).
6. **`/rechtliche-hinweise` wird inhaltlich nicht wiederverwendet.** Die alte Seite ist generisches
   Wix-Boilerplate mit EU-DSGVO-Bezug (Google Analytics, Facebook Pixel, Bing Ads) — widerspricht dem
   neuen cookie-freien, revDSG-konformen Konzept direkt. Einzig übernommen: Firmenname und Adresse als
   Textbasis für die neue, von Grund auf geschriebene Datenschutzerklärung. UID, Handelsregisternummer
   und MWST-Nummer stehen dort nicht — bleiben `[[TODO]]` bis Zefix-Prüfung.
7. **Inhaltliche Basis der vier Leistungsseiten:** wörtliche Übernahme der bestehenden Kundentexte wo
   vorhanden (Bewirtschaftung, Erstvermietung, Verkauf haben strukturierte Listen; Stockwerkeigentum
   nur Fliesstext) statt generischer Branchentexte. Details in `DESIGN.md` §11.
8. **SVIT-Bezeichnung:** auf der Live-Site durchgängig "Schweizerischer Verband der Immobilien-
   Treuhänder" (alte Verbandsbezeichnung) — dieser verifizierte Wortlaut wird vorerst übernommen
   (keine Erfindung), die Frage, ob auf die aktuelle Verbandsbezeichnung umgestellt werden soll, geht
   als offene Frage nach `CONTENT_TODO.md`.
9. **Karin Gentinettas und Alexander Sauters Rollen/Titel** stehen auf der Live-Site nirgends (nur
   "... mit ihrem Team"). Die im Briefing genannte Zuordnung Karin Gentinettas zur Geschäftsführung
   stammt ausschliesslich von graph.swiss (Drittquelle, nicht die Website selbst) und wird **nicht**
   ungeprüft als Fakt übernommen. Beide Rollen bleiben `[[TODO]]`, auf der neuen Seite vorerst ohne
   Rollenbezeichnung dargestellt (nur Name + Foto + Kontakt), bis der Kunde sie bestätigt.
10. **"Bautreuhand"** erscheint nur in alten Meta-Keywords, nirgends im sichtbaren Text. Wird auf der
    neuen Seite **nicht** als eigener Leistungsbereich geführt, bis der Kunde bestätigt, dass es sich
    um eine real angebotene Leistung handelt (nicht nur ein altes SEO-Schlagwort).
11. **Jahre-seit-1979-Berechnung:** rein clientseitige Berechnung wäre fehleranfällig bei rein
    statischem Rendering über einen Jahreswechsel hinweg. Technische Entscheidung: serverseitig mit
    `new Date().getFullYear() - 1979` berechnet, betroffene Routen (Startseite, Über uns) zusätzlich zur
    ereignisgesteuerten Revalidierung (CMS-Änderung) mit `revalidate = 86400` (täglich) versehen, damit
    sich die Zahl auch ohne CMS-Eingriff am 1. Januar automatisch korrigiert.

## Spätere Phasen (wird fortgeführt)

- Aufbewahrungsfrist Anfragen/Anhänge: Standardwert 12 Monate übernommen (Briefing-Vorschlag), als
  `[[TODO: mit Kunde klären]]` in `CONTENT_TODO.md` vermerkt, aber bereits als funktionierender
  Default implementiert, damit der Cron-Job ab Tag 1 lauffähig ist.
- Credit-Zeile "Website: Axion" im Footer: vorerst eingebaut (dezent, wie im Briefing vorgeschlagen),
  endgültige Formulierung/Verlinkung mit dem Kunden abstimmen vor Go-live.
- Mietbewerbung mit sensiblen Dokumenten (Betreibungsauszug, Ausweis): **nicht** über die Website-
  Formulare hochladbar — nur Terminwunsch/Kontakt. Der eigentliche Bewerbungsprozess bleibt der
  bestehende Prozess des Kunden, bis dieser klärt, ob/wie er digitalisiert werden soll.

## Phase 2 — Projekt-Setup & Payload-Backend

12. **Lokale Entwicklung statt Neon/Vercel Blob.** Dieses Sandbox-Netzwerk erlaubt nur ausgehendes
    HTTPS zu einer expliziten Allowlist (keine beliebige Postgres-TCP-Verbindung), und für Neon sowie
    Vercel Blob liegen noch keine echten Kundenzugangsdaten vor. Entwicklung, Build und Tests laufen
    deshalb gegen einen lokalen PostgreSQL-16-Server im Container (Rolle `nora`, DB `nora_dev`,
    Zugangsdaten in `.env.local`, gitignored) und gegen Payloads lokalen Datei-Upload-Adapter
    (`/media`, ebenfalls gitignored) statt gegen Vercel Blob. Produktion nutzt wie im Briefing
    spezifiziert Neon (Frankfurt) und Vercel Blob (EU) — das Umschalten ist rein env-gesteuert, kein
    Code-Unterschied. `.env.example` dokumentiert beide Fälle.
13. **Pakete werden phasenweise installiert**, nicht alle auf einmal in Phase 2. Nur was Phase 2
    tatsächlich braucht (Next.js/Payload-Kern, Postgres-Adapter, Lexical, Tailwind v4) ist installiert;
    react-hook-form, zod, resend, react-email, Turnstile, Upstash, MapLibre, Embla, motion und
    next-intl kommen in den Phasen, die sie verwenden (3/5/6/7).
14. **`koordinaten` auf `properties` ist ein lat/lng-Zahlenpaar, kein Payload-`point`-Feld.** Der
    `point`-Feldtyp erzeugt mit dem Postgres-Adapter eine PostGIS-`geometry`-Spalte; die lokale
    Entwicklungsdatenbank hat die PostGIS-Erweiterung nicht installiert (und `apt-get install
    postgresql-16-postgis-3` ist in diesem Sandbox-Paketspiegel nicht verfügbar). Ein einfaches
    lat/lng-Zahlenpaar braucht keine Postgres-Erweiterung, funktioniert identisch auf Neon und reicht
    für die swisstopo-Geokodierung (Phase 5) und eine spätere Kartendarstellung völlig aus.
15. **Das Status-Feld auf `properties` heisst `objektstatus`, nicht `status`.** Payload erzeugt für
    das interne Draft/Publish-Feld (`_status`, durch `versions.drafts` aktiviert) einen Postgres-Enum
    mit demselben generierten Namen wie ein eigenes Feld namens `status` auf derselben Collection
    (`enum_properties_status`) — das kollidierte beim Schema-Push. Umbenennung behebt es sauber, ohne
    Versionierung/Live-Preview zu verlieren.
16. **Admin-Logo nutzt vorerst die alte 73×138-px-Rasterdatei** (`reference/assets/logo.png`) über
    eigene `graphics.Logo`/`graphics.Icon`-Admin-Components — ausreichend für die kleine Darstellung in
    der Admin-Sidebar. Wird in Phase 3 durch die SVG-Logo-Nachzeichnung ersetzt (siehe `DESIGN.md` §2),
    sobald diese existiert.
17. **GraphQL ist vollständig deaktiviert** (`graphQL: { disable: true }`), die generierten
    `/api/graphql`- und `/api/graphql-playground`-Routen wurden aus dem Scaffold entfernt (ungenutzt,
    Briefing §8 verlangt die Deaktivierung explizit).
18. **ESLint-Konfiguration ohne `@eslint/eslintrc`/`FlatCompat`.** Die vom Scaffold mitgelieferte
    `compat.extends('next/core-web-vitals', 'next/typescript')`-Variante erzeugte mit der aktuell
    aufgelösten Kombination aus ESLint 9.39.x und den neueren `eslint-plugin-react`-Flat-Configs einen
    Absturz beim Fehler-Reporting (zirkuläre Referenz beim `JSON.stringify` der Plugin-Konfiguration).
    `eslint-config-next` 16.3.3 liefert über `@next/eslint-plugin-next` bereits eine native
    Flat-Config (`configs['core-web-vitals']`); `eslint.config.mjs` nutzt diese jetzt direkt zusammen
    mit `typescript-eslint` — funktional gleichwertig, ohne den Kompatibilitäts-Layer.
19. **Vor echter Next.js-Frontend-Arbeit (Phase 3+): `node_modules/next/dist/docs/01-app/` lesen.**
    Dieses Next.js 16.3.3 schreibt bei jedem `next dev` eine `AGENTS.md`/`CLAUDE.md`-Warnung, dass sich
    App-Router-Konventionen gegenüber älterem Trainingswissen geändert haben könnten. Phase 2 betraf
    nur das vom offiziellen `create-payload-app`-Scaffold selbst gesetzte Minimal-Layout (unverändert
    kompatibel); Phase 3 baut echte Seiten/Layouts und sollte die aktuelle Dokumentation zuerst prüfen,
    statt sich auf älteres Wissen zu verlassen.
20. **Verify-Skript für Zugriffskontrolle (`scripts/verify-access-control.ts`)** startet für den Test
    einen eigenen Next-Dev-Server auf einem Nebenport (3211) statt den laufenden Entwicklungsserver zu
    nutzen, damit der Checkpoint-Beweis unabhängig und wiederholbar per `pnpm verify:access-control`
    läuft. Eine vollständige Vitest-Suite dafür folgt in Phase 8.
