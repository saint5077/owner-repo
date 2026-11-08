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
