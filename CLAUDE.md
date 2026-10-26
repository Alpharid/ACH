# ACH — consignes Claude

Lis d'abord **@HANDOVER.md** (état, archi, backlog, pièges). Il fait foi.

## Essentiel
- **ACH = Alpharium Conglomerat HUB** : launcher des projets Alpharium. Deux faces, un
  catalogue unique `data/catalog.json` : page web partageable + client lourd Electron.
- Stack décidée : **Electron** (web d'abord, puis wrap). DA : **« Conglomérat / FUI
  megacorp »** — mais **moodboard de vraies références AVANT tout code visuel**
  (anti « look IA par défaut » : partir d'art humain + outils dédiés, jamais des
  primitives propres / UI or-étoiles générique).
- `web/assets/styles.css` actuel = **wireframe assumé**, pas la DA. Ne pas le prendre
  pour la direction finale.

## Règles
- `data/catalog.json` est **public-safe** : aucun token, adresse de serveur ou chemin
  perso sensible. Les secrets (jeton d'install de builds privés) vivent côté client
  lourd, hors git.
- Un dépôt privé reste privé : jamais de contournement pour exposer du contenu privé
  sur la vitrine web.
- Conventions globales : repo privé `Alpharid/ACH`, commits
  `Alpharid <67369311+Alpharid@users.noreply.github.com>`, **README non signé**,
  binaires en GitHub Release (jamais en git), docs en français.
- Réflexe Super_Toolbox : au démarrage, consulter `D:\Super_Toolbox\INDEX.md`.

## Commandes
```bash
npm run catalog:check   # valide le catalogue
npm run web             # preview web → http://localhost:4173/web/
```
