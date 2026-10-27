// ACH desktop client. Serves the same page as the public showcase (web/ + data/) through the
// ach:// scheme, and adds what the web cannot do: install and launch the filiales. Content
// follows the showcase (lib/site.js); the client itself updates from the GitHub releases.

const path = require("node:path");
const fs = require("node:fs");
const { app, BrowserWindow, ipcMain, protocol, shell } = require("electron");
const { install } = require("./lib/install");
const { launch, resolve } = require("./lib/launch");
const library = require("./lib/library");
const site = require("./lib/site");

const HOME = "ach://app/web/index.html";

// The live catalog is trusted like the auto-update (both come from Alpharid/ACH), but
// builds are only ever installed from Alpharid's own repos.
const OWN_REPO = /^Alpharid\/[\w.-]+$/;

protocol.registerSchemesAsPrivileged([
  { scheme: "ach", privileges: { standard: true, secure: true, supportFetchAPI: true } },
]);

let catalog, byId; // loaded once at startup, see site.loadCatalog
let win;
const busy = new Set(); // ids being installed

function state() {
  const out = {};
  for (const p of catalog.projects) {
    if (!p.launch && !p.install) continue;
    const own = library.get(p.id);
    const target = resolve(p);
    out[p.id] = { launch: target ? target.kind : null, installed: own ? own.version : null };
  }
  return out;
}

const fail = e => ({ ok: false, message: e && e.message ? e.message : String(e) });

function setupIpc() {
  ipcMain.handle("ach:state", () => state());

  ipcMain.handle("ach:launch", async (_e, id) => {
    const p = byId.get(id);
    if (!p) return fail("filiale inconnue");
    try { return { ok: true, message: `${p.name} : ${await launch(p)}` }; } catch (e) { return fail(e); }
  });

  ipcMain.handle("ach:install", async (e, id) => {
    const p = byId.get(id);
    if (!p || !p.install) return fail("rien à installer");
    if (!OWN_REPO.test(p.install.repo || "")) return fail(`dépôt de builds refusé : ${p.install.repo}`);
    if (busy.has(id)) return fail("installation déjà en cours");
    busy.add(id);
    let last = 0;
    const report = (ratio, message) => { // ~10 updates/s at most
      const now = Date.now();
      if (ratio !== null && ratio < 1 && now - last < 100) return;
      last = now;
      if (!e.sender.isDestroyed()) e.sender.send("ach:progress", { id, ratio, message });
    };
    try {
      const r = await install(p, report);
      const message = r.upToDate ? `${p.name} est déjà à jour (${r.version})`
        : r.installer ? `${p.name} ${r.version} : installeur lancé`
        : `${p.name} ${r.version} installé`;
      return { ok: true, message };
    } catch (err) {
      return fail(err);
    } finally {
      busy.delete(id);
    }
  });
}

// Toast in the page (shown by web/assets/app.js when the bridge offers onNotice).
function notice(ok, message) {
  if (win && !win.isDestroyed()) win.webContents.send("ach:notice", { ok, message });
}

// Updates come from the GitHub releases of Alpharid/ACH (latest.yml). Downloaded in the
// background, installed silently when ACH is closed. Offline or rate-limited: next start.
function checkUpdates() {
  if (!app.isPackaged) return;
  const { autoUpdater } = require("electron-updater");
  autoUpdater.on("update-downloaded", info =>
    notice(true, `Mise à jour d'ACH ${info.version} prête : elle s'installera à la fermeture.`));
  autoUpdater.on("error", () => {});
  autoUpdater.checkForUpdates().catch(() => {});
}

// A token bundled in an installer (private family build) would vanish with the first
// update, which installs the public build: keep a copy in userData, where updates never go.
function keepBundledToken() {
  if (!app.isPackaged) return;
  const bundled = path.join(process.resourcesPath, "token.json");
  const kept = path.join(app.getPath("userData"), "token.json");
  try { if (!fs.existsSync(kept)) fs.copyFileSync(bundled, kept); } catch (_) { /* no bundled token */ }
}

function createWindow() {
  win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 760,
    minHeight: 560,
    backgroundColor: "#0a0d16",
    autoHideMenuBar: true,
    icon: path.join(site.BUNDLED, "web", "assets", "brand", "favicon.ico"),
    title: "ACH — Alpharium",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      sandbox: true,
    },
  });

  // Everything outside the app (GitHub, links in the fiches) opens in the browser.
  const external = url => { if (/^https:\/\//i.test(url)) shell.openExternal(url); };
  win.webContents.setWindowOpenHandler(({ url }) => { external(url); return { action: "deny" }; });
  win.webContents.on("will-navigate", (e, url) => {
    if (!url.startsWith("ach://app/")) { e.preventDefault(); external(url); }
  });

  win.loadURL(HOME);
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (!win) return;
    if (win.isMinimized()) win.restore();
    win.focus();
  });
  app.whenReady().then(async () => {
    keepBundledToken();
    catalog = await site.loadCatalog();
    byId = new Map(catalog.projects.map(p => [p.id, p]));
    protocol.handle("ach", site.handler(catalog));
    setupIpc();
    createWindow();
    checkUpdates();
  });
  app.on("window-all-closed", () => app.quit());
}
