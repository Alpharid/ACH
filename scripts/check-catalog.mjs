// Validates data/catalog.json: required fields, division refs, unique ids, enums.
// Usage: npm run catalog:check
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(import.meta.url), "..", "..");
const STATUS = new Set(["prod", "beta", "alpha", "wip", "concept"]);
const errors = [];

const cat = JSON.parse(await readFile(join(ROOT, "data", "catalog.json"), "utf8"));
const divIds = new Set(cat.divisions.map(d => d.id));
const seen = new Set();

for (const p of cat.projects) {
  const where = p.id || p.name || "(sans id)";
  if (!p.id) errors.push(`${where}: id manquant`);
  if (seen.has(p.id)) errors.push(`${where}: id en double`);
  seen.add(p.id);
  if (!p.name) errors.push(`${where}: name manquant`);
  if (!divIds.has(p.division)) errors.push(`${where}: division inconnue "${p.division}"`);
  if (!STATUS.has(p.status)) errors.push(`${where}: status invalide "${p.status}"`);
  if (p.install && p.install.type === "github-release" && !p.install.repo)
    errors.push(`${where}: install.repo manquant`);
}

if (errors.length) {
  console.error(`✗ ${errors.length} problème(s) :`);
  errors.forEach(e => console.error("  - " + e));
  process.exit(1);
}
console.log(`✓ catalog.json OK — ${cat.projects.length} projets, ${cat.divisions.length} divisions`);
