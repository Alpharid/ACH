# desktop/ — client lourd Electron

Même page que la vitrine (`../web/` + `../data/`, servis via le schéma `ach://`), plus
ce que le web ne peut pas faire : **installer** et **lancer** les filiales.

```bash
npm install                 # à la racine du dépôt (workspace)
npx install-electron        # Electron ≥ 45 ne télécharge plus son binaire à l'install
npm start -w desktop        # lance le client (lit le dépôt en direct)
npm run dist -w desktop     # → desktop/dist/ACH-<version>-setup.exe (NSIS) → GitHub Release
```

## Fichiers
- `main.js` — fenêtre, schéma `ach://` (ne sert que `web/` et `data/`), IPC, liens externes
  ouverts dans le navigateur.
- `preload.js` — expose `window.ACH` : `state()`, `launch(id)`, `install(id)`, `onProgress(cb)`.
  Seuls des `id` traversent le pont ; le main relit le catalogue lui-même.
- `lib/install.js` — dernière release de `install.repo` (repli sur la dernière pré-version) :
  - `manifest.json` (builds Godot des launchers Alpharium) → fichiers vérifiés en sha256,
    copiés dans la bibliothèque ; seuls les fichiers changés sont retéléchargés ;
  - `.zip` Windows → build portable extrait dans la bibliothèque ;
  - `.exe` / `.msi` → installeur téléchargé puis lancé.
- `lib/launch.js` — build installé par ACH, sinon `launch.dir` + `launch.target` (ou devinette),
  sinon « Ouvrir » le dossier.
- `lib/library.js` — bibliothèque : `%LOCALAPPDATA%\Alpharium\ACH\library\<id>\`,
  index `%APPDATA%\ACH\library.json`.
- `lib/github.js` — API + téléchargements (redirection suivie à la main : le jeton ne part
  jamais vers le stockage signé).

## Jeton (builds privés, ex. SA_COOP)
`token.json` = `{ "token": "github_pat_…" }` (lecture seule, *contents:read* sur les dépôts de
builds). Cherché dans : `resources/` de l'app installée (embarqué au build s'il est présent
dans `desktop/`), puis `%APPDATA%\ACH\token.json`, puis `desktop/token.json` en dev.
Variable `ACH_GITHUB_TOKEN` aussi acceptée. **Jamais dans git** (`.gitignore`).
⚠ Un `.exe` construit avec un jeton embarqué ne se publie **pas** en release publique.
