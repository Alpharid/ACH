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
**α Jeux · β Apps · γ Outils · δ Services** — chaque projet est une « filiale » du conglomérat.

## État
Projet démarré le 2026-10-26. Catalogue en place ; la page web porte l'identité
**Alpharium** (logo, charte : [docs/DA/CHARTE.md](docs/DA/CHARTE.md)). Le client Electron
est la prochaine étape. Voir [HANDOVER.md](HANDOVER.md).

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
