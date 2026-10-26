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

function projectCard(p) {
  const card = el("article", "card");
  card.dataset.division = p.division;

  const head = el("div", "card-head");
  head.appendChild(el("h3", "card-title", p.name));
  const status = el("span", `badge badge-${p.status}`, STATUS_LABEL[p.status] || p.status);
  head.appendChild(status);
  card.appendChild(head);

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
    const a = el("a", "act act-github", "GitHub ↗");
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

  const nav = document.getElementById("divisions-nav");
  nav.innerHTML = "";
  catalog.divisions.forEach(d => {
    const a = el("a", "div-link", d.name);
    a.href = `#div-${d.id}`;
    nav.appendChild(a);
  });

  const main = document.getElementById("catalog");
  main.innerHTML = "";
  catalog.divisions.forEach(d => {
    const items = catalog.projects.filter(p => p.division === d.id);
    if (!items.length) return;
    const section = el("section", "division");
    section.id = `div-${d.id}`;
    const h = el("div", "division-head");
    h.appendChild(el("h2", "division-title", d.label || d.name));
    if (d.blurb) h.appendChild(el("p", "division-blurb", d.blurb));
    section.appendChild(h);
    const grid = el("div", "grid");
    items.forEach(p => grid.appendChild(projectCard(p)));
    section.appendChild(grid);
    main.appendChild(section);
  });

  document.getElementById("foot-updated").textContent = `Mis à jour ${catalog.brand.updated}`;
  document.getElementById("foot-count").textContent = `${catalog.projects.length} projets`;
}

loadCatalog()
  .then(render)
  .catch(err => {
    document.getElementById("catalog").innerHTML =
      `<p class="loading error">Erreur : ${err.message}</p>`;
  });
