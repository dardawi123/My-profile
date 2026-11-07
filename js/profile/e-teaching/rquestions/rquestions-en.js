/* =========================================================
   Research Question Formulation and Refinement — English language file
   Interface text, guidance data, rule lexicon and sentence templates.
   Academic tool developed by Dr. Merfat Alardawi
   ========================================================= */
(function () {
  'use strict';

  /* Placeholder helper: show the researcher's text, or a bracketed prompt. */
  const v = (x, p) => (x && String(x).trim()) ? String(x).trim().replace(/[.?!\s]+$/, '') : '[' + p + ']';
  const sent = (x) => { const t = (x || '').trim(); if (!t) return ''; const s = t.charAt(0).toUpperCase() + t.slice(1); return /[.!?]$/.test(s) ? s : s + '.'; };
  const timeTail = (s1) => (s1.timeframe && s1.timeframe.trim()) ? ', ' + s1.timeframe.trim().replace(/[.?]+$/, '') : '';

  window.RC = {
    lang: 'en',
    numerals: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],

    ui: {
      saved: 'Saved on this device',
      notSaved: 'Not saved yet',
      savedAt: (t) => 'Saved on this device · ' + t,
      restored: 'Your saved progress has been restored.',
      deleteData: 'Delete my saved data',
      deleteConfirm: 'Click again to confirm deletion',
      deleted: 'All saved data has been deleted from this device.',
      exportData: 'Export my data (JSON)',
      importData: 'Import data',
      imported: 'Data imported successfully.',
      importFail: 'This file could not be read. Please choose a file exported from this tool.',
      next: 'Next →', prev: '← Previous', finish: 'View report',
      stepOf: (a, b) => 'Step ' + a + ' of ' + b,
      fixErrors: 'Please complete the highlighted fields before continuing.',
      required: 'This field is required.',
      tooShort: (n) => 'Please write at least ' + n + ' words.',
      chooseOne: 'Please choose one option.',
      needQuestion: 'Please write a question (ending with a question mark is recommended).',
      needSub: 'Add at least one supporting question.',
      copied: 'Copied to clipboard.',
      copyFail: 'Copying failed; please select the text and copy it manually.',
      useRevision: 'Use this revision',
      revisionUsed: 'The suggested revision was copied into your refined question. Edit it as needed.',
      applyScores: 'Apply suggested scores',
      scoresApplied: 'Suggested scores applied. Adjust them to reflect your own judgement.',
      notRated: 'Not rated',
      add: 'Add', remove: 'Remove', addOwn: 'Add an empty supporting question',
      maxSubs: 'You can add up to six supporting questions.',
      regenerate: 'Regenerate report from my answers',
      regenConfirm: 'Click again to replace your edits',
      regenerated: 'The report has been regenerated from your latest answers.',
      copyReport: 'Copy report', printReport: 'Print / Save as PDF', docReport: 'Download Word (.doc)', txtReport: 'Download text (.txt)',
      reportEdited: 'Your edits to the report are saved automatically.',
      loadFromBuilder: 'Load from the builder',
      loaded: 'Loaded from the builder.',
      nothingToLoad: 'The builder has no question yet.',
      empty: 'Not specified yet',
      fileReport: 'research-question-report',
      detected: 'Detected in your question', notDetected: 'Not detected', manual: 'Check manually',
      status: { ok: 'Good', warn: 'Revise', bad: 'Problem', info: 'Note' },
      yes: 'Yes', no: 'No',
      all: 'All',
      noResults: 'No matching terms.',
      outOf5: '/ 5',
      overall: 'Overall',
      recommendations: 'Recommendations for improvement',
      noRecs: 'All criteria were rated 4 or 5. Discuss the question with your supervisor to confirm.',
      levels: [
        { min: 4.5, t: 'Strong question', d: 'The question appears clear, focused and well aligned. Seek supervisor feedback before finalising it.' },
        { min: 3.5, t: 'Good, with refinements needed', d: 'The question is workable; address the criteria rated 3 or lower.' },
        { min: 2.5, t: 'Developing', d: 'Return to the refinement step and revise the weaker dimensions.' },
        { min: 0, t: 'Early draft', d: 'Revisit the research problem and purpose, then redraft the question.' }
      ],
      cmp: { initial: 'Initial question', refined: 'Refined question', criterion: 'Criterion', changes: 'What changed and why', resolved: 'Resolved', introduced: 'New issue', remaining: 'Still present', none: 'Write two versions to see the comparison.', words: 'Length (words)', added: 'Key terms added', removed: 'Key terms removed' },
      cmpRows: [
        { id: 'open', t: 'Open-ended (not yes/no)' },
        { id: 'single', t: 'Single focus (not double-barrelled)' },
        { id: 'precise', t: 'Precise terms (no vague words)' },
        { id: 'neutral', t: 'Neutral wording (no leading assumptions)' },
        { id: 'context', t: 'States the context' },
        { id: 'time', t: 'States a time frame' },
        { id: 'method', t: 'Fits the proposed approach' }
      ],
      matrix: {
        problem: 'Research problem', aim: 'Research aim', main: 'Main research question', supporting: 'Supporting questions', theory: 'Theoretical framework', method: 'Methodological approach',
        links: 'Alignment checks', refresh: 'The matrix updates automatically from the builder.'
      },
      links: {
        problemAim: 'Problem ↔ Aim', aimMain: 'Aim ↔ Main question', problemMain: 'Problem ↔ Main question', mainSupporting: 'Main ↔ Supporting questions', mainTheory: 'Main question ↔ Theory', mainMethod: 'Main question ↔ Method'
      },
      linkMsg: {
        missing: 'One or both elements are not yet specified.',
        problemAim: ['The aim shares key concepts with the problem.', 'The aim does not repeat any key concept from the problem; make sure it responds directly to the problem.'],
        aimMain: ['The main question reflects the aim and its orientation.', 'The question does not reflect the aim’s orientation or key concepts; align the verb and the focus.'],
        problemMain: ['The question addresses the phenomenon named in the problem.', 'The question shares no key concepts with the problem; it may be drifting from it.'],
        mainSupporting: (a, b) => a + ' of ' + b + ' supporting questions are connected to the main question.',
        mainTheory: ['The question uses concepts from the stated framework.', 'A framework is stated, but the question does not use its concepts (optional, but it strengthens coherence).', 'No framework is specified. In qualitative work this may be intentional; otherwise, state the lens you will use.'],
        mainMethod: ['The question’s wording fits the proposed approach.', 'The wording does not fit the proposed approach (for example, causal or measurement language in a qualitative study).']
      },
      refGroups: { attached: 'I. Sources from the attached reference file', recent: 'II. Methodological literature, 2020–2026', foundational: 'III. Foundational methodological literature (before 2020)', film: 'IV. Film and television studies', arabic: 'V. Arabic sources' },
      refTypes: { attached: 'Attached file', journal: 'Peer-reviewed journal', book: 'Book', arabic: 'Arabic peer-reviewed (ASJP)', video: 'Video transcript' },
      pending: 'Details to be completed',
      report: {
        title: 'Research Question Report',
        generated: (d) => 'Generated on ' + d + ' with the Research Question Formulation and Refinement tool (Dr. Merfat Alardawi). Educational self-assessment — not a substitute for supervision.',
        topic: '1. Research topic', problem: '2. Research problem', aim: '3. Research aim and orientation', theory: '4. Theoretical perspective', method: '5. Research methodology',
        initial: '6. Initial research question', refined: '7. Refined main research question', mixedSet: 'Mixed methods question set', supporting: '8. Supporting research questions', evaluation: '9. Evaluation results (self-assessment)', recs: '10. Recommendations for further refinement',
        subfield: 'Subfield', context: 'Context', timeframe: 'Time frame', source: 'Data source', approach: 'Approach', orientation: 'Orientation',
        quant: 'Quantitative question', qual: 'Qualitative question', integ: 'Integration question',
        noRecs: 'No outstanding recommendations were generated. Review the question with your supervisor.'
      },
      subRefs: { connected: 'Connected to main question', notConnected: 'Weak link to main question', distinct: 'Distinct', repeat: 'Overlaps another question', method: 'Fits approach', notMethod: 'Check fit with approach', open: 'Open-ended', closed: 'Yes/no wording' }
    },

    steps: ['Topic', 'Problem', 'Purpose', 'Initial question', 'Refinement', 'Evaluation', 'Supporting questions', 'Final report'],

    subfields: [
      { id: 'film', t: 'Film and cinema studies' },
      { id: 'tv', t: 'Television studies' },
      { id: 'drama', t: 'Drama and audiovisual narrative' },
      { id: 'criticism', t: 'Film and television criticism' },
      { id: 'audience', t: 'Audience and reception studies' },
      { id: 'representation', t: 'Cultural representation and identity' },
      { id: 'feminist', t: 'Feminist film and television studies' },
      { id: 'semiotics', t: 'Semiotics and narrative analysis' },
      { id: 'streaming', t: 'Streaming platforms and digital media' },
      { id: 'production', t: 'Production and creative industries' }
    ],
    sources: [
      { id: 'texts', t: 'Audiovisual material (films, series, episodes)' },
      { id: 'people', t: 'People (audiences, practitioners)' },
      { id: 'both', t: 'Both texts and people' }
    ],
    approaches: [
      { id: 'qual', t: 'Qualitative' },
      { id: 'mixed', t: 'Mixed methods' },
      { id: 'quant', t: 'Quantitative' }
    ],

    orientations: [
      { id: 'exploratory', t: 'Exploratory', verb: 'explore',
        d: 'For new or little-studied phenomena, where the aim is to discover what is happening and how.',
        effect: 'Wording stays open and broad enough for unexpected themes; avoid predicting outcomes.',
        stems: ['How do … experience …?', 'What practices … emerge in …?', 'How is … constructed in …?'],
        ex: 'How do Saudi short-film makers experience the shift to festival-funded production?' },
      { id: 'descriptive', t: 'Descriptive', verb: 'describe',
        d: 'For documenting the characteristics, patterns or forms of a phenomenon in detail.',
        effect: 'Wording names the features to be described and sets clear boundaries of corpus and period.',
        stems: ['What features characterize … in …?', 'How is … portrayed in …?', 'What patterns of … appear in …?'],
        ex: 'What narrative features characterize Saudi comedy series broadcast during Ramadan 2023–2025?' },
      { id: 'interpretive', t: 'Interpretive', verb: 'interpret',
        d: 'For understanding meanings, readings and lived experiences from participants’ or texts’ perspectives.',
        effect: 'Wording centres on meaning, interpretation or experience, and is often linked to a theoretical lens.',
        stems: ['What meanings do … attribute to …?', 'How do audiences interpret …?', 'How do viewers make sense of …?'],
        ex: 'What meanings do young Saudi women attribute to female friendship in streaming dramas?' },
      { id: 'comparative', t: 'Comparative', verb: 'compare',
        d: 'For examining similarities and differences between texts, groups, periods or contexts.',
        effect: 'Wording names both (or all) units of comparison and the dimension being compared.',
        stems: ['How does … differ between … and …?', 'In what ways do … and … represent … differently?'],
        ex: 'How does the representation of the city differ between Saudi and Egyptian drama series of the 2020s?' },
      { id: 'explanatory', t: 'Explanatory', verb: 'explain',
        d: 'For identifying the processes or factors that account for a phenomenon.',
        effect: 'Wording asks how or why something occurs; in qualitative work, focus on processes rather than measured causes.',
        stems: ['What factors shape …?', 'How do … contribute to …?', 'Why do … in …?'],
        ex: 'What production factors shape the depiction of heritage in Saudi historical drama?' },
      { id: 'evaluative', t: 'Evaluative', verb: 'evaluate',
        d: 'For judging the quality, effectiveness or success of a work, policy or practice against stated criteria.',
        effect: 'Wording names the object, the criteria and the perspective from which it is evaluated.',
        stems: ['How effectively does … achieve …?', 'How do … assess the effectiveness of …?'],
        ex: 'How do film-studies students assess the effectiveness of AI-assisted storyboarding in their projects?' }
    ],

    stemsQual: [
      'How do audiences interpret …?',
      'In what ways is identity represented in …?',
      'How do filmmakers construct …?',
      'What meanings do viewers attribute to …?',
      'How do specific narrative or visual techniques contribute to …?',
      'How do … negotiate … in …?'
    ],
    stemsMixed: {
      quant: ['To what extent is … associated with … among …?', 'What is the prevalence of … in …?'],
      qual: ['How do … describe their experience of …?', 'What meanings do … attribute to …?'],
      integ: ['How do the qualitative findings help explain the quantitative results about …?', 'To what extent do the interview themes confirm or challenge the survey patterns of …?']
    },

    rubric: [
      { id: 'clarity', t: 'Clarity and precision', d: 'Unambiguous wording; key concepts are defined or clearly understood.' },
      { id: 'focus', t: 'Focus and specificity', d: 'One central issue, with a defined population or material, context and scope.' },
      { id: 'relevance', t: 'Relevance to the research problem', d: 'Answering the question would address the stated problem and gap.' },
      { id: 'aim', t: 'Alignment with the research aim', d: 'The question reflects the aim and its orientation (e.g., exploratory, comparative).' },
      { id: 'theory', t: 'Theoretical coherence', d: 'The question is consistent with, and informed by, the chosen framework or concepts.' },
      { id: 'method', t: 'Methodological appropriateness', d: 'The question can be answered with the proposed qualitative or mixed methods design.' },
      { id: 'feasibility', t: 'Feasibility', d: 'Access, time, skills and resources are sufficient to answer it.' },
      { id: 'significance', t: 'Potential academic significance', d: 'An answer would add new knowledge to film and television studies.' }
    ],
    rubricRec: {
      clarity: 'Replace vague or evaluative terms with precise concepts, and keep one question per sentence.',
      focus: 'Name the specific works or participants, the setting and, if useful, the time frame.',
      relevance: 'Reuse the key concept of your problem in the question so that the answer addresses the gap directly.',
      aim: 'Match the question’s verb to your orientation (e.g., “compare” → “how does … differ”).',
      theory: 'Show how your framework informs the question, for example by using its central concept.',
      method: 'For qualitative work, prefer “how/what” wording about meanings or processes; for mixed methods, add quantitative, qualitative and integration questions.',
      feasibility: 'Narrow the corpus or population, confirm access to material or participants, and check your timeline.',
      significance: 'State explicitly what is new: the context, the corpus, the population or the theoretical angle.'
    },

    checklist: [
      { id: 'broad', t: 'Too broad', d: 'Covers a whole medium, region or era without limits (e.g., “Arab cinema”).', detect: 'tooShort' },
      { id: 'vague', t: 'Ambiguous concepts', d: 'Uses words such as “media”, “society”, “role” or “impact” without defining them.', detect: 'vague' },
      { id: 'double', t: 'Double-barrelled', d: 'Asks two things at once (“how … and why …”).', detect: 'double' },
      { id: 'closed', t: 'Yes/no question', d: 'Can be answered with yes or no, so it does not require analysis.', detect: 'closed' },
      { id: 'leading', t: 'Leading assumption', d: 'Presupposes the answer (“How do films harm …?”) or uses value-laden words.', detect: 'leading' },
      { id: 'opinion', t: 'Opinion-based', d: 'Asks which is “best” or what “should” be, inviting opinion rather than evidence.', detect: 'opinion' },
      { id: 'method', t: 'Method mismatch', d: 'Measurement or causal wording in a qualitative study, or vice versa.', detect: 'methodMismatch' },
      { id: 'context', t: 'No context or boundaries', d: 'Does not say where, with whom, or on which material the study takes place.', detect: 'noContext' },
      { id: 'disconnected', t: 'Disconnected from the problem', d: 'Does not use the key concept of the research problem.', detect: 'notConnected' },
      { id: 'search', t: 'A search, not a research question', d: 'Can be answered by looking up one fact (e.g., “When was the first Saudi cinema opened?”).', detect: null },
      { id: 'unanswerable', t: 'Unanswerable or speculative', d: 'Asks about the future or about intentions that cannot be studied with available data.', detect: null },
      { id: 'unfeasible', t: 'Not feasible', d: 'Requires access, time, language skills or funding you do not have.', detect: null }
    ],

    examples: [
      { sub: 'representation', basis: '', title: 'Cultural identity in Saudi drama',
        weak: 'How does Saudi drama show identity?',
        better: 'How is national and generational identity constructed in Saudi drama series released on streaming platforms between 2019 and 2025?',
        why: 'Specifies which identity, which corpus, which platform and which period; the verb “constructed” invites textual analysis rather than a list of examples.',
        method: 'Qualitative textual and semiotic analysis of a purposive sample of episodes.' },
      { sub: 'audience', basis: 'Inspired by research on Turkish drama audiences in the Gulf (Berg, 2017); constructed for teaching.', title: 'Reception of Turkish television series',
        weak: 'Do Saudi viewers like Turkish series?',
        better: 'How do young Saudi women interpret the representation of family relationships in dubbed Turkish drama series?',
        why: 'Replaces a yes/no question about preference with an open question about interpretation; defines the population and a single dimension.',
        method: 'Semi-structured interviews or focus groups with reflexive thematic analysis.' },
      { sub: 'feminist', basis: 'Inspired by feminist content analysis of women’s careers in film (Hammer, 2010); constructed for teaching.', title: 'Feminist film analysis',
        weak: 'Are women portrayed negatively in films?',
        better: 'How do Saudi feature films released between 2018 and 2025 construct the professional ambitions of their female protagonists?',
        why: 'Removes the leading judgement “negatively” and the yes/no form; names the corpus and the aspect of representation; the feminist lens is stated in the method.',
        method: 'Feminist critical textual analysis, possibly combined with qualitative content analysis.' },
      { sub: 'semiotics', basis: 'Inspired by semiotic film criticism (Rutsyamsun & Sakinah, 2023); constructed for teaching.', title: 'Semiotic film criticism',
        weak: 'What is the meaning of the film?',
        better: 'How do recurring visual signs in [film title] construct a critique of [specific social institution], according to Barthes’s orders of signification?',
        why: 'Names the sign system, the object of critique and the analytical framework, so the question can be answered systematically.',
        method: 'Semiotic analysis of selected sequences (denotation, connotation, myth).' },
      { sub: 'streaming', basis: 'Constructed for teaching.', title: 'Streaming-platform audiences (mixed methods)',
        weak: 'What is the impact of Netflix on youth?',
        better: 'Quantitative: To what extent is binge-watching frequency associated with preferences for Arabic or foreign drama among university students in Riyadh? Qualitative: How do these students describe the role of streaming in their choice of drama? Integration: How do students’ accounts help explain the observed associations?',
        why: 'Replaces vague terms (“impact”, “youth”) and splits one broad question into complementary quantitative, qualitative and integration questions.',
        method: 'Explanatory sequential mixed methods design (survey followed by interviews).' },
      { sub: 'audience', basis: 'Builds on the survey findings of Alardawi (2026) as a possible qualitative follow-up; constructed for teaching.', title: 'AI-themed films and young adults',
        weak: 'Are AI movies dangerous for young people?',
        better: 'What meanings do young Saudi adults attribute to dystopian portrayals of artificial intelligence in popular films?',
        why: 'Removes the leading word “dangerous” and moves from measured association to meaning, which is what a qualitative follow-up can add to survey results.',
        method: 'In-depth interviews within an explanatory sequential design.' },
      { sub: 'production', basis: 'Constructed for teaching.', title: 'Production and creative industries',
        weak: 'What problems do Saudi filmmakers face?',
        better: 'How do emerging Saudi women directors negotiate creative and institutional constraints when developing their first feature film?',
        why: 'Defines the population and the process, and replaces “problems” with an analytical concept (negotiating constraints).',
        method: 'Qualitative interviews within a production-studies approach.' },
      { sub: 'film', basis: 'Inspired by documentary-based qualitative inquiry (Borish et al., 2021); constructed for teaching.', title: 'Film as a research method',
        weak: 'Can documentary film be used in research?',
        better: 'How can participatory documentary filmmaking elicit community narratives about cultural heritage in [region]?',
        why: 'Turns a yes/no question into a methodological “how” question with a defined purpose and context.',
        method: 'Participatory, arts-based qualitative research using documentary film.' }
    ],

    msg: {
      dims: {
        clarity: 'Clarity of wording', specificity: 'Specificity', scope: 'Scope and boundaries', alignment: 'Alignment with the research problem',
        theory: 'Theoretical relevance', method: 'Methodological appropriateness', feasibility: 'Research feasibility', contribution: 'Potential scholarly contribution'
      },
      ok: {
        clarity: 'The wording is a single, neutral question.',
        specificity: 'Key terms and the data source are specific.',
        scope: 'The context is stated, which sets the study’s boundaries.',
        alignment: 'The question uses key concepts from your research problem.',
        theory: 'The question is consistent with the framework you specified.',
        method: 'The wording fits your proposed approach and orientation.',
        feasibility: 'You confirmed access, time and skills.',
        contribution: 'The question connects to the gap you identified.'
      },
      issues: {
        empty: { t: 'No question yet', d: 'No question has been written.', r: 'Draft your initial question in Step 4.' },
        tooShort: { t: 'Too broad', d: 'The question is very short, which usually means it is too broad.', r: 'Add the population or material, the context and the aspect you will examine.' },
        tooLong: { t: 'Too long', d: 'The question is long and may combine several issues.', r: 'Keep the main question to one sentence; move details to supporting questions.' },
        noQmark: { t: 'Not phrased as a question', d: 'The text does not end with a question mark.', r: 'Phrase it as a direct question ending with “?”.' },
        closed: { t: 'Yes/no question', d: 'It can be answered with “yes” or “no”.', r: 'Start with “How” or “What” so the question requires analysis.' },
        why: { t: '“Why” wording', d: '“Why” questions can invite speculation about motives.', r: 'Unless your orientation is explanatory, consider “How” or “What factors …”.' },
        double: { t: 'Double-barrelled', d: 'It appears to ask more than one question.', r: 'Split it into a main question and a supporting question.' },
        vague: { t: 'Ambiguous concepts', d: 'It contains broad terms (e.g., “media”, “society”, “role”, “impact”).', r: 'Replace them with precise concepts: which media, which group, which aspect.' },
        leading: { t: 'Leading assumption', d: 'Value-laden words presuppose the answer.', r: 'Use neutral wording (e.g., “how … is represented” rather than “how … is distorted”).' },
        opinion: { t: 'Opinion-based', d: 'Words such as “best” or “should” invite opinion rather than evidence.', r: 'Ask about features, meanings or processes that evidence can show.' },
        noContext: { t: 'Context missing', d: 'The question does not mention the context you defined in Step 1.', r: 'Add the place, platform or cultural setting to set the study’s boundaries.' },
        noSource: { t: 'Population or material missing', d: 'The question does not name the participants or works you will study.', r: 'Name them (e.g., “young Saudi women”, “Ramadan comedy series”).' },
        noTime: { t: 'Time frame not stated', d: 'No period is stated (optional, but often useful).', r: 'If relevant, add a period (e.g., “2019–2025”).' },
        notConnected: { t: 'Weak link to the problem', d: 'The question shares no key concepts with your research problem or phenomenon.', r: 'Use the central concept of your problem in the question.' },
        noTheory: { t: 'No framework specified', d: 'No theoretical perspective has been specified.', r: 'Specify a lens if you will use one (e.g., encoding/decoding, feminist film theory).' },
        theoryAbsent: { t: 'Framework not reflected', d: 'The framework you chose is not reflected in the question.', r: 'Consider using a key concept of the framework in the wording.' },
        quantInQual: { t: 'Measurement wording in a qualitative study', d: 'Words such as “to what extent”, “effect” or “relationship between” suggest measurement.', r: 'Reword around meanings, experiences or processes, or choose a mixed methods approach.' },
        quantNeedsMeasure: { t: 'Qualitative wording in a quantitative study', d: 'The wording focuses on meanings rather than measurable variables.', r: 'Name the variables and the relationship to be measured.' },
        orientMismatch: { t: 'Orientation not reflected', d: 'The wording does not reflect the research orientation you selected.', r: 'Use a stem that matches your orientation (see Step 3).' },
        noIntegration: { t: 'Integration question missing', d: 'Mixed methods studies need a question that links the two strands.', r: 'Add an integration question in Step 4.' },
        feasAccess: { t: 'Access not confirmed', d: 'You have not confirmed access to the material or participants.', r: 'Check availability of the works, archives or participants.' },
        feasTime: { t: 'Timeline not confirmed', d: 'You have not confirmed that the study fits your timeline.', r: 'Narrow the corpus or population to fit the time available.' },
        feasSkills: { t: 'Skills/resources not confirmed', d: 'You have not confirmed the necessary skills, languages or resources.', r: 'Identify training, software or support you may need.' },
        contribution: { t: 'Contribution unclear', d: 'The question is not clearly linked to the gap described in Step 2.', r: 'State the gap more precisely and reflect it in the question (new context, corpus, population or lens).' },
        methodMismatch: { t: 'Method mismatch', d: 'The wording does not fit the proposed approach.', r: 'Align the wording with your approach.' },
        orient: { t: 'Orientation', d: '', r: '' }
      },
      resolved: {
        closed: 'The question is now open-ended and requires analysis.',
        double: 'The question now has a single focus.',
        vague: 'Broad terms were replaced with precise concepts.',
        leading: 'The wording is now neutral and does not presuppose the answer.',
        why: '“Why” was replaced with process-oriented wording.',
        tooShort: 'The question is now specific enough to guide the study.',
        tooLong: 'The question is now concise.',
        noContext: 'The context now sets the study’s boundaries.',
        noSource: 'The population or material is now named.',
        noTime: 'A time frame now limits the scope.',
        notConnected: 'The question now uses the key concept of the problem.',
        methodMismatch: 'The wording now fits the proposed approach.',
        orientMismatch: 'The wording now reflects the selected orientation.',
        noQmark: 'The text is now phrased as a question.',
        opinion: 'Opinion-based wording was removed.'
      }
    },

    /* Lexicon used by the rule-based analyzer (matched on lower-case text). */
    lex: {
      minWords: 7, maxWords: 35,
      stop: ['the', 'and', 'for', 'with', 'from', 'that', 'this', 'these', 'those', 'their', 'there', 'they', 'them', 'what', 'how', 'why', 'which', 'who', 'whom', 'does', 'did', 'are', 'was', 'were', 'has', 'have', 'had', 'been', 'into', 'onto', 'about', 'between', 'among', 'amongst', 'within', 'across', 'through', 'during', 'its', 'his', 'her', 'our', 'your', 'can', 'could', 'should', 'would', 'will', 'may', 'might', 'ways', 'way', 'extent', 'study', 'research', 'question', 'questions', 'aim', 'aims', 'explore', 'examine', 'understand', 'investigate', 'also', 'such', 'other', 'than', 'then', 'when', 'where', 'while', 'not', 'more', 'most', 'some', 'any', 'all', 'each', 'both', 'how', 'in', 'of', 'on', 'to', 'by', 'as', 'at', 'an', 'a', 'is', 'be', 'do', 'it', 'or'],
      stem: (w) => w.length > 5 ? w.replace(/(ings|ing|ed|es|s|ly)$/, '') : w.replace(/s$/, ''),
      closed: /^(is|are|was|were|do|does|did|can|could|will|would|should|has|have|had|may|might)\b/,
      why: /^why\b/,
      double: /(\b(and|or)\s+(how|what|why|whether|to what extent|which|does|do|is|are|can)\b)|(\?\s*\S)/,
      quant: /(to what extent|how much|how many|correlat|relationship between|associat|effect of|effects of|impact of|predict|significan|differences? between|proportion|percentage|frequency|prevalen|measur)/,
      qual: /(\bhow\b|meaning|experienc|interpret|construct|represent|negotiat|make sense|perceiv|understand)/,
      leading: /\b(negative(ly)?|positive(ly)?|harm(ful|s)?|damag\w*|destroy\w*|corrupt\w*|dangerous|fail\w*|distort\w*|inferior|superior|problematic|immoral|bad|good)\b/,
      opinion: /\b(best|worst|better|worse|greatest|should|ought)\b/,
      time: /(\b(1[89]|20)\d{2}\b|\bperiod\b|\bera\b|\bdecade|\bsince\b|\bduring\b|\bcentury\b|\bseason|\bbetween \d)/,
      vague: ['media', 'the media', 'society', 'people', 'culture', 'the arab world', 'role', 'things', 'in general', 'nowadays', 'modern society', 'the public', 'impact', 'effect', 'youth'],
      orient: {
        exploratory: /^(how|what|in what ways)\b/,
        descriptive: /(characteri[sz]|feature|pattern|types?\b|forms?\b|element|portray|depict|represent|present)/,
        interpretive: /(meaning|interpret|make sense|perceiv|experienc|signif|read(ing)?s?\b|understand)/,
        comparative: /(compar|differ|between|across|versus|\bvs\b|similar|contrast)/,
        explanatory: /(why|explain|factor|contribut|shape|lead to|account for|influenc)/,
        evaluative: /(effective|evaluat|assess|success|strength|weakness|quality|achiev)/
      }
    },

    /* Sentence templates (rule-based, editable by the researcher). */
    tpl: {
      topic: (s1, labels) => {
        const sub = labels.subfield || '[subfield]';
        const appr = labels.approach || '[approach]';
        return 'This study examines ' + v(s1.phenomenon, 'phenomenon') + ' in ' + v(s1.population, 'population or audiovisual material') + ', within ' + v(s1.context, 'context') + timeTail(s1) + '. It belongs to ' + sub.toLowerCase() + ' and adopts a ' + appr.toLowerCase() + ' approach.';
      },
      problem: (s2) => [sent(s2.issue), sent(s2.known), sent(s2.gap), sent(s2.need)].filter(Boolean).join(' ') || '[Describe the problem in Step 2]',
      aim: (s1, o) => {
        const verb = o ? o.verb : '[explore]';
        if (o && o.id === 'comparative') return 'The aim of this study is to compare ' + v(s1.phenomenon, 'phenomenon') + ' across ' + v(s1.population, 'units of comparison') + ' within ' + v(s1.context, 'context') + timeTail(s1) + '.';
        return 'The aim of this study is to ' + verb + ' ' + v(s1.phenomenon, 'phenomenon') + (s1.source === 'people' ? ' among ' : ' in ') + v(s1.population, 'population or material') + ' within ' + v(s1.context, 'context') + timeTail(s1) + '.';
      },
      revise: (st) => {
        const s1 = st.s1, o = st.s3.orientation || 'exploratory';
        const P = v(s1.phenomenon, 'phenomenon'), POP = v(s1.population, 'population or material'), C = v(s1.context, 'context') + timeTail(s1);
        const people = {
          exploratory: 'How do ' + POP + ' experience and make sense of ' + P + ' in ' + C + '?',
          descriptive: 'What patterns characterize the engagement of ' + POP + ' with ' + P + ' in ' + C + '?',
          interpretive: 'What meanings do ' + POP + ' attribute to ' + P + ' in ' + C + '?',
          comparative: 'How do interpretations of ' + P + ' differ among ' + POP + ' in ' + C + '?',
          explanatory: 'What factors shape how ' + POP + ' engage with ' + P + ' in ' + C + '?',
          evaluative: 'How do ' + POP + ' assess the effectiveness of ' + P + ' in ' + C + '?'
        };
        const texts = {
          exploratory: 'How is ' + P + ' constructed in ' + POP + ' within ' + C + '?',
          descriptive: 'What narrative and visual features characterize ' + P + ' in ' + POP + ' within ' + C + '?',
          interpretive: 'What meanings are produced through the representation of ' + P + ' in ' + POP + ' within ' + C + '?',
          comparative: 'How does the representation of ' + P + ' differ across ' + POP + ' within ' + C + '?',
          explanatory: 'What narrative, visual and production factors shape the way ' + P + ' is constructed in ' + POP + ' within ' + C + '?',
          evaluative: 'How effectively does ' + POP + ' address ' + P + ' within ' + C + ', according to [stated criteria]?'
        };
        const main = (s1.source === 'people' ? people : texts)[o];
        if (s1.approach === 'quant') return { main: 'To what extent is ' + P + ' associated with [variable] among ' + POP + ' in ' + C + '?' };
        if (s1.approach === 'mixed') return {
          main: 'How do quantitative patterns and qualitative accounts together explain ' + P + ' among ' + POP + ' in ' + C + '?',
          quant: 'To what extent is ' + P + ' associated with [variable] among ' + POP + ' in ' + C + '?',
          qual: people[o],
          integ: 'How do the qualitative findings help explain the quantitative patterns of ' + P + '?'
        };
        return { main };
      },
      supporting: (st) => {
        const s1 = st.s1;
        const P = v(s1.phenomenon, 'phenomenon'), POP = v(s1.population, 'population or material');
        const texts = [
          'What narrative strategies are used to present ' + P + ' in ' + POP + '?',
          'How do visual and sonic choices (mise-en-scène, cinematography, sound) shape the portrayal of ' + P + '?',
          'How are the characters associated with ' + P + ' positioned in terms of gender, class or identity?',
          'How does the production and broadcasting context relate to the way ' + P + ' is presented?'
        ];
        const people = [
          'How do ' + POP + ' describe their viewing practices related to ' + P + '?',
          'What meanings do ' + POP + ' associate with ' + P + '?',
          'How do aspects of identity (such as gender, age or cultural background) inform readings of ' + P + '?',
          'How does the viewing context (platform, household, social media) shape engagement with ' + P + '?'
        ];
        let list = s1.source === 'people' ? people : (s1.source === 'both' ? [texts[0], texts[1], people[1], people[2]] : texts);
        if (s1.approach === 'mixed' || s1.approach === 'quant') list = list.concat(['What is the distribution of [key variable] related to ' + P + ' among ' + POP + '?']);
        return list;
      }
    }
  };
})();
