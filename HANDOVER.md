# HANDOVER — ACH (Alpharium Conglomerat HUB)

> Document maître. À jour à chaque push. But : qu'une autre IA/un autre dev reprenne
> sans contexte.

## 1. C'est quoi
Un HUB/launcher des projets Alpharium, type Steam/GOG/Epic. Deux faces alimentées par
**un seul catalogue** (`data/catalog.json`) :
1. **Page web** partageable — vitrine publique **https://alpharid.github.io/ACH/**
   (GitHub Pages) : parcourir, lire la fiche de chaque filiale (captures + présentation),
   aller sur GitHub, télécharger les builds publics. Ne lance rien.
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
  **Fiche filiale** (`#filiale/<id>`, lien partageable), **recherche** (touche `/`) et
  **filtre par statut** ; téléchargement des builds publics depuis la fiche.
- `scripts/serve-web.mjs` (preview) + `scripts/check-catalog.mjs` (validation).
- Docs : ce HANDOVER, CLAUDE.md, AGENTS.md, README, `docs/DECISIONS.md`, `docs/DA/`.
- Dépôt GitHub **public** `Alpharid/ACH` ; la vitrine se déploie toute seule sur Pages à
  chaque push touchant `web/` ou `data/` (`.github/workflows/pages.yml`).
- **24 fiches** (`data/fiches/`) + captures réelles pour 11 filiales
  (`web/assets/filiales/`) ; les autres ont une plaque typographique (glyphe + nom).
- README de tous les dépôts des filiales mis à jour (lien vers la vitrine en pied).
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
1. ~~Page web~~ et ~~hébergement~~ : faits (vitrine publique en ligne). Restes :
   captures des 13 filiales sans image (quand il y aura de quoi capturer proprement —
   voir « Pièges » pour ce qui est interdit) ; README `main` d'Oddyseus et de Medusa
   (le nouveau README est sur leur branche `unstable`, il arrivera au prochain merge).
2. (libre)
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
  Fiche : `<dialog id="filiale">` piloté par le hash `#filiale/<id>` (`setupSheet`) ; pour
  les builds publics, appel `api.github.com/repos/<install.repo>/releases/latest` (version +
  asset Windows `.exe` > `.msi` > `.zip`, repli sur la dernière pré-version). Recherche/filtre :
  `setupFinder` (masque cartes et divisions vides, codes `α-01` fixes quel que soit le filtre).
- Médias : `data/fiches/<id>.md` + `web/assets/filiales/<id>-{1,2,3}.webp` (1600×900) →
  `python scripts/build-filiales.py` → `<id>-card.webp` + `data/media.json` (lu par la page).
  Fiche : capture en grand + miniatures, puis la présentation Markdown (rendu maison,
  tout est échappé) à la place de la description courte.
- Déploiement : `.github/workflows/pages.yml` assemble `_site/` = `web/` + `data/`.
  Détecte le client lourd via `window.ACH` (injecté par le preload Electron). Sans lui :
  seuls les liens GitHub sont actifs (pas de Lancer/Installer).
- Desktop (prévu) : Electron charge `web/index.html`, un preload expose `window.ACH`.

## 7. Carte des fichiers
```
data/catalog.json          source de vérité
data/catalog.schema.md      doc des champs + règles (public-safe, pas de secret)
data/fiches/<id>.md         présentation publique de chaque filiale
data/media.json             généré (fiches + nb de captures) — ne pas éditer
web/assets/filiales/        captures 1600×900 + vignettes -card (générées)
scripts/build-filiales.py   vignettes + media.json
.github/workflows/pages.yml déploiement GitHub Pages
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
- API GitHub non authentifiée : 60 requêtes/h par IP (une par repo de builds et par visite,
  mises en cache en mémoire). Au-delà, la fiche affiche « aucune version publiée » sans
  bouton Télécharger — pas grave, le lien Dépôt reste.
- Fiche : la fermeture ne touche l'historique que si le hash désigne encore la fiche
  ouverte (sinon un hash inconnu ferait rouvrir l'ancienne fiche via `history.back()`).
- Ne jamais afficher `launch.dir` sur le web (chemins locaux du client lourd).
- **Dépôt public** : fiches et captures sont publiques. Fiche = texte écrit pour la vitrine
  (jamais de README privé recopié, ni code, IP, chemin, nom réel). Captures : jamais de
  fichiers/art propriétaires de tiers (GTA, Arx Fatalis, MixMaster…), ni de capture qui
  trahit un lieu réel (la carte Waze SA montrait des communes réelles → retirée), un
  bureau, un nom d'utilisateur ou des données perso.
- Stryder : le code est dans le dépôt privé d'un collaborateur (`C-Chafik`) → `source: null`
  dans le catalogue, et on ne touche pas à son dépôt ; la vitrine publique est
  `Alpharid/stryder-symbiosis-builds`.
- Dépôts `*-builds` : README en **anglais** (leur convention), le reste en français.
- SVG en `<img>` : l'état de repos de l'animation doit rester visible (jamais d'animation
  qui part d'opacité 0) — certains contextes n'animent pas les SVG-images.
- Les dépôts privés restent privés : le bouton GitHub mène à une 404/login pour les
  non-collaborateurs. **On ne contourne jamais** (pas de proxy de contenu privé sur le web).
- Ne jamais embarquer de fichiers propriétaires tiers (GTA, jeux…) ni de clés.
- Commits : `Alpharid <67369311+Alpharid@users.noreply.github.com>`. README non signé.
- Réflexe Super_Toolbox : consulter `D:\Super_Toolbox\INDEX.md` au démarrage d'une session.

## 10. Historique
- **2026-10-26 (6)** : ACH rendu public + GitHub Pages. 24 fiches et captures réelles
  (11 filiales) ; cartes illustrées (capture désaturée, couleur au survol) ou plaque
  typographique ; galerie dans la fiche. Catalogue corrigé d'après les dépôts (statuts
  Tokyo `wip`, SA_COOP `alpha`, WifiSentinel `beta`, Factory Bee-ing, Orphan_Protocol…).
  README de 27 dépôts mis à jour et poussés.
- **2026-10-26 (5)** : fiche filiale (`#filiale/<id>`), recherche + filtre par statut,
  téléchargement des builds publics (API releases), carte entièrement cliquable.
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
