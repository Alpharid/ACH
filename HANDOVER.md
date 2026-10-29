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
- **32 filiales** (catalogue), chacune avec une fiche (`data/fiches/`) ; captures réelles
  pour 14, plaque typographique (glyphe + nom) pour les autres.
- Une filiale peut relever de deux divisions via `also` (ex. les 3 Alpharium, MixMaster et Guardians = α Jeux + δ Services ; Alphred = β Apps + γ Outils +
  δ Services) : division principale pour le code `α-01`, comptée une fois.
- README de tous les dépôts des filiales mis à jour (lien vers la vitrine en pied).
- **Client Electron v0.1** (`desktop/`) : même page servie via `ach://`, boutons
  **Lancer / Ouvrir** et **Installer / Mettre à jour** selon l'état du PC, progression +
  messages (toast). Testé : install manifest (7D7H), install zip (Medusa), « déjà à jour »,
  lancement depuis la bibliothèque, refus propre d'un dépôt privé sans jeton.
  Installeur publié en Release (https://github.com/Alpharid/ACH/releases/latest), lien
  « Client Windows » en pied de vitrine (masqué dans le client).
- **Client v0.2** : contenu **en direct** (catalogue, fiches, captures lus sur la vitrine,
  cache hors ligne) et **mise à jour automatique** (electron-updater, Releases GitHub).
  Testé : contenu en direct, repli sur le cache hors ligne, build packagé, mise à jour
  (un build 0.1.9 a trouvé, téléchargé et annoncé la 0.2.0 ; l'installation silencieuse à
  la fermeture n'a pas été déclenchée sur le PC de dev). La v0.1.0 n'a
  pas d'updater : ceux qui l'ont installée doivent installer la 0.2 à la main une fois.

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
2. **Captures manquantes** quand c'est faisable proprement (projets au stade concept ou
   sans visuel propre → plaque). Cas « art de tiers » laissés sans capture par choix de
   droits : Arx Sandbox et les cartes du JDR Arx (données Arx Fatalis = Arkane/Bethesda,
   jamais publiées) → proposer à l'utilisateur une vue greybox/UI sans textures.
3. ~~Client Electron~~ : v0.1 faite (voir `desktop/README.md`). Restes :
   - ~~publier le client en GitHub Release~~ : fait (sans jeton) ; le jeton des builds
     privés se dépose à la main dans `%APPDATA%\ACH\token.json` sur les PC de la famille ;
   - tester l'install SA_COOP avec un jeton (mode « installeur », assets privés) ;
   - ~~catalogue « vivant » et auto-mise à jour d'ACH~~ : faits (v0.2.0) ;
   - désinstaller une filiale de la bibliothèque ; choisir le dossier de bibliothèque ;
   - « Lancer » d'une filiale `mode: installer` : l'emplacement installé est inconnu
     (sauf `launch.target`) — à résoudre si besoin (registre Uninstall).
4. **Catalogue** : 32 filiales, divisions à cheval tranchées (voir §3 et historique).
   Reste surtout à compléter les captures et à faire vivre le catalogue au fil des projets.

## 5. Lancer / build / test
```bash
npm install
npm run catalog:check          # valide data/catalog.json
npm run web                    # preview → http://localhost:4173/web/
```
Client Electron :
```bash
npx install-electron           # une fois : Electron ≥ 45 ne télécharge plus son binaire à l'install
npm run desktop                # lance le client (lit web/ et data/ du dépôt en direct)
npm run desktop:dist           # → desktop/dist/ACH-<version>-setup.exe (NSIS)
```

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
- Desktop : `desktop/main.js` sert `web/` + `data/` sur `ach://app/…` via `lib/site.js`
  (rien d'autre n'est servi) et charge `ach://app/web/index.html`. Une fois packagé, le
  **contenu** (`data/**`, `web/assets/filiales/**`) vient de la vitrine en direct, mis en
  cache dans `%APPDATA%\ACH\live\` (repli : cache, puis copie embarquée
  `resources/site/`) ; le **code** (reste de `web/`) est celui embarqué, il change avec
  les mises à jour du client. En dev tout vient du dépôt (`ACH_SITE_URL` force le direct).
  Le catalogue est lu une fois au démarrage et la page reçoit exactement la copie du main.
  Mise à jour : `electron-updater` lit `latest.yml` de la dernière Release de
  `Alpharid/ACH`, télécharge en fond, installe à la fermeture, toast via `ach:notice`.
  `preload.js` expose `window.ACH` ; `app.js` lit
  `ACH.state()` au chargement (`LOCAL` : `launch` = `run`|`folder`|null, `installed`) et
  reconstruit les barres d'actions (`[data-actions]`) après une install.
  Install (`lib/install.js`) : release → `manifest.json` (Godot, sha256 par fichier, assets
  d'autres releases comme `runtime-<hash>`) > `.zip` Windows > `.exe`/`.msi` installeur.
  Bibliothèque : `%LOCALAPPDATA%\Alpharium\ACH\library\<id>\` + `%APPDATA%\ACH\library.json`.
  Lancement (`lib/launch.js`) : build de la bibliothèque > `launch.dir`/`launch.target` >
  devinette > ouvrir le dossier. Le main ne fait confiance qu'à son catalogue (jamais à un
  objet venu de la page) et n'installe que depuis des dépôts `Alpharid/…`.

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
desktop/main.js             client Electron : fenêtre, schéma ach://, IPC
desktop/preload.js          pont window.ACH (state, launch, install, onProgress)
desktop/lib/                github (API, téléchargements), install, launch, library,
                            site (schéma ach://, contenu en direct + cache)
desktop/README.md           détail du client, jeton
docs/DECISIONS.md           journal des décisions
docs/DA/CHARTE.md           charte Alpharium (logo, couleurs, typo, composants)
docs/DA/logo/source/        fichiers maîtres du logo (graphiste) — ne pas modifier
docs/DA/logo/svg/           vectoriels refaits (générés, ne pas éditer à la main)
```

## 8. Où vivent les données / secrets
- **Aucun secret dans le dépôt.** Le catalogue est public-safe (pas de token, pas
  d'adresse de serveur, pas de chemin perso sensible).
- Jeton GitHub lecture seule (pour installer des builds privés comme SA_COOP) : côté
  client lourd uniquement, hors git (`.gitignore` : `token.json`, `*.token`). Cherché dans
  `resources/token.json` (embarqué si `desktop/token.json` existe au build), puis
  `%APPDATA%\ACH\token.json`, puis `desktop/token.json` (dev), ou `ACH_GITHUB_TOKEN`.
  **Un exe construit avec jeton ne va jamais en release publique.** Au premier lancement,
  un jeton embarqué est recopié dans `%APPDATA%\ACH\token.json` : la mise à jour
  automatique (build public, sans jeton) ne le fait donc pas disparaître.
- Bibliothèque du client : `%LOCALAPPDATA%\Alpharium\ACH\library\` (builds installés),
  `%APPDATA%\ACH\library.json` (versions installées), `%APPDATA%\ACH\live\` (cache du
  contenu de la vitrine), `%LOCALAPPDATA%\ach-desktop-updater\` (mises à jour téléchargées).
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
- **Sanctuary** = deux filiales : `sanctuary-3d` (le vrai jeu, dungeon crawler 3D FPS,
  dépôt `Alpharid/Sanctuary-3D`, créé cette session avec le lore) et `sanctuary-idle`
  (mini-jeu de barre `Alpharid/Sanctuary` qui prépare le premier).
- **Usagi** (`C:\Usagi`) : exclu volontairement de la vitrine — « virus » blague au
  comportement de vrai malware (agent qui se réinstalle, déguisé en service Windows).
  Ne pas l'ajouter au catalogue ni l'aider à se diffuser.
- Dépôts à cheval sur deux divisions : champ `also` (voir §4). δ Services = tout ce qui fait
  tourner un serveur ou une infra pour la famille (jeux multi avec serveur, IA locale).
- **Alpharium = 3 filiales**, une par essai : `alpharium-threejs` (1er, maquette Three.js, dépôt
  `Alpharium_ThreeJS`, installée dans `C:\KaddourLounge` — malgré le nom du dossier), `luxurious-lounge`
  (2e, Godot, dépôt `Alpharium_Godot`, dossier `C:\Alpharium_KSC`), `kaddour-social-club` (3e, 2D
  isométrique en service, dépôt `Project_ALL`). Ne pas les refusionner.
- Renommer une filiale casse les liens partagés : ajouter l'ancien id dans `RENAMED` (`web/assets/app.js`),
  qui redirige `#filiale/<ancien>` (ex. `lounge` → `kaddour-social-club`).
- Captures : flouter tout texte en jeu qui pourrait porter un vrai nom (plaques, pseudos).
- `launch.target` (relatif à `launch.dir`) quand la devinette se tromperait (plusieurs exe,
  `.bat` de lancement…) ; `catalog:check` refuse un chemin absolu ou avec `..`.
- Electron ≥ 45 : pas de postinstall, lancer `npx install-electron` après `npm install`.
- Client : zip extraits avec le `tar.exe` de Windows (bsdtar) — pas de dépendance unzip.
- Publier une version du client : monter `version` dans `desktop/package.json` (et le
  `package.json` racine), `npm run desktop:dist`, vérifier qu'aucun `token.json` n'est dans
  `desktop/dist/win-unpacked/resources/`, puis
  `gh release create vX.Y.Z desktop/dist/ACH-X.Y.Z-setup.exe desktop/dist/ACH-X.Y.Z-setup.exe.blockmap desktop/dist/latest.yml`.
  **`latest.yml` est obligatoire** (c'est ce que lisent les clients pour se mettre à
  jour) ; ni brouillon ni pré-version (ignorés par l'updater). Le lien du pied de vitrine
  pointe sur `releases/latest` : rien d'autre à changer.
- Le pont `window.ACH` ne fait que **grandir** : le code de la page change avec le client,
  mais une nouvelle méthode doit rester testée (`if (window.ACH.onNotice)`) et aucune ne
  doit disparaître ou changer de forme.
- `catalog:check` refuse un `install.repo` hors `Alpharid/…` (le client le refuserait aussi).
- Un nouveau champ du catalogue n'est compris que par les clients à jour : le rendre
  facultatif (les vieux clients l'ignorent).
- Client : le toast est un `popover="manual"` (top layer) pour passer au-dessus de la fiche
  (`<dialog>` modal) ; ne pas le remplacer par un simple `position: fixed`.
- Dépôts `*-builds` : README en **anglais** (leur convention), le reste en français.
- SVG en `<img>` : l'état de repos de l'animation doit rester visible (jamais d'animation
  qui part d'opacité 0) — certains contextes n'animent pas les SVG-images.
- Les dépôts privés restent privés : le bouton GitHub mène à une 404/login pour les
  non-collaborateurs. **On ne contourne jamais** (pas de proxy de contenu privé sur le web).
- Ne jamais embarquer de fichiers propriétaires tiers (GTA, jeux…) ni de clés.
- Commits : `Alpharid <67369311+Alpharid@users.noreply.github.com>`. README non signé.
- **Réflexe : chaque nouveau projet de l'utilisateur entre au catalogue** (entrée
  `catalog.json` + `data/fiches/<id>.md` + `build-filiales.py` + `catalog:check`), en
  respectant les règles du dépôt public ci-dessus. Insérer l'entrée en texte : un
  `json.dump` reformate tout le fichier.
- Réflexe Super_Toolbox : consulter `D:\Super_Toolbox\INDEX.md` au démarrage d'une session.

## 10. Historique
- **2026-10-29 (6)** : fiche Guardians of the Seal : jeu en ligne à plusieurs, groupes, mises à jour automatiques.
- **2026-10-29 (5)** : fiche Guardians of the Seal : tout le village peint (lot 2 de l'art), canaux de la première zone, bande-son en cours.
- **2026-10-29 (4)** : fiche Guardians of the Seal : ordres aux djinn, vision d'aigle, djinn tombés à ranimer.
- **2026-10-29 (3)** : fiche Guardians of the Seal : habitants vivants qui commercent selon leurs besoins (oukil et registre), bulles et tour du crieur.
- **2026-10-29 (2)** : fiche Guardians of the Seal : les deux passages bloquants de la première zone sont réglés grâce aux Deux-Souffles.
- **2026-10-28 (9)** : fiche Guardians of the Seal : le Gardien court et marche en jeu (robe en tissu simulé).
- **2026-10-28 (8)** : fiche Guardians of the Seal : les joueurs IA s'appellent les Deux-Souffles.
- **2026-10-28 (7)** : fiche Guardians of the Seal : icônes peintes, la mascotte fennec en jeu, garde-robe.
- **2026-10-28 (6)** : fiche Guardians of the Seal : nouvelle interface (sac à silhouette, quatorze emplacements, raccourcis, touches réglables) ; les Descellés jouent la première zone.
- **2026-10-28 (5)** : fiche Orphan Protocol : premier prototype de l'escouade (en test en jeu).
- **2026-10-28 (4)** : fiche Orphan Protocol : fondations techniques posées (premier PNJ qui converse en jeu via IA locale).
- **2026-10-28 (3)** : fiche Guardians of the Seal : l'économie des joueurs précisée (étals, marchandage, calendrier, marchands de passage).
- **2026-10-28 (2)** : fiche Super Toolbox : guide « joueurs IA dans un jeu en ligne » ajouté à la liste.
- **2026-10-28** : fiche Guardians of the Seal : en conception, les Descellés (joueurs IA) et l'économie 100 % joueurs.
- **2026-10-27 (11)** : fiche Guardians of the Seal : deux djinn de plus en jeu, mini-carte et objectifs de quête.
- **2026-10-27 (10)** : fiche Guardians of the Seal : launcher du jeu (`GuardiansLauncher.exe`, nouvelle cible de lancement local), première zone jouable de bout en bout ; « Où en est la filiale » à jour.
- **2026-10-27 (6)** : fiche Arx Sandbox en 0.6.1-alpha (quête principale parcourue par un test automatique).
- **2026-10-27 (9)** : fiche **Kali-Pi** mise à jour : régie sonore de jeu de rôle désormais opérationnelle
  (soundboard tactile sur la dalle, ambiances en boucle + bruitages, lecture déportée sur les enceintes du
  PC via un petit agent audio). Catalogue : description enrichie + tag `jdr`.
- **2026-10-27 (8)** : fiche Super Toolbox : guides « vieux jeu dans le navigateur » et « jeu LAN par Internet » ajoutés à la liste.
- **2026-10-27 (7)** : nouvelle filiale **MCM Online** (α Jeux, bêta, dépôt privé `Alpharid/MCM_Online`) :
  Motocross Madness 1 & 2 d'origine, multi à 8 par un relais maison, lanceur Windows + installeur Mac.
- **2026-10-27 (6)** : Arx : Tenebris Relectis passe en **prod** (campagne prête : installateur,
  QG du MJ, régie sonore). δ Services complété : MixMaster, Guardians et Alphred (fiche Alphred
  enrichie : mode vocal, overlay, agent, « se modifier »). L'ancienne filiale `lounge` scindée en
  **3 filiales Alpharium** avec captures : Maquette Three.js (captures faites sur une copie locale
  du serveur, plaque floutée), Luxurious Lounge (Godot), Kaddour Social Club (ex-`lounge`, alias
  `RENAMED`). 32 filiales. Pieds de README : `Project_ALL` (unstable) et `Alpharium_Godot`
  (unstable) poussés ; `Alpharium_ThreeJS` non touché (règle du dépôt).
- **2026-10-27 (5)** : fiche Arx Sandbox en 0.6.0-alpha « Hôte meneur » (l'hôte mène l'histoire en coop).
- **2026-10-27 (4)** : fiche Arx Sandbox à jour (0.5.0-alpha « Coop fidèle » : Arx Fatalis en coop fidèle
  au jeu, carte d'origine, scripts, combat, magie ; tag `sandbox` → `coop`).
- **2026-10-27 (3)** : fiche MM2 Web à jour (jeu en ligne pour la famille). ACH suivi
  automatiquement : règle « Keep ACH in sync » dans le CLAUDE.md global de l'utilisateur
  et hook `~/.claude/hooks/ach-sync-reminder.mjs` (rappel après chaque `git push` d'un
  dépôt `Alpharid/*`, hors ACH) — les sessions des autres projets mettent ACH à jour.
- **2026-10-27 (2)** : client **v0.2.0** — contenu en direct depuis la vitrine (cache hors
  ligne), mise à jour automatique (electron-updater + `latest.yml` en Release), toast
  `ach:notice`, garde-fou `Alpharid/…` sur les dépôts de builds, jeton embarqué conservé.
- **2026-10-27** : Release GitHub **v0.1.0** du client (`ACH-0.1.0-setup.exe`, reconstruit
  avec les 30 filiales, vérifié sans jeton) ; lien « Client Windows » en pied de vitrine.
- **2026-10-26 (9)** : +1 filiale **MM2 Web** (α Jeux, bêta) : Midtown Madness 2 original
  dans le navigateur (OpenMM2 → WebAssembly, dépôt privé `Alpharid/MM2_Web`). Pas de
  capture (art Microsoft) et pas d'URL de jeu dans le catalogue : le lien Cloudflare est
  réservé à la famille.
- **2026-10-26 (8)** : client Electron v0.1 (`desktop/`) — schéma `ach://`, pont
  `window.ACH`, install manifest/zip/installeur dans une bibliothèque locale, lancement,
  progression ; `launch.target` ajouté au catalogue (9 filiales) ; installeur NSIS.
- **2026-10-26 (7)** : divisions des cas à cheval tranchées (MixMaster → Jeux ;
  Alphred → Apps + Outils ; SA Chill Trainer → Outils ; champ `also`). Sanctuary scindé en
  `sanctuary-3d` (nouveau dépôt créé) + `sanctuary-idle`. Filiales ajoutées : Lounge
  (Kaddour Social Club), Arx : Tenebris Relectis (JDR), SE2 Trainer, LightsOff (29 au total).
  Usagi exclu (malware). Arx Sandbox/cartes JDR sans capture (art Arkane/Bethesda).
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
