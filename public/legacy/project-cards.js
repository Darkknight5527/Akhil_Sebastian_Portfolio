/*
 * Project cards (19 Oct 2026). Press a card (or Enter/Space on it) to expand it in
 * place: full write-up, skills, links, photos and the live 3D model. Only one card
 * is open at a time; "Close" or pressing it again folds it back.
 */
(function () {
  var cards = Array.prototype.slice.call(document.querySelectorAll(".pj-card"));
  if (!cards.length) return;
  var grid = document.getElementById("proj-grid");

  // the three.js viewers size themselves on window resize; nudge them once a card opens
  function nudge() {
    window.dispatchEvent(new Event("resize"));
    setTimeout(function () { window.dispatchEvent(new Event("resize")); }, 480);
  }

  function setOpen(card, open) {
    card.classList.toggle("open", open);
    card.setAttribute("aria-expanded", open ? "true" : "false");
    card.setAttribute("aria-label", card.querySelector(".pj-title").textContent + (open ? ": hide details" : ": show details"));
  }

  function toggle(card) {
    var opening = !card.classList.contains("open");
    cards.forEach(function (c) { if (c !== card && c.classList.contains("open")) setOpen(c, false); });
    setOpen(card, opening);
    markWide();
    nudge();
    if (opening) {
      // bring the opened card's top into view, below the fixed nav
      requestAnimationFrame(function () {
        var top = card.getBoundingClientRect().top + window.scrollY - 90;
        if (Math.abs(top - window.scrollY) > 40) window.scrollTo({ top: top, behavior: "smooth" });
      });
    }
  }

  cards.forEach(function (card) {
    card.addEventListener("click", function (e) {
      var t = e.target;
      // things that do their own job inside the card
      if (t.closest("a, canvas, .rsdot")) return;
      var lb = t.closest("[data-lb]");
      if (lb && card.classList.contains("open") && window.openLightbox) { window.openLightbox(+lb.dataset.lb); return; }
      if (card.classList.contains("open") && !t.closest(".pj-explore")) return; // reading/selecting text shouldn't close it
      toggle(card);
    });
    card.addEventListener("keydown", function (e) {
      if (e.target !== card) return;
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(card); }
      if (e.key === "Escape" && card.classList.contains("open")) toggle(card);
    });
    // soft spotlight that follows the pointer (one style write per frame at most)
    var last = null, queued = false;
    card.addEventListener("pointermove", function (e) {
      if (e.pointerType === "touch") return;
      last = e;
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () {
        queued = false;
        var r = card.getBoundingClientRect();
        card.style.setProperty("--sx", ((last.clientX - r.left) / r.width * 100) + "%");
        card.style.setProperty("--sy", ((last.clientY - r.top) / r.height * 100) + "%");
      });
    }, { passive: true });
  });

  // a card left alone on the last row of the grid is shown full-width instead
  function markWide() {
    if (!grid) return;
    var cols = getComputedStyle(grid).gridTemplateColumns.split(" ").length;
    var vis = Array.prototype.filter.call(grid.children, function (c) { return c.classList.contains("pj-card") && !c.classList.contains("hidden"); });
    vis.forEach(function (c) { c.classList.remove("pj-wide"); });
    var open = vis.filter(function (c) { return c.classList.contains("open"); }).length;
    if (!open && cols > 1 && vis.length % cols === 1) vis[vis.length - 1].classList.add("pj-wide");
  }
  // re-check after the filter tabs run and when the layout changes
  document.querySelectorAll(".proj-tab").forEach(function (tab) {
    tab.addEventListener("click", function () {
      cards.forEach(function (c) { if (c.classList.contains("open")) setOpen(c, false); });
      setTimeout(markWide, 0);
    });
  });
  window.addEventListener("resize", markWide);
  markWide();
})();
