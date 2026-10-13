// Highlight the nav link of the section you are reading.
(function () {
  var links = Array.prototype.filter.call(document.querySelectorAll('.nav nav a[href*="#"]'), function (a) {
    var id = a.getAttribute('href').split('#')[1];
    return id && document.getElementById(id);
  });
  if (!links.length) return;
  var sections = links.map(function (a) { return document.getElementById(a.getAttribute('href').split('#')[1]); });
  var current = null;
  function update() {
    var line = window.innerHeight * 0.35, active = -1;
    sections.forEach(function (s, i) { if (s.getBoundingClientRect().top <= line) active = i; });
    // at the very bottom, the last section wins even if it is short
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) active = sections.length - 1;
    if (active !== -1 && sections[active].getBoundingClientRect().bottom < 0) active = -1;
    if (active === current) return;
    current = active;
    links.forEach(function (a, i) {
      a.classList.toggle('is-active', i === active);
      if (i === active) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
    });
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () { update(); ticking = false; });
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
