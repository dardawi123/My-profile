/* =========================================================
   Research Findings: Writing, Presentation, and Discussion
   صياغة نتائج البحث وعرضها ومناقشتها — application logic

   Language-neutral. Wording comes from window.RC (rfind-ar.js or
   rfind-en.js); rules and assembly from window.RFE (engine.js); shared
   data from glossary.js and references.js. Data stays in this browser
   (localStorage); nothing is sent to a server.
   Academic tool developed by Dr. Merfat Alardawi | د. مرفت العرضاوي
   ========================================================= */
(function () {
  'use strict';
  const RC = window.RC, E = window.RFE;
  if (!RC || !E) { console.error('RFD: required scripts are missing.'); return; }
  const UI = RC.ui, AR = RC.lang === 'ar';
  const STORE_KEY = 'rfd.data.v1', LANG_KEY = 'rfd.lang', STEPS = RC.steps.length;
  const DSEC = E.DSEC, MXN = E.MX;

  /* ---------------- State ---------------- */
  function defaults() {
    const on = {}, text = {}, edited = {}, mx = {};
    DSEC.forEach((s) => { on[s] = true; text[s] = ''; edited[s] = false; });
    MXN.forEach((n) => { mx[n] = []; });
    return {
      v: 1, app: 'rfind', step: 0, maxStep: 0, savedAt: null,
      s1: { title: '', problem: '', mainq: '', subqs: '', objectives: '', framework: '', approach: '', design: '', sources: '', sampling: '', technique: '', context: '' },
      s2: { structure: '', pub: '', order: '', rationale: '' },
      mx, al: {},
      s6: { anon: '', attr: '', avfmt: '', balance: '' },
      viz: { mode: 'chart', type: 'bar', title: '', unit: '', qual: false, rows: [] },
      s8: { intro: '', summary: '', draft: '', draftEdited: false },
      s11: { framework: '' },
      s17: { opening: '', conclusion: '', order: DSEC.slice(), on, text, edited, draft: '', draftEdited: false },
      s18: { checks: [], scores: {}, self: '' },
      s19: { findings: '', discussion: '', refs: '', notes: '' },
      report: { html: '', edited: false }
    };
  }
  function uid() { return 'x' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  const str = (x) => typeof x === 'string' ? x : (typeof x === 'number' ? String(x) : '');
  function mxRow(name, x) {
    const r = { id: str(x && x.id) || uid() };
    RC.mx[name].cols.forEach((c) => { const v = x && x[c.k]; r[c.k] = c.type === 'multi' ? (Array.isArray(v) ? v.filter((y) => typeof y === 'string') : (typeof v === 'string' && v ? v.split('|') : [])) : str(v); });
    return r;
  }
  function merge(base, src) {
    if (!src || typeof src !== 'object') return base;
    Object.keys(base).forEach((k) => {
      if (!(k in src)) return;
      const b = base[k], s = src[k];
      if (k === 'order' && Array.isArray(b)) { const ok = Array.isArray(s) ? s.filter((x) => DSEC.indexOf(x) !== -1) : []; base[k] = ok.concat(DSEC.filter((x) => ok.indexOf(x) === -1)); }
      else if (k === 'mx') { MXN.forEach((n) => { base.mx[n] = Array.isArray(s && s[n]) ? s[n].slice(0, 120).filter((r) => r && typeof r === 'object').map((r) => mxRow(n, r)) : []; }); }
      else if (k === 'al') { const o = {}; if (s && typeof s === 'object') Object.keys(s).forEach((i) => { const r = s[i] || {}; o[i] = { obj: str(r.obj), coverage: str(r.coverage), note: str(r.note) }; }); base[k] = o; }
      else if (k === 'rows' && Array.isArray(b)) base[k] = Array.isArray(s) ? s.slice(0, 40).filter((r) => r && typeof r === 'object').map((r) => ({ id: str(r.id) || uid(), label: str(r.label), value: str(r.value) })) : [];
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
  const msg = (x) => { const m = RC.dm[x.k] || {}; const f = m[x.s]; return { t: m.t || '', d: typeof f === 'function' ? f(Object.assign({ D: num }, x)) : (f || '') }; };
  const loc = (s) => AR ? String(s).replace(/\bRQ(\d+)/g, (a, d) => 'RQ' + num(d)).replace(/\bF(\d+)/g, (a, d) => 'F' + num(d)) : String(s);

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
    return '<div class="field"><label for="' + id + '">' + esc(f.label) + (o.req ? '<span class="req" aria-hidden="true">*</span>' : '') + '</label>' + ctl + '<span class="hint" id="' + hid + '">' + esc(f.hint || '') + '</span><span class="err" aria-live="polite"></span></div>';
  }
  function SEL(path, opts0, o) {
    o = o || {}; const f = meta(path), id = idOf(path, o.sfx);
    return '<div class="field"><label for="' + id + '">' + esc(f.label) + (o.req ? '<span class="req" aria-hidden="true">*</span>' : '') + '</label><select id="' + id + '" class="inp" data-bind="' + path + '"' + (o.req ? ' data-required="1"' : '') + '>' + opts0 + '</select>' + (f.hint ? '<span class="hint">' + esc(f.hint) + '</span>' : '') + '<span class="err" aria-live="polite"></span></div>';
  }
  const G2 = (a, b) => '<div class="grid g-2">' + a + b + '</div>';
  function PICK(path, items, o) {
    o = o || {}; const f = meta(path), gid = idOf(path, o.sfx);
    return '<div class="field choice-group"' + (o.req === false ? '' : ' data-required-pick="' + path + '"') + '><span class="label" id="' + gid + '-l">' + esc(f.label) + (o.req === false ? '' : '<span class="req" aria-hidden="true">*</span>') + '</span>' + (f.hint ? '<span class="hint">' + esc(f.hint) + '</span>' : '') +
      '<div class="grid ' + (o.cols || 'g-240') + '" role="group" aria-labelledby="' + gid + '-l">' + items.map((it) => '<button type="button" class="choice" data-pick="' + path + '" data-id="' + it.id + '" aria-pressed="false"><strong>' + esc(it.t) + '</strong>' + (it.d ? '<span>' + esc(it.d) + '</span>' : '') + (o.badge ? '<span class="tag tag-fit" data-fit="' + it.id + '" hidden>' + esc(UI.fitsTechnique) + '</span>' : '') + '</button>').join('') + '</div><span class="err" aria-live="polite"></span></div>';
  }
  const opts = (list, blank) => (blank ? '<option value=""></option>' : '') + list.map((x) => '<option value="' + x.id + '">' + esc(x.t) + '</option>').join('');
  const OUT = (i) => '<div class="output-box"><span class="k">' + esc(RC.stepText[i].out) + '</span><span class="v" id="out-' + i + '" style="white-space:pre-line"></span></div>';
  const ERR = (id) => '<p class="err" id="' + id + '" aria-live="polite"></p>';
  const DIAG = (id) => '<div class="diag" data-diag="' + id + '"></div>';
  const diagItem = (t, s, m) => '<div class="diag-item st-' + s + '"><span class="ic" aria-hidden="true">' + icon(s) + '</span>' + (t ? '<span class="t">' + esc(t) + '<span class="status-label">' + esc(RC.statusLabel[s]) + '</span></span>' : '') + '<span class="d">' + esc(loc(m)) + '</span></div>';
  const diagList = (list) => list.map((x) => { const m = msg(x); return diagItem(m.t, x.s, m.d); }).join('');
  const cmpBox = (w, b) => '<div class="compare"><div class="ex-weak"><b>' + esc(UI.weak) + '</b>' + esc(w) + '</div><div class="ex-better"><b>' + esc(UI.better) + '</b>' + esc(b) + '</div></div>';
  const table = (cols, rows) => '<div class="table-wrap"><table class="data"><thead><tr>' + cols.map((c) => '<th scope="col">' + esc(c) + '</th>').join('') + '</tr></thead><tbody>' + rows.map((r) => '<tr>' + r.map((c, i) => i === 0 ? '<th scope="row">' + esc(c) + '</th>' : '<td>' + esc(c) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>';
  const MXBOX = (name, inst) => '<div class="mx-box" data-mx="' + name + '" data-inst="' + inst + '"></div>';
  function guideLink(i) {
    const box = document.getElementById('steps'), g = box && box.dataset.guide; if (!g) return '';
    return '<a class="step-guide" href="' + attr(g) + '#step-' + (i + 1) + '" target="_blank" rel="noopener noreferrer">' + esc(box.dataset.guideLabel || '') + '<span class="sr-only">' + esc(box.dataset.guideNewtab || '') + '</span></a>';
  }
  const btn = (id, t, cls) => '<button type="button" class="btn ' + (cls || 'btn-ghost') + ' btn-sm" id="' + id + '">' + esc(t) + '</button>';
  const draftBox = (n, bindP, rows, rebuildId) => '<div class="draft-wrap"><div class="report-tools"><h4 class="h4">' + esc(n === 8 ? UI.fDraftTitle : UI.dDraftTitle) + '</h4><span class="spacer"></span>' + (rebuildId ? btn(rebuildId, UI.rebuild) : '') + '<button type="button" class="btn btn-ghost btn-sm" data-copy-bind="' + bindP + '">' + esc(UI.copy) + '</button></div>' +
    '<div class="field"><label for="draft-' + n + '" class="sr-only">' + esc(n === 8 ? UI.fDraftTitle : UI.dDraftTitle) + '</label><textarea id="draft-' + n + '" class="inp intro-ta" data-bind="' + bindP + '" data-draft="' + (n === 8 ? 's8' : 's17') + '" rows="' + rows + '" spellcheck="true"></textarea><span class="hint" data-draft-note="' + (n === 8 ? 's8' : 's17') + '"></span></div><div class="small muted" data-wc="' + bindP + '"></div></div>';

  /* ---------------- Builder markup ---------------- */
  function stepBody(i) {
    const T = RC.stepText[i];
    const wb = T.weak ? cmpBox(T.weak, T.better) : '';
    switch (i) {
      case 0: return F('s1.title', 'text', { req: 1 }) + F('s1.problem', 'textarea', { req: 1, min: 8 }) + F('s1.mainq', 'textarea', { req: 1, min: 4, rows: 2 }) +
        G2(F('s1.subqs', 'textarea', { rows: 4 }), F('s1.objectives', 'textarea', { rows: 4 })) + F('s1.framework', 'text') +
        PICK('s1.approach', RC.approaches, { cols: 'g-200' }) + G2(SEL('s1.technique', opts(RC.techniques, true), { req: 1 }), F('s1.design', 'text')) +
        G2(F('s1.sources', 'textarea'), F('s1.sampling', 'textarea')) + F('s1.context', 'text') + OUT(0);
      case 1: return '<div class="explain small" data-recommend></div>' + PICK('s2.structure', RC.structures, { cols: 'g-240', badge: 1 }) + '<div class="refine-box" data-expect></div>' +
        PICK('s2.pub', RC.pubOptions, { cols: 'g-2' }) + SEL('s2.order', opts(RC.orders, true)) + F('s2.rationale', 'textarea') + wb + DIAG('struct') + OUT(1);
      case 2: return MXBOX('evidence', 'step') + ERR('err-ev') + DIAG('evidence');
      case 3: return '<details class="refine-box"><summary class="h4">' + esc(UI.distTitle) + '</summary><div data-dist></div></details>' +
        '<div data-show-qual>' + '<h4 class="h4">' + esc(RC.mx.themes.t) + '</h4><p class="hint">' + esc(UI.themesHint) + '</p>' + MXBOX('themes', 'step') + DIAG('themes') + '</div>' +
        '<h4 class="h4">' + esc(RC.mx.findings.t) + '</h4>' + wb + MXBOX('findings', 'step') + ERR('err-f') + DIAG('findings');
      case 4: return '<div data-align-table="step"></div>' + ERR('err-al') + DIAG('align');
      case 5: return PICK('s6.anon', RC.anonOptions, { cols: 'g-200' }) + G2(F('s6.attr', 'text'), F('s6.avfmt', 'text')) + F('s6.balance', 'textarea', { req: 1, min: 6 }) + wb +
        '<details class="refine-box" data-av-box><summary class="h4">' + esc(RC.mx.av.t) + '</summary><p class="hint">' + esc(UI.avHint) + '</p>' + MXBOX('av', 'step') + '</details>' +
        '<h4 class="h4">' + esc(UI.previewTitle) + '</h4><div data-preview></div>' + DIAG('integrate');
      case 6: return '<div data-viz="step"></div>' + DIAG('viz');
      case 7: return '<div class="refine-box"><h4 class="h4">' + esc(UI.fTplTitle) + '</h4><div data-ftpl></div></div>' + F('s8.intro', 'textarea', { rows: 3 }) + F('s8.summary', 'textarea', { rows: 3 }) + wb +
        draftBox(8, 's8.draft', 16, 'btn-rebuild-f') + ERR('err-fd') + '<h4 class="h4">' + esc(UI.refineTitle) + '</h4>' + DIAG('fdraft');
      case 8: return MXBOX('dplan', 'step') + ERR('err-dp') + DIAG('dplan') + OUT(8);
      case 9: return wb + MXBOX('interp', 'step') + ERR('err-ip') + DIAG('interp');
      case 10: return F('s11.framework', 'text') + '<div class="grid g-240" data-rel-cards></div>' + MXBOX('theory', 'step') + ERR('err-thy') + DIAG('theory');
      case 11: return wb + MXBOX('lit', 'step') + ERR('err-lit') + DIAG('lit');
      case 12: return MXBOX('unexp', 'step') + DIAG('unexp');
      case 13: return wb + MXBOX('impl', 'step') + ERR('err-im') + DIAG('impl');
      case 14: return wb + MXBOX('lim', 'step') + ERR('err-li') + DIAG('lim');
      case 15: return wb + MXBOX('future', 'step') + ERR('err-fu') + DIAG('future');
      case 16: return '<p class="hint">' + esc(UI.composerHint) + '</p>' + F('s17.opening', 'textarea', { rows: 3 }) + '<div class="composer" id="composer"></div>' + F('s17.conclusion', 'textarea', { rows: 3 }) +
        draftBox(17, 's17.draft', 18, 'btn-rebuild-d') + ERR('err-dd') + '<h4 class="h4">' + esc(UI.refineTitle) + '</h4>' + DIAG('ddraft');
      case 17: return '<div class="explain small" data-pub-note></div><div class="checker-head"><h4 class="h4">' + esc(UI.checksTitle) + '</h4><span class="checker-summary" id="checker-summary"></span></div><div class="diag" id="checker"></div>' +
        '<h4 class="h4">' + esc(UI.checklistTitle) + ' <span class="small muted" data-checklist-progress></span></h4><div class="checklist" data-checklist="step"></div>' +
        '<div class="eval-layout"><div><div class="rubric" id="rubric"></div><div class="btn-row">' + btn('btn-apply-scores', UI.applyScores) + '</div></div><div class="result-panel" id="rubric-result" aria-live="polite"></div></div>' +
        F('s18.self', 'textarea') + '<p class="disclaimer">' + esc(UI.evalDisclaimer) + '</p>';
      case 18: return '<div class="final-box">' + F('s19.findings', 'textarea', { rows: 12 }) + F('s19.discussion', 'textarea', { rows: 12 }) + '<div class="btn-row">' + btn('btn-final-from-draft', UI.finalFromDraft) + '<button type="button" class="btn btn-ghost btn-sm" data-copy-bind="s19.findings">' + esc(UI.copyFindings) + '</button><button type="button" class="btn btn-ghost btn-sm" data-copy-bind="s19.discussion">' + esc(UI.copyDiscussion) + '</button></div></div>' +
        G2(F('s19.refs', 'textarea', { rows: 6 }), F('s19.notes', 'textarea', { rows: 6 })) +
        '<div class="report-tools">' + btn('btn-regen-report', UI.reportRegen) + btn('btn-copy-report', UI.reportCopy) + btn('btn-print', UI.print) + btn('btn-doc', UI.doc, 'btn-primary') + btn('btn-txt', UI.txt) + btn('btn-csv-all', UI.csvAll) + '</div>' +
        '<div class="report" id="report" contenteditable="true" role="textbox" aria-multiline="true" aria-label="' + attr(UI.report.title) + '" spellcheck="true"></div>';
    }
    return '';
  }
  function renderBuilder() {
    $('#steps').innerHTML = RC.stepText.map((s, i) => '<div class="step" data-step="' + i + '"' + (i ? ' hidden' : '') + '><div class="step-head"><span class="module-tag">' + esc(RC.modules[RC.moduleOf[i]]) + '</span><h3>' + esc(s.h) + '</h3><p>' + esc(s.p) + '</p>' + guideLink(i) + '</div>' +
      '<div class="explain"><strong>' + esc(s.whyH) + '</strong><span>' + esc(s.why) + '</span></div>' + (s.ex ? '<div class="example-box"><b>' + esc(UI.example) + '</b>' + esc(s.ex) + '</div>' : '') + stepBody(i) + '</div>').join('');
    $('#rubric').innerHTML = RC.rubric.map((c) => '<fieldset class="rubric-row"><legend>' + esc(c.t) + '</legend><span class="desc">' + esc(c.d) + '</span><span class="suggest" data-suggest="' + c.id + '"></span><div class="scale">' +
      [1, 2, 3, 4, 5].map((n) => '<label><input type="radio" name="rub-' + c.id + '" value="' + n + '" data-rub="' + c.id + '" aria-label="' + attr(c.t + ': ' + RC.numerals[n - 1]) + '"><span aria-hidden="true">' + RC.numerals[n - 1] + '</span></label>').join('') + '</div></fieldset>').join('');
  }
  function renderChecklists() {
    $$('[data-checklist]').forEach((box) => { box.innerHTML = RC.checklist.map((c, i) => { const id = 'cl-' + box.dataset.checklist + '-' + c.id; return '<label class="chk" for="' + id + '"><input type="checkbox" id="' + id + '" data-multi="s18.checks" value="' + c.id + '"><span class="txt"><strong>' + RC.numerals[i] + '. ' + esc(c.t) + '</strong><span>' + esc(c.d) + '</span></span></label>'; }).join(''); });
  }

  /* ---------------- Shared matrix component (Tools A, C, D, F, G and the discussion matrices) ---------------- */
  const openRows = new Set();
  function rqOptions() { return '<option value=""></option>' + E.questions(state).map((q) => '<option value="' + q.i + '">' + esc(loc(q.code) + ' · ' + E.short(q.text, 60)) + '</option>').join(''); }
  function fOptions() { return '<option value=""></option>' + state.mx.findings.map((f, i) => '<option value="' + f.id + '">' + esc(loc('F' + (i + 1)) + (filled(f.label) ? ' · ' + E.short(f.label, 50) : (filled(f.statement) ? ' · ' + E.short(f.statement, 50) : ''))) + '</option>').join(''); }
  function cellHTML(name, inst, r, c) {
    const key = name + ':' + r.id + ':' + c.k, id = 'mx-' + inst + '-' + name + '-' + r.id + '-' + c.k, v = r[c.k];
    const lab = '<label for="' + id + '">' + esc(c.t) + '</label>';
    let ctl;
    if (c.type === 'area') ctl = '<textarea id="' + id + '" class="inp" rows="2" data-mxf="' + key + '"' + (c.ph ? ' placeholder="' + attr(c.ph) + '"' : '') + '></textarea>';
    else if (c.type === 'sel') ctl = '<select id="' + id + '" class="inp" data-mxf="' + key + '">' + opts(c.opts, true) + '</select>';
    else if (c.type === 'finding') ctl = '<select id="' + id + '" class="inp" data-mxf="' + key + '" data-fsel="1">' + fOptions() + '</select>';
    else if (c.type === 'rq') ctl = '<select id="' + id + '" class="inp" data-mxf="' + key + '" data-qsel="1">' + rqOptions() + '</select>';
    else if (c.type === 'multi') return '<fieldset class="field mx-multi"><legend>' + esc(c.t) + '</legend><div class="radio-row">' + c.opts.map((o) => '<label class="radio-pill"><input type="checkbox" data-mxm="' + key + '" value="' + o.id + '"' + (v.indexOf(o.id) !== -1 ? ' checked' : '') + '><span>' + esc(o.t) + '</span></label>').join('') + '</div></fieldset>';
    else ctl = '<input id="' + id + '" class="inp" data-mxf="' + key + '"' + (c.ph ? ' placeholder="' + attr(c.ph) + '"' : '') + '>';
    return '<div class="field' + (c.wide ? ' mx-wide' : '') + '">' + lab + ctl + (c.hint ? '<span class="hint">' + esc(c.hint) + '</span>' : '') + '</div>';
  }
  function rowSummary(name, r, i) {
    const S = RC.mx[name], parts = [];
    if (name === 'findings') parts.push(loc('F' + (i + 1)));
    S.sum.forEach((k) => { const c = S.cols.find((x) => x.k === k); let v = r[k]; if (!filled(v)) return; if (c.type === 'finding') v = loc(E.fName(state, v)); else if (c.type === 'rq') v = loc(E.qCode(state, v)); else if (c.type === 'sel') v = label(c.opts, v); parts.push(E.short(v, 70)); });
    return parts.join(' · ') || UI.rowN(num(i + 1));
  }
  function renderMx(name, except) {
    const S = RC.mx[name], rows = state.mx[name];
    $$('[data-mx="' + name + '"]').forEach((box) => {
      if (box === except) return;
      const inst = box.dataset.inst;
      box.innerHTML = '<div class="mx-head"><span class="small muted">' + esc(UI.rows(num(rows.length))) + '</span><span class="spacer"></span><button type="button" class="btn btn-primary btn-sm" data-mx-act="add" data-name="' + name + '">' + esc(S.add) + '</button>' +
        '<button type="button" class="btn btn-ghost btn-sm" data-mx-act="csv" data-name="' + name + '">' + esc(UI.csv) + '</button><button type="button" class="btn btn-ghost btn-sm" data-mx-act="json" data-name="' + name + '">' + esc(UI.json) + '</button>' +
        '<label class="btn btn-ghost btn-sm" for="imp-' + inst + '-' + name + '">' + esc(UI.importRows) + '</label><input type="file" id="imp-' + inst + '-' + name + '" class="visually-hidden" accept=".csv,.json,text/csv,application/json" data-mx-file="' + name + '"></div>' +
        (S.intro ? '<p class="hint">' + esc(S.intro) + '</p>' : '') +
        (rows.length ? rows.map((r, i) => '<details class="mx-row" data-row="' + r.id + '"' + (openRows.has(r.id) || (i === rows.length - 1 && box.dataset.justAdded === '1') ? ' open' : '') + '><summary><span class="mx-sum" data-mx-sum="' + name + ':' + r.id + '">' + esc(rowSummary(name, r, i)) + '</span></summary>' +
          '<div class="mx-grid">' + S.cols.map((c) => cellHTML(name, inst, r, c)).join('') + '</div><div class="btn-row mx-actions">' +
          '<button type="button" class="btn btn-ghost btn-sm" data-mx-move="' + name + ':' + r.id + ':-1"' + (i === 0 ? ' disabled' : '') + ' aria-label="' + attr(UI.moveUp) + '">↑</button><button type="button" class="btn btn-ghost btn-sm" data-mx-move="' + name + ':' + r.id + ':1"' + (i === rows.length - 1 ? ' disabled' : '') + ' aria-label="' + attr(UI.moveDown) + '">↓</button>' +
          '<button type="button" class="btn btn-danger btn-sm" data-mx-del="' + name + ':' + r.id + '">' + esc(UI.del) + '</button></div></details>').join('') : '<p class="hint mx-empty">' + esc(S.empty || UI.noRows) + '</p>');
      box.dataset.justAdded = '';
      rows.forEach((r) => S.cols.forEach((c) => { if (c.type === 'multi') return; const n = box.querySelector('[data-mxf="' + name + ':' + r.id + ':' + c.k + '"]'); if (n) n.value = r[c.k] || ''; }));
    });
  }
  const DEPENDENT = ['evidence', 'av', 'joint', 'dplan', 'interp', 'theory', 'lit', 'impl', 'findings', 'themes'];
  function renderAllMx() { MXN.forEach((n) => renderMx(n)); }
  function refreshRefSelects() {
    const fo = fOptions(), qo = rqOptions();
    $$('select[data-fsel]').forEach((s) => { if (document.activeElement === s) return; const v = s.value; s.innerHTML = fo; s.value = v; });
    $$('select[data-qsel]').forEach((s) => { if (document.activeElement === s) return; const v = s.value; s.innerHTML = qo; s.value = v; });
    MXN.forEach((n) => state.mx[n].forEach((r, i) => { $$('[data-mx-sum="' + n + ':' + r.id + '"]').forEach((x) => { x.textContent = rowSummary(n, r, i); }); }));
  }
  function mxAdd(name, box) {
    const r = mxRow(name, {});
    if (name === 'evidence') r.code = 'E' + (state.mx.evidence.length + 1);
    state.mx[name].push(r); openRows.add(r.id); if (box) box.dataset.justAdded = '1';
    renderMx(name); if (name === 'findings') { renderAllMx(); renderAlign(); }
    onChange();
    const n = $('[data-mx="' + name + '"][data-inst="' + (box ? box.dataset.inst : 'step') + '"] details[data-row="' + r.id + '"] .inp'); if (n) n.focus();
  }
  function mxImport(name, file) {
    const rd = new FileReader();
    rd.onload = () => {
      try {
        const S = RC.mx[name], keys = S.cols.map((c) => c.k); let rows = [];
        if (/\.json$/i.test(file.name) || /^\s*[[{]/.test(rd.result)) { const d = JSON.parse(rd.result); rows = (Array.isArray(d) ? d : (d && Array.isArray(d.rows) ? d.rows : [])).map((x) => mxRow(name, Object.assign({}, x, { id: '' }))); }
        else { const t = E.parseCSV(rd.result); if (t.length < 2) throw new Error('empty'); const head = t[0].map((h) => { h = String(h).trim(); const c = S.cols.find((x) => x.k === h || x.t === h); return c ? c.k : ''; }); if (!head.some(filled)) throw new Error('cols'); rows = t.slice(1).map((row) => { const o = {}; head.forEach((k, i) => { if (k) o[k] = row[i] || ''; }); return mxRow(name, o); }); }
        rows = rows.map((r) => inRow(name, r)).filter((r) => keys.some((k) => filled(r[k]))); if (!rows.length) throw new Error('none');
        state.mx[name] = state.mx[name].concat(rows).slice(0, 120); renderAllMx(); renderAlign(); onChange(); toast(UI.imported(num(rows.length)));
      } catch (e) { toast(UI.importRowsFail); }
    };
    rd.readAsText(file);
  }
  /* Readable codes in files (F1, MRQ, RQ1) instead of internal ids; mapped back on import. */
  function outRow(name, r) { const o = {}; RC.mx[name].cols.forEach((c) => { const v = r[c.k]; o[c.k] = c.type === 'finding' ? E.fCode(state, v) : c.type === 'rq' ? E.qCode(state, v) : v; }); return o; }
  function inRow(name, r) {
    RC.mx[name].cols.forEach((c) => {
      const v = String(r[c.k] || '').trim(); if (!v) return;
      if (c.type === 'finding' && !state.mx.findings.some((f) => f.id === v)) { const m = /^F\s*(\d+)/i.exec(v); const f = m && state.mx.findings[Number(m[1]) - 1]; r[c.k] = f ? f.id : ''; }
      if (c.type === 'rq') { if (/^MRQ$/i.test(v)) r[c.k] = '0'; else { const m = /^RQ\s*(\d+)$/i.exec(v); r[c.k] = m ? m[1] : (/^\d+$/.test(v) ? v : ''); } }
    });
    return r;
  }
  function mxExport(name, type) {
    const cols = RC.mx[name].cols.map((c) => c.k), base = UI.files[name] || name;
    const rows = state.mx[name].map((r) => outRow(name, r));
    if (type === 'csv') download(base + '.csv', ['﻿', E.toCSV(rows, cols)], 'text/csv;charset=utf-8'); else download(base + '.json', [JSON.stringify(rows, null, 2)], 'application/json');
  }

  /* ---------------- Step 5: question–findings alignment (Tool B) ---------------- */
  const alRow = (i) => (state.al[i] = state.al[i] || { obj: '', coverage: '', note: '' });
  function renderAlign(except) {
    const qs = E.questions(state);
    $$('[data-align-table]').forEach((box) => {
      if (box === except) return;
      const inst = box.dataset.alignTable;
      if (!qs.length) { box.innerHTML = '<p class="hint">' + esc(UI.alNoQ) + '</p>'; return; }
      box.innerHTML = qs.map((q) => {
        const fs = E.fFor(state, q.i), ev = fs.reduce((n, f) => n + E.evCount(state, f.id), 0), id = 'al-' + inst + '-' + q.i;
        return '<article class="al-card"><h4 class="h4">' + esc(loc(q.code)) + ' · <span dir="auto">' + esc(q.text) + '</span></h4>' +
          '<p class="small"><strong>' + esc(UI.alFindings) + ':</strong> ' + (fs.length ? fs.map((f) => esc(loc(E.fName(state, f.id)))).join(RC.sep) : '<span class="muted">' + esc(UI.alNone) + '</span>') + ' · <strong>' + esc(UI.alEvidence) + ':</strong> ' + num(ev) + '</p>' +
          '<div class="grid g-3"><div class="field"><label for="' + id + '-obj">' + esc(UI.alObj) + '</label><input id="' + id + '-obj" class="inp" data-al="' + q.i + ':obj"></div>' +
          '<div class="field"><label for="' + id + '-cov">' + esc(UI.alCoverage) + '<span class="req" aria-hidden="true">*</span></label><select id="' + id + '-cov" class="inp" data-al="' + q.i + ':coverage">' + opts(RC.coverage, true) + '</select></div>' +
          '<div class="field"><label for="' + id + '-note">' + esc(UI.alNote) + '</label><input id="' + id + '-note" class="inp" data-al="' + q.i + ':note"></div></div></article>';
      }).join('');
      qs.forEach((q) => { const r = alRow(q.i); ['obj', 'coverage', 'note'].forEach((f) => { const n = box.querySelector('[data-al="' + q.i + ':' + f + '"]'); if (n) n.value = r[f]; }); });
    });
  }

  /* ---------------- Step 6: evidence preview ---------------- */
  function renderPreview() {
    const box = $('[data-preview]'); if (!box) return;
    const fs = E.findings(state);
    box.innerHTML = fs.length ? fs.map((f) => { const ev = E.evFor(state, f.id), av = E.avFor(state, f.id), n = ev.length + av.length; return '<article class="card prev-card' + (n < 2 ? ' thin' : '') + '"><h4 class="h4">' + esc(loc(E.fName(state, f.id))) + ' <span class="tag">' + esc(UI.evN(num(n))) + '</span></h4><p class="small">' + esc(f.statement) + '</p>' +
      (n ? '<ul class="list small">' + ev.map((e) => '<li dir="auto">' + esc(RC.tpl.evidence(e)) + '</li>').concat(av.map((a) => '<li dir="auto">' + esc(RC.tpl.av(a)) + '</li>')).join('') + '</ul>' : '<p class="hint">' + esc(UI.linkEvidence) + '</p>') + '</article>'; }).join('') : '<p class="hint">' + esc(UI.needFindings) + '</p>';
    const avb = $('[data-av-box]'); if (avb && E.isTextual(state)) avb.open = true;
  }

  /* ---------------- Step 7: Findings Visualization Tool (Tool E) ---------------- */
  const NS = 'http://www.w3.org/2000/svg';
  const sx = (s) => esc(String(s == null ? '' : s));
  function wrapText(s, max, nmax) { const words = String(s || '').split(/\s+/), out = []; let cur = ''; words.forEach((w) => { if ((cur + ' ' + w).trim().length > max && cur) { out.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); }); if (cur) out.push(cur); if (out.length > nmax) { out.length = nmax; out[nmax - 1] = out[nmax - 1].replace(/.{0,1}$/, '…'); } return out; }
  const FONT = AR ? "'IBM Plex Sans Arabic', Arial, sans-serif" : "'IBM Plex Sans Arabic', 'Segoe UI', Arial, sans-serif";
  function chartData() { return state.viz.rows.filter((r) => filled(r.label)).map((r) => ({ label: r.label, v: E.parseNum(r.value) })).filter((r) => isFinite(r.v)); }
  function niceMax(m) { if (m <= 0) return 1; const p = Math.pow(10, Math.floor(Math.log10(m))), f = m / p; return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * p; }
  function chartSVG() {
    const v = state.viz, d = chartData(), W = 720, H = 400, ml = 56, mr = 20, mt = 46, mb = 86, pw = W - ml - mr, ph = H - mt - mb;
    let g = '<svg xmlns="' + NS + '" viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" font-family="' + FONT + '" role="img" aria-label="' + sx(v.title || UI.vzChart) + '"><rect width="100%" height="100%" fill="#fff"/>';
    g += '<text x="' + W / 2 + '" y="26" text-anchor="middle" font-size="16" font-weight="700" fill="#0F4542">' + sx(v.title || UI.vzChart) + '</text>';
    if (!d.length) return g + '<text x="' + W / 2 + '" y="' + H / 2 + '" text-anchor="middle" font-size="14" fill="#6B7A77">' + sx(UI.vzNoData) + '</text></svg>';
    const mx = niceMax(Math.max.apply(null, d.map((x) => x.v)));
    for (let k = 0; k <= 5; k++) { const y = mt + ph - ph * k / 5, val = mx * k / 5; g += '<line x1="' + ml + '" x2="' + (W - mr) + '" y1="' + y + '" y2="' + y + '" stroke="#E2E8E6"/><text x="' + (ml - 8) + '" y="' + (y + 4) + '" text-anchor="end" font-size="11" fill="#55625F">' + sx(num(+val.toFixed(2))) + '</text>'; }
    if (filled(v.unit)) g += '<text x="14" y="' + (mt + ph / 2) + '" font-size="11" fill="#55625F" transform="rotate(-90 14 ' + (mt + ph / 2) + ')" text-anchor="middle">' + sx(v.unit) + '</text>';
    const n = d.length, bw = pw / n, xs = (i) => ml + bw * i + bw / 2;
    const order = AR ? d.slice().reverse() : d;
    if (v.type === 'line') {
      const pts = order.map((x, i) => xs(i) + ',' + (mt + ph - ph * x.v / mx)).join(' ');
      g += '<polyline points="' + pts + '" fill="none" stroke="#1F6F6B" stroke-width="2.5"/>' + order.map((x, i) => '<circle cx="' + xs(i) + '" cy="' + (mt + ph - ph * x.v / mx) + '" r="4.5" fill="#C9A24A" stroke="#1F6F6B" stroke-width="1.5"/><text x="' + xs(i) + '" y="' + (mt + ph - ph * x.v / mx - 10) + '" text-anchor="middle" font-size="11" fill="#0F4542">' + sx(num(x.v)) + '</text>').join('');
    } else {
      const w = Math.min(64, bw * 0.62);
      g += order.map((x, i) => { const h = ph * x.v / mx; return '<rect x="' + (xs(i) - w / 2) + '" y="' + (mt + ph - h) + '" width="' + w + '" height="' + h + '" rx="3" fill="#1F6F6B"/><text x="' + xs(i) + '" y="' + (mt + ph - h - 6) + '" text-anchor="middle" font-size="11" fill="#0F4542">' + sx(num(x.v)) + '</text>'; }).join('');
    }
    g += '<line x1="' + ml + '" x2="' + (W - mr) + '" y1="' + (mt + ph) + '" y2="' + (mt + ph) + '" stroke="#55625F"/>';
    g += order.map((x, i) => '<text x="' + xs(i) + '" y="' + (mt + ph + 18) + '" text-anchor="middle" font-size="11" fill="#1E2B29">' + wrapText(x.label, Math.max(8, Math.floor(bw / 7)), 3).map((l, k) => '<tspan x="' + xs(i) + '" dy="' + (k ? 13 : 0) + '">' + sx(l) + '</tspan>').join('') + '</text>').join('');
    if (v.qual) g += '<text x="' + W / 2 + '" y="' + (H - 8) + '" text-anchor="middle" font-size="10.5" fill="#8A6A1E">' + sx(UI.vzQualNote) + '</text>';
    return g + '</svg>';
  }
  function themeSVG() {
    const th = state.mx.themes.filter((t) => filled(t.name)), W = 820, H = 620, cx = W / 2, cy = H / 2;
    let g = '<svg xmlns="' + NS + '" viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" font-family="' + FONT + '" role="img" aria-label="' + sx(UI.vzThemes) + '"><rect width="100%" height="100%" fill="#fff"/>';
    if (!th.length) return g + '<text x="' + cx + '" y="' + cy + '" text-anchor="middle" font-size="14" fill="#6B7A77">' + sx(UI.vzNoThemes) + '</text></svg>';
    const center = E.short(state.s1.mainq || state.s1.title || UI.vzCenter, 80), n = th.length, R1 = 175, R2 = 280;
    const node = (x, y, w, h, txt, fill, stroke, color, fs, lines0) => '<g><rect x="' + (x - w / 2) + '" y="' + (y - h / 2) + '" width="' + w + '" height="' + h + '" rx="12" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.5"/>' + (() => { const L = wrapText(txt, Math.floor(w / (fs * 0.56)), lines0); const y0 = y - (L.length - 1) * (fs + 2) / 2 + fs / 3; return '<text text-anchor="middle" font-size="' + fs + '" fill="' + color + '">' + L.map((l, k) => '<tspan x="' + x + '" y="' + (y0 + k * (fs + 2)) + '">' + sx(l) + '</tspan>').join('') + '</text>'; })() + '</g>';
    let lines = '', nodes = '';
    th.forEach((t, k) => {
      const a = -Math.PI / 2 + 2 * Math.PI * k / n, x = cx + R1 * Math.cos(a), y = cy + R1 * Math.sin(a) * 0.82;
      lines += '<line x1="' + cx + '" y1="' + cy + '" x2="' + x + '" y2="' + y + '" stroke="#1F6F6B" stroke-width="1.6"/>';
      const subs = E.lines(t.subs).slice(0, 4), spread = Math.min(0.9, 2 * Math.PI / n * 0.8);
      subs.forEach((s0, j) => { const b = a + (subs.length > 1 ? (j / (subs.length - 1) - 0.5) * spread : 0), sx2 = cx + R2 * Math.cos(b), sy2 = cy + R2 * Math.sin(b) * 0.86; lines += '<line x1="' + x + '" y1="' + y + '" x2="' + sx2 + '" y2="' + sy2 + '" stroke="#9DB9B6" stroke-dasharray="4 3"/>'; nodes += node(sx2, sy2, 124, 40, s0, '#F4F8F7', '#9DB9B6', '#1E2B29', 10.5, 2); });
      nodes += node(x, y, 150, 54, t.name, '#E5F0EE', '#1F6F6B', '#0F4542', 12.5, 3);
    });
    nodes += node(cx, cy, 190, 74, center, '#1F6F6B', '#0F4542', '#fff', 12.5, 4);
    return g + lines + nodes + '</svg>';
  }
  function findingsMatrixHTML() {
    const qs = E.questions(state);
    if (!qs.length) return '<p class="hint">' + esc(UI.alNoQ) + '</p>';
    return table(UI.fmCols, qs.map((q) => { const fs = E.fFor(state, q.i); return [loc(q.code) + ' · ' + E.short(q.text, 70), fs.map((f) => loc(E.fCode(state, f.id)) + ' ' + E.short(f.statement || f.label, 60)).join(' | ') || '—', fs.map((f) => label(RC.mx.findings.cols.find((c) => c.k === 'basis').opts, f.basis)).filter(filled).join(RC.sep) || '—', num(fs.reduce((n, f) => n + E.evCount(state, f.id), 0)), label(RC.coverage, (state.al[q.i] || {}).coverage) || '—']; }));
  }
  function calcTable() {
    const d = chartData(); if (!d.length) return '';
    const tot = d.reduce((a, x) => a + x.v, 0);
    return '<p class="small muted">' + esc(UI.vzCalc) + '</p>' + table(UI.vzCols, d.map((x) => [x.label, num(x.v), tot ? fmt1(x.v / tot * 100) + (AR ? '٪' : '%') : '—']).concat([[UI.vzTotal, num(+tot.toFixed(3)), tot ? (AR ? '١٠٠٪' : '100%') : '—']]));
  }
  function renderViz(except) {
    $$('[data-viz]').forEach((box) => {
      if (box === except) return;
      const inst = box.dataset.viz, v = state.viz, id = 'vz-' + inst;
      const tabs = '<div class="radio-row" role="radiogroup" aria-label="' + attr(UI.vzMode) + '">' + RC.vizModes.map((m) => '<label class="radio-pill"><input type="radio" name="' + id + '-mode" data-vz-mode value="' + m.id + '"' + (v.mode === m.id ? ' checked' : '') + '><span>' + esc(m.t) + '</span></label>').join('') + '</div><p class="hint">' + esc(label(RC.vizModes.map((m) => ({ id: m.id, t: m.d })), v.mode)) + '</p>';
      let body = '';
      if (v.mode === 'chart') {
        body = '<div class="grid g-3"><div class="field"><label for="' + id + '-type">' + esc(UI.vzType) + '</label><select id="' + id + '-type" class="inp" data-vz="type">' + opts(RC.chartTypes) + '</select></div>' +
          '<div class="field"><label for="' + id + '-title">' + esc(RC.f['viz.title'].label) + '</label><input id="' + id + '-title" class="inp" data-vz="title" placeholder="' + attr(RC.f['viz.title'].ph) + '"></div>' +
          '<div class="field"><label for="' + id + '-unit">' + esc(RC.f['viz.unit'].label) + '</label><input id="' + id + '-unit" class="inp" data-vz="unit" placeholder="' + attr(RC.f['viz.unit'].ph) + '"></div></div>' +
          '<label class="chk' + (v.qual ? ' on' : '') + '" for="' + id + '-qual"><input type="checkbox" id="' + id + '-qual" data-vz="qual"' + (v.qual ? ' checked' : '') + '><span class="txt"><strong>' + esc(UI.vzQual) + '</strong><span>' + esc(UI.vzQualHint) + '</span></span></label>' +
          '<div class="vz-rows">' + v.rows.map((r) => '<div class="vz-row"><label class="sr-only" for="' + id + '-l-' + r.id + '">' + esc(UI.vzLabel) + '</label><input id="' + id + '-l-' + r.id + '" class="inp" data-vzr="' + r.id + ':label" placeholder="' + attr(UI.vzLabel) + '"><label class="sr-only" for="' + id + '-v-' + r.id + '">' + esc(UI.vzValue) + '</label><input id="' + id + '-v-' + r.id + '" class="inp" inputmode="decimal" data-vzr="' + r.id + ':value" placeholder="' + attr(UI.vzValue) + '"><button type="button" class="btn btn-ghost btn-sm" data-vz-del="' + r.id + '" aria-label="' + attr(UI.del) + '">×</button></div>').join('') + '</div>' +
          '<div class="btn-row"><button type="button" class="btn btn-ghost btn-sm" data-vz-act="add">' + esc(UI.vzAdd) + '</button><button type="button" class="btn btn-ghost btn-sm" data-vz-act="themes">' + esc(UI.vzFromThemes) + '</button><button type="button" class="btn btn-ghost btn-sm" data-vz-act="svg">' + esc(UI.vzSvg) + '</button></div>' +
          '<div class="viz-wrap" data-vz-canvas="chart"></div><div data-vz-calc></div>';
      } else if (v.mode === 'themes') body = '<div class="btn-row"><button type="button" class="btn btn-ghost btn-sm" data-vz-act="tsvg">' + esc(UI.vzSvg) + '</button></div><div class="viz-wrap" data-vz-canvas="themes"></div><p class="hint">' + esc(UI.vzThemesHint) + '</p>';
      else if (v.mode === 'joint') body = MXBOX('joint', 'viz-' + inst) + '<div data-joint-table></div>';
      else body = '<div data-fmatrix></div>';
      box.innerHTML = tabs + body;
      if (v.mode === 'chart') { const s = box.querySelector('[data-vz="type"]'); s.value = v.type; box.querySelector('[data-vz="title"]').value = v.title; box.querySelector('[data-vz="unit"]').value = v.unit; v.rows.forEach((r) => { box.querySelector('[data-vzr="' + r.id + ':label"]').value = r.label; box.querySelector('[data-vzr="' + r.id + ':value"]').value = r.value; }); }
      if (v.mode === 'joint') renderMx('joint');
    });
    redrawViz();
  }
  function redrawViz() {
    $$('[data-vz-canvas="chart"]').forEach((c) => { c.innerHTML = chartSVG(); });
    $$('[data-vz-calc]').forEach((c) => { c.innerHTML = calcTable(); });
    $$('[data-vz-canvas="themes"]').forEach((c) => { c.innerHTML = themeSVG(); });
    $$('[data-fmatrix]').forEach((c) => { c.innerHTML = findingsMatrixHTML(); });
    $$('[data-joint-table]').forEach((c) => { const r = state.mx.joint.filter((x) => filled(x.dim)); c.innerHTML = r.length ? table(RC.mx.joint.cols.map((x) => x.t), r.map((x) => [x.dim, x.quant, x.qual, label(RC.mx.joint.cols.find((k) => k.k === 'fit').opts, x.fit), x.meta])) : ''; });
  }

  /* ---------------- Composers ---------------- */
  function rebuildFindings() { state.s8.draft = E.composeFindings(state, RC); state.s8.draftEdited = false; syncBound('s8.draft'); noteDraft(); }
  function renderComposer() {
    const box = $('#composer'); if (!box) return;
    const o = state.s17.order;
    box.innerHTML = o.map((id, i) => {
      const on = state.s17.on[id], n = E.wc(E.dSectionText(id, state, RC));
      return '<div class="comp-row' + (on ? '' : ' off') + '" data-row="' + id + '"><div class="comp-head"><label class="radio-pill"><input type="checkbox" data-on="' + id + '"' + (on ? ' checked' : '') + '><span>' + RC.numerals[i] + '. ' + esc(RC.dNames[id]) + '</span></label><span class="spacer"></span><span class="wc" data-sec-wc="' + id + '">' + esc(UI.words(num(n))) + '</span>' +
        '<button type="button" class="btn btn-ghost btn-sm" data-move="' + id + '" data-dir="-1"' + (i === 0 ? ' disabled' : '') + ' aria-label="' + attr(UI.moveUp + ': ' + RC.dNames[id]) + '">↑</button><button type="button" class="btn btn-ghost btn-sm" data-move="' + id + '" data-dir="1"' + (i === o.length - 1 ? ' disabled' : '') + ' aria-label="' + attr(UI.moveDown + ': ' + RC.dNames[id]) + '">↓</button>' +
        (state.s17.edited[id] ? '<button type="button" class="btn btn-ghost btn-sm" data-reset-sec="' + id + '">' + esc(UI.resetSection) + '</button>' : '') + '</div><label class="sr-only" for="sec-' + id + '">' + esc(RC.dNames[id]) + '</label><textarea id="sec-' + id + '" class="inp" data-sec="' + id + '" placeholder="' + attr(UI.sectionEmpty) + '"></textarea><span class="hint">' + esc(RC.dHints[id]) + '</span></div>';
    }).join('');
    o.forEach((id) => { const n = $('#sec-' + id); if (n) n.value = E.dSectionText(id, state, RC); });
  }
  function moveSection(id, dir) { const o = state.s17.order, i = o.indexOf(id), j = i + dir; if (j < 0 || j >= o.length) return; o[i] = o[j]; o[j] = id; renderComposer(); afterSections(); const b = $('[data-move="' + id + '"][data-dir="' + dir + '"]'); if (b && !b.disabled) b.focus(); }
  function afterSections() { state.s17.order.forEach((id) => { const n = $('[data-sec-wc="' + id + '"]'); if (n) n.textContent = UI.words(num(E.wc(E.dSectionText(id, state, RC)))); }); if (!state.s17.draftEdited) rebuildDiscussion(); else noteDraft(); onChange(); }
  function rebuildDiscussion() { state.s17.draft = E.assembleDiscussion(state, RC); state.s17.draftEdited = false; syncBound('s17.draft'); noteDraft(); }
  function noteDraft() { $$('[data-draft-note]').forEach((n) => { const k = n.dataset.draftNote; n.textContent = state[k].draftEdited ? UI.draftEditedNote : UI.draftAutoNote; }); }
  function autoDrafts() { if (!state.s8.draftEdited) rebuildFindings(); if (!state.s17.draftEdited) rebuildDiscussion(); }

  /* ---------------- Binding ---------------- */
  function syncBound(path, src) { $$('[data-bind="' + path + '"]').forEach((n) => { if (n !== src && n.value !== getPath(state, path)) n.value = getPath(state, path) || ''; }); }
  let depTimer = null;
  function deferDeps() { clearTimeout(depTimer); depTimer = setTimeout(() => { refreshRefSelects(); renderAlign(); renderPreview(); redrawViz(); if (state.step === 16 && !state.s17.draftEdited) { renderComposer(); } autoDrafts(); }, 450); }
  function bind() {
    document.addEventListener('input', (e) => {
      const t = e.target;
      if (t.matches('[data-bind]')) {
        setPath(state, t.dataset.bind, t.value); syncBound(t.dataset.bind, t);
        if (t.dataset.draft) state[t.dataset.draft].draftEdited = true;
        if (t.getAttribute('aria-invalid') === 'true' && filled(t.value)) clearErr(t);
        if (/^s1\.(mainq|subqs|title)$/.test(t.dataset.bind)) deferDeps();
        if (/^s8\.(intro|summary)$/.test(t.dataset.bind) && !state.s8.draftEdited) rebuildFindings();
        if (/^s17\.(opening|conclusion)$/.test(t.dataset.bind)) { afterSections(); return; }
        if (t.dataset.bind === 's11.framework') { deferDeps(); }
        onChange();
      }
      else if (t.matches('[data-mxf]')) {
        const [n, id, c] = t.dataset.mxf.split(':'), r = state.mx[n].find((x) => x.id === id); if (!r) return; r[c] = t.value;
        $$('[data-mxf="' + t.dataset.mxf + '"]').forEach((x) => { if (x !== t) x.value = t.value; });
        const i = state.mx[n].indexOf(r); $$('[data-mx-sum="' + n + ':' + id + '"]').forEach((x) => { x.textContent = rowSummary(n, r, i); });
        deferDeps(); onChange();
      }
      else if (t.matches('[data-al]')) { const [i, f] = t.dataset.al.split(':'); alRow(i)[f] = t.value; $$('[data-al="' + t.dataset.al + '"]').forEach((n) => { if (n !== t) n.value = t.value; }); onChange(); }
      else if (t.matches('[data-vz]') && t.type !== 'checkbox' && t.tagName !== 'SELECT') { state.viz[t.dataset.vz] = t.value; $$('[data-vz="' + t.dataset.vz + '"]').forEach((n) => { if (n !== t) n.value = t.value; }); redrawViz(); onChange(); }
      else if (t.matches('[data-vzr]')) { const [id, f] = t.dataset.vzr.split(':'), r = state.viz.rows.find((x) => x.id === id); if (r) { r[f] = t.value; $$('[data-vzr="' + t.dataset.vzr + '"]').forEach((n) => { if (n !== t) n.value = t.value; }); redrawViz(); onChange(); } }
      else if (t.matches('[data-sec]')) { const id = t.dataset.sec; state.s17.text[id] = t.value; state.s17.edited[id] = true; afterSections(); }
      else if (t.matches('#lc-text, #lc-mode')) renderTextTool();
      else if (t.matches('#cl-text')) renderClassifier();
      else if (t.matches('#gloss-search')) filterGlossary();
    });
    document.addEventListener('change', (e) => {
      const t = e.target;
      if (t.matches('select[data-bind]')) {
        setPath(state, t.dataset.bind, t.value); syncBound(t.dataset.bind, t); clearErr(t);
        if (t.dataset.bind === 's1.technique') refreshFit();
        onChange();
      }
      else if (t.matches('select[data-mxf]')) {
        const [n, id, c] = t.dataset.mxf.split(':'), r = state.mx[n].find((x) => x.id === id); if (!r) return; r[c] = t.value;
        $$('[data-mxf="' + t.dataset.mxf + '"]').forEach((x) => { if (x !== t) x.value = t.value; });
        const i = state.mx[n].indexOf(r); $$('[data-mx-sum="' + n + ':' + id + '"]').forEach((x) => { x.textContent = rowSummary(n, r, i); });
        renderAlign(); renderPreview(); redrawViz(); autoDrafts(); onChange();
      }
      else if (t.matches('input[data-mxm]')) {
        const [n, id, c] = t.dataset.mxm.split(':'), r = state.mx[n].find((x) => x.id === id); if (!r) return; const a = r[c], k = a.indexOf(t.value);
        if (t.checked && k === -1) a.push(t.value); else if (!t.checked && k !== -1) a.splice(k, 1);
        $$('input[data-mxm="' + t.dataset.mxm + '"][value="' + t.value + '"]').forEach((x) => { x.checked = t.checked; }); autoDrafts(); onChange();
      }
      else if (t.matches('input[data-mx-file]')) { if (t.files[0]) mxImport(t.dataset.mxFile, t.files[0]); t.value = ''; }
      else if (t.matches('select[data-al]')) { const [i, f] = t.dataset.al.split(':'); alRow(i)[f] = t.value; $$('[data-al="' + t.dataset.al + '"]').forEach((n) => { if (n !== t) n.value = t.value; }); clearErr(t); redrawViz(); onChange(); }
      else if (t.matches('input[data-vz-mode]')) { state.viz.mode = t.value; renderViz(); onChange(); }
      else if (t.matches('select[data-vz]')) { state.viz[t.dataset.vz] = t.value; $$('select[data-vz="' + t.dataset.vz + '"]').forEach((n) => { if (n !== t) n.value = t.value; }); redrawViz(); onChange(); }
      else if (t.matches('input[data-vz="qual"]')) { state.viz.qual = t.checked; renderViz(); onChange(); }
      else if (t.matches('input[data-multi]')) {
        const arr = getPath(state, t.dataset.multi), i = arr.indexOf(t.value); if (t.checked && i === -1) arr.push(t.value); else if (!t.checked && i !== -1) arr.splice(i, 1);
        $$('input[data-multi="' + t.dataset.multi + '"][value="' + t.value + '"]').forEach((x) => { x.checked = t.checked; }); onChange();
      }
      else if (t.matches('input[data-rub]')) { state.s18.scores[t.dataset.rub] = Number(t.value); onChange(); }
      else if (t.matches('input[data-on]')) { state.s17.on[t.dataset.on] = t.checked; renderComposer(); afterSections(); }
    });
    document.addEventListener('toggle', (e) => { const d = e.target; if (d.matches && d.matches('details.mx-row')) { if (d.open) openRows.add(d.dataset.row); else openRows.delete(d.dataset.row); } }, true);
    document.addEventListener('click', (e) => {
      const t = e.target.closest('button, a'); if (!t) return;
      if (t.dataset.pick) { setPath(state, t.dataset.pick, t.dataset.id); clearErr(t); if (t.dataset.pick === 's1.approach') refreshFit(); onChange(); }
      else if (t.dataset.copyBind) { copyText(String(getPath(state, t.dataset.copyBind) || '')).then(() => toast(UI.copied), () => toast(UI.copyFail)); }
      else if (t.dataset.move) moveSection(t.dataset.move, Number(t.dataset.dir));
      else if (t.dataset.resetSec) { const id = t.dataset.resetSec; state.s17.edited[id] = false; state.s17.text[id] = ''; renderComposer(); afterSections(); toast(UI.sectionReset); }
      else if (t.dataset.mxAct === 'add') mxAdd(t.dataset.name, t.closest('[data-mx]'));
      else if (t.dataset.mxAct === 'csv' || t.dataset.mxAct === 'json') mxExport(t.dataset.name, t.dataset.mxAct);
      else if (t.dataset.mxMove) { const [n, id, d] = t.dataset.mxMove.split(':'), a = state.mx[n], i = a.findIndex((x) => x.id === id), j = i + Number(d); if (i < 0 || j < 0 || j >= a.length) return; const x = a[i]; a[i] = a[j]; a[j] = x; openRows.add(id); renderAllMx(); renderAlign(); renderPreview(); autoDrafts(); onChange(); }
      else if (t.dataset.mxDel) {
        if (t.dataset.armed !== '1') { const o = t.textContent; t.dataset.armed = '1'; t.textContent = UI.confirmDel; setTimeout(() => { if (t.isConnected) { t.dataset.armed = ''; t.textContent = o; } }, 4000); return; }
        const [n, id] = t.dataset.mxDel.split(':'); state.mx[n] = state.mx[n].filter((x) => x.id !== id);
        if (n === 'findings') MXN.forEach((m) => state.mx[m].forEach((r) => { RC.mx[m].cols.forEach((c) => { if (c.type === 'finding' && r[c.k] === id) r[c.k] = ''; }); }));
        renderAllMx(); renderAlign(); renderPreview(); redrawViz(); autoDrafts(); onChange();
      }
      else if (t.dataset.vzAct === 'add') { state.viz.rows.push({ id: uid(), label: '', value: '' }); renderViz(); onChange(); const b = t.closest('[data-viz]'); const n = b && $$('.vz-row', b).pop(); if (n) n.querySelector('input').focus(); }
      else if (t.dataset.vzAct === 'themes') { const th = state.mx.themes.filter((x) => filled(x.name)); if (!th.length) { toast(UI.vzNoThemes); return; } state.viz.rows = th.map((x) => ({ id: uid(), label: x.name, value: String((String(x.prev || '').match(/[0-9٠-٩]+/) || [''])[0]).replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)) })); state.viz.qual = true; renderViz(); onChange(); toast(UI.vzFromThemesDone); }
      else if (t.dataset.vzAct === 'svg') download(UI.files.chart + '.svg', [chartSVG()], 'image/svg+xml');
      else if (t.dataset.vzAct === 'tsvg') download(UI.files.themeMap + '.svg', [themeSVG()], 'image/svg+xml');
      else if (t.dataset.vzDel) { state.viz.rows = state.viz.rows.filter((r) => r.id !== t.dataset.vzDel); renderViz(); onChange(); }
      else if (t.dataset.gotoStep) { e.preventDefault(); goTo(Math.min(Number(t.dataset.gotoStep), state.maxStep + 1), true); }
      else if (t.dataset.useTool) { const src = $('#' + t.dataset.useTool); if (src) { const m = $('#lc-mode'); src.value = (m && m.value === 'discussion') ? state.s17.draft : state.s8.draft; src.dispatchEvent(new Event('input', { bubbles: true })); } }
    });
  }
  function refreshFit() {
    const rec = E.recommended(state, RC);
    $$('[data-fit]').forEach((n) => { n.hidden = n.dataset.fit !== rec; });
    $$('[data-recommend]').forEach((n) => { const t = RC.techniques.find((x) => x.id === state.s1.technique); n.textContent = t ? UI.recommend(t.t, label(RC.structures, rec)) : UI.recommendNone; });
    $$('[data-show-qual]').forEach((n) => { n.hidden = state.s1.approach === 'quant'; });
  }
  function fillInputs() {
    $$('[data-bind]').forEach((inp) => { const v = getPath(state, inp.dataset.bind); inp.value = v == null ? '' : v; });
    $$('input[data-multi]').forEach((i) => { i.checked = getPath(state, i.dataset.multi).indexOf(i.value) !== -1; });
    $$('input[data-rub]').forEach((i) => { i.checked = state.s18.scores[i.dataset.rub] === Number(i.value); });
    renderAllMx(); renderAlign(); renderPreview(); renderViz(); renderComposer(); refreshFit();
  }

  /* ---------------- Validation ---------------- */
  const fieldOf = (n) => n.closest('.field, fieldset, .choice-group') || n.parentElement;
  function setErr(n, m) { const f = fieldOf(n), i = f.querySelector('.inp'); if (i) i.setAttribute('aria-invalid', 'true'); const e = f.querySelector('.err'); if (e) e.textContent = m; }
  function clearErr(n) { const f = fieldOf(n); if (!f) return; const i = f.querySelector('.inp'); if (i) i.removeAttribute('aria-invalid'); const e = f.querySelector('.err'); if (e) e.textContent = ''; }
  const rowsOk = (n, req) => state.mx[n].filter((r) => req.every((c) => filled(r[c]))).length;
  const RULES = { 2: ['err-ev', () => rowsOk('evidence', ['content']) >= 3, () => UI.needRows(num(3), RC.mx.evidence.t)], 3: ['err-f', () => rowsOk('findings', ['statement']) >= 2, () => UI.needRows(num(2), RC.mx.findings.t)],
    4: ['err-al', () => { const qs = E.questions(state); return qs.length && qs.every((q) => filled((state.al[q.i] || {}).coverage)); }, () => UI.needCoverage],
    7: ['err-fd', () => filled(state.s8.draft), () => UI.needDraft], 8: ['err-dp', () => rowsOk('dplan', ['finding']) >= 1, () => UI.needRows(num(1), RC.mx.dplan.t)], 9: ['err-ip', () => rowsOk('interp', ['finding', 'meaning']) >= 1, () => UI.needRows(num(1), RC.mx.interp.t)],
    10: ['err-thy', () => rowsOk('theory', ['finding', 'rel']) >= 1, () => UI.needRows(num(1), RC.mx.theory.t)], 11: ['err-lit', () => rowsOk('lit', ['study']) >= 1, () => UI.needRows(num(1), RC.mx.lit.t)],
    13: ['err-im', () => rowsOk('impl', ['impl']) >= 1, () => UI.needRows(num(1), RC.mx.impl.t)], 14: ['err-li', () => rowsOk('lim', ['desc']) >= 1, () => UI.needRows(num(1), RC.mx.lim.t)], 15: ['err-fu', () => rowsOk('future', ['rec']) >= 1, () => UI.needRows(num(1), RC.mx.future.t)],
    16: ['err-dd', () => filled(state.s17.draft), () => UI.needDraft] };
  function validateStep(i, show) {
    const el = $('.step[data-step="' + i + '"]'); if (!el) return true;
    let ok = true, first = null;
    const fail = (n, m) => { ok = false; if (show && n) { if (n.classList.contains('err')) n.textContent = m; else setErr(n, m); if (!first) first = n; } };
    $$('[data-required]', el).forEach((inp) => { if (inp.closest('[hidden]')) return; const v = getPath(state, inp.dataset.bind), min = Number(inp.dataset.minwords || 0); if (!filled(v)) fail(inp, UI.required); else if (min && E.wc(v) < min) fail(inp, UI.tooShort(num(min))); else if (show) clearErr(inp); });
    $$('[data-required-pick]', el).forEach((g) => { if (!getPath(state, g.dataset.requiredPick)) fail(g, UI.chooseOne); });
    const R = RULES[i]; if (R) { const n = $('#' + R[0]); if (!R[1]()) fail(n, R[2]()); else if (show && n) n.textContent = ''; }
    if (show) { $('#form-alert').hidden = ok; if (!ok) { $('#form-alert').textContent = UI.fixErrors; const f = first && (first.matches('.inp, textarea, input, select') ? first : (first.querySelector && first.querySelector('input, button, textarea, select'))) || $('#form-alert'); if (f && f.focus) f.focus(); } }
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
    if (i === 4) renderAlign();
    if (i === 5) renderPreview();
    if (i === 6) renderViz();
    if (i === 7 && (!state.s8.draftEdited || !filled(state.s8.draft))) rebuildFindings();
    if (i === 10 && !filled(state.s11.framework) && filled(state.s1.framework)) { state.s11.framework = state.s1.framework; syncBound('s11.framework'); }
    if (i === 16) { renderComposer(); if (!state.s17.draftEdited || !filled(state.s17.draft)) rebuildDiscussion(); }
    if (i === 18) { if (!filled(state.s19.findings)) { state.s19.findings = state.s8.draft; syncBound('s19.findings'); } if (!filled(state.s19.discussion)) { state.s19.discussion = state.s17.draft; syncBound('s19.discussion'); } renderReport(false); }
    renderStepper(); refresh();
    if (focus) { const h = $('.step[data-step="' + i + '"] h3'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); $('#builder').scrollIntoView({ block: 'start' }); } }
    save();
  }
  function renderStepper() {
    const box = $('#stepper'); box.innerHTML = '';
    RC.steps.forEach((t, i) => {
      if (i === 0 || RC.moduleOf[i] !== RC.moduleOf[i - 1]) { const m = document.createElement('span'); m.className = 'stepper-module'; m.textContent = RC.modulesShort[RC.moduleOf[i]]; box.appendChild(m); }
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

  /* ---------------- Outputs and diagnostics ---------------- */
  function refreshOutputs() {
    const set = (id, txt) => { const n = $('#' + id); if (n) n.textContent = loc(txt); };
    set('out-0', RC.tpl.profile(state, E)); set('out-1', RC.tpl.plan(state));
    set('out-8', RC.tpl.outline(state, E.ctx(state)));
    $$('[data-expect]').forEach((n) => { const s = RC.structures.find((x) => x.id === state.s2.structure); n.innerHTML = s ? '<h4 class="h4">' + esc(UI.expectTitle(s.t)) + '</h4><ul class="list small">' + s.expect.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '<p class="hint">' + esc(UI.expectNone) + '</p>'; });
    $$('[data-ftpl]').forEach((n) => { const s = state.s2.structure || 'thematic', T = RC.fTemplates[s]; n.innerHTML = '<p class="small"><strong>' + esc(label(RC.structures, s)) + '</strong></p><ul class="list small">' + T.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul>'; });
    $$('[data-pub-note]').forEach((n) => { n.textContent = state.s2.pub ? label(RC.pubOptions.map((p) => ({ id: p.id, t: p.t + ' — ' + p.d })), state.s2.pub) : UI.pubNone; });
  }
  const DIAGS = { struct: E.structChecks, evidence: E.evidenceChecks, themes: E.themeChecks, findings: E.findingChecks, align: E.alignChecks, integrate: E.integrateChecks, viz: E.vizChecks, dplan: E.dplanChecks, interp: E.interpChecks, theory: E.theoryChecks, lit: E.litChecks, unexp: E.unexpChecks, impl: E.implChecks, lim: E.limChecks, future: E.futureChecks };
  function stepDiag() {
    Object.keys(DIAGS).forEach((k) => { const n = $$('[data-diag="' + k + '"]'); if (n.length) { const h = diagList(DIAGS[k](state, RC)); n.forEach((x) => { x.innerHTML = h; }); } });
    $$('[data-diag="fdraft"]').forEach((n) => { n.innerHTML = filled(state.s8.draft) ? diagList(E.textCheck(state.s8.draft, RC, state, 'findings')) : '<p class="hint">' + esc(UI.needDraft) + '</p>'; });
    $$('[data-diag="ddraft"]').forEach((n) => { n.innerHTML = filled(state.s17.draft) ? diagList(E.textCheck(state.s17.draft, RC, state, 'discussion')) : '<p class="hint">' + esc(UI.needDraft) + '</p>'; });
  }
  function renderChecker() {
    const box = $('#checker'); if (!box) return;
    const list = E.checks(state, RC), order = { bad: 0, warn: 1, info: 2, ok: 3 }; list.sort((a, b) => order[a.s] - order[b.s]);
    box.innerHTML = list.map((c) => { const m = msg(c); return diagItem(RC.areaNames[c.area] + ' — ' + m.t, c.s, m.d); }).join('');
    $('#checker-summary').textContent = ['bad', 'warn', 'ok'].map((k) => RC.statusLabel[k] + ': ' + num(list.filter((c) => c.s === k).length)).join(' · ');
  }
  function scoreSummary() { const sc = state.s18.scores, rated = RC.rubric.filter((c) => sc[c.id]); const mean = rated.length ? rated.reduce((a, c) => a + sc[c.id], 0) / rated.length : 0; return { sc, rated, mean, lvl: RC.levels.find((l) => mean >= l.min) || RC.levels[RC.levels.length - 1] }; }
  function renderResult() {
    const box = $('#rubric-result'); if (!box) return;
    const { sc, rated, mean, lvl } = scoreSummary(), recs = RC.rubric.filter((c) => sc[c.id] && sc[c.id] <= 3).map((c) => '<li><strong>' + esc(c.t) + ':</strong> ' + esc(RC.rubricRec[c.id]) + '</li>');
    box.innerHTML = '<span class="small" style="color:#BDB6A4">' + esc(UI.overall) + '</span><span class="big">' + (rated.length ? fmt1(mean) : '—') + ' <span style="font-size:22px">' + esc(UI.outOf5) + '</span></span>' + (rated.length ? '<span class="lvl">' + esc(lvl.t) + '</span><span class="small">' + esc(lvl.d) + '</span>' : '') +
      '<div class="bars">' + RC.rubric.map((c) => '<div class="bar-row"><span>' + esc(c.t) + '</span><span class="bar" aria-hidden="true"><span style="width:' + ((sc[c.id] || 0) * 20) + '%"></span></span><span>' + (sc[c.id] ? RC.numerals[sc[c.id] - 1] : '—') + '</span></div>').join('') + '</div>' +
      (rated.length ? '<div><strong style="color:var(--gold-light)">' + esc(UI.recommendations) + '</strong>' + (recs.length ? '<ul class="list small">' + recs.join('') + '</ul>' : '<p class="small">' + esc(UI.noRecs) + '</p>') + '</div>' : '<p class="small">' + esc(UI.notRated) + '</p>');
  }

  /* ---------------- Step 19: report ---------------- */
  function buildReportHTML() {
    const R = UI.report, s = state, X = E.ctx(s);
    const p = (x) => '<p>' + esc(filled(x) ? loc(x) : UI.empty) + '</p>', pre = (x) => '<p style="white-space:pre-line">' + esc(filled(x) ? x : UI.empty) + '</p>';
    const tbl = (cols, rows) => rows.length ? '<table><thead><tr>' + cols.map((c) => '<th>' + esc(c) + '</th>').join('') + '</tr></thead><tbody>' + rows.map((r) => '<tr>' + r.map((c) => '<td>' + esc(loc(c)) + '</td>').join('') + '</tr>').join('') + '</tbody></table>' : p('');
    const mxTable = (name, keys, req) => { const S = RC.mx[name], cols = keys.map((k) => S.cols.find((c) => c.k === k)); return tbl(cols.map((c) => c.t), s.mx[name].filter((r) => req.every((k) => filled(r[k]))).map((r) => cols.map((c) => { const v = r[c.k]; if (c.type === 'finding') return E.fName(s, v); if (c.type === 'rq') return E.qCode(s, v); if (c.type === 'sel') return label(c.opts, v); if (c.type === 'multi') return v.map((x) => label(c.opts, x)).join(RC.sep); return v || ''; }))); };
    const { sc, rated, mean, lvl } = scoreSummary(), date = new Date().toLocaleDateString(AR ? 'ar-SA' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
    const img = (svg, alt) => '<p><img class="map-img" alt="' + attr(alt) + '" src="data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg) + '"></p>';
    let h = '<h2>' + esc(R.title) + '</h2><p class="meta">' + esc(R.generated(date)) + '</p>';
    h += '<h3>' + esc(R.context) + '</h3><p><strong>' + esc(s.s1.title || UI.empty) + '</strong></p><p style="white-space:pre-line">' + esc(loc(RC.tpl.profile(s, E))) + '</p>';
    h += '<h3>' + esc(R.questions) + '</h3>' + (X.questions.length ? '<ul>' + X.questions.map((q) => '<li>' + esc(loc(q.code) + ': ' + q.text) + '</li>').join('') + '</ul>' : p(''));
    h += '<h3>' + esc(R.structure) + '</h3>' + p(RC.tpl.plan(s));
    h += '<h3>' + esc(R.findings) + '</h3>' + mxTable('findings', ['label', 'statement', 'basis', 'rq'], ['statement']);
    if (s.mx.themes.some((t) => filled(t.name))) h += '<h3>' + esc(R.themes) + '</h3>' + mxTable('themes', ['name', 'def', 'subs', 'rq', 'prev'], ['name']);
    h += '<h3>' + esc(R.evidence) + '</h3>' + mxTable('evidence', ['code', 'type', 'content', 'source', 'loc', 'finding'], ['content']);
    if (s.mx.av.some((a) => filled(a.observation))) h += '<h3>' + esc(R.av) + '</h3>' + mxTable('av', ['title', 'episode', 'time', 'element', 'observation', 'finding'], ['observation']);
    h += '<h3>' + esc(R.alignment) + '</h3>' + tbl(UI.fmCols, X.questions.map((q) => { const fs = E.fFor(s, q.i); return [q.code + ' ' + q.text, fs.map((f) => E.fName(s, f.id)).join(' | ') || '—', fs.map((f) => label(RC.mx.findings.cols.find((c) => c.k === 'basis').opts, f.basis)).filter(filled).join(RC.sep) || '—', String(fs.reduce((n, f) => n + E.evCount(s, f.id), 0)), label(RC.coverage, (s.al[q.i] || {}).coverage) + (filled((s.al[q.i] || {}).note) ? ' — ' + s.al[q.i].note : '')]; }));
    if (chartData().length) h += '<h3>' + esc(R.viz) + '</h3>' + img(chartSVG(), s.viz.title || UI.vzChart) + (s.viz.qual ? p(UI.vzQualNote) : '');
    if (s.mx.themes.some((t) => filled(t.name))) h += img(themeSVG(), UI.vzThemes);
    if (s.mx.joint.some((x) => filled(x.dim))) h += '<h3>' + esc(R.joint) + '</h3>' + mxTable('joint', ['dim', 'quant', 'qual', 'fit', 'meta'], ['dim']);
    h += '<h3>' + esc(R.fdraft) + '</h3>' + pre(s.s8.draft);
    h += '<h3>' + esc(R.dplan) + '</h3>' + pre(loc(RC.tpl.outline(s, X)));
    h += '<h3>' + esc(R.interp) + '</h3>' + mxTable('interp', ['finding', 'meaning', 'evidence', 'alt'], ['finding', 'meaning']);
    h += '<h3>' + esc(R.theory) + '</h3>' + (filled(s.s11.framework) ? p(s.s11.framework) : '') + mxTable('theory', ['finding', 'concept', 'rel', 'implication'], ['finding', 'rel']);
    h += '<h3>' + esc(R.lit) + '</h3>' + mxTable('lit', ['finding', 'study', 'prev', 'rel', 'explain'], ['study']);
    if (s.mx.unexp.some((x) => filled(x.desc))) h += '<h3>' + esc(R.unexp) + '</h3>' + mxTable('unexp', ['type', 'desc', 'explain'], ['desc']);
    h += '<h3>' + esc(R.impl) + '</h3>' + mxTable('impl', ['type', 'finding', 'impl'], ['impl']);
    h += '<h3>' + esc(R.lim) + '</h3>' + mxTable('lim', ['type', 'desc', 'effect', 'mitigation'], ['desc']);
    h += '<h3>' + esc(R.future) + '</h3>' + mxTable('future', ['from', 'basis', 'rec'], ['rec']);
    h += '<h3>' + esc(R.ddraft) + '</h3>' + pre(s.s17.draft);
    h += '<h3>' + esc(R.evaluation) + '</h3>' + (rated.length ? '<ul>' + RC.rubric.map((cr) => '<li>' + esc(cr.t) + ': ' + (sc[cr.id] ? RC.numerals[sc[cr.id] - 1] + ' ' + esc(UI.outOf5) : esc(UI.notRated)) + '</li>').join('') + '</ul><p><strong>' + esc(UI.overall) + ':</strong> ' + esc(fmt1(mean)) + ' ' + esc(UI.outOf5) + ' — ' + esc(lvl.t) + '</p>' : p(UI.notRated)) + (filled(s.s18.self) ? '<p><strong>' + esc(R.self) + ':</strong> ' + esc(s.s18.self) + '</p>' : '') + '<p><em>' + esc(UI.evalDisclaimer) + '</em></p>';
    const recs = []; RC.rubric.forEach((cr) => { if (sc[cr.id] && sc[cr.id] <= 3) recs.push(cr.t + ': ' + RC.rubricRec[cr.id]); }); E.checks(s, RC).forEach((x) => { if (x.s === 'bad' || x.s === 'warn') { const m = msg(x); recs.push(RC.areaNames[x.area] + ' — ' + m.t + ': ' + loc(m.d)); } });
    h += '<h3>' + esc(R.recs) + '</h3>' + (recs.length ? '<ul>' + [...new Set(recs)].map((r) => '<li>' + esc(r) + '</li>').join('') + '</ul>' : p(R.noRecs));
    h += '<h3>' + esc(R.finalF) + '</h3>' + pre(s.s19.findings) + '<h3>' + esc(R.finalD) + '</h3>' + pre(s.s19.discussion);
    const seen = {}, refs = [];
    E.lines(s.s19.refs).concat(s.mx.lit.map((r) => r.ref)).filter(filled).forEach((r) => { const k = E.norm(r, RC.lang); if (!seen[k]) { seen[k] = 1; refs.push(r.trim()); } });
    h += '<h3>' + esc(R.refs) + '</h3>' + (refs.length ? '<ul>' + refs.sort((a, b) => a.localeCompare(b)).map((r) => '<li>' + esc(r) + '</li>').join('') + '</ul>' : p(R.noRefs));
    if (filled(s.s19.notes)) h += '<h3>' + esc(R.notes) + '</h3>' + pre(s.s19.notes);
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
  function confirmClick(b, lbl, action, need) {
    if (!b) return;
    b.addEventListener('click', (e) => { e.stopPropagation(); const orig = b.dataset.label || b.textContent; b.dataset.label = orig; if (b.dataset.armed === '1') { b.dataset.armed = ''; b.textContent = orig; action(); return; } if (need && !need()) { action(); return; } b.dataset.armed = '1'; b.textContent = lbl; setTimeout(() => { b.dataset.armed = ''; b.textContent = orig; }, 4000); });
  }

  /* ---------------- Sections outside the Builder ---------------- */
  function renderTextTool() { const ta = $('#lc-text'), out = $('#lc-out'), m = $('#lc-mode'); if (!ta || !out) return; out.innerHTML = filled(ta.value) ? diagList(E.textCheck(ta.value, RC, state, m ? m.value : 'findings')) : ''; }
  function renderClassifier() {
    const ta = $('#cl-text'), out = $('#cl-out'); if (!ta || !out) return;
    const r = filled(ta.value) ? E.classify(ta.value, RC) : [];
    out.innerHTML = r.length ? '<p class="small">' + esc(UI.clSummary(num(r.filter((x) => x.kind === 'results').length), num(r.filter((x) => x.kind === 'discussion').length), num(r.filter((x) => x.kind === 'unclear').length))) + '</p><ol class="cl-list">' + r.map((x) => '<li class="cl-' + x.kind + '"><span class="tag">' + esc(RC.clKinds[x.kind]) + '</span> <span dir="auto">' + esc(x.s) + '</span></li>').join('') + '</ol>' : '';
  }
  function renderGuides() {
    const set = (sel, html) => { $$(sel).forEach((n) => { n.innerHTML = html; }); };
    set('#struct-cards', RC.structures.map((s) => '<article class="card"><h3>' + esc(s.t) + '</h3><p class="small">' + esc(s.d) + '</p><ul class="list small">' + s.expect.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul></article>').join(''));
    set('#pub-cards', RC.pubOptions.map((s) => '<article class="card"><h3>' + esc(s.t) + '</h3><p class="small">' + esc(s.d) + '</p><p class="small"><strong>' + esc(UI.whenUse) + '</strong> ' + esc(s.when) + '</p></article>').join(''));
    set('#dist-table, [data-dist]', table(UI.distCols, RC.distinctions));
    set('#tense-table', table(UI.tenseCols, RC.tense));
    set('#ftpl-cards', RC.structures.map((s) => '<article class="card"><h3>' + esc(s.t) + '</h3><ul class="list small">' + RC.fTemplates[s.id].map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul></article>').join(''));
    set('#dtpl-cards', DSEC.map((id) => '<article class="card"><h3>' + esc(RC.dNames[id]) + '</h3><ul class="list small">' + RC.dTemplates[id].map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul></article>').join(''));
    set('#weak-strong', cmpBox(RC.weakStrong.weak, RC.weakStrong.strong));
    set('#mistakes', RC.mistakes.map((m) => '<article class="card"><h3>' + esc(m.t) + '</h3><p>' + esc(m.d) + '</p><p class="small"><strong>' + esc(UI.fix) + '</strong> ' + esc(m.fix) + '</p></article>').join(''));
    set('[data-rel-cards], #rel-cards', RC.mx.theory.cols.find((c) => c.k === 'rel').opts.map((o) => '<article class="card"><h3>' + esc(o.t) + '</h3><p class="small">' + esc(RC.relDesc[o.id]) + '</p></article>').join(''));
    set('#lit-bank', RC.mx.lit.cols.find((c) => c.k === 'rel').opts.map((o) => '<article class="card"><h3>' + esc(o.t) + '</h3><ul class="list small">' + RC.litPhrases[o.id].map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul></article>').join(''));
    set('#impl-cards', RC.mx.impl.cols.find((c) => c.k === 'type').opts.map((o) => '<article class="card"><h3>' + esc(o.t) + '</h3><p class="small">' + esc(RC.implDesc[o.id]) + '</p></article>').join(''));
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
    list.innerHTML = RC.examples.map((e) => '<article class="ex-card" data-area="' + attr(e.area) + '"><div class="tags"><span class="tag">' + esc(e.area) + '</span><span class="tag">' + esc(e.approach) + '</span><span class="tag tag-illustrative">' + esc(UI.exHyp) + '</span></div><h3 class="ex-title">' + esc(e.title) + '</h3><div class="moves">' + row(UI.exFinding, e.finding) + row(UI.exEvidence, e.evidence) + row(UI.exDiscussion, e.discussion) + '</div><p class="why small"><strong>' + esc(UI.whyWorks) + '</strong> ' + esc(e.why) + '</p></article>').join('');
    pub.innerHTML = RC.published.map((e) => '<article class="ex-card ex-pub" data-area="' + attr(e.area) + '"><div class="tags"><span class="tag">' + esc(e.area) + '</span><span class="tag tag-evidence">' + esc(UI.exPub) + '</span></div><p class="pub-title" lang="en" dir="ltr">' + linkify(e.ref) + '</p><p class="why small"><strong>' + esc(UI.lesson) + '</strong> ' + esc(e.lesson) + '</p></article>').join('');
  }
  function renderGlossary() {
    const body = $('#gloss-body'); if (!body) return;
    const head = $('#gloss-head'); if (head) head.innerHTML = '<tr>' + UI.glossCols.map((c) => '<th scope="col">' + esc(c) + '</th>').join('') + '</tr>';
    body.innerHTML = (window.RFD_GLOSSARY || []).map((g) => { const cols = AR ? [['ar', g.ar], ['en', g.en], ['ar', g.defAr], ['en', g.defEn]] : [['en', g.en], ['ar', g.ar], ['en', g.defEn], ['ar', g.defAr]]; return '<tr data-search="' + attr(E.norm([g.ar, g.en, g.defAr, g.defEn].join(' '), 'ar')) + '">' + cols.map((c) => '<td lang="' + c[0] + '" dir="' + (c[0] === 'ar' ? 'rtl' : 'ltr') + '">' + esc(c[1]) + '</td>').join('') + '</tr>'; }).join('');
  }
  function filterGlossary() { const q = E.norm($('#gloss-search').value, 'ar'); let shown = 0; $$('#gloss-body tr').forEach((tr) => { const ok = !q || tr.dataset.search.indexOf(q) !== -1; tr.hidden = !ok; if (ok) shown++; }); $('#gloss-empty').hidden = shown !== 0; }
  function renderRefs() {
    const box = $('#refs-list'); if (!box) return;
    box.innerHTML = (window.RFD_REFS || []).map((g) => '<div class="ref-group"><h3>' + esc(UI.refGroups[g.id]) + '</h3><ol>' + g.items.map((r) => '<li lang="en" dir="ltr">' + linkify(r.text) + ' <span class="tag ref-type" lang="' + RC.lang + '" dir="' + (AR ? 'rtl' : 'ltr') + '">' + esc(UI.refTypes[r.type]) + '</span></li>').join('') + '</ol></div>').join('');
  }

  /* ---------------- Refresh ---------------- */
  function refresh() {
    $$('[data-pick]').forEach((b) => b.setAttribute('aria-pressed', getPath(state, b.dataset.pick) === b.dataset.id ? 'true' : 'false'));
    $$('label.chk').forEach((l) => { const i = $('input', l); if (i) l.classList.toggle('on', i.checked); });
    refreshOutputs(); stepDiag();
    if (state.step === 16) state.s17.order.forEach((id) => { const n = $('#sec-' + id); if (n && document.activeElement !== n && !state.s17.edited[id]) n.value = E.dSectionText(id, state, RC); });
    $$('[data-wc]').forEach((n) => { n.textContent = UI.words(num(E.wc(getPath(state, n.dataset.wc)))); });
    if (state.step >= 17) {
      renderChecker();
      const sug = E.suggestScores(state, RC); RC.rubric.forEach((c) => { const n = $('[data-suggest="' + c.id + '"]'); if (n) n.textContent = UI.suggestedScore + ' ' + RC.numerals[sug[c.id] - 1]; });
      renderResult();
    }
    $$('[data-checklist-progress]').forEach((n) => { n.textContent = UI.checklistDone(num(state.s18.checks.length), num(RC.checklist.length)); });
  }
  let raf = null;
  function onChange() { suppressSave = false; save(); if (raf) cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { refresh(); stepperStatus(); }); }

  /* ---------------- Controls ---------------- */
  function wire() {
    $('#btn-next').addEventListener('click', () => { if (validateStep(state.step, true)) goTo(state.step + 1, true); });
    $('#btn-prev').addEventListener('click', () => goTo(state.step - 1, true));
    confirmClick($('#btn-rebuild-f'), UI.rebuildConfirm, () => { rebuildFindings(); onChange(); toast(UI.rebuilt); }, () => state.s8.draftEdited);
    confirmClick($('#btn-rebuild-d'), UI.rebuildConfirm, () => { rebuildDiscussion(); onChange(); toast(UI.rebuilt); }, () => state.s17.draftEdited);
    $('#btn-apply-scores').addEventListener('click', () => { state.s18.scores = E.suggestScores(state, RC); $$('input[data-rub]').forEach((i) => { i.checked = state.s18.scores[i.dataset.rub] === Number(i.value); }); onChange(); toast(UI.scoresApplied); });
    confirmClick($('#btn-final-from-draft'), UI.replaceConfirm, () => { state.s19.findings = state.s8.draft; state.s19.discussion = state.s17.draft; syncBound('s19.findings'); syncBound('s19.discussion'); onChange(); toast(UI.finalCopied); }, () => (filled(state.s19.findings) && state.s19.findings !== state.s8.draft) || (filled(state.s19.discussion) && state.s19.discussion !== state.s17.draft));
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
    $('#btn-csv-all').addEventListener('click', () => { const parts = ['﻿']; MXN.forEach((n) => { if (!state.mx[n].length) return; parts.push('# ' + RC.mx[n].t + '\r\n', E.toCSV(state.mx[n].map((r) => outRow(n, r)), RC.mx[n].cols.map((c) => c.k)) + '\r\n\r\n'); }); download(UI.files.all + '.csv', parts, 'text/csv;charset=utf-8'); });
    $$('[data-action="delete"]').forEach((b) => confirmClick(b, UI.deleteAll, () => {
      try { localStorage.removeItem(STORE_KEY); } catch (e) { /* ignore */ }
      suppressSave = true; clearTimeout(saveTimer); state = defaults(); openRows.clear(); fillInputs(); goTo(0, false); updateSaveStatus();
      try { localStorage.removeItem(STORE_KEY); } catch (e) { /* ignore */ }
      toast(UI.deleted);
    }));
    $$('[data-action="export"]').forEach((b) => b.addEventListener('click', () => download(UI.fileData, [JSON.stringify(state, null, 2)], 'application/json')));
    const fi = $('#file-import');
    if (fi) fi.addEventListener('change', () => {
      const f = fi.files[0]; if (!f) return; const rd = new FileReader();
      rd.onload = () => { try { const data = JSON.parse(rd.result); if (!data || data.v !== 1 || data.app !== 'rfind' || !data.s1 || !data.mx) throw new Error('bad'); state = merge(defaults(), data); suppressSave = false; fillInputs(); goTo(state.step, false); save(true); toast(UI.projectImported); } catch (e) { toast(UI.projectImportFail); } fi.value = ''; };
      rd.readAsText(f);
    });
    const lm = $('#lc-mode'); if (lm) lm.addEventListener('change', renderTextTool);
    $$('[data-lang-switch]').forEach((a) => a.addEventListener('click', () => { save(true); try { localStorage.setItem(LANG_KEY, a.dataset.langSwitch); } catch (e) { /* ignore */ } a.href = a.getAttribute('href').split('#')[0] + (location.hash || ''); }));
    window.addEventListener('beforeunload', () => save(true));
  }

  /* ---------------- Boot ---------------- */
  load();
  renderBuilder(); renderChecklists(); renderGuides(); renderExamples(); renderGlossary(); renderRefs();
  bind(); fillInputs(); wire();
  const m = /^#step-(\d+)$/.exec(location.hash);
  goTo(m ? Math.min(Number(m[1]) - 1, state.maxStep) : state.step, !!m);
  updateSaveStatus();
})();
