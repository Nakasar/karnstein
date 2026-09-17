import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarClock, KeyRound, Map as MapIcon, ScrollText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LIEUX, ACCES_LABEL } from "@/lib/domaine";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "La Maisonnée",
  description: "Espace réservé aux membres de la maison Karnstein.",
};

export default async function MaisonneePage() {
  const session = await getSession();
  if (!session) redirect("/connexion");

  const { user } = session;
  const titre =
    "titre" in user && typeof user.titre === "string" ? user.titre : null;

  const lieuxReserves = LIEUX.filter((lieu) => lieu.acces !== "libre");

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <p className="eyebrow">Registre de la maison</p>
      <h1 className="mt-3 font-heading text-4xl text-bone sm:text-5xl">
        Bienvenue, {user.name}.
      </h1>
      {titre ? (
        <p className="mt-2 text-lg text-gold/85">{titre}</p>
      ) : null}
      <div className="rule-ornament my-8" />

      <div className="grid gap-6 md:grid-cols-3">
        <Card id="profil" className="panel-gothic md:col-span-1">
          <CardHeader>
            <CardTitle className="font-heading text-lg tracking-wide">
              État civil
            </CardTitle>
            <CardDescription>Ce que le cartulaire retient de vous.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Nom porté
              </p>
              <p className="text-bone">{user.name}</p>
            </div>
            <Separator />
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Courrier
              </p>
              <p className="break-all text-bone">{user.email}</p>
            </div>
            <Separator />
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Inscrit au registre le
              </p>
              <p className="text-bone">
                {new Intl.DateTimeFormat("fr-FR", {
                  dateStyle: "long",
                }).format(new Date(user.createdAt))}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="panel-gothic md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading text-lg tracking-wide">
              <KeyRound className="size-4 text-gold/80" />
              Lieux à accès réservé
            </CardTitle>
            <CardDescription>
              Ce que le fief n&apos;ouvre pas au premier venu. Tout le reste est
              accessible à qui se présente poliment.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {lieuxReserves.map((lieu) => (
              <div
                key={lieu.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-sm border border-border/60 bg-background/40 px-4 py-3"
              >
                <div>
                  <p className="font-heading text-sm text-bone">{lieu.nom}</p>
                  <p className="text-sm text-muted-foreground">{lieu.resume}</p>
                </div>
                <Badge
                  variant={lieu.acces === "interdit" ? "destructive" : "secondary"}
                >
                  {ACCES_LABEL[lieu.acces]}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {[
          {
            icone: MapIcon,
            titre: "Carte du domaine",
            texte: "Parcourir les lieux et services du Comté.",
            href: "/domaine",
            action: "Ouvrir la carte",
          },
          {
            icone: ScrollText,
            titre: "Chroniques",
            texte: "Les actes de la maison, bientôt consignés ici.",
            href: "/maisonnee",
            action: "À venir",
          },
          {
            icone: CalendarClock,
            titre: "Veillées",
            texte: "Le calendrier des réceptions et des chasses.",
            href: "/maisonnee",
            action: "À venir",
          },
        ].map((bloc) => (
          <Card key={bloc.titre} className="panel-gothic">
            <CardHeader>
              <bloc.icone className="size-5 text-blood" />
              <CardTitle className="font-heading text-base tracking-wide">
                {bloc.titre}
              </CardTitle>
              <CardDescription>{bloc.texte}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" size="sm">
                <Link href={bloc.href}>{bloc.action}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
