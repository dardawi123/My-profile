/* =========================================================
   Literature Review in Film and Television Studies — application logic
   مراجعة الأدبيات البحثية السابقة — منطق التطبيق

   Language-neutral. Wording comes from window.RC (litreview-ar.js or
   litreview-en.js); rules from window.LRE (engine.js); shared data from
   glossary.js and references.js. Data stays in this browser
   (localStorage); nothing is sent to a server.
   Academic tool developed by Dr. Merfat Alardawi | د. مرفت العرضاوي
   ========================================================= */
(function () {
  'use strict';
  const RC = window.RC, E = window.LRE;
  if (!RC || !E) { console.error('LRF: required scripts are missing.'); return; }
  const UI = RC.ui;
  const STORE_KEY = 'lrf.data.v1', LANG_KEY = 'lrf.lang', STEPS = 10;
  const AR = RC.lang === 'ar';

  /* ---------------- State ---------------- */
  function defaults() {
    return {
      v: 1, step: 0, maxStep: 0, savedAt: null,
      s1: { topic: '', problem: '', question: '', objectives: '', theory: '', context: '', population: '', period: '', approaches: [], reviewType: '' },
      s2: { concepts: [{ en: '', ar: '' }, { en: '', ar: '' }], dbs: [], yearFrom: '', yearTo: '', langs: [], types: [], exclude: '', notes: '' },
      s3: { include: '', exclude: '', identified: '', duplicates: '', titleExcluded: '' },
      studies: [],
      s5: { current: '' },
      s6: { themes: [] },
      s7: { gaps: [] },
      s8: { structure: '', outline: { intro: '', themes: '', debates: '', methods: '', critical: '', limits: '', gaps: '', conclusion: '' } },
      s9: { limits: '', draft: '', draftText: '', edited: false },
      s10: { scores: {} },
      report: { html: '', edited: false },
      ui: { sort: 'year', filter: '', status: '', cols: 'compact', compare: ['theory', 'approach', 'findings'] }
    };
  }
  const STUDY_KEYS = RC.studyFields.map((f) => f.id).concat(['id', 'status', 'reason', 'practice']);
  function cleanStudy(s) {
    const o = { appraisal: { kind: 'empirical', r: {}, notes: '' } };
    STUDY_KEYS.forEach((k) => { o[k] = typeof s[k] === 'string' ? s[k] : (k === 'practice' ? !!s[k] : ''); });
    if (!o.id) o.id = uid();
    if (['included', 'excluded', 'maybe'].indexOf(o.status) === -1) o.status = 'included';
    if (s.appraisal && typeof s.appraisal === 'object') {
      o.appraisal.kind = s.appraisal.kind === 'textual' ? 'textual' : 'empirical';
      o.appraisal.notes = typeof s.appraisal.notes === 'string' ? s.appraisal.notes : '';
      Object.keys(s.appraisal.r || {}).forEach((k) => { if (/^c\d+$/.test(k) && ['yes', 'partly', 'no', 'na'].indexOf(s.appraisal.r[k]) !== -1) o.appraisal.r[k] = s.appraisal.r[k]; });
    }
    return o;
  }
  const strArr = (a) => Array.isArray(a) ? a.filter((x) => typeof x === 'string') : [];
  function merge(base, src) {
    if (!src || typeof src !== 'object') return base;
    Object.keys(base).forEach((k) => {
      if (!(k in src)) return;
      const b = base[k], s = src[k];
      if (k === 'studies') base[k] = Array.isArray(s) ? s.filter((x) => x && typeof x === 'object').slice(0, 300).map(cleanStudy) : [];
      else if (k === 'concepts') base[k] = Array.isArray(s) && s.length ? s.slice(0, 6).map((c) => ({ en: String((c && c.en) || ''), ar: String((c && c.ar) || '') })) : b;
      else if (k === 'themes') base[k] = Array.isArray(s) ? s.slice(0, 20).map((t) => ({ id: String(t.id || uid()), name: String(t.name || ''), desc: String(t.desc || ''), agree: String(t.agree || ''), contra: String(t.contra || ''), studies: strArr(t.studies) })) : [];
      else if (k === 'gaps') base[k] = Array.isArray(s) ? s.slice(0, 20).map((g) => ({ id: String(g.id || uid()), type: String(g.type || 'empirical'), statement: String(g.statement || ''), evidence: strArr(g.evidence) })) : [];
      else if (k === 'scores') { if (s && typeof s === 'object') Object.keys(s).forEach((x) => { if (typeof s[x] === 'number') b[x] = s[x]; }); }
      else if (Array.isArray(b)) base[k] = strArr(s);
      else if (b && typeof b === 'object') base[k] = merge(b, s);
      else if (typeof s === typeof b || b === null) base[k] = s;
    });
    return base;
  }
  function uid() { return 'x' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  let state = defaults();

  /* ---------------- Helpers ---------------- */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const isolate = (s) => AR ? s.replace(/\(([A-Za-zÀ-ſ][^()]*?\d{4}[a-z]?)\)/g, '⁨($1)⁩') : s;
  const esc = (s) => isolate(String(s == null ? '' : s)).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const attr = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const getPath = (o, p) => p.split('.').reduce((a, k) => (a == null ? a : a[k]), o);
  const setPath = (o, p, v) => { const ks = p.split('.'); const last = ks.pop(); ks.reduce((a, k) => a[k], o)[last] = v; };
  const filled = (x) => !!(x && String(x).trim());
  const num = (n) => AR ? String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]) : String(n);
  const fmt1 = (n) => AR ? num(n.toFixed(1)).replace('.', '٫') : n.toFixed(1);
  const icon = (st) => ({ ok: '✓', warn: '!', bad: '×', info: 'i' }[st]);
  const linkify = (s) => esc(s).replace(/(https?:\/\/[^\s<]+[^\s<.,;)])/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
  const sepL = AR ? '، ' : ', ';
  const label = (arr, id) => (arr.find((x) => x.id === id) || {}).t || '';
  const studyById = (id) => state.studies.find((s) => s.id === id);
  const included = () => state.studies.filter((s) => s.status === 'included');
  const short = (s, n) => { s = String(s || ''); return s.length > n ? s.slice(0, n - 1) + '…' : s; };

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
  const idOf = (p) => 'f-' + p.replace(/\./g, '-');
  function F(path, type, o) {
    o = o || {};
    const f = RC.f[path] || {}, id = idOf(path), hid = f.hint ? id + '-h' : '';
    const req = o.req ? ' data-required="1"' + (o.min ? ' data-minwords="' + o.min + '"' : '') : '';
    const common = ' id="' + id + '" class="inp" data-bind="' + path + '"' + req + (f.ph ? ' placeholder="' + attr(f.ph) + '"' : '') + (hid ? ' aria-describedby="' + hid + '"' : '');
    const ctl = type === 'textarea' ? '<textarea' + common + '></textarea>' : '<input' + common + (o.inputmode ? ' inputmode="' + o.inputmode + '"' : '') + '>';
    return '<div class="field"><label for="' + id + '">' + esc(f.label) + (o.req ? '<span class="req" aria-hidden="true">*</span>' : '') + '</label>' + ctl +
      (f.hint ? '<span class="hint" id="' + hid + '">' + esc(f.hint) + '</span>' : '') + '<span class="err" aria-live="polite"></span></div>';
  }
  const G2 = (a, b) => '<div class="grid g-2">' + a + b + '</div>';
  const G3 = (a, b, c) => '<div class="grid g-3">' + a + b + c + '</div>';
  function PICK(path, items, extra) {
    const f = RC.f[path] || {}, gid = idOf(path);
    return '<div class="field choice-group" data-required-pick="' + path + '"><span class="label" id="' + gid + '-l">' + esc(f.label) + '<span class="req" aria-hidden="true">*</span></span>' +
      '<div class="grid g-240" role="group" aria-labelledby="' + gid + '-l">' + items.map((it) => '<button type="button" class="choice" data-pick="' + path + '" data-id="' + it.id + '" aria-pressed="false"><strong>' + esc(it.t) + '</strong>' + (extra ? extra(it) : '<span>' + esc(it.d) + '</span>') + '</button>').join('') +
      '</div><span class="err" aria-live="polite"></span></div>';
  }
  function PILLS(path, items, o) {
    o = o || {};
    const f = RC.f[path] || {};
    return '<fieldset' + (o.req ? ' data-required-multi="' + path + '"' : '') + '><legend>' + esc(f.label) + (o.req ? '<span class="req" aria-hidden="true">*</span>' : '') + '</legend><div class="radio-row">' +
      items.map((it) => '<label class="radio-pill"><input type="checkbox" data-multi="' + path + '" value="' + it.id + '"><span>' + esc(it.t) + '</span></label>').join('') + '</div><span class="err" aria-live="polite"></span></fieldset>';
  }
  function CHECKS(path, items, o) {
    o = o || {};
    const f = RC.f[path] || {};
    return '<fieldset class="multi"' + (o.req ? ' data-required-multi="' + path + '"' : '') + '><legend>' + esc(f.label) + (o.req ? '<span class="req" aria-hidden="true">*</span>' : '') + '</legend><div class="checklist">' +
      items.map((it) => '<label class="chk"><input type="checkbox" data-multi="' + path + '" value="' + it.id + '"><span class="txt"><strong>' + esc(it.t) + '</strong>' + (it.d ? '<span>' + esc(it.d) + '</span>' : '') + (it.syntax ? '<span class="syntax" dir="auto">' + esc(it.syntax) + '</span>' : '') + '</span></label>').join('') +
      '</div><span class="err" aria-live="polite"></span></fieldset>';
  }
  const OUT = (i) => '<div class="output-box"><span class="k">' + esc(RC.stepText[i].out) + '</span><span class="v" id="out-' + i + '" style="white-space:pre-line"></span></div>';
  const tag = (t, cls) => '<span class="tag ' + (cls || '') + '">' + esc(t) + '</span>';

  /* ---------------- Builder markup ---------------- */
  function stepBody(i) {
    switch (i) {
      case 0: return G2(F('s1.topic', 'text', { req: 1 }), F('s1.period', 'text')) + F('s1.problem', 'textarea', { req: 1, min: 10 }) +
        G2(F('s1.question', 'textarea', { req: 1, min: 6 }), F('s1.objectives', 'textarea', { req: 1, min: 4 })) +
        G3(F('s1.theory', 'text'), F('s1.context', 'text'), F('s1.population', 'text')) + PILLS('s1.approaches', RC.approaches) +
        PICK('s1.reviewType', RC.reviewTypes, (r) => '<span>' + esc(r.d) + '</span><span class="ex"><b>' + (AR ? 'المتطلبات: ' : 'Requires: ') + '</b>' + esc(r.req) + '</span>');
      case 1: return '<div id="concepts" class="concepts"></div><div class="btn-row"><button type="button" class="btn btn-ghost btn-sm" id="btn-add-concept">' + esc(UI.addConcept) + '</button></div><p class="hint">' + esc(UI.phrase) + '</p>' +
        CHECKS('s2.dbs', RC.dbs, { req: 1 }) + G2(F('s2.yearFrom', 'text', { inputmode: 'numeric' }), F('s2.yearTo', 'text', { inputmode: 'numeric' })) +
        G2(PILLS('s2.langs', RC.langs), PILLS('s2.types', RC.pubTypes)) + G2(F('s2.exclude', 'text'), F('s2.notes', 'textarea')) +
        '<div class="strings-box"><h4 class="h4">' + esc(UI.stringsTitle) + '</h4><div id="strings-1" class="strings"></div></div>';
      case 2: return G2(F('s3.include', 'textarea', { req: 1 }), F('s3.exclude', 'textarea', { req: 1 })) +
        G3(F('s3.identified', 'text', { inputmode: 'numeric' }), F('s3.duplicates', 'text', { inputmode: 'numeric' }), F('s3.titleExcluded', 'text', { inputmode: 'numeric' })) +
        '<div class="btn-row"><button type="button" class="btn btn-ghost btn-sm" data-add-study="maybe">' + esc(UI.addStudy) + '</button><button type="button" class="btn btn-ghost btn-sm" data-practice>' + esc(UI.loadPractice) + '</button></div>' +
        '<div id="screen-list" class="screen-list"></div><p class="err" id="err-studies" aria-live="polite"></p>' +
        '<div class="flow-wrap"><h4 class="h4">' + esc(UI.flowTitle) + '</h4><div id="flow" class="flow"></div><p class="hint">' + esc(UI.flowNote) + '</p><p class="disclaimer small" id="prisma-note">' + esc(RC.guide.prismaNote) + '</p></div>';
      case 3: return '<p class="hint">' + esc(RC.guide.matrixNote) + '</p><div class="btn-row"><button type="button" class="btn btn-primary btn-sm" data-add-study="included">' + esc(UI.addStudy) + '</button><button type="button" class="btn btn-ghost btn-sm" data-practice>' + esc(UI.loadPractice) + '</button><a class="btn btn-ghost btn-sm" href="#matrix">' + esc(RC.lang === 'ar' ? 'فتح المصفوفة الكاملة' : 'Open the full matrix') + '</a></div>' +
        '<div id="matrix-step"></div><p class="err" id="err-included" aria-live="polite"></p>';
      case 4: return '<div class="appraise" id="appraise"></div><p class="disclaimer small">' + esc(RC.appraisalNote) + '</p><div id="appraise-table"></div>';
      case 5: return '<p class="hint">' + esc(UI.themeSuggest) + '</p><div class="stems" id="theme-suggest"></div><div id="themes" class="stack"></div>' +
        '<div class="btn-row"><button type="button" class="btn btn-ghost btn-sm" id="btn-add-theme">' + esc(UI.addTheme) + '</button></div><p class="err" id="err-themes" aria-live="polite"></p><div id="synth-step"></div>';
      case 6: return '<p class="disclaimer small">' + esc(RC.absenceNote) + '</p><div id="gaps" class="stack"></div><div class="btn-row"><button type="button" class="btn btn-ghost btn-sm" id="btn-add-gap">' + esc(UI.addGap) + '</button></div><p class="err" id="err-gaps" aria-live="polite"></p>';
      case 7: return PICK('s8.structure', RC.structures) + '<div class="btn-row"><button type="button" class="btn btn-ghost btn-sm" id="btn-fill-outline">' + esc(UI.outlineFromThemes) + '</button></div>' +
        '<div class="grid g-2">' + RC.outlineParts.map((p) => '<div class="field"><label for="ol-' + p.id + '">' + esc(p.t) + '</label><textarea id="ol-' + p.id + '" class="inp" data-bind="s8.outline.' + p.id + '" placeholder="' + attr(p.ph) + '"></textarea></div>').join('') + '</div>';
      case 8: return F('s9.limits', 'textarea') +
        '<div class="draft-wrap"><div class="report-tools"><h4 class="h4">' + esc(UI.draftTitle) + '</h4><span class="spacer"></span><button type="button" class="btn btn-ghost btn-sm" id="btn-regen-draft">' + esc(UI.regen) + '</button><button type="button" class="btn btn-ghost btn-sm" id="btn-copy-draft">' + esc(UI.copyDraft) + '</button></div>' +
        '<div class="report draft" id="draft" contenteditable="true" role="textbox" aria-multiline="true" aria-label="' + attr(UI.draftTitle) + '" spellcheck="true"></div></div>' +
        '<div class="refine-box"><h4 class="h4">' + esc(UI.refineTitle) + '</h4><div class="diag" id="refine-list"></div></div>';
      case 9: return '<div class="checker-head"><h4 class="h4">' + esc(RC.lang === 'ar' ? 'فحوص الاتساق القائمة على القواعد' : 'Rule-based consistency checks') + '</h4><span class="checker-summary" id="checker-summary"></span></div><div class="diag" id="checker"></div>' +
        '<div class="eval-layout"><div><div class="rubric" id="rubric"></div><div class="btn-row"><button type="button" class="btn btn-ghost btn-sm" id="btn-apply-scores">' + esc(UI.applyScores) + '</button></div></div><div class="result-panel" id="rubric-result" aria-live="polite"></div></div>' +
        '<p class="disclaimer">' + esc(UI.evalDisclaimer) + '</p><div class="report-tools"><button type="button" class="btn btn-ghost btn-sm" id="btn-regen-report">' + esc(UI.reportRegen) + '</button><button type="button" class="btn btn-ghost btn-sm" id="btn-copy-report">' + esc(UI.reportCopy) + '</button><button type="button" class="btn btn-ghost btn-sm" id="btn-print">' + esc(UI.print) + '</button><button type="button" class="btn btn-primary btn-sm" id="btn-doc">' + esc(UI.doc) + '</button><button type="button" class="btn btn-ghost btn-sm" id="btn-txt">' + esc(UI.txt) + '</button></div>' +
        '<div class="report" id="report" contenteditable="true" role="textbox" aria-multiline="true" aria-label="' + attr(UI.report.title) + '" spellcheck="true"></div>';
    }
    return '';
  }
  function renderBuilder() {
    $('#steps').innerHTML = RC.stepText.map((s, i) => '<div class="step" data-step="' + i + '"' + (i ? ' hidden' : '') + '><div class="step-head"><h3>' + esc(s.h) + '</h3><p>' + esc(s.p) + '</p></div>' +
      '<div class="explain"><strong>' + esc(s.whyH) + '</strong><span>' + esc(s.why) + '</span></div>' + (s.ex ? '<div class="example-box"><b>' + (AR ? 'مثال: ' : 'Example: ') + '</b>' + esc(s.ex) + '</div>' : '') +
      stepBody(i) + ([0, 1, 2].indexOf(i) !== -1 ? OUT(i) : '') + '</div>').join('');
    const rb = $('#rubric');
    rb.innerHTML = RC.rubric.map((c) => '<fieldset class="rubric-row"><legend>' + esc(c.t) + '</legend><span class="desc">' + esc(c.d) + '</span><span class="suggest" data-suggest="' + c.id + '"></span><div class="scale">' +
      [1, 2, 3, 4, 5].map((n) => '<label><input type="radio" name="rub-' + c.id + '" value="' + n + '" data-rub="' + c.id + '" aria-label="' + attr(c.t + ': ' + RC.numerals[n - 1]) + '"><span aria-hidden="true">' + RC.numerals[n - 1] + '</span></label>').join('') + '</div></fieldset>').join('');
    $('#theme-suggest').innerHTML = UI.exampleThemes.map((t) => '<button type="button" class="chip-btn" data-theme-name="' + attr(t) + '">' + esc(t) + '</button>').join('');
  }

  /* ---------------- Binding ---------------- */
  function bind() {
    document.addEventListener('input', (e) => {
      const t = e.target;
      if (t.matches('[data-bind]')) { setPath(state, t.dataset.bind, t.value); if (t.getAttribute('aria-invalid') === 'true' && filled(t.value)) clearErr(t); onChange(); }
      else if (t.matches('[data-concept]')) { const [i, k] = t.dataset.concept.split(':'); state.s2.concepts[+i][k] = t.value; onChange(); }
      else if (t.matches('[data-theme-f]')) { const [id, k] = t.dataset.themeF.split(':'); const th = state.s6.themes.find((x) => x.id === id); if (th) { th[k] = t.value; onChange(); } }
      else if (t.matches('[data-gap-f]')) { const [id, k] = t.dataset.gapF.split(':'); const g = state.s7.gaps.find((x) => x.id === id); if (g) { g[k] = t.value; onChange(); } }
      else if (t.matches('[data-reason]')) { const s = studyById(t.dataset.reason); if (s) { s.reason = t.value; onChange(); } }
      else if (t.matches('#appraise-notes')) { const s = studyById(state.s5.current); if (s) { s.appraisal.notes = t.value; save(); } }
      else if (t.matches('#mx-filter')) { state.ui.filter = t.value; renderMatrix(); save(); }
      else if (t.matches('#check-text')) renderWritingCheck();
      else if (t.matches('#gloss-search')) filterGlossary();
    });
    document.addEventListener('change', (e) => {
      const t = e.target;
      if (t.matches('input[data-multi]')) { const arr = getPath(state, t.dataset.multi), i = arr.indexOf(t.value); if (t.checked && i === -1) arr.push(t.value); else if (!t.checked && i !== -1) arr.splice(i, 1); clearErr(t); onChange(); }
      else if (t.matches('input[data-rub]')) { state.s10.scores[t.dataset.rub] = Number(t.value); onChange(); }
      else if (t.matches('select[data-status]')) { const s = studyById(t.dataset.status); if (s) { s.status = t.value; onChange(); } }
      else if (t.matches('input[data-theme-s]')) { const [id, sid] = t.dataset.themeS.split(':'); const th = state.s6.themes.find((x) => x.id === id); if (th) { const i = th.studies.indexOf(sid); if (t.checked && i === -1) th.studies.push(sid); else if (!t.checked && i !== -1) th.studies.splice(i, 1); onChange(); } }
      else if (t.matches('input[data-gap-s]')) { const [id, sid] = t.dataset.gapS.split(':'); const g = state.s7.gaps.find((x) => x.id === id); if (g) { const i = g.evidence.indexOf(sid); if (t.checked && i === -1) g.evidence.push(sid); else if (!t.checked && i !== -1) g.evidence.splice(i, 1); onChange(); } }
      else if (t.matches('select[data-gap-type]')) { const g = state.s7.gaps.find((x) => x.id === t.dataset.gapType); if (g) { g.type = t.value; onChange(); } }
      else if (t.matches('#appraise-study')) { state.s5.current = t.value; renderAppraise(); save(); }
      else if (t.matches('input[name="appraise-kind"]')) { const s = studyById(state.s5.current); if (s) { s.appraisal.kind = t.value; renderAppraise(); onChange(); } }
      else if (t.matches('input[data-ap]')) { const s = studyById(state.s5.current); if (s) { s.appraisal.r[t.dataset.ap] = t.value; onChange(); renderAppraiseSummaryOnly(); } }
      else if (t.matches('#mx-status')) { state.ui.status = t.value; renderMatrix(); save(); }
      else if (t.matches('#mx-sort')) { state.ui.sort = t.value; renderMatrix(); save(); }
      else if (t.matches('#mx-cols')) { state.ui.cols = t.value; renderMatrix(); save(); }
      else if (t.matches('input[data-cmp]')) { const a = state.ui.compare, i = a.indexOf(t.value); if (t.checked && i === -1) a.push(t.value); else if (!t.checked && i !== -1) a.splice(i, 1); renderCompare(); save(); }
    });
    document.addEventListener('click', (e) => {
      const t = e.target.closest('button, a'); if (!t) return;
      if (t.dataset.pick) { setPath(state, t.dataset.pick, t.dataset.id); clearErr(t); onChange(); }
      else if (t.dataset.addStudy) openStudy(null, t.dataset.addStudy);
      else if (t.dataset.edit) openStudy(t.dataset.edit);
      else if (t.hasAttribute('data-practice')) loadPractice();
      else if (t.dataset.copy) { const n = $('#' + t.dataset.copy); if (n) copyText(n.textContent).then(() => toast(UI.copied), () => toast(UI.copyFail)); }
      else if (t.dataset.removeConcept) { state.s2.concepts.splice(+t.dataset.removeConcept, 1); renderConcepts(); onChange(); }
      else if (t.dataset.themeName) { addTheme(t.dataset.themeName); }
      else if (t.dataset.removeTheme) { state.s6.themes = state.s6.themes.filter((x) => x.id !== t.dataset.removeTheme); renderThemes(); onChange(); }
      else if (t.dataset.removeGap) { state.s7.gaps = state.s7.gaps.filter((x) => x.id !== t.dataset.removeGap); renderGaps(); onChange(); }
      else if (t.dataset.gotoStep) { e.preventDefault(); goTo(Math.min(Number(t.dataset.gotoStep), state.maxStep), true); }
      else if (t.dataset.appraise) { state.s5.current = t.dataset.appraise; goTo(4, true); renderAppraise(); }
    });
  }
  function fillInputs() {
    $$('[data-bind]').forEach((inp) => { const v = getPath(state, inp.dataset.bind); inp.value = v == null ? '' : v; });
    $$('input[data-multi]').forEach((i) => { i.checked = getPath(state, i.dataset.multi).indexOf(i.value) !== -1; });
    $$('input[data-rub]').forEach((i) => { i.checked = state.s10.scores[i.dataset.rub] === Number(i.value); });
    const f = $('#mx-filter'); if (f) f.value = state.ui.filter;
    [['#mx-status', 'status'], ['#mx-sort', 'sort'], ['#mx-cols', 'cols']].forEach((p) => { const n = $(p[0]); if (n) n.value = state.ui[p[1]]; });
    renderConcepts(); renderThemes(); renderGaps();
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
      const v = getPath(state, inp.dataset.bind), min = Number(inp.dataset.minwords || 0);
      if (!filled(v)) fail(inp, UI.required); else if (min && E.wc(v) < min) fail(inp, UI.tooShort(num(min))); else if (show) clearErr(inp);
    });
    $$('[data-required-pick]', el).forEach((g) => { if (!getPath(state, g.dataset.requiredPick)) fail(g, UI.chooseOne); });
    $$('[data-required-multi]', el).forEach((g) => { if (!getPath(state, g.dataset.requiredMulti).length) fail(g, UI.chooseOne); });
    if (i === 1 && !state.s2.concepts.some((c) => E.terms(c.en).length || E.terms(c.ar).length)) { const c = $('#concepts'); ok = false; if (show) { const e = c.querySelector('.err') || c; if (!first) first = c.querySelector('textarea') || c; if (e.classList.contains('err')) e.textContent = UI.required; } }
    if (i === 2 && !state.studies.length) fail($('#err-studies'), UI.needStudies);
    if (i === 3 && !included().length) fail($('#err-included'), UI.needStudies);
    if (i === 5 && !state.s6.themes.some((t) => filled(t.name))) fail($('#err-themes'), UI.required);
    if (i === 6 && !state.s7.gaps.some((g) => filled(g.statement))) fail($('#err-gaps'), UI.required);
    if (show) {
      $('#form-alert').hidden = ok;
      if (!ok) { $('#form-alert').textContent = UI.fixErrors; const f = first.matches && first.matches('.inp, textarea, input') ? first : (first.querySelector ? first.querySelector('input, button, textarea') : null) || $('#form-alert'); if (f && f.focus) f.focus(); }
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
    renderStepper();
    if (i === 4) renderAppraise();
    if (i === 8) renderDraft(false);
    if (i === 9) renderReport(false);
    refresh();
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

  /* ---------------- Step 2: concepts and strings ---------------- */
  function renderConcepts() {
    const box = $('#concepts'); if (!box) return;
    box.innerHTML = state.s2.concepts.map((c, i) => '<fieldset class="concept"><legend>' + esc(UI.concept(i + 1)) + '</legend><div class="grid g-2">' +
      '<div class="field"><label for="c-en-' + i + '">' + esc(UI.conceptEn) + '</label><textarea id="c-en-' + i + '" class="inp" dir="ltr" lang="en" data-concept="' + i + ':en" placeholder="' + attr(UI.conceptPhEn) + '"></textarea></div>' +
      '<div class="field"><label for="c-ar-' + i + '">' + esc(UI.conceptAr) + '</label><textarea id="c-ar-' + i + '" class="inp" dir="rtl" lang="ar" data-concept="' + i + ':ar" placeholder="' + attr(UI.conceptPhAr) + '"></textarea></div></div>' +
      (state.s2.concepts.length > 1 ? '<button type="button" class="btn btn-ghost btn-sm" data-remove-concept="' + i + '">' + esc(UI.removeConcept) + '</button>' : '') + '</fieldset>').join('') + '<span class="err" aria-live="polite"></span>';
    state.s2.concepts.forEach((c, i) => { $('#c-en-' + i).value = c.en; $('#c-ar-' + i).value = c.ar; });
  }
  function stringsHTML(prefix) {
    const S = E.strings(state);
    const order = RC.dbs.filter((d) => S[d.id]);
    if (!order.length) return '<p class="hint">' + esc(UI.noStrings) + '</p>';
    return order.map((d) => {
      const id = prefix + '-' + d.id, sel = state.s2.dbs.indexOf(d.id) !== -1;
      return '<div class="string-item' + (sel ? ' sel' : '') + '"><div class="string-head"><strong>' + esc(d.t) + '</strong>' + (sel ? tag('✓', 'tag-evidence') : '') + '<span class="spacer"></span><button type="button" class="btn btn-ghost btn-sm" data-copy="' + id + '">' + esc(UI.copy) + '</button></div>' +
        '<code id="' + id + '" dir="' + (d.id === 'arabic' ? 'rtl' : 'ltr') + '" lang="' + (d.id === 'arabic' ? 'ar' : 'en') + '">' + attr(S[d.id]) + '</code>' +
        (d.id === 'gscholar' ? '<span class="hint">' + esc(UI.gsNote) + '</span>' : '') + (d.id === 'arabic' ? '<span class="hint">' + esc(UI.arNote) + '</span>' : '') + '</div>';
    }).join('');
  }

  /* ---------------- Studies: dialog, matrix, practice ---------------- */
  let editingId = null;
  function buildDialog() {
    const d = $('#study-dialog'); if (!d) return;
    const groups = ['bib', 'rep', 'own'];
    d.innerHTML = '<form method="dialog" id="study-form" novalidate><div class="dlg-head"><h3 id="dlg-title">' + esc(UI.studyForm) + '</h3></div><div class="dlg-body">' +
      groups.map((g) => '<fieldset class="dlg-group dlg-' + g + '"><legend>' + esc(RC.fieldGroups[g]) + '</legend><div class="grid g-2">' +
        RC.studyFields.filter((f) => f.g === g).map((f) => {
          const id = 'sf-' + f.id;
          const ctl = f.sel ? '<select id="' + id + '" class="inp" name="' + f.id + '"><option value=""></option>' + RC.approaches.map((a) => '<option value="' + a.id + '">' + esc(a.t) + '</option>').join('') + '</select>'
            : f.area ? '<textarea id="' + id + '" class="inp" name="' + f.id + '"></textarea>' : '<input id="' + id + '" class="inp" name="' + f.id + '"' + (f.ph ? ' placeholder="' + attr(f.ph) + '"' : '') + (f.id === 'doi' || f.id === 'year' ? ' dir="ltr"' : '') + '>';
          return '<div class="field' + (f.area ? ' span-2' : '') + '"><label for="' + id + '">' + esc(f.t) + (f.req ? '<span class="req" aria-hidden="true">*</span>' : '') + '</label>' + ctl + '<span class="err" aria-live="polite"></span></div>';
        }).join('') + '</div></fieldset>').join('') +
      '<fieldset class="dlg-group"><legend>' + esc(UI.status) + '</legend><div class="grid g-2"><div class="field"><label for="sf-status">' + esc(UI.status) + '</label><select id="sf-status" class="inp" name="status">' + RC.screenStatus.map((s) => '<option value="' + s.id + '">' + esc(s.t) + '</option>').join('') + '</select></div>' +
      '<div class="field"><label for="sf-reason">' + esc(UI.reason) + '</label><input id="sf-reason" class="inp" name="reason" list="reason-list" placeholder="' + attr(UI.reasonPh) + '"></div></div></fieldset>' +
      '</div><div class="dlg-foot"><button type="button" class="btn btn-ghost" id="dlg-cancel">' + esc(UI.cancel) + '</button><button type="submit" class="btn btn-primary" id="dlg-save">' + esc(UI.save) + '</button></div></form>' +
      '<datalist id="reason-list">' + RC.excludeReasons.map((r) => '<option value="' + attr(r) + '">').join('') + '</datalist>';
    $('#dlg-cancel').addEventListener('click', () => d.close());
    $('#study-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target), o = {};
      fd.forEach((v, k) => { o[k] = String(v).trim(); });
      let bad = null;
      RC.studyFields.filter((f) => f.req).forEach((f) => { const n = $('#sf-' + f.id); if (!o[f.id]) { n.setAttribute('aria-invalid', 'true'); n.parentElement.querySelector('.err').textContent = UI.required; bad = bad || n; } else { n.removeAttribute('aria-invalid'); n.parentElement.querySelector('.err').textContent = ''; } });
      if (bad) { bad.focus(); return; }
      if (editingId) { const s = studyById(editingId); Object.assign(s, o); }
      else state.studies.push(cleanStudy(o));
      d.close(); onChange(); renderMatrix();
    });
  }
  function openStudy(id, status) {
    const d = $('#study-dialog'); editingId = id || null;
    const s = id ? studyById(id) : { status: status || 'included' };
    RC.studyFields.forEach((f) => { const n = $('#sf-' + f.id); n.value = s[f.id] || ''; n.removeAttribute('aria-invalid'); n.parentElement.querySelector('.err').textContent = ''; });
    $('#sf-status').value = s.status || 'included'; $('#sf-reason').value = s.reason || '';
    if (typeof d.showModal === 'function') d.showModal(); else d.setAttribute('open', '');
    $('#sf-authors').focus();
  }
  function loadPractice() {
    if (state.studies.some((s) => s.practice)) { toast(UI.practiceExists); return; }
    RC.practice.forEach((p) => state.studies.push(cleanStudy(Object.assign({}, p, { practice: true, status: 'included' }))));
    onChange(); renderMatrix(); toast(UI.practiceLoaded);
  }
  const statusTag = (s) => tag(label(RC.screenStatus, s.status), s.status === 'included' ? 'tag-evidence' : s.status === 'excluded' ? 'tag-bad' : 'tag-gold');
  function sortedFiltered() {
    const q = E.norm(state.ui.filter, 'ar');
    let list = state.studies.filter((s) => (!state.ui.status || s.status === state.ui.status) && (!q || E.norm(RC.studyFields.map((f) => s[f.id]).join(' '), 'ar').indexOf(q) !== -1));
    const k = state.ui.sort;
    list = list.slice().sort((a, b) => k === 'year' ? String(b.year).localeCompare(String(a.year)) : String(a[k] || '').localeCompare(String(b[k] || ''), RC.lang));
    return list;
  }
  function renderMatrix() {
    const box = $('#matrix-table'); if (box) {
      const cols = state.ui.cols === 'full' ? RC.studyFields : RC.studyFields.filter((f) => ['authors', 'year', 'title', 'approach', 'sample', 'findings', 'limitations', 'relevance'].indexOf(f.id) !== -1);
      const list = sortedFiltered();
      if (!state.studies.length) box.innerHTML = '<p class="hint">' + esc(UI.noStudies) + '</p>';
      else if (!list.length) box.innerHTML = '<p class="hint">' + esc(UI.noMatch) + '</p>';
      else box.innerHTML = '<div class="table-wrap"><table class="data mx"><thead><tr><th scope="col">' + esc(UI.status) + '</th>' + cols.map((c) => '<th scope="col" class="g-' + c.g + '">' + esc(c.t) + (c.g !== 'bib' ? ' <span class="gtag">' + esc(c.g === 'rep' ? UI.reported : UI.yours) + '</span>' : '') + '</th>').join('') + '<th scope="col"><span class="sr-only">' + esc(UI.editStudy) + '</span></th></tr></thead><tbody>' +
        list.map((s) => '<tr><td>' + statusTag(s) + '</td>' + cols.map((c) => '<td class="g-' + c.g + ' c-' + c.id + '"' + (c.id === 'title' || c.id === 'doi' || c.id === 'authors' ? ' dir="auto"' : '') + '>' + (c.id === 'doi' ? linkify(s.doi) : c.sel ? esc(label(RC.approaches, s[c.id])) : esc(s[c.id])) + '</td>').join('') +
          '<td class="row-actions"><button type="button" class="btn btn-ghost btn-sm" data-edit="' + s.id + '" aria-label="' + attr(UI.editStudy + ': ' + (s.title || '')) + '">' + esc(UI.editStudy) + '</button><button type="button" class="btn btn-danger btn-sm" data-del="' + s.id + '" aria-label="' + attr(UI.deleteStudy + ': ' + (s.title || '')) + '">' + esc(UI.deleteStudy) + '</button></td></tr>').join('') + '</tbody></table></div>';
      $$('[data-del]', box).forEach((b) => confirmClick(b, UI.deleteConfirm, () => { const id = b.dataset.del; state.studies = state.studies.filter((x) => x.id !== id); state.s6.themes.forEach((t) => { t.studies = t.studies.filter((x) => x !== id); }); state.s7.gaps.forEach((g) => { g.evidence = g.evidence.filter((x) => x !== id); }); onChange(); renderMatrix(); }));
    }
    const ms = $('#matrix-step'); if (ms) {
      ms.innerHTML = state.studies.length ? '<ul class="study-list">' + state.studies.map((s) => '<li>' + statusTag(s) + ' <span class="cite" dir="auto">' + esc(RC.tpl.cite(s)) + '</span> <span dir="auto">' + esc(short(s.title, 90)) + '</span> <span class="small muted">' + esc([label(RC.approaches, s.approach), s.design].filter(Boolean).join(' · ')) + '</span> <button type="button" class="btn btn-ghost btn-sm" data-edit="' + s.id + '">' + esc(UI.editStudy) + '</button></li>').join('') + '</ul>' : '<p class="hint">' + esc(UI.noStudies) + '</p>';
    }
    const sl = $('#screen-list'); if (sl) {
      sl.innerHTML = state.studies.length ? '<div class="table-wrap"><table class="data screen"><thead><tr><th scope="col">' + esc(RC.studyFields[2].t) + '</th><th scope="col">' + esc(UI.status) + '</th><th scope="col">' + esc(UI.reason) + '</th></tr></thead><tbody>' +
        state.studies.map((s) => '<tr><td><span class="cite" dir="auto">' + esc(RC.tpl.cite(s)) + '</span> <span dir="auto">' + esc(short(s.title, 80)) + '</span></td><td><select class="inp" data-status="' + s.id + '" aria-label="' + attr(UI.status + ': ' + (s.title || '')) + '">' + RC.screenStatus.map((x) => '<option value="' + x.id + '"' + (x.id === s.status ? ' selected' : '') + '>' + esc(x.t) + '</option>').join('') + '</select></td>' +
          '<td><input class="inp" list="reason-list" data-reason="' + s.id + '" value="' + attr(s.reason) + '" placeholder="' + attr(UI.reasonPh) + '" aria-label="' + attr(UI.reason + ': ' + (s.title || '')) + '"' + (s.status === 'excluded' ? '' : ' disabled') + '></td></tr>').join('') + '</tbody></table></div>' : '<p class="hint">' + esc(UI.noStudies) + '</p>';
    }
  }
  function renderFlow() {
    const box = $('#flow'); if (!box) return;
    const c = E.counts(state), F = UI.flow, v = (x) => x == null ? '—' : num(x);
    const row = (k, val, cls) => '<div class="flow-box ' + (cls || '') + '"><span class="k">' + esc(F[k]) + '</span><span class="n">' + v(val) + '</span></div>';
    box.innerHTML = row('identified', c.identified) + '<span class="arrow" aria-hidden="true">↓</span>' + '<div class="flow-row">' + row('screened', c.screened) + row('duplicates', c.duplicates, 'side') + '</div><span class="arrow" aria-hidden="true">↓</span>' +
      '<div class="flow-row">' + row('fulltext', c.fulltext) + row('titleExcluded', c.titleExcluded, 'side') + '</div><span class="arrow" aria-hidden="true">↓</span>' +
      '<div class="flow-row">' + row('included', c.included, 'final') + row('excluded', c.excluded, 'side') + (c.maybe ? row('undecided', c.maybe, 'side warn') : '') + '</div>';
    const pn = $('#prisma-note'); if (pn) pn.classList.toggle('emph', ['systematic', 'scoping'].indexOf(state.s1.reviewType) !== -1);
  }

  /* ---------------- Step 5: appraisal ---------------- */
  function renderAppraise() {
    const box = $('#appraise'); if (!box) return;
    const inc = included();
    if (!inc.length) { box.innerHTML = '<p class="hint">' + esc(UI.appraiseNone) + '</p>'; renderAppraiseSummaryOnly(); return; }
    if (!inc.some((s) => s.id === state.s5.current)) state.s5.current = inc[0].id;
    const s = studyById(state.s5.current), set = RC.appraisalSets[s.appraisal.kind];
    box.innerHTML = '<div class="grid g-2"><div class="field"><label for="appraise-study">' + esc(UI.appraiseWhich) + '</label><select id="appraise-study" class="inp">' + inc.map((x) => '<option value="' + x.id + '"' + (x.id === s.id ? ' selected' : '') + '>' + attr(RC.tpl.cite(x).replace(/[⁨⁩]/g, '') + ' — ' + short(x.title, 60)) + '</option>').join('') + '</select></div>' +
      '<fieldset><legend>' + esc(UI.appraiseKind) + '</legend><div class="radio-row">' + RC.appraisalKinds.map((k) => '<label class="radio-pill"><input type="radio" name="appraise-kind" value="' + k.id + '"' + (k.id === s.appraisal.kind ? ' checked' : '') + '><span>' + esc(k.t) + '</span></label>').join('') + '</div></fieldset></div>' +
      '<div class="ap-list">' + set.map((c) => '<fieldset class="ap-row"><legend>' + esc(c.t) + '</legend><span class="desc">' + esc(c.d) + '</span><div class="radio-row">' +
        RC.ratings.map((r) => '<label class="radio-pill"><input type="radio" name="ap-' + c.id + '" data-ap="' + c.id + '" value="' + r.id + '"' + (s.appraisal.r[c.id] === r.id ? ' checked' : '') + '><span>' + esc(r.t) + '</span></label>').join('') + '</div></fieldset>').join('') + '</div>' +
      '<div class="field"><label for="appraise-notes">' + esc(UI.appraisalNotes) + '</label><textarea id="appraise-notes" class="inp"></textarea></div>';
    $('#appraise-notes').value = s.appraisal.notes || '';
    renderAppraiseSummaryOnly();
  }
  function renderAppraiseSummaryOnly() {
    const html = included().length ? '<div class="table-wrap"><table class="data"><thead><tr><th scope="col">' + esc(RC.studyFields[2].t) + '</th><th scope="col">' + esc(UI.appraiseKind) + '</th><th scope="col">' + esc(RC.lang === 'ar' ? 'النتيجة' : 'Result') + '</th><th scope="col"><span class="sr-only">' + esc(UI.appraiseWhich) + '</span></th></tr></thead><tbody>' +
      included().map((s) => { const a = E.appraisalStats(s); return '<tr><td><span class="cite" dir="auto">' + esc(RC.tpl.cite(s)) + '</span> <span dir="auto">' + esc(short(s.title, 70)) + '</span></td><td>' + esc(label(RC.appraisalKinds, s.appraisal.kind)) + '</td><td>' + (a.rated ? esc(UI.appraisalSummary(a.yes, a.partly, a.no)) : '<span class="muted">' + esc(UI.notAppraised) + '</span>') + '</td><td><button type="button" class="btn btn-ghost btn-sm" data-appraise="' + s.id + '">' + esc(RC.lang === 'ar' ? 'تقييم' : 'Appraise') + '</button></td></tr>'; }).join('') + '</tbody></table></div>' : '<p class="hint">' + esc(UI.appraiseNone) + '</p>';
    ['#appraise-table', '#appraisal-summary'].forEach((sel) => { const n = $(sel); if (n) n.innerHTML = html; });
  }

  /* ---------------- Step 6: themes ---------------- */
  function addTheme(name) { state.s6.themes.push({ id: uid(), name: name || '', desc: '', agree: '', contra: '', studies: [] }); renderThemes(); onChange(); const n = $$('#themes [data-theme-f$=":name"]').pop(); if (n && !name) n.focus(); }
  function renderThemes() {
    const box = $('#themes'); if (!box) return;
    const inc = included();
    box.innerHTML = state.s6.themes.length ? state.s6.themes.map((t, i) => '<fieldset class="card theme-card"><legend>' + esc(UI.themeName) + ' ' + RC.numerals[Math.min(i, 9)] + '</legend>' +
      '<div class="grid g-2"><div class="field"><label for="th-n-' + t.id + '">' + esc(UI.themeName) + '</label><input id="th-n-' + t.id + '" class="inp" data-theme-f="' + t.id + ':name"></div>' +
      '<div class="field"><label for="th-d-' + t.id + '">' + esc(UI.themeDesc) + '</label><textarea id="th-d-' + t.id + '" class="inp" data-theme-f="' + t.id + ':desc" placeholder="' + attr(UI.themeDescPh) + '"></textarea></div></div>' +
      '<fieldset><legend>' + esc(UI.themeStudies) + '</legend><div class="radio-row">' + (inc.length ? inc.map((s) => '<label class="radio-pill"><input type="checkbox" data-theme-s="' + t.id + ':' + s.id + '"' + (t.studies.indexOf(s.id) !== -1 ? ' checked' : '') + '><span dir="auto">' + esc(RC.tpl.cite(s)) + '</span></label>').join('') : '<span class="hint">' + esc(UI.appraiseNone) + '</span>') + '</div></fieldset>' +
      '<div class="grid g-2"><div class="field"><label for="th-a-' + t.id + '">' + esc(UI.agree) + '</label><textarea id="th-a-' + t.id + '" class="inp" data-theme-f="' + t.id + ':agree"></textarea></div>' +
      '<div class="field"><label for="th-c-' + t.id + '">' + esc(UI.contra) + '</label><textarea id="th-c-' + t.id + '" class="inp" data-theme-f="' + t.id + ':contra"></textarea></div></div>' +
      '<button type="button" class="btn btn-danger btn-sm" data-remove-theme="' + t.id + '">' + esc(UI.removeTheme) + '</button></fieldset>').join('') : '<p class="hint">' + esc(UI.noThemes) + '</p>';
    state.s6.themes.forEach((t) => { ['name', 'desc', 'agree', 'contra'].forEach((k) => { const n = $('[data-theme-f="' + t.id + ':' + k + '"]'); if (n) n.value = t[k]; }); });
  }
  function synthHTML() {
    const th = state.s6.themes.filter((t) => filled(t.name)); if (!th.length) return '<p class="hint">' + esc(UI.noThemes) + '</p>';
    const inc = included();
    const cell = (arr) => esc([...new Set(arr.filter(Boolean))].join(sepL)) || '—';
    return '<h4 class="h4">' + esc(UI.synthTable) + '</h4><div class="table-wrap"><table class="data"><thead><tr><th scope="col">' + esc(UI.themeName) + '</th><th scope="col">' + esc(UI.themeStudies) + '</th><th scope="col">' + esc(UI.dims.theory) + '</th><th scope="col">' + esc(UI.dims.approach) + '</th><th scope="col">' + esc(UI.dims.context) + '</th><th scope="col">' + esc(UI.agree) + '</th><th scope="col">' + esc(UI.contra) + '</th></tr></thead><tbody>' +
      th.map((t) => { const ss = inc.filter((s) => t.studies.indexOf(s.id) !== -1); return '<tr><th scope="row">' + esc(t.name) + '</th><td dir="auto">' + cell(ss.map(RC.tpl.cite)) + '</td><td>' + cell(ss.map((s) => s.theory)) + '</td><td>' + cell(ss.map((s) => label(RC.approaches, s.approach))) + '</td><td>' + cell(ss.map((s) => s.context)) + '</td><td>' + (esc(t.agree) || '—') + '</td><td>' + (esc(t.contra) || '—') + '</td></tr>'; }).join('') + '</tbody></table></div>';
  }
  function renderCompare() {
    const box = $('#compare-table'); if (!box) return;
    const dims = Object.keys(UI.dims).filter((k) => state.ui.compare.indexOf(k) !== -1), inc = included();
    box.innerHTML = !inc.length ? '<p class="hint">' + esc(UI.appraiseNone) + '</p>' : '<div class="table-wrap"><table class="data"><thead><tr><th scope="col">' + esc(RC.studyFields[2].t) + '</th>' + dims.map((d) => '<th scope="col">' + esc(UI.dims[d]) + '</th>').join('') + '</tr></thead><tbody>' +
      inc.map((s) => '<tr><th scope="row" dir="auto">' + esc(RC.tpl.cite(s)) + '</th>' + dims.map((d) => '<td>' + (d === 'approach' ? esc(label(RC.approaches, s.approach)) : esc(s[d])) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>';
  }

  /* ---------------- Tool C: evidence map (SVG) ---------------- */
  function renderMap() {
    const box = $('#evidence-map'); if (!box) return;
    const inc = included();
    if (!inc.length) { box.innerHTML = '<p class="hint">' + esc(UI.mapEmpty) + '</p>'; return; }
    const theories = [], themes = state.s6.themes.filter((t) => filled(t.name)), methods = [];
    const key = (s) => E.norm(s, 'ar');
    inc.forEach((s) => {
      String(s.theory || '').split(/[,،;؛]/).map((x) => x.trim()).filter(Boolean).forEach((x) => { if (!theories.some((y) => key(y) === key(x))) theories.push(x); });
      const m = label(RC.approaches, s.approach) || s.design; if (m && methods.indexOf(m) === -1) methods.push(m);
    });
    const cols = [theories, inc.map((s) => RC.tpl.cite(s).replace(/[⁨⁩]/g, '')), themes.map((t) => t.name), methods];
    const W = 1000, rowH = 34, top = 46, n = Math.max(...cols.map((c) => c.length), 1), H = top + n * rowH + 20;
    let xs = [110, 380, 650, 890]; if (AR) xs = xs.map((x) => W - x);
    const yOf = (col, i) => top + i * rowH + (n - cols[col].length) * rowH / 2 + 12;
    let edges = '', nodes = '';
    inc.forEach((s, si) => {
      const ys = yOf(1, si);
      String(s.theory || '').split(/[,،;؛]/).map((x) => x.trim()).filter(Boolean).forEach((x) => { const ti = theories.findIndex((y) => key(y) === key(x)); edges += '<line class="e" data-s="' + si + '" x1="' + xs[0] + '" y1="' + yOf(0, ti) + '" x2="' + xs[1] + '" y2="' + ys + '"/>'; });
      themes.forEach((t, ti) => { if (t.studies.indexOf(s.id) !== -1) edges += '<line class="e" data-s="' + si + '" x1="' + xs[1] + '" y1="' + ys + '" x2="' + xs[2] + '" y2="' + yOf(2, ti) + '"/>'; });
      const m = label(RC.approaches, s.approach) || s.design; if (m) edges += '<line class="e" data-s="' + si + '" x1="' + xs[1] + '" y1="' + ys + '" x2="' + xs[3] + '" y2="' + yOf(3, methods.indexOf(m)) + '"/>';
    });
    const nodeW = 210;
    cols.forEach((col, ci) => col.forEach((txt, i) => {
      const y = yOf(ci, i), cls = ['th', 'st', 'tm', 'me'][ci];
      nodes += '<g class="n ' + cls + '"' + (ci === 1 ? ' data-s="' + i + '" tabindex="0" role="button" aria-label="' + attr(txt) + '"' : '') + '><rect x="' + (xs[ci] - nodeW / 2) + '" y="' + (y - 13) + '" width="' + nodeW + '" height="26" rx="13"/><text x="' + xs[ci] + '" y="' + (y + 4) + '" text-anchor="middle"><title>' + attr(txt) + '</title>' + attr(short(txt, 30)) + '</text></g>';
    }));
    const heads = UI.mapCols.map((h, i) => '<text class="h" x="' + xs[i] + '" y="22" text-anchor="middle">' + attr(h) + '</text>').join('');
    box.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + attr(UI.mapTitle) + '" class="evmap" direction="' + (AR ? 'rtl' : 'ltr') + '">' + heads + '<g class="edges">' + edges + '</g>' + nodes + '</svg>';
    const svg = $('svg', box);
    const hl = (si) => { svg.classList.toggle('focus', si != null); $$('.e', svg).forEach((e) => e.classList.toggle('hl', e.dataset.s === String(si))); };
    $$('g.st', svg).forEach((g) => { ['mouseenter', 'focus'].forEach((ev) => g.addEventListener(ev, () => hl(g.dataset.s))); ['mouseleave', 'blur'].forEach((ev) => g.addEventListener(ev, () => hl(null))); });
  }

  /* ---------------- Step 7: gaps ---------------- */
  function renderGaps() {
    const box = $('#gaps'); if (!box) return;
    const inc = included();
    box.innerHTML = state.s7.gaps.length ? state.s7.gaps.map((g, i) => '<fieldset class="card gap-card"><legend>' + esc(UI.gapStatement) + ' ' + RC.numerals[Math.min(i, 9)] + '</legend>' +
      '<div class="grid g-2"><div class="field"><label for="gp-t-' + g.id + '">' + esc(UI.gapType) + '</label><select id="gp-t-' + g.id + '" class="inp" data-gap-type="' + g.id + '">' + RC.gapTypes.map((x) => '<option value="' + x.id + '"' + (x.id === g.type ? ' selected' : '') + '>' + esc(x.t) + '</option>').join('') + '</select><span class="hint" data-gap-hint="' + g.id + '"></span></div>' +
      '<div class="field"><label for="gp-s-' + g.id + '">' + esc(UI.gapStatement) + '</label><textarea id="gp-s-' + g.id + '" class="inp" data-gap-f="' + g.id + ':statement" placeholder="' + attr(UI.gapStatementPh) + '"></textarea></div></div>' +
      '<fieldset><legend>' + esc(UI.gapEvidence) + '</legend><div class="radio-row">' + (inc.length ? inc.map((s) => '<label class="radio-pill"><input type="checkbox" data-gap-s="' + g.id + ':' + s.id + '"' + (g.evidence.indexOf(s.id) !== -1 ? ' checked' : '') + '><span dir="auto">' + esc(RC.tpl.cite(s)) + '</span></label>').join('') : '<span class="hint">' + esc(UI.appraiseNone) + '</span>') + '</div></fieldset>' +
      '<div class="gap-status" data-gap-status="' + g.id + '"></div><div class="output-box"><span class="k">' + esc(UI.gapDraft) + '</span><span class="v" data-gap-draft="' + g.id + '"></span></div>' +
      '<button type="button" class="btn btn-danger btn-sm" data-remove-gap="' + g.id + '">' + esc(UI.removeGap) + '</button></fieldset>').join('') : '<p class="hint">' + esc(UI.noGaps) + '</p>';
    state.s7.gaps.forEach((g) => { const n = $('[data-gap-f="' + g.id + ':statement"]'); if (n) n.value = g.statement; });
    refreshGaps();
  }
  function refreshGaps() {
    state.s7.gaps.forEach((g) => {
      const st = E.gapStatus(g, state), S = RC.gapStatus[st];
      const n = $('[data-gap-status="' + g.id + '"]'); if (n) n.innerHTML = '<div class="diag-item st-' + (st === 'supported' ? 'ok' : st === 'verify' ? 'warn' : 'info') + '"><span class="ic" aria-hidden="true">' + icon(st === 'supported' ? 'ok' : st === 'verify' ? 'warn' : 'info') + '</span><span class="t">' + esc(S.t) + '</span><span class="d">' + esc(S.d) + '</span></div>';
      const ty = RC.gapTypes.find((x) => x.id === g.type);
      const h = $('[data-gap-hint="' + g.id + '"]'); if (h && ty) h.textContent = ty.d + ' — ' + ty.ex;
      const d = $('[data-gap-draft="' + g.id + '"]'); if (d) d.textContent = RC.tpl.gapStatement(g, included().filter((s) => g.evidence.indexOf(s.id) !== -1), { gapType: ty });
    });
    const sum = $('#gaps-summary');
    if (sum) sum.innerHTML = state.s7.gaps.filter((g) => filled(g.statement)).length ? '<ul class="list">' + state.s7.gaps.filter((g) => filled(g.statement)).map((g) => '<li><strong>' + esc(label(RC.gapTypes, g.type)) + ':</strong> ' + esc(g.statement) + ' ' + tag(RC.gapStatus[E.gapStatus(g, state)].t, E.gapStatus(g, state) === 'supported' ? 'tag-evidence' : 'tag-gold') + '</li>').join('') + '</ul>' : '<p class="hint">' + esc(UI.noGaps) + '</p>';
  }

  /* ---------------- Step 8: outline ---------------- */
  function fillOutline() {
    const L = E.labels(state, RC), o = state.s8.outline;
    o.themes = L.themes.map((t, i) => num(i + 1) + '. ' + t.name).join('\n');
    o.gaps = L.gaps.map((g) => '• ' + label(RC.gapTypes, g.type) + ': ' + g.statement).join('\n');
    const th = [...new Set(L.included.map((s) => s.theory).filter(Boolean))]; if (!filled(o.debates) && th.length) o.debates = th.join(sepL);
    const me = [...new Set(L.included.map((s) => label(RC.approaches, s.approach)).filter(Boolean))]; if (!filled(o.methods) && me.length) o.methods = me.join(sepL);
    fillInputs(); onChange(); toast(UI.outlineFilled);
  }

  /* ---------------- Step 9: draft ---------------- */
  function draftHTML() {
    const L = E.labels(state, RC), T = RC.tpl, inc = L.included;
    let h = '<h3>' + esc(RC.outlineParts[0].t) + '</h3><p>' + esc(T.introDraft(state, L)) + '</p>';
    L.themes.forEach((t) => { h += '<h3>' + esc(t.name) + '</h3><p>' + esc(T.paragraph(t, inc.filter((s) => t.studies.indexOf(s.id) !== -1), state)) + '</p>'; });
    if (L.gaps.length) h += '<h3>' + esc(RC.outlineParts[6].t) + '</h3>' + L.gaps.map((g) => '<p>' + esc(T.gapStatement(g, inc.filter((s) => g.evidence.indexOf(s.id) !== -1), { gapType: RC.gapTypes.find((x) => x.id === g.type) })) + '</p>').join('');
    if (filled(state.s9.limits)) h += '<h3>' + esc(RC.outlineParts[5].t) + '</h3><p>' + esc(state.s9.limits) + '</p>';
    h += '<h3>' + esc(RC.outlineParts[7].t) + '</h3><p>' + esc(T.conclusionDraft(state, L)) + '</p>';
    return h;
  }
  function textOf(html) { const d = new DOMParser().parseFromString('<div>' + html + '</div>', 'text/html'); return Array.from(d.body.firstChild.children).map((n) => n.textContent).join('\n'); }
  function renderDraft(force) {
    const d = $('#draft'); if (!d) return;
    if (force || !state.s9.edited || !filled(state.s9.draft)) { state.s9.draft = draftHTML(); state.s9.edited = false; }
    state.s9.draftText = textOf(state.s9.draft);
    if (document.activeElement !== d) d.innerHTML = sanitize(state.s9.draft);
  }
  function refineHTML(text, edited) {
    const R = RC.refine, w = E.writingCheck(text, RC), msgs = [];
    msgs.push({ s: 'info', m: R.ratio(w.desc, w.synth) });
    if (w.brackets) msgs.push({ s: 'warn', m: R.brackets(w.brackets) });
    if (w.desc > w.synth) msgs.push({ s: 'warn', m: R.descriptive });
    const one = E.paragraphsCitingOne(text); if (one) msgs.push({ s: 'info', m: R.oneStudy(one) });
    if (w.vague.length) msgs.push({ s: 'warn', m: R.vague(w.vague.join(sepL)) });
    if (!msgs.some((x) => x.s === 'warn')) msgs.push({ s: 'ok', m: R.ok });
    return (edited ? '<p class="small muted">' + esc(R.edited) + '</p>' : '') + msgs.map((x) => '<div class="diag-item st-' + x.s + '"><span class="ic" aria-hidden="true">' + icon(x.s) + '</span><span class="d">' + esc(x.m) + '</span></div>').join('');
  }
  function renderRefine() { const b = $('#refine-list'); if (b) b.innerHTML = refineHTML(state.s9.draftText, state.s9.edited); }
  function renderWritingCheck() { const t = $('#check-text'), b = $('#check-result'); if (t && b) b.innerHTML = filled(t.value) ? refineHTML(t.value, false) : ''; }

  /* ---------------- Step 10: checks, rubric, report ---------------- */
  function diagItem(t, s, m) { return '<div class="diag-item st-' + s + '"><span class="ic" aria-hidden="true">' + icon(s) + '</span><span class="t">' + esc(t) + '<span class="status-label">' + esc(RC.statusLabel[s]) + '</span></span><span class="d">' + esc(m) + '</span></div>'; }
  function renderChecker() {
    const box = $('#checker'); if (!box) return;
    if (!filled(state.s1.topic) && !state.studies.length) { box.innerHTML = '<p class="hint">' + esc(UI.checkerEmpty) + '</p>'; $('#checker-summary').textContent = ''; return; }
    const list = E.checks(state, RC), order = { bad: 0, warn: 1, info: 2, ok: 3 };
    list.sort((a, b) => order[a.status] - order[b.status]);
    box.innerHTML = list.map((c) => diagItem(c.t, c.status, c.msg)).join('');
    const cnt = (k) => list.filter((c) => c.status === k).length;
    $('#checker-summary').textContent = ['bad', 'warn', 'ok'].map((k) => RC.statusLabel[k] + ': ' + num(cnt(k))).join(' · ');
  }
  function scoreSummary() {
    const sc = state.s10.scores, rated = RC.rubric.filter((c) => sc[c.id]);
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
  function buildReportHTML() {
    const R = UI.report, L = E.labels(state, RC), T = RC.tpl, s1 = state.s1, inc = L.included;
    const p = (x) => '<p>' + esc(filled(x) ? x : UI.empty) + '</p>';
    const { sc, rated, mean, lvl } = scoreSummary();
    const date = new Date().toLocaleDateString(AR ? 'ar-SA' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
    const S = E.strings(state);
    let h = '<h2>' + esc(R.title) + '</h2><p class="meta">' + esc(R.generated(date)) + '</p>';
    h += '<h3>' + esc(R.topic) + '</h3><p><strong>' + esc(s1.topic || UI.empty) + '</strong></p>' + p(s1.question) + (filled(s1.problem) ? p(s1.problem) : '');
    h += '<h3>' + esc(R.scope) + '</h3><p style="white-space:pre-line">' + esc(T.scope(state, L)) + '</p>' + (filled(s1.objectives) ? '<ol>' + s1.objectives.split('\n').filter(filled).map((x) => '<li>' + esc(x) + '</li>').join('') + '</ol>' : '');
    h += '<h3>' + esc(R.search) + '</h3><p>' + esc(T.searchSummary(state, L)) + '</p>' + (L.dbs.length ? '<p>' + esc(L.dbs.map((d) => d.t).join(sepL)) + '</p>' : '') + Object.keys(S).map((k) => '<p><strong>' + esc(label(RC.dbs, k)) + ':</strong> ' + esc(S[k]) + '</p>').join('') + (filled(state.s2.notes) ? p(state.s2.notes) : '');
    h += '<h3>' + esc(R.criteria) + '</h3><p><strong>' + esc(R.include) + ':</strong> ' + esc(state.s3.include || UI.empty) + '</p><p><strong>' + esc(R.exclude) + ':</strong> ' + esc(state.s3.exclude || UI.empty) + '</p>';
    const c = E.counts(state), F = UI.flow;
    h += '<h3>' + esc(R.selected) + '</h3><ul>' + ['identified', 'duplicates', 'titleExcluded', 'fulltext', 'excluded', 'included'].map((k) => c[k] != null ? '<li>' + esc(F[k]) + ': ' + num(c[k]) + '</li>' : '').join('') + '</ul>' +
      (state.studies.filter((s) => s.status === 'excluded').length ? '<ul>' + state.studies.filter((s) => s.status === 'excluded').map((s) => '<li>' + esc(T.cite(s)) + ' — ' + esc(s.reason || UI.empty) + '</li>').join('') + '</ul>' : '');
    const cols = ['authors', 'year', 'theory', 'approach', 'design', 'sample', 'findings', 'limitations', 'relevance', 'notes'].map((id) => RC.studyFields.find((f) => f.id === id));
    h += '<h3>' + esc(R.matrix) + '</h3>' + (inc.length ? '<table><thead><tr>' + cols.map((f) => '<th>' + esc(f.t) + '</th>').join('') + '</tr></thead><tbody>' + inc.map((s) => '<tr>' + cols.map((f) => '<td>' + esc(f.sel ? label(RC.approaches, s[f.id]) : s[f.id]) + '</td>').join('') + '</tr>').join('') + '</tbody></table>' : p(''));
    h += '<h3>' + esc(R.appraisal) + '</h3>' + (inc.length ? '<ul>' + inc.map((s) => { const a = E.appraisalStats(s); return '<li><strong>' + esc(T.cite(s)) + ':</strong> ' + (a.rated ? esc(UI.appraisalSummary(a.yes, a.partly, a.no)) : esc(UI.notAppraised)) + (filled(s.appraisal.notes) ? ' — ' + esc(s.appraisal.notes) : '') + '</li>'; }).join('') + '</ul>' : p(''));
    h += '<h3>' + esc(R.themes) + '</h3>' + (L.themes.length ? '<ul>' + L.themes.map((t) => '<li><strong>' + esc(t.name) + '</strong> (' + esc(inc.filter((s) => t.studies.indexOf(s.id) !== -1).map(T.cite).join(sepL) || UI.empty) + ')' + (filled(t.desc) ? ': ' + esc(t.desc) : '') + '</li>').join('') + '</ul>' : p(''));
    h += '<h3>' + esc(R.gaps) + '</h3>' + (L.gaps.length ? '<ul>' + L.gaps.map((g) => '<li><strong>' + esc(label(RC.gapTypes, g.type)) + '</strong> — ' + esc(g.statement) + ' [' + esc(RC.gapStatus[E.gapStatus(g, state)].t) + ']</li>').join('') + '</ul>' : p(''));
    h += '<h3>' + esc(R.outline) + '</h3>' + (L.structure ? '<p><strong>' + esc(L.structure.t) + '</strong></p>' : '') + '<ol>' + RC.outlineParts.map((o) => '<li><strong>' + esc(o.t) + '</strong>' + (filled(state.s8.outline[o.id]) ? ': ' + esc(state.s8.outline[o.id]).replace(/\n/g, '<br>') : '') + '</li>').join('') + '</ol>';
    h += '<h3>' + esc(R.draft) + '</h3>' + sanitize(filled(state.s9.draft) ? state.s9.draft : draftHTML()).replace(/<h3>/g, '<h4>').replace(/<\/h3>/g, '</h4>');
    h += '<h3>' + esc(R.evaluation) + '</h3>' + (rated.length ? '<ul>' + RC.rubric.map((cr) => '<li>' + esc(cr.t) + ': ' + (sc[cr.id] ? RC.numerals[sc[cr.id] - 1] + ' ' + esc(UI.outOf5) : esc(UI.notRated)) + '</li>').join('') + '</ul><p><strong>' + esc(UI.overall) + ':</strong> ' + esc(fmt1(mean)) + ' ' + esc(UI.outOf5) + ' — ' + esc(lvl.t) + '</p>' : p(UI.notRated)) + '<p><em>' + esc(UI.evalDisclaimer) + '</em></p>';
    const recs = []; RC.rubric.forEach((cr) => { if (sc[cr.id] && sc[cr.id] <= 3) recs.push(cr.t + ': ' + RC.rubricRec[cr.id]); });
    E.checks(state, RC).forEach((x) => { if (x.status !== 'ok') recs.push(x.t + ': ' + x.msg); });
    h += '<h3>' + esc(R.recs) + '</h3>' + (recs.length ? '<ul>' + [...new Set(recs)].map((r) => '<li>' + esc(r) + '</li>').join('') + '</ul>' : p(R.noRecs));
    h += '<h3>' + esc(R.refs) + '</h3>' + (inc.length ? '<ul>' + inc.slice().sort((a, b) => String(a.authors).localeCompare(String(b.authors))).map((s) => '<li>' + esc(T.reference(s)) + '</li>').join('') + '</ul>' : p(''));
    return h;
  }
  function sanitize(html) {
    const doc = new DOMParser().parseFromString('<div>' + html + '</div>', 'text/html');
    const ok = ['DIV', 'P', 'H2', 'H3', 'H4', 'UL', 'OL', 'LI', 'STRONG', 'B', 'EM', 'I', 'BR', 'SPAN', 'U', 'TABLE', 'THEAD', 'TBODY', 'TR', 'TH', 'TD'];
    const walk = (n) => Array.from(n.children).forEach((c) => { if (ok.indexOf(c.tagName) === -1) { c.replaceWith(document.createTextNode(c.textContent)); return; } Array.from(c.attributes).forEach((a) => { if (a.name !== 'class') c.removeAttribute(a.name); }); walk(c); });
    walk(doc.body.firstChild); return doc.body.firstChild.innerHTML;
  }
  function renderReport(force) {
    const r = $('#report'); if (!r) return;
    if (force || !state.report.edited || !filled(state.report.html)) { state.report.html = buildReportHTML(); state.report.edited = false; }
    r.innerHTML = sanitize(state.report.html);
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

  /* ---------------- Guide sections ---------------- */
  function renderGuides() {
    const G = RC.guide;
    const set = (sel, html) => { const n = $(sel); if (n) n.innerHTML = html; };
    const opt = (v, t) => '<option value="' + attr(v) + '">' + esc(t) + '</option>';
    set('#mx-status', opt('', UI.allStatuses) + RC.screenStatus.map((s) => opt(s.id, s.t)).join(''));
    set('#mx-sort', ['year', 'authors', 'title', 'approach'].map((k) => opt(k, RC.studyFields.find((f) => f.id === k).t)).join(''));
    set('#mx-cols', opt('compact', UI.compact) + opt('full', UI.full));
    set('#review-types', RC.reviewTypes.map((r) => '<article class="card"><h3>' + esc(r.t) + '</h3><p>' + esc(r.d) + '</p><p class="small"><strong>' + (AR ? 'المتطلبات: ' : 'Requires: ') + '</strong>' + esc(r.req) + '</p><p class="small"><strong>' + (AR ? 'مثال: ' : 'Example: ') + '</strong>' + esc(r.ftv) + '</p></article>').join(''));
    set('#db-table', '<thead><tr><th scope="col">' + (AR ? 'قاعدة البيانات' : 'Database') + '</th><th scope="col">' + (AR ? 'التغطية' : 'Coverage') + '</th><th scope="col">' + (AR ? 'الصيغة' : 'Syntax') + '</th></tr></thead><tbody>' + RC.dbs.map((d) => '<tr><th scope="row">' + esc(d.t) + '</th><td>' + esc(d.d) + '</td><td dir="auto">' + esc(d.syntax) + '</td></tr>').join('') + '</tbody>');
    set('#appraisal-tools', RC.appraisalTools.map((a) => '<article class="card"><h3>' + esc(a.t) + '</h3><p>' + esc(a.d) + '</p></article>').join(''));
    const crit = $('#appraisal-note'); if (crit) crit.textContent = RC.appraisalNote;
    set('#criteria-lists', RC.appraisalKinds.map((k) => '<article class="card"><h3>' + esc(k.t) + '</h3><ol class="list">' + RC.appraisalSets[k.id].map((c) => '<li><strong>' + esc(c.t) + '</strong> — ' + esc(c.d) + '</li>').join('') + '</ol></article>').join(''));
    set('#compare-dims', Object.keys(UI.dims).map((k) => '<label class="radio-pill"><input type="checkbox" data-cmp value="' + k + '"' + (state.ui.compare.indexOf(k) !== -1 ? ' checked' : '') + '><span>' + esc(UI.dims[k]) + '</span></label>').join(''));
    set('#gap-types', RC.gapTypes.map((g) => '<article class="card"><h3>' + esc(g.t) + '</h3><p>' + esc(g.d) + '</p><p class="small"><strong>' + (AR ? 'مثال: ' : 'Example: ') + '</strong>' + esc(g.ex) + '</p></article>').join(''));
    set('#gap-legend', ['potential', 'verify', 'supported'].map((k) => '<article class="card"><h3>' + esc(RC.gapStatus[k].t) + '</h3><p>' + esc(RC.gapStatus[k].d) + '</p></article>').join(''));
    const an = $('#absence-note'); if (an) an.textContent = RC.absenceNote;
    set('#critical-ladder', G.critical.map((x, i) => '<div class="chain-item"><span class="n">' + RC.numerals[i] + '</span><strong>' + esc(x.t) + '</strong><span>' + esc(x.d) + '</span></div>').join(''));
    set('#desc-crit', G.descVsCrit.map((x) => '<div class="compare"><div class="ex-weak"><b>' + (AR ? 'وصفي' : 'Descriptive') + '</b>' + esc(x.desc) + '</div><div class="ex-better"><b>' + (AR ? 'نقدي تركيبي' : 'Critical synthesis') + '</b>' + esc(x.crit) + '</div></div>').join(''));
    const LK = { agree: AR ? 'للاتفاق' : 'Agreement', differ: AR ? 'للاختلاف' : 'Contrast', explain: AR ? 'للتفسير' : 'Explanation', evaluate: AR ? 'للتقييم' : 'Evaluation', implication: AR ? 'للدلالة' : 'Implication' };
    set('#linkers', Object.keys(G.linkers).map((k) => '<article class="card"><h3>' + esc(LK[k]) + '</h3><ul class="list">' + G.linkers[k].map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul></article>').join(''));
    set('#citation-patterns', G.citation.map((x) => '<article class="card"><h3>' + esc(x.t) + '</h3><p>' + esc(x.d) + '</p></article>').join(''));
    const ai = $('#ai-note'); if (ai) ai.textContent = G.aiNote;
  }
  function renderExamples() {
    const list = $('#ex-list'), pub = $('#pub-list'), filters = $('#ex-filters'); if (!list) return;
    const X = UI.exLabels, row = (k, v) => '<p class="why"><strong>' + esc(X[k]) + ':</strong> ' + esc(v) + '</p>';
    const areas = [...new Set(RC.examples.map((e) => e.area))];
    const mk = (id, t) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'chip-btn'; b.textContent = t; b.setAttribute('aria-pressed', id === '*' ? 'true' : 'false'); b.addEventListener('click', () => { $$('.chip-btn', filters).forEach((x) => x.setAttribute('aria-pressed', x === b ? 'true' : 'false')); $$('.ex-card').forEach((c) => { c.hidden = !(id === '*' || c.dataset.area === id); }); }); filters.appendChild(b); };
    mk('*', UI.exAll); areas.forEach((a) => mk(a, a));
    list.innerHTML = RC.examples.map((e) => '<article class="ex-card" data-area="' + attr(e.area) + '"><div class="tags">' + tag(e.area) + tag(UI.exHyp, 'tag-illustrative') + '</div><div class="ex-better"><b>' + esc(X.q) + '</b>' + esc(e.q) + '</div>' + row('type', e.type) + row('search', e.search) + row('criteria', e.criteria) + row('synthesis', e.synthesis) + row('gap', e.gap) + '</article>').join('');
    pub.innerHTML = RC.published.map((e) => '<article class="ex-card ex-pub" data-area="' + attr(e.area) + '"><div class="tags">' + tag(e.area) + tag(UI.exPub, 'tag-evidence') + '</div><p class="pub-title" lang="en" dir="ltr">' + esc(e.ref) + '</p>' + row('type', e.type) + row('what', e.what) + row('search', e.search) + row('screened', e.screened) + row('synthesis', e.synthesis) + row('lesson', e.lesson) + '</article>').join('');
  }
  function renderGlossary() {
    const body = $('#gloss-body'); if (!body) return;
    const head = $('#gloss-head'); if (head) head.innerHTML = '<tr>' + UI.glossCols.map((c) => '<th scope="col">' + esc(c) + '</th>').join('') + '</tr>';
    body.innerHTML = (window.LR_GLOSSARY || []).map((g) => {
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
    box.innerHTML = (window.LR_REFS || []).map((g) => '<div class="ref-group"><h3>' + esc(UI.refGroups[g.id]) + '</h3><ol>' + g.items.map((r) => '<li lang="en" dir="ltr">' + linkify(r.text) + ' <span class="tag ref-type" lang="' + RC.lang + '" dir="' + (AR ? 'rtl' : 'ltr') + '">' + esc(UI.refTypes[r.type]) + '</span>' + (r.check === 'pending' ? ' <span class="tag tag-gold ref-type" lang="' + RC.lang + '" dir="' + (AR ? 'rtl' : 'ltr') + '">' + esc(UI.pending) + '</span>' : '') + '</li>').join('') + '</ol></div>').join('');
  }

  /* ---------------- Refresh ---------------- */
  function refresh() {
    const L = E.labels(state, RC);
    $$('[data-pick]').forEach((b) => b.setAttribute('aria-pressed', getPath(state, b.dataset.pick) === b.dataset.id ? 'true' : 'false'));
    $$('label.chk').forEach((l) => { const i = $('input', l); if (i) l.classList.toggle('on', i.checked); });
    const o0 = $('#out-0'); if (o0) o0.textContent = RC.tpl.scope(state, L);
    const o1 = $('#out-1'); if (o1) o1.textContent = RC.tpl.searchSummary(state, L);
    const o2 = $('#out-2'); if (o2) o2.textContent = RC.tpl.screenSummary(E.counts(state));
    ['strings-1', 'strings-2'].forEach((id) => { const n = $('#' + id); if (n) n.innerHTML = stringsHTML(id); });
    renderMatrix(); renderFlow(); renderAppraiseSummaryOnly();
    const ss = $('#synth-step'); if (ss) ss.innerHTML = synthHTML();
    const sm = $('#synth-matrix'); if (sm) sm.innerHTML = synthHTML();
    renderCompare(); renderMap(); refreshGaps();
    if (state.step === 8) { if (!state.s9.edited) renderDraft(false); renderRefine(); }
    renderChecker();
    const sug = E.suggestScores(state, RC);
    RC.rubric.forEach((c) => { const n = $('[data-suggest="' + c.id + '"]'); if (n) n.textContent = UI.suggestedScore + ' ' + RC.numerals[sug[c.id] - 1]; });
    renderResult();
  }
  let raf = null;
  function onChange() { suppressSave = false; save(); if (raf) cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { refresh(); stepperStatus(); }); }

  /* ---------------- Controls ---------------- */
  function wire() {
    $('#btn-next').addEventListener('click', () => { if (validateStep(state.step, true)) goTo(state.step + 1, true); });
    $('#btn-prev').addEventListener('click', () => goTo(state.step - 1, true));
    $('#btn-add-concept').addEventListener('click', () => { if (state.s2.concepts.length < 6) { state.s2.concepts.push({ en: '', ar: '' }); renderConcepts(); onChange(); $('#c-en-' + (state.s2.concepts.length - 1)).focus(); } });
    $('#btn-add-theme').addEventListener('click', () => addTheme(''));
    $('#btn-add-gap').addEventListener('click', () => { state.s7.gaps.push({ id: uid(), type: 'empirical', statement: '', evidence: [] }); renderGaps(); onChange(); const n = $$('#gaps textarea').pop(); if (n) n.focus(); });
    $('#btn-fill-outline').addEventListener('click', fillOutline);
    const d = $('#draft');
    d.addEventListener('input', () => { state.s9.draft = sanitize(d.innerHTML); state.s9.draftText = d.innerText; state.s9.edited = true; save(); renderRefine(); });
    confirmClick($('#btn-regen-draft'), UI.regenConfirm, () => { renderDraft(true); d.innerHTML = sanitize(state.s9.draft); renderRefine(); save(); toast(UI.regenerated); }, () => state.s9.edited);
    $('#btn-copy-draft').addEventListener('click', () => copyText(d.innerText).then(() => toast(UI.copied), () => toast(UI.copyFail)));
    $('#btn-apply-scores').addEventListener('click', () => { state.s10.scores = E.suggestScores(state, RC); fillInputs(); onChange(); toast(UI.scoresApplied); });
    const rep = $('#report');
    rep.addEventListener('input', () => { state.report.html = sanitize(rep.innerHTML); state.report.edited = true; save(); });
    confirmClick($('#btn-regen-report'), UI.regenConfirm, () => { renderReport(true); save(); toast(UI.reportRebuilt); }, () => state.report.edited);
    $('#btn-copy-report').addEventListener('click', () => copyText(rep.innerText).then(() => toast(UI.copied), () => toast(UI.copyFail)));
    $('#btn-print').addEventListener('click', () => window.print());
    $('#btn-doc').addEventListener('click', () => {
      const dir = AR ? 'rtl' : 'ltr';
      const html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>' + esc(UI.report.title) + '</title><style>body{font-family:' + (AR ? 'Arial,"Traditional Arabic"' : 'Calibri,Arial') + ',sans-serif;font-size:11pt;line-height:1.5;direction:' + dir + ';text-align:' + (AR ? 'right' : 'left') + '}h2{font-size:18pt;color:#1F6F6B}h3{font-size:13pt;color:#1F6F6B;margin-top:14pt}h4{font-size:11.5pt}table{border-collapse:collapse;width:100%}td,th{border:1px solid #999;padding:4px;vertical-align:top;font-size:9.5pt}.meta{color:#555;font-size:9pt}</style></head><body dir="' + dir + '" lang="' + RC.lang + '">' + sanitize(rep.innerHTML) + '</body></html>';
      download(UI.fileReport + '.doc', ['﻿', html], 'application/msword');
    });
    $('#btn-txt').addEventListener('click', () => download(UI.fileReport + '.txt', ['﻿', rep.innerText], 'text/plain;charset=utf-8'));
    // Matrix exports
    $$('[data-export="csv"]').forEach((b) => b.addEventListener('click', () => {
      const cols = RC.studyFields;
      const rows = [[UI.status, UI.reason].concat(cols.map((c) => c.t))].concat(state.studies.map((s) => [label(RC.screenStatus, s.status), s.reason].concat(cols.map((c) => c.sel ? label(RC.approaches, s[c.id]) : s[c.id]))));
      download(UI.fileCsv, ['﻿', E.csv(rows)], 'text/csv;charset=utf-8');
    }));
    $$('[data-export="matrix-json"]').forEach((b) => b.addEventListener('click', () => download(UI.fileCsv.replace('.csv', '.json'), [JSON.stringify(state.studies, null, 2)], 'application/json')));
    // Project data
    $$('[data-action="delete"]').forEach((btn) => confirmClick(btn, UI.deleteAll, () => {
      try { localStorage.removeItem(STORE_KEY); } catch (e) { /* ignore */ }
      suppressSave = true; clearTimeout(saveTimer); state = defaults(); fillInputs(); $('#draft').innerHTML = ''; goTo(0, false); updateSaveStatus();
      try { localStorage.removeItem(STORE_KEY); } catch (e) { /* ignore */ }
      toast(UI.deleted);
    }));
    $$('[data-action="export"]').forEach((btn) => btn.addEventListener('click', () => download(UI.fileData, [JSON.stringify(state, null, 2)], 'application/json')));
    const fi = $('#file-import');
    if (fi) fi.addEventListener('change', () => {
      const f = fi.files[0]; if (!f) return;
      const rd = new FileReader();
      rd.onload = () => {
        try { const data = JSON.parse(rd.result); if (!data || data.v !== 1 || !data.s1 || !Array.isArray(data.studies)) throw new Error('bad'); state = merge(defaults(), data); suppressSave = false; fillInputs(); renderDraft(false); goTo(state.step, false); save(true); toast(UI.imported); }
        catch (e) { toast(UI.importFail); }
        fi.value = '';
      };
      rd.readAsText(f);
    });
    $$('[data-lang-switch]').forEach((a) => a.addEventListener('click', () => { save(true); try { localStorage.setItem(LANG_KEY, a.dataset.langSwitch); } catch (e) { /* ignore */ } a.href = a.getAttribute('href').split('#')[0] + (location.hash || ''); }));
    window.addEventListener('beforeunload', () => save(true));
  }

  /* ---------------- Boot ---------------- */
  document.addEventListener('DOMContentLoaded', () => {
    const had = load();
    renderBuilder(); buildDialog(); renderGuides(); renderExamples(); renderGlossary(); renderRefs();
    bind(); fillInputs(); wire();
    goTo(state.step || 0, false); updateSaveStatus();
    if (had && (filled(state.s1.topic) || state.studies.length)) toast(UI.restored);
  });
})();
