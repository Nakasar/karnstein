"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/** Doit rester aligné sur `emailAndPassword.minPasswordLength` (src/lib/auth.ts). */
const LONGUEUR_MIN = 10;

export function SignUpForm() {
  const router = useRouter();
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErreur(null);

    const data = new FormData(event.currentTarget);
    const password = String(data.get("password") ?? "");
    const confirmation = String(data.get("confirmation") ?? "");

    if (password !== confirmation) {
      setErreur("Les deux mots de passe ne concordent pas.");
      return;
    }
    if (password.length < LONGUEUR_MIN) {
      setErreur(`Le mot de passe doit compter au moins ${LONGUEUR_MIN} signes.`);
      return;
    }

    setEnCours(true);
    const titre = String(data.get("titre") ?? "").trim();
    const { error } = await authClient.signUp.email({
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? ""),
      password,
      ...(titre ? { titre } : {}),
    });
    setEnCours(false);

    if (error) {
      setErreur(error.message ?? "La demande d'audience a été refusée.");
      return;
    }

    toast.success("Votre nom est porté au registre de la maison.");
    router.push("/maisonnee");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {erreur ? (
        <Alert variant="destructive">
          <AlertDescription>{erreur}</AlertDescription>
        </Alert>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="name">Nom porté</Label>
        <Input
          id="name"
          name="name"
          autoComplete="name"
          required
          placeholder="Isolde de Varn"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="titre">
          Titre ou office{" "}
          <span className="text-xs text-muted-foreground">(facultatif)</span>
        </Label>
        <Input id="titre" name="titre" placeholder="Intendante du Castel" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Courrier</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="vous@exemple.fr"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={LONGUEUR_MIN}
            required
            placeholder="••••••••••"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmation">Confirmation</Label>
          <Input
            id="confirmation"
            name="confirmation"
            type="password"
            autoComplete="new-password"
            minLength={LONGUEUR_MIN}
            required
            placeholder="••••••••••"
          />
        </div>
      </div>

      <Button type="submit" className="w-full font-heading tracking-wider" disabled={enCours}>
        {enCours ? <Loader2 className="animate-spin" /> : null}
        {enCours ? "Inscription au registre…" : "Porter mon nom au registre"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        La maison vous connaît déjà ?{" "}
        <Link href="/connexion" className="text-gold hover:underline">
          Présentez-vous
        </Link>
        .
      </p>
    </form>
  );
}
