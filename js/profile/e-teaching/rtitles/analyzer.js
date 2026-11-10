/* =========================================================
   Refining and Formulating Research Titles — rule-based analyzer
   تنقيح وصياغة عناوين البحوث — المحلّل القائم على القواعد

   Transparent, rule-based checks (no AI, no network). Every rule
   uses the word lists and patterns in RC.lex of the active language
   file, so the logic can be read, audited and edited.
   Academic tool developed by Dr. Merfat Alardawi | د. مرفت العرضاوي
   ========================================================= */
(function () {
  'use strict';

  const L = () => window.RC.lex;

  function norm(s) {
    let t = String(s || '').toLowerCase();
    if (L().normalize) t = L().normalize(t);
    return t;
  }

  /* Meaningful tokens: letters/digits only, no stop words, length >= 3, light stemming. */
  function tokens(s) {
    const lx = L();
    const words = norm(s).split(/[^\p{L}\p{N}]+/u).filter(Boolean);
    const out = [];
    words.forEach((w) => {
      const x = lx.stem ? lx.stem(w) : w;
      if (x.length >= 3 && lx.stop.indexOf(x) === -1 && lx.stop.indexOf(w) === -1) out.push(x);
    });
    return out;
  }
  function overlap(a, b) {
    const A = new Set(tokens(a)), B = new Set(tokens(b));
    let n = 0; A.forEach((t) => { if (B.has(t)) n++; });
    return n;
  }
  function jaccard(a, b) {
    const A = new Set(tokens(a)), B = new Set(tokens(b));
    if (!A.size || !B.size) return 0;
    let n = 0; A.forEach((t) => { if (B.has(t)) n++; });
    return n / (A.size + B.size - n);
  }
  /* Original words of `a` whose stems do not occur in any of the `others` (for readable concept lists). */
  function uniqueWords(a, others) {
    const seen = new Set();
    const otherToks = new Set([].concat(...others.map(tokens)));
    const out = [];
    String(a || '').split(/[^\p{L}\p{N}'’-]+/u).forEach((w) => {
      const t = tokens(w)[0];
      if (!t || otherToks.has(t) || seen.has(t)) return;
      seen.add(t); out.push(w);
    });
    return out;
  }
  function wordCount(s) { return String(s || '').trim().split(/\s+/).filter(Boolean).length; }

  /* Whole-word / phrase search in normalised text. The language file may
     allow attached prefixes and suffixes (e.g. Arabic و/ب/ال … ـه/ـها). */
  const reCache = {};
  function hits(n, list) {
    const lx = L();
    const pre = lx.prefix || '', suf = lx.suffix || '';
    return list.filter((p) => {
      const key = window.RC.lang + '|' + p;
      if (!reCache[key]) reCache[key] = new RegExp('(^|[^\\p{L}\\p{N}])' + pre + norm(p).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + suf + '($|[^\\p{L}\\p{N}])', 'u');
      return reCache[key].test(n);
    });
  }
  /* Keep only the longest matches (drop a hit contained in another hit). */
  const longest = (arr) => arr.filter((h) => !arr.some((o) => o !== h && o.indexOf(h) !== -1));

  /* Detect individual issues in one title. ctx carries the researcher's own inputs. */
  function detect(title, ctx) {
    const lx = L();
    const text = String(title || '').trim();
    const n = norm(text);
    const wc = wordCount(text);
    ctx = ctx || {};
    const toks = tokens(text);
    const counts = {};
    toks.forEach((t) => { counts[t] = (counts[t] || 0) + 1; });
    const repeated = Object.keys(counts).filter((t) => counts[t] > 1 && lx.allowRepeat.indexOf(t) === -1);
    const acronyms = (text.match(/\b[A-Z][A-Z0-9]{1,6}s?\b/g) || []).filter((a) => lx.knownAcronyms.indexOf(a.replace(/s$/, '')) === -1);
    const methodHits = longest(hits(n, lx.methodTerms));
    const colons = (text.match(/[:：]/g) || []).length;
    const conj = (n.match(lx.conjunction) || []).length;
    const reflectBase = [ctx.phenomenon, ctx.focus, ctx.concepts].join(' ');
    const ctxBase = [ctx.context, ctx.timeframe].join(' ');

    const i = {
      empty: !text,
      tooShort: !!text && wc < lx.minWords,
      long: wc > lx.idealMax && wc <= lx.maxWords,
      tooLong: wc > lx.maxWords,
      endPeriod: /[.。]$/.test(text),
      question: /[?؟]\s*$/.test(text),
      vague: hits(n, lx.vague).length > 0,
      filler: hits(n, lx.filler).length > 0,
      redundant: repeated.length > 0,
      promo: hits(n, lx.promo).length > 0,
      evaluative: hits(n, lx.evaluative).length > 0,
      causal: hits(n, lx.causal).length > 0,
      abbrev: acronyms.length > 0,
      colonHeavy: colons > 1,
      listy: conj > lx.maxConj,
      methodOverload: methodHits.length > 2,
      methodMismatch: false,
      methodNotWanted: false,
      methodMissing: false,
      theoryMissing: false,
      theoryNotWanted: false,
      notReflect: !!text && reflectBase.trim() ? overlap(text, reflectBase) === 0 : false,
      noContext: !!text && !!(ctx.context && ctx.context.trim()) && overlap(text, ctxBase + ' ' + (ctx.material || '')) === 0,
      noMaterial: !!text && !!(ctx.material && ctx.material.trim()) && overlap(text, ctx.material) === 0,
      noDiscipline: !!text && hits(n, lx.discipline).length === 0 && overlap(text, ctx.material || '') === 0,
      noKeywords: false
    };

    // Method wording vs. the proposed approach
    const quantW = hits(n, lx.quantTerms).length > 0;
    const qualW = hits(n, lx.qualTerms).length > 0;
    if (text && ctx.approach === 'qual' && quantW) i.methodMismatch = true;
    if (text && ctx.approach === 'quant' && qualW && !quantW) i.methodMismatch = true;

    // Deliberate decisions from Step 3
    const methodLabel = ctx.methodLabel || '';
    const methodInTitle = methodHits.length > 0 || (methodLabel && overlap(text, methodLabel) > 0);
    if (text && ctx.methodMention === 'yes' && !methodInTitle) i.methodMissing = true;
    if (text && ctx.methodMention === 'no' && methodHits.length > 0) i.methodNotWanted = true;
    const theoryIn = ctx.theory && ctx.theory.trim() ? overlap(text, ctx.theory) > 0 : false;
    if (text && ctx.theoryMention === 'yes' && ctx.theory && !theoryIn) i.theoryMissing = true;
    if (text && ctx.theoryMention === 'no' && theoryIn) i.theoryNotWanted = true;

    // Keyword coverage (keywords chosen in Step 4)
    const kw = (ctx.keywords || []).filter((k) => k && k.trim());
    if (text && kw.length) {
      const covered = kw.filter((k) => overlap(text, k) > 0).length;
      i.noKeywords = covered / kw.length < 0.5;
      i._kwCovered = covered; i._kwTotal = kw.length;
    }

    i._wc = wc;
    i._repeated = repeated;
    i._acronyms = acronyms;
    i._methodHits = methodHits;
    i._colon = colons > 0;
    return i;
  }

  /* Evaluate the ten refinement dimensions. status: ok | warn | bad | info */
  const DIMS = ['clarity', 'precision', 'specificity', 'conciseness', 'terminology', 'scope', 'theory', 'method', 'readability', 'discipline'];

  function analyze(title, ctx) {
    const M = window.RC.msg;
    const i = detect(title, ctx);
    ctx = ctx || {};
    const dims = [];
    const push = (id, status, keys) => {
      const parts = keys.map((k) => M.issues[k]).filter(Boolean);
      dims.push({
        id, status, keys,
        title: M.dims[id],
        msg: status === 'ok' ? M.ok[id] : parts.map((p) => p.d).join(' '),
        rec: status === 'ok' ? '' : parts.map((p) => p.r).join(' ')
      });
    };
    if (i.empty) { DIMS.forEach((d) => push(d, 'bad', ['empty'])); return { dims, issues: i }; }

    // 1. Clarity
    const c = [];
    if (i.filler) c.push('filler');
    if (i.colonHeavy) c.push('colonHeavy');
    if (i.endPeriod) c.push('endPeriod');
    if (i.question) c.push('question');
    push('clarity', c.length ? (c.length === 1 && i.question ? 'info' : 'warn') : 'ok', c);

    // 2. Precision
    const p = [];
    if (i.vague) p.push('vague');
    if (i.abbrev) p.push('abbrev');
    push('precision', p.length >= 2 ? 'bad' : (p.length ? 'warn' : 'ok'), p);

    // 3. Specificity (does the title name what is studied?)
    const s = [];
    if (i.notReflect) s.push('notReflect');
    if (i.noMaterial) s.push('noMaterial');
    if (i.tooShort) s.push('tooShort');
    if (i.noKeywords) s.push('noKeywords');
    push('specificity', i.notReflect ? 'bad' : (s.length ? 'warn' : 'ok'), s);

    // 4. Conciseness
    const k = [];
    if (i.tooLong) k.push('tooLong'); else if (i.long) k.push('long');
    if (i.redundant) k.push('redundant');
    if (i.filler) k.push('fillerWords');
    push('conciseness', i.tooLong ? 'bad' : (k.length ? 'warn' : 'ok'), k);

    // 5. Academic terminology
    const t = [];
    if (i.promo) t.push('promo');
    if (i.evaluative) t.push('evaluative');
    push('terminology', (i.promo && i.evaluative) ? 'bad' : (t.length ? 'warn' : 'ok'), t);

    // 6. Research scope
    const sc = [];
    if (i.noContext) sc.push('noContext');
    if (i.tooShort && i.vague) sc.push('broad');
    push('scope', sc.length ? 'warn' : 'ok', sc);

    // 7. Theoretical relevance
    if (i.theoryMissing) push('theory', 'warn', ['theoryMissing']);
    else if (i.theoryNotWanted) push('theory', 'info', ['theoryNotWanted']);
    else if (!ctx.theory || !String(ctx.theory).trim()) push('theory', 'info', ['noTheory']);
    else if (ctx.theoryMention === 'unsure' || !ctx.theoryMention) push('theory', 'info', ['theoryUndecided']);
    else push('theory', 'ok', []);

    // 8. Methodological alignment
    const m = [];
    if (i.methodMismatch) m.push(ctx.approach === 'quant' ? 'quantNeedsMeasure' : 'quantInQual');
    if (i.causal) m.push(ctx.approach === 'quant' ? 'causalQuant' : 'causal');
    if (i.methodOverload) m.push('methodOverload');
    if (i.methodMissing) m.push('methodMissing');
    if (i.methodNotWanted) m.push('methodNotWanted');
    const mBad = i.methodMismatch || (i.causal && ctx.approach === 'qual');
    push('method', mBad ? 'bad' : (m.length ? (m.length === 1 && i.causal && ctx.approach === 'quant' ? 'info' : 'warn') : 'ok'), m);

    // 9. Readability
    const r = [];
    if (i.tooLong) r.push('hardToRead');
    if (i.listy) r.push('listy');
    if (i.colonHeavy) r.push('colonHeavy');
    push('readability', r.length >= 2 ? 'bad' : (r.length ? 'warn' : 'ok'), r);

    // 10. Relevance to Film and Television Studies
    push('discipline', i.noDiscipline ? 'warn' : 'ok', i.noDiscipline ? ['noDiscipline'] : []);

    return { dims, issues: i };
  }

  /* Suggested 1–5 scores for the evaluation rubric, derived from the dimensions. */
  function suggestScores(res, ctx, title) {
    const v = { ok: 4, info: 3, warn: 3, bad: 2 };
    const d = {};
    res.dims.forEach((x) => { d[x.id] = v[x.status]; });
    ctx = ctx || {};
    const probBase = [ctx.problem, ctx.focus, ctx.phenomenon].join(' ');
    const alignOk = title && probBase.trim() ? overlap(title, probBase) > 0 : false;
    const contrib = ctx.contribution && String(ctx.contribution).trim();
    return {
      clarity: Math.min(d.clarity, d.readability),
      focus: Math.min(d.precision, d.specificity),
      concise: d.conciseness,
      terminology: d.terminology,
      alignment: res.issues.notReflect ? 2 : (alignOk ? 4 : 3),
      theory: d.theory,
      method: d.method,
      discipline: d.discipline,
      scope: d.scope,
      significance: contrib ? (overlap(title, contrib) > 0 ? 4 : 3) : 3
    };
  }

  /* Compare two titles; return change notes. */
  const CMP_KEYS = ['vague', 'filler', 'redundant', 'promo', 'evaluative', 'causal', 'abbrev', 'tooLong', 'long', 'tooShort', 'notReflect', 'noContext', 'noMaterial', 'noDiscipline', 'methodMismatch', 'methodOverload', 'colonHeavy', 'listy', 'endPeriod'];
  function compare(a, b, ctx) {
    const M = window.RC.msg;
    const ia = detect(a, ctx), ib = detect(b, ctx);
    const rows = [];
    CMP_KEYS.forEach((k) => {
      const lab = M.issues[k] ? M.issues[k].t : k;
      if (ia[k] && !ib[k]) rows.push({ type: 'resolved', label: lab, why: M.resolved[k] || '' });
      else if (!ia[k] && ib[k]) rows.push({ type: 'introduced', label: lab, why: M.issues[k] ? M.issues[k].r : '' });
      else if (ia[k] && ib[k]) rows.push({ type: 'remaining', label: lab, why: M.issues[k] ? M.issues[k].r : '' });
    });
    const added = uniqueWords(b, [a]);
    const removed = uniqueWords(a, [b]);
    return { rows, ia, ib, added, removed, wcA: ia._wc || 0, wcB: ib._wc || 0 };
  }

  window.RTA = { detect, analyze, suggestScores, compare, overlap, jaccard, tokens, uniqueWords, wordCount, DIMS };
})();
