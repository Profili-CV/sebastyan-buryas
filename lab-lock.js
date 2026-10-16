// Laboratorio riservato: il contenuto è cifrato (AES-GCM) e si apre solo con il codice di accesso.
(function () {
  var vault = document.getElementById('lab-vault'), sealed = document.getElementById('lab-sealed'), form = document.getElementById('lab-lock-form');
  if (!vault || !sealed || !form || !window.crypto || !crypto.subtle) return;
  var input = document.getElementById('lab-code'), err = document.getElementById('lab-lock-err');
  var en = function () { return document.documentElement.lang === 'en'; };
  var b64 = function (s) { return Uint8Array.from(atob(s), function (c) { return c.charCodeAt(0); }); };

  function open(code) {
    var enc = new TextEncoder();
    return crypto.subtle.importKey('raw', enc.encode(code), 'PBKDF2', false, ['deriveKey'])
      .then(function (base) {
        return crypto.subtle.deriveKey({ name: 'PBKDF2', salt: b64(sealed.dataset.salt), iterations: +sealed.dataset.iter, hash: 'SHA-256' },
          base, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
      })
      .then(function (key) { return crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(sealed.dataset.iv) }, key, b64(sealed.textContent.trim())); })
      .then(function (buf) { return new TextDecoder().decode(buf); });
  }
  function reveal(html) {
    var box = document.createElement('div'); box.className = 'lab-open'; box.innerHTML = html;
    // lingua: il testo italiano è nel markup, l'inglese in data-en
    box.querySelectorAll('[data-en]').forEach(function (el) { el.dataset.it = el.innerHTML; if (en()) el.innerHTML = el.dataset.en; });
    document.addEventListener('langchange', function () { box.querySelectorAll('[data-en]').forEach(function (el) { el.innerHTML = en() ? el.dataset.en : el.dataset.it; }); });
    vault.replaceWith(box);
    var s = document.createElement('script'); s.src = 'lab.js?v=1&r=' + Date.now(); document.body.appendChild(s); // anteprime al passaggio del mouse
  }
  function tryCode(code, quiet) {
    return open(code).then(function (html) {
      try { localStorage.setItem('lab-code', code); } catch (e) {}
      reveal(html);
    }, function () {
      try { localStorage.removeItem('lab-code'); } catch (e) {}
      if (!quiet) { err.textContent = en() ? 'Wrong code. Write to me and I’ll send you the right one.' : 'Codice non valido. Scrivimi e ti mando quello giusto.'; input.select(); }
    });
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var code = input.value.trim(); if (!code) { input.focus(); return; }
    err.textContent = en() ? 'Checking…' : 'Controllo…';
    tryCode(code);
  });
  input.addEventListener('input', function () { err.textContent = ''; });
  var saved = null; try { saved = localStorage.getItem('lab-code'); } catch (e) {}
  if (saved) tryCode(saved, true);
})();
