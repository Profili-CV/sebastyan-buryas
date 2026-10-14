// "Frame" cursor: the system pointer stays visible; a hollow ring trails it and,
// over anything clickable, morphs to frame that element (never covering it).
// Over images a small label appears beside the pointer. Mouse/trackpad only.
(function () {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;
  var ring = document.createElement('div'); ring.className = 'cframe'; ring.setAttribute('aria-hidden', 'true');
  var tag = document.createElement('div'); tag.className = 'ctag'; tag.setAttribute('aria-hidden', 'true');
  document.body.appendChild(ring); document.body.appendChild(tag);
  root.classList.add('has-cframe');

  var mx = -100, my = -100, x = -100, y = -100, w = 26, h = 26, r = 13, cw = 26, ch = 26, cr = 13;
  var target = null, seen = false, label = '';
  var PAD = 6;
  function it() { return root.lang !== 'en'; }
  function labelFor(el) {
    var t = el.closest('[data-cursor]');
    if (t) return it() ? t.getAttribute('data-cursor') : (t.getAttribute('data-cursor-en') || t.getAttribute('data-cursor'));
    if (el.closest('.zoomable, .ph img, .album img, .cw-media img, .lm img, .cd-gallery img, .ff-posts img')) return it() ? 'Apri' : 'Open';
    return '';
  }
  var CLICK = 'a, button, [role="button"], label, summary, .lang, select';
  window.addEventListener('mousemove', function (e) {
    mx = e.clientX; my = e.clientY;
    if (!seen) { x = mx; y = my; seen = true; root.classList.add('cframe-on'); }
  }, { passive: true });
  document.addEventListener('mouseleave', function () { root.classList.remove('cframe-on'); });
  document.addEventListener('mouseenter', function () { if (seen) root.classList.add('cframe-on'); });
  window.addEventListener('mousedown', function () { ring.classList.add('is-down'); });
  window.addEventListener('mouseup', function () { ring.classList.remove('is-down'); });
  document.addEventListener('mouseover', function (e) {
    var el = e.target; if (!(el instanceof Element)) return;
    label = labelFor(el);
    var hit = el.closest(CLICK);
    // big blocks (cards, images, the mail button) get a label, not a frame
    if (hit) { var b = hit.getBoundingClientRect(); if (b.width > 520 || b.height > 220) hit = null; }
    if (el.closest('input, textarea, [contenteditable]')) { hit = null; label = ''; ring.classList.add('is-text'); } else ring.classList.remove('is-text');
    target = hit;
    ring.classList.toggle('is-framing', !!target);
    tag.classList.toggle('is-on', !!label && !target);
    if (label) tag.textContent = label;
  });
  function frame() {
    var k = reduce ? 1 : 0.28;
    if (target && document.contains(target)) {
      var b = target.getBoundingClientRect();
      var cx = b.left + b.width / 2, cy = b.top + b.height / 2;
      // a little magnetic pull towards the pointer
      var tx = cx + (mx - cx) * 0.08, ty = cy + (my - cy) * 0.12;
      x += (tx - x) * k; y += (ty - y) * k;
      var rad = parseFloat(getComputedStyle(target).borderTopLeftRadius) || 6;
      cw = b.width + PAD * 2; ch = b.height + PAD * 2; cr = Math.min(rad + PAD, ch / 2);
    } else {
      x += (mx - x) * (reduce ? 1 : 0.35); y += (my - y) * (reduce ? 1 : 0.35);
      cw = 26; ch = 26; cr = 13;
    }
    w += (cw - w) * k; h += (ch - h) * k; r += (cr - r) * k;
    ring.style.width = w + 'px'; ring.style.height = h + 'px'; ring.style.borderRadius = r + 'px';
    ring.style.transform = 'translate3d(' + (x - w / 2) + 'px,' + (y - h / 2) + 'px,0)';
    tag.style.transform = 'translate3d(' + (mx + 18) + 'px,' + (my + 20) + 'px,0)';
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
