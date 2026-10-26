// The local library: where ACH installs filiales and what it remembers about them.
//   %LOCALAPPDATA%\Alpharium\ACH\library\<id>\   installed files (manifest or zip builds)
//   <userData>\library.json                      { id: { version, build, mode, dir, exe, at } }

const fs = require("node:fs");
const path = require("node:path");
const { app } = require("electron");

const ROOT = path.join(process.env.LOCALAPPDATA || app.getPath("userData"), "Alpharium", "ACH", "library");
const INDEX = () => path.join(app.getPath("userData"), "library.json");

const dirFor = id => path.join(ROOT, id);

function read() {
  try { return JSON.parse(fs.readFileSync(INDEX(), "utf8")); } catch (_) { return {}; }
}

function get(id) {
  return read()[id] || null;
}

function set(id, entry) {
  const all = read();
  all[id] = { ...entry, at: new Date().toISOString() };
  fs.mkdirSync(path.dirname(INDEX()), { recursive: true });
  fs.writeFileSync(INDEX(), JSON.stringify(all, null, 2));
}

module.exports = { ROOT, dirFor, read, get, set };
