# Charte Alpharium — appliquée à ACH

**Source unique de la DA : le logo Alpharium**, dessiné par une graphiste (cousine de
l'utilisateur). Fichiers maîtres : `docs/DA/logo/source/`. Tout ce qui suit en est
*dérivé* : on n'invente pas une identité à côté, on décline celle-ci.

**Sens du logo** (donné par le fondateur) :
- **α ρ δ** = *Alpha Rho Delta* → **Alpharid**, le nom du fondateur, gravé dans le sceau.
- **1 · 9 · 9 · 6** = l'année de naissance d'Alpharium : il est né dans l'esprit de son
  fondateur à sa naissance, donc **Alpharium existe depuis 1996** (`brand.since`).
- **Le glyphe du bas, sous le X** = le **blason d'Alpharid** : un F stylisé, composé de deux
  logos d'*Arx Fatalis* assemblés en asymétrie. C'est l'emblème personnel du fondateur
  depuis l'enfance (son identité, ses armoiries). **Pièce précieuse** : on ne le déforme,
  ne le recolore ni ne le décore jamais ; il signe, il ne décore pas.

Positionnement : **Alpharium est un puissant conglomérat.** Registre visé : holding
ancienne et sûre d'elle, plus *maison de prestige / sceau* que *néon cyberpunk*. Le
côté FUI corpo vient de la rigueur (filets, codes, registre), pas d'effets.

## 1. Le logo

| Élément | Description | Usage dans ACH |
|---|---|---|
| **Le X** | deux branches croisées, extrémités en fer de lance (3 pointes) | angles en équerre du cadre d'en-tête |
| **α ρ δ** | Alpha Rho Delta (= Alpharid) aux cantons | divisions nommées **α β γ δ** ; codes filiale `α-01` |
| **Blason d'Alpharid** | le F stylisé sous le X (deux logos Arx Fatalis en asymétrie) | signature du fondateur, pied de page (« fondé par Alpharid ») — jamais en ornement |
| **1 · 9 · 9 · 6** | année d'origine d'Alpharium, chiffres dorés en serif à contraste | chiffres d'angle du sceau (en-tête uniquement) |
| **Point de lumière** | lueur dorée à l'intersection du X | seule « lumière » de l'interface : filet doré, hover de carte, focus |
| **ALPHARIUM** | capitales géométriques, très espacées | wordmark image (jamais retapé en police) |
| **Macaron argent** | disque argent dégradé, emblème marine | favicon, pied de page, icône d'app Electron |

### Variantes (fichiers `docs/DA/logo/source/`)
| Fichier | Contenu | Fond |
|---|---|---|
| `alpharium-embleme-{noir,marine,blanc}.png` | emblème seul | clair / clair / **sombre** |
| `alpharium-wordmark-{noir,marine,blanc}.png` | ALPHARIUM seul | idem |
| `alpharium-lockup-{noir,marine,blanc}.png` | emblème + wordmark | idem |
| `alpharium-macaron-argent.png` | emblème marine sur disque argent | tout fond |

Correspondance avec les fichiers livrés : `Logo Alpha.png` = macaron ; `-01/02/03` =
emblème noir/blanc/marine ; `-04/05/06` = wordmark noir/blanc/marine ;
`-07/08/09` = lockup noir/marine/blanc.

### Vectoriels (SVG) — `docs/DA/logo/svg/`
Refaits depuis les PNG de la graphiste par `python scripts/vectorize-logo.py`
(dépendances : pillow, numpy, opencv-python-headless, potracer) :
`alpharium-{embleme,wordmark,lockup}-{blanc,marine,noir}.svg` + `alpharium-macaron.svg`
+ `alpharid-blason-{blanc,marine,noir}.svg` (le blason seul, tracé tel quel depuis l'emblème).
- **Tracés** (formes de la graphiste, inchangées) : encre de l'emblème (potrace), chiffres,
  lettres d'ALPHARIUM (contours polygonaux : angles vifs du A/M/N).
- **Reconstruits** à partir de mesures : la lueur de l'intersection (l'original est un
  dégradé Illustrator en paliers → vrai dégradé lisse + deux fuseaux), le liseré doré
  des lettres (5 px sur 6763, dégradé bronze → champagne → bronze par lettre).
- **Corrigé** : le macaron est un cercle parfait (le PNG maître est une ellipse à 3 %).

Dérivés web : `web/assets/brand/` — `embleme-blanc.svg` (lueur animée, « respiration »
lente, coupée si `prefers-reduced-motion`), `wordmark-blanc.svg`, `macaron.svg`,
`blason-blanc.svg`, favicons
PNG/ICO (`python scripts/build-brand-assets.py`). **Ne jamais éditer les PNG maîtres.**

### Règles logo
- Sur fond sombre (cas ACH) → variantes **blanches** ; sur fond clair → marine.
- Ne pas recolorer, déformer, ombrer, ni retaper ALPHARIUM dans une police.
- Zone de respiration ≈ la hauteur du ρ autour de l'emblème.

## 2. Couleurs (relevées sur les fichiers)

| Token | Valeur | Origine / rôle |
|---|---|---|
| `--navy-700` | `#182239` | **encre marine du logo** — couleur maîtresse |
| `--navy-900` / `950` | `#0a0d16` / `#070910` | fonds (marine poussé au noir) |
| `--navy-850` / `800` | `#0e1220` / `#121a2c` | panneaux, cartes, hover |
| `--silver-100…500` | `#e9e8e6` → `#5a5a5f` | macaron argent (`#a1a0a0`, `#7a797b`…) — texte & structure |
| `--gold-hi` / `gold` / `gold-lo` | `#ebc681` / `#dca751` / `#a97c3a` | chiffres 1996 & lueur |
| noir logo | `#131515` | variante noire (supports clairs) |

**Règle de l'or : l'or est une lumière, pas une couleur.** ≤ ~3 % de la surface : chiffres
du sceau, filet de division, éclat au survol, statut `prod`, focus clavier. Jamais en fond,
jamais en aplat de bouton, jamais d'étoiles/ornements dorés (= le « look IA » à éviter).

## 3. Typographie (auto-hébergée, SIL OFL — `web/assets/fonts/`)

| Rôle | Police | Pourquoi |
|---|---|---|
| Titres, UI, labels | **Jost** (300–600) | géométrique type Futura, proche du wordmark ; capitales espacées `0.22em`–`0.42em` |
| Chiffres, glyphes grecs, citations | **Noto Serif Display** | serif à fort contraste comme « 1996 », couvre le grec |
| Codes, métadonnées, tags | **IBM Plex Mono** | couche « registre / FUI » du conglomérat |

Piège connu : Jost a un macron cassé sur ā ē ī ō ū → exclus de ses plages dans
`fonts.css` (police de secours à la place).

## 4. Composants & motifs
- **Sceau** (en-tête) : cadre à équerres fines + 1·9·9·6 en or aux coins, emblème,
  wordmark, « CONGLOMERAT · HUB ».
- **Signature** (pied de page, à droite) : « fondé par Alpharid » + blason, petit, argent atténué.
- **Division** : grande lettre grecque serif, « DIVISION » en kicker, nom en capitales
  espacées, compteur de filiales, filet avec point de lumière doré à gauche.
- **Carte filiale** : panneau marine, filets argent 12 %, code mono `α-01`, statut à pastille.
  Survol : le panneau s'éclaircit et un filet doré s'allume en haut (l'intersection du X).
- **Vignette de carte** : capture réelle 16:9, désaturée (≈70 %) et voilée de marine ;
  au survol la couleur revient (la lumière du X qui s'allume). Sans capture : plaque
  marine, petites équerres du sceau, lettre grecque de la division + nom en capitales.
- **Fiche filiale** (dialog) : capture en grand + miniatures (la sélectionnée porte un
  filet doré), puis panneau marine, mêmes équerres que le sceau, filet doré
  du haut allumé ; titre en capitales espacées, accroche en serif italique, registre
  `dl` en mono (Division, Code source, Vitrine, Dernière version, Mots-clés).
- **Recherche** : champ souligné (le filet passe au bronze au focus), puces de statut
  reprenant les pastilles ; compteur mono `08 / 24`.
- **Statuts** : pas d'arc-en-ciel. Pastille + niveau d'argent ; seul `prod` est doré.
  `wip` = cercle vide, `concept` = cercle pointillé.
- **Boutons** : *Lancer* = argent poli plein (action principale, client lourd) ;
  *Installer* = contour argent ; *Dépôt ↗* = lien texte.

## 5. Ton
Lexique de holding : *filiale*, *division*,
*registre*, *sceau*. Sobre, jamais grandiloquent dans le texte : la puissance passe
par la retenue visuelle.

## 6. Questions ouvertes
- Vectoriels d'origine de la graphiste : non récupérés (SVG refaits par tracé, voir §1).
