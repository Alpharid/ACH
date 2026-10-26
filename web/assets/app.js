// ACH web catalog — renderer.
// Reads data/catalog.json (+ the generated data/media.json) and lays projects out by
// division, with a search/status filter and a detail sheet per filiale (shareable as
// #filiale/<id>) showing its captures and its presentation (data/fiches/<id>.md).
// `launch` / `install` actions only exist in the Electron client; the web build
// shows GitHub links and public build downloads instead.

const IS_ELECTRON = typeof window !== "undefined" && !!window.ACH; // desktop bridge, injected by preload

const STATUS_LABEL = {
  prod: "Prod", beta: "Bêta", alpha: "Alpha", wip: "En dev", concept: "Concept",
};

const SHEET_HASH = "#filiale/";

// Folder holding catalog.json, media.json and fiches/ (differs between the repo
// preview and the deployed site, where data/ sits next to the page).
let DATA = "";

async function loadCatalog() {
  for (const dir of ["../data/", "data/", ""]) {
    try {
      const r = await fetch(dir + "catalog.json", { cache: "no-cache" });
      if (!r.ok) continue;
      const catalog = await r.json();
      DATA = dir;
      // Media manifest is optional: without it the page simply shows no captures.
      catalog.media = await fetch(dir + "media.json", { cache: "no-cache" })
        .then(m => (m.ok ? m.json() : {})).catch(() => ({}));
      return catalog;
    } catch (_) { /* try next */ }
  }
  throw new Error("catalog.json introuvable");
}

const shot = (id, n) => `assets/filiales/${id}-${n}.webp`;

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

function link(cls, text, href) {
  const a = el("a", cls, text);
  a.href = href;
  a.target = "_blank";
  a.rel = "noopener";
  return a;
}

// Minimal markdown for the fiches (written by us, public-safe): ### titles, "- " lists,
// paragraphs, **bold**, *italic*, `code`, [links](https://…). Everything is escaped first.
function markdown(src) {
  const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const inline = s => esc(s)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  const out = [];
  let para = [], list = [];
  const flush = () => {
    if (para.length) out.push(`<p>${inline(para.join(" "))}</p>`);
    if (list.length) out.push(`<ul>${list.map(i => `<li>${inline(i)}</li>`).join("")}</ul>`);
    para = []; list = [];
  };
  for (const raw of src.replace(/\r/g, "").split("\n")) {
    const line = raw.trim();
    if (!line) flush();
    else if (/^#{1,6}\s/.test(line)) { flush(); out.push(`<h3>${inline(line.replace(/^#+\s*/, ""))}</h3>`); }
    else if (/^[-*]\s/.test(line)) { if (para.length) flush(); list.push(line.slice(2)); }
    else if (list.length && /^\s/.test(raw)) list[list.length - 1] += " " + line; // wrapped item
    else { if (list.length) flush(); para.push(line); }
  }
  flush();
  return out.join("");
}

// Lowercase, accents stripped: "Tōkyō" matches "tokyo".
function fold(s) {
  return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

// Filiale code shown on cards: division glyph + rank inside the division (α-01, β-03…).
function filialeCode(division, index) {
  return `${division.glyph || division.id}-${String(index + 1).padStart(2, "0")}`;
}

// Public builds can be downloaded from the web; private ones only through the client.
const hasPublicBuilds = p => p.install && p.install.type === "github-release" && !p.install.private;

// Shared by cards and the sheet. Launch/Install exist only in the desktop client.
function actionButtons(p) {
  const actions = [];
  if (IS_ELECTRON && p.launch) {
    const b = el("button", "act act-launch", "▸ Lancer");
    b.addEventListener("click", () => window.ACH.launch(p.id));
    actions.push(b);
  }
  if (IS_ELECTRON && p.install) {
    const b = el("button", "act act-install", "⤓ Installer");
    b.addEventListener("click", () => window.ACH.install(p.id));
    actions.push(b);
  }
  if (p.github) actions.push(link("act act-github", "Dépôt ↗", p.github));
  else actions.push(el("span", "act act-disabled", "privé"));
  return actions;
}

// Card header: capture 1 if any, else a typographic plate (division glyph + name).
function cardMedia(p, code, division, media) {
  const box = el("div", "card-media");
  if (media && media.captures) {
    const img = el("img");
    img.src = `assets/filiales/${p.id}-card.webp`;
    img.alt = "";
    img.loading = "lazy";
    img.decoding = "async";
    box.appendChild(img);
  } else {
    box.classList.add("is-plate");
    const plate = el("span", "plate");
    plate.append(el("span", "plate-glyph", division.glyph || ""), el("span", "plate-name", p.name));
    box.appendChild(plate);
  }
  return box;
}

function projectCard(p, code, division, media) {
  const card = el("article", "card");
  card.dataset.division = p.division;
  card.appendChild(cardMedia(p, code, division, media));

  const meta = el("div", "card-meta");
  meta.appendChild(el("span", "card-code", code));
  meta.appendChild(el("span", `badge badge-${p.status}`, STATUS_LABEL[p.status] || p.status));
  card.appendChild(meta);

  // The title link covers the whole card (see .card-open::after); actions sit above it.
  const title = el("h3", "card-title");
  const open = el("a", "card-open", p.name);
  open.href = SHEET_HASH + p.id;
  title.appendChild(open);
  card.appendChild(title);

  if (p.tagline) card.appendChild(el("p", "card-tagline", p.tagline));
  if (p.description) card.appendChild(el("p", "card-desc", p.description));

  if (Array.isArray(p.tags) && p.tags.length) {
    const tags = el("div", "card-tags");
    p.tags.forEach(t => tags.appendChild(el("span", "tag", t)));
    card.appendChild(tags);
  }

  const actions = el("div", "card-actions");
  actions.append(...actionButtons(p));
  card.appendChild(actions);
  return card;
}

// ── Fiche filiale ────────────────────────────────────────────────────────────

const releases = new Map(); // repo → Promise<release|null>, one API call per repo and visit

function latestRelease(repo) {
  if (!releases.has(repo)) {
    // releases/latest skips pre-releases; fall back to the newest one of any kind.
    const api = `https://api.github.com/repos/${repo}/releases`;
    releases.set(repo, fetch(`${api}/latest`)
      .then(r => (r.ok ? r.json() : fetch(`${api}?per_page=1`).then(l => (l.ok ? l.json() : [])).then(l => l[0] || null)))
      .catch(() => null));
  }
  return releases.get(repo);
}

// Windows build first (.exe > .msi > .zip), else whatever was published.
function pickAsset(assets) {
  for (const ext of [".exe", ".msi", ".zip"]) {
    const a = assets.find(x => x.name.toLowerCase().endsWith(ext));
    if (a) return a;
  }
  return assets[0] || null;
}

function regRow(dl, label, value) {
  dl.appendChild(el("dt", null, label));
  const dd = el("dd");
  if (value instanceof Node) dd.appendChild(value); else dd.textContent = value;
  dl.appendChild(dd);
  return dd;
}

function repoLink(repo) {
  return link("sheet-repo", `${repo} ↗`, `https://github.com/${repo}`);
}

const fiches = new Map(); // id → Promise<html|null>

function loadFiche(id) {
  if (!fiches.has(id)) {
    fiches.set(id, fetch(`${DATA}fiches/${id}.md`, { cache: "no-cache" })
      .then(r => (r.ok ? r.text() : null)).then(md => (md ? markdown(md) : null))
      .catch(() => null));
  }
  return fiches.get(id);
}

// Hero capture + thumbnails to switch between captures.
function fillMedia(box, p, media) {
  box.innerHTML = "";
  const n = (media && media.captures) || 0;
  box.hidden = !n;
  if (!n) return;
  const hero = el("img", "sheet-hero");
  hero.src = shot(p.id, 1);
  hero.alt = `${p.name} — capture 1`;
  box.appendChild(hero);
  if (n < 2) return;
  const thumbs = el("div", "sheet-thumbs");
  for (let i = 1; i <= n; i++) {
    const b = el("button", "sheet-thumb");
    b.type = "button";
    b.setAttribute("aria-label", `Capture ${i}`);
    b.setAttribute("aria-pressed", String(i === 1));
    const img = el("img");
    img.src = shot(p.id, i);
    img.alt = "";
    b.appendChild(img);
    b.addEventListener("click", () => {
      hero.src = shot(p.id, i);
      hero.alt = `${p.name} — capture ${i}`;
      thumbs.querySelectorAll(".sheet-thumb").forEach(t => t.setAttribute("aria-pressed", String(t === b)));
    });
    thumbs.appendChild(b);
  }
  box.appendChild(thumbs);
}

function fillSheet(sheet, p, code, division, extra, media) {
  fillMedia(sheet.querySelector(".sheet-media"), p, media);
  const body = sheet.querySelector(".sheet-body");
  body.innerHTML = "";

  const meta = el("div", "sheet-meta");
  meta.appendChild(el("span", null, `${code} · ${division.label || division.name}`));
  meta.appendChild(el("span", `badge badge-${p.status}`, STATUS_LABEL[p.status] || p.status));
  body.appendChild(meta);

  body.appendChild(el("h2", "sheet-title", p.name));
  if (p.tagline) body.appendChild(el("p", "sheet-tagline", p.tagline));

  const actions = el("div", "sheet-actions");
  actions.append(...actionButtons(p));
  body.appendChild(actions);

  // The short description holds the place until the fiche (if any) arrives.
  const about = el("div", "sheet-fiche");
  if (p.description) about.appendChild(el("p", null, p.description));
  body.appendChild(about);
  if (media && media.fiche) {
    loadFiche(p.id).then(html => {
      if (html && sheet.dataset.id === p.id) about.innerHTML = html;
    });
  }

  const reg = el("dl", "sheet-reg");
  const div = el("span");
  [division, ...extra].forEach((d, i) => {
    if (i) div.append("  ·  ");
    div.append(el("span", "sheet-glyph", d.glyph || ""), ` ${d.name}`);
  });
  regRow(reg, extra.length ? "Divisions" : "Division", div);
  regRow(reg, "Code source", p.visibility === "public" && p.source ? repoLink(p.source) : "privé");
  if (p.public && p.public !== p.source) regRow(reg, "Vitrine", repoLink(p.public));
  const rel = hasPublicBuilds(p) ? regRow(reg, "Dernière version", "…")
    : p.install ? regRow(reg, "Builds", "privés — client lourd uniquement") : null;
  if (Array.isArray(p.tags) && p.tags.length) {
    const tags = el("span", "card-tags");
    p.tags.forEach(t => tags.appendChild(el("span", "tag", t)));
    regRow(reg, "Mots-clés", tags);
  }
  body.appendChild(reg);

  if (!hasPublicBuilds(p)) return;
  latestRelease(p.install.repo).then(r => {
    if (sheet.dataset.id !== p.id) return; // sheet moved on to another filiale
    if (!r) { rel.textContent = "aucune version publiée"; return; }
    const date = (r.published_at || "").slice(0, 10);
    rel.textContent = `${r.tag_name}${date ? ` · ${date}` : ""}`;
    const asset = pickAsset(r.assets || []);
    if (!IS_ELECTRON && asset) {
      const dl = el("a", "act act-download", "⤓ Télécharger");
      dl.href = asset.browser_download_url;
      dl.title = asset.name;
      actions.prepend(dl);
    }
  });
}

function setupSheet(catalog, codes) {
  const sheet = document.getElementById("filiale");
  const byId = new Map(catalog.projects.map(p => [p.id, p]));
  const divisions = new Map(catalog.divisions.map(d => [d.id, d]));
  let openedInPage = false; // true → closing goes back in history instead of rewriting it

  const hashId = () => (location.hash.startsWith(SHEET_HASH)
    ? decodeURIComponent(location.hash.slice(SHEET_HASH.length)) : null);

  function sync() {
    const id = hashId();
    const p = id && byId.get(id);
    if (!p) { if (sheet.open) sheet.close(); return; }
    sheet.dataset.id = p.id;
    const extra = (p.also || []).map(id => divisions.get(id)).filter(Boolean);
    fillSheet(sheet, p, codes.get(p.id), divisions.get(p.division) || { name: p.division }, extra, catalog.media[p.id]);
    if (!sheet.open) sheet.showModal();
    sheet.scrollTop = 0;
  }

  sheet.addEventListener("close", () => {
    const id = sheet.dataset.id;
    if (hashId() === id) { // closed by the user, not by a hash change
      if (openedInPage) history.back();
      else history.replaceState(null, "", location.pathname + location.search);
    }
    openedInPage = false;
    const card = document.querySelector(`.card-open[href="${SHEET_HASH}${id}"]`);
    if (card) card.focus({ preventScroll: true });
  });
  sheet.querySelector(".sheet-close").addEventListener("click", () => sheet.close());
  // Click on the backdrop (outside the panel) closes.
  sheet.addEventListener("click", e => { if (e.target === sheet) sheet.close(); });

  window.addEventListener("hashchange", () => {
    if (location.hash.startsWith(SHEET_HASH)) openedInPage = true;
    sync();
  });
  sync();
}

// ── Recherche / filtre ───────────────────────────────────────────────────────

function setupFinder(catalog, cards) {
  const finder = document.getElementById("finder");
  const input = finder.querySelector("input");
  const chips = finder.querySelector(".finder-status");
  const tally = finder.querySelector(".finder-tally");
  const empty = document.getElementById("catalog-empty");
  let status = "";

  const present = Object.keys(STATUS_LABEL).filter(s => catalog.projects.some(p => p.status === s));
  [["", "Tous"], ...present.map(s => [s, STATUS_LABEL[s]])].forEach(([s, label]) => {
    const b = el("button", "chip", label);
    b.type = "button";
    b.dataset.status = s;
    b.setAttribute("aria-pressed", String(s === status));
    if (s) b.prepend(el("i", `badge badge-${s}`));
    chips.appendChild(b);
  });

  function apply() {
    const q = fold(input.value.trim());
    const shown = new Set(); // a filiale listed in two divisions counts once
    cards.forEach(({ node, p, text }) => {
      const ok = (!status || p.status === status) && (!q || text.includes(q));
      node.hidden = !ok;
      if (ok) shown.add(p.id);
    });
    document.querySelectorAll(".division").forEach(s => {
      s.hidden = !s.querySelector(".card:not([hidden])");
    });
    tally.textContent = `${String(shown.size).padStart(2, "0")} / ${String(catalog.projects.length).padStart(2, "0")}`;
    empty.hidden = shown.size > 0;
  }

  chips.addEventListener("click", e => {
    const b = e.target.closest(".chip");
    if (!b) return;
    status = b.dataset.status;
    chips.querySelectorAll(".chip").forEach(c => c.setAttribute("aria-pressed", String(c === b)));
    apply();
  });
  input.addEventListener("input", apply);
  // "/" jumps to the search field, like on GitHub.
  document.addEventListener("keydown", e => {
    if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target.closest("input, textarea, [contenteditable]") || document.querySelector("dialog[open]")) return;
    e.preventDefault();
    input.focus();
  });
  finder.hidden = false;
  apply();
}

// ── Page ─────────────────────────────────────────────────────────────────────

function render(catalog) {
  document.getElementById("brand-full").textContent = catalog.brand.name;
  document.getElementById("brand-tag").textContent = catalog.brand.tagline || "";

  // Primary members first (they set the α-01 ranks), then filiales listed here via `also`.
  const primary = d => catalog.projects.filter(p => p.division === d.id);
  const byDivision = d => [...primary(d), ...catalog.projects.filter(p => (p.also || []).includes(d.id))];
  const divisions = new Map(catalog.divisions.map(d => [d.id, d]));
  const codes = new Map();  // project id → α-01…, from its primary division, fixed whatever the filter
  catalog.divisions.forEach(d => primary(d).forEach((p, i) => codes.set(p.id, filialeCode(d, i))));
  const pad = n => String(n).padStart(2, "0");

  const nav = document.getElementById("divisions-nav");
  nav.innerHTML = "";
  catalog.divisions.forEach(d => {
    const a = el("a", "div-link");
    a.href = `#div-${d.id}`;
    a.append(el("b", null, d.glyph || ""), d.name, el("span", null, pad(byDivision(d).length)));
    nav.appendChild(a);
  });

  const main = document.getElementById("catalog");
  main.innerHTML = "";
  const cards = [];
  catalog.divisions.forEach(d => {
    const items = byDivision(d);
    if (!items.length) return;
    const section = el("section", "division");
    section.id = `div-${d.id}`;
    const h = el("div", "division-head");
    h.appendChild(el("span", "division-glyph", d.glyph || ""));
    h.appendChild(el("span", "division-kicker", "Division"));
    h.appendChild(el("h2", "division-title", d.name));
    const count = el("span", "division-count", items.length > 1 ? "filiales" : "filiale");
    count.prepend(el("b", null, pad(items.length)));
    h.appendChild(count);
    if (d.blurb) h.appendChild(el("p", "division-blurb", d.blurb));
    section.appendChild(h);
    const grid = el("div", "grid");
    items.forEach(p => {
      const code = codes.get(p.id);
      const home = divisions.get(p.division) || d;
      const node = projectCard(p, code, home, catalog.media[p.id]);
      cards.push({ node, p, text: fold([p.name, p.tagline, p.description, code, d.name, home.name, ...(p.tags || [])].join(" ")) });
      grid.appendChild(node);
    });
    section.appendChild(grid);
    main.appendChild(section);
  });
  const empty = el("p", "loading", "Aucune filiale ne correspond.");
  empty.id = "catalog-empty";
  empty.hidden = true;
  main.appendChild(empty);

  if (catalog.brand.since) document.getElementById("foot-since").textContent = `depuis ${catalog.brand.since} · `;
  document.getElementById("foot-updated").textContent = `registre au ${catalog.brand.updated}`;
  document.getElementById("foot-count").textContent = `${catalog.projects.length} filiales`;

  setupFinder(catalog, cards);
  setupSheet(catalog, codes);
}

loadCatalog()
  .then(render)
  .catch(err => {
    document.getElementById("catalog").innerHTML =
      `<p class="loading error">Erreur : ${err.message}</p>`;
  });
