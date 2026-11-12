/* =========================================================
   Research Methodology Formulation and Refinement — rule engine
   محرك القواعد لأداة صياغة منهجية البحث وتنقيحها

   Transparent, rule-based logic only: word lists (RC.lex in each
   language file), option metadata (fit, unit, needs, trad) and simple
   consistency rules. No artificial intelligence, no network requests.
   ========================================================= */
window.RME = (function () {
  'use strict';

  const filled = (x) => !!(x && String(x).trim());
  const wc = (s) => (String(s || '').trim().match(/\S+/g) || []).length;

  /* ---------- Text normalisation and cue matching ---------- */
  function norm(s, lang) {
    s = String(s || '').toLowerCase();
    if (lang === 'ar') {
      s = s.replace(/[ً-ْٰـ]/g, '')   // diacritics, tatweel
        .replace(/[إأآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي');
    }
    return s.replace(/[“”"«»()\[\]،,.;:؛؟?!]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  function hits(text, cues, lang) {
    const t = ' ' + norm(text, lang) + ' ';
    const found = [];
    (cues || []).forEach((c) => {
      const cn = norm(c, lang);
      if (!cn) return;
      // Arabic: allow the usual clitics (و ف ب ل ك + ال) before the cue; short
      // cues (3 letters or fewer) must also end at a word boundary.
      const core = lang === 'ar' && cn.length > 4 && cn.indexOf('ال') === 0 ? cn.slice(2) : cn;
      const re = lang === 'ar'
        ? new RegExp('(^|\\s)(و|ف|ب|ل|ك)?(ال)?' + escRe(core) + (core.length <= 3 ? '(?=\\s|$)' : ''))
        : new RegExp('(^|[^a-z])' + escRe(cn) + (cn.length <= 3 ? '(?![a-z])' : ''));
      if (re.test(t) && found.indexOf(c) === -1) found.push(c);
    });
    return found;
  }

  /* ---------- Key-term overlap (very light stemming) ---------- */
  function terms(text, RC) {
    const lang = RC.lang, stop = (RC.lex.stop || []).map((w) => norm(w, lang));
    return norm(text, lang).split(' ').filter(Boolean)
      .map((w) => lang === 'ar' ? w.replace(/^(و|ف|ب|ل|ك)?(ال)/, '').replace(/^(و|ف)(?=..)/, '') : w)
      .filter((w) => w.length >= (lang === 'ar' ? 3 : 4) && stop.indexOf(w) === -1)
      .map((w) => w.slice(0, lang === 'ar' ? 4 : 5));
  }
  function overlap(a, b, RC) {
    const A = new Set(terms(a, RC)), B = new Set(terms(b, RC));
    let n = 0; A.forEach((x) => { if (B.has(x)) n++; });
    return n;
  }

  /* ---------- Approach suggestion (Step 2) ---------- */
  function recommend(st, RC) {
    const s = st.s1, lang = RC.lang, X = RC.lex;
    const all = [s.problem, s.mainQ, s.subQs, s.objectives].join('\n');
    const q = hits(all, X.qual, lang), n = hits(all, X.quant, lang), m = hits(all, X.mixed, lang);
    const lines = [s.mainQ].concat(String(s.subQs || '').split('\n')).filter(filled);
    let ql = 0, nl = 0;
    lines.forEach((l) => {
      const a = hits(l, X.qual, lang).length, b = hits(l, X.quant, lang).length;
      if (a > b) ql++; else if (b > a) nl++;
    });
    const mixedLines = ql > 0 && nl > 0;
    let pick;
    if (q.length + n.length + m.length < 2) pick = 'unclear';
    else if (mixedLines || (m.length && q.length && n.length)) pick = 'mixed';
    else pick = n.length > q.length ? 'quant' : 'qual';
    const conf = (mixedLines || Math.abs(q.length - n.length) >= 3) && pick !== 'unclear' ? 'moderate' : 'low';
    const focus = [s.mainQ, s.subQs, s.objectives, s.problem].join('\n');
    return {
      pick, conf, q, n, m, mixedLines,
      needsPeople: hits(focus, X.people, lang).length > 0,
      needsTexts: hits(focus, X.texts, lang).length > 0
    };
  }

  /* ---------- Resolve selections into option objects ---------- */
  const byId = (arr, id) => (arr || []).find((x) => x.id === id) || null;
  const byIds = (arr, ids) => (arr || []).filter((x) => (ids || []).indexOf(x.id) !== -1);
  function labels(st, RC) {
    const rec = recommend(st, RC);
    const L = {
      approach: byId(RC.approaches, st.s2.approach),
      paradigm: byId(RC.paradigms, st.s3.paradigm),
      design: byId(RC.designs, st.s4.design),
      units: byIds(RC.units, st.s5.units),
      sampling: byIds(RC.sampling, st.s5.strategies),
      collection: byIds(RC.collection, st.s6.methods),
      analysis: byIds(RC.analysis, st.s7.methods),
      dims: byIds(RC.filmDims, st.s7.dims),
      ethics: byIds(RC.ethics, st.s8.ethics),
      quality: byIds(RC.quality, st.s8.quality),
      needsPeople: rec.needsPeople, needsTexts: rec.needsTexts, rec
    };
    L.adequacy = RC.tpl.adequacy(st.s4.design, st.s2.approach);
    L.qualityFrame = RC.tpl.qualityFrame(st.s2.approach);
    L.limitNote = RC.tpl.limitNote(st.s2.approach);
    return L;
  }

  /* Units actually used by the chosen collection methods */
  const collectedUnits = (L) => [...new Set(L.collection.map((c) => c.unit))];
  /* The formal dimensions apply when audiovisual texts are analysed closely */
  const needsDims = (st) => (st.s7.methods || []).some((id) => id === 'film-text' || id === 'semiotic') ||
    ((st.s7.methods || []).indexOf('narr-an') !== -1 && (st.s6.methods || []).some((id) => id === 'av-texts' || id === 'scenes'));

  /* Recommended ethics and quality items for the current choices */
  function recommendedEthics(st, RC) {
    const units = new Set((st.s5.units || []).concat(collectedUnits(labels(st, RC))));
    return RC.ethics.filter((e) => e.id !== 'wellbeing' && e.for.some((u) => units.has(u))).map((e) => e.id);
  }
  function qualityFits(item, st) {
    const a = st.s2.approach;
    if (!a) return true;
    if (item.trad.indexOf(a) !== -1) return true;
    if (item.id === 'icr') return (st.s7.methods || []).indexOf('qca') !== -1 || st.s4.design === 'qca-quant';
    return false;
  }
  function recommendedQuality(st) {
    const a = st.s2.approach, an = st.s7.methods || [];
    const r = [];
    if (a === 'qual' || a === 'mixed') r.push('reflexivity', 'thick', 'audit', 'peer');
    if (a === 'quant' || a === 'mixed') r.push('validity', 'pilot');
    if (a === 'mixed') r.push('meta');
    if (st.s4.design === 'qca-quant' || (an.indexOf('stats') !== -1 && (st.s6.methods || []).indexOf('coding-frame') !== -1)) r.push('icr');
    if (an.indexOf('rta') !== -1 || an.indexOf('qca') !== -1) r.push('pilot');
    if ((st.s6.methods || []).length > 1 && a !== 'quant') r.push('triang');
    r.push('transparency');
    return [...new Set(r)];
  }

  /* ---------- Consistency checks ---------- */
  function checks(st, RC) {
    const C = RC.chk, L = labels(st, RC), rec = L.rec, out = [];
    const add = (id, status, key) => out.push({ id, status, t: C[id].t, msg: C[id][key || status] });
    const s1 = st.s1, a = st.s2.approach;

    // Problem and questions
    add('problemQ', filled(s1.problem) && filled(s1.mainQ) && filled(s1.objectives) ? 'ok' : 'bad');
    if (filled(s1.mainQ) && (filled(s1.problem) || filled(s1.objectives))) {
      add('alignPQ', overlap(s1.mainQ, s1.problem + ' ' + s1.objectives, RC) >= 2 ? 'ok' : 'warn');
    }
    // Approach
    if (!a) add('approachSet', 'bad');
    else add('approachSet', wc(st.s2.just) >= 15 ? 'ok' : 'warn');
    if (a) {
      if (rec.pick === 'unclear') add('approachFit', 'info');
      else add('approachFit', rec.pick === a || (a === 'mixed' && rec.mixedLines) ? 'ok' : 'warn');
    }
    // Paradigm
    if (!st.s3.paradigm) add('paradigmFit', 'info');
    else if (a && L.paradigm) add('paradigmFit', L.paradigm.fit.indexOf(a) !== -1 ? 'ok' : 'warn');
    // Design
    if (!L.design) add('designFit', 'info');
    else if (a) add('designFit', L.design.fit.indexOf(a) !== -1 ? 'ok' : 'bad');
    if (L.design) add('designWhy', wc(st.s4.rationale) >= 15 ? 'ok' : 'warn');
    if (a === 'mixed' && (L.collection.length || L.analysis.length)) {
      const qualM = L.collection.some((c) => c.fam === 'qual') || L.analysis.some((x) => x.fam === 'qual');
      const quantM = L.collection.some((c) => c.fam === 'quant') || L.analysis.some((x) => x.fam === 'quant') || st.s4.design === 'qca-quant';
      const integ = (st.s7.methods || []).indexOf('integration') !== -1;
      add('mixedStrands', qualM && quantM && integ ? 'ok' : 'bad');
    }
    // Sampling
    if (L.sampling.length || filled(st.s5.include) || filled(st.s5.size)) {
      add('samplingSet', L.sampling.length && filled(st.s5.include) && filled(st.s5.size) ? 'ok' : 'warn');
    }
    if ((st.s5.strategies || []).indexOf('theoretical') !== -1 && st.s4.design && st.s4.design !== 'grounded') add('theoretical', 'warn');
    if ((st.s5.strategies || []).indexOf('convenience') !== -1) add('convenience', 'warn');
    if ((st.s5.strategies || []).indexOf('probability') !== -1 && a === 'qual') add('probQual', 'info');
    if (L.collection.length && (st.s5.units || []).length) {
      const missing = collectedUnits(L).filter((u) => st.s5.units.indexOf(u) === -1);
      add('unitsMatch', missing.length ? 'warn' : 'ok');
    }
    // Questions ↔ data
    if (L.collection.length) {
      const hasPeople = L.collection.some((c) => c.unit === 'people');
      const hasTexts = L.collection.some((c) => c.unit === 'texts' || c.unit === 'docs' || c.unit === 'online');
      if (rec.needsPeople && !hasPeople && !hasTexts) add('questionData', 'warn');
      else if (rec.needsPeople && !hasPeople && !rec.needsTexts) add('questionData', 'warn');
      else if (rec.needsTexts && !hasTexts && !rec.needsPeople) add('questionData', 'warn', 'warn2');
      else add('questionData', 'ok');
    }
    // Analysis ↔ data
    if (L.analysis.length && L.collection.length) {
      const units = new Set(collectedUnits(L));
      const quantData = L.collection.some((c) => c.fam === 'quant' || c.id === 'coding-frame') || st.s4.design === 'qca-quant';
      const bad = L.analysis.some((x) => {
        if (x.id === 'stats') return !quantData;
        if (x.id === 'integration') return a !== 'mixed';
        return !x.needs.some((u) => units.has(u));
      });
      add('analysisFit', bad ? 'warn' : 'ok');
    }
    if (needsDims(st)) add('filmDims', (st.s7.dims || []).length ? 'ok' : 'warn');
    // Ethics
    const allUnits = new Set((st.s5.units || []).concat(collectedUnits(L)));
    const eth = st.s8.ethics || [];
    if (allUnits.has('people')) add('ethicsPeople', ['consent', 'confid', 'approval'].every((x) => eth.indexOf(x) !== -1) ? 'ok' : 'bad');
    if (allUnits.has('texts')) add('ethicsTexts', eth.indexOf('copyright') !== -1 ? 'ok' : 'warn');
    if (allUnits.has('online')) add('ethicsOnline', eth.indexOf('online-ethics') !== -1 ? 'ok' : 'warn');
    // Quality
    const q = st.s8.quality || [];
    if (st.step >= 7 || q.length) add('qualitySet', q.length ? 'ok' : 'bad');
    if (q.length) {
      const an = st.s7.methods || [];
      if (an.indexOf('rta') !== -1 && q.indexOf('icr') !== -1 && an.indexOf('qca') === -1 && st.s4.design !== 'qca-quant') add('rtaIcr', 'warn');
      else if ((st.s4.design === 'qca-quant') && q.indexOf('icr') === -1) add('rtaIcr', 'warn', 'warn2');
      else if (a === 'mixed' && q.indexOf('meta') === -1) add('rtaIcr', 'warn', 'warn3');
      else add('rtaIcr', 'ok');
    }
    if (st.s4.design === 'grounded' && filled(s1.theory)) add('gtTheory', 'info');
    // Feasibility
    if (st.step >= 8 || filled(st.s9.limits)) add('limits', wc(st.s9.limits) >= 8 ? 'ok' : 'warn');
    if (L.collection.length || L.analysis.length) add('procedure', wc(st.s6.procedure) >= 10 && wc(st.s7.procedure) >= 10 ? 'ok' : 'warn');
    return out;
  }

  /* ---------- Suggested rubric scores (Step 10) ---------- */
  const MAP = {
    problem: ['problemQ', 'alignPQ'],
    questions: ['approachFit', 'questionData', 'alignPQ'],
    approach: ['approachSet', 'approachFit', 'paradigmFit'],
    design: ['designFit', 'designWhy', 'mixedStrands'],
    sampling: ['samplingSet', 'theoretical', 'convenience', 'probQual', 'unitsMatch'],
    collection: ['questionData', 'unitsMatch', 'procedure'],
    analysis: ['analysisFit', 'filmDims', 'mixedStrands'],
    ethics: ['ethicsPeople', 'ethicsTexts', 'ethicsOnline'],
    rigour: ['qualitySet', 'rtaIcr'],
    feasibility: ['limits', 'procedure']
  };
  const REQUIRED = {
    problem: (st) => filled(st.s1.problem), questions: (st) => filled(st.s1.mainQ), approach: (st) => !!st.s2.approach,
    design: (st) => !!st.s4.design, sampling: (st) => (st.s5.strategies || []).length > 0, collection: (st) => (st.s6.methods || []).length > 0,
    analysis: (st) => (st.s7.methods || []).length > 0, ethics: (st) => (st.s8.ethics || []).length > 0, rigour: (st) => (st.s8.quality || []).length > 0,
    feasibility: (st) => filled(st.s9.limits)
  };
  function suggestScores(st, RC) {
    const list = checks(st, RC), out = {};
    RC.rubric.forEach((c) => {
      if (!REQUIRED[c.id](st)) { out[c.id] = 1; return; }
      let s = 5;
      list.filter((x) => MAP[c.id].indexOf(x.id) !== -1).forEach((x) => { if (x.status === 'bad') s -= 2; else if (x.status === 'warn') s -= 1; });
      out[c.id] = Math.max(1, Math.min(5, s));
    });
    return out;
  }

  /* ---------- Draft refinement (Step 9) ---------- */
  function refine(sections, RC) {
    const R = RC.refine, msgs = [];
    const all = sections.map((s) => s.p).join(' ');
    const br = (all.match(/\[[^\]]+\]/g) || []).length;
    if (br) msgs.push({ status: 'warn', msg: R.brackets(br) });
    sections.forEach((s, i) => {
      if (/\[[^\]]+\]/.test(s.p)) return;
      if ([0, 2, 4, 5, 6].indexOf(i) !== -1 && wc(s.p) < 25) msgs.push({ status: 'warn', msg: R.short(s.h) });
      if ([0, 2, 4].indexOf(i) !== -1 && !hits(s.p, RC.lex.just, RC.lang).length) msgs.push({ status: 'info', msg: R.noJust(s.h) });
    });
    const v = hits(all, RC.lex.vague, RC.lang);
    if (v.length) msgs.push({ status: 'warn', msg: R.vague(v.join(RC.lang === 'ar' ? '، ' : ', ')) });
    if (!msgs.length) msgs.push({ status: 'ok', msg: R.ok });
    return msgs;
  }

  return { norm, hits, overlap, wc, recommend, labels, checks, suggestScores, refine, recommendedEthics, recommendedQuality, qualityFits, needsDims };
})();
