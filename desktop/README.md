# desktop/ — client lourd Electron (à venir)

Pas encore commencé. Prévu (voir `../HANDOVER.md` §4) :

- Electron chargeant `../web/index.html` comme renderer.
- `preload.js` exposant `window.ACH` : `launch(id)`, `install(id)`.
- `install` : dernière release GitHub de `install.repo` → télécharge l'asset Windows →
  lance l'installeur. `install.private:true` → jeton lecture seule embarqué (hors git).
- `launch` : résout un exe/launcher local depuis `launch.dir`.
- Build : electron-builder → `.exe` NSIS. Binaire en **GitHub Release**, jamais en git.
