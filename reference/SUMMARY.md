# Phase 0 — Bestandsaufnahme: Zusammenfassung

Stand: automatisch erstellt bei der Archivierung der alten Website (Wix) am 2026-11-08.

## 1. Sitemap

`https://www.nora-immobilien.ch/sitemap.xml` ist ein Sitemap-Index und verweist nur auf
`https://www.nora-immobilien.ch/pages-sitemap.xml` (gespeichert unter `original-site/sitemap.xml`
und `original-site/pages-sitemap.xml`). Die Pages-Sitemap listet genau 6 URLs — **`/rechtliche-hinweise`
ist NICHT in der Sitemap enthalten** (nur im Footer verlinkt), wurde aber trotzdem wie im Briefing
gefordert direkt abgerufen.

`robots.txt` (`original-site/robots.txt`): Standard-Wix-robots.txt, nichts Ungewöhnliches.
`Disallow: *?lightbox=`, blockt PetalBot, Crawl-delay für dotbot/AhrefsBot. Keine zusätzlichen
Sitemaps oder Hinweise auf weitere Unterseiten.

## 2. Abgerufene Seiten

| Seite | URL | HTML | Markdown |
|---|---|---|---|
| Startseite | `/` | `original-site/home.html` (469 KB) | `content/home.md` |
| Bewirtschaftung | `/bewirtschaftung` | `original-site/bewirtschaftung.html` | `content/bewirtschaftung.md` |
| Stockwerkeigentum | `/stockwerkeigentum` | `original-site/stockwerkeigentum.html` | `content/stockwerkeigentum.md` |
| Erstvermietung | `/erstvermietung` | `original-site/erstvermietung.html` | `content/erstvermietung.md` |
| Verkauf | `/verkauf` | `original-site/verkauf.html` | `content/verkauf.md` |
| Objekte | `/objekte` | `original-site/objekte.html` | `content/objekte.md` |
| Rechtliche Hinweise | `/rechtliche-hinweise` | `original-site/rechtliche-hinweise.html` | `content/rechtliche-hinweise.md` |

Alle 7 Abrufe: HTTP 200, keine Fehlschläge. Extraktion erfolgte mit einem eigenen BeautifulSoup-Skript
(`extract.py`), das Wix' serverseitig gerendertes HTML (Headings, Paragraphen, Listen, Bild-Alt-Texte,
Links, Buttons, iframes) in Lesereihenfolge nach Markdown bringt.

## 3. Bilder (`reference/assets/`)

| Datei | Quelle (Original, `/v1/` entfernt) | Pixelmasse | Dateigrösse |
|---|---|---|---|
| `logo.png` | `3e3900_ad6ec22587224ecd8c8a62116a365101~mv2.png` | **73 x 138** | 12 KB |
| `favicon.png` | `3e3900_de60c59c7144409abf653e19f74c265f~mv2.png` | 15 x 30 (Ausschnitt des Logos) | 4 KB |
| `team-karin-gentinetta.jpg` | `3e3900_31e310cfe2394e66ad4eccdc8e3d2d2e~mv2.jpg` | 3840 x 2560 | 1.4 MB |
| `team-alexander-sauter.jpg` | `3e3900_e6cca71d2d304e83995fab8bf1b98f40~mv2.jpg` | 3840 x 2560 | 1.6 MB |
| `logo-svit.png` | `3e3900_cc82eeed2dc247339feec7349fd497e4~mv2.png` | 600 x 314 | 60 KB |
| `logo-fiabci.png` | `3e3900_3715fcd871304445bc4d3ce012472974~mv2.png` | 409 x 254 | 68 KB |
| `bg-start.png` | `3e3900_d5f97efb06fd4341b577302227eb5317~mv2.png` | 2740 x 1711 | 4.5 MB |
| `bg-objekte.png` | `3e3900_1566c4e9e7a04508b5cc32990ce88567~mv2.png` | 3000 x 1614 | 6.8 MB |
| `bg-kontakt.jpg` | `3e3900_92ae6e8d2b37403490e00ca67c619fff~mv2.jpg` | 3000 x 1450 | 1.2 MB |
| `img-home-dienstleistungen.jpg` | `3e3900_ea2a16fb249a409d80f1259a9bd69919~mv2.jpg` | 1638 x 801 | 212 KB |
| `bg-bewirtschaftung.jpg` (zusaetzlich gefunden) | `3e3900_8dc0e77bf1704ef1957d93924f05a918~mv2...` | 2356 x 1571 | 688 KB |
| `bg-erstvermietung.jpg` (zusaetzlich gefunden) | `3e3900_0f8e9b26fd8a444183ad6dd7ddf6b7f7~mv2...` | 2356 x 1571 | 972 KB |
| `bg-stockwerkeigentum.jpeg` (zusaetzlich gefunden) | `3e3900_351fbfa5efa9420080f63a4e90c2beb8~mv2.jpeg` | 940 x 623 | 124 KB |
| `bg-verkauf.jpg` (zusaetzlich gefunden) | `3e3900_505f82f549ec4fde895404bd36355f4f~mv2...` | 2541 x 1456 | 972 KB |

**4 zusaetzliche Bilder gefunden**, die im Briefing nicht aufgefuehrt waren: je ein individuelles
Hintergrundbild pro Leistungsseite (`bg-bewirtschaftung`, `bg-stockwerkeigentum`, `bg-erstvermietung`,
`bg-verkauf`) — die alte Seite verwendet also NICHT ein einziges generisches "Hintergrund
Dienstleistungen"-Bild fuer alle vier Unterseiten, sondern vier verschiedene. Das im Briefing gelistete
Bild `ea2a16fb...` (`img-home-dienstleistungen.jpg`) wird tatsaechlich nur klein auf der Startseite im
Dienstleistungs-Teaser verwendet, nicht als Seiten-Hintergrund.

Alle Hintergrundbilder (`bg-start`, `bg-objekte`, `bg-kontakt`, die vier `bg-<leistung>`) sind generische
Wix-Stock-/Architekturfotos. Da das neue Designkonzept (Abschnitt 5 des Briefings) Gebaeude grundsaetzlich
als Zeichnung statt Foto zeigt, werden diese Hintergrundbilder im neuen Konzept voraussichtlich **nicht
weiterverwendet** — das ist eine Entscheidung fuer `DECISIONS.md`, nicht hier vorweggenommen.

Teamfotos: professionelle, hochaufloesende Studioportraets (3840x2560), direkt nutzbar.

## 4. Logo-Analyse

- **Masse:** 73 x 138 px, Seitenverhaeltnis 1 : 1,89 — bestaetigt die Briefing-Annahme (~1:1,9).
- **Sehr niedrige Original-Aufloesung.** Es gibt keine hoeher aufgeloeste Version auf der Seite (alle
  Wix-Renditions bis maximal w_70/h_130 verwendet — die Originaldatei selbst ist bereits die Grenze).
  Fuer ein scharfes Logo im neuen Auftritt reicht das nicht.
- **Bildinhalt:** kein Schriftzug, sondern ein einfaches, flaches Haus-Piktogramm — ein Baukoerper mit
  Fensterraster in Grau und einem dreieckigen Satteldach in Rot. Der Schriftzug "Nora Immobilien AG"
  ist auf der alten Seite separates HTML, nicht Teil der Bilddatei.
- **Farben (Pixelanalyse, opake Pixel):** zwei flache Grundfarben plus Kanten-Antialiasing, keine
  Verlaeufe, keine Fotografie:
  - Rot (Dach): **#E92624** (dominant)
  - Grau (Baukoerper): **#B4B4B6** (dominant)
- **Kontrast-Check:** Weisser Text auf #E92624 ergibt nur **4.40 : 1** — knapp unter dem von WCAG AA
  fuer normalen Text geforderten 4.5 : 1. Eine minimale Abdunkelung (Lightness -2%) auf **#E81D1B**
  erreicht 4.54 : 1 und besteht den Test, bei praktisch identischer Anmutung.
- **SVG-Empfehlung:** klar ja. Das Motiv ist eine einfache, zweifarbige geometrische Form ohne Verlauf
  oder Fotografie — ideal zum Nachzeichnen als SVG, und passt inhaltlich exakt zum Gestaltungsprinzip
  "Zeichnung statt Foto" (Abschnitt 5): das Logo ist bereits ein reduziertes Architektur-Piktogramm.
  Trotzdem beim Kunden die Vektordatei anfordern — die hier nachgezeichnete Version waere eine
  Rekonstruktion aus Pixelanalyse, kein Originaldokument.

**SVIT-Logo** (`logo-svit.png`, 600x314): zweifarbiges Giebel-Piktogramm + "svit"-Schriftzug in Blau
(~#0B5CA8), ebenfalls flach, aber als fremdes Verbandslogo nicht nachzeichnen — bestehende Rasterdatei
in ausreichender Aufloesung direkt verwenden.

**FIABCI-Logo** (`logo-fiabci.png`, 409x254): fotorealistische Globen mit Farbverlaeufen und
Kartendetails — klar als Rastergrafik zu belassen, Aufloesung fuer Footer-Groesse ausreichend, fuer sehr
grosse Darstellung ggf. beim Verband eine hoeher aufgeloeste Version anfragen.

## 5. /objekte — Embed-Check

**Kein Drittanbieter-Embed gefunden.** Die Seite enthaelt keine echten `<iframe>`-Elemente und keine
Einbindung eines Immobilienportals oder einer Verwaltungssoftware (kein homegate, ImmoScout24, newhome,
Flatfox, Casasoft o.ae.). Die einzigen "Widget"-Treffer im HTML sind Wix' eigene interne Plattform-Apps
(Formular-Widget fuer Kontaktformulare, "shoutout"-Feed) — Standard-Boilerplate, auf jeder Wix-Seite
vorhanden, nicht objektbezogen.

**Wichtiger Befund:** Die Seite hat de facto **keinen Inhalt** — ausser Navigation und Footer ist dort
nichts: kein Objekt, keine Liste, kein Platzhaltertext, kein Hinweis auf aktuelle Verfuegbarkeit. Die alte
Seite listet aktuell schlicht keine Objekte.

## 6. Offene Fragen aus dem Briefing — live geprueft

1. **Alexander Sauters Rolle/Titel:** nicht auf der Seite gefunden. Einziger Beleg ueberall:
   "Karin Gentinetta und Alexander Sauter mit ihrem Team sind jederzeit fuer Ihre Anliegen da." Keine
   Rollenbezeichnung fuer ihn. Bleibt [[TODO]].
2. **Karin Gentinettas Rolle/Titel laut Website:** ebenfalls nicht auf der Seite genannt — die im
   Briefing erwaehnte Zuordnung zur Geschaeftsfuehrung stammt ausschliesslich von graph.swiss
   (Handelsregister-Daten), nicht von der Website selbst. Auch sie bleibt [[TODO]].
3. **"Bautreuhand":** kommt nur in den <meta name="keywords">-Tags aller Seiten vor
   ("Bautreuhand, Bewirtschaftung, Erstvermietung, Immobilien, Verkauf, Vermietung, Verwaltung"),
   nirgends im sichtbaren Seitentext. Bestaetigt die Briefing-Vermutung — beim Kunden klaeren, ob das
   eine tatsaechlich angebotene Leistung ist oder nur ein altes SEO-Schlagwort.
4. **SVIT-Wortlaut:** bestaetigt exakt: "Schweizerischer Verband der Immobilien-Treuhaender" (alte
   Bezeichnung, wie im Briefing vermutet) — Footer jeder Seite.
5. **Leistungs-Claims — Wortlaut-Abgleich mit dem Briefing:**
   - Bewirtschaftung — Site: "Wir betreuen Ihre Immobilie als waere es unsere eigene." Kein Komma im
     Original (das Briefing hat selbst schon "Komma ergaenzt" vermerkt — Korrektur ist also bereits
     bekannt und beabsichtigt, nicht neu).
   - Stockwerkeigentum — Site: "Wir verwalten nicht nur, sondern wir kuemmern uns." Identisch.
   - Erstvermietung — Site: "Mit Rat und Tat, auch wenn's mal nicht alltaeglich ist." Achtung: Site
     nutzt geraden Apostroph ', Briefing zitiert mit typografischem ' — im neuen Auftritt durchgehend
     ' (U+2019) verwenden, das ist ohnehin Teil der Schweizer-Typografie-Vorgabe (Abschnitt 5).
   - Verkauf — Site: "Eigenheim oder Renditeliegenschaft." Identisch. (Dieser Satz steht so nicht
     direkt im Fliesstext von /verkauf, sondern nur in der Leistungs-Teaser-Zeile auf der Startseite;
     die Verkaufsseite selbst beginnt mit "VERKAUF VON LIEGENSCHAFTEN" und einem laengeren Absatz.)
6. **Oeffnungszeiten:** nirgends auf der Live-Site genannt — weder Startseite-Kontaktblock noch sonst
   irgendwo. Bestaetigt: die im Briefing genannten Zeiten stammen ausschliesslich vom Drittverzeichnis
   (zuri.net) und muessen beim Kunden verifiziert werden, bevor sie online gehen.
7. **/rechtliche-hinweise — wiederverwendbarer Inhalt:** Die Seite ist kein Schweizer Impressum,
   sondern Wix' generischer Disclaimer-Baustein ("Kein Angebot / Gewaehrleistungsausschluss") plus eine
   Datenschutz-Sektion, die explizit auf EU-DSGVO (Art. 15 ff. DSGVO) verweist, Google Analytics,
   Facebook Pixel und Bing Ads nennt und Social-Media-Plugins beschreibt. Das steht im Widerspruch zum
   neuen Konzept (revDSG, kein Cookie-Banner noetig, kein Tracking) — dieser Text ist nicht wiederverwendbar
   und muss komplett neu nach revDSG geschrieben werden. Einzig nutzbar: Firmenname + Adresse
   ("Nora Immobilien AG, Langstrasse 14, 8004 Zuerich, Schweiz") als Verantwortliche Stelle — keine UID,
   keine Handelsregisternummer, keine MWST-Nummer auf dieser Seite vorhanden.
8. **Weitere Fakten/Team/Leistungen, die im Briefing fehlen:** keine gefunden. Die Site nennt keine
   zusaetzlichen Teammitglieder, keine weiteren Leistungen ueber die vier bekannten hinaus, und (ausser dem
   Meta-Keyword) keine Bautreuhand-Beschreibung.

## 7. Abweichungen Briefing vs. Live-Site (Zusammenfassung)

- 4 zusaetzliche Hintergrundbilder (ein eigenes pro Leistungsseite) statt eines gemeinsamen.
- Logo-Originalaufloesung ist mit 73x138 px noch kleiner/niedriger als man anhand des Briefings vermuten
  wuerde — SVG-Nachzeichnung ist nicht nur "falls einfach", sondern klar die einzig sinnvolle Option fuer
  scharfe Darstellung.
- /objekte hat aktuell keinerlei Inhalt (nicht nur "evtl. ein Portal-Embed" — gar nichts).
- /rechtliche-hinweise ist Wix-Boilerplate mit EU-DSGVO/Google-Analytics-Bezug, nicht Schweizer Recht —
  fuer Impressum/Datenschutz komplett neu zu erarbeiten statt zu uebernehmen.
- Keine Rollenbezeichnung fuer Karin Gentinetta auf der Live-Site selbst, nur ueber Fremdquelle
  (graph.swiss) — beide Team-Rollen bleiben vollstaendig offen.

## 8. Fehlschlaege

Keine. Alle 7 Seitenabrufe und alle 14 Bilddownloads (9 aus dem Briefing + 4 zusaetzlich gefundene
Hintergrundbilder + 1 Favicon) waren beim ersten Versuch erfolgreich (HTTP 200, Dateityp verifiziert).
