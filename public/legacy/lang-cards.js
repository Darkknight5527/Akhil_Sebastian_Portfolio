/* Languages row (19 Oct 2026): fill the bars when the row scrolls into view. */
(function () {
  var wrap = document.querySelector(".lang-wrap");
  if (!wrap) return;
  new IntersectionObserver(function (es, io) {
    es.forEach(function (e) { if (e.isIntersecting) { wrap.classList.add("in"); io.disconnect(); } });
  }, { threshold: 0.3 }).observe(wrap);
})();
