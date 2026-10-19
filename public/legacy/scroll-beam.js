/*
 * Scroll trace (19 Oct 2026): replaces the page scrollbar on laptops/desktops.
 * Drawn like a PCB trace: a copper line routed with 45° bends and square solder
 * pads at both ends (bend vias removed 19 Oct 2026 on request). As you scroll, the trace "powers up" from the
 * top pad down to your position, with a bright signal pulse riding the tip. Click or drag the trace to scroll. Phones keep their
 * normal scroll indicator (see base-overrides.css).
 */
(function () {
  var NS = "http://www.w3.org/2000/svg";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var W = 24, CX = 12; // svg width, centre line

  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  var wrap = document.createElement("div");
  wrap.id = "scroll-beam";
  wrap.setAttribute("aria-hidden", "true");
  var svg = el("svg", { width: W });
  wrap.appendChild(svg);
  document.body.appendChild(wrap);

  var defs = el("defs", {}, svg);
  var glow = el("filter", { id: "trace-glow", x: "-200%", y: "-20%", width: "500%", height: "140%" }, defs);
  el("feGaussianBlur", { stdDeviation: "1.8", result: "b" }, glow);
  var mg = el("feMerge", {}, glow);
  el("feMergeNode", { in: "b" }, mg);
  el("feMergeNode", { in: "SourceGraphic" }, mg);

  var copper = el("path", { fill: "none", stroke: "#123a26", "stroke-width": "2.6", "stroke-linejoin": "round" }, svg);
  var lit = el("path", { fill: "none", stroke: "#00e57a", "stroke-width": "2.2", "stroke-linejoin": "round", "stroke-opacity": "0.85", filter: "url(#trace-glow)" }, svg);
  var spark = el("path", { fill: "none", stroke: "#c8ffe6", "stroke-width": "2.4", "stroke-linecap": "round", "stroke-linejoin": "round", filter: "url(#trace-glow)" }, svg);
  var padTop = el("g", {}, svg), padBot = el("g", {}, svg);
  var tip = el("circle", { r: "3", fill: "#e6fff4", filter: "url(#trace-glow)" }, svg);

  function pad(g, y) {
    while (g.firstChild) g.removeChild(g.firstChild);
    el("rect", { x: CX - 7, y: y - 7, width: 14, height: 14, rx: 2, fill: "#07120c", stroke: "#1d4a33", "stroke-width": "1.2", class: "pad" }, g);
    el("circle", { cx: CX, cy: y, r: 2.6, fill: "#1d4a33", class: "pad-hole" }, g);
  }

  var H = 0, len = 0, cur = 0;

  function layout() {
    H = Math.max(160, wrap.clientHeight);
    svg.setAttribute("height", String(H));
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    // route: start at the top pad, then 45° jogs between two lanes, like a routed trace
    var top = 8, bot = H - 8, L = CX - 6, R = CX + 6, j = 12; // jog: 12px across over 12px down
    var span = bot - top;
    var ys = [0.16, 0.38, 0.62, 0.84].map(function (f) { return top + span * f; });
    var pts = [[CX, top], [CX, ys[0] - j / 2], [L, ys[0] + j / 2], [L, ys[1] - j / 2], [R, ys[1] + j / 2],
               [R, ys[2] - j / 2], [L, ys[2] + j / 2], [L, ys[3] - j / 2], [CX, ys[3] + j / 2], [CX, bot]];
    var d = "M " + pts.map(function (p) { return p[0] + " " + p[1]; }).join(" L ");
    [copper, lit, spark].forEach(function (p) { p.setAttribute("d", d); });
    len = copper.getTotalLength();
    lit.setAttribute("stroke-dasharray", len + " " + len);
    pad(padTop, top);
    pad(padBot, bot);
  }

  function progress() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  }

  function frame() {
    var p = progress();
    cur += (p - cur) * (reduce ? 1 : 0.16);
    var at = cur * len;
    lit.setAttribute("stroke-dashoffset", String(len - at));
    // short bright spark trailing behind the tip
    var trail = Math.min(70, at);
    spark.setAttribute("stroke-dasharray", trail + " " + len);
    spark.setAttribute("stroke-dashoffset", String(-(at - trail)));
    spark.setAttribute("opacity", at > 2 ? "1" : "0");
    var pt = copper.getPointAtLength(at);
    tip.setAttribute("cx", String(pt.x));
    tip.setAttribute("cy", String(pt.y));
    tip.setAttribute("opacity", at > 2 ? "1" : "0");
    wrap.classList.toggle("is-on", window.scrollY > 4);
    wrap.classList.toggle("is-end", p > 0.995);
    requestAnimationFrame(frame);
  }

  // click / drag the trace to scroll
  var dragging = false;
  function seek(e) {
    var r = svg.getBoundingClientRect();
    var q = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    window.scrollTo(0, q * (document.documentElement.scrollHeight - window.innerHeight));
  }
  wrap.addEventListener("pointerdown", function (e) { dragging = true; wrap.setPointerCapture(e.pointerId); seek(e); e.preventDefault(); });
  wrap.addEventListener("pointermove", function (e) { if (dragging) seek(e); });
  wrap.addEventListener("pointerup", function () { dragging = false; });
  wrap.addEventListener("pointercancel", function () { dragging = false; });

  new ResizeObserver(layout).observe(wrap);
  layout();
  requestAnimationFrame(frame);
})();
