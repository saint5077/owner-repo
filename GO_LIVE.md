# Go-Live-Checkliste — Nora Immobilien AG

Diese Liste begleitet den Umstieg vom Demo-Link auf die echte, produktive Website unter der
Domain der Nora Immobilien AG. Reihenfolge beachten — einige Schritte dürfen den E-Mail-Betrieb
nicht unterbrechen.

## 1. Vorbereitung (vor jeder DNS-Änderung)

- [ ] Klären, wo die Domain aktuell registriert ist (vermutlich bei Wix, da die bestehende Seite
      dort läuft). Zugang zum Registrar/DNS-Interface sicherstellen.
- [ ] Prüfen, welche **MX-, SPF- und DKIM-Einträge** aktuell für die Domain bestehen (bestehender
      Mailbetrieb, z. B. Wix-Mail oder Drittanbieter). **Diese Einträge nicht anfassen** — nur
      die Einträge ändern, die auf die Website zeigen (A-Record bzw. CNAME für `www`).
- [ ] Neon-Projekt (Produktions-Datenbank) und Vercel-Projekt existieren und sind erreichbar.
- [ ] Alle in `.env.example` dokumentierten Produktions-Zugangsdaten vorhanden:
      Neon-`DATABASE_URL`, `PAYLOAD_SECRET` (frisch generiert, nicht der Demo-Wert), Vercel-Blob-
      Token, Resend-API-Key, Cloudflare-Turnstile-Produktionsschlüssel (nicht die Test-Keys),
      Upstash-Redis-URL/Token, `CRON_SECRET`.

## 2. Konten, die für den Produktivbetrieb nötig sind

| Dienst | Zweck | Status |
|---|---|---|
| Vercel | Hosting, Cron-Jobs, Blob-Storage | [[TODO: Konto auf Nora Immobilien AG oder Axion?]] |
| Neon | Produktions-Postgres (Frankfurt) | vorhanden (Demo-Projekt) |
| Vercel Blob | Bilder/Dokumente-Storage | an Vercel-Projekt gekoppelt |
| Resend | Transaktionale E-Mails (Formulare, Suchabo) | [[TODO: Konto anlegen, Domain verifizieren]] |
| Cloudflare Turnstile | Spam-Schutz Formulare | [[TODO: Produktionsschlüssel für echte Domain erzeugen]] |
| Upstash | Rate-Limiting (Redis) | [[TODO: Konto anlegen]] |

## 3. Resend-Domain verifizieren (E-Mail-Versand)

- [ ] Absenderdomain (z. B. `noreply@nora-immobilien.ch`) bei Resend hinzufügen.
- [ ] Die von Resend angezeigten SPF-/DKIM-/DMARC-Einträge **zusätzlich zu** den bestehenden
      E-Mail-Einträgen ins DNS eintragen (Resend-Einträge ergänzen bestehende SPF-Einträge über
      Mechanismen wie `include:`, sie ersetzen sie nicht — im Zweifel mit dem aktuellen
      E-Mail-Anbieter/Registrar-Support abstimmen).
- [ ] Test-Mail über die Produktionsumgebung verschicken und Zustellung prüfen (Spam-Ordner
      kontrollieren).

## 4. Produktionsumgebung auf Vercel konfigurieren

- [ ] Alle Environment-Variablen aus Schritt 1 in den Vercel-Projekteinstellungen (Production)
      setzen.
- [ ] `NEXT_PUBLIC_DEMO_MODE=false` setzen.
- [ ] `NEXT_PUBLIC_SITE_URL` auf die echte Domain setzen (z. B. `https://nora-immobilien.ch`).
- [ ] `DEMO_RECIPIENT` entfernen bzw. nicht mehr verwenden — Formulare senden dann an die in
      `siteSettings` gepflegten echten Empfängeradressen.
- [ ] Beispielobjekte (Seed-Daten, mit Demo-Badge gekennzeichnet) aus der `properties`-Collection
      im Admin löschen, bevor die Seite live geht.
- [ ] Alle offenen Punkte aus `CONTENT_TODO.md` auflösen — insbesondere die für das Impressum
      **rechtlich erforderlichen** Angaben (UID/Handelsregisternummer, genaue Firmenadresse,
      verantwortliche Person), ohne die die Seite nicht veröffentlicht werden darf.

## 5. DNS umstellen

- [ ] A-Record bzw. CNAME für `@`/`www` auf Vercel umstellen (Werte aus den Vercel-
      Domain-Einstellungen für das Projekt übernehmen).
- [ ] MX-, SPF- (Haupteintrag), DKIM- und DMARC-Einträge für den bestehenden Mailbetrieb
      **unverändert lassen** (nur um die Resend-Einträge aus Schritt 3 ergänzen).
- [ ] Nach Propagation (bis 24–48 h): `https://nora-immobilien.ch` liefert die neue Seite, alte
      Wix-URLs leiten korrekt weiter (siehe `next.config.ts` Redirects, z. B.
      `/rechtliche-hinweise` → `/impressum`) oder liefern mindestens ein sauberes 404.

## 6. Suchmaschinen & Google-Profile

- [ ] Domain in der Google Search Console verifizieren, `sitemap.xml` einreichen.
- [ ] Bing Webmaster Tools analog (optional).
- [ ] Google-Unternehmensprofil (Google Business Profile) der Nora Immobilien AG auf die neue
      URL umstellen.
- [ ] `GOOGLE_SITE_VERIFICATION`-Variable mit dem echten Verifizierungscode setzen.

## 7. Admin-Zugänge für das Nora-Team

- [ ] Für jede Person im Team einen eigenen Payload-Admin-Zugang anlegen (`/admin` →
      Benutzer) — **nicht** die Seed-/Demo-Zugangsdaten produktiv weiterverwenden.
- [ ] Rollen/Rechte pro Person prüfen (siehe `ADMIN_ANLEITUNG.md` für die Bedienung).
- [ ] Demo-Admin-Zugang nach Übergabe deaktivieren oder Passwort ändern.

## 8. Datensicherung

- [ ] Neon-Backup-/Point-in-Time-Recovery-Einstellungen für das Produktionsprojekt prüfen
      (Standard-Retention ausreichend? Bei Bedarf Plan anpassen).
- [ ] Einmal manuell einen Connection-String-Zugriff testen, um zu bestätigen, dass im Ernstfall
      ein Restore möglich ist.

## 9. Letzter Schritt: Wix-Abo kündigen

- [ ] **Erst kündigen, wenn alles oben bestätigt läuft** (DNS propagiert, E-Mails kommen an,
      Formulare funktionieren, Suchmaschinen sehen die neue Seite) — die Wix-Domain/das
      Wix-Abo ist bis dahin das Sicherheitsnetz.
- [ ] Nach erfolgreicher Umstellung: Wix-Hosting-Abo kündigen (Domain ggf. getrennt behandeln,
      falls sie bei Wix registriert bleibt statt transferiert zu werden).

## 10. Abschlusskontrolle

- [ ] `pnpm typecheck && pnpm lint && pnpm build` auf dem Stand, der live geht, grün.
- [ ] Alle 6 Formulare auf der echten Domain einmal real durchgeklickt (nicht nur im Demo-Modus).
- [ ] Mobil (Lighthouse/Playwright-Suite) gegen die Produktions-URL laufen lassen.
- [ ] Impressum/Datenschutz-Texte von der Geschäftsführung der Nora Immobilien AG freigegeben.
