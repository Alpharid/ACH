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

## À trancher (ouvert)
- Hébergement de la vitrine : rendre `Alpharid/ACH` public (vitrine sans secret) vs
  déployer `web/` vers un repo public dédié `ach-web` (pattern `-builds`) pour garder la
  source privée. GitHub Pages gratuit n'est dispo que sur repo public.
- Rangement des cas à cheval : MixMaster (services vs jeux), Alphred (services vs apps),
  SA Chill Trainer (outils vs jeux).
- Inclusion de SE2_Trainer (repo à créer), Project_ALL, maquettes Alpharium, dépôts JDR Arx.
