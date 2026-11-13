# Patenschaften – Hilfe bei Briefen von der Schule

Website des Elternbeirats der Grundschule an der Steinlach und der Ludwig-Krapf-Schule, Tübingen.
Sprachen: Deutsch, Arabisch, Türkisch, Ungarisch, Englisch, Russisch, Griechisch, Somali, Dari.

---

## Teil 1: Vor dem Veröffentlichen (10 Minuten)

**1. E-Mail-Adresse eintragen**
Öffnen Sie die Datei `texte.js` (mit einem einfachen Texteditor, z. B. „Editor“ unter Windows oder „TextEdit“ am Mac).
Ganz oben steht:

```
email: "bitte-eintragen@example.de"
```

Ersetzen Sie die Adresse durch die echte, z. B. `email: "paten.elternbeirat@gmx.de"`. Anführungszeichen stehen lassen.

**2. Impressum und Datenschutz ausfüllen**
In `impressum.html` und `datenschutz.html` stehen Platzhalter in eckigen Klammern, z. B. `[Vor- und Nachname]`.
Ersetzen Sie diese (inklusive der Klammern). Die Datenschutzerklärung ist eine Vorlage. Bitte lassen Sie sie prüfen, z. B. durch die Schulleitung oder den Datenschutzbeauftragten des Schulträgers.

**3. Schullogo (optional)**
Speichern Sie das Logo als `logo.png` in diesen Ordner, direkt neben `index.html`. Es erscheint dann automatisch oben. Ohne Datei bleibt die Stelle einfach leer.

---

## Teil 2: Mit GitHub Pages veröffentlichen

1. **Konto anlegen:** Auf <https://github.com> auf „Sign up“ klicken und ein kostenloses Konto erstellen.
   Tipp: Der Benutzername erscheint später in der Adresse, z. B. `elternbeirat-steinlach`.
2. **Neues Repository erstellen:** Oben rechts auf **„+“** → **„New repository“**.
   - Repository name: z. B. `paten`
   - **Public** auswählen (GitHub Pages ist im kostenlosen Konto nur für öffentliche Repositories möglich)
   - Unten auf **„Create repository“** klicken.
3. **Dateien hochladen:** Auf der neuen Seite auf den Link **„uploading an existing file“** klicken.
   Entpacken Sie die ZIP-Datei auf Ihrem Computer und ziehen Sie **den Inhalt** des Ordners (nicht den Ordner selbst) in das Browserfenster:
   `index.html`, `style.css`, `app.js`, `texte.js`, `impressum.html`, `datenschutz.html`, `README.md` sowie die Ordner `fonts` und `audio`.
   Dann unten auf **„Commit changes“** klicken.
4. **Pages einschalten:** Im Repository oben auf **„Settings“** → links **„Pages“**.
   Unter „Build and deployment“ → „Source“: **„Deploy from a branch“**.
   Branch: **„main“**, Ordner: **„/ (root)“** → **„Save“**.
5. **Warten (1–3 Minuten)** und die Seite neu laden. Oben erscheint:
   „Your site is live at `https://BENUTZERNAME.github.io/paten/`“. Fertig!

### Später etwas ändern
Im Repository auf die Datei klicken (z. B. `texte.js`) → Stift-Symbol (✏️) → ändern → **„Commit changes“**.
Nach 1–2 Minuten ist die Änderung online.

---

## Teil 3: Gut zu wissen

**Direkte Links pro Sprache:** Jede Sprache hat ihren eigenen Link. Den können Lehrkräfte z. B. in einen Elternbrief schreiben oder als QR-Code ausdrucken:

| Sprache | Adresse anhängen |
|---|---|
| Deutsch | `…/paten/#de` |
| Arabisch | `…/paten/#ar` |
| Türkisch | `…/paten/#tr` |
| Ungarisch | `…/paten/#hu` |
| Englisch | `…/paten/#en` |
| Russisch | `…/paten/#ru` |
| Griechisch | `…/paten/#el` |
| Somali | `…/paten/#so` |
| Dari | `…/paten/#fa-AF` |

**Texte korrigieren (für die Gegenleser):** Alle Texte stehen in `texte.js`, jede Sprache in einem eigenen Block. Nur den Text zwischen den Anführungszeichen ändern.

**Vorlesefunktion:** Die Seite nutzt die Vorlese-Stimme des Handys. Für Somali und oft auch für Dari haben viele Handys keine Stimme. Dann erscheint ein freundlicher Hinweis.
Besser: Jemand liest den Text vor und nimmt ihn als MP3 auf. Die Datei kommt in den Ordner `audio` (siehe `audio/LIESMICH.txt`). Dann spielt die Seite automatisch die Aufnahme ab.

**Foto von Ihrer Ansprechperson:** Sobald ein Foto da ist, kann ich es gern einbauen.

**Datenschutz:** Die Seite setzt keine Cookies, nutzt keine Statistik-Dienste und lädt keine Schriften von Google. Alles liegt auf GitHub.
