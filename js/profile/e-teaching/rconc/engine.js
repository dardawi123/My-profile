/* =========================================================
   Research Conclusion Writing and Refinement — rule engine (window.RCE)
   صياغة خاتمة البحث وتنقيحها — محرك القواعد

   Transparent, rule-based checks and text assembly. No AI, no network.
   Every sentence the engine assembles comes from the researcher's own
   entries; wording frames come from the language file (window.RC).
   Academic tool developed by Dr. Merfat Alardawi | د. مرفت العرضاوي
   ========================================================= */
window.RCE = (function () {
  'use strict';
  const filled = (x) => Array.isArray(x) ? x.length > 0 : !!(x && String(x).trim());
  const wc = (s) => (String(s || '').trim().match(/\S+/g) || []).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
  const DSEC = ['purpose', 'findings', 'questions', 'contribution', 'implications', 'limitations', 'future', 'closing'];
  const MX = ['findings', 'contrib', 'impl', 'lim', 'future'];

  function norm(s, lang) {
    s = String(s || '').toLowerCase();
    if (lang === 'ar') s = s.replace(/[ً-ْٰـ]/g, '').replace(/[إأآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي').replace(/ة/g, 'ه');
    return s.replace(/[“”"«»()\[\]،,.;:؛؟?!’']/g, ' ').replace(/\s+/g, ' ').trim();
  }
  const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  function hits(text, cues, lang) {
    const t = ' ' + norm(text, lang) + ' ', out = [];
    (cues || []).forEach((c) => {
      const cn = norm(c, lang); if (!cn) return;
      const re = lang === 'ar' ? new RegExp('(^|\\s)(و|ف|ب|ل|ك|ال|وال|بال|لل)?' + escRe(cn) + (cn.length <= 3 ? '(?=\\s|$)' : '')) : new RegExp('(^|[^a-z])' + escRe(cn) + '(?=$|[^a-z])');
      if (re.test(t) && out.indexOf(c) === -1) out.push(c);
    });
    return out;
  }
  const sentences = (text) => String(text || '').replace(/\r/g, '').split(/\n+|(?<=[.!?؟])\s+(?=\S)/).map((x) => x.trim()).filter((x) => wc(x) > 0);
  const paragraphs = (text) => String(text || '').replace(/\r/g, '').split(/\n\s*\n/).map((p) => p.trim()).filter((p) => wc(p) > 0);
  const lines = (t) => String(t || '').split(/\n+/).map((x) => x.replace(/^\s*(?:[-–•*]|\(?[0-9٠-٩]+[.)])\s*/, '').trim()).filter(filled);
  function script(text) { const s = String(text || ''), ar = (s.match(/[؀-ۿ]/g) || []).length, la = (s.match(/[A-Za-z]/g) || []).length; if (!ar && !la) return 'none'; const r = ar / (ar + la); return r > 0.8 ? 'ar' : r < 0.2 ? 'en' : 'mixed'; }
  const CITE_RE = /\([^()]{0,160}?(?:1[89]\d\d|20\d\d|[١٢][٠-٩]{3}|n\.d\.|د\.ت)[a-z]?[^()]{0,120}\)|\[\d+(?:[,–-]\s?\d+)*\]/g;
  const cites = (text) => String(text || '').match(CITE_RE) || [];
  const citeCount = (text) => cites(text).reduce((n, c) => n + Math.max(1, (c.match(/(?:1[89]\d\d|20\d\d|[١٢][٠-٩]{3}|n\.d\.|د\.ت)/g) || []).length), 0);
  const short = (s, n) => { s = String(s || '').replace(/\s+/g, ' ').trim(); n = n || 70; return s.length > n ? s.slice(0, n - 1) + '…' : s; };
  function stem(w, lang) {
    if (lang === 'ar') return w.replace(/^(وال|بال|فال|كال|لل|ال|و|ف|ب|ل)(?=..)/, '').replace(/^ال/, '').replace(/(ات|ون|ين|ها|هم|يه|ه|ي)$/, '');
    return w.replace(/(ations|ation|ings|ing|ies|ied|ed|es|s)$/, '').replace(/(ive|al)$/, '');
  }
  function terms(text, L, lang) {
    const out = {}, stop = new Set((L.stop || []).map((x) => stem(norm(x, lang), lang)).concat((L.stop || []).map((x) => norm(x, lang))));
    norm(text, lang).split(' ').forEach((w) => { if (!w || /\d/.test(w) || stop.has(w)) return; const s = stem(w, lang); if (s.length < (lang === 'ar' ? 3 : 4) || stop.has(s)) return; out[s] = w; });
    return out;
  }
  function overlap(a, b, L, lang) { const A = terms(a, L, lang), B = terms(b, L, lang); return Object.keys(A).filter((k) => B[k]).map((k) => A[k]); }
  const simRatio = (a, b, L, lang) => { const A = Object.keys(terms(a, L, lang)), B = terms(b, L, lang); return A.length ? A.filter((k) => B[k]).length / A.length : 0; };

  /* ---------- Questions and findings ---------- */
  function questions(st) {
    const out = [];
    if (filled(st.s1.mainq)) out.push({ i: 0, code: 'MRQ', text: st.s1.mainq.trim() });
    lines(st.s1.subqs).forEach((q, k) => out.push({ i: k + 1, code: 'RQ' + (k + 1), text: q }));
    return out;
  }
  const findings = (st) => st.mx.findings.filter((f) => filled(f.statement) || filled(f.label));
  const fIndex = (st, id) => st.mx.findings.findIndex((f) => f.id === id);
  const fCode = (st, id) => { const i = fIndex(st, id); return i === -1 ? '' : 'F' + (i + 1); };
  const fName = (st, id) => { const i = fIndex(st, id); if (i === -1) return ''; const f = st.mx.findings[i]; return 'F' + (i + 1) + (filled(f.label) ? ' · ' + f.label.trim() : ''); };
  const fText = (st, id) => { const f = st.mx.findings.find((x) => x.id === id); return f ? (filled(f.statement) ? f.statement.trim() : String(f.label || '').trim()) : ''; };
  const qCode = (st, v) => { const q = questions(st).find((x) => String(x.i) === String(v)); return q ? q.code : ''; };
  const fFor = (st, qi) => findings(st).filter((f) => String(f.rq) === String(qi));
  const isQual = (st) => st.s1.approach === 'qual' || st.s1.approach === 'theory';

  /* ---------- Step diagnostics ---------- */
  function purposeChecks(st, RC) {
    const s = st.s2, out = [];
    if (!filled(s.problem)) return [{ k: 'puNone', s: 'bad' }];
    if (filled(st.s1.problem) && simRatio(s.problem, st.s1.problem, RC.lex, RC.lang) > 0.9 && wc(s.problem) >= wc(st.s1.problem) * 0.9) out.push({ k: 'puCopy', s: 'info' });
    const n = wc([s.problem, s.aim, s.motivation, s.context, s.issue].join(' ')); if (n > RC.lex.purposeMax) out.push({ k: 'puLong', s: 'warn', n });
    if (!filled(s.aim)) out.push({ k: 'puNoAim', s: 'warn' });
    if (!out.length) out.push({ k: 'puOk', s: 'ok' });
    return out;
  }
  function synthChecks(st, RC) {
    const fs = findings(st), out = [], L = RC.lex;
    if (!fs.length) return [{ k: 'syNone', s: 'bad' }];
    const main = fs.filter((f) => f.kind === 'main'); if (!main.length) out.push({ k: 'syNoMain', s: 'warn' }); else if (main.length > 1) out.push({ k: 'syManyMain', s: 'info', n: main.length });
    if (!filled(st.s3.synthesis)) out.push({ k: 'syNoSynth', s: 'bad' });
    else {
      const list = sentences(st.s3.synthesis).filter((x) => hits(x.split(/\s+/).slice(0, 4).join(' '), L.listCue, RC.lang).length || /^\s*(F\d|[0-9٠-٩]+[.)])/.test(x)).length;
      const syn = hits(st.s3.synthesis, L.synthCue, RC.lang).length;
      if (list >= 2 && !syn) out.push({ k: 'syList', s: 'warn' }); else out.push({ k: 'syOk', s: 'ok' });
      if (/[0-9٠-٩]+\s*(%|٪)|[“"«]/.test(st.s3.synthesis)) out.push({ k: 'syDetail', s: 'info' });
    }
    const noRq = fs.filter((f) => f.rq === ''); if (noRq.length) out.push({ k: 'syNoRq', s: 'info', list: noRq.map((f) => fName(st, f.id)) });
    return out;
  }
  function alignChecks(st, RC) {
    const qs = questions(st), out = [];
    if (!qs.length) return [{ k: 'alNoQ', s: 'bad' }];
    const noSt = qs.filter((q) => !filled((st.al[q.i] || {}).status)); if (noSt.length) out.push({ k: 'alNoStatus', s: 'bad', list: noSt.map((q) => q.code) });
    const noAns = qs.filter((q) => (st.al[q.i] || {}).status && (st.al[q.i] || {}).status !== 'none' && !filled((st.al[q.i] || {}).answer)); if (noAns.length) out.push({ k: 'alNoAnswer', s: 'warn', list: noAns.map((q) => q.code) });
    const noEv = qs.filter((q) => filled((st.al[q.i] || {}).answer) && !filled((st.al[q.i] || {}).evidence) && !fFor(st, q.i).length); if (noEv.length) out.push({ k: 'alNoEvidence', s: 'warn', list: noEv.map((q) => q.code) });
    const over = qs.filter((q) => (st.al[q.i] || {}).status === 'full' && !fFor(st, q.i).length); if (over.length) out.push({ k: 'alOverclaim', s: 'warn', list: over.map((q) => q.code) });
    if (qs.length >= 3 && qs.every((q) => (st.al[q.i] || {}).status === 'full')) out.push({ k: 'alAllFull', s: 'info' });
    if (!out.length) out.push({ k: 'alOk', s: 'ok' });
    return out;
  }
  const rowsWith = (st, n, req) => st.mx[n].filter((r) => req.every((c) => filled(r[c])));
  function contribChecks(st, RC) {
    const r = rowsWith(st, 'contrib', ['text']); if (!r.length) return [{ k: 'coNone', s: 'bad' }];
    const out = [];
    const orig = r.filter((x) => hits(x.text, RC.lex.originality, RC.lang).length); if (orig.length) out.push({ k: 'coOriginal', s: 'warn', list: orig.map((x) => short(x.text, 40)) });
    const noF = r.filter((x) => !filled(x.finding)); if (noF.length) out.push({ k: 'coNoFinding', s: 'warn', list: noF.map((x) => short(x.text, 40)) });
    const ov = r.filter((x) => hits(x.text, RC.lex.overclaim, RC.lang).length); if (ov.length) out.push({ k: 'coOver', s: 'warn', list: ov.map((x) => short(x.text, 40)) });
    if (!out.length) out.push({ k: 'coOk', s: 'ok', n: r.length });
    return out;
  }
  function implChecks(st, RC) {
    const r = rowsWith(st, 'impl', ['impl']); if (!r.length) return [{ k: 'imNone', s: 'bad' }];
    const out = [];
    const noF = r.filter((x) => !filled(x.finding)); if (noF.length) out.push({ k: 'imNoFinding', s: 'warn', list: noF.map((x) => short(x.impl, 40)) });
    const ov = r.filter((x) => hits(x.impl, RC.lex.overclaim, RC.lang).length); if (ov.length) out.push({ k: 'imOver', s: 'warn', list: ov.map((x) => short(x.impl, 40)) });
    if (r.length > 1 && [...new Set(r.map((x) => x.type).filter(filled))].length === 1) out.push({ k: 'imOneType', s: 'info' });
    if (!out.length) out.push({ k: 'imOk', s: 'ok', n: r.length });
    return out;
  }
  function limChecks(st, RC) {
    if (st.s7.elsewhere) return [{ k: 'liElsewhere', s: 'ok' }];
    const r = rowsWith(st, 'lim', ['desc']); if (!r.length) return [{ k: 'liNone', s: 'bad' }];
    const out = [];
    const avoid = r.filter((x) => x.avoid === 'error'); if (avoid.length) out.push({ k: 'liAvoid', s: 'warn', list: avoid.map((x) => short(x.desc, 40)) });
    const noEff = r.filter((x) => !filled(x.effect)); if (noEff.length) out.push({ k: 'liNoEffect', s: 'info', list: noEff.map((x) => short(x.desc, 40)) });
    if (isQual(st) && r.some((x) => x.type === 'general' || hits(x.desc + ' ' + x.effect, RC.lex.generalise, RC.lang).length)) out.push({ k: 'liTransfer', s: 'info' });
    const under = r.filter((x) => hits(x.desc + ' ' + x.effect, RC.lex.undermine, RC.lang).length); if (under.length) out.push({ k: 'liUndermine', s: 'info', list: under.map((x) => short(x.desc, 40)) });
    if (!out.length) out.push({ k: 'liOk', s: 'ok', n: r.length });
    return out;
  }
  function futureChecks(st, RC) {
    const r = rowsWith(st, 'future', ['rec']); if (!r.length) return [{ k: 'fuNone', s: 'bad' }];
    const out = [];
    const gen = r.filter((x) => hits(x.rec, RC.lex.generic, RC.lang).length && wc(x.rec) < 12); if (gen.length) out.push({ k: 'fuGeneric', s: 'warn', list: gen.map((x) => short(x.rec, 40)) });
    const noB = r.filter((x) => !filled(x.basis)); if (noB.length) out.push({ k: 'fuNoBasis', s: 'warn', list: noB.map((x) => short(x.rec, 40)) });
    if (!out.length) out.push({ k: 'fuOk', s: 'ok', n: r.length });
    return out;
  }
  function closingText(st, RC) { return filled(st.s9.own) ? st.s9.own : RC.tpl.closing(st); }
  function closingChecks(st, RC) {
    const t = closingText(st, RC), L = RC.lex, out = [];
    if (!filled(t)) return [{ k: 'clNone', s: 'bad' }];
    if (/[0-9٠-٩]+\s*(%|٪)|\bp\s*[<=]|[“"«]/.test(t) || cites(t).length) out.push({ k: 'clNewEvidence', s: 'warn' });
    const ov = hits(t, L.overclaim, RC.lang); if (ov.length) out.push({ k: 'clOver', s: 'warn', list: ov });
    const cl = hits(sentences(t)[0] || '', L.cliche, RC.lang); if (cl.length) out.push({ k: 'clCliche', s: 'info', list: cl });
    if (filled(st.s1.problem + st.s1.mainq) && !overlap(t, st.s1.problem + ' ' + st.s1.mainq, L, RC.lang).length) out.push({ k: 'clNoLink', s: 'info' });
    if (wc(t) > 90) out.push({ k: 'clLong', s: 'info', n: wc(t) });
    if (!out.length) out.push({ k: 'clOk', s: 'ok' });
    return out;
  }

  /* ---------- Tool G: Conclusion Coherence Checker ---------- */
  function mapParas(text, RC) {
    return paragraphs(text).map((p) => {
      let best = 'unclear', n = 0;
      DSEC.forEach((id) => { const h = hits(p, RC.lex.partCue[id], RC.lang).length; if (h > n) { n = h; best = id; } });
      return { p, part: best };
    });
  }
  function textCheck(text, RC, st) {
    const L = RC.lex, lang = RC.lang, out = [];
    if (!filled(text)) return out;
    const ss = sentences(text), total = wc(text);
    const long = ss.filter((s) => wc(s) > L.longLimit); out.push(long.length ? { k: 'txLong', s: 'warn', n: long.length, list: long.slice(0, 3).map((s) => short(s, 90)) } : { k: 'txLong', s: 'ok' });
    const target = st ? Number(String(st.s10.target).replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))) || 0 : 0;
    if (target) out.push(total > target * 1.25 ? { k: 'txConcise', s: 'warn', n: total, t: target } : { k: 'txConcise', s: 'ok', n: total, t: target });
    const seen = {}, dup = []; ss.forEach((s) => { const k = norm(s, lang); if (wc(s) >= 6) { if (seen[k]) dup.push(s); seen[k] = 1; } }); if (dup.length) out.push({ k: 'txRepeat', s: 'warn', n: dup.length, list: dup.slice(0, 2).map((s) => short(s, 70)) });
    const grams = {}; norm(text, lang).split(' ').forEach((w, i, a) => { if (i < 3) return; const g = a.slice(i - 3, i + 1).join(' '); if (g.length > 18) grams[g] = (grams[g] || 0) + 1; }); const rep = Object.keys(grams).filter((g) => grams[g] >= 3); if (rep.length) out.push({ k: 'txPhrase', s: 'info', list: rep.slice(0, 3) });
    const q = (String(text).match(/[“"«][^”"»]{8,}[”"»]/g) || []); const nums = (String(text).match(/[0-9٠-٩]+(?:[.,٫][0-9٠-٩]+)?\s*(%|٪)|\bp\s*[<=]\s*[.0-9]+|\bn\s*=\s*\d+/gi) || []);
    if (q.length || nums.length) out.push({ k: 'txNewEvidence', s: 'warn', n: q.length + nums.length });
    const c = citeCount(text); if (c > 3) out.push({ k: 'txCites', s: 'info', n: c });
    const ov = hits(text, L.overclaim, lang); if (ov.length) out.push({ k: 'txOver', s: 'warn', list: ov });
    const og = hits(text, L.originality, lang); if (og.length) out.push({ k: 'txOriginal', s: 'warn', list: og });
    if (st && isQual(st)) { const g = hits(text, L.overgeneral.concat(L.generalise), lang); if (g.length) out.push({ k: 'txGeneral', s: 'info', list: g }); }
    const h = hits(text, L.hedge, lang); out.push(h.length ? { k: 'txHedge', s: 'ok', n: h.length } : { k: 'txHedge', s: 'info' });
    const gen = hits(text, L.generic, lang); if (gen.length) out.push({ k: 'txGeneric', s: 'info', list: gen });
    const cl = hits(ss[0] || '', L.cliche, lang); if (cl.length) out.push({ k: 'txCliche', s: 'info', list: cl });
    const tr = hits(text, L.transitions, lang).length; const ps = paragraphs(text); if (ps.length >= 3 && tr < 2) out.push({ k: 'txFlow', s: 'info' });
    const pl = ps.filter((p) => wc(p) > L.paraMax); if (pl.length) out.push({ k: 'txPara', s: 'warn', n: pl.length });
    if (st) {
      const miss = questions(st).filter((q) => !overlap(q.text, text, L, lang).length).map((q) => q.code); if (miss.length) out.push({ k: 'txQuestions', s: 'info', list: miss });
      const main = findings(st).find((f) => f.kind === 'main'); if (main && !overlap(main.statement || main.label, text, L, lang).length) out.push({ k: 'txMainFinding', s: 'warn' });
      const map = mapParas(text, RC); const ci = map.map((m) => m.part).lastIndexOf('closing'); if (map.length >= 2 && ci !== -1 && ci < map.length - 1) out.push({ k: 'txClosingNotLast', s: 'info' });
      if (map.length >= 2 && map[map.length - 1].part !== 'closing' && map[map.length - 1].part !== 'unclear' && ci === -1) out.push({ k: 'txNoClosing', s: 'info' });
      const sc = script(text); if ((lang === 'ar' && sc === 'en') || (lang === 'en' && sc === 'ar')) out.push({ k: 'txLang', s: 'info' });
    }
    const ph = String(text).match(/\[[^\]]{1,60}\]/g) || []; if (ph.length) out.push({ k: 'txPlaceholder', s: 'bad', list: ph.slice(0, 6) });
    return out;
  }

  /* ---------- Assembly ---------- */
  function ctx(st) { return { fName: (id) => fName(st, id), fText: (id) => fText(st, id), fCode: (id) => fCode(st, id), qCode: (v) => qCode(st, v), questions: questions(st), findings: findings(st), fFor: (qi) => fFor(st, qi) }; }
  function partText(id, st, RC) { return st.s10.edited[id] ? String(st.s10.text[id] || '') : (RC.tpl.d[id](st, ctx(st)) || ''); }
  function assemble(st, RC) {
    const useH = st.s10.headings && st.s1.headings !== 'none';
    return st.s10.order.filter((id) => st.s10.on[id] && filled(partText(id, st, RC)) && !(id === 'limitations' && st.s7.elsewhere)).map((id) => (useH ? RC.dHeadings[id] + '\n' : '') + partText(id, st, RC).trim()).join('\n\n');
  }

  /* ---------- Evaluation ---------- */
  const AREAS = [['purpose', purposeChecks], ['synthesis', synthChecks], ['align', alignChecks], ['contrib', contribChecks], ['impl', implChecks], ['lim', limChecks], ['future', futureChecks], ['closing', closingChecks]];
  function checks(st, RC) {
    const out = [];
    AREAS.forEach(([a, fn]) => fn(st, RC).forEach((x) => out.push(Object.assign({ area: a }, x))));
    if (!filled(st.s10.draft)) out.push({ area: 'draft', k: 'drNone', s: 'bad' }); else textCheck(st.s10.draft, RC, st).forEach((x) => { if (x.s !== 'ok') out.push(Object.assign({ area: 'draft' }, x)); });
    return out;
  }
  const CRIT_AREAS = { purpose: ['purpose'], synthesis: ['synthesis'], alignment: ['align'], interpretation: ['synthesis', 'align'], contribution: ['contrib'], implications: ['impl'], limitations: ['lim'], future: ['future'], organisation: ['draft'], writing: ['draft'], concise: ['draft', 'purpose'], closing: ['closing'] };
  const CRIT_KEYS = { organisation: ['txClosingNotLast', 'txNoClosing', 'txFlow', 'txPara', 'drNone'], writing: ['txLong', 'txPlaceholder', 'txCliche', 'txLang', 'txOver', 'txGeneral', 'drNone'], concise: ['txConcise', 'txRepeat', 'txPhrase', 'puLong', 'drNone'], interpretation: ['syList', 'syNoSynth', 'alOverclaim', 'alNoEvidence', 'syNone', 'alNoQ'] };
  function suggestScores(st, RC) {
    const list = checks(st, RC), sc = {};
    RC.rubric.forEach((c) => {
      let items = list.filter((x) => (CRIT_AREAS[c.id] || []).indexOf(x.area) !== -1);
      if (CRIT_KEYS[c.id]) items = items.filter((x) => CRIT_KEYS[c.id].indexOf(x.k) !== -1);
      const bad = items.filter((x) => x.s === 'bad').length, warn = items.filter((x) => x.s === 'warn').length;
      sc[c.id] = Math.max(1, Math.min(5, 5 - bad * 2 - warn));
    });
    return sc;
  }

  /* ---------- CSV ---------- */
  function toCSV(rows, cols) { const q = (v) => { v = Array.isArray(v) ? v.join('|') : String(v == null ? '' : v); return /[",\n\r]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }; return [cols.join(',')].concat(rows.map((r) => cols.map((c) => q(r[c])).join(','))).join('\r\n'); }
  function parseCSV(text) {
    text = String(text || '').replace(/^﻿/, ''); const rows = []; let row = [], cur = '', inQ = false;
    for (let i = 0; i < text.length; i++) { const ch = text[i];
      if (inQ) { if (ch === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else inQ = false; } else cur += ch; }
      else if (ch === '"') inQ = true; else if (ch === ',' || ch === ';' || ch === '\t') { row.push(cur); cur = ''; }
      else if (ch === '\n' || ch === '\r') { if (ch === '\r' && text[i + 1] === '\n') i++; row.push(cur); rows.push(row); row = []; cur = ''; } else cur += ch; }
    if (cur || row.length) { row.push(cur); rows.push(row); }
    return rows.filter((r) => r.some((c) => filled(c)));
  }

  return { DSEC, MX, filled, wc, norm, hits, sentences, paragraphs, lines, script, cites, citeCount, short, overlap, questions, findings, fCode, fName, fText, qCode, fFor, isQual,
    purposeChecks, synthChecks, alignChecks, contribChecks, implChecks, limChecks, futureChecks, closingChecks, closingText, mapParas, textCheck, ctx, partText, assemble, checks, suggestScores, toCSV, parseCSV };
})();
