import Link from "next/link";

import { KarnsteinCrest } from "@/components/karnstein-crest";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/70 bg-crypt/70">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <KarnsteinCrest className="h-11 w-11" />
            <div>
              <p className="font-heading text-sm tracking-[0.22em] text-bone">
                MAISON KARNSTEIN
              </p>
              <p className="text-xs uppercase tracking-[0.25em] text-gold/70">
                Sanguis memoriam servat
              </p>
            </div>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            Le sang garde la mémoire. Onze générations au service de Kryta,
            depuis l&apos;éperon noir qui surplombe la Sanguine.
          </p>
        </div>

        <div className="space-y-3">
          <p className="eyebrow">Le fief</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/domaine" className="hover:text-bone">
                Carte du domaine
              </Link>
            </li>
            <li>
              <Link href="/domaine#services" className="hover:text-bone">
                Services aux voyageurs
              </Link>
            </li>
            <li>
              <Link href="/#lignee" className="hover:text-bone">
                La lignée
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <p className="eyebrow">Maisonnée</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/connexion" className="hover:text-bone">
                Se présenter
              </Link>
            </li>
            <li>
              <Link href="/inscription" className="hover:text-bone">
                Demander audience
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/50 px-4 py-6 text-center text-xs text-muted-foreground/80 sm:px-6">
        Site de jeu de rôle non officiel, situé dans l&apos;univers de Guild
        Wars 2. Guild Wars 2 et ses contenus appartiennent à ArenaNet / NCSOFT.
      </div>
    </footer>
  );
}
