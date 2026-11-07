/* =========================================================
   Research Question Formulation and Refinement — rule-based analyzer
   صياغة وتنقيح أسئلة البحث — المحلّل القائم على القواعد

   Transparent, rule-based checks (no AI, no network). Every rule
   uses the word lists and patterns in RC.lex of the active language
   file, so the logic can be read, audited and edited.
   ========================================================= */
(function () {
  'use strict';

  function norm(s) {
    const L = window.RC.lex;
    let t = String(s || '').toLowerCase();
    if (L.normalize) t = L.normalize(t);
    return t;
  }

  /* Meaningful tokens: letters only, no stop words, length >= 3, light stemming. */
  function tokens(s) {
    const L = window.RC.lex;
    const words = norm(s).split(/[^\p{L}\p{N}]+/u).filter(Boolean);
    const out = [];
    words.forEach((w) => {
      let x = L.stem ? L.stem(w) : w;
      if (x.length >= 3 && L.stop.indexOf(x) === -1 && L.stop.indexOf(w) === -1) out.push(x);
    });
    return out;
  }
  function overlap(a, b) {
    const A = new Set(tokens(a));
    const B = new Set(tokens(b));
    let n = 0;
    A.forEach((t) => { if (B.has(t)) n++; });
    return n;
  }
  function jaccard(a, b) {
    const A = new Set(tokens(a)), B = new Set(tokens(b));
    if (!A.size || !B.size) return 0;
    let n = 0; A.forEach((t) => { if (B.has(t)) n++; });
    return n / (A.size + B.size - n);
  }
  function wordCount(s) { return String(s || '').trim().split(/\s+/).filter(Boolean).length; }

  /* Detect individual issues in one question. */
  function detect(q, ctx) {
    const L = window.RC.lex;
    const text = String(q || '').trim();
    const n = norm(text);
    const wc = wordCount(text);
    const has = (re) => re.test(n);
    const qmarks = (text.match(/[?؟]/g) || []).length;
    const vagueHits = L.vague.filter((v) => new RegExp('(^|[^\\p{L}])' + v + '($|[^\\p{L}])', 'u').test(n));
    const ctxTokens = (ctx.context || '') + ' ' + (ctx.timeframe || '');
    const issues = {
      empty: !text,
      tooShort: !!text && wc < L.minWords,
      tooLong: wc > L.maxWords,
      noQmark: !!text && qmarks === 0,
      closed: has(L.closed),
      why: has(L.why),
      double: qmarks > 1 || has(L.double),
      vague: vagueHits.length > 0,
      leading: has(L.leading),
      opinion: has(L.opinion),
      quantWords: has(L.quant),
      qualWords: has(L.qual),
      noContext: !!text && !!ctx.context && overlap(text, ctxTokens) === 0,
      noSource: !!text && !!ctx.population && overlap(text, ctx.population) === 0,
      noTime: !!text && !has(L.time) && !(ctx.timeframe && overlap(text, ctx.timeframe) > 0),
      notConnected: !!text && (ctx.problem || ctx.phenomenon) ? overlap(text, (ctx.problem || '') + ' ' + (ctx.phenomenon || '')) === 0 : false,
      orientMismatch: false
    };
    if (ctx.orientation && L.orient[ctx.orientation] && text) {
      issues.orientMismatch = !L.orient[ctx.orientation].test(n);
    }
    issues.methodMismatch = !!text && (
      (ctx.approach === 'qual' && (issues.quantWords || issues.closed)) ||
      (ctx.approach === 'quant' && issues.qualWords && !issues.quantWords)
    );
    issues._vagueHits = vagueHits;
    issues._wc = wc;
    return issues;
  }

  /* Evaluate the eight refinement dimensions. status: ok | warn | bad | info */
  function analyze(q, ctx) {
    const M = window.RC.msg;
    const i = detect(q, ctx);
    const dims = [];
    const push = (id, status, keys) => {
      const parts = keys.map((k) => M.issues[k]).filter(Boolean);
      dims.push({
        id, status,
        title: M.dims[id],
        msg: status === 'ok' ? M.ok[id] : parts.map((p) => p.d).join(' '),
        rec: status === 'ok' ? '' : parts.map((p) => p.r).join(' ')
      });
    };
    if (i.empty) {
      ['clarity', 'specificity', 'scope', 'alignment', 'theory', 'method', 'feasibility', 'contribution'].forEach((d) => push(d, 'bad', ['empty']));
      return { dims, issues: i };
    }

    // 1. Clarity of wording
    const cKeys = [];
    if (i.double) cKeys.push('double');
    if (i.leading) cKeys.push('leading');
    if (i.tooLong) cKeys.push('tooLong');
    if (i.noQmark) cKeys.push('noQmark');
    if (i.opinion) cKeys.push('opinion');
    push('clarity', (i.double || i.leading) ? 'bad' : (cKeys.length ? 'warn' : 'ok'), cKeys);

    // 2. Specificity
    const sKeys = [];
    if (i.vague) sKeys.push('vague');
    if (i.tooShort) sKeys.push('tooShort');
    if (i.noSource) sKeys.push('noSource');
    push('specificity', sKeys.length >= 2 ? 'bad' : (sKeys.length ? 'warn' : 'ok'), sKeys);

    // 3. Scope and boundaries
    const scKeys = [];
    if (i.noContext) scKeys.push('noContext');
    if (i.noTime) scKeys.push('noTime');
    push('scope', i.noContext ? 'warn' : (i.noTime ? 'info' : 'ok'), scKeys);

    // 4. Alignment with the research problem
    push('alignment', i.notConnected ? 'warn' : 'ok', i.notConnected ? ['notConnected'] : []);

    // 5. Theoretical relevance
    if (!ctx.theory) push('theory', 'info', ['noTheory']);
    else if (overlap(q, ctx.theory) === 0 && (ctx.orientation === 'interpretive' || ctx.orientation === 'explanatory')) push('theory', 'info', ['theoryAbsent']);
    else push('theory', 'ok', []);

    // 6. Methodological appropriateness
    const mKeys = [];
    if (i.methodMismatch) mKeys.push(ctx.approach === 'quant' ? 'quantNeedsMeasure' : (i.closed ? 'closed' : 'quantInQual'));
    if (i.why && ctx.orientation !== 'explanatory') mKeys.push('why');
    if (i.orientMismatch) mKeys.push('orientMismatch');
    if (ctx.approach === 'mixed' && !(ctx.mixed && ctx.mixed.integ)) mKeys.push('noIntegration');
    push('method', i.methodMismatch ? 'bad' : (mKeys.length ? 'warn' : 'ok'), mKeys);

    // 7. Feasibility (self-reported checks + data source)
    const f = ctx.feas || {};
    const fKeys = [];
    if (!f.access) fKeys.push('feasAccess');
    if (!f.time) fKeys.push('feasTime');
    if (!f.skills) fKeys.push('feasSkills');
    push('feasibility', fKeys.length >= 2 ? 'bad' : (fKeys.length ? 'warn' : 'ok'), fKeys);

    // 8. Potential scholarly contribution
    const gapOK = ctx.gap && wordCount(ctx.gap) >= 4 && overlap(q, ctx.gap + ' ' + (ctx.context || '')) > 0;
    push('contribution', gapOK ? 'ok' : 'warn', gapOK ? [] : ['contribution']);

    return { dims, issues: i };
  }

  /* Suggested 1–5 scores for the evaluation rubric, derived from the dimensions. */
  function suggestScores(res, ctx, aim, q) {
    const s = { ok: 4, info: 3, warn: 3, bad: 2 };
    const d = {};
    res.dims.forEach((x) => { d[x.id] = s[x.status]; });
    const aimOverlap = aim && q ? overlap(aim, q) : 0;
    return {
      clarity: d.clarity,
      focus: Math.min(d.specificity, d.scope),
      relevance: d.alignment,
      aim: res.issues.orientMismatch ? 3 : (aimOverlap > 0 ? 4 : 3),
      theory: d.theory,
      method: d.method,
      feasibility: d.feasibility,
      significance: d.contribution
    };
  }

  /* Compare an initial and a refined question; return change notes. */
  function compare(a, b, ctx) {
    const M = window.RC.msg;
    const ia = detect(a, ctx), ib = detect(b, ctx);
    const keys = ['closed', 'double', 'vague', 'leading', 'why', 'tooShort', 'tooLong', 'noContext', 'noSource', 'noTime', 'notConnected', 'methodMismatch', 'orientMismatch', 'noQmark', 'opinion'];
    const rows = [];
    keys.forEach((k) => {
      if (ia[k] && !ib[k]) rows.push({ type: 'resolved', label: M.issues[k] ? M.issues[k].t : k, why: M.resolved[k] || '' });
      else if (!ia[k] && ib[k]) rows.push({ type: 'introduced', label: M.issues[k] ? M.issues[k].t : k, why: M.issues[k] ? M.issues[k].r : '' });
      else if (ia[k] && ib[k]) rows.push({ type: 'remaining', label: M.issues[k] ? M.issues[k].t : k, why: M.issues[k] ? M.issues[k].r : '' });
    });
    const added = [...new Set(tokens(b))].filter((t) => tokens(a).indexOf(t) === -1);
    const removed = [...new Set(tokens(a))].filter((t) => tokens(b).indexOf(t) === -1);
    return { rows, ia, ib, added, removed, wcA: ia._wc || 0, wcB: ib._wc || 0 };
  }

  window.RQA = { detect, analyze, suggestScores, compare, overlap, jaccard, tokens, wordCount };
})();
