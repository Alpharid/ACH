# Décisions — ACH

## 2026-10-26 — Kickoff
- **Stack du client lourd : Electron.** Raison : la page web partageable et le client
  lourd partagent le même code (un seul catalogue, une seule UI), installeur `.exe` NSIS
  simple (electron-builder), et stack déjà maîtrisée (Sanctuary, Medusa, Omnicommande
  desktop). Alternatives écartées : Tauri (exe léger mais build Rust hors zone de
  confort), Godot (obligerait à maintenir la page web en double).
- **Direction artistique : « Conglomérat / portail corpo diégétique ».** ACH est présenté
  comme un holding fictif, chaque projet est une « division/filiale ». Ambiance FUI
  megacorp sombre (références : Weyland-Yutani, Abstergo, Hyperion, FUI de films/jeux).
  **Méthode imposée** : moodboard de vraies références humaines d'abord, 3 pistes +
  mots-clés validés, PUIS skin. Règle anti « look IA par défaut ».
- **Ordre de construction : web d'abord, puis wrap Electron.**

## 2026-10-26 — DA = identité Alpharium (logo de la graphiste)
- L'utilisateur fournit le **logo Alpharium** (10 variantes, par sa cousine graphiste) :
  « on reprend cette DA, Alpharium est un puissant conglomérat ».
- Ce logo **remplace le moodboard** comme référence humaine de départ : la DA n'est plus
  « FUI megacorp sombre » générique mais **holding de prestige** (marine, argent, or en
  lumière rare, lettres grecques, chiffres 1·9·9·6). Le côté FUI reste dans la rigueur
  (filets, codes de registre en mono).
- Divisions renommées visuellement **α β γ δ** (champ `glyph` du catalogue), codes de
  filiale `α-01`.
- Polices : Jost / Noto Serif Display / IBM Plex Mono, **auto-hébergées** (le client
  Electron doit marcher hors ligne).
- Détail : `docs/DA/CHARTE.md`.

## 2026-10-26 — Logo vectorisé par nous
- Vectoriels d'origine non disponibles → SVG refaits depuis les PNG haute résolution
  (`scripts/vectorize-logo.py`) : formes tracées (fidèles), lueur et liseré reconstruits
  en dégradés (l'original en paliers n'est pas traçable), macaron rendu circulaire.
- Sens du logo : α ρ δ = Alpharid ; 1996 = origine d'Alpharium (« depuis 1996 »).
- Le glyphe sous le X = **blason d'Alpharid** (F stylisé, emblème personnel du fondateur
  depuis l'enfance) : extrait en SVG seul, utilisé comme **signature** (« fondé par
  Alpharid »), jamais comme ornement.

## 2026-10-26 — Fiche filiale, recherche, téléchargement web
- Fiche filiale = `<dialog>` ouvert par l'ancre **`#filiale/<id>`** → chaque filiale a un
  lien partageable, le bouton Retour ferme la fiche. Pas de routeur ni de framework.
- Recherche plein texte (accents ignorés) + filtre par statut, côté client.
- **Téléchargement sur le web** : uniquement si `install.private` est faux (repo de builds
  public). La fiche interroge l'API GitHub publique (`releases/latest`, sans jeton) pour
  afficher la version et proposer l'asset Windows. Builds privés : client lourd seulement.

## 2026-10-26 — ACH public, fiches et captures
- L'utilisateur valide : **`Alpharid/ACH` devient public**, vitrine sur GitHub Pages
  (workflow Actions, `web/` + `data/`).
- Présentation longue par filiale = **fiche écrite pour la vitrine** (`data/fiches/`),
  pas le README privé recopié ni récupéré à l'exécution (un dépôt privé reste privé).
- Captures : prises par nous dans les dépôts ou en lançant les projets (Godot Movie
  Maker, Edge headless, outils de capture des projets). Pas d'image générée, pas d'art
  propriétaire de tiers ; sans capture propre → plaque typographique.
- Traitement visuel en CSS (désaturé + voile marine, couleur rendue au survol) plutôt
  que dans les fichiers : les captures restent fidèles (réutilisées dans les README).

## 2026-10-26 — Divisions à cheval, Sanctuary scindé, filiales manquantes
- Cas à cheval tranchés par l'utilisateur : **MixMaster → Jeux**, **Alphred → Apps +
  Outils**, **SA Chill Trainer → Outils**. Une filiale peut relever de deux divisions
  (champ `also` : principale = code `α-01`, apparaît aussi dans les autres, comptée une fois).
- **Sanctuary scindé** : le « vrai » Sanctuary (dungeon crawler 3D FPS, immersive sim)
  devient la filiale `sanctuary-3d` avec son propre dépôt `Alpharid/Sanctuary-3D` (créé
  avec le lore récupéré) ; le mini-jeu de barre devient `sanctuary-idle` (« Sanctuary —
  Idle Tic »), présenté comme l'avant-goût qui prépare le 3D.
- Filiales ajoutées après revue GitHub + disque : **Alpharium Luxurious Lounge** (Kaddour
  Social Club, dépôt actif `Project_ALL` ; maquettes ThreeJS/Godot = essais archivés),
  **Arx : Tenebris Relectis** (JDR Roll20), **SE2 Trainer** (plugin Space Engineers 2),
  **LightsOff** (utilitaire écrans).
- **Usagi exclu** : « virus » de bureau au comportement de vrai malware (réinstallation
  furtive déguisée en service, re-déclenchement, synchro multi-appareils) → jamais sur la
  vitrine publique, pas d'aide à sa diffusion.
- **Droits d'auteur** : pas de capture publiée pour Arx Sandbox ni pour les cartes du JDR
  Arx — ce serait de l'art d'Arx Fatalis (Arkane/Bethesda). Alternative possible : vue
  greybox (géométrie sans textures) ou UI maison seule.

## À trancher (ouvert)
- Inclusion de SE2_Trainer (repo à créer), Project_ALL, maquettes Alpharium, dépôts JDR Arx.

## 2026-10-27 — Alpharium en 3 filiales, δ Services complété
- **Alpharium = 3 filiales**, une par essai (demande de l'utilisateur) : Maquette Three.js,
  Luxurious Lounge (Godot), Kaddour Social Club (2D isométrique, en service). L'id `lounge`
  devient `kaddour-social-club` ; l'ancien lien est redirigé (`RENAMED` dans `app.js`).
- **δ Services** = tout projet qui fait tourner un serveur ou une infra : MixMaster et
  Guardians (serveurs de jeu) et Alphred (IA locale) y apparaissent aussi, via `also`.
- **Arx : Tenebris Relectis** en `prod` : la campagne est prête à être jouée.
