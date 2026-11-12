/* =========================================================
   Literature Review in Film and Television Studies — rule engine
   محرك القواعد لأداة مراجعة الأدبيات

   Transparent, rule-based logic only: search-string builders, counts,
   consistency checks, suggested scores and a critical-writing check.
   It does not search databases and does not use artificial intelligence.
   ========================================================= */
window.LRE = (function () {
  'use strict';
  const filled = (x) => !!(x && String(x).trim());
  const wc = (s) => (String(s || '').trim().match(/\S+/g) || []).length;

  /* ---------- Text helpers ---------- */
  function norm(s, lang) {
    s = String(s || '').toLowerCase();
    if (lang === 'ar') s = s.replace(/[ً-ْٰـ]/g, '').replace(/[إأآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي');
    return s.replace(/[⁨⁩“”"«»()\[\]،,.;:؛؟?!]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  function hits(text, cues, lang) {
    const t = ' ' + norm(text, lang) + ' ', out = [];
    (cues || []).forEach((c) => {
      const cn = norm(c, lang); if (!cn) return;
      const re = lang === 'ar' ? new RegExp('(^|\\s)(و|ف|ب|ل|ك)?' + escRe(cn) + (cn.length <= 4 ? '(?=\\s|$)' : '')) : new RegExp('(^|[^a-z])' + escRe(cn));
      if (re.test(t) && out.indexOf(c) === -1) out.push(c);
    });
    return out;
  }

  /* ---------- Search strings ---------- */
  const terms = (s) => String(s || '').split(/[\n,،;؛]+/).map((x) => x.trim()).filter(Boolean);
  const quote = (t) => /\s/.test(t) && !/^".*"$/.test(t) ? '"' + t.replace(/"/g, '') + '"' : t;
  function blocks(concepts, key) {
    return concepts.map((c) => terms(c[key]).map(quote)).filter((b) => b.length);
  }
  const orBlock = (b) => b.length > 1 ? '(' + b.join(' OR ') + ')' : b[0];
  function strings(st) {
    const en = blocks(st.s2.concepts, 'en'), ar = blocks(st.s2.concepts, 'ar');
    const not = terms(st.s2.exclude).map(quote);
    const notPart = not.length ? ' NOT ' + orBlock(not) : '';
    const core = en.map(orBlock).join(' AND ');
    const y1 = parseInt(st.s2.yearFrom, 10), y2 = parseInt(st.s2.yearTo, 10);
    const out = {};
    if (en.length) {
      let sc = 'TITLE-ABS-KEY(' + core + ')' + (notPart ? ' AND NOT TITLE-ABS-KEY(' + orBlock(not) + ')' : '');
      if (y1) sc += ' AND PUBYEAR > ' + (y1 - 1);
      if (y2) sc += ' AND PUBYEAR < ' + (y2 + 1);
      const langs = (st.s2.langs || []).map((l) => l === 'ar' ? 'Arabic' : 'English');
      if (langs.length === 1) sc += ' AND LANGUAGE(' + langs[0] + ')';
      out.scopus = sc;
      out.wos = 'TS=(' + core + ')' + (notPart ? ' NOT TS=(' + orBlock(not) + ')' : '');
      const ebsco = en.map((b) => '(TI ' + orBlock(b) + ' OR AB ' + orBlock(b) + ')').join(' AND ') + notPart;
      out.cmmc = ebsco; out.ftli = ebsco;
      out.jstor = core + notPart;
      out.gscholar = en.map((b) => b.slice(0, 3).map((t) => t.replace(/\*/g, '')).join(' OR ')).map((x) => x.indexOf(' OR ') !== -1 ? '(' + x + ')' : x).join(' ');
    }
    if (ar.length) { out.arabic = ar.map(orBlock).join(' AND '); }
    return out;
  }

  /* ---------- Resolved labels ---------- */
  const byId = (a, id) => (a || []).find((x) => x.id === id) || null;
  const byIds = (a, ids) => (a || []).filter((x) => (ids || []).indexOf(x.id) !== -1);
  function labels(st, RC) {
    const included = st.studies.filter((s) => s.status === 'included');
    return {
      reviewType: byId(RC.reviewTypes, st.s1.reviewType),
      approaches: byIds(RC.approaches, st.s1.approaches),
      dbs: byIds(RC.dbs, st.s2.dbs),
      structure: byId(RC.structures, st.s8.structure),
      included, themes: st.s6.themes.filter((t) => filled(t.name)), gaps: st.s7.gaps.filter((g) => filled(g.statement)),
      gapTypes: RC.gapTypes
    };
  }
  function counts(st) {
    const c = { included: 0, maybe: 0, excluded: 0 };
    st.studies.forEach((s) => { c[s.status] = (c[s.status] || 0) + 1; });
    const num = (x) => { const v = parseInt(String(x || '').replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)), 10); return isNaN(v) ? null : v; };
    const identified = num(st.s3.identified), dup = num(st.s3.duplicates), titleEx = num(st.s3.titleExcluded);
    const screened = identified != null ? identified - (dup || 0) : null;
    return { ...c, identified, duplicates: dup, titleExcluded: titleEx, screened, fulltext: st.studies.length };
  }

  /* ---------- Appraisal ---------- */
  function appraisalStats(s) {
    const r = Object.values((s.appraisal && s.appraisal.r) || {});
    return { yes: r.filter((x) => x === 'yes').length, partly: r.filter((x) => x === 'partly').length, no: r.filter((x) => x === 'no').length, rated: r.length };
  }

  /* ---------- Gaps ---------- */
  function gapStatus(g, st) {
    const inc = (g.evidence || []).filter((id) => st.studies.some((s) => s.id === id && s.status === 'included'));
    const dbs = (st.s2.dbs || []).length;
    if (!inc.length) return 'potential';
    if (inc.length >= 2 && dbs >= 2) return 'supported';
    return 'verify';
  }

  /* ---------- Critical-writing check ---------- */
  function writingCheck(text, RC) {
    const lang = RC.lang;
    const sents = String(text || '').replace(/\[[^\]]*\]/g, ' ').split(/(?<=[.!?؟])\s+/).map((x) => x.trim()).filter((x) => wc(x) >= 4);
    let d = 0, s = 0;
    sents.forEach((x) => {
      const syn = hits(x, RC.lex.synth, lang).length + hits(x, RC.lex.evalw, lang).length;
      const des = hits(x, RC.lex.desc, lang).length;
      if (syn) s++; else if (des) d++;
    });
    return { sentences: sents.length, desc: d, synth: s, vague: hits(text, RC.lex.vague, lang), brackets: (String(text || '').match(/\[[^\]]+\]/g) || []).length };
  }
  function paragraphsCitingOne(text) {
    return String(text || '').split(/\n{1,}/).filter((p) => wc(p) > 25).filter((p) => (p.match(/\((?:\d{4}|n\.d\.|د\.ت)\)|\d{4}\)/g) || []).length === 1).length;
  }

  /* ---------- Consistency checks ---------- */
  function checks(st, RC) {
    const C = RC.chk, L = labels(st, RC), out = [];
    const add = (id, status) => out.push({ id, status, t: C[id].t, msg: C[id][status] || C[id].warn || C[id].ok });
    const s1 = st.s1;
    add('scope', filled(s1.topic) && filled(s1.question) && filled(s1.objectives) && s1.reviewType ? 'ok' : 'bad');
    const concepts = st.s2.concepts.filter((c) => terms(c.en).length || terms(c.ar).length);
    if (st.step >= 1 || concepts.length) add('search', concepts.length >= 2 && (st.s2.dbs || []).length >= 2 ? 'ok' : 'warn');
    if ((st.s2.langs || []).indexOf('ar') !== -1) add('arabic', st.s2.concepts.some((c) => terms(c.ar).length) || (st.s2.dbs || []).indexOf('arabic') !== -1 ? 'ok' : 'warn');
    if (st.step >= 2 || filled(st.s3.include)) add('criteria', filled(st.s3.include) && filled(st.s3.exclude) ? 'ok' : 'warn');
    const ex = st.studies.filter((s) => s.status === 'excluded');
    if (ex.length) add('reasons', ex.every((s) => filled(s.reason)) ? 'ok' : 'warn');
    if (st.studies.length) add('undecided', st.studies.some((s) => s.status === 'maybe') ? 'warn' : 'ok');
    if (st.studies.length) add('enough', L.included.length >= 3 ? 'ok' : 'warn');
    if (L.included.length) {
      add('matrix', L.included.every((s) => (filled(s.approach) || filled(s.design)) && filled(s.findings) && filled(s.limitations)) ? 'ok' : 'warn');
      add('own', L.included.filter((s) => filled(s.relevance) || filled(s.notes)).length >= Math.ceil(L.included.length / 2) ? 'ok' : 'warn');
      add('appraised', L.included.filter((s) => appraisalStats(s).rated >= 5).length >= Math.ceil(L.included.length / 2) ? 'ok' : 'warn');
    }
    if (st.step >= 5 || L.themes.length) {
      add('themes', L.themes.length && L.themes.every((t) => (t.studies || []).filter((id) => L.included.some((s) => s.id === id)).length >= 2) ? 'ok' : 'warn');
      if (L.themes.length) add('contra', L.themes.some((t) => filled(t.agree) || filled(t.contra)) ? 'ok' : 'warn');
    }
    if (L.gaps.length) add('gapsLinked', L.gaps.every((g) => gapStatus(g, st) !== 'potential') ? 'ok' : 'warn');
    if (s1.reviewType === 'systematic' || s1.reviewType === 'scoping') add('reviewFit', filled(st.s3.identified) && (st.s2.dbs || []).length >= 3 ? 'ok' : 'warn');
    if (st.step >= 7 || st.s8.structure) add('outline', st.s8.structure && Object.values(st.s8.outline).filter(filled).length >= 4 ? 'ok' : 'warn');
    if (filled(st.s9.draftText)) { const w = writingCheck(st.s9.draftText, RC); add('descriptive', w.synth >= w.desc ? 'ok' : 'warn'); }
    return out;
  }

  /* ---------- Suggested rubric scores ---------- */
  const MAP = {
    relevance: ['scope', 'criteria', 'enough'], coverage: ['search', 'arabic', 'enough'], search: ['search', 'arabic', 'reviewFit'],
    critical: ['appraised', 'own'], theory: ['matrix'], method: ['matrix', 'appraised'], synthesis: ['themes', 'contra'],
    gaps: ['gapsLinked'], organisation: ['outline'], writing: ['descriptive']
  };
  const REQUIRED = {
    relevance: (st) => st.studies.some((s) => s.status === 'included'), coverage: (st) => st.studies.length > 0,
    search: (st) => st.s2.concepts.some((c) => filled(c.en) || filled(c.ar)), critical: (st) => st.studies.some((s) => s.status === 'included'),
    theory: (st) => st.studies.some((s) => s.status === 'included' && filled(s.theory)), method: (st) => st.studies.some((s) => s.status === 'included' && (filled(s.approach) || filled(s.design))),
    synthesis: (st) => st.s6.themes.some((t) => filled(t.name)), gaps: (st) => st.s7.gaps.some((g) => filled(g.statement)),
    organisation: (st) => !!st.s8.structure, writing: (st) => filled(st.s9.draftText)
  };
  function suggestScores(st, RC) {
    const list = checks(st, RC), out = {};
    RC.rubric.forEach((c) => {
      if (!REQUIRED[c.id](st)) { out[c.id] = 1; return; }
      let s = 5;
      list.filter((x) => MAP[c.id].indexOf(x.id) !== -1).forEach((x) => { if (x.status === 'bad') s -= 2; else if (x.status === 'warn') s -= 1; });
      if (c.id === 'theory') { const inc = st.studies.filter((x) => x.status === 'included'); if (inc.filter((x) => filled(x.theory)).length < inc.length) s -= 1; }
      if (c.id === 'gaps' && st.s7.gaps.some((g) => gapStatus(g, st) === 'verify')) s -= 1;
      out[c.id] = Math.max(1, Math.min(5, s));
    });
    return out;
  }

  /* ---------- CSV ---------- */
  function csv(rows) {
    const cell = (v) => { v = String(v == null ? '' : v); return /[",\n;]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
    return rows.map((r) => r.map(cell).join(',')).join('\r\n');
  }

  return { norm, hits, wc, terms, strings, labels, counts, appraisalStats, gapStatus, writingCheck, paragraphsCitingOne, checks, suggestScores, csv };
})();
