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
