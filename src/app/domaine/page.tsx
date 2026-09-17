import type { Metadata } from "next";

import { ExplorateurDomaine } from "@/components/carte/explorateur-domaine";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ACCES_LABEL, CATEGORIES, LIEUX } from "@/lib/domaine";

export const metadata: Metadata = {
  title: "Le Domaine",
  description:
    "Carte du Comté de Karnstein : le Castel, le bourg de Rougecendre, la Sylve des Murmures et les services offerts aux voyageurs.",
};

export default function DomainePage() {
  const lieuxAvecServices = LIEUX.filter((lieu) => lieu.services.length > 0);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <header className="max-w-2xl">
        <p className="eyebrow">Comitatus Karnstein</p>
        <h1 className="mt-3 font-heading text-4xl text-bone sm:text-5xl">
          Le Domaine
        </h1>
        <p className="mt-5 text-muted-foreground">
          Trois lieues de landes, de sylve et de tourbières, tenues en fief de
          la Couronne krytienne. Cliquez sur un écusson pour connaître le lieu,
          son accès et ce qu&apos;on peut y obtenir.
        </p>
      </header>

      <div className="rule-ornament my-10" />

      <ExplorateurDomaine />

      {/* Légende des catégories */}
      <section className="mt-12">
        <h2 className="font-heading text-xl tracking-wide text-bone">Légende</h2>
        <dl className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((categorie) => (
            <div key={categorie.id} className="flex items-start gap-3">
              <span
                aria-hidden
                className="mt-1.5 size-2.5 rotate-45 shrink-0"
                style={{ backgroundColor: categorie.couleur }}
              />
              <div>
                <dt className="font-heading text-sm text-bone">
                  {categorie.nom}
                </dt>
                <dd className="text-sm text-muted-foreground">
                  {categorie.description}
                </dd>
              </div>
            </div>
          ))}
        </dl>
      </section>

      {/* Services du fief */}
      <section id="services" className="mt-20 scroll-mt-24">
        <p className="eyebrow">Ce que le Comté offre</p>
        <h2 className="mt-3 font-heading text-3xl text-bone">
          Services du fief
        </h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Les voyageurs de passage, les marchands et les compagnies en armes
          trouveront ici de quoi se loger, se ferrer, se soigner — et se faire
          enterrer, le cas échéant.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {lieuxAvecServices.map((lieu) => (
            <Card key={lieu.id} className="panel-gothic">
              <CardHeader>
                <CardTitle className="font-heading text-base tracking-wide">
                  {lieu.nom}
                </CardTitle>
                <p className="text-xs uppercase tracking-widest text-gold/70">
                  {ACCES_LABEL[lieu.acces]}
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {lieu.services.map((service) => (
                    <li key={service} className="flex gap-2">
                      <span aria-hidden className="text-blood">
                        ❧
                      </span>
                      {service}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
