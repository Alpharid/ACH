# ACH — Alpharium Conglomerat HUB

Un HUB / launcher pour **tous les projets Alpharium**, façon Steam / GOG / Epic,
mais pour mes propres jeux, apps, outils et services.

Deux faces, un seul catalogue :

- **Page web** (partageable) — vitrine publique : on parcourt les divisions, on lit
  la présentation de chaque projet, on va sur son GitHub ou on télécharge les builds
  publics. On n'y lance rien.
- **Client lourd** (`.exe`, Electron) — à partager à la famille : en plus de la
  vitrine, il peut **installer** et **lancer** les projets installables.

## Divisions
**Jeux · Apps · Outils · Services** — chaque projet est une « filiale » du conglomérat.

## État
Projet démarré le 2026-10-26. Squelette monorepo + catalogue en place ; la page web
est encore en **wireframe** (la direction artistique « Conglomérat / FUI megacorp »
se fait après un moodboard de vraies références). Voir [HANDOVER.md](HANDOVER.md).

## Démarrer
```bash
npm install
npm run catalog:check   # valide le catalogue
npm run web             # http://localhost:4173/web/
```

## Structure
```
data/catalog.json   source de vérité (web + desktop)
web/                page web statique (GitHub Pages)
desktop/            client Electron (à venir)
scripts/            serveur de preview + validateur
docs/               décisions + moodboard DA
```

Documentation complète : [HANDOVER.md](HANDOVER.md).
