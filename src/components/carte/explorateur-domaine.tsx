"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Compass, Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  ACCES_LABEL,
  CATEGORIES,
  CATEGORIES_PAR_ID,
  LIEUX,
  type CategorieId,
} from "@/lib/domaine";

// Leaflet touche à `window` dès l'import : le composant ne doit jamais être
// rendu côté serveur.
const CarteDomaine = dynamic(() => import("./carte-domaine"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center gap-3 bg-crypt text-muted-foreground">
      <Loader2 className="size-4 animate-spin" />
      <span className="font-heading text-sm tracking-widest">
        DÉPLIAGE DU PARCHEMIN…
      </span>
    </div>
  ),
});

export function ExplorateurDomaine() {
  const [actives, setActives] = useState<CategorieId[]>(() =>
    CATEGORIES.map((c) => c.id),
  );
  const [selection, setSelection] = useState<string | null>(null);

  const lieux = useMemo(
    () => LIEUX.filter((lieu) => actives.includes(lieu.categorie)),
    [actives],
  );

  const lieuActif = useMemo(
    () => lieux.find((lieu) => lieu.id === selection) ?? null,
    [lieux, selection],
  );

  function bascule(id: CategorieId) {
    setActives((courant) =>
      courant.includes(id)
        ? courant.filter((c) => c !== id)
        : [...courant, id],
    );
  }

  const toutesActives = actives.length === CATEGORIES.length;

  return (
    <div className="space-y-6">
      {/* Filtres par catégorie */}
      <div className="flex flex-wrap items-center gap-2">
        {CATEGORIES.map((categorie) => {
          const actif = actives.includes(categorie.id);
          const Icone = categorie.icone;
          return (
            <button
              key={categorie.id}
              type="button"
              onClick={() => bascule(categorie.id)}
              aria-pressed={actif}
              title={categorie.description}
              className={cn(
                "flex items-center gap-2 rounded-sm border px-3 py-1.5 text-sm transition-colors",
                actif
                  ? "border-border bg-card/80 text-bone"
                  : "border-border/40 bg-transparent text-muted-foreground/60 hover:text-muted-foreground",
              )}
            >
              <Icone
                className="size-3.5"
                style={{ color: actif ? categorie.couleur : undefined }}
              />
              <span className="font-heading text-xs tracking-wider">
                {categorie.nom}
              </span>
            </button>
          );
        })}

        {!toutesActives ? (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-gold/80"
            onClick={() => setActives(CATEGORIES.map((c) => c.id))}
          >
            Tout afficher
          </Button>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        {/* Carte */}
        <div className="panel-gothic h-[58vh] min-h-[420px] overflow-hidden lg:h-[38rem]">
          <CarteDomaine
            lieux={lieux}
            lieuActif={lieuActif}
            onSelection={setSelection}
          />
        </div>

        {/* Colonne latérale : détail ou index des lieux */}
        <aside className="panel-gothic flex max-h-[38rem] flex-col overflow-hidden">
          {lieuActif ? (
            <div className="flex-1 overflow-y-auto p-5">
              <p
                className="text-[0.65rem] uppercase tracking-[0.22em]"
                style={{ color: CATEGORIES_PAR_ID[lieuActif.categorie].couleur }}
              >
                {CATEGORIES_PAR_ID[lieuActif.categorie].nom}
              </p>
              <h3 className="mt-2 font-heading text-2xl text-bone">
                {lieuActif.nom}
              </h3>
              <Badge
                variant={
                  lieuActif.acces === "interdit" ? "destructive" : "secondary"
                }
                className="mt-3"
              >
                {ACCES_LABEL[lieuActif.acces]}
              </Badge>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {lieuActif.description}
              </p>

              {lieuActif.services.length > 0 ? (
                <>
                  <Separator className="my-5" />
                  <p className="eyebrow">Services</p>
                  <ul className="mt-3 space-y-2 text-sm text-bone/90">
                    {lieuActif.services.map((service) => (
                      <li key={service} className="flex gap-2">
                        <span aria-hidden className="text-blood">
                          ❧
                        </span>
                        {service}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  <Separator className="my-5" />
                  <p className="text-sm italic text-muted-foreground">
                    Aucun service. On n&apos;y va pas.
                  </p>
                </>
              )}

              <Button
                variant="outline"
                size="sm"
                className="mt-6"
                onClick={() => setSelection(null)}
              >
                Revenir à l&apos;index
              </Button>
            </div>
          ) : (
            <div className="flex flex-1 flex-col overflow-hidden">
              <div className="flex items-center gap-2 border-b border-border/60 px-5 py-4">
                <Compass className="size-4 text-gold/80" />
                <p className="font-heading text-sm tracking-widest text-bone">
                  INDEX DES LIEUX
                </p>
                <span className="ml-auto text-xs text-muted-foreground">
                  {lieux.length}
                </span>
              </div>

              <ul className="flex-1 overflow-y-auto">
                {lieux.map((lieu) => {
                  const categorie = CATEGORIES_PAR_ID[lieu.categorie];
                  return (
                    <li key={lieu.id}>
                      <button
                        type="button"
                        onClick={() => setSelection(lieu.id)}
                        className="flex w-full items-start gap-3 border-b border-border/40 px-5 py-3 text-left transition-colors hover:bg-accent/30"
                      >
                        <span
                          aria-hidden
                          className="mt-1.5 size-2 rotate-45 shrink-0"
                          style={{ backgroundColor: categorie.couleur }}
                        />
                        <span>
                          <span className="block font-heading text-sm text-bone">
                            {lieu.nom}
                          </span>
                          <span className="block text-sm text-muted-foreground">
                            {lieu.resume}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
                {lieux.length === 0 ? (
                  <li className="px-5 py-8 text-center text-sm italic text-muted-foreground">
                    Le parchemin est vierge : choisissez au moins une catégorie.
                  </li>
                ) : null}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
