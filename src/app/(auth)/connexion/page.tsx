import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { SignInForm } from "@/components/auth/sign-in-form";
import { KarnsteinCrest } from "@/components/karnstein-crest";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Se présenter",
  description: "Accès à la maisonnée Karnstein.",
};

export default async function ConnexionPage() {
  const session = await getSession();
  if (session) redirect("/maisonnee");

  return (
    <Card className="panel-gothic">
      <CardHeader className="items-center text-center">
        <KarnsteinCrest className="mx-auto h-14 w-14" />
        <CardTitle className="mt-4 font-heading text-2xl tracking-[0.18em]">
          SE PRÉSENTER
        </CardTitle>
        <CardDescription>
          Donnez votre nom au portier. Le Castel n&apos;ouvre qu&apos;à ceux
          qu&apos;il reconnaît.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignInForm />
      </CardContent>
    </Card>
  );
}
