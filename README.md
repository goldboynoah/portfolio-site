# Your Name — Research Portfolio

A static research portfolio site. No framework, no npm dependencies —
just HTML/CSS/JS plus one small Node.js script that generates a real,
SEO-friendly page for every paper you add.

## How it's organized

```
portfolio-site/
├── build.js                        ← run this after editing publications.json
├── src/
│   ├── data/publications.json      ← THE FILE YOU EDIT to add/update papers
│   └── templates/publication.html  ← template used to generate each paper's page
└── public/                         ← this whole folder is your deployed website
    ├── index.html                  ← home page
    ├── publications.html           ← full catalog with search/filter
    ├── about.html
    ├── contact.html
    ├── sitemap.xml                 ← auto-generated
    ├── publications/<slug>/        ← auto-generated, one folder per paper
    └── assets/
        ├── css/style.css
        ├── js/main.js, partials.js
        ├── papers/                 ← put your PDFs here (resume + papers)
        └── img/
```

## Adding a new paper (the everyday workflow)

1. Drop the paper's PDF into `public/assets/papers/`.
2. Open `src/data/publications.json` and copy an existing entry, then edit:
   - `id` — a short accession code, e.g. `RES-2026-002`
   - `slug` — used in the URL, lowercase-with-dashes, must be unique
   - `title`, `category`, `date` (YYYY-MM-DD), `authors`
   - `abstract`, `researchQuestion`, `methodology`, `findings`, `significance`
   - `pdf` — path relative to `public/`, e.g. `assets/papers/my-paper.pdf`
   - `tags` — short list of topic keywords, used by the search box
3. Run:
   ```
   node build.js
   ```
   This regenerates the publications list on the home page, the full
   catalog page, a dedicated page for your new paper at
   `/publications/<slug>/`, and `sitemap.xml`.
4. Commit and push (see Deployment below) — the live site updates.

That's the entire workflow for adding future research. You never touch
HTML by hand for a new paper.

## Before you launch: things to personalize

- Replace `Your Name`, `you@example.com`, and the LinkedIn URL in
  `public/assets/js/partials.js` (controls the header/footer on every page).
- Update `SITE_URL` at the top of `build.js` once you have a domain, then re-run `node build.js`.
- Replace the placeholder PDFs in `public/assets/papers/` with your real resume and papers.
- Fill in the real copy on `about.html` and the "Profile" section of `index.html`.
- Swap `og:image` / add a real social preview image in `public/assets/img/` if you want link previews to show a photo.

## Local preview

No build tools required to view it — just serve the `public/` folder:

```
cd public
python3 -m http.server 8080
```

Then open `http://localhost:8080`. (Opening `index.html` directly via
`file://` will break the header/footer injection — always use a local server.)

## Deployment (free, with custom domain support)

**Recommended: Netlify**
1. Push this project to a GitHub repository.
2. In Netlify: "Add new site" → "Import from Git" → select the repo.
3. Set **Publish directory** to `public`. No build command needed
   (or set it to `node build.js` if you want Netlify to run the
   generator automatically on every push).
4. Deploy. You get a free `*.netlify.app` URL immediately.
5. Domain: Site settings → Domain management → add your custom domain
   (e.g. from Namecheap/Google Domains) and follow the DNS instructions.
   HTTPS is issued automatically and free.
6. The contact form on `contact.html` already has `data-netlify="true"` —
   Netlify Forms will capture submissions with zero extra setup, visible
   under Site → Forms in your dashboard.

**Alternative: GitHub Pages**
1. Push to GitHub, then in repo Settings → Pages, set the source to the
   `public/` folder on your main branch (or use a `gh-pages` branch/action
   that copies `public/` to the root).
2. Custom domains are supported via a `CNAME` file in `public/` plus DNS
   records at your registrar.
3. GitHub Pages has no built-in form handling — swap the contact form's
   `action` to a free [Formspree](https://formspree.io) endpoint instead
   of `data-netlify`.

**Alternative: Vercel** — same idea as Netlify; set the output directory
to `public`, no build command needed.

## SEO checklist (already handled, verify after you personalize)

- [x] Every paper has its own indexable URL (`/publications/<slug>/`) with unique title/description meta tags.
- [x] `sitemap.xml` is generated automatically — submit it in Google Search Console once you have a domain.
- [x] `robots.txt` allows crawling and points to the sitemap.
- [x] Each paper page includes `ScholarlyArticle` structured data (JSON-LD) so Google can understand it's an academic work.
- [ ] Once live, submit the site + sitemap in [Google Search Console](https://search.google.com/search-console).

## Analytics / download tracking

To see page views and PDF click counts without building your own
backend, add a free privacy-friendly analytics snippet (e.g.
[Plausible](https://plausible.io) or [GoatCounter](https://goatcounter.com))
to the `<head>` of each HTML file — or just to `partials.js`'s header
injection, so it applies sitewide in one edit. Both offer free tiers
sufficient for a personal portfolio and can track outbound PDF clicks
as custom events.

## Dark mode, search, and mobile menu

These are already wired up in `assets/js/main.js` — dark mode preference
is remembered in the visitor's browser, search/filter runs entirely
client-side against the cards `build.js` already rendered (no JSON
fetch needed, so it also works with JavaScript disabled — the content
is still there, just not filterable).

## Adding a blog later

When you're ready: create a `blog.json` alongside `publications.json`
and a `src/templates/post.html` template, then extend `build.js` with a
second loop that mirrors the publications logic, outputting to
`public/blog/<slug>/`. The pattern is identical to how papers work now.
