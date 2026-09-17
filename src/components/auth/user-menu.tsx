"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { LogOut, ScrollText, UserRound } from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  nom: string;
  email: string;
  titre?: string | null;
};

function initiales(nom: string) {
  return nom
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((mot) => mot[0]?.toUpperCase() ?? "")
    .join("");
}

export function UserMenu({ nom, email, titre }: Props) {
  const router = useRouter();
  const [enCours, setEnCours] = useState(false);

  async function deconnexion() {
    setEnCours(true);
    const { error } = await authClient.signOut();
    setEnCours(false);

    if (error) {
      toast.error("La déconnexion a échoué.", { description: error.message });
      return;
    }

    toast.success("Vous avez quitté la maisonnée.");
    router.push("/");
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-10 gap-2 px-2 hover:bg-accent/40"
          aria-label="Menu du compte"
        >
          <Avatar className="size-8 border border-gold/40">
            <AvatarFallback className="bg-blood-deep font-heading text-xs text-bone">
              {initiales(nom) || "K"}
            </AvatarFallback>
          </Avatar>
          <span className="hidden font-heading text-sm tracking-wide sm:inline">
            {nom.split(/\s+/)[0]}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="space-y-0.5">
          <p className="font-heading text-sm text-bone">{nom}</p>
          {titre ? <p className="text-xs text-gold/80">{titre}</p> : null}
          <p className="truncate text-xs text-muted-foreground">{email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/maisonnee">
            <ScrollText className="text-gold/80" />
            La maisonnée
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/maisonnee#profil">
            <UserRound className="text-gold/80" />
            Mon état civil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          disabled={enCours}
          onSelect={(event) => {
            event.preventDefault();
            void deconnexion();
          }}
        >
          <LogOut />
          {enCours ? "Départ en cours…" : "Quitter la maisonnée"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
