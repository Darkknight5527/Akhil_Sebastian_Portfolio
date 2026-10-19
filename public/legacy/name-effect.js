/*
 * Name effect from the effects model (agreed 19 Oct 2026), adapted to the base
 * model's Bebas Neue name. Bebas has a single weight, so "thicker" is done with a
 * growing outline in the letter's own colour. As the cursor nears, each letter lifts,
 * thickens and glows — one glow field across both lines. With no cursor (touch, or
 * idle for 2.5 s) a virtual cursor sweeps across the name every few seconds.
 */
(function () {
  var el = document.getElementById("hn");
  if (!el) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // Wrap every character of the name in its own span, keeping <br> and the green span.
  function split(node) {
    Array.prototype.slice.call(node.childNodes).forEach(function (child) {
      if (child.nodeType === 3) {
        var frag = document.createDocumentFragment();
        // one no-wrap group per word, so a word can never break between letters
        child.textContent.split(/(\s+)/).forEach(function (word) {
          if (!word) return;
          if (!word.trim()) { frag.appendChild(document.createTextNode(word)); return; }
          var w = document.createElement("span");
          w.style.display = "inline-block";
          w.style.whiteSpace = "nowrap";
          word.split("").forEach(function (ch) {
            var s = document.createElement("span");
            s.setAttribute("data-l", "");
            s.setAttribute("aria-hidden", "true");
            s.textContent = ch;
            w.appendChild(s);
          });
          frag.appendChild(w);
        });
        node.replaceChild(frag, child);
      } else if (child.nodeType === 1 && child.tagName !== "BR") {
        split(child);
      }
    });
  }
  el.setAttribute("aria-label", "Akhil Sebastian");
  split(el);

  var letters = Array.prototype.slice.call(el.querySelectorAll("[data-l]"));
  letters.forEach(function (l) {
    l.style.display = "inline-block";
    l.style.transition = "transform .3s ease-out, color .3s ease-out, text-shadow .3s ease-out, -webkit-text-stroke-width .3s ease-out";
    l.style.webkitTextStroke = "0px currentColor";
    // opposites: white letters turn green, green letters ("SEBASTIAN") turn white
    l.__green = !!l.closest(".gc");
  });

  var target = null, lastMove = -1e9, start = performance.now();
  window.addEventListener("pointermove", function (e) {
    if (e.pointerType === "touch") return;
    target = { x: e.clientX, y: e.clientY };
    lastMove = performance.now();
  }, { passive: true });
  document.addEventListener("pointerleave", function () { target = null; });

  // Performance (19 Oct 2026): letter centres are measured relative to the page only
  // when the layout can have changed (resize, fonts, every 1 s as a safety net), never
  // every frame. Each frame just subtracts the scroll position.
  var centres = [], box = null, measuredAt = -1e9;
  function measure() {
    var sx = window.scrollX, sy = window.scrollY;
    var b = el.getBoundingClientRect();
    box = { left: b.left + sx, top: b.top + sy, width: b.width, height: b.height };
    centres = letters.map(function (l) {
      // measure the (never-moved) word box, then the letter's offset inside it,
      // so a letter that is mid-lift doesn't skew its resting position
      var w = l.parentNode, r = w.getBoundingClientRect();
      return {
        x: r.left + sx + (l.offsetLeft - w.offsetLeft) + l.offsetWidth / 2,
        y: r.top + sy + (l.offsetTop - w.offsetTop) + l.offsetHeight / 2
      };
    });
  }
  window.addEventListener("resize", function () { measuredAt = -1e9; });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { measuredAt = -1e9; });

  function apply(now) {
    if (now - measuredAt > 1000) { measure(); measuredAt = now; }
    var sx = window.scrollX, sy = window.scrollY;
    var top = box.top - sy;
    var onScreen = top + box.height > 0 && top < window.innerHeight;
    if (onScreen && !document.hidden) {
      var t = target;
      if (!t && now - lastMove > 2500 && now - start > 2200) {
        var cyc = ((now - start) % 6500) / 3200;
        var left = box.left - sx;
        if (cyc <= 1) t = { x: left - 120 + cyc * (box.width + 240), y: top + box.height * (0.3 + cyc * 0.4) };
      }
      for (var i = 0; i < letters.length; i++) {
        var l = letters[i], k = 0;
        if (t) {
          var c = centres[i];
          k = Math.max(0, 1 - Math.hypot(t.x - (c.x - sx), t.y - (c.y - sy)) / 320);
        }
        k = Math.round(k * 50) / 50; // 2% steps: invisible difference, far fewer style changes
        if (k === l.__k) continue;   // nothing changed for this letter: skip the style writes
        l.__k = k;
        var pct = Math.round(k * 100);
        l.style.transform = "translateY(" + (-10 * k).toFixed(1) + "px)";
        l.style.webkitTextStrokeWidth = (2.4 * k).toFixed(2) + "px";
        l.style.color = l.__green
          ? "color-mix(in srgb, #ffffff " + pct + "%, #00e57a)"
          : "color-mix(in srgb, #00e57a " + pct + "%, #ffffff)";
        l.style.textShadow = k > 0.02 ? "0 0 " + Math.round(28 * k) + "px rgba(0,229,122," + (0.75 * k).toFixed(2) + ")" : "none";
      }
    }
    requestAnimationFrame(apply);
  }
  requestAnimationFrame(apply);
})();
