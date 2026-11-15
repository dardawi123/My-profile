/* =========================================================
   Research Abstract Writing and Refinement in Film and Television Studies
   صياغة ملخص البحث وتنقيحه في الدراسات السينمائية والتلفزيونية — application logic

   Language-neutral. Wording comes from window.RC (rabstract-ar.js or
   rabstract-en.js); rules from window.RAE (engine.js); shared data from
   glossary.js and references.js. Data stays in this browser
   (localStorage); nothing is sent to a server.
   Academic tool developed by Dr. Merfat Alardawi | د. مرفت العرضاوي
   ========================================================= */
(function () {
  'use strict';
  const RC = window.RC, E = window.RAE;
  if (!RC || !E) { console.error('RAB: required scripts are missing.'); return; }
  const UI = RC.ui;
  const STORE_KEY = 'rab.data.v1', LANG_KEY = 'rab.lang', STEPS = 12;
  const AR = RC.lang === 'ar';
  const SECTIONS = ['background', 'aim', 'methods', 'results', 'conclusion', 'limits'];
  /* Method fields shown for each kind of design, and the ones that are required. */
  const KIND_FIELDS = {
    interview: ['sample', 'sampling', 'collection', 'analysis', 'context'],
    textual: ['corpus', 'sampling', 'framework', 'analysis', 'context'],
    survey: ['sample', 'sampling', 'collection', 'analysis', 'context'],
    qcontent: ['corpus', 'sampling', 'framework', 'analysis', 'context'],
    mixed: ['qual', 'quant', 'integration', 'sample', 'context'],
    review: ['corpus', 'sampling', 'framework', 'analysis']
  };
  const KIND_REQ = { interview: ['sample', 'collection', 'analysis'], textual: ['corpus', 'analysis'], survey: ['sample', 'collection', 'analysis'], qcontent: ['corpus', 'framework', 'analysis'], mixed: ['qual', 'quant', 'integration'], review: ['corpus', 'analysis'] };
  const M_KEYS = ['sample', 'sampling', 'collection', 'corpus', 'framework', 'analysis', 'context', 'qual', 'quant', 'integration'];

  /* ---------------- State ---------------- */
  function defaults() {
    const on = {}, text = {}, edited = {}, labels = {};
    SECTIONS.forEach((s) => { on[s] = s !== 'limits'; text[s] = ''; edited[s] = false; labels[s] = ''; });
    return {
      v: 1, step: 0, maxStep: 0, savedAt: null,
      s1: { title: '', journal: '', problem: '', question: '', objectives: '', field: '', approach: '', design: '', venue: '', lang: '', format: '', limit: '250', customLimit: '' },
      s2: { topic: '', context: '', issue: '', problem: '', justification: '' },
      s3: { aim: '', objectives: '', question: '', focus: '', useQ: false },
      s4: { sample: '', sampling: '', collection: '', corpus: '', framework: '', analysis: '', context: '', qual: '', quant: '', integration: '' },
      s5: { main: '', support: '', themes: '', stats: '', answer: '' },
      s6: { contribution: '', theory: '', method: '', context: '', practical: '', limits: '' },
      s7: { order: SECTIONS.slice(), on, text, edited, labels, headings: 'generic', paras: 'one', draft: '', draftEdited: false },
      s8: { checks: [] },
      s9: { kwMin: '3', kwMax: '6', rules: [] },
      s10: { keywords: [] },
      s11: { scores: {}, self: '' },
      s12: { final: '', notes: '' },
      report: { html: '', edited: false },
      ui: { sel: {}, wcLimit: '250', wcCustom: '' }
    };
  }
  function uid() { return 'x' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  const str = (x) => typeof x === 'string' ? x : '';
  function merge(base, src) {
    if (!src || typeof src !== 'object') return base;
    Object.keys(base).forEach((k) => {
      if (!(k in src)) return;
      const b = base[k], s = src[k];
      if (k === 'order') { const ok = Array.isArray(s) ? s.filter((x) => SECTIONS.indexOf(x) !== -1) : []; base[k] = ok.concat(SECTIONS.filter((x) => ok.indexOf(x) === -1)); }
      else if (k === 'keywords') base[k] = Array.isArray(s) ? s.slice(0, 20).filter((x) => x && typeof x === 'object').map((x) => ({ id: str(x.id) || uid(), en: str(x.en), ar: str(x.ar), cat: str(x.cat) || 'topic' })) : [];
      else if (k === 'rules') base[k] = Array.isArray(s) ? s.slice(0, 20).filter((x) => x && typeof x === 'object').map((x) => ({ id: str(x.id) || uid(), t: str(x.t), done: !!x.done })) : [];
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

  function toast(msg) {
    const t = $('#toast'); if (!t) return;
    t.textContent = msg; t.hidden = false;
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
  function meta(path) { return RC.f[path] || {}; }
  function F(path, type, o) {
    o = o || {};
    const f = o.meta || meta(path), id = idOf(path, o.sfx), hid = id + '-h';
    const req = o.req ? ' data-required="1"' + (o.min ? ' data-minwords="' + o.min + '"' : '') : '';
    const common = ' id="' + id + '" class="inp" data-bind="' + path + '"' + req + (f.ph ? ' placeholder="' + attr(f.ph) + '"' : '') + ' aria-describedby="' + hid + '"' + (o.dir ? ' dir="' + o.dir + '"' : '');
    const ctl = type === 'textarea' ? '<textarea' + common + '></textarea>' : '<input' + common + (o.inputmode ? ' inputmode="' + o.inputmode + '"' : '') + '>';
    return '<div class="field"' + (o.key ? ' data-mkey="' + o.key + '"' : '') + (o.show ? ' data-show="' + o.show + '"' : '') + '><label for="' + id + '">' + esc(f.label) + (o.req ? '<span class="req" aria-hidden="true">*</span>' : '') + '</label>' + ctl +
      '<span class="hint" id="' + hid + '">' + esc(f.hint || '') + '</span><span class="err" aria-live="polite"></span></div>';
  }
  function SEL(path, opts, o) {
    o = o || {};
    const f = meta(path), id = idOf(path, o.sfx);
    return '<div class="field"><label for="' + id + '">' + esc(f.label) + (o.req ? '<span class="req" aria-hidden="true">*</span>' : '') + '</label><select id="' + id + '" class="inp" data-bind="' + path + '"' + (o.req ? ' data-required="1"' : '') + (o.design ? ' data-design="1"' : '') + (f.hint ? ' aria-describedby="' + id + '-h"' : '') + '>' +
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
  const OUT = (i, extra) => '<div class="output-box"><span class="k">' + esc(RC.stepText[i].out) + '</span><span class="v" id="out-' + i + '" style="white-space:pre-line"></span>' + (extra || '') + '</div>';
  const diagItem = (t, s, m) => '<div class="diag-item st-' + s + '"><span class="ic" aria-hidden="true">' + icon(s) + '</span>' + (t ? '<span class="t">' + esc(t) + '<span class="status-label">' + esc(RC.statusLabel[s]) + '</span></span>' : '') + '<span class="d">' + esc(m) + '</span></div>';
  const cmpBox = (w, b) => '<div class="compare"><div class="ex-weak"><b>' + esc(UI.weak) + '</b>' + esc(w) + '</div><div class="ex-better"><b>' + esc(UI.better) + '</b>' + esc(b) + '</div></div>';
  function designOptions() {
    const ap = state.s1.approach;
    const list = RC.designs.filter((d) => !ap || d.a === ap);
    const groups = RC.approaches.filter((a) => !ap || a.id === ap);
    return '<option value="">' + esc(ap ? UI.chooseDesign : UI.chooseApproachFirst) + '</option>' + groups.map((g) => '<optgroup label="' + attr(g.t) + '">' + list.filter((d) => d.a === g.id).map((d) => '<option value="' + d.id + '">' + esc(d.t) + '</option>').join('') + '</optgroup>').join('');
  }
  function limitOptions() { return RC.limits.map((l) => '<option value="' + l.id + '">' + esc(l.t) + '</option>').join(''); }
  /* Link from each Builder step to the matching section of the User Guide (URL and labels come from #steps). */
  function guideLink(i) {
    const box = document.getElementById('steps'), g = box && box.dataset.guide;
    if (!g) return '';
    return '<a class="step-guide" href="' + attr(g) + '#step-' + (i + 1) + '" target="_blank" rel="noopener noreferrer">' + esc(box.dataset.guideLabel || '') +
      '<span class="sr-only">' + esc(box.dataset.guideNewtab || '') + '</span></a>';
  }

  /* ---------------- Builder markup ---------------- */
  function methodFields() {
    return '<div class="mfields" id="mfields"><div class="mfields-head" id="mfields-head"></div>' +
      M_KEYS.map((k) => F('s4.' + k, 'textarea', { key: k })).join('') + '</div>';
  }
  function stepBody(i) {
    const T = RC.stepText[i];
    switch (i) {
      case 0: return G2(F('s1.title', 'text', { req: 1 }), F('s1.journal', 'text')) + F('s1.problem', 'textarea', { req: 1, min: 8 }) +
        G2(F('s1.question', 'textarea'), F('s1.objectives', 'textarea')) +
        SEL('s1.field', '<option value=""></option>' + RC.fields.map((x) => '<option value="' + x.id + '">' + esc(x.t) + '</option>').join('')) +
        PICK('s1.approach', RC.approaches, { cols: 'g-200' }) + SEL('s1.design', designOptions(), { req: 1, design: 1 }) +
        PICK('s1.venue', RC.venues, { cols: 'g-200' }) + PICK('s1.lang', RC.langs, { cols: 'g-200' }) + PICK('s1.format', RC.formats) +
        G2(SEL('s1.limit', limitOptions()), F('s1.customLimit', 'text', { inputmode: 'numeric', show: 'custom' })) +
        '<p class="hint">' + esc(UI.structureHelp) + ' <a href="#structure">' + esc(UI.structureLink) + '</a></p>' + OUT(0);
      case 1: return F('s2.topic', 'text') + F('s2.context', 'textarea', { req: 1, min: 6 }) + G2(F('s2.issue', 'textarea'), F('s2.problem', 'textarea', { req: 1, min: 6 })) + F('s2.justification', 'textarea') +
        cmpBox(T.weak, T.better) + OUT(1, '<span class="small muted" id="out-1-wc"></span>') + '<div class="diag" id="diag-1"></div>';
      case 2: return F('s3.aim', 'textarea', { req: 1, min: 6 }) + G2(F('s3.objectives', 'textarea'), F('s3.question', 'textarea')) + F('s3.focus', 'text') +
        '<label class="chk" style="max-width:640px"><input type="checkbox" data-bool="s3.useQ"><span class="txt"><strong>' + esc(UI.useQ) + '</strong><span>' + esc(UI.useQHint) + '</span></span></label>' +
        cmpBox(T.weak, T.better) + '<div class="diag" id="diag-2"></div>' + OUT(2);
      case 3: return PICK('s1.approach', RC.approaches, { cols: 'g-200', sfx: 'm' }) + SEL('s1.design', designOptions(), { req: 1, design: 1, sfx: 'm' }) +
        '<div class="explain" id="kind-tip" hidden></div>' + methodFields() + '<div class="diag" id="diag-3"></div>' + OUT(3);
      case 4: return F('s5.main', 'textarea', { req: 1, min: 6 }) + F('s5.support', 'textarea') + F('s5.themes', 'textarea', { show: 'qual' }) + F('s5.stats', 'textarea', { show: 'quant' }) + F('s5.answer', 'textarea') +
        cmpBox(T.weak, T.better) + '<div class="diag" id="diag-4"></div>' + OUT(4);
      case 5: return F('s6.contribution', 'textarea', { req: 1, min: 6 }) + G2(F('s6.theory', 'textarea'), F('s6.method', 'textarea')) + G2(F('s6.context', 'textarea'), F('s6.practical', 'textarea')) + F('s6.limits', 'textarea') +
        '<div class="table-wrap"><table class="data"><thead><tr>' + UI.fiCols.map((c) => '<th scope="col">' + esc(c) + '</th>').join('') + '</tr></thead><tbody>' + RC.fiRows.map((r) => '<tr>' + r.map((c) => '<td>' + esc(c) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>' +
        '<div class="diag" id="diag-5"></div>' + OUT(5);
      case 6: return PICK('s1.format', RC.formats, { sfx: 'c' }) +
        '<div class="grid g-2"><div class="field" data-fmt="structured"><label for="f-s7-headings">' + esc(meta('s7.headings').label) + '</label><select id="f-s7-headings" class="inp" data-bind="s7.headings">' + Object.keys(RC.headingNames).map((k) => '<option value="' + k + '">' + esc(RC.headingNames[k]) + '</option>').join('') + '</select><span class="hint">' + esc(meta('s7.headings').hint) + '</span></div>' +
        '<div class="field" data-fmt="unstructured"><label for="f-s7-paras">' + esc(meta('s7.paras').label) + '</label><select id="f-s7-paras" class="inp" data-bind="s7.paras"><option value="one">' + esc(UI.paraOne) + '</option><option value="two">' + esc(UI.paraTwo) + '</option></select><span class="hint">' + esc(meta('s7.paras').hint) + '</span></div></div>' +
        '<p class="hint">' + esc(UI.composerHint) + '</p><div class="composer" id="composer"></div>' +
        '<div class="draft-wrap"><div class="report-tools"><h4 class="h4">' + esc(UI.draftTitle) + '</h4><span class="spacer"></span><button type="button" class="btn btn-ghost btn-sm" id="btn-rebuild">' + esc(UI.rebuild) + '</button><button type="button" class="btn btn-ghost btn-sm" data-copy-bind="s7.draft">' + esc(UI.copy) + '</button></div>' +
        '<div class="field"><label for="draft-7" class="sr-only">' + esc(UI.draftTitle) + '</label><textarea id="draft-7" class="inp abstract-ta" data-bind="s7.draft" data-draft="1" rows="12" spellcheck="true"></textarea><span class="hint" data-draft-note></span></div><div class="wc-inline small muted" data-wc-inline></div></div><p class="err" id="err-draft" aria-live="polite"></p>';
      case 7: return '<div class="field"><label for="draft-8">' + esc(UI.draftTitle) + '</label><textarea id="draft-8" class="inp abstract-ta" data-bind="s7.draft" data-draft="1" rows="12" spellcheck="true"></textarea><span class="hint" data-draft-note></span></div><div class="wc-inline small muted" data-wc-inline></div>' +
        '<div class="refine-box"><h4 class="h4">' + esc(UI.langCheckTitle) + '</h4><div class="diag" id="refine-list"></div></div>' +
        '<div class="refine-box"><h4 class="h4">' + esc(UI.movesTitle) + '</h4><div class="radio-row" id="move-list"></div><p class="hint">' + esc(UI.movesHint) + '</p></div>' +
        '<h4 class="h4">' + esc(UI.rewriteTitle) + '</h4><div class="grid g-280" id="rewrite-step"></div>' +
        '<h4 class="h4">' + esc(UI.checklistTitle) + '</h4><div class="checklist checklist-tool" data-checklist="step"></div>';
      case 8: return G2(SEL('s1.limit', limitOptions(), { sfx: 'w' }), F('s1.customLimit', 'text', { inputmode: 'numeric', show: 'custom', sfx: 'w' })) +
        '<div class="wc-meter" id="meter-9"></div><div id="section-wc"></div>' +
        G2(F('s9.kwMin', 'text', { inputmode: 'numeric' }), F('s9.kwMax', 'text', { inputmode: 'numeric' })) +
        '<fieldset><legend>' + esc(UI.rulesTitle) + '</legend><p class="hint">' + esc(UI.rulesHint) + '</p><div class="stack" id="rules"></div><div class="btn-row"><button type="button" class="btn btn-ghost btn-sm" id="btn-add-rule">' + esc(UI.addRule) + '</button></div></fieldset>' +
        '<div class="checker-head"><h4 class="h4">' + esc(UI.complianceTitle) + '</h4></div><div class="diag" id="compliance"></div>';
      case 9: return '<p class="hint">' + esc(UI.kwIntro) + '</p><div class="kw-list" id="kw-list"></div><div class="btn-row"><button type="button" class="btn btn-ghost btn-sm" id="btn-add-kw">' + esc(UI.addKw) + '</button></div><p class="err" id="err-kw" aria-live="polite"></p>' +
        '<div class="refine-box"><h4 class="h4">' + esc(UI.kwCandTitle) + '</h4><p class="hint">' + esc(UI.kwCandHint) + '</p><div class="stems" id="kw-cands"></div></div>' +
        '<div class="diag" id="kw-checks"></div>' + OUT(9);
      case 10: return '<div class="checker-head"><h4 class="h4">' + esc(UI.checksTitle) + '</h4><span class="checker-summary" id="checker-summary"></span></div><div class="diag" id="checker"></div>' +
        '<div class="eval-layout"><div><div class="rubric" id="rubric"></div><div class="btn-row"><button type="button" class="btn btn-ghost btn-sm" id="btn-apply-scores">' + esc(UI.applyScores) + '</button></div></div><div class="result-panel" id="rubric-result" aria-live="polite"></div></div>' +
        F('s11.self', 'textarea') + '<p class="disclaimer">' + esc(UI.evalDisclaimer) + '</p>';
      case 11: return '<div class="final-box">' + F('s12.final', 'textarea') + '<div class="btn-row"><button type="button" class="btn btn-ghost btn-sm" id="btn-final-from-draft">' + esc(UI.finalFromDraft) + '</button><button type="button" class="btn btn-ghost btn-sm" data-copy-bind="s12.final">' + esc(UI.copyFinal) + '</button></div><div class="wc-inline small muted" id="final-wc"></div></div>' +
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
    $('#rewrite-step').innerHTML = rewriteCards();
  }
  function rewriteCards() {
    return RC.rewrite.map((r) => '<article class="card"><h3>' + esc(r.t) + '</h3><ul class="list">' + r.tpl.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul><p class="small"><strong>' + esc(UI.tip) + '</strong> ' + esc(r.tip) + '</p></article>').join('');
  }
  function renderChecklists() {
    $$('[data-checklist]').forEach((box) => {
      box.innerHTML = RC.checklist.map((c, i) => { const id = 'cl-' + box.dataset.checklist + '-' + c.id; return '<label class="chk" for="' + id + '"><input type="checkbox" id="' + id + '" data-multi="s8.checks" value="' + c.id + '"><span class="txt"><strong>' + RC.numerals[Math.min(i, 11)] + '. ' + esc(c.t) + '</strong><span>' + esc(c.d) + '</span></span></label>'; }).join('');
    });
  }

  /* ---------------- Binding ---------------- */
  function syncBound(path, src) {
    $$('[data-bind="' + path + '"]').forEach((n) => { if (n !== src && n.value !== getPath(state, path)) n.value = getPath(state, path) || ''; });
  }
  function bind() {
    document.addEventListener('input', (e) => {
      const t = e.target;
      if (t.matches('[data-bind]')) {
        setPath(state, t.dataset.bind, t.value); syncBound(t.dataset.bind, t);
        if (t.dataset.draft) state.s7.draftEdited = true;
        if (t.getAttribute('aria-invalid') === 'true' && filled(t.value)) clearErr(t);
        onChange();
      }
      else if (t.matches('[data-sec]')) { const id = t.dataset.sec; state.s7.text[id] = t.value; state.s7.edited[id] = true; afterSections(); }
      else if (t.matches('[data-label]')) { state.s7.labels[t.dataset.label] = t.value; afterSections(); }
      else if (t.matches('[data-kw]')) { const [id, k] = t.dataset.kw.split(':'); const kw = state.s10.keywords.find((x) => x.id === id); if (kw) { kw[k] = t.value; onChange(); } }
      else if (t.matches('[data-rule]')) { const r = state.s9.rules.find((x) => x.id === t.dataset.rule); if (r) { r.t = t.value; onChange(); } }
      else if (t.matches('#wc-text, #wc-custom')) renderWordCounter();
      else if (t.matches('#lc-text')) renderLangTool();
      else if (t.matches('#gloss-search')) filterGlossary();
    });
    document.addEventListener('change', (e) => {
      const t = e.target;
      if (t.matches('select[data-bind]')) {
        setPath(state, t.dataset.bind, t.value); syncBound(t.dataset.bind, t); clearErr(t);
        if (t.dataset.bind === 's1.design') applyKind();
        onChange();
      }
      else if (t.matches('input[data-multi]')) { const arr = getPath(state, t.dataset.multi), i = arr.indexOf(t.value); if (t.checked && i === -1) arr.push(t.value); else if (!t.checked && i !== -1) arr.splice(i, 1); $$('input[data-multi="' + t.dataset.multi + '"][value="' + t.value + '"]').forEach((x) => { x.checked = t.checked; }); onChange(); }
      else if (t.matches('input[data-bool]')) { setPath(state, t.dataset.bool, t.checked); onChange(); }
      else if (t.matches('input[data-rub]')) { state.s11.scores[t.dataset.rub] = Number(t.value); onChange(); }
      else if (t.matches('input[data-on]')) { state.s7.on[t.dataset.on] = t.checked; afterSections(); renderComposer(); }
      else if (t.matches('select[data-kwcat]')) { const kw = state.s10.keywords.find((x) => x.id === t.dataset.kwcat); if (kw) { kw.cat = t.value; onChange(); } }
      else if (t.matches('input[data-rule-done]')) { const r = state.s9.rules.find((x) => x.id === t.dataset.ruleDone); if (r) { r.done = t.checked; onChange(); } }
      else if (t.matches('#wc-limit')) renderWordCounter();
      else if (t.matches('input[data-sel]')) { state.ui.sel[t.dataset.sel] = t.value; renderSelector(); save(); }
    });
    document.addEventListener('click', (e) => {
      const t = e.target.closest('button, a'); if (!t) return;
      if (t.dataset.pick) {
        setPath(state, t.dataset.pick, t.dataset.id); clearErr(t);
        if (t.dataset.pick === 's1.approach') { const d = RC.designs.find((x) => x.id === state.s1.design); if (d && d.a !== state.s1.approach) state.s1.design = ''; renderDesignSelects(); applyKind(); }
        onChange();
      }
      else if (t.dataset.copyBind) { const v = getPath(state, t.dataset.copyBind); copyText(String(v || '')).then(() => toast(UI.copied), () => toast(UI.copyFail)); }
      else if (t.dataset.move) { moveSection(t.dataset.move, Number(t.dataset.dir)); }
      else if (t.dataset.resetSec) { const id = t.dataset.resetSec; state.s7.edited[id] = false; state.s7.text[id] = ''; renderComposer(); afterSections(); toast(UI.sectionReset); }
      else if (t.dataset.kwAdd != null && t.dataset.kwAdd !== undefined && t.hasAttribute('data-kw-add')) addKeyword(t.dataset.kwAdd);
      else if (t.dataset.kwDel) { state.s10.keywords = state.s10.keywords.filter((x) => x.id !== t.dataset.kwDel); renderKeywords(); onChange(); }
      else if (t.dataset.kwUp) { moveKw(t.dataset.kwUp); }
      else if (t.dataset.ruleDel) { state.s9.rules = state.s9.rules.filter((x) => x.id !== t.dataset.ruleDel); renderRules(); onChange(); }
      else if (t.dataset.gotoStep) { e.preventDefault(); goTo(Math.min(Number(t.dataset.gotoStep), state.maxStep + 1), true); }
      else if (t.dataset.useTool) { const src = $('#' + t.dataset.useTool); if (src) { src.value = state.s7.draft || ''; src.dispatchEvent(new Event('input', { bubbles: true })); } }
    });
  }
  function fillInputs() {
    renderDesignSelects();
    $$('[data-bind]').forEach((inp) => { const v = getPath(state, inp.dataset.bind); inp.value = v == null ? '' : v; });
    $$('input[data-multi]').forEach((i) => { i.checked = getPath(state, i.dataset.multi).indexOf(i.value) !== -1; });
    $$('input[data-bool]').forEach((i) => { i.checked = !!getPath(state, i.dataset.bool); });
    $$('input[data-rub]').forEach((i) => { i.checked = state.s11.scores[i.dataset.rub] === Number(i.value); });
    $$('input[data-sel]').forEach((i) => { i.checked = state.ui.sel[i.dataset.sel] === i.value; });
    applyKind(); renderComposer(); renderKeywords(); renderRules();
  }
  function renderDesignSelects() {
    $$('select[data-design]').forEach((s) => { s.innerHTML = designOptions(); s.value = state.s1.design || ''; });
  }

  /* ---------------- Method fields follow the selected design ---------------- */
  function applyKind() {
    const k = kind(), show = KIND_FIELDS[k] || [];
    const box = $('#mfields'); if (!box) return;
    box.hidden = !k;
    const head = $('#mfields-head'); if (head) head.textContent = k ? UI.kindHead(label(RC.designs, state.s1.design), RC.kindNames[k]) : '';
    const tip = $('#kind-tip'); if (tip) { tip.hidden = !k; tip.innerHTML = k ? '<strong>' + esc(RC.kindTips[k].t) + '</strong><span>' + esc(RC.kindTips[k].d) + '</span>' : ''; }
    $$('[data-mkey]', box).forEach((f) => {
      const key = f.dataset.mkey, on = show.indexOf(key) !== -1, m = (RC.mf[k] || {})[key] || meta('s4.' + key);
      f.hidden = !on;
      const inp = $('.inp', f); const req = on && (KIND_REQ[k] || []).indexOf(key) !== -1;
      if (req) { inp.setAttribute('data-required', '1'); inp.setAttribute('data-minwords', '2'); } else { inp.removeAttribute('data-required'); inp.removeAttribute('data-minwords'); clearErr(inp); }
      $('label', f).innerHTML = esc(m.label || '') + (req ? '<span class="req" aria-hidden="true">*</span>' : '');
      $('.hint', f).textContent = m.hint || '';
      inp.placeholder = m.ph || '';
    });
    const ap = state.s1.approach;
    $$('[data-show="qual"]').forEach((f) => { f.hidden = ap === 'quant'; });
    $$('[data-show="quant"]').forEach((f) => { f.hidden = ap === 'qual'; });
  }

  /* ---------------- Validation ---------------- */
  const fieldOf = (n) => n.closest('.field, fieldset, .choice-group') || n.parentElement;
  function setErr(n, msg) { const f = fieldOf(n), i = f.querySelector('.inp'); if (i) i.setAttribute('aria-invalid', 'true'); const e = f.querySelector('.err'); if (e) e.textContent = msg; }
  function clearErr(n) { const f = fieldOf(n); if (!f) return; const i = f.querySelector('.inp'); if (i) i.removeAttribute('aria-invalid'); const e = f.querySelector('.err'); if (e) e.textContent = ''; }
  function validateStep(i, show) {
    const el = $('.step[data-step="' + i + '"]'); if (!el) return true;
    let ok = true, first = null;
    const fail = (n, msg) => { ok = false; if (show) { if (n.classList.contains('err')) n.textContent = msg; else setErr(n, msg); if (!first) first = n; } };
    $$('[data-required]', el).forEach((inp) => {
      if (inp.closest('[hidden]')) return;
      const v = getPath(state, inp.dataset.bind), min = Number(inp.dataset.minwords || 0);
      if (!filled(v)) fail(inp, UI.required); else if (min && E.wc(v) < min) fail(inp, UI.tooShort(num(min))); else if (show) clearErr(inp);
    });
    $$('[data-required-pick]', el).forEach((g) => { if (!getPath(state, g.dataset.requiredPick)) fail(g, UI.chooseOne); });
    if (i === 0 && state.s1.limit === 'custom' && !(parseInt(state.s1.customLimit, 10) > 0)) { const n = $('#' + idOf('s1.customLimit')); if (n) fail(n, UI.needNumber); }
    if (i === 6 && !filled(state.s7.draft)) fail($('#err-draft'), UI.needDraft);
    if (i === 9 && !state.s10.keywords.some((k) => filled(k.en) || filled(k.ar))) fail($('#err-kw'), UI.needKw);
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
    if (i === 6) { renderComposer(); if (!state.s7.draftEdited || !filled(state.s7.draft)) rebuildDraft(); }
    if (i === 11) { if (!filled(state.s12.final)) { state.s12.final = state.s7.draft; syncBound('s12.final'); } renderReport(false); }
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

  /* ---------------- Step 7: composer ---------------- */
  function renderComposer() {
    const box = $('#composer'); if (!box) return;
    const lab = E.labelsFor(state, RC), structured = state.s1.format === 'structured';
    box.innerHTML = state.s7.order.map((id, i) => {
      const on = state.s7.on[id], txt = E.sectionText(id, state, RC), n = E.wc(txt);
      return '<div class="comp-row' + (on ? '' : ' off') + '" data-row="' + id + '"><div class="comp-head"><label class="radio-pill"><input type="checkbox" data-on="' + id + '"' + (on ? ' checked' : '') + '><span>' + esc(RC.sectionNames[id]) + '</span></label>' +
        (structured ? '<input class="inp" style="max-width:220px;min-height:34px;padding:4px 10px" data-label="' + id + '" value="' + attr(state.s7.labels[id]) + '" placeholder="' + attr(lab[id] || UI.merged) + '" aria-label="' + attr(UI.headingFor(RC.sectionNames[id])) + '">' : '') +
        '<span class="spacer"></span><span class="wc" data-sec-wc="' + id + '">' + esc(UI.words(num(n))) + '</span>' +
        '<button type="button" class="btn btn-ghost btn-sm" data-move="' + id + '" data-dir="-1"' + (i === 0 ? ' disabled' : '') + ' aria-label="' + attr(UI.moveUp + ': ' + RC.sectionNames[id]) + '">↑</button>' +
        '<button type="button" class="btn btn-ghost btn-sm" data-move="' + id + '" data-dir="1"' + (i === state.s7.order.length - 1 ? ' disabled' : '') + ' aria-label="' + attr(UI.moveDown + ': ' + RC.sectionNames[id]) + '">↓</button>' +
        (state.s7.edited[id] ? '<button type="button" class="btn btn-ghost btn-sm" data-reset-sec="' + id + '">' + esc(UI.resetSection) + '</button>' : '') + '</div>' +
        '<label class="sr-only" for="sec-' + id + '">' + esc(RC.sectionNames[id]) + '</label><textarea id="sec-' + id + '" class="inp" data-sec="' + id + '" placeholder="' + attr(UI.sectionEmpty) + '"></textarea>' +
        '<span class="hint">' + esc(RC.sectionHints[id]) + '</span></div>';
    }).join('');
    state.s7.order.forEach((id) => { const n = $('#sec-' + id); if (n) n.value = E.sectionText(id, state, RC); });
    $$('[data-fmt]').forEach((f) => { f.hidden = f.dataset.fmt !== (state.s1.format || 'unstructured'); });
  }
  function moveSection(id, dir) {
    const o = state.s7.order, i = o.indexOf(id), j = i + dir; if (j < 0 || j >= o.length) return;
    o[i] = o[j]; o[j] = id; renderComposer(); afterSections();
    const b = $('[data-move="' + id + '"][data-dir="' + dir + '"]'); if (b && !b.disabled) b.focus();
  }
  function afterSections() {
    state.s7.order.forEach((id) => { const n = $('[data-sec-wc="' + id + '"]'); if (n) n.textContent = UI.words(num(E.wc(E.sectionText(id, state, RC)))); });
    if (!state.s7.draftEdited) rebuildDraft(); else noteDraft();
    onChange();
  }
  function rebuildDraft() { state.s7.draft = E.assemble(state, RC); state.s7.draftEdited = false; syncBound('s7.draft'); noteDraft(); }
  function noteDraft() { $$('[data-draft-note]').forEach((n) => { n.textContent = state.s7.draftEdited ? UI.draftEditedNote : UI.draftAutoNote; }); }

  /* ---------------- Step 10: keywords ---------------- */
  function addKeyword(v) {
    if (state.s10.keywords.length >= 20) return;
    const k = { id: uid(), en: '', ar: '', cat: 'topic' };
    if (v) k[RC.lang] = v;
    state.s10.keywords.push(k); renderKeywords(); onChange();
    if (!v) { const n = $('[data-kw="' + k.id + ':' + RC.lang + '"]'); if (n) n.focus(); } else toast(UI.kwAdded(v));
  }
  function moveKw(id) { const a = state.s10.keywords, i = a.findIndex((x) => x.id === id); if (i > 0) { const t = a[i - 1]; a[i - 1] = a[i]; a[i] = t; renderKeywords(); onChange(); } }
  function renderKeywords() {
    const box = $('#kw-list'); if (!box) return;
    const first = AR ? ['ar', 'en'] : ['en', 'ar'];
    box.innerHTML = state.s10.keywords.length ? state.s10.keywords.map((k, i) => '<div class="kw-row">' +
      first.map((l) => '<div class="field"><label for="kw-' + l + '-' + k.id + '">' + esc(UI.kwLang[l]) + '</label><input id="kw-' + l + '-' + k.id + '" class="inp" dir="' + (l === 'ar' ? 'rtl' : 'ltr') + '" lang="' + l + '" data-kw="' + k.id + ':' + l + '"></div>').join('') +
      '<div class="field"><label for="kw-c-' + k.id + '">' + esc(UI.kwCat) + '</label><select id="kw-c-' + k.id + '" class="inp" data-kwcat="' + k.id + '">' + RC.kwCats.map((c) => '<option value="' + c.id + '"' + (c.id === k.cat ? ' selected' : '') + '>' + esc(c.t) + '</option>').join('') + '</select></div>' +
      '<div class="kw-actions"><button type="button" class="btn btn-ghost btn-sm" data-kw-up="' + k.id + '"' + (i === 0 ? ' disabled' : '') + ' aria-label="' + attr(UI.moveUp) + '">↑</button><button type="button" class="btn btn-danger btn-sm" data-kw-del="' + k.id + '" aria-label="' + attr(UI.removeKw) + '">×</button></div></div>').join('') : '<p class="hint">' + esc(UI.noKw) + '</p>';
    state.s10.keywords.forEach((k) => { ['en', 'ar'].forEach((l) => { const n = $('[data-kw="' + k.id + ':' + l + '"]'); if (n) n.value = k[l]; }); });
  }
  function renderKwSide() {
    const c = $('#kw-cands');
    if (c) { const cands = E.keywordCandidates(state, RC); c.innerHTML = cands.length ? cands.map((p) => '<button type="button" class="chip-btn" data-kw-add="' + attr(p) + '">+ ' + esc(p) + '</button>').join('') : '<span class="hint">' + esc(UI.noCands) + '</span>'; }
    const k = $('#kw-checks');
    if (k) k.innerHTML = E.keywordChecks(state, RC).map((x) => { const m = RC.kwMsg[x.k]; return diagItem(m.t, x.s, m[x.s] ? m[x.s](x) : (m.msg ? m.msg(x) : '')); }).join('');
  }
  const kwLine = () => { const ks = state.s10.keywords.filter((k) => filled(k.en) || filled(k.ar)); if (!ks.length) return ''; const pick = (k, l) => filled(k[l]) ? k[l].trim() : ''; return state.s1.lang === 'both' ? UI.kwLineBoth(ks.map((k) => pick(k, 'ar')).filter(Boolean).join('؛ '), ks.map((k) => pick(k, 'en')).filter(Boolean).join('; ')) : UI.kwLine(ks.map((k) => pick(k, RC.lang) || pick(k, AR ? 'en' : 'ar')).join(AR ? '؛ ' : '; ')); };

  /* ---------------- Step 9: rules and compliance ---------------- */
  function renderRules() {
    const box = $('#rules'); if (!box) return;
    box.innerHTML = state.s9.rules.length ? state.s9.rules.map((r) => '<div class="kw-row" style="grid-template-columns:auto minmax(0,1fr) auto;align-items:center"><label class="radio-pill"><input type="checkbox" data-rule-done="' + r.id + '"' + (r.done ? ' checked' : '') + '><span>' + esc(UI.ruleDone) + '</span></label><input class="inp" data-rule="' + r.id + '" aria-label="' + attr(UI.ruleLabel) + '" placeholder="' + attr(UI.rulePh) + '"><button type="button" class="btn btn-danger btn-sm" data-rule-del="' + r.id + '" aria-label="' + attr(UI.removeRule) + '">×</button></div>').join('') : '<p class="hint">' + esc(UI.noRules) + '</p>';
    state.s9.rules.forEach((r) => { const n = $('[data-rule="' + r.id + '"]'); if (n) n.value = r.t; });
  }
  function meterHTML(text, lim) {
    const w = E.wc(text), pct = lim ? Math.min(100, w / lim * 100) : 0, cls = lim && w > lim ? ' over' : lim && w > lim * 0.9 ? ' near' : '';
    const msg = !lim ? UI.noLimit : w > lim ? UI.overBy(num(w - lim)) : UI.remaining(num(lim - w));
    return { cls, html: '<div class="wc-nums"><span><span class="big">' + num(w) + '</span> <span class="lbl">' + esc(UI.wordsLbl) + (lim ? ' / ' + num(lim) : '') + '</span></span><span><span class="lbl">' + esc(UI.charsLbl) + '</span> ' + num(E.chars(text)) + '</span><span><span class="lbl">' + esc(UI.charsNsLbl) + '</span> ' + num(E.charsNoSpace(text)) + '</span><span><span class="lbl">' + esc(UI.sentLbl) + '</span> ' + num(E.sentences(text).length) + '</span></div>' +
      '<div class="wc-bar" role="progressbar" aria-valuemin="0" aria-valuemax="' + (lim || 0) + '" aria-valuenow="' + w + '" aria-label="' + attr(UI.wordsLbl) + '"><span style="width:' + pct + '%"></span></div><span class="wc-msg">' + esc(msg) + '</span>' };
  }
  function renderCompliance() {
    const m = $('#meter-9'); if (m) { const r = meterHTML(state.s7.draft, E.limitOf(state)); m.className = 'wc-meter' + r.cls; m.innerHTML = r.html; }
    const sw = $('#section-wc'); if (sw) { const S = E.sectionWords(state, RC); sw.innerHTML = S.total ? '<div class="table-wrap"><table class="data"><thead><tr><th scope="col">' + esc(UI.section) + '</th><th scope="col">' + esc(UI.wordsLbl) + '</th><th scope="col">%</th></tr></thead><tbody>' + state.s7.order.filter((id) => state.s7.on[id]).map((id) => '<tr><td>' + esc(RC.sectionNames[id]) + '</td><td>' + num(S[id]) + '</td><td>' + num(Math.round(S[id] / S.total * 100)) + '</td></tr>').join('') + '</tbody></table></div><p class="hint">' + esc(UI.sectionWcNote) + '</p>' : ''; }
    const c = $('#compliance'); if (c) { const keep = ['draft', 'limit', 'format', 'cite', 'placeholder', 'language', 'abbr', 'keywords', 'rules']; c.innerHTML = E.checks(state, RC).filter((x) => keep.indexOf(x.id) !== -1).map((x) => diagItem(x.t, x.status, x.msg)).join(''); }
    $$('[data-wc-inline]').forEach((n) => { const w = E.wc(state.s7.draft), lim = E.limitOf(state); n.textContent = UI.words(num(w)) + (lim ? ' / ' + num(lim) : ''); });
    const fw = $('#final-wc'); if (fw) fw.textContent = UI.words(num(E.wc(state.s12.final)));
  }

  /* ---------------- Language and move checks ---------------- */
  function langHTML(text) {
    const r = E.languageCheck(text, RC.lex, RC.lang);
    if (!r.items.length) return '';
    return r.items.map((x) => { const m = RC.langMsg[x.k]; return diagItem(m.t, x.s, m[x.s] ? m[x.s](x) : m.msg(x)); }).join('');
  }
  function movesHTML(text) {
    const mv = E.moves(text, RC.lex.moveCues, RC.lang);
    return Object.keys(RC.moveNames).map((k) => '<span class="tag ' + (mv[k] ? 'tag-evidence' : 'tag-gold') + '">' + (mv[k] ? '✓ ' : '? ') + esc(RC.moveNames[k]) + '</span>').join('');
  }

  /* ---------------- Step outputs and diagnostics ---------------- */
  function stepDiag() {
    const k = kind(), d = (sel, items) => { const n = $(sel); if (n) n.innerHTML = items.map((x) => diagItem('', x[0], x[1])).join(''); };
    const bg = RC.tpl.background(state), bgw = E.wc(bg), lim = E.limitOf(state);
    const w1 = $('#out-1-wc'); if (w1) w1.textContent = bgw ? UI.bgWords(num(bgw), lim ? num(Math.round(lim * 0.25)) : '') : '';
    d('#diag-1', filled(bg) ? [lim && bgw > lim * 0.3 ? ['warn', UI.bgLong] : ['ok', UI.bgOk]].concat(E.hits(bg, RC.lex.litReview, RC.lang).length || /\(\D{0,40}\d{4}\)/.test(bg) ? [['warn', UI.bgCites]] : []) : []);
    const aimHit = E.hits(state.s3.aim, RC.lex.purposeVerbs, RC.lang).length, topicOnly = E.hits(state.s3.aim, RC.lex.topicOnly, RC.lang).length;
    d('#diag-2', filled(state.s3.aim) ? [aimHit && !topicOnly ? ['ok', UI.aimOk] : ['warn', UI.aimTopic]].concat(E.wc(state.s3.aim) > 45 ? [['warn', UI.aimLong]] : []) : []);
    const mt = RC.tpl.methods(state, k), qc = E.hits(mt, RC.lex.quantCues, RC.lang);
    d('#diag-3', !k ? [] : [state.s1.approach === 'qual' && qc.length ? ['warn', UI.qualQuant(qc.join(RC.sep))] : ['ok', UI.methodOk]].concat((KIND_REQ[k] || []).filter((key) => !filled(state.s4[key])).length ? [['info', UI.methodMissing]] : []).concat(E.wc(mt) > 90 ? [['warn', UI.methodLong]] : []));
    const res = [state.s5.main, state.s5.support, state.s5.themes, state.s5.stats].join(' ');
    d('#diag-4', filled(state.s5.main) ? [(state.s1.approach !== 'qual' && !/[\d٠-٩]/.test(res)) ? ['warn', UI.resNumbers] : E.codeList(res) ? ['warn', UI.resCodes] : ['ok', UI.resOk]].concat(E.hits(res, RC.lex.vagueFindings, RC.lang).length ? [['warn', UI.resVague(E.hits(res, RC.lex.vagueFindings, RC.lang).join(RC.sep))]] : []).concat(E.hits(res, RC.lex.overclaim, RC.lang).length ? [['warn', UI.overclaim(E.hits(res, RC.lex.overclaim, RC.lang).join(RC.sep))]] : []) : []);
    const con = RC.tpl.conclusion(state), oc = E.hits(con, RC.lex.overclaim, RC.lang);
    d('#diag-5', filled(state.s6.contribution) ? [oc.length ? ['warn', UI.overclaim(oc.join(RC.sep))] : ['ok', UI.conOk]].concat(E.hits(con, RC.lex.generalise, RC.lang).length ? [['warn', UI.generalise]] : []) : []);
  }
  function refreshOutputs() {
    const k = kind(), set = (id, txt) => { const n = $('#' + id); if (n) n.textContent = txt; };
    set('out-0', RC.tpl.profile(state));
    set('out-1', RC.tpl.background(state));
    set('out-2', RC.tpl.aim(state));
    set('out-3', RC.tpl.methods(state, k));
    set('out-4', RC.tpl.results(state));
    set('out-5', RC.tpl.conclusion(state));
    set('out-9', kwLine());
    $$('[data-show="custom"]').forEach((f) => { f.hidden = state.s1.limit !== 'custom'; });
  }

  /* ---------------- Step 11: checks, rubric, result ---------------- */
  function renderChecker() {
    const box = $('#checker'); if (!box) return;
    const list = E.checks(state, RC), order = { bad: 0, warn: 1, info: 2, ok: 3 };
    list.sort((a, b) => order[a.status] - order[b.status]);
    box.innerHTML = list.map((c) => diagItem(c.t, c.status, c.msg)).join('');
    const cnt = (k) => list.filter((c) => c.status === k).length;
    $('#checker-summary').textContent = ['bad', 'warn', 'ok'].map((k) => RC.statusLabel[k] + ': ' + num(cnt(k))).join(' · ');
  }
  function scoreSummary() {
    const sc = state.s11.scores, rated = RC.rubric.filter((c) => sc[c.id]);
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

  /* ---------------- Step 12: report ---------------- */
  function buildReportHTML() {
    const R = UI.report, s1 = state.s1, T = RC.tpl;
    const p = (x) => '<p>' + esc(filled(x) ? x : UI.empty) + '</p>';
    const pre = (x) => '<p style="white-space:pre-line">' + esc(filled(x) ? x : UI.empty) + '</p>';
    const { sc, rated, mean, lvl } = scoreSummary();
    const date = new Date().toLocaleDateString(AR ? 'ar-SA' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
    const lim = E.limitOf(state);
    let h = '<h2>' + esc(R.title) + '</h2><p class="meta">' + esc(R.generated(date)) + '</p>';
    h += '<h3>' + esc(R.researchTitle) + '</h3><p><strong>' + esc(s1.title || UI.empty) + '</strong></p>';
    h += '<h3>' + esc(R.profile) + '</h3>' + pre(T.profile(state));
    h += '<h3>' + esc(R.method) + '</h3><p>' + esc([label(RC.approaches, s1.approach), label(RC.designs, s1.design)].filter(Boolean).join(' — ') || UI.empty) + '</p>';
    h += '<h3>' + esc(R.format) + '</h3><p>' + esc(label(RC.formats, s1.format) || UI.empty) + (s1.format === 'structured' ? ' — ' + esc(RC.headingNames[state.s7.headings]) : '') + '</p>';
    h += '<h3>' + esc(R.draft) + '</h3>' + pre(state.s7.draft);
    h += '<h3>' + esc(R.wordCount) + '</h3><p>' + esc(UI.words(num(E.wc(state.s7.draft)))) + (lim ? ' / ' + esc(num(lim)) : '') + ' · ' + esc(UI.charsLbl) + ' ' + esc(num(E.chars(state.s7.draft))) + '</p>';
    h += '<h3>' + esc(R.keywords) + '</h3>' + pre(kwLine());
    h += '<h3>' + esc(R.evaluation) + '</h3>' + (rated.length ? '<ul>' + RC.rubric.map((cr) => '<li>' + esc(cr.t) + ': ' + (sc[cr.id] ? RC.numerals[sc[cr.id] - 1] + ' ' + esc(UI.outOf5) : esc(UI.notRated)) + '</li>').join('') + '</ul><p><strong>' + esc(UI.overall) + ':</strong> ' + esc(fmt1(mean)) + ' ' + esc(UI.outOf5) + ' — ' + esc(lvl.t) + '</p>' : p(UI.notRated)) +
      (filled(state.s11.self) ? '<p><strong>' + esc(R.self) + ':</strong> ' + esc(state.s11.self) + '</p>' : '') + '<p><em>' + esc(UI.evalDisclaimer) + '</em></p>';
    const recs = []; RC.rubric.forEach((cr) => { if (sc[cr.id] && sc[cr.id] <= 3) recs.push(cr.t + ': ' + RC.rubricRec[cr.id]); });
    E.checks(state, RC).forEach((x) => { if (x.status === 'bad' || x.status === 'warn') recs.push(x.t + ': ' + x.msg); });
    h += '<h3>' + esc(R.recs) + '</h3>' + (recs.length ? '<ul>' + [...new Set(recs)].map((r) => '<li>' + esc(r) + '</li>').join('') + '</ul>' : p(R.noRecs));
    h += '<h3>' + esc(R.final) + '</h3>' + pre(state.s12.final) + (kwLine() ? pre(kwLine()) : '');
    h += '<p class="meta">' + esc(R.footer) + '</p>';
    return h;
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
    const r = RC.selector.result(state.ui.sel);
    out.innerHTML = r ? '<span class="k">' + esc(UI.selResult) + '</span><strong>' + esc(r.t) + '</strong><ul class="list">' + r.why.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '<span class="hint">' + esc(UI.selEmpty) + '</span>';
  }
  function renderWordCounter() {
    const ta = $('#wc-text'), sel = $('#wc-limit'), box = $('#wc-tool'); if (!ta || !box) return;
    const cust = $('#wc-custom'); if (cust) cust.closest('.field').hidden = sel.value !== 'custom';
    const lim = parseInt(sel.value === 'custom' ? (cust ? cust.value : '') : sel.value, 10) || 0;
    const r = meterHTML(ta.value, lim); box.className = 'wc-meter' + r.cls; box.innerHTML = r.html;
    const paras = String(ta.value).split(/\n\s*\n/).filter((x) => filled(x));
    const pw = $('#wc-paras'); if (pw) pw.innerHTML = paras.length > 1 ? '<ul class="list small">' + paras.map((p, i) => '<li>' + esc(UI.paraN(num(i + 1))) + ': ' + esc(UI.words(num(E.wc(p))))+ '</li>').join('') + '</ul>' : '';
  }
  function renderLangTool() {
    const ta = $('#lc-text'), out = $('#lc-out'), mv = $('#lc-moves'); if (!ta || !out) return;
    out.innerHTML = filled(ta.value) ? langHTML(ta.value) : '';
    if (mv) mv.innerHTML = filled(ta.value) ? movesHTML(ta.value) : '';
  }
  function renderGuides() {
    const set = (sel, html) => { const n = $(sel); if (n) n.innerHTML = html; };
    set('#struct-types', RC.structTypes.map((s) => '<article class="card"><h3>' + esc(s.t) + '</h3><p>' + esc(s.d) + '</p><p class="small"><strong>' + esc(UI.whenToUse) + '</strong> ' + esc(s.when) + '</p><ol class="list small">' + s.parts.map((p) => '<li>' + esc(p) + '</li>').join('') + '</ol></article>').join(''));
    set('#method-cards', Object.keys(RC.kindTips).map((k) => { const g = RC.methodGuide[k]; return '<article class="card"><h3>' + esc(RC.kindNames[k]) + '</h3><p>' + esc(RC.kindTips[k].d) + '</p><p class="small"><strong>' + esc(UI.report_) + '</strong></p><ul class="list small">' + g.report.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul>' + cmpBox(g.weak, g.better) + '</article>'; }).join(''));
    set('#fi-table', '<thead><tr>' + UI.fiCols.map((c) => '<th scope="col">' + esc(c) + '</th>').join('') + '</tr></thead><tbody>' + RC.fiRows.map((r) => '<tr>' + r.map((c) => '<td>' + esc(c) + '</td>').join('') + '</tr>').join('') + '</tbody>');
    set('#findings-cards', RC.findingsGuide.map((g) => '<article class="card"><h3>' + esc(g.t) + '</h3><ul class="list small">' + g.items.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul>' + (g.weak ? cmpBox(g.weak, g.better) : '') + '</article>').join(''));
    set('#hedges', RC.hedging.map((h) => '<article class="card"><h3>' + esc(h.t) + '</h3><ul class="list small">' + h.items.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul></article>').join(''));
    set('#rewrite-tool', rewriteCards());
    set('#tense-table', '<thead><tr>' + UI.tenseCols.map((c) => '<th scope="col">' + esc(c) + '</th>').join('') + '</tr></thead><tbody>' + RC.tenses.map((r) => '<tr>' + r.map((c) => '<td>' + esc(c) + '</td>').join('') + '</tr>').join('') + '</tbody>');
    set('#mistakes', RC.mistakes.map((m) => '<article class="card"><h3>' + esc(m.t) + '</h3><p>' + esc(m.d) + '</p>' + (m.fix ? '<p class="small"><strong>' + esc(UI.fix) + '</strong> ' + esc(m.fix) + '</p>' : '') + '</article>').join(''));
    set('#limit-table', '<thead><tr>' + UI.limitCols.map((c) => '<th scope="col">' + esc(c) + '</th>').join('') + '</tr></thead><tbody>' + RC.venueNotes.map((r) => '<tr>' + r.map((c) => '<td>' + esc(c) + '</td>').join('') + '</tr>').join('') + '</tbody>');
    set('#rubric-guide', '<thead><tr>' + UI.rubricCols.map((c) => '<th scope="col">' + esc(c) + '</th>').join('') + '</tr></thead><tbody>' + RC.rubric.map((c) => '<tr><th scope="row">' + esc(c.t) + '</th><td>' + esc(RC.rubricDesc[c.id][0]) + '</td><td>' + esc(RC.rubricDesc[c.id][1]) + '</td><td>' + esc(RC.rubricDesc[c.id][2]) + '</td></tr>').join('') + '</tbody>');
    const lim = $('#wc-limit'); if (lim) lim.innerHTML = RC.limits.map((l) => '<option value="' + l.id + '"' + (l.id === '250' ? ' selected' : '') + '>' + esc(l.t) + '</option>').join('');
    set('#extractor', RC.extractor.map((x) => { const f = meta(x.path); return '<div class="field"><label for="' + idOf(x.path, 'x') + '">' + esc(x.q) + '</label>' + (x.area ? '<textarea' : '<input') + ' id="' + idOf(x.path, 'x') + '" class="inp" data-bind="' + x.path + '"' + (f.ph ? ' placeholder="' + attr(f.ph) + '"' : '') + '>' + (x.area ? '</textarea>' : '') + '<span class="hint">' + esc(x.hint) + ' <a href="#builder" data-goto-step="' + x.step + '">' + esc(UI.goStep(RC.numerals[x.step])) + '</a></span></div>'; }).join(''));
  }
  function renderExamples() {
    const list = $('#ex-list'), pub = $('#pub-list'), filters = $('#ex-filters'); if (!list) return;
    const moveRows = (mv) => '<div class="moves">' + mv.map((m) => '<div class="move m-' + m.m + '"><span class="mv">' + esc(RC.moveNames[m.m]) + '</span><span dir="auto">' + esc(m.t) + '</span></div>').join('') + '</div>';
    const areas = [...new Set(RC.examples.map((e) => e.area))];
    const mk = (id, t) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'chip-btn'; b.textContent = t; b.setAttribute('aria-pressed', id === '*' ? 'true' : 'false'); b.addEventListener('click', () => { $$('.chip-btn', filters).forEach((x) => x.setAttribute('aria-pressed', x === b ? 'true' : 'false')); $$('#ex-list .ex-card').forEach((c) => { c.hidden = !(id === '*' || c.dataset.area === id); }); }); filters.appendChild(b); };
    mk('*', UI.exAll); areas.forEach((a) => mk(a, a));
    list.innerHTML = RC.examples.map((e) => '<article class="ex-card" data-area="' + attr(e.area) + '"><div class="tags">' + '<span class="tag">' + esc(e.area) + '</span><span class="tag">' + esc(e.approach) + '</span><span class="tag tag-illustrative">' + esc(UI.exHyp) + '</span></div><h3 class="ex-title">' + esc(e.title) + '</h3>' + moveRows(e.moves) + '<p class="small"><strong>' + esc(UI.kwLbl) + '</strong> ' + esc(e.kw) + '</p><p class="why small"><strong>' + esc(UI.whyWorks) + '</strong> ' + esc(e.why) + '</p></article>').join('');
    pub.innerHTML = RC.published.map((e) => '<article class="ex-card ex-pub"><div class="tags"><span class="tag">' + esc(e.area) + '</span><span class="tag">' + esc(e.approach) + '</span><span class="tag tag-evidence">' + esc(UI.exPub) + '</span>' + (e.cc ? '<span class="tag">' + esc(UI.ccQuoted) + '</span>' : '') + '</div><p class="pub-title" lang="en" dir="ltr">' + linkify(e.ref) + '</p>' +
      (e.moves ? moveRows(e.moves) : '') + '<p class="why small"><strong>' + esc(UI.lesson) + '</strong> ' + esc(e.lesson) + '</p></article>').join('');
  }
  function renderGlossary() {
    const body = $('#gloss-body'); if (!body) return;
    const head = $('#gloss-head'); if (head) head.innerHTML = '<tr>' + UI.glossCols.map((c) => '<th scope="col">' + esc(c) + '</th>').join('') + '</tr>';
    body.innerHTML = (window.RAB_GLOSSARY || []).map((g) => {
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
    box.innerHTML = (window.RAB_REFS || []).map((g) => '<div class="ref-group"><h3>' + esc(UI.refGroups[g.id]) + '</h3><ol>' + g.items.map((r) => '<li lang="' + (/[؀-ۿ]/.test(r.text.slice(0, 20)) ? 'ar' : 'en') + '" dir="' + (/[؀-ۿ]/.test(r.text.slice(0, 20)) ? 'rtl' : 'ltr') + '">' + linkify(r.text) + ' <span class="tag ref-type" lang="' + RC.lang + '" dir="' + (AR ? 'rtl' : 'ltr') + '">' + esc(UI.refTypes[r.type]) + '</span></li>').join('') + '</ol></div>').join('');
  }

  /* ---------------- Refresh ---------------- */
  function refresh() {
    $$('[data-pick]').forEach((b) => b.setAttribute('aria-pressed', getPath(state, b.dataset.pick) === b.dataset.id ? 'true' : 'false'));
    $$('label.chk').forEach((l) => { const i = $('input', l); if (i) l.classList.toggle('on', i.checked); });
    refreshOutputs(); stepDiag();
    $$('[data-fmt]').forEach((f) => { f.hidden = f.dataset.fmt !== (state.s1.format || 'unstructured'); });
    if (state.step === 6) state.s7.order.forEach((id) => { const n = $('#sec-' + id); if (n && document.activeElement !== n && !state.s7.edited[id]) n.value = E.sectionText(id, state, RC); });
    const rl = $('#refine-list'); if (rl) rl.innerHTML = filled(state.s7.draft) ? langHTML(state.s7.draft) : '<p class="hint">' + esc(UI.needDraft) + '</p>';
    const ml = $('#move-list'); if (ml) ml.innerHTML = filled(state.s7.draft) ? movesHTML(state.s7.draft) : '';
    renderCompliance(); renderKwSide(); renderChecker();
    const sug = E.suggestScores(state, RC);
    RC.rubric.forEach((c) => { const n = $('[data-suggest="' + c.id + '"]'); if (n) n.textContent = UI.suggestedScore + ' ' + RC.numerals[sug[c.id] - 1]; });
    renderResult();
    const cl = $('#checklist-progress'); if (cl) cl.textContent = UI.checklistDone(num(state.s8.checks.length), num(RC.checklist.length));
  }
  let raf = null;
  function onChange() { suppressSave = false; save(); if (raf) cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { refresh(); stepperStatus(); }); }

  /* ---------------- Controls ---------------- */
  function wire() {
    $('#btn-next').addEventListener('click', () => { if (validateStep(state.step, true)) goTo(state.step + 1, true); });
    $('#btn-prev').addEventListener('click', () => goTo(state.step - 1, true));
    confirmClick($('#btn-rebuild'), UI.rebuildConfirm, () => { rebuildDraft(); onChange(); toast(UI.rebuilt); }, () => state.s7.draftEdited);
    $('#btn-add-kw').addEventListener('click', () => addKeyword(''));
    $('#btn-add-rule').addEventListener('click', () => { state.s9.rules.push({ id: uid(), t: '', done: false }); renderRules(); onChange(); const n = $$('#rules [data-rule]').pop(); if (n) n.focus(); });
    $('#btn-apply-scores').addEventListener('click', () => { state.s11.scores = E.suggestScores(state, RC); $$('input[data-rub]').forEach((i) => { i.checked = state.s11.scores[i.dataset.rub] === Number(i.value); }); onChange(); toast(UI.scoresApplied); });
    confirmClick($('#btn-final-from-draft'), UI.replaceConfirm, () => { state.s12.final = state.s7.draft; syncBound('s12.final'); onChange(); toast(UI.finalCopied); }, () => filled(state.s12.final) && state.s12.final !== state.s7.draft);
    const rep = $('#report');
    rep.addEventListener('input', () => { state.report.html = sanitize(rep.innerHTML); state.report.edited = true; save(); });
    confirmClick($('#btn-regen-report'), UI.regenConfirm, () => { renderReport(true); save(); toast(UI.reportRebuilt); }, () => state.report.edited);
    $('#btn-copy-report').addEventListener('click', () => copyText(rep.innerText).then(() => toast(UI.copied), () => toast(UI.copyFail)));
    $('#btn-print').addEventListener('click', () => { renderReport(false); window.print(); });
    $('#btn-doc').addEventListener('click', () => {
      renderReport(false);
      const dir = AR ? 'rtl' : 'ltr';
      const html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>' + esc(UI.report.title) + '</title><style>body{font-family:' + (AR ? 'Arial,"Traditional Arabic"' : 'Calibri,Arial') + ',sans-serif;font-size:11pt;line-height:1.5;direction:' + dir + ';text-align:' + (AR ? 'right' : 'left') + '}h2{font-size:18pt;color:#1F6F6B}h3{font-size:13pt;color:#1F6F6B;margin-top:14pt}.meta{color:#555;font-size:9pt}</style></head><body dir="' + dir + '" lang="' + RC.lang + '">' + sanitize(rep.innerHTML) + '</body></html>';
      download(UI.fileReport + '.doc', ['﻿', html], 'application/msword');
    });
    $('#btn-txt').addEventListener('click', () => { renderReport(false); download(UI.fileReport + '.txt', ['﻿', rep.innerText], 'text/plain;charset=utf-8'); });
    $$('[data-action="delete"]').forEach((btn) => confirmClick(btn, UI.deleteAll, () => {
      try { localStorage.removeItem(STORE_KEY); } catch (e) { /* ignore */ }
      suppressSave = true; clearTimeout(saveTimer); state = defaults(); fillInputs(); renderSelectorReset(); goTo(0, false); updateSaveStatus();
      try { localStorage.removeItem(STORE_KEY); } catch (e) { /* ignore */ }
      toast(UI.deleted);
    }));
    $$('[data-action="export"]').forEach((btn) => btn.addEventListener('click', () => download(UI.fileData, [JSON.stringify(state, null, 2)], 'application/json')));
    const fi = $('#file-import');
    if (fi) fi.addEventListener('change', () => {
      const f = fi.files[0]; if (!f) return;
      const rd = new FileReader();
      rd.onload = () => {
        try { const data = JSON.parse(rd.result); if (!data || data.v !== 1 || !data.s1 || !data.s7) throw new Error('bad'); state = merge(defaults(), data); suppressSave = false; fillInputs(); renderSelectorReset(); goTo(state.step, false); save(true); toast(UI.imported); }
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
  bind(); fillInputs(); wire(); renderSelector(); renderWordCounter();
  const m = /^#step-(\d+)$/.exec(location.hash);
  goTo(m ? Math.min(Number(m[1]) - 1, state.maxStep) : state.step, !!m);
  updateSaveStatus();
})();
