// Custom cursor: one disc that inverts the colours under it.
// It grows over links and buttons, and over projects/images it becomes a coloured badge with a word.
// Only for mouse/trackpad users who have not asked for reduced motion.
(function () {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var root = document.documentElement;
  var c = document.createElement('div'); c.className = 'cur'; c.setAttribute('aria-hidden', 'true');
  var label = document.createElement('span'); label.className = 'cur-label'; c.appendChild(label);
  document.body.appendChild(c);
  root.classList.add('has-cursor');

  var mx = -100, my = -100, x = -100, y = -100, seen = false;
  window.addEventListener('mousemove', function (e) {
    mx = e.clientX; my = e.clientY;
    if (!seen) { x = mx; y = my; seen = true; root.classList.add('cur-on'); }
  }, { passive: true });
  document.addEventListener('mouseleave', function () { root.classList.remove('cur-on'); });
  document.addEventListener('mouseenter', function () { if (seen) root.classList.add('cur-on'); });
  window.addEventListener('mousedown', function () { c.classList.add('is-down'); });
  window.addEventListener('mouseup', function () { c.classList.remove('is-down'); });

  function it() { return root.lang !== 'en'; }
  function labelFor(el) {
    var t = el.closest('[data-cursor]');
    if (t) return it() ? t.getAttribute('data-cursor') : (t.getAttribute('data-cursor-en') || t.getAttribute('data-cursor'));
    if (el.closest('.zoomable')) return it() ? 'Apri' : 'Open';
    return '';
  }
  document.addEventListener('mouseover', function (e) {
    var el = e.target;
    if (!(el instanceof Element)) return;
    var text = labelFor(el);
    var hot = !text && el.closest('a, button, [role="button"], label, summary');
    c.classList.toggle('is-hot', !!hot);
    c.classList.toggle('has-label', !!text);
    if (text) label.textContent = text;
  });

  function frame() {
    x += (mx - x) * 0.45; y += (my - y) * 0.45;
    c.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
