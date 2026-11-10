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

## Phase 3 — Designsystem, Zeichnungsmodul, Layout

21. **Hero-Fassade: Selbstzeichnen-Animation als Clip-Path-Wipe statt stroke-dasharray/
    pathLength.** Erster Ansatz exakt nach Briefing-Wortlaut (`stroke-dashoffset`, `pathLength="1"`
    auf jedem Fenster/Gesims/Dach-Element, eine gemeinsame Animation auf einem Vorfahren). Zwei
    Probleme traten auf: (1) `pathLength` wird von Chromium nicht zuverlässig für die CSS-
    Normalisierung von `stroke-dasharray`/`-dashoffset` herangezogen; (2) in Kombination mit
    `vector-effect: non-scaling-stroke` (nötig, damit die Linien bei jeder Darstellungsgrösse exakt
    1,25 px bleiben) wird das Dash-Muster im Bildschirm- statt im lokalen Koordinatenraum berechnet
    — bei einer kleinteiligen Geometrie (Fenster ~1,2×2,0 "Meter"-Einheiten, stark hochskaliert auf
    Bildschirmgrösse) entstand dadurch sichtbare Strichelung statt einer durchgezogenen Linie, auch
    nach Abschluss der Animation. Eine zweite Variante mit selbst berechneten, exakten Pfadlängen
    (Rechteck-Umfang, Liniendistanz etc. über eine `--path-len`-CSS-Variable) behob das `pathLength`-
    Problem, nicht aber das Skalierungsproblem von `non-scaling-stroke`. Gelöst durch einen
    Clip-Path-Wipe auf dem gesamten `<svg>` (`clip-path: inset(0 100% 0 0)` → `inset(0 0% 0 0)` über
    1,6 s, `cubic-bezier(0.22, 1, 0.36, 1)`, `forwards`) — erzeugt denselben "zeichnet sich selbst"-
    Eindruck, ist unabhängig von Darstellungsgrösse und Browser-Eigenheiten, und bleibt mit
    `non-scaling-stroke` für konstante Linienstärke kompatibel. `prefers-reduced-motion` weiterhin
    über die globale Regel abgedeckt (Animationsdauer faktisch 0).
22. **Header-Breakpoint für die volle Desktop-Navigation auf `lg` (1024 px) angehoben**, nicht `md`
    (768 px) wie im ersten Entwurf. Bei 768 px brachen die Navigationslabels ("Leistungen",
    "Mieterservice", "Kontakt") durch `hyphens: auto` mitten im Wort um, weil nicht genug
    Platz für Logo + sieben Navigationspunkte + Telefonnummer war — beim Screenshot-Selbstkritik-
    Durchgang bei 768 px aufgefallen. Mobile Aktionsleiste unten entsprechend auch bis `lg` sichtbar,
    damit Tablet-Breiten durchgängig das mobile Navigationsmuster (Hamburger-Menü + Aktionsleiste)
    erhalten statt eines zu engen Zwischenzustands.
23. **Startseite rendert nach `pnpm build` statisch (○), nicht dynamisch**, obwohl sie `siteSettings`
    und `home` live über die Payload Local API lädt — Next erkennt keine Laufzeit-Abhängigkeit
    (kein `searchParams`/`cookies`/`headers`-Zugriff) und backt den Payload-Abruf zur Build-Zeit ein.
    Für Phase 3 unkritisch (noch keine echten Redaktions-Workflows), aber vor Phase 4/6 braucht die
    Startseite eine bewusste Revalidierungs-Strategie (`revalidate`-Intervall oder
    `revalidateTag`/`revalidatePath` aus den Payload-Hooks beim Speichern), sonst zeigt die gebaute
    Seite veraltete Inhalte. Vorgemerkt für Phase 4.
24. **Admin-Logo auf die SVG-Nachzeichnung umgestellt** (`src/components/admin/AdminLogo.tsx` nutzt
    jetzt `Logo.tsx` statt der alten Rasterdatei) — wie in DECISIONS.md #16 für Phase 3 vorgesehen.
    `Logo.tsx` setzt dafür Fallback-Hexwerte in den `var(--color-logo-rot, #e92624)`-Aufrufen, da das
    Admin-Stylesheet die Frontend-Farb-Tokens nicht kennt.
25. **Favicon-Set aus der SVG-Logo-Nachzeichnung erzeugt** (`favicon.ico` 16/32/48, `icon.svg`,
    `apple-icon.png` 180×180 mit Kalk-Hintergrund, PWA-Icons 192/512 plus `manifest.json`) — über ein
    einmaliges Build-Skript (Sharp für SVG→PNG, Pillow für die Mehrgrössen-ICO-Verpackung), nicht als
    laufender `pnpm`-Task, da es sich nicht ändert, solange das Logo gleich bleibt.

## Phase 4 — Kerninhalt-Seiten

26. **Revalidierung: Payload-`afterChange`-Hooks rufen `revalidatePath`/`revalidatePath(..., 'layout')`
    direkt auf**, zusätzlich zum täglichen `revalidate = 86400`-Sicherheitsnetz aus DECISIONS.md #11.
    Da Payload im selben Next.js-Prozess läuft und über `/api/[...slug]/route.ts` (einen echten Route
    Handler) bedient wird, ist `revalidatePath` dort laut Next-Doku gültig. `siteSettings` invalidiert
    die ganze Layout-Ebene (`revalidatePath('/', 'layout')`), da Header/Footer auf jeder Seite davon
    abhängen; `services`/`team`/`properties` invalidieren gezielt die betroffenen Routen. Ausserhalb
    eines Request-Kontexts (z. B. `pnpm seed`) schlägt `revalidatePath` fehl — abgefangen, kein
    Seed-Abbruch.
27. **`services` erhält ein neues Feld `ansprechperson`** (Relation zu `team`), das im ursprünglichen
    Phase-2-Schema fehlte, obwohl der Abschluss-Abschnitt jeder Leistungsseite laut Briefing §6 eine
    Ansprechperson zeigen soll. Bewusst ungeseedet gelassen (keine bestätigte Zuordnung Person↔Leistung)
    — die Redaktion trägt das später im Admin ein, die Seite blendet den Abschnitt bis dahin einfach aus.
28. **Kein per-Leistung „Ablauf"** gebaut, obwohl das Feld existiert. Die einzige echte, vom Briefing
    selbst benannte Abfolge ist „So übernehmen wir Ihre Liegenschaft" auf der Startseite (§6.1.5) — die
    wurde als Entwurf umgesetzt. Für die vier Leistungsseiten selbst eine zusätzliche Schritt-für-Schritt-
    Abfolge zu erfinden, ohne dass die alte Seite oder das Briefing eine liefert, wäre über „nur bei
    echter Abfolge" hinausgegangen (DESIGN.md §10).
29. **FAQ auf allen vier Leistungsseiten sowie im Mieterservice ist durchgehend Entwurf** (neue Inhalte,
    nicht aus Phase 0) — im Unterschied zu `contentStatus` auf `services` (das nur die "Was wir
    übernehmen"-Liste betrifft) wird das FAQ unabhängig davon immer mit einem sichtbaren
    Entwurfs-Hinweis gerendert, nie stillschweigend als bestätigt dargestellt.
30. **`/objekte` bekommt in Phase 4 schon ein einfaches Kartenraster statt eines reinen Platzhalters**
    (keine Filter/Karte/Sortierung — das bleibt Phase 5), damit „Freie Objekte ansehen" auf der
    Startseite und der Navigationspunkt nicht ins Leere laufen. Objektkarten ohne Galeriebild (aktuell
    alle drei Beispielobjekte) zeigen stellvertretend eine Zeichnung aus dem Modul statt eines leeren
    Feldes — konsequente Weiterführung von „Zeichnung statt Foto" auch dort, wo noch kein Foto
    hinterlegt ist.
31. **404 über `global-not-found.tsx` (experimentell) plus `(frontend)/not-found.tsx`.** Das Projekt hat
    zwei Root-Layouts ((frontend), (payload)), laut Next-Doku genau der Fall, für den
    `experimental.globalNotFound` vorgesehen ist — ein gewöhnliches `app/not-found.tsx` könnte sonst
    nicht jede beliebige, keiner Gruppe zuordenbare URL abfangen. `global-not-found.tsx` bewusst ohne
    Payload-Datenabruf (umgeht laut Doku das normale Rendering) und mit eigenem, einfachem Header statt
    der interaktiven `Header`-Komponente.
32. **Formulare auf den Leistungsseiten, Kontakt und der Schadenmeldung sind bewusst kein `<form>`-
    Element**, sondern reine Feld-Optik ohne `onSubmit`/`action` (`FieldShape`-Komponenten, Felder
    durchgehend `disabled`). Verhindert ein versehentliches Browser-GET beim Drücken von Enter und macht
    ehrlich sichtbar, dass der Versand erst in Phase 6 (Server Actions, Zod, Spam-Schutz) folgt, statt
    eine halbfunktionierende Form vorzutäuschen.
33. **Screenshot-Selbstkritik, zwei Funde:** (1) Teamfotos erschienen in `fullPage`-Screenshots leer —
    verifiziert als Artefakt von nativem `loading="lazy"` kombiniert mit Playwrights `fullPage`-Capture
    (kein Scrollen vor der Aufnahme), nicht als echter Fehler: mit Scroll-Through sichtbar korrekt, auch
    über die REST- und Local-API bereits korrekt mit `url` befüllt. (2) Die mobile Aktionsleiste scheint
    in `fullPage`-Screenshots mehrfach mitten auf der Seite auf (Chromium zeichnet `position: fixed`-
    Elemente beim Zusammenfügen eines Full-Page-Screenshots an jedem Viewport-Höhen-Intervall erneut) —
    mit echten, nicht zusammengesetzten Viewport-Screenshots (`scrollIntoViewIfNeeded`, kein `fullPage`)
    verifiziert, dass kein Inhalt dauerhaft unerreichbar hinter der Leiste hängen bleibt (anders als der
    in Phase 3 gefundene und behobene Footer-Fall, wo das tatsächliche Seitenende betroffen war). Für
    `fullPage`-Screenshots auf Seiten mit `position: fixed`-Elementen künftig gezielte
    Viewport-Screenshots statt `fullPage` verwenden, um solche Artefakte nicht erneut fehlzudeuten.

## Phase 5 — Objekte (Liste, Filter, Karte, Detail)

34. **Node-eigenes `fetch` braucht `NODE_USE_ENV_PROXY=1`, um in dieser Sandbox über den
    Agent-Proxy zu gehen.** `curl` respektiert `HTTPS_PROXY` automatisch, Node ≥22.21 tut das für
    sein eingebautes `fetch` nur mit diesem Flag (siehe `/root/.ccr/README.md`). Ohne das Flag
    scheiterte die swisstopo-Geokodierung in `src/lib/geocode.ts` lautlos (der absichtliche
    try/catch zum Nichtblockieren des Speicherns schluckte den Fehler) — über `curl` sah die
    exakt gleiche Anfrage erfolgreich aus, was die eigentliche Ursache zunächst verdeckte, bis ein
    isolierter Node-`fetch`-Test ohne das Flag denselben stillen Fehlschlag reproduzierte. Fix:
    `NODE_USE_ENV_PROXY=1` in den `dev`/`build`/`start`/`seed`-Skripten via `cross-env` gesetzt. In
    echter Produktion (Vercel) ist das Flag wirkungslos, da dort kein `HTTPS_PROXY` gesetzt ist —
    rein eine Sandbox-Notwendigkeit, kein Produktionsverhalten.
35. **maplibre-gl 6.x hat keinen Default-Export mehr** (anders als ältere Major-Versionen) —
    `import { Map, Marker, NavigationControl, LngLatBounds, setWorkerUrl } from 'maplibre-gl'`
    (benannte Importe) statt `import maplibregl from 'maplibre-gl'`. Gegen die tatsächlich
    installierte `.d.ts` geprüft, nicht angenommen — `tsc` schlug mit der alten Schreibweise sofort
    fehl.
36. **maplibre-gl braucht einen manuell gehosteten Worker unter Turbopack.** Die Bibliothek lädt
    ihren Web Worker intern über `new Worker(new URL(e, import.meta.url))` mit `e` als
    Laufzeit-Variable statt Stringliteral — Turbopack kann das nicht statisch als Asset erkennen
    und bündelt die Worker-Datei nicht; zur Laufzeit scheiterte das mit "Worker failed to load"
    (im Next-Dev-Overlay als rotes "1 Issue"-Badge sichtbar, über Playwright-Konsolen-Logs
    verifiziert). Fix laut maplibre-gl selbst: `dist/maplibre-gl-worker.mjs` nach
    `public/vendor/maplibre-gl-worker.mjs` kopiert und vor der ersten `Map`-Instanz
    `setWorkerUrl('/vendor/maplibre-gl-worker.mjs')` aufgerufen (von maplibre-gl für genau diesen
    Zweck exportiert). Bei einem Upgrade von maplibre-gl muss diese Datei manuell nachgezogen
    werden — vermerkt hier, da kein automatischer Copy-Schritt existiert.
37. **swisstopo liefert Kacheln von fünf gesharded Subdomains**, nicht nur
    `vectortiles.geo.admin.ch` (das nur das Style-JSON selbst bedient). Die TileJSON-Antwort hinter
    jeder `source.url` listet `vectortiles0.geo.admin.ch` bis `vectortiles4.geo.admin.ch` als
    echte Kachel-URLs — per `curl` gegen die echte API verifiziert, nicht angenommen. Alle fünf
    zur Netzwerk-Allowlist dieser Sandbox hinzugefügt (reine Sandbox-Einschränkung, in Produktion
    ohne Allowlist irrelevant).
38. **Filter/Sortierung/Ansicht laufen über clientseitige `router.push`-Soft-Navigation**, nicht
    über ein natives GET-Formular. Beide Ansätze erfüllen "URL-Query-State, teilbar, Zurück-Taste
    funktioniert" gleichermassen, aber nur die Soft-Navigation lässt die `aria-live`-Trefferzahl-
    Region als echte Live-Region-Aktualisierung funktionieren (Inhalt ändert sich am selben
    DOM-Knoten, ohne dass die Seite neu lädt) — mit Playwright verifiziert: Text wechselt von
    "5 Objekte gefunden." zu "1 Objekt gefunden." bei gleichzeitig aktualisierter URL
    (`?kreis=4`), ohne vollständige Navigation.
39. **Preis-bis-Filter erscheint erst, wenn Mieten oder Kaufen gewählt ist** (nicht bei "Alle") —
    ein einziges CHF-Band für Mietzins (drei-/vierstellig) und Kaufpreis (sechs-/siebenstellig)
    gleichzeitig wäre bedeutungslos. Ort-Freitextfilter aus Briefing §6 bewusst auf Kreis
    reduziert (kein separates Textfeld), da `searchAlerts.kriterien` ohnehin nur Kreis kennt und
    das spätere Suchabo-Matching (Phase 6) exakt auf dieselbe Kriterienmenge trifft.
40. **Die drei Beispielobjekte haben bewusst keine Strassenadresse** (nur "Zürich, Kreis N", siehe
    Phase-0-Entscheidung #2) — die swisstopo-Geokodierung läuft für sie deshalb nie, und alle drei
    demonstrieren naturgemäss den Kreis-Näherungs-Pfad auf der Detailseite, nicht den Pin-Pfad. Um
    die Privatsphäre-Regel (Pin nur bei `adressePublicAnzeigen` UND vorhandenen Koordinaten, sonst
    Kreis-Näherung) end-to-end zu verifizieren, wurden zwei temporäre Testobjekte mit derselben
    echten, öffentlich bekannten Adresse (Bahnhofstrasse 1, 8001 Zürich) angelegt — eines mit
    `adressePublicAnzeigen: true` (zeigt korrekt einen präzisen Pin), eines mit `false` (zeigt
    korrekt nur die Kreis-Näherung, obwohl dieselben echten Koordinaten im Datensatz stehen). Beide
    nach der Verifikation wieder gelöscht, nie geseedet — keine Erfindung einer Kundenadresse,
    reines QA-Fixture mit einer öffentlich ohnehin bekannten Postadresse.
41. **Druck-Stylesheet erzwingt Weiss statt Kalk als Hintergrund** (`@media print`) — spart
    Tonerverbrauch beim tatsächlichen Ausdrucken, rein kosmetisch sonst ohne Wirkung. Die
    interaktive Galerie bleibt im Druck ausgeblendet (`print:hidden`), ein eigenes, nicht
    interaktives Druck-Titelbild (erstes Galeriebild oder Zeichnung) wird stattdessen gezeigt statt
    die Lightbox-Buttons mit auszudrucken.
42. **`PropertyMap` setzt nach `idle` ein `data-qa-idle`-Attribut auf den Canvas.** Nicht nur für
    diese Phase: ein stabiler Haken für künftige Playwright-Tests (Phase 8), die sonst nur per
    Timeout raten könnten, ob die Karte "Canvas existiert" oder "Kacheln sind tatsächlich fertig
    gerendert" erreicht hat — genau diese Verwechslung erzeugte zunächst einen irreführenden
    Screenshot mit einer fast leeren Karte (Kamera war per `fitBounds`/`jumpTo` bereits gesprungen,
    aber die Kacheln für den neuen Ausschnitt waren noch nicht geladen).

## Phase 6 — Formulare, E-Mails, Suchabo, Cron

43. **Upload-Speicher-Abstraktion erweitert DECISIONS.md #12, statt eine zweite zu erfinden.**
    Schadenmeldungs-Fotos laufen über einen eigenen Server-Endpunkt
    (`src/app/(payload)/api/uploads/schadenmeldung/route.ts`, als statisches Segment platziert, das
    Payloads `[...slug]`-Catch-all laut Next-Doku schlägt), der nach Magic-Bytes-Prüfung ganz normal
    `payload.create({ collection: 'media', ... })` aufruft — dieselbe lokale Speicherung wie der
    Rest der Mediathek, kein zweiter Mechanismus. Echter direkter Browser-zu-Vercel-Blob-Upload
    (Briefing §9) setzt reale Blob-Zugangsdaten voraus, die noch fehlen; ungetesteten Code für eine
    Produktions-API zu schreiben, die nicht erreichbar ist, wäre riskanter als der jetzige, in der
    Praxis vollständig lauffähige Weg. Einschränkung dokumentiert: Next/Vercel-Funktionen nehmen pro
    Request nur ca. 4,5 MB entgegen; client-seitig auf max. 2560 px verkleinerte Fotos bleiben in der
    Praxis meist darunter, ein sehr grosses unkomprimiertes Einzelfoto könnte das aber reissen — der
    echte, grössenunabhängige Fix (Direkt-Upload zu Blob, am Server vorbei) ist Phase 9 vorgemerkt.
44. **"Private" Anhänge bleiben technisch über ihre URL erreichbar, wenn man sie errät** — wie vom
    Briefing selbst beschrieben ("zufällige Pfade, nirgends öffentlich verlinken; private Blobs
    nutzen, **falls verfügbar**"), nicht als echte zugriffsgeschützte Dateien. Payloads `media`-
    Collection ist absichtlich öffentlich lesbar (für Objektfotos nötig); Schadenmeldungs-Fotos
    bekommen randomisierte UUID-Dateinamen und werden nirgends auf der öffentlichen Seite verlinkt.
    Für eine stärkere Garantie bräuchte es eine eigene, authentifizierte Download-Route — bewusst
    nicht gebaut, da das Briefing "falls verfügbar" selbst als Kann-Kriterium formuliert und dafür
    noch keine Admin-Oberfläche existiert, die Anhänge ohnehin anzeigen müsste.
45. **Cloudflare-Turnstile-Testsecret aus der Erinnerung war falsch** (`1x0000000000000000000000000AA`,
    29 Zeichen) — der echte `siteverify`-Aufruf lieferte `invalid-input-secret`. Das korrekte,
    öffentlich dokumentierte "Always passes"-Secret ist `1x0000000000000000000000000000000AA`
    (35 Zeichen), direkt aus Cloudflares Testing-Dokumentation nachgeschlagen und live gegen den
    Endpunkt verifiziert (`success: true`), nicht nur angenommen. In `.env.local`, `.env.example`
    und dem Code-Fallback korrigiert.
46. **Referenznummern-Generator hatte einen echten Entropie-Bug**, durch den eigenen Unit-Test
    gefunden, nicht vermutet: vier Zufallsbytes wurden einzeln zu Base36 codiert (`padStart(2,'0')`
    je Byte) und dann auf 4 Zeichen *geschnitten* — die ersten beiden Bytes bestimmten die Ausgabe
    vollständig, die letzten beiden wurden verworfen. Effektive Entropie damit nur 65'536 statt
    1'679'616 (36⁴) mögliche Suffixe; ein Test mit 500 Läufen fand prompt 2 Kollisionen. Fix:
    ein `Uint32`-Zufallswert wird per Modulo auf den vollen 36⁴-Suffixraum abgebildet, keine
    Zeichen-Verwerfung mehr. Test auf 150 Läufe reduziert (saubere Fehlerspanne bei vollem
    Entropie-Raum) und als Regressionsschutz behalten.
47. **`pnpm test:int`/`pnpm test:e2e` luden nie `.env.local`** — ein bereits vor Phase 6
    bestehender Scaffold-Mangel (`vitest.setup.ts`/`playwright.config.ts` riefen `dotenv/config`
    ohne Pfad auf, das lädt nur eine nicht existierende `.env`). `pnpm test:int` schlug dadurch
    schon vorher mit "missing secret key" fehl, sobald man es wirklich ausführte. In beiden Dateien
    auf `dotenv.config({ path: '.env.local' })` korrigiert — notwendig, damit die in dieser Phase
    verlangte echte Testabdeckung überhaupt laufen kann.
48. **Double-Opt-in-Bestätigung und Abmeldung laufen über einen expliziten Klick, nicht automatisch
    beim Laden der Bestätigungs-/Abmelde-Seite (GET).** E-Mail-Clients und Sicherheits-Scanner rufen
    verlinkte URLs oft automatisch vorab auf ("Link-Prefetching") — ein auto-bestätigender Server
    Component hätte Suchabos ohne menschliches Zutun aktiviert bzw. abgemeldet. `/suchabo/bestaetigen`
    und `/suchabo/abmelden` zeigen stattdessen einen Button, der eine Server Action auslöst.
49. **Screenshot-Selbstkritik:** ein scheinbarer Header/Preisbox-Overlap auf der Objektdetailseite
    (`fullPage`-Screenshot nach Scroll zu `#besichtigung`) erneut als reines Stitching-Artefakt
    bestätigt (siehe DECISIONS.md #33) — ein echter, nicht zusammengesetzter Viewport-Screenshot an
    derselben Scroll-Position zeigt keinerlei Überlappung. Kein Fix nötig, nur protokolliert.

## Phase 7 — SEO, Englisch, OG-Bilder, Redirects

50. **`/en`-Umfang bewusst auf zwei Seiten begrenzt (Startseite, Bewirtschaftung).** Volle
    next-intl-Routing-Migration (alle ~15 bestehenden Routen unter `app/[locale]/` verschieben,
    Middleware, jeden internen Link anpassen) ist ein grosser, riskanter struktureller Umbau an
    einem bereits funktionierenden, mehrfach verifizierten Seitenbaum (Phasen 3–6). Risikoabwägung:
    lieber zwei Seiten sauber, ehrlich und vollständig übersetzt als ein Versuch, die ganze Seite in
    einem Durchgang umzuziehen, der auf halbem Weg fehlschlagen und die bestehende deutsche Seite
    mitbeschädigen könnte. Stattdessen: eigener `src/app/en/`-Baum (eigenes Root-Layout, kein
    next-intl-Routing), der Header/Footer/MobileActionBar/LeistungenIndex wiederverwendet (jetzt mit
    optionalem `locale`-Prop statt next-intl-Hooks — bei nur zwei Seiten wäre ein
    Message-Katalog-System mehr Komplexität als die paar hartcodierten Strings direkt im Code, wie es
    der Rest des Projekts ohnehin schon für Seiteninhalte macht). Jede englische Seite zeigt eine
    `DraftBox` "translation in progress", die ehrlich sagt, dass nur diese zwei Seiten existieren.
    Die Sprachwahl in Header/Footer (`LanguageSwitch.tsx`) verlinkt `EN` nur dort, wo eine Seite
    tatsächlich existiert — sonst ausgegraut mit Erklärung, kein toter Link. Erweiterung auf weitere
    Seiten bleibt in `CONTENT_TODO.md` vermerkt.
51. **Echte Übersetzungen statt nur Fallback.** `localization.fallback: true` (Payload-Config)
    würde ohnehin German zeigen, wenn kein Englisch gepflegt ist — technisch hätte `/en` also auch
    ohne jede Übersetzungsarbeit "funktioniert" (nur eben auf Deutsch). Das wäre aber keine englische
    Seite, nur eine deutsche Seite unter einer `/en`-URL. Stattdessen wurden die tatsächlich
    sichtbaren Felder von Startseite und Bewirtschaftung (`services.claim`/`einleitung`/
    `leistungsgruppen`, `home.heroLead`/`wegweiser`/`ablaufSchritte`) über ein eigenes Skript
    (`scripts/seed-en.ts`, `pnpm seed:en`) mit von Hand verfassten, inhaltlich treuen Übersetzungen
    des bereits bestätigten deutschen Texts gefüllt — keine neuen Fakten, nur Übersetzung. FAQ und die
    übrigen drei Leistungen bleiben unübersetzt (fallen korrekt auf Deutsch zurück), weil sie ohnehin
    als Entwurf gelten bzw. nicht zum Zwei-Seiten-Umfang gehören.
52. **`FAQPage`-Strukturdaten bewusst nicht eingebaut**, obwohl Briefing/Umsetzungsplan sie nennen.
    Die FAQ-Inhalte auf den Leistungsseiten sind durchgehend als Entwurf markiert
    (`DraftNotice`, DECISIONS.md #29) — sie als `FAQPage`-JSON-LD auszuzeichnen hiesse, Google diese
    unbestätigten Fragen/Antworten als geprüften Fakt zur Anzeige in den Suchergebnissen anzubieten.
    Das widerspricht derselben "nichts erfinden, nichts als sicherer darstellen als es ist"-Regel,
    die auch `siteSettings`/`llms.txt` befolgen. Sobald FAQ-Inhalte fachlich freigegeben sind
    (`contentStatus`-artiger Mechanismus müsste dafür auf `faq` erweitert werden), ist das Nachrüsten
    von `FAQPage`-JSON-LD eine kleine, isolierte Ergänzung.
53. **`RealEstateAgent`-JSON-LD lässt unbestätigte Felder komplett weg** statt leere Strings oder
    Platzhalter auszugeben (UID, Handelsregisternummer, Öffnungszeiten — alle noch offen laut
    `CONTENT_TODO.md`). `openingHoursSpecification` entsprechend ganz ausgelassen, bis
    `siteSettings.oeffnungszeiten` echte Werte hat.
54. **`robots.ts` liest `NEXT_PUBLIC_DEMO_MODE` vorausschauend für Phase 9**, obwohl die Variable
    (und das Demo-Banner, das sie sonst steuert) diese Phase noch gar nicht existiert. Fehlt die
    Variable oder ist sie `"true"`, sperrt `robots.ts` alles (`Disallow: /`) — der aktuell korrekte
    Zustand für eine Vorschau, die noch nicht live gehen soll. Erst ein explizites
    `NEXT_PUBLIC_DEMO_MODE=false` beim echten Go-live schaltet die Seite für Suchmaschinen frei. So
    muss Phase 9 diese Datei nicht mehr anfassen, nur die Variable setzen.
55. **Redirects: keine weiteren nötig, mit dem Phase-0-Archiv verifiziert statt vermutet.**
    `reference/original-site/pages-sitemap.xml` listet nur sechs URLs, die alle 1:1 auf identische
    neue Pfade treffen (`/`, `/bewirtschaftung`, `/stockwerkeigentum`, `/erstvermietung`, `/verkauf`,
    `/objekte` — URLs bleiben laut Briefing §4 bestehen). Die einzige tatsächlich nötige Umleitung
    (`/rechtliche-hinweise` → `/impressum`, nicht in der Sitemap, nur im alten Footer verlinkt) existiert
    bereits seit Phase 4. Statische `next.config.ts`-Redirects bleiben damit ausreichend — keine neue
    CMS-Redirects-Collection nötig für den aktuellen Umfang.
56. **OG-Bilder für Startseite und Leistungsseiten mit Systemschriften**, konsistent mit der
    bestehenden Begründung für das Objekt-OG-Bild (Phase 5): `next/og`/Satori bräuchte eigene
    Font-Dateien in der Edge-Umgebung, was für ein sauberes, markenkonformes sans-serif-Bild ohne
    Zusatzkomplexität nicht nötig ist. Mittelpunkt-Trenner («·») bewusst vermieden (DESIGN.md §10
    "Vermeiden" gilt dem Geist nach auch für Social-Preview-Bilder), stattdessen "/" wie in den
    Breadcrumbs der Seite selbst.

## Phase 8 — Qualitätssicherung

57. **Vitest-Lücken geschlossen**: `formatCHF`/`formatZimmer`/`formatFlaeche`/`formatOrt`
    (inkl. der tatsächlich von `Intl.NumberFormat('de-CH')` erzeugten Zeichen — geschütztes
    Leerzeichen U+00A0 nach "CHF", gerader Apostroph `'` als Tausendertrennzeichen, nicht `’`;
    gegen echte Node-ICU-Ausgabe verifiziert, nicht angenommen), `getOpeningStatus`
    (inkl. Leerzustand ohne gepflegte Zeiten, Ausnahmetage, exklusive Bis-Grenze),
    `parsePropertyFilters`/`buildPropertyWhere`/`withParam` und `propertyLocation`
    (Privatsphäre-Regel isoliert getestet, zusätzlich zur bestehenden E2E-Abdeckung). 56 Tests
    in 7 Dateien, alle grün.
58. **E2E-Suite auf 1 Worker fest eingestellt** (`playwright.config.ts`), nicht nur auf CI.
    Alle E2E-Tests laufen gegen dieselbe echte lokale Postgres-Entwicklungsdatenbank
    (DECISIONS.md #12) ohne Transaktions-Isolation pro Test — unter parallelen Workern führten
    zeitgleich laufende Tests, die temporäre `properties`/`searchAlerts`-Dokumente anlegen
    (`objekt-detail.e2e.spec.ts`, `suchabo-opt-in.e2e.spec.ts`), zu echten, nicht reproduzierbaren
    Fehlschlägen bei Tests, die globale Zustände prüfen (z. B. "3 Objekte gefunden." in
    `objekte-filter.e2e.spec.ts`). Mit 1 Worker vollständig behoben, nicht nur die Assertions
    gelockert. Ausserdem wurde der seit Phase 2 unveränderte Scaffold-Test
    (`frontend.e2e.spec.ts`, prüfte noch "Payload Blank Template"/"Welcome to your new project.")
    durch echte Navigations-/404-/Redirect-Abdeckung ersetzt — ein echter, bis Phase 8
    unbemerkter Lücken-Fund. 39 neue/ersetzte E2E-Tests, zusammen mit den bestehenden 60 Tests
    insgesamt, alle grün.
59. **Zwei echte, durch axe-core gefundene Barrierefreiheits-Bugs behoben, nicht nur Default-
    Daten nachgezogen:**
    - **`LanguageSwitch.tsx`**: der ausgegraute "EN"-Platzhalter auf noch nicht übersetzten
      Seiten nutzte `opacity-50` auf dem bereits gedämpften `text-tinte-hell`-Ton — Kontrast nur
      2,16:1 statt der geforderten 4,5:1. Ersetzt durch `aria-disabled="true"` + `cursor-not-
      allowed` bei unveränderter (konformer) Textfarbe; "deaktiviert" wird jetzt nicht mehr über
      Farbe allein vermittelt.
    - **Formular-Fehlertext**: `#E81D1B` (DESIGN.md §2 "Fehlerzustand") war nur für weissen Text
      AUF rotem Grund verifiziert (4,54:1) und wurde unverändert auch als rote Schrift AUF Kalk/
      Weiss wiederverwendet — dort nur 3,96:1. Neuer, eigener Token **"Fehlertext" `#C21815`**
      (5,32:1 auf Kalk) eingeführt und in `Fields.tsx` (`ErrorText`, `FormStatusFooter`) sowie
      `SchadenmeldungForm.tsx` (Foto-Validierungsfehler) angewendet; `#E81D1B` bleibt für Ränder
      (3:1-Schwelle nach WCAG 1.4.11, dort unverändert ausreichend) und für weissen Text auf
      rotem Grund. DESIGN.md §4 entsprechend ergänzt.
60. **`/objekte` hatte einen echten Heading-Order-Sprung** (h1 → h3, `PropertyCard` setzt direkt
    `<h3>` für den Objekttitel) — dort korrekt, wo `PropertyCard` unter einer echten `<h2>`
    steht (Startseiten-Teaser "Aktuelle Objekte"), aber falsch auf `/objekte` selbst, wo die
    Karten direkt auf das `<h1>Objekte</h1>` folgen. Behoben mit einer visuell verborgenen
    `<h2 class="sr-only">Suchergebnisse</h2>` vor dem Kartenraster, statt `PropertyCard` für den
    anderen, bereits korrekten Verwendungsort zu verändern.
61. **Der `link-name`-Fund (leere Wegweiser-Links auf der Startseite) war kein Code-Bug,
    sondern veraltete lokale Entwicklungsdaten.** `seedHome()` (`src/seed/index.ts`) setzt
    `label` für alle drei Wegweiser-Einträge und volle `ablaufSchritte`-Texte korrekt — die
    lokale Postgres-Entwicklungsdatenbank in dieser Sandbox war seit einem Container-/
    Worker-Neustart (Postgres mehrfach kurzzeitig nicht erreichbar, DECISIONS.md-Kontext dieser
    Phase) nicht mehr mit dem aktuellen Seed-Skript neu befüllt worden. `pnpm seed` behebt es
    vollständig, bestätigt per direktem API-Abgleich vor/nach dem Reseed — keine Code-Änderung
    nötig oder vorgenommen. Für die Produktion irrelevant: dort pflegt die Redaktion Inhalte
    über das CMS, nicht über das Seed-Skript.
62. **Payloads Admin-Login-Bildschirm bewusst von der strikten axe-Null-Verstösse-Prüfung
    ausgenommen** (`landmark-one-main`, `page-has-heading-one`, `region` — alle im unveränderten
    Payload-Vendor-Markup). Das Projekt hat keinen vorgesehenen Override-Mechanismus für
    Payload-Core-Templates; sie selbst zu patchen wäre ein unverhältnismässiger Eingriff in
    Drittanbieter-Code für ein internes, login-geschütztes Redaktionswerkzeug. Der axe-Test
    läuft weiterhin (loggt Funde), erzwingt aber keinen Fehlschlag mehr — bewusst dokumentiert,
    nicht stillschweigend aus der Suite entfernt.
63. **Lighthouse-SEO-Score 69/100 auf jeder Seite ist der beabsichtigte Demo-Modus-Effekt, kein
    Mangel.** Einziger Minuspunkt überall: `is-crawlable` ("Page is blocked from indexing") —
    exakt das von `robots.ts` erzwungene `Disallow: /`, solange `NEXT_PUBLIC_DEMO_MODE` nicht
    explizit `false` ist (DECISIONS.md #54). Verifiziert: ein Build mit
    `NEXT_PUBLIC_DEMO_MODE=false` (Variable wird zur Build-Zeit eingebettet, ein Neustart mit
    geänderter Laufzeit-Variable allein reicht nicht) liefert **100/100/100/100** auf der
    Startseite — Performance, Accessibility, Best Practices und SEO sind in Wahrheit bereits
    voll konform; der 69er-Wert ist exakt der Preis der Absicht, die Vorschau nicht zu
    indexieren, und verschwindet automatisch beim echten Go-live.
64. **MapLibre-Kartenansicht (`/objekte?ansicht=karte`): echte, gemessene Performance-Grenze,
    kein Bug.** Lighthouse (mobil, mit Standard-Drosselung) misst dort Performance 69/100 mit
    9,9 s Total Blocking Time (TBT) — alle anderen Seiten erreichen 99–100 mit TBT unter 100 ms.
    Der Befund wurde nicht einfach hingenommen, sondern geprüft:
    - **Verdacht "Dev- statt Produktions-Bundle von maplibre-gl wird geladen" geprüft und
      verworfen.** Der grösste Chunk referenziert zwar `maplibre-gl-dev.mjs`-Dateinamen, aber
      die tatsächlich ausgeführte `maplibre-gl.mjs` (Produktionsbundle, von unserem Code korrekt
      über `import … from 'maplibre-gl'` eingebunden) enthält nur eine Weichen-Logik, welche
      Worker-Datei zu einer bereits laufenden Bundle-Variante passt (`e.endsWith('-dev.mjs') ?
      …-worker-dev.mjs : …-worker.mjs`) — das bestätigt, dass der in Phase 5 kopierte
      Produktions-Worker (DECISIONS.md #36) korrekt verwendet wird. Die `-dev`-Dateinamen im
      Chunk sind von Turbopacks konservativer Bündelung dynamisch referenzierter Kandidaten-
      Dateien, kein tatsächlich ausgeführter Dev-Code.
    - **Ohne jede Drosselung** (`--throttling-method=provided`, reale Hardware dieser Sandbox)
      bleiben real **2,16 s TBT** — deutlich weniger dramatisch als die gedrosselte Zahl, aber
      ein echter, spürbarer Kostenpunkt, kein reines Mess-Artefakt der Simulation.
    - **LCP bleibt auch auf dieser Seite unter 0,8 s** — die Karte ist bereits korrekt lazy
      geladen (nur bei `ansicht=karte`, Phase 5) und blockiert nicht den initialen Seitenaufbau;
      die Kosten entstehen erst nach der expliziten Nutzerwahl "Karte", nicht beim Betreten von
      `/objekte`.
    - **Ursache: MapLibre GLs inhärentes Gewicht** (Stilauswertung, WebGL-Initialisierung,
      Verarbeitung der detailreichen swisstopo-Vektorkacheln für Zürich) unter mobiler CPU-
      Drosselung — keine ineffiziente eigene Marker-Logik (nur 3 Beispielobjekte, keine Schleife
      mit nennenswerter Laufzeit möglich). Als Phase-9-Vormerkung festgehalten (siehe "Bekannte
      Grenzen" unten), nicht in dieser Phase riskant "gelöst", ohne die Kartenqualität visuell
      verifizieren zu können.

### Bekannte Grenzen (Briefing §14)

Ehrlich und vollständig festgehalten, nicht stillschweigend offen gelassen:

- **Englische Version nur 2 von ~15 Seiten** (Startseite, Bewirtschaftung) — DECISIONS.md #50,
  `CONTENT_TODO.md`. Bewusste Risikoabwägung, keine vergessene Arbeit.
- **`siteSettings` fehlen weiterhin reale Werte** für UID, Handelsregisternummer, MWST-Nummer
  und Öffnungszeiten — alle in `CONTENT_TODO.md` als offene Kundenfragen geführt, JSON-LD und
  Footer zeigen entsprechend keine erfundenen Platzhalter, sondern lassen die Felder aus.
- **Entwicklung läuft auf lokalem Postgres/lokalem Datei-Upload statt Neon/Vercel Blob**, echter
  Resend-/Turnstile-/Upstash-Betrieb fehlt noch (DECISIONS.md #12, #43) — alles mit funktionierenden
  Entwicklungs-Fallbacks (Konsolen-E-Mail, Cloudflares öffentliche Test-Schlüssel, In-Memory-
  Rate-Limit), aber echte Zugangsdaten für Phase 9 nötig.
- **MapLibre-Kartenansicht kostet real ca. 2,2 s Haupt-Thread-Zeit** (gedrosselt gemessen 9,9 s
  TBT) — strukturelle Grenze von MapLibre GL selbst, siehe Fund #64 oben. Mögliche künftige
  Ansätze (nicht umgesetzt, da ungetestet riskant): `pixelRatio` der Karte auf hochauflösenden
  Mobilgeräten deckeln, ein expliziter "Karte laden"-Klick-Gate statt Auto-Laden bei
  Ansichtswechsel, oder Beobachtung künftiger, kleinerer maplibre-gl-Releases.
- **Payload-Admin-Login-Bildschirm** hat drei axe-Funde in unverändertem Vendor-Markup
  (`landmark-one-main`, `page-has-heading-one`, `region`) — bewusst nicht gepatcht, siehe Fund
  #62. Betrifft nur das interne, login-geschützte Redaktionswerkzeug, nicht die Publikumsseite.
- **Lighthouse-SEO zeigt 69/100 im Demo-Modus** — vollständig durch das beabsichtigte
  `noindex`/`Disallow: /` erklärt (Fund #63), kein echter Mangel; verifiziert 100/100/100/100
  mit `NEXT_PUBLIC_DEMO_MODE=false`.
- Alle übrigen, bereits in früheren Phasen dokumentierten offenen Punkte (Team-Rollen,
  Bautreuhand, SVIT-Bezeichnung, Google-Bewertungen, Notfallnummern, Formulare als PDF,
  Ansprechperson pro Leistung usw.) bleiben unverändert in `CONTENT_TODO.md` offen — Phase 8
  hat keine davon neu aufgeworfen oder gelöst, da ausserhalb des QS-Umfangs.
65. **Echter Bug gefunden und behoben: `scripts/seed-en.ts` löschte deutsche Inhalte.** Beim
    Nacharbeiten der Startseite fiel auf, dass der Wegweiser-Block ("Wie können wir Ihnen
    helfen?") auf Deutsch leer gerendert wurde. Ursache: `seed-en.ts` schrieb Array-Felder
    (`home.wegweiser`, `home.ablaufSchritte`, `services.leistungsgruppen[].punkte`) ohne die
    bestehenden Zeilen-`id`s mitzugeben. Payload interpretiert das als "Zeilen ersetzen" statt
    "Text in dieser Sprache ergänzen" und legt beim `locale: 'en'`-Update komplett neue
    Array-Zeilen an — die alten Zeilen samt ihren deutschen `_locales`-Einträgen werden dabei
    kaskadierend gelöscht, nicht nur überschrieben. Betroffen waren 3 Wegweiser-Links, 4
    Ablauf-Schritte und die 8-teilige "Was wir übernehmen"-Liste der Bewirtschaftung — auf
    Deutsch komplett leer bzw. (dank `localization.fallback: true`) still auf Englisch
    zurückfallend, unbemerkt seit Phase 7. Behoben in `seed-en.ts`: holt jetzt zuerst die
    bestehenden Zeilen samt echter `id`, schreibt die englische Übersetzung unter Beibehaltung
    dieser `id`s zurück (inkl. der äusseren `leistungsgruppen`-Zeile, nicht nur der inneren
    `punkte`). Lokal verifiziert (`pnpm seed` → `pnpm seed:en` → beide Sprachen koexistieren in
    der DB). Die bereits auf Neon vorhandene, identische Datenlücke wurde direkt per
    `INSERT` der fehlenden `de`-Zeilen (gleiche Zeilen-IDs, keine bestehenden Daten verändert
    oder gelöscht) nachgetragen, nicht über einen erneuten Seed-Lauf — ein Node-Prozess aus
    dieser Sandbox kann Neons Postgres-Port nicht direkt erreichen (nur HTTPS ist erlaubt),
    der MCP-Tool-Pfad schon.
66. **Startseite von 9 auf 7 Abschnitte verschlankt (nach echtem Audit, nicht angenommen).**
    Vor jeder Änderung wurde `page.tsx` tatsächlich gelesen, nicht von aussen vermutet, ob die
    Seite "zu voll" ist. Ergebnis: Zwei Abschnitte waren echte Streichkandidaten, der Rest
    (Hero, Wegweiser, Warum-Nora-Leiste, Leistungen, Aktuelle Objekte, Team, Kontakt) bleibt
    unverändert, weil jeder davon eine eigene, nicht redundante Aufgabe erfüllt.
    - **"So übernehmen wir Ihre Liegenschaft" (Ablauf-Schritte) verschoben** auf `/bewirtschaftung`
      (zwischen "Was wir übernehmen" und FAQ) — die Entwurfsmarkierung ("Entwurf — noch nicht
      vom Kunden bestätigt.") wandert unverändert mit. Inhaltlich gehört der Ablauf zu Leuten,
      die bereits bei der Bewirtschaftungsseite sind, nicht auf die Startseite; dort stand er
      ausserdem bislang als unbestätigter Entwurf im ersten Scroll der wichtigsten Seite.
    - **Eigener "Mieterservice"-CTA-Block von der Startseite entfernt** — ersatzlos, weil
      `/mieterservice` bereits dreifach erreichbar ist: als einer der drei Wegweiser-Links
      ("Ich wohne in einer Liegenschaft von Nora"), im Header und im Footer sowie im mobilen
      Action-Bar. Der Block duplizierte eine bereits vorhandene Route ohne eigenen Mehrwert.
    - Geprüft und bewusst NICHT entfernt: Wegweiser (einzige Stelle, die alle sechs Zielgruppen
      aus dem Briefing direkt anspricht), Warum-Nora-Leiste (deckt sich inhaltlich bereits mit
      dem empfohlenen "Warum wir"-Abschnitt, keine Änderung nötig), Leistungen/Objekte/Team
      (jeweils eigene, nicht redundante Konversionsfunktion).
    - Screenshots bei 390/768/1440px auf `/` und `/bewirtschaftung` nach der Änderung geprüft;
      eine zunächst vermutete Überlappung der mobilen Action-Bar mit Fliesstext erwies sich bei
      gezieltem Scroll-Screenshot als reines Artefakt von `fullPage`-Screenshots mit
      `position: fixed`-Elementen, kein echter Bug.
67. **Echter, vorbestehender Lückenfund: Das "dreifache noindex" aus Briefing §13 war nur zu
    einem Drittel gebaut.** Direkte Prüfung des produktiven Deploys (`curl`, da `WebFetch` für
    neu freigegebene Hosts in dieser Session dauerhaft fehlschlug) zeigte: kein sichtbares
    Demo-Banner, kein `<meta name="robots">`, kein `X-Robots-Tag`-Header — nur `/robots.txt`
    (`src/app/robots.ts`) war tatsächlich implementiert. `siteSettings.demoBannerText` existierte
    als Feld, wurde aber nirgends gerendert; keines der beiden Root-Layouts ((frontend), en) hatte
    je ein `robots`-Metadata-Feld gesetzt. Kein Regressions-Bug aus der heutigen Arbeit, sondern
    eine seit dem ursprünglichen Bau offene Lücke.
    - Behoben: `robots: { index: false, follow: false }` (sonst `true`) in beiden Root-Layouts,
      dieselbe `NEXT_PUBLIC_DEMO_MODE !== 'false'`-fail-safe-Logik wie in `robots.ts`. Zusätzlich
      `X-Robots-Tag`-Header via `next.config.ts` `headers()` (Next erzeugt aus dem
      Metadata-Feld nur den Meta-Tag, keinen Header — im Code selbst nachgeprüft, nicht
      angenommen, bevor eine Kommentarzeile das Gegenteil behauptet hätte).
    - Das sichtbare Banner wurde zunächst als eigenständige Komponente VOR `<Header>` platziert
      und löste sofort 19 axe-core-Regionsverstösse aus (`region: Ensure all page content is
      contained by landmarks`) — vom eigenen Testlauf korrekt gefangen. Tieferliegender Grund für
      einen zweiten, grösseren Umbau: `Header` ist `position: fixed; top: 0`, ein Geschwister-
      Element davor wird von einem fixen Element schlicht überdeckt, nicht nach unten verdrängt.
      Lösung: Banner lebt jetzt als erstes Kind INNERHALB desselben `fixed`-Blocks wie die
      Navigation (`Header.tsx`, neue `demoBannerText`-Prop statt eigener Komponente — nur noch an
      einer Stelle gebraucht), teilt damit automatisch dessen Scroll-Ein-/Ausblenden. `role="region"`
      mit `aria-label` für die axe-Landmark-Pflicht. `<main>`-Padding dafür von `pt-16 md:pt-20`
      auf einheitlich `pt-32` angehoben — Höhe empirisch mit Playwright an allen Breakpoints
      gemessen (116,6 px mobil bei zweizeilig umbrechendem Banner, 112,8 px ab `md`), nicht
      geschätzt; eine einzelne grosszügige Konstante statt zweier knapp bemessener Werte, da
      Letzteres bei 1440 px nur 0,8 px Reserve gehabt hätte.
68. **Wegweiser-Abschnitt ("Wie können wir Ihnen helfen?") von Start (DE+EN) entfernt, auf
    zweiten Blick des Kunden hin — und mit besserer Begründung als beim ersten Behalten-Entscheid
    in #66.** Von den drei Links duplizieren zwei direkt die beiden Hero-CTAs eine Sektion
    darüber (Eigentümer-Link = "Verwaltung anfragen", Wohnungssuche-Link = "Freie Objekte
    ansehen", je selbes Ziel), der dritte (Mieterservice) ist bereits in Header, Footer und
    mobiler Action-Bar erreichbar. Die #66-Begründung "einzige Stelle für alle sechs
    Zielgruppen" war selbst schon ungenau — der Abschnitt deckte nie mehr als drei ab, nie
    Verkauf/Stockwerkeigentum/Erstvermietung — und übersah, wie viel davon der Hero bereits
    übernimmt. Startseite damit bei 6 Abschnitten (von ursprünglich 9). `home.wegweiser`
    (CMS-Feld, Seed-Daten) bewusst nicht mitentfernt — reine Aufräumarbeit am Schema ohne
    Platzierungsentscheidung wäre eigener Schritt, nicht Teil dieser Änderung.
