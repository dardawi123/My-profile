/* =========================================================
   Research Methodology Formulation and Refinement — application logic
   صياغة منهجية البحث وتنقيحها — منطق التطبيق

   Language-neutral. All wording comes from window.RC (rmethods-ar.js or
   rmethods-en.js); rules come from window.RME (engine.js); shared data
   from glossary.js and references.js. Progress is stored in this
   browser's localStorage only. Nothing is sent to a server.
   Academic tool developed by Dr. Merfat Alardawi | د. مرفت العرضاوي
   ========================================================= */
(function () {
  'use strict';

  const RC = window.RC, E = window.RME;
  if (!RC || !E) { console.error('RMF: required scripts are missing.'); return; }
  const UI = RC.ui;
  const STORE_KEY = 'rmf.data.v1';
  const LANG_KEY = 'rmf.lang';
  const STEPS = 10;

  /* ---------------- State ---------------- */
  function defaults() {
    return {
      v: 1, step: 0, maxStep: 0, savedAt: null,
      s1: { title: '', scope: '', problem: '', mainQ: '', subQs: '', objectives: '', theory: '' },
      s2: { approach: '', just: '' },
      s3: { paradigm: '', note: '' },
      s4: { design: '', rationale: '', showAll: false },
      s5: { units: [], strategies: [], include: '', exclude: '', size: '', procedure: '', access: '', rationale: '' },
      s6: { methods: [], instruments: '', procedure: '' },
      s7: { methods: [], dims: [], procedure: '', software: '' },
      s8: { ethics: [], quality: [], notes: '' },
      s9: { limits: '', draft: '', edited: false },
      s10: { scores: {} },
      report: { html: '', edited: false },
      tools: { sel: {} }
    };
  }
  function merge(base, src) {
    if (!src || typeof src !== 'object') return base;
    Object.keys(base).forEach((k) => {
      if (!(k in src)) return;
      const b = base[k], s = src[k];
      if (Array.isArray(b)) { if (Array.isArray(s)) base[k] = s.filter((x) => typeof x === 'string').slice(0, 40); }
      else if (b && typeof b === 'object') {
        if (k === 'scores' || k === 'sel') { if (s && typeof s === 'object') Object.keys(s).forEach((x) => { if (typeof s[x] === 'number' || typeof s[x] === 'string') b[x] = s[x]; }); }
        else base[k] = merge(b, s);
      }
      else if (typeof s === typeof b || b === null) base[k] = s;
    });
    return base;
  }
  let state = defaults();

  /* ---------------- Helpers ---------------- */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  /* In Arabic text, Latin citations such as (Yin, 2018) are wrapped in Unicode
     isolates so that their brackets and punctuation display in the right order. */
  const isolate = (s) => RC.lang === 'ar' ? s.replace(/\(([A-Za-z\u00C0-\u017F][^()]*?\d{4}[a-z]?)\)/g, '\u2068($1)\u2069') : s;
  const esc = (s) => isolate(String(s == null ? '' : s)).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const getPath = (o, p) => p.split('.').reduce((a, k) => (a == null ? a : a[k]), o);
  const setPath = (o, p, v) => { const ks = p.split('.'); const last = ks.pop(); ks.reduce((a, k) => a[k], o)[last] = v; };
  const filled = (x) => !!(x && String(x).trim());
  const num = (n) => RC.lang === 'ar' ? String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]) : String(n);
  const fmt1 = (n) => RC.lang === 'ar' ? num(n.toFixed(1)).replace('.', '٫') : n.toFixed(1);
  const icon = (st) => ({ ok: '✓', warn: '!', bad: '×', info: 'i' }[st]);
  const linkify = (s) => esc(s).replace(/(https?:\/\/[^\s<]+[^\s<.,;)])/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
  const sepL = RC.lang === 'ar' ? '، ' : ', ';
  const idOf = (path) => 'f-' + path.replace('.', '-');

  function toast(msg) {
    const t = $('#toast'); if (!t) return;
    t.textContent = msg; t.hidden = false;
    clearTimeout(toast._t); toast._t = setTimeout(() => { t.hidden = true; }, 3400);
  }

  /* ---------------- Persistence ---------------- */
  let saveTimer = null, suppressSave = false;
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
    try { const raw = localStorage.getItem(STORE_KEY); if (!raw) return false; state = merge(defaults(), JSON.parse(raw)); return true; }
    catch (e) { return false; }
  }
  function updateSaveStatus() {
    const n = $('#save-status'); if (!n) return;
    if (!state.savedAt) { n.textContent = UI.notSaved; return; }
    n.textContent = UI.savedAt(new Date(state.savedAt).toLocaleTimeString(RC.lang === 'ar' ? 'ar-SA' : 'en-GB', { hour: '2-digit', minute: '2-digit' }));
  }

  /* ---------------- Builder markup ---------------- */
  function F(path, type, o) {
    o = o || {};
    const f = RC.f[path] || {}, id = idOf(path);
    const req = o.req ? ' data-required="1"' + (o.min ? ' data-minwords="' + o.min + '"' : '') : '';
    const hintId = f.hint ? id + '-hint' : '';
    const ctl = type === 'textarea'
      ? '<textarea id="' + id + '" class="inp" data-bind="' + path + '"' + req + (f.ph ? ' placeholder="' + esc(f.ph) + '"' : '') + (hintId ? ' aria-describedby="' + hintId + '"' : '') + '></textarea>'
      : '<input id="' + id + '" class="inp" data-bind="' + path + '"' + req + (f.ph ? ' placeholder="' + esc(f.ph) + '"' : '') + (hintId ? ' aria-describedby="' + hintId + '"' : '') + '>';
    return '<div class="field"><label for="' + id + '">' + esc(f.label) + (o.req ? '<span class="req" aria-hidden="true">*</span>' : '') + '</label>' + ctl +
      (f.hint ? '<span class="hint" id="' + hintId + '">' + esc(f.hint) + '</span>' : '') + '<span class="step-meta" data-wc="' + path + '"></span><span class="err" aria-live="polite"></span></div>';
  }
  const G2 = (a, b) => '<div class="grid g-2">' + a + b + '</div>';
  function PICK(path, items, extra) {
    const f = RC.f[path] || {}, gid = idOf(path);
    return '<div class="field choice-group" data-required-pick="' + path + '"><span class="label" id="' + gid + '-l">' + esc(f.label) + '<span class="req" aria-hidden="true">*</span></span>' +
      '<div class="grid g-240" role="group" aria-labelledby="' + gid + '-l">' +
      items.map((it) => '<button type="button" class="choice" data-pick="' + path + '" data-id="' + it.id + '" aria-pressed="false"><strong>' + esc(it.t) + '</strong>' + (extra ? extra(it) : '<span>' + esc(it.d) + '</span>') + '<span class="fit-note" data-fit="' + path + ':' + it.id + '"></span></button>').join('') +
      '</div><span class="err" aria-live="polite"></span></div>';
  }
  function MULTI(path, items, o) {
    o = o || {};
    const f = RC.f[path] || {}, gid = idOf(path);
    return '<fieldset class="multi"' + (o.req ? ' data-required-multi="' + path + '"' : '') + (o.wrap ? ' id="' + o.wrap + '"' : '') + '><legend>' + esc(f.label) + (o.req ? '<span class="req" aria-hidden="true">*</span>' : '') + '</legend>' +
      (f.hint ? '<span class="hint">' + esc(f.hint) + '</span>' : '') +
      '<div class="checklist ' + (o.cols || 'cols-2') + '">' + items.map((it) => '<label class="chk" data-chk="' + path + ':' + it.id + '"><input type="checkbox" data-multi="' + path + '" value="' + it.id + '"><span class="txt"><strong>' + esc(it.t) + '</strong>' + (it.d ? '<span>' + esc(it.d) + '</span>' : '') + (o.tags ? o.tags(it) : '') + '<span class="flag" data-flag="' + path + ':' + it.id + '"></span></span></label>').join('') +
      '</div><span class="err" aria-live="polite"></span></fieldset>';
  }
  const PANEL = (id, cls) => '<div class="' + (cls || 'panel') + '" id="' + id + '" aria-live="polite"></div>';
  const OUT = (i) => '<div class="output-box"><span class="k">' + esc(RC.stepText[i].out) + '</span><span class="v" id="out-' + i + '" style="white-space:pre-line"></span></div>';
  const tagHTML = (t, cls) => '<span class="tag ' + (cls || '') + '">' + esc(t) + '</span>';

  function stepBody(i) {
    const fam = { qual: RC.approaches[0].t, quant: RC.approaches[1].t, mixed: RC.approaches[2].t };
    switch (i) {
      case 0: return G2(F('s1.title', 'text', { req: 1 }), F('s1.scope', 'text')) + F('s1.problem', 'textarea', { req: 1, min: 12 }) +
        G2(F('s1.mainQ', 'textarea', { req: 1, min: 5 }), F('s1.subQs', 'textarea')) + G2(F('s1.objectives', 'textarea', { req: 1, min: 4 }), F('s1.theory', 'textarea'));
      case 1: return PANEL('rec-panel', 'rec-panel') + PICK('s2.approach', RC.approaches, (a) => '<span>' + esc(a.d) + '</span><span class="ex"><b>' + esc(UI.strengths) + ':</b> ' + esc(a.strengths) + '</span><span class="ex"><b>' + esc(UI.limits) + ':</b> ' + esc(a.limits) + '</span>') + F('s2.just', 'textarea', { req: 1, min: 15 });
      case 2: return PICK('s3.paradigm', RC.paradigms, (p) => '<span>' + esc(p.d) + '</span><span class="ex">' + esc(p.use) + '</span>') + F('s3.note', 'textarea');
      case 3: return '<div class="btn-row"><button type="button" class="btn btn-ghost btn-sm" id="btn-show-designs" aria-pressed="false"></button></div>' +
        PICK('s4.design', RC.designs, (d) => tagHTML(fam[d.family]) + '<span>' + esc(d.d) + '</span><span class="ex"><b>' + esc(UI.example) + ':</b> ' + esc(d.ex) + '</span>') + F('s4.rationale', 'textarea', { req: 1, min: 15 });
      case 4: return MULTI('s5.units', RC.units, { req: 1, cols: 'cols-2' }) + MULTI('s5.strategies', RC.sampling, { req: 1 }) +
        G2(F('s5.include', 'textarea', { req: 1 }), F('s5.exclude', 'textarea')) + G2(F('s5.size', 'text', { req: 1 }), F('s5.procedure', 'text', { req: 1 })) +
        G2(F('s5.rationale', 'textarea', { req: 1, min: 10 }), F('s5.access', 'textarea')) + PANEL('adequacy-panel', 'explain');
      case 5: return '<p class="hint">' + esc(RC.guide.collectNote) + '</p>' + MULTI('s6.methods', RC.collection, { req: 1, tags: (c) => tagHTML(c.kind === 'existing' ? UI.kindExisting : UI.kindGenerated, c.kind === 'existing' ? 'tag-gold' : '') }) +
        PANEL('collect-summary', 'step-meta') + F('s6.instruments', 'textarea') + F('s6.procedure', 'textarea', { req: 1, min: 10 });
      case 6: return MULTI('s7.methods', RC.analysis, { req: 1 }) + MULTI('s7.dims', RC.filmDims, { wrap: 'dims-wrap', cols: 'cols-2' }) +
        '<p class="hint">' + esc(RC.guide.filmNote) + '</p>' + F('s7.procedure', 'textarea', { req: 1, min: 10 }) + F('s7.software', 'text');
      case 7: return MULTI('s8.ethics', RC.ethics, { req: 1 }) + MULTI('s8.quality', RC.quality, { req: 1 }) + F('s8.notes', 'textarea');
      case 8: return F('s9.limits', 'textarea', { req: 1, min: 8 }) +
        '<div class="draft-wrap"><div class="report-tools"><h4 class="h4">' + esc(UI.draftTitle) + '</h4><span class="spacer"></span>' +
        '<button type="button" class="btn btn-ghost btn-sm" id="btn-regen-draft">' + esc(UI.regen) + '</button>' +
        '<button type="button" class="btn btn-ghost btn-sm" id="btn-copy-draft">' + esc(UI.copyDraft) + '</button></div>' +
        '<div class="report draft" id="draft" contenteditable="true" role="textbox" aria-multiline="true" aria-label="' + esc(UI.draftTitle) + '" spellcheck="true"></div></div>' +
        '<div class="refine-box"><h4 class="h4">' + esc(UI.refineTitle) + '</h4><div class="diag" id="refine-list"></div></div>';
      case 9: return '<div class="eval-layout"><div><div class="rubric" id="rubric"></div><div class="btn-row"><button type="button" class="btn btn-ghost btn-sm" id="btn-apply-scores">' + esc(UI.applyScores) + '</button></div></div>' +
        '<div class="result-panel" id="rubric-result" aria-live="polite"></div></div><p class="disclaimer">' + esc(UI.evalDisclaimer) + '</p>' +
        '<div class="report-tools"><button type="button" class="btn btn-ghost btn-sm" id="btn-regen-report">' + esc(UI.reportRegen) + '</button>' +
        '<button type="button" class="btn btn-ghost btn-sm" id="btn-copy-report">' + esc(UI.reportCopy) + '</button>' +
        '<button type="button" class="btn btn-ghost btn-sm" id="btn-print">' + esc(UI.print) + '</button>' +
        '<button type="button" class="btn btn-primary btn-sm" id="btn-doc">' + esc(UI.doc) + '</button>' +
        '<button type="button" class="btn btn-ghost btn-sm" id="btn-txt">' + esc(UI.txt) + '</button></div>' +
        '<div class="report" id="report" contenteditable="true" role="textbox" aria-multiline="true" aria-label="' + esc(UI.report.title) + '" spellcheck="true"></div>';
    }
    return '';
  }
  function renderBuilder() {
    const body = $('#steps'); if (!body) return;
    body.innerHTML = RC.stepText.map((s, i) =>
      '<div class="step" data-step="' + i + '"' + (i ? ' hidden' : '') + '>' +
      '<div class="step-head"><h3>' + esc(s.h) + '</h3><p>' + esc(s.p) + '</p></div>' +
      '<div class="explain"><strong>' + esc(s.whyH) + '</strong><span>' + esc(s.why) + '</span></div>' +
      (s.ex ? '<div class="example-box"><b>' + (RC.lang === 'ar' ? 'مثال: ' : 'Example: ') + '</b>' + esc(s.ex) + '</div>' : '') +
      stepBody(i) + (i < 8 ? OUT(i) : '') + '</div>').join('');
    // Rubric rows
    const rb = $('#rubric');
    RC.rubric.forEach((c) => {
      const fs = document.createElement('fieldset'); fs.className = 'rubric-row';
      fs.innerHTML = '<legend>' + esc(c.t) + '</legend><span class="desc">' + esc(c.d) + '</span><span class="suggest" data-suggest="' + c.id + '"></span><div class="scale">' +
        [1, 2, 3, 4, 5].map((n) => '<label><input type="radio" name="rub-' + c.id + '" value="' + n + '" data-rub="' + c.id + '" aria-label="' + esc(c.t) + ': ' + RC.numerals[n - 1] + '"><span aria-hidden="true">' + RC.numerals[n - 1] + '</span></label>').join('') + '</div>';
      rb.appendChild(fs);
    });
  }

  /* ---------------- Binding (event delegation) ---------------- */
  function bind() {
    const root = document;
    root.addEventListener('input', (e) => {
      const t = e.target;
      if (t.matches('[data-bind]')) { setPath(state, t.dataset.bind, t.value); if (t.getAttribute('aria-invalid') === 'true' && filled(t.value)) clearErr(t); onChange(); }
    });
    root.addEventListener('change', (e) => {
      const t = e.target;
      if (t.matches('input[data-multi]')) {
        const arr = getPath(state, t.dataset.multi), i = arr.indexOf(t.value);
        if (t.checked && i === -1) arr.push(t.value); else if (!t.checked && i !== -1) arr.splice(i, 1);
        clearErr(t); onChange();
      } else if (t.matches('input[data-rub]')) { state.s10.scores[t.dataset.rub] = Number(t.value); onChange(); }
      else if (t.matches('input[data-sel]')) { state.tools.sel[t.dataset.sel] = t.value; onChange(); }
    });
    root.addEventListener('click', (e) => {
      const b = e.target.closest('[data-pick]');
      if (b) { setPath(state, b.dataset.pick, b.dataset.id); clearErr(b); onChange(); }
    });
  }
  function fillInputs() {
    $$('[data-bind]').forEach((inp) => { const v = getPath(state, inp.dataset.bind); inp.value = v == null ? '' : v; });
    $$('input[data-multi]').forEach((i) => { i.checked = getPath(state, i.dataset.multi).indexOf(i.value) !== -1; });
    $$('input[data-rub]').forEach((i) => { i.checked = state.s10.scores[i.dataset.rub] === Number(i.value); });
    $$('input[data-sel]').forEach((i) => { i.checked = state.tools.sel[i.dataset.sel] === i.value; });
  }

  /* ---------------- Validation ---------------- */
  function fieldOf(node) { return node.closest('.field, fieldset, .choice-group') || node.parentElement; }
  function setErr(node, msg) {
    const f = fieldOf(node), inp = f.querySelector('.inp');
    if (inp) inp.setAttribute('aria-invalid', 'true');
    const err = f.querySelector('.err'); if (err) err.textContent = msg;
  }
  function clearErr(node) {
    const f = fieldOf(node); if (!f) return;
    const inp = f.querySelector('.inp'); if (inp) inp.removeAttribute('aria-invalid');
    const err = f.querySelector('.err'); if (err) err.textContent = '';
  }
  function validateStep(i, show) {
    const stepEl = $('.step[data-step="' + i + '"]'); if (!stepEl) return true;
    let ok = true, first = null;
    const fail = (node, msg) => { ok = false; if (show) { setErr(node, msg); if (!first) first = node; } };
    $$('[data-required]', stepEl).forEach((inp) => {
      const v = getPath(state, inp.dataset.bind), min = Number(inp.dataset.minwords || 0);
      if (!filled(v)) fail(inp, UI.required);
      else if (min && E.wc(v) < min) fail(inp, UI.tooShort(num(min)));
      else if (show) clearErr(inp);
    });
    $$('[data-required-pick]', stepEl).forEach((g) => { if (!getPath(state, g.dataset.requiredPick)) fail(g, UI.chooseOne); });
    $$('[data-required-multi]', stepEl).forEach((g) => { if (!getPath(state, g.dataset.requiredMulti).length) fail(g, UI.chooseOne); });
    if (show) {
      $('#form-alert').hidden = ok;
      if (!ok) { $('#form-alert').textContent = UI.fixErrors; const f = first.matches('.inp') ? first : (first.querySelector('input, button, textarea') || first); f.focus(); }
    }
    return ok;
  }

  /* ---------------- Wizard navigation ---------------- */
  function goTo(i, focus) {
    i = Math.max(0, Math.min(STEPS - 1, i));
    state.step = i; state.maxStep = Math.max(state.maxStep, i);
    $$('.step').forEach((s) => { s.hidden = Number(s.dataset.step) !== i; });
    $('#form-alert').hidden = true;
    $('#btn-prev').hidden = i === 0;
    $('#btn-next').hidden = i === STEPS - 1;
    $('#btn-next').textContent = i === STEPS - 2 ? UI.finish : UI.next;
    renderStepper();
    if (i === 8) renderDraft(false);
    if (i === 9) renderReport(false);
    refresh();
    if (focus) { const h = $('.step[data-step="' + i + '"] h3'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); $('#builder').scrollIntoView({ block: 'start' }); } }
    save();
  }
  function renderStepper() {
    const box = $('#stepper'); box.innerHTML = '';
    RC.steps.forEach((t, i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'stepdot';
      b.innerHTML = '<span class="num">' + RC.numerals[i] + '</span><span>' + esc(t) + '</span>';
      if (i === state.step) b.setAttribute('aria-current', 'step');
      b.addEventListener('click', () => {
        if (i > state.step) { for (let k = state.step; k < i; k++) { if (!validateStep(k, k === state.step)) { if (k !== state.step) goTo(k, true); return; } } }
        goTo(i, true);
      });
      box.appendChild(b);
    });
    stepperStatus();
    $('#progress-bar').style.width = ((state.step + 1) / STEPS * 100) + '%';
    $('#step-count').textContent = UI.stepOf(RC.numerals[state.step], RC.numerals[STEPS - 1]);
  }
  function stepperStatus() {
    $$('#stepper .stepdot').forEach((b, i) => {
      b.classList.toggle('done', i < state.step && validateStep(i, false));
      b.disabled = i > state.maxStep + 1 || (i === state.maxStep + 1 && !validateStep(state.maxStep, false));
    });
  }

  /* ---------------- Dynamic builder views ---------------- */
  function diagItem(title, status, msg) {
    return '<div class="diag-item st-' + status + '"><span class="ic" aria-hidden="true">' + icon(status) + '</span><span class="t">' + esc(title) +
      '<span class="status-label">' + esc(RC.statusLabel[status]) + '</span></span><span class="d">' + esc(msg) + '</span></div>';
  }
  function refresh() {
    const L = E.labels(state, RC), a = state.s2.approach;

    // word counts under long fields
    $$('[data-wc]').forEach((n) => { const v = getPath(state, n.dataset.wc); n.textContent = filled(v) ? UI.words(E.wc(v)) : ''; });

    // single-choice cards
    $$('[data-pick]').forEach((b) => b.setAttribute('aria-pressed', getPath(state, b.dataset.pick) === b.dataset.id ? 'true' : 'false'));

    // Step 2 suggestion
    const rec = L.rec, rp = $('#rec-panel');
    if (rp) {
      const cue = (arr) => arr.length ? arr.join(sepL) : UI.cues.none;
      rp.innerHTML = '<span class="k">' + esc(UI.suggestion) + '</span><strong class="rec-pick">' + esc(UI.suggestTitle[rec.pick]) + '</strong>' +
        (rec.pick !== 'unclear' ? ' <span class="tag">' + esc(UI.conf[rec.conf]) + '</span>' : '') +
        '<ul class="list small"><li><b>' + esc(UI.cues.qual) + ':</b> ' + esc(cue(rec.q)) + '</li><li><b>' + esc(UI.cues.quant) + ':</b> ' + esc(cue(rec.n)) + '</li><li><b>' + esc(UI.cues.mixed) + ':</b> ' + esc(cue(rec.m)) + '</li></ul>' +
        '<span class="small muted">' + esc(UI.suggestNote) + '</span>';
    }
    // Step 3 paradigm fit, Step 4 design fit and filter
    RC.paradigms.forEach((p) => { const n = $('[data-fit="s3.paradigm:' + p.id + '"]'); if (n) n.textContent = a && p.fit.indexOf(a) === -1 ? UI.fitBad : ''; });
    const showAll = !!state.s4.showAll;
    RC.designs.forEach((d) => {
      const fit = !a || d.fit.indexOf(a) !== -1;
      const n = $('[data-fit="s4.design:' + d.id + '"]'); if (n) n.textContent = fit ? '' : UI.fitBad;
      const b = $('[data-pick="s4.design"][data-id="' + d.id + '"]');
      if (b) { b.classList.toggle('misfit', !fit); b.hidden = !fit && !showAll && state.s4.design !== d.id; }
    });
    const sb = $('#btn-show-designs'); if (sb) { sb.textContent = showAll ? UI.showFit : UI.showAll; sb.setAttribute('aria-pressed', showAll ? 'true' : 'false'); sb.hidden = !a; }

    // multi-select visual state + flags
    $$('label.chk[data-chk]').forEach((l) => { const i = $('input', l); l.classList.toggle('on', i.checked); });
    const flag = (path, id, text, cls) => { const n = $('[data-flag="' + path + ':' + id + '"]'); if (n) { n.textContent = text; n.className = 'flag' + (cls ? ' ' + cls : ''); } };
    RC.sampling.forEach((s) => {
      let t = '', c = '';
      if (s.id === 'theoretical' && state.s4.design && state.s4.design !== 'grounded') { t = RC.chk.theoretical.warn; c = 'warn'; }
      else if (s.fam === 'quant' && a === 'qual') { t = UI.fitBad; c = 'warn'; }
      else if (s.fam === 'qual' && a === 'quant') { t = UI.fitBad; c = 'warn'; }
      flag('s5.strategies', s.id, t, c);
    });
    RC.collection.forEach((c) => flag('s6.methods', c.id, (c.fam === 'quant' && a === 'qual') ? UI.fitBad : '', 'warn'));
    RC.analysis.forEach((x) => {
      const bad = (x.fam === 'quant' && a === 'qual') || (x.fam === 'mixed' && a && a !== 'mixed');
      flag('s7.methods', x.id, bad ? UI.fitBad : '', 'warn');
    });
    const recE = E.recommendedEthics(state, RC), recQ = E.recommendedQuality(state);
    RC.ethics.forEach((x) => flag('s8.ethics', x.id, recE.indexOf(x.id) !== -1 ? '★ ' + UI.recommended : '', 'rec'));
    RC.quality.forEach((x) => {
      const fit = E.qualityFits(x, state);
      flag('s8.quality', x.id, !fit ? UI.fitBad : (recQ.indexOf(x.id) !== -1 ? '★ ' + UI.recommended : ''), !fit ? 'warn' : 'rec');
    });
    const dw = $('#dims-wrap'); if (dw) dw.hidden = !E.needsDims(state);

    // Step 5 adequacy & step 6 summary
    const ap = $('#adequacy-panel');
    if (ap) ap.innerHTML = RC.guide.adequacy.map((x) => '<strong>' + esc(x.h) + '</strong><span>' + esc(x.t) + '</span>').join('');
    const cs = $('#collect-summary');
    if (cs) {
      const ex = L.collection.filter((c) => c.kind === 'existing').length, ge = L.collection.filter((c) => c.kind === 'generated').length;
      cs.textContent = L.collection.length ? UI.collectSummary(num(ex), num(ge)) : '';
    }

    // Step outputs
    const T = RC.tpl;
    const outs = [() => T.overview(state, L), () => T.approachOut(state, L), () => T.paradigmOut(state, L), () => T.designOut(state, L),
      () => T.samplingOut(state, L), () => T.collectionOut(state, L), () => T.analysisOut(state, L), () => T.ethicsOut(state, L)];
    outs.forEach((fn, i) => { const n = $('#out-' + i); if (n) n.textContent = fn(); });

    // Step 9 draft (kept in sync while not edited) and refinement
    if (state.step === 8) { if (!state.s9.edited) renderDraft(false); renderRefine(); }

    // Step 10 rubric suggestions and result
    const sug = E.suggestScores(state, RC);
    RC.rubric.forEach((c) => { const n = $('[data-suggest="' + c.id + '"]'); if (n) n.textContent = UI.suggestedScore + ' ' + RC.numerals[sug[c.id] - 1]; });
    renderResult();

    // Tools outside the builder
    renderChecker(); renderMatrix(); renderSelector();
  }

  /* ---------------- Step 9: draft and refinement ---------------- */
  function draftHTML() {
    return RC.tpl.draft(state, E.labels(state, RC)).map((s) => '<h3>' + esc(s.h) + '</h3><p>' + esc(s.p) + '</p>').join('');
  }
  function renderDraft(force) {
    const d = $('#draft'); if (!d) return;
    if (force || !state.s9.edited || !filled(state.s9.draft)) { state.s9.draft = draftHTML(); state.s9.edited = false; }
    if (document.activeElement !== d) d.innerHTML = sanitize(state.s9.draft);
  }
  function draftSections(html) {
    const doc = new DOMParser().parseFromString('<div>' + html + '</div>', 'text/html');
    const out = []; let cur = null;
    Array.from(doc.body.firstChild.children).forEach((n) => {
      if (/^H[1-4]$/.test(n.tagName)) { cur = { h: n.textContent.trim(), p: '' }; out.push(cur); }
      else { if (!cur) { cur = { h: '', p: '' }; out.push(cur); } cur.p += ' ' + n.textContent; }
    });
    return out.map((s) => ({ h: s.h, p: s.p.trim() }));
  }
  function renderRefine() {
    const box = $('#refine-list'); if (!box) return;
    const msgs = E.refine(draftSections(state.s9.draft), RC);
    box.innerHTML = (state.s9.edited ? '<p class="small muted">' + esc(RC.refine.edited) + '</p>' : '') +
      msgs.map((m) => '<div class="diag-item st-' + m.status + '"><span class="ic" aria-hidden="true">' + icon(m.status) + '</span><span class="d">' + esc(m.msg) + '</span></div>').join('');
  }

  /* ---------------- Step 10: rubric result ---------------- */
  function scoreSummary() {
    const sc = state.s10.scores, rated = RC.rubric.filter((c) => sc[c.id]);
    const mean = rated.length ? rated.reduce((a, c) => a + sc[c.id], 0) / rated.length : 0;
    const lvl = RC.levels.find((l) => mean >= l.min) || RC.levels[RC.levels.length - 1];
    return { sc, rated, mean, lvl };
  }
  function renderResult() {
    const box = $('#rubric-result'); if (!box) return;
    const { sc, rated, mean, lvl } = scoreSummary();
    const recs = RC.rubric.filter((c) => sc[c.id] && sc[c.id] <= 3).map((c) => '<li><strong>' + esc(c.t) + ':</strong> ' + esc(RC.rubricRec[c.id]) + '</li>');
    box.innerHTML = '<span class="small" style="color:#BDB6A4">' + esc(UI.overall) + '</span>' +
      '<span class="big">' + (rated.length ? fmt1(mean) : '—') + ' <span style="font-size:22px">' + esc(UI.outOf5) + '</span></span>' +
      (rated.length ? '<span class="lvl">' + esc(lvl.t) + '</span><span class="small">' + esc(lvl.d) + '</span>' : '') +
      '<div class="bars">' + RC.rubric.map((c) => '<div class="bar-row"><span>' + esc(c.t) + '</span><span class="bar" aria-hidden="true"><span style="width:' + ((sc[c.id] || 0) * 20) + '%"></span></span><span>' + (sc[c.id] ? RC.numerals[sc[c.id] - 1] : '—') + '</span></div>').join('') + '</div>' +
      (rated.length ? '<div><strong style="color:var(--gold-light)">' + esc(UI.recommendations) + '</strong>' + (recs.length ? '<ul class="list small">' + recs.join('') + '</ul>' : '<p class="small">' + esc(UI.noRecs) + '</p>') + '</div>' : '<p class="small">' + esc(UI.notRated) + '</p>');
  }

  /* ---------------- Final report ---------------- */
  function buildReportHTML() {
    const R = UI.report, s1 = state.s1, L = E.labels(state, RC);
    const p = (x) => '<p>' + esc(filled(x) ? x : UI.empty) + '</p>';
    const li = (k, x) => filled(x) ? '<li><strong>' + esc(k) + ':</strong> ' + esc(x) + '</li>' : '';
    const lines = (x) => String(x || '').split('\n').map((y) => y.trim()).filter(Boolean);
    const ol = (arr) => arr.length ? '<ol>' + arr.map((y) => '<li>' + esc(y) + '</li>').join('') + '</ol>' : '';
    const { sc, rated, mean, lvl } = scoreSummary();
    const checks = E.checks(state, RC);
    const recs = [];
    RC.rubric.forEach((c) => { if (sc[c.id] && sc[c.id] <= 3) recs.push(c.t + ': ' + RC.rubricRec[c.id]); });
    checks.forEach((c) => { if (c.status === 'warn' || c.status === 'bad') recs.push(c.t + ': ' + c.msg); });
    const date = new Date().toLocaleDateString(RC.lang === 'ar' ? 'ar-SA' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
    const T = RC.tpl;
    let h = '<h2>' + esc(R.title) + '</h2><p class="meta">' + esc(R.generated(date)) + '</p>';
    h += '<h3>' + esc(R.titleProblem) + '</h3><p><strong>' + esc(filled(s1.title) ? s1.title : UI.empty) + '</strong></p>' + p(s1.problem) + (filled(s1.scope) ? '<p>' + esc(s1.scope) + '</p>' : '');
    h += '<h3>' + esc(R.qo) + '</h3><p><strong>' + esc(R.mainQ) + ':</strong> ' + esc(s1.mainQ || UI.empty) + '</p>' +
      (lines(s1.subQs).length ? '<p><strong>' + esc(R.subQs) + ':</strong></p>' + ol(lines(s1.subQs)) : '') +
      (lines(s1.objectives).length ? '<p><strong>' + esc(R.objectives) + ':</strong></p>' + ol(lines(s1.objectives)) : '') +
      (filled(s1.theory) ? '<p><strong>' + esc(R.theory) + ':</strong> ' + esc(s1.theory) + '</p>' : '');
    h += '<h3>' + esc(R.approach) + '</h3><ul>' + li(R.approach, T.approachOut(state, L)) + li(R.orientation, L.paradigm ? L.paradigm.t : '') + '</ul>';
    h += '<h3>' + esc(R.design) + '</h3>' + p(L.design ? T.designOut(state, L) : '');
    h += '<h3>' + esc(R.sampling) + '</h3>' + p(L.sampling.length ? T.samplingOut(state, L) + ' ' + [state.s5.include, state.s5.procedure].filter(filled).join(' — ') : '');
    h += '<h3>' + esc(R.collection) + '</h3>' + p(L.collection.length ? T.collectionOut(state, L) + ' ' + state.s6.procedure : '');
    h += '<h3>' + esc(R.analysis) + '</h3>' + p(L.analysis.length ? T.analysisOut(state, L) + ' ' + state.s7.procedure : '');
    h += '<h3>' + esc(R.ethics) + '</h3>' + p(L.ethics.map((x) => x.t).join(sepL));
    h += '<h3>' + esc(R.quality) + '</h3>' + p(L.quality.map((x) => x.t).join(sepL));
    h += '<h3>' + esc(R.draft) + '</h3>' + draftSections(filled(state.s9.draft) ? state.s9.draft : draftHTML()).map((s) => '<p><strong>' + esc(s.h) + '</strong> ' + esc(s.p) + '</p>').join('');
    h += '<h3>' + esc(R.evaluation) + '</h3>' + (rated.length
      ? '<ul>' + RC.rubric.map((c) => '<li>' + esc(c.t) + ': ' + (sc[c.id] ? RC.numerals[sc[c.id] - 1] + ' ' + esc(UI.outOf5) : esc(UI.notRated)) + '</li>').join('') + '</ul><p><strong>' + esc(UI.overall) + ':</strong> ' + esc(fmt1(mean)) + ' ' + esc(UI.outOf5) + ' — ' + esc(lvl.t) + '</p>'
      : p(UI.notRated));
    h += '<p><em>' + esc(UI.evalDisclaimer) + '</em></p>';
    h += '<h3>' + esc(R.recs) + '</h3>' + (recs.length ? '<ul>' + [...new Set(recs)].map((r) => '<li>' + esc(r) + '</li>').join('') + '</ul>' : '<p>' + esc(R.noRecs) + '</p>');
    return h;
  }
  function sanitize(html) {
    const doc = new DOMParser().parseFromString('<div>' + html + '</div>', 'text/html');
    const allowed = ['DIV', 'P', 'H2', 'H3', 'H4', 'UL', 'OL', 'LI', 'STRONG', 'B', 'EM', 'I', 'BR', 'SPAN', 'U'];
    const walk = (node) => Array.from(node.children).forEach((ch) => {
      if (allowed.indexOf(ch.tagName) === -1) { ch.replaceWith(document.createTextNode(ch.textContent)); return; }
      Array.from(ch.attributes).forEach((a) => { if (a.name !== 'class') ch.removeAttribute(a.name); });
      walk(ch);
    });
    walk(doc.body.firstChild);
    return doc.body.firstChild.innerHTML;
  }
  function renderReport(force) {
    const r = $('#report'); if (!r) return;
    if (force || !state.report.edited || !filled(state.report.html)) { state.report.html = buildReportHTML(); state.report.edited = false; }
    r.innerHTML = sanitize(state.report.html);
  }
  function download(name, parts, type) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(parts, { type })); a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise((resolve, reject) => {
      const ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy') ? resolve() : reject(); } catch (e) { reject(e); } finally { ta.remove(); }
    });
  }
  function confirmClick(btn, confirmLabel, action, needConfirm) {
    if (!btn) return;
    btn.addEventListener('click', () => {
      const original = btn.dataset.label || btn.textContent; btn.dataset.label = original;
      if (btn.dataset.armed === '1') { btn.dataset.armed = ''; btn.textContent = original; action(); return; }
      if (needConfirm && !needConfirm()) { action(); return; }
      btn.dataset.armed = '1'; btn.textContent = confirmLabel;
      setTimeout(() => { btn.dataset.armed = ''; btn.textContent = original; }, 4000);
    });
  }

  /* ---------------- Guide sections (static, from RC) ---------------- */
  function renderGuides() {
    const G = RC.guide;
    const lad = $('#ladder');
    if (lad) lad.innerHTML = G.ladder.map((x, i) => '<div class="chain-item"><span class="n">' + RC.numerals[i] + '</span><strong>' + esc(x.t) + '</strong><span>' + esc(x.d) + '</span><span class="ex">' + esc(x.ex) + '</span></div>').join('');
    const dist = $('#distinctions');
    if (dist) dist.innerHTML = G.distinctions.map((x) => '<article class="card"><h3>' + esc(x.t) + '</h3><p>' + esc(x.d) + '</p></article>').join('');
    const cmp = $('#compare-table');
    if (cmp) cmp.innerHTML = '<thead><tr><th scope="col"></th>' + RC.approaches.map((a) => '<th scope="col">' + esc(a.t) + '</th>').join('') + '</tr></thead><tbody>' +
      G.compareRows.map((r) => '<tr><th scope="row">' + esc(r.t) + '</th>' + RC.approaches.map((a) => '<td>' + esc(a[r.k]) + '</td>').join('') + '</tr>').join('') + '</tbody>';
    const sel = $('#selector');
    if (sel) sel.innerHTML = G.selector.map((q) => '<fieldset class="sel-q"><legend>' + esc(q.q) + '</legend><div class="radio-row">' +
      q.o.map((o) => '<label class="radio-pill"><input type="radio" name="sel-' + q.id + '" data-sel="' + q.id + '" value="' + o.id + '"><span>' + esc(o.t) + '</span></label>').join('') + '</div></fieldset>').join('');
    // Design explorer
    const fam = { qual: RC.approaches[0].t, quant: RC.approaches[1].t, mixed: RC.approaches[2].t };
    const dl = $('#design-list');
    if (dl) dl.innerHTML = RC.designs.map((d) => '<article class="card design-card" data-fam="' + d.family + '"><div class="tags">' + tagHTML(fam[d.family], d.family === 'mixed' ? 'tag-gold' : '') + '</div><h3>' + esc(d.t) + '</h3><p>' + esc(d.d) + '</p>' +
      '<p class="small"><strong>' + esc(UI.when) + ':</strong> ' + esc(d.when) + '</p><p class="small"><strong>' + esc(UI.example) + ':</strong> ' + esc(d.ex) + '</p>' +
      '<p class="small"><strong>' + esc(UI.data) + ':</strong> ' + esc(d.data) + '</p><p class="small caution"><strong>' + esc(UI.caution) + ':</strong> ' + esc(d.caution) + '</p></article>').join('');
    const df = $('#design-filters');
    if (df) {
      const mk = (id, t) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'chip-btn'; b.textContent = t; b.setAttribute('aria-pressed', id === 'all' ? 'true' : 'false');
        b.addEventListener('click', () => { $$('.chip-btn', df).forEach((x) => x.setAttribute('aria-pressed', x === b ? 'true' : 'false')); $$('.design-card').forEach((c) => { c.hidden = !(id === 'all' || c.dataset.fam === id); }); });
        df.appendChild(b); };
      mk('all', UI.allDesigns); RC.approaches.forEach((a) => mk(a.id, a.t));
    }
    // Sampling & collection
    const unitName = (u) => (RC.units.find((x) => x.id === u) || {}).t.replace(/ \(.*\)$/, '');
    const sl = $('#sampling-list');
    if (sl) sl.innerHTML = RC.sampling.map((s) => '<article class="card"><h3>' + esc(s.t) + '</h3><p>' + esc(s.d) + '</p><div class="tags">' + s.for.map((u) => tagHTML(unitName(u))).join('') + '</div></article>').join('');
    const ad = $('#adequacy-list');
    if (ad) ad.innerHTML = G.adequacy.map((x) => '<article class="card"><h3>' + esc(x.h) + '</h3><p>' + esc(x.t) + '</p></article>').join('');
    const cl = $('#collection-list');
    if (cl) cl.innerHTML = ['existing', 'generated'].map((k) => '<div><h3 class="h3">' + esc(k === 'existing' ? UI.kindExisting : UI.kindGenerated) + '</h3><div class="grid g-280">' +
      RC.collection.filter((c) => c.kind === k).map((c) => '<article class="card"><h3>' + esc(c.t) + '</h3><p>' + esc(c.d) + '</p></article>').join('') + '</div></div>').join('');
    const cn = $('#collect-note'); if (cn) cn.textContent = G.collectNote;
    // Analysis
    const al = $('#analysis-list');
    if (al) al.innerHTML = RC.analysis.map((x) => '<article class="card"><h3>' + esc(x.t) + '</h3><p>' + esc(x.d) + '</p><div class="tags">' + x.needs.map((u) => tagHTML(unitName(u))).join('') + '</div></article>').join('');
    const fd = $('#dims-list');
    if (fd) fd.innerHTML = RC.filmDims.map((x) => '<article class="card"><h3>' + esc(x.t) + '</h3><p>' + esc(x.d) + '</p></article>').join('');
    const fn = $('#film-note'); if (fn) fn.textContent = G.filmNote;
    // Manual questions
    const mq = $('#manual-list'); if (mq) mq.innerHTML = UI.manual.map((q) => '<li>' + esc(q) + '</li>').join('');
  }

  /* Tool A — methodology selection guide */
  function renderSelector() {
    const box = $('#selector-result'); if (!box) return;
    const sel = state.tools.sel, G = RC.guide;
    const answered = G.selector.filter((q) => sel[q.id]);
    if (!answered.length) { box.innerHTML = '<p class="small">' + esc(UI.selectorPick) + '</p>'; return; }
    const score = { qual: 0, quant: 0, mixed: 0 }, designs = [];
    answered.forEach((q) => { const o = q.o.find((x) => x.id === sel[q.id]); if (!o) return; Object.keys(o.w).forEach((k) => { score[k] += o.w[k]; }); if (o.design) designs.push(o.design); });
    const best = Object.keys(score).sort((x, y) => score[y] - score[x])[0];
    const a = RC.approaches.find((x) => x.id === best);
    RC.designs.filter((d) => d.family === best || (best === 'qual' && d.family === 'qual')).slice(0, 4).forEach((d) => designs.push(d.id));
    const dn = [...new Set(designs)].map((id) => (RC.designs.find((d) => d.id === id) || {}).t).filter(Boolean);
    box.innerHTML = '<span class="small" style="color:#BDB6A4">' + esc(UI.selectorResult) + '</span><span class="big" style="font-size:30px">' + esc(a.t) + '</span>' +
      '<div class="bars">' + RC.approaches.map((x) => '<div class="bar-row"><span>' + esc(x.t) + '</span><span class="bar" aria-hidden="true"><span style="width:' + Math.min(100, score[x.id] * 10) + '%"></span></span><span>' + num(score[x.id]) + '</span></div>').join('') + '</div>' +
      '<p class="small"><strong style="color:var(--gold-light)">' + esc(UI.selectorDesigns) + ':</strong> ' + esc(dn.join(sepL)) + '</p>' +
      '<p class="small">' + esc(G.selectorNote) + '</p><button type="button" class="btn btn-gold btn-sm" data-use-approach="' + best + '">' + esc(UI.useInBuilder) + '</button>';
  }

  /* Tool C — quality checker */
  function renderChecker() {
    const box = $('#checker'); if (!box) return;
    if (!filled(state.s1.mainQ) && !state.s2.approach) { box.innerHTML = '<p class="hint">' + esc(UI.checkerEmpty) + '</p>'; $('#checker-summary').textContent = ''; return; }
    const list = E.checks(state, RC);
    const order = { bad: 0, warn: 1, info: 2, ok: 3 };
    list.sort((x, y) => order[x.status] - order[y.status]);
    box.innerHTML = list.map((c) => diagItem(c.t, c.status, c.msg)).join('');
    const cnt = (s) => list.filter((c) => c.status === s).length;
    const SL = RC.statusLabel;
    $('#checker-summary').textContent = ['bad', 'warn', 'info', 'ok'].map((k) => SL[k] + ': ' + num(cnt(k))).join(' · ');
  }

  /* Tool B — alignment matrix */
  function renderMatrix() {
    const grid = $('#matrix-grid'), links = $('#matrix-links'); if (!grid) return;
    const M = UI.matrix, s1 = state.s1, L = E.labels(state, RC);
    const qs = [s1.mainQ].concat(String(s1.subQs || '').split('\n')).filter(filled).join('\n');
    const design = [L.approach ? L.approach.t : '', L.paradigm ? L.paradigm.t : '', L.design ? L.design.t : ''].filter(filled).join(' · ');
    const coll = L.collection.map((x) => x.t).join(sepL);
    const anal = L.analysis.map((x) => x.t).concat(L.dims.length ? [L.dims.map((x) => x.t).join(sepL)] : []).join(sepL);
    const cells = [['problem', s1.problem], ['questions', qs], ['objectives', s1.objectives], ['theory', s1.theory], ['design', design], ['collection', coll], ['analysis', anal]];
    grid.innerHTML = cells.map((c) => '<div class="m-cell' + (filled(c[1]) ? ' filled' : '') + '"><span class="k">' + esc(M[c[0]]) + '<span aria-hidden="true">' + (filled(c[1]) ? '●' : '○') + '</span></span><span class="v' + (filled(c[1]) ? '' : ' empty') + '" style="white-space:pre-line">' + esc(filled(c[1]) ? c[1] : UI.empty) + '</span></div>').join('');
    const LM = UI.linkMsg, LK = UI.links, ch = E.checks(state, RC), find = (id) => ch.find((x) => x.id === id);
    const pair = (a, b, key) => {
      if (!filled(a) || !filled(b)) return diagItem(LK[key], 'info', LM.missing);
      const ok = E.overlap(a, b, RC) >= 1;
      return diagItem(LK[key], ok ? 'ok' : 'warn', ok ? LM.overlapOk : LM.overlapWeak);
    };
    const fromCheck = (key, ids, needA, needB) => {
      if (!needA || !needB) return diagItem(LK[key], 'info', LM.missing);
      const got = ids.map(find).filter(Boolean);
      const worst = got.find((x) => x.status === 'bad') || got.find((x) => x.status === 'warn') || got[0];
      return worst ? diagItem(LK[key], worst.status, worst.msg) : diagItem(LK[key], 'info', LM.missing);
    };
    let h = pair(s1.problem, qs, 'problemQuestions') + pair(qs, s1.objectives, 'questionsObjectives');
    h += fromCheck('questionsDesign', ['approachFit', 'designFit'], filled(qs), !!state.s2.approach);
    h += fromCheck('designCollection', ['questionData', 'unitsMatch', 'mixedStrands'], !!state.s4.design, L.collection.length);
    h += fromCheck('collectionAnalysis', ['analysisFit', 'filmDims'], L.collection.length, L.analysis.length);
    if (!filled(s1.theory)) h += diagItem(LK.theoryAnalysis, 'info', LM.theoryNone);
    else if (state.s4.design === 'grounded') h += diagItem(LK.theoryAnalysis, 'info', LM.theoryGt);
    else h += diagItem(LK.theoryAnalysis, L.analysis.length ? 'ok' : 'info', L.analysis.length ? LM.theoryOk : LM.missing);
    links.innerHTML = h;
  }

  /* Tool D — examples; Tool E — glossary; references */
  function renderExamples() {
    const list = $('#ex-list'), pub = $('#pub-list'), filters = $('#ex-filters'); if (!list) return;
    const X = UI.exLabels;
    const areas = [...new Set(RC.examples.map((e) => e.area).concat(RC.published.map((e) => e.area)))];
    const mk = (id, t) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'chip-btn'; b.textContent = t; b.setAttribute('aria-pressed', id === '*' ? 'true' : 'false');
      b.addEventListener('click', () => { $$('.chip-btn', filters).forEach((x) => x.setAttribute('aria-pressed', x === b ? 'true' : 'false')); $$('.ex-card').forEach((c) => { c.hidden = !(id === '*' || c.dataset.area === id); }); });
      filters.appendChild(b);
    };
    mk('*', UI.exAll); areas.forEach((a) => mk(a, a));
    const row = (k, v) => '<p class="why"><strong>' + esc(X[k]) + ':</strong> ' + esc(v) + '</p>';
    list.innerHTML = RC.examples.map((e) => '<article class="ex-card" data-area="' + esc(e.area) + '"><div class="tags">' + tagHTML(e.area) + tagHTML(UI.exHyp, 'tag-illustrative') + '</div>' +
      '<div class="ex-better"><b>' + esc(X.rq) + '</b>' + esc(e.rq) + '</div>' + row('approach', e.approach) + row('design', e.design) + row('data', e.data) + row('sampling', e.sampling) + row('analysis', e.analysis) + row('quality', e.quality) + '</article>').join('');
    pub.innerHTML = RC.published.map((e) => '<article class="ex-card ex-pub" data-area="' + esc(e.area) + '"><div class="tags">' + tagHTML(e.area) + tagHTML(UI.exPub, 'tag-evidence') + '</div>' +
      '<p class="pub-title" lang="en" dir="ltr">' + esc(e.ref) + '</p>' + row('topic', e.rq) + row('design', e.design) + row('data', e.data) + row('analysis', e.analysis) + row('lesson', e.lesson) + '</article>').join('');
  }
  function renderGlossary() {
    const body = $('#gloss-body'); if (!body) return;
    const head = $('#gloss-head'); if (head) head.innerHTML = '<tr>' + UI.glossCols.map((c) => '<th scope="col">' + esc(c) + '</th>').join('') + '</tr>';
    (window.RM_GLOSSARY || []).forEach((g) => {
      const tr = document.createElement('tr');
      tr.dataset.search = E.norm([g.ar, g.en, g.defAr, g.defEn].join(' '), 'ar');
      const cols = RC.lang === 'ar' ? [['ar', g.ar, 'rtl'], ['en', g.en, 'ltr'], ['ar', g.defAr, 'rtl'], ['en', g.defEn, 'ltr']] : [['en', g.en, 'ltr'], ['ar', g.ar, 'rtl'], ['en', g.defEn, 'ltr'], ['ar', g.defAr, 'rtl']];
      tr.innerHTML = cols.map((c) => '<td lang="' + c[0] + '" dir="' + c[2] + '">' + esc(c[1]) + '</td>').join('');
      body.appendChild(tr);
    });
    const s = $('#gloss-search');
    if (s) s.addEventListener('input', () => {
      const q = E.norm(s.value, 'ar'); let shown = 0;
      $$('tr', body).forEach((tr) => { const ok = !q || tr.dataset.search.indexOf(q) !== -1; tr.hidden = !ok; if (ok) shown++; });
      $('#gloss-empty').hidden = shown !== 0;
    });
  }
  function renderRefs() {
    const box = $('#refs-list'); if (!box) return;
    box.innerHTML = (window.RM_REFS || []).map((g) => '<div class="ref-group"><h3>' + esc(UI.refGroups[g.id]) + '</h3><ol>' +
      g.items.map((r) => '<li lang="en" dir="ltr">' + linkify(r.text) + ' <span class="tag ref-type" lang="' + RC.lang + '" dir="' + (RC.lang === 'ar' ? 'rtl' : 'ltr') + '">' + esc(UI.refTypes[r.type]) + '</span>' +
        (r.check === 'pending' ? ' <span class="tag tag-gold ref-type" lang="' + RC.lang + '" dir="' + (RC.lang === 'ar' ? 'rtl' : 'ltr') + '">' + esc(UI.pending) + '</span>' : '') + '</li>').join('') + '</ol></div>').join('');
  }

  /* ---------------- Change handler ---------------- */
  let raf = null;
  function onChange() {
    suppressSave = false; save();
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => { refresh(); stepperStatus(); });
  }

  /* ---------------- Controls ---------------- */
  function wire() {
    $('#btn-next').addEventListener('click', () => { if (validateStep(state.step, true)) goTo(state.step + 1, true); });
    $('#btn-prev').addEventListener('click', () => goTo(state.step - 1, true));
    const sb = $('#btn-show-designs'); if (sb) sb.addEventListener('click', () => { state.s4.showAll = !state.s4.showAll; onChange(); });

    // Draft
    const d = $('#draft');
    d.addEventListener('input', () => { state.s9.draft = sanitize(d.innerHTML); state.s9.edited = true; save(); renderRefine(); });
    confirmClick($('#btn-regen-draft'), UI.regenConfirm, () => { renderDraft(true); d.innerHTML = sanitize(state.s9.draft); renderRefine(); save(); toast(UI.regenerated); }, () => state.s9.edited);
    $('#btn-copy-draft').addEventListener('click', () => copyText(d.innerText).then(() => toast(UI.copied), () => toast(UI.copyFail)));

    // Rubric & report
    $('#btn-apply-scores').addEventListener('click', () => { state.s10.scores = E.suggestScores(state, RC); fillInputs(); onChange(); toast(UI.scoresApplied); });
    const rep = $('#report');
    rep.addEventListener('input', () => { state.report.html = sanitize(rep.innerHTML); state.report.edited = true; save(); });
    confirmClick($('#btn-regen-report'), UI.regenConfirm, () => { renderReport(true); save(); toast(UI.regenerated); }, () => state.report.edited);
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

    // Selector → builder
    document.addEventListener('click', (e) => {
      const b = e.target.closest('[data-use-approach]'); if (!b) return;
      state.s2.approach = b.dataset.useApproach; onChange(); toast(UI.usedInBuilder);
    });

    // Data controls
    $$('[data-action="delete"]').forEach((btn) => confirmClick(btn, UI.deleteConfirm, () => {
      try { localStorage.removeItem(STORE_KEY); } catch (e) { /* ignore */ }
      suppressSave = true; clearTimeout(saveTimer);
      state = defaults(); fillInputs(); $('#draft').innerHTML = ''; goTo(0, false); updateSaveStatus();
      try { localStorage.removeItem(STORE_KEY); } catch (e) { /* ignore */ }
      toast(UI.deleted);
    }));
    $$('[data-action="export"]').forEach((btn) => btn.addEventListener('click', () => download(UI.fileData, [JSON.stringify(state, null, 2)], 'application/json')));
    const fileIn = $('#file-import');
    if (fileIn) fileIn.addEventListener('change', () => {
      const f = fileIn.files[0]; if (!f) return;
      const rd = new FileReader();
      rd.onload = () => {
        try {
          const data = JSON.parse(rd.result);
          if (!data || data.v !== 1 || !data.s1 || !data.s5) throw new Error('bad');
          state = merge(defaults(), data); suppressSave = false; fillInputs(); renderDraft(false); goTo(state.step, false); save(true); toast(UI.imported);
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
    renderBuilder();
    renderGuides(); renderExamples(); renderGlossary(); renderRefs();
    bind(); fillInputs(); wire();
    goTo(state.step || 0, false);
    updateSaveStatus();
    if (had && (filled(state.s1.title) || filled(state.s1.mainQ))) toast(UI.restored);
  });
})();
