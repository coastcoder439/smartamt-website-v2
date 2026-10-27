import type { Metadata } from 'next';
import Ablauf from '@/components/sections/Ablauf';
import Angebot from '@/components/sections/Angebot';
import Faq from '@/components/sections/Faq';
import Hero from '@/components/sections/Hero';
import Kontakt from '@/components/sections/Kontakt';
import Kunden from '@/components/sections/Kunden';
import Lage from '@/components/sections/Lage';
import Leistungen from '@/components/sections/Leistungen';
import Problem from '@/components/sections/Problem';
import Recht from '@/components/sections/Recht';
import Referenzen from '@/components/sections/Referenzen';
import Schulungen from '@/components/sections/Schulungen';
import Team from '@/components/sections/Team';
import Vision from '@/components/sections/Vision';
import Websites from '@/components/sections/Websites';
import { ABSCHNITTE } from '@/lib/abschnitte';

export const metadata: Metadata = {
    alternates: { canonical: '/' },
};

/**
 * Reihenfolge der Website v2 (docs/packages/02-website-v2/design/bauauftrag-v2.md, Entscheidung 4):
 * Hero → Kunden (Logos) → Problem samt Band → Websites („Eine Website, die Ihre Gemeinde gut vertritt.“ mit
 * Vorher/Nachher) → Angebot → Ablauf → Referenzen → Team → Fragen → Kontakt.
 *
 * Ausgeblendet, nicht gelöscht (Owner 26.10.2026: „Die kannst du ja alle quasi ausblenden, archivieren“): Leistungen,
 * Schulungen, Lage, Recht, Vision. Die Schalter stehen in lib/abschnitte.ts; die Komponenten bleiben unverändert im Code
 * und erscheinen an ihrer alten Stelle wieder, wenn ihr Schalter auf `true` steht.
 */
export default function HomePage() {
    return (
        <>
            <Hero />
            <Kunden />
            <Problem />
            {ABSCHNITTE.leistungen ? <Leistungen /> : null}
            {ABSCHNITTE.websites ? <Websites /> : null}
            {ABSCHNITTE.angebot ? <Angebot /> : null}
            {ABSCHNITTE.ablauf ? <Ablauf /> : null}
            {ABSCHNITTE.schulungen ? <Schulungen /> : null}
            {ABSCHNITTE.lage ? <Lage /> : null}
            {ABSCHNITTE.recht ? <Recht /> : null}
            {ABSCHNITTE.vision ? <Vision /> : null}
            {ABSCHNITTE.referenzen ? <Referenzen /> : null}
            {ABSCHNITTE['ueber-uns'] ? <Team /> : null}
            {ABSCHNITTE.faq ? <Faq /> : null}
            {ABSCHNITTE.kontakt ? <Kontakt /> : null}
        </>
    );
}
