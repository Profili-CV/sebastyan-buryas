// Loading screen: shown once per visit, hidden when the page has loaded (never longer than ~4s).
(function () {
  var root = document.documentElement;
  var pl = document.querySelector('.preloader');
  if (!pl || !root.classList.contains('pl-on')) { if (pl) pl.remove(); return; }
  var start = performance.now();
  var MIN = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 300 : 1300;
  var ended = false;
  function done() {
    if (ended) return; ended = true;
    var wait = Math.max(0, MIN - (performance.now() - start));
    setTimeout(function () {
      root.classList.add('pl-done');
      try { sessionStorage.setItem('pl-seen', '1'); } catch (e) {}
      setTimeout(function () { root.classList.remove('pl-on', 'pl-done'); pl.remove(); }, 900);
    }, wait);
  }
  if (document.readyState === 'complete') done(); else window.addEventListener('load', done);
  setTimeout(done, 4000);
})();
