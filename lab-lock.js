// Laboratorio: alcune righe sono pubbliche, quelle riservate sono cifrate (AES-GCM) e si aprono con il codice di accesso.
(function () {
  var box = document.getElementById('lab-unlock'), sealed = document.getElementById('lab-sealed'), form = document.getElementById('lab-lock-form');
  if (!box || !sealed || !form || !window.crypto || !crypto.subtle) return;
  var input = document.getElementById('lab-code'), err = document.getElementById('lab-lock-err');
  var en = function () { return document.documentElement.lang === 'en'; };
  var b64 = function (s) { return Uint8Array.from(atob(s), function (c) { return c.charCodeAt(0); }); };

  // toccando una riga riservata si va al campo del codice
  document.querySelectorAll('[data-lab-ask]').forEach(function (b) {
    b.addEventListener('click', function () {
      box.classList.remove('lab-nudge'); void box.offsetWidth; box.classList.add('lab-nudge');
      box.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
      setTimeout(function () { input.focus({ preventScroll: true }); }, 350);
    });
  });

  // richiesta di accesso: se l'app di posta non si apre, si può copiare l'indirizzo
  var copy = box.querySelector('.lab-copy');
  if (copy) copy.addEventListener('click', function () {
    var mail = copy.dataset.mail, label = copy.querySelector('span');
    var done = function () { label.textContent = en() ? 'Copied!' : 'Copiato!'; setTimeout(function () { label.textContent = en() ? 'Copy the address' : 'Copia l’indirizzo'; }, 2000); };
    if (navigator.clipboard) navigator.clipboard.writeText(mail).then(done, done); else done();
  });

  function open(code) {
    var enc = new TextEncoder();
    return crypto.subtle.importKey('raw', enc.encode(code), 'PBKDF2', false, ['deriveKey'])
      .then(function (base) {
        return crypto.subtle.deriveKey({ name: 'PBKDF2', salt: b64(sealed.dataset.salt), iterations: +sealed.dataset.iter, hash: 'SHA-256' },
          base, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
      })
      .then(function (key) { return crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(sealed.dataset.iv) }, key, b64(sealed.textContent.trim())); })
      .then(function (buf) { return JSON.parse(new TextDecoder().decode(buf)); });
  }
  function localize(root) {
    // lingua: il testo italiano è nel markup, l'inglese in data-en
    root.querySelectorAll('[data-en]').forEach(function (el) { el.dataset.it = el.innerHTML; if (en()) el.innerHTML = el.dataset.en; });
  }
  function reveal(rows) {
    var opened = [];
    document.querySelectorAll('li[data-lab-id]').forEach(function (li) {
      var html = rows[li.dataset.labId]; if (!html) return;
      li.innerHTML = html; li.className = 'lab-open'; li.removeAttribute('data-lab-id'); localize(li); opened.push(li);
    });
    var done = document.createElement('div'); done.className = 'lab-unlocked';
    done.innerHTML = (rows._more || '');
    localize(done);
    box.replaceWith(done);
    document.addEventListener('langchange', function () {
      opened.concat([done]).forEach(function (r) { r.querySelectorAll('[data-it]').forEach(function (el) { el.innerHTML = en() ? el.dataset.en : el.dataset.it; }); });
    });
    if (window.labThumbs) window.labThumbs(document.getElementById('lab-index'));
  }
  function tryCode(code, quiet) {
    return open(code).then(function (rows) {
      try { localStorage.setItem('lab-code', code); } catch (e) {}
      reveal(rows);
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
