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

## À trancher (ouvert)
- Hébergement de la vitrine : rendre `Alpharid/ACH` public (vitrine sans secret) vs
  déployer `web/` vers un repo public dédié `ach-web` (pattern `-builds`) pour garder la
  source privée. GitHub Pages gratuit n'est dispo que sur repo public.
- Rangement des cas à cheval : MixMaster (services vs jeux), Alphred (services vs apps),
  SA Chill Trainer (outils vs jeux).
- Inclusion de SE2_Trainer (repo à créer), Project_ALL, maquettes Alpharium, dépôts JDR Arx.
