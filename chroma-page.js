// CHROMA page: a little k-means "lens" over the cover (the measurement half of CHROMA),
// the deck filter, and a soft tilt on the cards under the mouse.
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // 1. k-means lens
  var media = document.querySelector('.ch-lab-media');
  if (media) {
    var img = media.querySelector('.ch-lab-img'), lens = media.querySelector('.ch-lens'), cv = media.querySelector('.ch-lab-canvas');
    var list = document.querySelector('.ch-palette'), ctx = cv.getContext('2d', { willReadFrequently: true });
    var W = 0, H = 0, ready = false, pending = null;
    function hex(c) { return '#' + c.map(function (v) { return ('0' + Math.round(v).toString(16)).slice(-2); }).join('').toUpperCase(); }
    function kmeans(px, k) {
      var cs = [], n = px.length, i, j;
      // farthest-point start, so the five colours are really different ones
      cs.push(px[Math.floor(n / 2)].slice());
      while (cs.length < k) {
        var far = 0, fd = -1;
        for (i = 0; i < n; i += 2) { var md = 1e9; for (j = 0; j < cs.length; j++) { var dd = (px[i][0] - cs[j][0]) ** 2 + (px[i][1] - cs[j][1]) ** 2 + (px[i][2] - cs[j][2]) ** 2; if (dd < md) md = dd; } if (md > fd) { fd = md; far = i; } }
        cs.push(px[far].slice());
      }
      var asg = new Array(n);
      for (var it = 0; it < 8; it++) {
        var sum = cs.map(function () { return [0, 0, 0, 0]; });
        for (i = 0; i < n; i++) {
          var best = 0, bd = 1e9;
          for (j = 0; j < k; j++) { var d = (px[i][0] - cs[j][0]) ** 2 + (px[i][1] - cs[j][1]) ** 2 + (px[i][2] - cs[j][2]) ** 2; if (d < bd) { bd = d; best = j; } }
          asg[i] = best; sum[best][0] += px[i][0]; sum[best][1] += px[i][1]; sum[best][2] += px[i][2]; sum[best][3]++;
        }
        for (j = 0; j < k; j++) if (sum[j][3]) cs[j] = [sum[j][0] / sum[j][3], sum[j][1] / sum[j][3], sum[j][2] / sum[j][3]];
        cs.forEach(function (c, jj) { c.w = sum[jj][3] / n; });
      }
      return cs.sort(function (a, b) { return b.w - a.w; });
    }
    function draw(cs) {
      list.innerHTML = cs.map(function (c) { return '<li><i style="--sw:' + hex(c) + '"></i><code>' + hex(c) + '</code><span>' + Math.round(c.w * 100) + '%</span></li>'; }).join('');
    }
    function sample(fx, fy) {
      if (!ready) return;
      var r = Math.max(8, Math.round(W * 0.06)), x0 = Math.max(0, Math.round(fx * W - r)), y0 = Math.max(0, Math.round(fy * H - r));
      var w = Math.min(W - x0, r * 2), h = Math.min(H - y0, r * 2);
      var d = ctx.getImageData(x0, y0, w, h).data, px = [];
      for (var i = 0; i < d.length; i += 4 * 3) px.push([d[i], d[i + 1], d[i + 2]]);
      draw(kmeans(px, 5));
    }
    function prep() {
      W = 240; H = Math.round(W * img.naturalHeight / img.naturalWidth); cv.width = W; cv.height = H;
      ctx.drawImage(img, 0, 0, W, H); ready = true; place(0.5, 0.42);
    }
    function place(fx, fy) {
      var r = media.getBoundingClientRect();
      lens.style.left = (fx * r.width) + 'px'; lens.style.top = (fy * r.height) + 'px';
      if (!pending) { pending = requestAnimationFrame(function () { pending = null; sample(fx, fy); }); }
    }
    function fromEvent(e) { var r = media.getBoundingClientRect(); place(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)), Math.min(1, Math.max(0, (e.clientY - r.top) / r.height))); }
    media.addEventListener('pointermove', fromEvent);
    media.addEventListener('pointerdown', fromEvent);
    if (img.complete && img.naturalWidth) prep(); else img.addEventListener('load', prep);
  }

  // 2. Deck filter
  var btns = document.querySelectorAll('.ch-filter button'), cards = document.querySelectorAll('.ch-card');
  btns.forEach(function (b) {
    b.addEventListener('click', function () {
      var f = b.getAttribute('data-f');
      btns.forEach(function (x) { var on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      cards.forEach(function (c) { c.classList.toggle('is-off', f !== 'all' && c.getAttribute('data-kind') !== f); });
    });
  });

  // 3. Card tilt (mouse only)
  if (fine && !reduce) {
    document.querySelectorAll('.ch-card figure').forEach(function (fig) {
      fig.addEventListener('pointermove', function (e) {
        var r = fig.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        fig.style.setProperty('--ry', ((x - 0.5) * 14).toFixed(2) + 'deg'); fig.style.setProperty('--rx', ((0.5 - y) * 14).toFixed(2) + 'deg');
        fig.style.setProperty('--gx', (x * 100).toFixed(1) + '%'); fig.style.setProperty('--gy', (y * 100).toFixed(1) + '%');
        fig.classList.add('is-tilt');
      });
      fig.addEventListener('pointerleave', function () { fig.style.setProperty('--rx', '0deg'); fig.style.setProperty('--ry', '0deg'); fig.classList.remove('is-tilt'); });
    });
  }
})();
