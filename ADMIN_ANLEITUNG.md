# Admin-Anleitung — Nora Immobilien AG Website

Kurzanleitung für das Nora-Team zur täglichen Pflege der Website über das Admin-Panel unter
`/admin`. Keine Vorkenntnisse nötig — das Panel führt Sie durch jedes Formular.

## Anmelden

Rufen Sie `https://[ihre-domain]/admin` auf und melden Sie sich mit Ihrem persönlichen Zugang an.
Jede Person im Team sollte einen eigenen Zugang haben (unter **Users** anzulegen) — keine
gemeinsamen Passwörter verwenden.

## Ein neues Objekt (Wohnung/Haus/Gewerbe) erfassen

1. Links im Menü **Properties** öffnen → **Create New**.
2. **Titel** eingeben (z. B. „4.5-Zimmer-Wohnung, Seefeld").
3. **Status** setzen: Entwurf (noch nicht sichtbar) / Verfügbar / Reserviert / Vermietet / Verkauft.
   Nur „Entwurf" ist auf der Website unsichtbar — alle anderen Status werden angezeigt, auch
   „Vermietet"/„Verkauft" (als Archiv), ausser Sie löschen das Objekt.
4. **Angebotsart** (Miete/Kauf) und **Objektart** (Wohnung, Attika, Büro, Parkplatz, …) wählen.
5. **Adresse**: Strasse, PLZ, Ort eintragen. Mit **„Adresse öffentlich anzeigen"** steuern Sie,
   ob die genaue Adresse (inkl. Karten-Pin) öffentlich sichtbar ist oder ob die Website nur den
   Kreis (Stadtteil) anzeigt — wichtig z. B. bei bewohnten Mietobjekten.
6. **Kreis** (Zürich-Stadtteil) für die Umkreissuche wählen.
7. Zimmer, Wohn-/Nutzfläche, Etage, Baujahr ausfüllen, soweit vorhanden.
8. Je nach Angebotsart: **Nettomiete** + Nebenkosten (Akonto/Pauschal) *oder* **Kaufpreis** —
   bzw. „Preis auf Anfrage" aktivieren, wenn kein Preis veröffentlicht werden soll.
9. **Merkmale** (Balkon, Lift, Haustiere erlaubt, Minergie, …) per Mehrfachauswahl ankreuzen.
10. **Beschreibung** und **Lage** im Rich-Text-Feld schreiben (Formatierung wie in Word möglich).
11. **Ansprechperson** aus dem Team zuweisen — diese Person erscheint auf der Objektseite.
12. Ganz unten: **Save**, dann **Publish**, wenn das Objekt live gehen soll (siehe nächster
    Abschnitt).

### Fotos hochladen (wichtig: Alt-Text nicht vergessen)

1. Im Objekt-Formular unter **Galerie** → **Upload** bzw. ein bestehendes Bild aus der Mediathek
   wählen.
2. Beim Hochladen eines neuen Bildes öffnet sich ein Zusatzformular mit dem Feld **„Alt"**
   (Alt-Text). Hier eine kurze, sachliche Beschreibung eintragen, z. B. „Wohnzimmer mit
   Parkettboden und Blick auf den See" — das ist nicht nur für Barrierefreiheit wichtig, sondern
   auch für die Google-Bildersuche.
3. Reihenfolge der Bilder in der Galerie per Drag & Drop anpassen — das erste Bild ist das
   Titelbild in der Objektliste.
4. **Grundrisse** und **Dokumente** (z. B. Exposé-PDF) funktionieren gleich, in den jeweils
   eigenen Feldern.

### Status setzen & veröffentlichen

- Ein Objekt ist erst öffentlich sichtbar, wenn es **Published** ist (nicht nur gespeichert) —
  oben rechts im Formular zu erkennen am Status-Umschalter.
- Ändern Sie z. B. von „Verfügbar" auf „Vermietet", sobald ein Mietvertrag unterschrieben ist —
  die Website zeigt das Objekt dann als vermietet statt es einfach verschwinden zu lassen.
- Ein Objekt komplett von der Website entfernen: Status auf „Entwurf" setzen oder das Objekt
  löschen (Papierkorb-Symbol in der Listenansicht).

### Bestehendes Objekt bearbeiten

**Properties** → gewünschtes Objekt in der Liste anklicken → Änderungen vornehmen → **Save**.
Änderungen sind sofort live, sobald gespeichert und der Status „Published" ist (es gibt keinen
separaten Freigabeschritt).

## Texte auf der Website ändern

Allgemeine Seiteninhalte (Startseite, Über uns, Bewirtschaftung, Impressum, Datenschutz) liegen
nicht unter Properties, sondern unter **Globals** im linken Menü:

- **Home** — Inhalte der Startseite
- **About** — Über-uns-Seite, Team wird separat unter **Team** gepflegt
- **Tenant Service** — Mieterservice-Seite (inkl. Notfall-Hinweistext)
- **Legal** — Impressum, Datenschutzerklärung
- **Site Settings** — Firmenangaben, Kontaktdaten, Öffnungszeiten, Social-Media-Links, die
  überall auf der Website (z. B. im Footer) erscheinen

Jeweils Feld anpassen → **Save**.

## Team-Mitglieder pflegen

**Team** → Person anklicken oder **Create New**. Name, Funktion, Foto, Kontaktdaten, Zuständigkeit
eintragen. Diese Einträge erscheinen auf der Über-uns-Seite und können Objekten als
Ansprechperson zugewiesen werden.

## Eingehende Anfragen bearbeiten

Alle über die Website eingereichten Formulare (Verwaltung anfragen, Ersteinschätzung, Schaden
melden, Besichtigung anfragen, allgemeine Anfrage) landen unter **Submissions**:

1. **Submissions** öffnen — neue Anfragen haben Status **„Neu"**.
2. Anfrage anklicken, um Details, Kontaktangaben und ggf. angehängte Fotos zu sehen. Jede
   Anfrage hat eine **Referenznummer** (z. B. für Rückfragen des Absenders).
3. Status auf **„In Bearbeitung"** setzen, sobald jemand sich darum kümmert, auf **„Erledigt"**,
   wenn abgeschlossen.
4. Bei Bedarf eine **zuständige Person** zuweisen und interne Notizen eintragen (nur im Admin
   sichtbar, nicht für den Absender).
5. Bei Schadenmeldungen mit aktiviertem Notfall-Flag: zeitnah prüfen, diese sind nicht
   automatisch priorisiert im System, nur inhaltlich markiert.

Eine Kopie jeder Anfrage wird zusätzlich automatisch per E-Mail an die hinterlegte
Empfängeradresse verschickt (siehe Site Settings) — die Admin-Ansicht ist aber die verlässliche
Übersicht, falls eine E-Mail verloren geht.

## Jobs (Stellenangebote)

**Jobs** → **Create New**: Titel, Pensum, Beschreibung, Status (aktiv/geschlossen). Nur aktive
Stellen erscheinen auf der Karriere-Seite.

## Blog/Aktuelles (Posts)

**Posts** → **Create New**: Titel, Rich-Text-Inhalt, Titelbild, Veröffentlichungsdatum. Status
„Published" erforderlich, damit der Beitrag öffentlich erscheint.

## Downloads (Formulare/Merkblätter zum Herunterladen)

**Downloads** → Datei hochladen, Titel und Kategorie vergeben. Erscheinen je nach Kategorie auf
der passenden Seite (z. B. Mieterservice).

## Häufige Fragen

**Warum sieht man mein neues Objekt nicht auf der Website?**
Prüfen Sie, ob der Status „Published" (nicht nur „Draft"/„Entwurf") ist und ob der
**Objektstatus** nicht „Entwurf" ist — beides muss passen.

**Wie ändere ich die genaue Adresse, möchte sie aber nicht öffentlich zeigen?**
Adresse wie gewohnt eintragen, aber den Schalter „Adresse öffentlich anzeigen" ausgeschaltet
lassen — die Website zeigt dann nur den Kreis/die Umgebung, keinen exakten Karten-Pin.

**Ich habe aus Versehen etwas falsch gespeichert — kann ich das zurücksetzen?**
Payload speichert Versionen automatisch; bei Bedarf kann ein früherer Stand im Admin unter
„Version History" des jeweiligen Eintrags wiederhergestellt werden.

Bei technischen Problemen, die diese Anleitung nicht löst, wenden Sie sich an Axion.
