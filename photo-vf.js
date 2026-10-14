// Viewfinder on the photos. With a mouse it appears when you hover a photo (focus brackets close in,
// the AF point blinks green). On touch screens it locks onto the photo in the middle of the screen.
// On the photo page it also shows the real shooting data read from the original files (img/foto/exif.json).
(function () {
  var figs = Array.prototype.slice.call(document.querySelectorAll('#fotografia .photos .ph:not(.more), .album .ph'));
  if (!figs.length) return;
  var withData = !!document.querySelector('.album');
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var exif = {};
  figs.forEach(function (f) {
    var vf = document.createElement('span'); vf.className = 'fx-vf' + (withData ? ' fx-vf-data' : ''); vf.setAttribute('aria-hidden', 'true');
    vf.innerHTML = '<i></i><i></i><i></i><i></i><b></b>' + (withData ? '<span class="vf-top"></span><span class="vf-lcd"></span>' : '');
    f.appendChild(vf);
  });
  function key(f) { var m = (f.querySelector('img').getAttribute('src') || '').match(/(foto-\d+)/); return m ? m[1] : ''; }
  function fill(f) {
    if (!withData) return;
    var d = exif[key(f)], vf = f.querySelector('.fx-vf'), en = document.documentElement.lang === 'en';
    var top = vf.querySelector('.vf-top'), lcd = vf.querySelector('.vf-lcd');
    if (!d) { top.textContent = ''; lcd.innerHTML = '<span>' + (en ? 'no shooting data' : 'dati di scatto non disponibili') + '</span>'; return; }
    top.textContent = d.cam + (d.lens ? ' · ' + d.lens : '') + ' · ' + (en ? d.en : d.it);
    lcd.innerHTML = '<span>' + d.t + '</span><span>' + d.f + '</span><span>' + d.iso + '</span><span>' + d.mm + '</span>';
  }
  function on(f) { fill(f); f.classList.remove('fx-af'); void f.offsetWidth; f.classList.add('fx-focus'); if (!reduce) f.classList.add('fx-af'); }
  function off(f) { f.classList.remove('fx-focus', 'fx-af'); }
  if (withData) {
    fetch('img/foto/exif.json').then(function (r) { return r.json(); }).then(function (j) { exif = j; figs.forEach(function (f) { if (f.classList.contains('fx-focus')) fill(f); }); }).catch(function () {});
    document.addEventListener('langchange', function () { figs.forEach(function (f) { if (f.classList.contains('fx-focus')) fill(f); }); });
  }
  if (fine) {
    figs.forEach(function (f) { f.addEventListener('mouseenter', function () { on(f); }); f.addEventListener('mouseleave', function () { off(f); }); });
    return;
  }
  // touch: the photo closest to the middle of the screen gets the viewfinder
  var current = null, ticking = false;
  function pick() {
    ticking = false;
    var mid = window.innerHeight / 2, best = null, bd = 1e9;
    figs.forEach(function (f) { var r = f.getBoundingClientRect(); if (r.bottom < 0 || r.top > window.innerHeight) return; var d = Math.abs(r.top + r.height / 2 - mid) + Math.abs(r.left + r.width / 2 - window.innerWidth / 2) * 0.35; if (d < bd) { bd = d; best = f; } });
    if (best !== current) { if (current) off(current); current = best; if (current) on(current); }
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(pick); } }, { passive: true });
  pick();
})();
