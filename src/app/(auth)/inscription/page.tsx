import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { SignUpForm } from "@/components/auth/sign-up-form";
import { KarnsteinCrest } from "@/components/karnstein-crest";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Demander audience",
  description: "Rejoindre la maisonnée Karnstein.",
};

export default async function InscriptionPage() {
  const session = await getSession();
  if (session) redirect("/maisonnee");

  return (
    <Card className="panel-gothic">
      <CardHeader className="items-center text-center">
        <KarnsteinCrest className="mx-auto h-14 w-14" />
        <CardTitle className="mt-4 font-heading text-2xl tracking-[0.18em]">
          DEMANDER AUDIENCE
        </CardTitle>
        <CardDescription>
          Votre nom sera porté au registre de la maison. On n&apos;en efface
          aucun.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpForm />
      </CardContent>
    </Card>
  );
}
