/*
 * Running-light border on the contact form's Send button (from the effects model's
 * "moving border", 19 Oct 2026). A soft green glow travels round the button's
 * rounded edge every 3 s. Drawn in vanilla JS: an invisible rounded rect gives the
 * path, and a blurred dot is moved along it each frame.
 */
(function () {
  var btn = document.getElementById("cf-btn");
  if (!btn) return;
  var NS = "http://www.w3.org/2000/svg";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var DURATION = 3000, RADIUS = 14;

  // drop the inline hover handlers that turned it solid green
  btn.removeAttribute("onmouseover");
  btn.removeAttribute("onmouseout");

  var text = btn.textContent.trim();
  btn.textContent = "";
  btn.classList.add("run-border");

  var orbit = document.createElement("span");
  orbit.className = "cf-orbit";
  orbit.setAttribute("aria-hidden", "true");
  var svg = document.createElementNS(NS, "svg");
  var rect = document.createElementNS(NS, "rect");
  rect.setAttribute("fill", "none");
  svg.appendChild(rect);
  var blob = document.createElement("span");
  blob.className = "cf-blob";
  orbit.appendChild(svg);
  orbit.appendChild(blob);

  var inner = document.createElement("span");
  inner.className = "cf-inner";
  var label = document.createElement("span");
  label.className = "cf-label";
  label.textContent = text;
  inner.appendChild(label);

  btn.appendChild(orbit);
  btn.appendChild(inner);

  var len = 0;
  function layout() {
    var w = btn.clientWidth, h = btn.clientHeight;
    svg.setAttribute("width", w);
    svg.setAttribute("height", h);
    rect.setAttribute("width", w);
    rect.setAttribute("height", h);
    rect.setAttribute("rx", RADIUS);
    rect.setAttribute("ry", RADIUS);
    len = rect.getTotalLength();
  }
  // Performance (19 Oct 2026): only animate while the button is on screen
  var visible = false;
  new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(btn);
  function place(now) {
    if (len && (visible || reduce)) {
      var pt = rect.getPointAtLength(((now % DURATION) / DURATION) * len);
      blob.style.transform = "translate(" + pt.x + "px," + pt.y + "px) translate(-50%,-50%)";
    }
    if (!reduce) requestAnimationFrame(place);
  }
  new ResizeObserver(function () { layout(); if (reduce) place(DURATION * 0.1); }).observe(btn);
  layout();
  requestAnimationFrame(place);
})();
