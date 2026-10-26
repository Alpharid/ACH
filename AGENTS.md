# ACH — règles pour agents IA

Mêmes règles que `CLAUDE.md`. Lire `HANDOVER.md` en premier (état, archi, backlog).

- ACH = launcher des projets Alpharium. Catalogue unique : `data/catalog.json`
  (public-safe, aucun secret). Deux faces : page web partageable + client Electron.
- Stack : Electron. DA : identité Alpharium tirée du logo de la graphiste →
  `docs/DA/CHARTE.md` fait foi (marine + argent, or = lumière rare, jamais
  d'ornements génériques « look IA »).
- Le dépôt ACH est **public** (vitrine GitHub Pages). Jamais de contenu brut d'un dépôt
  privé (code, README recopié, proxy) : seulement des fiches écrites pour la vitrine
  (`data/fiches/`, public-safe) et des captures choisies. Ni fichiers propriétaires de
  tiers, ni clés. Secrets hors git.
- Commits `Alpharid <67369311+Alpharid@users.noreply.github.com>`, README non signé,
  binaires en Release, docs FR.
