/* =========================================================
   Theoretical Framework Development in Film and Television Studies
   بناء الإطار النظري في الدراسات السينمائية والتلفزيونية — rule engine

   Transparent, rule-based logic only: compatibility notes between a study
   and the theory library, documented relations between perspectives, checks
   on justification, concepts, alignment and the framework map, a writing
   checker, map layouts and suggested rubric scores. No artificial
   intelligence is used, no theory is chosen automatically and nothing is
   added that the researcher has not entered.
   Academic tool developed by Dr. Merfat Alardawi | د. مرفت العرضاوي
   ========================================================= */
window.TFE = (function () {
  'use strict';
  const filled = (x) => !!(x && String(x).trim());
  const wc = (s) => (String(s || '').trim().match(/\S+/g) || []).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
  const SECTIONS = ['intro', 'history', 'assumptions', 'concepts', 'applications', 'debates', 'justification', 'application', 'connections', 'synthesis'];
  const NODE_ORDER = ['problem', 'theory', 'concept', 'question', 'dimension', 'method'];

  function norm(s, lang) {
    s = String(s || '').toLowerCase();
    if (lang === 'ar') s = s.replace(/[ً-ْٰـ]/g, '').replace(/[إأآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي').replace(/ة/g, 'ه');
    return s.replace(/[⁨⁩“”"«»()\[\]،,.;:؛؟?!’']/g, ' ').replace(/\s+/g, ' ').trim();
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
  const lines = (t) => String(t || '').split(/\n+/).map((x) => x.replace(/^\s*(?:[-–•*]|\(?[0-9٠-٩]+[.)]|RQ\s*\d+[:.)]?)\s*/i, '').trim()).filter(filled);
  function script(text) { const s = String(text || ''), ar = (s.match(/[؀-ۿ]/g) || []).length, la = (s.match(/[A-Za-z]/g) || []).length; if (!ar && !la) return 'none'; const r = ar / (ar + la); return r > 0.8 ? 'ar' : r < 0.2 ? 'en' : 'mixed'; }
  const CITE_RE = /\([^()]{0,160}?(?:1[89]\d\d|20\d\d|[١٢][٠-٩]{3}|n\.d\.|د\.ت)[a-z]?[^()]{0,120}\)|\[\d+(?:[,–-]\s?\d+)*\]/g;
  const cites = (text) => String(text || '').match(CITE_RE) || [];
  const hasCite = (text) => cites(text).length > 0;
  const citeCount = (text) => cites(text).reduce((n, c) => n + Math.max(1, (c.match(/(?:1[89]\d\d|20\d\d|[١٢][٠-٩]{3}|n\.d\.|د\.ت)/g) || []).length), 0);
  function stem(w, lang) {
    if (lang === 'ar') return w.replace(/^(وال|بال|فال|كال|لل|ال|و|ف|ب|ل)(?=..)/, '').replace(/^ال/, '').replace(/(ات|ون|ين|ها|هم|يه|ه|ي)$/, '');
    return w.replace(/(ations|ation|ings|ing|ies|ied|ed|es|s)$/, '').replace(/(ive|al)$/, '');
  }
  function stopSet(L, key, lang) { const k = '_' + key + lang; if (L[k]) return L[k]; const set = new Set(); (L[key] || []).forEach((x) => { const n = norm(x, lang); set.add(n); set.add(stem(n, lang)); }); Object.defineProperty(L, k, { value: set, enumerable: false }); return set; }
  function terms(text, L, lang) {
    const out = {}, stop = stopSet(L, 'stopOverlap', lang);
    String(text || '').split(/\s+/).forEach((tok) => {
      const shown = tok.replace(/^[“”"«»(\[]+|[“”"«»()\[\]،,.;:؛؟?!]+$/g, '');
      norm(tok, lang).split(' ').forEach((w) => { if (!w || /\d/.test(w) || stop.has(w)) return; const s = stem(w, lang); if (s.length < (lang === 'ar' ? 3 : 4) || stop.has(s)) return; if (!out[s]) out[s] = shown || w; });
    });
    return out;
  }
  function overlap(a, b, L, lang) { const A = terms(a, L, lang), B = terms(b, L, lang); return Object.keys(A).filter((k) => B[k]).map((k) => A[k]).slice(0, 6); }

  /* ---------- Theory library ---------- */
  function kindOf(st, RC) { const d = RC.designs.find((x) => x.id === st.s1.design); return d ? d.kind : ''; }
  function theories(st, RC) {
    const lib = (window.TFR_THEORIES || { list: [] }).list.map((t) => Object.assign({}, t, { text: RC.theoryText[t.id] }));
    if (filled(st.s3.customName)) lib.push({ id: 'custom', type: '', foci: [], kinds: [], obj: [], refs: [], custom: true, text: { name: st.s3.customName.trim(), theorists: '', background: '', assumptions: filled(st.s3.customDesc) ? [st.s3.customDesc.trim()] : [], concepts: [], questions: '', methods: '', applications: '', strengths: '', limits: '', example: '' } });
    return lib;
  }
  const theoryById = (st, RC, id) => theories(st, RC).find((t) => t.id === id);
  const nameOf = (st, RC, id) => { const t = theoryById(st, RC, id); return t ? t.text.name : ''; };
  function compat(t, st, RC) {
    if (t.custom) return { focus: [], kind: null, obj: false };
    const k = kindOf(st, RC);
    return { focus: t.foci.filter((f) => st.s2.focus.indexOf(f) !== -1), kind: k ? t.kinds.indexOf(k) !== -1 : null, obj: !!st.s2.role && t.obj.indexOf(st.s2.role) !== -1 };
  }
  function pairsFor(ids) {
    const P = (window.TFR_THEORIES || { pairs: [] }).pairs, out = [];
    P.forEach((p) => { if (ids.indexOf(p.a) !== -1 && ids.indexOf(p.b) !== -1) out.push(p); });
    return out;
  }
  function filterTheories(list, f, RC, lang) {
    const q = norm(f.q || '', lang);
    return list.filter((t) => {
      if (f.focus && t.foci.indexOf(f.focus) === -1) return false;
      if (f.kind && t.kinds.indexOf(f.kind) === -1) return false;
      if (f.obj && t.obj.indexOf(f.obj) === -1) return false;
      if (q) { const tx = t.text; const hay = norm([tx.name, tx.theorists, tx.background, tx.assumptions.join(' '), tx.concepts.join(' '), tx.applications].join(' '), lang); if (hay.indexOf(q) === -1) return false; }
      return true;
    });
  }

  /* ---------- Checks per step ---------- */
  function needChecks(st, RC) {
    const out = [];
    if (!st.s2.focus.length) out.push({ k: 'noFocus', s: 'bad' });
    else if (st.s2.focus.length > 4) out.push({ k: 'many', s: 'warn' });
    if (filled(st.s2.why) && wc(st.s2.why) < 8) out.push({ k: 'noNeed', s: 'warn' });
    if (!out.length && filled(st.s2.why)) out.push({ k: 'ok', s: 'ok' });
    return out;
  }
  function selected(st) { return [st.s5.primary].concat(st.s5.secondary).filter(filled); }
  function selectChecks(st, RC) {
    const out = [], ids = selected(st);
    if (!st.s5.primary) { out.push({ k: 'noPrimary', s: 'bad' }); return out; }
    if (ids.length >= 3) out.push({ k: 'many', s: 'warn' });
    const tens = pairsFor(ids).filter((p) => p.kind === 'tension');
    if (tens.length && wc(st.s5.combine) < 8) out.push({ k: 'tension', s: 'warn', list: [...new Set(tens.map((p) => RC.pairText[p.key]))] });
    if (st.s5.secondary.length && !filled(st.s5.combine)) out.push({ k: 'noCombine', s: 'warn' });
    if (filled(st.s5.relevance) && !filled(st.s5.alternatives)) out.push({ k: 'noAlt', s: 'warn' });
    const t = theoryById(st, RC, st.s5.primary), k = kindOf(st, RC);
    if (t && !t.custom && k && t.kinds.indexOf(k) === -1) out.push({ k: 'methodFit', s: 'info', kind: RC.kindNames[k] });
    if (st.s3.shortlist.length < 2) out.push({ k: 'notShort', s: 'info' });
    if (!out.some((x) => x.s === 'warn' || x.s === 'bad')) out.unshift({ k: 'ok', s: 'ok' });
    return out;
  }
  const namedConcepts = (st) => st.concepts.filter((c) => filled(c.concept));
  function conceptChecks(st, RC) {
    const out = [], cs = namedConcepts(st), k = kindOf(st, RC);
    if (cs.filter((c) => filled(c.definition)).length < 2) out.push({ k: 'few', s: 'bad' });
    const noDef = cs.filter((c) => !filled(c.definition)).map((c) => c.concept); if (noDef.length) out.push({ k: 'noDef', s: 'warn', list: noDef });
    const noRef = cs.filter((c) => !filled(c.source) && !filled(c.reference)).map((c) => c.concept); if (noRef.length) out.push({ k: 'noRef', s: 'warn', list: noRef });
    const noApp = cs.filter((c) => !filled(c.application)).map((c) => c.concept); if (noApp.length) out.push({ k: 'noApp', s: 'info', list: noApp });
    if (k === 'survey' || k === 'qcontent') { const noOp = cs.filter((c) => !filled(c.operational)).map((c) => c.concept); if (noOp.length) out.push({ k: 'noOp', s: 'info', list: noOp }); }
    if ((st.s1.approach === 'qual' || st.s1.approach === 'theory') && cs.some((c) => /variable|متغير/i.test(c.definition + ' ' + c.application))) out.push({ k: 'variable', s: 'info' });
    if (cs.length > 8) out.push({ k: 'many', s: 'info' });
    if (!out.some((x) => x.s === 'warn' || x.s === 'bad')) out.unshift({ k: 'ok', s: 'ok', n: cs.length });
    return out;
  }
  function alignChecks(st, RC) {
    const L = RC.lex, lang = RC.lang, out = [], qs = lines(st.s1.questions), cs = namedConcepts(st);
    if (!qs.length) { out.push({ k: 'noQ', s: 'bad' }); return out; }
    const rq = (i) => 'RQ' + (lang === 'ar' ? String(i + 1).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]) : i + 1);
    const unm = qs.map((q, i) => ((st.s7[i] || {}).concepts || []).filter((id) => cs.some((c) => c.id === id)).length ? null : rq(i)).filter(Boolean);
    if (unm.length) out.push({ k: 'unmapped', s: 'warn', list: unm });
    const used = new Set(); qs.forEach((q, i) => ((st.s7[i] || {}).concepts || []).forEach((id) => used.add(id)));
    const unused = cs.filter((c) => !used.has(c.id)).map((c) => c.concept); if (unused.length && qs.length) out.push({ k: 'unused', s: 'info', list: unused });
    const noEv = qs.map((q, i) => { const r = st.s7[i] || {}; return filled(r.evidence) && filled(r.procedure) ? null : rq(i); }).filter(Boolean); if (noEv.length) out.push({ k: 'noEvidence', s: 'info', list: noEv });
    const pre = hits([st.s1.questions, st.s1.objectives, Object.keys(st.s7).map((k) => (st.s7[k] || {}).focus).join(' ')].join(' '), L.predetermine, lang); if (pre.length) out.push({ k: 'predetermine', s: 'warn', list: pre });
    if (filled(st.s1.problem) && cs.length) { const o = overlap(st.s1.problem, cs.map((c) => c.concept + ' ' + c.relevance).join(' '), L, lang); out.push(o.length ? { k: 'probTheory', s: 'ok', list: o } : { k: 'probTheory', s: 'info' }); }
    if (!out.some((x) => x.s === 'warn' || x.s === 'bad' || (x.s === 'info' && x.k !== 'probTheory'))) out.unshift({ k: 'ok', s: 'ok' });
    return out;
  }
  function mapChecks(st, RC) {
    const out = [], m = st.map;
    if (!m.nodes.length) { out.push({ k: 'empty', s: 'bad' }); return out; }
    const conn = new Set(); m.edges.forEach((e) => { conn.add(e.from); conn.add(e.to); });
    const iso = m.nodes.filter((n) => !conn.has(n.id)).map((n) => n.label); if (iso.length && m.nodes.length > 1) out.push({ k: 'isolated', s: 'info', list: iso.slice(0, 6) });
    if ((st.s1.approach === 'qual' || st.s1.approach === 'theory') && m.edges.some((e) => e.kind === 'causal')) out.push({ k: 'causal', s: 'warn' });
    if (!m.nodes.some((n) => n.type === 'theory')) out.push({ k: 'noTheory', s: 'warn' });
    out.unshift({ k: 'ok', s: out.some((x) => x.s === 'warn') ? 'info' : 'ok', n: m.nodes.length, m: m.edges.length });
    out[0].s = 'ok';
    return out;
  }

  /* ---------- Writing checker ---------- */
  function languageCheck(text, RC, st) {
    const L = RC.lex, lang = RC.lang, out = [];
    if (!filled(text)) return { items: out };
    const ss = sentences(text);
    const long = ss.filter((s) => wc(s) > L.longLimit); out.push(long.length ? { k: 'long', s: 'warn', n: long.length, list: long.slice(0, 3).map((s) => s.slice(0, 90) + (s.length > 90 ? '…' : '')) } : { k: 'long', s: 'ok' });
    const cl = hits(ss[0] || '', L.cliche, lang); if (cl.length) out.push({ k: 'cliche', s: 'warn', list: cl });
    const crit = hits(text, L.critical, lang); out.push(crit.length >= 2 ? { k: 'critical', s: 'ok', n: crit.length } : { k: 'critical', s: 'warn' });
    const n = citeCount(text); out.push(n >= 4 ? { k: 'cites', s: 'ok', n } : { k: 'cites', s: 'warn', n });
    const q = (String(text).match(/[“"«][^”"»]{12,}[”"»](?!\s*\([^)]*(?:p\.|pp\.|ص)\s*[\d٠-٩])/g) || []).slice(0, 3); if (q.length) out.push({ k: 'quotes', s: 'warn', list: q.map((x) => x.slice(0, 50) + (x.length > 50 ? '…' : '')) });
    const uns = ss.filter((s) => hits(s, L.claimCues, lang).length && !hasCite(s)).map((s) => s.slice(0, 80) + '…').slice(0, 3); if (uns.length) out.push({ k: 'unsupported', s: 'warn', list: uns });
    const pre = hits(text, L.predetermine, lang); if (pre.length) out.push({ k: 'predetermine', s: 'warn', list: pre });
    if (st && (st.s1.approach === 'qual' || st.s1.approach === 'theory')) { const ca = hits(text, L.causal, lang); if (ca.length) out.push({ k: 'causal', s: 'info', list: ca }); }
    const ov = hits(text, L.overclaim, lang); if (ov.length) out.push({ k: 'overclaim', s: 'warn', list: ov });
    if (st) {
      const sel = selected(st), others = theories(st, RC).filter((t) => sel.indexOf(t.id) === -1 && !t.custom).map((t) => t.text.name.replace(/\s*\(.*\)$/, ''));
      const named = others.filter((nm) => norm(text, lang).indexOf(norm(nm, lang)) !== -1); if (named.length) out.push({ k: 'namedrop', s: 'info', list: named.slice(0, 5) });
    }
    const pl = paragraphs(text).filter((p) => wc(p) > L.paraMax); if (pl.length) out.push({ k: 'paraLong', s: 'warn', n: pl.length });
    const ph = String(text).match(/\[[^\]]{1,60}\]/g) || []; if (ph.length) out.push({ k: 'placeholder', s: 'bad', list: ph.slice(0, 6) });
    const v = hits(text, L.vague, lang); if (v.length) out.push({ k: 'vague', s: 'info', list: v });
    return { items: out };
  }

  /* ---------- Framework map ---------- */
  let seq = 0; const nid = () => 'n' + Date.now().toString(36) + (seq++).toString(36);
  function buildMap(st, RC, lang) {
    const nodes = [], edges = [], add = (type, label, key) => { const n = { id: nid(), type, label: String(label || '').trim().slice(0, 140), key: key || '' }; nodes.push(n); return n; };
    const link = (a, b, label) => { if (a && b) edges.push({ id: nid(), from: a.id, to: b.id, kind: 'link', label: label || '' }); };
    const E = RC.edgeLabels;
    const prob = filled(st.s1.problem) ? add('problem', st.s1.problem) : null;
    const th = selected(st).map((id) => add('theory', nameOf(st, RC, id), id));
    th.forEach((t) => link(prob, t, E.informs));
    const cmap = {};
    namedConcepts(st).forEach((c) => { const n = add('concept', c.concept, c.id); cmap[c.id] = n; link(th[0], n, E.defines); });
    const qs = lines(st.s1.questions), qn = qs.map((q, i) => add('question', 'RQ' + (lang === 'ar' ? String(i + 1).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]) : i + 1) + ' ' + q));
    qs.forEach((q, i) => { const r = st.s7[i] || {}; (r.concepts || []).forEach((cid) => link(cmap[cid], qn[i], E.guides)); });
    const dims = lines(st.s8.categories).length ? lines(st.s8.categories) : qs.map((q, i) => (st.s7[i] || {}).focus).filter(filled);
    const dn = dims.slice(0, 8).map((d) => add('dimension', d));
    if (lines(st.s8.categories).length) dn.forEach((d, i) => link(qn[i % Math.max(1, qn.length)], d, E.examines));
    else { let j = 0; qs.forEach((q, i) => { if (filled((st.s7[i] || {}).focus)) { link(qn[i], dn[j], E.examines); j++; } }); }
    const meth = filled(st.s1.design) ? add('method', (RC.designs.find((d) => d.id === st.s1.design) || {}).t || '') : null;
    dn.forEach((d) => link(meth, d, E.applies));
    if (!dn.length) qn.forEach((q) => link(meth, q, E.applies));
    return { layout: st.map.layout || 'hier', nodes, edges };
  }
  const NW = 168, NH = 64;
  function layout(map, W) {
    W = W || 1000; const pos = {}, nodes = map.nodes;
    const byType = {}; NODE_ORDER.forEach((t) => { byType[t] = nodes.filter((n) => n.type === t); });
    let H = 520;
    if (map.layout === 'radial') {
      const center = byType.theory[0]; const cx = W / 2; H = 640; const cy = H / 2;
      if (center) pos[center.id] = { x: cx, y: cy };
      const inner = nodes.filter((n) => n !== center && (n.type === 'concept' || n.type === 'theory'));
      const outer = nodes.filter((n) => n !== center && inner.indexOf(n) === -1);
      inner.forEach((n, i) => { const a = -Math.PI / 2 + 2 * Math.PI * i / Math.max(1, inner.length); pos[n.id] = { x: cx + Math.cos(a) * 190, y: cy + Math.sin(a) * 150 }; });
      outer.forEach((n, i) => { const a = -Math.PI / 2 + Math.PI / Math.max(1, outer.length) + 2 * Math.PI * i / Math.max(1, outer.length); pos[n.id] = { x: cx + Math.cos(a) * 400, y: cy + Math.sin(a) * 255 }; });
    } else if (map.layout === 'network') {
      H = 640; const cx = W / 2, cy = H / 2;
      nodes.forEach((n, i) => { const a = -Math.PI / 2 + 2 * Math.PI * i / Math.max(1, nodes.length); pos[n.id] = { x: cx + Math.cos(a) * 390, y: cy + Math.sin(a) * 250 }; });
    } else {
      const rows = NODE_ORDER.filter((t) => byType[t].length); H = Math.max(260, rows.length * 105 + 40);
      rows.forEach((t, r) => { const row = byType[t], step = W / (row.length + 1); row.forEach((n, i) => { pos[n.id] = { x: step * (i + 1), y: 60 + r * 105 }; }); });
    }
    nodes.forEach((n) => { if (n.manual && typeof n.x === 'number') pos[n.id] = { x: n.x, y: n.y }; if (!pos[n.id]) pos[n.id] = { x: W / 2, y: H / 2 }; });
    const maxY = Math.max(H, ...Object.keys(pos).map((k) => pos[k].y + NH));
    return { pos, W, H: maxY, NW, NH };
  }
  function wrap(label, max, lines0) {
    const words = String(label || '').split(/\s+/), out = []; let cur = '';
    words.forEach((w) => { if ((cur + ' ' + w).trim().length > max && cur) { out.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); });
    if (cur) out.push(cur);
    if (out.length > lines0) { out.length = lines0; out[lines0 - 1] = out[lines0 - 1].replace(/.{0,2}$/, '…'); }
    return out;
  }

  /* ---------- Writing assistant ---------- */
  function ctx(st, RC) {
    const cs = namedConcepts(st);
    return { name: (id) => nameOf(st, RC, id), questions: lines(st.s1.questions), concept: (id) => (cs.find((c) => c.id === id) || {}).concept || '' };
  }
  function sectionText(id, st, RC) { return st.s10.edited[id] ? String(st.s10.text[id] || '') : RC.tpl[id](st, ctx(st, RC)); }
  function assemble(st, RC) { return st.s10.order.filter((id) => st.s10.on[id] && filled(sectionText(id, st, RC))).map((id) => sectionText(id, st, RC).trim()).join('\n\n'); }

  /* ---------- Evaluation ---------- */
  function checks(st, RC) {
    const C = RC.checkText, out = [], d = String(st.s10.draft || '');
    const add = (id, status, arg) => { const c = C[id]; out.push({ id, t: c.t, status, msg: typeof c[status] === 'function' ? c[status](arg) : c[status] }); };
    if (!filled(d)) add('draft', 'bad');
    add('need', st.s2.focus.length && wc(st.s2.why) >= 8 ? 'ok' : 'warn');
    add('selection', st.s5.primary ? 'ok' : 'bad');
    const miss = ['relevance', 'problem', 'alternatives', 'method'].filter((k) => !filled(st.s5[k])).map((k) => RC.ui.lbl[k]);
    add('justification', miss.length ? 'warn' : 'ok', miss.join(RC.sep));
    const sc = selectChecks(st, RC); add('combination', sc.some((x) => x.k === 'tension' || x.k === 'noCombine') ? 'warn' : 'ok');
    const cc = conceptChecks(st, RC), nC = namedConcepts(st).length; add('concepts', cc.some((x) => x.k === 'few') ? 'bad' : cc.some((x) => x.s === 'warn') ? 'warn' : 'ok', nC);
    const ac = alignChecks(st, RC); add('alignment', ac.some((x) => x.k === 'noQ') ? 'bad' : ac.some((x) => x.k === 'unmapped') ? 'warn' : 'ok', ((ac.find((x) => x.k === 'unmapped') || {}).list || []).join(RC.sep));
    add('method', filled(st.s8.interpretation) && (filled(st.s8.categories) || filled(st.s8.selection)) ? 'ok' : 'warn');
    const mc = mapChecks(st, RC); add('map', !st.map.nodes.length ? 'bad' : mc.some((x) => x.s === 'warn') ? 'warn' : 'ok', mc.filter((x) => x.s === 'warn').map((x) => RC.mapMsg[x.k].t).join(RC.sep));
    if (filled(d)) {
      const lc = languageCheck(d, RC, st).items, f = (k) => lc.find((x) => x.k === k);
      add('critical', f('critical').s === 'ok' ? 'ok' : 'warn');
      const n = citeCount(d); add('citations', n >= 4 ? 'ok' : n ? 'warn' : 'bad', n);
      add('quotes', f('quotes') ? 'warn' : 'ok');
      add('predetermine', f('predetermine') || ac.some((x) => x.k === 'predetermine') ? 'warn' : 'ok');
      const ph = d.match(/\[[^\]]{1,60}\]/g) || []; if (ph.length) add('placeholder', 'bad', ph.slice(0, 4).join(RC.sep));
      const s = script(d); if ((RC.lang === 'ar' && s !== 'ar' && s !== 'none') || (RC.lang === 'en' && s !== 'en' && s !== 'none')) add('language', 'warn', RC.lang);
    }
    return out;
  }
  function suggestScores(st, RC) {
    const list = checks(st, RC), stat = (id) => (list.find((c) => c.id === id) || {}).status;
    const pen = (ids) => ids.reduce((n, id) => n + ({ bad: 2, warn: 1 }[stat(id)] || 0), 0);
    const clamp = (n) => Math.max(1, Math.min(5, n)), d = st.s10.draft, sc = {};
    const t = theoryById(st, RC, st.s5.primary), cm = t ? compat(t, st, RC) : null;
    sc.relevance = !st.s5.primary ? 1 : clamp(5 - (cm && !t.custom && !cm.focus.length ? 1 : 0) - (cm && cm.kind === false ? 1 : 0) - (filled(st.s5.relevance) ? 0 : 1));
    sc.concepts = clamp(5 - pen(['concepts']) * 1.5);
    sc.justification = !st.s5.primary ? 1 : clamp(5 - pen(['justification']) - (filled(st.s5.aspects) ? 0 : 1));
    sc.coherence = !st.s5.primary ? 1 : clamp(5 - pen(['combination']) * 2);
    const ac = alignChecks(st, RC), pt = ac.find((x) => x.k === 'probTheory');
    sc.problem = !st.s5.primary ? 1 : clamp(5 - (pt && pt.s === 'ok' ? 0 : 1) - (filled(st.s5.problem) ? 0 : 2));
    sc.questions = clamp(5 - pen(['alignment']) * 1.5 - (ac.some((x) => x.k === 'noEvidence') ? 1 : 0));
    sc.method = clamp(5 - pen(['method']) * 2 - (filled(st.s5.method) ? 0 : 1));
    sc.critical = !filled(d) ? 1 : clamp(5 - pen(['critical']) * 2 - (filled(st.s10.debates) ? 0 : 1));
    sc.applicability = clamp(5 - (conceptChecks(st, RC).some((x) => x.k === 'noApp') ? 1 : 0) - pen(['alignment']) - pen(['map']));
    sc.writing = !filled(d) ? 1 : clamp(5 - pen(['citations', 'quotes', 'placeholder', 'language', 'predetermine']));
    Object.keys(sc).forEach((k) => { sc[k] = Math.round(sc[k]); });
    return sc;
  }

  /* ---------- CSV ---------- */
  function toCSV(rows, cols) { const q = (v) => { v = String(v == null ? '' : v); return /[",\n\r]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }; return [cols.join(',')].concat(rows.map((r) => cols.map((c) => q(r[c])).join(','))).join('\r\n'); }
  function parseCSV(text) {
    text = String(text || '').replace(/^﻿/, ''); const rows = []; let row = [], cur = '', inQ = false;
    for (let i = 0; i < text.length; i++) { const ch = text[i];
      if (inQ) { if (ch === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else inQ = false; } else cur += ch; }
      else if (ch === '"') inQ = true; else if (ch === ',' || ch === ';' || ch === '\t') { row.push(cur); cur = ''; }
      else if (ch === '\n' || ch === '\r') { if (ch === '\r' && text[i + 1] === '\n') i++; row.push(cur); rows.push(row); row = []; cur = ''; } else cur += ch; }
    if (cur || row.length) { row.push(cur); rows.push(row); }
    return rows.filter((r) => r.some((c) => filled(c)));
  }

  return { SECTIONS, NODE_ORDER, filled, wc, norm, hits, sentences, paragraphs, lines, script, cites, citeCount, hasCite, overlap, kindOf, theories, theoryById, nameOf, compat, pairsFor, filterTheories, selected, needChecks, selectChecks, conceptChecks, alignChecks, mapChecks, languageCheck, buildMap, layout, wrap, ctx, sectionText, assemble, checks, suggestScores, toCSV, parseCSV };
})();
