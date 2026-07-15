/**
 * build.js
 * ---------------------------------------------------------------
 * Reads src/data/publications.json and:
 *   1. Generates a standalone SEO-friendly HTML page for each
 *      publication at /public/publications/<slug>/index.html
 *   2. Injects catalog-card markup into /public/publications.html
 *      (all papers) and /public/index.html (3 most recent)
 *      between the <!-- PUB_LIST_START/END --> markers.
 *
 * Run with:  node build.js
 * Re-run any time you add/edit a paper in publications.json.
 * ---------------------------------------------------------------
 */
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const DATA_PATH = path.join(ROOT, "src/data/publications.json");
const PUBLIC = path.join(ROOT, "public");
const SITE_URL = "https://www.yourdomain.com"; // <-- update once you have a domain

const publications = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"))
  .sort((a, b) => new Date(b.date) - new Date(a.date));

const CATEGORY_TAG = {
  Biology: "Biology", Chemistry: "Chemistry", Economics: "Economics",
  Mathematics: "Mathematics", Other: "Other Academic Projects",
};

function fmtDate(iso) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function citation(pub) {
  const author = pub.authors.join(", ");
  const year = pub.date.slice(0, 4);
  return `${author} (${year}). ${pub.title}. Independent Research, ${pub.category}. Retrieved from ${SITE_URL}/publications/${pub.slug}/`;
}

function cardHTML(pub) {
  return `
  <article class="pub-card" data-title="${esc(pub.title.toLowerCase())}" data-category="${pub.category}" data-tags="${pub.tags.join(",").toLowerCase()}">
    <div class="pub-meta-row">
      <span class="tag">${esc(pub.category)}</span>
      <span>${pub.id}</span>
    </div>
    <h3><a href="/publications/${pub.slug}/">${esc(pub.title)}</a></h3>
    <p class="abstract">${esc(pub.abstract)}</p>
    <div class="pub-meta-row" style="border-top:1px solid var(--rule);padding-top:10px;margin-top:2px;">
      <span>${fmtDate(pub.date)}</span>
      <div class="pub-links">
        <a href="/publications/${pub.slug}/">Read summary</a>
        <a href="/${pub.pdf}" target="_blank" rel="noopener">PDF ↗</a>
      </div>
    </div>
  </article>`;
}

function esc(str) {
  return String(str).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

function injectInto(filePath, markup) {
  let html = fs.readFileSync(filePath, "utf-8");
  html = html.replace(
    /<!-- PUB_LIST_START -->[\s\S]*<!-- PUB_LIST_END -->/,
    `<!-- PUB_LIST_START -->${markup}\n<!-- PUB_LIST_END -->`
  );
  fs.writeFileSync(filePath, html);
  console.log("Updated", path.relative(ROOT, filePath));
}

// ---- 1. Inject full list into publications.html ----
injectInto(path.join(PUBLIC, "publications.html"), publications.map(cardHTML).join("\n"));

// ---- 2. Inject 3 most recent into index.html ----
injectInto(path.join(PUBLIC, "index.html"), publications.slice(0, 3).map(cardHTML).join("\n"));

// ---- 3. Generate a detail page per publication ----
const detailTemplate = fs.readFileSync(path.join(ROOT, "src/templates/publication.html"), "utf-8");

publications.forEach((pub) => {
  const outDir = path.join(PUBLIC, "publications", pub.slug);
  fs.mkdirSync(outDir, { recursive: true });

  const html = detailTemplate
    .replaceAll("{{TITLE}}", esc(pub.title))
    .replaceAll("{{CATEGORY}}", esc(pub.category))
    .replaceAll("{{DATE}}", fmtDate(pub.date))
    .replaceAll("{{DATE_ISO}}", pub.date)
    .replaceAll("{{AUTHORS}}", esc(pub.authors.join(", ")))
    .replaceAll("{{ABSTRACT}}", esc(pub.abstract))
    .replaceAll("{{RESEARCH_QUESTION}}", esc(pub.researchQuestion))
    .replaceAll("{{METHODOLOGY}}", esc(pub.methodology))
    .replaceAll("{{FINDINGS}}", esc(pub.findings))
    .replaceAll("{{SIGNIFICANCE}}", esc(pub.significance))
    .replaceAll("{{CITATION}}", esc(citation(pub)))
    .replaceAll("{{PDF_PATH}}", `/${pub.pdf}`)
    .replaceAll("{{ID}}", pub.id)
    .replaceAll("{{SLUG}}", pub.slug)
    .replaceAll("{{URL}}", `${SITE_URL}/publications/${pub.slug}/`)
    .replaceAll("{{TAGS_HTML}}", pub.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join(" "));

  fs.writeFileSync(path.join(outDir, "index.html"), html);
  console.log("Generated publications/" + pub.slug + "/index.html");
});

// ---- 4. Generate sitemap.xml ----
const staticPages = ["", "publications.html", "about.html", "contact.html"];
const urls = [
  ...staticPages.map((p) => `${SITE_URL}/${p}`),
  ...publications.map((p) => `${SITE_URL}/publications/${p.slug}/`),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(PUBLIC, "sitemap.xml"), sitemap);
console.log("Generated sitemap.xml");

console.log(`\nDone. Built ${publications.length} publication page(s).`);
