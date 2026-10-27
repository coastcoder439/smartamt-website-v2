// Gate Website v2 (Quelltext): Ausgeblendet heißt nicht gelöscht, und die sichtbare Seite hält die Owner-Vorgaben.
// Geprüft wird im Quelltext (kein Browser, kein Build nötig); das Ergebnis im gebauten Export prüft v2-ausgabe.mjs.
//
//  1. Schalter (src/lib/abschnitte.ts): Leistungen, Schulungen, Lage, Recht, Vision und die Einzelteile (Hero-Knopf
//     „KI-Fortbildung ansehen“, Ablaufschritt Schulung, Eremiya Rifat, Anliegen KI-Fortbildung und IT-Schulung, FAQ zu
//     Schulungen) stehen auf false; Angebot, Ablauf, Websites, Referenzen, Über uns, Fragen und Kontakt auf true.
//  2. Nichts gelöscht: die Komponenten, Bilder und Texte der ausgeblendeten Teile liegen weiter im Code; page.tsx bindet sie
//     über die Schalter ein (nicht entfernt).
//  3. Menü, Sprungleiste und Fuß kommen aus den Schaltern (kein fest verdrahteter Link auf einen ausgeblendeten Abschnitt).
//  4. Nie zweimal „sicher“ (Owner: „nicht zweimal sicher hintereinander“): „rechtssicher“ steht in keiner Datei der sichtbaren
//     Seite; das Band heißt „Sicher. Funktional. Rechtskonform.“.
//  5. Leon Pösken: Nummer 01556 6579408, E-Mail leon@smartamt.de, Foto vorhanden, steht an der Stelle von Eremiya Rifat.
//  6. Vorher/Nachher ohne Platzhalter: die gezeichneten Seiten tragen die Bausteine aus Entscheidung 5.
import { existiert, lies, quellen, fertig } from './_lib.mjs';

const fehler = [];

// ---- 1. Schalter -------------------------------------------------------------------------------
const schalter = lies('src/lib/abschnitte.ts');
const wert = (name) => {
  const m = schalter.match(new RegExp(`['"]?${name}['"]?\\s*:\\s*(true|false)`));
  return m ? m[1] : null;
};
for (const id of ['leistungen', 'schulungen', 'lage', 'recht', 'vision']) {
  if (wert(id) !== 'false') fehler.push(`abschnitte.ts: Abschnitt ${id} muss ausgeblendet sein (false), ist ${wert(id)}`);
}
for (const id of ['websites', 'angebot', 'ablauf', 'referenzen', 'ueber-uns', 'faq', 'kontakt']) {
  if (wert(id) !== 'true') fehler.push(`abschnitte.ts: Abschnitt ${id} muss sichtbar sein (true), ist ${wert(id)}`);
}
for (const name of ['heroKnopfSchulung', 'ablaufSchrittSchulung', 'teamEremiyaRifat', 'anliegenSchulung', 'anliegenItSchulung', 'faqSchulung', 'problemKarten', 'problemBandSatz', 'heroWebsiteCheck']) {
  if (wert(name) !== 'false') fehler.push(`abschnitte.ts: ${name} muss ausgeblendet sein (false), ist ${wert(name)}`);
}
if (!/Die kannst du ja alle quasi ausblenden, archivieren/.test(schalter)) fehler.push('abschnitte.ts: Owner-Zitat zum Ausblenden fehlt im Kommentar');

// ---- 2. Nichts gelöscht --------------------------------------------------------------------------
const AUSGEBLENDET = [
  'src/components/sections/Leistungen.tsx',
  'src/components/sections/Schulungen.tsx',
  'src/components/sections/Lage.tsx',
  'src/components/sections/Recht.tsx',
  'src/components/sections/Vision.tsx',
  'src/components/sections/c2/MiniBrowser.tsx',
  'src/components/sections/c2/kurs-schreibtisch.webp',
  'src/components/sections/b2/Rangliste.tsx',
  // ausgeblendet über Schalter in EINZELNES (Nachtrag 1: Problem-Abschnitt gekürzt, Hero-Karte beruhigt)
  'src/components/sections/c1/ProblemKarten.tsx',
  'src/components/sections/c1/MiniAnsichten.tsx',
  'src/components/sections/hero/WebsiteCheck.tsx',
  'src/components/sections/c3/Akkordeon.tsx',
  'public/images/team/eremiya-rifat.webp',
  'public/images/schulung/karte-arbeitsalltag.webp',
  'public/images/schulung/modul-grundlagen.png',
];
for (const rel of AUSGEBLENDET) if (!existiert(rel)) fehler.push(`${rel}: Datei fehlt (ausgeblendet heißt nicht gelöscht)`);

const seite = lies('src/app/page.tsx');
for (const [komponente, id] of [
  ['Leistungen', 'leistungen'],
  ['Schulungen', 'schulungen'],
  ['Lage', 'lage'],
  ['Recht', 'recht'],
  ['Vision', 'vision'],
]) {
  if (!new RegExp(`import ${komponente} from '@/components/sections/${komponente}'`).test(seite)) fehler.push(`page.tsx: ${komponente} nicht mehr eingebunden (nur ausblenden, nicht entfernen)`);
  if (!new RegExp(`ABSCHNITTE\\.${id}\\s*\\?\\s*<${komponente} />`).test(seite)) fehler.push(`page.tsx: ${komponente} hängt nicht am Schalter ABSCHNITTE.${id}`);
}
if (!/ABSCHNITTE\.angebot\s*\?\s*<Angebot \/>/.test(seite)) fehler.push('page.tsx: Angebot hängt nicht am Schalter ABSCHNITTE.angebot');

const personen = lies('src/components/sections/c3/personen.ts');
if (!/Eremiya Rifat/.test(personen) || !/eremiya-rifat\.webp/.test(personen)) fehler.push('personen.ts: Eremiya Rifat ist aus dem Code verschwunden (nur ausblenden)');

const ablauf = lies('src/components/sections/Ablauf.tsx');
if (!/titel: 'Schulung'/.test(ablauf)) fehler.push('Ablauf.tsx: der Schritt „Schulung“ ist aus dem Code verschwunden (nur ausblenden)');
const faq = lies('src/components/sections/Faq.tsx');
if (!/Was kostet die KI-Fortbildung\?/.test(faq)) fehler.push('Faq.tsx: die Fragen zu KI und Schulungen sind aus dem Code verschwunden (nur ausblenden)');
const anliegen = lies('src/components/sections/b3/anliegen.ts');
for (const text of ['KI-Fortbildung anfragen', 'IT-Schulung anfragen']) {
  if (!anliegen.includes(text)) fehler.push(`anliegen.ts: Anliegen „${text}“ ist aus dem Code verschwunden (nur ausblenden)`);
}

// ---- 3. Menü, Sprungleiste, Fuß aus den Schaltern --------------------------------------------------
const site = lies('src/lib/site.ts');
if (!/MENUE[^=]*=\s*MENUE_ALLE\.filter\(\(m\)\s*=>\s*abschnittSichtbar\(m\.id\)\)/.test(site)) fehler.push('site.ts: MENUE wird nicht aus den Schaltern gefiltert');
const sprung = lies('src/components/layout/leistungen.ts');
if (!/ALLE\.filter\(\(l\)\s*=>\s*abschnittSichtbar\(l\.id\)\)/.test(sprung)) fehler.push('leistungen.ts: die Sprungziele werden nicht aus den Schaltern gefiltert');
const menueIds = [...site.matchAll(/id:\s*'([^']+)'/g)].map((m) => m[1]);
for (const id of ['websites', 'angebot', 'ablauf', 'referenzen', 'ueber-uns', 'kontakt']) {
  if (!menueIds.includes(id)) fehler.push(`site.ts: Menüpunkt ${id} fehlt`);
}
const hero = lies('src/components/sections/Hero.tsx');
const kopf = lies('src/components/layout/Header.tsx');
const fuss = lies('src/components/layout/Footer.tsx');
for (const [name, text] of [['Hero.tsx', hero], ['Header.tsx', kopf], ['Footer.tsx', fuss]]) {
  for (const id of ['schulungen', 'recht', 'leistungen', 'lage', 'vision']) {
    if (new RegExp(`(href=["'\`]/#${id}|AnkerLink id=["']${id}|handleAnchorClick\\(e,\\s*'${id}')`).test(text) && !/EINZELNES\.heroKnopfSchulung/.test(text)) {
      fehler.push(`${name}: fest verdrahteter Link auf den ausgeblendeten Abschnitt ${id}`);
    }
  }
}
if (!/Kostenlose Vorschau anfragen/.test(hero)) fehler.push('Hero.tsx: Hauptknopf „Kostenlose Vorschau anfragen“ fehlt');
if (!/Websites für Gemeinden, Ämter und Behörden/.test(hero)) fehler.push('Hero.tsx: Label „Websites für Gemeinden, Ämter und Behörden“ fehlt');
if (!hero.replace(/\s+/g, ' ').includes('Wir machen Ihre Website sicher, barrierefrei und rechtskonform.')) fehler.push('Hero.tsx: Hero-Text „… Wir machen Ihre Website sicher, barrierefrei und rechtskonform.“ fehlt');
if (!/Vorschau anfragen/.test(kopf)) fehler.push('Header.tsx: Knopf „Vorschau anfragen“ fehlt');
const titel = site.match(/SITE_TITLE\s*=\s*'([^']*)'/)?.[1] ?? '';
const beschreibung = site.match(/SITE_DESCRIPTION\s*=\s*'([^']*)'/)?.[1] ?? '';
if (titel !== 'SmartAmt – Sichere Websites für Gemeinden') fehler.push(`site.ts: Seitentitel ist „${titel}“, erwartet „SmartAmt – Sichere Websites für Gemeinden“`);
if (!beschreibung || /\bKI\b|Schulung|Fortbildung|schult/.test(beschreibung)) fehler.push('site.ts: Beschreibung fehlt oder nennt KI oder Schulung');

// ---- 4. Nie zweimal „sicher“ ---------------------------------------------------------------------------
const SICHTBARE_AUSNAHMEN = new Set([
  // ausgeblendete Abschnitte (bleiben im Code, werden nicht angezeigt)
  'src/components/sections/Leistungen.tsx',
  'src/components/sections/Recht.tsx',
]);
for (const rel of quellen()) {
  if (SICHTBARE_AUSNAHMEN.has(rel)) continue;
  const text = lies(rel);
  if (/rechtssicher/i.test(text.replace(/Nie zweimal[^\n]*|nie „sicher“ und „rechtssicher“[^\n]*|statt „Rechtssicher“[^\n]*/g, ''))) {
    fehler.push(`${rel}: „rechtssicher“ steht in der sichtbaren Seite (Owner: nicht zweimal sicher hintereinander)`);
  }
}
const problem = lies('src/components/sections/Problem.tsx');
if (!/ABSCHLUSS_WOERTER = \['Sicher', 'Funktional', 'Rechtskonform'\]/.test(problem)) fehler.push("Problem.tsx: das Band muss 'Sicher', 'Funktional', 'Rechtskonform' heißen");
const pruef = lies('src/components/sections/b2/Pruefliste.tsx');
if (!/begriff: 'Rechtskonform'/.test(pruef)) fehler.push('Pruefliste.tsx: „Rechtssicher“ muss „Rechtskonform“ heißen');
const mini = lies('src/components/sections/c2/MiniBrowser.tsx');
if (!/\['Sicher', 'Barrierefrei', 'Rechtskonform'\]/.test(mini)) fehler.push('MiniBrowser.tsx: PUNKTE müssen Sicher, Barrierefrei, Rechtskonform heißen');

// ---- 5. Leon Pösken --------------------------------------------------------------------------------------
if (!/telefon:\s*'01556 6579408'/.test(site)) fehler.push('site.ts: Leons Nummer 01556 6579408 fehlt');
if (!/email:\s*'leon@smartamt\.de'/.test(site)) fehler.push('site.ts: Leons E-Mail leon@smartamt.de fehlt');
if (!/telefon:\s*'0341 97853441'/.test(site)) fehler.push('site.ts: Tobias’ Nummer 0341 97853441 fehlt');
if (!existiert('public/images/team/leon-poesken.webp')) fehler.push('public/images/team/leon-poesken.webp fehlt');
if (!/rolle: 'Gründer von SmartAmt'/.test(personen) || !/rolle: 'Entwickler'/.test(personen)) fehler.push('personen.ts: Rollen „Gründer von SmartAmt“ und „Entwickler“ fehlen');
if (/Ansprechpartner'|Technik, Angebot, Vertrag|Ruft Sie an/.test(personen)) fehler.push('personen.ts: alte Rollen oder Sätze („Ihr Ansprechpartner“, „Technik, Angebot, Vertrag“, „Ruft Sie an …“) stehen noch drin');
if (!/Kaufmann und NGO-Gründer aus Leipzig\. IT aus Überzeugung: bringt Verwaltung und Technik an einen Tisch\./.test(personen)) fehler.push('personen.ts: Leons Satz (Kaufmann und NGO-Gründer) fehlt');
if (!/Entwickler aus Leipzig\. Löst, woran andere scheitern: seit Jahren für Mittelstand und Verwaltung, mehr als 50 Digitalprojekte\./.test(personen)) fehler.push('personen.ts: Tobias Satz fehlt');
if (!/https:\/\/www\.tobiassteffen\.com\//.test(personen)) fehler.push('personen.ts: Link auf tobiassteffen.com fehlt');
if (/leonposken\.vercel\.app/.test(personen)) fehler.push('personen.ts: Link auf leonposken.vercel.app ist raus (Owner 27.10.2026)');
if (!/ANSPRECHPARTNER[^=]*=\s*\[LEON_POESKEN,\s*TOBIAS_STEFFEN\]/.test(personen)) fehler.push('personen.ts: im Kontakt muss Leon der erste Ansprechpartner sein');

// ---- 6. Vorher/Nachher ohne Platzhalter ------------------------------------------------------------------------
const seiten = lies('src/components/sections/b2/MusterbachSeiten.tsx').replace(/\s+/g, ' ');
for (const text of [
  'Offizielle Homepage der Gemeinde',
  '+++ Herzlich Willkommen auf der Homepage der Gemeinde Musterbach +++',
  'Startseite',
  'Bürgerservice',
  'Aktuelle Mitteilungen',
  'Besucher: 0048213',
  'Google Maps lädt sofort',
  'optimiert für 1024×768',
  'Vollsperrung der Bachstraße ab Montag',
  'Wonach suchen Sie?',
  'Rathaus anrufen',
  'Willkommen im Rathaus: kurze Wege, alles Wichtige auf einer Seite.',
  'Abfallkalender',
  'Rathaus & Öffnungszeiten',
  'Rathaus',
  'Service',
  'Aktuelles',
  'Leben',
]) {
  if (!seiten.includes(text)) fehler.push(`MusterbachSeiten.tsx: „${text}“ fehlt`);
}
if (!/<svg viewBox="0 0 1000 212"/.test(seiten) || !/Kirchturm|Kirche/.test(seiten)) fehler.push('MusterbachSeiten.tsx: die gezeichnete Silhouette (Haus, Kirchturm, Bäume) fehlt');
if (/Platzhalter|vStreifen|vBanner/.test(lies('src/components/sections/b2/Vergleich.module.css') + seiten)) fehler.push('Vergleich: Reste des alten Platzhalters');

fertig('ABSCHNITTE-STATISCH', fehler);
