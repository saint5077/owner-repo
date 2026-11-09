# Nora Immobilien AG — Website & Backend

Konzept-Vorschau für die Nora Immobilien AG (Zürich), gebaut für Axion. Next.js 16 (App Router) mit
Payload CMS 3 im selben Projekt, Postgres-Backend, in Demo-Modus auf Vercel deploybar und ohne Neubau
auf echten Go-live umstellbar (siehe [`GO_LIVE.md`](./GO_LIVE.md)).

**Lies zuerst, bevor du am Code arbeitest:** [`DESIGN.md`](./DESIGN.md) (Gestaltungsentscheidungen),
[`DECISIONS.md`](./DECISIONS.md) (laufender Entscheidungs-Log, jede Phase), [`CONTENT_TODO.md`](./CONTENT_TODO.md)
(offene Fragen an den Kunden), [`UMSETZUNGSPLAN.md`](./UMSETZUNGSPLAN.md) (Phasenplan).

## Tech-Stack

Next.js 16 (App Router, TypeScript strict) · Payload CMS 3 (Postgres-Adapter, Lexical) · Tailwind CSS v4
· Postgres (Neon in Produktion, lokaler Postgres in der Entwicklung — siehe `DECISIONS.md` #12) ·
React Hook Form + Zod · Resend + React Email · Cloudflare Turnstile · Upstash Ratelimit (In-Memory-Fallback
in der Entwicklung) · MapLibre GL + swisstopo · next-intl (Deutsch ohne Präfix, Englisch unter `/en`,
aktuell nur Startseite + Bewirtschaftung, siehe `DECISIONS.md` #50) · Vitest, Playwright, axe-core,
Lighthouse CI.

## Lokale Entwicklung

Voraussetzungen: Node ≥22.23.4, pnpm, ein lokaler PostgreSQL-16-Server.

```bash
createuser nora
createdb nora_dev -O nora
cp .env.example .env.local
```

Trage in `.env.local` mindestens `DATABASE_URL` (lokaler Postgres), `PAYLOAD_SECRET` (beliebiger
Zufallsstring), `SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD` ein. Alles andere kann für die lokale
Entwicklung leer bleiben — siehe die Kommentare in `.env.example` für Details zu jeder Variable.

```bash
pnpm install
pnpm seed          # füllt Team, Leistungen, Beispielobjekte, siteSettings, Rechtstext-Entwürfe
pnpm dev           # http://localhost:3000, Admin unter /admin
```

## Checkpoint (vor jedem Commit/jeder Phase)

```bash
pnpm typecheck && pnpm lint && pnpm build
```

Für Formulare/Zugriffskontrolle zusätzlich:

```bash
pnpm verify:access-control   # beweist: submissions/searchAlerts/users ohne Login nicht erreichbar
pnpm test                    # Vitest (test:int) + Playwright (test:e2e)
```

## Projektstruktur

```
src/
  app/(frontend)/      öffentliche Next.js-Seiten (App Router)
  app/(payload)/       Payload-Admin + API-Routen
  app/en/              englische Seiten (nur Startseite + Bewirtschaftung, siehe DECISIONS.md #50)
  collections/         Payload-Collections (properties, services, team, submissions, …)
  globals/             Payload-Globals (siteSettings, home, about, tenantService, legal)
  components/          UI-Komponenten, inkl. components/drawings/ (Zeichnungsmodul)
  lib/                 Formular-Logik, E-Mail, Geokodierung, SEO-Helfer, Suchabo-Matching
reference/             Archiv der alten Website (Phase 0), nicht Teil der Laufzeit-App
scripts/               Seed- und Verify-Skripte
```

## Demo- vs. Produktionsmodus

`NEXT_PUBLIC_DEMO_MODE=true` (Vorschau-Link für den Kunden): Banner, dreifaches `noindex`, alle E-Mails
gehen nur an `DEMO_RECIPIENT`, Turnstile-Testschlüssel, Beispielobjekte mit Badge. `false`: alles
umgekehrt — siehe Briefing-Abschnitt 13 und [`GO_LIVE.md`](./GO_LIVE.md) für den vollständigen Umstieg.
