// ACH web catalog — skeleton renderer.
// Reads data/catalog.json and lays projects out by division.
// `launch` / `install` actions only exist in the Electron client; the web build
// shows GitHub links and (later) download links instead.

const IS_ELECTRON = typeof window !== "undefined" && !!window.ACH; // desktop bridge, injected by preload

const STATUS_LABEL = {
  prod: "Prod", beta: "Bêta", alpha: "Alpha", wip: "En dev", concept: "Concept",
};

async function loadCatalog() {
  // Web build and Electron build both ship the json next to the page.
  const candidates = ["../data/catalog.json", "data/catalog.json", "catalog.json"];
  for (const url of candidates) {
    try {
      const r = await fetch(url, { cache: "no-cache" });
      if (r.ok) return await r.json();
    } catch (_) { /* try next */ }
  }
  throw new Error("catalog.json introuvable");
}

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

// Filiale code shown on cards: division glyph + rank inside the division (α-01, β-03…).
function filialeCode(division, index) {
  return `${division.glyph || division.id}-${String(index + 1).padStart(2, "0")}`;
}

function projectCard(p, code) {
  const card = el("article", "card");
  card.dataset.division = p.division;

  const meta = el("div", "card-meta");
  meta.appendChild(el("span", "card-code", code));
  meta.appendChild(el("span", `badge badge-${p.status}`, STATUS_LABEL[p.status] || p.status));
  card.appendChild(meta);
  card.appendChild(el("h3", "card-title", p.name));

  if (p.tagline) card.appendChild(el("p", "card-tagline", p.tagline));
  if (p.description) card.appendChild(el("p", "card-desc", p.description));

  if (Array.isArray(p.tags) && p.tags.length) {
    const tags = el("div", "card-tags");
    p.tags.forEach(t => tags.appendChild(el("span", "tag", t)));
    card.appendChild(tags);
  }

  const actions = el("div", "card-actions");

  // Launch — desktop only, needs a local install path.
  if (IS_ELECTRON && p.launch) {
    const b = el("button", "act act-launch", "▸ Lancer");
    b.addEventListener("click", () => window.ACH.launch(p.id));
    actions.appendChild(b);
  }

  // Install — desktop only, from a GitHub release.
  if (IS_ELECTRON && p.install) {
    const b = el("button", "act act-install", "⤓ Installer");
    b.addEventListener("click", () => window.ACH.install(p.id));
    actions.appendChild(b);
  }

  // GitHub — everywhere a public-facing link exists.
  if (p.github) {
    const a = el("a", "act act-github", "Dépôt ↗");
    a.href = p.github;
    a.target = "_blank";
    a.rel = "noopener";
    actions.appendChild(a);
  } else {
    const span = el("span", "act act-disabled", "privé");
    actions.appendChild(span);
  }

  card.appendChild(actions);
  return card;
}

function render(catalog) {
  document.getElementById("brand-full").textContent = catalog.brand.name;
  document.getElementById("brand-tag").textContent = catalog.brand.tagline || "";

  const byDivision = d => catalog.projects.filter(p => p.division === d.id);
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
    items.forEach((p, i) => grid.appendChild(projectCard(p, filialeCode(d, i))));
    section.appendChild(grid);
    main.appendChild(section);
  });

  if (catalog.brand.since) document.getElementById("foot-since").textContent = `depuis ${catalog.brand.since} · `;
  document.getElementById("foot-updated").textContent = `registre au ${catalog.brand.updated}`;
  document.getElementById("foot-count").textContent = `${catalog.projects.length} filiales`;
}

loadCatalog()
  .then(render)
  .catch(err => {
    document.getElementById("catalog").innerHTML =
      `<p class="loading error">Erreur : ${err.message}</p>`;
  });
