// Phone menu: a burger button opens the section links as a full-height panel under the header.
(function () {
  var head = document.querySelector('.nav');
  var nav = head && head.querySelector('nav');
  if (!nav) return;
  var mq = window.matchMedia('(max-width: 900px)');
  var btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'burger';
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', 'site-menu');
  btn.innerHTML = '<span></span><span></span><span></span>';
  nav.id = 'site-menu';
  nav.setAttribute('data-lenis-prevent', '');
  head.appendChild(btn);
  function label() {
    var en = document.documentElement.lang === 'en', open = head.classList.contains('menu-open');
    btn.setAttribute('aria-label', open ? (en ? 'Close menu' : 'Chiudi il menu') : (en ? 'Open menu' : 'Apri il menu'));
  }
  function set(open) {
    head.classList.toggle('menu-open', open);
    document.documentElement.classList.toggle('menu-lock', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    label();
  }
  btn.addEventListener('click', function () { set(!head.classList.contains('menu-open')); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && head.classList.contains('menu-open')) { set(false); btn.focus(); } });
  (mq.addEventListener ? mq.addEventListener('change', function () { set(false); }) : 0);
  document.addEventListener('langchange', label);
  label();
})();
