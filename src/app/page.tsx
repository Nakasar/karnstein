import Link from "next/link";
import { Droplets, Landmark, Moon, ScrollText } from "lucide-react";

import { KarnsteinCrest } from "@/components/karnstein-crest";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LIEUX } from "@/lib/domaine";

const LIGNEE = [
  {
    nom: "Sélène Karnstein",
    titre: "Comtesse de Karnstein, XIe du nom",
    texte:
      "Elle tient le fief depuis la nuit où son père ne s'est pas relevé. On la dit d'une courtoisie parfaite et d'une patience inépuisable — deux qualités qui, chez les Karnstein, n'annoncent jamais rien de bon.",
  },
  {
    nom: "Aurelian Karnstein",
    titre: "Connétable du Comté, frère de la Comtesse",
    texte:
      "Il commande les vingt-quatre lances de la maison et le Guet des Crocs. Il a repoussé trois incursions centaures en six ans et n'a jamais accepté de décoration pour aucune.",
  },
  {
    nom: "Ysoline Karnstein",
    titre: "Héritière du fief",
    texte:
      "Dix-neuf ans, six langues, et une correspondance suivie avec deux ministres de Cité Divine. Le bourg l'appelle « la Fiancée », bien qu'aucun contrat n'ait été signé.",
  },
  {
    nom: "Corvin Vhane",
    titre: "Intendant du Castel",
    texte:
      "Il tient les comptes, les clefs et le silence. Ni noble ni parent, il est pourtant le seul, avec la Comtesse, à posséder la clef de la crypte.",
  },
];

const CHIFFRES = [
  { valeur: "1287", legende: "Année de l'édit sur la crypte" },
  { valeur: "XI", legende: "Générations sans interruption" },
  { valeur: `${LIEUX.length}`, legende: "Lieux relevés sur la carte" },
  { valeur: "3", legende: "Lieues de fief, du pont au col" },
];

const COUTUMES = [
  {
    icone: Moon,
    titre: "Les heures de la maison",
    texte:
      "Les audiences se tiennent après le crépuscule. Aucun Karnstein n'est réputé discourtois avant midi : il est simplement absent.",
  },
  {
    icone: Droplets,
    titre: "Le droit d'hospitalité",
    texte:
      "Quiconque franchit le Pont des Gargouilles peut demander le toit pour trois nuits. Nul ne l'a jamais refusé. Nul n'a demandé la quatrième.",
  },
  {
    icone: ScrollText,
    titre: "Le registre",
    texte:
      "Tout hôte inscrit son nom au cartulaire. La maison n'en efface aucun, ce qui explique l'épaisseur du volume et la prudence des visiteurs.",
  },
  {
    icone: Landmark,
    titre: "Le service de Kryta",
    texte:
      "Le fief relève directement de la Couronne. La maison n'a pas de siège au Ministère et affirme n'en vouloir aucun.",
  },
];

export default function AccueilPage() {
  return (
    <div>
      {/* Bandeau d'accueil */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "url(/carte/comte-karnstein.svg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center px-4 py-24 text-center sm:px-6 sm:py-32">
          <KarnsteinCrest className="h-24 w-24" />

          <h1 className="mt-8 font-heading text-5xl leading-tight tracking-[0.12em] text-blood-gradient sm:text-7xl">
            KARNSTEIN
          </h1>
          <p className="mt-4 font-heading text-sm uppercase tracking-[0.42em] text-gold/80">
            Sanguis memoriam servat
          </p>

          <div className="rule-ornament mt-10 w-full max-w-md" />

          <p className="mt-8 max-w-2xl text-lg text-muted-foreground">
            Maison comtale de Kryta, tenant fief sur l&apos;éperon noir qui
            surplombe la Sanguine. Onze générations, une crypte à sept niveaux,
            et un domaine que l&apos;on traverse plus volontiers de jour.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="font-heading tracking-widest">
              <Link href="/domaine">Parcourir le domaine</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="font-heading tracking-widest"
            >
              <Link href="/inscription">Demander audience</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Chiffres du fief */}
      <section className="border-b border-border/50 bg-crypt/40">
        <dl className="mx-auto grid w-full max-w-5xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
          {CHIFFRES.map((chiffre) => (
            <div key={chiffre.legende} className="text-center">
              <dt className="font-heading text-3xl text-bone">
                {chiffre.valeur}
              </dt>
              <dd className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {chiffre.legende}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* La lignée */}
      <section id="lignee" className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-20 sm:px-6">
        <p className="eyebrow">Le sang</p>
        <h2 className="mt-3 font-heading text-3xl text-bone sm:text-4xl">
          La lignée
        </h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Quatre noms suffisent aujourd&apos;hui à administrer le Comté. Les
          autres figurent sur les stèles de la crypte, ce qui, dans cette
          maison, ne les rend pas tout à fait absents.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {LIGNEE.map((membre) => (
            <Card key={membre.nom} className="panel-gothic">
              <CardHeader>
                <CardTitle className="font-heading text-xl tracking-wide text-bone">
                  {membre.nom}
                </CardTitle>
                <CardDescription className="text-gold/75">
                  {membre.titre}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{membre.texte}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Renvoi vers la carte */}
      <section className="border-y border-border/50 bg-crypt/40">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-20 sm:px-6 md:grid-cols-2">
          <div>
            <p className="eyebrow">La terre</p>
            <h2 className="mt-3 font-heading text-3xl text-bone sm:text-4xl">
              Le Comté, lieu par lieu
            </h2>
            <p className="mt-4 text-muted-foreground">
              Du Pont des Gargouilles au Guet des Crocs, la carte du fief
              recense {LIEUX.length} lieux : bourgs, forges, sanctuaires,
              tourbières et quelques endroits que l&apos;édit comtal préfère
              tenir fermés. Chacun indique son accès et les services qu&apos;on y
              rend.
            </p>
            <Button asChild className="mt-8 font-heading tracking-widest">
              <Link href="/domaine">Ouvrir la carte</Link>
            </Button>
          </div>

          <Link
            href="/domaine"
            className="panel-gothic group block overflow-hidden"
            aria-label="Ouvrir la carte du domaine"
          >
            {/* Aperçu du parchemin ; la carte interactive vit sur /domaine. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/carte/comte-karnstein.svg"
              alt="Carte du Comté de Karnstein"
              className="aspect-[3/2] w-full object-cover opacity-80 transition-opacity duration-500 group-hover:opacity-100"
            />
          </Link>
        </div>
      </section>

      {/* Us et coutumes */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <p className="eyebrow">L&apos;usage</p>
        <h2 className="mt-3 font-heading text-3xl text-bone sm:text-4xl">
          Us et coutumes
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {COUTUMES.map((coutume) => (
            <div
              key={coutume.titre}
              className="flex gap-4 border-l border-blood/50 pl-5"
            >
              <coutume.icone className="mt-1 size-5 shrink-0 text-blood" />
              <div>
                <h3 className="font-heading text-lg text-bone">
                  {coutume.titre}
                </h3>
                <p className="mt-1 text-muted-foreground">{coutume.texte}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
