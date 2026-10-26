// Launching a filiale. Resolution order:
//   1. the build ACH installed in its library (library.json → exe);
//   2. the catalog's local folder: `launch.target` if given, else a guessed launcher;
//   3. the folder itself (dev projects with nothing to run: "Ouvrir" opens it).

const fs = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");
const { shell } = require("electron");
const library = require("./library");

const NOT_A_LAUNCHER = /unins|setup|install|crash|update|elevate|helper|redist/i;
const BATCH_LAUNCHER = /^(lancer|jouer|launch|play|start)\b.*\.(bat|cmd)$/i;

const exists = f => { try { return fs.statSync(f).isFile(); } catch (_) { return false; } };
const isDir = d => { try { return fs.statSync(d).isDirectory(); } catch (_) { return false; } };
const squash = s => String(s).toLowerCase().replace(/[^a-z0-9]/g, "");

// Best guess among the files at the root of `dir`: an exe named *launcher*, then one named
// after the project, then the only exe, then a Lancer/Jouer .bat, then any exe.
function findLauncher(dir, name) {
  let files;
  try { files = fs.readdirSync(dir, { withFileTypes: true }).filter(f => f.isFile()).map(f => f.name); }
  catch (_) { return null; }
  const exes = files.filter(f => /\.exe$/i.test(f) && !NOT_A_LAUNCHER.test(f));
  const key = squash(name);
  return exes.find(f => /launcher/i.test(f))
    || exes.find(f => key && squash(f).includes(key))
    || (exes.length === 1 ? exes[0] : null)
    || files.find(f => BATCH_LAUNCHER.test(f))
    || exes[0] || null;
}

// → { kind: "run" | "folder", file } or null when nothing is available on this PC.
function resolve(p) {
  const own = library.get(p.id);
  if (own && own.exe && exists(path.join(own.dir, own.exe))) return { kind: "run", file: path.join(own.dir, own.exe) };

  const l = p.launch;
  if (!l || l.type !== "local" || !l.dir || !isDir(l.dir)) return null;
  const name = l.target || findLauncher(l.dir, p.name);
  const file = name && path.join(l.dir, name);
  if (file && exists(file)) return { kind: "run", file };
  return { kind: "folder", file: l.dir };
}

// Starts detached so the program outlives ACH. Batch files get their own console; an exe
// that needs elevation fails to spawn → hand it to the shell, which shows the UAC prompt.
function start(file) {
  const cwd = path.dirname(file);
  const ext = path.extname(file).toLowerCase();
  if (ext !== ".exe" && ext !== ".bat" && ext !== ".cmd") return shell.openPath(file).then(err => { if (err) throw new Error(err); });
  const [cmd, args] = ext === ".exe" ? [file, []] : ["cmd.exe", ["/d", "/c", file]];
  return new Promise((res, rej) => {
    const child = spawn(cmd, args, { cwd, detached: true, stdio: "ignore" });
    child.once("spawn", () => { child.unref(); res(); });
    child.once("error", () => shell.openPath(file).then(err => (err ? rej(new Error(err)) : res())));
  });
}

async function launch(p) {
  const target = resolve(p);
  if (!target) throw new Error("rien à lancer sur ce PC — installez-la d'abord");
  if (target.kind === "folder") {
    const err = await shell.openPath(target.file);
    if (err) throw new Error(err);
    return "dossier ouvert";
  }
  await start(target.file);
  return `${path.basename(target.file)} lancé`;
}

module.exports = { findLauncher, resolve, launch, start };
