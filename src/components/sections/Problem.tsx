'use client';

import { useRef } from 'react';
import { Accessibility, Scale, ServerCrash } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Magnet } from '@/components/ui/Magnet';
import { RevealHeading } from '@/components/ui/Reveal';
import ProblemKarten from '@/components/sections/c1/ProblemKarten';
import { PROBLEM_AUSSAGEN } from '@/components/sections/c1/problem-daten';
import styles from '@/components/sections/c1/Problem.module.css';
import { useIsoLayoutEffect } from '@/hooks/useIsoLayoutEffect';
import { EINZELNES } from '@/lib/abschnitte';
import { gsap, registerGsap, ScrollTrigger } from '@/lib/gsap';
import { waehleAnliegen } from '@/lib/kontakt';
import { handleAnchorClick } from '@/lib/scroll';

/**
 * Problem (id ortsausgang, der Anker bleibt): „Was Ihre Gemeinde hinter sich lässt.“ Website v2, Nachtrag 1 (N7), Owner:
 * „das ist viel zu komplex dargestellt, viel zu komplex, viel zu viel Text, viel zu viele Sachen“. Darum bleibt nur:
 *
 *  1. die Überschrift,
 *  2. höchstens drei kurze Aussagen (c1/problem-daten.ts, je höchstens zehn Wörter) als drei Karten nebeneinander: Symbol im
 *     Bernstein-Feld für „offen“ (derselbe Zustand wie bei den Befunden unter dem Vorher/Nachher), darunter der Kern in Tinte
 *     und der Rest gedämpft,
 *  3. darunter mittig das Band „Sicher. Funktional. Rechtskonform.“ mit drei grünen Haken, die sich zeichnen, und dem Knopf
 *     „Kostenlose Vorschau anfragen“ (setzt das Anliegen „Website“, im Formular „Vorschau anfragen“). Bernstein = offen,
 *     Grün = erfüllt: Die Seite erzählt dasselbe Bild wie die Befund-Liste.
 *
 * Ausgeblendet, nicht gelöscht (Owner: „Die kannst du ja alle quasi ausblenden, archivieren“): die drei großen Karten mit
 * Mini-Ansichten samt Einleitung, Hinweis und Leitlinie (c1/ProblemKarten.tsx, Schalter `problemKarten`) und der Satz neben
 * dem Knopf (Schalter `problemBandSatz`), beide in lib/abschnitte.ts. Keine Schilder, keine Durchstreich-Diagonalen, kein Rot.
 *
 * Flächen (c1/Problem.module.css): leicht gewärmtes Hellgrau, weicher Übergang vom weißen Kunden-Abschnitt, leises
 * Punktraster hinter der Überschrift. Das Band trägt keine Farbfläche, nur eine kurze Linie in der Markenfarbe mittig am
 * oberen Rand (die Marke bleibt Akzent). Der ganze Abschnitt steht mittig in einer Spalte von höchstens 66 rem (Owner 27.10.2026).
 *
 * Bewegung (GSAP, nur transform und opacity, Aufräumen mit matchMedia().revert()): Die Aussagen fahren gestaffelt herein
 * (y 24 → 0); im Band fahren die Wörter aus ihrer Maske, die Haken zeichnen sich, der Knopf folgt. Das Server-HTML ist der
 * Endzustand: ohne JavaScript und bei reduzierter Bewegung steht sofort alles da, jeder Text ist lesbar. Die Startzustände
 * setzt erst der Effekt.
 */

// Owner 26.10.2026: „Ich habe gesagt, nicht zweimal sicher hintereinander“. Darum „Rechtskonform“ statt „Rechtssicher“.
const ABSCHLUSS_WOERTER = ['Sicher', 'Funktional', 'Rechtskonform'] as const;

// Symbol je Aussage (nur Schmuck, aria-hidden): alte Technik, Barrierefreiheit, Recht.
const SYMBOLE = { technik: ServerCrash, barriere: Accessibility, recht: Scale } as const;

export default function Problem() {
    const wurzel = useRef<HTMLElement>(null);

    const zumKontakt = (e: React.MouseEvent<HTMLAnchorElement>) => {
        waehleAnliegen('website');
        handleAnchorClick(e, 'kontakt');
    };

    useIsoLayoutEffect(() => {
        const el = wurzel.current;
        if (!el) return;
        registerGsap();

        const aussagen = gsap.utils.toArray<HTMLElement>(el.querySelectorAll('[data-aussage]'));
        const liste = el.querySelector<HTMLElement>('[data-aussagen]');
        const band = el.querySelector<HTMLElement>('[data-abschluss]');

        const mm = gsap.matchMedia();
        mm.add('(prefers-reduced-motion: no-preference)', () => {
            const ausloeser: ScrollTrigger[] = [];

            // Aussagen: gestaffelt hereinfahren (der Bernstein-Punkt fährt mit)
            if (liste && aussagen.length) {
                gsap.set(aussagen, { y: 24, opacity: 0 });
                const tl = gsap.timeline({ paused: true });
                tl.to(aussagen, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.14, clearProps: 'transform,opacity' }, 0);
                ausloeser.push(ScrollTrigger.create({ trigger: liste, start: 'top 82%', once: true, onEnter: () => tl.play() }));
            }

            // Band: Wörter fahren aus ihrer Maske, die Haken zeichnen sich, Knopf (und Satz) folgen
            if (band) {
                const woerter = gsap.utils.toArray<HTMLElement>(band.querySelectorAll('[data-wort]'));
                const kreise = gsap.utils.toArray<HTMLElement>(band.querySelectorAll('[data-kreis]'));
                const haken = gsap.utils.toArray<SVGPathElement>(band.querySelectorAll('[data-haken]'));
                const rest = gsap.utils.toArray<HTMLElement>(band.querySelectorAll('[data-rest]'));

                gsap.set(woerter, { yPercent: 108 });
                gsap.set(kreise, { scale: 0.5, opacity: 0 });
                gsap.set(haken, { strokeDashoffset: 1 });
                gsap.set(rest, { opacity: 0, y: 18 });

                const tl = gsap.timeline({ paused: true });
                tl.to(woerter, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.14 }, 0)
                    .to(kreise, { scale: 1, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.14 }, 0.15)
                    .to(haken, { strokeDashoffset: 0, duration: 0.55, ease: 'power2.out', stagger: 0.14 }, 0.45)
                    .to(rest, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12, clearProps: 'transform,opacity' }, 0.7);
                ausloeser.push(ScrollTrigger.create({ trigger: band, start: 'top 82%', once: true, onEnter: () => tl.play() }));
            }

            return () => {
                for (const a of ausloeser) a.kill();
            };
        });

        return () => mm.revert();
    }, []);

    return (
        <section
            ref={wurzel}
            id="ortsausgang"
            aria-labelledby="ortsausgang-titel"
            className={`${styles.flaeche} section relative isolate overflow-hidden pt-16 md:pt-20 lg:pt-24`}
        >
            {/* Flächen: leises Punktraster hinter der Überschrift, weicher Übergang aus dem weißen Kunden-Abschnitt */}
            <div aria-hidden="true" className={`dot-grid ${styles.raster}`} />
            <div aria-hidden="true" className={styles.uebergang} />

            {/* Mittig und schmal (Owner 26.10.2026: „Wenn unten mal eine Sache mittig ist, ne, so wie dieses hier, was ihre Gemeinde
                hinter sich lässt …“; 27.10.2026: „Was ihre Gemeinde hinter sich lässt, dieses linksbündige … genau das meine ich“):
                Der Abschnitt folgt nicht der Breitbild-Breite (--box), sondern bleibt eine Spalte von höchstens 66 rem in der Mitte. */}
            <div className="wrap relative" style={{ maxWidth: 'min(var(--box), calc(66rem + 2 * var(--gutter)))' }}>
                <div className="flex flex-col items-center text-center">
                    {/* „Ortsausgang“ war nicht gemeint: Der Owner (26.10.2026: „amt ortsrand muss raus“) meinte den Eintrag „Amt Ortrand“ im Laufband der Kunden (c1/kunden-logos.ts). Die Beschriftung steht wieder wie vor dem Missverständnis. */}
                    <Label>Ortsausgang</Label>
                    <RevealHeading as="h2" id="ortsausgang-titel" className="mt-4 max-w-[18ch] text-balance">
                        Was Ihre Gemeinde hinter sich lässt.
                    </RevealHeading>
                </div>

                {EINZELNES.problemKarten ? (
                    <ProblemKarten />
                ) : (
                    // Drei Karten eng nebeneinander: oben das Symbol im Bernstein-Feld (offen) und die Nummer, darunter der Kern in
                    // Tinte (Platz für zwei Zeilen, damit die Restzeilen auf einer Linie stehen) und direkt darunter der Rest gedämpft.
                    // Das Auge liest jede Karte von oben nach unten, nicht quer über die Seite.
                    <ul data-aussagen role="list" className="mt-10 grid gap-4 md:mt-14 md:grid-cols-3 md:gap-5">
                        {PROBLEM_AUSSAGEN.map((aussage, i) => {
                            const Symbol = SYMBOLE[aussage.id];
                            return (
                                <li key={aussage.id} data-aussage className="karte flex flex-col rounded-[20px] border-line-2 p-7 lg:p-9">
                                    <div className="flex items-center justify-between">
                                        <span aria-hidden="true" className="relative grid h-14 w-14 place-items-center rounded-2xl bg-warn-50 text-warn">
                                            <Symbol size={26} strokeWidth={1.75} />
                                            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-bg bg-warn-dot" />
                                        </span>
                                        <span aria-hidden="true" className="font-mono text-[0.75rem] tracking-[0.1em] text-ink-3">
                                            0{i + 1}
                                        </span>
                                    </div>
                                    <p className="mt-7 min-h-[2.4em] text-[clamp(1.375rem,1.1rem+0.8vw,1.75rem)] font-semibold leading-[1.2] tracking-[-0.02em] text-ink">
                                        {aussage.kern}
                                    </p>
                                    <p className="mt-2 text-[1.0625rem] leading-[1.45] text-ink-2">{aussage.rest}</p>
                                </li>
                            );
                        })}
                    </ul>
                )}

                {/* Band: das Fazit unter den Karten, mittig wie der ganze Abschnitt: die drei Wörter in einer Reihe, der Knopf darunter */}
                <div
                    data-abschluss
                    className="karte relative isolate mt-8 overflow-hidden rounded-[24px] border-line-2 px-6 py-10 text-center sm:px-10 md:mt-10 md:px-14 lg:py-12"
                >
                    {/* Ruhiger Schmuck statt Farbfläche: eine kurze Linie in der Markenfarbe mittig am oberen Kartenrand */}
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute left-1/2 top-0 h-[2px] w-16 -translate-x-1/2 rounded-full bg-brand"
                    />
                    <p className="flex flex-wrap items-center justify-center gap-x-[0.6em] gap-y-2 text-[clamp(1.75rem,0.9rem+1.9vw,2.625rem)] font-bold leading-[1.05] tracking-[-0.04em] text-ink">
                        {ABSCHLUSS_WOERTER.map((wort) => (
                            <span key={wort} className="flex items-center gap-[0.3em]">
                                <span data-kreis aria-hidden="true" className="inline-flex h-[0.7em] w-[0.7em] flex-none">
                                    <svg viewBox="0 0 40 40" className="h-full w-full" fill="none" aria-hidden="true">
                                        <circle cx="20" cy="20" r="19.25" fill="var(--ok-50)" stroke="var(--ok)" strokeOpacity="0.28" strokeWidth="1.5" />
                                        <path
                                            data-haken
                                            d="M11.5 20.5l6 6 11-13"
                                            stroke="var(--ok)"
                                            strokeWidth="3.2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            pathLength={1}
                                            strokeDasharray={1}
                                            strokeDashoffset={0}
                                        />
                                    </svg>
                                </span>
                                <span className="zeile">
                                    <span data-wort>
                                        {wort}
                                        <span className="text-brand-600">.</span>
                                    </span>
                                </span>
                            </span>
                        ))}
                    </p>

                    <div className="mt-8 flex flex-col items-center">
                        {EINZELNES.problemBandSatz ? (
                            <p data-rest className="mb-7 max-w-[30ch] text-lead text-ink-2">
                                So sieht der digitale Ortseingang aus, den wir für Ihre Gemeinde bauen.
                            </p>
                        ) : null}
                        <div data-rest>
                            <Magnet>
                                <ButtonLink href="/#kontakt" onClick={zumKontakt}>
                                    Kostenlose Vorschau anfragen
                                    <span className="pfeil" aria-hidden="true">
                                        →
                                    </span>
                                </ButtonLink>
                            </Magnet>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
