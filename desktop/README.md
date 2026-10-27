# desktop/ — client lourd Electron

Même page que la vitrine (`../web/` + `../data/`, servis via le schéma `ach://`), plus
ce que le web ne peut pas faire : **installer** et **lancer** les filiales.

```bash
npm install                 # à la racine du dépôt (workspace)
npx install-electron        # Electron ≥ 45 ne télécharge plus son binaire à l'install
npm start -w desktop        # lance le client (lit le dépôt en direct)
npm run dist -w desktop     # → desktop/dist/ACH-<version>-setup.exe + latest.yml → GitHub Release
```

## Contenu en direct et mises à jour
- Packagé, le client lit le **contenu** (catalogue, fiches, captures) sur la vitrine
  https://alpharid.github.io/ACH/ et le garde en cache (`%APPDATA%\ACH\live\`) pour
  démarrer hors ligne ; à défaut, la copie embarquée. Le **code** de la page est celui du
  client. En dev, tout vient du dépôt ; `ACH_SITE_URL=<url>` force le direct (tests).
- **Mise à jour automatique** : au démarrage, `electron-updater` lit `latest.yml` dans la
  dernière Release de `Alpharid/ACH`, télécharge en fond, prévient (toast) et installe à
  la fermeture. Publier une version = exe + blockmap + `latest.yml` dans la Release.

## Fichiers
- `main.js` — fenêtre, IPC, mise à jour automatique, liens externes ouverts dans le
  navigateur ; n'installe que depuis des dépôts `Alpharid/…`.
- `lib/site.js` — schéma `ach://` (ne sert que `web/` et `data/`), contenu en direct + cache,
  catalogue chargé une fois et partagé avec la page.
- `preload.js` — expose `window.ACH` : `state()`, `launch(id)`, `install(id)`, `onProgress(cb)`,
  `onNotice(cb)` (0.2+).
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
Au premier lancement, le jeton embarqué est recopié dans `%APPDATA%\ACH\token.json`, pour
survivre aux mises à jour automatiques (qui installent le build public, sans jeton).
