// Runs after partials.js injects the header/footer.
document.addEventListener("DOMContentLoaded", function () {
  // ---- Dark mode ----
  const themeBtn = document.getElementById("theme-toggle");
  function applyStoredTheme() {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") document.documentElement.setAttribute("data-theme", "dark");
  }
  applyStoredTheme();
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      if (isDark) {
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
      } else {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
      }
    });
  }

  // ---- Mobile nav ----
  const menuBtn = document.getElementById("menu-toggle");
  const nav = document.getElementById("site-nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => nav.classList.toggle("open"));
  }

  // ---- Publication search + category filter (works on cards rendered by build.js) ----
  const searchInput = document.getElementById("pub-search");
  const chips = document.querySelectorAll(".chip");
  const cards = () => document.querySelectorAll(".pub-card");
  const emptyState = document.getElementById("empty-state");
  let activeCategory = "All";

  function runFilter() {
    const q = (searchInput?.value || "").toLowerCase().trim();
    let visible = 0;
    cards().forEach((card) => {
      const title = card.dataset.title || "";
      const tags = card.dataset.tags || "";
      const category = card.dataset.category || "";
      const matchesText = !q || title.includes(q) || tags.includes(q);
      const matchesCategory = activeCategory === "All" || category === activeCategory;
      const show = matchesText && matchesCategory;
      card.style.display = show ? "" : "none";
      if (show) visible++;
    });
    if (emptyState) emptyState.style.display = visible === 0 ? "block" : "none";
  }

  if (searchInput) searchInput.addEventListener("input", runFilter);
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      activeCategory = chip.dataset.category;
      runFilter();
    });
  });
  if (searchInput || chips.length) runFilter();
});
