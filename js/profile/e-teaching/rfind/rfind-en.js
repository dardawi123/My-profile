/* =========================================================
   Research Findings: Writing, Presentation, and Discussion in Film and
   Television Studies — English interface text, guidance, matrix schemas,
   templates and examples. rfind-ar.js has exactly the same keys.
   Templates only arrange the researcher's own entries; they never add
   findings, quotations, statistics or references.
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
  const listJoin = (a) => a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1];

  const approaches = [
    { id: 'qual', t: 'Qualitative', d: 'Interviews, focus groups, reception, textual, semiotic, narrative or discourse analysis.' },
    { id: 'quant', t: 'Quantitative', d: 'Surveys, quantitative content analysis or experiments.' },
    { id: 'mixed', t: 'Mixed methods', d: 'Integrated qualitative and quantitative strands.' },
    { id: 'theory', t: 'Interpretive / critical', d: 'Critical, theoretical or historical interpretation of texts and documents.' }
  ];
  const techniques = [
    { id: 'thematic', t: 'Thematic analysis', fit: 'thematic' }, { id: 'qca', t: 'Qualitative content analysis', fit: 'category' },
    { id: 'interviews', t: 'Semi-structured interviews', fit: 'thematic' }, { id: 'focus', t: 'Focus groups', fit: 'thematic' },
    { id: 'narrative', t: 'Narrative analysis', fit: 'narrative' }, { id: 'discourse', t: 'Discourse analysis', fit: 'discourse' },
    { id: 'semiotic', t: 'Semiotic / semiological analysis', fit: 'semiotic' }, { id: 'textual', t: 'Film and television textual analysis', fit: 'textual' },
    { id: 'feminist', t: 'Feminist film criticism', fit: 'textual' }, { id: 'reception', t: 'Audience reception study', fit: 'thematic' },
    { id: 'survey', t: 'Quantitative survey', fit: 'stat' }, { id: 'quantca', t: 'Quantitative content analysis', fit: 'stat' }, { id: 'mixed', t: 'Mixed-methods design', fit: 'mixed' }
  ];
  const structures = [
    { id: 'thematic', t: 'Thematic findings', d: 'Findings organised around interpretive themes and subthemes developed from interviews, focus groups or reception data.', expect: ['Open with a short overview of the themes, ideally in a table or thematic map.', 'Give each theme a heading that states its central organising idea, not just a topic.', 'Support every theme with at least two well-chosen extracts from different participants, with codes.', 'Explain what each extract shows; the data do not speak for themselves.', 'Report variation and negative cases, not only the dominant pattern.'] },
    { id: 'category', t: 'Category-based findings', d: 'Findings organised by the categories of a coding frame, as in qualitative content analysis.', expect: ['Present the coding frame (categories, definitions, examples) or refer to an appendix.', 'Report each category with a description and typical examples.', 'Counts may be reported, but frequency is not the same as importance.', 'State intercoder agreement or consensus procedures where used.'] },
    { id: 'narrative', t: 'Narrative findings', d: 'Findings that follow stories, plot structures or narrative strategies in texts or participants’ accounts.', expect: ['Organise findings by narrative pattern, phase or strategy.', 'Keep the sequence and context of stories visible.', 'Use excerpts or scene descriptions long enough to show narrative form.', 'Distinguish the story told from your analysis of how it is told.'] },
    { id: 'discourse', t: 'Discourse analysis findings', d: 'Findings about how language, framing and representation construct meanings and positions.', expect: ['Organise by discursive strategy, repertoire or construction.', 'Quote the exact wording analysed, with source details.', 'Show how the wording works, not only what it says.', 'Relate constructions to the context of production and reception where your design allows.'] },
    { id: 'semiotic', t: 'Semiotic analysis findings', d: 'Findings about signs, codes, denotation, connotation and myth in images, sound and mise-en-scène.', expect: ['Identify the scene or image precisely (title, episode, timestamp).', 'Describe denotation before interpreting connotation.', 'Group readings by code or sign system, not scene by scene only.', 'Use stills or frame descriptions sparingly and within fair use.'] },
    { id: 'textual', t: 'Film and television textual analysis', d: 'Findings about narrative, mise-en-scène, cinematography, editing, sound, performance and representation.', expect: ['Organise by analytical dimension or recurring pattern across texts.', 'Document every example with title, episode and timestamp.', 'Link formal description to meaning and representation.', 'Make the corpus and selection of scenes transparent.'] },
    { id: 'stat', t: 'Descriptive and inferential statistical results', d: 'Numerical results from surveys, experiments or quantitative content analysis.', expect: ['Report the sample and data preparation first (missing data, composite measures, reliability).', 'Present descriptive statistics, then inferential tests in the order of the hypotheses or questions.', 'Report test statistic, degrees of freedom, exact p value and effect size with confidence intervals (APA 7).', 'Use tables and figures for detail; the text states what matters.', 'Do not interpret beyond the data in a separate results section.'] },
    { id: 'mixed', t: 'Mixed-methods findings', d: 'Qualitative and quantitative results reported and then integrated.', expect: ['Report each strand clearly, then show where and how they were integrated.', 'Use a joint display to set results side by side.', 'State whether the strands confirm, expand or disagree with each other.', 'Draw meta-inferences that neither strand could support alone.'] }
  ];
  const pubOptions = [
    { id: 'separate', t: 'Option A — Separate Results and Discussion', d: 'Results present and describe findings without interpreting them; the Discussion interprets, compares and draws implications.', when: 'Common for quantitative studies, many theses and journals that require IMRaD.' },
    { id: 'combined', t: 'Option B — Combined Results and Discussion', d: 'Each finding is presented and discussed together, linking evidence, interpretation and literature as you go.', when: 'Common in interpretive, textual and many qualitative studies; check the journal or university requirements.' }
  ];
  const orders = [{ id: 'rq', t: 'By research question' }, { id: 'theme', t: 'By theme or category' }, { id: 'chrono', t: 'Chronologically' }, { id: 'case', t: 'By case, film or series' }, { id: 'importance', t: 'By importance' }];
  const anonOptions = [{ id: 'codes', t: 'Participant codes (P1, FG2-P3)' }, { id: 'pseudo', t: 'Pseudonyms' }, { id: 'roles', t: 'Roles or attributes (viewer, 24, female)' }];
  const coverage = [{ id: 'full', t: 'Fully addressed' }, { id: 'partial', t: 'Partly addressed' }, { id: 'none', t: 'Not addressed by the evidence' }];
  const filmElements = [{ id: 'narrative', t: 'Narrative' }, { id: 'mise', t: 'Mise-en-scène' }, { id: 'cine', t: 'Cinematography' }, { id: 'editing', t: 'Editing' }, { id: 'sound', t: 'Sound and music' }, { id: 'performance', t: 'Performance' }, { id: 'representation', t: 'Representation' }, { id: 'symbol', t: 'Symbolic meaning' }];
  const sName = (id) => pick(structures, id).t || '';

  const mx = {
    evidence: { t: 'Research Evidence Matrix', add: 'Add evidence', sum: ['code', 'type', 'content'], intro: 'One row per item of evidence. Give every item a code and a source identifier so each finding can be traced back to its data.', empty: 'No evidence yet. Add codes, quotations, scenes, statistics or notes.',
      cols: [{ k: 'code', t: 'Code', type: 'text', ph: 'E1' },
        { k: 'type', t: 'Type of evidence', type: 'sel', opts: [{ id: 'code', t: 'Code' }, { id: 'category', t: 'Category' }, { id: 'theme', t: 'Theme' }, { id: 'subtheme', t: 'Subtheme' }, { id: 'quote', t: 'Participant quotation' }, { id: 'excerpt', t: 'Focus group excerpt' }, { id: 'scene', t: 'Film or TV scene' }, { id: 'av', t: 'Audiovisual observation' }, { id: 'stat', t: 'Statistical result' }, { id: 'table', t: 'Table or figure' }, { id: 'doc', t: 'Document extract' }, { id: 'note', t: 'Analytical note' }] },
        { k: 'content', t: 'Content (exact wording, observation or value)', type: 'area', wide: 1, ph: 'Copy quotations exactly; describe scenes precisely; give values as reported.' },
        { k: 'source', t: 'Source identifier', type: 'text', ph: 'P3 · FG2-P1 · Title S1E3 · Doc 4' },
        { k: 'loc', t: 'Location', type: 'text', ph: '00:12:31 · p. 14 · lines 220–231' },
        { k: 'finding', t: 'Linked finding', type: 'finding', hint: 'Link after you write findings in Step 4.' },
        { k: 'theme', t: 'Theme or category', type: 'text' },
        { k: 'note', t: 'Analytical note', type: 'area' }] },
    themes: { t: 'Qualitative Themes Builder', add: 'Add theme', sum: ['name', 'rq'], intro: 'A theme captures a pattern of shared meaning around a central organising concept. Name it as a claim, not a topic.', empty: 'No themes yet.',
      cols: [{ k: 'name', t: 'Theme name', type: 'text', ph: 'The family home as a moral anchor' },
        { k: 'def', t: 'Central organising concept', type: 'area', ph: 'What unites the data in this theme?' },
        { k: 'subs', t: 'Subthemes (one per line)', type: 'area' },
        { k: 'codes', t: 'Codes included', type: 'area' },
        { k: 'rq', t: 'Research question', type: 'rq' },
        { k: 'prev', t: 'Prevalence note (optional)', type: 'text', ph: 'Discussed by 9 of 12 participants' },
        { k: 'note', t: 'Notes', type: 'area' }] },
    findings: { t: 'Key Findings', add: 'Add finding', sum: ['label', 'rq'], intro: 'Write each finding as a clear statement of what the analysis found. Link it to a research question; link evidence to it in Steps 3 and 6.', empty: 'No findings yet.',
      cols: [{ k: 'label', t: 'Short label', type: 'text', ph: 'Home as moral anchor' },
        { k: 'statement', t: 'Finding statement', type: 'area', wide: 1, ph: 'State what was found, in one or two sentences.' },
        { k: 'basis', t: 'Basis', type: 'sel', opts: [{ id: 'theme', t: 'Theme' }, { id: 'category', t: 'Category' }, { id: 'pattern', t: 'Analytical pattern' }, { id: 'textual', t: 'Textual / audiovisual reading' }, { id: 'stat', t: 'Statistical result' }, { id: 'integrated', t: 'Integrated (mixed methods)' }] },
        { k: 'rq', t: 'Research question', type: 'rq' },
        { k: 'element', t: 'Cinematic element (textual analysis)', type: 'sel', opts: filmElements },
        { k: 'pattern', t: 'Pattern or observation explained', type: 'area' },
        { k: 'stat', t: 'Statistical summary (quantitative)', type: 'text', ph: 'M = 3.42, SD = 0.87; t(198) = 2.31, p = .022, d = 0.33' },
        { k: 'interp', t: 'Brief interpretation (combined sections only)', type: 'area' }] },
    av: { t: 'Audiovisual Findings Matrix', add: 'Add scene', sum: ['title', 'time', 'element'], intro: 'Document each audiovisual example precisely so readers can locate it.', empty: 'No scenes yet.',
      cols: [{ k: 'title', t: 'Film or series title', type: 'text' }, { k: 'episode', t: 'Season / episode', type: 'text', ph: 'S1E3' }, { k: 'scene', t: 'Scene', type: 'text', ph: 'Dinner scene in the family courtyard' },
        { k: 'time', t: 'Timestamp', type: 'text', ph: '00:12:31–00:13:05' }, { k: 'element', t: 'Cinematic element', type: 'sel', opts: filmElements },
        { k: 'observation', t: 'Observation (what is seen and heard)', type: 'area', wide: 1 }, { k: 'interp', t: 'Interpretation', type: 'area' }, { k: 'finding', t: 'Linked finding', type: 'finding' }] },
    joint: { t: 'Mixed-methods Joint Display', add: 'Add row', sum: ['dim', 'fit'], intro: 'Set quantitative and qualitative results side by side for each dimension and state what their combination shows.', empty: 'No rows yet.',
      cols: [{ k: 'dim', t: 'Dimension or construct', type: 'text' }, { k: 'quant', t: 'Quantitative result', type: 'area' }, { k: 'qual', t: 'Qualitative finding', type: 'area' },
        { k: 'fit', t: 'Fit', type: 'sel', opts: [{ id: 'confirm', t: 'Confirmation' }, { id: 'expand', t: 'Expansion' }, { id: 'discord', t: 'Discordance' }] }, { k: 'meta', t: 'Meta-inference', type: 'area' }] },
    dplan: { t: 'Discussion Planning Matrix', add: 'Add discussion point', sum: ['finding', 'priority'], intro: 'Select the findings that need deeper discussion and say why. Not every finding needs equal space.', empty: 'No discussion points yet.',
      cols: [{ k: 'finding', t: 'Finding', type: 'finding' },
        { k: 'crit', t: 'Why discuss it?', type: 'multi', opts: [{ id: 'relevance', t: 'Relevance to the questions' }, { id: 'significance', t: 'Analytical significance' }, { id: 'theory', t: 'Theoretical implications' }, { id: 'unexpected', t: 'Unexpected pattern' }, { id: 'contradiction', t: 'Contradiction' }, { id: 'contribution', t: 'Contribution to scholarship' }] },
        { k: 'priority', t: 'Priority', type: 'sel', opts: [{ id: 'high', t: 'High' }, { id: 'medium', t: 'Medium' }, { id: 'low', t: 'Low' }] },
        { k: 'point', t: 'Discussion point to develop', type: 'area', wide: 1 }] },
    interp: { t: 'Interpretation Matrix', add: 'Add interpretation', sum: ['finding'], intro: 'Explain what a finding means in context, show the evidence that supports the reading and consider alternatives.', empty: 'No interpretations yet.',
      cols: [{ k: 'finding', t: 'Finding', type: 'finding' }, { k: 'meaning', t: 'Possible interpretation', type: 'area', wide: 1 }, { k: 'evidence', t: 'Supporting evidence', type: 'area' }, { k: 'context', t: 'Relevant contextual factors', type: 'area' }, { k: 'alt', t: 'Alternative interpretations', type: 'area' }, { k: 'just', t: 'Analytical justification', type: 'area' }] },
    theory: { t: 'Theory–Findings Integration Matrix', add: 'Add link', sum: ['finding', 'rel'], intro: 'Connect findings to concepts and assumptions of your framework. Findings may support, extend or complicate it; do not force confirmation.', empty: 'No links yet.',
      cols: [{ k: 'finding', t: 'Finding', type: 'finding' }, { k: 'concept', t: 'Theoretical concept', type: 'text' }, { k: 'assumption', t: 'Theoretical assumption', type: 'area' }, { k: 'evidence', t: 'Supporting evidence', type: 'area' },
        { k: 'rel', t: 'Relation to the theory', type: 'sel', opts: [{ id: 'support', t: 'Supports' }, { id: 'extend', t: 'Extends' }, { id: 'complicate', t: 'Complicates' }, { id: 'limit', t: 'Reveals a limitation' }, { id: 'new', t: 'Suggests a new relationship' }] },
        { k: 'implication', t: 'Interpretive implication', type: 'area' }, { k: 'contribution', t: 'Possible theoretical contribution', type: 'area' }] },
    lit: { t: 'Findings–Literature Comparison Matrix', add: 'Add previous study', sum: ['finding', 'study', 'rel'], intro: 'Compare each key finding with specific previous studies you have read. Do not claim agreement or novelty without evidence.', empty: 'No comparisons yet.',
      cols: [{ k: 'finding', t: 'Current finding', type: 'finding' }, { k: 'study', t: 'Previous study (Author, Year)', type: 'text', ph: 'Berg et al. (2025)' }, { k: 'prev', t: 'Main finding of the previous study', type: 'area' },
        { k: 'rel', t: 'Relationship', type: 'sel', opts: [{ id: 'consistent', t: 'Consistent' }, { id: 'contra', t: 'Contradictory' }, { id: 'partial', t: 'Partially consistent' }, { id: 'novel', t: 'Novel or contextually distinctive' }, { id: 'extends', t: 'Extends existing scholarship' }] },
        { k: 'explain', t: 'Possible explanation', type: 'area' }, { k: 'diff', t: 'Contextual or methodological differences', type: 'area' }, { k: 'ref', t: 'Full reference (APA 7)', type: 'area', wide: 1 }] },
    unexp: { t: 'Unexpected Findings Analysis', add: 'Add unexpected finding', sum: ['type', 'desc'], intro: 'Record evidence that surprised you or complicates your assumptions, and how you will explain it.', empty: 'No unexpected findings recorded. If there are none, you can leave this step empty.',
      cols: [{ k: 'type', t: 'Type', type: 'sel', opts: [{ id: 'theme', t: 'Unexpected theme' }, { id: 'contra', t: 'Contradictory evidence' }, { id: 'divergent', t: 'Divergent audience responses' }, { id: 'expect', t: 'Theory versus observation' }, { id: 'context', t: 'Context-specific pattern' }, { id: 'other', t: 'Other' }] },
        { k: 'desc', t: 'What was unexpected', type: 'area', wide: 1 }, { k: 'evidence', t: 'Evidence', type: 'area' }, { k: 'explain', t: 'Possible and alternative explanations', type: 'area' }, { k: 'handle', t: 'How the discussion addresses it', type: 'area' }] },
    impl: { t: 'Research Implications Builder', add: 'Add implication', sum: ['type', 'finding'], intro: 'Each implication must follow from an actual finding.', empty: 'No implications yet.',
      cols: [{ k: 'type', t: 'Type of implication', type: 'sel', opts: [{ id: 'theoretical', t: 'Theoretical' }, { id: 'empirical', t: 'Empirical' }, { id: 'methodological', t: 'Methodological' }, { id: 'cultural', t: 'Cultural' }, { id: 'practical', t: 'Practical' }, { id: 'industry', t: 'Industry-related' }] },
        { k: 'finding', t: 'Based on finding', type: 'finding' }, { k: 'impl', t: 'Implication', type: 'area', wide: 1 }, { k: 'who', t: 'For whom', type: 'text', ph: 'Screenwriters, platform commissioners, audience researchers' }] },
    lim: { t: 'Research Limitations Reflection Tool', add: 'Add limitation', sum: ['type', 'desc'], intro: 'State genuine methodological limitations, their effect on interpretation and how readers should read the findings.', empty: 'No limitations yet.',
      cols: [{ k: 'type', t: 'Type', type: 'sel', opts: [{ id: 'sample', t: 'Sample characteristics' }, { id: 'data', t: 'Data availability' }, { id: 'corpus', t: 'Film or TV corpus selection' }, { id: 'context', t: 'Research context' }, { id: 'analytic', t: 'Analytical boundaries' }, { id: 'positionality', t: 'Researcher positionality' }, { id: 'method', t: 'Methodological constraints' }, { id: 'general', t: 'Transferability or generalisability' }] },
        { k: 'desc', t: 'Limitation', type: 'area', wide: 1 }, { k: 'effect', t: 'Effect on interpretation', type: 'area' }, { k: 'mitigation', t: 'How it was addressed or should be read', type: 'area' },
        { k: 'avoid', t: 'Nature', type: 'sel', opts: [{ id: 'limitation', t: 'Methodological limitation' }, { id: 'error', t: 'Avoidable error (fix it instead)' }] }] },
    future: { t: 'Future Research Directions', add: 'Add direction', sum: ['from', 'rec'], intro: 'Recommendations should grow out of your findings, limitations or unresolved questions.', empty: 'No directions yet.',
      cols: [{ k: 'from', t: 'Emerges from', type: 'sel', opts: [{ id: 'finding', t: 'A finding' }, { id: 'limitation', t: 'A limitation' }, { id: 'unresolved', t: 'An unresolved question' }, { id: 'theory', t: 'A theoretical implication' }, { id: 'context', t: 'A contextual boundary' }] },
        { k: 'basis', t: 'Which finding, limitation or question', type: 'text' }, { k: 'rec', t: 'Recommendation', type: 'area', wide: 1 }, { k: 'design', t: 'Suggested design or method', type: 'text' }] }
  };
  const relDesc = { support: 'The finding is consistent with what the theory predicts or describes.', extend: 'The finding adds a dimension, context or mechanism the theory does not cover.', complicate: 'The finding fits only in part and shows tensions or conditions.', limit: 'The finding shows where the framework cannot explain the data.', new: 'The finding points to a relationship between concepts not yet theorised.' };
  const litPhrases = {
    consistent: ['This finding is consistent with [Author (Year)], who found that…', 'Similar to [Author (Year)], the present study shows…'],
    contra: ['In contrast to [Author (Year)], who reported…, this study found…', 'This difference may reflect [context, sample or method]…'],
    partial: ['This finding partly supports [Author (Year)]: …, but…', 'While [Author (Year)] found…, the present data suggest a more conditional pattern…'],
    novel: ['Among the studies reviewed, none reported… in [context]; this may reflect…', 'This finding appears specific to [context], where…'],
    extends: ['This finding extends [Author (Year)] by showing that…', 'Building on [Author (Year)], the present study adds…']
  };
  const implDesc = { theoretical: 'What the findings mean for concepts, assumptions or theories.', empirical: 'What they add to knowledge of the texts, audiences or contexts studied.', methodological: 'What they show about how to study this phenomenon.', cultural: 'What they mean for representation, identity or cultural debate.', practical: 'What practitioners, educators or policy makers might do.', industry: 'What producers, platforms or creative industries might consider.' };
  const dNames = { opening: 'Opening synthesis of the principal findings', interpret: 'Interpretation of important results', questions: 'Connections with the research questions', literature: 'Comparison with previous studies', theory: 'Theoretical interpretation', unexpected: 'Unexpected findings', implications: 'Research implications', limitations: 'Limitations', future: 'Future research directions', conclusion: 'Concluding scholarly synthesis' };
  const dHints = { opening: 'From the opening field below, or the main question and high-priority findings (Steps 1 and 9).', interpret: 'From the Interpretation Matrix (Step 10).', questions: 'From findings linked to each question and the alignment notes (Step 5).', literature: 'From the Literature Comparison Matrix (Step 12).', theory: 'From the Theory–Findings Integration Matrix (Step 11).', unexpected: 'From Step 13.', implications: 'From Step 14.', limitations: 'From Step 15.', future: 'From Step 16.', conclusion: 'From the concluding field below.' };

  return {
    lang: 'en', dir: 'ltr', sep: ', ',
    numerals: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
    steps: ['Research context', 'Presentation approach', 'Evidence matrix', 'Key findings', 'Questions & findings', 'Supporting evidence', 'Visualise findings', 'Write findings', 'Plan the discussion', 'Interpret', 'Theory & findings', 'Previous studies', 'Unexpected findings', 'Implications', 'Limitations', 'Future research', 'Write the discussion', 'Evaluate & refine', 'Final report'],
    modules: ['Module A — Research Findings: Organisation, Writing and Presentation', 'Module B — Research Discussion: Interpretation and Scholarly Synthesis', 'Refinement and final report'],
    modulesShort: ['A · Findings', 'B · Discussion', 'Report'],
    moduleOf: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2],
    stepText: [
      { h: 'Step 1 — Establish the research context', p: 'Record the study whose findings you are reporting.', whyH: 'Findings answer a study', why: 'How you report findings depends on your questions, framework, methodology and analytical technique. Recording them first lets the tool suggest an appropriate structure, number your research questions (MRQ, RQ1, RQ2…) and adapt its checks to qualitative, quantitative or mixed designs.', ex: 'Belonging and the family home in Saudi streaming drama · MRQ: How do Saudi streaming series construct belonging through the family home? · Qualitative · Semiotic analysis of 12 scenes from two series.', out: 'Expected output — A structured research profile' },
      { h: 'Step 2 — Select the findings presentation approach', p: 'Choose a structure that fits your methodology, and decide between separate or combined Results and Discussion.', whyH: 'No universal structure', why: 'Thematic findings are organised around interpretive themes; semiotic findings around signs and codes; statistical results around hypotheses and tests; mixed-methods findings around integration. A results chapter may also be combined with the discussion, depending on the university or journal. The badge marks the structure that usually fits your analytical technique; it does not decide for you.', ex: 'Semiotic analysis findings · Option B (combined) · ordered by research question.', weak: 'I will present all the results.', better: 'Findings are presented as semiotic readings organised by research question, in a combined Results and Discussion section, because each reading needs interpretation to be meaningful.', out: 'Expected output — A methodologically appropriate presentation plan' },
      { h: 'Step 3 — Organise research evidence', p: 'Build the Research Evidence Matrix: codes, quotations, excerpts, scenes, observations, statistics, tables and notes.', whyH: 'Every finding must be traceable', why: 'Readers trust findings they can trace to data. Give each item a code (E1, E2…), its type, the exact content, a source identifier (participant code, film and episode, document) and a location (timestamp, page, line). After Step 4, link each item to the finding it supports. Use participant codes or pseudonyms, never real names.', ex: 'E4 · Participant quotation · “My grandmother’s house is the only place the series feels like home.” · P7 · interview 2, lines 118–120.', out: '' },
      { h: 'Step 4 — Identify and structure key findings', p: 'Develop themes (qualitative) and write the key findings of your analysis.', whyH: 'From data to findings', why: 'Raw data, codes, categories, themes, observations, findings, interpretations and conclusions are different things. A finding is a clear statement of what the analysis showed, linked to a research question. For textual analysis, findings may concern narrative, mise-en-scène, cinematography, editing, sound, representation or symbolic meaning. For quantitative work, report only the statistics you obtained.', ex: 'F1 · Home as moral anchor · In both series, the family home is framed as the stable moral centre against which the city is measured. · Theme · MRQ.', weak: 'Family is important in the series.', better: 'In both series, the family home is framed as the moral centre against which urban life is measured: domestic scenes are lit warmly and shot at eye level, while city scenes are fragmented and cold.', out: '' },
      { h: 'Step 5 — Align findings with research questions', p: 'Check how each research question is addressed by your findings and evidence.', whyH: 'Report gaps honestly', why: 'The Research Question–Findings Alignment Matrix lists the findings and evidence linked to each question. For every question, say whether it is fully, partly or not addressed. A question that the evidence does not answer should be reported as such, or the question revised; never fabricate findings to fill it.', ex: 'RQ2 · Partly addressed · The scenes analysed show generational conflict but not its resolution; this is acknowledged as a limitation.', out: '' },
      { h: 'Step 6 — Integrate supporting evidence', p: 'Decide how evidence will appear in the text, with appropriate anonymity and attribution.', whyH: 'Balance evidence and analysis', why: 'Quotations, excerpts and scene descriptions should illustrate and support the analysis, not replace it. Aim for at least two extracts per finding from different sources, introduce each extract and explain what it shows. For audiovisual analysis, document title, episode and timestamp, and use stills sparingly within fair use.', ex: 'Attribution format: (P7, female, 26) · Audiovisual format: (Title, S1E3, 00:12:31).', weak: '“I like it.” (P2). “It is good.” (P5). “Very nice.” (P9).', better: 'Participants valued the series for its familiarity: as P7 explained, “my grandmother’s house is the only place the series feels like home” — a sense of recognition that others linked to the use of real Jeddah locations.', out: '' },
      { h: 'Step 7 — Visualise research findings', p: 'Create appropriate tables, charts, thematic maps, findings matrices or joint displays.', whyH: 'Visuals support, text explains', why: 'Choose the visual that fits the data: a thematic map for themes and subthemes, a findings matrix for questions and findings, bar or line charts and frequency tables for quantitative results, a joint display for mixed methods. Calculations are shown transparently. In qualitative work, the frequency of a theme is not evidence of its importance.', ex: '', out: '' },
      { h: 'Step 8 — Write the research findings section', p: 'Assemble an editable findings draft from your findings and evidence.', whyH: 'Introduce, show, explain, connect', why: 'Each finding paragraph introduces the finding, explains the pattern, presents the evidence, offers the interpretation your structure allows and relates it to a research question. In separate Results sections, keep interpretation and literature for the Discussion; in combined sections, interpretation follows each finding. Open with a short overview and end with a summary that introduces nothing new.', ex: '', weak: 'The results are very interesting and show many things. Table 3 shows the results.', better: 'Three themes describe how participants related to the series (Table 3). The first, “home as moral anchor”, appeared in all focus groups…', out: '' },
      { h: 'Step 9 — Identify the main findings for discussion', p: 'Choose the findings that need deeper scholarly interpretation, and say why.', whyH: 'Discuss, do not repeat', why: 'The discussion is not a second results section. Prioritise findings by relevance to the questions, analytical significance, theoretical implications, unexpected patterns, contradictions and contribution. Minor findings may need only a sentence.', ex: 'F1 · High · relevance, theory · How the home functions as a counter-space to the city.', out: 'Expected output — A structured discussion outline' },
      { h: 'Step 10 — Interpret the meaning of findings', p: 'Explain what key findings mean in context, with evidence and alternative readings.', whyH: 'Interpretation, not speculation', why: 'An interpretation explains why a finding matters and what it means, grounded in evidence and context. Consider alternative explanations and say why yours is more convincing. In interpretive film studies, discuss aesthetic, narrative, symbolic, ideological and representational meanings with theoretical care.', ex: '', weak: 'This clearly proves that Saudi drama is conservative.', better: 'One reading is that the warm framing of the home naturalises a conservative ideal of family; however, the series also stage dissent inside the home, which suggests negotiation rather than simple endorsement.', out: '' },
      { h: 'Step 11 — Connect findings with the theoretical framework', p: 'Show how findings relate to the concepts and assumptions of your framework.', whyH: 'Theory is tested by findings, not forced on them', why: 'For each key finding, name the concept and assumption it relates to, the evidence, and whether it supports, extends, complicates, shows a limitation of, or suggests a new relationship within the framework. A framework that every finding confirms deserves a second look.', ex: 'F1 · Representation (Hall) · Extends · The home is not only represented but used to define the city by contrast.', out: '' },
      { h: 'Step 12 — Compare findings with previous studies', p: 'Compare key findings with specific previous studies you have read.', whyH: 'Join the scholarly conversation', why: 'Say where your findings agree, disagree, partly agree, extend or differ from earlier studies, and explain why (context, sample, period, method). Name the studies and give full references. Claims of novelty need care: say “among the studies reviewed”, not “for the first time”.', ex: '', weak: 'Many studies agree with this result.', better: 'This finding is consistent with Berg et al. (2025), who found that young Gulf viewers value cultural familiarity, but extends it by showing how familiarity is produced through domestic space.', out: '' },
      { h: 'Step 13 — Explain unexpected or contradictory findings', p: 'Record and explain evidence that surprised you or complicates your assumptions.', whyH: 'Transparency strengthens credibility', why: 'Unexpected themes, contradictory evidence, divergent audience responses and gaps between theory and observation are part of the findings. Report them, consider possible explanations and say how the discussion addresses them. If there were none, you may leave this step empty.', ex: 'Contradictory evidence · Older participants read the courtyard scenes as nostalgic, younger ones as restrictive.', out: '' },
      { h: 'Step 14 — Identify research implications', p: 'State theoretical, empirical, methodological, cultural, practical and industry-related implications.', whyH: 'Implications must follow from findings', why: 'Each implication should be traceable to a finding and stated with appropriate modesty. In film and television studies, implications may concern representation, audience interpretation, aesthetics, storytelling, platforms, gender, creative industries or production.', ex: '', weak: 'This study will change the Saudi film industry.', better: 'For platform commissioners, the finding that local domestic settings drive recognition suggests that location authenticity may matter as much as star casting for young Saudi audiences.', out: '' },
      { h: 'Step 15 — Address research limitations', p: 'Identify genuine limitations, their effect on interpretation and how the findings should be read.', whyH: 'Balanced, reflective, not self-undermining', why: 'Relevant limitations include sample characteristics, data availability, corpus selection, context, analytical boundaries, researcher positionality and methodological constraints. For qualitative work, discuss transferability rather than statistical generalisability. Avoidable errors are not limitations: fix them.', ex: '', weak: 'The sample was small, so the results are not reliable.', better: 'The twelve scenes were selected purposively to examine domestic space; the readings therefore describe how these series construct belonging, not Saudi drama as a whole.', out: '' },
      { h: 'Step 16 — Identify future research directions', p: 'Recommend specific future research that grows out of your findings and limitations.', whyH: 'Specific, justified, feasible', why: 'Good recommendations follow from findings, limitations, unresolved questions, theoretical implications or contextual boundaries, and suggest a design. “More research is needed” is not a recommendation.', ex: '', weak: 'More research is needed on this topic.', better: 'Reception studies with older and younger viewers could test whether the generational split in readings of domestic space observed here holds across other Gulf series.', out: '' },
      { h: 'Step 17 — Construct the complete research discussion', p: 'Combine the ten parts of the discussion and edit the full draft.', whyH: 'A flexible structure', why: 'Each part is filled from your earlier steps. Switch parts on or off and reorder them to fit your methodology and journal. The discussion should interpret, compare, theorise and qualify the findings, not repeat them; the checker flags sentences copied from the findings draft.', ex: '', out: '' },
      { h: 'Step 18 — Evaluate and refine the findings and discussion', p: 'Review the automated checks, complete the checklist and rate fourteen criteria.', whyH: 'Educational self-assessment', why: 'The checks cover structure, evidence, alignment, interpretation, theory, literature, implications, limitations and writing. Suggested scores come from these checks; you decide the final score. This evaluation supports scholarly self-review and does not replace supervision or peer review.', ex: '', out: '' },
      { h: 'Step 19 — Final research report', p: 'Finalise the findings and discussion texts and produce a report you can edit, copy, print, save as PDF and export.', whyH: 'Researcher-reviewed final text', why: 'The report brings together the research profile, questions, presentation plan, findings, themes, evidence, alignment, visualisations, findings draft, discussion outline, interpretation, theory integration, literature comparison, unexpected findings, implications, limitations, future research, the discussion draft, evaluation, recommendations and references. Check every citation against its source before submission.', ex: '', out: '' }
    ],
    f: {
      's1.title': { label: 'Research title', hint: '', ph: 'Belonging and the family home in Saudi streaming drama' },
      's1.problem': { label: 'Research problem', hint: 'What the study set out to understand.', ph: 'Little is known about how platform originals represent belonging in urban Saudi settings.' },
      's1.mainq': { label: 'Main research question', hint: 'Coded MRQ in later steps.', ph: 'How do Saudi streaming series construct belonging through the family home?' },
      's1.subqs': { label: 'Supporting research questions', hint: 'One per line; coded RQ1, RQ2…', ph: 'How is generational conflict staged in domestic space?\nHow is the city contrasted with the home?' },
      's1.objectives': { label: 'Research objectives', hint: 'One per line (optional).', ph: '' },
      's1.framework': { label: 'Theoretical or conceptual framework', hint: 'The perspective used to interpret the findings.', ph: 'Hall’s representation theory with Barthes’ semiology' },
      's1.approach': { label: 'Research methodology', hint: '' },
      's1.technique': { label: 'Analytical technique', hint: 'Used to suggest a presentation structure.' },
      's1.design': { label: 'Research design', hint: '', ph: 'Qualitative case study of two series' },
      's1.sources': { label: 'Data sources', hint: 'Films, series, interviews, documents, survey…', ph: 'Two Saudi streaming series (2021–2023); 12 scenes' },
      's1.sampling': { label: 'Sampling approach', hint: '', ph: 'Purposive selection of scenes set in the family home' },
      's1.context': { label: 'Research context', hint: '', ph: 'Saudi Arabia; regional streaming platforms' },
      's2.structure': { label: 'Findings structure', hint: '' },
      's2.pub': { label: 'Publication structure', hint: 'Check your journal or university requirements.' },
      's2.order': { label: 'Order of presentation', hint: '' },
      's2.rationale': { label: 'Why this structure?', hint: 'One or two sentences.', ph: '' },
      's6.anon': { label: 'Anonymity approach', hint: 'Never use participants’ real names.' },
      's6.attr': { label: 'Attribution format for quotations', hint: '', ph: '(P7, female, 26)' },
      's6.avfmt': { label: 'Reference format for audiovisual examples', hint: '', ph: '(Title, S1E3, 00:12:31)' },
      's6.balance': { label: 'How will you balance evidence and analysis?', hint: 'For example: number of extracts per finding, length, how each extract is introduced and explained.', ph: 'Two to three extracts per finding, each introduced and followed by an explanation of what it shows.' },
      'viz.title': { label: 'Chart title', ph: 'Mentions of each theme across focus groups' },
      'viz.unit': { label: 'Unit or axis label', ph: 'Number of focus groups' },
      's8.intro': { label: 'Opening overview of the findings section', hint: 'Signpost the structure: what will be presented and in what order.', ph: 'This section presents three themes that describe how the series construct belonging…' },
      's8.summary': { label: 'Concluding summary', hint: 'Summarise; never introduce new findings here.', ph: '' },
      's11.framework': { label: 'Theoretical framework used for interpretation', hint: 'Taken from Step 1; edit if needed.', ph: 'Hall’s representation theory' },
      's17.opening': { label: 'Opening synthesis (optional)', hint: 'If empty, the opening is built from your main question and high-priority findings.', ph: '' },
      's17.conclusion': { label: 'Concluding scholarly synthesis', hint: 'What the study adds, in two or three sentences.', ph: '' },
      's18.self': { label: 'Reflection and revision plan (optional)', hint: '', ph: '' },
      's19.findings': { label: 'Final findings section', hint: 'Starts from the Step 8 draft; edit freely.', ph: '' },
      's19.discussion': { label: 'Final discussion section', hint: 'Starts from the Step 17 draft; edit freely.', ph: '' },
      's19.refs': { label: 'References (APA 7)', hint: 'One per line. References from the Literature Comparison Matrix are added to the report automatically.', ph: '' },
      's19.notes': { label: 'Notes for your supervisor (optional)', hint: '', ph: '' }
    },
    approaches, techniques, structures, pubOptions, orders, anonOptions, coverage, mx, relDesc, litPhrases, implDesc, dNames, dHints,
    vizModes: [{ id: 'chart', t: 'Chart and frequency table', d: 'Bar or line chart from values you enter, with a transparent frequency and percentage table.' }, { id: 'themes', t: 'Thematic map', d: 'Built from the Qualitative Themes Builder: themes around the main question, with subthemes.' }, { id: 'joint', t: 'Joint display', d: 'Mixed methods: quantitative and qualitative results side by side with meta-inferences.' }, { id: 'matrix', t: 'Findings matrix', d: 'Research questions against findings, basis, evidence and coverage.' }],
    chartTypes: [{ id: 'bar', t: 'Bar chart' }, { id: 'line', t: 'Line chart' }],
    distinctions: [
      ['Raw data', 'Material as collected: transcripts, recordings, films, survey responses.', 'Focus group 2 transcript; episode 3 of the series.'],
      ['Code', 'A short label attached to a segment of data.', '“grandmother’s house”'],
      ['Category', 'A group of related codes.', '“Domestic spaces”'],
      ['Theme', 'A pattern of shared meaning organised around a central concept.', '“The home as moral anchor”'],
      ['Analytical observation', 'A noted pattern in the data, not yet stated as a finding.', 'Domestic scenes are consistently shot at eye level with warm light.'],
      ['Finding', 'A clear statement of what the analysis showed, linked to a question.', 'The family home is framed as the moral centre against which the city is measured.'],
      ['Interpretation', 'An explanation of what a finding means, using context and theory.', 'This framing naturalises a conservative ideal while allowing negotiated dissent.'],
      ['Conclusion', 'The overall answer to the research problem and its significance.', 'Saudi streaming drama constructs belonging through domestic space rather than national symbols.']
    ],
    tense: [['Describing what you did', 'Past', 'Twelve scenes were analysed.'], ['Reporting your findings', 'Past', 'Participants described the home as…'], ['Describing tables and figures', 'Present', 'Table 2 shows the themes and subthemes.'], ['Interpreting and generalising', 'Present', 'This suggests that domestic space functions as…'], ['Referring to previous studies', 'Past or present perfect', 'Berg et al. (2025) found… / Studies have shown…'], ['Future research', 'Present or modal', 'Future studies could examine…']],
    fTemplates: {
      thematic: ['Theme [n], “[theme name]”, captures [central idea]. It was evident in [scope, e.g. all four focus groups].', 'As [P code] explained, “[quotation]” ([attribution]). This extract illustrates [what it shows].', 'Not all participants shared this view: [negative case] ([attribution]).'],
      category: ['The category “[name]” comprises [definition]; typical examples include [examples].', '[Category] was coded in [n] of [N] units; frequency indicates presence, not importance.'],
      narrative: ['The narratives followed a recurring pattern of [phase 1], [phase 2] and [phase 3].', 'In [story or text], the turning point occurs when [event] ([source, timestamp]).'],
      discourse: ['Participants constructed [object] as [construction], for example: “[wording]” ([source]).', 'This repertoire positions [subject] as [position] by [linguistic or visual means].'],
      semiotic: ['In [title, episode, timestamp], [denotation: what is shown and heard].', 'At the level of connotation, [sign] signifies [meaning] through [code].'],
      textual: ['Across [corpus], [element, e.g. lighting] is used to [pattern] ([title, episode, timestamp]).', 'This pattern recurs in [n] of the [N] scenes analysed, for example [scene].'],
      stat: ['[Variable] differed between [groups], t([df]) = [value], p = [value], d = [value], 95% CI [lower, upper].', 'Descriptive statistics are presented in Table [n]; [main pattern].'],
      mixed: ['The survey showed [quantitative result]; the interviews help explain this: [qualitative finding].', 'Table [n] (joint display) shows where the strands confirmed, expanded or diverged.']
    },
    dTemplates: {
      opening: ['This study examined [aim/question]. The principal findings were that [finding 1] and [finding 2].'],
      interpret: ['One explanation for [finding] is that [interpretation], supported by [evidence].', 'An alternative reading is that [alternative]; however, [reason this reading is less convincing].'],
      questions: ['In relation to [RQ], the findings indicate that [answer].', '[RQ] was only partly answered because [reason].'],
      literature: ['This finding is consistent with [Author (Year)], who…', 'In contrast to [Author (Year)], … This difference may reflect…'],
      theory: ['These findings support/extend/complicate [theory]’s assumption that…', 'The concept of [concept] helps explain… but cannot account for…'],
      unexpected: ['Unexpectedly, [finding]. One possible explanation is…'],
      implications: ['Theoretically, these findings suggest… For practitioners, they indicate…'],
      limitations: ['The study’s focus on [scope] means that… Readers should therefore…'],
      future: ['Future research could [specific direction] using [design], to examine whether…'],
      conclusion: ['Overall, the study shows that… In doing so, it contributes to… by…']
    },
    weakStrong: { weak: 'Weak discussion: “The results showed that participants liked the series. This is similar to other studies. More research is needed.” — it repeats results, names no studies, offers no explanation and ends generically.', strong: 'Strong discussion: “Participants’ attachment to the series rested on recognisable domestic settings rather than plot (F1), which supports Berg et al.’s (2025) emphasis on authenticity but locates it in space rather than language. One explanation is that… Because the sample was urban and young, this pattern may not transfer to… Reception studies with older viewers could test…”' },
    mistakes: [
      { t: 'Interpreting in a separate Results section', d: 'Explaining meaning or citing literature where only presentation is expected.', fix: 'Move interpretation and literature to the Discussion, or choose a combined structure.' },
      { t: 'Including everything', d: 'Reporting irrelevant or non-essential data and analyses.', fix: 'Report what answers your questions; move the rest to appendices.' },
      { t: 'Letting the data speak', d: 'Strings of quotations or tables without explanation.', fix: 'Introduce each extract and explain what it shows.' },
      { t: 'Shaping the data', d: 'Omitting inconvenient results or forcing findings to fit expectations.', fix: 'Report negative cases and unexpected results transparently.' },
      { t: 'Poor visuals', d: 'Charts that duplicate text, lack titles or misrepresent the data.', fix: 'Choose the right visual, label it and refer to it in the text.' },
      { t: 'Repeating results in the discussion', d: 'Restating findings instead of interpreting them.', fix: 'Open with a brief synthesis, then interpret, compare and theorise.' },
      { t: 'New findings in the discussion', d: 'Discussing results that were never presented.', fix: 'Every discussed finding must appear in the findings section first.' },
      { t: 'Weak links to literature and questions', d: 'Discussion that never returns to the research questions or previous studies.', fix: 'Use the alignment and comparison matrices.' },
      { t: 'Overclaiming', d: 'Words such as “proves”, “all participants” or causal claims from interpretive data.', fix: 'Use precise, appropriately hedged language.' },
      { t: 'Generic limitations and recommendations', d: '“The sample was small.” “More research is needed.”', fix: 'Explain the effect on interpretation and propose specific studies.' }
    ],
    statusLabel: { ok: 'Good', warn: 'Revise', bad: 'Missing', info: 'Note' },
    areaNames: { structure: 'Presentation approach', evidence: 'Evidence', themes: 'Themes', findings: 'Key findings', align: 'Question alignment', integrate: 'Supporting evidence', viz: 'Visualisation', dplan: 'Discussion plan', interp: 'Interpretation', theory: 'Theory', lit: 'Previous studies', unexp: 'Unexpected findings', impl: 'Implications', lim: 'Limitations', future: 'Future research', fdraft: 'Findings draft', ddraft: 'Discussion draft' },
    dm: {
      structNone: { t: 'Structure', bad: 'Choose a findings structure.' },
      structFit: { t: 'Structure and technique', info: (x) => 'Your analytical technique is usually reported as “' + sName(x.a) + '”. Explain your choice if you use another structure.' },
      structOk: { t: 'Structure and technique', ok: 'The structure fits your analytical technique.' },
      pubQuant: { t: 'Publication structure', info: 'Quantitative studies usually separate Results and Discussion; check the journal’s requirements.' },
      structWhy: { t: 'Rationale', warn: 'Explain in a sentence why this structure suits your study.' },
      evFew: { t: 'Evidence', bad: (x) => 'Add at least three items of evidence (currently ' + x.D(x.n) + ').' },
      evOk: { t: 'Evidence', ok: (x) => x.D(x.n) + ' items of evidence recorded.' },
      evNoSrc: { t: 'Source identifiers', warn: (x) => 'Quotations or excerpts without a participant code: ' + x.list.join(', ') + '.' },
      evNoLoc: { t: 'Locations', warn: (x) => 'Scenes or observations without a timestamp: ' + x.list.join(', ') + '.' },
      evStat: { t: 'Statistical results', warn: (x) => 'Statistical items without any value: ' + x.list.join(', ') + '.' },
      evDup: { t: 'Codes', warn: (x) => 'Duplicate evidence codes: ' + x.list.join(', ') + '.' },
      thNone: { t: 'Themes', info: 'No themes yet. If you used thematic or reception analysis, build your themes here.' },
      thNoDef: { t: 'Theme definitions', warn: (x) => 'Themes without a central organising concept: ' + x.list.join(', ') + '.' },
      thTopic: { t: 'Theme names', info: (x) => 'These look like topics rather than themes: ' + x.list.join(', ') + '. A theme states a shared meaning, e.g. “The home as moral anchor” rather than “Family”.' },
      thOk: { t: 'Themes', ok: (x) => x.D(x.n) + ' themes with definitions.' },
      fFew: { t: 'Findings', bad: 'Write at least two key findings.' },
      fOk: { t: 'Findings', ok: (x) => x.D(x.n) + ' findings recorded.' },
      fNoRq: { t: 'Research questions', warn: (x) => 'Findings not linked to a research question: ' + x.list.join(', ') + '.' },
      fStat: { t: 'Statistical findings', warn: (x) => 'Statistical findings without values: ' + x.list.join(', ') + '. Report only results you obtained.' },
      fInterp: { t: 'Findings or interpretation?', info: (x) => 'You chose separate sections, but these statements contain interpretive wording: ' + x.list.join(', ') + '.' },
      fGeneral: { t: 'Generalisation', info: (x) => 'Check wording such as “all” or “everyone” in: ' + x.list.join(', ') + '.' },
      alNoQ: { t: 'Research questions', bad: 'Enter your research questions in Step 1.' },
      alUnanswered: { t: 'Unanswered questions', warn: (x) => 'No findings are linked to ' + x.list.join(', ') + '. Report this honestly or revise the question; do not fabricate findings.' },
      alThin: { t: 'Coverage and evidence', warn: (x) => 'Marked as fully addressed but supported by fewer than two items of evidence: ' + x.list.join(', ') + '.' },
      alNoCov: { t: 'Coverage', bad: (x) => 'Choose the coverage for: ' + x.list.join(', ') + '.' },
      alOrphan: { t: 'Findings without questions', info: (x) => 'Not linked to any current question: ' + x.list.join(', ') + '.' },
      alOk: { t: 'Alignment', ok: 'Every question has linked findings and a coverage judgement.' },
      inThin: { t: 'Evidence per finding', warn: (x) => 'Fewer than two items of evidence for: ' + x.list.join(', ') + '. Link evidence in Step 3 or the Audiovisual matrix.' },
      inOk: { t: 'Evidence per finding', ok: 'Every finding has at least two items of evidence.' },
      inBlock: { t: 'Long quotations', info: (x) => 'Quotations over 40 words should be set as block quotations: ' + x.list.join(', ') + '.' },
      inAvTime: { t: 'Audiovisual references', warn: (x) => 'Scenes without a timestamp: ' + x.list.join(', ') + '.' },
      inAvNone: { t: 'Audiovisual evidence', info: 'Your technique is textual; document scenes in the Audiovisual Findings Matrix.' },
      vzEmpty: { t: 'Visualisation', info: 'No chart data yet. Visuals are optional; use them when they help readers.' },
      vzNum: { t: 'Values', warn: (x) => 'Values that are not numbers: ' + x.list.join(', ') + '.' },
      vzQual: { t: 'Qualitative counts', info: 'Frequencies of qualitative themes show presence, not importance; say so in the caption.' },
      vzTitle: { t: 'Chart title', warn: 'Give the chart a title that states what it shows.' },
      vzOk: { t: 'Visualisation', ok: 'The chart has a title and numerical values.' },
      dpNone: { t: 'Discussion plan', bad: 'Choose at least one finding to discuss.' },
      dpOk: { t: 'Discussion plan', ok: (x) => x.D(x.n) + ' discussion points planned.' },
      dpNoCrit: { t: 'Reasons', warn: (x) => 'Say why these findings deserve discussion: ' + x.list.join(', ') + '.' },
      dpAll: { t: 'Selection', info: 'You plan to discuss every finding; consider prioritising the most significant ones.' },
      ipNone: { t: 'Interpretation', bad: 'Interpret at least one finding.' },
      ipSpec: { t: 'Evidence for interpretations', warn: (x) => 'Interpretations without supporting evidence may read as speculation: ' + x.list.join(', ') + '.' },
      ipNoAlt: { t: 'Alternative interpretations', info: (x) => 'Consider alternative readings for: ' + x.list.join(', ') + '.' },
      ipOver: { t: 'Overclaiming', warn: (x) => 'Strong wording such as “proves” in: ' + x.list.join(', ') + '.' },
      ipOk: { t: 'Interpretation', ok: (x) => x.D(x.n) + ' interpretations with evidence and alternatives.' },
      thyNone: { t: 'Theory', bad: 'Link at least one finding to the framework.' },
      thyNoFw: { t: 'Framework', warn: 'Name the theoretical framework you use to interpret the findings.' },
      thyNoConcept: { t: 'Concepts', warn: (x) => 'Name the theoretical concept for: ' + x.list.join(', ') + '.' },
      thyAllSupport: { t: 'Confirmation only', info: 'Every link “supports” the theory. Check whether some findings extend or complicate it; do not force confirmation.' },
      thyNoEv: { t: 'Evidence', info: (x) => 'Add the evidence behind: ' + x.list.join(', ') + '.' },
      thyOk: { t: 'Theory', ok: (x) => x.D(x.n) + ' theory–findings links.' },
      litNone: { t: 'Previous studies', bad: 'Compare at least one finding with a previous study.' },
      litNoYear: { t: 'Citations', warn: (x) => 'Studies without a year: ' + x.list.join(', ') + '.' },
      litNoRef: { t: 'References', warn: (x) => 'Add the full reference for: ' + x.list.join(', ') + '.' },
      litNoExplain: { t: 'Explaining differences', warn: (x) => 'Explain the disagreement with: ' + x.list.join(', ') + '.' },
      litNoFinding: { t: 'Linked finding', warn: (x) => 'Link these comparisons to a finding: ' + x.list.join(', ') + '.' },
      litNoPrev: { t: 'Previous findings', warn: (x) => 'State what the previous study found: ' + x.list.join(', ') + '.' },
      litFew: { t: 'Breadth', info: 'Discussions usually compare key findings with several studies.' },
      litNovel: { t: 'Novelty claims', info: 'For novel findings, write “among the studies reviewed” rather than “for the first time”.' },
      litOk: { t: 'Previous studies', ok: (x) => x.D(x.n) + ' comparisons with full details.' },
      unNone: { t: 'Unexpected findings', info: 'None recorded. That is acceptable if none arose.' },
      unNoExplain: { t: 'Explanations', warn: (x) => 'Offer possible explanations for: ' + x.list.join(', ') + '.' },
      unNoEv: { t: 'Evidence', warn: (x) => 'Add evidence for: ' + x.list.join(', ') + '.' },
      unOk: { t: 'Unexpected findings', ok: (x) => x.D(x.n) + ' unexpected findings explained.' },
      imNone: { t: 'Implications', bad: 'State at least one implication.' },
      imNoFinding: { t: 'Basis', warn: (x) => 'Link these implications to a finding: ' + x.list.join(', ') + '.' },
      imOver: { t: 'Overclaiming', warn: (x) => 'Strong wording in: ' + x.list.join(', ') + '.' },
      imOneType: { t: 'Range', info: 'All implications are of one type; consider theoretical, methodological or practical ones as well.' },
      imOk: { t: 'Implications', ok: (x) => x.D(x.n) + ' implications linked to findings.' },
      liNone: { t: 'Limitations', bad: 'State at least one limitation.' },
      liAvoid: { t: 'Avoidable errors', warn: (x) => 'Avoidable errors are not limitations; correct them if you can: ' + x.list.join(', ') + '.' },
      liNoEffect: { t: 'Effect on interpretation', info: (x) => 'Explain how these limitations affect interpretation: ' + x.list.join(', ') + '.' },
      liTransfer: { t: 'Transferability', info: 'In qualitative research, discuss transferability to similar contexts rather than statistical generalisability.' },
      liUndermine: { t: 'Tone', info: (x) => 'Wording that may undermine the study unnecessarily: ' + x.list.join(', ') + '.' },
      liOk: { t: 'Limitations', ok: (x) => x.D(x.n) + ' limitations with their effects.' },
      fuNone: { t: 'Future research', bad: 'Recommend at least one direction for future research.' },
      fuGeneric: { t: 'Specificity', warn: (x) => 'Too general: ' + x.list.join(', ') + '. Say what should be studied, how and why.' },
      fuNoBasis: { t: 'Basis', warn: (x) => 'Say which finding, limitation or question these come from: ' + x.list.join(', ') + '.' },
      fuOk: { t: 'Future research', ok: (x) => x.D(x.n) + ' specific, justified directions.' },
      txLong: { t: 'Sentence length', ok: 'No very long sentences.', warn: (x) => x.D(x.n) + ' sentence(s) over 40 words: ' + x.list.join(' | ') },
      txInterp: { t: 'Interpretation in Results', warn: (x) => 'Interpretive wording in a separate Results section: ' + x.list.join(', ') + '.' },
      txLitInResults: { t: 'Literature in Results', info: (x) => x.D(x.n) + ' citation(s) in the findings. In separate sections, comparison with literature belongs in the Discussion.' },
      txQuoteNoSrc: { t: 'Attribution', warn: (x) => 'Quotations not followed by an attribution: ' + x.list.join(' | ') },
      txGeneral: { t: 'Generalisation', info: (x) => 'Check quantifiers: ' + x.list.join(', ') + '.' },
      txNoEffect: { t: 'Effect sizes', info: 'p values are reported without effect sizes; APA 7 recommends reporting both.' },
      txCites: { t: 'Citations', ok: (x) => x.D(x.n) + ' cited works.', warn: (x) => (x.n ? x.D(x.n) + ' cited work(s) only.' : 'No citations.') + ' A discussion compares findings with previous studies.' },
      txHedge: { t: 'Hedging', ok: (x) => x.D(x.n) + ' cautious formulations (may, suggests…).', info: 'No cautious wording found; interpretations usually need appropriate hedging.' },
      txUnsupported: { t: 'Claims about literature', warn: (x) => 'Claims without citations: ' + x.list.join(' | ') },
      txCausal: { t: 'Causal language', info: (x) => 'Causal wording in an interpretive design: ' + x.list.join(', ') + '.' },
      txGeneric: { t: 'Generic phrases', info: (x) => 'Generic phrasing: ' + x.list.join(', ') + '.' },
      txRepeat: { t: 'Repetition of results', warn: (x) => x.D(x.n) + ' sentence(s) repeat the findings draft word for word: ' + x.list.join(' | ') },
      txOver: { t: 'Overclaiming', warn: (x) => 'Overstated wording: ' + x.list.join(', ') + '.' },
      txPara: { t: 'Paragraph length', warn: (x) => x.D(x.n) + ' paragraph(s) over 230 words.' },
      txPlaceholder: { t: 'Placeholders', bad: (x) => 'Unfinished placeholders: ' + x.list.join(', ') + '.' },
      txLang: { t: 'Language', info: 'The text is mostly in the other language of the interface.' },
      fdNone: { t: 'Findings draft', bad: 'No findings draft yet (Step 8).' },
      ddNone: { t: 'Discussion draft', bad: 'No discussion draft yet (Step 17).' }
    },
    lex: {
      longLimit: 40, paraMax: 230,
      interpret: ['suggests', 'suggest', 'indicates that', 'implies', 'this means', 'this shows that', 'reflects', 'may be explained', 'can be explained', 'because', 'due to', 'consistent with', 'in line with', 'contrary to', 'interpreted as', 'meaning that'],
      overgeneral: ['all participants', 'every participant', 'everyone', 'nobody', 'always', 'never', 'all viewers', 'all audiences'],
      overclaim: ['proves', 'proved', 'definitely', 'clearly shows', 'undoubtedly', 'without doubt', 'certainly', 'for the first time', 'conclusively', 'will change'],
      hedge: ['may', 'might', 'could', 'suggests', 'appears', 'seems', 'possibly', 'likely', 'perhaps', 'tend to', 'indicates'],
      claimCues: ['studies show', 'research shows', 'previous studies', 'many studies', 'scholars argue', 'researchers have found', 'the literature', 'it is known'],
      causal: ['causes', 'caused', 'leads to', 'led to', 'results in', 'resulted in', 'effect of', 'impact of', 'determines'],
      generic: ['more research is needed', 'further research is needed', 'further studies', 'future studies should be conducted', 'more studies'],
      generalise: ['generalise', 'generalize', 'generalisable', 'generalizable', 'representative'],
      undermine: ['not reliable', 'unreliable', 'invalid', 'worthless', 'meaningless', 'not valid'],
      resultCue: ['found', 'showed', 'reported', 'participants', 'respondents', 'described', 'mentioned', 'the analysis', 'theme', 'table', 'figure', 'scene', 'was coded', 'were coded', 'emerged', 'mean', 'percent'],
      discussCue: ['implication', 'implications', 'limitation', 'future research', 'contribute', 'contribution', 'theory', 'previous studies', 'in contrast', 'similarly', 'whereas', 'however']
    },
    clKinds: { results: 'Presents results', discussion: 'Interprets / discusses', unclear: 'Unclear' },
    rubric: [
      { id: 'clarity', t: 'Clarity of findings', d: 'Findings are stated clearly and precisely.' },
      { id: 'evidence', t: 'Accuracy of supporting evidence', d: 'Evidence is accurate, attributed and sufficient.' },
      { id: 'organisation', t: 'Logical organisation', d: 'The structure fits the methodology and guides the reader.' },
      { id: 'alignment', t: 'Research question alignment', d: 'Findings answer the questions; gaps are acknowledged.' },
      { id: 'method', t: 'Methodological consistency', d: 'Reporting conventions match the methodological tradition.' },
      { id: 'depth', t: 'Analytical depth', d: 'Interpretations go beyond description and consider alternatives.' },
      { id: 'theory', t: 'Theoretical integration', d: 'Findings are related to the framework without forcing confirmation.' },
      { id: 'literature', t: 'Critical engagement with previous studies', d: 'Comparisons are specific, cited and explained.' },
      { id: 'contradictory', t: 'Explanation of contradictory findings', d: 'Unexpected and contradictory evidence is reported and explained.' },
      { id: 'implications', t: 'Credibility of scholarly implications', d: 'Implications and recommendations follow from the findings.' },
      { id: 'limitations', t: 'Transparency concerning limitations', d: 'Limitations are genuine, explained and balanced.' },
      { id: 'coherence', t: 'Academic coherence and readability', d: 'The text is coherent, concise and well signposted.' },
      { id: 'distinction', t: 'Distinction between findings and discussion', d: 'Presentation and interpretation are placed appropriately for the chosen structure.' },
      { id: 'referencing', t: 'Referencing accuracy', d: 'Citations are complete and consistent with APA 7.' }
    ],
    rubricDesc: {
      clarity: ['Findings vague or buried.', 'Mostly clear; some statements imprecise.', 'Each finding stated clearly and precisely.'],
      evidence: ['Little or unattributed evidence.', 'Evidence present but uneven.', 'Accurate, attributed, sufficient evidence for every finding.'],
      organisation: ['No clear structure.', 'Structure present but not well suited.', 'Structure fits the methodology and is signposted.'],
      alignment: ['Findings unrelated to questions.', 'Some questions addressed.', 'Every question addressed; gaps acknowledged.'],
      method: ['Conventions of another tradition.', 'Partly consistent.', 'Fully consistent with the methodological tradition.'],
      depth: ['Description only.', 'Some interpretation.', 'Interpretations grounded in evidence and alternatives.'],
      theory: ['Theory absent or forced.', 'Theory mentioned.', 'Findings support, extend or complicate the theory explicitly.'],
      literature: ['No comparison.', 'General comparison.', 'Specific, cited and explained comparisons.'],
      contradictory: ['Ignored.', 'Mentioned.', 'Reported and explained transparently.'],
      implications: ['Absent or exaggerated.', 'Generic.', 'Specific and traceable to findings.'],
      limitations: ['Absent or self-undermining.', 'Listed without effects.', 'Genuine, explained and balanced.'],
      coherence: ['Hard to follow.', 'Generally coherent.', 'Coherent, concise and well signposted.'],
      distinction: ['Results and discussion mixed inappropriately.', 'Mostly appropriate.', 'Clear and appropriate for the chosen structure.'],
      referencing: ['Missing or inconsistent.', 'Some errors.', 'Complete and consistent.']
    },
    rubricRec: {
      clarity: 'Rewrite each finding as one clear statement before the evidence (Step 4).', evidence: 'Link at least two attributed items of evidence to every finding (Steps 3 and 6).', organisation: 'Revisit the presentation approach and signpost the order (Steps 2 and 8).',
      alignment: 'Use the alignment matrix; report unanswered questions honestly (Step 5).', method: 'Follow the reporting expectations of your structure (Step 2).', depth: 'Interpret key findings with evidence and alternatives (Step 10).',
      theory: 'Link findings to concepts and state whether they support, extend or complicate the theory (Step 11).', literature: 'Compare key findings with named studies and explain differences (Step 12).', contradictory: 'Report and explain unexpected and contradictory evidence (Step 13).',
      implications: 'Tie every implication to a finding and avoid overclaiming (Step 14).', limitations: 'Explain the effect of each limitation on interpretation (Step 15).', coherence: 'Shorten long sentences and paragraphs; add transitions and signposts.',
      distinction: 'Keep interpretation out of a separate Results section and avoid repeating results in the Discussion.', referencing: 'Complete every citation and reference in APA 7 and check DOIs.'
    },
    levels: [
      { min: 4.5, t: 'Ready for supervisor review', d: 'Findings and discussion are coherent and well supported.' },
      { min: 3.5, t: 'Strong draft — focused revision', d: 'Revise the criteria rated 3 or below.' },
      { min: 2.5, t: 'Developing — strengthen evidence and interpretation', d: 'Work on evidence, alignment and interpretation.' },
      { min: 0, t: 'Early draft — rebuild the core', d: 'Return to Steps 3–5 and 9–12 before rewriting.' }
    ],
    checklist: [
      { id: 'q', t: 'Questions answered', d: 'Every research question is addressed or its gap acknowledged.' },
      { id: 'trace', t: 'Traceable evidence', d: 'Every finding is linked to coded, attributed evidence.' },
      { id: 'anon', t: 'Anonymity', d: 'No real names; participant codes or pseudonyms used consistently.' },
      { id: 'av', t: 'Audiovisual references', d: 'Titles, episodes and timestamps are given for scenes.' },
      { id: 'stats', t: 'Statistics', d: 'Statistics are reported completely, with effect sizes where relevant.' },
      { id: 'visual', t: 'Visuals', d: 'Tables and figures are titled, numbered and referred to in the text.' },
      { id: 'place', t: 'Right place', d: 'Interpretation and literature are placed appropriately for the chosen structure.' },
      { id: 'new', t: 'No new findings', d: 'The discussion and summary introduce no new findings.' },
      { id: 'lit', t: 'Previous studies', d: 'Key findings are compared with named, cited studies.' },
      { id: 'theory', t: 'Theory', d: 'Findings are related to the framework without forcing confirmation.' },
      { id: 'lim', t: 'Limitations', d: 'Genuine limitations with their effects on interpretation.' },
      { id: 'future', t: 'Future research', d: 'Specific recommendations that follow from the study.' }
    ],
    tpl: {
      profile: (st, E) => {
        const s = st.s1, L = []; const add = (k, v) => { if (has(v)) L.push(k + ': ' + T(v)); };
        add('Title', s.title); add('Problem', s.problem); add('Questions', E.questions(st).map((q) => q.code + ' ' + q.text).join(' · ')); add('Framework', s.framework);
        add('Methodology', [pick(approaches, s.approach).t, pick(techniques, s.technique).t, s.design].filter(has).join(' — ')); add('Data sources', s.sources); add('Sampling', s.sampling); add('Context', s.context);
        return L.join('\n');
      },
      plan: (st) => join([st.s2.structure ? 'Findings will be presented as ' + sName(st.s2.structure).toLowerCase() + (st.s2.order ? ', ordered ' + lc(pick(orders, st.s2.order).t) : '') + (st.s2.pub ? ', in ' + (st.s2.pub === 'separate' ? 'separate Results and Discussion sections' : 'a combined Results and Discussion section') : '') + '.' : '', end(st.s2.rationale)]),
      outline: (st, X) => { const P = { high: 0, medium: 1, low: 2, '': 3 }, PL = { high: 'High', medium: 'Medium', low: 'Low' }; return st.mx.dplan.filter((r) => has(r.finding)).slice().sort((a, b) => P[a.priority] - P[b.priority]).map((r, i) => (i + 1) + '. ' + (PL[r.priority] ? '[' + PL[r.priority] + '] ' : '') + X.fName(r.finding) + (has(r.point) ? ' — ' + frag(r.point) : '') + (r.crit.length ? ' (' + r.crit.map((c) => lc(pick(mx.dplan.cols[1].opts, c).t)).join(', ') + ')' : '')).join('\n'); },
      evidence: (e) => {
        const src = T(e.source), lo = T(e.loc), c = T(e.content), at = [src, lo].filter(has).join(', ');
        if (e.type === 'quote' || e.type === 'excerpt') return '“' + frag(c).replace(/^[“"]|[”"]$/g, '') + '”' + (at ? ' (' + at + ').' : '.');
        if (e.type === 'scene' || e.type === 'av') return (src ? 'In ' + src + (lo ? ' (' + lo + ')' : '') + ', ' + lc(c) : end(c)).replace(/([^.!?])$/, '$1.');
        return end(c) + (at && e.type !== 'stat' ? ' (' + at + ')' : '');
      },
      av: (a) => { const where = [T(a.title), T(a.episode)].filter(has).join(', '); return (where ? 'In ' + where + (has(a.time) ? ' (' + T(a.time) + ')' : '') + ', ' + lc(a.observation) : end(a.observation)).replace(/([^.!?])$/, '$1.'); },
      finding: (f, x) => join([has(f.label) ? end(f.label) : '', end(f.statement) + (has(f.stat) ? ' (' + frag(f.stat) + ')' : ''), end(f.pattern), x.evs.join(' '), x.combined ? end(f.interp) : '', x.rq ? 'This finding relates to ' + x.rq + '.' : '']).replace(/\)\s*\.\s*\(/g, '). ('),
      d: {
        opening: (st, X) => {
          if (has(st.s17.opening)) return end(st.s17.opening);
          const P = { high: 0, medium: 1, low: 2, '': 3 }, top = st.mx.dplan.filter((r) => has(r.finding)).slice().sort((a, b) => P[a.priority] - P[b.priority]).slice(0, 3).map((r) => lc(X.fText(r.finding))).filter(has);
          return join([has(st.s1.mainq) ? 'This study asked: “' + frag(st.s1.mainq).replace(/\?$/, '') + '?”' : '', top.length ? 'Its principal findings are that ' + listJoin(top) + '.' : '']);
        },
        interpret: (st, X) => join(st.mx.interp.filter((r) => has(r.finding) && has(r.meaning)).map((r) => join([end('Regarding ' + X.fCode(r.finding) + ', ' + lc(r.meaning)), has(r.evidence) ? end('This reading is supported by ' + lc(r.evidence)) : '', end(r.context), has(r.alt) ? end('An alternative interpretation is that ' + lc(r.alt)) : '', end(r.just)]))),
        questions: (st, X) => join(X.questions.map((q) => { const fs = X.fFor(q.i), a = st.al[q.i] || {}; const base = fs.length ? 'In relation to ' + q.code + ', the findings show that ' + listJoin(fs.map((f) => lc(f.statement || f.label))) + '.' : ''; const cov = a.coverage === 'partial' ? q.code + ' was only partly addressed' + (has(a.note) ? ': ' + lc(a.note) : '') + '.' : a.coverage === 'none' ? q.code + ' could not be answered from the evidence' + (has(a.note) ? ': ' + lc(a.note) : '') + '.' : ''; return join([base, cov]); })),
        literature: (st, X) => join(st.mx.lit.filter((r) => has(r.study)).map((r) => {
          const F = has(r.finding) ? X.fCode(r.finding) : 'This finding', ft = has(r.finding) ? lc(X.fText(r.finding)) : '', s0 = frag(r.study), pv = lc(r.prev);
          const core = { consistent: F + ' is consistent with ' + s0 + (pv ? ', who found that ' + pv : '') + '.', contra: 'In contrast to ' + s0 + (pv ? ', who reported that ' + pv : '') + ', this study found that ' + (ft || 'the pattern differed') + '.', partial: F + ' partly agrees with ' + s0 + (pv ? ', who found that ' + pv : '') + '.', novel: (ft ? 'The finding that ' + ft : F) + ' differs from the patterns reported in the studies reviewed, such as ' + s0 + (pv ? ' (' + pv + ')' : '') + '.', extends: F + ' extends ' + (pv ? 'the finding of ' + s0 + ' that ' + pv : s0) + (ft ? ', showing that ' + ft : '') + '.' }[r.rel] || (s0 + (pv ? ' found that ' + pv : '') + '.');
          return join([core, end(r.explain), end(r.diff)]);
        })),
        theory: (st, X) => { const fw = T(st.s11.framework) || T(st.s1.framework) || 'the theoretical framework'; return join(st.mx.theory.filter((r) => has(r.finding) && has(r.rel)).map((r) => { const F = X.fCode(r.finding), c = has(r.concept) ? ' the concept of ' + frag(r.concept) + ' in' : ''; const v = { support: F + ' supports' + c + ' ' + fw, extend: F + ' extends' + c + ' ' + fw, complicate: F + ' complicates' + c + ' ' + fw, limit: F + ' reveals a limitation of' + c + ' ' + fw, new: F + ' suggests a new relationship within' + c + ' ' + fw }[r.rel]; return join([v + (has(r.assumption) ? ', which assumes that ' + lc(r.assumption) : '') + '.', end(r.implication), end(r.contribution)]); })); },
        unexpected: (st) => join(st.mx.unexp.filter((r) => has(r.desc)).map((r) => join([end('An unexpected finding was that ' + lc(r.desc)), end(r.explain), end(r.handle)]))),
        implications: (st, X) => join(st.mx.impl.filter((r) => has(r.impl)).map((r) => end((has(r.type) ? pick(mx.impl.cols[0].opts, r.type).t + ' implication' + (has(r.finding) ? ' (' + X.fCode(r.finding) + ')' : '') + ': ' : '') + lc(r.impl) + (has(r.who) ? ' (' + frag(r.who) + ')' : '')))),
        limitations: (st) => { const r = st.mx.lim.filter((x) => has(x.desc) && x.avoid !== 'error'); return r.length ? join(['This study has limitations that should inform how its findings are read.'].concat(r.map((x) => join([end(x.desc), end(x.effect), end(x.mitigation)])))) : ''; },
        future: (st) => join(st.mx.future.filter((r) => has(r.rec)).map((r) => join([end(r.rec), has(r.design) ? 'A suitable design would be ' + lc(r.design) + '.' : '']))),
        conclusion: (st) => end(st.s17.conclusion)
      }
    },
    guideTopics: ['Introduction to the platform', 'Academic purpose and intended users', 'The two main modules', 'Overview of the interactive tools', 'Step-by-step instructions', 'Guidance for each input field', 'Examples of appropriate entries', 'Common mistakes', 'Organising research evidence', 'Writing findings', 'Interpreting and discussing findings', 'Theory–findings integration', 'Comparing findings with literature', 'Reading the evaluation results', 'Saving, printing and exporting', 'Frequently asked questions', 'Troubleshooting', 'Academic integrity and research ethics'],
    examples: [
      { area: 'Saudi cinema and cultural identity', approach: 'Semiotic analysis', title: 'The family home as moral anchor', finding: 'In both series, the family home is framed as the moral centre against which the city is measured.', evidence: 'Courtyard dinner scene (Series A, S1E3, 00:12:31): warm practical light, eye-level framing; city scenes in cold, fragmented compositions.', discussion: 'Extends representation theory by showing domestic space used to define the city by contrast; compared with studies of national symbols in Gulf drama.', why: 'Each claim is traceable to a timestamped scene, and the discussion says how the finding extends the framework rather than merely confirming it.' },
      { area: 'Turkish television drama reception', approach: 'Focus groups, thematic analysis', title: 'Negotiating romance at a distance', finding: 'Young women enjoyed romantic storylines while distancing themselves from their values (“it is their world, not ours”).', evidence: 'Two extracts from different groups with participant codes; a negative case from a participant who rejected the storylines.', discussion: 'Interpreted through encoding/decoding as negotiated reading; compared with previous reception studies of Turkish serials in the region.', why: 'The negative case is reported, and the comparison names specific studies and explains differences in sample and period.' },
      { area: 'Feminist film criticism', approach: 'Textual analysis', title: 'Narrative closure and female agency', finding: 'The protagonist’s independence is undercut in the final act through framing that returns her to the domestic sphere.', evidence: 'Shot descriptions of the last three scenes with timestamps; comparison with the opening framing.', discussion: 'Complicates readings of the film as straightforwardly progressive; alternative reading of the ending as ironic is considered.', why: 'Alternative interpretations are weighed, and formal evidence supports each reading.' },
      { area: 'Semiotic film analysis', approach: 'Semiotic analysis', title: 'Colour and status in a historical drama', finding: 'Costume colour signals proximity to power: gold for rulers, muted earth tones for those excluded.', evidence: 'Audiovisual matrix of 15 scenes coded by costume colour and character status.', discussion: 'Connotation read through Barthes’ concept of myth; limitation: reading is the analyst’s, not audiences’.', why: 'Denotation is described before connotation, and the limitation is stated with its effect on interpretation.' },
      { area: 'Streaming platform audiences', approach: 'Survey', title: 'Motives for watching imported drama', finding: 'Escapism predicted weekly viewing time more strongly than social motives.', evidence: 'Regression table with standardised coefficients, confidence intervals and R²; descriptive table of motives.', discussion: 'Compared with uses and gratifications studies; correlation not interpreted as causation; implications for platform recommendation design.', why: 'Complete statistical reporting, with interpretation kept to what the design allows.' },
      { area: 'Audiovisual storytelling', approach: 'Narrative analysis', title: 'Season arcs and episodic closure', finding: 'Crime series combine season-long arcs with episodic resolution to sustain both binge and weekly viewing.', evidence: 'Segmentation table of three series; examples with episode and timestamp.', discussion: 'Extends narrative theory on seriality to platform release patterns; future research on audience pacing suggested.', why: 'Future research grows directly out of the finding and names a design.' },
      { area: 'Creative and media industries', approach: 'Mixed methods', title: 'Co-production and local authenticity', finding: 'Survey ratings of authenticity were highest for co-productions with local writers, and interviews explain why.', evidence: 'Joint display setting survey means beside interview themes, with the type of fit for each row.', discussion: 'Meta-inference about creative control; discordance on casting reported and explained.', why: 'The joint display makes integration explicit, including where strands disagree.' }
    ],
    published: [
      { area: 'Turkish television drama reception', ref: 'Berg, M., Alardawi, M., & Al Obeidli, N. (2025). Cultural skimming, authenticity, and streaming preferences: Turkish serials (dizi) among young audiences in Qatar, Saudi Arabia, and the UAE. Critical Studies in Television. Advance online publication. https://doi.org/10.1177/17496020251404332', lesson: 'Focus-group study. Task: note how each theme is introduced, how extracts are attributed and where findings are linked to earlier studies.' },
      { area: 'Turkish television drama reception', ref: 'Alardawi, M. (2025). Saudi women and Turkish dramas: Identity and media influence. World Journal of Social Science, 12(1), 12. https://doi.org/10.5430/wjss.v12n1p12', lesson: 'Task: identify how the findings section moves from themes to the framework developed in the discussion.' },
      { area: 'Streaming platform audiences', ref: 'Alardawi, M., & Brereton, P. (2025). “Squid Game”: Pleasure and consumption of Korean drama by young Saudi audiences. Mediatization Studies, 8, 69–89. https://doi.org/10.17951/ms.2024.8.69-89', lesson: 'Mixed-methods study. Task: find where the quantitative and qualitative strands are reported and where they are integrated.' },
      { area: 'Streaming platform audiences', ref: 'Alardawi, M. (2026). Exposure to AI-themed films and perceptions of artificial intelligence: A survey of Saudi young adults in Saudi Arabia. Online Media and Global Communication. Advance online publication. https://doi.org/10.1515/omgc-2025-0083', lesson: 'Survey testing hypotheses derived from cultivation theory. Task: check how each hypothesis is reported and then discussed.' },
      { area: 'Streaming platform audiences', ref: 'Alardawi, M., Daghistani, M., Almonaie, S., Khaled, A., & Zahra, M. (2024). Saudi viewers watching foreign medical dramas: A uses and gratification approach. Global Journal of Health Science, 16(10), 23. https://doi.org/10.5539/gjhs.v16n10p23', lesson: 'Task: list the tables and figures and note how the text refers to them.' },
      { area: 'Saudi cinema and cultural identity', ref: 'Alardawi, M. M., Saqah, F. A., & Zakari, H. M. (2023). The representation of women in Saudi film: The case of Amra and the Second Marriage. Asian Social Science, 19(6), 123. https://doi.org/10.5539/ass.v19n6p123', lesson: 'Textual analysis of a film. Task: identify how scenes are documented as evidence and how interpretation is grounded in them.' },
      { area: 'Creative and media industries', ref: 'Alardawi, M. (2024). Exploring challenges and opportunities for Saudi podcasters: A qualitative study. Management and Marketing Journal, 22(2), 164–178. https://doi.org/10.52846/MNMK.22.2.02', lesson: 'Interview study. Task: note how participants are anonymised and how challenges and opportunities are organised.' },
      { area: 'Saudi cinema and cultural identity', ref: 'Alardawi, M. M. (2025). A historical analysis of the genesis of the television in Saudi Arabia. Asian Social Science, 21(2), 10. https://doi.org/10.5539/ass.v21n2p10', lesson: 'Historical study. Task: see how documentary evidence is presented chronologically.' },
      { area: 'Creative and media industries', ref: 'Alardawi, M., & Brereton, P. (2024). Arabic script television formats between adaptation and cultural identity: A case study of The Killing. International Journal of Psychological Studies, 16(4), 1. https://doi.org/10.5539/ijps.v16n4p1', lesson: 'Case study. Task: identify where findings are compared with the original format.' },
      { area: 'Audiovisual storytelling', ref: 'Żerebecki, B. G., Opree, S. J., Hofhuis, J., & Janssen, S. (2024). Successful minority representations on TV count: A quantitative content analysis approach. Journal of Homosexuality, 71(7), 1703–1726. https://doi.org/10.1080/00918369.2023.2191287', lesson: 'Quantitative content analysis of television. Task: examine how coding results and statistics are reported.' },
      { area: 'Streaming platform audiences', ref: 'Bengesser, C., Esser, A., & Steemers, J. (2022). Researching transnational audiences in the streaming era: Designing, piloting and refining a mixed methods approach. Participations, 19(1), 4–24. https://www.participations.org/19-01-02-bengesser.pdf', lesson: 'Methodological article on mixed-methods audience research. Task: list the integration steps and how they shape reporting.' },
      { area: 'Creative and media industries', ref: 'Merrington, P., Hanchard, M., Wessels, B., Pidd, M., Rogers, K., Forrest, D., Higson, A., Smits, R., Townsend, N., & Yates, S. (2019). Using mixed-methods, a data model and a computational ontology in film audience research. Cultural Trends, 28(2–3), 118–131. https://doi.org/10.1080/09548963.2019.1617934', lesson: 'Film audience research. Task: note how different kinds of data are brought together.' }
    ],
    ui: {
      next: 'Next step', finish: 'Go to the final report', stepOf: (a, b) => 'Step ' + a + ' of ' + b,
      savedAt: (t) => 'Saved on this device · ' + t, notSaved: 'Not saved yet',
      required: 'This field is required.', tooShort: (n) => 'Please write at least ' + n + ' words.', chooseOne: 'Please choose one option.',
      fixErrors: 'Please complete the highlighted fields before continuing.', needRows: (n, t) => 'Add at least ' + n + ' complete row(s) to the ' + t + '.', needCoverage: 'Choose the coverage for every research question.', needDraft: 'Build or write the draft first.', needFindings: 'Write findings in Step 4 first.',
      example: 'Example', weak: 'Weaker', better: 'Stronger', tip: 'Tip:', fix: 'Fix:', whenUse: 'When to use:',
      copy: 'Copy', copied: 'Copied.', copyFail: 'Copy failed; select the text and copy it manually.',
      fitsTechnique: 'Fits your technique', recommend: (t, s) => 'For ' + t + ', findings are usually reported as “' + s + '”. You may choose another structure if you explain why.', recommendNone: 'Choose your analytical technique in Step 1 to see a suggested structure.',
      expectTitle: (t) => 'Reporting expectations: ' + t, expectNone: 'Choose a structure to see its reporting expectations.', pubNone: 'Choose a publication structure in Step 2.',
      distTitle: 'Raw data, codes, categories, themes, findings, interpretations and conclusions', themesHint: 'Optional for quantitative studies. Themes can be shown as a thematic map in Step 7.',
      avHint: 'Use for film and television textual, semiotic, narrative or feminist analysis.', previewTitle: 'Evidence linked to each finding', evN: (n) => n + ' item(s)', linkEvidence: 'No evidence linked yet. Link evidence in Step 3 or in the Audiovisual matrix.',
      rows: (n) => n + ' row(s)', rowN: (n) => 'Row ' + n, noRows: 'No rows yet.', csv: 'Export CSV', json: 'Export JSON', importRows: 'Import CSV or JSON', imported: (n) => n + ' row(s) imported.', importRowsFail: 'The file could not be read. Use a file exported from this tool or a CSV whose first row has the column names.',
      moveUp: 'Move up', moveDown: 'Move down', del: 'Delete', confirmDel: 'Click again to delete',
      alNoQ: 'Enter your research questions in Step 1.', alFindings: 'Findings', alNone: 'none linked', alEvidence: 'Evidence items', alObj: 'Related objective', alCoverage: 'Coverage', alNote: 'Note (gap or explanation)',
      fmCols: ['Research question', 'Findings', 'Basis', 'Evidence items', 'Coverage'],
      vzMode: 'Type of visualisation', vzType: 'Chart type', vzChart: 'Chart', vzNoData: 'Enter labels and values to draw the chart.', vzQual: 'These are counts of qualitative themes or codes', vzQualHint: 'Adds a caption reminding readers that frequency is not importance.', vzQualNote: 'Frequencies show how often a theme occurred, not its analytical importance.',
      vzLabel: 'Label', vzValue: 'Value', vzAdd: 'Add row', vzFromThemes: 'Use my themes (prevalence notes)', vzFromThemesDone: 'Rows filled from your themes; check the values.', vzSvg: 'Download (SVG)',
      vzThemes: 'Thematic map', vzNoThemes: 'Add themes in the Qualitative Themes Builder (Step 4).', vzCenter: 'Main research question', vzThemesHint: 'Up to four subthemes per theme are shown. Download the SVG to edit it in Word or a graphics program.',
      vzCalc: 'Percentage = value ÷ total × 100, rounded to one decimal place.', vzCols: ['Label', 'Value', 'Percentage of total'], vzTotal: 'Total',
      fTplTitle: 'Writing templates for your structure', fDraftTitle: 'Findings section draft', dDraftTitle: 'Complete discussion draft', rebuild: 'Rebuild from my entries', rebuildConfirm: 'Click again to replace your edits', rebuilt: 'Draft rebuilt.',
      draftAutoNote: 'Updates automatically from your entries.', draftEditedNote: 'You edited the draft directly, so it no longer updates automatically.', refineTitle: 'Refinement checks',
      composerHint: 'Switch parts on or off, reorder and edit them. Each part becomes one paragraph.', resetSection: 'Reset', sectionReset: 'Part refilled from your steps.', sectionEmpty: 'This part is empty — complete the related step or write here.', words: (n) => n + ' words',
      checksTitle: 'Automated checks', checklistTitle: 'Findings and discussion checklist', checklistDone: (a, b) => a + ' of ' + b + ' done',
      applyScores: 'Use the suggested scores', scoresApplied: 'Suggested scores applied; adjust them as you see fit.', suggestedScore: 'Suggested score:', overall: 'Overall', outOf5: '/ 5', recommendations: 'Revision recommendations', noRecs: 'No criterion is rated 3 or below.', notRated: 'Not rated yet.',
      evalDisclaimer: 'This evaluation supports scholarly self-review. It does not replace expert scholarly judgement, academic supervision or formal peer review.', rubricCols: ['Criterion', '1–2 · Needs work', '3 · Developing', '4–5 · Strong'],
      finalFromDraft: 'Copy the Step 8 and Step 17 drafts here', replaceConfirm: 'Click again to replace', finalCopied: 'Drafts copied to the final versions.', copyFindings: 'Copy findings', copyDiscussion: 'Copy discussion',
      reportRegen: 'Regenerate report', regenConfirm: 'Click again to discard report edits', reportRebuilt: 'Report regenerated.', reportCopy: 'Copy report', print: 'Print / Save as PDF', doc: 'Download Word (.doc)', txt: 'Download text (.txt)', csvAll: 'Export all matrices (CSV)',
      fileReport: 'findings-discussion-report', fileData: 'findings-discussion-project.json',
      files: { evidence: 'evidence-matrix', themes: 'themes', findings: 'key-findings', av: 'audiovisual-matrix', joint: 'joint-display', dplan: 'discussion-plan', interp: 'interpretations', theory: 'theory-findings-matrix', lit: 'literature-comparison', unexp: 'unexpected-findings', impl: 'implications', lim: 'limitations', future: 'future-research', chart: 'findings-chart', themeMap: 'thematic-map', all: 'all-matrices' },
      report: { title: 'Research Findings and Discussion Report', generated: (d) => 'Generated on ' + d + ' · Research Findings: Writing, Presentation, and Discussion in Film and Television Studies', context: 'Research title and profile', questions: 'Research questions', structure: 'Findings presentation plan', findings: 'Key findings', themes: 'Themes', evidence: 'Supporting evidence', av: 'Audiovisual evidence', alignment: 'Research question–findings alignment', viz: 'Tables and visualisations', joint: 'Joint display', fdraft: 'Findings draft', dplan: 'Discussion outline', interp: 'Interpretation of findings', theory: 'Theoretical interpretation', lit: 'Comparison with previous studies', unexp: 'Unexpected or contradictory findings', impl: 'Research implications', lim: 'Research limitations', future: 'Future research recommendations', ddraft: 'Complete discussion draft', evaluation: 'Quality evaluation results', self: 'Researcher’s reflection', recs: 'Suggested improvements', noRecs: 'No revision recommendations.', finalF: 'Final findings section', finalD: 'Final discussion section', refs: 'Research references', noRefs: 'No references entered.', notes: 'Notes', footer: 'Academic Tool Developed by Dr. Merfat Alardawi. The report contains the researcher’s entries and rule-based feedback; verify all evidence and citations before submission.' },
      empty: '—',
      deleteAll: 'Click again to delete everything', deleted: 'All saved data was deleted from this browser.', projectImported: 'Project imported.', projectImportFail: 'This file is not a project exported from this tool.',
      clSummary: (r, d, u) => 'Results: ' + r + ' · Discussion: ' + d + ' · Unclear: ' + u,
      exAllAreas: 'All', exHyp: 'Illustrative example', exPub: 'Verified published study', whyWorks: 'Why it works:', lesson: 'Learning task:', exFinding: 'Finding', exEvidence: 'Evidence', exDiscussion: 'Discussion',
      glossCols: ['Term', 'Equivalent', 'Definition', 'Arabic definition'], distCols: ['Concept', 'What it is', 'Film and television example'], tenseCols: ['Part of the text', 'Usual tense', 'Example'],
      refGroups: { reporting: 'Reporting findings and writing discussions', film: 'Film, television and audience research methods', examples: 'Film and television studies used in the examples', tutorials: 'Video tutorials in the attached reference file' },
      refTypes: { book: 'Book', article: 'Peer-reviewed article', chapter: 'Book chapter', example: 'Published example', video: 'Video tutorial', guideline: 'Reporting standard' },
      guideStep: (n, t) => 'Step ' + n + ' — ' + t
    }
  };
})();
