# HANDOVER — ACH (Alpharium Conglomerat HUB)

> Document maître. À jour à chaque push. But : qu'une autre IA/un autre dev reprenne
> sans contexte.

## 1. C'est quoi
Un HUB/launcher des projets Alpharium, type Steam/GOG/Epic. Deux faces alimentées par
**un seul catalogue** (`data/catalog.json`) :
1. **Page web** partageable (vitrine publique, GitHub Pages) — parcourir, lire, aller
   sur GitHub, télécharger les builds publics. Ne lance rien.
2. **Client lourd** Electron (`.exe` NSIS) pour la famille — en plus : **installer** et
   **lancer** les projets installables.

Branding : ACH = conglomérat fictif ; chaque projet = une « filiale » d'une **division**
(Jeux / Apps / Outils / Services).

## 2. État au 2026-10-26 (session de création)
- Structure monorepo créée dans `C:\ACH`.
- `data/catalog.json` : ~24 projets réels renseignés (source de vérité, public-safe).
- `web/` : squelette fonctionnel qui lit le catalogue et affiche les divisions +
  cartes + boutons. **Style = wireframe assumé** (monospace/bordures), PAS la DA finale.
- `scripts/serve-web.mjs` (preview) + `scripts/check-catalog.mjs` (validation).
- Docs : ce HANDOVER, CLAUDE.md, AGENTS.md, README, `docs/DECISIONS.md`, `docs/DA/`.
- Dépôt GitHub privé `Alpharid/ACH` créé et poussé.
- **Client Electron : pas encore commencé** (`desktop/` vide).

## 3. Décisions prises (voir docs/DECISIONS.md pour le détail)
- **Stack client lourd : Electron** (même code que le web, installeur NSIS, déjà maîtrisé).
- **DA : « Conglomérat / portail corpo diégétique »** (FUI megacorp sombre, type
  Weyland-Yutani/Abstergo/Hyperion). → **Moodboard de vraies références AVANT de coder le
  look** (règle anti « look IA par défaut »). Rien n'est figé visuellement.
- **Ordre : web d'abord, puis wrap Electron.**

## 4. Backlog (prochaines étapes, dans l'ordre)
0. **DA** : moodboard de références humaines (FUI de films/jeux, ArtStation, Pinterest)
   dans `docs/DA/`, 3 pistes + mots-clés validés par l'utilisateur, puis skin de la page web.
1. **Page web finalisée** avec la DA retenue (responsive, thème sombre, détail projet).
2. **Hébergement** : décider GitHub Pages. Repo ACH privé → Pages gratuit **exige public**.
   Option retenue à trancher : soit rendre `ACH` public (c'est une vitrine sans secret),
   soit déployer `web/` vers un repo public `ach-web` via GitHub Action (pattern `-builds`).
3. **Client Electron** (`desktop/`) : fenêtre, preload exposant `window.ACH`
   (`launch(id)`, `install(id)`), réutilise `web/` comme renderer.
   - `install` : lire la dernière release GitHub du `install.repo`, télécharger l'asset
     Windows, lancer l'installeur. Pour `install.private:true` : jeton lecture seule
     embarqué (hors git, voir `.gitignore`), jamais sur le web.
   - `launch` : résoudre un exe/launcher local depuis `launch.dir`.
   - Builder : electron-builder → `.exe` NSIS. Binaire en **GitHub Release**, jamais en git.
4. **Catalogue** : compléter/ajuster divisions et projets (l'utilisateur arbitre les cas
   à cheval : MixMaster = services?, Alphred = services ou apps?, SA Chill Trainer = outils?).
   Projets non encore inclus : SE2_Trainer (repo à créer), Project_ALL, maquettes
   Alpharium_ThreeJS/Godot (archivées), dépôts JDR Arx (arx-jdr-maps, ATR-assets, Projet_JDR-ATR).

## 5. Lancer / build / test
```bash
npm install
npm run catalog:check          # valide data/catalog.json
npm run web                    # preview → http://localhost:4173/web/
```
Client Electron : à venir (`cd desktop && npm start`, puis `npm run dist` pour l'exe).

## 6. Architecture & flux de données
- `data/catalog.json` = **unique source**. Web et desktop le lisent.
- Web : `web/index.html` → `web/assets/app.js` fetch `../data/catalog.json` → rend par division.
  Détecte le client lourd via `window.ACH` (injecté par le preload Electron). Sans lui :
  seuls les liens GitHub sont actifs (pas de Lancer/Installer).
- Desktop (prévu) : Electron charge `web/index.html`, un preload expose `window.ACH`.

## 7. Carte des fichiers
```
data/catalog.json          source de vérité
data/catalog.schema.md      doc des champs + règles (public-safe, pas de secret)
web/index.html              page
web/assets/app.js           rendu du catalogue
web/assets/styles.css       WIREFRAME (pas la DA finale)
scripts/serve-web.mjs       serveur preview
scripts/check-catalog.mjs   validateur
desktop/                    client Electron (vide)
docs/DECISIONS.md           journal des décisions
docs/DA/                    moodboard + direction artistique (à faire)
```

## 8. Où vivent les données / secrets
- **Aucun secret dans le dépôt.** Le catalogue est public-safe (pas de token, pas
  d'adresse de serveur, pas de chemin perso sensible).
- Jeton GitHub lecture seule (pour installer des builds privés comme SA_COOP) : côté
  client lourd uniquement, hors git (`.gitignore` : `token.json`, `*.token`).
- Les chemins `launch.dir` (C:\…) ne servent qu'au client lourd local.

## 9. Pièges connus / conventions
- Les dépôts privés restent privés : le bouton GitHub mène à une 404/login pour les
  non-collaborateurs. **On ne contourne jamais** (pas de proxy de contenu privé sur le web).
- Ne jamais embarquer de fichiers propriétaires tiers (GTA, jeux…) ni de clés.
- Commits : `Alpharid <67369311+Alpharid@users.noreply.github.com>`. README non signé.
- Réflexe Super_Toolbox : consulter `D:\Super_Toolbox\INDEX.md` au démarrage d'une session.

## 10. Historique
- **2026-10-26** : création. Choix Electron + DA Conglomérat + web-first. Monorepo,
  catalogue (~24 projets), squelette web wireframe, docs, repo privé `Alpharid/ACH`.
