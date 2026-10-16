// CV links follow the page language: the English page offers the English CV.
(function () {
  var links = document.querySelectorAll('a[href$="cv-sebastyan-buryas.pdf"], a[href$="cv-virginia-dalmasso.pdf"], a[data-cv]');
  links.forEach(function (a) { if (!a.dataset.cv) a.dataset.cv = a.getAttribute('href'); });
  function set() {
    var en = document.documentElement.lang === 'en';
    links.forEach(function (a) { a.setAttribute('href', en ? a.dataset.cv.replace(/\.pdf$/, '-en.pdf') : a.dataset.cv); });
  }
  set(); document.addEventListener('langchange', set);
})();
