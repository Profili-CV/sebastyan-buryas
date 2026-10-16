// Laboratorio: on desktop, hovering a row shows a live, scaled-down window of that site next to the pointer.
(function () {
  var rows = document.querySelectorAll('.lab-row[data-peek]');
  if (!rows.length || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var peek = document.createElement('div');
  peek.className = 'lab-peek'; peek.setAttribute('aria-hidden', 'true');
  peek.innerHTML = '<div class="lab-peek-bar"><i></i><i></i><i></i><span></span></div><div class="lab-peek-view"></div>';
  document.body.appendChild(peek);
  var bar = peek.querySelector('span'), view = peek.querySelector('.lab-peek-view');
  var frames = {}, tx = 0, ty = 0, x = 0, y = 0, raf = 0, active = null;
  function loadingText() { return document.documentElement.lang === 'en' ? 'Loading…' : 'Carico…'; }

  function frameFor(url) {
    if (!frames[url]) {
      var f = document.createElement('iframe');
      f.src = url; f.tabIndex = -1; f.setAttribute('aria-hidden', 'true'); f.title = '';
      f.setAttribute('sandbox', 'allow-scripts allow-same-origin');
      view.appendChild(f); frames[url] = f;
    }
    return frames[url];
  }
  function place() {
    var w = 402, h = 280, pad = 24;
    var px = tx + pad, py = ty + pad;
    if (px + w > innerWidth - 12) px = tx - w - pad;
    if (py + h > innerHeight - 12) py = ty - h - pad;
    return [px, py];
  }
  function tick() {
    var p = place();
    if (reduce) { x = p[0]; y = p[1]; } else { x += (p[0] - x) * 0.18; y += (p[1] - y) * 0.18; }
    peek.style.setProperty('--x', x + 'px'); peek.style.setProperty('--y', y + 'px');
    if (active && (Math.abs(p[0] - x) > .5 || Math.abs(p[1] - y) > .5)) raf = requestAnimationFrame(tick); else raf = 0;
  }
  function kick() { if (!raf) raf = requestAnimationFrame(tick); }

  rows.forEach(function (row) {
    function show(e) {
      var url = row.getAttribute('data-peek');
      active = row; tx = e.clientX; ty = e.clientY;
      if (!peek.classList.contains('on')) { var p = place(); x = p[0]; y = p[1]; }
      bar.textContent = url.replace(/^https?:\/\//, '');
      view.setAttribute('data-loading', loadingText());
      Object.keys(frames).forEach(function (k) { frames[k].classList.remove('on'); });
      frameFor(url).classList.add('on');
      peek.classList.add('on'); kick();
    }
    row.addEventListener('pointerenter', show);
    row.addEventListener('pointermove', function (e) { if (active !== row) return show(e); tx = e.clientX; ty = e.clientY; kick(); });
    row.addEventListener('pointerleave', function () { active = null; peek.classList.remove('on'); });
  });
  addEventListener('scroll', function () { if (active) { active = null; peek.classList.remove('on'); } }, { passive: true });
})();
