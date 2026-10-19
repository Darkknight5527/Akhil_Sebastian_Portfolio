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
    // white letters warm towards green; green letters ("SEBASTIAN") brighten towards mint
    l.__green = !!l.closest(".gc");
  });

  var target = null, lastMove = -1e9, start = performance.now();
  window.addEventListener("pointermove", function (e) {
    if (e.pointerType === "touch") return;
    target = { x: e.clientX, y: e.clientY };
    lastMove = performance.now();
  }, { passive: true });
  document.addEventListener("pointerleave", function () { target = null; });

  function apply(now) {
    var box = el.getBoundingClientRect();
    var onScreen = box.bottom > 0 && box.top < window.innerHeight;
    if (onScreen) {
      var t = target;
      if (!t && now - lastMove > 2500 && now - start > 2200) {
        var cyc = ((now - start) % 6500) / 3200;
        if (cyc <= 1) t = { x: box.left - 120 + cyc * (box.width + 240), y: box.top + box.height * (0.3 + cyc * 0.4) };
      }
      for (var i = 0; i < letters.length; i++) {
        var l = letters[i], k = 0;
        if (t) {
          var r = l.getBoundingClientRect();
          var d = Math.hypot(t.x - (r.left + r.width / 2), t.y - (r.top + r.height / 2));
          k = Math.max(0, 1 - d / 320);
        }
        var pct = Math.round(k * 100);
        l.style.transform = "translateY(" + (-10 * k).toFixed(1) + "px)";
        l.style.webkitTextStrokeWidth = (2.4 * k).toFixed(2) + "px";
        l.style.color = l.__green
          ? "color-mix(in srgb, #b6ffdc " + pct + "%, #00e57a)"
          : "color-mix(in srgb, #00e57a " + pct + "%, #ffffff)";
        l.style.textShadow = k > 0.02 ? "0 0 " + Math.round(28 * k) + "px rgba(0,229,122," + (0.75 * k).toFixed(2) + ")" : "none";
      }
    }
    requestAnimationFrame(apply);
  }
  requestAnimationFrame(apply);
})();
