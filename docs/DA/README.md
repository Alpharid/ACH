# Direction artistique — ACH

**DA retenue (2026-10-26) : l'identité Alpharium**, à partir du logo réalisé par une
graphiste (fichiers dans `logo/source/`). Alpharium est présenté comme un **puissant
conglomérat** ; chaque projet est une filiale d'une division (α Jeux · β Apps ·
γ Outils · δ Services).

→ **Charte complète : [CHARTE.md](CHARTE.md)** (logo, couleurs, typo, composants, règles).

## Résumé
- Marine profond (encre du logo `#182239`) + argent (macaron) ; **l'or n'est qu'une lumière**
  (chiffres 1·9·9·6, intersection du X).
- Jost (titres, capitales espacées) · Noto Serif Display (chiffres, grec) · IBM Plex Mono
  (codes de registre).
- Motifs tirés du logo : sceau à équerres + chiffres d'angle, lettres grecques par
  division, filet doré = point de lumière.
- Le F sous le X = **blason d'Alpharid** (emblème personnel du fondateur) : signature, jamais ornement.

## Méthode (toujours valable)
La règle anti « look IA par défaut » est respectée en partant d'une **création humaine**
(le logo) : on décline, on n'invente pas d'ornements. Toute nouvelle pièce visuelle
(icône d'app, bannière, visuels de filiales) part du logo ou d'art humain, puis
retouche — jamais d'or/étoiles génériques.

## Arborescence
```
docs/DA/
  CHARTE.md            charte appliquée (source de vérité visuelle)
  logo/source/         fichiers maîtres de la graphiste (ne pas modifier)
  logo/svg/            vectoriels refaits (scripts/vectorize-logo.py)
web/assets/brand/      dérivés web : SVG (emblème animé, wordmark, macaron) + favicons
web/assets/fonts/      polices OFL auto-hébergées + OFL.txt
```

## Prochaines pièces
- Icône d'app Electron (`.ico` depuis le macaron) — trivial.
- Visuels par filiale (vignettes de cartes) : captures réelles des projets, cadrées et
  passées dans un traitement commun (désaturation + teinte marine), pas de génération.
- ~~Vecteurs~~ : faits (tracés + lueur reconstruite, animée sur le web).
