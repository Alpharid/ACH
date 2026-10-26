# ACH — règles pour agents IA

Mêmes règles que `CLAUDE.md`. Lire `HANDOVER.md` en premier (état, archi, backlog).

- ACH = launcher des projets Alpharium. Catalogue unique : `data/catalog.json`
  (public-safe, aucun secret). Deux faces : page web partageable + client Electron.
- Stack : Electron. DA : identité Alpharium tirée du logo de la graphiste →
  `docs/DA/CHARTE.md` fait foi (marine + argent, or = lumière rare, jamais
  d'ornements génériques « look IA »).
- Ne jamais exposer de contenu de dépôt privé sur la vitrine web, ni embarquer de
  fichiers propriétaires ou de clés. Secrets hors git.
- Commits `Alpharid <67369311+Alpharid@users.noreply.github.com>`, README non signé,
  binaires en Release, docs FR.
