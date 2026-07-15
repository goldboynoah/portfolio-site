// Injects the site header and footer into every page.
// Edit the nav links / footer links here once — they update everywhere.
(function () {
  const path = window.location.pathname;
  const isActive = (href) => (path === href || (href !== "/" && path.startsWith(href))) ? "active" : "";

  const headerHTML = `
  <header class="site-header">
    <div class="wrap">
      <a class="brand" href="/">Your Name<span>.</span></a>
      <nav class="nav" id="site-nav">
        <a href="/" class="${isActive("/") === "active" && path === "/" ? "active" : ""}">Home</a>
        <a href="/publications.html" class="${isActive("/publications")}">Publications</a>
        <a href="/about.html" class="${isActive("/about")}">About</a>
        <a href="/contact.html" class="${isActive("/contact")}">Contact</a>
      </nav>
      <div style="display:flex;align-items:center;">
        <button class="menu-toggle" id="menu-toggle" aria-label="Toggle menu">☰</button>
        <button class="theme-toggle" id="theme-toggle" aria-label="Toggle dark mode">◐</button>
      </div>
    </div>
  </header>`;

  const footerHTML = `
  <footer class="site-footer">
    <div class="wrap">
      <p>© ${new Date().getFullYear()} Your Name. Independent research portfolio.</p>
      <div class="footer-links">
        <a href="/assets/papers/resume.pdf" target="_blank" rel="noopener">Resume</a>
        <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener">LinkedIn</a>
        <a href="mailto:you@example.com">Email</a>
      </div>
    </div>
  </footer>`;

  document.getElementById("header-slot").outerHTML = headerHTML;
  document.getElementById("footer-slot").outerHTML = footerHTML;
})();
