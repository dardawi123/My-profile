/* =========================================================
   Research Conclusion Writing and Refinement in Film and Television
   Studies — English interface text, guidance, matrix schemas, templates
   and examples. rconc-ar.js has exactly the same keys.
   Templates only arrange the researcher's own entries; they never add
   findings, contributions, references or claims.
   Academic tool developed by Dr. Merfat Alardawi
   ========================================================= */
window.RC = (function () {
  'use strict';
  const T = (x) => String(x || '').trim();
  const has = (x) => !!T(x);
  const end = (s) => { s = T(s); if (!s) return ''; s = s.charAt(0).toUpperCase() + s.slice(1); return /[.!?…”")\]]$/.test(s) ? s : s + '.'; };
  const frag = (s) => T(s).replace(/[.;:]+$/, '');
  const lc = (s) => { s = frag(s); return /^[A-Z][a-z]/.test(s) ? s.charAt(0).toLowerCase() + s.slice(1) : s; };
  const join = (a) => a.filter(has).join(' ');
  const pick = (list, id) => (list.find((x) => x.id === id) || {});
  const listJoin = (a) => a.length < 2 ? a.join('') : a.slice(0, -1).join('; ') + '; and ' + a[a.length - 1];

  const approaches = [
    { id: 'qual', t: 'Qualitative', d: 'Interviews, focus groups, reception, thematic, textual, semiotic, narrative or discourse analysis.' },
    { id: 'quant', t: 'Quantitative', d: 'Surveys, quantitative content analysis or experiments.' },
    { id: 'mixed', t: 'Mixed methods', d: 'Integrated qualitative and quantitative strands.' },
    { id: 'theory', t: 'Interpretive / critical', d: 'Critical, theoretical, historical or textual interpretation.' }
  ];
  const statuses = [{ id: 'full', t: 'Fully answered' }, { id: 'partial', t: 'Partly answered' }, { id: 'none', t: 'Not answered by the evidence' }];
  const mx = {
    findings: { t: 'Key Findings Synthesis Tool', add: 'Add finding', sum: ['label', 'kind', 'rq'], intro: 'Enter the findings your study actually reported. Mark one as the main finding; the synthesis below states what they mean together.', empty: 'No findings yet.',
      cols: [{ k: 'label', t: 'Short label', type: 'text', ph: 'Home as moral anchor' },
        { k: 'statement', t: 'Finding (as reported in your results)', type: 'area', wide: 1 },
        { k: 'kind', t: 'Role in the conclusion', type: 'sel', opts: [{ id: 'main', t: 'Main finding' }, { id: 'supporting', t: 'Supporting finding' }, { id: 'theme', t: 'Significant theme' }, { id: 'pattern', t: 'Important pattern' }, { id: 'insight', t: 'Interpretive insight' }, { id: 'integrated', t: 'Integrated (mixed-methods) finding' }] },
        { k: 'rq', t: 'Research question', type: 'rq' },
        { k: 'evidence', t: 'Where it is reported (section, table, theme)', type: 'text', ph: 'Section 4.2; Theme 1' }] },
    contrib: { t: 'Research Contribution Builder', add: 'Add contribution', sum: ['type', 'finding'], intro: 'State what the study adds, grounded in a specific finding. Avoid “first” or “novel” unless you can show it.', empty: 'No contributions yet.',
      cols: [{ k: 'type', t: 'Type of contribution', type: 'sel', opts: [{ id: 'theoretical', t: 'Theoretical' }, { id: 'empirical', t: 'Empirical' }, { id: 'methodological', t: 'Methodological' }, { id: 'contextual', t: 'Contextual' }, { id: 'critical', t: 'Critical or interpretive' }] },
        { k: 'finding', t: 'Grounded in finding', type: 'finding' },
        { k: 'text', t: 'Contribution', type: 'area', wide: 1, ph: 'The study shows how… which extends understanding of…' },
        { k: 'field', t: 'Area of film and television studies', type: 'text', ph: 'Representation of belonging in Saudi streaming drama' }] },
    impl: { t: 'Research Implications Builder', add: 'Add implication', sum: ['type', 'finding'], intro: 'Each implication must follow from a finding and be stated with appropriate modesty.', empty: 'No implications yet.',
      cols: [{ k: 'type', t: 'Type of implication', type: 'sel', opts: [{ id: 'theoretical', t: 'Theoretical' }, { id: 'methodological', t: 'Methodological' }, { id: 'empirical', t: 'Empirical' }, { id: 'cultural', t: 'Cultural' }, { id: 'practical', t: 'Practical' }, { id: 'industry', t: 'Film and television industry' }] },
        { k: 'finding', t: 'Based on finding', type: 'finding' }, { k: 'impl', t: 'Implication', type: 'area', wide: 1 }, { k: 'who', t: 'For whom', type: 'text', ph: 'Screenwriters, platform commissioners, educators' }] },
    lim: { t: 'Limitations Reflection Tool', add: 'Add limitation', sum: ['type', 'desc'], intro: 'State genuine limitations, their effect on how findings should be read, and how they were addressed.', empty: 'No limitations yet.',
      cols: [{ k: 'type', t: 'Type', type: 'sel', opts: [{ id: 'design', t: 'Research design' }, { id: 'corpus', t: 'Sample or corpus selection' }, { id: 'data', t: 'Data availability' }, { id: 'method', t: 'Methodological boundaries' }, { id: 'context', t: 'Research context' }, { id: 'scope', t: 'Interpretive scope' }, { id: 'positionality', t: 'Researcher positionality' }, { id: 'general', t: 'Transferability or generalisability' }] },
        { k: 'desc', t: 'Limitation', type: 'area', wide: 1 }, { k: 'effect', t: 'Effect on interpretation', type: 'area' }, { k: 'mitigation', t: 'How it was addressed or should be read', type: 'area' },
        { k: 'avoid', t: 'Nature', type: 'sel', opts: [{ id: 'limitation', t: 'Methodological limitation' }, { id: 'error', t: 'Avoidable error (fix it instead)' }] }] },
    future: { t: 'Future Research Directions Builder', add: 'Add direction', sum: ['from', 'rec'], intro: 'Recommendations should grow out of this study: what it left open, its limitations or its unexpected findings.', empty: 'No directions yet.',
      cols: [{ k: 'from', t: 'Emerges from', type: 'sel', opts: [{ id: 'unresolved', t: 'An unresolved question' }, { id: 'limitation', t: 'An identified limitation' }, { id: 'unexpected', t: 'An unexpected finding' }, { id: 'theory', t: 'An emerging theoretical issue' }, { id: 'context', t: 'A contextual gap' }, { id: 'method', t: 'A new methodological possibility' }] },
        { k: 'basis', t: 'Which question, limitation or finding', type: 'text' }, { k: 'rec', t: 'Recommendation', type: 'area', wide: 1 }, { k: 'design', t: 'Suggested design or method', type: 'text' }] }
  };
  const contribDesc = { theoretical: 'Refines, extends or challenges a concept or theory.', empirical: 'Adds evidence about texts, audiences or contexts not previously documented.', methodological: 'Shows a useful way of studying the phenomenon.', contextual: 'Situates knowledge in a specific culture, industry, platform or period.', critical: 'Offers a new interpretation of representation, meaning or power.' };
  const implDesc = { theoretical: 'What the findings mean for concepts, assumptions or theories.', methodological: 'What they suggest about how to study this phenomenon.', empirical: 'What they add to knowledge of the texts, audiences or contexts studied.', cultural: 'What they mean for representation, identity or cultural debate.', practical: 'What educators, practitioners or policy makers might do.', industry: 'What producers, platforms or creative industries might consider.' };
  const limDesc = { design: 'Choices of design that bound what the study can claim.', corpus: 'Which texts, participants or cases were included and why.', data: 'Material that was unavailable or incomplete.', method: 'What the method can and cannot show.', context: 'How the setting shapes the findings.', scope: 'The range of meanings the analysis addresses.', positionality: 'How the researcher’s position may shape interpretation.', general: 'Transferability (qualitative) or generalisability (quantitative).' };
  const futDesc = { unresolved: 'A research question only partly answered.', limitation: 'A limitation another design could overcome.', unexpected: 'A surprising finding that deserves its own study.', theory: 'A conceptual issue the findings raise.', context: 'Other places, platforms, periods or audiences.', method: 'A method that could test or deepen the findings.' };
  const dNames = { purpose: 'Revisit the research purpose', findings: 'Synthesis of principal findings', questions: 'How the research questions were addressed', contribution: 'Scholarly contribution', implications: 'Implications', limitations: 'Limitations', future: 'Future research directions', closing: 'Closing statement' };
  const dHints = { purpose: 'From Step 2.', findings: 'From the synthesis in Step 3.', questions: 'From the alignment matrix (Step 4).', contribution: 'From Step 5.', implications: 'From Step 6.', limitations: 'From Step 7.', future: 'From Step 8.', closing: 'From Step 9.' };
  const dHeadings = { purpose: 'Research purpose', findings: 'Principal findings', questions: 'Answering the research questions', contribution: 'Contribution', implications: 'Implications', limitations: 'Limitations', future: 'Future research', closing: 'Concluding remarks' };
  const typeT = (list, id) => pick(list, id).t || '';
  const pubTypes = [{ id: 'article', t: 'Journal article' }, { id: 'thesis', t: 'Thesis or dissertation' }, { id: 'conference', t: 'Conference paper' }, { id: 'chapter', t: 'Book chapter' }, { id: 'report', t: 'Research report' }];
  const langs = [{ id: 'ar', t: 'Arabic' }, { id: 'en', t: 'English' }, { id: 'both', t: 'Both (two versions)' }];
  const headingOpts = [{ id: 'none', t: 'No headings' }, { id: 'permitted', t: 'Headings permitted' }, { id: 'required', t: 'Headings required' }];

  return {
    lang: 'en', dir: 'ltr', sep: ', ',
    numerals: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
    steps: ['Research profile', 'Research purpose', 'Synthesise findings', 'Answer the questions', 'Contribution', 'Implications', 'Limitations', 'Future research', 'Closing statement', 'Construct the conclusion', 'Writing & refinement', 'Quality evaluation', 'Final report'],
    modules: ['Foundations — the study the conclusion closes', 'Synthesis — meaning, answers and contribution', 'Construction, refinement and report'],
    modulesShort: ['Foundations', 'Synthesis', 'Construction'],
    moduleOf: [0, 0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2],
    stepText: [
      { h: 'Step 1 — Establish the research profile', p: 'Record the study whose conclusion you are writing.', whyH: 'A conclusion closes a specific study', why: 'The conclusion returns to the problem, aim and questions set out at the start, so they are recorded first. Your methodology adapts the guidance: qualitative conclusions emphasise interpretive insight and contextual meaning, quantitative ones the implications of observed relationships, mixed-methods ones integrated insight, and critical work its interpretive argument. The publication type and heading policy shape length and structure.', ex: 'Belonging and the family home in Saudi streaming drama · Qualitative semiotic analysis · Journal article · No subheadings.', out: 'Expected output — A structured research profile' },
      { h: 'Step 2 — Revisit the research problem and purpose', p: 'Restate, concisely, what the study set out to do and why.', whyH: 'Reconnect, do not copy', why: 'A conclusion opens by reminding readers of the problem and aim in one or two sentences. Do not copy the introduction: paraphrase it from the vantage point of a completed study (“This study examined…”). “Fill from Step 1” copies your profile as a starting point to shorten and rephrase.', ex: '', weak: 'In today’s world, media is very important. Saudi drama has changed a lot. This study is about Saudi streaming drama and identity, which is an important topic.', better: 'This study examined how two Saudi streaming series construct belonging through the family home, a question that matters as platform originals reshape images of contemporary Saudi life.', out: 'Expected output — A focused opening statement' },
      { h: 'Step 3 — Synthesise the principal findings', p: 'Record your key findings, then state what they mean together.', whyH: 'Synthesis, not a list', why: 'A summary repeats findings one by one; a synthesis states their collective significance — the overall answer the study gives. Enter the findings already reported in your results (never new ones), mark the main finding, then write a short synthesis connecting them. In mixed-methods studies, synthesise the integrated insight rather than each strand.', ex: '', weak: 'The first finding was that the home is important. The second finding was that the city is cold. The third finding was about generations.', better: 'Taken together, the findings show that both series construct belonging by opposing the moral certainty of the family home to the anonymity of the city, while letting younger characters negotiate that boundary.', out: 'Expected output — A concise synthesis of principal findings' },
      { h: 'Step 4 — Answer the research questions', p: 'For each question, state how — and how fully — the study answered it.', whyH: 'Honest, evidence-supported answers', why: 'The Research Question–Conclusion Alignment Matrix shows the findings linked to each question. Give a concise answer, point to the supporting evidence and add a concluding interpretation. Mark questions that were only partly answered, or not answered by the evidence; never claim that every question was fully addressed if the findings do not show it.', ex: 'RQ2 · Partly answered · The series stage generational conflict in domestic space but rarely resolve it; resolution lies beyond the scenes analysed.', weak: 'All research questions were answered successfully.', better: 'The main question is answered clearly: belonging is constructed through domestic space. RQ2 is answered only in part, because the selected scenes show conflict but not its resolution.', out: 'Expected output — How the research questions were answered' },
      { h: 'Step 5 — Articulate the overall scholarly contribution', p: 'State what the study adds to film and television studies, grounded in its findings.', whyH: 'Credible, not exaggerated', why: 'Contributions may be theoretical, empirical, methodological, contextual or critical. Each should follow from a specific finding and name the area of scholarship it speaks to. Avoid unsupported claims such as “the first study” or “a major breakthrough”.', ex: '', weak: 'This is the first study ever to analyse Saudi drama and it fills a huge gap in the literature.', better: 'The study contributes to research on representation in Gulf television by showing how domestic space, rather than national symbols, carries ideas of belonging in Saudi streaming drama.', out: 'Expected output — A credible contribution statement' },
      { h: 'Step 6 — Explain theoretical and practical implications', p: 'Explain what the findings suggest for theory, scholarship, practice or industry.', whyH: 'Implications follow from findings', why: 'State theoretical, methodological, empirical, cultural, practical or industry implications, link each to a finding and say for whom it matters. Use cautious wording: implications suggest; they do not prove.', ex: '', weak: 'These results will change how all Saudi series are made.', better: 'For platform commissioners, the finding that familiar domestic settings drive recognition suggests that location authenticity may matter as much as star casting for young Saudi audiences.', out: 'Expected output — A justified implications statement' },
      { h: 'Step 7 — Reflect on research limitations', p: 'Acknowledge genuine limitations and how they affect interpretation — or mark them as addressed elsewhere.', whyH: 'Transparent, balanced', why: 'Limitations may concern design, sample or corpus, data, method, context, interpretive scope, positionality, and transferability or generalisability. Present them transparently without undermining the study, and say how the findings should be read. If your journal places limitations in the discussion, tick “Limitations are addressed elsewhere”.', ex: '', weak: 'The study has many limitations, so its results may not be valid.', better: 'Because the scenes were selected purposively, the readings describe how these two series construct belonging rather than Saudi drama as a whole.', out: 'Expected output — A balanced limitations statement' },
      { h: 'Step 8 — Develop future research recommendations', p: 'Propose specific studies that grow out of this one.', whyH: 'Specific and justified', why: 'Base recommendations on unresolved questions, limitations, unexpected findings, emerging theoretical issues, contextual gaps or new methods, and suggest a design. “More research is needed” is not a recommendation.', ex: '', weak: 'More research is needed on this topic.', better: 'Reception studies with older and younger viewers could test whether the generational reading of domestic space found here holds for audiences.', out: 'Expected output — Justified future research directions' },
      { h: 'Step 9 — Construct a meaningful closing statement', p: 'Write the final sentences that give the conclusion intellectual closure.', whyH: 'Close, do not add', why: 'A strong closing statement reconnects with the central problem, emphasises the principal insight and its broader significance, and gives closure. It introduces no new evidence, statistics, quotations or citations and avoids exaggeration. Fill the three prompts or write your own closing statement, which then replaces the built one.', ex: '', weak: 'In conclusion, this was a very interesting study and Saudi drama is very important for everyone.', better: 'By locating belonging in the family home rather than in national symbols, these series suggest that Saudi streaming drama imagines modern identity as something negotiated at the threshold between home and city.', out: '' },
      { h: 'Step 10 — Construct the complete research conclusion', p: 'Combine the eight parts into an editable conclusion.', whyH: 'A flexible structure', why: 'The parts are filled from Steps 2–9. Switch parts off, reorder or edit them to fit your publication. Headings are added only if your publication requires or permits them (Step 1). Set a target length to check conciseness: article conclusions are usually short; thesis conclusion chapters are longer.', ex: '', out: '' },
      { h: 'Step 11 — Academic writing and refinement', p: 'Refine the draft with the Conclusion Coherence Checker, the paragraph map and the checklist.', whyH: 'Rule-based prompts, your judgement', why: 'The checker looks at clarity, conciseness, repetition, new evidence, overclaiming, originality claims, generalisation, hedging, generic phrases, flow, and whether the conclusion reflects your questions and main finding. The paragraph map shows what each paragraph seems to do, so you can check the logical progression and that the closing statement comes last. Suggestions never change your text.', ex: '', out: '' },
      { h: 'Step 12 — Conclusion quality evaluation', p: 'Rate twelve criteria on a five-point scale and read the recommendations.', whyH: 'Educational self-assessment', why: 'Suggested scores come from the checks; you decide the final score. Recommendations appear for criteria rated 3 or below. This evaluation supports self-review and does not replace expert academic review.', ex: '', out: '' },
      { h: 'Step 13 — Final research conclusion report', p: 'Finalise the conclusion and produce a report you can edit, copy, print, save as PDF and export.', whyH: 'Researcher-reviewed', why: 'The report brings together the purpose, findings synthesis, question alignment, contribution, implications, limitations, future research, closing statement, complete conclusion, evaluation and suggested improvements. Check it against your publication’s requirements before submission.', ex: '', out: '' }
    ],
    f: {
      's1.title': { label: 'Research title', hint: '', ph: 'Belonging and the family home in Saudi streaming drama' },
      's1.problem': { label: 'Main research problem', hint: '', ph: 'Little is known about how platform originals represent belonging in urban Saudi settings.' },
      's1.aim': { label: 'Research aim', hint: '', ph: 'To examine how Saudi streaming series construct belonging through the family home.' },
      's1.objectives': { label: 'Research objectives', hint: 'One per line (optional).', ph: '' },
      's1.mainq': { label: 'Main research question', hint: 'Coded MRQ.', ph: 'How do Saudi streaming series construct belonging through the family home?' },
      's1.subqs': { label: 'Supporting research questions', hint: 'One per line; coded RQ1, RQ2…', ph: 'How is generational conflict staged in domestic space?\nHow is the city contrasted with the home?' },
      's1.framework': { label: 'Theoretical or conceptual framework', hint: '', ph: 'Hall’s representation theory' },
      's1.approach': { label: 'Research methodology', hint: '' },
      's1.design': { label: 'Research design', hint: '', ph: 'Qualitative case study of two series' },
      's1.context': { label: 'Research context', hint: '', ph: 'Saudi Arabia; regional streaming platforms' },
      's1.pub': { label: 'Target publication type', hint: '' },
      's1.lang': { label: 'Preferred writing language', hint: '' },
      's1.headings': { label: 'Section headings in the conclusion', hint: 'Check the journal or university template.' },
      's2.problem': { label: 'Central research problem (restated)', hint: 'One or two sentences, from the vantage point of the completed study.', ph: 'This study examined…' },
      's2.aim': { label: 'Main research aim (restated)', hint: '', ph: '' },
      's2.motivation': { label: 'Scholarly motivation', hint: 'Why the problem mattered.', ph: '' },
      's2.context': { label: 'Research context', hint: '', ph: '' },
      's2.issue': { label: 'Principal issue investigated', hint: 'The core issue in a phrase.', ph: 'The place of domestic space in images of belonging' },
      's3.synthesis': { label: 'Synthesis: what the findings mean together', hint: 'Two to four sentences on the collective significance of the findings — not a list.', ph: 'Taken together, the findings show that…' },
      's9.problemLink': { label: 'Reconnect with the central problem', hint: 'How the study answers the problem it set out to address.', ph: '' },
      's9.insight': { label: 'Principal insight', hint: 'The one idea readers should remember.', ph: '' },
      's9.significance': { label: 'Broader scholarly significance', hint: 'Why it matters beyond this study (without exaggeration).', ph: '' },
      's9.own': { label: 'Your own closing statement (optional)', hint: 'If filled, it replaces the built statement.', ph: '' },
      's10.target': { label: 'Target length (words)', hint: 'For example 300–600 for an article; leave empty to skip the length check.', ph: '500' },
      's12.self': { label: 'Reflection and revision plan (optional)', hint: '', ph: '' },
      's13.final': { label: 'Final research conclusion', hint: 'Starts from the Step 10 draft; edit freely.', ph: '' },
      's13.refs': { label: 'References cited in the conclusion (APA 7)', hint: 'One per line, if any.', ph: '' },
      's13.notes': { label: 'Notes for your supervisor (optional)', hint: '', ph: '' }
    },
    approaches, statuses, mx, contribDesc, implDesc, limDesc, futDesc, dNames, dHints, dHeadings,
    pubTypes, langs, headingOpts,
    synthNote: { qual: 'Qualitative conclusions emphasise interpretive insight and contextual meaning: synthesise what the themes reveal together.', quant: 'Quantitative conclusions emphasise what the observed relationships or patterns imply; avoid repeating statistics.', mixed: 'Mixed-methods conclusions synthesise the integrated insight that neither strand provides alone.', theory: 'Interpretive and critical conclusions synthesise the argument the readings build about representation and meaning.' },
    conclNote: { qual: 'Emphasise interpretive insights, contextual meaning and theoretical contribution.', quant: 'Emphasise the implications of observed relationships or statistical patterns, without repeating statistics.', mixed: 'Synthesise the insight that arises from integrating qualitative and quantitative findings.', theory: 'Emphasise the critical interpretation of audiovisual representation and meaning-making.' },
    closeTpl: {
      qual: ['By showing how [phenomenon] is understood/constructed in [context], this study suggests that [principal insight].', 'Ultimately, [participants’/texts’] [practice] reveals [broader meaning] for [field].'],
      quant: ['The relationships observed between [variables] suggest that [principal insight], with implications for [field].', 'While correlational, these patterns point to [significance] for [audience or practice].'],
      mixed: ['Integrating [strand 1] and [strand 2] shows that [principal insight], which neither alone could reveal.', 'Together, the findings suggest that [significance] for [field].'],
      theory: ['Read through [theory], [texts] reveal [critical insight] about [representation/meaning].', 'This reading invites us to rethink [concept] in [context].']
    },
    dTemplates: {
      purpose: ['This study set out to [aim], in response to [problem].', 'Focusing on [context/corpus], it asked [main question].'],
      findings: ['Taken together, the findings show that [overall meaning].', 'Most importantly, [main finding]; this is reinforced by [supporting findings].'],
      questions: ['In answer to the main question, [concise answer].', '[RQ] is answered only in part, because [reason].'],
      contribution: ['The study contributes to [area] by [contribution grounded in findings].', 'It extends [theory/scholarship] by showing that [finding-based claim].'],
      implications: ['These findings suggest that [implication] for [audience].', 'For [theory/practice], they indicate that [implication].'],
      limitations: ['Because [limitation], the findings should be read as [scope].', 'The study’s focus on [scope] means that [effect].'],
      future: ['Future research could [specific study] to examine whether [question].', 'A [design] with [participants/corpus] would help clarify [issue].'],
      closing: ['Ultimately, [principal insight], which [broader significance].', 'By [what the study did], this research [what it shows about the field].']
    },
    distinctions: [
      ['Conclusion', 'Closes the study: restates the purpose, synthesises the overall answer, states contribution, implications, limitations and future research, and gives closure.', 'Belonging in these series is constructed through domestic space; the study contributes to research on Gulf television representation.'],
      ['Discussion', 'Interprets findings in detail, compares them with previous studies and theory, and explains unexpected results.', 'This finding extends Berg et al. (2025) by showing how familiarity is produced through domestic space.'],
      ['Results / findings', 'Presents and describes what the analysis found, with evidence.', 'In both series, the family home is framed as the moral centre (Series A, S1E3, 00:12:31).'],
      ['Abstract', 'A stand-alone summary of the whole study for readers who may read nothing else.', 'Purpose, method, main findings and contribution in 150–250 words.'],
      ['Introduction', 'Establishes context, problem, gap, aim and questions before the study.', 'Little is known about how platform originals represent belonging…']
    ],
    sumVsSyn: { weak: 'Summary: “Finding 1 showed that the home is a moral centre. Finding 2 showed that the city is cold. Finding 3 showed generational conflict.” — repeats each finding without saying what they mean together.', better: 'Synthesis: “Taken together, the findings show that both series construct belonging by opposing the moral certainty of the home to the anonymity of the city, while letting younger characters negotiate that boundary.” — states the collective meaning.' },
    mistakes: [
      { t: 'Repeating the results or discussion', d: 'Restating findings one by one or copying earlier paragraphs.', fix: 'Synthesise the overall meaning in a few sentences (Step 3).' },
      { t: 'Introducing new findings or evidence', d: 'New statistics, quotations, data or literature in the conclusion.', fix: 'Conclude only from what was already presented.' },
      { t: 'Not answering the research questions', d: 'Leaving readers to infer how the aims were met.', fix: 'State concise answers and partial answers (Step 4).' },
      { t: 'Overclaiming contribution', d: '“The first study”, “a breakthrough”, “proves”.', fix: 'Ground each contribution in a finding (Step 5).' },
      { t: 'Unsupported generalisation', d: 'Extending qualitative findings to all audiences or all films.', fix: 'Use transferability and qualify the scope.' },
      { t: 'Generic limitations', d: '“The sample was small.”', fix: 'Explain the effect on interpretation (Step 7).' },
      { t: 'Vague future research', d: '“More research is needed.”', fix: 'Propose a specific study and design (Step 8).' },
      { t: 'A weak ending', d: 'Ending on a limitation, a cliché or a new idea.', fix: 'End with a closing statement that gives closure (Step 9).' },
      { t: 'Copying the introduction', d: 'Repeating opening paragraphs word for word.', fix: 'Restate the purpose from the vantage point of the completed study (Step 2).' },
      { t: 'Too long', d: 'A conclusion longer than the publication expects.', fix: 'Set a target length and cut repetition (Steps 10–11).' }
    ],
    statusLabel: { ok: 'Good', warn: 'Revise', bad: 'Missing', info: 'Note' },
    areaNames: { purpose: 'Research purpose', synthesis: 'Findings synthesis', align: 'Research questions', contrib: 'Contribution', impl: 'Implications', lim: 'Limitations', future: 'Future research', closing: 'Closing statement', draft: 'Conclusion draft' },
    dm: {
      puNone: { t: 'Purpose', bad: 'Restate the central research problem.' },
      puCopy: { t: 'Copied from the profile', info: 'The restatement is almost identical to your original problem. Rephrase it from the vantage point of the completed study.' },
      puLong: { t: 'Length', warn: (x) => 'The opening uses ' + x.D(x.n) + ' words; aim for one or two concise sentences.' },
      puNoAim: { t: 'Aim', warn: 'Restate the main aim as well as the problem.' },
      puOk: { t: 'Purpose', ok: 'Problem and aim restated concisely.' },
      syNone: { t: 'Findings', bad: 'Enter at least one finding from your results.' },
      syNoMain: { t: 'Main finding', warn: 'Mark one finding as the main finding.' },
      syManyMain: { t: 'Main finding', info: (x) => x.D(x.n) + ' findings are marked as main; a conclusion usually foregrounds one.' },
      syNoSynth: { t: 'Synthesis', bad: 'Write a synthesis of what the findings mean together.' },
      syList: { t: 'Summary or synthesis?', warn: 'The synthesis lists findings one by one. State their collective meaning (e.g., “Taken together…”).' },
      syOk: { t: 'Synthesis', ok: 'The synthesis states a collective meaning.' },
      syDetail: { t: 'Detail', info: 'The synthesis contains statistics or quotations; a conclusion usually states meaning rather than detail.' },
      syNoRq: { t: 'Research questions', info: (x) => 'Findings not linked to a question: ' + x.list.join(', ') + '.' },
      alNoQ: { t: 'Research questions', bad: 'Enter your research questions in Step 1.' },
      alNoStatus: { t: 'Status', bad: (x) => 'Say how fully each question was answered: ' + x.list.join(', ') + '.' },
      alNoAnswer: { t: 'Answers', warn: (x) => 'Write a concise answer for: ' + x.list.join(', ') + '.' },
      alNoEvidence: { t: 'Evidence', warn: (x) => 'Answers without supporting findings or evidence: ' + x.list.join(', ') + '.' },
      alOverclaim: { t: 'Fully answered?', warn: (x) => 'Marked as fully answered but no finding is linked: ' + x.list.join(', ') + '.' },
      alAllFull: { t: 'All fully answered', info: 'Every question is marked as fully answered. Check that the findings really show this.' },
      alOk: { t: 'Research questions', ok: 'Every question has a status, an answer and supporting evidence.' },
      coNone: { t: 'Contribution', bad: 'State at least one contribution.' },
      coOriginal: { t: 'Originality claims', warn: (x) => 'Claims such as “first” or “novel” need evidence: ' + x.list.join(', ') + '.' },
      coNoFinding: { t: 'Grounding', warn: (x) => 'Link these contributions to a finding: ' + x.list.join(', ') + '.' },
      coOver: { t: 'Overclaiming', warn: (x) => 'Strong wording in: ' + x.list.join(', ') + '.' },
      coOk: { t: 'Contribution', ok: (x) => x.D(x.n) + ' contribution(s) grounded in findings.' },
      imNone: { t: 'Implications', bad: 'State at least one implication.' },
      imNoFinding: { t: 'Basis', warn: (x) => 'Link these implications to a finding: ' + x.list.join(', ') + '.' },
      imOver: { t: 'Overclaiming', warn: (x) => 'Strong wording in: ' + x.list.join(', ') + '.' },
      imOneType: { t: 'Range', info: 'All implications are of one type; consider theoretical or practical ones as well.' },
      imOk: { t: 'Implications', ok: (x) => x.D(x.n) + ' implication(s) linked to findings.' },
      liElsewhere: { t: 'Limitations', ok: 'Limitations are addressed elsewhere in the publication.' },
      liNone: { t: 'Limitations', bad: 'State at least one limitation, or mark them as addressed elsewhere.' },
      liAvoid: { t: 'Avoidable errors', warn: (x) => 'Avoidable errors are not limitations; correct them if you can: ' + x.list.join(', ') + '.' },
      liNoEffect: { t: 'Effect on interpretation', info: (x) => 'Explain how these limitations affect interpretation: ' + x.list.join(', ') + '.' },
      liTransfer: { t: 'Transferability', info: 'In qualitative research, discuss transferability to similar contexts rather than statistical generalisability.' },
      liUndermine: { t: 'Tone', info: (x) => 'Wording that may undermine the study unnecessarily: ' + x.list.join(', ') + '.' },
      liOk: { t: 'Limitations', ok: (x) => x.D(x.n) + ' limitation(s) with their effects.' },
      fuNone: { t: 'Future research', bad: 'Recommend at least one direction for future research.' },
      fuGeneric: { t: 'Specificity', warn: (x) => 'Too general: ' + x.list.join(', ') + '. Say what should be studied, how and why.' },
      fuNoBasis: { t: 'Basis', warn: (x) => 'Say which question, limitation or finding these come from: ' + x.list.join(', ') + '.' },
      fuOk: { t: 'Future research', ok: (x) => x.D(x.n) + ' specific, justified direction(s).' },
      clNone: { t: 'Closing statement', bad: 'Build or write a closing statement.' },
      clNewEvidence: { t: 'New evidence', warn: 'The closing statement contains figures, quotations or citations. Close with meaning, not new evidence.' },
      clOver: { t: 'Overclaiming', warn: (x) => 'Strong wording: ' + x.list.join(', ') + '.' },
      clCliche: { t: 'Opening phrase', info: (x) => 'Formulaic opening: ' + x.list.join(', ') + '. Start with the insight itself.' },
      clNoLink: { t: 'Link to the problem', info: 'The closing statement shares no key terms with your research problem or main question.' },
      clLong: { t: 'Length', info: (x) => 'The closing statement has ' + x.D(x.n) + ' words; one to three sentences are usually enough.' },
      clOk: { t: 'Closing statement', ok: 'Linked to the problem, without new evidence or overclaiming.' },
      txLong: { t: 'Sentence length', ok: 'No very long sentences.', warn: (x) => x.D(x.n) + ' sentence(s) over 40 words: ' + x.list.join(' | ') },
      txConcise: { t: 'Conciseness', ok: (x) => x.D(x.n) + ' words (target ' + x.D(x.t) + ').', warn: (x) => x.D(x.n) + ' words, well above your target of ' + x.D(x.t) + '. Cut repetition and detail.' },
      txRepeat: { t: 'Repetition', warn: (x) => x.D(x.n) + ' repeated sentence(s): ' + x.list.join(' | ') },
      txPhrase: { t: 'Repeated phrases', info: (x) => 'Phrases used three or more times: ' + x.list.join(' | ') },
      txNewEvidence: { t: 'New evidence', warn: (x) => x.D(x.n) + ' quotation(s), percentages or test statistics. A conclusion should not introduce or repeat detailed evidence.' },
      txCites: { t: 'Citations', info: (x) => x.D(x.n) + ' citations; conclusions usually cite little. Check that no new literature is introduced.' },
      txOver: { t: 'Overclaiming', warn: (x) => 'Overstated wording: ' + x.list.join(', ') + '.' },
      txOriginal: { t: 'Originality claims', warn: (x) => 'Claims that need evidence: ' + x.list.join(', ') + '.' },
      txGeneral: { t: 'Generalisation', info: (x) => 'Check the scope of: ' + x.list.join(', ') + '.' },
      txHedge: { t: 'Hedging', ok: (x) => x.D(x.n) + ' cautious formulation(s).', info: 'No cautious wording found; implications usually need appropriate hedging.' },
      txGeneric: { t: 'Generic phrases', info: (x) => 'Generic phrasing: ' + x.list.join(', ') + '.' },
      txCliche: { t: 'Opening', info: (x) => 'Formulaic opening: ' + x.list.join(', ') + '.' },
      txFlow: { t: 'Logical progression', info: 'Few linking words between paragraphs; add transitions that show how each part follows from the last.' },
      txPara: { t: 'Paragraph length', warn: (x) => x.D(x.n) + ' paragraph(s) over 200 words.' },
      txQuestions: { t: 'Research questions', info: (x) => 'The conclusion shares no key terms with: ' + x.list.join(', ') + '.' },
      txMainFinding: { t: 'Main finding', warn: 'The main finding does not seem to appear in the conclusion.' },
      txClosingNotLast: { t: 'Order', info: 'A closing-type paragraph appears before the end. Check that the conclusion ends with the closing statement.' },
      txNoClosing: { t: 'Ending', info: 'The last paragraph does not read as a closing statement.' },
      txLang: { t: 'Language', info: 'The text is mostly in the other language of the interface.' },
      txPlaceholder: { t: 'Placeholders', bad: (x) => 'Unfinished placeholders: ' + x.list.join(', ') + '.' },
      drNone: { t: 'Conclusion draft', bad: 'No conclusion draft yet (Step 10).' }
    },
    lex: {
      longLimit: 40, paraMax: 200, purposeMax: 90,
      stop: ['the', 'and', 'that', 'this', 'with', 'from', 'study', 'research', 'how', 'what', 'which', 'does', 'into', 'their', 'these', 'through', 'about', 'between', 'within'],
      listCue: ['first', 'second', 'third', 'fourth', 'finally', 'another finding', 'the first finding', 'the second finding', 'also found', 'finding'],
      synthCue: ['taken together', 'together', 'overall', 'collectively', 'in sum', 'as a whole', 'in combination', 'the findings show', 'these findings suggest'],
      overclaim: ['proves', 'proved', 'definitely', 'undoubtedly', 'without doubt', 'certainly', 'conclusively', 'will change', 'revolutionary', 'breakthrough', 'all audiences'],
      originality: ['first study', 'the first', 'for the first time', 'novel', 'unprecedented', 'groundbreaking', 'never been studied', 'no study has'],
      overgeneral: ['all viewers', 'everyone', 'all participants', 'always', 'never', 'all films', 'all series'],
      generalise: ['generalise', 'generalize', 'generalisable', 'generalizable', 'representative'],
      undermine: ['not reliable', 'unreliable', 'invalid', 'worthless', 'meaningless', 'not valid'],
      hedge: ['may', 'might', 'could', 'suggests', 'suggest', 'appears', 'seems', 'possibly', 'likely', 'perhaps', 'indicates'],
      generic: ['more research is needed', 'further research is needed', 'further studies', 'more studies', 'future studies should be conducted'],
      cliche: ['in conclusion', 'to sum up', 'to conclude', 'last but not least', 'in today’s world', 'since the dawn'],
      transitions: ['however', 'therefore', 'thus', 'moreover', 'in addition', 'consequently', 'taken together', 'overall', 'in turn', 'nevertheless', 'beyond', 'finally', 'ultimately', 'by contrast', 'similarly', 'as a result'],
      partCue: {
        purpose: ['this study examined', 'this study set out', 'the aim', 'aimed to', 'set out to', 'this research examined', 'the purpose', 'investigated'],
        findings: ['taken together', 'the findings show', 'findings', 'found that', 'revealed', 'results', 'most importantly'],
        questions: ['research question', 'rq', 'mrq', 'in answer', 'answered', 'the main question'],
        contribution: ['contributes', 'contribution', 'adds to', 'extends', 'advances', 'scholarship'],
        implications: ['implication', 'implications', 'suggests that', 'for practitioners', 'for producers', 'for theory', 'for industry'],
        limitations: ['limitation', 'limitations', 'limited', 'should be read', 'caution', 'scope'],
        future: ['future research', 'future studies', 'further research', 'could examine', 'could test', 'would help'],
        closing: ['ultimately', 'in the end', 'finally', 'above all', 'more broadly', 'by showing', 'by locating']
      }
    },
    rubric: [
      { id: 'purpose', t: 'Clarity of research purpose', d: 'The problem and aim are restated concisely.' },
      { id: 'synthesis', t: 'Quality of findings synthesis', d: 'Findings are synthesised, not listed.' },
      { id: 'alignment', t: 'Alignment with research questions', d: 'Each question is answered; partial answers are acknowledged.' },
      { id: 'interpretation', t: 'Accuracy of concluding interpretations', d: 'Conclusions follow from the findings without new evidence.' },
      { id: 'contribution', t: 'Clarity of scholarly contribution', d: 'Contributions are specific, grounded and not exaggerated.' },
      { id: 'implications', t: 'Strength of implications', d: 'Implications follow from findings and name their audience.' },
      { id: 'limitations', t: 'Appropriate acknowledgment of limitations', d: 'Genuine, explained and balanced — or addressed elsewhere.' },
      { id: 'future', t: 'Relevance of future research recommendations', d: 'Specific and grounded in the study.' },
      { id: 'organisation', t: 'Logical organisation', d: 'Parts progress logically and the conclusion ends with closure.' },
      { id: 'writing', t: 'Academic writing quality', d: 'Clear, precise, consistent scholarly prose.' },
      { id: 'concise', t: 'Conciseness', d: 'No repetition or unnecessary detail; appropriate length.' },
      { id: 'closing', t: 'Effectiveness of the closing statement', d: 'Reconnects with the problem and provides intellectual closure.' }
    ],
    rubricDesc: {
      purpose: ['Absent or copied from the introduction.', 'Present but long or vague.', 'Concise and clearly linked to the study.'],
      synthesis: ['Findings listed or missing.', 'Partly synthesised.', 'A clear statement of collective meaning.'],
      alignment: ['Questions not addressed.', 'Some questions answered.', 'All questions answered, with partial answers acknowledged.'],
      interpretation: ['Unsupported or new claims.', 'Mostly supported.', 'Fully grounded in the findings.'],
      contribution: ['Absent or exaggerated.', 'Generic.', 'Specific, grounded and appropriately modest.'],
      implications: ['Absent or overstated.', 'Generic.', 'Specific and traceable to findings.'],
      limitations: ['Absent or self-undermining.', 'Listed without effects.', 'Explained and balanced, or appropriately placed elsewhere.'],
      future: ['Generic.', 'Somewhat specific.', 'Specific, justified and feasible.'],
      organisation: ['Disordered.', 'Mostly logical.', 'Logical progression ending in closure.'],
      writing: ['Unclear.', 'Generally clear.', 'Clear, precise and consistent.'],
      concise: ['Repetitive or too long.', 'Some repetition.', 'Concise and well proportioned.'],
      closing: ['Absent, clichéd or adds new material.', 'Present but weak.', 'Memorable, grounded and gives closure.']
    },
    rubricRec: {
      purpose: 'Restate the problem and aim in one or two sentences from the vantage point of the completed study (Step 2).', synthesis: 'Replace the list of findings with a statement of what they mean together (Step 3).', alignment: 'Answer every question concisely and mark partial answers honestly (Step 4).',
      interpretation: 'Remove new evidence and claims that the findings do not support.', contribution: 'Ground each contribution in a finding and remove originality claims you cannot show (Step 5).', implications: 'Link each implication to a finding and say for whom it matters (Step 6).',
      limitations: 'Explain how each limitation affects interpretation, without undermining the study (Step 7).', future: 'Propose specific studies that follow from your limitations or open questions (Step 8).', organisation: 'Reorder the parts so the conclusion progresses logically and ends with the closing statement (Step 10).',
      writing: 'Shorten long sentences, remove formulaic phrases and keep terminology consistent.', concise: 'Cut repetition and detail; respect the target length.', closing: 'End with a statement that reconnects with the problem and states the principal insight (Step 9).'
    },
    levels: [
      { min: 4.5, t: 'Ready for supervisor review', d: 'The conclusion is coherent, grounded and concise.' },
      { min: 3.5, t: 'Strong draft — focused revision', d: 'Revise the criteria rated 3 or below.' },
      { min: 2.5, t: 'Developing — strengthen synthesis and answers', d: 'Work on synthesis, question alignment and contribution.' },
      { min: 0, t: 'Early draft — rebuild the core', d: 'Return to Steps 2–5 before rewriting.' }
    ],
    checklist: [
      { id: 'purpose', t: 'Purpose restated', d: 'Problem and aim restated concisely, not copied.' },
      { id: 'synth', t: 'Synthesis', d: 'Findings synthesised into an overall meaning.' },
      { id: 'nonew', t: 'Nothing new', d: 'No new findings, data, quotations or literature.' },
      { id: 'rq', t: 'Questions answered', d: 'Each question answered; partial answers acknowledged.' },
      { id: 'contrib', t: 'Contribution', d: 'Specific, grounded and not exaggerated.' },
      { id: 'impl', t: 'Implications', d: 'Follow from findings; appropriately hedged.' },
      { id: 'lim', t: 'Limitations', d: 'Balanced, or addressed elsewhere as required.' },
      { id: 'future', t: 'Future research', d: 'Specific and grounded in the study.' },
      { id: 'closing', t: 'Closing statement', d: 'Gives closure without new claims.' },
      { id: 'scope', t: 'Scope', d: 'No unsupported generalisation.' },
      { id: 'concise', t: 'Concise', d: 'No repetition; appropriate length.' },
      { id: 'format', t: 'Publication format', d: 'Headings, length and structure follow the guidelines.' }
    ],
    tpl: {
      profile: (st, E) => {
        const s = st.s1, L = []; const add = (k, v) => { if (has(v)) L.push(k + ': ' + T(v)); };
        add('Title', s.title); add('Problem', s.problem); add('Aim', s.aim); add('Questions', E.questions(st).map((q) => q.code + ' ' + q.text).join(' · ')); add('Framework', s.framework);
        add('Methodology', [typeT(approaches, s.approach), s.design].filter(has).join(' — ')); add('Context', s.context);
        add('Publication', [typeT(pubTypes, s.pub), typeT(langs, s.lang), typeT(headingOpts, s.headings)].filter(has).join(' · '));
        return L.join('\n');
      },
      closing: (st) => join([end(st.s9.problemLink), end(st.s9.insight), end(st.s9.significance)]),
      d: {
        purpose: (st) => join([end(st.s2.problem), has(st.s2.aim) && T(st.s2.aim) !== T(st.s2.problem) ? end(/^to\s/i.test(T(st.s2.aim)) ? 'The study aimed ' + lc(st.s2.aim) : st.s2.aim) : '', end(st.s2.motivation), has(st.s2.issue) ? end('At its core, the study addressed ' + lc(st.s2.issue)) : '']),
        findings: (st, X) => { const main = X.findings.find((f) => f.kind === 'main'); return join([end(st.s3.synthesis), !has(st.s3.synthesis) && main ? end('The main finding is that ' + lc(main.statement || main.label)) : '']); },
        questions: (st, X) => join(X.questions.map((q) => { const a = st.al[q.i] || {}; if (!a.status) return ''; if (a.status === 'none') return end('The evidence did not allow ' + q.code + ' to be answered' + (has(a.interp) ? ': ' + lc(a.interp) : '')); return join([(q.i === 0 ? 'In answer to the main research question, ' : 'In answer to ' + q.code + ', ') + lc(a.answer) + (a.status === 'partial' ? ', although this question is answered only in part' : '') + '.', end(a.interp)]); })),
        contribution: (st, X) => join(st.mx.contrib.filter((r) => has(r.text)).map((r) => end(r.text) + (has(r.field) && T(r.text).toLowerCase().indexOf(T(r.field).toLowerCase()) === -1 ? '' : ''))),
        implications: (st) => join(st.mx.impl.filter((r) => has(r.impl)).map((r) => has(r.who) ? end('For ' + lc(r.who) + ', the findings suggest that ' + lc(r.impl).replace(/^(the|these) findings suggest (that )?/i, '')) : end(r.impl))),
        limitations: (st) => { if (st.s7.elsewhere) return ''; const r = st.mx.lim.filter((x) => has(x.desc) && x.avoid !== 'error'); return r.length ? join(['The findings should be read in light of the study’s limitations.'].concat(r.map((x) => join([end(x.desc), end(x.effect), end(x.mitigation)])))) : ''; },
        future: (st) => join(st.mx.future.filter((r) => has(r.rec)).map((r) => join([end(r.rec), has(r.design) ? 'A ' + lc(r.design) + ' design would suit this question.' : '']))),
        closing: (st) => has(st.s9.own) ? end(st.s9.own) : join([end(st.s9.problemLink), end(st.s9.insight), end(st.s9.significance)])
      }
    },
    guideTopics: ['Introduction to the platform', 'Academic purpose and intended audience', 'Overview of the features', 'The complete workflow', 'Step-by-step instructions', 'Guidance for all input fields', 'Examples of appropriate entries', 'Common mistakes', 'Synthesising findings', 'Articulating contributions and implications', 'Using the refinement tools', 'Reading the evaluation results', 'Saving and exporting', 'Frequently asked questions', 'Troubleshooting', 'Academic integrity and research ethics'],
    examples: [
      { area: 'Saudi cinema and cultural identity', approach: 'Semiotic analysis', title: 'Belonging and the family home', finding: 'The home is framed as the moral centre against which the city is measured; younger characters negotiate this boundary.', evidence: 'Taken together, the series construct belonging through domestic space rather than national symbols.', discussion: 'By locating belonging at the threshold between home and city, these series imagine modern Saudi identity as negotiated rather than inherited.', why: 'The synthesis states a collective meaning, and the closing statement returns to the problem without new evidence.' },
      { area: 'Audience reception of Turkish television dramas', approach: 'Focus groups', title: 'Negotiated romance', finding: 'Young women enjoyed romantic storylines while distancing themselves from their values.', evidence: 'Viewers use Turkish serials as a space to explore emotions their own context frames differently, without adopting their values.', discussion: 'Reception here is less about influence than about negotiation, which invites future comparative work across Gulf audiences.', why: 'The conclusion avoids generalising to all viewers and turns the limitation of scope into a specific direction.' },
      { area: 'Feminist film criticism', approach: 'Textual analysis', title: 'Closure and agency', finding: 'The protagonist’s independence is undercut in the final act.', evidence: 'The film’s progressive surface is contained by a conservative narrative closure.', discussion: 'Reading form and narrative together shows how progressive representation can coexist with conservative endings — a tension worth tracing across recent Saudi cinema.', why: 'The contribution is critical and specific, and the closing names a broader significance modestly.' },
      { area: 'Semiotic film analysis', approach: 'Semiotic analysis', title: 'Colour and power', finding: 'Costume colour signals proximity to power.', evidence: 'Colour codes in the drama naturalise a hierarchy that dialogue rarely states.', discussion: 'Attending to colour as a sign system offers a way of reading power in historical drama beyond plot.', why: 'The methodological contribution follows from the finding and is not overstated.' },
      { area: 'Streaming platform audiences', approach: 'Survey', title: 'Motives for imported drama', finding: 'Escapism predicted viewing time more strongly than social motives.', evidence: 'Imported drama on platforms functions primarily as personal retreat for these viewers.', discussion: 'Because the design is correlational, the conclusion speaks of association, and recommends longitudinal research on viewing over time.', why: 'Implications match the design, and statistics are not repeated in the conclusion.' },
      { area: 'Narrative representation in television drama', approach: 'Narrative analysis', title: 'Season arcs and closure', finding: 'Crime series combine season-long arcs with episodic resolution.', evidence: 'Hybrid seriality accommodates both binge and weekly viewing.', discussion: 'Narrative form adapts to release patterns, which matters for writers and commissioners.', why: 'Industry implications are stated for a named audience and grounded in the finding.' },
      { area: 'Creative and media industries', approach: 'Mixed methods', title: 'Co-production and authenticity', finding: 'Authenticity ratings were highest for co-productions with local writers; interviews explained why.', evidence: 'Integrated findings show that perceived authenticity rests on creative control rather than location alone.', discussion: 'The integrated insight could not come from either strand alone, which is the study’s methodological point.', why: 'A mixed-methods conclusion synthesises the meta-inference rather than reporting strands separately.' }
    ],
    published: [
      { area: 'Audience reception of Turkish television dramas', ref: 'Berg, M., Alardawi, M., & Al Obeidli, N. (2025). Cultural skimming, authenticity, and streaming preferences: Turkish serials (dizi) among young audiences in Qatar, Saudi Arabia, and the UAE. Critical Studies in Television. Advance online publication. https://doi.org/10.1177/17496020251404332', lesson: 'Task: identify how the conclusion states the study’s concept and its contribution to reception research.' },
      { area: 'Audience reception of Turkish television dramas', ref: 'Alardawi, M. (2025). Saudi women and Turkish dramas: Identity and media influence. World Journal of Social Science, 12(1), 12. https://doi.org/10.5430/wjss.v12n1p12', lesson: 'Task: find how the conclusion moves from findings to the framework the study proposes.' },
      { area: 'Streaming platform audiences', ref: 'Alardawi, M., & Brereton, P. (2025). “Squid Game”: Pleasure and consumption of Korean drama by young Saudi audiences. Mediatization Studies, 8, 69–89. https://doi.org/10.17951/ms.2024.8.69-89', lesson: 'Mixed-methods study. Task: check whether the conclusion synthesises both strands or reports them separately.' },
      { area: 'Streaming platform audiences', ref: 'Alardawi, M. (2026). Exposure to AI-themed films and perceptions of artificial intelligence: A survey of Saudi young adults in Saudi Arabia. Online Media and Global Communication. Advance online publication. https://doi.org/10.1515/omgc-2025-0083', lesson: 'Survey testing cultivation hypotheses. Task: note how implications are worded for correlational evidence.' },
      { area: 'Streaming platform audiences', ref: 'Alardawi, M., Daghistani, M., Almonaie, S., Khaled, A., & Zahra, M. (2024). Saudi viewers watching foreign medical dramas: A uses and gratification approach. Global Journal of Health Science, 16(10), 23. https://doi.org/10.5539/gjhs.v16n10p23', lesson: 'Task: list the limitations and future research directions and judge how specific they are.' },
      { area: 'Saudi cinema and cultural identity', ref: 'Alardawi, M. M., Saqah, F. A., & Zakari, H. M. (2023). The representation of women in Saudi film: The case of Amra and the Second Marriage. Asian Social Science, 19(6), 123. https://doi.org/10.5539/ass.v19n6p123', lesson: 'Textual analysis. Task: identify the critical contribution stated in the conclusion.' },
      { area: 'Creative and media industries', ref: 'Alardawi, M. (2024). Exploring challenges and opportunities for Saudi podcasters: A qualitative study. Management and Marketing Journal, 22(2), 164–178. https://doi.org/10.52846/MNMK.22.2.02', lesson: 'Interview study. Task: find the practical implications and who they address.' },
      { area: 'Saudi cinema and cultural identity', ref: 'Alardawi, M. M. (2025). A historical analysis of the genesis of the television in Saudi Arabia. Asian Social Science, 21(2), 10. https://doi.org/10.5539/ass.v21n2p10', lesson: 'Historical study. Task: see how the conclusion closes a chronological argument.' },
      { area: 'Creative and media industries', ref: 'Alardawi, M., & Brereton, P. (2024). Arabic script television formats between adaptation and cultural identity: A case study of The Killing. International Journal of Psychological Studies, 16(4), 1. https://doi.org/10.5539/ijps.v16n4p1', lesson: 'Case study. Task: identify how the conclusion limits its claims to the case.' },
      { area: 'Narrative representation in television drama', ref: 'Alardawi, M. (2020). The impact of exposure to the Game of Thrones on Saudi male identity. Asian Social Science, 16(11), 56. https://doi.org/10.5539/ass.v16n11p56', lesson: 'Task: compare the conclusion with the abstract and note what each does differently.' },
      { area: 'Audience reception of Turkish television dramas', ref: 'Alardawi, M., Bajnaid, A., & Brereton, P. (2021). The influence of Turkish drama on socio-cultural values of Saudi women. Modern Applied Science, 15(4), 47. https://doi.org/10.5539/mas.v15n4p47', lesson: 'Task: check whether every research question is answered in the conclusion.' },
      { area: 'Streaming platform audiences', ref: 'Qutub, A., & Alardawi, M. (2022). Saudi viewers’ perceptions of Attack on Titan Japanese animation online series. Asian Social Science, 18(1), 65. https://doi.org/10.5539/ass.v18n1p65', lesson: 'Task: rewrite the final paragraph as a closing statement using the Step 9 prompts.' }
    ],
    ui: {
      next: 'Next step', finish: 'Go to the final report', stepOf: (a, b) => 'Step ' + a + ' of ' + b,
      savedAt: (t) => 'Saved on this device · ' + t, notSaved: 'Not saved yet',
      required: 'This field is required.', tooShort: (n) => 'Please write at least ' + n + ' words.', chooseOne: 'Please choose one option.',
      fixErrors: 'Please complete the highlighted fields before continuing.', needRows: (n, t) => 'Add at least ' + n + ' complete row(s) to the ' + t + '.', needAlign: 'Choose a status for every question and answer those that were fully or partly answered.', needLim: 'Add a limitation, or tick “Limitations are addressed elsewhere”.', needClosing: 'Build or write a closing statement.', needDraft: 'Build or write the conclusion draft first.',
      example: 'Example', weak: 'Weaker', better: 'Stronger', tip: 'Tip:', fix: 'Fix:', fitsTechnique: '',
      copy: 'Copy', copied: 'Copied.', copyFail: 'Copy failed; select the text and copy it manually.',
      prefill: 'Fill from Step 1', prefillConfirm: 'Click again to replace your restatement', prefilled: 'Filled from Step 1 — now shorten and rephrase it.',
      rows: (n) => n + ' row(s)', rowN: (n) => 'Row ' + n, noRows: 'No rows yet.', csv: 'Export CSV', json: 'Export JSON', importRows: 'Import CSV or JSON', imported: (n) => n + ' row(s) imported.', importRowsFail: 'The file could not be read. Use a file exported from this tool or a CSV whose first row has the column names.',
      moveUp: 'Move up', moveDown: 'Move down', del: 'Delete', confirmDel: 'Click again to delete',
      alNoQ: 'Enter your research questions in Step 1.', alFindings: 'Linked findings', alNone: 'none linked', alStatus: 'How fully was it answered?', alAnswer: 'Concise answer', alEvidence: 'Supporting evidence', alInterp: 'Concluding interpretation',
      alCols: ['Research question', 'Status', 'Answer', 'Evidence', 'Concluding interpretation'],
      elsewhere: 'Limitations are addressed elsewhere', elsewhereHint: 'For example in the Discussion, as your journal requires. The limitations part is then left out of the conclusion.', limElsewhereHint: 'Limitations are addressed elsewhere in the publication.',
      closeTplTitle: 'Closing statement models for your methodology', closingBuilt: 'Built closing statement',
      composerHint: 'Switch parts on or off, reorder and edit them. Each part becomes one paragraph.', headings: 'Add section headings', headingsHint: 'Only if your publication requires or permits them.',
      draftTitle: 'Complete conclusion draft', rebuild: 'Rebuild from my entries', rebuildConfirm: 'Click again to replace your edits', rebuilt: 'Draft rebuilt.',
      draftAutoNote: 'Updates automatically from your entries.', draftEditedNote: 'You edited the draft directly, so it no longer updates automatically.',
      resetSection: 'Reset', sectionReset: 'Part refilled from your steps.', sectionEmpty: 'This part is empty — complete the related step or write here.', words: (n) => n + ' words',
      coherenceTitle: 'Conclusion Coherence Checker', mapTitle: 'What each paragraph does', unclear: 'Unclear function', rewriteTitle: 'Revision templates for each part',
      checksTitle: 'Automated checks', checklistTitle: 'Conclusion checklist', checklistDone: (a, b) => a + ' of ' + b + ' done',
      applyScores: 'Use the suggested scores', scoresApplied: 'Suggested scores applied; adjust them as you see fit.', suggestedScore: 'Suggested score:', overall: 'Overall', outOf5: '/ 5', recommendations: 'Revision recommendations', noRecs: 'No criterion is rated 3 or below.', notRated: 'Not rated yet.',
      evalDisclaimer: 'This evaluation is an educational self-assessment. It does not replace expert academic review, supervision or peer review.', rubricCols: ['Criterion', '1–2 · Needs work', '3 · Developing', '4–5 · Strong'],
      finalFromDraft: 'Copy the Step 10 draft here', replaceConfirm: 'Click again to replace', finalCopied: 'Draft copied to the final version.', copyFinal: 'Copy final conclusion',
      reportRegen: 'Regenerate report', regenConfirm: 'Click again to discard report edits', reportRebuilt: 'Report regenerated.', reportCopy: 'Copy report', print: 'Print / Save as PDF', doc: 'Download Word (.doc)', txt: 'Download text (.txt)', csvAll: 'Export all matrices (CSV)',
      fileReport: 'research-conclusion-report', fileData: 'research-conclusion-project.json',
      files: { findings: 'key-findings', contrib: 'contributions', impl: 'implications', lim: 'limitations', future: 'future-research', all: 'all-matrices' },
      report: { title: 'Research Conclusion Report', generated: (d) => 'Generated on ' + d + ' · Research Conclusion Writing and Refinement in Film and Television Studies', profile: 'Research title and profile', purpose: 'Research purpose', findings: 'Synthesis of principal findings', alignment: 'Research question alignment', contribution: 'Scholarly contribution', implications: 'Theoretical and practical implications', limitations: 'Research limitations', future: 'Future research recommendations', closing: 'Closing statement', draft: 'Complete conclusion draft', evaluation: 'Quality evaluation results', self: 'Researcher’s reflection', recs: 'Suggested improvements', noRecs: 'No revision recommendations.', final: 'Final research conclusion', refs: 'References', noRefs: 'No references entered.', notes: 'Notes', footer: 'Academic Tool Developed by Dr. Merfat Alardawi. The report contains the researcher’s entries and rule-based feedback; verify it against publication requirements before submission.' },
      empty: '—',
      deleteAll: 'Click again to delete everything', deleted: 'All saved data was deleted from this browser.', projectImported: 'Project imported.', projectImportFail: 'This file is not a project exported from this tool.',
      exAllAreas: 'All', exHyp: 'Illustrative example', exPub: 'Verified published study', whyWorks: 'Why it works:', lesson: 'Learning task:', exFinding: 'Principal findings', exEvidence: 'Synthesis', exDiscussion: 'Closing statement',
      glossCols: ['Term', 'Equivalent', 'Definition', 'Arabic definition'], distCols: ['Section', 'What it does', 'Film and television example'],
      refGroups: { conclusions: 'Writing conclusions and reporting research', film: 'Film, television and audience research', examples: 'Film and television studies used in the examples', tutorials: 'Video tutorials in the attached reference file' },
      refTypes: { book: 'Book', article: 'Peer-reviewed article', example: 'Published example', video: 'Video tutorial', guideline: 'Reporting standard' },
      guideStep: (n, t) => 'Step ' + n + ' — ' + t
    }
  };
})();
