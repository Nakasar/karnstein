import { MongoClient, type Db } from "mongodb";

/**
 * Connexion MongoDB partagée.
 *
 * Le client est créé paresseusement : `new MongoClient()` n'ouvre aucune
 * connexion réseau, ce qui permet de construire l'application (`next build`)
 * sans base de données disponible. En développement, l'instance est mémorisée
 * sur `globalThis` pour survivre au hot-reload de Next.js.
 */

const uri = process.env.DATABASE_URL;
const dbName = process.env.MONGODB_DB ?? "karnstein";

if (!uri && process.env.NODE_ENV === "production") {
  console.warn(
    "[karnstein] DATABASE_URL n'est pas défini : l'authentification échouera à l'exécution.",
  );
}

const globalForMongo = globalThis as unknown as {
  _karnsteinMongoClient?: MongoClient;
};

export const mongoClient: MongoClient =
  globalForMongo._karnsteinMongoClient ??
  new MongoClient(uri ?? "mongodb://127.0.0.1:27017", {
    appName: "karnstein",
  });

if (process.env.NODE_ENV !== "production") {
  globalForMongo._karnsteinMongoClient = mongoClient;
}

export const mongoDb: Db = mongoClient.db(dbName);
