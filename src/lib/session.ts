import { cache } from "react";
import { headers } from "next/headers";
import { unstable_rethrow } from "next/navigation";

import { auth, type Session } from "@/lib/auth";

/**
 * Session courante, mémorisée pour la durée du rendu.
 *
 * Une erreur d'infrastructure (MongoDB injoignable, secret absent…) est
 * traitée comme « visiteur anonyme » : le site reste consultable sans base de
 * données. `unstable_rethrow` laisse en revanche remonter les exceptions de
 * contrôle de Next.js (rendu dynamique, `redirect`, `notFound`), qui ne sont
 * pas des pannes.
 */
export const getSession = cache(async (): Promise<Session | null> => {
  try {
    return await auth.api.getSession({ headers: await headers() });
  } catch (error) {
    unstable_rethrow(error);
    console.error("[karnstein] Lecture de session impossible :", error);
    return null;
  }
});
