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

// Click a project video to watch it large, with controls.
(function () {
  var figs = document.querySelectorAll('.ph.vid');
  if (!figs.length) return;
  var box = document.createElement('dialog');
  box.className = 'lightbox vid-box';
  box.innerHTML = '<video class="lb-video" controls playsinline loop></video>' +
    '<button class="lb-btn lb-close" type="button" data-close><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg></button>';
  document.body.appendChild(box);
  var big = box.querySelector('video');
  var close = box.querySelector('[data-close]');
  function lang() { return document.documentElement.lang === 'en'; }
  figs.forEach(function (fig) {
    var v = fig.querySelector('video');
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'vid-open';
    btn.setAttribute('data-cursor', 'Guarda');
    btn.setAttribute('data-cursor-en', 'Watch');
    btn.innerHTML = '<span class="vid-open-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></span>';
    fig.appendChild(btn);
    function label() { btn.setAttribute('aria-label', (lang() ? 'Watch large: ' : 'Guarda in grande: ') + (v.getAttribute('aria-label') || '')); }
    label(); document.addEventListener('langchange', label);
    btn.addEventListener('click', function () {
      big.src = v.currentSrc || v.src; big.poster = v.poster;
      close.setAttribute('aria-label', lang() ? 'Close' : 'Chiudi');
      box.setAttribute('aria-label', v.getAttribute('aria-label') || 'Video');
      if (box.showModal) box.showModal(); else box.setAttribute('open', '');
      var p = big.play(); if (p && p.catch) p.catch(function () {});
    });
  });
  close.addEventListener('click', function () { box.close(); });
  box.addEventListener('click', function (e) { if (e.target === box) box.close(); });
  box.addEventListener('close', function () { big.pause(); big.removeAttribute('src'); big.load(); });
})();
