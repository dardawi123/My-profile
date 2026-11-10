/* =========================================================
   Refining and Formulating Research Titles — application logic
   تنقيح وصياغة عناوين البحوث — منطق التطبيق

   Language-neutral. Reads all wording from window.RC (rtitles-ar.js /
   rtitles-en.js), rules from window.RTA (analyzer.js), and shared data
   from glossary.js and references.js.
   Data never leaves the browser: progress is stored in localStorage.
   Academic tool developed by Dr. Merfat Alardawi | د. مرفت العرضاوي
   ========================================================= */
(function () {
  'use strict';

  const RC = window.RC, A = window.RTA;
  if (!RC || !A) { console.error('RTF: required scripts are missing.'); return; }
  const UI = RC.ui;

  const STORE_KEY = 'rtf.data.v1';
  const LANG_KEY = 'rtf.lang';
  const STEPS = 8;
  const MAX_ALTS = 4;

  /* ---------------- State ---------------- */
  function defaults() {
    return {
      v: 1, step: 0, maxStep: 0, savedAt: null,
      s1: { topic: '', subfield: '', phenomenon: '', context: '', material: '', timeframe: '', approach: '' },
      s2: { focus: '', centre: '', concepts: '', scope: '', include: '', exclude: '', compare: '', problem: '', questions: '', contribution: '' },
      s3: { theory: '', theoryMention: '', method: '', methodNote: '', methodMention: '' },
      s4: { keywords: [], structure: '', hook: '', initial: '', alts: [] },
      s5: { refined: '' },
      s6: { scores: {} },
      s7: { cmp: ['', '', ''], selected: '' },
      report: { html: '', edited: false },
      tools: { checkT: '', checks: {}, cmpA: '', cmpB: '' }
    };
  }
  function merge(base, src) {
    if (!src || typeof src !== 'object') return base;
    Object.keys(base).forEach((k) => {
      if (!(k in src)) return;
      if (base[k] && typeof base[k] === 'object' && !Array.isArray(base[k])) base[k] = merge(base[k], src[k]);
      else if (Array.isArray(base[k])) {
        if (Array.isArray(src[k])) {
          const arr = src[k].filter((x) => typeof x === 'string').slice(0, 12);
          base[k] = k === 'cmp' ? [0, 1, 2].map((i) => arr[i] || '') : arr;
        }
      }
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
  const sameText = (a, b) => String(a || '').trim().replace(/\s+/g, ' ') === String(b || '').trim().replace(/\s+/g, ' ');
  const icon = (st) => ({ ok: '✓', warn: '!', bad: '×', info: 'i' }[st]);
  /* The title used downstream: selected (Step 7) > refined (Step 5) > initial (Step 4). */
  const mainT = () => (filled(state.s7.selected) ? state.s7.selected : (filled(state.s5.refined) ? state.s5.refined : state.s4.initial));

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

  /* ---------------- Labels & analyzer context ---------------- */
  function labels() {
    const m = RC.methods.find((x) => x.id === state.s3.method);
    return {
      subfield: label(RC.subfields, state.s1.subfield),
      approach: label(RC.approaches, state.s1.approach),
      centre: label(RC.centres, state.s2.centre),
      method: m ? m.t : '',
      methodTitle: m ? m.title : ''
    };
  }
  function ctx() {
    const s1 = state.s1, s2 = state.s2, s3 = state.s3, lab = labels();
    return {
      approach: s1.approach, phenomenon: s1.phenomenon, context: s1.context, timeframe: s1.timeframe, material: s1.material,
      focus: s2.focus, concepts: s2.concepts, problem: s2.problem, contribution: s2.contribution,
      theory: s3.theory, theoryMention: s3.theoryMention, methodMention: s3.methodMention,
      methodLabel: [lab.method, lab.methodTitle].join(' '),
      keywords: state.s4.keywords
    };
  }

  /* ---------------- Static renders ---------------- */
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
  function renderStatic() {
    const sel = $('#s1-subfield');
    if (sel) RC.subfields.forEach((s) => sel.appendChild(el('option', { value: s.id }, esc(s.t))));
    renderRadios('#s1-approach', 's1.approach', RC.approaches);
    renderRadios('#s2-centre', 's2.centre', RC.centres);
    renderRadios('#s3-theory-mention', 's3.theoryMention', RC.decisions);
    renderRadios('#s3-method-mention', 's3.methodMention', RC.decisions);

    const mbox = $('#method-pick');
    if (mbox) RC.methods.forEach((m) => {
      const b = el('button', { type: 'button', class: 'choice', 'aria-pressed': 'false', 'data-id': m.id }, '<strong>' + esc(m.t) + '</strong><span>' + esc(m.title) + '</span><span class="fit-note" data-fit="' + m.id + '"></span>');
      b.addEventListener('click', () => { state.s3.method = m.id; clearFieldError(mbox); onChange(); });
      mbox.appendChild(b);
    });

    const tbox = $('#theory-suggest');
    if (tbox) RC.theories.forEach((t) => {
      const b = el('button', { type: 'button', class: 'chip-btn' }, esc(t));
      b.addEventListener('click', () => { state.s3.theory = t; $('#s3-theory').value = t; onChange(); });
      tbox.appendChild(b);
    });

    const sbox = $('#structure-pick');
    if (sbox) RC.structures.forEach((s) => {
      const b = el('button', { type: 'button', class: 'choice', 'aria-pressed': 'false', 'data-id': s.id }, '<strong>' + esc(s.t) + '</strong><span>' + esc(s.d) + '</span><span class="ex">' + esc(s.ex) + '</span>');
      b.addEventListener('click', () => { state.s4.structure = s.id; onChange(); });
      sbox.appendChild(b);
    });

    renderRubric();
    renderChecklist();
    renderExamples();
    renderGlossary();
    renderRefs();
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
        const inp = el('input', { type: 'radio', name: 'rub-' + c.id, value: String(n), 'aria-label': c.t + ': ' + RC.numerals[n - 1] });
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
    const list = $('#ex-list'), pub = $('#pub-list'), filters = $('#ex-filters'); if (!list || !filters) return;
    const X = UI.exLabels;
    const subs = [...new Set(RC.examples.map((e) => e.sub).concat(RC.published.map((e) => e.sub)))];
    const mk = (id, t) => {
      const b = el('button', { type: 'button', class: 'chip-btn', 'aria-pressed': id === 'all' ? 'true' : 'false', 'data-f': id }, esc(t));
      b.addEventListener('click', () => {
        $$('.chip-btn', filters).forEach((x) => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
        $$('.ex-card').forEach((c) => { c.hidden = !(id === 'all' || c.dataset.sub === id); });
      });
      filters.appendChild(b);
    };
    mk('all', UI.all);
    RC.subfields.filter((s) => subs.indexOf(s.id) !== -1).forEach((s) => mk(s.id, s.t));
    RC.examples.forEach((e) => {
      const card = el('article', { class: 'ex-card', 'data-sub': e.sub });
      card.innerHTML =
        '<div class="tags"><span class="tag">' + esc(label(RC.subfields, e.sub)) + '</span><span class="tag tag-illustrative">' + esc(UI.exTags.hypothetical) + '</span></div>' +
        '<h3 class="h3 ex-title">' + esc(e.area) + '</h3>' +
        '<div class="ex-weak"><b>' + esc(X.weak) + '</b>' + esc(e.weak) + '</div>' +
        '<div class="ex-better"><b>' + esc(X.better) + '</b>' + esc(e.better) + '</div>' +
        '<p class="why"><strong>' + esc(X.why) + '</strong> ' + esc(e.why) + '</p>' +
        '<p class="why"><strong>' + esc(X.terms) + '</strong> ' + esc(e.terms) + '</p>' +
        '<p class="meth"><strong>' + esc(X.method) + '</strong> ' + esc(e.method) + '</p>';
      list.appendChild(card);
    });
    if (pub) RC.published.forEach((e) => {
      const card = el('article', { class: 'ex-card ex-pub', 'data-sub': e.sub });
      card.innerHTML =
        '<div class="tags"><span class="tag">' + esc(label(RC.subfields, e.sub)) + '</span><span class="tag tag-evidence">' + esc(UI.exTags.published) + '</span></div>' +
        '<p class="pub-title" lang="en" dir="ltr">' + esc(e.title) + '</p>' +
        '<p class="why"><strong>' + esc(X.structure) + '</strong> ' + esc(e.structure) + '</p>' +
        '<p class="why"><strong>' + esc(X.lesson) + '</strong> ' + esc(e.lesson) + '</p>' +
        '<p class="cite"><strong>' + esc(X.source) + '</strong> <span lang="en" dir="ltr">' + esc(e.ref) + '</span></p>';
      pub.appendChild(card);
    });
  }

  function renderGlossary() {
    const body = $('#gloss-body'); if (!body) return;
    const G = window.RT_GLOSSARY || [];
    G.forEach((g) => {
      const tr = el('tr', { 'data-search': (g.ar + ' ' + g.en + ' ' + g.defAr + ' ' + g.defEn).toLowerCase() });
      const cols = RC.lang === 'ar'
        ? [['ar', g.ar, 'rtl'], ['en', g.en, 'ltr'], ['ar', g.defAr, 'rtl'], ['en', g.defEn, 'ltr']]
        : [['en', g.en, 'ltr'], ['ar', g.ar, 'rtl'], ['en', g.defEn, 'ltr'], ['ar', g.defAr, 'rtl']];
      cols.forEach((c) => tr.appendChild(el('td', { lang: c[0], dir: c[2] }, esc(c[1]))));
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
    (window.RT_REFS || []).forEach((g) => {
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
      const h = () => { setPath(state, inp.dataset.bind, inp.value); if (inp.getAttribute('aria-invalid') === 'true' && filled(inp.value)) clearFieldError(inp); onChange(); };
      inp.addEventListener('input', h);
      inp.addEventListener('change', h);
    });
    $$('[data-bind-cmp]').forEach((inp) => {
      inp.addEventListener('input', () => { state.s7.cmp[Number(inp.dataset.bindCmp)] = inp.value; clearFieldError(inp); onChange(); });
    });
  }
  function fillInputs() {
    $$('[data-bind]').forEach((inp) => { const val = getPath(state, inp.dataset.bind); inp.value = val == null ? '' : val; });
    $$('[data-bind-cmp]').forEach((inp) => { inp.value = state.s7.cmp[Number(inp.dataset.bindCmp)] || ''; });
    [['#s1-approach', state.s1.approach], ['#s2-centre', state.s2.centre], ['#s3-theory-mention', state.s3.theoryMention], ['#s3-method-mention', state.s3.methodMention]]
      .forEach((p) => $$(p[0] + ' input').forEach((i) => { i.checked = i.value === p[1]; }));
    RC.rubric.forEach((c) => { $$('input[name="rub-' + c.id + '"]').forEach((i) => { i.checked = Number(i.value) === state.s6.scores[c.id]; }); });
    RC.checklist.forEach((c) => { const l = $('#checklist .chk[data-id="' + c.id + '"]'); if (l) { const i = $('input', l); i.checked = !!state.tools.checks[c.id]; l.classList.toggle('on', i.checked); } });
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
      const val = inp.dataset.bind ? getPath(state, inp.dataset.bind) : inp.value;
      const min = Number(inp.dataset.minwords || 0);
      if (!filled(val)) fail(inp, UI.required);
      else if (min && wc(val) < min) fail(inp, UI.tooShort(num(min)));
      else if (show) clearFieldError(inp);
    });
    if (i === 0 && !state.s1.approach) fail($('#s1-approach'), UI.chooseOne);
    if (i === 1 && !state.s2.centre) fail($('#s2-centre'), UI.chooseOne);
    if (i === 2) {
      if (!state.s3.method) fail($('#method-pick'), UI.chooseOne);
      if (!state.s3.theoryMention) fail($('#s3-theory-mention'), UI.chooseOne);
      if (!state.s3.methodMention) fail($('#s3-method-mention'), UI.chooseOne);
    }
    if (i === 6 && state.s7.cmp.filter(filled).length < 2) fail($('#cmp-0'), UI.needCompare);
    if (show) {
      $('#form-alert').hidden = ok;
      if (!ok) { $('#form-alert').textContent = UI.fixErrors; const f = firstBad.matches('.inp') ? firstBad : (firstBad.querySelector('input, button, textarea') || firstBad); f.focus(); }
    }
    return ok;
  }

  /* ---------------- Wizard navigation ---------------- */
  function goTo(i, focus) {
    i = Math.max(0, Math.min(STEPS - 1, i));
    if (i === 6) prefillCompare();
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
  function renderStepperStatusOnly() {
    $$('#stepper .stepdot').forEach((b, i) => {
      b.classList.toggle('done', i < state.step && validateStep(i, false));
      b.disabled = i > state.maxStep + 1 || (i === state.maxStep + 1 && !validateStep(state.maxStep, false));
    });
  }

  /* ---------------- Derived views ---------------- */
  function diagHTML(res) {
    return res.dims.map((d) =>
      '<div class="diag-item st-' + d.status + '"><span class="ic" aria-hidden="true">' + icon(d.status) + '</span>' +
      '<span class="t">' + esc(d.title) + '<span class="status-label">' + esc(UI.status[d.status]) + '</span></span>' +
      '<span class="d">' + esc(d.msg) + '</span>' + (d.rec ? '<span class="r"><strong>→</strong> ' + esc(d.rec) + '</span>' : '') + '</div>').join('');
  }
  function metaLine(t, c) {
    if (!filled(t)) return '';
    const i = A.detect(t, c);
    let s = UI.words(i._wc);
    if (i._kwTotal) s += ' · ' + UI.kwCoverage(num(i._kwCovered), num(i._kwTotal));
    return s;
  }

  function refresh() {
    const c = ctx(), lab = labels();
    const s1 = state.s1, s2 = state.s2, s3 = state.s3, s4 = state.s4;

    // Step outputs 1–3
    const t1 = $('#out-topic'); if (t1) t1.textContent = RC.tpl.topic(s1, lab);
    const t2 = $('#out-focus'); if (t2) t2.textContent = RC.tpl.focus(s2, lab);
    const t3 = $('#out-orient'); if (t3) t3.textContent = RC.tpl.orientation(s3, lab);

    // Step 3: method cards + fit notes
    $$('#method-pick .choice').forEach((b) => {
      b.setAttribute('aria-pressed', b.dataset.id === s3.method ? 'true' : 'false');
      const m = RC.methods.find((x) => x.id === b.dataset.id);
      const fit = !s1.approach || m.fit.indexOf(s1.approach) !== -1;
      const n = $('[data-fit="' + m.id + '"]', b);
      n.textContent = fit ? '' : $('#method-pick').dataset.misfit;
      b.classList.toggle('misfit', !fit);
    });

    // Step 4: keyword chips, structure cards, generated titles
    renderKeywords(lab);
    $$('#structure-pick .choice').forEach((b) => b.setAttribute('aria-pressed', b.dataset.id === s4.structure ? 'true' : 'false'));
    renderGenerated(lab);
    renderAlts();
    const im = $('#initial-meta'); if (im) im.textContent = metaLine(s4.initial, c);

    // Step 5: analysis of initial + suggestions
    if (state.step >= 3) {
      $('#initial-echo').textContent = s4.initial || UI.empty;
      $('#diag-initial').innerHTML = diagHTML(A.analyze(s4.initial, c));
      const cleaned = RC.tpl.clean(s4.initial);
      $('#sug-clean').textContent = cleaned || UI.empty;
      $('#sug-clean-box').hidden = !filled(cleaned) || sameText(cleaned, s4.initial);
      const gen = RC.tpl.titles(state, lab);
      const pick = gen.find((g) => g.id === (s4.structure || 'compound')) || gen[0];
      $('#sug-tpl').textContent = pick.text;
      if (filled(state.s5.refined)) {
        const rr = A.analyze(state.s5.refined, c);
        $('#refined-summary').innerHTML = diagHTML(rr);
        $('#refined-count').textContent = num(rr.dims.filter((d) => d.status === 'bad' || d.status === 'warn').length);
      } else { $('#refined-summary').innerHTML = ''; $('#refined-count').textContent = '—'; }
      const rm = $('#refined-meta'); if (rm) rm.textContent = metaLine(state.s5.refined, c);
    }

    // Step 6: suggested rubric scores + results
    const t = mainT();
    const res = A.analyze(t, c);
    const sug = A.suggestScores(res, c, t);
    const te = $('#eval-echo'); if (te) te.textContent = t || UI.empty;
    RC.rubric.forEach((cr) => { const n = $('[data-suggest="' + cr.id + '"]'); if (n) n.textContent = $('#rubric').dataset.suggested + ' ' + RC.numerals[sug[cr.id] - 1]; });
    renderRubricResult();

    // Step 7: comparison cards
    renderAltCompare();

    // Tools
    renderChecklistDetect();
    renderComparison();
    renderMatrix();
  }

  function renderKeywords(lab) {
    const box = $('#kw-chips'); if (!box) return;
    const list = RC.tpl.keywords(state, lab);
    // keep only keywords that still exist in the suggestions or were chosen earlier
    const sig = list.join('|') + '#' + state.s4.keywords.join('|');
    if (box.dataset.sig === sig) return;
    box.dataset.sig = sig; box.innerHTML = '';
    const all = [...new Set(list.concat(state.s4.keywords))];
    all.forEach((k) => {
      const on = state.s4.keywords.indexOf(k) !== -1;
      const b = el('button', { type: 'button', class: 'chip-btn', 'aria-pressed': on ? 'true' : 'false' }, esc(k));
      b.addEventListener('click', () => {
        const i = state.s4.keywords.indexOf(k);
        if (i === -1) state.s4.keywords.push(k); else state.s4.keywords.splice(i, 1);
        onChange();
      });
      box.appendChild(b);
    });
  }

  function renderGenerated(lab) {
    const box = $('#gen-list'); if (!box) return;
    const ready = filled(state.s1.phenomenon) && filled(state.s1.material);
    if (!ready) { box.innerHTML = '<p class="hint">' + esc(UI.gen.none) + '</p>'; box.dataset.sig = ''; return; }
    let gen = RC.tpl.titles(state, lab);
    if (state.s4.structure) gen = gen.filter((g) => g.id === state.s4.structure).concat(gen.filter((g) => g.id !== state.s4.structure));
    const sig = gen.map((g) => g.text).join('|');
    if (box.dataset.sig === sig) return;
    box.dataset.sig = sig; box.innerHTML = '';
    gen.forEach((g) => {
      const row = el('div', { class: 'gen-item' + (g.id === state.s4.structure ? ' current' : '') });
      row.innerHTML = '<span class="tag">' + esc(label(RC.structures, g.id)) + '</span><span class="gen-text">' + esc(g.text) + '</span>';
      const bar = el('div', { class: 'btn-row' });
      const use = el('button', { type: 'button', class: 'btn btn-primary btn-sm' }, esc(UI.gen.use));
      use.addEventListener('click', () => { state.s4.initial = g.text; $('#s4-initial').value = g.text; clearFieldError($('#s4-initial')); onChange(); toast(UI.titleUsed); $('#s4-initial').focus(); });
      const sv = el('button', { type: 'button', class: 'btn btn-ghost btn-sm' }, esc(UI.gen.save));
      sv.addEventListener('click', () => addAlt(g.text));
      bar.appendChild(use); bar.appendChild(sv);
      row.appendChild(bar);
      box.appendChild(row);
    });
  }
  function addAlt(text) {
    if (!filled(text)) return;
    if (state.s4.alts.some((a) => sameText(a, text))) { toast(UI.altExists); return; }
    if (state.s4.alts.length >= MAX_ALTS) { toast(UI.maxAlts); return; }
    state.s4.alts.push(text.trim()); onChange(); toast(UI.altSaved);
  }
  function renderAlts() {
    const box = $('#alt-list'); if (!box) return;
    const sig = state.s4.alts.join('|');
    if (box.dataset.sig === sig) return;
    box.dataset.sig = sig; box.innerHTML = '';
    $('#alt-empty').hidden = state.s4.alts.length > 0;
    state.s4.alts.forEach((a, i) => {
      const li = el('li', { class: 'alt-item' });
      li.appendChild(el('span', null, esc(a)));
      const rm = el('button', { type: 'button', class: 'btn btn-ghost btn-sm', 'aria-label': UI.remove + ': ' + a }, esc(UI.remove));
      rm.addEventListener('click', () => { state.s4.alts.splice(i, 1); onChange(); });
      li.appendChild(rm);
      box.appendChild(li);
    });
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

  /* Step 7 — compare alternative titles */
  function prefillCompare() {
    if (state.s7.cmp.some(filled)) return;
    const pool = [state.s4.initial, state.s5.refined].concat(state.s4.alts).filter(filled);
    const uniq = [];
    pool.forEach((p) => { if (!uniq.some((u) => sameText(u, p))) uniq.push(p); });
    state.s7.cmp = [0, 1, 2].map((i) => uniq[i] || '');
    fillInputs();
  }
  function renderAltCompare() {
    const box = $('#alt-compare'); if (!box) return;
    const c = ctx(), AL = UI.alt;
    const titles = state.s7.cmp.map((t, i) => ({ t, i })).filter((x) => filled(x.t));
    if (titles.length < 2) { box.innerHTML = '<p class="hint">' + esc(UI.needCompare) + '</p>'; return; }

    box.innerHTML = titles.map((x, k) => {
      const res = A.analyze(x.t, c), i = res.issues;
      const struct = i.question ? AL.question : (i._colon ? AL.compound : AL.single);
      const distinct = A.uniqueWords(x.t, titles.filter((y, j) => j !== k).map((y) => y.t));
      const strengths = res.dims.filter((d) => d.status === 'ok').map((d) => d.title);
      const weak = res.dims.filter((d) => d.status === 'warn' || d.status === 'bad');
      const terms = [];
      if (i._methodHits.length) terms.push(AL.methodTerms + i._methodHits.join(RC.lang === 'ar' ? '، ' : ', '));
      if (c.theory && A.overlap(x.t, c.theory) > 0) terms.push(AL.theoryTerms);
      const isSel = sameText(state.s7.selected, x.t);
      return '<article class="alt-card' + (isSel ? ' is-selected' : '') + '">' +
        '<div class="alt-head"><strong>' + esc(AL.label(AL.letters[x.i])) + '</strong><span class="small muted">' + esc(UI.words(i._wc)) + ' · ' + esc(AL.structure) + ': ' + esc(struct) + '</span></div>' +
        '<p class="alt-title">' + esc(x.t) + '</p>' +
        '<div class="dim-chips">' + res.dims.map((d) => '<span class="mini ' + (d.status === 'ok' ? 'ok' : (d.status === 'info' ? 'info' : 'warn')) + '" title="' + esc(d.msg) + '">' + icon(d.status) + ' ' + esc(d.title) + '</span>').join('') + '</div>' +
        '<h4>' + esc(AL.strengths) + '</h4><p class="small">' + esc(strengths.length ? strengths.join(RC.lang === 'ar' ? '، ' : ', ') : AL.none) + '</p>' +
        '<h4>' + esc(AL.weaknesses) + '</h4>' + (weak.length ? '<ul class="list small">' + weak.map((d) => '<li><strong>' + esc(d.title) + ':</strong> ' + esc(d.msg) + '</li>').join('') + '</ul>' : '<p class="small">' + esc(AL.none) + '</p>') +
        '<h4>' + esc(AL.distinct) + '</h4><p class="small">' + esc(distinct.length ? distinct.join(RC.lang === 'ar' ? '، ' : ', ') : AL.none) + '</p>' +
        '<h4>' + esc(AL.terms) + '</h4><p class="small">' + esc(terms.length ? terms.join(' · ') : AL.noTerms) + '</p>' +
        '<h4>' + esc(AL.suggestions) + '</h4>' + (weak.length ? '<ul class="list small">' + weak.filter((d) => d.rec).map((d) => '<li>' + esc(d.rec) + '</li>').join('') + '</ul>' : '<p class="small">' + esc(AL.none) + '</p>') +
        '<button type="button" class="btn ' + (isSel ? 'btn-primary' : 'btn-ghost') + ' btn-sm" data-select="' + x.i + '">' + esc(AL.select) + '</button>' +
        '</article>';
    }).join('');
    $$('[data-select]', box).forEach((b) => b.addEventListener('click', () => {
      const t = state.s7.cmp[Number(b.dataset.select)];
      state.s7.selected = t; $('#s7-selected').value = t; clearFieldError($('#s7-selected')); onChange(); toast(UI.selected); $('#s7-selected').focus();
    }));
  }

  /* Tool A — quality checklist */
  function renderChecklistDetect() {
    const ta = $('#check-t'); if (!ta) return;
    const t = state.tools.checkT;
    const d = filled(t) ? A.detect(t, ctx()) : null;
    RC.checklist.forEach((c) => {
      const n = $('[data-detect="' + c.id + '"]'); if (!n) return;
      if (!c.detect) { n.textContent = UI.manual; n.className = 'detect manual'; return; }
      if (!d) { n.textContent = ''; n.className = 'detect'; return; }
      const hit = c.id === 'claims' ? (d.causal || d.evaluative) : (c.id === 'length' ? (d.tooLong || d.long) : !!d[c.detect]);
      n.textContent = hit ? '● ' + UI.detected : '✓ ' + UI.notDetected;
      n.className = 'detect' + (hit ? '' : ' clear');
    });
    const done = RC.checklist.filter((c) => state.tools.checks[c.id]).length;
    const sum = $('#check-summary'); if (sum) sum.textContent = num(done) + ' / ' + num(RC.checklist.length);
    const cm = $('#check-meta'); if (cm) cm.textContent = metaLine(t, ctx());
    $$('#checklist .chk').forEach((l) => l.classList.toggle('on', !!state.tools.checks[l.dataset.id]));
  }

  /* Tool B — initial vs refined comparison */
  function renderComparison() {
    const tb = $('#cmp-body'), ch = $('#cmp-changes'); if (!tb) return;
    const a = state.tools.cmpA, b = state.tools.cmpB, c = ctx();
    if (!filled(a) || !filled(b)) { tb.innerHTML = '<tr><td colspan="3">' + esc(UI.cmp.none) + '</td></tr>'; ch.innerHTML = ''; return; }
    const r = A.compare(a, b, c);
    const val = (d, id) => {
      switch (id) {
        case 'precise': return !d.vague && !d.abbrev;
        case 'lean': return !d.filler && !d.redundant;
        case 'neutral': return !d.promo && !d.evaluative && !(d.causal && c.approach !== 'quant');
        case 'reflects': return filled(c.phenomenon) || filled(c.focus) ? !d.notReflect : null;
        case 'context': return filled(c.context) || filled(c.material) ? !(d.noContext || d.noMaterial) : null;
        case 'discipline': return !d.noDiscipline;
        case 'length': return !d.tooLong && !d.tooShort;
        case 'method': return filled(c.approach) ? !d.methodMismatch : null;
      }
      return null;
    };
    const cell = (x) => x === null ? '<td>—</td>' : '<td><span class="' + (x ? 'yes' : 'no') + '">' + (x ? '✓ ' + esc(UI.yes) : '✗ ' + esc(UI.no)) + '</span></td>';
    tb.innerHTML = UI.cmpRows.map((row) => '<tr><td>' + esc(row.t) + '</td>' + cell(val(r.ia, row.id)) + cell(val(r.ib, row.id)) + '</tr>').join('') +
      '<tr><td>' + esc(UI.cmp.words) + '</td><td>' + num(r.wcA) + '</td><td>' + num(r.wcB) + '</td></tr>';
    const typeLabel = { resolved: UI.cmp.resolved, introduced: UI.cmp.introduced, remaining: UI.cmp.remaining };
    const cls = { resolved: 'ok', introduced: 'bad', remaining: 'warn' };
    let html = r.rows.map((x) => '<div class="diag-item st-' + cls[x.type] + '"><span class="ic" aria-hidden="true">' + ({ resolved: '✓', introduced: '×', remaining: '!' }[x.type]) + '</span><span class="t">' + esc(x.label) + '<span class="status-label">' + esc(typeLabel[x.type]) + '</span></span><span class="d">' + esc(x.why) + '</span></div>').join('');
    const sep = RC.lang === 'ar' ? '، ' : ', ';
    if (r.added.length) html += '<p class="small"><strong>' + esc(UI.cmp.added) + ':</strong> ' + esc(r.added.slice(0, 10).join(sep)) + '</p>';
    if (r.removed.length) html += '<p class="small"><strong>' + esc(UI.cmp.removed) + ':</strong> ' + esc(r.removed.slice(0, 10).join(sep)) + '</p>';
    ch.innerHTML = html || '<p class="small">—</p>';
  }

  /* Tool C — alignment matrix */
  function renderMatrix() {
    const grid = $('#matrix-grid'), links = $('#matrix-links'); if (!grid) return;
    const M = UI.matrix, s1 = state.s1, s2 = state.s2, s3 = state.s3, lab = labels();
    const t = mainT();
    const methodText = [lab.approach, lab.method, s3.methodNote].filter(filled).join(' · ');
    const cells = [['title', t], ['problem', s2.problem], ['aim', s2.focus ? RC.tpl.focus(s2, lab) : ''], ['questions', s2.questions], ['theory', s3.theory], ['method', methodText]];
    grid.innerHTML = cells.map((c) => '<div class="m-cell' + (filled(c[1]) ? ' filled' : '') + (c[0] === 'title' ? ' m-title' : '') + '"><span class="k">' + esc(M[c[0]]) + '<span aria-hidden="true">' + (filled(c[1]) ? '●' : '○') + '</span></span><span class="v' + (filled(c[1]) ? '' : ' empty') + '" style="white-space:pre-line">' + esc(filled(c[1]) ? c[1] : UI.empty) + '</span></div>').join('');

    const L = UI.linkMsg, c = ctx();
    const item = (title, status, msg) => '<div class="diag-item st-' + status + '"><span class="ic" aria-hidden="true">' + icon(status) + '</span><span class="t">' + esc(title) + '<span class="status-label">' + esc(UI.status[status]) + '</span></span><span class="d">' + esc(msg) + '</span></div>';
    const pair = (a, b, key) => {
      if (!filled(a) || !filled(b)) return item(UI.links[key], 'info', L.missing);
      const ok = A.overlap(a, b) > 0;
      return item(UI.links[key], ok ? 'ok' : 'warn', L[key][ok ? 0 : 1]);
    };
    let html = pair(t, s2.problem + ' ' + s1.phenomenon, 'titleProblem');
    html += pair(t, [s2.focus, s2.concepts].join(' '), 'titleAim');
    html += pair(t, s2.questions, 'titleQuestions');
    if (!filled(t)) html += item(UI.links.titleTheory, 'info', L.missing);
    else if (!filled(s3.theory) || !s3.theoryMention || s3.theoryMention === 'unsure') html += item(UI.links.titleTheory, 'info', L.titleTheory[3]);
    else if (s3.theoryMention === 'no') html += item(UI.links.titleTheory, 'info', L.titleTheory[2]);
    else { const ok = A.overlap(t, s3.theory) > 0; html += item(UI.links.titleTheory, ok ? 'ok' : 'warn', L.titleTheory[ok ? 0 : 1]); }
    if (!filled(t) || !s1.approach) html += item(UI.links.titleMethod, 'info', L.missing);
    else { const d = A.detect(t, c); const bad = d.methodMismatch || d.methodMissing || d.methodNotWanted || (d.causal && s1.approach === 'qual'); html += item(UI.links.titleMethod, bad ? 'warn' : 'ok', L.titleMethod[bad ? 1 : 0]); }
    html += pair(s2.problem, [s2.focus, s2.concepts, s1.phenomenon].join(' '), 'problemAim');
    links.innerHTML = html;
  }

  /* ---------------- Report ---------------- */
  function buildReportHTML() {
    const R = UI.report, s1 = state.s1, s2 = state.s2, s3 = state.s3, s4 = state.s4, lab = labels();
    const t = mainT(), c = ctx();
    const p = (x) => '<p>' + esc(filled(x) ? x : UI.empty) + '</p>';
    const li = (k, x) => filled(x) ? '<li><strong>' + esc(k) + ':</strong> ' + esc(x) + '</li>' : '';
    const sc = state.s6.scores;
    const rated = RC.rubric.filter((cr) => sc[cr.id]);
    const mean = rated.length ? (rated.reduce((a, cr) => a + sc[cr.id], 0) / rated.length) : 0;
    const lvl = UI.levels.find((l) => mean >= l.min) || UI.levels[UI.levels.length - 1];
    const res = A.analyze(t, c);
    const recs = [];
    RC.rubric.forEach((cr) => { if (sc[cr.id] && sc[cr.id] <= 3) recs.push(cr.t + ': ' + RC.rubricRec[cr.id]); });
    res.dims.forEach((d) => { if ((d.status === 'warn' || d.status === 'bad') && d.rec) recs.push(d.title + ': ' + d.rec); });
    const date = new Date().toLocaleDateString(RC.lang === 'ar' ? 'ar-SA' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
    const mention = (x) => label(RC.decisions, x) || UI.empty;
    const alts = [];
    s4.alts.concat(state.s7.cmp).concat([s4.initial, state.s5.refined]).filter(filled).forEach((a) => {
      if (!sameText(a, t) && !alts.some((x) => sameText(x, a))) alts.push(a);
    });

    let h = '<h2>' + esc(R.title) + '</h2><p class="meta">' + esc(R.generated(date)) + '</p>';
    h += '<h3>' + esc(R.topic) + '</h3>' + p(s1.topic) + '<ul>' + li(R.subfield, lab.subfield) + li(R.context, s1.context) + li(R.timeframe, s1.timeframe) + li(R.material, s1.material) + '</ul><p>' + esc(RC.tpl.topic(s1, lab)) + '</p>';
    h += '<h3>' + esc(R.focus) + '</h3>' + p(RC.tpl.focus(s2, lab));
    h += '<h3>' + esc(R.problem) + '</h3>' + p(s2.problem) + (filled(s2.questions) ? '<p><strong>' + esc(R.questions) + ':</strong> ' + esc(s2.questions) + '</p>' : '');
    h += '<h3>' + esc(R.method) + '</h3><ul>' + li(R.approach, lab.approach) + li(R.design, [lab.method, s3.methodNote].filter(filled).join(' — ')) + li(R.mention, mention(s3.methodMention)) + '</ul>';
    h += '<h3>' + esc(R.theory) + '</h3>' + p(s3.theory) + (filled(s3.theory) ? '<p><strong>' + esc(R.mention) + ':</strong> ' + esc(mention(s3.theoryMention)) + '</p>' : '');
    h += '<h3>' + esc(R.initial) + '</h3>' + p(s4.initial) + (s4.keywords.length ? '<p><strong>' + esc(R.keywords) + ':</strong> ' + esc(s4.keywords.join(RC.lang === 'ar' ? '، ' : ', ')) + '</p>' : '');
    h += '<h3>' + esc(R.alternatives) + '</h3>' + (alts.length ? '<ol>' + alts.map((a) => '<li>' + esc(a) + '</li>').join('') + '</ol>' : p(''));
    h += '<h3>' + esc(R.selected) + '</h3><p><strong>' + esc(filled(t) ? t : UI.empty) + '</strong></p>';
    h += '<h3>' + esc(R.evaluation) + '</h3>' + (rated.length ?
      '<ul>' + RC.rubric.map((cr) => '<li>' + esc(cr.t) + ': ' + (sc[cr.id] ? RC.numerals[sc[cr.id] - 1] + ' ' + esc(UI.outOf5) : esc(UI.notRated)) + '</li>').join('') + '</ul><p><strong>' + esc(UI.overall) + ':</strong> ' + esc(RC.lang === 'ar' ? num(mean.toFixed(1)).replace('.', '٫') : mean.toFixed(1)) + ' ' + esc(UI.outOf5) + ' — ' + esc(lvl.t) + '</p>' : p(UI.notRated));
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

  /* ---------------- Wire up controls ---------------- */
  function wire() {
    $('#btn-next').addEventListener('click', () => { if (validateStep(state.step, true)) goTo(state.step + 1, true); });
    $('#btn-prev').addEventListener('click', () => goTo(state.step - 1, true));

    $('#btn-save-initial').addEventListener('click', () => addAlt(state.s4.initial));
    $('#btn-use-clean').addEventListener('click', () => {
      state.s5.refined = RC.tpl.clean(state.s4.initial); $('#s5-refined').value = state.s5.refined; clearFieldError($('#s5-refined')); onChange(); toast(UI.revisionUsed); $('#s5-refined').focus();
    });
    $('#btn-use-tpl').addEventListener('click', () => {
      state.s5.refined = $('#sug-tpl').textContent; $('#s5-refined').value = state.s5.refined; clearFieldError($('#s5-refined')); onChange(); toast(UI.revisionUsed); $('#s5-refined').focus();
    });
    $('#btn-save-refined').addEventListener('click', () => addAlt(state.s5.refined));
    $('#btn-apply-scores').addEventListener('click', () => {
      const t = mainT(), res = A.analyze(t, ctx());
      state.s6.scores = A.suggestScores(res, ctx(), t);
      fillInputs(); onChange(); toast(UI.scoresApplied);
    });
    $('#btn-cmp-prefill').addEventListener('click', () => {
      state.s7.cmp = ['', '', '']; prefillCompare(); onChange(); toast(UI.loaded);
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
      const t = mainT(); if (!filled(t)) { toast(UI.nothingToLoad); return; }
      state.tools.checkT = t; fillInputs(); onChange(); toast(UI.loaded);
    });
    $('#btn-cmp-load').addEventListener('click', () => {
      if (!filled(state.s4.initial)) { toast(UI.nothingToLoad); return; }
      state.tools.cmpA = state.s4.initial; state.tools.cmpB = filled(state.s7.selected) ? state.s7.selected : (state.s5.refined || '');
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
      download(UI.fileData, [JSON.stringify(state, null, 2)], 'application/json');
    }));
    const fileIn = $('#file-import');
    if (fileIn) fileIn.addEventListener('change', () => {
      const f = fileIn.files[0]; if (!f) return;
      const rd = new FileReader();
      rd.onload = () => {
        try {
          const data = JSON.parse(rd.result);
          if (!data || data.v !== 1 || !data.s1 || !data.s4) throw new Error('bad');
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
    renderStatic();
    bindInputs();
    fillInputs();
    wire();
    goTo(state.step || 0, false);
    updateSaveStatus();
    if (had && (state.s1.topic || state.s4.initial)) toast(UI.restored);
  });
})();
