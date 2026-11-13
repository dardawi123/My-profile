/* =========================================================
   User Guides — small progressive enhancements (vanilla JS).
   The guides work without JavaScript; this file only:
   1. keeps the current section when switching language
      (the other language uses the same anchor IDs, e.g. #step-3);
   2. shows the "Print / Save as PDF" button and opens the print dialog;
   3. highlights the current section in the contents list.
   Academic tools developed by Dr. Merfat Alardawi | د. مرفت العرضاوي
   ========================================================= */
(function () {
  'use strict';

  // 1. Language switch: carry the current hash (#step-3, #faq …) to the other language.
  document.querySelectorAll('[data-guide-lang]').forEach(function (a) {
    a.addEventListener('click', function () {
      var base = a.getAttribute('href').split('#')[0];
      var hash = location.hash;
      if (!hash) {
        // No hash in the URL: use the section currently on screen, if any.
        var cur = document.querySelector('.guide-toc a.is-current');
        if (cur) hash = cur.getAttribute('href');
      }
      a.setAttribute('href', base + (hash || ''));
    });
  });

  // 2. Print / Save as PDF (browser-based).
  document.querySelectorAll('[data-guide-print]').forEach(function (b) {
    b.hidden = false;
    b.addEventListener('click', function () { window.print(); });
  });

  // 3. Highlight the section in view (no effect if IntersectionObserver is unavailable).
  var links = Array.prototype.slice.call(document.querySelectorAll('.guide-toc a[href^="#"]'));
  if (!links.length || !('IntersectionObserver' in window)) return;
  var byId = {};
  links.forEach(function (l) { byId[l.getAttribute('href').slice(1)] = l; });
  var targets = Object.keys(byId).map(function (id) { return document.getElementById(id); }).filter(Boolean);
  var visible = {};
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting; });
    var current = null;
    // Document order puts each step after its parent section, so the last
    // visible target is the most specific one (a step rather than "Steps").
    for (var i = 0; i < targets.length; i++) { if (visible[targets[i].id]) current = targets[i].id; }
    if (!current) return;
    links.forEach(function (l) { l.classList.remove('is-current'); l.removeAttribute('aria-current'); });
    byId[current].classList.add('is-current');
    byId[current].setAttribute('aria-current', 'location');
  }, { rootMargin: '-110px 0px -55% 0px' });
  targets.forEach(function (t) { io.observe(t); });
})();
