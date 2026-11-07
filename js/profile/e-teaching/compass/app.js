/* =========================================================
   Research Problem Compass — shared application logic
   بوصلة المشكلة البحثية — المنطق المشترك
   Prepared by Dr. Mervat Alardawi | إعداد د. مرفت العرضاوي

   Language-specific content (data, labels, sentence builders)
   lives in js/i18n-ar.js and js/i18n-en.js, which each define
   window.RC. This file is language-neutral.
   ========================================================= */
(function () {
  'use strict';

  const RC = window.RC;
  if (!RC) { console.error('Research Compass: language file not loaded.'); return; }
  const UI = RC.ui;

  const FIELD_KEYS = ['topic', 'setting', 'sample', 'context', 'prev', 'missing', 'consequence', 'beneficiaries'];

  /* ---------- State ---------- */
  const emptyFields = () => ({ topic: '', setting: '', sample: '', theory: '', context: '', prev: '', missing: '', consequence: '', beneficiaries: '' });
  const state = {
    step: 0, site: '', gap: '', ptype: 'theoretical', approach: 'qual', design: '',
    f: emptyFields(),
    atype: '', lab: { field: '', assumption: '', alt: '' },
    checks: {}
  };

  /* ---------- Helpers ---------- */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; };

  /* ---------- Static info sections ---------- */
  function renderInfo() {
    const sitesInfo = $('#sites-info');
    RC.sites.forEach((s) => {
      sitesInfo.appendChild(el('div', 'site-card',
        '<strong>' + esc(s.t) + '</strong><span class="d">' + esc(s.d) + '</span><span class="ex">' + esc(UI.example) + esc(s.ex) + '</span>'));
    });

    const gapsInfo = $('#gaps-info');
    RC.gaps.forEach((g, i) => {
      gapsInfo.appendChild(el('article', 'gap-card',
        '<div class="gh"><span class="num">' + RC.numerals[i] + '</span><strong>' + esc(g.t) + '</strong></div>' +
        '<span class="d">' + esc(g.d) + '</span>' +
        '<span class="ex">' + esc(UI.inFilm) + esc(g.ex) + '</span>'));
    });

    const cases = $('#cases');
    RC.cases.forEach((c) => {
      cases.appendChild(el('article', 'case-card',
        '<div class="case-tags"><span class="m">' + esc(c.method) + '</span><span class="g">' + esc(c.gap) + '</span></div>' +
        '<strong class="t">' + esc(c.t) + '</strong>' +
        '<span class="how">' + esc(c.how) + '</span>' +
        '<span class="lesson"><strong>' + esc(UI.lesson) + '</strong> ' + esc(c.lesson) + '</span>'));
    });

    const refs = $('#refs-list');
    RC.refs.forEach((g) => {
      const box = el('div', 'ref-group', '<h3>' + esc(g.t) + '</h3>');
      const ol = document.createElement('ol');
      g.items.forEach((r) => {
        const linked = esc(r).replace(/(https:\/\/doi\.org\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
        const li = el('li', '', linked);
        li.setAttribute('lang', 'en');
        li.setAttribute('dir', 'ltr');
        ol.appendChild(li);
      });
      box.appendChild(ol);
      refs.appendChild(box);
    });
  }

  /* ---------- Selectable cards / pills ---------- */
  function chipGroup(container, items, opts) {
    container.innerHTML = '';
    items.forEach((it) => {
      const b = el('button', 'chip' + (opts.compact ? ' compact' : ''), opts.html(it));
      b.type = 'button';
      b.dataset.id = it.id;
      b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', () => opts.onPick(it.id));
      container.appendChild(b);
    });
  }
  function pillGroup(container, items, onPick) {
    container.innerHTML = '';
    items.forEach((it) => {
      const b = el('button', 'pill', esc(it.t));
      b.type = 'button';
      b.dataset.id = it.id;
      b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', () => onPick(it.id));
      container.appendChild(b);
    });
  }
  function markChips(container, selected) {
    $$('.chip, .pill', container).forEach((b) => {
      const on = b.dataset.id === selected;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  /* ---------- Wizard ---------- */
  function renderStepper() {
    const stepper = $('#stepper');
    stepper.innerHTML = '';
    RC.stepNames.forEach((t, i) => {
      const cls = 'stepdot' + (i === state.step ? ' on' : (i < state.step ? ' done' : ''));
      const b = el('button', cls, '<span class="num">' + RC.numerals[i] + '</span><span>' + esc(t) + '</span>');
      b.type = 'button';
      if (i === state.step) b.setAttribute('aria-current', 'step');
      b.addEventListener('click', () => goTo(i, true));
      stepper.appendChild(b);
    });
    const progress = $('#progress');
    progress.innerHTML = '';
    RC.stepNames.forEach((t, i) => progress.appendChild(el('span', 'seg' + (i <= state.step ? ' on' : ''))));
  }

  function goTo(i, focusHeading) {
    state.step = Math.max(0, Math.min(5, i));
    $$('.step').forEach((s) => { s.hidden = Number(s.dataset.step) !== state.step; });
    $('#prev-btn').hidden = state.step === 0;
    $('#next-btn').hidden = state.step === 5;
    renderStepper();
    if (state.step === 5) renderOutput();
    if (focusHeading) {
      const h = $('.step[data-step="' + state.step + '"] h3');
      if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    }
  }

  function currentSelections() {
    return {
      siteSel: RC.sites.find((x) => x.id === state.site) || null,
      gapSel: RC.gaps.find((x) => x.id === state.gap) || null,
      des: RC.designs[state.approach].find((x) => x.id === state.design) || null
    };
  }

  function renderDesigns() {
    chipGroup($('#designs-pick'), RC.designs[state.approach], {
      html: (d) => '<strong>' + esc(d.t) + '</strong><span>' + esc(d.when) + '</span><span class="src-tag">' + esc(d.src) + '</span>',
      onPick: (id) => { state.design = id; markChips($('#designs-pick'), id); }
    });
    markChips($('#designs-pick'), state.design);
  }

  function updateSampleField() {
    const site = currentSelections().siteSel;
    $('#sample-label').textContent = site ? site.sl : UI.sampleLabel;
    $('#f-sample').placeholder = site ? site.sp : UI.samplePh;
  }

  function updateGapDetail() {
    const g = currentSelections().gapSel;
    const box = $('#gap-detail');
    if (!g) { box.hidden = true; return; }
    box.hidden = false;
    box.innerHTML = '<strong>' + esc(g.t) + ':</strong> ' + esc(g.d) + UI.exampleSep + esc(g.ex);
  }

  let lastFullText = '';
  function renderOutput() {
    const sel = currentSelections();
    const o = RC.compose(state, sel);

    const filled = FIELD_KEYS.filter((k) => state.f[k] && state.f[k].trim()).length +
      (state.site ? 1 : 0) + (state.gap ? 1 : 0) + (state.design ? 1 : 0);
    const pct = Math.round(filled / 11 * 100);

    lastFullText =
      UI.copyHeads.statement + '\n' + o.statement.map((p) => p.text).join(' ') +
      '\n\n' + UI.copyHeads.purpose + '\n' + o.purpose +
      '\n\n' + UI.copyHeads.questions + '\n' + o.questions.map((q) => q.k + ': ' + q.t).join('\n') +
      '\n\n' + UI.copyHeads.credit;

    $('#statement').innerHTML = o.statement.map((p) =>
      '<div class="st-row"><span class="st-label">' + esc(p.label) + '</span><p>' + esc(p.text) + '</p></div>').join('');
    $('#purpose').textContent = o.purpose;
    $('#questions').innerHTML = o.questions.map((q) =>
      '<div class="q-item"><span class="k">' + esc(q.k) + '</span><span class="t">' + esc(q.t) + '</span></div>').join('');
    $('#warnings').innerHTML = o.warnings.map((w) => '<li>' + esc(w) + '</li>').join('');
    $('#filled-pct').textContent = UI.filled(pct);
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise((resolve) => {
      const ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (e) { /* ignore */ }
      document.body.removeChild(ta); resolve();
    });
  }

  function initWizard() {
    chipGroup($('#sites-pick'), RC.sites, {
      html: (s) => '<strong class="lg">' + esc(s.t) + '</strong><span class="md">' + esc(s.d) + '</span>',
      onPick: (id) => { state.site = id; markChips($('#sites-pick'), id); updateSampleField(); }
    });
    chipGroup($('#gaps-pick'), RC.gaps, {
      compact: true,
      html: (g) => '<strong>' + esc(g.t) + '</strong><span>' + esc(g.short) + '</span>',
      onPick: (id) => { state.gap = id; markChips($('#gaps-pick'), id); updateGapDetail(); }
    });
    pillGroup($('#ptype-pick'), RC.ptypes, (id) => { state.ptype = id; markChips($('#ptype-pick'), id); });
    markChips($('#ptype-pick'), state.ptype);
    pillGroup($('#approach-pick'), RC.approaches, (id) => {
      state.approach = id; state.design = ''; markChips($('#approach-pick'), id); renderDesigns();
    });
    markChips($('#approach-pick'), state.approach);
    renderDesigns();

    $$('[data-key]').forEach((inp) => {
      inp.addEventListener('input', () => { state.f[inp.dataset.key] = inp.value; });
    });

    $('#prev-btn').addEventListener('click', () => goTo(state.step - 1, true));
    $('#next-btn').addEventListener('click', () => goTo(state.step + 1, true));

    $('#copy-btn').addEventListener('click', () => {
      const btn = $('#copy-btn');
      copyText(lastFullText).then(() => {
        btn.textContent = UI.copied;
        setTimeout(() => { btn.textContent = UI.copy; }, 2000);
      });
    });

    $('#reset-btn').addEventListener('click', () => {
      Object.assign(state, { site: '', gap: '', design: '', ptype: 'theoretical', approach: 'qual', f: emptyFields() });
      $$('[data-key]').forEach((inp) => { inp.value = ''; });
      markChips($('#sites-pick'), ''); markChips($('#gaps-pick'), '');
      markChips($('#ptype-pick'), 'theoretical'); markChips($('#approach-pick'), 'qual');
      renderDesigns(); updateSampleField(); updateGapDetail();
      goTo(0, true);
    });

    goTo(0, false);
  }

  /* ---------- Problematization lab ---------- */
  function renderLab() {
    const out = RC.labQuestions(state.lab, state.atype);
    $('#lab-out').innerHTML = out.map((t, i) =>
      '<div class="lab-row"><span class="n">' + RC.numerals[i] + '</span><span>' + esc(t) + '</span></div>').join('');
  }

  function initLab() {
    chipGroup($('#assume-pick'), RC.assumes, {
      compact: true,
      html: (a) => '<strong>' + esc(a.t) + '</strong><span>' + esc(a.d) + '</span>',
      onPick: (id) => {
        state.atype = id;
        markChips($('#assume-pick'), id);
        const a = RC.assumes.find((x) => x.id === id);
        const box = $('#assume-detail');
        box.hidden = false;
        box.textContent = UI.filmExample + a.ex;
        renderLab();
      }
    });
    $$('[data-lab]').forEach((inp) => {
      inp.addEventListener('input', () => { state.lab[inp.dataset.lab] = inp.value; renderLab(); });
    });
    renderLab();
  }

  /* ---------- Quality checklist ---------- */
  function renderScore() {
    const score = RC.checks.filter((c) => state.checks[c.id]).length;
    $('#score').textContent = score + ' / ' + RC.checks.length;
    const meter = $('#meter');
    meter.innerHTML = '';
    RC.checks.forEach((c, i) => meter.appendChild(el('span', 'mseg' + (i < score ? ' on' : ''))));
    const L = UI.levels;
    const level = score >= 11 ? L[0] : score >= 8 ? L[1] : score >= 5 ? L[2] : L[3];
    $('#level-title').textContent = level.t;
    $('#level-desc').textContent = level.d;
    const missing = RC.checks.filter((c) => !state.checks[c.id]).slice(0, 3);
    $('#improve-box').hidden = missing.length === 0;
    $('#improve').innerHTML = missing.map((c) => '<li>' + esc(c.t) + '</li>').join('');
  }

  function initChecks() {
    const box = $('#checks');
    RC.checks.forEach((c) => {
      const lbl = el('label', 'chk');
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.addEventListener('change', () => {
        state.checks[c.id] = cb.checked;
        lbl.classList.toggle('on', cb.checked);
        renderScore();
      });
      lbl.appendChild(cb);
      lbl.appendChild(el('span', 'txt', '<strong>' + esc(c.t) + '</strong><span>' + esc(c.d) + '</span>'));
      box.appendChild(lbl);
    });
    renderScore();
  }

  /* ---------- Boot ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    renderInfo();
    initWizard();
    initLab();
    initChecks();
  });
})();
