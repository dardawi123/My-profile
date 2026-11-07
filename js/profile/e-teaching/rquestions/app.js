/* =========================================================
   Research Question Formulation and Refinement — application logic
   صياغة وتنقيح أسئلة البحث — منطق التطبيق

   Language-neutral. Reads all wording from window.RC (js/i18n-*.js),
   rules from window.RQA (js/analyzer.js), and shared data from
   js/glossary.js and js/references.js.
   Data never leaves the browser: progress is stored in localStorage.
   Academic tool developed by Dr. Merfat Alardawi | د. مرفت العرضاوي
   ========================================================= */
(function () {
  'use strict';

  const RC = window.RC, UI = RC.ui, A = window.RQA;
  if (!RC || !A) { console.error('RQF: required scripts are missing.'); return; }

  const STORE_KEY = 'rqf.data.v1';
  const LANG_KEY = 'rqf.lang';
  const STEPS = 8;

  /* ---------------- State ---------------- */
  function defaults() {
    return {
      v: 1, step: 0, maxStep: 0, savedAt: null,
      s1: { topic: '', subfield: '', phenomenon: '', context: '', timeframe: '', population: '', source: '', approach: '' },
      s2: { issue: '', known: '', gap: '', need: '' },
      s3: { orientation: '', aim: '', theory: '', method: '' },
      s4: { initial: '', quant: '', qual: '', integ: '' },
      s5: { feas: { access: false, time: false, skills: false }, refined: '' },
      s6: { scores: {} },
      s7: { subs: [] },
      report: { html: '', edited: false },
      tools: { checkQ: '', checks: {}, cmpA: '', cmpB: '' }
    };
  }
  function merge(base, src) {
    if (!src || typeof src !== 'object') return base;
    Object.keys(base).forEach((k) => {
      if (!(k in src)) return;
      if (base[k] && typeof base[k] === 'object' && !Array.isArray(base[k])) base[k] = merge(base[k], src[k]);
      else if (Array.isArray(base[k])) base[k] = Array.isArray(src[k]) ? src[k].filter((x) => typeof x === 'string').slice(0, 6) : base[k];
      else if (typeof src[k] === typeof base[k] || base[k] === null) base[k] = src[k];
    });
    return base;
  }
  let state = defaults();

  /* ---------------- Helpers ---------------- */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const el = (tag, attrs, html) => { const n = document.createElement(tag); if (attrs) Object.keys(attrs).forEach((k) => { if (k === 'class') n.className = attrs[k]; else n.setAttribute(k, attrs[k]); }); if (html != null) n.innerHTML = html; return n; };
  const getPath = (o, p) => p.split('.').reduce((a, k) => (a == null ? a : a[k]), o);
  const setPath = (o, p, val) => { const ks = p.split('.'); const last = ks.pop(); const t = ks.reduce((a, k) => a[k], o); t[last] = val; };
  const filled = (x) => !!(x && String(x).trim());
  const wc = (x) => A.wordCount(x);
  const linkify = (s) => esc(s).replace(/(https?:\/\/[^\s<]+[^\s<.,;)])/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
  const label = (list, id) => { const f = list.find((x) => x.id === id); return f ? f.t : ''; };
  const num = (n) => RC.lang === 'ar' ? String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]) : String(n);
  const mainQ = () => (filled(state.s5.refined) ? state.s5.refined : state.s4.initial);

  function toast(msg) {
    const t = $('#toast'); if (!t) return;
    t.textContent = msg; t.hidden = false;
    clearTimeout(toast._t); toast._t = setTimeout(() => { t.hidden = true; }, 3200);
  }

  /* ---------------- Persistence ---------------- */
  let saveTimer = null;
  let suppressSave = false;
  function save(now) {
    clearTimeout(saveTimer);
    if (suppressSave) return;
    const run = () => {
      state.savedAt = new Date().toISOString();
      try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* storage full or blocked */ }
      updateSaveStatus();
    };
    if (now) run(); else saveTimer = setTimeout(run, 350);
  }
  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return false;
      state = merge(defaults(), JSON.parse(raw));
      return true;
    } catch (e) { return false; }
  }
  function updateSaveStatus() {
    const n = $('#save-status'); if (!n) return;
    if (!state.savedAt) { n.textContent = UI.notSaved; return; }
    const d = new Date(state.savedAt);
    n.textContent = UI.savedAt(d.toLocaleTimeString(RC.lang === 'ar' ? 'ar-SA' : 'en-GB', { hour: '2-digit', minute: '2-digit' }));
  }

  /* ---------------- Analyzer context ---------------- */
  function ctx() {
    const s1 = state.s1, s2 = state.s2, s3 = state.s3;
    return {
      approach: s1.approach, orientation: s3.orientation, source: s1.source,
      phenomenon: s1.phenomenon, context: s1.context, timeframe: s1.timeframe, population: s1.population,
      problem: [s2.issue, s2.gap].join(' '), gap: s2.gap, theory: s3.theory,
      feas: state.s5.feas, mixed: { integ: state.s4.integ }
    };
  }

  /* ---------------- Static renders ---------------- */
  function renderSelectOptions() {
    const sel = $('#s1-subfield');
    if (sel) RC.subfields.forEach((s) => sel.appendChild(el('option', { value: s.id }, esc(s.t))));
    renderRadios('#s1-source', 's1.source', RC.sources);
    renderRadios('#s1-approach', 's1.approach', RC.approaches);
  }
  function renderRadios(sel, path, items) {
    const box = $(sel); if (!box) return;
    const name = path.replace('.', '-');
    items.forEach((it) => {
      const lab = el('label', { class: 'radio-pill' });
      const inp = el('input', { type: 'radio', name, value: it.id });
      inp.addEventListener('change', () => { setPath(state, path, it.id); clearFieldError(box); onChange(); });
      lab.appendChild(inp); lab.appendChild(el('span', null, esc(it.t)));
      box.appendChild(lab);
    });
  }

  function renderOrientations() {
    const box = $('#orient-pick'); if (!box) return;
    RC.orientations.forEach((o) => {
      const b = el('button', { type: 'button', class: 'choice', 'aria-pressed': 'false', 'data-id': o.id }, '<strong>' + esc(o.t) + '</strong><span>' + esc(o.d) + '</span>');
      b.addEventListener('click', () => { state.s3.orientation = o.id; clearFieldError(box); onChange(); });
      box.appendChild(b);
    });
  }

  function renderRubric() {
    const box = $('#rubric'); if (!box) return;
    RC.rubric.forEach((c) => {
      const fs = el('fieldset', { class: 'rubric-row', 'data-id': c.id });
      fs.appendChild(el('legend', null, esc(c.t)));
      fs.appendChild(el('span', { class: 'desc' }, esc(c.d)));
      fs.appendChild(el('span', { class: 'suggest', 'data-suggest': c.id }, ''));
      const scale = el('div', { class: 'scale' });
      for (let n = 1; n <= 5; n++) {
        const lab = el('label');
        const inp = el('input', { type: 'radio', name: 'rub-' + c.id, value: String(n), 'aria-label': c.t + ': ' + n });
        inp.addEventListener('change', () => { state.s6.scores[c.id] = n; onChange(); });
        lab.appendChild(inp); lab.appendChild(el('span', { 'aria-hidden': 'true' }, RC.numerals[n - 1]));
        scale.appendChild(lab);
      }
      fs.appendChild(scale);
      box.appendChild(fs);
    });
  }

  function renderChecklist() {
    const box = $('#checklist'); if (!box) return;
    RC.checklist.forEach((c) => {
      const lab = el('label', { class: 'chk', 'data-id': c.id });
      const inp = el('input', { type: 'checkbox' });
      inp.addEventListener('change', () => { state.tools.checks[c.id] = inp.checked; onChange(); });
      lab.appendChild(inp);
      lab.appendChild(el('span', { class: 'txt' }, '<strong>' + esc(c.t) + '</strong><span>' + esc(c.d) + '</span><span class="detect" data-detect="' + c.id + '"></span>'));
      box.appendChild(lab);
    });
  }

  function renderExamples() {
    const list = $('#ex-list'), filters = $('#ex-filters'); if (!list || !filters) return;
    const subs = [...new Set(RC.examples.map((e) => e.sub))];
    const mk = (id, t) => {
      const b = el('button', { type: 'button', class: 'chip-btn', 'aria-pressed': id === 'all' ? 'true' : 'false', 'data-f': id }, esc(t));
      b.addEventListener('click', () => {
        $$('.chip-btn', filters).forEach((x) => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
        $$('.ex-card', list).forEach((c) => { c.hidden = !(id === 'all' || c.dataset.sub === id); });
      });
      filters.appendChild(b);
    };
    mk('all', UI.all);
    subs.forEach((s) => mk(s, label(RC.subfields, s)));
    RC.examples.forEach((e) => {
      const card = el('article', { class: 'ex-card', 'data-sub': e.sub });
      card.innerHTML =
        '<div class="tags"><span class="tag">' + esc(label(RC.subfields, e.sub)) + '</span><span class="tag tag-illustrative">' + esc($('#ex-list').dataset.illustrative) + '</span></div>' +
        '<h3 class="h3" style="font-size:21px">' + esc(e.title) + '</h3>' +
        '<div class="ex-weak"><b>' + esc($('#ex-list').dataset.weak) + '</b>' + esc(e.weak) + '</div>' +
        '<div class="ex-better"><b>' + esc($('#ex-list').dataset.better) + '</b>' + esc(e.better) + '</div>' +
        '<p class="why"><strong>' + esc($('#ex-list').dataset.why) + '</strong> ' + esc(e.why) + '</p>' +
        '<p class="meth"><strong>' + esc($('#ex-list').dataset.method) + '</strong> ' + esc(e.method) + '</p>' +
        (e.basis ? '<p class="cite">' + esc(e.basis) + '</p>' : '');
      list.appendChild(card);
    });
  }

  function renderGlossary() {
    const body = $('#gloss-body'); if (!body) return;
    const G = window.RQ_GLOSSARY || [];
    G.forEach((g) => {
      const tr = el('tr', { 'data-search': (g.ar + ' ' + g.en + ' ' + g.defAr + ' ' + g.defEn).toLowerCase() });
      const first = RC.lang === 'ar' ? [['ar', g.ar, 'rtl'], ['en', g.en, 'ltr'], ['ar', g.defAr, 'rtl'], ['en', g.defEn, 'ltr']] : [['en', g.en, 'ltr'], ['ar', g.ar, 'rtl'], ['en', g.defEn, 'ltr'], ['ar', g.defAr, 'rtl']];
      first.forEach((c) => tr.appendChild(el('td', { lang: c[0], dir: c[2] }, esc(c[1]))));
      body.appendChild(tr);
    });
    const s = $('#gloss-search');
    if (s) s.addEventListener('input', () => {
      const q = s.value.trim().toLowerCase();
      let shown = 0;
      $$('tr', body).forEach((tr) => { const ok = !q || tr.dataset.search.indexOf(q) !== -1; tr.hidden = !ok; if (ok) shown++; });
      $('#gloss-empty').hidden = shown !== 0;
    });
  }

  function renderRefs() {
    const box = $('#refs-list'); if (!box) return;
    (window.RQ_REFS || []).forEach((g) => {
      const wrap = el('div', { class: 'ref-group' });
      wrap.appendChild(el('h3', null, esc(UI.refGroups[g.id] || g.id)));
      const ol = el('ol');
      g.items.forEach((r) => {
        const isAr = r.lang === 'ar';
        const showAr = isAr && RC.lang === 'ar';
        const txt = isAr && RC.lang !== 'ar' ? (r.en || r.text) : r.text;
        const li = el('li', { lang: showAr ? 'ar' : 'en', dir: showAr ? 'rtl' : 'ltr' });
        li.innerHTML = linkify(txt) + ' <span class="tag ref-type" lang="' + RC.lang + '" dir="' + (RC.lang === 'ar' ? 'rtl' : 'ltr') + '">' + esc(UI.refTypes[r.type] || r.type) + '</span>' +
          (r.check === 'pending' ? ' <span class="tag tag-gold ref-type" lang="' + RC.lang + '">' + esc(UI.pending) + '</span>' : '');
        ol.appendChild(li);
      });
      wrap.appendChild(ol);
      box.appendChild(wrap);
    });
  }

  /* ---------------- Binding ---------------- */
  function bindInputs() {
    $$('[data-bind]').forEach((inp) => {
      inp.addEventListener('input', () => { setPath(state, inp.dataset.bind, inp.value); if (inp.getAttribute('aria-invalid') === 'true' && filled(inp.value)) clearFieldError(inp); onChange(); });
      inp.addEventListener('change', () => { setPath(state, inp.dataset.bind, inp.value); onChange(); });
    });
    $$('[data-bind-check]').forEach((inp) => {
      inp.addEventListener('change', () => { setPath(state, inp.dataset.bindCheck, inp.checked); onChange(); });
    });
  }
  function fillInputs() {
    $$('[data-bind]').forEach((inp) => { const val = getPath(state, inp.dataset.bind); inp.value = val == null ? '' : val; });
    $$('[data-bind-check]').forEach((inp) => { inp.checked = !!getPath(state, inp.dataset.bindCheck); });
    $$('#s1-source input').forEach((i) => { i.checked = i.value === state.s1.source; });
    $$('#s1-approach input').forEach((i) => { i.checked = i.value === state.s1.approach; });
    RC.rubric.forEach((c) => { $$('input[name="rub-' + c.id + '"]').forEach((i) => { i.checked = Number(i.value) === state.s6.scores[c.id]; }); });
    RC.checklist.forEach((c) => { const l = $('#checklist .chk[data-id="' + c.id + '"]'); if (l) { const i = $('input', l); i.checked = !!state.tools.checks[c.id]; l.classList.toggle('on', i.checked); } });
    renderSubs();
  }

  /* ---------------- Validation ---------------- */
  function setFieldError(node, msg) {
    const field = node.closest('.field, fieldset, .choice-group') || node.parentElement;
    const inp = field.querySelector('.inp') || node;
    if (inp.classList && inp.classList.contains('inp')) inp.setAttribute('aria-invalid', 'true');
    const err = field.querySelector('.err');
    if (err) err.textContent = msg;
  }
  function clearFieldError(node) {
    const field = node.closest('.field, fieldset, .choice-group') || node.parentElement;
    if (!field) return;
    const inp = field.querySelector('.inp');
    if (inp) inp.removeAttribute('aria-invalid');
    const err = field.querySelector('.err');
    if (err) err.textContent = '';
  }
  function validateStep(i, show) {
    const stepEl = $('.step[data-step="' + i + '"]');
    let firstBad = null, ok = true;
    const fail = (node, msg) => { ok = false; if (show) { setFieldError(node, msg); if (!firstBad) firstBad = node; } };
    $$('[data-required]', stepEl).forEach((inp) => {
      const block = inp.closest('[data-approach]');
      if (block && block.hidden) return;
      const val = getPath(state, inp.dataset.bind);
      const min = Number(inp.dataset.minwords || 0);
      if (!filled(val)) fail(inp, UI.required);
      else if (min && wc(val) < min) fail(inp, UI.tooShort(min));
      else if (show) clearFieldError(inp);
    });
    if (i === 0) {
      if (!state.s1.source) fail($('#s1-source'), UI.chooseOne);
      if (!state.s1.approach) fail($('#s1-approach'), UI.chooseOne);
    }
    if (i === 2 && !state.s3.orientation) fail($('#orient-pick'), UI.chooseOne);
    if (i === 6 && !state.s7.subs.some(filled)) fail($('#sub-list'), UI.needSub);
    if (show) {
      $('#form-alert').hidden = ok;
      if (!ok) { $('#form-alert').textContent = UI.fixErrors; const f = firstBad.matches('.inp') ? firstBad : (firstBad.querySelector('input, button') || firstBad); f.focus(); }
    }
    return ok;
  }

  /* ---------------- Wizard navigation ---------------- */
  function goTo(i, focus) {
    i = Math.max(0, Math.min(STEPS - 1, i));
    state.step = i;
    state.maxStep = Math.max(state.maxStep, i);
    $$('.step').forEach((s) => { s.hidden = Number(s.dataset.step) !== i; });
    $('#form-alert').hidden = true;
    $('#btn-prev').hidden = i === 0;
    $('#btn-next').hidden = i === STEPS - 1;
    $('#btn-next').textContent = i === STEPS - 2 ? UI.finish : UI.next;
    renderStepper();
    if (i === STEPS - 1) renderReport(false);
    refresh();
    if (focus) { const h = $('.step[data-step="' + i + '"] h3'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); $('#builder').scrollIntoView({ block: 'start' }); } }
    save();
  }
  function renderStepper() {
    const box = $('#stepper'); box.innerHTML = '';
    RC.steps.forEach((t, i) => {
      const b = el('button', { type: 'button', class: 'stepdot' + (i < state.step && validateStep(i, false) ? ' done' : '') }, '<span class="num">' + RC.numerals[i] + '</span><span>' + esc(t) + '</span>');
      if (i === state.step) b.setAttribute('aria-current', 'step');
      if (i > state.maxStep + 1 || (i === state.maxStep + 1 && !validateStep(state.maxStep, false))) b.disabled = true;
      b.addEventListener('click', () => {
        if (i > state.step) { for (let k = state.step; k < i; k++) { if (!validateStep(k, k === state.step)) { if (k !== state.step) goTo(k, true); return; } } }
        goTo(i, true);
      });
      box.appendChild(b);
    });
    $('#progress-bar').style.width = ((state.step + 1) / STEPS * 100) + '%';
    $('#step-count').textContent = UI.stepOf(RC.numerals[state.step], RC.numerals[STEPS - 1]);
  }

  /* ---------------- Derived views ---------------- */
  function diagHTML(res) {
    return res.dims.map((d) =>
      '<div class="diag-item st-' + d.status + '"><span class="ic" aria-hidden="true">' + ({ ok: '✓', warn: '!', bad: '×', info: 'i' }[d.status]) + '</span>' +
      '<span class="t">' + esc(d.title) + '<span class="status-label">' + esc(UI.status[d.status]) + '</span></span>' +
      '<span class="d">' + esc(d.msg) + '</span>' + (d.rec ? '<span class="r"><strong>→</strong> ' + esc(d.rec) + '</span>' : '') + '</div>').join('');
  }

  function refresh() {
    const c = ctx();
    const s1 = state.s1;
    const labels = { subfield: label(RC.subfields, s1.subfield), approach: label(RC.approaches, s1.approach) };

    // Step 1 & 2 outputs
    const t = $('#out-topic'); if (t) t.textContent = RC.tpl.topic(s1, labels);
    const p = $('#out-problem'); if (p) p.textContent = RC.tpl.problem(state.s2);

    // Step 3: orientation cards + detail
    $$('#orient-pick .choice').forEach((b) => b.setAttribute('aria-pressed', b.dataset.id === state.s3.orientation ? 'true' : 'false'));
    const o = RC.orientations.find((x) => x.id === state.s3.orientation);
    const od = $('#orient-detail');
    if (od) {
      od.hidden = !o;
      if (o) od.innerHTML = '<strong>' + esc(o.t) + '</strong><span>' + esc(o.effect) + '</span><span><b>' + esc(od.dataset.stems) + '</b> ' + o.stems.map(esc).join(' · ') + '</span><span><b>' + esc(od.dataset.example) + '</b> ' + esc(o.ex) + '</span>';
    }

    // Step 4: approach-specific blocks and stems
    $$('[data-approach]').forEach((n) => { n.hidden = n.dataset.approach.split(' ').indexOf(s1.approach || 'qual') === -1; });
    renderStems();

    // Step 5: analysis of the initial question + suggested revision
    if (state.step >= 3) {
      $('#initial-echo').textContent = state.s4.initial || UI.empty;
      $('#diag-initial').innerHTML = diagHTML(A.analyze(state.s4.initial, c));
      const rev = RC.tpl.revise(state);
      let revText = rev.main;
      if (rev.quant) revText = rev.main + '\n' + $('#suggested').dataset.quant + ' ' + rev.quant + '\n' + $('#suggested').dataset.qual + ' ' + rev.qual + '\n' + $('#suggested').dataset.integ + ' ' + rev.integ;
      $('#suggested-text').textContent = revText;
      if (filled(state.s5.refined)) {
        const rr = A.analyze(state.s5.refined, c);
        const bad = rr.dims.filter((d) => d.status === 'bad' || d.status === 'warn').length;
        $('#refined-summary').innerHTML = diagHTML(rr);
        $('#refined-count').textContent = String(bad);
      } else { $('#refined-summary').innerHTML = ''; $('#refined-count').textContent = '—'; }
    }

    // Step 6: suggested rubric scores + results
    const q = mainQ();
    const res = A.analyze(q, c);
    const sug = A.suggestScores(res, c, state.s3.aim, q);
    RC.rubric.forEach((cr) => { const n = $('[data-suggest="' + cr.id + '"]'); if (n) n.textContent = $('#rubric').dataset.suggested + ' ' + RC.numerals[sug[cr.id] - 1]; });
    renderRubricResult();

    // Step 7: echo main question + suggestions + checks
    const me = $('#main-echo'); if (me) me.textContent = q || UI.empty;
    renderSubSuggestions();
    updateSubChecks();

    // Tools
    renderChecklistDetect();
    renderComparison();
    renderMatrix();
  }

  function renderStems() {
    const box = $('#stems'); if (!box) return;
    const o = RC.orientations.find((x) => x.id === state.s3.orientation);
    const list = (o ? o.stems : []).concat(RC.stemsQual);
    const sig = list.join('|');
    if (box.dataset.sig === sig) return;
    box.dataset.sig = sig; box.innerHTML = '';
    [...new Set(list)].forEach((s) => box.appendChild(stemBtn(s, '#s4-initial')));
    ['quant', 'qual', 'integ'].forEach((k) => {
      const b = $('#stems-' + k); if (!b || b.childElementCount) return;
      RC.stemsMixed[k].forEach((s) => b.appendChild(stemBtn(s, '#s4-' + k)));
    });
  }
  function stemBtn(text, target) {
    const b = el('button', { type: 'button', class: 'chip-btn' }, esc(text));
    b.addEventListener('click', () => {
      const ta = $(target);
      if (!filled(ta.value)) ta.value = text;
      else { const pos = ta.selectionStart || ta.value.length; ta.value = ta.value.slice(0, pos) + ' ' + text + ' ' + ta.value.slice(pos); }
      ta.dispatchEvent(new Event('input'));
      ta.focus();
    });
    return b;
  }

  function renderRubricResult() {
    const box = $('#rubric-result'); if (!box) return;
    const sc = state.s6.scores;
    const rated = RC.rubric.filter((c) => sc[c.id]);
    const mean = rated.length ? rated.reduce((a, c) => a + sc[c.id], 0) / rated.length : 0;
    const lvl = UI.levels.find((l) => mean >= l.min) || UI.levels[UI.levels.length - 1];
    const fmt = (n) => RC.lang === 'ar' ? num(n.toFixed(1)).replace('.', '٫') : n.toFixed(1);
    const recs = RC.rubric.filter((c) => sc[c.id] && sc[c.id] <= 3).map((c) => '<li><strong>' + esc(c.t) + ':</strong> ' + esc(RC.rubricRec[c.id]) + '</li>');
    box.innerHTML =
      '<span class="small" style="color:#BDB6A4">' + esc(UI.overall) + '</span>' +
      '<span class="big">' + (rated.length ? fmt(mean) : '—') + ' <span style="font-size:22px">' + esc(UI.outOf5) + '</span></span>' +
      (rated.length ? '<span class="lvl">' + esc(lvl.t) + '</span><span class="small">' + esc(lvl.d) + '</span>' : '') +
      '<div class="bars">' + RC.rubric.map((c) => '<div class="bar-row"><span>' + esc(c.t) + '</span><span class="bar" aria-hidden="true"><span style="width:' + ((sc[c.id] || 0) * 20) + '%"></span></span><span>' + (sc[c.id] ? RC.numerals[sc[c.id] - 1] : '—') + '</span></div>').join('') + '</div>' +
      (rated.length ? '<div><strong style="color:var(--gold-light)">' + esc(UI.recommendations) + '</strong>' + (recs.length ? '<ul class="list small">' + recs.join('') + '</ul>' : '<p class="small">' + esc(UI.noRecs) + '</p>') + '</div>' : '<p class="small">' + esc(UI.notRated) + '</p>');
  }

  /* Supporting questions */
  function renderSubSuggestions() {
    const box = $('#sub-suggest'); if (!box) return;
    const list = RC.tpl.supporting(state);
    const sig = list.join('|');
    if (box.dataset.sig === sig) return;
    box.dataset.sig = sig; box.innerHTML = '';
    list.forEach((s) => {
      const b = el('button', { type: 'button', class: 'chip-btn' }, '+ ' + esc(s));
      b.addEventListener('click', () => {
        if (state.s7.subs.length >= 6) { toast(UI.maxSubs); return; }
        const emptyIdx = state.s7.subs.findIndex((x) => !filled(x));
        if (emptyIdx >= 0) state.s7.subs[emptyIdx] = s; else state.s7.subs.push(s);
        renderSubs(); onChange();
      });
      box.appendChild(b);
    });
  }
  function renderSubs() {
    const box = $('#sub-list'); if (!box) return;
    box.innerHTML = '';
    if (!state.s7.subs.length) state.s7.subs.push('');
    state.s7.subs.forEach((s, i) => {
      const item = el('div', { class: 'sq-item' });
      const row = el('div', { class: 'sq-row' });
      const id = 'sub-' + i;
      const lab = el('label', { for: id, class: 'visually-hidden' }, esc(box.dataset.label + ' ' + RC.numerals[i]));
      const ta = el('textarea', { id, class: 'inp', rows: '2' });
      ta.value = s;
      ta.addEventListener('input', () => { state.s7.subs[i] = ta.value; clearFieldError(box); onChange(); });
      const rm = el('button', { type: 'button', class: 'btn btn-ghost btn-sm', 'aria-label': UI.remove + ' ' + RC.numerals[i] }, esc(UI.remove));
      rm.addEventListener('click', () => { state.s7.subs.splice(i, 1); renderSubs(); onChange(); });
      row.appendChild(lab); row.appendChild(ta); row.appendChild(rm);
      item.appendChild(row);
      item.appendChild(el('div', { class: 'sq-checks', 'data-i': String(i), 'aria-live': 'polite' }));
      box.appendChild(item);
    });
    const err = box.parentElement.querySelector('.err'); if (err && state.s7.subs.some(filled)) err.textContent = '';
    updateSubChecks();
  }
  function updateSubChecks() {
    const q = mainQ(), c = ctx();
    const R = UI.subRefs;
    state.s7.subs.forEach((s, i) => {
      const box = $('.sq-checks[data-i="' + i + '"]'); if (!box) return;
      if (!filled(s)) { box.innerHTML = ''; return; }
      const conn = A.overlap(s, q + ' ' + state.s1.phenomenon) > 0;
      const rep = state.s7.subs.some((o, j) => j !== i && filled(o) && A.jaccard(o, s) >= 0.6) || A.jaccard(s, q) >= 0.75;
      const d = A.detect(s, c);
      const chips = [
        [conn, R.connected, R.notConnected],
        [!rep, R.distinct, R.repeat],
        [!d.methodMismatch, R.method, R.notMethod],
        [!d.closed, R.open, R.closed]
      ];
      box.innerHTML = chips.map((x) => '<span class="mini ' + (x[0] ? 'ok' : 'warn') + '">' + (x[0] ? '✓ ' : '! ') + esc(x[0] ? x[1] : x[2]) + '</span>').join('');
    });
  }

  /* Weakness checklist (Refinement section) */
  function renderChecklistDetect() {
    const ta = $('#check-q'); if (!ta) return;
    const q = state.tools.checkQ;
    const d = filled(q) ? A.detect(q, ctx()) : null;
    RC.checklist.forEach((c) => {
      const n = $('[data-detect="' + c.id + '"]'); if (!n) return;
      if (!c.detect) { n.textContent = UI.manual; n.className = 'detect'; n.style.color = 'var(--muted-2)'; return; }
      if (!d) { n.textContent = ''; return; }
      const hit = !!d[c.detect];
      n.textContent = hit ? '● ' + UI.detected : '✓ ' + UI.notDetected;
      n.className = 'detect' + (hit ? '' : ' clear'); n.style.color = '';
    });
    const done = RC.checklist.filter((c) => state.tools.checks[c.id]).length;
    const sum = $('#check-summary'); if (sum) sum.textContent = num(done) + ' / ' + num(RC.checklist.length);
    $$('#checklist .chk').forEach((l) => l.classList.toggle('on', !!state.tools.checks[l.dataset.id]));
  }

  /* Comparison tool */
  function renderComparison() {
    const tb = $('#cmp-body'), ch = $('#cmp-changes'); if (!tb) return;
    const a = state.tools.cmpA, b = state.tools.cmpB, c = ctx();
    if (!filled(a) || !filled(b)) { tb.innerHTML = '<tr><td colspan="3">' + esc(UI.cmp.none) + '</td></tr>'; ch.innerHTML = ''; return; }
    const r = A.compare(a, b, c);
    const val = (d, id) => {
      switch (id) {
        case 'open': return !d.closed;
        case 'single': return !d.double;
        case 'precise': return !d.vague;
        case 'neutral': return !d.leading && !d.opinion;
        case 'context': return filled(c.context) ? !d.noContext : null;
        case 'time': return !d.noTime;
        case 'method': return filled(c.approach) ? !d.methodMismatch : null;
      }
      return null;
    };
    const cell = (x) => x === null ? '<td>—</td>' : '<td><span class="' + (x ? 'yes' : 'no') + '">' + (x ? '✓ ' + esc(UI.yes) : '✗ ' + esc(UI.no)) + '</span></td>';
    tb.innerHTML = UI.cmpRows.map((row) => '<tr><td>' + esc(row.t) + '</td>' + cell(val(r.ia, row.id)) + cell(val(r.ib, row.id)) + '</tr>').join('') +
      '<tr><td>' + esc(UI.cmp.words) + '</td><td>' + r.wcA + '</td><td>' + r.wcB + '</td></tr>';
    const typeLabel = { resolved: UI.cmp.resolved, introduced: UI.cmp.introduced, remaining: UI.cmp.remaining };
    const cls = { resolved: 'ok', introduced: 'bad', remaining: 'warn' };
    let html = r.rows.map((x) => '<div class="diag-item st-' + cls[x.type] + '"><span class="ic" aria-hidden="true">' + ({ resolved: '✓', introduced: '×', remaining: '!' }[x.type]) + '</span><span class="t">' + esc(x.label) + '<span class="status-label">' + esc(typeLabel[x.type]) + '</span></span><span class="d">' + esc(x.why) + '</span></div>').join('');
    if (r.added.length) html += '<p class="small"><strong>' + esc(UI.cmp.added) + ':</strong> ' + esc(r.added.slice(0, 10).join('، ')) + '</p>';
    if (r.removed.length) html += '<p class="small"><strong>' + esc(UI.cmp.removed) + ':</strong> ' + esc(r.removed.slice(0, 10).join('، ')) + '</p>';
    ch.innerHTML = html || '<p class="small">—</p>';
  }

  /* Alignment matrix */
  function renderMatrix() {
    const grid = $('#matrix-grid'), links = $('#matrix-links'); if (!grid) return;
    const M = UI.matrix, s1 = state.s1, s3 = state.s3;
    const problemText = [state.s2.issue, state.s2.known, state.s2.gap, state.s2.need].some(filled) ? RC.tpl.problem(state.s2) : '';
    const q = mainQ();
    const subs = state.s7.subs.filter(filled);
    const o = RC.orientations.find((x) => x.id === s3.orientation);
    const methodText = [label(RC.approaches, s1.approach), o ? o.t : '', label(RC.sources, s1.source), s3.method].filter(filled).join(' · ');
    const cells = [
      ['problem', problemText], ['aim', s3.aim], ['main', q],
      ['supporting', subs.length ? subs.map((x, i) => RC.numerals[i] + '. ' + x).join('\n') : ''], ['theory', s3.theory], ['method', methodText]
    ];
    grid.innerHTML = cells.map((c) => '<div class="m-cell' + (filled(c[1]) ? ' filled' : '') + '"><span class="k">' + esc(M[c[0]]) + '<span aria-hidden="true">' + (filled(c[1]) ? '●' : '○') + '</span></span><span class="v' + (filled(c[1]) ? '' : ' empty') + '" style="white-space:pre-line">' + esc(filled(c[1]) ? c[1] : UI.empty) + '</span></div>').join('');

    const L = UI.linkMsg, c = ctx();
    const item = (title, status, msg) => '<div class="diag-item st-' + status + '"><span class="ic" aria-hidden="true">' + ({ ok: '✓', warn: '!', bad: '×', info: 'i' }[status]) + '</span><span class="t">' + esc(title) + '<span class="status-label">' + esc(UI.status[status]) + '</span></span><span class="d">' + esc(msg) + '</span></div>';
    const pair = (a, b, key) => {
      if (!filled(a) || !filled(b)) return item(UI.links[key], 'info', L.missing);
      const ok = A.overlap(a, b) > 0;
      return item(UI.links[key], ok ? 'ok' : 'warn', L[key][ok ? 0 : 1]);
    };
    let html = pair(problemText + ' ' + s1.phenomenon, s3.aim, 'problemAim');
    if (!filled(s3.aim) || !filled(q)) html += item(UI.links.aimMain, 'info', L.missing);
    else { const d = A.detect(q, c); const ok = A.overlap(s3.aim, q) > 0 && !d.orientMismatch; html += item(UI.links.aimMain, ok ? 'ok' : 'warn', L.aimMain[ok ? 0 : 1]); }
    html += pair(problemText + ' ' + s1.phenomenon, q, 'problemMain');
    if (!filled(q) || !subs.length) html += item(UI.links.mainSupporting, 'info', L.missing);
    else { const n = subs.filter((s) => A.overlap(s, q + ' ' + s1.phenomenon) > 0).length; html += item(UI.links.mainSupporting, n === subs.length ? 'ok' : 'warn', L.mainSupporting(num(n), num(subs.length))); }
    if (!filled(q)) html += item(UI.links.mainTheory, 'info', L.missing);
    else if (!filled(s3.theory)) html += item(UI.links.mainTheory, 'info', L.mainTheory[2]);
    else { const ok = A.overlap(q, s3.theory) > 0; html += item(UI.links.mainTheory, ok ? 'ok' : 'info', L.mainTheory[ok ? 0 : 1]); }
    if (!filled(q) || !s1.approach) html += item(UI.links.mainMethod, 'info', L.missing);
    else { const d = A.detect(q, c); html += item(UI.links.mainMethod, d.methodMismatch ? 'warn' : 'ok', L.mainMethod[d.methodMismatch ? 1 : 0]); }
    links.innerHTML = html;
  }

  /* ---------------- Report ---------------- */
  function buildReportHTML() {
    const R = UI.report, s1 = state.s1, s2 = state.s2, s3 = state.s3, s4 = state.s4;
    const o = RC.orientations.find((x) => x.id === s3.orientation);
    const q = mainQ(), c = ctx();
    const p = (x) => '<p>' + esc(filled(x) ? x : UI.empty) + '</p>';
    const sc = state.s6.scores;
    const rated = RC.rubric.filter((cr) => sc[cr.id]);
    const mean = rated.length ? (rated.reduce((a, cr) => a + sc[cr.id], 0) / rated.length) : 0;
    const lvl = UI.levels.find((l) => mean >= l.min) || UI.levels[UI.levels.length - 1];
    const res = A.analyze(q, c);
    const recs = [];
    RC.rubric.forEach((cr) => { if (sc[cr.id] && sc[cr.id] <= 3) recs.push(cr.t + ': ' + RC.rubricRec[cr.id]); });
    res.dims.forEach((d) => { if ((d.status === 'warn' || d.status === 'bad') && d.rec) recs.push(d.title + ': ' + d.rec); });
    const date = new Date().toLocaleDateString(RC.lang === 'ar' ? 'ar-SA' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
    let h = '<h2>' + esc(R.title) + '</h2><p class="meta">' + esc(R.generated(date)) + '</p>';
    h += '<h3>' + esc(R.topic) + '</h3>' + p(s1.topic) + '<ul>' +
      '<li><strong>' + esc(R.subfield) + ':</strong> ' + esc(label(RC.subfields, s1.subfield) || UI.empty) + '</li>' +
      '<li><strong>' + esc(R.context) + ':</strong> ' + esc(s1.context || UI.empty) + '</li>' +
      (filled(s1.timeframe) ? '<li><strong>' + esc(R.timeframe) + ':</strong> ' + esc(s1.timeframe) + '</li>' : '') +
      '<li><strong>' + esc(R.source) + ':</strong> ' + esc((label(RC.sources, s1.source) || UI.empty) + (filled(s1.population) ? ' — ' + s1.population : '')) + '</li></ul>' +
      '<p>' + esc(RC.tpl.topic(s1, { subfield: label(RC.subfields, s1.subfield), approach: label(RC.approaches, s1.approach) })) + '</p>';
    h += '<h3>' + esc(R.problem) + '</h3>' + p(RC.tpl.problem(s2));
    h += '<h3>' + esc(R.aim) + '</h3>' + p(s3.aim) + '<p><strong>' + esc(R.orientation) + ':</strong> ' + esc(o ? o.t : UI.empty) + '</p>';
    h += '<h3>' + esc(R.theory) + '</h3>' + p(s3.theory);
    h += '<h3>' + esc(R.method) + '</h3><p><strong>' + esc(R.approach) + ':</strong> ' + esc(label(RC.approaches, s1.approach) || UI.empty) + (filled(s3.method) ? ' — ' + esc(s3.method) : '') + '</p>';
    h += '<h3>' + esc(R.initial) + '</h3>' + p(s4.initial);
    h += '<h3>' + esc(R.refined) + '</h3>' + p(q);
    if (s1.approach === 'mixed') h += '<p><strong>' + esc(R.mixedSet) + '</strong></p><ul><li><strong>' + esc(R.quant) + ':</strong> ' + esc(s4.quant || UI.empty) + '</li><li><strong>' + esc(R.qual) + ':</strong> ' + esc(s4.qual || UI.empty) + '</li><li><strong>' + esc(R.integ) + ':</strong> ' + esc(s4.integ || UI.empty) + '</li></ul>';
    const subs = state.s7.subs.filter(filled);
    h += '<h3>' + esc(R.supporting) + '</h3>' + (subs.length ? '<ol>' + subs.map((s) => '<li>' + esc(s) + '</li>').join('') + '</ol>' : p(''));
    h += '<h3>' + esc(R.evaluation) + '</h3>' + (rated.length ?
      '<ul>' + RC.rubric.map((cr) => '<li>' + esc(cr.t) + ': ' + (sc[cr.id] ? RC.numerals[sc[cr.id] - 1] + ' ' + esc(UI.outOf5) : esc(UI.notRated)) + '</li>').join('') + '</ul><p><strong>' + esc(UI.overall) + ':</strong> ' + esc(mean.toFixed(1)) + ' ' + esc(UI.outOf5) + ' — ' + esc(lvl.t) + '</p>' : p(UI.notRated));
    h += '<h3>' + esc(R.recs) + '</h3>' + (recs.length ? '<ul>' + [...new Set(recs)].map((r) => '<li>' + esc(r) + '</li>').join('') + '</ul>' : '<p>' + esc(R.noRecs) + '</p>');
    return h;
  }
  function sanitize(html) {
    const doc = new DOMParser().parseFromString('<div>' + html + '</div>', 'text/html');
    const allowed = ['DIV', 'P', 'H2', 'H3', 'UL', 'OL', 'LI', 'STRONG', 'B', 'EM', 'I', 'BR', 'SPAN', 'U'];
    const walk = (node) => {
      Array.from(node.children).forEach((ch) => {
        if (allowed.indexOf(ch.tagName) === -1) { ch.replaceWith(document.createTextNode(ch.textContent)); return; }
        Array.from(ch.attributes).forEach((a) => { if (a.name !== 'class') ch.removeAttribute(a.name); });
        walk(ch);
      });
    };
    walk(doc.body.firstChild);
    return doc.body.firstChild.innerHTML;
  }
  function renderReport(force) {
    const r = $('#report'); if (!r) return;
    if (force || !state.report.edited || !filled(state.report.html)) {
      state.report.html = buildReportHTML(); state.report.edited = false;
    }
    r.innerHTML = sanitize(state.report.html);
  }
  function download(name, content, type) {
    const blob = new Blob(content, { type });
    const a = el('a', { href: URL.createObjectURL(blob), download: name });
    document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise((resolve, reject) => {
      const ta = el('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy') ? resolve() : reject(); } catch (e) { reject(e); } finally { ta.remove(); }
    });
  }

  /* ---------------- Two-click confirmation buttons ---------------- */
  function confirmClick(btn, confirmLabel, action, needConfirm) {
    const original = btn.textContent;
    btn.addEventListener('click', () => {
      if (btn.dataset.armed === '1') { btn.dataset.armed = ''; btn.textContent = original; action(); return; }
      if (needConfirm && !needConfirm()) { action(); return; }
      btn.dataset.armed = '1'; btn.textContent = confirmLabel;
      setTimeout(() => { btn.dataset.armed = ''; btn.textContent = original; }, 4000);
    });
  }

  /* ---------------- Change handler ---------------- */
  let raf = null;
  function onChange() {
    suppressSave = false;
    save();
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => { refresh(); renderStepperStatusOnly(); });
  }
  function renderStepperStatusOnly() {
    $$('#stepper .stepdot').forEach((b, i) => {
      b.classList.toggle('done', i < state.step && validateStep(i, false));
      b.disabled = i > state.maxStep + 1 || (i === state.maxStep + 1 && !validateStep(state.maxStep, false));
    });
  }

  /* ---------------- Wire up controls ---------------- */
  function wire() {
    $('#btn-next').addEventListener('click', () => { if (validateStep(state.step, true)) goTo(state.step + 1, true); });
    $('#btn-prev').addEventListener('click', () => goTo(state.step - 1, true));

    $('#btn-draft-aim').addEventListener('click', () => {
      const o = RC.orientations.find((x) => x.id === state.s3.orientation);
      state.s3.aim = RC.tpl.aim(state.s1, o);
      $('#s3-aim').value = state.s3.aim; clearFieldError($('#s3-aim')); onChange();
    });
    $('#btn-use-revision').addEventListener('click', () => {
      const rev = RC.tpl.revise(state);
      state.s5.refined = rev.main;
      if (rev.quant) {
        if (!filled(state.s4.quant)) state.s4.quant = rev.quant;
        if (!filled(state.s4.qual)) state.s4.qual = rev.qual;
        if (!filled(state.s4.integ)) state.s4.integ = rev.integ;
      }
      fillInputs(); clearFieldError($('#s5-refined')); onChange(); toast(UI.revisionUsed); $('#s5-refined').focus();
    });
    $('#btn-apply-scores').addEventListener('click', () => {
      const q = mainQ(), res = A.analyze(q, ctx());
      state.s6.scores = A.suggestScores(res, ctx(), state.s3.aim, q);
      fillInputs(); onChange(); toast(UI.scoresApplied);
    });
    $('#btn-add-sub').addEventListener('click', () => {
      if (state.s7.subs.length >= 6) { toast(UI.maxSubs); return; }
      state.s7.subs.push(''); renderSubs(); onChange();
      const last = $$('#sub-list textarea').pop(); if (last) last.focus();
    });

    // Report
    const rep = $('#report');
    rep.addEventListener('input', () => { state.report.html = sanitize(rep.innerHTML); state.report.edited = true; save(); });
    confirmClick($('#btn-regen'), UI.regenConfirm, () => { renderReport(true); save(); toast(UI.regenerated); }, () => state.report.edited);
    $('#btn-copy-report').addEventListener('click', () => copyText(rep.innerText).then(() => toast(UI.copied), () => toast(UI.copyFail)));
    $('#btn-print').addEventListener('click', () => window.print());
    $('#btn-doc').addEventListener('click', () => {
      const dir = RC.lang === 'ar' ? 'rtl' : 'ltr';
      const html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>' + esc(UI.report.title) + '</title>' +
        '<style>body{font-family:' + (RC.lang === 'ar' ? 'Arial,"Traditional Arabic"' : 'Calibri,Arial') + ',sans-serif;font-size:12pt;line-height:1.6;direction:' + dir + ';text-align:' + (dir === 'rtl' ? 'right' : 'left') + '}h2{font-size:18pt;color:#1F6F6B}h3{font-size:13pt;color:#1F6F6B;margin-top:14pt}.meta{color:#555;font-size:10pt}</style></head>' +
        '<body dir="' + dir + '" lang="' + RC.lang + '">' + sanitize(rep.innerHTML) + '</body></html>';
      download(UI.fileReport + '.doc', ['﻿', html], 'application/msword');
    });
    $('#btn-txt').addEventListener('click', () => download(UI.fileReport + '.txt', ['﻿', rep.innerText], 'text/plain;charset=utf-8'));

    // Tools
    $('#btn-check-load').addEventListener('click', () => {
      const q = mainQ(); if (!filled(q)) { toast(UI.nothingToLoad); return; }
      state.tools.checkQ = q; fillInputs(); onChange(); toast(UI.loaded);
    });
    $('#btn-cmp-load').addEventListener('click', () => {
      if (!filled(state.s4.initial)) { toast(UI.nothingToLoad); return; }
      state.tools.cmpA = state.s4.initial; state.tools.cmpB = state.s5.refined || '';
      fillInputs(); onChange(); toast(UI.loaded);
    });

    // Data controls
    $$('[data-action="delete"]').forEach((btn) => confirmClick(btn, UI.deleteConfirm, () => {
      try { localStorage.removeItem(STORE_KEY); } catch (e) { /* ignore */ }
      suppressSave = true; clearTimeout(saveTimer);
      state = defaults(); fillInputs(); goTo(0, false); updateSaveStatus();
      try { localStorage.removeItem(STORE_KEY); } catch (e) { /* ignore */ }
      toast(UI.deleted);
    }));
    $$('[data-action="export"]').forEach((btn) => btn.addEventListener('click', () => {
      download('research-question-data.json', [JSON.stringify(state, null, 2)], 'application/json');
    }));
    const fileIn = $('#file-import');
    if (fileIn) fileIn.addEventListener('change', () => {
      const f = fileIn.files[0]; if (!f) return;
      const rd = new FileReader();
      rd.onload = () => {
        try {
          const data = JSON.parse(rd.result);
          if (!data || data.v !== 1) throw new Error('bad');
          state = merge(defaults(), data); fillInputs(); goTo(state.step, false); save(true); toast(UI.imported);
        } catch (e) { toast(UI.importFail); }
        fileIn.value = '';
      };
      rd.readAsText(f);
    });

    // Language switch: keep data, remember choice
    $$('[data-lang-switch]').forEach((a) => a.addEventListener('click', () => {
      save(true);
      try { localStorage.setItem(LANG_KEY, a.dataset.langSwitch); } catch (e) { /* ignore */ }
      a.href = a.getAttribute('href').split('#')[0] + (location.hash || '');
    }));

    window.addEventListener('beforeunload', () => save(true));
  }

  /* ---------------- Boot ---------------- */
  document.addEventListener('DOMContentLoaded', () => {
    const had = load();
    renderSelectOptions();
    renderOrientations();
    renderRubric();
    renderChecklist();
    renderExamples();
    renderGlossary();
    renderRefs();
    bindInputs();
    fillInputs();
    wire();
    goTo(state.step || 0, false);
    updateSaveStatus();
    if (had && (state.s1.topic || state.s4.initial)) toast(UI.restored);
  });
})();
