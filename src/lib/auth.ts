import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";

import { mongoClient, mongoDb } from "@/lib/mongodb";

/**
 * Les transactions MongoDB exigent un replica set. En développement on tourne
 * le plus souvent sur une instance standalone : on les désactive sauf si
 * `MONGODB_TRANSACTIONS=true` est explicitement demandé.
 */
const useTransactions = process.env.MONGODB_TRANSACTIONS === "true";

export const auth = betterAuth({
  appName: "Maison Karnstein",
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(mongoDb, {
    client: mongoClient,
    transaction: useTransactions,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 10,
    autoSignIn: true,
  },
  user: {
    additionalFields: {
      /** Titre affiché dans la maisonnée : « Comtesse », « Intendant »… */
      titre: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  advanced: {
    cookiePrefix: "karnstein",
  },
  // Doit rester le dernier plugin : il propage les cookies définis par
  // better-auth depuis les Server Actions / Route Handlers de Next.js.
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
