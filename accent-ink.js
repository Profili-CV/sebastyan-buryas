// Readable versions of the accent colour: the accent is chosen by the visitor (any of 7 colours),
// so for text we darken it on light grounds (or lighten it on dark ones) just enough to pass WCAG contrast.
(function () {
  var root = document.documentElement;
  function rgb(hex) { hex = hex.trim().replace('#', ''); if (hex.length === 3) hex = hex.replace(/./g, '$&$&'); return [0, 2, 4].map(function (i) { return parseInt(hex.substr(i, 2), 16); }); }
  function lum(c) { c = c.map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; }
  function ratio(a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
  function toward(c, t, k) { return c.map(function (v, i) { return Math.round(v + (t[i] - v) * k); }); }
  function hex(c) { return '#' + c.map(function (v) { return ('0' + v.toString(16)).slice(-2); }).join(''); }
  function fit(acc, bg, target) {
    var dir = lum(bg) > 0.4 ? [0, 0, 0] : [255, 255, 255];
    for (var k = 0; k <= 1.0001; k += 0.02) { var c = toward(acc, dir, k); if (ratio(c, bg) >= target) return hex(c); }
    return hex(dir);
  }
  function update() {
    var a = getComputedStyle(root).getPropertyValue('--accent');
    if (!a || a.trim().charAt(0) !== '#') return;
    var acc = rgb(a), light = rgb('#FBFBF9'), dark = rgb('#141418');
    root.style.setProperty('--accent-ink-l', fit(acc, light, 4.9));
    root.style.setProperty('--accent-big-l', fit(acc, light, 3.5));
    root.style.setProperty('--accent-ink-d', fit(acc, dark, 4.6));
    root.style.setProperty('--accent-big-d', fit(acc, dark, 3.4));
  }
  update();
  new MutationObserver(update).observe(root, { attributes: true, attributeFilter: ['style'] });
})();
