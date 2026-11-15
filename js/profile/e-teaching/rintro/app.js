/* =========================================================
   Research Introduction Writing and Refinement in Film and Television Studies
   صياغة مقدمة البحث وتنقيحها في الدراسات السينمائية والتلفزيونية — application logic

   Language-neutral. Wording comes from window.RC (rintro-ar.js or
   rintro-en.js); rules from window.RIE (engine.js); shared data from
   glossary.js and references.js. Data stays in this browser
   (localStorage); nothing is sent to a server.
   Academic tool developed by Dr. Merfat Alardawi | د. مرفت العرضاوي
   ========================================================= */
(function () {
  'use strict';
  const RC = window.RC, E = window.RIE;
  if (!RC || !E) { console.error('RIN: required scripts are missing.'); return; }
  const UI = RC.ui;
  const STORE_KEY = 'rin.data.v1', LANG_KEY = 'rin.lang', STEPS = 13;
  const AR = RC.lang === 'ar';
  const MOVES = E.MOVES;
  const MX_COLS = ['cite', 'ref', 'claim', 'theory', 'method', 'context', 'rel', 'note'];
  const SIG = RC.sigTypes.map((x) => x.id), CON = RC.contribTypes.map((x) => x.id);

  /* ---------------- State ---------------- */
  function defaults() {
    const on = {}, text = {}, edited = {}, labels = {}, sigText = {}, typeText = {};
    MOVES.forEach((m) => { on[m] = true; text[m] = ''; edited[m] = false; labels[m] = ''; });
    SIG.forEach((k) => { sigText[k] = ''; }); CON.forEach((k) => { typeText[k] = ''; });
    return {
      v: 1, step: 0, maxStep: 0, savedAt: null,
      s1: { title: '', topic: '', field: '', approach: '', design: '', context: '', materials: '', scope: '', venue: '', lang: '', status: '', headings: '' },
      s2: { field: '', phenomenon: '', current: '', setting: '', importance: '', refs: '' },
      s3: { traditions: '', theories: '', findings: '', debates: '', disagreements: '', methods: '', synthesis: '' },
      matrix: [],
      s4: { gaps: [], primary: '', basis: '' },
      s5: { issue: '', problem: '', evidence: '', tension: '', boundaries: '', relevance: '' },
      s6: { rationale: '', sig: [], sigText },
      s7: { aim: '', objectives: '', mainQ: '', subQs: '', hypotheses: '' },
      s8: { mode: '', theory: '', theoryOther: '', concepts: '', approach: '', relation: '', justification: '' },
      s9: { statement: '', types: [], typeText, organisation: '' },
      s10: { order: MOVES.slice(), on, text, edited, labels, useHeadings: false, draft: '', draftEdited: false },
      s11: { checks: [], terms: '' },
      s12: { scores: {}, self: '' },
      s13: { final: '', refs: '', notes: '' },
      report: { html: '', edited: false },
      ui: { sel: {} }
    };
  }
  function uid() { return 'x' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  const str = (x) => typeof x === 'string' ? x : '';
  const mxRow = (x) => { const r = { id: str(x && x.id) || uid() }; MX_COLS.forEach((c) => { r[c] = str(x && x[c]); }); return r; };
  const gapRow = (x) => ({ id: str(x && x.id) || uid(), type: str(x && x.type), statement: str(x && x.statement), evidence: str(x && x.evidence), status: str(x && x.status), studies: Array.isArray(x && x.studies) ? x.studies.filter((s) => typeof s === 'string') : [] });
  function merge(base, src) {
    if (!src || typeof src !== 'object') return base;
    Object.keys(base).forEach((k) => {
      if (!(k in src)) return;
      const b = base[k], s = src[k];
      if (k === 'order') { const ok = Array.isArray(s) ? s.filter((x) => MOVES.indexOf(x) !== -1) : []; base[k] = ok.concat(MOVES.filter((x) => ok.indexOf(x) === -1)); }
      else if (k === 'matrix') base[k] = Array.isArray(s) ? s.slice(0, 300).filter((x) => x && typeof x === 'object').map(mxRow) : [];
      else if (k === 'gaps') base[k] = Array.isArray(s) ? s.slice(0, 20).filter((x) => x && typeof x === 'object').map(gapRow) : [];
      else if (k === 'scores') { if (s && typeof s === 'object') Object.keys(s).forEach((x) => { if (typeof s[x] === 'number' && s[x] >= 1 && s[x] <= 5) b[x] = s[x]; }); }
      else if (k === 'sel') { if (s && typeof s === 'object') Object.keys(s).forEach((x) => { if (typeof s[x] === 'string') b[x] = s[x]; }); }
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

  function toast(m) {
    const t = $('#toast'); if (!t) return;
    t.textContent = m; t.hidden = false;
    clearTimeout(toast._t); toast._t = setTimeout(() => { t.hidden = true; }, 3400);
  }

  /* ---------------- Persistence ---------------- */
  let saveTimer = null, suppressSave = false;
  function save(now) {
    clearTimeout(saveTimer); if (suppressSave) return;
    const run = () => { state.savedAt = new Date().toISOString(); try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* storage full or blocked */ } updateSaveStatus(); };
    if (now) run(); else saveTimer = setTimeout(run, 350);
  }
  function load() { try { const raw = localStorage.getItem(STORE_KEY); if (!raw) return false; state = merge(defaults(), JSON.parse(raw)); return true; } catch (e) { return false; } }
  function updateSaveStatus() {
    const n = $('#save-status'); if (!n) return;
    n.textContent = state.savedAt ? UI.savedAt(new Date(state.savedAt).toLocaleTimeString(AR ? 'ar-SA' : 'en-GB', { hour: '2-digit', minute: '2-digit' })) : UI.notSaved;
  }

  /* ---------------- Markup helpers ---------------- */
  const idOf = (p, sfx) => 'f-' + p.replace(/\./g, '-') + (sfx ? '-' + sfx : '');
  const meta = (path) => RC.f[path] || {};
  function F(path, type, o) {
    o = o || {};
    const f = o.meta || meta(path), id = idOf(path, o.sfx), hid = id + '-h';
    const req = o.req ? ' data-required="1"' + (o.min ? ' data-minwords="' + o.min + '"' : '') : '';
    const common = ' id="' + id + '" class="inp" data-bind="' + path + '"' + req + (f.ph ? ' placeholder="' + attr(f.ph) + '"' : '') + ' aria-describedby="' + hid + '"';
    const ctl = type === 'textarea' ? '<textarea' + common + (o.rows ? ' rows="' + o.rows + '"' : '') + '></textarea>' : '<input' + common + '>';
    return '<div class="field"' + (o.show ? ' data-show="' + o.show + '"' : '') + '><label for="' + id + '">' + esc(f.label) + (o.req ? '<span class="req" aria-hidden="true">*</span>' : '') + '</label>' + ctl +
      '<span class="hint" id="' + hid + '">' + esc(f.hint || '') + '</span><span class="err" aria-live="polite"></span></div>';
  }
  function SEL(path, opts, o) {
    o = o || {};
    const f = meta(path), id = idOf(path, o.sfx);
    return '<div class="field"' + (o.show ? ' data-show="' + o.show + '"' : '') + '><label for="' + id + '">' + esc(f.label) + (o.req ? '<span class="req" aria-hidden="true">*</span>' : '') + '</label><select id="' + id + '" class="inp" data-bind="' + path + '"' + (o.req ? ' data-required="1"' : '') + (o.design ? ' data-design="1"' : '') + (f.hint ? ' aria-describedby="' + id + '-h"' : '') + '>' +
      opts + '</select>' + (f.hint ? '<span class="hint" id="' + id + '-h">' + esc(f.hint) + '</span>' : '') + '<span class="err" aria-live="polite"></span></div>';
  }
  const G2 = (a, b) => '<div class="grid g-2">' + a + b + '</div>';
  function PICK(path, items, o) {
    o = o || {};
    const f = meta(path), gid = idOf(path, o.sfx);
    return '<div class="field choice-group"' + (o.req === false ? '' : ' data-required-pick="' + path + '"') + '><span class="label" id="' + gid + '-l">' + esc(f.label) + (o.req === false ? '' : '<span class="req" aria-hidden="true">*</span>') + '</span>' +
      (f.hint ? '<span class="hint">' + esc(f.hint) + '</span>' : '') +
      '<div class="grid ' + (o.cols || 'g-240') + '" role="group" aria-labelledby="' + gid + '-l">' + items.map((it) => '<button type="button" class="choice" data-pick="' + path + '" data-id="' + it.id + '" aria-pressed="false"><strong>' + esc(it.t) + '</strong>' + (it.d ? '<span>' + esc(it.d) + '</span>' : '') + '</button>').join('') +
      '</div><span class="err" aria-live="polite"></span></div>';
  }
  /* Tick boxes with an explanation field that appears when ticked (significance, contribution). */
  function TYPES(multiPath, textPath, items) {
    return '<div class="stack">' + items.map((it) => { const id = 'ty-' + multiPath.replace(/\./g, '-') + '-' + it.id; return '<div class="type-row"><label class="chk" for="' + id + '"><input type="checkbox" id="' + id + '" data-multi="' + multiPath + '" value="' + it.id + '"><span class="txt"><strong>' + esc(it.t) + '</strong><span>' + esc(it.d) + '</span></span></label>' +
      '<div class="field" data-type-text="' + multiPath + ':' + it.id + '"><label class="sr-only" for="' + id + '-t">' + esc(it.t) + '</label><textarea id="' + id + '-t" class="inp" rows="2" data-bind="' + textPath + '.' + it.id + '" placeholder="' + attr(it.ph) + '"></textarea></div></div>'; }).join('') + '</div>';
  }
  const OUT = (i) => '<div class="output-box"><span class="k">' + esc(RC.stepText[i].out) + '</span><span class="v" id="out-' + i + '" style="white-space:pre-line"></span></div>';
  const diagItem = (t, s, m) => '<div class="diag-item st-' + s + '"><span class="ic" aria-hidden="true">' + icon(s) + '</span>' + (t ? '<span class="t">' + esc(t) + '<span class="status-label">' + esc(RC.statusLabel[s]) + '</span></span>' : '') + '<span class="d">' + esc(m) + '</span></div>';
  const diagList = (M, list) => list.map((x) => { const m = msg(M, x); return diagItem(m.t, x.s, m.d); }).join('');
  const cmpBox = (w, b) => '<div class="compare"><div class="ex-weak"><b>' + esc(UI.weak) + '</b>' + esc(w) + '</div><div class="ex-better"><b>' + esc(UI.better) + '</b>' + esc(b) + '</div></div>';
  const table = (cols, rows, cls) => '<div class="table-wrap"><table class="data' + (cls ? ' ' + cls : '') + '"><thead><tr>' + cols.map((c) => '<th scope="col">' + esc(c) + '</th>').join('') + '</tr></thead><tbody>' + rows.map((r) => '<tr>' + r.map((c, i) => i === 0 ? '<th scope="row">' + esc(c) + '</th>' : '<td>' + esc(c) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>';
  function designOptions() {
    const ap = state.s1.approach;
    const list = RC.designs.filter((d) => !ap || d.a === ap);
    const groups = RC.approaches.filter((a) => !ap || a.id === ap);
    return '<option value="">' + esc(ap ? UI.chooseDesign : UI.chooseApproachFirst) + '</option>' + groups.map((g) => '<optgroup label="' + attr(g.t) + '">' + list.filter((d) => d.a === g.id).map((d) => '<option value="' + d.id + '">' + esc(d.t) + '</option>').join('') + '</optgroup>').join('');
  }
  const opts = (list, blank) => (blank ? '<option value=""></option>' : '') + list.map((x) => '<option value="' + x.id + '">' + esc(x.t) + '</option>').join('');
  function guideLink(i) {
    const box = document.getElementById('steps'), g = box && box.dataset.guide;
    if (!g) return '';
    return '<a class="step-guide" href="' + attr(g) + '#step-' + (i + 1) + '" target="_blank" rel="noopener noreferrer">' + esc(box.dataset.guideLabel || '') +
      '<span class="sr-only">' + esc(box.dataset.guideNewtab || '') + '</span></a>';
  }
  const ladder = () => '<div class="grid g-240 ladder">' + RC.gapStatuses.map((g, i) => '<article class="card ladder-' + g.id + '"><h3><span class="n">' + RC.numerals[i] + '</span> ' + esc(g.t) + '</h3><p class="small">' + esc(g.d) + '</p><p class="small cite">' + esc(g.ex) + '</p></article>').join('') + '</div>';

  /* ---------------- Builder markup ---------------- */
  function stepBody(i) {
    const T = RC.stepText[i];
    switch (i) {
      case 0: return G2(F('s1.title', 'text', { req: 1 }), F('s1.topic', 'text', { req: 1 })) +
        SEL('s1.field', opts(RC.fields, true)) +
        PICK('s1.approach', RC.approaches, { cols: 'g-200' }) + SEL('s1.design', designOptions(), { req: 1, design: 1 }) +
        G2(F('s1.context', 'textarea'), F('s1.materials', 'textarea')) + F('s1.scope', 'text') +
        PICK('s1.venue', RC.venues, { cols: 'g-200', req: false }) + PICK('s1.lang', RC.langs, { cols: 'g-200', req: false }) +
        PICK('s1.status', RC.statuses, { cols: 'g-200' }) + PICK('s1.headings', RC.headingModes, { cols: 'g-200', req: false }) + OUT(0);
      case 1: return F('s2.field', 'text') + F('s2.phenomenon', 'textarea', { req: 1, min: 6 }) + F('s2.current', 'textarea', { req: 1, min: 6 }) +
        G2(F('s2.setting', 'textarea'), F('s2.importance', 'textarea')) + F('s2.refs', 'text') +
        cmpBox(T.weak, T.better) + '<div class="diag" id="diag-1"></div>' + OUT(1);
      case 2: return '<div class="refine-box"><h4 class="h4">' + esc(UI.mxTitle) + '</h4><p class="hint">' + esc(UI.mxIntro) + '</p><div data-matrix="step"></div></div>' +
        G2(F('s3.traditions', 'textarea'), F('s3.theories', 'textarea')) + G2(F('s3.findings', 'textarea'), F('s3.methods', 'textarea')) + G2(F('s3.debates', 'textarea'), F('s3.disagreements', 'textarea')) +
        F('s3.synthesis', 'textarea', { req: 1, min: 15, rows: 7 }) + cmpBox(T.weak, T.better) + '<div class="diag" id="diag-2"></div>' + OUT(2);
      case 3: return '<h4 class="h4">' + esc(UI.gapLadder) + '</h4>' + ladder() + F('s4.basis', 'textarea') +
        '<div class="stack" id="gaps"></div><div class="btn-row"><button type="button" class="btn btn-ghost btn-sm" id="btn-add-gap">' + esc(UI.gapAdd) + '</button></div><p class="err" id="err-gap" aria-live="polite"></p>' +
        cmpBox(T.weak, T.better) + OUT(3);
      case 4: return F('s5.issue', 'text') + F('s5.problem', 'textarea', { req: 1, min: 10 }) + G2(F('s5.evidence', 'textarea'), F('s5.tension', 'textarea')) + G2(F('s5.boundaries', 'textarea'), F('s5.relevance', 'textarea')) +
        table(UI.distCols, RC.distinctions) + cmpBox(T.weak, T.better) + '<div class="diag" id="diag-4"></div>' + OUT(4);
      case 5: return F('s6.rationale', 'textarea', { req: 1, min: 10 }) + '<fieldset><legend>' + esc(UI.sigTitle) + '</legend><p class="hint">' + esc(UI.sigHint) + '</p>' + TYPES('s6.sig', 's6.sigText', RC.sigTypes) + '</fieldset>' +
        cmpBox(T.weak, T.better) + '<div class="diag" id="diag-5"></div>' + OUT(5);
      case 6: return F('s7.aim', 'textarea', { req: 1, min: 6 }) + F('s7.objectives', 'textarea', { rows: 4 }) + F('s7.mainQ', 'textarea', { req: 1, min: 5 }) + G2(F('s7.subQs', 'textarea', { rows: 4 }), F('s7.hypotheses', 'textarea', { rows: 4 })) +
        cmpBox(T.weak, T.better) + '<div class="refine-box"><h4 class="h4">' + esc(UI.alignTitle) + '</h4><p class="hint">' + esc(UI.alignHint) + '</p><p class="small muted" data-kind-note></p><div class="diag" data-align></div></div>' + OUT(6);
      case 7: return PICK('s8.mode', RC.theoryModes, { cols: 'g-200' }) +
        '<div class="stack" data-theory-fields>' + G2(SEL('s8.theory', opts(RC.theories, true)), F('s8.theoryOther', 'text')) + F('s8.concepts', 'text') + F('s8.approach', 'textarea') + F('s8.relation', 'textarea', { req: 1, min: 6 }) + '</div>' +
        F('s8.justification', 'textarea') + cmpBox(T.weak, T.better) + '<div class="diag" id="diag-7"></div>' + OUT(7);
      case 8: return '<div class="explain" data-stage-note></div>' + F('s9.statement', 'textarea', { req: 1, min: 8 }) +
        '<fieldset><legend>' + esc(UI.contribTitle) + '</legend><p class="hint">' + esc(UI.contribHint) + '</p>' + TYPES('s9.types', 's9.typeText', RC.contribTypes) + '</fieldset>' + F('s9.organisation', 'textarea') +
        cmpBox(T.weak, T.better) + '<div class="diag" id="diag-8"></div>' + OUT(8);
      case 9: return '<p class="hint">' + esc(UI.composerHint) + ' <a href="#context" class="small">' + esc(UI.structApply.replace(/\s*\(.*\)$/, '')) + '</a></p>' +
        '<label class="chk" data-headings-toggle style="max-width:520px"><input type="checkbox" data-bool="s10.useHeadings"><span class="txt"><strong>' + esc(UI.useHeadings) + '</strong><span data-headings-note></span></span></label>' +
        '<div class="composer" id="composer"></div>' +
        '<div class="draft-wrap"><div class="report-tools"><h4 class="h4">' + esc(UI.draftTitle) + '</h4><span class="spacer"></span><button type="button" class="btn btn-ghost btn-sm" id="btn-rebuild">' + esc(UI.rebuild) + '</button><button type="button" class="btn btn-ghost btn-sm" data-copy-bind="s10.draft">' + esc(UI.copy) + '</button></div>' +
        '<div class="field"><label for="draft-10" class="sr-only">' + esc(UI.draftTitle) + '</label><textarea id="draft-10" class="inp intro-ta" data-bind="s10.draft" data-draft="1" rows="16" spellcheck="true"></textarea><span class="hint" data-draft-note></span></div><div class="wc-inline small muted" data-wc-inline></div></div><p class="err" id="err-draft" aria-live="polite"></p>';
      case 10: return '<div class="field"><label for="draft-11">' + esc(UI.draftTitle) + '</label><textarea id="draft-11" class="inp intro-ta" data-bind="s10.draft" data-draft="1" rows="16" spellcheck="true"></textarea><span class="hint" data-draft-note></span></div><div class="wc-inline small muted" data-wc-inline></div>' +
        F('s11.terms', 'textarea', { rows: 3 }) +
        '<div class="refine-box"><h4 class="h4">' + esc(UI.langCheckTitle) + '</h4><div class="diag" id="refine-list"></div></div>' +
        '<div class="refine-box"><h4 class="h4">' + esc(UI.movesTitle) + '</h4><div class="radio-row" id="move-list"></div><p class="hint">' + esc(UI.movesHint) + '</p></div>' +
        '<h4 class="h4">' + esc(UI.checklistTitle) + ' <span class="small muted" data-checklist-progress></span></h4><div class="checklist" data-checklist="step"></div>';
      case 11: return '<div class="checker-head"><h4 class="h4">' + esc(UI.checksTitle) + '</h4><span class="checker-summary" id="checker-summary"></span></div><div class="diag" id="checker"></div>' +
        '<div class="eval-layout"><div><div class="rubric" id="rubric"></div><div class="btn-row"><button type="button" class="btn btn-ghost btn-sm" id="btn-apply-scores">' + esc(UI.applyScores) + '</button></div></div><div class="result-panel" id="rubric-result" aria-live="polite"></div></div>' +
        F('s12.self', 'textarea') + '<p class="disclaimer">' + esc(UI.evalDisclaimer) + '</p>';
      case 12: return '<div class="final-box">' + F('s13.final', 'textarea', { rows: 14 }) + '<div class="btn-row"><button type="button" class="btn btn-ghost btn-sm" id="btn-final-from-draft">' + esc(UI.finalFromDraft) + '</button><button type="button" class="btn btn-ghost btn-sm" data-copy-bind="s13.final">' + esc(UI.copyFinal) + '</button></div><div class="wc-inline small muted" id="final-wc"></div></div>' +
        G2(F('s13.refs', 'textarea', { rows: 6 }), F('s13.notes', 'textarea', { rows: 6 })) +
        '<div class="report-tools"><button type="button" class="btn btn-ghost btn-sm" id="btn-regen-report">' + esc(UI.reportRegen) + '</button><button type="button" class="btn btn-ghost btn-sm" id="btn-copy-report">' + esc(UI.reportCopy) + '</button><button type="button" class="btn btn-ghost btn-sm" id="btn-print">' + esc(UI.print) + '</button><button type="button" class="btn btn-primary btn-sm" id="btn-doc">' + esc(UI.doc) + '</button><button type="button" class="btn btn-ghost btn-sm" id="btn-txt">' + esc(UI.txt) + '</button></div>' +
        '<div class="report" id="report" contenteditable="true" role="textbox" aria-multiline="true" aria-label="' + attr(UI.report.title) + '" spellcheck="true"></div>';
    }
    return '';
  }
  function renderBuilder() {
    $('#steps').innerHTML = RC.stepText.map((s, i) => '<div class="step" data-step="' + i + '"' + (i ? ' hidden' : '') + '><div class="step-head"><h3>' + esc(s.h) + '</h3><p>' + esc(s.p) + '</p>' + guideLink(i) + '</div>' +
      '<div class="explain"><strong>' + esc(s.whyH) + '</strong><span>' + esc(s.why) + '</span></div>' + (s.ex ? '<div class="example-box"><b>' + esc(UI.example) + '</b>' + esc(s.ex) + '</div>' : '') +
      stepBody(i) + '</div>').join('');
    $('#rubric').innerHTML = RC.rubric.map((c) => '<fieldset class="rubric-row"><legend>' + esc(c.t) + '</legend><span class="desc">' + esc(c.d) + '</span><span class="suggest" data-suggest="' + c.id + '"></span><div class="scale">' +
      [1, 2, 3, 4, 5].map((n) => '<label><input type="radio" name="rub-' + c.id + '" value="' + n + '" data-rub="' + c.id + '" aria-label="' + attr(c.t + ': ' + RC.numerals[n - 1]) + '"><span aria-hidden="true">' + RC.numerals[n - 1] + '</span></label>').join('') + '</div></fieldset>').join('');
  }
  function renderChecklists() {
    $$('[data-checklist]').forEach((box) => {
      box.innerHTML = RC.checklist.map((c, i) => { const id = 'cl-' + box.dataset.checklist + '-' + c.id; return '<label class="chk" for="' + id + '"><input type="checkbox" id="' + id + '" data-multi="s11.checks" value="' + c.id + '"><span class="txt"><strong>' + RC.numerals[i] + '. ' + esc(c.t) + '</strong><span>' + esc(c.d) + '</span></span></label>'; }).join('');
    });
  }

  /* ---------------- Tool C: citation matrix (rendered wherever [data-matrix] appears) ---------------- */
  const openRows = new Set();
  function renderMatrix(except) {
    $$('[data-matrix]').forEach((box) => {
      if (box === except) return;
      const k = box.dataset.matrix, fid = 'mx-file-' + k;
      const rows = state.matrix.map((r, i) => {
        const fld = (c, area) => { const id = 'mx-' + k + '-' + r.id + '-' + c; return '<div class="field' + (c === 'ref' || c === 'claim' || c === 'note' ? ' span-2' : '') + '"><label for="' + id + '">' + esc(UI.mxCols[c]) + '</label>' + (area ? '<textarea rows="2"' : '<input') + ' id="' + id + '" class="inp" data-mx="' + r.id + ':' + c + '"' + (UI.mxPh[c] ? ' placeholder="' + attr(UI.mxPh[c]) + '"' : '') + (c === 'ref' ? ' dir="auto"' : '') + '>' + (area ? '</textarea>' : '') + '</div>'; };
        const relId = 'mx-' + k + '-' + r.id + '-rel';
        return '<details class="mx-row" data-row="' + r.id + '"' + (openRows.has(r.id) ? ' open' : '') + '><summary><span class="mx-n">' + esc(UI.mxStudy(num(i + 1))) + '</span> <span class="mx-cite" dir="auto" data-mx-sum="' + r.id + '">' + esc(r.cite || '') + '</span></summary><div class="grid g-2">' +
          fld('cite') + '<div class="field"><label for="' + relId + '">' + esc(UI.mxCols.rel) + '</label><select id="' + relId + '" class="inp" data-mx="' + r.id + ':rel">' + opts(RC.relTypes, true) + '</select></div>' +
          fld('ref', 1) + fld('claim', 1) + fld('theory') + fld('method') + fld('context') + fld('note', 1) +
          '</div><div class="btn-row"><button type="button" class="btn btn-danger btn-sm" data-mx-del="' + r.id + '">' + esc(UI.mxDel) + '</button></div></details>';
      }).join('');
      box.innerHTML = '<div class="mx-head"><strong data-mx-count></strong><span class="spacer"></span><button type="button" class="btn btn-primary btn-sm" data-mx-act="add">' + esc(UI.mxAdd) + '</button><button type="button" class="btn btn-ghost btn-sm" data-mx-act="csv">' + esc(UI.mxCsv) + '</button><button type="button" class="btn btn-ghost btn-sm" data-mx-act="json">' + esc(UI.mxJson) + '</button>' +
        '<label class="btn btn-ghost btn-sm" for="' + fid + '">' + esc(UI.mxImport) + '</label><input type="file" id="' + fid + '" class="visually-hidden" accept=".csv,.json,text/csv,application/json" data-mx-file></div><p class="hint">' + esc(UI.mxReplaceNote) + '</p>' +
        (state.matrix.length ? '<div class="mx-list">' + rows + '</div>' : '<p class="hint mx-empty">' + esc(UI.mxEmpty) + '</p>');
      state.matrix.forEach((r) => MX_COLS.forEach((c) => { const n = $('[data-mx="' + r.id + ':' + c + '"]', box); if (n) n.value = r[c]; }));
    });
    $$('[data-mx-count]').forEach((n) => { n.textContent = UI.mxCount(num(state.matrix.length)); });
  }
  function mxAdd() { const r = mxRow({}); state.matrix.push(r); openRows.add(r.id); renderMatrix(); renderGaps(); onChange(); }
  function mxImport(file) {
    const rd = new FileReader();
    rd.onload = () => {
      let rows = [];
      try {
        const txt = String(rd.result || '');
        if (/^\s*[[{]/.test(txt)) { const j = JSON.parse(txt); rows = (Array.isArray(j) ? j : (j && Array.isArray(j.matrix) ? j.matrix : [])); }
        else {
          const t = E.parseCSV(txt); if (t.length < 2) throw new Error('empty');
          const head = t[0].map((h) => String(h).trim().toLowerCase()), map = {};
          head.forEach((h, i) => { const k = MX_COLS.find((c) => c === h || UI.mxCols[c].toLowerCase() === h); if (k) map[i] = k; });
          if (!Object.keys(map).length) throw new Error('header');
          rows = t.slice(1).map((r) => { const o = {}; Object.keys(map).forEach((i) => { o[map[i]] = r[i] || ''; }); return o; });
        }
        rows = rows.filter((x) => x && typeof x === 'object' && MX_COLS.some((c) => filled(x[c])));
        if (!rows.length) throw new Error('none');
        rows.forEach((x) => { const r = mxRow(Object.assign({}, x, { id: '' })); if (RC.relTypes.every((t) => t.id !== r.rel)) { const m = RC.relTypes.find((t) => t.t === r.rel); r.rel = m ? m.id : ''; } state.matrix.push(r); });
        state.matrix = state.matrix.slice(0, 300);
        renderMatrix(); renderGaps(); onChange(); toast(UI.mxImported(num(rows.length)));
      } catch (e) { toast(UI.mxImportFail); }
    };
    rd.readAsText(file);
  }

  /* ---------------- Step 4: gap editor ---------------- */
  function renderGaps() {
    const box = $('#gaps'); if (!box) return;
    if (!state.s4.gaps.length) { box.innerHTML = '<p class="hint">' + esc(UI.gapEmpty) + '</p>'; return; }
    box.innerHTML = state.s4.gaps.map((g, i) => {
      const p = 'g-' + g.id;
      const studies = state.matrix.length ? '<div class="radio-row">' + state.matrix.map((m, j) => '<label class="radio-pill"><input type="checkbox" data-gap-study="' + g.id + '" value="' + m.id + '"' + (g.studies.indexOf(m.id) !== -1 ? ' checked' : '') + '><span dir="auto">' + esc(m.cite || UI.mxStudy(num(j + 1))) + '</span></label>').join('') + '</div>' : '<p class="hint">' + esc(UI.gapNoStudies) + '</p>';
      return '<fieldset class="card gap-card" data-gap-card="' + g.id + '"><legend>' + esc(UI.gapN(num(i + 1))) + '</legend>' +
        '<div class="grid g-2"><div class="field"><label for="' + p + '-type">' + esc(UI.gapType) + '</label><select id="' + p + '-type" class="inp" data-gap="' + g.id + ':type">' + opts(RC.gapTypes, true) + '</select><span class="hint" data-gap-type-d="' + g.id + '"></span></div>' +
        '<div class="field"><span class="label">' + esc(UI.gapPrimary) + '</span><label class="radio-pill"><input type="radio" name="gap-primary" data-gap-primary="' + g.id + '"' + (state.s4.primary === g.id ? ' checked' : '') + '><span>' + esc(UI.gapPrimaryOn) + '</span></label></div></div>' +
        '<div class="field"><label for="' + p + '-st">' + esc(UI.gapStatement) + '<span class="req" aria-hidden="true">*</span></label><textarea id="' + p + '-st" class="inp" rows="2" data-gap="' + g.id + ':statement"></textarea><span class="hint">' + esc(UI.gapStatementHint) + '</span></div>' +
        '<div class="field"><label for="' + p + '-ev">' + esc(UI.gapEvidence) + '<span class="req" aria-hidden="true">*</span></label><textarea id="' + p + '-ev" class="inp" rows="3" data-gap="' + g.id + ':evidence"></textarea><span class="hint">' + esc(UI.gapEvidenceHint) + '</span></div>' +
        '<div class="field"><span class="label">' + esc(UI.gapStudies) + '</span>' + studies + '</div>' +
        '<div class="field"><span class="label">' + esc(UI.gapStatus) + '<span class="req" aria-hidden="true">*</span></span><div class="radio-row">' + RC.gapStatuses.map((s) => '<label class="radio-pill"><input type="radio" name="' + p + '-status" data-gap-status="' + g.id + '" value="' + s.id + '"' + (g.status === s.id ? ' checked' : '') + '><span>' + esc(s.t) + '</span></label>').join('') + '</div></div>' +
        '<div class="diag gap-status" data-gap-diag="' + g.id + '"></div>' +
        '<button type="button" class="btn btn-danger btn-sm" data-gap-del="' + g.id + '">' + esc(UI.gapDel) + '</button></fieldset>';
    }).join('');
    state.s4.gaps.forEach((g) => { ['type', 'statement', 'evidence'].forEach((k) => { const n = $('[data-gap="' + g.id + ':' + k + '"]'); if (n) n.value = g[k]; }); });
    gapDiag();
  }
  function gapDiag() {
    state.s4.gaps.forEach((g) => {
      const d = $('[data-gap-diag="' + g.id + '"]'); if (d) d.innerHTML = diagList(RC.gapMsg, E.gapChecks(g, state, RC));
      const t = $('[data-gap-type-d="' + g.id + '"]'); if (t) { const x = RC.gapTypes.find((y) => y.id === g.type); t.textContent = x ? x.d : ''; }
    });
  }
  function addGap() { const g = gapRow({}); state.s4.gaps.push(g); if (!state.s4.primary) state.s4.primary = g.id; renderGaps(); onChange(); const n = $('[data-gap="' + g.id + ':statement"]'); if (n) n.focus(); }

  /* ---------------- Binding ---------------- */
  function syncBound(path, src) {
    $$('[data-bind="' + path + '"]').forEach((n) => { if (n !== src && n.value !== getPath(state, path)) n.value = getPath(state, path) || ''; });
  }
  function bind() {
    document.addEventListener('input', (e) => {
      const t = e.target;
      if (t.matches('[data-bind]')) {
        setPath(state, t.dataset.bind, t.value); syncBound(t.dataset.bind, t);
        if (t.dataset.draft) state.s10.draftEdited = true;
        if (t.getAttribute('aria-invalid') === 'true' && filled(t.value)) clearErr(t);
        onChange();
      }
      else if (t.matches('[data-mx]')) {
        const [id, c] = t.dataset.mx.split(':'), r = state.matrix.find((x) => x.id === id); if (!r) return;
        r[c] = t.value; $$('[data-mx="' + t.dataset.mx + '"]').forEach((n) => { if (n !== t) n.value = t.value; });
        if (c === 'cite') { $$('[data-mx-sum="' + id + '"]').forEach((n) => { n.textContent = t.value; }); renderGaps(); }
        onChange();
      }
      else if (t.matches('[data-gap]')) { const [id, k] = t.dataset.gap.split(':'), g = state.s4.gaps.find((x) => x.id === id); if (g) { g[k] = t.value; gapDiag(); onChange(); } }
      else if (t.matches('[data-sec]')) { const id = t.dataset.sec; state.s10.text[id] = t.value; state.s10.edited[id] = true; afterSections(); }
      else if (t.matches('[data-label]')) { state.s10.labels[t.dataset.label] = t.value; afterSections(); }
      else if (t.matches('#lc-text')) renderLangTool();
      else if (t.matches('#claim-text')) renderClaimTool();
      else if (t.matches('#gloss-search')) filterGlossary();
    });
    document.addEventListener('change', (e) => {
      const t = e.target;
      if (t.matches('select[data-bind]')) { setPath(state, t.dataset.bind, t.value); syncBound(t.dataset.bind, t); clearErr(t); onChange(); }
      else if (t.matches('select[data-mx]')) { const [id, c] = t.dataset.mx.split(':'), r = state.matrix.find((x) => x.id === id); if (r) { r[c] = t.value; $$('[data-mx="' + t.dataset.mx + '"]').forEach((n) => { n.value = t.value; }); onChange(); } }
      else if (t.matches('select[data-gap]')) { const [id, k] = t.dataset.gap.split(':'), g = state.s4.gaps.find((x) => x.id === id); if (g) { g[k] = t.value; gapDiag(); onChange(); } }
      else if (t.matches('input[data-gap-status]')) { const g = state.s4.gaps.find((x) => x.id === t.dataset.gapStatus); if (g) { g.status = t.value; gapDiag(); onChange(); } }
      else if (t.matches('input[data-gap-primary]')) { state.s4.primary = t.dataset.gapPrimary; onChange(); }
      else if (t.matches('input[data-gap-study]')) { const g = state.s4.gaps.find((x) => x.id === t.dataset.gapStudy); if (g) { const i = g.studies.indexOf(t.value); if (t.checked && i === -1) g.studies.push(t.value); else if (!t.checked && i !== -1) g.studies.splice(i, 1); gapDiag(); onChange(); } }
      else if (t.matches('input[data-mx-file]')) { if (t.files[0]) mxImport(t.files[0]); t.value = ''; }
      else if (t.matches('input[data-multi]')) { const arr = getPath(state, t.dataset.multi), i = arr.indexOf(t.value); if (t.checked && i === -1) arr.push(t.value); else if (!t.checked && i !== -1) arr.splice(i, 1); $$('input[data-multi="' + t.dataset.multi + '"][value="' + t.value + '"]').forEach((x) => { x.checked = t.checked; }); onChange(); }
      else if (t.matches('input[data-bool]')) { setPath(state, t.dataset.bool, t.checked); if (t.dataset.bool === 's10.useHeadings') { renderComposer(); afterSections(); } else onChange(); }
      else if (t.matches('input[data-rub]')) { state.s12.scores[t.dataset.rub] = Number(t.value); onChange(); }
      else if (t.matches('input[data-on]')) { state.s10.on[t.dataset.on] = t.checked; renderComposer(); afterSections(); }
      else if (t.matches('input[data-sel]')) { state.ui.sel[t.dataset.sel] = t.value; renderSelector(); save(); }
    });
    document.addEventListener('toggle', (e) => { const d = e.target; if (d.matches && d.matches('details.mx-row')) { if (d.open) openRows.add(d.dataset.row); else openRows.delete(d.dataset.row); } }, true);
    document.addEventListener('click', (e) => {
      const t = e.target.closest('button, a'); if (!t) return;
      if (t.dataset.pick) {
        setPath(state, t.dataset.pick, t.dataset.id); clearErr(t);
        if (t.dataset.pick === 's1.approach') { const d = RC.designs.find((x) => x.id === state.s1.design); if (d && d.a !== state.s1.approach) state.s1.design = ''; renderDesignSelects(); }
        if (t.dataset.pick === 's1.headings') renderComposer();
        onChange();
      }
      else if (t.dataset.copyBind) { const v = getPath(state, t.dataset.copyBind); copyText(String(v || '')).then(() => toast(UI.copied), () => toast(UI.copyFail)); }
      else if (t.dataset.move) moveSection(t.dataset.move, Number(t.dataset.dir));
      else if (t.dataset.resetSec) { const id = t.dataset.resetSec; state.s10.edited[id] = false; state.s10.text[id] = ''; renderComposer(); afterSections(); toast(UI.sectionReset); }
      else if (t.dataset.mxAct === 'add') mxAdd();
      else if (t.dataset.mxAct === 'csv') download(UI.fileMatrix + '.csv', ['﻿', E.toCSV(state.matrix.map((r) => Object.assign({}, r, { rel: r.rel })), MX_COLS)], 'text/csv;charset=utf-8');
      else if (t.dataset.mxAct === 'json') download(UI.fileMatrix + '.json', [JSON.stringify(state.matrix.map((r) => { const o = {}; MX_COLS.forEach((c) => { o[c] = r[c]; }); return o; }), null, 2)], 'application/json');
      else if (t.dataset.gotoStep) { e.preventDefault(); goTo(Math.min(Number(t.dataset.gotoStep), state.maxStep + 1), true); }
      else if (t.dataset.useTool) { const src = $('#' + t.dataset.useTool); if (src) { src.value = state.s10.draft || ''; src.dispatchEvent(new Event('input', { bubbles: true })); } }
    });
    /* Two-click confirmation for removals (no browser dialogs). */
    document.addEventListener('click', (e) => {
      const t = e.target.closest('[data-mx-del], [data-gap-del]'); if (!t) return;
      if (t.dataset.armed !== '1') { const orig = t.textContent; t.dataset.armed = '1'; t.textContent = UI.mxConfirmDel; setTimeout(() => { if (t.isConnected) { t.dataset.armed = ''; t.textContent = orig; } }, 4000); return; }
      if (t.dataset.mxDel) { const id = t.dataset.mxDel; state.matrix = state.matrix.filter((x) => x.id !== id); state.s4.gaps.forEach((g) => { g.studies = g.studies.filter((s) => s !== id); }); renderMatrix(); renderGaps(); }
      else { const id = t.dataset.gapDel; state.s4.gaps = state.s4.gaps.filter((x) => x.id !== id); if (state.s4.primary === id) state.s4.primary = state.s4.gaps.length ? state.s4.gaps[0].id : ''; renderGaps(); }
      onChange();
    });
  }
  function fillInputs() {
    renderDesignSelects();
    $$('[data-bind]').forEach((inp) => { const v = getPath(state, inp.dataset.bind); inp.value = v == null ? '' : v; });
    $$('input[data-multi]').forEach((i) => { i.checked = getPath(state, i.dataset.multi).indexOf(i.value) !== -1; });
    $$('input[data-bool]').forEach((i) => { i.checked = !!getPath(state, i.dataset.bool); });
    $$('input[data-rub]').forEach((i) => { i.checked = state.s12.scores[i.dataset.rub] === Number(i.value); });
    $$('input[data-sel]').forEach((i) => { i.checked = state.ui.sel[i.dataset.sel] === i.value; });
    renderMatrix(); renderGaps(); renderComposer();
  }
  function renderDesignSelects() { $$('select[data-design]').forEach((s) => { s.innerHTML = designOptions(); s.value = state.s1.design || ''; }); }

  /* ---------------- Validation ---------------- */
  const fieldOf = (n) => n.closest('.field, fieldset, .choice-group') || n.parentElement;
  function setErr(n, m) { const f = fieldOf(n), i = f.querySelector('.inp'); if (i) i.setAttribute('aria-invalid', 'true'); const e = f.querySelector('.err'); if (e) e.textContent = m; }
  function clearErr(n) { const f = fieldOf(n); if (!f) return; const i = f.querySelector('.inp'); if (i) i.removeAttribute('aria-invalid'); const e = f.querySelector('.err'); if (e) e.textContent = ''; }
  const gapOk = () => state.s4.gaps.some((g) => filled(g.statement) && (filled(g.evidence) || g.studies.length) && g.status);
  function validateStep(i, show) {
    const el = $('.step[data-step="' + i + '"]'); if (!el) return true;
    let ok = true, first = null;
    const fail = (n, m) => { ok = false; if (show) { if (n.classList.contains('err')) n.textContent = m; else setErr(n, m); if (!first) first = n; } };
    $$('[data-required]', el).forEach((inp) => {
      if (inp.closest('[hidden]')) return;
      const v = getPath(state, inp.dataset.bind), min = Number(inp.dataset.minwords || 0);
      if (!filled(v)) fail(inp, UI.required); else if (min && E.wc(v) < min) fail(inp, UI.tooShort(num(min))); else if (show) clearErr(inp);
    });
    $$('[data-required-pick]', el).forEach((g) => { if (!getPath(state, g.dataset.requiredPick)) fail(g, UI.chooseOne); });
    if (i === 3) { if (!gapOk()) fail($('#err-gap'), UI.needGap); else if (show) $('#err-gap').textContent = ''; }
    if (i === 9) { if (!filled(state.s10.draft)) fail($('#err-draft'), UI.needDraft); else if (show) $('#err-draft').textContent = ''; }
    if (show) {
      $('#form-alert').hidden = ok;
      if (!ok) { $('#form-alert').textContent = UI.fixErrors; const f = first.matches && first.matches('.inp, textarea, input, select') ? first : (first.querySelector ? first.querySelector('input, button, textarea, select') : null) || $('#form-alert'); if (f && f.focus) f.focus(); }
    }
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
    if (i === 3 && !state.s4.gaps.length) addGap();
    if (i === 9) { renderComposer(); if (!state.s10.draftEdited || !filled(state.s10.draft)) rebuildDraft(); }
    if (i === 12) { if (!filled(state.s13.final)) { state.s13.final = state.s10.draft; syncBound('s13.final'); } renderReport(false); }
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
  function stepperStatus() {
    $$('#stepper .stepdot').forEach((b, i) => { b.classList.toggle('done', i < state.step && validateStep(i, false)); b.disabled = i > state.maxStep + 1 || (i === state.maxStep + 1 && !validateStep(state.maxStep, false)); });
  }

  /* ---------------- Step 10: composer ---------------- */
  const headingsAllowed = () => E.headingsOn(state);
  function renderComposer() {
    const box = $('#composer'); if (!box) return;
    const useH = headingsAllowed() && state.s10.useHeadings;
    box.innerHTML = state.s10.order.map((id, i) => {
      const on = state.s10.on[id], n = E.wc(E.sectionText(id, state, RC));
      return '<div class="comp-row move-' + id + (on ? '' : ' off') + '" data-row="' + id + '"><div class="comp-head"><label class="radio-pill"><input type="checkbox" data-on="' + id + '"' + (on ? ' checked' : '') + '><span>' + RC.numerals[i] + '. ' + esc(RC.moveNames[id]) + '</span></label>' +
        (useH ? '<input class="inp" style="max-width:240px;min-height:34px;padding:4px 10px" data-label="' + id + '" value="' + attr(state.s10.labels[id]) + '" placeholder="' + attr(RC.headingDefaults[id]) + '" aria-label="' + attr(UI.headingFor(RC.moveNames[id])) + '">' : '') +
        '<span class="spacer"></span><span class="wc" data-sec-wc="' + id + '">' + esc(UI.words(num(n))) + '</span>' +
        '<button type="button" class="btn btn-ghost btn-sm" data-move="' + id + '" data-dir="-1"' + (i === 0 ? ' disabled' : '') + ' aria-label="' + attr(UI.moveUp + ': ' + RC.moveNames[id]) + '">↑</button>' +
        '<button type="button" class="btn btn-ghost btn-sm" data-move="' + id + '" data-dir="1"' + (i === state.s10.order.length - 1 ? ' disabled' : '') + ' aria-label="' + attr(UI.moveDown + ': ' + RC.moveNames[id]) + '">↓</button>' +
        (state.s10.edited[id] ? '<button type="button" class="btn btn-ghost btn-sm" data-reset-sec="' + id + '">' + esc(UI.resetSection) + '</button>' : '') + '</div>' +
        '<label class="sr-only" for="sec-' + id + '">' + esc(RC.moveNames[id]) + '</label><textarea id="sec-' + id + '" class="inp" data-sec="' + id + '" placeholder="' + attr(UI.sectionEmpty) + '"></textarea>' +
        '<span class="hint">' + esc(RC.moveHints[id]) + '</span></div>';
    }).join('');
    state.s10.order.forEach((id) => { const n = $('#sec-' + id); if (n) n.value = E.sectionText(id, state, RC); });
    const tg = $('[data-headings-toggle]'); if (tg) { const inp = $('input', tg); inp.disabled = !headingsAllowed(); $('[data-headings-note]', tg).textContent = headingsAllowed() ? label(RC.headingModes, state.s1.headings) : UI.headingsOff; }
  }
  function moveSection(id, dir) {
    const o = state.s10.order, i = o.indexOf(id), j = i + dir; if (j < 0 || j >= o.length) return;
    o[i] = o[j]; o[j] = id; renderComposer(); afterSections();
    const b = $('[data-move="' + id + '"][data-dir="' + dir + '"]'); if (b && !b.disabled) b.focus();
  }
  function afterSections() {
    state.s10.order.forEach((id) => { const n = $('[data-sec-wc="' + id + '"]'); if (n) n.textContent = UI.words(num(E.wc(E.sectionText(id, state, RC)))); });
    if (!state.s10.draftEdited) rebuildDraft(); else noteDraft();
    onChange();
  }
  function rebuildDraft() { state.s10.draft = E.assemble(state, RC); state.s10.draftEdited = false; syncBound('s10.draft'); noteDraft(); }
  function noteDraft() { $$('[data-draft-note]').forEach((n) => { n.textContent = state.s10.draftEdited ? UI.draftEditedNote : UI.draftAutoNote; }); }

  /* ---------------- Language and move checks ---------------- */
  const langHTML = (text) => diagList(RC.langMsg, E.languageCheck(text, RC, state.s11.terms, state.s1.title + ' ' + state.s1.topic).items);
  function movesHTML(text) {
    const mv = E.moves(text, RC.lex.moveCues, RC.lang);
    return MOVES.map((k) => '<span class="tag ' + (mv[k] ? 'tag-evidence' : 'tag-gold') + '">' + (mv[k] ? '✓ ' : '? ') + esc(RC.moveNames[k]) + '</span>').join('');
  }

  /* ---------------- Step outputs and diagnostics ---------------- */
  const ctx = () => ({ gap: E.primaryGap(state), kind: kind(), lines: E.lines });
  function refreshOutputs() {
    const set = (id, txt) => { const n = $('#' + id); if (n) n.textContent = txt; }, X = ctx();
    set('out-0', RC.tpl.profile(state));
    set('out-1', RC.tpl.territory(state, X));
    set('out-2', RC.tpl.scholarly(state, X));
    const g = X.gap; set('out-3', g ? RC.tpl.gap(Object.assign({}, state, { s5: { problem: '', tension: '' } }), X) : '');
    set('out-4', [state.s5.problem, state.s5.tension, state.s5.boundaries].filter(filled).map((x) => x.trim()).join(' '));
    set('out-5', RC.tpl.rationale(state, X));
    set('out-6', [RC.tpl.purpose(state, X), RC.tpl.questions(state, X)].filter(filled).join('\n'));
    set('out-7', RC.tpl.theory(state, X) || (state.s8.mode === 'none' ? state.s8.justification : ''));
    set('out-8', RC.tpl.contribution(state, X));
  }
  function stepDiag() {
    const d = (sel, M, list) => { const n = $(sel); if (n) n.innerHTML = diagList(M, list); };
    d('#diag-1', RC.contextMsg, E.contextChecks(RC.tpl.territory(state, ctx()), RC));
    d('#diag-2', RC.synthMsg, E.synthesis(state, RC));
    d('#diag-4', RC.problemMsg, E.problemChecks(state, RC));
    d('#diag-5', RC.rationaleMsg, E.rationaleChecks(state, RC));
    d('#diag-7', RC.theoryMsg, E.theoryChecks(state, RC));
    d('#diag-8', RC.contribMsg, E.contributionChecks(state, RC));
    const al = E.alignment(state, RC);
    $$('[data-align]').forEach((n) => { n.innerHTML = al.length ? diagList(RC.alignMsg, al) : '<p class="hint">' + esc(UI.chainEmpty) + '</p>'; });
    const k = kind(), dsg = label(RC.designs, state.s1.design);
    $$('[data-kind-note]').forEach((n) => { n.textContent = dsg ? UI.kindNote(dsg) : ''; });
    const ch = $('#align-chain');
    if (ch) {
      const g = E.primaryGap(state), lines = E.lines(state.s7.objectives);
      const items = [['problem', state.s5.problem], ['gap', g ? g.statement : ''], ['aim', state.s7.aim], ['objectives', lines.join(' · ')], ['question', state.s7.mainQ], ['contribution', state.s9.statement]];
      ch.innerHTML = items.map((x, i) => '<div class="chain-item' + (filled(x[1]) ? '' : ' empty') + '"><span class="n">' + RC.numerals[i] + '</span><strong>' + esc(UI.chain[x[0]]) + '</strong><span dir="auto">' + esc(filled(x[1]) ? x[1] : UI.chainEmpty) + '</span></div>').join('');
    }
    const tf = $('[data-theory-fields]'); if (tf) tf.hidden = !state.s8.mode || state.s8.mode === 'none';
    const sn = $('[data-stage-note]'); if (sn) sn.textContent = UI.stageNote[state.s1.status || ''];
    $$('[data-type-text]').forEach((f) => { const [p, id] = f.dataset.typeText.split(':'); f.hidden = getPath(state, p).indexOf(id) === -1; });
    void k;
  }

  /* ---------------- Step 12: checks, rubric, result ---------------- */
  function renderChecker() {
    const box = $('#checker'); if (!box) return;
    const list = E.checks(state, RC), order = { bad: 0, warn: 1, info: 2, ok: 3 };
    list.sort((a, b) => order[a.status] - order[b.status]);
    box.innerHTML = list.map((c) => diagItem(c.t, c.status, c.msg)).join('');
    const cnt = (k) => list.filter((c) => c.status === k).length;
    $('#checker-summary').textContent = ['bad', 'warn', 'ok'].map((k) => RC.statusLabel[k] + ': ' + num(cnt(k))).join(' · ');
  }
  function scoreSummary() {
    const sc = state.s12.scores, rated = RC.rubric.filter((c) => sc[c.id]);
    const mean = rated.length ? rated.reduce((a, c) => a + sc[c.id], 0) / rated.length : 0;
    return { sc, rated, mean, lvl: RC.levels.find((l) => mean >= l.min) || RC.levels[RC.levels.length - 1] };
  }
  function renderResult() {
    const box = $('#rubric-result'); if (!box) return;
    const { sc, rated, mean, lvl } = scoreSummary();
    const recs = RC.rubric.filter((c) => sc[c.id] && sc[c.id] <= 3).map((c) => '<li><strong>' + esc(c.t) + ':</strong> ' + esc(RC.rubricRec[c.id]) + '</li>');
    box.innerHTML = '<span class="small" style="color:#BDB6A4">' + esc(UI.overall) + '</span><span class="big">' + (rated.length ? fmt1(mean) : '—') + ' <span style="font-size:22px">' + esc(UI.outOf5) + '</span></span>' +
      (rated.length ? '<span class="lvl">' + esc(lvl.t) + '</span><span class="small">' + esc(lvl.d) + '</span>' : '') +
      '<div class="bars">' + RC.rubric.map((c) => '<div class="bar-row"><span>' + esc(c.t) + '</span><span class="bar" aria-hidden="true"><span style="width:' + ((sc[c.id] || 0) * 20) + '%"></span></span><span>' + (sc[c.id] ? RC.numerals[sc[c.id] - 1] : '—') + '</span></div>').join('') + '</div>' +
      (rated.length ? '<div><strong style="color:var(--gold-light)">' + esc(UI.recommendations) + '</strong>' + (recs.length ? '<ul class="list small">' + recs.join('') + '</ul>' : '<p class="small">' + esc(UI.noRecs) + '</p>') + '</div>' : '<p class="small">' + esc(UI.notRated) + '</p>');
  }

  /* ---------------- Step 13: report ---------------- */
  function refList() {
    const fromMx = state.matrix.map((m) => (m.ref || '').trim()).filter(Boolean);
    const own = E.lines(state.s13.refs);
    const seen = {}, out = [];
    own.concat(fromMx).forEach((r) => { const k = E.norm(r, RC.lang); if (!seen[k]) { seen[k] = 1; out.push(r); } });
    return out.sort((a, b) => a.localeCompare(b, AR ? 'ar' : 'en'));
  }
  function buildReportHTML() {
    const R = UI.report, L = UI.lbl, s = state, X = ctx(), T = RC.tpl;
    const p = (x) => '<p>' + esc(filled(x) ? x : UI.empty) + '</p>';
    const pre = (x) => '<p style="white-space:pre-line">' + esc(filled(x) ? x : UI.empty) + '</p>';
    const kv = (pairs) => { const rows = pairs.filter((x) => filled(x[1])); return rows.length ? '<ul>' + rows.map((x) => '<li><strong>' + esc(x[0]) + ':</strong> ' + esc(x[1]) + '</li>').join('') + '</ul>' : p(''); };
    const { sc, rated, mean, lvl } = scoreSummary();
    const date = new Date().toLocaleDateString(AR ? 'ar-SA' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
    let h = '<h2>' + esc(R.title) + '</h2><p class="meta">' + esc(R.generated(date)) + '</p>';
    h += '<h3>' + esc(R.researchTitle) + '</h3><p><strong>' + esc(s.s1.title || UI.empty) + '</strong></p>';
    h += '<h3>' + esc(R.profile) + '</h3>' + pre(T.profile(s));
    h += '<h3>' + esc(R.context) + '</h3>' + kv([[L.field, s.s2.field], [L.phenomenon, s.s2.phenomenon], [L.current, s.s2.current], [L.setting, s.s2.setting], [L.importance, s.s2.importance], [L.refs, s.s2.refs]]);
    h += '<h3>' + esc(R.background) + '</h3>' + p(s.s3.synthesis) + kv([[L.traditions, s.s3.traditions], [L.theories, s.s3.theories], [L.findings, s.s3.findings], [L.debates, s.s3.debates], [L.disagreements, s.s3.disagreements], [L.methods, s.s3.methods]]);
    if (s.matrix.length) h += '<h3>' + esc(R.matrix) + '</h3><table><thead><tr>' + ['cite', 'claim', 'theory', 'method', 'rel', 'note'].map((c) => '<th>' + esc(UI.mxCols[c]) + '</th>').join('') + '</tr></thead><tbody>' + s.matrix.map((m) => '<tr>' + ['cite', 'claim', 'theory', 'method', 'rel', 'note'].map((c) => '<td>' + esc(c === 'rel' ? label(RC.relTypes, m.rel) : m[c]) + '</td>').join('') + '</tr>').join('') + '</tbody></table>';
    h += '<h3>' + esc(R.gap) + '</h3>' + (s.s4.gaps.length ? '<ul>' + s.s4.gaps.map((g) => '<li>' + (g.id === s.s4.primary ? '<strong>' : '') + esc(g.statement || UI.empty) + (g.id === s.s4.primary ? '</strong>' : '') + ' — ' + esc(L.type) + ': ' + esc(label(RC.gapTypes, g.type) || UI.empty) + '; ' + esc(L.status) + ': ' + esc(label(RC.gapStatuses, g.status) || UI.empty) + (filled(g.evidence) ? '; ' + esc(L.evidence) + ': ' + esc(g.evidence) : '') + '</li>').join('') + '</ul>' : p('')) + (filled(s.s4.basis) ? '<p><strong>' + esc(L.basis) + ':</strong> ' + esc(s.s4.basis) + '</p>' : '');
    h += '<h3>' + esc(R.problem) + '</h3>' + p(s.s5.problem) + kv([[L.issue, s.s5.issue], [L.evidence, s.s5.evidence], [L.tension, s.s5.tension], [L.boundaries, s.s5.boundaries], [L.relevance, s.s5.relevance]]);
    h += '<h3>' + esc(R.rationale) + '</h3>' + p(s.s6.rationale) + kv(RC.sigTypes.filter((t) => s.s6.sig.indexOf(t.id) !== -1).map((t) => [t.t, s.s6.sigText[t.id] || '✓']));
    h += '<h3>' + esc(R.aims) + '</h3>' + kv([[L.aim, s.s7.aim], [L.objectives, E.lines(s.s7.objectives).join(' · ')], [L.mainQ, s.s7.mainQ], [L.subQs, E.lines(s.s7.subQs).join(' · ')], [L.hypotheses, E.lines(s.s7.hypotheses).join(' · ')]]);
    h += '<h3>' + esc(R.theory) + '</h3>' + kv([[L.types, label(RC.theoryModes, s.s8.mode)], [L.perspective, [s.s8.theory && s.s8.theory !== 'other' ? label(RC.theories, s.s8.theory) : '', s.s8.theoryOther].filter(filled).join(' — ')], [L.concepts, s.s8.concepts], [L.approach, s.s8.approach], [L.relation, s.s8.relation], [L.justification, s.s8.justification]]);
    h += '<h3>' + esc(R.contribution) + '</h3>' + p(s.s9.statement) + kv(RC.contribTypes.filter((t) => s.s9.types.indexOf(t.id) !== -1).map((t) => [t.t, s.s9.typeText[t.id] || '✓']).concat([[L.organisation, s.s9.organisation]]));
    h += '<h3>' + esc(R.draft) + '</h3>' + pre(s.s10.draft);
    h += '<h3>' + esc(R.evaluation) + '</h3>' + (rated.length ? '<ul>' + RC.rubric.map((cr) => '<li>' + esc(cr.t) + ': ' + (sc[cr.id] ? RC.numerals[sc[cr.id] - 1] + ' ' + esc(UI.outOf5) : esc(UI.notRated)) + '</li>').join('') + '</ul><p><strong>' + esc(UI.overall) + ':</strong> ' + esc(fmt1(mean)) + ' ' + esc(UI.outOf5) + ' — ' + esc(lvl.t) + '</p>' : p(UI.notRated)) +
      (filled(s.s12.self) ? '<p><strong>' + esc(R.self) + ':</strong> ' + esc(s.s12.self) + '</p>' : '') + '<p><em>' + esc(UI.evalDisclaimer) + '</em></p>';
    const recs = []; RC.rubric.forEach((cr) => { if (sc[cr.id] && sc[cr.id] <= 3) recs.push(cr.t + ': ' + RC.rubricRec[cr.id]); });
    E.checks(s, RC).forEach((x) => { if (x.status === 'bad' || x.status === 'warn') recs.push(x.t + ': ' + x.msg); });
    h += '<h3>' + esc(R.recs) + '</h3>' + (recs.length ? '<ul>' + [...new Set(recs)].map((r) => '<li>' + esc(r) + '</li>').join('') + '</ul>' : p(R.noRecs));
    h += '<h3>' + esc(R.final) + '</h3>' + pre(s.s13.final);
    const refs = refList();
    h += '<h3>' + esc(R.refs) + '</h3>' + (refs.length ? '<ul>' + refs.map((r) => '<li>' + esc(r) + '</li>').join('') + '</ul>' : p(R.noRefs));
    if (filled(s.s13.notes)) h += '<h3>' + esc(R.notes) + '</h3>' + pre(s.s13.notes);
    h += '<p class="meta">' + esc(R.footer) + '</p>';
    void X; return h;
  }
  function sanitize(html) {
    const doc = new DOMParser().parseFromString('<div>' + html + '</div>', 'text/html');
    const ok = ['DIV', 'P', 'H2', 'H3', 'H4', 'UL', 'OL', 'LI', 'STRONG', 'B', 'EM', 'I', 'BR', 'SPAN', 'U', 'TABLE', 'THEAD', 'TBODY', 'TR', 'TH', 'TD'];
    const walk = (n) => Array.from(n.children).forEach((c) => { if (ok.indexOf(c.tagName) === -1) { c.replaceWith(document.createTextNode(c.textContent)); return; } Array.from(c.attributes).forEach((a) => { if (a.name !== 'class' && !(a.name === 'style' && /^white-space:\s*pre-line;?$/.test(a.value))) c.removeAttribute(a.name); }); walk(c); });
    walk(doc.body.firstChild); return doc.body.firstChild.innerHTML;
  }
  function renderReport(force) {
    const r = $('#report'); if (!r) return;
    if (force || !state.report.edited || !filled(state.report.html)) { state.report.html = buildReportHTML(); state.report.edited = false; }
    if (document.activeElement !== r) r.innerHTML = sanitize(state.report.html);
  }
  function download(name, parts, type) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(parts, { type })); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); }
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise((res, rej) => { const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy') ? res() : rej(); } catch (e) { rej(e); } finally { ta.remove(); } });
  }
  function confirmClick(btn, lbl, action, need) {
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const orig = btn.dataset.label || btn.textContent; btn.dataset.label = orig;
      if (btn.dataset.armed === '1') { btn.dataset.armed = ''; btn.textContent = orig; action(); return; }
      if (need && !need()) { action(); return; }
      btn.dataset.armed = '1'; btn.textContent = lbl; setTimeout(() => { btn.dataset.armed = ''; btn.textContent = orig; }, 4000);
    });
  }

  /* ---------------- Tools outside the Builder ---------------- */
  function renderSelector() {
    const box = $('#selector-q'); if (!box) return;
    if (!box.dataset.ready) {
      box.innerHTML = RC.selector.q.map((q) => '<fieldset><legend>' + esc(q.t) + '</legend><div class="radio-row">' + q.o.map((o) => '<label class="radio-pill"><input type="radio" name="sel-' + q.id + '" data-sel="' + q.id + '" value="' + o.id + '"><span>' + esc(o.t) + '</span></label>').join('') + '</div></fieldset>').join('');
      box.dataset.ready = '1';
      $$('input[data-sel]', box).forEach((i) => { i.checked = state.ui.sel[i.dataset.sel] === i.value; });
    }
    const out = $('#selector-out'); if (!out) return;
    const r = E.structureFor(state.ui.sel);
    if (!r) { out.innerHTML = '<span class="hint">' + esc(UI.selEmpty) + '</span>'; return; }
    const W = RC.selector.why, why = [W[state.ui.sel.kind], W[state.ui.sel.venue], W[state.ui.sel.status]].filter(Boolean);
    out.innerHTML = '<span class="k">' + esc(UI.selResult) + '</span><ol class="list">' + r.order.map((m) => '<li>' + esc(RC.moveNames[m]) + (r.off.indexOf(m) !== -1 ? ' <span class="tag tag-gold">' + esc(UI.selOff) + '</span>' : '') + '</li>').join('') + '</ol>' +
      '<strong>' + esc(UI.selWhy) + '</strong><ul class="list small">' + why.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul><button type="button" class="btn btn-primary btn-sm" id="btn-apply-struct">' + esc(UI.structApply) + '</button>';
    $('#btn-apply-struct').addEventListener('click', () => {
      state.s10.order = r.order.slice(); MOVES.forEach((m) => { state.s10.on[m] = r.off.indexOf(m) === -1; });
      renderComposer(); afterSections(); toast(UI.structApplied);
    });
  }
  function renderLangTool() {
    const ta = $('#lc-text'), out = $('#lc-out'), mv = $('#lc-moves'); if (!ta || !out) return;
    out.innerHTML = filled(ta.value) ? langHTML(ta.value) : '';
    if (mv) mv.innerHTML = filled(ta.value) ? movesHTML(ta.value) : '';
  }
  function renderClaimTool() {
    const ta = $('#claim-text'), out = $('#claim-out'); if (!ta || !out) return;
    out.innerHTML = filled(ta.value) ? diagList(RC.claimMsg, E.claimCheck(ta.value, RC)) : '';
  }
  function renderGuides() {
    const set = (sel, html) => { const n = $(sel); if (n) n.innerHTML = html; };
    const cards = (arr) => arr.map((g) => '<article class="card"><h3>' + esc(g.t) + '</h3>' + (g.d ? '<p>' + esc(g.d) + '</p>' : '') + (g.items ? '<ul class="list small">' + g.items.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '') + (g.ex ? '<p class="small cite">' + esc(g.ex) + '</p>' : '') + '</article>').join('');
    set('#funnel', RC.funnel.map((f) => '<div class="chain-item"><strong>' + esc(f.t) + '</strong><span>' + esc(f.d) + '</span></div>').join(''));
    set('#openings', RC.openings.map((o) => '<article class="card">' + cmpBox(o.weak, o.better) + '<p class="small"><strong>' + esc(UI.whyWorks) + '</strong> ' + esc(o.why) + '</p></article>').join(''));
    set('#openings-2', RC.openings.map((o) => '<article class="card">' + cmpBox(o.weak, o.better) + '<p class="small"><strong>' + esc(UI.whyWorks) + '</strong> ' + esc(o.why) + '</p></article>').join(''));
    set('#synth-guide', cards(RC.synthGuide));
    set('#synth-compare', cmpBox(RC.summaryVsSynth.weak, RC.summaryVsSynth.better));
    set('#gap-types', cards(RC.gapTypes));
    set('#gap-ladder', ladder());
    set('#dist-table', table(UI.distCols, RC.distinctions));
    set('#sig-types', cards(RC.sigTypes.map((x) => ({ t: x.t, d: x.d, ex: x.ph }))));
    set('#sig-table', table(UI.sigCols, RC.sigRows));
    set('#contrib-types', cards(RC.contribTypes.map((x) => ({ t: x.t, d: x.d, ex: x.ph }))));
    set('#q-guide', table(UI.qCols, RC.questionGuide));
    set('#rewrite-tool', RC.rewrite.map((r) => '<article class="card"><h3>' + esc(r.t) + '</h3><ul class="list">' + r.tpl.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul><p class="small"><strong>' + esc(UI.tip) + '</strong> ' + esc(r.tip) + '</p></article>').join(''));
    set('#transitions', cards(RC.transitionBank));
    set('#mistakes', RC.mistakes.map((m) => '<article class="card"><h3>' + esc(m.t) + '</h3><p>' + esc(m.d) + '</p><p class="small"><strong>' + esc(UI.fix) + '</strong> ' + esc(m.fix) + '</p></article>').join(''));
    set('#rubric-guide', '<thead><tr>' + UI.rubricCols.map((c) => '<th scope="col">' + esc(c) + '</th>').join('') + '</tr></thead><tbody>' + RC.rubric.map((c) => '<tr><th scope="row">' + esc(c.t) + '</th><td>' + esc(RC.rubricDesc[c.id][0]) + '</td><td>' + esc(RC.rubricDesc[c.id][1]) + '</td><td>' + esc(RC.rubricDesc[c.id][2]) + '</td></tr>').join('') + '</tbody>');
    $$('[data-claim-title]').forEach((n) => { n.textContent = UI.claimTitle; });
    $$('[data-claim-hint]').forEach((n) => { n.textContent = UI.claimHint; });
    const ct = $('#claim-text'); if (ct) ct.placeholder = UI.claimPh;
    const g = $('#steps') ? $('#steps').dataset.guide : '';
    set('#guide-topics', RC.guideTopics.map((t, i) => '<li>' + RC.numerals[i] + '. ' + esc(t) + '</li>').join(''));
    set('#guide-steps', RC.stepText.map((s, i) => '<li><a href="' + attr(g) + '#step-' + (i + 1) + '" target="_blank" rel="noopener noreferrer">' + esc(UI.guideStep(RC.numerals[i], RC.steps[i])) + '</a></li>').join(''));
  }
  function renderExamples() {
    const list = $('#ex-list'), pub = $('#pub-list'), filters = $('#ex-filters'); if (!list) return;
    const moveRows = (mv) => '<div class="moves">' + mv.map((m) => '<div class="move mv-' + m.m + '"><span class="mv">' + esc(RC.moveNames[m.m]) + '</span><span dir="auto">' + esc(m.t) + '</span></div>').join('') + '</div>';
    const areas = [...new Set(RC.examples.map((e) => e.area).concat(RC.published.map((e) => e.area)))];
    const apply = (id) => { $$('#ex-list .ex-card, #pub-list .ex-card').forEach((c) => { c.hidden = !(id === '*' || c.dataset.area === id); }); };
    const mk = (id, t) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'chip-btn'; b.textContent = t; b.setAttribute('aria-pressed', id === '*' ? 'true' : 'false'); b.addEventListener('click', () => { $$('.chip-btn', filters).forEach((x) => x.setAttribute('aria-pressed', x === b ? 'true' : 'false')); apply(id); }); filters.appendChild(b); };
    mk('*', UI.exAll); areas.forEach((a) => mk(a, a));
    list.innerHTML = RC.examples.map((e) => '<article class="ex-card" data-area="' + attr(e.area) + '"><div class="tags"><span class="tag">' + esc(e.area) + '</span><span class="tag">' + esc(e.approach) + '</span><span class="tag tag-illustrative">' + esc(UI.exHyp) + '</span></div><h3 class="ex-title">' + esc(e.title) + '</h3>' + moveRows(e.moves) + '<p class="why small"><strong>' + esc(UI.whyWorks) + '</strong> ' + esc(e.why) + '</p></article>').join('');
    pub.innerHTML = RC.published.map((e) => '<article class="ex-card ex-pub" data-area="' + attr(e.area) + '"><div class="tags"><span class="tag">' + esc(e.area) + '</span><span class="tag">' + esc(e.approach) + '</span><span class="tag tag-evidence">' + esc(UI.exPub) + '</span></div><p class="pub-title" lang="en" dir="ltr">' + linkify(e.ref) + '</p><p class="why small"><strong>' + esc(UI.lesson) + '</strong> ' + esc(e.lesson) + '</p></article>').join('');
  }
  function renderGlossary() {
    const body = $('#gloss-body'); if (!body) return;
    const head = $('#gloss-head'); if (head) head.innerHTML = '<tr>' + UI.glossCols.map((c) => '<th scope="col">' + esc(c) + '</th>').join('') + '</tr>';
    body.innerHTML = (window.RIN_GLOSSARY || []).map((g) => {
      const cols = AR ? [['ar', g.ar], ['en', g.en], ['ar', g.defAr], ['en', g.defEn]] : [['en', g.en], ['ar', g.ar], ['en', g.defEn], ['ar', g.defAr]];
      return '<tr data-search="' + attr(E.norm([g.ar, g.en, g.defAr, g.defEn].join(' '), 'ar')) + '">' + cols.map((c) => '<td lang="' + c[0] + '" dir="' + (c[0] === 'ar' ? 'rtl' : 'ltr') + '">' + esc(c[1]) + '</td>').join('') + '</tr>';
    }).join('');
  }
  function filterGlossary() {
    const q = E.norm($('#gloss-search').value, 'ar'); let shown = 0;
    $$('#gloss-body tr').forEach((tr) => { const ok = !q || tr.dataset.search.indexOf(q) !== -1; tr.hidden = !ok; if (ok) shown++; });
    $('#gloss-empty').hidden = shown !== 0;
  }
  function renderRefs() {
    const box = $('#refs-list'); if (!box) return;
    box.innerHTML = (window.RIN_REFS || []).map((g) => '<div class="ref-group"><h3>' + esc(UI.refGroups[g.id]) + '</h3><ol>' + g.items.map((r) => { const ar = /[؀-ۿ]/.test(r.text.slice(0, 20)); return '<li lang="' + (ar ? 'ar' : 'en') + '" dir="' + (ar ? 'rtl' : 'ltr') + '">' + linkify(r.text) + ' <span class="tag ref-type" lang="' + RC.lang + '" dir="' + (AR ? 'rtl' : 'ltr') + '">' + esc(UI.refTypes[r.type]) + '</span></li>'; }).join('') + '</ol></div>').join('');
  }

  /* ---------------- Refresh ---------------- */
  function refresh() {
    $$('[data-pick]').forEach((b) => b.setAttribute('aria-pressed', getPath(state, b.dataset.pick) === b.dataset.id ? 'true' : 'false'));
    $$('label.chk').forEach((l) => { const i = $('input', l); if (i) l.classList.toggle('on', i.checked); });
    refreshOutputs(); stepDiag(); gapDiag();
    if (state.step === 9) state.s10.order.forEach((id) => { const n = $('#sec-' + id); if (n && document.activeElement !== n && !state.s10.edited[id]) n.value = E.sectionText(id, state, RC); });
    const rl = $('#refine-list'); if (rl) rl.innerHTML = filled(state.s10.draft) ? langHTML(state.s10.draft) : '<p class="hint">' + esc(UI.needDraft) + '</p>';
    const ml = $('#move-list'); if (ml) ml.innerHTML = filled(state.s10.draft) ? movesHTML(state.s10.draft) : '';
    $$('[data-wc-inline]').forEach((n) => { n.textContent = UI.words(num(E.wc(state.s10.draft))); });
    const fw = $('#final-wc'); if (fw) fw.textContent = UI.words(num(E.wc(state.s13.final)));
    renderChecker();
    const sug = E.suggestScores(state, RC);
    RC.rubric.forEach((c) => { const n = $('[data-suggest="' + c.id + '"]'); if (n) n.textContent = UI.suggestedScore + ' ' + RC.numerals[sug[c.id] - 1]; });
    renderResult();
    $$('[data-checklist-progress]').forEach((n) => { n.textContent = UI.checklistDone(num(state.s11.checks.length), num(RC.checklist.length)); });
  }
  let raf = null;
  function onChange() { suppressSave = false; save(); if (raf) cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { refresh(); stepperStatus(); }); }

  /* ---------------- Controls ---------------- */
  function wire() {
    $('#btn-next').addEventListener('click', () => { if (validateStep(state.step, true)) goTo(state.step + 1, true); });
    $('#btn-prev').addEventListener('click', () => goTo(state.step - 1, true));
    $('#btn-add-gap').addEventListener('click', addGap);
    confirmClick($('#btn-rebuild'), UI.rebuildConfirm, () => { rebuildDraft(); onChange(); toast(UI.rebuilt); }, () => state.s10.draftEdited);
    $('#btn-apply-scores').addEventListener('click', () => { state.s12.scores = E.suggestScores(state, RC); $$('input[data-rub]').forEach((i) => { i.checked = state.s12.scores[i.dataset.rub] === Number(i.value); }); onChange(); toast(UI.scoresApplied); });
    confirmClick($('#btn-final-from-draft'), UI.replaceConfirm, () => { state.s13.final = state.s10.draft; syncBound('s13.final'); onChange(); toast(UI.finalCopied); }, () => filled(state.s13.final) && state.s13.final !== state.s10.draft);
    const rep = $('#report');
    rep.addEventListener('input', () => { state.report.html = sanitize(rep.innerHTML); state.report.edited = true; save(); });
    confirmClick($('#btn-regen-report'), UI.regenConfirm, () => { renderReport(true); save(); toast(UI.reportRebuilt); }, () => state.report.edited);
    $('#btn-copy-report').addEventListener('click', () => copyText(rep.innerText).then(() => toast(UI.copied), () => toast(UI.copyFail)));
    $('#btn-print').addEventListener('click', () => { renderReport(false); window.print(); });
    $('#btn-doc').addEventListener('click', () => {
      renderReport(false);
      const dir = AR ? 'rtl' : 'ltr';
      const html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>' + esc(UI.report.title) + '</title><style>body{font-family:' + (AR ? 'Arial,"Traditional Arabic"' : 'Calibri,Arial') + ',sans-serif;font-size:11pt;line-height:1.5;direction:' + dir + ';text-align:' + (AR ? 'right' : 'left') + '}h2{font-size:18pt;color:#1F6F6B}h3{font-size:13pt;color:#1F6F6B;margin-top:14pt}.meta{color:#555;font-size:9pt}table{border-collapse:collapse;width:100%}td,th{border:1px solid #bbb;padding:4pt;font-size:9.5pt;vertical-align:top}</style></head><body dir="' + dir + '" lang="' + RC.lang + '">' + sanitize(rep.innerHTML) + '</body></html>';
      download(UI.fileReport + '.doc', ['﻿', html], 'application/msword');
    });
    $('#btn-txt').addEventListener('click', () => { renderReport(false); download(UI.fileReport + '.txt', ['﻿', rep.innerText], 'text/plain;charset=utf-8'); });
    $$('[data-action="delete"]').forEach((btn) => confirmClick(btn, UI.deleteAll, () => {
      try { localStorage.removeItem(STORE_KEY); } catch (e) { /* ignore */ }
      suppressSave = true; clearTimeout(saveTimer); state = defaults(); openRows.clear(); fillInputs(); renderSelectorReset(); goTo(0, false); updateSaveStatus();
      try { localStorage.removeItem(STORE_KEY); } catch (e) { /* ignore */ }
      toast(UI.deleted);
    }));
    $$('[data-action="export"]').forEach((btn) => btn.addEventListener('click', () => download(UI.fileData, [JSON.stringify(state, null, 2)], 'application/json')));
    const fi = $('#file-import');
    if (fi) fi.addEventListener('change', () => {
      const f = fi.files[0]; if (!f) return;
      const rd = new FileReader();
      rd.onload = () => {
        try { const data = JSON.parse(rd.result); if (!data || data.v !== 1 || !data.s1 || !data.s10) throw new Error('bad'); state = merge(defaults(), data); suppressSave = false; fillInputs(); renderSelectorReset(); goTo(state.step, false); save(true); toast(UI.imported); }
        catch (e) { toast(UI.importFail); }
        fi.value = '';
      };
      rd.readAsText(f);
    });
    $$('[data-lang-switch]').forEach((a) => a.addEventListener('click', () => { save(true); try { localStorage.setItem(LANG_KEY, a.dataset.langSwitch); } catch (e) { /* ignore */ } a.href = a.getAttribute('href').split('#')[0] + (location.hash || ''); }));
    window.addEventListener('beforeunload', () => save(true));
  }
  function renderSelectorReset() { const b = $('#selector-q'); if (b) { b.dataset.ready = ''; renderSelector(); } }

  /* ---------------- Boot ---------------- */
  load();
  renderBuilder(); renderChecklists(); renderGuides(); renderExamples(); renderGlossary(); renderRefs();
  bind(); fillInputs(); wire(); renderSelector();
  const m = /^#step-(\d+)$/.exec(location.hash);
  goTo(m ? Math.min(Number(m[1]) - 1, state.maxStep) : state.step, !!m);
  updateSaveStatus();
})();
