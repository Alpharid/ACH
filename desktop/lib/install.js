// Installing a filiale from the latest GitHub release of `install.repo`. The release decides
// the mode:
//   manifest.json  → Godot builds of the Alpharium launchers: each file of the manifest comes
//                    from a zipped asset (possibly of another release, e.g. the shared
//                    runtime), is checked against its sha256 and copied into the library.
//                    Files already up to date are kept, so updates only fetch what changed.
//   *.zip Windows  → portable build, extracted into the library.
//   *.exe / *.msi  → installer, downloaded and started (it installs where it wants).

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const crypto = require("node:crypto");
const { spawn } = require("node:child_process");
const gh = require("./github");
const library = require("./library");
const { findLauncher, start } = require("./launch");

const TAR = path.join(process.env.SystemRoot || "C:\\Windows", "System32", "tar.exe"); // bsdtar, reads zip

function extract(zip, dest) {
  fs.mkdirSync(dest, { recursive: true });
  return new Promise((res, rej) => {
    const p = spawn(TAR, ["-xf", zip, "-C", dest], { windowsHide: true });
    p.once("error", rej);
    p.once("exit", code => (code === 0 ? res() : rej(new Error(`extraction de ${path.basename(zip)} impossible (${code})`))));
  });
}

function sha256(file) {
  return new Promise((res, rej) => {
    const h = crypto.createHash("sha256");
    fs.createReadStream(file).on("error", rej).on("data", d => h.update(d)).on("end", () => res(h.digest("hex")));
  });
}

const fresh = d => { fs.rmSync(d, { recursive: true, force: true }); fs.mkdirSync(d, { recursive: true }); return d; };

// Plain relative file names only: a manifest never writes outside the library folder.
function safeName(name) {
  if (!name || path.isAbsolute(name) || name.split(/[\\/]/).includes("..")) throw new Error(`nom de fichier refusé : ${name}`);
  return name;
}

function findFile(root, name) {
  const direct = path.join(root, name);
  if (fs.existsSync(direct)) return direct;
  const base = path.basename(name);
  for (const e of fs.readdirSync(root, { withFileTypes: true, recursive: true })) {
    if (e.isFile() && e.name === base) return path.join(e.parentPath || e.path, e.name);
  }
  return null;
}

// Progress over a known number of bytes, reported as a ratio.
function meter(total, report, message) {
  let done = 0;
  return n => { done += n; report(total ? Math.min(done / total, 1) : null, message); };
}

async function installManifest(p, rel, manifestAsset, tmp, report) {
  const repo = p.install.repo;
  const mPath = path.join(tmp, "manifest.json");
  await gh.download(repo, manifestAsset, mPath, () => {});
  const m = JSON.parse(fs.readFileSync(mPath, "utf8"));
  const dir = library.dirFor(p.id);
  fs.mkdirSync(dir, { recursive: true });

  // Which files are missing or stale, grouped by the (release, asset) that carries them.
  report(null, "Vérification des fichiers installés…");
  const groups = new Map();
  for (const f of m.files || []) {
    const dest = path.join(dir, safeName(f.name));
    if (f.sha256 && fs.existsSync(dest) && (await sha256(dest)) === f.sha256) continue;
    const key = `${f.release || rel.tag_name}|${f.asset}`;
    if (!groups.has(key)) groups.set(key, { tag: f.release || rel.tag_name, asset: f.asset, zipSha: f.zip_sha256, size: f.zip_size || 0, files: [] });
    groups.get(key).files.push(f);
  }

  const exeFile = (m.files || []).map(f => f.name).find(n => /\.exe$/i.test(n)) || null;
  const record = { mode: "manifest", version: m.version, build: m.build_id, dir, exe: exeFile };
  if (!groups.size) { library.set(p.id, record); return { version: m.version, upToDate: true }; }

  const total = [...groups.values()].reduce((s, g) => s + g.size, 0);
  const tick = meter(total, report, `Téléchargement de ${m.version}…`);
  let i = 0;
  for (const g of groups.values()) {
    const release = g.tag === rel.tag_name ? rel : await gh.releaseByTag(repo, g.tag);
    const asset = release && (release.assets || []).find(a => a.name === g.asset);
    if (!asset) throw new Error(`${g.asset} introuvable dans ${g.tag}`);
    const zip = path.join(tmp, `${i}-${asset.name}`);
    const got = await gh.download(repo, asset, zip, tick);
    if (g.zipSha && got !== g.zipSha) throw new Error(`${asset.name} corrompu (empreinte)`);
    if (!/\.zip$/i.test(asset.name)) { // raw asset: it is the file itself
      g.files.forEach(f => fs.copyFileSync(zip, path.join(dir, f.name)));
      continue;
    }
    report(null, `Extraction de ${asset.name}…`);
    const out = path.join(tmp, `x${i++}`);
    await extract(zip, out);
    for (const f of g.files) {
      const src = findFile(out, f.name);
      if (!src) throw new Error(`${f.name} absent de ${asset.name}`);
      if (f.sha256 && (await sha256(src)) !== f.sha256) throw new Error(`${f.name} corrompu (empreinte)`);
      const dest = path.join(dir, f.name);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      try { fs.copyFileSync(src, dest); }
      catch (e) { throw new Error(e.code === "EBUSY" || e.code === "EPERM" ? `${p.name} est ouvert : fermez-le puis réessayez` : e.message); }
    }
  }
  library.set(p.id, record);
  return { version: m.version };
}

async function installZip(p, rel, asset, tmp, report) {
  const zip = path.join(tmp, asset.name);
  await gh.download(p.install.repo, asset, zip, meter(asset.size, report, `Téléchargement de ${rel.tag_name}…`));
  report(null, "Extraction…");
  const out = path.join(tmp, "x");
  await extract(zip, out);
  // A zip holding a single folder: that folder is the app.
  const top = fs.readdirSync(out, { withFileTypes: true });
  const root = top.length === 1 && top[0].isDirectory() ? path.join(out, top[0].name) : out;

  const dir = library.dirFor(p.id);
  try { fs.rmSync(dir, { recursive: true, force: true }); }
  catch (_) { throw new Error(`${p.name} est ouvert : fermez-le puis réessayez`); }
  fs.mkdirSync(path.dirname(dir), { recursive: true });
  fs.renameSync(root, dir);
  library.set(p.id, { mode: "zip", version: rel.tag_name, dir, exe: findLauncher(dir, p.name) });
  return { version: rel.tag_name };
}

async function runInstaller(p, rel, asset, report) {
  const file = path.join(os.tmpdir(), "ACH", p.id, asset.name);
  await gh.download(p.install.repo, asset, file, meter(asset.size, report, `Téléchargement de ${rel.tag_name}…`));
  if (/\.msi$/i.test(asset.name)) spawn("msiexec.exe", ["/i", file], { detached: true, stdio: "ignore" }).unref();
  else await start(file);
  library.set(p.id, { mode: "installer", version: rel.tag_name, dir: null, exe: null });
  return { version: rel.tag_name, installer: true };
}

const WINDOWS_ZIP = a => /\.zip$/i.test(a.name) && !/mac|linux|darwin/i.test(a.name);

async function install(p, report) {
  report(null, "Recherche de la dernière version…");
  const rel = await gh.latestRelease(p.install.repo);
  if (!rel) {
    throw new Error(p.install.private && !gh.getToken()
      ? "builds privés : jeton d'accès absent de ce client" : "aucune version publiée");
  }
  const assets = rel.assets || [];
  const tmp = fresh(path.join(library.ROOT, ".tmp", p.id));
  try {
    const manifest = assets.find(a => a.name === "manifest.json");
    if (manifest) return await installManifest(p, rel, manifest, tmp, report);
    const zip = assets.find(a => WINDOWS_ZIP(a) && /win/i.test(a.name)) || assets.find(WINDOWS_ZIP);
    if (zip) return await installZip(p, rel, zip, tmp, report);
    const setup = assets.find(a => /\.(exe|msi)$/i.test(a.name));
    if (setup) return await runInstaller(p, rel, setup, report);
    throw new Error(`aucun build Windows dans ${rel.tag_name}`);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

module.exports = { install };
