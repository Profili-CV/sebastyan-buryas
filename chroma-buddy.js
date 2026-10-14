// A little CHROMA (the project's mascot) floats around the CHROMA project while you scroll past it.
// It follows an orbit around the cover, faces the way it moves, and says a line at three moments.
// Decorative: hidden from screen readers; static and still with reduced motion.
(function () {
  var cover = document.querySelector('#progetti .feature .feature-media');
  if (!cover) return;
  var feature = cover.closest('.feature');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var b = document.createElement('div');
  b.className = 'buddy'; b.setAttribute('aria-hidden', 'true');
  b.innerHTML = '<div class="buddy-body"><img src="img/chroma/chroma-omino.png" alt="" width="256" height="360"></div><span class="buddy-say"></span>';
  feature.appendChild(b);
  var body = b.querySelector('.buddy-body'), say = b.querySelector('.buddy-say');
  var lines = [
    { it: 'Ciao! Sono CHROMA', en: 'Hi! I am CHROMA' },
    { it: 'Ti leggo i colori…', en: 'Reading your colours…' },
    { it: 'Prova a farti guardare ↓', en: 'Let me look at you ↓' }
  ];
  var shown = -1, x = null, y = 0, visible = false, lastX = 0, face = 1, sayT;
  function en() { return document.documentElement.lang === 'en'; }
  function talk(i) {
    if (i === shown) return; shown = i;
    say.textContent = lines[i][en() ? 'en' : 'it'];
    b.classList.add('is-talking'); clearTimeout(sayT);
    sayT = setTimeout(function () { b.classList.remove('is-talking'); }, 2600);
  }
  function target() {
    var f = feature.getBoundingClientRect(), m = cover.querySelector('.ph') || cover;
    var r = m.getBoundingClientRect(), vh = window.innerHeight;
    var size = b.offsetWidth || 90;
    var p = Math.max(0, Math.min(1, (vh * 0.85 - r.top) / (r.height + vh * 0.6)));
    // orbit around the cover: from its top-right corner, down the right side, under it, up the left
    var a = (-0.25 + p * 1.15) * Math.PI * 2 * 0.62 - Math.PI / 3;
    var cx = r.left - f.left + r.width / 2, cy = r.top - f.top + r.height / 2;
    var rx = r.width / 2 + size * 0.05, ry = r.height / 2 + size * 0.15;
    var tx = cx + Math.cos(a) * rx - size / 2, ty = cy + Math.sin(a) * ry - size * 0.7;
    var maxX = f.width - size * 0.85; // never pushes the page sideways
    if (r.width < f.width * 0.8) maxX = Math.min(maxX, r.right - f.left - size * 0.55); // text beside: stay on the cover's side
    tx = Math.max(-size * 0.15, Math.min(maxX, tx));
    return { x: tx, y: ty, p: p, back: Math.sin(a) < -0.15 };
  }
  function place(t) {
    var dx = t.x - lastX; lastX = t.x;
    if (Math.abs(dx) > 0.4) face = dx > 0 ? 1 : -1;
    var tilt = Math.max(-14, Math.min(14, dx * 1.6));
    b.classList.toggle('say-left', t.x > feature.clientWidth * 0.5);
    b.style.transform = 'translate3d(' + t.x + 'px,' + t.y + 'px,0)';
    body.style.transform = 'scaleX(' + face + ') rotate(' + tilt * face + 'deg)';
    talk(t.p < 0.3 ? 0 : t.p < 0.62 ? 1 : 2);
  }
  if (reduce) {
    var still = function () { var t = target(); t.x = feature.getBoundingClientRect().width * 0.5; place({ x: t.x, y: -20, p: 0 }); };
    still(); window.addEventListener('resize', still); return;
  }
  function loop() {
    if (!visible) return;
    var t = target();
    if (x === null) { x = t.x; y = t.y; }
    x += (t.x - x) * 0.12; y += (t.y - y) * 0.12;
    b.classList.toggle('is-behind', t.back);
    place({ x: x, y: y, p: t.p });
    requestAnimationFrame(loop);
  }
  new IntersectionObserver(function (es) {
    var was = visible; visible = es[0].isIntersecting;
    b.classList.toggle('is-here', visible);
    if (visible && !was) requestAnimationFrame(loop);
  }, { rootMargin: '10% 0px' }).observe(feature);
  document.addEventListener('langchange', function () { if (shown > -1) say.textContent = lines[shown][en() ? 'en' : 'it']; });
})();
