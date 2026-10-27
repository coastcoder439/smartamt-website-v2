'use client';

import { useRef } from 'react';
import { Accessibility, ArrowRightLeft, Cookie, Link2, Palette, Users, X, type LucideIcon } from 'lucide-react';
import { Label } from '@/components/ui/Label';
import { RevealHeading, RevealText } from '@/components/ui/Reveal';
import { useIsoLayoutEffect } from '@/hooks/useIsoLayoutEffect';
import { gsap, registerGsap } from '@/lib/gsap';
import WebsiteKnopf from './b2/WebsiteKnopf';
import { Staffel } from './b3/Staffel';
import { ABSCHNITT_WEISS, LABEL_GROSS } from './c2/abschnitt';
import { Licht } from './c2/Licht';

/**
 * Angebot (id angebot), der kurze Verkaufsteil der Website v2 (Entscheidung 6, bauauftrag-v2.md). Owner 26.10.2026:
 * „Der komplette Sales-Aspekt fehlt auch noch. Das müssen wir jetzt auf unserer Seite besser machen.“ und „so eine markanten
 * Bullet Points und sowas auf der Website, so ein One-Pager auf Sale zugelegt“.
 *
 * Aufbau (alles kurz, nichts doppelt):
 *  1. Label „Das Angebot“, Überschrift „Ihre neue Website ist fertig, bevor Sie Ja sagen.“
 *  2. Vier markante Punkte als weiße Karten: Vorschau mit Ihren eigenen Inhalten (kostenlos) · etwa zwei Wochen bis live ·
 *     fester Jahresbetrag, vorher bekannt · Technik, Updates und Hosting in Deutschland (inklusive). Jede Karte trägt einen
 *     grünen Haken, der sich beim Hineinscrollen zeichnet (wie in der Prüfliste).
 *  3. Knapper Vergleich in zwei Spalten: links „Übliches Projekt“ (gedämpft, graue Kreuze), rechts „SmartAmt“ (weiß, grüne
 *     Haken, orange Linie am oberen Rand). Vier Zeilen: Start, Dauer, Kosten, Danach. Am Desktop stehen die Zeilen beider
 *     Karten auf einer Linie (Subgrid), am Handy untereinander.
 *  4. Höchstens sechs kleine Merkmale (ohne Cookies, BITV 2.0, Redaktion, Wappenfarben, Inhalte ziehen um, alte Links
 *     funktionieren weiter). Hosting in Deutschland steht schon in Punkt 04 und darum nicht noch einmal hier.
 *  5. Schlusskarte „Preis auf Anfrage. Ihr Angebot kommt mit der Vorschau.“ mit dem Hauptknopf; davor zeichnet sich die
 *     orange Leitlinie mit Kopfpunkt (wie im Problem-Abschnitt) und dockt an der Kante der Karte an.
 *
 * Bewegung (GSAP, nur transform, opacity und stroke-dashoffset, Aufräumen mit matchMedia().revert()): Die Karten schweben
 * gestaffelt herein, die Haken zeichnen sich, im Vergleich fahren die Zeilen von beiden Seiten ein. Das Server-HTML ist
 * der Endzustand; die Startzustände setzt erst der Effekt. Ohne JavaScript und bei reduzierter Bewegung steht alles da.
 */

const PUNKTE: readonly { nr: string; titel: string; marke?: string }[] = [
    { nr: '01', titel: 'Vorschau mit Ihren eigenen Inhalten', marke: 'Kostenlos' },
    { nr: '02', titel: 'Etwa zwei Wochen bis live' },
    { nr: '03', titel: 'Fester Jahresbetrag, vorher bekannt' },
    { nr: '04', titel: 'Technik, Updates und Hosting in Deutschland', marke: 'Inklusive' },
];

const VERGLEICH: readonly { kopf: string; ueblich: string; smartamt: string }[] = [
    { kopf: 'Start', ueblich: 'Pflichtenheft und Angebote einholen', smartamt: 'Fertige Vorschau mit Ihren Inhalten' },
    { kopf: 'Dauer', ueblich: 'Mehrere Monate Umbau', smartamt: 'Etwa zwei Wochen bis live' },
    { kopf: 'Kosten', ueblich: 'Offen, mit Nachträgen', smartamt: 'Fester Jahresbetrag, vorher bekannt' },
    { kopf: 'Danach', ueblich: 'Wartung extra beauftragen', smartamt: 'Technik, Updates und Sicherheit inklusive' },
];

const MERKMALE: readonly { text: string; Icon: LucideIcon }[] = [
    { text: 'Ohne Cookies und Tracking', Icon: Cookie },
    { text: 'Barrierefrei nach BITV 2.0, mit eigener Erklärung', Icon: Accessibility },
    { text: 'Redaktion für das ganze Rathaus', Icon: Users },
    { text: 'In den Farben Ihres Wappens', Icon: Palette },
    { text: 'Ihre Inhalte ziehen mit um', Icon: ArrowRightLeft },
    { text: 'Alte Links funktionieren weiter', Icon: Link2 },
];

/** Grüner Haken im weichen Kreis (der Strich zeichnet sich, siehe Effekt). */
function Haken({ klasse }: { klasse: string }) {
    return (
        <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false" className={klasse}>
            <circle
                data-kreis
                cx="16"
                cy="16"
                r="15"
                strokeWidth="1"
                className="origin-center fill-ok-50 stroke-[color-mix(in_srgb,var(--ok)_28%,white)] [transform-box:fill-box]"
            />
            <path
                data-haken
                d="M9.5 16.5l4.5 4.5L22.5 11"
                pathLength={1}
                strokeDasharray="1 1"
                strokeDashoffset={0}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="fill-none stroke-ok"
            />
        </svg>
    );
}

export default function Angebot() {
    const wurzel = useRef<HTMLElement>(null);

    useIsoLayoutEffect(() => {
        const el = wurzel.current;
        if (!el) return;
        registerGsap();

        const punkteListe = el.querySelector<HTMLElement>('[data-punkte]');
        const vergleich = el.querySelector<HTMLElement>('[data-vergleich]');
        const linie = el.querySelector<HTMLElement>('[data-verbinder]');
        const fuell = el.querySelector<HTMLElement>('[data-verbinder-fuell]');
        const punkt = el.querySelector<HTMLElement>('[data-verbinder-punkt]');

        const mm = gsap.matchMedia();
        mm.add('(prefers-reduced-motion: no-preference)', () => {
            // 1. Die vier Punkte: Karten schweben gestaffelt herein, Kreise und Haken zeichnen sich
            if (punkteListe) {
                const karten = gsap.utils.toArray<HTMLElement>(punkteListe.querySelectorAll('[data-punkt]'));
                const kreise = gsap.utils.toArray<SVGElement>(punkteListe.querySelectorAll('[data-kreis]'));
                const haken = gsap.utils.toArray<SVGPathElement>(punkteListe.querySelectorAll('[data-haken]'));
                const zeit = gsap.timeline({
                    defaults: { ease: 'power3.out' },
                    scrollTrigger: { trigger: punkteListe, start: 'top 80%', once: true },
                });
                zeit.from(karten, { y: 36, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0);
                zeit.fromTo(kreise, { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, stagger: 0.12 }, 0.2);
                zeit.fromTo(haken, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.5, stagger: 0.12 }, 0.4);
            }

            // 2. Vergleich: links rückt das übliche Projekt gedämpft herein, rechts setzen sich die Zeilen von SmartAmt
            if (vergleich) {
                const links = gsap.utils.toArray<HTMLElement>(vergleich.querySelectorAll('[data-ueblich]'));
                const rechts = gsap.utils.toArray<HTMLElement>(vergleich.querySelectorAll('[data-smartamt]'));
                const kreise = gsap.utils.toArray<SVGElement>(vergleich.querySelectorAll('[data-kreis]'));
                const haken = gsap.utils.toArray<SVGPathElement>(vergleich.querySelectorAll('[data-haken]'));
                const obenLinie = vergleich.querySelector<HTMLElement>('[data-oben-linie]');
                const zeit = gsap.timeline({
                    defaults: { ease: 'power3.out' },
                    scrollTrigger: { trigger: vergleich, start: 'top 80%', once: true },
                });
                zeit.from(links, { x: -18, opacity: 0, duration: 0.7, stagger: 0.12, clearProps: 'transform,opacity' }, 0);
                zeit.from(rechts, { x: 18, opacity: 0, duration: 0.7, stagger: 0.12, clearProps: 'transform,opacity' }, 0.25);
                zeit.fromTo(kreise, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, stagger: 0.12 }, 0.45);
                zeit.fromTo(haken, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.45, stagger: 0.12 }, 0.6);
                if (obenLinie) zeit.fromTo(obenLinie, { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'expo.out' }, 0.2);
            }

            // 3. Leitlinie zur Schlusskarte: zeichnet sich mit dem Scroll, der Kopfpunkt läuft mit
            if (linie && fuell && punkt) {
                const spur = { start: 'top 92%', end: 'bottom 58%', scrub: 0.4 };
                gsap.fromTo(
                    fuell,
                    { scaleY: 0 },
                    { scaleY: 1, ease: 'none', immediateRender: true, scrollTrigger: { trigger: linie, ...spur } },
                );
                gsap.fromTo(
                    punkt,
                    { y: () => -linie.offsetHeight },
                    {
                        y: 0,
                        ease: 'none',
                        immediateRender: true,
                        scrollTrigger: { trigger: linie, ...spur, invalidateOnRefresh: true },
                    },
                );
            }
        });

        return () => mm.revert();
    }, []);

    return (
        <section ref={wurzel} id="angebot" aria-labelledby="angebot-titel" className={ABSCHNITT_WEISS}>
            <Licht seite="links" />
            <div className="wrap">
                <Label className={LABEL_GROSS}>Das Angebot</Label>
                <div className="grid-12 mt-4 items-end gap-y-6">
                    <div className="col-span-12 lg:col-span-8">
                        <RevealHeading as="h2" id="angebot-titel">
                            Ihre neue Website ist fertig, bevor Sie Ja sagen.
                        </RevealHeading>
                    </div>
                    <div className="col-span-12 lg:col-span-4 lg:pb-2">
                        <RevealText className="max-w-[28ch] text-lead text-ink-2">
                            Erst sehen, dann entscheiden. Die Vorschau ist kostenlos.
                        </RevealText>
                    </div>
                </div>

                {/* 1. Vier markante Punkte */}
                <ul
                    data-punkte
                    role="list"
                    className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-5"
                >
                    {PUNKTE.map((p) => (
                        <li
                            key={p.nr}
                            data-punkt
                            className="karte group/punkt flex flex-col rounded-[1.25rem] p-6 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-7"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <Haken klasse="size-9 flex-none" />
                                <span aria-hidden="true" className="font-mono text-[0.8125rem] tracking-[0.12em] text-ink-3">
                                    {p.nr}
                                </span>
                            </div>
                            <h3 className="mt-7 text-[clamp(1.375rem,1.15rem+0.8vw,1.75rem)] font-bold leading-[1.12] tracking-[-0.03em]">
                                {p.titel}
                            </h3>
                            {p.marke ? (
                                <p className="mt-auto pt-6">
                                    <span className="chip chip-ok">{p.marke}</span>
                                </p>
                            ) : null}
                        </li>
                    ))}
                </ul>

                {/* 2. Vergleich: Übliches Projekt gegen SmartAmt. Am Desktop teilen sich beide Karten fünf Zeilen (Subgrid). */}
                <div
                    data-vergleich
                    className="mt-16 grid gap-5 md:mt-20 md:grid-cols-2 md:grid-rows-[auto_repeat(4,auto)] md:gap-x-6 md:gap-y-0"
                >
                    <section
                        aria-labelledby="angebot-ueblich"
                        className="rounded-[1.25rem] border border-line bg-bg-2 p-6 sm:p-8 md:row-span-5 md:grid md:grid-rows-subgrid"
                    >
                        <h3
                            id="angebot-ueblich"
                            className="font-mono text-[0.8125rem] font-medium uppercase tracking-[0.14em] text-ink-3"
                        >
                            Übliches Projekt
                        </h3>
                        <dl className="contents">
                            {VERGLEICH.map((z) => (
                                <div
                                    key={z.kopf}
                                    data-ueblich
                                    className="mt-5 border-t border-line-2 pt-5 first:mt-6 md:mt-0 md:flex md:flex-col md:justify-center md:py-5"
                                >
                                    <dt className="font-mono text-[0.75rem] uppercase tracking-[0.12em] text-ink-3">{z.kopf}</dt>
                                    <dd className="mt-2 flex items-start gap-3 text-[1.0625rem] leading-snug text-ink-2">
                                        <X aria-hidden="true" size={18} strokeWidth={2} className="mt-[3px] flex-none text-ink-3" />
                                        <span>{z.ueblich}</span>
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </section>

                    <section
                        aria-labelledby="angebot-smartamt"
                        className="relative overflow-hidden rounded-[1.25rem] border border-line-2 bg-bg p-6 shadow-md sm:p-8 md:row-span-5 md:grid md:grid-rows-subgrid"
                    >
                        <span
                            aria-hidden="true"
                            data-oben-linie
                            className="pointer-events-none absolute inset-x-0 top-0 h-[3px] origin-left bg-brand"
                        />
                        <h3
                            id="angebot-smartamt"
                            className="font-mono text-[0.8125rem] font-medium uppercase tracking-[0.14em] text-brand-ink"
                        >
                            SmartAmt
                        </h3>
                        <dl className="contents">
                            {VERGLEICH.map((z) => (
                                <div
                                    key={z.kopf}
                                    data-smartamt
                                    className="mt-5 border-t border-line pt-5 first:mt-6 md:mt-0 md:flex md:flex-col md:justify-center md:py-5"
                                >
                                    <dt className="font-mono text-[0.75rem] uppercase tracking-[0.12em] text-ink-3">{z.kopf}</dt>
                                    <dd className="mt-2 flex items-start gap-3 text-[1.0625rem] font-semibold leading-snug text-ink">
                                        <Haken klasse="mt-[1px] size-[1.375rem] flex-none" />
                                        <span>{z.smartamt}</span>
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </section>
                </div>

                {/* 3. Kleine Merkmale (höchstens sechs) */}
                <Staffel
                    as="ul"
                    role="list"
                    kinder=":scope > li"
                    className="mt-10 grid gap-3 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3"
                >
                    {MERKMALE.map(({ text, Icon }) => (
                        <li key={text} className="flex items-center gap-3 rounded-2xl border border-line bg-bg px-4 py-3.5 shadow-sm">
                            <span
                                aria-hidden="true"
                                className="grid size-10 flex-none place-items-center rounded-xl bg-bg-2 text-ink"
                            >
                                <Icon size={20} strokeWidth={1.75} />
                            </span>
                            <span className="text-[0.9375rem] font-semibold leading-snug text-ink">{text}</span>
                        </li>
                    ))}
                </Staffel>

                {/* Leitlinie: führt zur Schlusskarte und dockt mit dem Punkt an ihrer Oberkante an */}
                <div
                    aria-hidden="true"
                    data-verbinder
                    className="relative z-10 mx-auto -mb-px mt-9 h-14 w-[2px] md:mt-12 md:h-20"
                >
                    <span className="absolute inset-0 rounded-full bg-line-2" />
                    <span data-verbinder-fuell className="absolute inset-0 origin-top rounded-full bg-brand" />
                    <span
                        data-verbinder-punkt
                        className="absolute left-1/2 top-full -ml-[0.25rem] -mt-[0.25rem] h-[0.5rem] w-[0.5rem] rounded-full bg-brand"
                        style={{ boxShadow: '0 0 0 4px var(--brand-100)' }}
                    />
                </div>

                {/* 4. Schlusskarte: Preis auf Anfrage, Hauptknopf */}
                <div className="karte relative isolate overflow-hidden rounded-[1.5rem] border-line-2 px-5 py-10 sm:px-10 md:px-14 md:py-14">
                    <div
                        aria-hidden="true"
                        className="dot-grid pointer-events-none absolute inset-y-0 right-0 -z-10 hidden w-1/2 opacity-70 [mask-image:radial-gradient(75%_95%_at_100%_0%,black,transparent)] sm:block"
                    />
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute left-6 top-0 h-[2px] w-16 rounded-full bg-brand sm:left-10 md:left-14"
                    />
                    <div className="grid-12 items-center gap-y-8">
                        <div className="col-span-12 lg:col-span-7">
                            <p className="text-[clamp(2.25rem,1.3rem+3.6vw,4.25rem)] font-bold leading-[1.02] tracking-[-0.045em] text-ink">
                                Preis auf Anfrage.
                            </p>
                            <p className="mt-3 max-w-[30ch] text-lead text-ink-2">Ihr Angebot kommt mit der Vorschau.</p>
                        </div>
                        <div className="col-span-12 lg:col-span-5 lg:border-l lg:border-line-2 lg:pl-12">
                            <WebsiteKnopf />
                            <p className="mt-4 text-klein text-ink-3">Kostenlos und unverbindlich. Antwort in 24 Stunden.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
