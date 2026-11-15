/* =========================================================
   Research Abstract Writing and Refinement in Film and Television Studies
   صياغة ملخص البحث وتنقيحه في الدراسات السينمائية والتلفزيونية — rule engine

   Transparent, rule-based logic only: word and character counts, sentence
   checks, cue-word detection of abstract moves, consistency checks between
   the builder steps, keyword checks and suggested rubric scores.
   It does not use artificial intelligence, does not paraphrase and never
   adds findings or details that the researcher has not entered.
   Academic tool developed by Dr. Merfat Alardawi | د. مرفت العرضاوي
   ========================================================= */
window.RAE = (function () {
  'use strict';
  const filled = (x) => !!(x && String(x).trim());
  const wc = (s) => (String(s || '').trim().match(/\S+/g) || []).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
  const chars = (s) => String(s || '').replace(/\r/g, '').length;
  const charsNoSpace = (s) => String(s || '').replace(/\s/g, '').length;

  /* ---------- Text helpers ---------- */
  function norm(s, lang) {
    s = String(s || '').toLowerCase();
    if (lang === 'ar') s = s.replace(/[ً-ْٰـ]/g, '').replace(/[إأآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي').replace(/ة/g, 'ه');
    return s.replace(/[⁨⁩“”"«»()\[\]،,.;:؛؟?!]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  /* Which cue words or phrases occur in a text (Arabic allows the attached prefixes و ف ب ل ك). */
  function hits(text, cues, lang) {
    const t = ' ' + norm(text, lang) + ' ', out = [];
    (cues || []).forEach((c) => {
      const cn = norm(c, lang); if (!cn) return;
      const re = lang === 'ar'
        ? new RegExp('(^|\\s)(و|ف|ب|ل|ك|ال)?' + escRe(cn) + (cn.length <= 3 ? '(?=\\s|$)' : ''))
        : new RegExp('(^|[^a-z])' + escRe(cn) + '(?=$|[^a-z])');
      if (re.test(t) && out.indexOf(c) === -1) out.push(c);
    });
    return out;
  }
  function sentences(text) {
    return String(text || '').replace(/\r/g, '').split(/\n+|(?<=[.!?؟])\s+(?=\S)/).map((x) => x.trim()).filter((x) => wc(x) > 0);
  }
  /* Script of a text: share of Arabic letters among all letters. */
  function script(text) {
    const s = String(text || ''), ar = (s.match(/[؀-ۿ]/g) || []).length, la = (s.match(/[A-Za-z]/g) || []).length;
    if (!ar && !la) return 'none';
    const r = ar / (ar + la);
    return r > 0.8 ? 'ar' : r < 0.2 ? 'en' : 'mixed';
  }

  /* ---------- Language check (Tool D and Step 8) ---------- */
  function languageCheck(text, L, lang) {
    const out = [];
    if (!filled(text)) return { items: out, sents: [], words: 0 };
    const sents = sentences(text), words = wc(text);
    const long = sents.filter((s) => wc(s) > L.longLimit);
    out.push(long.length ? { k: 'long', s: 'warn', n: long.length, list: long.map((s) => s.slice(0, 90) + (s.length > 90 ? '…' : '')) } : { k: 'long', s: 'ok' });
    // Repeated content words (three or more times)
    const counts = {}, orig = {};
    String(text).split(/\s+/).forEach((o) => { const n = norm(o, lang); if (n && !orig[n]) orig[n] = o.replace(/^[\u2068\u2069“”"«»(\[]+|[\u2068\u2069“”"«»()\[\]،,.;:؛؟?!]+$/g, ''); });
    norm(text, lang).split(' ').forEach((w) => {
      if (w.length < (lang === 'ar' ? 4 : 5) || /\d/.test(w)) return;
      let k = w;
      if (lang === 'ar') k = k.replace(/^(وال|بال|فال|كال|لل|ال|و)/, '');
      else k = k.replace(/(ies|es|s)$/, '');
      if (L.stop.indexOf(k) !== -1 || L.stop.indexOf(w) !== -1 || L.allowRepeat.indexOf(k) !== -1) return;
      counts[k] = counts[k] || { n: 0, w: orig[w] || w }; counts[k].n++;
    });
    const rep = Object.keys(counts).filter((k) => counts[k].n >= 3).sort((a, b) => counts[b].n - counts[a].n).slice(0, 6).map((k) => counts[k].w + ' ×' + counts[k].n);
    out.push(rep.length ? { k: 'repeat', s: 'warn', list: rep } : { k: 'repeat', s: 'ok' });
    const vague = hits(text, L.vague, lang); if (vague.length) out.push({ k: 'vague', s: 'warn', list: vague });
    const over = hits(text, L.overclaim, lang); if (over.length) out.push({ k: 'overclaim', s: 'warn', list: over });
    const fut = hits(text, L.future, lang); if (fut.length) out.push({ k: 'future', s: 'warn', list: fut });
    const cit = (String(text).match(/\([^()]{0,80}\d{4}[a-z]?\)|\[\d+(?:[,–-]\s?\d+)*\]/g) || []);
    if (cit.length) out.push({ k: 'cite', s: 'warn', list: cit.slice(0, 5) });
    const abbr = undefinedAbbr(text); if (abbr.length) out.push({ k: 'abbr', s: 'warn', list: abbr });
    const ph = String(text).match(/\[[^\]]{1,60}\]/g) || []; if (ph.length) out.push({ k: 'placeholder', s: 'bad', list: ph.slice(0, 6) });
    if (/[?؟]/.test(text)) out.push({ k: 'question', s: 'info' });
    const fp = hits(text, L.firstPerson, lang); if (fp.length) out.push({ k: 'first', s: 'info', list: fp });
    const intens = hits(text, L.intensifiers, lang); if (intens.length) out.push({ k: 'intens', s: 'info', list: intens });
    return { items: out, sents, words };
  }
  /* Upper-case abbreviations that are never introduced in brackets, e.g. "Video on demand (VOD)". */
  function undefinedAbbr(text) {
    const s = String(text || ''), found = s.match(/\b[A-Z][A-Z0-9&]{1,7}s?\b/g) || [], out = [];
    const ok = ['APA', 'UK', 'USA', 'US', 'UAE', 'TV', 'AI', 'II', 'III', 'IV'];
    found.forEach((a) => {
      const b = a.replace(/s$/, '');
      if (ok.indexOf(b) !== -1 || out.indexOf(b) !== -1) return;
      if (new RegExp('\\(\\s*' + escRe(b) + 's?\\s*\\)').test(s)) return;
      out.push(b);
    });
    return out.slice(0, 6);
  }

  /* ---------- Abstract moves (cue words) ---------- */
  function moves(text, cues, lang) {
    const o = {};
    Object.keys(cues).forEach((k) => { o[k] = hits(text, cues[k], lang).length > 0; });
    return o;
  }
  /* Qualitative findings written as a bare list of codes: many short comma-separated items. */
  function codeList(text) {
    return sentences(text).some((s) => { const parts = s.split(/[,،;؛]/).map((x) => x.trim()).filter(Boolean); return parts.length >= 5 && parts.filter((p) => wc(p) <= 3).length >= 4; });
  }

  /* ---------- Method kind from the selected design ---------- */
  function kindOf(st, RC) { const d = RC.designs.find((x) => x.id === st.s1.design); return d ? d.kind : ''; }

  /* ---------- Section composition (only the researcher's own text) ---------- */
  function sectionText(id, st, RC) {
    const t = st.s7.text[id];
    return st.s7.edited[id] ? String(t || '') : RC.tpl[id](st, kindOf(st, RC));
  }
  function labelsFor(st, RC) {
    const set = RC.headingSets[st.s7.headings] || RC.headingSets.generic, o = {};
    Object.keys(set).forEach((k) => { o[k] = filled(st.s7.labels[k]) ? st.s7.labels[k].trim() : set[k]; });
    return o;
  }
  function assemble(st, RC) {
    const ids = st.s7.order.filter((id) => st.s7.on[id] && filled(sectionText(id, st, RC)));
    if (!ids.length) return '';
    if (st.s1.format !== 'structured') {
      const parts = ids.map((id) => sectionText(id, st, RC).trim().replace(/\s*\n+\s*/g, ' '));
      if (st.s7.paras === 'two' && parts.length > 2) {
        const cut = Math.max(1, ids.indexOf('methods') !== -1 ? ids.indexOf('methods') + 1 : Math.ceil(parts.length / 2));
        return parts.slice(0, cut).join(' ') + '\n\n' + parts.slice(cut).join(' ');
      }
      return parts.join(' ');
    }
    const lab = labelsFor(st, RC), out = [];
    let carry = '';
    ids.forEach((id) => {
      const txt = sectionText(id, st, RC).trim().replace(/\s*\n+\s*/g, ' ');
      if (!lab[id]) { carry += (carry ? ' ' : '') + txt; return; }
      out.push(lab[id] + RC.colon + (carry ? carry + ' ' : '') + txt); carry = '';
    });
    if (carry) { if (out.length) out[out.length - 1] += ' ' + carry; else out.push(carry); }
    return out.join('\n');
  }
  /* Word count of each enabled section (for proportion checks). */
  function sectionWords(st, RC) {
    const o = {}; let total = 0;
    st.s7.order.forEach((id) => { const n = st.s7.on[id] ? wc(sectionText(id, st, RC)) : 0; o[id] = n; total += n; });
    o.total = total; return o;
  }
  const limitOf = (st) => { const n = parseInt(st.s1.limit === 'custom' ? st.s1.customLimit : st.s1.limit, 10); return n > 0 ? n : 0; };
  const draftOf = (st) => String(st.s7.draft || '');

  /* ---------- Keywords ---------- */
  function keywordChecks(st, RC) {
    const L = RC.lex, out = [], kws = st.s10.keywords.filter((k) => filled(k.en) || filled(k.ar));
    const lo = parseInt(st.s9.kwMin, 10) || 0, hi = parseInt(st.s9.kwMax, 10) || 0;
    const n = kws.length;
    if (!n) out.push({ k: 'none', s: 'bad' });
    else if ((lo && n < lo) || (hi && n > hi)) out.push({ k: 'count', s: 'warn', n });
    else out.push({ k: 'count', s: 'ok', n });
    const seen = {}, dup = [];
    kws.forEach((k) => { [['en', 'en'], ['ar', 'ar']].forEach((p) => { const v = norm(k[p[0]], p[1]); if (!v) return; if (seen[v]) dup.push(k[p[0]]); seen[v] = 1; }); });
    if (dup.length) out.push({ k: 'dup', s: 'warn', list: dup });
    const gen = kws.filter((k) => L.generalKw.indexOf(norm(k.en, 'en')) !== -1 || L.generalKwAr.indexOf(norm(k.ar, 'ar')) !== -1).map((k) => k.en || k.ar);
    if (gen.length) out.push({ k: 'general', s: 'warn', list: gen });
    const long = kws.filter((k) => wc(k.en) > 4 || wc(k.ar) > 5).map((k) => k.en || k.ar);
    if (long.length) out.push({ k: 'long', s: 'warn', list: long });
    const titleN = norm(st.s1.title, RC.lang);
    const inTitle = kws.filter((k) => { const v = norm(RC.lang === 'ar' ? (k.ar || k.en) : (k.en || k.ar), RC.lang); return v && titleN && (' ' + titleN + ' ').indexOf(' ' + v + ' ') !== -1; }).map((k) => RC.lang === 'ar' ? (k.ar || k.en) : (k.en || k.ar));
    if (inTitle.length) out.push({ k: 'title', s: 'info', list: inTitle });
    const missingPair = st.s1.lang === 'both' ? kws.filter((k) => !filled(k.en) || !filled(k.ar)).length : 0;
    if (missingPair) out.push({ k: 'pair', s: 'warn', n: missingPair });
    const cats = kws.map((k) => k.cat);
    const lack = ['topic', 'method', 'context'].filter((c) => cats.indexOf(c) === -1);
    if (n && lack.length) out.push({ k: 'cats', s: 'info', list: lack });
    return out;
  }
  /* Candidate terms taken from the researcher's own title, aim and question (never added automatically). */
  function keywordCandidates(st, RC) {
    const L = RC.lex, src = [st.s1.title, st.s3.aim, st.s2.topic].filter(filled).join(' . ');
    const lang = RC.lang, out = [];
    const chunks = String(src).split(/[.,،;؛:?؟!()«»“”"\n]|\s[-–—]\s/);
    chunks.forEach((ch) => {
      let words = ch.trim().split(/\s+/).filter(Boolean), cur = [];
      const flush = () => { if (cur.length && cur.length <= 4) { const p = cur.join(' '); if (p.length > 3 && out.map((x) => norm(x, lang)).indexOf(norm(p, lang)) === -1) out.push(p); } cur = []; };
      words.forEach((w) => { const n = norm(w, lang); if (!n || L.kwStop.indexOf(n) !== -1 || /^\d+$/.test(n)) flush(); else cur.push(w.replace(/^[⁨⁩]+|[⁨⁩]+$/g, '')); });
      flush();
    });
    const have = st.s10.keywords.map((k) => norm(lang === 'ar' ? k.ar : k.en, lang));
    return out.filter((p) => have.indexOf(norm(p, lang)) === -1).slice(0, 10);
  }

  /* ---------- Consistency checks (Steps 8, 9 and 11) ---------- */
  function checks(st, RC) {
    const L = RC.lex, C = RC.checkText, lang = RC.lang, out = [];
    const add = (id, status, msgArg) => { const c = C[id]; out.push({ id, t: c.t, status, msg: typeof c[status] === 'function' ? c[status](msgArg) : c[status] }); };
    const d = draftOf(st), words = wc(d), lim = limitOf(st), kind = kindOf(st, RC);
    if (!filled(d)) { add('draft', 'bad'); return out; }
    // 1. Word limit
    if (lim) { if (words > lim) add('limit', 'bad', [words, lim]); else if (words < lim * 0.5) add('limit', 'info', [words, lim]); else add('limit', 'ok', [words, lim]); }
    else add('limit', 'warn');
    // 2. Format
    const lab = labelsFor(st, RC), heads = Object.keys(lab).filter((k) => lab[k] && st.s7.on[k]).map((k) => lab[k]);
    const hasHead = (h) => new RegExp('(^|\\n)\\s*' + escRe(h) + '\\s*' + escRe(RC.colon.trim())).test(d);
    if (st.s1.format === 'structured') { const miss = heads.filter((h) => !hasHead(h)); add('format', miss.length ? 'warn' : 'ok', miss.join(RC.sep)); }
    else if (st.s1.format === 'unstructured') { const found = Object.keys(RC.headingSets.generic).map((k) => RC.headingSets.generic[k]).filter((h) => h && hasHead(h)); add('format', found.length ? 'warn' : 'ok', found.join(RC.sep)); }
    // 3. Moves present
    const sw = sectionWords(st, RC), mv = moves(d, L.moveCues, lang);
    const missing = ['ctx', 'aim', 'met', 'res', 'con'].filter((m) => !mv[m] && !(sw[RC.moveSection[m]] > 0));
    add('moves', !missing.length ? 'ok' : missing.indexOf('res') !== -1 || missing.indexOf('met') !== -1 ? 'bad' : 'warn', missing.map((m) => RC.moveNames[m]).join(RC.sep));
    // 4. Placeholders and citations
    const ph = d.match(/\[[^\]]{1,60}\]/g) || [];
    if (ph.length) add('placeholder', 'bad', ph.slice(0, 4).join(RC.sep));
    const cit = d.match(/\([^()]{0,80}\d{4}[a-z]?\)|\[\d+(?:[,–-]\s?\d+)*\]/g) || [];
    add('cite', cit.length ? 'warn' : 'ok', cit.slice(0, 3).join(RC.sep));
    // 5. Methodological accuracy
    const metText = [sectionText('methods', st, RC), st.s4.analysis, st.s4.collection].join(' ');
    const quantCues = hits(metText, L.quantCues, lang), qualCues = hits(metText, L.qualCues, lang);
    if (!st.s1.approach) add('method', 'warn', '');
    else if (st.s1.approach === 'qual' && quantCues.length) add('method', 'warn', quantCues.join(RC.sep));
    else if (st.s1.approach === 'quant' && !/\d/.test(st.s4.sample + ' ' + st.s4.corpus)) add('method', 'warn', 'n');
    else if (st.s1.approach === 'mixed' && !filled(st.s4.integration)) add('method', 'warn', 'mix');
    else if (st.s1.approach === 'quant' && qualCues.length && !quantCues.length) add('method', 'info', qualCues.join(RC.sep));
    else add('method', 'ok');
    // 6. Findings
    const res = [st.s5.main, st.s5.support, st.s5.themes, st.s5.stats].join(' ');
    if (!filled(st.s5.main)) add('findings', 'bad');
    else if ((st.s1.approach === 'quant' || st.s1.approach === 'mixed') && !/[\d٠-٩]/.test(res)) add('findings', 'warn', 'num');
    else if ((st.s1.approach === 'qual' || st.s1.approach === 'mixed') && codeList(res)) add('findings', 'warn', 'codes');
    else if (filled(st.s3.question) && !filled(st.s5.answer)) add('findings', 'info', 'rq');
    else add('findings', 'ok');
    if (hits(res, L.vagueFindings, lang).length) add('vagueRes', 'warn', hits(res, L.vagueFindings, lang).join(RC.sep));
    // 7. Overclaiming
    const over = hits(d, L.overclaim, lang); add('overclaim', over.length ? 'warn' : 'ok', over.join(RC.sep));
    // 8. Aim states a purpose, not only a topic
    if (filled(st.s3.aim)) add('aim', hits(st.s3.aim, L.purposeVerbs, lang).length ? 'ok' : 'info');
    // 9. Proportions
    if (sw.total >= 60) {
      if (sw.background / sw.total > 0.3) add('balance', 'warn', 'bg');
      else if (sw.results / sw.total < 0.15) add('balance', 'warn', 'res');
      else add('balance', 'ok');
    }
    // 10. Tense and future forms
    const fut = hits(d, L.future, lang); add('tense', fut.length ? 'warn' : 'ok', fut.join(RC.sep));
    // 11. Abbreviations
    const ab = undefinedAbbr(d); add('abbr', ab.length ? 'warn' : 'ok', ab.join(RC.sep));
    // 12. Sentence length
    const longS = sentences(d).filter((s) => wc(s) > L.longLimit).length; add('sentences', longS ? 'warn' : 'ok', longS);
    // 13. Language of the abstract
    const sc = script(d);
    if (st.s1.lang === 'ar' && sc !== 'ar' && sc !== 'none') add('language', 'warn', 'ar');
    else if (st.s1.lang === 'en' && sc !== 'en' && sc !== 'none') add('language', 'warn', 'en');
    else if (st.s1.lang === 'both') add('language', 'info', 'both');
    // 14. Title–abstract alignment
    const tw = norm(st.s1.title, lang).split(' ').filter((w) => w.length > 3 && L.kwStop.indexOf(w) === -1);
    if (tw.length >= 2) { const dn = norm(d, lang), inA = tw.filter((w) => dn.indexOf(lang === 'ar' ? w.replace(/^ال/, '') : w.replace(/s$/, '')) !== -1).length; add('title', inA / tw.length >= 0.5 ? 'ok' : 'info'); }
    // 15. Keywords
    const kc = keywordChecks(st, RC).filter((x) => x.s !== 'ok' && x.s !== 'info');
    add('keywords', kc.some((x) => x.s === 'bad') ? 'bad' : kc.length ? 'warn' : 'ok', kc.map((x) => RC.kwMsg[x.k] ? RC.kwMsg[x.k].t : x.k).join(RC.sep));
    // 16. Journal rules entered by the researcher
    const rules = st.s9.rules.filter((r) => filled(r.t));
    if (rules.length) { const open = rules.filter((r) => !r.done).length; add('rules', open ? 'warn' : 'ok', open); }
    return out;
  }

  /* ---------- Suggested rubric scores ---------- */
  function suggestScores(st, RC) {
    const list = checks(st, RC), stat = (id) => (list.find((c) => c.id === id) || {}).status;
    const pen = (ids) => ids.reduce((n, id) => n + ({ bad: 2, warn: 1 }[stat(id)] || 0), 0);
    const clamp = (n) => Math.max(1, Math.min(5, n));
    const has = (x) => filled(x), sw = sectionWords(st, RC), d = draftOf(st);
    const sc = {};
    sc.context = !has(st.s2.context) && !has(st.s2.problem) ? 1 : clamp(5 - pen(['balance']) - (has(st.s2.problem) ? 0 : 1) - (has(st.s2.justification) ? 0 : 1));
    sc.aim = !has(st.s3.aim) ? 1 : clamp(5 - (stat('aim') === 'info' ? 1 : 0) - (has(st.s3.question) ? 0 : 1));
    sc.method = !has(sectionText('methods', st, RC)) ? 1 : clamp(5 - pen(['method']) * 1 - (sw.methods < 20 ? 1 : 0));
    sc.findings = !has(st.s5.main) ? 1 : clamp(5 - pen(['findings', 'vagueRes']) - (has(st.s5.support) || has(st.s5.themes) ? 0 : 1));
    sc.contribution = !has(st.s6.contribution) ? 1 : clamp(5 - pen(['overclaim']));
    sc.organisation = !has(d) ? 1 : clamp(5 - pen(['moves', 'format']));
    sc.language = !has(d) ? 1 : clamp(5 - pen(['sentences', 'tense', 'abbr']) - (languageCheck(d, RC.lex, RC.lang).items.filter((i) => i.k === 'repeat' && i.s === 'warn').length));
    sc.concise = !has(d) ? 1 : clamp(5 - pen(['limit', 'balance']) - (stat('sentences') === 'warn' ? 1 : 0));
    sc.terms = !has(d) ? 1 : clamp(5 - pen(['abbr', 'keywords']));
    sc.compliance = !has(d) ? 1 : clamp(5 - pen(['limit', 'format', 'keywords', 'rules', 'cite', 'placeholder', 'language']));
    return sc;
  }

  return { filled, wc, chars, charsNoSpace, norm, hits, sentences, script, languageCheck, undefinedAbbr, moves, codeList, kindOf, sectionText, labelsFor, assemble, sectionWords, limitOf, keywordChecks, keywordCandidates, checks, suggestScores };
})();
