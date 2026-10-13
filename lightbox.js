// Click any project image to see it large. Arrows or ← → to move, Esc or a click outside to close.
(function () {
  var SELECTOR = document.currentScript && document.currentScript.getAttribute('data-images') || '.ph img';
  var it = document.documentElement.lang !== 'en';

  var box = document.createElement('dialog');
  box.className = 'lightbox';
  box.innerHTML =
    '<img class="lb-img" src="" alt="">' +
    '<button class="lb-btn lb-close" type="button" data-lb="close"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg></button>' +
    '<button class="lb-btn lb-prev" type="button" data-lb="prev"><svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
    '<button class="lb-btn lb-next" type="button" data-lb="next"><svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
    '<p class="lb-count" aria-live="polite"></p>';
  document.body.appendChild(box);
  var big = box.querySelector('.lb-img');
  var count = box.querySelector('.lb-count');

  function labels() {
    it = document.documentElement.lang !== 'en';
    box.setAttribute('aria-label', it ? 'Immagine ingrandita' : 'Enlarged image');
    box.querySelector('.lb-close').setAttribute('aria-label', it ? 'Chiudi' : 'Close');
    box.querySelector('.lb-prev').setAttribute('aria-label', it ? 'Immagine precedente' : 'Previous image');
    box.querySelector('.lb-next').setAttribute('aria-label', it ? 'Immagine successiva' : 'Next image');
  }

  var items = [];
  var i = 0;

  function collect() {
    items = Array.prototype.filter.call(document.querySelectorAll(SELECTOR), function (img) {
      return img.isConnected && img.complete && img.naturalWidth > 0;
    });
    items.forEach(function (img, n) {
      if (img.dataset.lbReady) return;
      img.dataset.lbReady = '1';
      var target = img.closest('button') || img;
      if (target === img) {
        img.setAttribute('tabindex', '0');
        img.setAttribute('role', 'button');
      }
      target.classList.add('zoomable');
      target.addEventListener('click', function (e) { e.preventDefault(); open(img); });
      target.addEventListener('keydown', function (e) {
        if (target === img && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); open(img); }
      });
    });
  }

  function show(n) {
    i = (n + items.length) % items.length;
    var img = items[i];
    big.src = img.getAttribute('data-full') || img.currentSrc || img.src;
    big.alt = img.alt;
    count.textContent = items.length > 1 ? (i + 1) + ' / ' + items.length : '';
    box.classList.toggle('single', items.length < 2);
  }

  // Only the images of the same project or section scroll together.
  var GROUP = '[data-lb-group], .thumbs, .photos, .album, .gallery, .posts-row, .doc, .feature, .card, .work, .step-media, .fl-grid, article, section';
  function groupOf(img) {
    var g = img.closest(GROUP);
    // a project's cover and its small thumbnails belong together
    if (g && g.matches('.thumbs')) g = g.closest('.card, .work, .feature, article') || g;
    return g;
  }
  function open(img) {
    collect();
    var g = groupOf(img);
    if (g) items = items.filter(function (el) { return groupOf(el) === g || g.contains(el); });
    labels();
    show(items.indexOf(img));
    if (box.showModal) box.showModal(); else box.setAttribute('open', '');
  }

  box.addEventListener('click', function (e) {
    var b = e.target.closest('[data-lb]');
    if (b) {
      var a = b.getAttribute('data-lb');
      if (a === 'close') box.close();
      if (a === 'prev') show(i - 1);
      if (a === 'next') show(i + 1);
      return;
    }
    if (e.target === box) box.close();
  });
  box.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') show(i - 1);
    if (e.key === 'ArrowRight') show(i + 1);
  });

  // Images can finish loading after this runs: hook them up as they arrive.
  Array.prototype.forEach.call(document.querySelectorAll(SELECTOR), function (img) {
    if (!img.complete) img.addEventListener('load', collect, { once: true });
  });
  collect();
})();
