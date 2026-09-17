import Link from "next/link";
import { Menu } from "lucide-react";

import { KarnsteinCrest } from "@/components/karnstein-crest";
import { UserMenu } from "@/components/auth/user-menu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getSession } from "@/lib/session";

const NAVIGATION = [
  { href: "/", label: "Le Comté" },
  { href: "/domaine", label: "Le Domaine" },
  { href: "/maisonnee", label: "La Maisonnée" },
];

export async function SiteHeader() {
  const session = await getSession();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-crypt/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <KarnsteinCrest className="h-10 w-10 transition-transform group-hover:scale-105" />
          <span className="flex flex-col leading-none">
            <span className="font-heading text-base font-semibold tracking-[0.22em] text-bone">
              KARNSTEIN
            </span>
            <span className="mt-1 text-[0.65rem] uppercase tracking-[0.3em] text-gold/70">
              Maison comtale
            </span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 md:flex">
          {NAVIGATION.map((item) => (
            <Button
              key={item.href}
              asChild
              variant="ghost"
              className="font-heading text-sm tracking-wider text-muted-foreground hover:bg-accent/40 hover:text-bone"
            >
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-2">
          {user ? (
            <UserMenu
              nom={user.name}
              email={user.email}
              titre={
                "titre" in user && typeof user.titre === "string"
                  ? user.titre
                  : null
              }
            />
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                className="hidden font-heading text-sm tracking-wider sm:inline-flex"
              >
                <Link href="/connexion">Se présenter</Link>
              </Button>
              <Button asChild className="font-heading text-sm tracking-wider">
                <Link href="/inscription">Demander audience</Link>
              </Button>
            </>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Ouvrir la navigation"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-crypt">
              <SheetHeader>
                <SheetTitle className="font-heading tracking-[0.22em]">
                  KARNSTEIN
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {NAVIGATION.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-sm px-3 py-3 font-heading text-sm tracking-wider text-muted-foreground transition-colors hover:bg-accent/40 hover:text-bone"
                  >
                    {item.label}
                  </Link>
                ))}
                {!user ? (
                  <Link
                    href="/connexion"
                    className="rounded-sm px-3 py-3 font-heading text-sm tracking-wider text-muted-foreground transition-colors hover:bg-accent/40 hover:text-bone"
                  >
                    Se présenter
                  </Link>
                ) : null}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-blood/70 to-transparent" />
    </header>
  );
}
