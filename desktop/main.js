// ACH desktop client. Serves the same page as the public showcase (web/ + data/) through the
// ach:// scheme, and adds what the web cannot do: install and launch the filiales.

const path = require("node:path");
const fs = require("node:fs");
const { pathToFileURL } = require("node:url");
const { app, BrowserWindow, ipcMain, net, protocol, shell } = require("electron");
const { install } = require("./lib/install");
const { launch, resolve } = require("./lib/launch");
const library = require("./lib/library");

// Repo root in development; packaged builds carry web/ and data/ in resources/site.
const SITE = app.isPackaged ? path.join(process.resourcesPath, "site") : path.join(__dirname, "..");
const SERVED = ["web", "data"].map(d => path.join(SITE, d) + path.sep);
const HOME = "ach://app/web/index.html";

protocol.registerSchemesAsPrivileged([
  { scheme: "ach", privileges: { standard: true, secure: true, supportFetchAPI: true } },
]);

const catalog = JSON.parse(fs.readFileSync(path.join(SITE, "data", "catalog.json"), "utf8"));
const byId = new Map(catalog.projects.map(p => [p.id, p]));

let win;
const busy = new Set(); // ids being installed

function serveSite() {
  protocol.handle("ach", req => {
    const file = path.normalize(path.join(SITE, decodeURIComponent(new URL(req.url).pathname)));
    // Only web/ and data/: in development SITE is the repo root (desktop/token.json lives there).
    if (!SERVED.some(d => file.startsWith(d))) return new Response("not found", { status: 404 });
    return net.fetch(pathToFileURL(file).toString());
  });
}

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

function createWindow() {
  win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 760,
    minHeight: 560,
    backgroundColor: "#0a0d16",
    autoHideMenuBar: true,
    icon: path.join(SITE, "web", "assets", "brand", "favicon.ico"),
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
  app.whenReady().then(() => {
    serveSite();
    setupIpc();
    createWindow();
  });
  app.on("window-all-closed", () => app.quit());
}
