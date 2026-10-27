// Schalter: Was die Seite zeigt und was ausgeblendet ist (Website v2).
//
// Owner 26.10.2026: „wir haben uns darauf geeinigt, dass wir das auf jeden Fall mit den KI-Fortbildungen und so erstmal
// rausnehmen, weil wir aktuell keinen haben, der diese KI-Fortbildung machen kann.“ und „Ich will aber nicht, dass du quasi
// diese ganzen anderen Sachen einfach löscht, ne? Die kannst du ja alle quasi ausblenden, archivieren, ne? Weil die ganzen
// anderen Dinger, die du gebaut hast, sind prinzipiell auch teilweise geil. Aber ein bisschen zu viel.“
//
// Darum steht hier jeder ausgeblendete Teil als Schalter auf `false`. Komponenten, Texte, Bilder und Daten der
// ausgeblendeten Teile bleiben unverändert im Code; ein Schalter auf `true` zeigt den Teil wieder, Menü, Sprungleisten und
// Fuß folgen automatisch. Nichts davon ist gelöscht.

/** Abschnitte der Startseite (Anker-Kennung der Seite). */
export type AbschnittId =
    | 'websites'
    | 'angebot'
    | 'ablauf'
    | 'referenzen'
    | 'ueber-uns'
    | 'faq'
    | 'kontakt'
    | 'leistungen'
    | 'schulungen'
    | 'lage'
    | 'recht'
    | 'vision';

export const ABSCHNITTE: Readonly<Record<AbschnittId, boolean>> = {
    // sichtbar in v2
    websites: true,
    angebot: true,
    ablauf: true,
    referenzen: true,
    'ueber-uns': true,
    faq: true,
    kontakt: true,
    // ausgeblendet in v2 (nicht gelöscht)
    leistungen: false, // Kacheln „Was wir für Ihre Gemeinde tun“ (Websites, KI-Fortbildung, IT-Schulungen, Recht)
    schulungen: false, // KI-Fortbildung mit Preis und Modulen, IT-Schulungen
    lage: false, // Lage der Gemeinden (UN-Ranking)
    recht: false, // Recht und Sicherheit (Akkordeon)
    vision: false, // Missionstext
};

/** Ist der Abschnitt mit dieser Anker-Kennung sichtbar? Unbekannte Kennungen gelten als sichtbar. */
export function abschnittSichtbar(id: string): boolean {
    return id in ABSCHNITTE ? ABSCHNITTE[id as AbschnittId] : true;
}

/** Einzelne Teile innerhalb sichtbarer Abschnitte. `false` = ausgeblendet, der Code bleibt. */
export const EINZELNES = {
    /** Hero-Knopf „KI-Fortbildung ansehen“. */
    heroKnopfSchulung: false,
    /** Schritt „Schulung“ im Ablauf. */
    ablaufSchrittSchulung: false,
    /** Team-Mitglied Eremiya Rifat (Schulungsleiter). */
    teamEremiyaRifat: false,
    /** Kontakt-Anliegen „KI-Fortbildung anfragen“. */
    anliegenSchulung: false,
    /** Kontakt-Anliegen „IT-Schulung anfragen“. */
    anliegenItSchulung: false,
    /** FAQ-Fragen zu KI und Schulungen. */
    faqSchulung: false,
    /** Beraterkarte im Erstgespräch-Band (Tobias und Leon stehen schon im Team und in den direkten Wegen). */
    kontaktBeraterkarte: false,
    /** Zeile „Kennenlerntermin buchen“ in den direkten Wegen (derselbe Link wie der Knopf „Erstgespräch buchen“). */
    kontaktKennenlernZeile: false,
    /** Hinweis „Alle Preise zzgl. 19 % MwSt.“ im Fuß (v2 nennt keine Preise, die stehen bei den Schulungen). */
    fussPreiseMwSt: false,
    /**
     * Problem-Abschnitt „Was Ihre Gemeinde hinter sich lässt“: die drei großen Karten mit Mini-Ansichten (Technik,
     * Barrierefreiheit, Recht), die Einleitung, der Hinweis „Beispielansichten“ und die Leitlinie zum Band. Owner
     * 26.10.2026: „das ist viel zu komplex dargestellt, viel zu komplex, viel zu viel Text, viel zu viele Sachen“. Übrig
     * bleiben Überschrift, drei einzeilige Aussagen und das Band. Code: sections/c1/ProblemKarten.tsx.
     */
    problemKarten: false,
    /** Satz „So sieht der digitale Ortseingang aus …“ neben dem Knopf im Band „Sicher. Funktional. Rechtskonform.“. */
    problemBandSatz: false,
    /**
     * Hero: die alte Karte „Website-Check“ (hero/WebsiteCheck.tsx) mit Browser-Leiste und Adresse www.musterbach.de, den
     * schwebenden Hinweiskästchen („Art. 32 DSGVO“, „Barrierefreiheit WCAG 2.1 AA“), Strichen und der Prüfliste mit Ring
     * „5 von 5 erfüllt“. Owner 26.10.2026: „den Header bei uns, also da, ne, dieses, dieses Ding mit www.musterbach.de, das ist
     * komplett überfordernd“ und „diese Dinger noch abgehen, das packen wir alles schön wie bei Tobi gebündelt unter diese
     * vorher nacher schieber“. An ihrer Stelle zeigt der Hero die fertige Beispielgemeinde als ruhige Karte
     * (hero/HeroMusterbach.tsx); die Prüfpunkte stehen in der Befund-Liste unter dem Vorher/Nachher.
     */
    heroWebsiteCheck: false,
    /**
     * Websites: die Befund-Tabelle unter dem Vorher/Nachher (b2/Befunde.tsx, sechs Zeilen mit Zähler, die erst beim Weiterscrollen
     * hinter dem Schieber vorbeizog). Owner 26.10.2026: „Die Befunde, das ist falsch, das ist nicht so wie bei Tobi … Das ist mit
     * dem Scroll verbunden, aber kein Mensch, es kann gar keiner sehen, weil es in der nächsten Sektion sitzt.“ An ihrer Stelle
     * stehen die sechs Karten im selben angehefteten Bild wie der Wisch (b2/Vergleich.tsx, b2/BefundKarten.tsx).
     */
    befundTabelle: false,
    /**
     * Farbwahl: kleiner Schalter unten links (Palette-Symbol), der die Markenfarbe der ganzen Seite umschaltet
     * (?farbe=orange | hellblau | violett | gruen in der Adresse). Für Tobi und zum Vergleichen; vor dem echten
     * Livegang auf false. Bei false steht weder der Schalter noch das Skript im Kopf im HTML; die Seite bleibt Orange.
     */
    farbwahl: true,
} satisfies Record<string, boolean>;
