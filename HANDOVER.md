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

Branding : **Alpharium** = l'entreprise de l'utilisateur, mise en scène en puissant
conglomérat ; chaque projet = une « filiale » d'une **division** (α Jeux / β Apps /
γ Outils / δ Services). Identité visuelle : logo d'une graphiste → `docs/DA/CHARTE.md`.

## 2. État au 2026-10-26 (session de création)
- Structure monorepo créée dans `C:\ACH`.
- `data/catalog.json` : ~24 projets réels renseignés (source de vérité, public-safe).
- `web/` : page fonctionnelle qui lit le catalogue (divisions + cartes + boutons),
  **skinnée v1 avec l'identité Alpharium** (logo de la graphiste) — voir `docs/DA/CHARTE.md`.
  Responsive vérifié (desktop 1400 px, mobile 390 px).
- `scripts/serve-web.mjs` (preview) + `scripts/check-catalog.mjs` (validation).
- Docs : ce HANDOVER, CLAUDE.md, AGENTS.md, README, `docs/DECISIONS.md`, `docs/DA/`.
- Dépôt GitHub privé `Alpharid/ACH` créé et poussé.
- **Client Electron : pas encore commencé** (`desktop/` vide).

## 3. Décisions prises (voir docs/DECISIONS.md pour le détail)
- **Stack client lourd : Electron** (même code que le web, installeur NSIS, déjà maîtrisé).
- **DA : identité Alpharium** — partie du logo réalisé par une graphiste (sources
  `docs/DA/logo/source/`). Holding de prestige : marine `#182239`, argent, **or = lumière
  rare**, lettres grecques par division (α β γ δ), chiffres 1·9·9·6, blason d'Alpharid
  (le F sous le X = emblème personnel du fondateur, pièce précieuse). Charte :
  `docs/DA/CHARTE.md`. Règle anti « look IA par défaut » : on décline le logo, on
  n'invente pas d'ornements (pas d'or/étoiles génériques).
- **Ordre : web d'abord, puis wrap Electron.**

## 4. Backlog (prochaines étapes, dans l'ordre)
0. ~~DA~~ : fait (skin v1 + logo vectorisé). Retours utilisateur à intégrer.
1. **Page web finalisée** : vue détail projet, vignettes par filiale (captures réelles),
   recherche/filtre par statut.
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
web/assets/styles.css       skin Alpharium v1 (tokens en tête de fichier)
web/assets/fonts.css        @font-face auto-hébergées (Jost, Noto Serif Display, Plex Mono)
web/assets/fonts/           woff2 + OFL.txt
web/assets/brand/           SVG web (emblème animé, wordmark, macaron, blason) + favicons
scripts/serve-web.mjs       serveur preview
scripts/check-catalog.mjs   validateur
scripts/vectorize-logo.py   PNG maîtres → SVG (docs/DA/logo/svg + web/assets/brand)
scripts/build-brand-assets.py  favicons PNG/ICO + macaron PNG (icône d'app)
desktop/                    client Electron (vide)
docs/DECISIONS.md           journal des décisions
docs/DA/CHARTE.md           charte Alpharium (logo, couleurs, typo, composants)
docs/DA/logo/source/        fichiers maîtres du logo (graphiste) — ne pas modifier
docs/DA/logo/svg/           vectoriels refaits (générés, ne pas éditer à la main)
```

## 8. Où vivent les données / secrets
- **Aucun secret dans le dépôt.** Le catalogue est public-safe (pas de token, pas
  d'adresse de serveur, pas de chemin perso sensible).
- Jeton GitHub lecture seule (pour installer des builds privés comme SA_COOP) : côté
  client lourd uniquement, hors git (`.gitignore` : `token.json`, `*.token`).
- Les chemins `launch.dir` (C:\…) ne servent qu'au client lourd local.

## 9. Pièges connus / conventions
- **Jost** : macron cassé sur ā ē ī ō ū (bug amont, Google et Fontsource) → ces caractères
  sont exclus de ses `unicode-range` dans `fonts.css`. Ne pas « réparer » en les remettant.
- `catalog.json` : chaque division a un `glyph` (1 caractère grec) — vérifié par
  `catalog:check`.
- Les logos de `docs/DA/logo/source/` appartiennent à Alpharium (pas de licence libre) ;
  tout se régénère depuis eux : `python scripts/vectorize-logo.py` (pillow, numpy,
  opencv-python-headless, potracer) puis `python scripts/build-brand-assets.py`.
- Vectorisation : `potracer` remplit les pixels **False** (d'où `~mask`) ; potrace émousse
  les angles aigus → le wordmark est tracé en polygones (OpenCV `approxPolyDP`), l'emblème
  (courbes) en potrace. La lueur et le liseré sont **reconstruits** (constantes en tête du
  script, mesurées sur les PNG).
- SVG en `<img>` : l'état de repos de l'animation doit rester visible (jamais d'animation
  qui part d'opacité 0) — certains contextes n'animent pas les SVG-images.
- Les dépôts privés restent privés : le bouton GitHub mène à une 404/login pour les
  non-collaborateurs. **On ne contourne jamais** (pas de proxy de contenu privé sur le web).
- Ne jamais embarquer de fichiers propriétaires tiers (GTA, jeux…) ni de clés.
- Commits : `Alpharid <67369311+Alpharid@users.noreply.github.com>`. README non signé.
- Réflexe Super_Toolbox : consulter `D:\Super_Toolbox\INDEX.md` au démarrage d'une session.

## 10. Historique
- **2026-10-26 (4)** : glyphe du bas de l'emblème identifié = **blason d'Alpharid** (F
  stylisé, deux logos Arx Fatalis en asymétrie, emblème personnel du fondateur) → SVG
  seul `alpharid-blason-*.svg`, signature « fondé par Alpharid » en pied de page.
- **2026-10-26 (3)** : logo vectorisé (12 SVG + web), lueur reconstruite et animée,
  macaron en cercle parfait ; sens du logo documenté (α ρ δ = Alpharid, 1996 = origine
  d'Alpharium → `brand.since`, « depuis 1996 » en pied de page).
- **2026-10-26 (2)** : DA = identité Alpharium (logo de la cousine graphiste). Sources
  rangées et renommées, dérivés web, charte, polices auto-hébergées, skin v1 de la page,
  `glyph` α β γ δ par division.
- **2026-10-26** : création. Choix Electron + DA Conglomérat + web-first. Monorepo,
  catalogue (~24 projets), squelette web wireframe, docs, repo privé `Alpharid/ACH`.
