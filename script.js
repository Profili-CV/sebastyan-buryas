(function () {
  var lang = 'it';
  var root = document.documentElement;

  var readings = {
    '#C8352E': {
      it: 'Rosso. Sei pronto a discutere, oppure hai solo fame.',
      en: 'Red. You are ready to argue, or you are just hungry.'
    },
    '#E07A1F': {
      it: 'Arancione. Oggi diresti di sì a qualunque proposta, purché ci sia un aperitivo.',
      en: 'Orange. Today you would say yes to anything, as long as there is an aperitivo.'
    },
    '#E5B92B': {
      it: "Giallo. Ottimismo di facciata: dentro stai ancora pensando a quella mail.",
      en: 'Yellow. Optimism on the surface: inside you are still thinking about that email.'
    },
    '#3E9A5B': {
      it: 'Verde. Cerchi calma. O un parco. O entrambe le cose, ma senza zanzare.',
      en: 'Green. You are looking for calm. Or a park. Or both, minus the mosquitoes.'
    },
    '#2B8FB8': {
      it: 'Azzurro. Hai voglia di partire, ma il treno è in ritardo.',
      en: 'Light blue. You want to leave, but the train is late.'
    },
    '#2E5BBA': {
      it: 'Blu. Sembri tranquillo, ma lo nascondi bene.',
      en: 'Blue. You look calm, but you are good at hiding it.'
    },
    '#7046A8': {
      it: 'Viola. Hai un lato misterioso. Oppure ti piace semplicemente il viola.',
      en: 'Purple. You have a mysterious side. Or you just like purple.'
    }
  };

  var intro = {
    it: "Scegli un colore: il mio nome cambia forma e provo a indovinare il tuo stato d'animo. Probabilmente sbaglierò.",
    en: 'Pick a colour: my name changes shape and I try to guess your mood. I will probably be wrong.'
  };

  // Each colour gives the name a different shape: width and weight of the variable font
  var shapes = {
    '#C8352E': { s: 125, w: 760 },
    '#E07A1F': { s: 115, w: 640 },
    '#E5B92B': { s: 106, w: 520 },
    '#3E9A5B': { s: 100, w: 440 },
    '#2B8FB8': { s: 92, w: 360 },
    '#2E5BBA': { s: 84, w: 600 },
    '#7046A8': { s: 76, w: 700 }
  };

  var nameEl = document.getElementById('name');
  var letters = [];
  if (nameEl) {
    var idx = 0;
    nameEl.querySelectorAll('.line').forEach(function (line) {
      var word = line.textContent;
      line.textContent = '';
      line.setAttribute('aria-hidden', 'true');
      for (var k = 0; k < word.length; k++) {
        var span = document.createElement('span');
        span.className = 'ch';
        span.textContent = word[k];
        span.style.setProperty('--i', idx++);
        line.appendChild(span);
        letters.push(span);
      }
    });
  }

  function shapeName(hex) {
    var sh = shapes[hex];
    if (!sh || !nameEl) return;
    nameEl.style.setProperty('--s', sh.s + '%');
    nameEl.style.setProperty('--w', sh.w);
    letters.forEach(function (l) {
      l.style.removeProperty('--s');
      l.style.removeProperty('--w');
    });
  }

  var bands = document.getElementById('bands');
  var readHex = document.querySelector('.readout-hex');
  var readText = document.querySelector('.readout-text');
  var current = null;

  function showReading() {
    if (current) {
      readHex.textContent = current;
      readText.textContent = readings[current][lang];
    } else {
      readText.textContent = intro[lang];
    }
  }

  if (bands) {
    bands.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (!btn) return;
      current = btn.getAttribute('data-hex');
      root.style.setProperty('--accent', current);
      shapeName(current);
      bands.querySelectorAll('button').forEach(function (b) {
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });
      showReading();
    });
  }

  // Language switch: Italian is the page's own markup, English lives in data-en
  var textNodes = document.querySelectorAll('[data-en]');
  textNodes.forEach(function (el) { el.dataset.it = el.innerHTML; });
  var altNodes = document.querySelectorAll('[data-en-alt]');
  altNodes.forEach(function (el) { el.dataset.itAlt = el.getAttribute('alt'); });
  var labelNodes = document.querySelectorAll('[data-en-label]');
  labelNodes.forEach(function (el) { el.dataset.itLabel = el.getAttribute('aria-label'); });

  var btnLang = document.getElementById('lang');

  function setLang(next) {
    lang = next;
    root.lang = next;
    textNodes.forEach(function (el) {
      if (next === 'en') el.textContent = el.dataset.en;
      else el.innerHTML = el.dataset.it;
    });
    altNodes.forEach(function (el) {
      el.setAttribute('alt', next === 'en' ? el.dataset.enAlt : el.dataset.itAlt);
    });
    labelNodes.forEach(function (el) {
      el.setAttribute('aria-label', next === 'en' ? el.dataset.enLabel : el.dataset.itLabel);
    });
    btnLang.textContent = next === 'en' ? 'IT' : 'EN';
    btnLang.setAttribute('aria-label', next === 'en' ? 'Passa all\'italiano' : 'Switch to English');
    showReading();
    try { localStorage.setItem('lang', next); } catch (e) {}
  }

  btnLang.addEventListener('click', function () { setLang(lang === 'it' ? 'en' : 'it'); });

  var saved = null;
  try { saved = localStorage.getItem('lang'); } catch (e) {}
  if (saved === 'en') setLang('en');
})();
