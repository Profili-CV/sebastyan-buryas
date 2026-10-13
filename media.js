// Project videos play silently while on screen, and pause when scrolled away.
(function () {
  var vids = document.querySelectorAll('video[data-autoplay]');
  if (!vids.length) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  vids.forEach(function (v) {
    v.muted = true;
    if (reduce) { v.setAttribute('controls', ''); return; }
  });
  if (reduce || !('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var v = e.target;
      if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      else v.pause();
    });
  }, { threshold: 0.35 });
  vids.forEach(function (v) { io.observe(v); });
})();
