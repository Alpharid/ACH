# ACH — consignes Claude

Lis d'abord **@HANDOVER.md** (état, archi, backlog, pièges). Il fait foi.

## Essentiel
- **ACH = Alpharium Conglomerat HUB** : launcher des projets Alpharium. Deux faces, un
  catalogue unique `data/catalog.json` : page web partageable + client lourd Electron.
- Stack décidée : **Electron** (web d'abord, puis wrap). DA : **identité Alpharium**,
  déclinée du logo de la graphiste → **`docs/DA/CHARTE.md` fait foi**. Marine + argent,
  **or = lumière rare**. Anti « look IA par défaut » : décliner le logo / de l'art humain,
  jamais d'ornements génériques (or-étoiles, glow partout).

## Règles
- `data/catalog.json` est **public-safe** : aucun token, adresse de serveur ou chemin
  perso sensible. Les secrets (jeton d'install de builds privés) vivent côté client
  lourd, hors git.
- **ACH est public** (vitrine GitHub Pages https://alpharid.github.io/ACH/). Un dépôt
  privé reste privé : jamais de contenu brut (code, README recopié, proxy) sur la
  vitrine ; seulement des fiches écrites pour elle (`data/fiches/`, public-safe) et des
  captures choisies (pas de fichiers propriétaires de tiers).
- Conventions globales : repo privé `Alpharid/ACH`, commits
  `Alpharid <67369311+Alpharid@users.noreply.github.com>`, **README non signé**,
  binaires en GitHub Release (jamais en git), docs en français.
- Réflexe Super_Toolbox : au démarrage, consulter `D:\Super_Toolbox\INDEX.md`.

## Commandes
```bash
npm run catalog:check   # valide le catalogue
npm run web             # preview web → http://localhost:4173/web/
python scripts/build-filiales.py   # après ajout de fiches/captures → media.json + vignettes
```
