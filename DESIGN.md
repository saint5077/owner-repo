# DESIGN.md — Nora Immobilien AG

Stand: Phase 1, nach Abschluss der Bestandsaufnahme (Phase 0). Dieses Dokument hält die
Gestaltungsentscheidungen fest, bevor gebaut wird — inklusive Begründung dort, wo das Briefing
eine Entscheidung verlangt statt sie vorzugeben. Vollständiges Rohmaterial: `reference/SUMMARY.md`.

## 1. Was Phase 0 am Design ändert

Die Bestandsaufnahme bestätigt das Briefing in den meisten Punkten, weicht aber an drei Stellen ab:

1. **Das Logo ist kleiner als angenommen** — 73×138 px ist nicht nur die im Web eingebundene Grösse,
   sondern die einzige je vorhandene. Jede weitere Nutzung ohne Nachzeichnung wäre unscharf. Die
   SVG-Rekonstruktion ist damit keine Option unter mehreren, sondern die einzig brauchbare.
2. **Das Logo ist bereits das, was das Designkonzept erst herstellen will**: ein reduziertes,
   zweifarbiges Architektur-Piktogramm (Baukörper + Satteldach), keine Fotografie, kein Schriftzug.
   "Zeichnung statt Foto" ist also keine erfundene Leitidee, sondern eine Weiterführung dessen, was
   die Firma mit ihrem Logo bereits sagt.
3. **Die alte Seite verwendet sieben verschiedene Stock-Architekturfotos** (Start, Objekte, Kontakt
   plus vier weitere, je eines pro Leistungsseite — das Briefing ging von einem gemeinsamen Bild aus).
   Entscheidung in Abschnitt 7.

## 2. Logo

**Befund:** flaches Zweifarben-Piktogramm — Baukörper mit Fensterraster in Grau (`#B4B4B6`), Satteldach
in Rot (`#E92624`). Kein Verlauf, keine Fotografie, kein Schriftzug (der Name steht separat als Text).

**Entscheidung: als SVG nachzeichnen.** Reine geometrische Form, ideal für einen sauberen Nachbau;
Original-Rasterdatei wird nie hochskaliert eingesetzt. Die Nachzeichnung übernimmt Silhouette,
Fensterraster und Dachform 1:1 aus der Pixelvorlage — **Form und Farben werden nicht neu interpretiert**,
wie vom Briefing verlangt (Abschnitt 2.4). Trotzdem fordern wir die Vektordatei beim Kunden an
(`CONTENT_TODO.md`); unsere Nachzeichnung ist eine Rekonstruktion, kein Original.

- Export: SVG als primäres Format (jede Grösse scharf); zusätzlich PNG @2x/@3x aus derselben SVG für
  Kontexte, die kein SVG annehmen (E-Mail-Header, OG-Bild-Komposition).
- **Favicon neu erzeugen** aus der SVG-Nachzeichnung (`favicon.svg`, `favicon.ico`, `apple-touch-icon.png`,
  PWA-Icons). Das alte `favicon.png` ist nur ein 15×30-px-Ausschnitt des Logos und für keinen Zweck
  brauchbar.
- **Kontrast-Hinweis:** `#E92624` mit weissem Text erreicht nur 4,40:1 (knapp unter WCAG-AA-4,5:1).
  Das Logo selbst bleibt unverändert (Farbe wird dort nie auf Text angewendet). Taucht Rot an anderer
  Stelle als Fläche mit weissem Text auf (z. B. ein Fehler- oder Dringend-Zustand), **`#E81D1B`**
  verwenden (4,54:1) statt des rohen Logo-Rots.

## 3. Markenfarbe vs. Aktionsfarbe — Entscheidung

Das Briefing verlangt: *"Hat das Logo eine klare Markenfarbe, ersetzt sie 'Fensterladen'."*

**Entscheidung: Nein, Rot ersetzt Fensterladen-Grün nicht.** Begründung: Das Rot kommt ausschliesslich
im 73×138-px-Piktogramm vor — nirgendwo sonst auf der alten Seite (keine farbigen Buttons, keine
farbigen Links, kein Rot im Fliesstext-Styling). Es liest sich als Standard-Dachfarbe eines generischen
Haus-Icons, nicht als bewusst gesetzte Unternehmensfarbe; es gibt keinen zweiten Beleg dafür, dass Nora
Rot als Identität versteht. Rot sitewide als Aktionsfarbe einzusetzen hiesse ausserdem, Buttons und
Linkfarbe optisch an eine Warn-/Fehlerfarbe anzunähern — das widerspricht der ruhigen, vertrauensvollen
Tonalität. **Fensterladen-Grün (`#2F5B45`)** bleibt Aktionsfarbe: es ist bewusst aus dem Zürcher-
Baumaterial-Konzept abgeleitet (Fensterläden an genau der Hausfassade, die den Hero trägt) und damit
näher an einer echten, neu etablierten Identität als ein zufälliges Icon-Rot. Rot bleibt exklusiv dem
Logo vorbehalten (plus dem oben genannten Fehlerzustands-Fallback `#E81D1B`).

## 4. Farbe (bestätigt aus Briefing)

| Name | Hex | Einsatz |
|---|---|---|
| Kalk | `#EEF0EA` | Seitenhintergrund |
| Tinte | `#1E2B24` | Text, Zeichnungen |
| Tinte hell | `#545B50` | Sekundärtext (≈6:1 auf Kalk) |
| Sandstein | `#9AA08E` | Linien, Rahmen, inaktive Zustände — nie Text |
| Fensterladen | `#2F5B45` | Buttons, aktive Filter, Hover, Fokusring |
| Fensterlicht | `#F2C46D` | nur beleuchtete Fenster im Hero |
| Weiss | `#FFFFFF` | Eingabefelder, Bildflächen |
| Logo-Rot (exklusiv Logo) | `#E92624` | nur im Logo selbst |
| Fehlerzustand (falls Rot als Fläche nötig) | `#E81D1B` | z. B. Formularfehler-Hintergrund, nie im Logo |

Kein Dark Mode (bewusste Entscheidung, wie im Briefing).

## 5. Typografie

Wie im Briefing spezifiziert: **Archivo** (variabel, `wght`/`wdth`, selbst gehostet über `next/font`) für
Headlines/Navigation/Buttons/Daten, schmal (`wdth` ≈ 75), Gewicht 560–620; **Literata** (variabel) für
Fliesstext, 18 px / 1,65, max. ≈68 Zeichen/Zeile. Skala 15/18/21/24/36/48/72, H1 bis ≈120 (Desktop),
44–56 (Mobil). `lang="de-CH"`, `hyphens: auto`, `&shy;` in Headline-Feldern. Tabellarische Zahlen für
Preise/Fakten. Guillemets, kein ß, `Intl.NumberFormat('de-CH')`, typografischer Apostroph `'` (U+2019) —
**wichtig:** die Original-Claims auf der alten Seite nutzen durchgehend den geraden Apostroph `'`
(z. B. "wenn's"); im neuen Auftritt konsequent auf `'` umstellen.

## 6. Raster/Layout

12-Spalten, max. 1440 px, Aussenabstand `clamp(20px, 5vw, 80px)`, Flattersatz, Asymmetrie (Text Spalten
1–7, Bild/Zeichnung rechts randabfallend). Abstände statt Trennlinien. Wie im Briefing spezifiziert.

## 7. Bildkonzept — Entscheidung zu den sieben Stock-Fotos

Die alte Seite verwendet sieben generische Architektur-Stockfotos als Seitenhintergründe
(`bg-start`, `bg-objekte`, `bg-kontakt`, plus je eines für die vier Leistungsseiten).

**Entscheidung: keines davon wird übernommen.** Sie widersprechen direkt der Leitidee "Zeichnung statt
Foto" (Abschnitt 5 des Briefings: Fotos zeigen nur Menschen und öffentlich inserierte Objekte, nie
Kundenliegenschaften-Architektur als generisches Stockfoto). Ersetzt durch die Linienzeichnungen aus dem
Zeichnungsmodul (Abschnitt 8).

**Übernommen werden:** die beiden Teamfotos (Karin Gentinetta, Alexander Sauter — 3840×2560,
hochwertige Studioporträts, direkt einsetzbar) sowie SVIT- und FIABCI-Logo (bestehende Rasterdateien,
ausreichende Auflösung für Footer-Grösse).

## 8. Zeichnungsmodul

Eigenes Modul `components/drawings/` mit wiederverwendbaren SVG-Primitiven (Wand, Fenster mit Rahmen
und Sims, Gesims, Dach, Lukarne, Tür, Schaufenster) — dieselbe Formensprache wie das nachgezeichnete
Logo (klare Linien, keine Schattierung), damit Logo und Zeichnungen wie aus einer Hand wirken. Einheitliche
Strichstärke 1,25 px bei 1×, `vector-effect: non-scaling-stroke`, `aria-hidden="true"`.

Benötigte Kompositionen (aus den Primitiven):

| Zeichnung | Verwendung |
|---|---|
| Zürcher Blockrand-Eckhaus, Gründerzeit | Hero (animiert, Fenster nach Tageszeit) |
| Mehrfamilienhaus-Ansicht | Bewirtschaftung |
| Schnitt mit Geschossen/Wohnungen | Stockwerkeigentum |
| Neubau mit Balkonen | Erstvermietung |
| Einfamilienhaus | Verkauf |
| Leerer Grundriss | Leerzustand Objekte (aktuell real, siehe `DECISIONS.md` §2) |
| Haus mit offener Tür | 404 |

Hero-Spezifikation wie im Briefing: Massstab ≈1:100, Erdgeschoss ≈4 m, Obergeschosse ≈3,2 m, Fenster
≈1,2×2,0 m; `stroke-dashoffset`-Selbstzeichnung ≈1,6 s beim ersten Laden (einzige automatische
Animation der Seite); Fensterlicht nach `Europe/Zurich`-Tageszeit, erst nach dem Mounten berechnet;
`prefers-reduced-motion` → fertige Zeichnung ohne Animation. Überzeugt der Entwurf nach zwei
Iterationen nicht handwerklich, Reduktion auf ein strenger gerastertes Motiv (lieber schlicht als
unbeholfen).

## 9. Bewegung

Automatisch nur der Hero-Moment. Interaktion als Auslöser erwünscht (Hover auf Leistungszeile, Filter-
Reflow, Akkordeons, Galerie, Formularschritte, Header ein-/ausblenden beim Scrollen). Nur `transform`/
`opacity`, 150–300 ms, `cubic-bezier(0.22, 1, 0.36, 1)`, respektiert `prefers-reduced-motion`.

## 10. Vermeiden — Selbstkontrolle pro UI-Phase

Grossbuchstaben-Labels, Eyebrow-Labels, farbig/kursiv hervorgehobene Wörter in Headlines,
01/02/03-Nummerierung ausser bei echten Abfolgen, identische Karten mit Radius/Schatten überall,
Verläufe als Dekoration, "→" hinter Links, Meta-Zeilen mit "·", Stockfotos von Händeschütteln/
Schlüsseln/Paaren/Skylines. Wird nach jeder UI-Phase anhand der Screenshots (390/768/1440 px) geprüft.

## 11. Inhaltliche Basis aus Phase 0

Drei der vier Leistungsseiten haben auf der alten Seite bereits echte, strukturierte Kundentexte —
diese werden wortgleich als Basis für "Was wir übernehmen" übernommen (Rechtschreibung/Typografie
korrigiert), nicht durch generische Branchentexte ersetzt:

- **Bewirtschaftung:** Vermietung; Abnahme und Übergabe von Mietobjekten; Laufender Unterhalt;
  Werterhaltung; Mietzinskontrolle; Zahlungsverkehr; Kreditoren- und Debitorenbuchhaltung; jährliche
  Bilanz und Erfolgsrechnung.
- **Erstvermietung:** Ermittlung des Mietzinses unter Berücksichtigung der Marktsituation und
  Vermietbarkeit; Schaltung und Koordination von Inseraten; Besichtigungstermine mit Mietinteressenten
  sowie Bonitätsprüfung; Ausarbeitung von Mietverträgen; Objektübergaben.
- **Verkauf:** Beratung über den Verkaufspreis; Erstellung von Verkaufsdokumentationen; Schaltung und
  Koordination von Inseraten; Vermittlung von Kauf-/Verkaufsinteressenten; Beratung und Ausarbeitung
  von Kaufverträgen; Erledigung sämtlicher Formalitäten.
- **Stockwerkeigentum:** die alte Seite liefert nur Fliesstext, keine Liste (Eigentümerversammlungen,
  Delegiertensitzungen, Interessenwahrung gegenüber General-/Bauunternehmungen und Handwerkern,
  Versicherungsfälle/Schadenregulierung, Unterhalt, Buchführung). Dieser Text wird als Einleitung
  übernommen; eine strukturierte Liste nach dem Muster der anderen drei Seiten wird als **markierter
  Entwurf** (`[[TODO: vom Kunden bestätigen]]`) ergänzt, nicht als gesicherter Fakt.

Alles, was über diese Basis hinausgeht (FAQ, Ablauf-Schritte, Notfall-Details, Mieterservice-Formulare,
Impressum/Datenschutz-Inhalte, Team-Rollen) bleibt klar als Entwurf markiert und landet in
`CONTENT_TODO.md`.

## 12. Weitere Entscheidungen

Vollständiger, laufend geführter Entscheidungs-Log: siehe `DECISIONS.md`.
