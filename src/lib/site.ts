// Eine Quelle für Adresse, Absender und Kontaktdaten der Seite.

import { abschnittSichtbar } from '@/lib/abschnitte';

// Kanonische Adresse. Die Seite ist ein statischer Export und kennt ihre Adresse nicht von
// selbst; NEXT_PUBLIC_SITE_URL überschreibt sie (zum Beispiel für eine Vorschau-Domain).
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.smartamt.de';

export const SITE_NAME = 'SmartAmt';

export const SITE_TITLE = 'SmartAmt – Sichere Websites für Gemeinden';

export const SITE_DESCRIPTION =
    'SmartAmt baut Websites für Gemeinden, Ämter und Behörden: sicher, barrierefrei und rechtskonform. Kostenlose Vorschau mit Ihren Inhalten, etwa zwei Wochen bis live, fester Jahresbetrag. Ein Projekt der NX7.AGENCY aus Leipzig.';

export const ABSENDER = {
    name: 'NX7.AGENCY',
    url: 'https://www.nx7.agency',
    zeile: 'Ein Projekt der NX7.AGENCY',
} as const;

/** Anschrift und Kontakt des Unternehmens (Impressum, Datenschutz, Formular-Adresse, strukturierte Daten). */
export const KONTAKT = {
    telefon: '0341 97853441',
    telefonHref: 'tel:+4934197853441',
    telefonInternational: '+49 341 97853441',
    email: 'mail@smartamt.de',
    strasse: 'Nikolaistraße 28–32',
    plz: '04109',
    ort: 'Leipzig',
} as const;

/**
 * Leon Pösken: erster Ansprechpartner auf der Seite (Hero, Kopfzeile, Fragen, Kontakt, Fuß).
 * Owner 26.10.2026: „Meine Firmennummer steht auch auf der neuen Smartamt-Seite und die E-Mail auch.“
 */
export const LEON = {
    name: 'Leon Pösken',
    telefon: '01556 6579408',
    telefonHref: 'tel:+4915566579408',
    telefonInternational: '+49 1556 6579408',
    email: 'leon@smartamt.de',
} as const;

/** Tobias Steffen: Technik, Angebot, Vertrag. Die Nummer ist die Nummer des Unternehmens (KONTAKT). */
export const TOBIAS = {
    name: 'Tobias Steffen',
    telefon: KONTAKT.telefon,
    telefonHref: KONTAKT.telefonHref,
} as const;

/** Alle Menüpunkte der Startseite in Reihenfolge; sichtbar sind nur die Abschnitte, die in lib/abschnitte.ts an sind. */
const MENUE_ALLE = [
    { label: 'Websites', id: 'websites' },
    { label: 'Angebot', id: 'angebot' },
    { label: 'Ablauf', id: 'ablauf' },
    { label: 'Schulungen', id: 'schulungen' },
    { label: 'Recht & Sicherheit', id: 'recht' },
    { label: 'Referenzen', id: 'referenzen' },
    { label: 'Über uns', id: 'ueber-uns' },
    { label: 'Kontakt', id: 'kontakt' },
] as const;

/** Hauptmenü v2: Websites · Angebot · Ablauf · Referenzen · Über uns · Kontakt. */
export const MENUE: readonly { label: string; id: string }[] = MENUE_ALLE.filter((m) => abschnittSichtbar(m.id));

export const RECHTSSEITEN = [
    { label: 'Impressum', href: '/impressum/' },
    { label: 'Datenschutz', href: '/datenschutz/' },
    { label: 'Barrierefreiheit', href: '/barrierefreiheit/' },
] as const;
