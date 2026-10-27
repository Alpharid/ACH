// Bridge exposed to the page as window.ACH. Its presence is what tells web/assets/app.js
// it runs in the desktop client (Lancer / Installer buttons). Only project ids cross it;
// the main process looks everything else up in its own copy of the catalog.

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ACH", {
  // { id: { launch: "run" | "folder" | null, installed: version | null } }
  state: () => ipcRenderer.invoke("ach:state"),
  // → { ok, message }
  launch: id => ipcRenderer.invoke("ach:launch", id),
  install: id => ipcRenderer.invoke("ach:install", id),
  // cb({ id, ratio: 0..1 | null, message }) while an install runs; returns an unsubscribe.
  onProgress: cb => {
    const h = (_e, d) => cb(d);
    ipcRenderer.on("ach:progress", h);
    return () => ipcRenderer.removeListener("ach:progress", h);
  },
  // cb({ ok, message }) for messages from the client itself (update ready…).
  onNotice: cb => {
    const h = (_e, d) => cb(d);
    ipcRenderer.on("ach:notice", h);
    return () => ipcRenderer.removeListener("ach:notice", h);
  },
});
