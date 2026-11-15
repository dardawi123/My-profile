/* =========================================================
   Research Introduction Writing and Refinement in Film and Television Studies
   صياغة مقدمة البحث وتنقيحها في الدراسات السينمائية والتلفزيونية — rule engine

   Transparent, rule-based logic only: counts, cue-word lists, citation
   patterns, term overlap between the parts of the argument, gap-evidence
   rules, suggested rubric scores and the CSV reader/writer of the citation
   matrix. It does not use artificial intelligence, does not paraphrase and
   never adds studies, gaps, findings or claims that the researcher has not
   entered. Every list it uses is in rintro-ar.js / rintro-en.js (RC.lex).
   Academic tool developed by Dr. Merfat Alardawi | د. مرفت العرضاوي
   ========================================================= */
window.RIE = (function () {
  'use strict';
  const filled = (x) => !!(x && String(x).trim());
  const wc = (s) => (String(s || '').trim().match(/\S+/g) || []).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
  const chars = (s) => String(s || '').replace(/\r/g, '').length;
  const MOVES = ['territory', 'scholarly', 'gap', 'rationale', 'purpose', 'questions', 'theory', 'contribution'];

  /* ---------- Text helpers ---------- */
  function norm(s, lang) {
    s = String(s || '').toLowerCase();
    if (lang === 'ar') s = s.replace(/[ً-ْٰـ]/g, '').replace(/[إأآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي').replace(/ة/g, 'ه');
    return s.replace(/[⁨⁩“”"«»()\[\]،,.;:؛؟?!’']/g, ' ').replace(/\s+/g, ' ').trim();
  }
  const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  /* Which cue words or phrases occur in a text (Arabic allows the attached prefixes و ف ب ل ك ال). */
  function hits(text, cues, lang) {
    const t = ' ' + norm(text, lang) + ' ', out = [];
    (cues || []).forEach((c) => {
      const cn = norm(c, lang); if (!cn) return;
      const re = lang === 'ar'
        ? new RegExp('(^|\\s)(و|ف|ب|ل|ك|ال|وال|بال|لل)?' + escRe(cn) + (cn.length <= 3 ? '(?=\\s|$)' : ''))
        : new RegExp('(^|[^a-z])' + escRe(cn) + '(?=$|[^a-z])');
      if (re.test(t) && out.indexOf(c) === -1) out.push(c);
    });
    return out;
  }
  function sentences(text) {
    return String(text || '').replace(/\r/g, '').split(/\n+|(?<=[.!?؟])\s+(?=\S)/).map((x) => x.trim()).filter((x) => wc(x) > 0);
  }
  const paragraphs = (text) => String(text || '').replace(/\r/g, '').split(/\n\s*\n/).map((p) => p.trim()).filter((p) => wc(p) > 0);
  function script(text) {
    const s = String(text || ''), ar = (s.match(/[؀-ۿ]/g) || []).length, la = (s.match(/[A-Za-z]/g) || []).length;
    if (!ar && !la) return 'none';
    const r = ar / (ar + la);
    return r > 0.8 ? 'ar' : r < 0.2 ? 'en' : 'mixed';
  }
  /* In-text citations: (Author, 2021), Author (2021), (2021), Arabic-Indic years and numbered [3]. */
  const CITE_RE = /\([^()]{0,160}?(?:1[89]\d\d|20\d\d|[١٢][٠-٩]{3}|n\.d\.|د\.ت)[a-z]?[^()]{0,120}\)|\[\d+(?:[,–-]\s?\d+)*\]/g;
  const cites = (text) => String(text || '').match(CITE_RE) || [];
  const hasCite = (text) => cites(text).length > 0;
  /* Number of cited works: a parenthesis with two years counts as two works. */
  const citeCount = (text) => cites(text).reduce((n, c) => n + Math.max(1, (c.match(/(?:1[89]\d\d|20\d\d|[١٢][٠-٩]{3}|n\.d\.|د\.ت)/g) || []).length), 0);

  /* ---------- Key-term overlap between parts of the argument ---------- */
  function stem(w, lang) {
    if (lang === 'ar') return w.replace(/^(وال|بال|فال|كال|لل|ال|و|ف|ب|ل)(?=..)/, '').replace(/^ال/, '').replace(/(ات|ون|ين|ها|هم|يه|يا|يه|ه|ي)$/, '');
    return w.replace(/(ations|ation|ings|ing|ies|ied|ed|es|s)$/, '').replace(/(ive|al)$/, '');
  }
  /* Stop lists are normalised and stemmed once, so they can be written in plain form. */
  function stopSet(L, key, lang) {
    const k = '_' + key + lang; if (L[k]) return L[k];
    const set = new Set(); (L[key] || []).forEach((x) => { const n = norm(x, lang); set.add(n); set.add(stem(n, lang)); });
    Object.defineProperty(L, k, { value: set, enumerable: false }); return set;
  }
  function terms(text, L, lang) {
    const out = {}, stop = stopSet(L, 'stopOverlap', lang);
    String(text || '').split(/\s+/).forEach((tok) => {
      const shown = tok.replace(/^[\u2068\u2069“”"«»(\[]+|[\u2068\u2069“”"«»()\[\]،,.;:؛؟?!]+$/g, '');
      norm(tok, lang).split(' ').forEach((w) => {
        if (!w || /\d/.test(w) || stop.has(w)) return;
        const s = stem(w, lang);
        if (s.length < (lang === 'ar' ? 3 : 4) || stop.has(s)) return;
        if (!out[s]) out[s] = shown || w;
      });
    });
    return out;
  }
  function overlap(a, b, L, lang) {
    const A = terms(a, L, lang), B = terms(b, L, lang);
    return Object.keys(A).filter((k) => B[k]).map((k) => A[k]).slice(0, 6);
  }

  /* ---------- Gap, problem, synthesis and claim checks ---------- */
  function primaryGap(st) {
    const g = st.s4.gaps.find((x) => x.id === st.s4.primary) || st.s4.gaps.find((x) => filled(x.statement)) || null;
    return g;
  }
  function gapChecks(g, st, RC) {
    const L = RC.lex, lang = RC.lang, out = [];
    if (!g) return out;
    if (!filled(g.statement)) out.push({ k: 'noStatement', s: 'bad' });
    if (!filled(g.evidence) && !(g.studies || []).length) out.push({ k: 'noEvidence', s: 'bad' });
    const abs = hits(g.statement + ' ' + g.evidence, L.absolute, lang);
    if (g.status === 'supported') {
      if (!filled(st.s4.basis)) out.push({ k: 'supportedNoBasis', s: 'warn' });
      if ((g.studies || []).length < 2 && citeCount(g.evidence) < 2) out.push({ k: 'supportedThin', s: 'warn' });
    }
    if (abs.length && !(g.status === 'supported' && filled(st.s4.basis))) out.push({ k: 'absolute', s: 'warn', list: abs });
    if (g.status === 'critical' && hits(g.statement, L.absence, lang).length) out.push({ k: 'absenceCritical', s: 'info' });
    if ((g.type === 'contradictory' || g.type === 'debate') && (g.studies || []).length < 2 && citeCount(g.evidence) < 2) out.push({ k: 'twoSides', s: 'warn' });
    if (!g.status) out.push({ k: 'noStatus', s: 'warn' });
    if (filled(g.evidence) && !(g.studies || []).length && !hasCite(g.evidence)) out.push({ k: 'noStudies', s: 'info' });
    if (!out.some((x) => x.s === 'bad' || x.s === 'warn')) out.unshift({ k: 'ok', s: 'ok' });
    return out;
  }
  function claimCheck(text, RC) {
    const L = RC.lex, lang = RC.lang, out = [];
    if (!filled(text)) return out;
    const abs = hits(text, L.absolute, lang); if (abs.length) out.push({ k: 'absolute', s: 'warn', list: abs });
    const over = hits(text, L.overclaim, lang); if (over.length) out.push({ k: 'overclaim', s: 'warn', list: over });
    const gen = hits(text, L.generalise, lang); if (gen.length) out.push({ k: 'general', s: 'warn', list: gen });
    const unsup = unsupported(text, L, lang); if (unsup.length) out.push({ k: 'unsupported', s: 'warn', list: unsup });
    if (!out.length) out.push({ k: 'ok', s: 'ok' });
    return out;
  }
  function problemChecks(st, RC) {
    const L = RC.lex, lang = RC.lang, p = st.s5.problem, out = [];
    if (!filled(p)) return out;
    if (/[?؟]\s*$/.test(String(p).trim())) out.push({ k: 'question', s: 'warn' });
    if (!hits(p + ' ' + st.s5.tension, L.tension, lang).length) out.push({ k: 'noTension', s: 'info' });
    if (hits(p, L.social, lang).length && !hits(p + ' ' + st.s5.evidence, L.scholarly, lang).length && !hasCite(p + ' ' + st.s5.evidence)) out.push({ k: 'social', s: 'warn' });
    if (!filled(st.s5.boundaries)) out.push({ k: 'noBoundaries', s: 'info' });
    if (wc(p) > 90) out.push({ k: 'long', s: 'warn' });
    if (!out.some((x) => x.s === 'warn')) out.unshift({ k: 'ok', s: 'ok' });
    return out;
  }
  /* A synthesis connects sources; a chain of summaries starts sentence after sentence with "Author (Year) found…". */
  function synthesis(st, RC) {
    const L = RC.lex, lang = RC.lang, t = st.s3.synthesis, out = [];
    if (!filled(t)) return out;
    const ss = sentences(t), n = citeCount(t);
    const chain = ss.filter((s) => { const head = s.split(/\s+/).slice(0, 7).join(' '); return hasCite(head) && hits(s, L.reportVerbs, lang).length; }).length;
    out.push(n >= 3 ? { k: 'cites', s: 'ok', n } : { k: 'cites', s: 'warn', n });
    if (ss.length >= 3 && chain / ss.length > 0.5) out.push({ k: 'chain', s: 'warn' });
    if (!hits(t, L.synthesisCues, lang).length) out.push({ k: 'noCues', s: 'info' });
    const names = st.matrix.map((m) => (String(m.cite || '').match(/[\p{L}’'-]{2,}/u) || [''])[0]).filter((x) => x.length > 1);
    const used = names.filter((nm) => norm(t, lang).indexOf(norm(nm, lang)) !== -1).length;
    if (st.matrix.length && !used) out.push({ k: 'matrixUnused', s: 'info' });
    else if (used) out.push({ k: 'matrixUsed', s: 'ok', n: used });
    return out;
  }
  /* Sentences that make claims about scholarship ("studies show…") without a citation. */
  function unsupported(text, L, lang) {
    return sentences(text).filter((s) => hits(s, L.claimCues, lang).length && !hasCite(s)).map((s) => s.slice(0, 90) + (s.length > 90 ? '…' : '')).slice(0, 5);
  }
  function contextChecks(text, RC) {
    const L = RC.lex, lang = RC.lang, out = [];
    if (!filled(text)) return out;
    const first = sentences(text)[0] || '';
    const cl = hits(first, L.cliche, lang); if (cl.length) out.push({ k: 'cliche', s: 'warn', list: cl });
    const gen = hits(text, L.generalise, lang); if (gen.length) out.push({ k: 'general', s: 'warn', list: gen });
    if (!hasCite(text)) out.push({ k: 'noCite', s: 'info' });
    if (wc(text) > 170) out.push({ k: 'long', s: 'warn' });
    if (!out.some((x) => x.s === 'warn')) out.unshift({ k: 'ok', s: 'ok' });
    return out;
  }
  function rationaleChecks(st, RC) {
    const L = RC.lex, lang = RC.lang, out = [], t = [st.s6.rationale].concat(st.s6.sig.map((k) => st.s6.sigText[k] || '')).join(' ');
    if (!filled(st.s6.rationale)) return out;
    const over = hits(t, L.overclaim, lang).concat(hits(t, L.absolute, lang)); if (over.length) out.push({ k: 'overclaim', s: 'warn', list: over });
    if (!st.s6.sig.length) out.push({ k: 'noTypes', s: 'info' });
    const empty = st.s6.sig.filter((k) => !filled(st.s6.sigText[k])); if (empty.length) out.push({ k: 'sigEmpty', s: 'info', list: empty });
    if (!out.some((x) => x.s === 'warn')) out.unshift({ k: 'ok', s: 'ok' });
    return out;
  }
  function contributionText(st) { return [st.s9.statement].concat(st.s9.types.map((k) => st.s9.typeText[k] || '')).join(' '); }
  function contributionChecks(st, RC) {
    const L = RC.lex, lang = RC.lang, out = [], t = contributionText(st);
    if (!filled(st.s9.statement)) return out;
    const over = hits(t, L.overclaim, lang).concat(hits(t, L.absolute, lang)); if (over.length) out.push({ k: 'overclaim', s: 'warn', list: over });
    const cert = hits(t, L.certainty, lang);
    if (st.s1.status !== 'completed' && cert.length && !hits(t, L.modal, lang).length) out.push({ k: 'certainty', s: 'warn', list: cert });
    const g = primaryGap(st);
    if (g && filled(g.statement) && !overlap(t, g.statement + ' ' + st.s5.problem, L, lang).length) out.push({ k: 'noLink', s: 'info' });
    if (!st.s9.types.length) out.push({ k: 'noTypes', s: 'info' });
    if (!out.some((x) => x.s === 'warn')) out.unshift({ k: 'ok', s: 'ok' });
    return out;
  }
  function theoryChecks(st, RC) {
    const L = RC.lex, lang = RC.lang, s = st.s8, out = [];
    if (!s.mode) return out;
    if (s.mode === 'none') { out.push({ k: filled(s.justification) ? 'noneOk' : 'noneWhy', s: filled(s.justification) ? 'ok' : 'info' }); return out; }
    const names = String(s.theoryOther || '').split(/[,،;؛]|\s(?:and|و)\s/).filter(filled).length + (s.theory && s.theory !== 'other' ? 1 : 0);
    if (names > 3) out.push({ k: 'nameDrop', s: 'warn' });
    if (!filled(s.relation)) out.push({ k: 'noRelation', s: 'warn' });
    if (!filled(s.concepts)) out.push({ k: 'noConcepts', s: 'info' });
    if (filled(s.concepts) && !overlap(s.concepts + ' ' + s.relation, st.s7.aim + ' ' + st.s7.mainQ + ' ' + st.s5.problem, L, lang).length) out.push({ k: 'noLinkQ', s: 'info' });
    if (!out.some((x) => x.s === 'warn')) out.unshift({ k: 'ok', s: 'ok' });
    return out;
  }

  /* ---------- Research Alignment Checker (Step 7 and Tool D) ---------- */
  function kindOf(st, RC) { const d = RC.designs.find((x) => x.id === st.s1.design); return d ? d.kind : ''; }
  const lines = (t) => String(t || '').split(/\n+/).map((x) => x.replace(/^\s*(?:[-–•*]|\(?[0-9٠-٩]+[.)]|[a-zأ-ي][.)])\s*/, '').trim()).filter(filled);
  function alignment(st, RC) {
    const L = RC.lex, lang = RC.lang, out = [], s7 = st.s7, kind = kindOf(st, RC);
    const prob = st.s5.problem, g = primaryGap(st), gap = g ? g.statement : '';
    const add = (k, s, extra) => out.push(Object.assign({ k, s }, extra || {}));
    const missing = [];
    if (!filled(prob)) missing.push('problem'); if (!filled(s7.aim)) missing.push('aim'); if (!filled(s7.mainQ)) missing.push('question');
    if (missing.length) add('core', 'bad', { list: missing });
    if (filled(prob) && filled(s7.aim)) { const o = overlap(prob, s7.aim, L, lang); add('probAim', o.length ? 'ok' : 'warn', { list: o }); }
    if (filled(s7.aim) && filled(s7.mainQ)) { const o = overlap(s7.aim, s7.mainQ, L, lang); add('aimQ', o.length ? 'ok' : 'warn', { list: o }); }
    if (filled(gap) && filled(s7.aim + prob)) { const o = overlap(gap, s7.aim + ' ' + prob, L, lang); add('gapAim', o.length ? 'ok' : 'warn', { list: o }); }
    if (filled(s7.aim)) add('aimVerb', hits(s7.aim, L.purposeVerbs, lang).length ? 'ok' : 'warn');
    const obj = lines(s7.objectives);
    if (!obj.length) add('objForm', 'info', { n: 0 });
    else if (obj.length > 6) add('objForm', 'warn', { n: obj.length });
    else { const noVerb = obj.filter((o) => !hits(o.split(/\s+/).slice(0, 3).join(' '), L.objectiveVerbs, lang).length); add('objForm', noVerb.length ? 'warn' : 'ok', { n: obj.length, list: noVerb.slice(0, 3) }); }
    const qs = [s7.mainQ].concat(lines(s7.subQs)).filter(filled);
    if (qs.length) {
      const yesNo = qs.filter((q) => hits(q.split(/\s+/).slice(0, 2).join(' '), L.yesNoStart, lang).length);
      const measurable = qs.filter((q) => hits(q, L.measurableQ, lang).length);
      const quantLike = kind === 'survey' || kind === 'qcontent';
      if (quantLike) add('qType', measurable.length || filled(s7.hypotheses) ? 'ok' : 'warn', { kind });
      else if (kind === 'mixed') add('qType', 'info', { kind });
      else add('qType', yesNo.length ? 'warn' : 'ok', { kind, list: yesNo.slice(0, 2) });
    }
    if (filled(s7.hypotheses) && (st.s1.approach === 'qual' || st.s1.approach === 'theory')) add('hyp', 'warn');
    else if (!filled(s7.hypotheses) && (kind === 'survey' || kind === 'qcontent')) add('hyp', 'info');
    const sq = lines(s7.subQs);
    if (sq.length && obj.length && Math.abs(sq.length - obj.length) > 2) add('subQ', 'info', { a: obj.length, b: sq.length });
    const con = contributionText(st);
    if (filled(st.s9.statement) && filled(gap + prob)) { const o = overlap(con, gap + ' ' + prob, L, lang); add('contribGap', o.length ? 'ok' : 'warn', { list: o }); }
    if (st.s8.mode && st.s8.mode !== 'none' && !filled(st.s8.relation)) add('theoryQ', 'info');
    return out;
  }

  /* ---------- Refinement assistant (Step 11 and Tool F) ---------- */
  function languageCheck(text, RC, keyTerms, exclude) {
    const L = RC.lex, lang = RC.lang, out = [];
    if (!filled(text)) return { items: out, words: 0 };
    const sents = sentences(text), paras = paragraphs(text);
    const long = sents.filter((s) => wc(s) > L.longLimit);
    out.push(long.length ? { k: 'long', s: 'warn', n: long.length, list: long.slice(0, 4).map((s) => s.slice(0, 90) + (s.length > 90 ? '…' : '')) } : { k: 'long', s: 'ok' });
    const counts = {}, orig = {}, skip = {};
    norm(String(exclude || '') + ' ' + String(keyTerms || ''), lang).split(' ').forEach((w) => { if (w.length > 1) { skip[w] = 1; skip[stem(w, lang)] = 1; } });
    String(text).split(/\s+/).forEach((o) => { const n = norm(o, lang); if (n && !orig[n]) orig[n] = o.replace(/^[⁨⁩“”"«»(\[]+|[⁨⁩“”"«»()\[\]،,.;:؛؟?!]+$/g, ''); });
    norm(text, lang).split(' ').forEach((w) => {
      if (w.length < (lang === 'ar' ? 4 : 5) || /\d/.test(w)) return;
      const k = lang === 'ar' ? w.replace(/^(وال|بال|فال|كال|لل|ال|و)/, '') : w.replace(/(ies|es|s)$/, '');
      const st = stopSet(L, 'stop', lang);
      if (st.has(k) || st.has(w) || st.has(stem(w, lang)) || skip[w] || skip[k] || skip[stem(w, lang)]) return;
      counts[k] = counts[k] || { n: 0, w: orig[w] || w }; counts[k].n++;
    });
    const per = Math.max(4, Math.round(wc(text) / 120) + 3);
    const rep = Object.keys(counts).filter((k) => counts[k].n >= per).sort((a, b) => counts[b].n - counts[a].n).slice(0, 6).map((k) => counts[k].w + ' ×' + counts[k].n);
    out.push(rep.length ? { k: 'repeat', s: 'warn', list: rep } : { k: 'repeat', s: 'ok' });
    const cl = hits(sents[0] || '', L.cliche, lang); if (cl.length) out.push({ k: 'cliche', s: 'warn', list: cl });
    const gen = hits(text, L.generalise, lang); if (gen.length) out.push({ k: 'general', s: 'warn', list: gen });
    const uns = unsupported(text, L, lang); if (uns.length) out.push({ k: 'unsupported', s: 'warn', list: uns });
    const abs = hits(text, L.absolute, lang); if (abs.length) out.push({ k: 'absolute', s: 'warn', list: abs });
    const over = hits(text, L.overclaim, lang); if (over.length) out.push({ k: 'overclaim', s: 'warn', list: over });
    const vague = hits(text, L.vague, lang); if (vague.length) out.push({ k: 'vague', s: 'info', list: vague });
    const pl = paras.filter((p) => wc(p) > L.paraMax); if (pl.length) out.push({ k: 'paraLong', s: 'warn', n: pl.length });
    const ps = paras.filter((p) => sentences(p).length < 2 && wc(p) > 0); if (paras.length > 1 && ps.length) out.push({ k: 'paraShort', s: 'info', n: ps.length });
    if (paras.length >= 3) {
      /* In Arabic a paragraph that opens with the conjunctions و / ف already links to what precedes it. */
      const linked = (p) => { const f = sentences(p).slice(0, 1).join(' '); if (hits(f, L.transitions, lang).length) return true; const w = norm(f, lang).split(' ')[0] || ''; return lang === 'ar' && /^[وف]/.test(w) && w.length > 3; };
      const noTr = paras.slice(1).filter((p) => !linked(p)).length;
      out.push({ k: 'transitions', s: noTr / (paras.length - 1) > 0.6 ? 'warn' : 'ok', n: paras.length - 1 - noTr, m: paras.length - 1 });
    }
    const iUse = hits(text, L.firstI, lang), weUse = hits(text, L.firstWe, lang), resUse = hits(text, L.thirdPerson, lang);
    if ([iUse.length, weUse.length, resUse.length].filter(Boolean).length > 1) out.push({ k: 'person', s: 'info', list: iUse.concat(weUse, resUse) });
    const abbr = undefinedAbbr(text); if (abbr.length) out.push({ k: 'abbr', s: 'info', list: abbr });
    const ph = String(text).match(/\[[^\]]{1,60}\]/g) || []; if (ph.length) out.push({ k: 'placeholder', s: 'bad', list: ph.slice(0, 6) });
    const kt = lines(keyTerms);
    if (kt.length) {
      const nt = norm(text, lang), miss = kt.filter((k) => nt.indexOf(norm(k, lang)) === -1);
      out.push(miss.length ? { k: 'terms', s: 'warn', list: miss } : { k: 'terms', s: 'ok', n: kt.length });
    }
    return { items: out, words: wc(text) };
  }
  function undefinedAbbr(text) {
    const s = String(text || ''), found = s.match(/\b[A-Z][A-Z0-9&]{1,7}s?\b/g) || [], out = [];
    const ok = ['APA', 'UK', 'USA', 'US', 'UAE', 'TV', 'AI', 'II', 'III', 'IV', 'GCC', 'MENA'];
    found.forEach((a) => {
      const b = a.replace(/s$/, '');
      if (ok.indexOf(b) !== -1 || out.indexOf(b) !== -1) return;
      if (new RegExp('\\(\\s*' + escRe(b) + 's?\\s*\\)').test(s)) return;
      out.push(b);
    });
    return out.slice(0, 6);
  }
  function moves(text, cues, lang) { const o = {}; Object.keys(cues).forEach((k) => { o[k] = hits(text, cues[k], lang).length > 0; }); return o; }

  /* ---------- Introduction composition (Step 10) ---------- */
  function sectionText(id, st, RC) {
    return st.s10.edited[id] ? String(st.s10.text[id] || '') : RC.tpl[id](st, { gap: primaryGap(st), kind: kindOf(st, RC), lines });
  }
  const headingsOn = (st) => st.s1.headings === 'allowed' || st.s1.headings === 'required';
  function assemble(st, RC) {
    const ids = st.s10.order.filter((id) => st.s10.on[id] && filled(sectionText(id, st, RC)));
    const useH = headingsOn(st) && st.s10.useHeadings;
    return ids.map((id) => {
      const body = sectionText(id, st, RC).trim();
      const h = useH ? (filled(st.s10.labels[id]) ? st.s10.labels[id].trim() : (RC.headingDefaults[id] || '')) : '';
      return (h ? h + '\n' : '') + body;
    }).join('\n\n');
  }
  function sectionWords(st, RC) { const o = {}; let total = 0; st.s10.order.forEach((id) => { const n = st.s10.on[id] ? wc(sectionText(id, st, RC)) : 0; o[id] = n; total += n; }); o.total = total; return o; }

  /* ---------- Structure Builder (Tool A) ---------- */
  function structureFor(sel) {
    const orders = {
      textual: ['territory', 'scholarly', 'gap', 'theory', 'rationale', 'purpose', 'questions', 'contribution'],
      critical: ['territory', 'gap', 'scholarly', 'theory', 'purpose', 'rationale', 'contribution', 'questions'],
      qual: ['territory', 'scholarly', 'gap', 'rationale', 'purpose', 'questions', 'theory', 'contribution'],
      quant: ['territory', 'scholarly', 'theory', 'gap', 'rationale', 'purpose', 'questions', 'contribution'],
      mixed: ['territory', 'scholarly', 'gap', 'rationale', 'purpose', 'questions', 'theory', 'contribution']
    };
    if (!sel.kind) return null;
    const off = [];
    if (sel.kind === 'critical') off.push('questions');
    if (sel.venue === 'conference' && sel.kind !== 'quant') off.push('rationale');
    return { order: orders[sel.kind].slice(), off };
  }

  /* ---------- Evaluation checks (Step 12) ---------- */
  function checks(st, RC) {
    const L = RC.lex, C = RC.checkText, lang = RC.lang, out = [], d = String(st.s10.draft || '');
    const add = (id, status, arg) => { const c = C[id]; out.push({ id, t: c.t, status, msg: typeof c[status] === 'function' ? c[status](arg) : c[status] }); };
    if (!filled(d)) { add('draft', 'bad'); return out; }
    add('length', 'info', [wc(d), paragraphs(d).length]);
    const sw = sectionWords(st, RC), mv = moves(d, L.moveCues, lang);
    const core = ['territory', 'scholarly', 'gap', 'purpose'], miss = core.filter((m) => !mv[m] && !(sw[m] > 0));
    add('moves', miss.length ? (miss.indexOf('gap') !== -1 || miss.indexOf('purpose') !== -1 ? 'bad' : 'warn') : 'ok', miss.map((m) => RC.moveNames[m]).join(RC.sep));
    const g = primaryGap(st), gc = g ? gapChecks(g, st, RC) : [];
    if (!g) add('gapEvidence', 'bad', '');
    else add('gapEvidence', gc.some((x) => x.k === 'noEvidence') ? 'bad' : gc.some((x) => x.k === 'supportedThin' || x.k === 'supportedNoBasis' || x.k === 'twoSides') ? 'warn' : 'ok', g.status ? RC.gapStatusName[g.status] : '');
    const abs = hits(d, L.absolute, lang); add('gapClaim', abs.length && !(g && g.status === 'supported' && filled(st.s4.basis)) ? 'warn' : 'ok', abs.join(RC.sep));
    const pc = problemChecks(st, RC); add('problem', !filled(st.s5.problem) ? 'bad' : pc.some((x) => x.s === 'warn') ? 'warn' : 'ok', pc.filter((x) => x.s === 'warn').map((x) => RC.problemMsg[x.k].t).join(RC.sep));
    const al = alignment(st, RC), alw = al.filter((x) => x.s === 'warn' || x.s === 'bad');
    add('alignment', al.some((x) => x.s === 'bad') ? 'bad' : alw.length ? 'warn' : 'ok', alw.map((x) => RC.alignMsg[x.k].t).join(RC.sep));
    const tc = theoryChecks(st, RC); add('theory', !st.s8.mode ? 'warn' : tc.some((x) => x.s === 'warn') ? 'warn' : 'ok', st.s8.mode || '');
    const cc = contributionChecks(st, RC); add('contribution', !filled(st.s9.statement) ? 'bad' : cc.some((x) => x.s === 'warn') ? 'warn' : 'ok', cc.filter((x) => x.s === 'warn').map((x) => (x.list || []).join(RC.sep)).join(RC.sep));
    const nc = citeCount(d); add('citations', nc >= 3 ? 'ok' : nc ? 'warn' : 'bad', nc);
    const un = unsupported(d, L, lang); add('unsupported', un.length ? 'warn' : 'ok', un.length);
    const gen = hits(d, L.generalise, lang); add('general', gen.length ? 'warn' : 'ok', gen.join(RC.sep));
    const cl = hits(sentences(d)[0] || '', L.cliche, lang); add('opening', cl.length ? 'warn' : 'ok', cl.join(RC.sep));
    const lc = languageCheck(d, RC, '').items, tr = lc.find((x) => x.k === 'transitions'), pl = lc.find((x) => x.k === 'paraLong');
    add('paragraphs', pl ? 'warn' : paragraphs(d).length < 2 && wc(d) > 200 ? 'warn' : 'ok', pl ? pl.n : 0);
    if (tr) add('transitions', tr.s, [tr.n, tr.m]);
    const lines0 = d.split('\n').map((x) => x.trim()).filter((x) => x && wc(x) <= 6 && !/[.!?؟:،,]$/.test(x));
    if (st.s1.headings === 'none' && lines0.length) add('headings', 'warn', lines0.slice(0, 3).join(RC.sep));
    else if (st.s1.headings === 'required' && !lines0.length) add('headings', 'warn', '');
    else add('headings', 'ok', '');
    const ph = d.match(/\[[^\]]{1,60}\]/g) || []; if (ph.length) add('placeholder', 'bad', ph.slice(0, 4).join(RC.sep));
    const sc = script(d);
    if (st.s1.lang === 'ar' && sc !== 'ar' && sc !== 'none') add('language', 'warn', 'ar');
    else if (st.s1.lang === 'en' && sc !== 'en' && sc !== 'none') add('language', 'warn', 'en');
    return out;
  }
  function suggestScores(st, RC) {
    const L = RC.lex, lang = RC.lang, list = checks(st, RC), stat = (id) => (list.find((c) => c.id === id) || {}).status;
    const pen = (ids) => ids.reduce((n, id) => n + ({ bad: 2, warn: 1 }[stat(id)] || 0), 0);
    const nw = (arr) => arr.filter((x) => x.s === 'warn' || x.s === 'bad').length;
    const clamp = (n) => Math.max(1, Math.min(5, n)), has = filled, d = st.s10.draft, sc = {};
    const terr = RC.tpl.territory(st, {});
    sc.context = !has(st.s2.phenomenon) && !has(st.s2.current) ? 1 : clamp(5 - nw(contextChecks(terr, RC)) - (hasCite(terr) ? 0 : 1) - (has(st.s2.importance) ? 0 : 1));
    const sy = synthesis(st, RC);
    sc.background = !has(st.s3.synthesis) ? 1 : clamp(5 - nw(sy) - (has(st.s3.debates) || has(st.s3.disagreements) ? 0 : 1) - (cites(st.s3.synthesis).length ? 0 : 1));
    const g = primaryGap(st);
    sc.gap = !g ? 1 : clamp(5 - nw(gapChecks(g, st, RC)) - (g.status === 'supported' || g.status === 'critical' ? 0 : 1));
    sc.problem = !has(st.s5.problem) ? 1 : clamp(5 - nw(problemChecks(st, RC)) - (has(st.s5.evidence) ? 0 : 1));
    sc.rationale = !has(st.s6.rationale) ? 1 : clamp(5 - nw(rationaleChecks(st, RC)) - (st.s6.sig.length ? 0 : 1));
    const al = alignment(st, RC);
    sc.alignment = al.some((x) => x.s === 'bad') ? 1 : clamp(5 - nw(al));
    sc.theory = !st.s8.mode ? 2 : st.s8.mode === 'none' ? (has(st.s8.justification) ? 4 : 3) : clamp(5 - nw(theoryChecks(st, RC)) * 2 - (has(st.s8.concepts) ? 0 : 1));
    sc.contribution = !has(st.s9.statement) ? 1 : clamp(5 - nw(contributionChecks(st, RC)) - (st.s9.types.length ? 0 : 1));
    sc.coherence = !has(d) ? 1 : clamp(5 - pen(['moves', 'transitions', 'paragraphs', 'opening', 'headings']));
    sc.language = !has(d) ? 1 : clamp(5 - pen(['citations', 'unsupported', 'general', 'placeholder', 'language']) - (languageCheck(d, RC, '').items.some((x) => x.k === 'long' && x.s === 'warn') ? 1 : 0));
    return sc;
  }

  /* ---------- Citation matrix CSV (Tool C) ---------- */
  function toCSV(rows, cols) {
    const q = (v) => { v = String(v == null ? '' : v); return /[",\n\r]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
    return [cols.join(',')].concat(rows.map((r) => cols.map((c) => q(r[c])).join(','))).join('\r\n');
  }
  function parseCSV(text) {
    text = String(text || '').replace(/^﻿/, '');
    const rows = []; let row = [], cur = '', inQ = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (inQ) { if (ch === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else inQ = false; } else cur += ch; }
      else if (ch === '"') inQ = true;
      else if (ch === ',' || ch === ';' || ch === '\t') { row.push(cur); cur = ''; }
      else if (ch === '\n' || ch === '\r') { if (ch === '\r' && text[i + 1] === '\n') i++; row.push(cur); rows.push(row); row = []; cur = ''; }
      else cur += ch;
    }
    if (cur || row.length) { row.push(cur); rows.push(row); }
    return rows.filter((r) => r.some((c) => filled(c)));
  }

  return { MOVES, filled, wc, chars, norm, hits, sentences, paragraphs, script, cites, hasCite, citeCount, overlap, terms, lines, primaryGap, gapChecks, claimCheck, problemChecks, synthesis, unsupported, contextChecks, rationaleChecks, contributionChecks, contributionText, theoryChecks, kindOf, alignment, languageCheck, undefinedAbbr, moves, sectionText, headingsOn, assemble, sectionWords, structureFor, checks, suggestScores, toCSV, parseCSV };
})();
