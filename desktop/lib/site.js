// What the window shows, served on ach://app/. The page's code (web/) ships with the client
// and changes with it (auto-update). Its content (catalog, fiches, captures) is read live
// from the public showcase, so a client installed months ago still lists every filiale.
// Each live file is cached for offline starts; the copy bundled at build time comes last.
//
// Live only in packaged builds: in development the repo is the source of truth.
// ACH_SITE_URL points the client at another copy of the showcase (tests).

const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { app, net } = require("electron");

const REMOTE = (process.env.ACH_SITE_URL || "https://alpharid.github.io/ACH/").replace(/\/?$/, "/");
const LIVE = app.isPackaged || !!process.env.ACH_SITE_URL;

// Repo root in development; packaged builds carry web/ and data/ in resources/site.
const BUNDLED = app.isPackaged ? path.join(process.resourcesPath, "site") : path.join(__dirname, "..", "..");
const CACHE = path.join(app.getPath("userData"), "live");
const SERVED = ["web", "data"].map(d => path.sep + d + path.sep);

// Content that follows the showcase. Everything else under web/ is code.
const isLive = rel => /^[\\/](data[\\/]|web[\\/]assets[\\/]filiales[\\/])/.test(rel);

// The showcase puts web/ at its root and data/ next to it (.github/workflows/pages.yml).
const remoteUrl = rel => REMOTE + rel.split(path.sep).slice(1)
  .filter((part, i) => !(i === 0 && part === "web")).map(encodeURIComponent).join("/");

let offline = !LIVE; // after one network failure, the rest of the session reads the cache

// → Buffer from the showcase, null when it no longer has the file, undefined when unreachable.
async function fetchRemote(rel) {
  if (offline) return undefined;
  try {
    const r = await net.fetch(remoteUrl(rel), { cache: "no-cache", signal: AbortSignal.timeout(6000) });
    if (r.status === 404) return null;
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return Buffer.from(await r.arrayBuffer());
  } catch (_) {
    offline = true;
    return undefined;
  }
}

function writeCache(rel, buf) {
  const file = path.join(CACHE, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file + ".part", buf);
  fs.renameSync(file + ".part", file);
  return file;
}

const isFile = f => { try { return fs.statSync(f).isFile(); } catch (_) { return false; } };

// Normalised path under the site ("\data\catalog.json"), or null outside web/ and data/
// (in development the bundled root is the repo, desktop/token.json included).
function relPath(url) {
  const rel = path.normalize(decodeURIComponent(new URL(url).pathname));
  return SERVED.some(d => rel.startsWith(d)) ? rel : null;
}

// Local file to serve for `rel`: live copy, else cached one, else bundled one.
async function resolveFile(rel) {
  if (isLive(rel)) {
    const buf = await fetchRemote(rel);
    if (buf) return writeCache(rel, buf);
    if (buf === null) { fs.rmSync(path.join(CACHE, rel), { force: true }); return null; } // removed upstream
    if (isFile(path.join(CACHE, rel))) return path.join(CACHE, rel);
  }
  const file = path.join(BUNDLED, rel);
  return isFile(file) ? file : null;
}

const validCatalog = c => c && Array.isArray(c.divisions) && Array.isArray(c.projects)
  && c.projects.every(p => p && typeof p.id === "string" && typeof p.name === "string");

// Read once at startup and shared by the page and the main process, so both always agree on
// what each id means. A broken live copy is ignored rather than cached.
async function loadCatalog() {
  const rel = path.join(path.sep, "data", "catalog.json");
  const buf = await fetchRemote(rel);
  if (buf) {
    try {
      const c = JSON.parse(buf.toString("utf8"));
      if (validCatalog(c)) { writeCache(rel, buf); return c; }
    } catch (_) { /* fall back below */ }
  }
  for (const file of [path.join(CACHE, rel), path.join(BUNDLED, rel)]) {
    try {
      const c = JSON.parse(fs.readFileSync(file, "utf8"));
      if (validCatalog(c)) return c;
    } catch (_) { /* next */ }
  }
  throw new Error("catalog.json introuvable");
}

// protocol.handle callback. catalog.json is answered from the copy the main process uses.
function handler(catalog) {
  const catalogRel = path.join(path.sep, "data", "catalog.json");
  return async req => {
    const rel = relPath(req.url);
    if (!rel) return new Response("not found", { status: 404 });
    if (rel === catalogRel) {
      return new Response(JSON.stringify(catalog), { headers: { "content-type": "application/json" } });
    }
    const file = await resolveFile(rel);
    return file ? net.fetch(pathToFileURL(file).toString()) : new Response("not found", { status: 404 });
  };
}

module.exports = { BUNDLED, loadCatalog, handler };
