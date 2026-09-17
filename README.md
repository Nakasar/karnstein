# Maison Karnstein

Site de la famille Karnstein, maison comtale fictive de Kryta dans l'univers de
**Guild Wars 2**. Le site présente la lignée, le domaine du Comté et, surtout,
une **carte interactive** du fief décrivant ses lieux et ses services.

Esthétique : noir et rouge sang, gothique baroque.

## Pile technique

| Rôle | Choix |
| --- | --- |
| Framework | Next.js 16 (App Router, React 19, Turbopack) |
| Base de données | MongoDB (driver officiel) |
| Authentification | better-auth — e-mail + mot de passe |
| Styles | Tailwind CSS v4 + shadcn/ui (base Radix, preset Nova) |
| Carte | Leaflet + react-leaflet, en `CRS.Simple` sur une carte dessinée |
| Icônes | lucide-react |

## Démarrage

```bash
npm install
cp .env.example .env.local   # puis renseigner les variables
npm run dev
```

Le site est alors servi sur http://localhost:3000.

### Variables d'environnement

| Variable | Rôle |
| --- | --- |
| `DATABASE_URL` | Chaîne de connexion MongoDB. |
| `MONGODB_DB` | Nom de la base (par défaut `karnstein`). |
| `MONGODB_TRANSACTIONS` | `true` seulement si l'instance est un *replica set*. |
| `BETTER_AUTH_SECRET` | Secret de signature des sessions (`openssl rand -base64 32`). |
| `BETTER_AUTH_URL` | URL publique du site, sans slash final. |

Sans MongoDB joignable, le site reste consultable : la lecture de session
échoue proprement et le visiteur est simplement considéré comme anonyme
(`src/lib/session.ts`). Seule l'authentification est indisponible.

### Une base MongoDB en local

```bash
docker run -d --name karnstein-mongo -p 27017:27017 mongo:7
```

better-auth crée les collections (`user`, `session`, `account`, `verification`)
à la première écriture : aucune migration n'est nécessaire.

## Scripts

| Commande | Effet |
| --- | --- |
| `npm run dev` | Serveur de développement. |
| `npm run build` / `npm start` | Build de production puis service. |
| `npm run lint` | ESLint. |
| `npm run typecheck` | `tsc --noEmit`. |
| `npm run carte` | Régénère la carte du domaine (voir plus bas). |

## Organisation

```
src/
  app/
    (auth)/connexion|inscription  Pages d'authentification
    api/auth/[...all]/route.ts    Point d'entrée better-auth
    domaine/                      Carte interactive + services du fief
    maisonnee/                    Espace réservé aux membres
    globals.css                   Thème gothique (tokens Tailwind v4)
  components/
    carte/                        Leaflet, filtres, index des lieux
    auth/                         Formulaires et menu de compte
    ui/                           Composants shadcn/ui
  lib/
    auth.ts / auth-client.ts      Configuration better-auth
    mongodb.ts                    Client MongoDB partagé
    domaine.ts                    Données du fief (lieux, services, catégories)
    session.ts                    Lecture de session côté serveur
scripts/generate-map.mjs          Générateur de la carte SVG
public/carte/                     Carte générée
```

## La carte du domaine

La carte n'est pas géographique : Leaflet est configuré en `L.CRS.Simple` et
affiche un **SVG de 2400 × 1600 unités** en `ImageOverlay`.

- Le fond de carte est **généré** par `npm run carte` : `scripts/generate-map.mjs`
  place forêts, reliefs et toponymes à l'aide d'un PRNG à graine fixe, donc le
  rendu est reproductible d'une génération à l'autre.
- Les lieux sont décrits dans `src/lib/domaine.ts`, avec des coordonnées `x` / `y`
  dans le **repère du SVG** (origine en haut à gauche). La conversion vers le
  repère Leaflet (axe Y vers le haut) est faite dans `carte-domaine.tsx`.

### Ajouter un lieu

1. Repérer sa position sur `public/carte/comte-karnstein.svg` (coordonnées SVG).
2. Ajouter une entrée dans `LIEUX` (`src/lib/domaine.ts`) : catégorie, résumé,
   description, services rendus et niveau d'accès.

Le marqueur, l'index latéral, la légende et la section « Services du fief »
sont alimentés par cette même source.

## Authentification

better-auth en e-mail + mot de passe, adaptateur MongoDB, cookies posés via le
plugin `nextCookies()`. Le profil porte un champ additionnel `titre` (l'office
tenu dans la maison), déclaré dans `auth.ts` et typé côté client par
`inferAdditionalFields`.

Les pages serveur lisent la session avec `getSession()` ; `/maisonnee` redirige
vers `/connexion` en l'absence de session.

## Licence et mentions

Projet de jeu de rôle non officiel. *Guild Wars 2* et ses contenus
appartiennent à ArenaNet / NCSOFT.
