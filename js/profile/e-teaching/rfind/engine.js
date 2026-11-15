/* =========================================================
   Research Findings: Writing, Presentation, and Discussion
   صياغة نتائج البحث وعرضها ومناقشتها — rule engine (window.RFE)

   Transparent, rule-based checks and text assembly. No AI, no network.
   Every sentence the engine assembles comes from the researcher's own
   entries; wording frames come from the language file (window.RC).
   Academic tool developed by Dr. Merfat Alardawi | د. مرفت العرضاوي
   ========================================================= */
window.RFE = (function () {
  'use strict';
  const filled = (x) => Array.isArray(x) ? x.length > 0 : !!(x && String(x).trim());
  const wc = (s) => (String(s || '').trim().match(/\S+/g) || []).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
  const DSEC = ['opening', 'interpret', 'questions', 'literature', 'theory', 'unexpected', 'implications', 'limitations', 'future', 'conclusion'];
  const MX = ['evidence', 'themes', 'findings', 'av', 'joint', 'dplan', 'interp', 'theory', 'lit', 'unexp', 'impl', 'lim', 'future'];

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
  const hasCite = (text) => cites(text).length > 0;
  const citeCount = (text) => cites(text).reduce((n, c) => n + Math.max(1, (c.match(/(?:1[89]\d\d|20\d\d|[١٢][٠-٩]{3}|n\.d\.|د\.ت)/g) || []).length), 0);
  const hasYear = (s) => /(?:1[89]\d\d|20\d\d|[١٢][٠-٩]{3}|n\.d\.|د\.ت)/.test(String(s || ''));
  const hasDigit = (s) => /[0-9٠-٩]/.test(String(s || ''));
  const short = (s, n) => { s = String(s || '').replace(/\s+/g, ' ').trim(); n = n || 70; return s.length > n ? s.slice(0, n - 1) + '…' : s; };

  /* ---------- Research questions, findings and links ---------- */
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
  const evFor = (st, fid) => st.mx.evidence.filter((e) => e.finding === fid && filled(e.content));
  const avFor = (st, fid) => st.mx.av.filter((e) => e.finding === fid && filled(e.observation));
  const evCount = (st, fid) => evFor(st, fid).length + avFor(st, fid).length;
  const fFor = (st, qi) => findings(st).filter((f) => String(f.rq) === String(qi));
  const TEXTUAL = ['semiotic', 'textual', 'feminist', 'narrative', 'discourse'];
  const isTextual = (st) => TEXTUAL.indexOf(st.s1.technique) !== -1;
  const isQual = (st) => st.s1.approach === 'qual' || st.s1.approach === 'theory';
  const separate = (st) => st.s2.pub === 'separate';
  function recommended(st, RC) { const t = RC.techniques.find((x) => x.id === st.s1.technique); return t ? t.fit : ''; }

  /* ---------- Step diagnostics (k = message key, s = status) ---------- */
  function structChecks(st, RC) {
    const out = [], rec = recommended(st, RC);
    if (!st.s2.structure) return [{ k: 'structNone', s: 'bad' }];
    if (rec && rec !== st.s2.structure) out.push({ k: 'structFit', s: 'info', a: rec }); else out.push({ k: 'structOk', s: 'ok' });
    if (st.s2.pub === 'combined' && st.s1.approach === 'quant') out.push({ k: 'pubQuant', s: 'info' });
    if (!filled(st.s2.rationale)) out.push({ k: 'structWhy', s: 'warn' });
    return out;
  }
  function evidenceChecks(st, RC) {
    const ev = st.mx.evidence.filter((e) => filled(e.content)), out = [];
    if (ev.length < 3) return [{ k: 'evFew', s: 'bad', n: ev.length }];
    out.push({ k: 'evOk', s: 'ok', n: ev.length });
    const noSrc = ev.filter((e) => /^(quote|excerpt)$/.test(e.type) && !filled(e.source)); if (noSrc.length) out.push({ k: 'evNoSrc', s: 'warn', list: noSrc.map((e) => e.code || short(e.content, 30)) });
    const noLoc = ev.filter((e) => /^(scene|av)$/.test(e.type) && !filled(e.loc)); if (noLoc.length) out.push({ k: 'evNoLoc', s: 'warn', list: noLoc.map((e) => e.code || short(e.content, 30)) });
    const stat = ev.filter((e) => e.type === 'stat' && !hasDigit(e.content)); if (stat.length) out.push({ k: 'evStat', s: 'warn', list: stat.map((e) => e.code || short(e.content, 30)) });
    const dup = {}; ev.forEach((e) => { const c = String(e.code || '').trim(); if (c) dup[c] = (dup[c] || 0) + 1; }); const d = Object.keys(dup).filter((c) => dup[c] > 1); if (d.length) out.push({ k: 'evDup', s: 'warn', list: d });
    return out;
  }
  function themeChecks(st, RC) {
    const th = st.mx.themes.filter((t) => filled(t.name)), out = [];
    if (!th.length) return isQual(st) ? [{ k: 'thNone', s: 'info' }] : [];
    const noDef = th.filter((t) => !filled(t.def)); if (noDef.length) out.push({ k: 'thNoDef', s: 'warn', list: noDef.map((t) => t.name) });
    const topic = th.filter((t) => wc(t.name) <= 2); if (topic.length) out.push({ k: 'thTopic', s: 'info', list: topic.map((t) => t.name) });
    if (!noDef.length && !topic.length) out.push({ k: 'thOk', s: 'ok', n: th.length });
    return out;
  }
  function findingChecks(st, RC) {
    const fs = findings(st), L = RC.lex, out = [];
    if (fs.length < 2) return [{ k: 'fFew', s: 'bad' }];
    out.push({ k: 'fOk', s: 'ok', n: fs.length });
    const noRq = fs.filter((f) => f.rq === ''); if (noRq.length) out.push({ k: 'fNoRq', s: 'warn', list: noRq.map((f) => fName(st, f.id)) });
    const stat = fs.filter((f) => f.basis === 'stat' && !hasDigit(f.statement + ' ' + f.stat)); if (stat.length) out.push({ k: 'fStat', s: 'warn', list: stat.map((f) => fName(st, f.id)) });
    if (separate(st)) { const it = fs.filter((f) => hits(f.statement, L.interpret, RC.lang).length); if (it.length) out.push({ k: 'fInterp', s: 'info', list: it.map((f) => fName(st, f.id)) }); }
    const gen = fs.filter((f) => hits(f.statement, L.overgeneral, RC.lang).length); if (gen.length && isQual(st)) out.push({ k: 'fGeneral', s: 'info', list: gen.map((f) => fName(st, f.id)) });
    return out;
  }
  function alignChecks(st, RC) {
    const qs = questions(st), out = [], fs = findings(st);
    if (!qs.length) return [{ k: 'alNoQ', s: 'bad' }];
    const none = qs.filter((q) => !fFor(st, q.i).length); if (none.length) out.push({ k: 'alUnanswered', s: 'warn', list: none.map((q) => q.code) });
    const over = qs.filter((q) => ((st.al[q.i] || {}).coverage === 'full') && fFor(st, q.i).reduce((n, f) => n + evCount(st, f.id), 0) < 2); if (over.length) out.push({ k: 'alThin', s: 'warn', list: over.map((q) => q.code) });
    const noCov = qs.filter((q) => !(st.al[q.i] || {}).coverage); if (noCov.length) out.push({ k: 'alNoCov', s: 'bad', list: noCov.map((q) => q.code) });
    const orphan = fs.filter((f) => f.rq === '' || !qs.some((q) => String(q.i) === String(f.rq))); if (orphan.length) out.push({ k: 'alOrphan', s: 'info', list: orphan.map((f) => fName(st, f.id)) });
    if (!out.length) out.push({ k: 'alOk', s: 'ok' });
    return out;
  }
  function integrateChecks(st, RC) {
    const fs = findings(st), out = [];
    if (!fs.length) return [{ k: 'fFew', s: 'bad' }];
    const thin = fs.filter((f) => evCount(st, f.id) < 2); if (thin.length) out.push({ k: 'inThin', s: 'warn', list: thin.map((f) => fName(st, f.id)) }); else out.push({ k: 'inOk', s: 'ok' });
    const longQ = st.mx.evidence.filter((e) => /^(quote|excerpt)$/.test(e.type) && wc(e.content) > 40); if (longQ.length) out.push({ k: 'inBlock', s: 'info', list: longQ.map((e) => e.code || short(e.content, 30)) });
    const avNoT = st.mx.av.filter((a) => filled(a.observation) && !filled(a.time)); if (avNoT.length) out.push({ k: 'inAvTime', s: 'warn', list: avNoT.map((a) => short(a.title || a.observation, 30)) });
    if (isTextual(st) && !st.mx.av.some((a) => filled(a.observation))) out.push({ k: 'inAvNone', s: 'info' });
    return out;
  }
  function vizChecks(st, RC) {
    const v = st.viz, rows = v.rows.filter((r) => filled(r.label)), out = [];
    if (!rows.length) return [{ k: 'vzEmpty', s: 'info' }];
    const bad = rows.filter((r) => !isFinite(parseNum(r.value))); if (bad.length) out.push({ k: 'vzNum', s: 'warn', list: bad.map((r) => r.label) });
    if (v.qual) out.push({ k: 'vzQual', s: 'info' });
    if (!filled(v.title)) out.push({ k: 'vzTitle', s: 'warn' });
    if (!out.length) out.push({ k: 'vzOk', s: 'ok' });
    return out;
  }
  const parseNum = (v) => { const s = String(v == null ? '' : v).replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace('٫', '.').replace(/,/g, '').trim(); return s === '' ? NaN : Number(s); };
  function rowsWith(st, name, req) { return st.mx[name].filter((r) => req.every((c) => filled(r[c]))); }
  function dplanChecks(st, RC) {
    const r = rowsWith(st, 'dplan', ['finding']); if (!r.length) return [{ k: 'dpNone', s: 'bad' }];
    const out = [{ k: 'dpOk', s: 'ok', n: r.length }];
    const noCrit = r.filter((x) => !filled(x.crit)); if (noCrit.length) out.push({ k: 'dpNoCrit', s: 'warn', list: noCrit.map((x) => fName(st, x.finding)) });
    const all = findings(st).length; if (all >= 4 && r.length >= all) out.push({ k: 'dpAll', s: 'info' });
    return out;
  }
  function interpChecks(st, RC) {
    const r = rowsWith(st, 'interp', ['finding', 'meaning']); if (!r.length) return [{ k: 'ipNone', s: 'bad' }];
    const out = [];
    const noEv = r.filter((x) => !filled(x.evidence)); if (noEv.length) out.push({ k: 'ipSpec', s: 'warn', list: noEv.map((x) => fName(st, x.finding)) });
    const noAlt = r.filter((x) => !filled(x.alt)); if (noAlt.length) out.push({ k: 'ipNoAlt', s: 'info', list: noAlt.map((x) => fName(st, x.finding)) });
    const ov = r.filter((x) => hits(x.meaning, RC.lex.overclaim, RC.lang).length); if (ov.length) out.push({ k: 'ipOver', s: 'warn', list: ov.map((x) => fName(st, x.finding)) });
    if (!out.length) out.push({ k: 'ipOk', s: 'ok', n: r.length });
    return out;
  }
  function theoryChecks(st, RC) {
    const r = rowsWith(st, 'theory', ['finding', 'rel']); if (!r.length) return [{ k: 'thyNone', s: 'bad' }];
    const out = [];
    if (!filled(st.s11.framework)) out.push({ k: 'thyNoFw', s: 'warn' });
    const noC = r.filter((x) => !filled(x.concept)); if (noC.length) out.push({ k: 'thyNoConcept', s: 'warn', list: noC.map((x) => fName(st, x.finding)) });
    if (r.length >= 2 && r.every((x) => x.rel === 'support')) out.push({ k: 'thyAllSupport', s: 'info' });
    const noEv = r.filter((x) => !filled(x.evidence)); if (noEv.length) out.push({ k: 'thyNoEv', s: 'info', list: noEv.map((x) => fName(st, x.finding)) });
    if (!out.length) out.push({ k: 'thyOk', s: 'ok', n: r.length });
    return out;
  }
  function litChecks(st, RC) {
    const r = rowsWith(st, 'lit', ['study']); if (!r.length) return [{ k: 'litNone', s: 'bad' }];
    const out = [];
    const noYear = r.filter((x) => !hasYear(x.study)); if (noYear.length) out.push({ k: 'litNoYear', s: 'warn', list: noYear.map((x) => short(x.study, 30)) });
    const noRef = r.filter((x) => !filled(x.ref)); if (noRef.length) out.push({ k: 'litNoRef', s: 'warn', list: noRef.map((x) => short(x.study, 30)) });
    const contra = r.filter((x) => (x.rel === 'contra' || x.rel === 'partial') && !filled(x.explain)); if (contra.length) out.push({ k: 'litNoExplain', s: 'warn', list: contra.map((x) => short(x.study, 30)) });
    const noF = r.filter((x) => !filled(x.finding)); if (noF.length) out.push({ k: 'litNoFinding', s: 'warn', list: noF.map((x) => short(x.study, 30)) });
    const noPrev = r.filter((x) => !filled(x.prev)); if (noPrev.length) out.push({ k: 'litNoPrev', s: 'warn', list: noPrev.map((x) => short(x.study, 30)) });
    if (r.length < 2) out.push({ k: 'litFew', s: 'info' });
    if (r.some((x) => x.rel === 'novel')) out.push({ k: 'litNovel', s: 'info' });
    if (!out.length) out.push({ k: 'litOk', s: 'ok', n: r.length });
    return out;
  }
  function unexpChecks(st, RC) {
    const r = rowsWith(st, 'unexp', ['desc']); if (!r.length) return [{ k: 'unNone', s: 'info' }];
    const out = [];
    const noEx = r.filter((x) => !filled(x.explain)); if (noEx.length) out.push({ k: 'unNoExplain', s: 'warn', list: noEx.map((x) => short(x.desc, 40)) });
    const noEv = r.filter((x) => !filled(x.evidence)); if (noEv.length) out.push({ k: 'unNoEv', s: 'warn', list: noEv.map((x) => short(x.desc, 40)) });
    if (!out.length) out.push({ k: 'unOk', s: 'ok', n: r.length });
    return out;
  }
  function implChecks(st, RC) {
    const r = rowsWith(st, 'impl', ['impl']); if (!r.length) return [{ k: 'imNone', s: 'bad' }];
    const out = [];
    const noF = r.filter((x) => !filled(x.finding)); if (noF.length) out.push({ k: 'imNoFinding', s: 'warn', list: noF.map((x) => short(x.impl, 40)) });
    const ov = r.filter((x) => hits(x.impl, RC.lex.overclaim, RC.lang).length); if (ov.length) out.push({ k: 'imOver', s: 'warn', list: ov.map((x) => short(x.impl, 40)) });
    const types = [...new Set(r.map((x) => x.type).filter(filled))]; if (types.length === 1 && r.length > 1) out.push({ k: 'imOneType', s: 'info' });
    if (!out.length) out.push({ k: 'imOk', s: 'ok', n: r.length });
    return out;
  }
  function limChecks(st, RC) {
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

  /* ---------- Text checks (findings draft, discussion draft, pasted text) ---------- */
  function textCheck(text, RC, st, mode) {
    const L = RC.lex, lang = RC.lang, out = [];
    if (!filled(text)) return out;
    const ss = sentences(text);
    const long = ss.filter((s) => wc(s) > L.longLimit); out.push(long.length ? { k: 'txLong', s: 'warn', n: long.length, list: long.slice(0, 3).map((s) => short(s, 90)) } : { k: 'txLong', s: 'ok' });
    if (mode === 'findings') {
      if (st && separate(st)) { const it = hits(text, L.interpret, lang); if (it.length) out.push({ k: 'txInterp', s: 'warn', list: it.slice(0, 6) }); const c = citeCount(text); if (c) out.push({ k: 'txLitInResults', s: 'info', n: c }); }
      const q = (String(text).match(/[“"«][^”"»]{8,}[”"»](?!\s*\()/g) || []).slice(0, 3); if (q.length) out.push({ k: 'txQuoteNoSrc', s: 'warn', list: q.map((x) => short(x, 50)) });
      const g = hits(text, L.overgeneral, lang); if (g.length && st && isQual(st)) out.push({ k: 'txGeneral', s: 'info', list: g });
      const p = String(text).match(/p\s*[<=>]\s*[.0-9٠-٩]+/gi) || []; if (p.length && !/(?:\bd\b|η|r²|r2|cramér|cramer|φ|ω|odds ratio|OR\s*=|حجم الأثر|effect size)/i.test(text)) out.push({ k: 'txNoEffect', s: 'info' });
    }
    if (mode === 'discussion') {
      const n = citeCount(text); out.push(n >= 3 ? { k: 'txCites', s: 'ok', n } : { k: 'txCites', s: 'warn', n });
      const h = hits(text, L.hedge, lang); out.push(h.length ? { k: 'txHedge', s: 'ok', n: h.length } : { k: 'txHedge', s: 'info' });
      const uns = ss.filter((s) => hits(s, L.claimCues, lang).length && !hasCite(s)).map((s) => short(s, 80)).slice(0, 3); if (uns.length) out.push({ k: 'txUnsupported', s: 'warn', list: uns });
      if (st && isQual(st)) { const ca = hits(text, L.causal, lang); if (ca.length) out.push({ k: 'txCausal', s: 'info', list: ca }); }
      const gen = hits(text, L.generic, lang); if (gen.length) out.push({ k: 'txGeneric', s: 'info', list: gen });
      if (st && filled(st.s8.draft)) { const fs = new Set(sentences(st.s8.draft).map((s) => norm(s, lang)).filter((s) => wc(s) >= 6)); const rep = ss.filter((s) => fs.has(norm(s, lang))); if (rep.length) out.push({ k: 'txRepeat', s: 'warn', n: rep.length, list: rep.slice(0, 2).map((s) => short(s, 70)) }); }
    }
    const ov = hits(text, L.overclaim, lang); if (ov.length) out.push({ k: 'txOver', s: 'warn', list: ov });
    const pl = paragraphs(text).filter((p) => wc(p) > L.paraMax); if (pl.length) out.push({ k: 'txPara', s: 'warn', n: pl.length });
    const ph = String(text).match(/\[[^\]]{1,60}\]/g) || []; if (ph.length) out.push({ k: 'txPlaceholder', s: 'bad', list: ph.slice(0, 6) });
    if (st) { const sc = script(text); if ((lang === 'ar' && sc === 'en') || (lang === 'en' && sc === 'ar')) out.push({ k: 'txLang', s: 'info' }); }
    return out;
  }
  /* Tool G: label each sentence as presenting results, interpreting/discussing, or unclear. */
  function classify(text, RC) {
    const L = RC.lex, lang = RC.lang;
    return sentences(text).map((s) => {
      const r = hits(s, L.resultCue, lang).length + (/[0-9٠-٩]+\s*(%|٪)|\bn\s*=|\bM\s*=|\bp\s*[<=]/i.test(s) ? 2 : 0) + (/[“"«]/.test(s) ? 1 : 0);
      const d = hits(s, L.interpret, lang).length + hits(s, L.hedge, lang).length + (hasCite(s) ? 2 : 0) + hits(s, L.discussCue, lang).length;
      return { s, kind: r > d ? 'results' : d > r ? 'discussion' : 'unclear' };
    });
  }

  /* ---------- Assembly ---------- */
  function evidenceSentence(e, RC) { return RC.tpl.evidence(e); }
  function findingPara(st, RC, f) {
    const evs = evFor(st, f.id).slice(0, 3).map((e) => evidenceSentence(e, RC)).concat(avFor(st, f.id).slice(0, 2).map((a) => RC.tpl.av(a)));
    return RC.tpl.finding(f, { code: fCode(st, f.id), rq: qCode(st, f.rq), evs, combined: st.s2.pub === 'combined' });
  }
  function composeFindings(st, RC) {
    const parts = [];
    if (filled(st.s8.intro)) parts.push(st.s8.intro.trim());
    findings(st).forEach((f) => { const p = findingPara(st, RC, f); if (filled(p)) parts.push(p); });
    if (filled(st.s8.summary)) parts.push(st.s8.summary.trim());
    return parts.join('\n\n');
  }
  function ctx(st) {
    return { fName: (id) => fName(st, id), fText: (id) => fText(st, id), fCode: (id) => fCode(st, id), qCode: (v) => qCode(st, v), questions: questions(st), findings: findings(st), fFor: (qi) => fFor(st, qi) };
  }
  function dSectionText(id, st, RC) { return st.s17.edited[id] ? String(st.s17.text[id] || '') : (RC.tpl.d[id](st, ctx(st)) || ''); }
  function assembleDiscussion(st, RC) { return st.s17.order.filter((id) => st.s17.on[id] && filled(dSectionText(id, st, RC))).map((id) => dSectionText(id, st, RC).trim()).join('\n\n'); }

  /* ---------- Final evaluation ---------- */
  const AREAS = [['structure', structChecks], ['evidence', evidenceChecks], ['themes', themeChecks], ['findings', findingChecks], ['align', alignChecks], ['integrate', integrateChecks], ['viz', vizChecks], ['dplan', dplanChecks], ['interp', interpChecks], ['theory', theoryChecks], ['lit', litChecks], ['unexp', unexpChecks], ['impl', implChecks], ['lim', limChecks], ['future', futureChecks]];
  function checks(st, RC) {
    const out = [];
    AREAS.forEach(([a, fn]) => fn(st, RC).forEach((x) => out.push(Object.assign({ area: a }, x))));
    if (!filled(st.s8.draft)) out.push({ area: 'fdraft', k: 'fdNone', s: 'bad' }); else textCheck(st.s8.draft, RC, st, 'findings').forEach((x) => { if (x.s !== 'ok') out.push(Object.assign({ area: 'fdraft' }, x)); });
    if (!filled(st.s17.draft)) out.push({ area: 'ddraft', k: 'ddNone', s: 'bad' }); else textCheck(st.s17.draft, RC, st, 'discussion').forEach((x) => { if (x.s !== 'ok' || x.k === 'txCites') out.push(Object.assign({ area: 'ddraft' }, x)); });
    return out;
  }
  const CRIT_AREAS = {
    clarity: ['findings', 'fdraft'], evidence: ['evidence', 'integrate'], organisation: ['structure', 'themes'], alignment: ['align'], method: ['structure', 'viz'], depth: ['interp', 'dplan'], theory: ['theory'],
    literature: ['lit'], contradictory: ['unexp', 'lit'], implications: ['impl', 'future'], limitations: ['lim'], coherence: ['ddraft'], distinction: ['fdraft', 'ddraft'], referencing: ['lit', 'ddraft']
  };
  function suggestScores(st, RC) {
    const list = checks(st, RC), sc = {};
    RC.rubric.forEach((c) => {
      const items = list.filter((x) => (CRIT_AREAS[c.id] || []).indexOf(x.area) !== -1);
      const bad = items.filter((x) => x.s === 'bad').length, warn = items.filter((x) => x.s === 'warn').length;
      let s = 5 - bad * 2 - warn; if (c.id === 'distinction' && list.some((x) => x.k === 'txInterp' || x.k === 'txRepeat')) s -= 1;
      sc[c.id] = Math.max(1, Math.min(5, s));
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

  return { DSEC, MX, filled, wc, norm, hits, sentences, paragraphs, lines, script, cites, citeCount, hasCite, hasYear, short, parseNum, questions, findings, fCode, fName, fText, qCode, evFor, avFor, evCount, fFor, isTextual, isQual, recommended,
    structChecks, evidenceChecks, themeChecks, findingChecks, alignChecks, integrateChecks, vizChecks, dplanChecks, interpChecks, theoryChecks, litChecks, unexpChecks, implChecks, limChecks, futureChecks,
    textCheck, classify, findingPara, composeFindings, ctx, dSectionText, assembleDiscussion, checks, suggestScores, toCSV, parseCSV };
})();
