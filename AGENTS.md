<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Le projet

Site de la maison Karnstein (jeu de rôle Guild Wars 2) : Next.js 16 + MongoDB +
better-auth + Tailwind v4 + shadcn/ui + Leaflet. Voir `README.md`.

Conventions :

- **Français partout** : interface, commentaires, noms de variables métier
  (`lieux`, `categorie`, `acces`…). Le vocabulaire technique reste en anglais.
- Le contenu du fief vit dans `src/lib/domaine.ts` — c'est la source unique des
  lieux, catégories et services.
- Le fond de carte est généré : ne pas éditer `public/carte/*.svg` à la main,
  modifier `scripts/generate-map.mjs` puis lancer `npm run carte`.
- Palette et ornements : tokens CSS dans `src/app/globals.css`
  (`--blood`, `--gold`, `--bone`, classes `.panel-gothic`, `.eyebrow`,
  `.rule-ornament`). Éviter les couleurs en dur dans les composants.
- Avant de livrer : `npm run lint`, `npm run typecheck`, `npm run build`.
