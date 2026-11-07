/* =========================================================
   Research Problem Compass — English language file
   Data, labels and sentence builders for the English version
   Prepared by Dr. Mervat Alardawi
   ========================================================= */
window.RC = {
  lang: 'en',
  numerals: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  stepNames: ['Research site', 'Phenomenon & context', 'Gap', 'Significance', 'Methodology', 'Statement'],
  ptypes: [{ id: 'theoretical', t: 'Theoretical problem' }, { id: 'applied', t: 'Applied problem' }],
  approaches: [{ id: 'qual', t: 'Qualitative approach' }, { id: 'mixed', t: 'Mixed methods approach' }],

  ui: {
    example: 'Example: ',
    exampleSep: ' — Example: ',
    inFilm: 'In film and television: ',
    lesson: 'Lesson:',
    filmExample: 'Film example: ',
    sampleLabel: 'Sample (works or participants)',
    samplePh: 'e.g., eight drama series or 20 participants',
    copy: 'Copy full draft',
    copied: 'Copied ✓',
    filled: (p) => 'Inputs completed: ' + p + '%',
    copyHeads: {
      statement: 'Problem statement:',
      purpose: 'Purpose statement:',
      questions: 'Research questions:',
      credit: '— Prepared with the Research Problem Compass, developed by Dr. Mervat Alardawi'
    },
    levels: [
      { t: 'Rigorous and ready', d: 'Your statement meets the criteria; share it with your supervisor or a critical peer before finalizing it.' },
      { t: 'Nearly mature', d: 'Some aspects need strengthening, particularly documentation and alignment with the methodology.' },
      { t: 'Taking shape', d: 'Return to the statement builder and revisit the gap, the consequences and the sample.' },
      { t: 'Initial idea', d: 'Start by identifying your research site and central phenomenon, then search the literature for the gap.' }
    ]
  },

  sites: [
    { id: 'text', t: 'Film and television text', d: 'Narrative, image, sound, representation and genre in films and drama series.', ex: 'How are working women represented in contemporary Saudi drama?', sl: 'Film corpus (selected works)', sp: 'e.g., eight series broadcast on the Shahid platform' },
    { id: 'audience', t: 'Audiences and reception', d: 'How viewers interpret works and experience viewing (Hall, 1980; Staiger, 1992).', ex: 'How do young people receive Saudi films screened at festivals?', sl: 'Participants', sp: 'e.g., female university students who watch dubbed Turkish drama' },
    { id: 'production', t: 'Production and production culture', d: 'The practices of practitioners, writers’ rooms and creative labour (Caldwell, 2008; Mayer et al., 2009).', ex: 'How do female screenwriters negotiate self-censorship?', sl: 'Participants or production site', sp: 'e.g., writers and producers at three production companies in Riyadh' },
    { id: 'practice', t: 'Practice-based research', d: 'The film or screenplay as a means of knowing and as a research output (Batty & Kerrigan, 2018).', ex: 'What does directing a short film reveal about narrating oral memory?', sl: 'The creative work produced', sp: 'e.g., a short documentary produced by the researcher' },
    { id: 'industry', t: 'Industry, policy and education', d: 'Platforms, distribution, cultural policy and filmmaking education (Daou, 2025).', ex: 'How is filmmaking education being reshaped by artificial intelligence?', sl: 'Institutions or participants', sp: 'e.g., faculty members and students in two cinematic arts programs' }
  ],

  gaps: [
    { id: 'evidence', t: 'Evidence gap', short: 'Contradictory findings', d: 'Individually sound studies whose findings conflict once synthesized.', ex: 'Findings on the impact of dubbed drama on adolescents’ values range from strong to limited.', tpl: 'However, previous findings on {topic} are contradictory: while studies point to {prev}, no consensus has been reached regarding {missing}.' },
    { id: 'knowledge', t: 'Knowledge gap', short: 'An unstudied topic', d: 'Knowledge missing from the field, or results that differ from what was expected.', ex: 'The aesthetics of the soundtrack in Saudi short films have not been studied.', tpl: 'Nevertheless, the literature has focused on {prev} and has yet to address {missing}.' },
    { id: 'practical', t: 'Practical-knowledge gap', short: 'Practice departs from theory', d: 'A mismatch between what professionals do and what the literature advocates.', ex: 'Screenwriting manuals prescribe three-act structure, while Gulf writers’ rooms work in markedly different ways.', tpl: 'However, there is a gap between what the literature prescribes, focusing as it does on {prev}, and what actually happens in practice; {missing} remains poorly understood.' },
    { id: 'method', t: 'Methodological gap', short: 'One dominant method', d: 'A topic’s reliance on a single method calls for a different approach.', ex: 'Studies of Arab drama reception rely on questionnaires, without interviews that reveal meaning.', tpl: 'However, most studies have approached {topic} through {prev}, leaving {missing} without adequate methodological treatment.' },
    { id: 'empirical', t: 'Empirical gap', short: 'Untested claims', d: 'Claims or propositions that have not been empirically verified.', ex: 'Claims about the “male gaze” (Mulvey, 1975) have rarely been tested with Arab female viewers.', tpl: 'However, claims about {topic} have remained largely theoretical: the literature has examined {prev} without empirically investigating {missing}.' },
    { id: 'theory', t: 'Theoretical gap', short: 'Inadequate theory', d: 'Outdated theory or competing models that fail to explain the phenomenon.', ex: 'Psychoanalysis cannot account for the multiple, intersecting identities of female spectators (Smelik, 2016).', tpl: 'However, prevailing frameworks explain {topic} through {prev}, yet they fail to account for {missing}.' },
    { id: 'population', t: 'Population gap', short: 'An under-represented group', d: 'Groups under-represented in the evidence base by gender, age or identity.', ex: 'A focus on middle-school levels at the expense of elementary levels (Kumar et al., 2025); in cinema: older audiences.', tpl: 'However, previous studies on {topic} have concentrated on {prev}, while {missing} remains under-represented.' },
    { id: 'context', t: 'Contextual gap', short: 'A new context', d: 'Findings concentrated in particular geographic or cultural contexts that may not hold elsewhere.', ex: 'Most studies of perceptions of AI in films are Western; what about young Saudis?', tpl: 'However, most studies on {topic} have been conducted in {prev}, and it is unclear to what extent their findings hold in the context of {setting}; {missing} remains unexamined.' },
    { id: 'frontier', t: 'New-frontier gap', short: 'An emerging phenomenon', d: 'A new technology or shift that opens ground almost no one has studied.', ex: 'Generative AI in filmmaking education (Daou, 2025).', tpl: 'However, {topic} is an emerging phenomenon: the available literature is limited to {prev}, and {missing} remains largely uncharted research territory.' }
  ],

  designs: {
    qual: [
      { id: 'case', t: 'Case study', when: 'To understand a contemporary phenomenon in depth within a specific work, institution or festival.', src: 'Creswell & Poth, 2018', verb: 'explore', m: 'in-depth interviews, document analysis and structured viewing' },
      { id: 'ethno', t: 'Ethnography and production studies', when: 'To understand practitioners’ culture from within, on set and in writers’ rooms.', src: 'Caldwell, 2008; Mayer et al., 2009', verb: 'understand', m: 'participant observation, interviews and analysis of professional discourse' },
      { id: 'phenom', t: 'Phenomenology', when: 'To describe the lived experience of viewing or creating as those involved experience it.', src: 'Creswell & Poth, 2018', verb: 'describe and interpret', m: 'semi-structured interviews on lived experience' },
      { id: 'grounded', t: 'Grounded theory', when: 'When no suitable theory exists and an explanation must be built from the data.', src: 'Creswell & Poth, 2018', verb: 'develop a theoretical explanation of', m: 'successive interviews with open, axial and selective coding' },
      { id: 'textual', t: 'Textual and semiotic analysis', when: 'To analyze the structure of meaning in shots, scenes and narrative.', src: 'Rose, 2016; Bordwell, 1989', verb: 'analyze', m: 'systematic analysis of shots and scenes according to an explicit analytical framework' },
      { id: 'cda', t: 'Critical discourse analysis', when: 'To uncover power relations and ideology in textual and visual representations.', src: 'Kumar et al., 2025 (Fairclough)', verb: 'uncover', m: 'Fairclough’s three-dimensional model of text, discursive practice and social practice' },
      { id: 'thematic', t: 'Thematic analysis', when: 'To identify patterns of meaning in interviews or focus groups with audiences or practitioners.', src: 'Braun & Clarke, 2006', verb: 'explore', m: 'interviews or focus groups analyzed through reflexive thematic analysis' },
      { id: 'pbr', t: 'Practice-based research', when: 'When producing the film or screenplay is itself a way of generating knowledge.', src: 'Batty & Kerrigan, 2018', verb: 'investigate', m: 'producing a creative work accompanied by a reflective journal and a critical analysis of the process' }
    ],
    mixed: [
      { id: 'conv', t: 'Convergent design', when: 'Collecting quantitative and qualitative data concurrently, then comparing them to form a comprehensive understanding.', src: 'Creswell & Plano Clark, 2018', verb: 'understand', m: 'a questionnaire and quantitative content analysis alongside interviews or focus groups, followed by a comparison of results', mx: 'conv' },
      { id: 'expl', t: 'Explanatory sequential design', when: 'A quantitative phase first, then a qualitative phase to explain its surprising or significant results.', src: 'Creswell & Plano Clark, 2018', verb: 'explain', m: 'a large-scale questionnaire followed by in-depth interviews with a selected subsample of respondents', mx: 'expl' },
      { id: 'explo', t: 'Exploratory sequential design', when: 'A qualitative phase first to explore the phenomenon, then a quantitative instrument to test or generalize it.', src: 'Creswell & Plano Clark, 2018', verb: 'explore', m: 'interviews or textual analysis first, then developing and testing a quantitative instrument on a larger sample', mx: 'explo' }
    ]
  },

  assumes: [
    { id: 'inhouse', t: 'In-house assumption', d: 'Assumptions shared within a particular school of thought.', ex: 'The psychoanalytic Screen school assumes the spectator is a textual position constructed by the film, not a real person.' },
    { id: 'metaphor', t: 'Root metaphor', d: 'A broad image that governs how the subject is understood.', ex: 'The “hypodermic needle” metaphor, which pictures film as a substance injected into a passive audience.' },
    { id: 'paradigm', t: 'Paradigmatic assumption', d: 'Ontological, epistemological and methodological assumptions.', ex: 'The assumption that meaning resides in the text and is extracted through analysis, rather than constructed in reception.' },
    { id: 'ideology', t: 'Ideological assumption', d: 'Political, moral and gender-related assumptions.', ex: 'The assumption that whiteness is an invisible norm that needs no naming (Dyer, 1993, in Smelik, 2016).' },
    { id: 'field', t: 'Field assumption', d: 'Assumptions shared by competing schools across the entire field.', ex: 'The assumption that Western film theories automatically apply to Arab cinema.' }
  ],

  checks: [
    { id: 'c1', t: 'Specific and concise', d: 'A single paragraph addressing one central phenomenon.' },
    { id: 'c2', t: 'Clear context', d: 'Defines the temporal, spatial and media boundaries, and the sample.' },
    { id: 'c3', t: 'Documented gap', d: 'Supported by recent references showing what studies have covered and what is missing.' },
    { id: 'c4', t: 'Consequences stated', d: 'Shows what follows if the gap persists and who is affected.' },
    { id: 'c5', t: 'Interesting (I)', d: 'Of interest to the researcher and the film and television studies community.' },
    { id: 'c6', t: 'Novel (N)', d: 'Adds new knowledge or questions an existing assumption, rather than repeating prior work.' },
    { id: 'c7', t: 'Feasible (F)', d: 'Access to works, participants or archives is possible within the available time and resources.' },
    { id: 'c8', t: 'Ethical (E)', d: 'Respects informed consent, intellectual property rights and privacy.' },
    { id: 'c9', t: 'Relevant (R)', d: 'Connected to the field, the industry and the local context.' },
    { id: 'c10', t: 'Aligned with purpose and questions', d: 'The purpose, questions and methodology all stem from the problem itself.' },
    { id: 'c11', t: 'Open, non-leading questions', d: 'Begin with “how/what” and do not presuppose the answer.' },
    { id: 'c12', t: 'Clear methodological rationale', d: 'Justifies why a qualitative approach, or why mixing methods is necessary.' }
  ],

  cases: [
    { t: 'Kumar et al. (2025): Gender representation in Pakistani elementary English textbooks', method: 'Qualitative: critical discourse analysis', gap: 'Population and contextual gap', how: 'They showed that the literature had focused on middle and secondary levels, leaving the elementary level unstudied after the 2020 curriculum reforms, and then addressed this gap using Fairclough’s model.', lesson: 'The formula “the literature has focused on… and overlooked…”, combined with a clear time boundary, makes a gap convincing.' },
    { t: 'Berg (2025): Integration, othering and identity negotiation among refugees', method: 'Qualitative: semi-structured interviews (62)', gap: 'An evolving problem', how: 'The study began with the problem of “information precarity”, then the researcher reframed it when “digital othering” emerged as a form of othering, through reflexivity and iterative thematic analysis.', lesson: 'In qualitative research the problem may evolve with the data; document this evolution and your positionality as a researcher.' },
    { t: 'A Saudi study: AI-themed films and young people’s perceptions', method: 'Quantitative: survey (410)', gap: 'Contextual gap', how: 'It started from the observation that the literature is Western-oriented, applied Cultivation Theory in a non-Western context, and formulated questions and hypotheses consistent with that theory.', lesson: 'It could be converted into an explanatory sequential design, adding interviews that explain why young people see AI as a threat.' },
    { t: 'Smelik (2016): Feminist film theory', method: 'Theoretical: critical review', gap: 'Theoretical gap and debate', how: 'Traces how the debate over the “male gaze” generated new problems: the female spectator, race, masculinity and queer readings.', lesson: 'Theoretical debates within the field are a rich source of research problems.' },
    { t: 'Daou (2025): Reimagining filmmaking education in Saudi Arabia through AI', method: 'Review chapter', gap: 'New frontier', how: 'Linked the growth of the cinema sector under Vision 2030 to the rise of AI in education, weighing its opportunities against its risks to creativity.', lesson: 'Locally emerging phenomena open urgent applied problems for our track.' }
  ],

  refs: [
    { t: 'I. References from the attached file', items: [
      'Berg, M. (2025). Refugee integration in Germany: The interplay of othering, digital exclusion, and identity negotiation. Journal of International Migration and Integration, 26(1). https://doi.org/10.1007/s12134-025-01238-0',
      'Daou, M. I. (2025). Reimagining filmmaking education in Saudi Arabia through the use of AI. In AI in the Middle East for growth and business (pp. 263–279). Springer. https://doi.org/10.1007/978-3-031-75589-7_15',
      'Kumar, A., Kumari, A., McKeown, D., & Syed, H. A. (2025). Tale of textbooks: A critical discourse analysis of gender representation in Pakistani elementary English language textbooks. Linguistics and Education, 88.',
      'Mulvey, L. (1975). Visual pleasure and narrative cinema. Screen, 16(3), 6–18.',
      'Smelik, A. (2016). Feminist film theory. In N. A. Naples (Ed.), The Wiley Blackwell encyclopedia of gender and sexuality studies. Wiley. https://doi.org/10.1002/9781118663219.wbegss1482',
      'Exposure to AI-themed movies and Saudi young adults’ perceptions of artificial intelligence: A Cultivation Theory study (n = 410) [Source details to be completed; included in the attached file].',
      'What is a research problem? [Video transcript]. (n.d.). Included in the attached file.',
      'The problem statement [Video transcript]. (n.d.). Included in the attached file.'
    ] },
    { t: 'II. Additional methodological literature (peer-reviewed and highly cited)', items: [
      'Agee, J. (2009). Developing qualitative research questions: A reflective process. International Journal of Qualitative Studies in Education, 22(4), 431–447. https://doi.org/10.1080/09518390902736512',
      'Alvesson, M., & Sandberg, J. (2011). Generating research questions through problematization. Academy of Management Review, 36(2), 247–271. https://doi.org/10.5465/amr.2009.0188',
      'Braun, V., & Clarke, V. (2006). Using thematic analysis in psychology. Qualitative Research in Psychology, 3(2), 77–101. https://doi.org/10.1191/1478088706qp063oa',
      'Creswell, J. W., & Creswell, J. D. (2018). Research design: Qualitative, quantitative, and mixed methods approaches (5th ed.). SAGE.',
      'Creswell, J. W., & Plano Clark, V. L. (2018). Designing and conducting mixed methods research (3rd ed.). SAGE.',
      'Creswell, J. W., & Poth, C. N. (2018). Qualitative inquiry and research design: Choosing among five approaches (4th ed.). SAGE.',
      'Ellis, T. J., & Levy, Y. (2008). Framework of problem-based research: A guide for novice researchers on the development of a research-worthy problem. Informing Science, 11, 17–33.',
      'Hulley, S. B., Cummings, S. R., Browner, W. S., Grady, D. G., & Newman, T. B. (2013). Designing clinical research (4th ed.). Lippincott Williams & Wilkins. [FINER criteria]',
      'Maxwell, J. A. (2013). Qualitative research design: An interactive approach (3rd ed.). SAGE.',
      'Miles, D. A. (2017). A taxonomy of research gaps: Identifying and defining the seven research gaps. Doctoral Student Workshop: Finding Research Gaps – Research Methods and Strategies, Dallas, TX.',
      'Müller-Bloch, C., & Kranz, J. (2015). A framework for rigorously identifying research gaps in qualitative literature reviews. Proceedings of the International Conference on Information Systems (ICIS 2015), Fort Worth, TX.',
      'Sandberg, J., & Alvesson, M. (2011). Ways of constructing research questions: Gap-spotting or problematization? Organization, 18(1), 23–44. https://doi.org/10.1177/1350508410372151',
      'Tashakkori, A., & Creswell, J. W. (2007). Exploring the nature of research questions in mixed methods research. Journal of Mixed Methods Research, 1(3), 207–211. https://doi.org/10.1177/1558689807302814'
    ] },
    { t: 'III. Film and television studies references', items: [
      'Barker, M., & Mathijs, E. (2012). Researching world audiences: The experience of a complex methodology. Participations: Journal of Audience & Reception Studies, 9(2), 664–689.',
      'Batty, C., & Kerrigan, S. (Eds.). (2018). Screen production research: Creative practice as a mode of enquiry. Palgrave Macmillan. https://doi.org/10.1007/978-3-319-62837-0',
      'Bordwell, D. (1989). Making meaning: Inference and rhetoric in the interpretation of cinema. Harvard University Press.',
      'Bordwell, D., & Carroll, N. (Eds.). (1996). Post-theory: Reconstructing film studies. University of Wisconsin Press.',
      'Caldwell, J. T. (2008). Production culture: Industrial reflexivity and critical practice in film and television. Duke University Press.',
      'Hall, S. (1980). Encoding/decoding. In S. Hall, D. Hobson, A. Lowe, & P. Willis (Eds.), Culture, media, language (pp. 128–138). Hutchinson.',
      'Mayer, V., Banks, M. J., & Caldwell, J. T. (Eds.). (2009). Production studies: Cultural studies of media industries. Routledge.',
      'Rose, G. (2016). Visual methodologies: An introduction to researching with visual materials (4th ed.). SAGE.',
      'Staiger, J. (1992). Interpreting films: Studies in the historical reception of American cinema. Princeton University Press.'
    ] }
  ],

  /* ---------- Builder for the problem statement, purpose and questions ---------- */
  compose: function (s, sel) {
    const f = s.f;
    const ph = (v, p) => (v && v.trim()) ? v.trim() : '[' + p + ']';
    const topic = ph(f.topic, 'central phenomenon');
    const setting = ph(f.setting, 'setting');
    const sample = ph(f.sample, 'sample');
    const prevT = ph(f.prev, 'what previous studies focused on');
    const missing = ph(f.missing, 'the missing aspect');
    const fill = (tpl) => tpl.split('{topic}').join(topic).split('{setting}').join(setting).split('{prev}').join(prevT).split('{missing}').join(missing);
    const siteSel = sel.siteSel, gapSel = sel.gapSel, des = sel.des;

    const p1 = (f.context && f.context.trim()) ? f.context.trim() : (topic.charAt(0).toUpperCase() + topic.slice(1) + ' in ' + setting + ' has attracted growing attention in film and television studies.');
    const p2 = gapSel ? fill(gapSel.tpl) : ('However, previous studies have focused on ' + prevT + ', while ' + missing + ' has not been addressed.');
    const cons = ph(f.consequence, 'consequences of the gap');
    const ben = ph(f.beneficiaries, 'beneficiaries');
    const p3 = 'This shortcoming results in ' + cons + ', which matters to ' + ben + '; ' +
      (s.ptype === 'applied' ? 'the study therefore has practical significance in providing an understanding that can guide practice.' : 'the study therefore has theoretical significance in expanding knowledge of ' + topic + '.');
    const desName = des ? des.t.toLowerCase() : '[design]';
    const verb = des ? des.verb : '[explore]';
    const meth = des ? des.m : '[data collection methods]';
    const th = (f.theory && f.theory.trim()) ? (', drawing on ' + f.theory.trim()) : '';
    const art = (w) => (/^[aeiou]/i.test(w) ? 'an ' : 'a ');
    const scope = siteSel && (siteSel.id === 'text' || siteSel.id === 'practice') ? ' as manifested in ' : ' among ';
    const p4 = s.approach === 'mixed'
      ? ('Therefore, this mixed methods study, adopting ' + art(desName) + desName + ', aims to ' + verb + ' ' + topic + scope + sample + ' in ' + setting + th + ', through ' + meth + '.')
      : ('Therefore, this qualitative study, adopting ' + art(desName) + desName + ' approach, aims to ' + verb + ' ' + topic + scope + sample + ' in ' + setting + th + ', through ' + meth + '.');
    const statement = [
      { label: 'Context', text: p1 }, { label: 'Issue & gap', text: p2 },
      { label: 'Significance', text: p3 }, { label: 'Purpose', text: p4 }
    ];

    const purpose = s.approach === 'mixed'
      ? ('The purpose of this ' + desName + ' study is to ' + verb + ' ' + topic + ' among ' + sample + ' in ' + setting + '; quantitative and qualitative data are collected and integrated because neither alone is sufficient to understand the problem fully.')
      : ('The purpose of this study (' + desName + ') is to ' + verb + ' ' + topic + ' among ' + sample + ' in ' + setting + '. At this stage, ' + topic + ' is defined as [an initial working definition, open to refinement].');

    const sid = siteSel ? siteSel.id : 'text';
    const central = {
      text: 'How is ' + topic + ' constructed in ' + sample + ' within ' + setting + '?',
      audience: 'How do ' + sample + ' receive and interpret ' + topic + ' in ' + setting + '?',
      production: 'How do ' + sample + ' engage with ' + topic + ' in their production practices within ' + setting + '?',
      practice: 'What does the process of producing ' + sample + ' reveal about ' + topic + ' in ' + setting + '?',
      industry: 'How is ' + topic + ' shaped in ' + setting + ' from the perspective of ' + sample + '?'
    }[sid];
    const subs = {
      text: ['What narrative, visual and sonic patterns are used to present ' + topic + '?', 'How do these representations intersect with their cultural and industrial context?'],
      audience: ['What meanings do ' + sample + ' attribute to ' + topic + '?', 'How do their experiences and identities shape their dominant, negotiated or oppositional readings?'],
      production: ['What constraints and opportunities do ' + sample + ' encounter in dealing with ' + topic + '?', 'How do they justify and describe their creative decisions?'],
      practice: ['What were the critical creative decisions in the process, and why?', 'How does the resulting work contribute to knowledge about ' + topic + '?'],
      industry: ['What institutional and technological factors influence ' + topic + '?', 'What opportunities and risks do ' + sample + ' perceive?']
    }[sid];
    let questions = [{ k: 'Central question', t: central }, { k: 'Sub-question 1', t: subs[0] }, { k: 'Sub-question 2', t: subs[1] }];
    if (s.approach === 'mixed') {
      const mx = des ? des.mx : 'conv';
      questions = [
        { k: 'Quantitative question', t: 'How prevalent is ' + topic + ', and how is it related to the characteristics of ' + sample + ' in ' + setting + '?' },
        { k: 'Qualitative question', t: central },
        { k: 'Integration question', t: mx === 'expl' ? ('How do the qualitative data explain the quantitative results concerning ' + topic + '?')
          : (mx === 'explo' ? ('To what extent do the patterns explored qualitatively hold for a larger sample of ' + sample + '?')
          : ('To what extent do the quantitative and qualitative results converge or diverge in understanding ' + topic + '?')) }
      ];
    }

    const warnings = [];
    if (!s.site) warnings.push('You have not selected a research site; the film-text phrasing has been used by default.');
    if (!s.gap) warnings.push('Select a gap type to make the issue sentence more precise.');
    if (!s.design) warnings.push('Select a research design so the purpose statement aligns with the methodology.');
    if (f.topic && f.topic.trim().split(/\s+/).length > 8) warnings.push('The central phenomenon is long; condense it into one clear concept.');
    if (f.context && !/\(|\d{4}/.test(f.context)) warnings.push('Add a documented citation to the context sentence.');
    if (/\b(effects?|impacts?|influences?|relationships?|correlations?)\b/i.test(f.topic || '') && s.approach === 'qual') warnings.push('Words such as “effect” and “relationship” suggest a quantitative approach; in qualitative research, prefer “how/what” and “experience/meaning/representation”.');
    if (!warnings.length) warnings.push('The draft is structurally complete; review the language and test it against the criteria below.');

    return { statement, purpose, questions, warnings };
  },

  /* ---------- Problematization lab questions ---------- */
  labQuestions: function (L, atype) {
    const ph = (v, p) => (v && v.trim()) ? v.trim() : '[' + p + ']';
    const lf = ph(L.field, 'domain of literature');
    const la = ph(L.assumption, 'prevailing assumption');
    const lalt = ph(L.alt, 'alternative assumption');
    const typeQ = {
      inhouse: 'Do researchers from other schools of thought share this assumption, or is it confined to a single school?',
      metaphor: 'What metaphor governs our conception of ' + lf + ', and what does it conceal from us?',
      paradigm: 'What happens to the question if we move from a paradigm that locates meaning in the text to one that sees it as constructed in context?',
      ideology: 'Who benefits from this assumption remaining unquestioned, and whose voice is absent because of it?',
      field: 'Does this assumption hold for Arab and Saudi cinema and drama, or is it a product of a Western context?'
    }[atype] || 'Select an assumption type above to receive a tailored question.';
    return [
      'The literature on ' + lf + ' assumes that “' + la + '”. What evidence was this assumption built on, and when and where did it take shape?',
      typeQ,
      'What if we started from the premise that “' + lalt + '”? What phenomena would then become visible?',
      'Proposed research question: How might ' + lf + ' be understood if we start from the premise that ' + lalt + ', rather than the prevailing assumption that ' + la + '?'
    ];
  }
};
