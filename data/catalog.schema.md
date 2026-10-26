# catalog.json — schéma

Source de vérité unique du HUB. La page web **et** le client Electron lisent ce
fichier. Aucun secret ici (le fichier est destiné à être public) : pas de token,
pas d'adresse de serveur, pas de chemin contenant des données perso.

## Racine
- `brand` : `{ name, short, owner, since, tagline, updated }`
  - `since` : année d'origine d'Alpharium (1996, les chiffres d'angle du logo)
- `divisions` : liste ordonnée `{ id, glyph, name, label, blurb }`
  - `glyph` : lettre grecque minuscule de la division (α β γ δ…, issue du logo) ; sert
    aussi de préfixe aux codes de filiale affichés (`α-01`, `β-03`…)
  - `id` ∈ `jeux` | `apps` | `outils` | `services`
- `projects` : liste de projets (voir ci-dessous)

## Projet
| champ | type | rôle |
|---|---|---|
| `id` | string | identifiant unique (kebab-case) |
| `name` | string | nom affiché |
| `division` | string | `id` de division |
| `status` | enum | `prod` \| `beta` \| `alpha` \| `wip` \| `concept` |
| `visibility` | enum | `public` \| `private` (du dépôt source) |
| `tagline` | string | une ligne |
| `description` | string | 1-3 phrases, **public-safe** |
| `source` | string \| null | `owner/repo` du code source |
| `public` | string \| null | `owner/repo` public (builds/open-source) servant de vitrine |
| `github` | url \| null | lien GitHub affiché (null = bouton « privé » désactivé) |
| `install` | obj \| null | `{ type:"github-release", repo, private? }` — **client lourd only** |
| `launch` | obj \| null | `{ type:"local", dir }` — **client lourd only** |
| `tags` | string[] | mots-clés |

## Règles
- `launch` et `install` n'ont d'effet que dans le client Electron (bridge `window.ACH`).
  Sur le web, seuls les liens `github` sont actifs.
- Un dépôt privé reste privé : le bouton GitHub mènera à une 404/login pour les
  non-collaborateurs. On ne contourne jamais ça.
- `install.private: true` → dépôt de builds privé (fichiers propriétaires) :
  l'install nécessite un jeton lecture seule côté client, jamais exposé sur le web.
