/* ======================================================
   Research Interests – live count after the filter buttons
   Shows e.g. "All Research Areas (8)" or "Film (3)".
   Works on both homepages: English and Arabic (<html lang="ar">).
   Load this file AFTER research.js.
====================================================== */
(function () {
  const container = document.getElementById("researchContainer");
  const output = document.getElementById("researchCount");
  const filter = document.querySelector(".research-filter");
  if (!container || !output || !filter) return;

  const isArabic = document.documentElement.lang === "ar";
  const numberFormat = new Intl.NumberFormat(isArabic ? "ar-SA" : "en");
  const allLabel = isArabic ? "جميع مجالات البحث" : "All Research Areas";

  /* A card counts only if it is actually shown on the page */
  function visibleCount() {
    return Array.from(container.children).filter(function (card) {
      return card.getClientRects().length > 0 &&
             getComputedStyle(card).visibility !== "hidden";
    }).length;
  }

  function update() {
    const active = filter.querySelector("button.active");
    const isAll = !active || active.dataset.filter === "all";
    const label = isAll ? allLabel : active.textContent.trim();
    output.textContent = label + " (" + numberFormat.format(visibleCount()) + ")";
  }

  /* Update when cards are added, removed, shown or hidden */
  const observer = new MutationObserver(function () {
    requestAnimationFrame(update);
  });
  observer.observe(container, {
    childList: true,
    attributes: true,
    subtree: true,
    attributeFilter: ["style", "class", "hidden"]
  });

  /* Also update after any filter button is clicked */
  filter.addEventListener("click", function () {
    setTimeout(update, 60);
  });

  update();
})();
