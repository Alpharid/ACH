// GitHub releases: API calls, asset downloads (streamed, hashed), optional read-only token.
// The token is only needed for private build repos (install.private) and never leaves the
// main process: it is not exposed to the renderer and not stored in git.

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { app } = require("electron");

const API = "https://api.github.com";
const UA = "ACH-desktop";

let token; // undefined = not looked up yet, null = none

// token.json = { "token": "github_pat_…" } — read-only, contents:read on the builds repos.
// Looked up next to the packaged app (bundled at build time), then in userData, then in
// desktop/ during development.
function getToken() {
  if (token !== undefined) return token;
  token = process.env.ACH_GITHUB_TOKEN || null;
  const spots = [
    app.isPackaged ? path.join(process.resourcesPath, "token.json") : null,
    path.join(app.getPath("userData"), "token.json"),
    app.isPackaged ? null : path.join(__dirname, "..", "token.json"),
  ].filter(Boolean);
  for (const f of spots) {
    if (token) break;
    try { token = JSON.parse(fs.readFileSync(f, "utf8")).token || null; } catch (_) { /* absent */ }
  }
  return token;
}

function headers(extra) {
  const h = { "User-Agent": UA, "X-GitHub-Api-Version": "2022-11-28", ...extra };
  const t = getToken();
  if (t) h.Authorization = `Bearer ${t}`;
  return h;
}

async function api(route) {
  const r = await fetch(API + route, { headers: headers({ Accept: "application/vnd.github+json" }) });
  if (r.status === 404) return null; // also what a private repo looks like without a token
  if (!r.ok) {
    const limited = r.status === 403 && r.headers.get("x-ratelimit-remaining") === "0";
    throw new Error(limited ? "limite de l'API GitHub atteinte, réessayez dans une heure" : `GitHub ${r.status}`);
  }
  return r.json();
}

// releases/latest skips pre-releases; fall back to the newest one of any kind (same rule
// as the web page).
async function latestRelease(repo) {
  const latest = await api(`/repos/${repo}/releases/latest`);
  if (latest) return latest;
  const list = await api(`/repos/${repo}/releases?per_page=1`);
  return (list && list[0]) || null;
}

const releaseByTag = (repo, tag) => api(`/repos/${repo}/releases/tags/${encodeURIComponent(tag)}`);

// Downloads through the API URL (works for private repos). GitHub answers with a redirect
// to signed storage: it is followed by hand so the token is never sent there.
async function download(repo, asset, dest, onBytes) {
  const url = `${API}/repos/${repo}/releases/assets/${asset.id}`;
  let r = await fetch(url, { headers: headers({ Accept: "application/octet-stream" }), redirect: "manual" });
  if (r.status >= 300 && r.status < 400) {
    r = await fetch(r.headers.get("location"), { headers: { "User-Agent": UA } });
  }
  if (!r.ok || !r.body) throw new Error(`téléchargement de ${asset.name} : HTTP ${r.status}`);

  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const hash = crypto.createHash("sha256");
  const out = fs.createWriteStream(dest);
  try {
    for await (const chunk of r.body) {
      hash.update(chunk);
      if (!out.write(chunk)) await new Promise(res => out.once("drain", res));
      onBytes(chunk.length);
    }
  } finally {
    await new Promise(res => out.end(res));
  }
  return hash.digest("hex");
}

module.exports = { getToken, latestRelease, releaseByTag, download };
