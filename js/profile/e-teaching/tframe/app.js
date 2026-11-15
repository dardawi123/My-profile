/* =========================================================
   Theoretical Framework Development in Film and Television Studies
   بناء الإطار النظري في الدراسات السينمائية والتلفزيونية — application logic

   Language-neutral. Wording comes from window.RC (tframe-ar.js or
   tframe-en.js); rules from window.TFE (engine.js); library data from
   theories.js; shared data from glossary.js and references.js. Data stays in
   this browser (localStorage); nothing is sent to a server.
   Academic tool developed by Dr. Merfat Alardawi | د. مرفت العرضاوي
   ========================================================= */
(function () {
  'use strict';
  const RC = window.RC, E = window.TFE;
  if (!RC || !E || !window.TFR_THEORIES) { console.error('TFR: required scripts are missing.'); return; }
  const UI = RC.ui;
  const STORE_KEY = 'tfr.data.v1', LANG_KEY = 'tfr.lang', STEPS = 12;
  const AR = RC.lang === 'ar';
  const SECTIONS = E.SECTIONS;
  const CM_COLS = ['concept', 'definition', 'source', 'theory', 'relevance', 'questions', 'application', 'reference', 'operational'];

  /* ---------------- State ---------------- */
  function defaults() {
    const on = {}, text = {}, edited = {};
    SECTIONS.forEach((s) => { on[s] = true; text[s] = ''; edited[s] = false; });
    return {
      v: 1, step: 0, maxStep: 0, savedAt: null,
      s1: { title: '', problem: '', questions: '', objectives: '', field: '', approach: '', design: '', materials: '', context: '', analytic: '' },
      s2: { focus: [], primary: '', why: '', role: '' },
      s3: { shortlist: [], notes: '', customName: '', customDesc: '' },
      s4: { rel: {}, rate: {} },
      s5: { primary: '', secondary: [], relevance: '', problem: '', aspects: '', alternatives: '', method: '', combine: '' },
      concepts: [],
      s7: {},
      s8: { design: '', collection: '', selection: '', categories: '', interpretation: '', presentation: '' },
      map: { layout: 'hier', nodes: [], edges: [] },
      s10: { history: '', assumptions: '', applications: '', debates: '', synthesis: '', order: SECTIONS.slice(), on, text, edited, draft: '', draftEdited: false },
      s11: { checks: [], scores: {}, self: '' },
      s12: { final: '', refs: '', notes: '' },
      report: { html: '', edited: false },
      ui: { cmp: [] }
    };
  }
  function uid() { return 'x' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  const str = (x) => typeof x === 'string' ? x : '';
  const cmRow = (x) => { const r = { id: str(x && x.id) || uid() }; CM_COLS.forEach((c) => { r[c] = str(x && x[c]); }); return r; };
  const strMap = (s) => { const o = {}; if (s && typeof s === 'object') Object.keys(s).forEach((k) => { if (typeof s[k] === 'string') o[k] = s[k]; }); return o; };
  function merge(base, src) {
    if (!src || typeof src !== 'object') return base;
    Object.keys(base).forEach((k) => {
      if (!(k in src)) return;
      const b = base[k], s = src[k];
      if (k === 'order') { const ok = Array.isArray(s) ? s.filter((x) => SECTIONS.indexOf(x) !== -1) : []; base[k] = ok.concat(SECTIONS.filter((x) => ok.indexOf(x) === -1)); }
      else if (k === 'concepts' && Array.isArray(b)) base[k] = Array.isArray(s) ? s.slice(0, 60).filter((x) => x && typeof x === 'object').map(cmRow) : [];
      else if (k === 'rel' || k === 'rate') base[k] = strMap(s);
      else if (k === 's7') { const o = {}; if (s && typeof s === 'object') Object.keys(s).forEach((i) => { const r = s[i] || {}; o[i] = { concepts: Array.isArray(r.concepts) ? r.concepts.filter((x) => typeof x === 'string') : [], focus: str(r.focus), evidence: str(r.evidence), procedure: str(r.procedure) }; }); base[k] = o; }
      else if (k === 'map') { base[k] = { layout: ['hier', 'radial', 'network'].indexOf(s && s.layout) !== -1 ? s.layout : 'hier', nodes: Array.isArray(s && s.nodes) ? s.nodes.filter((n) => n && n.id).slice(0, 80).map((n) => ({ id: str(n.id), type: E.NODE_ORDER.indexOf(n.type) !== -1 ? n.type : 'concept', label: str(n.label), key: str(n.key), manual: !!n.manual, x: Number(n.x) || 0, y: Number(n.y) || 0 })) : [], edges: Array.isArray(s && s.edges) ? s.edges.filter((e) => e && e.id).slice(0, 200).map((e) => ({ id: str(e.id), from: str(e.from), to: str(e.to), kind: ['link', 'direction', 'causal'].indexOf(e.kind) !== -1 ? e.kind : 'link', label: str(e.label) })) : [] }; }
      else if (k === 'scores') { if (s && typeof s === 'object') Object.keys(s).forEach((x) => { if (typeof s[x] === 'number' && s[x] >= 1 && s[x] <= 5) b[x] = s[x]; }); }
      else if (Array.isArray(b)) base[k] = Array.isArray(s) ? s.filter((x) => typeof x === 'string') : b;
      else if (typeof b === 'boolean') base[k] = !!s;
      else if (b && typeof b === 'object') base[k] = merge(b, s);
      else if (typeof s === typeof b || b === null) base[k] = s;
    });
    return base;
  }
  let state = defaults();

  /* ---------------- Helpers ---------------- */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const attr = esc;
  const getPath = (o, p) => p.split('.').reduce((a, k) => (a == null ? a : a[k]), o);
  const setPath = (o, p, v) => { const ks = p.split('.'); const last = ks.pop(); ks.reduce((a, k) => a[k], o)[last] = v; };
  const filled = E.filled;
  const num = (n) => AR ? String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]) : String(n);
  const fmt1 = (n) => AR ? num(n.toFixed(1)).replace('.', '٫') : n.toFixed(1);
  const icon = (st) => ({ ok: '✓', warn: '!', bad: '×', info: 'i' }[st]);
  const linkify = (s) => esc(s).replace(/(https?:\/\/[^\s<]+[^\s<.,;)])/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
  const label = (arr, id) => (arr.find((x) => x.id === id) || {}).t || '';
  const kind = () => E.kindOf(state, RC);
  const msg = (M, x) => { const m = M[x.k] || {}; const f = m[x.s] || m.msg; return { t: m.t || '', d: typeof f === 'function' ? f(x) : (f || '') }; };
  const rq = (i) => 'RQ' + num(i + 1);
  const questions = () => E.lines(state.s1.questions);
  const tlist = () => E.theories(state, RC);
  const tname = (id) => E.nameOf(state, RC, id);

  function toast(m) { const t = $('#toast'); if (!t) return; t.textContent = m; t.hidden = false; clearTimeout(toast._t); toast._t = setTimeout(() => { t.hidden = true; }, 3400); }

  /* ---------------- Persistence ---------------- */
  let saveTimer = null, suppressSave = false;
  function save(now) {
    clearTimeout(saveTimer); if (suppressSave) return;
    const run = () => { state.savedAt = new Date().toISOString(); try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* storage blocked */ } updateSaveStatus(); };
    if (now) run(); else saveTimer = setTimeout(run, 350);
  }
  function load() { try { const raw = localStorage.getItem(STORE_KEY); if (!raw) return false; state = merge(defaults(), JSON.parse(raw)); return true; } catch (e) { return false; } }
  function updateSaveStatus() { const n = $('#save-status'); if (!n) return; n.textContent = state.savedAt ? UI.savedAt(new Date(state.savedAt).toLocaleTimeString(AR ? 'ar-SA' : 'en-GB', { hour: '2-digit', minute: '2-digit' })) : UI.notSaved; }

  /* ---------------- Markup helpers ---------------- */
  const idOf = (p, sfx) => 'f-' + p.replace(/\./g, '-') + (sfx ? '-' + sfx : '');
  const meta = (path) => RC.f[path] || {};
  function F(path, type, o) {
    o = o || {};
    const f = meta(path), id = idOf(path, o.sfx), hid = id + '-h';
    const req = o.req ? ' data-required="1"' + (o.min ? ' data-minwords="' + o.min + '"' : '') : '';
    const common = ' id="' + id + '" class="inp" data-bind="' + path + '"' + req + (f.ph ? ' placeholder="' + attr(f.ph) + '"' : '') + ' aria-describedby="' + hid + '"';
    const ctl = type === 'textarea' ? '<textarea' + common + (o.rows ? ' rows="' + o.rows + '"' : '') + '></textarea>' : '<input' + common + '>';
    return '<div class="field"' + (o.show ? ' data-show="' + o.show + '"' : '') + '><label for="' + id + '">' + esc(f.label) + (o.req ? '<span class="req" aria-hidden="true">*</span>' : '') + '</label>' + ctl + '<span class="hint" id="' + hid + '">' + esc(f.hint || '') + '</span><span class="err" aria-live="polite"></span></div>';
  }
  function SEL(path, opts0, o) {
    o = o || {}; const f = meta(path), id = idOf(path, o.sfx);
    return '<div class="field"><label for="' + id + '">' + esc(f.label) + (o.req ? '<span class="req" aria-hidden="true">*</span>' : '') + '</label><select id="' + id + '" class="inp" data-bind="' + path + '"' + (o.req ? ' data-required="1"' : '') + (o.dyn ? ' data-dyn="' + o.dyn + '"' : '') + '>' + opts0 + '</select>' + (f.hint ? '<span class="hint">' + esc(f.hint) + '</span>' : '') + '<span class="err" aria-live="polite"></span></div>';
  }
  const G2 = (a, b) => '<div class="grid g-2">' + a + b + '</div>';
  function PICK(path, items, o) {
    o = o || {}; const f = meta(path), gid = idOf(path, o.sfx);
    return '<div class="field choice-group"' + (o.req === false ? '' : ' data-required-pick="' + path + '"') + '><span class="label" id="' + gid + '-l">' + esc(f.label) + (o.req === false ? '' : '<span class="req" aria-hidden="true">*</span>') + '</span>' + (f.hint ? '<span class="hint">' + esc(f.hint) + '</span>' : '') +
      '<div class="grid ' + (o.cols || 'g-240') + '" role="group" aria-labelledby="' + gid + '-l">' + items.map((it) => '<button type="button" class="choice" data-pick="' + path + '" data-id="' + it.id + '" aria-pressed="false"><strong>' + esc(it.t) + '</strong>' + (it.d ? '<span>' + esc(it.d) + '</span>' : '') + '</button>').join('') + '</div><span class="err" aria-live="polite"></span></div>';
  }
  const opts = (list, blank) => (blank ? '<option value=""></option>' : '') + list.map((x) => '<option value="' + x.id + '">' + esc(x.t) + '</option>').join('');
  const OUT = (i) => '<div class="output-box"><span class="k">' + esc(RC.stepText[i].out) + '</span><span class="v" id="out-' + i + '" style="white-space:pre-line"></span></div>';
  const diagItem = (t, s, m) => '<div class="diag-item st-' + s + '"><span class="ic" aria-hidden="true">' + icon(s) + '</span>' + (t ? '<span class="t">' + esc(t) + '<span class="status-label">' + esc(RC.statusLabel[s]) + '</span></span>' : '') + '<span class="d">' + esc(m) + '</span></div>';
  const diagList = (M, list) => list.map((x) => { const m = msg(M, x); return diagItem(m.t, x.s, m.d); }).join('');
  const cmpBox = (w, b) => '<div class="compare"><div class="ex-weak"><b>' + esc(UI.weak) + '</b>' + esc(w) + '</div><div class="ex-better"><b>' + esc(UI.better) + '</b>' + esc(b) + '</div></div>';
  const table = (cols, rows) => '<div class="table-wrap"><table class="data"><thead><tr>' + cols.map((c) => '<th scope="col">' + esc(c) + '</th>').join('') + '</tr></thead><tbody>' + rows.map((r) => '<tr>' + r.map((c, i) => i === 0 ? '<th scope="row">' + esc(c) + '</th>' : '<td>' + esc(c) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>';
  function designOptions() {
    const ap = state.s1.approach, list = RC.designs.filter((d) => !ap || d.a === ap), groups = RC.approaches.filter((a) => !ap || a.id === ap);
    return '<option value="">' + esc(ap ? UI.chooseDesign : UI.chooseApproachFirst) + '</option>' + groups.map((g) => '<optgroup label="' + attr(g.t) + '">' + list.filter((d) => d.a === g.id).map((d) => '<option value="' + d.id + '">' + esc(d.t) + '</option>').join('') + '</optgroup>').join('');
  }
  function guideLink(i) {
    const box = document.getElementById('steps'), g = box && box.dataset.guide; if (!g) return '';
    return '<a class="step-guide" href="' + attr(g) + '#step-' + (i + 1) + '" target="_blank" rel="noopener noreferrer">' + esc(box.dataset.guideLabel || '') + '<span class="sr-only">' + esc(box.dataset.guideNewtab || '') + '</span></a>';
  }

  /* ---------------- Builder markup ---------------- */
  function stepBody(i) {
    const T = RC.stepText[i];
    switch (i) {
      case 0: return F('s1.title', 'text', { req: 1 }) + F('s1.problem', 'textarea', { req: 1, min: 10 }) + G2(F('s1.questions', 'textarea', { req: 1, min: 5, rows: 4 }), F('s1.objectives', 'textarea', { rows: 4 })) +
        SEL('s1.field', opts(RC.fields, true)) + PICK('s1.approach', RC.approaches, { cols: 'g-200' }) + SEL('s1.design', designOptions(), { req: 1, dyn: 'design' }) +
        G2(F('s1.materials', 'textarea'), F('s1.context', 'textarea')) + F('s1.analytic', 'text') + OUT(0);
      case 1: return '<fieldset class="field"><legend>' + esc(UI.focusTitle) + '<span class="req" aria-hidden="true">*</span></legend><p class="hint">' + esc(UI.focusHint) + '</p><div class="grid g-240">' +
        RC.foci.map((f) => { const id = 'fo-' + f.id; return '<label class="chk" for="' + id + '"><input type="checkbox" id="' + id + '" data-multi="s2.focus" value="' + f.id + '"><span class="txt"><strong>' + esc(f.t) + '</strong><span>' + esc(f.d) + '</span></span></label>'; }).join('') + '</div><p class="err" id="err-focus" aria-live="polite"></p></fieldset>' +
        SEL('s2.primary', '', { dyn: 'focus' }) + F('s2.why', 'textarea', { req: 1, min: 8 }) + PICK('s2.role', RC.roles, { cols: 'g-200' }) + cmpBox(T.weak, T.better) + '<div class="diag" id="diag-1"></div>' + OUT(1);
      case 2: return '<div data-explorer="step"></div><p class="err" id="err-short" aria-live="polite"></p>' + G2(F('s3.customName', 'text'), F('s3.customDesc', 'textarea')) + F('s3.notes', 'textarea') + OUT(2);
      case 3: return '<div data-compare="step"></div><p class="err" id="err-rel" aria-live="polite"></p>';
      case 4: return SEL('s5.primary', '', { req: 1, dyn: 'short' }) + '<fieldset class="field"><legend>' + esc(UI.secondary) + '</legend><p class="hint">' + esc(UI.secondaryHint) + '</p><div class="radio-row" data-secondary></div></fieldset>' +
        F('s5.relevance', 'textarea', { req: 1, min: 6 }) + F('s5.problem', 'textarea', { req: 1, min: 6 }) + F('s5.aspects', 'textarea') + F('s5.alternatives', 'textarea', { req: 1, min: 6 }) + F('s5.method', 'textarea', { req: 1, min: 6 }) + F('s5.combine', 'textarea', { show: 'combine' }) +
        cmpBox(T.weak, T.better) + '<div class="diag" id="diag-4"></div>' + OUT(4);
      case 5: return '<div class="refine-box"><h4 class="h4">' + esc(UI.cmTitle) + '</h4><p class="hint">' + esc(UI.cmIntro) + '</p><div data-quick></div><div data-concepts="step"></div></div><p class="err" id="err-cm" aria-live="polite"></p><div class="diag" id="diag-5"></div>';
      case 6: return '<div data-align-table="step"></div><p class="err" id="err-al" aria-live="polite"></p><div class="diag" data-align></div>';
      case 7: return '<div class="explain" data-pathway></div>' + G2(F('s8.design', 'textarea', { req: 1, min: 5 }), F('s8.collection', 'textarea')) + G2(F('s8.selection', 'textarea'), F('s8.categories', 'textarea')) + F('s8.interpretation', 'textarea', { req: 1, min: 6 }) + F('s8.presentation', 'textarea') + OUT(7);
      case 8: return '<div data-viz="step"></div><p class="err" id="err-map" aria-live="polite"></p><div class="diag" data-map-diag></div>';
      case 9: return '<p class="hint">' + esc(UI.composerHint) + '</p><details class="refine-box" open><summary class="h4">' + esc(UI.writeFields) + '</summary>' + F('s10.history', 'textarea') +
        '<div>' + F('s10.assumptions', 'textarea', { rows: 4 }) + '<div class="btn-row"><button type="button" class="btn btn-ghost btn-sm" id="btn-insert-lib">' + esc(UI.insertLib) + '</button></div></div>' + F('s10.applications', 'textarea') + F('s10.debates', 'textarea') + F('s10.synthesis', 'textarea') + '</details>' +
        '<div class="composer" id="composer"></div><div class="draft-wrap"><div class="report-tools"><h4 class="h4">' + esc(UI.draftTitle) + '</h4><span class="spacer"></span><button type="button" class="btn btn-ghost btn-sm" id="btn-rebuild">' + esc(UI.rebuild) + '</button><button type="button" class="btn btn-ghost btn-sm" data-copy-bind="s10.draft">' + esc(UI.copy) + '</button></div>' +
        '<div class="field"><label for="draft-10" class="sr-only">' + esc(UI.draftTitle) + '</label><textarea id="draft-10" class="inp intro-ta" data-bind="s10.draft" data-draft="1" rows="16" spellcheck="true"></textarea><span class="hint" data-draft-note></span></div><div class="small muted" data-wc-inline></div></div><p class="err" id="err-draft" aria-live="polite"></p>';
      case 10: return '<div class="field"><label for="draft-11">' + esc(UI.draftTitle) + '</label><textarea id="draft-11" class="inp intro-ta" data-bind="s10.draft" data-draft="1" rows="14" spellcheck="true"></textarea><span class="hint" data-draft-note></span></div>' +
        '<div class="refine-box"><h4 class="h4">' + esc(UI.refineTitle) + '</h4><div class="diag" id="refine-list"></div></div>' +
        '<h4 class="h4">' + esc(UI.checklistTitle) + ' <span class="small muted" data-checklist-progress></span></h4><div class="checklist" data-checklist="step"></div>' +
        '<div class="checker-head"><h4 class="h4">' + esc(UI.checksTitle) + '</h4><span class="checker-summary" id="checker-summary"></span></div><div class="diag" id="checker"></div>' +
        '<div class="eval-layout"><div><div class="rubric" id="rubric"></div><div class="btn-row"><button type="button" class="btn btn-ghost btn-sm" id="btn-apply-scores">' + esc(UI.applyScores) + '</button></div></div><div class="result-panel" id="rubric-result" aria-live="polite"></div></div>' +
        F('s11.self', 'textarea') + '<p class="disclaimer">' + esc(UI.evalDisclaimer) + '</p>';
      case 11: return '<div class="final-box">' + F('s12.final', 'textarea', { rows: 14 }) + '<div class="btn-row"><button type="button" class="btn btn-ghost btn-sm" id="btn-final-from-draft">' + esc(UI.finalFromDraft) + '</button><button type="button" class="btn btn-ghost btn-sm" data-copy-bind="s12.final">' + esc(UI.copyFinal) + '</button></div></div>' +
        G2(F('s12.refs', 'textarea', { rows: 6 }), F('s12.notes', 'textarea', { rows: 6 })) +
        '<div class="report-tools"><button type="button" class="btn btn-ghost btn-sm" id="btn-regen-report">' + esc(UI.reportRegen) + '</button><button type="button" class="btn btn-ghost btn-sm" id="btn-copy-report">' + esc(UI.reportCopy) + '</button><button type="button" class="btn btn-ghost btn-sm" id="btn-print">' + esc(UI.print) + '</button><button type="button" class="btn btn-primary btn-sm" id="btn-doc">' + esc(UI.doc) + '</button><button type="button" class="btn btn-ghost btn-sm" id="btn-txt">' + esc(UI.txt) + '</button></div>' +
        '<div class="report" id="report" contenteditable="true" role="textbox" aria-multiline="true" aria-label="' + attr(UI.report.title) + '" spellcheck="true"></div>';
    }
    return '';
  }
  function renderBuilder() {
    $('#steps').innerHTML = RC.stepText.map((s, i) => '<div class="step" data-step="' + i + '"' + (i ? ' hidden' : '') + '><div class="step-head"><h3>' + esc(s.h) + '</h3><p>' + esc(s.p) + '</p>' + guideLink(i) + '</div>' +
      '<div class="explain"><strong>' + esc(s.whyH) + '</strong><span>' + esc(s.why) + '</span></div>' + (s.ex ? '<div class="example-box"><b>' + esc(UI.example) + '</b>' + esc(s.ex) + '</div>' : '') + stepBody(i) + '</div>').join('');
    $('#rubric').innerHTML = RC.rubric.map((c) => '<fieldset class="rubric-row"><legend>' + esc(c.t) + '</legend><span class="desc">' + esc(c.d) + '</span><span class="suggest" data-suggest="' + c.id + '"></span><div class="scale">' +
      [1, 2, 3, 4, 5].map((n) => '<label><input type="radio" name="rub-' + c.id + '" value="' + n + '" data-rub="' + c.id + '" aria-label="' + attr(c.t + ': ' + RC.numerals[n - 1]) + '"><span aria-hidden="true">' + RC.numerals[n - 1] + '</span></label>').join('') + '</div></fieldset>').join('');
  }
  function renderChecklists() {
    $$('[data-checklist]').forEach((box) => { box.innerHTML = RC.checklist.map((c, i) => { const id = 'cl-' + box.dataset.checklist + '-' + c.id; return '<label class="chk" for="' + id + '"><input type="checkbox" id="' + id + '" data-multi="s11.checks" value="' + c.id + '"><span class="txt"><strong>' + RC.numerals[i] + '. ' + esc(c.t) + '</strong><span>' + esc(c.d) + '</span></span></label>'; }).join(''); });
  }
  /* Selects whose options depend on other answers. */
  function renderDynSelects() {
    $$('select[data-dyn]').forEach((s) => {
      const d = s.dataset.dyn;
      if (d === 'design') s.innerHTML = designOptions();
      else if (d === 'focus') s.innerHTML = '<option value=""></option>' + RC.foci.filter((f) => state.s2.focus.indexOf(f.id) !== -1).map((f) => '<option value="' + f.id + '">' + esc(f.t) + '</option>').join('');
      else if (d === 'short') s.innerHTML = '<option value=""></option>' + state.s3.shortlist.map((id) => '<option value="' + id + '">' + esc(tname(id)) + '</option>').join('');
      s.value = getPath(state, s.dataset.bind) || '';
    });
    const sec = $('[data-secondary]');
    if (sec) sec.innerHTML = state.s3.shortlist.filter((id) => id !== state.s5.primary).map((id) => '<label class="radio-pill"><input type="checkbox" data-multi="s5.secondary" value="' + id + '"' + (state.s5.secondary.indexOf(id) !== -1 ? ' checked' : '') + '><span>' + esc(tname(id)) + '</span></label>').join('') || '<span class="hint">' + esc(UI.noneSecondary) + '</span>';
  }

  /* ---------------- Tool A: Theory Explorer ---------------- */
  const exFilters = {};
  function profileHTML(t) {
    const x = t.text, li = (a) => '<ul class="list small">' + a.map((s) => '<li>' + esc(s) + '</li>').join('') + '</ul>';
    const row = (k, v) => v ? '<p class="small"><strong>' + esc(k) + ':</strong> ' + esc(v) + '</p>' : '';
    return (t.custom ? '' : '<p class="small"><strong>' + esc(UI.fType) + ':</strong> ' + esc(RC.typeNames[t.type]) + ' — ' + esc(RC.typeDesc[t.type]) + '</p>') + row(UI.fTheorists, x.theorists) + row(UI.fBackground, x.background) +
      (x.assumptions.length ? '<p class="small"><strong>' + esc(UI.fAssumptions) + ':</strong></p>' + li(x.assumptions) : '') + (x.concepts.length ? '<p class="small"><strong>' + esc(UI.fConcepts) + ':</strong> ' + esc(x.concepts.join(RC.sep)) + '</p>' : '') +
      row(UI.fQuestions, x.questions) + row(UI.fMethods, x.methods) + row(UI.fApplications, x.applications) + row(UI.fStrengths, x.strengths) + row(UI.fLimits, x.limits) + row(UI.fExample, x.example) +
      (t.refs.length ? '<p class="small"><strong>' + esc(UI.fRefs) + ':</strong></p><ul class="list small refs-mini">' + t.refs.map((r) => '<li lang="en" dir="ltr">' + linkify(r) + '</li>').join('') + '</ul>' : '');
  }
  function badges(t) {
    if (t.custom) return '<span class="tag tag-gold">' + esc(UI.customTag) + '</span>';
    const c = E.compat(t, state, RC), out = ['<span class="tag">' + esc(RC.typeNames[t.type]) + '</span>'];
    if (c.focus.length) out.push('<span class="tag tag-evidence">' + esc(UI.badgeFocus(c.focus.map((f) => label(RC.foci, f)).join(RC.sep))) + '</span>');
    if (c.kind === true) out.push('<span class="tag tag-evidence">' + esc(UI.badgeKind) + '</span>'); else if (c.kind === false) out.push('<span class="tag tag-gold">' + esc(UI.badgeKindNo) + '</span>');
    if (c.obj) out.push('<span class="tag tag-evidence">' + esc(UI.badgeObj) + '</span>');
    return out.join('');
  }
  function renderExplorer() {
    $$('[data-explorer]').forEach((box) => {
      const k = box.dataset.explorer, f = exFilters[k] || (exFilters[k] = { q: '', focus: '', kind: '', obj: '' });
      if (!box.dataset.ready) {
        const sel = (key, list, lab) => '<div class="field"><label for="ex-' + k + '-' + key + '">' + esc(lab) + '</label><select id="ex-' + k + '-' + key + '" class="inp" data-exf="' + k + ':' + key + '"><option value="">' + esc(UI.exAll) + '</option>' + list.map((o) => '<option value="' + o.id + '">' + esc(o.t) + '</option>').join('') + '</select></div>';
        box.innerHTML = '<div class="mx-tools"><div class="field grow"><label for="ex-' + k + '-q">' + esc(UI.exSearch) + '</label><input id="ex-' + k + '-q" class="inp" type="search" data-exf="' + k + ':q" placeholder="' + attr(UI.exSearchPh) + '"></div>' +
          sel('focus', RC.foci, UI.exFocus) + sel('kind', Object.keys(RC.kindNames).map((x) => ({ id: x, t: RC.kindNames[x] })), UI.exKind) + sel('obj', Object.keys(RC.objNames).map((x) => ({ id: x, t: RC.objNames[x] })), UI.exObj) + '</div>' +
          '<p class="hint">' + esc(UI.compatNote) + ' <strong data-ex-count></strong></p><div class="ex-grid" data-ex-list></div>';
        box.dataset.ready = '1';
      }
      const list = E.filterTheories(tlist(), f, RC, RC.lang), out = $('[data-ex-list]', box);
      out.innerHTML = list.length ? list.map((t) => { const on = state.s3.shortlist.indexOf(t.id) !== -1; return '<article class="card theory-card' + (on ? ' on' : '') + '"><h3>' + esc(t.text.name) + '</h3><div class="tags">' + badges(t) + '</div>' +
        '<details><summary>' + esc(UI.exDetails) + '</summary>' + profileHTML(t) + '</details><button type="button" class="btn ' + (on ? 'btn-ghost' : 'btn-primary') + ' btn-sm" data-short="' + t.id + '" aria-pressed="' + on + '">' + esc(on ? UI.exRemove : UI.exAdd) + '</button></article>'; }).join('') : '<p class="hint">' + esc(UI.exNone) + '</p>';
    });
    $$('[data-ex-count]').forEach((n) => { n.textContent = UI.exCount(num(state.s3.shortlist.length)); });
  }

  /* ---------------- Tool B: comparison matrix ---------------- */
  function compareHTML(ids, withRel) {
    const ts = ids.map((id) => E.theoryById(state, RC, id)).filter(Boolean);
    if (!ts.length) return '<p class="hint">' + esc(withRel ? UI.cmpEmpty : UI.cmpToolEmpty) + '</p>';
    const cell = (t, key) => { if (t.custom) return key === 'assumptions' ? esc(t.text.assumptions.join(' ')) || esc(UI.cmpCustomNote) : key === 'type' ? esc(UI.customTag) : '—'; const x = t.text; return esc(key === 'type' ? RC.typeNames[t.type] : key === 'assumptions' ? x.assumptions.join(' ') : key === 'concepts' ? x.concepts.join(RC.sep) : x[key]); };
    let h = '<div class="table-wrap"><table class="data cmp-table"><thead><tr><th scope="col"></th>' + ts.map((t) => '<th scope="col">' + esc(t.text.name) + '</th>').join('') + '</tr></thead><tbody>' +
      RC.cmpRows.map((r) => '<tr><th scope="row">' + esc(r.t) + '</th>' + ts.map((t) => '<td>' + cell(t, r.key) + '</td>').join('') + '</tr>').join('');
    if (withRel) h += '<tr><th scope="row">' + esc(UI.cmpRel) + '</th>' + ts.map((t) => '<td><label class="sr-only" for="rel-' + t.id + '">' + esc(UI.cmpRel + ': ' + t.text.name) + '</label><textarea id="rel-' + t.id + '" class="inp" rows="4" data-rel="' + t.id + '"></textarea><label class="sr-only" for="rate-' + t.id + '">' + esc(UI.cmpRate) + '</label><select id="rate-' + t.id + '" class="inp" data-rate="' + t.id + '"><option value="">' + esc(UI.cmpRate) + '</option>' + RC.rateOpts.map((o) => '<option value="' + o.id + '">' + esc(o.t) + '</option>').join('') + '</select></td>').join('') + '</tr>';
    h += '</tbody></table></div>';
    const ps = E.pairsFor(ids);
    h += '<h4 class="h4">' + esc(UI.cmpPairs) + '</h4>' + (ps.length ? '<div class="diag">' + ps.map((p) => diagItem(RC.pairKind[p.kind] + ' — ' + tname(p.a) + ' / ' + tname(p.b), p.kind === 'tension' ? 'warn' : p.kind === 'complement' ? 'ok' : 'info', RC.pairText[p.key])).join('') + '</div>' : (ts.length > 1 ? '<p class="hint">' + esc(UI.cmpNoPairs) + '</p>' : ''));
    return h;
  }
  function renderCompare() {
    const s = $('[data-compare="step"]');
    if (s) { s.innerHTML = compareHTML(state.s3.shortlist, true); state.s3.shortlist.forEach((id) => { const a = $('[data-rel="' + id + '"]'); if (a) a.value = state.s4.rel[id] || ''; const b = $('[data-rate="' + id + '"]'); if (b) b.value = state.s4.rate[id] || ''; }); }
    const tool = $('[data-compare="tool"]');
    if (tool) {
      if (!tool.dataset.ready) { tool.innerHTML = '<fieldset><legend>' + esc(UI.cmpPick) + '</legend><div class="radio-row">' + (window.TFR_THEORIES.list).map((t) => '<label class="radio-pill"><input type="checkbox" data-cmp value="' + t.id + '"><span>' + esc(RC.theoryText[t.id].name) + '</span></label>').join('') + '</div></fieldset><div data-cmp-out></div>'; tool.dataset.ready = '1'; }
      $$('input[data-cmp]', tool).forEach((i) => { i.checked = state.ui.cmp.indexOf(i.value) !== -1; });
      $('[data-cmp-out]', tool).innerHTML = state.ui.cmp.length >= 2 ? compareHTML(state.ui.cmp, false) : '<p class="hint">' + esc(UI.cmpToolEmpty) + '</p>';
    }
  }

  /* ---------------- Tool C: concepts matrix ---------------- */
  const openRows = new Set();
  function renderConcepts(except) {
    $$('[data-concepts]').forEach((box) => {
      if (box === except) return;
      const k = box.dataset.concepts, fid = 'cm-file-' + k;
      const rows = state.concepts.map((r, i) => {
        const fld = (c, area) => { const id = 'cm-' + k + '-' + r.id + '-' + c; return '<div class="field' + (area ? ' span-2' : '') + '"' + (c === 'operational' ? ' data-quant' : '') + '><label for="' + id + '">' + esc(UI.cmCols[c]) + '</label>' + (area ? '<textarea rows="2"' : '<input') + ' id="' + id + '" class="inp" data-cm="' + r.id + ':' + c + '"' + (c === 'reference' ? ' dir="auto"' : '') + '>' + (area ? '</textarea>' : '') + '</div>'; };
        return '<details class="mx-row" data-row="' + r.id + '"' + (openRows.has(r.id) ? ' open' : '') + '><summary><span class="mx-n">' + esc(UI.cmN(num(i + 1))) + '</span> <span class="mx-cite" dir="auto" data-cm-sum="' + r.id + '">' + esc(r.concept) + '</span></summary><div class="grid g-2">' +
          fld('concept') + fld('source') + fld('definition', 1) + fld('theory') + fld('questions') + fld('relevance', 1) + fld('application', 1) + fld('reference') + fld('operational') +
          '</div><div class="btn-row"><button type="button" class="btn btn-danger btn-sm" data-cm-del="' + r.id + '">' + esc(UI.cmDel) + '</button></div></details>';
      }).join('');
      box.innerHTML = '<div class="mx-head"><strong data-cm-count></strong><span class="spacer"></span><button type="button" class="btn btn-primary btn-sm" data-cm-act="add">' + esc(UI.cmAdd) + '</button><button type="button" class="btn btn-ghost btn-sm" data-cm-act="csv">' + esc(UI.cmCsv) + '</button><button type="button" class="btn btn-ghost btn-sm" data-cm-act="json">' + esc(UI.cmJson) + '</button>' +
        '<label class="btn btn-ghost btn-sm" for="' + fid + '">' + esc(UI.cmImport) + '</label><input type="file" id="' + fid + '" class="visually-hidden" accept=".csv,.json,text/csv,application/json" data-cm-file></div>' +
        (state.concepts.length ? '<div class="mx-list">' + rows + '</div>' : '<p class="hint mx-empty">' + esc(UI.cmEmpty) + '</p>');
      state.concepts.forEach((r) => CM_COLS.forEach((c) => { const n = $('[data-cm="' + r.id + ':' + c + '"]', box); if (n) n.value = r[c]; }));
    });
    const quant = kind() === 'survey' || kind() === 'qcontent';
    $$('[data-quant]').forEach((n) => { n.hidden = !quant; });
    $$('[data-cm-count]').forEach((n) => { n.textContent = UI.cmCount(num(state.concepts.filter((c) => filled(c.concept)).length)); });
    const qk = $('[data-quick]');
    if (qk) { const t = E.theoryById(state, RC, state.s5.primary), have = state.concepts.map((c) => E.norm(c.concept, RC.lang)); const cands = t ? t.text.concepts.filter((c) => have.indexOf(E.norm(c, RC.lang)) === -1) : []; qk.innerHTML = cands.length ? '<p class="small">' + esc(UI.cmQuick) + '</p><div class="stems">' + cands.map((c) => '<button type="button" class="chip-btn" data-cm-quick="' + attr(c) + '">+ ' + esc(c) + '</button>').join('') + '</div>' : ''; }
  }
  function cmAdd(name) { const r = cmRow({ concept: name || '', theory: name ? tname(state.s5.primary) : '' }); state.concepts.push(r); openRows.add(r.id); renderConcepts(); renderAlign(); onChange(); const n = $('[data-cm="' + r.id + ':' + (name ? 'definition' : 'concept') + '"]'); if (n) n.focus(); }
  function cmImport(file) {
    const rd = new FileReader();
    rd.onload = () => {
      try {
        let rows = []; const txt = String(rd.result || '');
        if (/^\s*[[{]/.test(txt)) { const j = JSON.parse(txt); rows = Array.isArray(j) ? j : (j && Array.isArray(j.concepts) ? j.concepts : []); }
        else { const t = E.parseCSV(txt); const head = t[0].map((h) => String(h).trim().toLowerCase()), map = {}; head.forEach((h, i) => { const kk = CM_COLS.find((c) => c === h || UI.cmCols[c].toLowerCase() === h); if (kk) map[i] = kk; }); if (!Object.keys(map).length) throw new Error('h'); rows = t.slice(1).map((r) => { const o = {}; Object.keys(map).forEach((i) => { o[map[i]] = r[i] || ''; }); return o; }); }
        rows = rows.filter((x) => x && typeof x === 'object' && CM_COLS.some((c) => filled(x[c]))); if (!rows.length) throw new Error('n');
        rows.forEach((x) => state.concepts.push(cmRow(Object.assign({}, x, { id: '' })))); state.concepts = state.concepts.slice(0, 60);
        renderConcepts(); renderAlign(); onChange(); toast(UI.cmImported(num(rows.length)));
      } catch (e) { toast(UI.cmImportFail); }
    };
    rd.readAsText(file);
  }

  /* ---------------- Tool D: alignment matrix ---------------- */
  function renderAlign() {
    $$('[data-align-table]').forEach((box) => {
      const k = box.dataset.alignTable, qs = questions(), cs = state.concepts.filter((c) => filled(c.concept));
      if (!qs.length) { box.innerHTML = '<p class="hint">' + esc(UI.alNoQ) + '</p>'; return; }
      box.innerHTML = '<div class="table-wrap"><table class="data al-table"><thead><tr>' + UI.alCols.map((c) => '<th scope="col">' + esc(c) + '</th>').join('') + '</tr></thead><tbody>' + qs.map((q, i) => {
        const r = state.s7[i] || {}, p = 'al-' + k + '-' + i;
        return '<tr><th scope="row"><strong>' + rq(i) + '</strong> <span dir="auto">' + esc(q) + '</span></th><td>' + (cs.length ? '<div class="radio-row">' + cs.map((c) => '<label class="radio-pill"><input type="checkbox" data-al-c="' + i + '" value="' + c.id + '"' + ((r.concepts || []).indexOf(c.id) !== -1 ? ' checked' : '') + '><span dir="auto">' + esc(c.concept) + '</span></label>').join('') + '</div>' : '<span class="hint">' + esc(UI.alNoC) + '</span>') + '</td>' +
          ['focus', 'evidence', 'procedure'].map((f) => '<td><label class="sr-only" for="' + p + '-' + f + '">' + esc(rq(i) + ' — ' + UI.alCols[['focus', 'evidence', 'procedure'].indexOf(f) + 2]) + '</label><textarea id="' + p + '-' + f + '" class="inp" rows="2" data-al="' + i + ':' + f + '" placeholder="' + attr(UI['al' + f.charAt(0).toUpperCase() + f.slice(1) + 'Ph'] || UI.alProcPh) + '"></textarea></td>').join('') + '</tr>';
      }).join('') + '</tbody></table></div>';
      qs.forEach((q, i) => ['focus', 'evidence', 'procedure'].forEach((f) => { const n = $('[data-al="' + i + ':' + f + '"]', box); if (n) n.value = (state.s7[i] || {})[f] || ''; }));
    });
  }
  const s7row = (i) => (state.s7[i] = state.s7[i] || { concepts: [], focus: '', evidence: '', procedure: '' });

  /* ---------------- Tool E: framework visualizer ---------------- */
  const NODE_COL = { problem: ['#FBF1DC', '#B07A12'], theory: ['#1F6F6B', '#1F6F6B'], concept: ['#E5F0EE', '#1F6F6B'], question: ['#EEF2F7', '#4E6E9E'], dimension: ['#F6EEF9', '#7A5C99'], method: ['#FFF', '#55625F'] };
  function svgMap(forExport) {
    const m = state.map, L = E.layout(m, 1000), P = L.pos, w = L.NW, h = L.NH;
    /* Arrows stop at the border of the target box so that the arrowhead stays visible. */
    const edge = (e) => {
      const a = P[e.from], b = P[e.to]; if (!a || !b) return '';
      const arrow = e.kind !== 'link', dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len;
      const d = Math.min(Math.abs(ux) > 1e-6 ? (w / 2) / Math.abs(ux) : Infinity, Math.abs(uy) > 1e-6 ? (h / 2) / Math.abs(uy) : Infinity) + 4;
      const x2 = arrow ? b.x - ux * d : b.x, y2 = arrow ? b.y - uy * d : b.y;
      return '<g class="e e-' + e.kind + '"><line x1="' + a.x.toFixed(1) + '" y1="' + a.y.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '"' + (arrow ? ' marker-end="url(#ah-' + e.kind + ')"' : '') + '/>' + (e.label ? '<text x="' + ((a.x + b.x) / 2).toFixed(1) + '" y="' + ((a.y + b.y) / 2 - 4).toFixed(1) + '" class="el">' + esc(e.label) + '</text>' : '') + '</g>';
    };
    const node = (n) => { const p = P[n.id], c = NODE_COL[n.type] || NODE_COL.concept, ls = E.wrap(n.label, n.type === 'question' || n.type === 'problem' ? 26 : 22, 3);
      return '<g class="n n-' + n.type + '" data-node="' + n.id + '" tabindex="0" role="img" aria-label="' + attr(RC.nodeTypes[n.type] + ': ' + n.label) + '" transform="translate(' + (p.x - w / 2) + ',' + (p.y - h / 2) + ')"><rect width="' + w + '" height="' + h + '" rx="12" fill="' + c[0] + '" stroke="' + c[1] + '"/>' +
        ls.map((t, i) => '<text x="' + w / 2 + '" y="' + (h / 2 + (i - (ls.length - 1) / 2) * 15 + 5) + '" text-anchor="middle"' + (n.type === 'theory' ? ' fill="#fff" font-weight="600"' : '') + '>' + esc(t) + '</text>').join('') + '</g>'; };
    const defs = '<defs>' + ['direction', 'causal'].map((k) => '<marker id="ah-' + k + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="' + (k === 'causal' ? 8 : 7) + '" markerHeight="' + (k === 'causal' ? 8 : 7) + '" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="' + (k === 'causal' ? '#8A2F1D' : '#1F6F6B') + '"/></marker>').join('') + '</defs>';
    const style = forExport ? '<style>text{font-family:Arial,sans-serif;font-size:12.5px;fill:#134846}.el{font-size:11px;fill:#7A5C22;text-anchor:middle}line{stroke:#9FBFB8;stroke-width:1.5}.e-direction line{stroke:#1F6F6B}.e-causal line{stroke:#8A2F1D;stroke-width:2.6}.n-theory text{fill:#fff}</style>' : '';
    return '<svg xmlns="http://www.w3.org/2000/svg" class="tf-map" viewBox="0 0 ' + L.W + ' ' + L.H + '" width="' + L.W + '" height="' + L.H + '" role="group" aria-label="' + attr(UI.mapAria) + '" direction="ltr">' + style + defs + '<rect width="' + L.W + '" height="' + L.H + '" fill="#fff"/>' + m.edges.map(edge).join('') + m.nodes.map(node).join('') + '</svg>';
  }
  function renderViz() {
    $$('[data-viz]').forEach((box) => {
      const k = box.dataset.viz, m = state.map, tsel = (v, attrs) => '<select class="inp" ' + attrs + '>' + E.NODE_ORDER.map((t) => '<option value="' + t + '"' + (t === v ? ' selected' : '') + '>' + esc(RC.nodeTypes[t]) + '</option>').join('') + '</select>';
      const nsel = (v, attrs) => '<select class="inp" ' + attrs + '>' + m.nodes.map((n) => '<option value="' + n.id + '"' + (n.id === v ? ' selected' : '') + '>' + esc(n.label.slice(0, 50)) + '</option>').join('') + '</select>';
      box.innerHTML = '<div class="viz-tools"><button type="button" class="btn btn-primary btn-sm" data-map-act="build">' + esc(UI.mapBuild) + '</button><div class="radio-row" role="group" aria-label="' + attr(UI.mapLayout) + '">' + RC.layouts.map((l) => '<label class="radio-pill" title="' + attr(l.d) + '"><input type="radio" name="lay-' + k + '" data-layout value="' + l.id + '"' + (m.layout === l.id ? ' checked' : '') + '><span>' + esc(l.t) + '</span></label>').join('') + '</div>' +
        '<button type="button" class="btn btn-ghost btn-sm" data-map-act="reset">' + esc(UI.mapReset) + '</button><button type="button" class="btn btn-ghost btn-sm" data-map-act="svg">' + esc(UI.mapSvg) + '</button></div><p class="hint">' + esc(UI.mapHint) + '</p>' +
        '<div class="viz-wrap" data-viz-canvas>' + (m.nodes.length ? svgMap(false) : '<p class="hint">' + esc(UI.mapEmpty) + '</p>') + '</div>' +
        '<details class="refine-box"><summary class="h4">' + esc(UI.mapNodes) + ' (' + num(m.nodes.length) + ')</summary><div class="stack">' + m.nodes.map((n) => '<div class="kw-row viz-row"><div class="field"><label class="sr-only" for="nt-' + k + n.id + '">' + esc(UI.mapType) + '</label>' + tsel(n.type, 'id="nt-' + k + n.id + '" data-node-type="' + n.id + '"') + '</div><div class="field"><label class="sr-only" for="nl-' + k + n.id + '">' + esc(UI.mapLabel) + '</label><input id="nl-' + k + n.id + '" class="inp" data-node-label="' + n.id + '" value="' + attr(n.label) + '"></div><button type="button" class="btn btn-danger btn-sm" data-node-del="' + n.id + '" aria-label="' + attr(UI.mapDel + ': ' + n.label) + '">×</button></div>').join('') +
        '<button type="button" class="btn btn-ghost btn-sm" data-map-act="addnode">' + esc(UI.mapAddNode) + '</button></div></details>' +
        '<details class="refine-box"><summary class="h4">' + esc(UI.mapEdges) + ' (' + num(m.edges.length) + ')</summary><div class="stack">' + m.edges.map((e) => '<div class="kw-row viz-erow"><div class="field">' + nsel(e.from, 'data-edge="' + e.id + ':from" aria-label="' + attr(UI.mapFrom) + '"') + '</div><div class="field">' + nsel(e.to, 'data-edge="' + e.id + ':to" aria-label="' + attr(UI.mapTo) + '"') + '</div><div class="field"><select class="inp" data-edge="' + e.id + ':kind" aria-label="' + attr(UI.mapKind) + '">' + RC.edgeKinds.map((x) => '<option value="' + x.id + '"' + (x.id === e.kind ? ' selected' : '') + '>' + esc(x.t) + '</option>').join('') + '</select></div><div class="field"><input class="inp" data-edge="' + e.id + ':label" value="' + attr(e.label) + '" placeholder="' + attr(UI.mapEdgeLabel) + '" aria-label="' + attr(UI.mapEdgeLabel) + '"></div>' + '<button type="button" class="btn btn-danger btn-sm" data-edge-del="' + e.id + '" aria-label="' + attr(UI.mapDel) + '">×</button></div>').join('') +
        (m.nodes.length >= 2 ? '<button type="button" class="btn btn-ghost btn-sm" data-map-act="addedge">' + esc(UI.mapAddEdge) + '</button>' : '') + '</div></details>';
      const det = $$('details', box); det.forEach((d, i) => { if (vizOpen[k + i]) d.open = true; d.addEventListener('toggle', () => { vizOpen[k + i] = d.open; }); });
    });
  }
  const vizOpen = {};
  function redrawCanvas() { $$('[data-viz-canvas]').forEach((c) => { c.innerHTML = state.map.nodes.length ? svgMap(false) : '<p class="hint">' + esc(UI.mapEmpty) + '</p>'; }); }
  function initDrag() {
    let drag = null;
    document.addEventListener('pointerdown', (e) => {
      const g = e.target.closest && e.target.closest('svg.tf-map g.n'); if (!g) return;
      const svg = g.ownerSVGElement, n = state.map.nodes.find((x) => x.id === g.dataset.node); if (!n) return;
      const L = E.layout(state.map, 1000), p = L.pos[n.id];
      drag = { n, svg, g, w: L.NW, h: L.NH, ox: p.x, oy: p.y, sx: e.clientX, sy: e.clientY, m: svg.getScreenCTM() };
      try { g.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ } e.preventDefault();
    });
    document.addEventListener('pointermove', (e) => {
      if (!drag) return; const k = drag.m ? drag.m.a : 1;
      drag.n.x = drag.ox + (e.clientX - drag.sx) / k; drag.n.y = drag.oy + (e.clientY - drag.sy) / k; drag.n.manual = true;
      drag.g.setAttribute('transform', 'translate(' + (drag.n.x - drag.w / 2) + ',' + (drag.n.y - drag.h / 2) + ')');
    });
    document.addEventListener('pointerup', () => { if (drag) { drag = null; redrawCanvas(); onChange(); } });
    document.addEventListener('keydown', (e) => {
      const g = e.target.closest && e.target.closest('svg.tf-map g.n'); if (!g) return;
      const d = { ArrowLeft: [-10, 0], ArrowRight: [10, 0], ArrowUp: [0, -10], ArrowDown: [0, 10] }[e.key]; if (!d) return;
      e.preventDefault(); const n = state.map.nodes.find((x) => x.id === g.dataset.node); if (!n) return; const p = E.layout(state.map, 1000).pos[n.id];
      n.x = p.x + d[0]; n.y = p.y + d[1]; n.manual = true; redrawCanvas(); onChange(); const ng = $('svg.tf-map g.n[data-node="' + n.id + '"]'); if (ng) ng.focus();
    });
  }
  function buildMap() { const keep = state.map.layout; state.map = E.buildMap(state, RC, RC.lang); state.map.layout = keep; renderViz(); onChange(); }

  /* ---------------- Binding ---------------- */
  function syncBound(path, src) { $$('[data-bind="' + path + '"]').forEach((n) => { if (n !== src && n.value !== getPath(state, path)) n.value = getPath(state, path) || ''; }); }
  function bind() {
    document.addEventListener('input', (e) => {
      const t = e.target;
      if (t.matches('[data-bind]')) {
        setPath(state, t.dataset.bind, t.value); syncBound(t.dataset.bind, t);
        if (t.dataset.draft) state.s10.draftEdited = true;
        if (t.getAttribute('aria-invalid') === 'true' && filled(t.value)) clearErr(t);
        if (t.dataset.bind === 's1.questions') renderAlign();
        if (/^s10\.(history|assumptions|applications|debates|synthesis)$/.test(t.dataset.bind)) { afterSections(); return; }
        if (t.dataset.bind === 's3.customName') { const has0 = filled(t.value), i = state.s3.shortlist.indexOf('custom'); if (has0 && i === -1) state.s3.shortlist.push('custom'); if (!has0 && i !== -1) state.s3.shortlist.splice(i, 1); renderExplorer(); }
        onChange();
      }
      else if (t.matches('[data-cm]')) { const [id, c] = t.dataset.cm.split(':'), r = state.concepts.find((x) => x.id === id); if (!r) return; r[c] = t.value; $$('[data-cm="' + t.dataset.cm + '"]').forEach((n) => { if (n !== t) n.value = t.value; }); if (c === 'concept') { $$('[data-cm-sum="' + id + '"]').forEach((n) => { n.textContent = t.value; }); clearTimeout(bind._a); bind._a = setTimeout(renderAlign, 400); } onChange(); }
      else if (t.matches('[data-rel]')) { state.s4.rel[t.dataset.rel] = t.value; onChange(); }
      else if (t.matches('[data-al]')) { const [i, f] = t.dataset.al.split(':'); s7row(i)[f] = t.value; $$('[data-al="' + t.dataset.al + '"]').forEach((n) => { if (n !== t) n.value = t.value; }); onChange(); }
      else if (t.matches('[data-node-label]')) { const n = state.map.nodes.find((x) => x.id === t.dataset.nodeLabel); if (n) { n.label = t.value; redrawCanvas(); onChange(); } }
      else if (t.matches('input[data-edge]')) { const [id, f] = t.dataset.edge.split(':'), ed = state.map.edges.find((x) => x.id === id); if (ed) { ed[f] = t.value; redrawCanvas(); onChange(); } }
      else if (t.matches('[data-sec]')) { const id = t.dataset.sec; state.s10.text[id] = t.value; state.s10.edited[id] = true; afterSections(); }
      else if (t.matches('[data-exf]')) { const [k, f] = t.dataset.exf.split(':'); exFilters[k][f] = t.value; renderExplorer(); }
      else if (t.matches('#lc-text')) renderLangTool();
      else if (t.matches('#gloss-search')) filterGlossary();
    });
    document.addEventListener('change', (e) => {
      const t = e.target;
      if (t.matches('select[data-bind]')) {
        setPath(state, t.dataset.bind, t.value); syncBound(t.dataset.bind, t); clearErr(t);
        if (t.dataset.bind === 's1.design') renderConcepts();
        if (t.dataset.bind === 's5.primary') { state.s5.secondary = state.s5.secondary.filter((x) => x !== t.value); renderDynSelects(); renderConcepts(); }
        onChange(); renderExplorer();
      }
      else if (t.matches('select[data-exf]')) { const [k, f] = t.dataset.exf.split(':'); exFilters[k][f] = t.value; renderExplorer(); }
      else if (t.matches('select[data-rate]')) { state.s4.rate[t.dataset.rate] = t.value; onChange(); }
      else if (t.matches('input[data-cmp]')) { const a = state.ui.cmp, i = a.indexOf(t.value); if (t.checked && i === -1 && a.length < 4) a.push(t.value); else if (!t.checked && i !== -1) a.splice(i, 1); renderCompare(); save(); }
      else if (t.matches('input[data-al-c]')) { const r = s7row(t.dataset.alC), i = r.concepts.indexOf(t.value); if (t.checked && i === -1) r.concepts.push(t.value); else if (!t.checked && i !== -1) r.concepts.splice(i, 1); $$('input[data-al-c="' + t.dataset.alC + '"][value="' + t.value + '"]').forEach((x) => { x.checked = t.checked; }); onChange(); }
      else if (t.matches('input[data-layout]')) { state.map.layout = t.value; renderViz(); onChange(); }
      else if (t.matches('select[data-node-type]')) { const n = state.map.nodes.find((x) => x.id === t.dataset.nodeType); if (n) { n.type = t.value; redrawCanvas(); onChange(); } }
      else if (t.matches('select[data-edge]')) { const [id, f] = t.dataset.edge.split(':'), ed = state.map.edges.find((x) => x.id === id); if (ed) { ed[f] = t.value; redrawCanvas(); onChange(); } }
      else if (t.matches('input[data-cm-file]')) { if (t.files[0]) cmImport(t.files[0]); t.value = ''; }
      else if (t.matches('input[data-multi]')) {
        const arr = getPath(state, t.dataset.multi), i = arr.indexOf(t.value); if (t.checked && i === -1) arr.push(t.value); else if (!t.checked && i !== -1) arr.splice(i, 1);
        $$('input[data-multi="' + t.dataset.multi + '"][value="' + t.value + '"]').forEach((x) => { x.checked = t.checked; });
        if (t.dataset.multi === 's2.focus') { if (state.s2.focus.indexOf(state.s2.primary) === -1) state.s2.primary = state.s2.focus[0] || ''; renderDynSelects(); renderExplorer(); }
        onChange();
      }
      else if (t.matches('input[data-rub]')) { state.s11.scores[t.dataset.rub] = Number(t.value); onChange(); }
      else if (t.matches('input[data-on]')) { state.s10.on[t.dataset.on] = t.checked; renderComposer(); afterSections(); }
    });
    document.addEventListener('toggle', (e) => { const d = e.target; if (d.matches && d.matches('details.mx-row')) { if (d.open) openRows.add(d.dataset.row); else openRows.delete(d.dataset.row); } }, true);
    document.addEventListener('click', (e) => {
      const t = e.target.closest('button, a'); if (!t) return;
      if (t.dataset.pick) { setPath(state, t.dataset.pick, t.dataset.id); clearErr(t); if (t.dataset.pick === 's1.approach') { const d = RC.designs.find((x) => x.id === state.s1.design); if (d && d.a !== state.s1.approach) state.s1.design = ''; renderDynSelects(); } onChange(); renderExplorer(); }
      else if (t.dataset.short) { const a = state.s3.shortlist, i = a.indexOf(t.dataset.short); if (i === -1) a.push(t.dataset.short); else { a.splice(i, 1); if (state.s5.primary === t.dataset.short) state.s5.primary = ''; state.s5.secondary = state.s5.secondary.filter((x) => x !== t.dataset.short); } renderExplorer(); renderCompare(); renderDynSelects(); onChange(); }
      else if (t.dataset.copyBind) { copyText(String(getPath(state, t.dataset.copyBind) || '')).then(() => toast(UI.copied), () => toast(UI.copyFail)); }
      else if (t.dataset.move) moveSection(t.dataset.move, Number(t.dataset.dir));
      else if (t.dataset.resetSec) { const id = t.dataset.resetSec; state.s10.edited[id] = false; state.s10.text[id] = ''; renderComposer(); afterSections(); toast(UI.sectionReset); }
      else if (t.dataset.cmAct === 'add') cmAdd('');
      else if (t.dataset.cmQuick) cmAdd(t.dataset.cmQuick);
      else if (t.dataset.cmAct === 'csv') download(UI.fileConcepts + '.csv', ['﻿', E.toCSV(state.concepts, CM_COLS)], 'text/csv;charset=utf-8');
      else if (t.dataset.cmAct === 'json') download(UI.fileConcepts + '.json', [JSON.stringify(state.concepts.map((r) => { const o = {}; CM_COLS.forEach((c) => { o[c] = r[c]; }); return o; }), null, 2)], 'application/json');
      else if (t.dataset.mapAct === 'build') { if (state.map.nodes.length && t.dataset.armed !== '1') { const o = t.textContent; t.dataset.armed = '1'; t.textContent = UI.mapBuildConfirm; setTimeout(() => { if (t.isConnected) { t.dataset.armed = ''; t.textContent = o; } }, 4000); return; } buildMap(); toast(UI.mapBuilt); }
      else if (t.dataset.mapAct === 'reset') { state.map.nodes.forEach((n) => { n.manual = false; }); redrawCanvas(); onChange(); }
      else if (t.dataset.mapAct === 'svg') download(UI.fileMap + '.svg', [svgMap(true)], 'image/svg+xml');
      else if (t.dataset.mapAct === 'addnode') { state.map.nodes.push({ id: uid(), type: 'concept', label: RC.nodeTypes.concept, key: '', manual: false, x: 0, y: 0 }); vizOpen[t.closest('[data-viz]').dataset.viz + '0'] = true; renderViz(); onChange(); }
      else if (t.dataset.mapAct === 'addedge') { const ns = state.map.nodes; state.map.edges.push({ id: uid(), from: ns[0].id, to: ns[1].id, kind: 'link', label: '' }); vizOpen[t.closest('[data-viz]').dataset.viz + '1'] = true; renderViz(); onChange(); }
      else if (t.dataset.nodeDel) { const id = t.dataset.nodeDel; state.map.nodes = state.map.nodes.filter((n) => n.id !== id); state.map.edges = state.map.edges.filter((x) => x.from !== id && x.to !== id); renderViz(); onChange(); }
      else if (t.dataset.edgeDel) { state.map.edges = state.map.edges.filter((x) => x.id !== t.dataset.edgeDel); renderViz(); onChange(); }
      else if (t.dataset.gotoStep) { e.preventDefault(); goTo(Math.min(Number(t.dataset.gotoStep), state.maxStep + 1), true); }
      else if (t.dataset.useTool) { const src = $('#' + t.dataset.useTool); if (src) { src.value = state.s10.draft || ''; src.dispatchEvent(new Event('input', { bubbles: true })); } }
      else if (t.dataset.cmDel) {
        if (t.dataset.armed !== '1') { const o = t.textContent; t.dataset.armed = '1'; t.textContent = UI.confirmDel; setTimeout(() => { if (t.isConnected) { t.dataset.armed = ''; t.textContent = o; } }, 4000); return; }
        const id = t.dataset.cmDel; state.concepts = state.concepts.filter((x) => x.id !== id); Object.keys(state.s7).forEach((i) => { state.s7[i].concepts = state.s7[i].concepts.filter((c) => c !== id); }); renderConcepts(); renderAlign(); onChange();
      }
    });
  }
  function fillInputs() {
    renderDynSelects();
    $$('[data-bind]').forEach((inp) => { const v = getPath(state, inp.dataset.bind); inp.value = v == null ? '' : v; });
    $$('input[data-multi]').forEach((i) => { i.checked = getPath(state, i.dataset.multi).indexOf(i.value) !== -1; });
    $$('input[data-rub]').forEach((i) => { i.checked = state.s11.scores[i.dataset.rub] === Number(i.value); });
    renderExplorer(); renderCompare(); renderConcepts(); renderAlign(); renderViz(); renderComposer();
  }

  /* ---------------- Validation ---------------- */
  const fieldOf = (n) => n.closest('.field, fieldset, .choice-group') || n.parentElement;
  function setErr(n, m) { const f = fieldOf(n), i = f.querySelector('.inp'); if (i) i.setAttribute('aria-invalid', 'true'); const e = f.querySelector('.err'); if (e) e.textContent = m; }
  function clearErr(n) { const f = fieldOf(n); if (!f) return; const i = f.querySelector('.inp'); if (i) i.removeAttribute('aria-invalid'); const e = f.querySelector('.err'); if (e) e.textContent = ''; }
  function validateStep(i, show) {
    const el = $('.step[data-step="' + i + '"]'); if (!el) return true;
    let ok = true, first = null;
    const fail = (n, m) => { ok = false; if (show) { if (n.classList.contains('err')) n.textContent = m; else setErr(n, m); if (!first) first = n; } };
    const clr = (sel) => { if (show) { const n = $(sel); if (n) n.textContent = ''; } };
    $$('[data-required]', el).forEach((inp) => { if (inp.closest('[hidden]')) return; const v = getPath(state, inp.dataset.bind), min = Number(inp.dataset.minwords || 0); if (!filled(v)) fail(inp, UI.required); else if (min && E.wc(v) < min) fail(inp, UI.tooShort(num(min))); else if (show) clearErr(inp); });
    $$('[data-required-pick]', el).forEach((g) => { if (!getPath(state, g.dataset.requiredPick)) fail(g, UI.chooseOne); });
    if (i === 1) { if (!state.s2.focus.length) fail($('#err-focus'), UI.needFocus); else clr('#err-focus'); }
    if (i === 2) { if (!state.s3.shortlist.length) fail($('#err-short'), UI.needShort); else clr('#err-short'); }
    if (i === 3) { if (!state.s3.shortlist.length || state.s3.shortlist.some((id) => E.wc(state.s4.rel[id]) < 4)) fail($('#err-rel'), UI.needRel); else clr('#err-rel'); }
    if (i === 4 && state.s5.secondary.length && !filled(state.s5.combine)) { const n = $('#f-s5-combine'); if (n) fail(n, UI.required); }
    if (i === 5) { if (state.concepts.filter((c) => filled(c.concept) && filled(c.definition)).length < 2) fail($('#err-cm'), UI.needConcepts); else clr('#err-cm'); }
    if (i === 6) { const qs = questions(), ids = state.concepts.map((c) => c.id); if (!qs.length || qs.some((q, k) => !((state.s7[k] || {}).concepts || []).some((c) => ids.indexOf(c) !== -1))) fail($('#err-al'), UI.needAlign); else clr('#err-al'); }
    if (i === 8) { if (state.map.nodes.length < 3) fail($('#err-map'), UI.needMap); else clr('#err-map'); }
    if (i === 9) { if (!filled(state.s10.draft)) fail($('#err-draft'), UI.needDraft); else clr('#err-draft'); }
    if (show) { $('#form-alert').hidden = ok; if (!ok) { $('#form-alert').textContent = UI.fixErrors; const f = first.matches && first.matches('.inp, textarea, input, select') ? first : (first.querySelector ? first.querySelector('input, button, textarea, select') : null) || $('#form-alert'); if (f && f.focus) f.focus(); } }
    return ok;
  }

  /* ---------------- Wizard ---------------- */
  function goTo(i, focus) {
    i = Math.max(0, Math.min(STEPS - 1, i));
    state.step = i; state.maxStep = Math.max(state.maxStep, i);
    $$('.step').forEach((s) => { s.hidden = Number(s.dataset.step) !== i; });
    $('#form-alert').hidden = true;
    $('#btn-prev').hidden = i === 0; $('#btn-next').hidden = i === STEPS - 1;
    $('#btn-next').textContent = i === STEPS - 2 ? UI.finish : UI.next;
    if (i === 3) renderCompare();
    if (i === 4) renderDynSelects();
    if (i === 5) renderConcepts();
    if (i === 6) renderAlign();
    if (i === 8) { if (!state.map.nodes.length) buildMap(); else renderViz(); }
    if (i === 9) { renderComposer(); if (!state.s10.draftEdited || !filled(state.s10.draft)) rebuildDraft(); }
    if (i === 11) { if (!filled(state.s12.final)) { state.s12.final = state.s10.draft; syncBound('s12.final'); } renderReport(false); }
    renderStepper(); refresh();
    if (focus) { const h = $('.step[data-step="' + i + '"] h3'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); $('#builder').scrollIntoView({ block: 'start' }); } }
    save();
  }
  function renderStepper() {
    const box = $('#stepper'); box.innerHTML = '';
    RC.steps.forEach((t, i) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'stepdot';
      b.innerHTML = '<span class="num">' + RC.numerals[i] + '</span><span>' + esc(t) + '</span>';
      if (i === state.step) b.setAttribute('aria-current', 'step');
      b.addEventListener('click', () => { if (i > state.step) { for (let k = state.step; k < i; k++) { if (!validateStep(k, k === state.step)) { if (k !== state.step) goTo(k, true); return; } } } goTo(i, true); });
      box.appendChild(b);
    });
    stepperStatus();
    $('#progress-bar').style.width = ((state.step + 1) / STEPS * 100) + '%';
    $('#step-count').textContent = UI.stepOf(RC.numerals[state.step], RC.numerals[STEPS - 1]);
  }
  function stepperStatus() { $$('#stepper .stepdot').forEach((b, i) => { b.classList.toggle('done', i < state.step && validateStep(i, false)); b.disabled = i > state.maxStep + 1 || (i === state.maxStep + 1 && !validateStep(state.maxStep, false)); }); }

  /* ---------------- Step 10: composer ---------------- */
  function renderComposer() {
    const box = $('#composer'); if (!box) return;
    box.innerHTML = state.s10.order.map((id, i) => {
      const on = state.s10.on[id], n = E.wc(E.sectionText(id, state, RC));
      return '<div class="comp-row' + (on ? '' : ' off') + '" data-row="' + id + '"><div class="comp-head"><label class="radio-pill"><input type="checkbox" data-on="' + id + '"' + (on ? ' checked' : '') + '><span>' + RC.numerals[i] + '. ' + esc(RC.sectionNames[id]) + '</span></label><span class="spacer"></span><span class="wc" data-sec-wc="' + id + '">' + esc(UI.words(num(n))) + '</span>' +
        '<button type="button" class="btn btn-ghost btn-sm" data-move="' + id + '" data-dir="-1"' + (i === 0 ? ' disabled' : '') + ' aria-label="' + attr(UI.moveUp + ': ' + RC.sectionNames[id]) + '">↑</button><button type="button" class="btn btn-ghost btn-sm" data-move="' + id + '" data-dir="1"' + (i === state.s10.order.length - 1 ? ' disabled' : '') + ' aria-label="' + attr(UI.moveDown + ': ' + RC.sectionNames[id]) + '">↓</button>' +
        (state.s10.edited[id] ? '<button type="button" class="btn btn-ghost btn-sm" data-reset-sec="' + id + '">' + esc(UI.resetSection) + '</button>' : '') + '</div><label class="sr-only" for="sec-' + id + '">' + esc(RC.sectionNames[id]) + '</label><textarea id="sec-' + id + '" class="inp" data-sec="' + id + '" placeholder="' + attr(UI.sectionEmpty) + '"></textarea><span class="hint">' + esc(RC.sectionHints[id]) + '</span></div>';
    }).join('');
    state.s10.order.forEach((id) => { const n = $('#sec-' + id); if (n) n.value = E.sectionText(id, state, RC); });
  }
  function moveSection(id, dir) { const o = state.s10.order, i = o.indexOf(id), j = i + dir; if (j < 0 || j >= o.length) return; o[i] = o[j]; o[j] = id; renderComposer(); afterSections(); const b = $('[data-move="' + id + '"][data-dir="' + dir + '"]'); if (b && !b.disabled) b.focus(); }
  function afterSections() { state.s10.order.forEach((id) => { const n = $('[data-sec-wc="' + id + '"]'); if (n) n.textContent = UI.words(num(E.wc(E.sectionText(id, state, RC)))); }); if (!state.s10.draftEdited) rebuildDraft(); else noteDraft(); onChange(); }
  function rebuildDraft() { state.s10.draft = E.assemble(state, RC); state.s10.draftEdited = false; syncBound('s10.draft'); noteDraft(); }
  function noteDraft() { $$('[data-draft-note]').forEach((n) => { n.textContent = state.s10.draftEdited ? UI.draftEditedNote : UI.draftAutoNote; }); }

  /* ---------------- Outputs and diagnostics ---------------- */
  function refreshOutputs() {
    const set = (id, txt) => { const n = $('#' + id); if (n) n.textContent = txt; };
    set('out-0', RC.tpl.profile(state)); set('out-1', RC.tpl.need(state));
    set('out-2', state.s3.shortlist.map((id, i) => RC.numerals[i] + '. ' + tname(id)).join('\n'));
    set('out-4', [RC.tpl.intro(state, E.ctx(state, RC)), RC.tpl.justification(state)].filter(filled).join('\n'));
    set('out-7', RC.tpl.methodStmt(state));
    $$('[data-show="combine"]').forEach((f) => { f.hidden = !state.s5.secondary.length; });
  }
  function pathwayKey() {
    const p = state.s5.primary, k = kind();
    if (p === 'semiology' || p === 'metz') return 'semiotic'; if (p === 'feminist' || p === 'psycho') return 'feminist'; if (p === 'encoding' || p === 'reception' || p === 'cultstudies') return k === 'survey' ? 'survey' : 'reception'; if (p === 'narrative' || p === 'genre') return 'narrative';
    return { textual: 'semiotic', interview: 'reception', survey: 'survey', qcontent: 'survey', mixed: 'mixed', critical: 'critical' }[k] || 'critical';
  }
  function stepDiag() {
    const d = (sel, M, list) => { $$(sel).forEach((n) => { n.innerHTML = diagList(M, list); }); };
    d('#diag-1', RC.needMsg, E.needChecks(state, RC));
    d('#diag-4', RC.selectMsg, E.selectChecks(state, RC));
    d('#diag-5', RC.conceptMsg, E.conceptChecks(state, RC));
    d('[data-align]', RC.alignMsg, E.alignChecks(state, RC));
    d('[data-map-diag]', RC.mapMsg, E.mapChecks(state, RC));
    const pw = $('[data-pathway]'); if (pw) { const p = RC.pathways[pathwayKey()]; pw.innerHTML = '<strong>' + esc(UI.pathwayFor(p.t)) + '</strong><ol class="list small">' + p.items.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ol>'; }
  }
  function renderChecker() {
    const box = $('#checker'); if (!box) return;
    const list = E.checks(state, RC), order = { bad: 0, warn: 1, info: 2, ok: 3 }; list.sort((a, b) => order[a.status] - order[b.status]);
    box.innerHTML = list.map((c) => diagItem(c.t, c.status, c.msg)).join('');
    $('#checker-summary').textContent = ['bad', 'warn', 'ok'].map((k) => RC.statusLabel[k] + ': ' + num(list.filter((c) => c.status === k).length)).join(' · ');
  }
  function scoreSummary() { const sc = state.s11.scores, rated = RC.rubric.filter((c) => sc[c.id]); const mean = rated.length ? rated.reduce((a, c) => a + sc[c.id], 0) / rated.length : 0; return { sc, rated, mean, lvl: RC.levels.find((l) => mean >= l.min) || RC.levels[RC.levels.length - 1] }; }
  function renderResult() {
    const box = $('#rubric-result'); if (!box) return;
    const { sc, rated, mean, lvl } = scoreSummary(), recs = RC.rubric.filter((c) => sc[c.id] && sc[c.id] <= 3).map((c) => '<li><strong>' + esc(c.t) + ':</strong> ' + esc(RC.rubricRec[c.id]) + '</li>');
    box.innerHTML = '<span class="small" style="color:#BDB6A4">' + esc(UI.overall) + '</span><span class="big">' + (rated.length ? fmt1(mean) : '—') + ' <span style="font-size:22px">' + esc(UI.outOf5) + '</span></span>' + (rated.length ? '<span class="lvl">' + esc(lvl.t) + '</span><span class="small">' + esc(lvl.d) + '</span>' : '') +
      '<div class="bars">' + RC.rubric.map((c) => '<div class="bar-row"><span>' + esc(c.t) + '</span><span class="bar" aria-hidden="true"><span style="width:' + ((sc[c.id] || 0) * 20) + '%"></span></span><span>' + (sc[c.id] ? RC.numerals[sc[c.id] - 1] : '—') + '</span></div>').join('') + '</div>' +
      (rated.length ? '<div><strong style="color:var(--gold-light)">' + esc(UI.recommendations) + '</strong>' + (recs.length ? '<ul class="list small">' + recs.join('') + '</ul>' : '<p class="small">' + esc(UI.noRecs) + '</p>') + '</div>' : '<p class="small">' + esc(UI.notRated) + '</p>');
  }

  /* ---------------- Step 12: report ---------------- */
  function buildReportHTML() {
    const R = UI.report, L = UI.lbl, s = state, X = E.ctx(s, RC);
    const p = (x) => '<p>' + esc(filled(x) ? x : UI.empty) + '</p>', pre = (x) => '<p style="white-space:pre-line">' + esc(filled(x) ? x : UI.empty) + '</p>';
    const kv = (pairs) => { const r = pairs.filter((x) => filled(x[1])); return r.length ? '<ul>' + r.map((x) => '<li><strong>' + esc(x[0]) + ':</strong> ' + esc(x[1]) + '</li>').join('') + '</ul>' : p(''); };
    const tbl = (cols, rows) => '<table><thead><tr>' + cols.map((c) => '<th>' + esc(c) + '</th>').join('') + '</tr></thead><tbody>' + rows.map((r) => '<tr>' + r.map((c) => '<td>' + esc(c) + '</td>').join('') + '</tr>').join('') + '</tbody></table>';
    const { sc, rated, mean, lvl } = scoreSummary(), date = new Date().toLocaleDateString(AR ? 'ar-SA' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
    let h = '<h2>' + esc(R.title) + '</h2><p class="meta">' + esc(R.generated(date)) + '</p>';
    h += '<h3>' + esc(R.context) + '</h3><p><strong>' + esc(s.s1.title || UI.empty) + '</strong></p>' + pre(RC.tpl.profile(s));
    h += '<h3>' + esc(R.need) + '</h3>' + p(RC.tpl.need(s));
    h += '<h3>' + esc(R.selected) + '</h3>' + p([tname(s.s5.primary), s.s5.secondary.map(tname).join(RC.sep)].filter(filled).join(' + '));
    if (s.s3.shortlist.length) { const ps = E.pairsFor(s.s3.shortlist); h += '<h3>' + esc(R.comparison) + '</h3>' + tbl([UI.fType, UI.cmpRel, UI.cmpRate], s.s3.shortlist.map((id) => [tname(id), s.s4.rel[id] || '', label(RC.rateOpts, s.s4.rate[id])])) + (ps.length ? '<ul>' + ps.map((q) => '<li>' + esc(RC.pairKind[q.kind] + ' — ' + tname(q.a) + ' / ' + tname(q.b) + ': ' + RC.pairText[q.key]) + '</li>').join('') + '</ul>' : ''); }
    h += '<h3>' + esc(R.justification) + '</h3>' + kv([[L.relevance, s.s5.relevance], [L.problem, s.s5.problem], [L.aspects, s.s5.aspects], [L.alternatives, s.s5.alternatives], [L.method, s.s5.method], [L.combine, s.s5.secondary.length ? s.s5.combine : '']]);
    const cs = s.concepts.filter((c) => filled(c.concept));
    h += '<h3>' + esc(R.concepts) + '</h3>' + (cs.length ? tbl(['concept', 'definition', 'source', 'theory', 'application', 'reference'].map((c) => UI.cmCols[c]), cs.map((c) => [c.concept, c.definition, c.source, c.theory, c.application, c.reference])) : p(''));
    const qs = questions();
    h += '<h3>' + esc(R.alignment) + '</h3>' + (qs.length ? tbl(UI.alCols, qs.map((q, i) => { const r = s.s7[i] || {}; return [rq(i) + ' ' + q, (r.concepts || []).map(X.concept).filter(filled).join(RC.sep), r.focus || '', r.evidence || '', r.procedure || '']; })) : p(''));
    h += '<h3>' + esc(R.method) + '</h3>' + kv([[L.design, s.s8.design], [L.collection, s.s8.collection], [L.selection, s.s8.selection], [L.categories, E.lines(s.s8.categories).join(RC.sep)], [L.interpretation, s.s8.interpretation], [L.presentation, s.s8.presentation]]);
    if (s.map.nodes.length) {
      h += '<h3>' + esc(R.map) + '</h3><p><img class="map-img" alt="' + attr(UI.mapAria) + '" src="data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgMap(true)) + '"></p>';
      const nm = (id) => (s.map.nodes.find((n) => n.id === id) || {}).label || '';
      h += '<p><strong>' + esc(R.mapRel) + '</strong></p><ul>' + s.map.edges.map((e) => '<li>' + esc(nm(e.from) + ' — ' + (e.label || label(RC.edgeKinds, e.kind)) + ' — ' + nm(e.to)) + '</li>').join('') + '</ul>';
    }
    h += '<h3>' + esc(R.draft) + '</h3>' + pre(s.s10.draft);
    h += '<h3>' + esc(R.evaluation) + '</h3>' + (rated.length ? '<ul>' + RC.rubric.map((cr) => '<li>' + esc(cr.t) + ': ' + (sc[cr.id] ? RC.numerals[sc[cr.id] - 1] + ' ' + esc(UI.outOf5) : esc(UI.notRated)) + '</li>').join('') + '</ul><p><strong>' + esc(UI.overall) + ':</strong> ' + esc(fmt1(mean)) + ' ' + esc(UI.outOf5) + ' — ' + esc(lvl.t) + '</p>' : p(UI.notRated)) + (filled(s.s11.self) ? '<p><strong>' + esc(R.self) + ':</strong> ' + esc(s.s11.self) + '</p>' : '') + '<p><em>' + esc(UI.evalDisclaimer) + '</em></p>';
    const recs = []; RC.rubric.forEach((cr) => { if (sc[cr.id] && sc[cr.id] <= 3) recs.push(cr.t + ': ' + RC.rubricRec[cr.id]); }); E.checks(s, RC).forEach((x) => { if (x.status === 'bad' || x.status === 'warn') recs.push(x.t + ': ' + x.msg); });
    h += '<h3>' + esc(R.recs) + '</h3>' + (recs.length ? '<ul>' + [...new Set(recs)].map((r) => '<li>' + esc(r) + '</li>').join('') + '</ul>' : p(R.noRecs));
    h += '<h3>' + esc(R.final) + '</h3>' + pre(s.s12.final);
    const seen = {}, refs = [];
    E.lines(s.s12.refs).forEach((r) => { const k = E.norm(r, RC.lang); if (!seen[k]) { seen[k] = 1; refs.push(r); } });
    h += '<h3>' + esc(R.refs) + '</h3>' + (refs.length ? '<ul>' + refs.sort((a, b) => a.localeCompare(b)).map((r) => '<li>' + esc(r) + '</li>').join('') + '</ul>' : p(R.noRefs));
    const lib = [...new Set([].concat.apply([], E.selected(s).map((id) => (E.theoryById(s, RC, id) || { refs: [] }).refs)))];
    if (lib.length) h += '<h3>' + esc(R.libRefs) + '</h3><ul>' + lib.map((r) => '<li>' + esc(r) + '</li>').join('') + '</ul>';
    if (filled(s.s12.notes)) h += '<h3>' + esc(R.notes) + '</h3>' + pre(s.s12.notes);
    h += '<p class="meta">' + esc(R.footer) + '</p>';
    return h;
  }
  function sanitize(html) {
    const doc = new DOMParser().parseFromString('<div>' + html + '</div>', 'text/html');
    const ok = ['DIV', 'P', 'H2', 'H3', 'H4', 'UL', 'OL', 'LI', 'STRONG', 'B', 'EM', 'I', 'BR', 'SPAN', 'U', 'TABLE', 'THEAD', 'TBODY', 'TR', 'TH', 'TD', 'IMG'];
    const walk = (n) => Array.from(n.children).forEach((c) => {
      if (ok.indexOf(c.tagName) === -1) { c.replaceWith(document.createTextNode(c.textContent)); return; }
      if (c.tagName === 'IMG' && !/^data:image\/svg\+xml/.test(c.getAttribute('src') || '')) { c.remove(); return; }
      Array.from(c.attributes).forEach((a) => { const keep = a.name === 'class' || (a.name === 'style' && /^white-space:\s*pre-line;?$/.test(a.value)) || (c.tagName === 'IMG' && (a.name === 'src' || a.name === 'alt')); if (!keep) c.removeAttribute(a.name); });
      walk(c);
    });
    walk(doc.body.firstChild); return doc.body.firstChild.innerHTML;
  }
  function renderReport(force) { const r = $('#report'); if (!r) return; if (force || !state.report.edited || !filled(state.report.html)) { state.report.html = buildReportHTML(); state.report.edited = false; } if (document.activeElement !== r) r.innerHTML = sanitize(state.report.html); }
  function download(name, parts, type) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(parts, { type })); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); }
  function copyText(text) { if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text); return new Promise((res, rej) => { const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy') ? res() : rej(); } catch (e) { rej(e); } finally { ta.remove(); } }); }
  function confirmClick(btn, lbl, action, need) {
    if (!btn) return;
    btn.addEventListener('click', (e) => { e.stopPropagation(); const orig = btn.dataset.label || btn.textContent; btn.dataset.label = orig; if (btn.dataset.armed === '1') { btn.dataset.armed = ''; btn.textContent = orig; action(); return; } if (need && !need()) { action(); return; } btn.dataset.armed = '1'; btn.textContent = lbl; setTimeout(() => { btn.dataset.armed = ''; btn.textContent = orig; }, 4000); });
  }

  /* ---------------- Sections outside the Builder ---------------- */
  function renderLangTool() { const ta = $('#lc-text'), out = $('#lc-out'); if (!ta || !out) return; out.innerHTML = filled(ta.value) ? diagList(RC.langMsg, E.languageCheck(ta.value, RC, state).items) : ''; }
  function renderGuides() {
    const set = (sel, html) => { const n = $(sel); if (n) n.innerHTML = html; };
    set('#type-cards', Object.keys(RC.typeNames).map((k) => '<article class="card"><h3>' + esc(RC.typeNames[k]) + '</h3><p class="small">' + esc(RC.typeDesc[k]) + '</p><p class="small cite">' + esc(window.TFR_THEORIES.list.filter((t) => t.type === k).map((t) => RC.theoryText[t.id].name).join(RC.sep)) + '</p></article>').join(''));
    set('#dist-table', table(UI.distCols, RC.distinctions));
    set('#desc-crit', cmpBox(RC.descVsCrit.weak, RC.descVsCrit.better));
    set('#pathways', Object.keys(RC.pathways).map((k) => '<article class="card"><h3>' + esc(RC.pathways[k].t) + '</h3><ol class="list small">' + RC.pathways[k].items.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ol></article>').join(''));
    set('#rewrite-tool', RC.rewrite.map((r) => '<article class="card"><h3>' + esc(r.t) + '</h3><ul class="list">' + r.tpl.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul><p class="small"><strong>' + esc(UI.tip) + '</strong> ' + esc(r.tip) + '</p></article>').join(''));
    set('#mistakes', RC.mistakes.map((m) => '<article class="card"><h3>' + esc(m.t) + '</h3><p>' + esc(m.d) + '</p><p class="small"><strong>' + esc(UI.fix) + '</strong> ' + esc(m.fix) + '</p></article>').join(''));
    set('#rubric-guide', '<thead><tr>' + UI.rubricCols.map((c) => '<th scope="col">' + esc(c) + '</th>').join('') + '</tr></thead><tbody>' + RC.rubric.map((c) => '<tr><th scope="row">' + esc(c.t) + '</th><td>' + esc(RC.rubricDesc[c.id][0]) + '</td><td>' + esc(RC.rubricDesc[c.id][1]) + '</td><td>' + esc(RC.rubricDesc[c.id][2]) + '</td></tr>').join('') + '</tbody>');
    const g = $('#steps') ? $('#steps').dataset.guide : '';
    set('#guide-topics', RC.guideTopics.map((t, i) => '<li>' + RC.numerals[i] + '. ' + esc(t) + '</li>').join(''));
    set('#guide-steps', RC.stepText.map((s, i) => '<li><a href="' + attr(g) + '#step-' + (i + 1) + '" target="_blank" rel="noopener noreferrer">' + esc(UI.guideStep(RC.numerals[i], RC.steps[i])) + '</a></li>').join(''));
  }
  function renderExamples() {
    const list = $('#ex-list'), pub = $('#pub-list'), filters = $('#ex-filters'); if (!list) return;
    const areas = [...new Set(RC.examples.map((e) => e.area).concat(RC.published.map((e) => e.area)))];
    const apply = (id) => { $$('#ex-list .ex-card, #pub-list .ex-card').forEach((c) => { c.hidden = !(id === '*' || c.dataset.area === id); }); };
    const mk = (id, t) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'chip-btn'; b.textContent = t; b.setAttribute('aria-pressed', id === '*' ? 'true' : 'false'); b.addEventListener('click', () => { $$('.chip-btn', filters).forEach((x) => x.setAttribute('aria-pressed', x === b ? 'true' : 'false')); apply(id); }); filters.appendChild(b); };
    mk('*', UI.exAllAreas); areas.forEach((a) => mk(a, a));
    const row = (k, v) => '<div class="move"><span class="mv">' + esc(k) + '</span><span dir="auto">' + esc(v) + '</span></div>';
    list.innerHTML = RC.examples.map((e) => '<article class="ex-card" data-area="' + attr(e.area) + '"><div class="tags"><span class="tag">' + esc(e.area) + '</span><span class="tag">' + esc(e.approach) + '</span><span class="tag tag-illustrative">' + esc(UI.exHyp) + '</span></div><h3 class="ex-title">' + esc(e.title) + '</h3><div class="moves">' + row(UI.exTheory, e.theory) + row(UI.exConcepts, e.concepts) + row(UI.exRq, e.rq) + row(UI.exMethod, e.method) + '</div><p class="why small"><strong>' + esc(UI.whyWorks) + '</strong> ' + esc(e.why) + '</p></article>').join('');
    pub.innerHTML = RC.published.map((e) => '<article class="ex-card ex-pub" data-area="' + attr(e.area) + '"><div class="tags"><span class="tag">' + esc(e.area) + '</span><span class="tag tag-evidence">' + esc(UI.exPub) + '</span></div><p class="pub-title" lang="en" dir="ltr">' + linkify(e.ref) + '</p><p class="why small"><strong>' + esc(UI.lesson) + '</strong> ' + esc(e.lesson) + '</p></article>').join('');
  }
  function renderGlossary() {
    const body = $('#gloss-body'); if (!body) return;
    const head = $('#gloss-head'); if (head) head.innerHTML = '<tr>' + UI.glossCols.map((c) => '<th scope="col">' + esc(c) + '</th>').join('') + '</tr>';
    body.innerHTML = (window.TFR_GLOSSARY || []).map((g) => { const cols = AR ? [['ar', g.ar], ['en', g.en], ['ar', g.defAr], ['en', g.defEn]] : [['en', g.en], ['ar', g.ar], ['en', g.defEn], ['ar', g.defAr]]; return '<tr data-search="' + attr(E.norm([g.ar, g.en, g.defAr, g.defEn].join(' '), 'ar')) + '">' + cols.map((c) => '<td lang="' + c[0] + '" dir="' + (c[0] === 'ar' ? 'rtl' : 'ltr') + '">' + esc(c[1]) + '</td>').join('') + '</tr>'; }).join('');
  }
  function filterGlossary() { const q = E.norm($('#gloss-search').value, 'ar'); let shown = 0; $$('#gloss-body tr').forEach((tr) => { const ok = !q || tr.dataset.search.indexOf(q) !== -1; tr.hidden = !ok; if (ok) shown++; }); $('#gloss-empty').hidden = shown !== 0; }
  function renderRefs() {
    const box = $('#refs-list'); if (!box) return;
    box.innerHTML = (window.TFR_REFS || []).map((g) => '<div class="ref-group"><h3>' + esc(UI.refGroups[g.id]) + '</h3><ol>' + g.items.map((r) => '<li lang="en" dir="ltr">' + linkify(r.text) + ' <span class="tag ref-type" lang="' + RC.lang + '" dir="' + (AR ? 'rtl' : 'ltr') + '">' + esc(UI.refTypes[r.type]) + '</span></li>').join('') + '</ol></div>').join('');
  }

  /* ---------------- Refresh ---------------- */
  function refresh() {
    $$('[data-pick]').forEach((b) => b.setAttribute('aria-pressed', getPath(state, b.dataset.pick) === b.dataset.id ? 'true' : 'false'));
    $$('label.chk').forEach((l) => { const i = $('input', l); if (i) l.classList.toggle('on', i.checked); });
    refreshOutputs(); stepDiag();
    if (state.step === 9) state.s10.order.forEach((id) => { const n = $('#sec-' + id); if (n && document.activeElement !== n && !state.s10.edited[id]) n.value = E.sectionText(id, state, RC); });
    const rl = $('#refine-list'); if (rl) rl.innerHTML = filled(state.s10.draft) ? diagList(RC.langMsg, E.languageCheck(state.s10.draft, RC, state).items) : '<p class="hint">' + esc(UI.needDraft) + '</p>';
    $$('[data-wc-inline]').forEach((n) => { n.textContent = UI.words(num(E.wc(state.s10.draft))); });
    renderChecker();
    const sug = E.suggestScores(state, RC); RC.rubric.forEach((c) => { const n = $('[data-suggest="' + c.id + '"]'); if (n) n.textContent = UI.suggestedScore + ' ' + RC.numerals[sug[c.id] - 1]; });
    renderResult();
    $$('[data-checklist-progress]').forEach((n) => { n.textContent = UI.checklistDone(num(state.s11.checks.length), num(RC.checklist.length)); });
  }
  let raf = null;
  function onChange() { suppressSave = false; save(); if (raf) cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { refresh(); stepperStatus(); }); }

  /* ---------------- Controls ---------------- */
  function wire() {
    $('#btn-next').addEventListener('click', () => { if (validateStep(state.step, true)) goTo(state.step + 1, true); });
    $('#btn-prev').addEventListener('click', () => goTo(state.step - 1, true));
    confirmClick($('#btn-rebuild'), UI.rebuildConfirm, () => { rebuildDraft(); onChange(); toast(UI.rebuilt); }, () => state.s10.draftEdited);
    confirmClick($('#btn-insert-lib'), UI.insertConfirm, () => {
      const t = E.theoryById(state, RC, state.s5.primary); if (!t) return;
      state.s10.assumptions = t.text.assumptions.join(' '); syncBound('s10.assumptions'); afterSections(); toast(UI.inserted);
    }, () => filled(state.s10.assumptions));
    $('#btn-apply-scores').addEventListener('click', () => { state.s11.scores = E.suggestScores(state, RC); $$('input[data-rub]').forEach((i) => { i.checked = state.s11.scores[i.dataset.rub] === Number(i.value); }); onChange(); toast(UI.scoresApplied); });
    confirmClick($('#btn-final-from-draft'), UI.replaceConfirm, () => { state.s12.final = state.s10.draft; syncBound('s12.final'); onChange(); toast(UI.finalCopied); }, () => filled(state.s12.final) && state.s12.final !== state.s10.draft);
    const rep = $('#report');
    rep.addEventListener('input', () => { state.report.html = sanitize(rep.innerHTML); state.report.edited = true; save(); });
    confirmClick($('#btn-regen-report'), UI.regenConfirm, () => { renderReport(true); save(); toast(UI.reportRebuilt); }, () => state.report.edited);
    $('#btn-copy-report').addEventListener('click', () => copyText(rep.innerText).then(() => toast(UI.copied), () => toast(UI.copyFail)));
    $('#btn-print').addEventListener('click', () => { renderReport(false); window.print(); });
    $('#btn-doc').addEventListener('click', () => {
      renderReport(false); const dir = AR ? 'rtl' : 'ltr';
      const html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>' + esc(UI.report.title) + '</title><style>body{font-family:' + (AR ? 'Arial,"Traditional Arabic"' : 'Calibri,Arial') + ',sans-serif;font-size:11pt;line-height:1.5;direction:' + dir + ';text-align:' + (AR ? 'right' : 'left') + '}h2{font-size:18pt;color:#1F6F6B}h3{font-size:13pt;color:#1F6F6B;margin-top:14pt}.meta{color:#555;font-size:9pt}table{border-collapse:collapse;width:100%}td,th{border:1px solid #bbb;padding:4pt;font-size:9.5pt;vertical-align:top}img{max-width:100%}</style></head><body dir="' + dir + '" lang="' + RC.lang + '">' + sanitize(rep.innerHTML) + '</body></html>';
      download(UI.fileReport + '.doc', ['﻿', html], 'application/msword');
    });
    $('#btn-txt').addEventListener('click', () => { renderReport(false); download(UI.fileReport + '.txt', ['﻿', rep.innerText], 'text/plain;charset=utf-8'); });
    $$('[data-action="delete"]').forEach((btn) => confirmClick(btn, UI.deleteAll, () => {
      try { localStorage.removeItem(STORE_KEY); } catch (e) { /* ignore */ }
      suppressSave = true; clearTimeout(saveTimer); state = defaults(); openRows.clear(); fillInputs(); goTo(0, false); updateSaveStatus();
      try { localStorage.removeItem(STORE_KEY); } catch (e) { /* ignore */ }
      toast(UI.deleted);
    }));
    $$('[data-action="export"]').forEach((btn) => btn.addEventListener('click', () => download(UI.fileData, [JSON.stringify(state, null, 2)], 'application/json')));
    const fi = $('#file-import');
    if (fi) fi.addEventListener('change', () => {
      const f = fi.files[0]; if (!f) return; const rd = new FileReader();
      rd.onload = () => { try { const data = JSON.parse(rd.result); if (!data || data.v !== 1 || !data.s1 || !data.s10) throw new Error('bad'); state = merge(defaults(), data); suppressSave = false; fillInputs(); goTo(state.step, false); save(true); toast(UI.imported); } catch (e) { toast(UI.importFail); } fi.value = ''; };
      rd.readAsText(f);
    });
    $$('[data-lang-switch]').forEach((a) => a.addEventListener('click', () => { save(true); try { localStorage.setItem(LANG_KEY, a.dataset.langSwitch); } catch (e) { /* ignore */ } a.href = a.getAttribute('href').split('#')[0] + (location.hash || ''); }));
    window.addEventListener('beforeunload', () => save(true));
  }

  /* ---------------- Boot ---------------- */
  load();
  renderBuilder(); renderChecklists(); renderGuides(); renderExamples(); renderGlossary(); renderRefs();
  bind(); initDrag(); fillInputs(); wire();
  const m = /^#step-(\d+)$/.exec(location.hash);
  goTo(m ? Math.min(Number(m[1]) - 1, state.maxStep) : state.step, !!m);
  updateSaveStatus();
})();
