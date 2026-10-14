// Small scroll-driven touches, each tied to its project:
// Cartoombria → comic onomatopoeias pop around the booth; Porcodduo → the studio's wave draws itself;
// LED installation → a strip of LEDs lights up; cave painting → hand stamps appear;
// Path → the timeline fills.
// All decorative (aria-hidden). With reduced motion everything is shown in its final state, still.
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;
  if (reduce) root.classList.add('fx-still');
  var items = []; // { el, update(p) }
  function progress(el) { // 0 when the element's top reaches the bottom of the screen, 1 when its bottom leaves the top
    var r = el.getBoundingClientRect(), vh = window.innerHeight;
    return Math.max(0, Math.min(1, (vh - r.top) / (vh + r.height)));
  }
  function add(el, update) { if (el) items.push({ el: el, update: update, on: false }); }
  function mk(tag, cls, html) { var e = document.createElement(tag); e.className = cls; e.setAttribute('aria-hidden', 'true'); if (html) e.innerHTML = html; return e; }

  var cards = document.querySelectorAll('#progetti .pair:not(.motion) .card');
  // 1. Cartoombria: onomatopoeias
  var cart = cards[0];
  if (cart) {
    var fig = cart.querySelector('.ph'), words = [['SBAM!', 'fx-pow-a'], ['POW!', 'fx-pow-b'], ['WOW!', 'fx-pow-c']];
    var pows = words.map(function (w) { var s = mk('span', 'fx-pow ' + w[1], '<span>' + w[0] + '</span>'); cart.appendChild(s); return s; });
    add(cart, function (p) { cart.style.setProperty('--fig-h', fig.offsetHeight + 'px'); pows.forEach(function (s, i) { s.classList.toggle('on', reduce || (p > 0.22 + i * 0.1 && p < 0.86)); }); });
  }
  // 2. Porcodduo: the wave draws itself
  var pd = cards[1];
  if (pd) {
    var d = 'M2 18'; for (var i = 0; i < 12; i++) d += ' q 12.5 -16 25 0 t 25 0';
    var w = mk('div', 'fx-wave', '<svg viewBox="0 0 604 36" preserveAspectRatio="none"><path d="' + d + '" pathLength="1"/></svg>');
    pd.insertBefore(w, pd.querySelector('h3'));
    var path = w.querySelector('path');
    add(pd, function (p) { path.style.strokeDashoffset = reduce ? 0 : String(1 - Math.min(1, Math.max(0, (p - 0.15) / 0.5))); });
  }
  // 3 + 4. Motion: LED strip and hand stamps
  var mcards = document.querySelectorAll('#progetti .pair.motion .card');
  var led = mcards[0];
  if (led) {
    var N = 28, strip = mk('div', 'fx-leds'), dots = [];
    for (var k = 0; k < N; k++) { var dot = document.createElement('i'); dot.style.setProperty('--h', (k * 360 / N + 180) % 360); strip.appendChild(dot); dots.push(dot); }
    led.insertBefore(strip, led.querySelector('h3'));
    add(led, function (p) { var n = reduce ? N : Math.round(Math.min(1, Math.max(0, (p - 0.15) / 0.5)) * N); dots.forEach(function (o, i) { o.classList.toggle('on', i < n); }); });
  }
  var cave = mcards[1];
  if (cave) {
    var hand = '<svg viewBox="0 0 60 80"><path d="M17 78c-6-9-12-18-14-26-1-5 4-7 7-3l6 8V14c0-4 6-4 6 0v24h2V6c0-4 6-4 6 0v32h2V9c0-4 6-4 6 0v30h2V17c0-4 6-4 6 0v32c0 12-4 22-9 29z"/></svg>';
    var cfig = cave.querySelector('.ph'), spots = ['fx-hand-a', 'fx-hand-b', 'fx-hand-c'];
    var hands = spots.map(function (c) { var h = mk('span', 'fx-hand ' + c, hand); cfig.appendChild(h); return h; });
    add(cave, function (p) { hands.forEach(function (h, i) { h.classList.toggle('on', reduce || p > 0.25 + i * 0.12); }); });
  }
  // 6. Path: the timeline fills with colour as you go
  var tl = document.querySelector('#percorso .timeline');
  add(tl, function () {
    var r = tl.getBoundingClientRect(), vh = window.innerHeight;
    var p = reduce ? 1 : Math.max(0, Math.min(1, (vh * 0.7 - r.top) / r.height));
    tl.style.setProperty('--tl-p', p.toFixed(4));
  });

  var ticking = false;
  function run() { ticking = false; items.forEach(function (it) { if (it.on) it.update(progress(it.el)); }); }
  function req() { if (!ticking) { ticking = true; requestAnimationFrame(run); } }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { items.forEach(function (it) { if (it.el === e.target) it.on = e.isIntersecting; }); });
    req();
  }, { rootMargin: '15% 0px' });
  items.forEach(function (it) { io.observe(it.el); });
  window.addEventListener('scroll', req, { passive: true });
  window.addEventListener('resize', req);
})();
