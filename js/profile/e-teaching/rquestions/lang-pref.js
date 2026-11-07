/* =========================================================
   Language preference (loaded in <head>, before anything renders).
   - The Arabic page (index.html) is the default entry point.
   - If the visitor previously chose English, index.html forwards to en.html.
   - The language switcher stores the target language before navigating,
     so switching never loops.
   ========================================================= */
(function () {
  'use strict';
  var KEY = 'rqf.lang';
  var html = document.documentElement;
  var pageLang = html.getAttribute('lang');
  var pref = null;
  try { pref = localStorage.getItem(KEY); } catch (e) { /* storage unavailable */ }

  if (html.hasAttribute('data-default-page') && pref && pref !== pageLang) {
    var target = html.getAttribute('data-alt-' + pref);
    if (target) { location.replace(target + location.hash); return; }
  }
  try { localStorage.setItem(KEY, pageLang); } catch (e) { /* ignore */ }
})();
