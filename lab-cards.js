// Laboratorio a card: file orizzontali con frecce, anteprima live del sito caricata solo quando la card si vede.
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function load(thumb) {
    if (thumb.dataset.loaded || !thumb.dataset.src) return;
    thumb.dataset.loaded = '1';
    var f = document.createElement('iframe');
    f.src = thumb.dataset.src; f.tabIndex = -1; f.title = ''; f.loading = 'lazy';
    f.setAttribute('aria-hidden', 'true'); f.setAttribute('sandbox', 'allow-scripts allow-same-origin');
    thumb.style.setProperty('--s', thumb.clientWidth / 1440);
    f.addEventListener('load', function () { thumb.classList.add('ready'); });
    thumb.appendChild(f);
  }
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { load(e.target); io.unobserve(e.target); } });
  }, { rootMargin: '200px' }) : null;
  window.labThumbs = function (root) {
    (root || document).querySelectorAll('.lab-thumb[data-src]').forEach(function (t) { io ? io.observe(t) : load(t); });
  };
  window.labThumbs();

  document.querySelectorAll('.lab-group').forEach(function (g) {
    var track = g.querySelector('.lab-track'), btns = g.querySelectorAll('.lab-nav-btn');
    if (!track) return;
    function update() {
      var max = track.scrollWidth - track.clientWidth - 2;
      g.classList.toggle('lab-fits', max <= 0);
      btns[0].disabled = track.scrollLeft <= 2; btns[1].disabled = track.scrollLeft >= max;
    }
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        var card = track.querySelector('li'), step = card ? card.getBoundingClientRect().width + 20 : track.clientWidth * .8;
        track.scrollBy({ left: step * +b.dataset.dir, behavior: reduce ? 'auto' : 'smooth' });
      });
    });
    track.addEventListener('scroll', update, { passive: true });
    addEventListener('resize', function () { update(); g.querySelectorAll('.lab-thumb').forEach(function (t) { t.style.setProperty('--s', t.clientWidth / 1440); }); });
    update();
  });
})();
