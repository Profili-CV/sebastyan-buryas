// Custom cursor: a dot, a ring that follows with a little delay, and a fading trail.
// Over links and buttons the ring grows; over images and projects it shows a short label.
// Only for mouse/trackpad users who have not asked for reduced motion.
(function () {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var root = document.documentElement;
  var script = document.currentScript;
  var trailColors = (script && script.getAttribute('data-trail') || '').split(',').filter(Boolean);

  var dot = document.createElement('div'); dot.className = 'cur-dot';
  var ring = document.createElement('div'); ring.className = 'cur-ring';
  var label = document.createElement('span'); label.className = 'cur-label'; ring.appendChild(label);
  var canvas = document.createElement('canvas'); canvas.className = 'cur-trail';
  [canvas, ring, dot].forEach(function (el) { el.setAttribute('aria-hidden', 'true'); document.body.appendChild(el); });
  root.classList.add('has-cursor');

  var ctx = canvas.getContext('2d');
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  function size() { canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  size(); window.addEventListener('resize', size);

  var mx = -100, my = -100, rx = -100, ry = -100, seen = false;
  var pts = [];
  var hue = 0;

  function accent() { return getComputedStyle(root).getPropertyValue('--accent').trim() || getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#888'; }

  window.addEventListener('mousemove', function (e) {
    mx = e.clientX; my = e.clientY;
    if (!seen) { rx = mx; ry = my; seen = true; root.classList.add('cur-on'); }
    pts.push({ x: mx, y: my, t: performance.now() });
  }, { passive: true });
  document.addEventListener('mouseleave', function () { root.classList.remove('cur-on'); });
  document.addEventListener('mouseenter', function () { if (seen) root.classList.add('cur-on'); });
  window.addEventListener('mousedown', function () { root.classList.add('cur-down'); });
  window.addEventListener('mouseup', function () { root.classList.remove('cur-down'); });

  function it() { return root.lang !== 'en'; }
  function labelFor(el) {
    var t = el.closest('[data-cursor]');
    if (t) return it() ? t.getAttribute('data-cursor') : (t.getAttribute('data-cursor-en') || t.getAttribute('data-cursor'));
    if (el.closest('.zoomable')) return it() ? 'Ingrandisci' : 'Zoom';
    return '';
  }
  document.addEventListener('mouseover', function (e) {
    var el = e.target;
    if (!(el instanceof Element)) return;
    var text = labelFor(el);
    var hot = text || el.closest('a, button, [role="button"], label, summary');
    ring.classList.toggle('is-hot', !!hot);
    ring.classList.toggle('has-label', !!text);
    label.textContent = text;
  });

  function frame(now) {
    rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
    dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
    ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0)';

    // trail: points live 350ms
    while (pts.length && now - pts[0].t > 350) pts.shift();
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    if (pts.length > 1 && !document.querySelector('dialog[open]')) {
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      var single = trailColors.length ? null : accent();
      for (var i = 1; i < pts.length; i++) {
        var a = pts[i - 1], b = pts[i];
        var life = 1 - (now - b.t) / 350;
        ctx.globalAlpha = Math.max(0, life) * 0.85;
        ctx.lineWidth = 1.5 + life * 6;
        ctx.strokeStyle = single || trailColors[Math.floor((i + hue) / 3) % trailColors.length];
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
      ctx.globalAlpha = 1;
      hue += 0.35;
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
