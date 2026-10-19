/*
 * Scroll beam (19 Oct 2026): replaces the page scrollbar on laptops/desktops with a
 * tracing-beam style indicator, as in the effects model's Experience section.
 * A thin line with an angled jog runs down the right edge; a green→cyan glow slides
 * along it as you scroll (trailing slightly, like the original beam) and its tip marks
 * how far down the page you are. Click or drag the beam to scroll. Phones keep their
 * normal scroll indicator (see base-overrides.css).
 */
(function () {
  var NS = "http://www.w3.org/2000/svg";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var wrap = document.createElement("div");
  wrap.id = "scroll-beam";
  wrap.setAttribute("aria-hidden", "true");
  var svg = document.createElementNS(NS, "svg");
  svg.setAttribute("width", "20");
  var defs = document.createElementNS(NS, "defs");
  var grad = document.createElementNS(NS, "linearGradient");
  grad.id = "scroll-beam-grad";
  grad.setAttribute("gradientUnits", "userSpaceOnUse");
  grad.setAttribute("x1", "0"); grad.setAttribute("x2", "0");
  [["0", "#00e57a", "0"], ["0.55", "#00e57a", "1"], ["0.9", "#22d3ee", "1"], ["1", "#22d3ee", "0"]].forEach(function (st) {
    var s = document.createElementNS(NS, "stop");
    s.setAttribute("offset", st[0]); s.setAttribute("stop-color", st[1]); s.setAttribute("stop-opacity", st[2]);
    grad.appendChild(s);
  });
  var glow = document.createElementNS(NS, "filter");
  glow.id = "scroll-beam-glow";
  glow.setAttribute("x", "-200%"); glow.setAttribute("y", "-20%"); glow.setAttribute("width", "500%"); glow.setAttribute("height", "140%");
  var blur = document.createElementNS(NS, "feGaussianBlur");
  blur.setAttribute("stdDeviation", "1.6"); blur.setAttribute("result", "b");
  var merge = document.createElementNS(NS, "feMerge");
  ["b", "SourceGraphic"].forEach(function (n) { var m = document.createElementNS(NS, "feMergeNode"); m.setAttribute("in", n); merge.appendChild(m); });
  glow.appendChild(blur); glow.appendChild(merge);
  defs.appendChild(grad); defs.appendChild(glow);
  svg.appendChild(defs);

  var track = document.createElementNS(NS, "path");
  track.setAttribute("fill", "none"); track.setAttribute("stroke", "#1d2b22"); track.setAttribute("stroke-width", "1.25");
  var beam = document.createElementNS(NS, "path");
  beam.setAttribute("fill", "none"); beam.setAttribute("stroke", "url(#scroll-beam-grad)");
  beam.setAttribute("stroke-width", "2"); beam.setAttribute("filter", "url(#scroll-beam-glow)");
  var tip = document.createElementNS(NS, "circle");
  tip.setAttribute("r", "2.6"); tip.setAttribute("fill", "#b6ffdc"); tip.setAttribute("filter", "url(#scroll-beam-glow)");
  svg.appendChild(track); svg.appendChild(beam); svg.appendChild(tip);

  var dot = document.createElement("div");
  dot.className = "scroll-beam-dot";
  dot.appendChild(document.createElement("span"));
  wrap.appendChild(dot);
  wrap.appendChild(svg);
  document.body.appendChild(wrap);

  var H = 0, cur = 0, curTail = 0;
  var TOP = 18; // below the start dot

  function layout() {
    H = Math.max(120, wrap.clientHeight - TOP);
    svg.setAttribute("height", String(H));
    svg.setAttribute("viewBox", "0 0 20 " + H);
    svg.style.top = TOP + "px";
    // line with an angled jog near the top and the bottom, like the tracing beam
    var a = Math.min(90, H * 0.12), b = H - Math.min(90, H * 0.12);
    var d = "M 10 0 V " + a + " l -8 22 V " + (b - 22) + " l 8 22 V " + H;
    track.setAttribute("d", d);
    beam.setAttribute("d", d);
  }

  function progress() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  }

  function frame() {
    var p = progress();
    // head follows quickly, tail lags behind (the trailing glow of the original beam)
    cur += (p - cur) * (reduce ? 1 : 0.18);
    curTail += (p - curTail) * (reduce ? 1 : 0.06);
    var head = 6 + cur * (H - 6);
    var tail = Math.min(head - 40, 6 + curTail * (H - 6) - 120);
    grad.setAttribute("y1", String(tail));
    grad.setAttribute("y2", String(head));
    var len = track.getTotalLength();
    // find the point on the path at height `head` (the path only ever goes down)
    var lo = 0, hi = len;
    for (var i = 0; i < 18; i++) { var mid = (lo + hi) / 2; if (track.getPointAtLength(mid).y < head) lo = mid; else hi = mid; }
    var pt = track.getPointAtLength(lo);
    tip.setAttribute("cx", String(pt.x)); tip.setAttribute("cy", String(pt.y));
    wrap.classList.toggle("is-on", window.scrollY > 4);
    requestAnimationFrame(frame);
  }

  // click / drag the beam to scroll
  var dragging = false;
  function seek(e) {
    var r = svg.getBoundingClientRect();
    var p = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    window.scrollTo(0, p * (document.documentElement.scrollHeight - window.innerHeight));
  }
  wrap.addEventListener("pointerdown", function (e) { dragging = true; wrap.setPointerCapture(e.pointerId); seek(e); e.preventDefault(); });
  wrap.addEventListener("pointermove", function (e) { if (dragging) seek(e); });
  wrap.addEventListener("pointerup", function () { dragging = false; });
  wrap.addEventListener("pointercancel", function () { dragging = false; });

  new ResizeObserver(layout).observe(wrap);
  layout();
  requestAnimationFrame(frame);
})();
