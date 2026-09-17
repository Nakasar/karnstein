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

export function SignInForm({ redirection = "/maisonnee" }: { redirection?: string }) {
  const router = useRouter();
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErreur(null);
    setEnCours(true);

    const data = new FormData(event.currentTarget);
    const { error } = await authClient.signIn.email({
      email: String(data.get("email") ?? ""),
      password: String(data.get("password") ?? ""),
    });

    setEnCours(false);

    if (error) {
      setErreur(
        error.message ?? "Ces lettres de créance n'ouvrent aucune porte ici.",
      );
      return;
    }

    toast.success("Le portail s'ouvre.");
    router.push(redirection);
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

      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••••"
        />
      </div>

      <Button type="submit" className="w-full font-heading tracking-wider" disabled={enCours}>
        {enCours ? <Loader2 className="animate-spin" /> : null}
        {enCours ? "Vérification du sceau…" : "Franchir le seuil"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Nul ne vous connaît encore ?{" "}
        <Link href="/inscription" className="text-gold hover:underline">
          Demandez audience
        </Link>
        .
      </p>
    </form>
  );
}
