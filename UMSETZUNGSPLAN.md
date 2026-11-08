# UMSETZUNGSPLAN.md — Nora Immobilien AG

Konkretisierung von Briefing-Abschnitt 15. Jede Phase endet mit demselben Checkpoint (Briefing §0.2–3):
`pnpm typecheck && pnpm lint && pnpm build` grün → Git-Commit → drei Sätze Zusammenfassung. UI-Phasen
zusätzlich mit Playwright-Screenshots bei 390/768/1440 px, Selbstkritik gegen `DESIGN.md` §10.

**Phase 0 — abgeschlossen.** `reference/` enthält alle alten Seiten (HTML + Markdown), 14 Bilder,
Logo-Analyse, Embed-Check, beantwortete Altfragen (`reference/SUMMARY.md`).

**Phase 1 — dieses Dokument + `DESIGN.md` + `DECISIONS.md` + `CONTENT_TODO.md`.** Wartet auf OK.

---

### Phase 2 — Projekt-Setup & Payload-Backend

- `create-next-app` (App Router, TypeScript strict, Tailwind v4) + `create-payload-app` (Template
  blank, Postgres) im selben Projekt integrieren, `/admin`-Route.
- Neon-Projekt (Frankfurt) anlegen, `DATABASE_URL` einrichten. Vercel-Blob-Bucket (EU-Region).
- Collections: `users`, `media`, `properties`, `team`, `services`, `downloads`, `posts`, `jobs`,
  `submissions`, `searchAlerts`. Globals: `siteSettings`, `home`, `about`, `tenantService`, `legal`.
  Felder exakt wie Briefing §8.
- Access-Control pro Collection (öffentlich nur Veröffentlichtes; `submissions`/`searchAlerts`/`users`
  nur eingeloggt) + Test, der das beweist. GraphQL deaktivieren, falls ungenutzt. Login-Rate-Limit.
- Drafts/Versionen/Live-Preview für `properties`, `services`, `home`.
- `pnpm seed`: überarbeitete Phase-0-Inhalte, Team, Leistungen, Einstellungen, Rechtstext-Entwürfe,
  drei klar markierte Beispielobjekte (`isExample`, nur "Zürich, Kreis …", Demo-Badge "Beispiel").
- Admin auf Deutsch, Nora-Logo im Admin, Dashboard-Schnellzugriffe.
- **Checkpoint 2.**

### Phase 3 — Designsystem, Zeichnungsmodul, Layout

- Tailwind-Tokens aus `DESIGN.md` §4–6. Archivo + Literata selbst gehostet über `next/font`.
- `components/drawings/`: Primitiven, Hero-Fassade (Selbstzeichnung + Tageszeit-Fenster), die sechs
  weiteren Zeichnungen aus `DESIGN.md` §8.
- Header (Desktop fix, mobil Aktionsleiste unten: Anrufen/Schaden melden/Objekte), Footer
  (Kontaktdaten, Öffnungszeiten, Navigation, Mitgliedschafts-Logos, Impressum/Datenschutz, Sprachwahl,
  Credit-Zeile), Skip-Link, Fokuszustände.
- SVG-Logo-Nachzeichnung + Favicon-Set.
- **Checkpoint 3 + Screenshots** (Header/Footer/Hero-Zeichnung auf allen drei Breiten).

### Phase 4 — Kerninhalt-Seiten

- Start, vier Leistungsseiten (`dynamicParams = false`, eigenständiger Inhalt je Seite, Basis aus
  `DESIGN.md` §11), Über uns, Mieterservice (ohne Schadenmeldungs-Formular-Logik, die kommt in Phase 6),
  Kontakt (Layout, Formularlogik folgt Phase 6), Rechtliches (Platzhalter-Struktur), 404.
- Jahre-seit-1979 serverseitig berechnet + tägliche Revalidierung (`DECISIONS.md` §11).
- Lange-Wörter-Test bei 360 px.
- **Checkpoint 4 + Screenshots jeder Seite.**

### Phase 5 — Objekte

- Liste: Umschalter Mieten/Kaufen, alle Filter aus Briefing §6, URL-Query-State, serverseitige
  Filterung, `aria-live`-Trefferzahl, Sortierung, Listen-/Kartenansicht (Karte lazy, MapLibre +
  swisstopo Light Base Map).
- Leerzustand mit Grundriss-Zeichnung + Suchabo-Link (realer Zustand heute, nicht nur Theorie —
  `DECISIONS.md` §2).
- Detailseite: Galerie/Lightbox, Fakten-Definitionsliste, Preisbox (Desktop sticky), Lage (Karte oder
  nur ungefährer Kreis bei verborgener Adresse), Dokumente, Teilen, Druck-Stylesheet (Exposé), JSON-LD
  `RealEstateListing`, eigenes OG-Bild.
- swisstopo-Geokodierung als Payload-Hook bei Adressänderung.
- **Netzwerk-Hosts bei Bedarf freigeben:** `vectortiles.geo.admin.ch`, `api3.geo.admin.ch`.
- **Checkpoint 5 + Screenshots** (Liste, Filter aktiv, Detail, Leerzustand).

### Phase 6 — Formulare, E-Mails, Suchabo, Cron

- Server Actions + Zod (Client/Server geteilt) für alle sechs Formulare (Briefing §9).
- Honeypot + Turnstile (lazy) + Upstash Rate-Limit (In-Memory-Fallback in Dev).
- Client-Uploads direkt zu Vercel Blob (Token-Route), Client-seitige Bildverkleinerung (max. 2560 px),
  serverseitige Magic-Bytes-Prüfung, zufällige Pfade, private Blobs.
- React-Email-Vorlagen im Nora-Stil, Referenznummern-Generator (z. B. SM-2026-7F3K).
- Suchabo: Double-Opt-in, Abmeldelink, Benachrichtigung bei passenden neuen Objekten
  (`alertsSentAt`-Idempotenz).
- Vercel-Cron (`CRON_SECRET`): Lösch-Jobs für alte Anfragen/Anhänge und unbestätigte Suchabos.
- **Netzwerk-Hosts bei Bedarf freigeben:** Resend-, Turnstile-, Upstash-Endpunkte (sofern nicht über
  SDK/Proxy automatisch erlaubt — mit `get_environment` prüfen, bevor Hosts angefragt werden).
- **Checkpoint 6** (E2E mit gemockter E-Mail im Vitest/Playwright-Lauf, kein echter Versand nötig für
  den Checkpoint selbst).

### Phase 7 — SEO, Englisch, OG-Bilder, Weiterleitungen

- Metadata API pro Seite aus CMS-SEO-Feldern, Canonicals, `hreflang` (de-CH/en).
- JSON-LD `RealEstateAgent`, `Service` je Leistung, `BreadcrumbList`, `FAQPage`.
- `sitemap.ts`, `robots.ts`, `next/og`-Bilder im Nora-Stil, `/llms.txt`.
- next-intl: Englisch unter `/en`, alle Payload-Felder lokalisiert (Fallback de), als "zu prüfen"
  markiert, bis fachlich gegengelesen.
- 301-Redirects: `/rechtliche-hinweise` → `/impressum`, alle weiteren Wix-Sitemap-URLs (aus
  `reference/original-site/pages-sitemap.xml`) sinnvoll umgeleitet, im CMS pflegbar.
- **Checkpoint 7.**

### Phase 8 — Qualitätssicherung

- Vitest: Preis-/Zahlenformatierung, Filterlogik, Suchabo-Matching, Referenznummern,
  Öffnungszeiten-"jetzt geöffnet"-Logik.
- Playwright E2E: Navigation, Sprachwechsel, Objektfilter inkl. URL, Detailseite, alle Formulare
  (E-Mail gemockt), Suchabo Opt-in/Abmeldung, 404, Weiterleitungen, private API ohne Login gesperrt.
  `--trace off` im Normalfall.
- axe auf allen Seitentypen, Lighthouse CI (mobil) gegen Production-Build gegen die Ziele aus
  Briefing §3 (Performance/A11y/BP/SEO ≥95/100/100/100, LCP ≤2,0s, CLS ≤0,05, INP ≤200ms).
- Vollständiger Screenshot-Review aller Seiten (390/768/1440), inkl. 360-px-Wort-Umbruch-Test,
  Fokuszustände, Leer-/Fehlerzustände.
- Bekannte Grenzen in `DECISIONS.md` ergänzen.
- **Checkpoint 8.**

### Phase 9 — Deploy & Dokumentation

- Vercel-Deploy im **Demo-Modus** (`NEXT_PUBLIC_DEMO_MODE=true`): Banner, `noindex` dreifach (Meta +
  Header + robots.txt), kein Google-Token, alle Mails an `DEMO_RECIPIENT`, Turnstile-Testschlüssel,
  Beispielobjekte mit Badge, neutraler Projektname (`nora-konzept`).
- Übergabe-Dokumente: `README.md`, `.env.example`, `GO_LIVE.md`, `ADMIN_ANLEITUNG.md`,
  `IMAGE_CREDITS.md` (sobald/falls lizenzfreie Zusatzbilder verwendet wurden).
- Link an dich zur Weitergabe an die Nora Immobilien AG.
- **Checkpoint 9 — Definition of Done aus Briefing §17 wird durchgegangen.**

---

## Offene technische Klärungen vor Phase 2

Keine Blocker — werden beim Setup selbst entschieden und in `DECISIONS.md` nachgetragen:
Next.js-/Payload-Versionspinning, exakte Tailwind-v4-Konfiguration, Struktur des Monorepos vs.
Single-App (aktuell: Single-App, Payload im selben Next.js-Projekt wie im Briefing vorgegeben).

## Netzwerk-Hosts

Für Phase 0 bereits freigegeben: `www.nora-immobilien.ch`, `static.wixstatic.com`. Weitere Hosts
(Neon, Vercel Blob, Resend, Cloudflare Turnstile, Upstash, swisstopo) werden phasenweise bei
konkretem Bedarf angefragt, nicht im Voraus pauschal.
