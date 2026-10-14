// Motion inspired by studio sites: smooth scrolling, headings that rise letter by letter,
// and a moving text band. Everything is skipped when the visitor asks for reduced motion.
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) { document.documentElement.classList.add('motion-off'); return; }

  // 1. Smooth scrolling (Lenis), anchors included
  if (window.Lenis) {
    var lenis = new window.Lenis({ duration: 1.1, smoothWheel: true, anchors: { offset: -72 } });
    document.documentElement.classList.add('has-lenis');
    function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    var obs = new MutationObserver(function () {
      var open = document.querySelector('dialog[open]');
      if (open) lenis.stop(); else lenis.start();
    });
    document.querySelectorAll('dialog').forEach(function (d) { obs.observe(d, { attributes: true, attributeFilter: ['open'] }); });
    setTimeout(function () {
      document.querySelectorAll('dialog').forEach(function (d) { obs.observe(d, { attributes: true, attributeFilter: ['open'] }); });
    }, 500);
  }

  // 2. Section headings rise letter by letter when they enter the screen
  var heads = Array.prototype.slice.call(document.querySelectorAll('.section h2, .section .page-h'));
  function splitHead(h) {
    var text = h.textContent;
    h.setAttribute('aria-label', text.trim());
    h.textContent = '';
    var wrap = document.createElement('span');
    wrap.className = 'rise';
    wrap.setAttribute('aria-hidden', 'true');
    Array.prototype.forEach.call(text, function (ch, i) {
      var s = document.createElement('span');
      s.className = 'ch';
      s.textContent = ch === ' ' ? ' ' : ch;
      s.style.transitionDelay = (i * 35) + 'ms';
      wrap.appendChild(s);
    });
    h.appendChild(wrap);
  }
  heads.forEach(function (h) { h.classList.remove('reveal'); h.style.transitionDelay = ''; splitHead(h); });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('risen'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -10% 0px' });
  heads.forEach(function (h) { io.observe(h); });
  document.addEventListener('langchange', function () {
    heads.forEach(function (h) { var was = h.classList.contains('risen'); splitHead(h); if (was) h.classList.add('risen'); });
  });

  // 3. Text band: speed follows the scroll, direction flips when scrolling up
  var bands = document.querySelectorAll('.marquee-track');
  var x = 0, speed = 0.6, dir = 1, lastY = window.scrollY;
  function loop() {
    var y = window.scrollY, dy = y - lastY; lastY = y;
    if (dy !== 0) dir = dy > 0 ? 1 : -1;
    var boost = Math.min(Math.abs(dy) * 0.25, 8);
    x -= (speed + boost) * dir;
    bands.forEach(function (t) {
      var w = t.scrollWidth / 2;
      if (x <= -w) x += w;
      if (x > 0) x -= w;
      t.style.transform = 'translate3d(' + x + 'px,0,0)';
    });
    requestAnimationFrame(loop);
  }
  if (bands.length) requestAnimationFrame(loop);
})();
