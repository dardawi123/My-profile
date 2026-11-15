/* =========================================================
   Research Introduction Writing and Refinement in Film and Television Studies
   English interface text, guidance, options, examples and templates.
   rintro-ar.js has exactly the same keys and structure.
   Templates only arrange the researcher's own entries; they never add
   studies, gaps, findings, references or claims.
   Academic tool developed by Dr. Merfat Alardawi
   ========================================================= */
window.RC = (function () {
  'use strict';
  const T = (x) => String(x || '').trim();
  const has = (x) => !!T(x);
  const end = (s) => { s = T(s); if (!s) return ''; s = s.charAt(0).toUpperCase() + s.slice(1); return /[.!?…”")\]]$/.test(s) ? s : s + '.'; };
  const frag = (s) => T(s).replace(/[.;:]+$/, '');
  const join = (a) => a.filter(has).join(' ');
  const qmark = (s) => { s = frag(s).replace(/\?+$/, ''); return s ? s.charAt(0).toUpperCase() + s.slice(1) + '?' : ''; };
  const pick = (list, id) => (list.find((x) => x.id === id) || {});
  const unparen = (s) => frag(s).replace(/^\(+|\)+$/g, '');
  /* Adds the researcher's in-text citations to a sentence that has none. */
  const withCite = (s, refs) => { s = end(s); refs = unparen(refs); if (!s || !refs || /\d{4}/.test(s)) return s; return s.replace(/([.!?…])$/, ' (' + refs + ')$1'); };
  const lowerOk = ['the', 'little', 'few', 'this', 'these', 'research', 'studies', 'scholarship', 'existing', 'most', 'there', 'it', 'much', 'previous', 'prior', 'audience', 'no', 'not', 'only', 'although', 'while'];
  const startsConnector = (s) => /^(however|yet|nevertheless|but|despite|although|while|still|nonetheless)\b/i.test(T(s));
  const lcFirst = (s) => { s = T(s); const w = s.split(/\s+/)[0].toLowerCase(); return lowerOk.indexOf(w) !== -1 ? s.charAt(0).toLowerCase() + s.slice(1) : null; };
  const listJoin = (a) => a.length < 2 ? a.join('') : a.length === 2 ? a[0] + ' and ' + a[1] : a.slice(0, -1).join('; ') + '; and ' + a[a.length - 1];

  const approaches = [
    { id: 'qual', t: 'Qualitative', d: 'Interviews, focus groups, reception, textual, semiotic, narrative or discourse analysis.' },
    { id: 'quant', t: 'Quantitative', d: 'Surveys, quantitative content analysis or experiments.' },
    { id: 'mixed', t: 'Mixed methods', d: 'Integrated qualitative and quantitative strands.' },
    { id: 'theory', t: 'Theoretical / critical', d: 'Critical, conceptual or historical argument without new empirical data.' }
  ];
  const designs = [
    { id: 'interviews', a: 'qual', kind: 'interview', t: 'Semi-structured interviews' },
    { id: 'focus', a: 'qual', kind: 'interview', t: 'Focus groups' },
    { id: 'reception', a: 'qual', kind: 'interview', t: 'Audience reception study' },
    { id: 'ethno', a: 'qual', kind: 'interview', t: 'Ethnography or netnography' },
    { id: 'textual', a: 'qual', kind: 'textual', t: 'Interpretive film or television textual analysis' },
    { id: 'semiotic', a: 'qual', kind: 'textual', t: 'Semiotic / semiological analysis' },
    { id: 'narrative', a: 'qual', kind: 'textual', t: 'Narrative analysis' },
    { id: 'discourse', a: 'qual', kind: 'textual', t: 'Discourse or critical discourse analysis' },
    { id: 'qca', a: 'qual', kind: 'textual', t: 'Qualitative content analysis' },
    { id: 'case', a: 'qual', kind: 'textual', t: 'Comparative case study' },
    { id: 'survey', a: 'quant', kind: 'survey', t: 'Survey / questionnaire' },
    { id: 'quantca', a: 'quant', kind: 'qcontent', t: 'Quantitative content analysis' },
    { id: 'experiment', a: 'quant', kind: 'survey', t: 'Experiment or quasi-experiment' },
    { id: 'convergent', a: 'mixed', kind: 'mixed', t: 'Convergent mixed-methods design' },
    { id: 'explanatory', a: 'mixed', kind: 'mixed', t: 'Explanatory sequential design' },
    { id: 'exploratory', a: 'mixed', kind: 'mixed', t: 'Exploratory sequential design' },
    { id: 'critical', a: 'theory', kind: 'critical', t: 'Critical theoretical analysis' },
    { id: 'conceptual', a: 'theory', kind: 'critical', t: 'Conceptual or theoretical essay' },
    { id: 'historical', a: 'theory', kind: 'critical', t: 'Historical or archival analysis' }
  ];
  const fields = [
    { id: 'film', t: 'Film and cinema studies' }, { id: 'tv', t: 'Television and drama studies' }, { id: 'criticism', t: 'Film and television criticism' },
    { id: 'audience', t: 'Audience and reception studies' }, { id: 'representation', t: 'Cultural representation and identity' }, { id: 'feminist', t: 'Feminist film and television studies' },
    { id: 'semiotic', t: 'Semiotics and semiological analysis' }, { id: 'narrative', t: 'Narrative and discourse analysis' }, { id: 'streaming', t: 'Streaming platforms and digital media' },
    { id: 'production', t: 'Film and television production' }, { id: 'industries', t: 'Audiovisual communication and creative industries' }
  ];
  const venues = [
    { id: 'journal', t: 'Journal article', d: 'Concise introduction; follow the journal’s conventions.' },
    { id: 'thesis', t: 'Thesis or dissertation', d: 'A fuller chapter that often ends with the thesis structure.' },
    { id: 'conference', t: 'Conference paper', d: 'Short; context, gap and purpose come quickly.' },
    { id: 'chapter', t: 'Book chapter', d: 'Follow the editors’ framing of the volume.' },
    { id: 'proposal', t: 'Research proposal', d: 'Written before the study; contribution is anticipated.' }
  ];
  const langs = [
    { id: 'ar', t: 'Arabic', d: 'The introduction is written in Arabic.' },
    { id: 'en', t: 'English', d: 'The introduction is written in English.' },
    { id: 'both', t: 'Arabic and English', d: 'Both versions are needed; write each yourself.' }
  ];
  const statuses = [
    { id: 'proposal', t: 'Planned study or proposal', d: 'Use cautious, anticipatory wording.' },
    { id: 'progress', t: 'Study in progress', d: 'Contribution is still expected, not shown.' },
    { id: 'completed', t: 'Completed study', d: 'Contributions may refer to actual findings.' }
  ];
  const headingModes = [
    { id: 'none', t: 'No subheadings', d: 'The usual choice for journal introductions.' },
    { id: 'allowed', t: 'Subheadings permitted', d: 'Use them only if they help long chapters.' },
    { id: 'required', t: 'Subheadings required', d: 'The thesis or publication template asks for them.' }
  ];
  const gapTypes = [
    { id: 'empirical', t: 'Empirical gap', d: 'A group, text, period or practice has not been studied empirically, or only thinly.', ex: 'Reception studies of Turkish serials focus on broadcast viewing; viewing on streaming platforms by young Gulf audiences is rarely examined.' },
    { id: 'theoretical', t: 'Theoretical gap', d: 'An existing theory does not explain a phenomenon well, or has not been tested in a new setting.', ex: 'Cultural proximity theory was developed for broadcast flows and says little about algorithmic recommendation.' },
    { id: 'methodological', t: 'Methodological gap', d: 'Previous studies relied on one kind of method, leaving questions that another method can answer.', ex: 'Most studies of Saudi drama audiences use surveys; few listen to viewers’ own interpretations.' },
    { id: 'contextual', t: 'Contextual or geographical gap', d: 'Findings from one cultural or industrial context are assumed to apply elsewhere.', ex: 'Research on women in Gulf cinema draws mainly on Emirati and Egyptian films; Saudi productions after 2018 are less studied.' },
    { id: 'contradictory', t: 'Contradictory findings', d: 'Studies report results that point in different directions.', ex: 'Some studies describe Turkish drama as modernising, others as reinforcing family conservatism.' },
    { id: 'debate', t: 'Unresolved scholarly debate', d: 'Scholars disagree about a concept, value or interpretation.', ex: 'Scholars disagree whether streaming “originals” weaken or renew national television drama.' },
    { id: 'representation', t: 'Underexplored representation', d: 'A type of character, group, place or theme on screen has received little critical attention.', ex: 'Older women in Saudi comedy series have received little analytical attention.' },
    { id: 'interpretive', t: 'Critical interpretive tension', d: 'A film or series invites readings that sit in tension with each other or with the critical consensus.', ex: 'A drama celebrated as progressive repeatedly punishes its independent female characters.' }
  ];
  const gapStatuses = [
    { id: 'limited', t: 'Limited attention', d: 'You can show that the topic is studied less than related topics, but not that it is unstudied.', ex: 'Research on X has received comparatively limited attention.' },
    { id: 'potential', t: 'Potential gap (from selected studies)', d: 'The studies you have read suggest a gap, but you have not searched systematically.', ex: 'The studies reviewed here suggest that X has not been examined in Y.' },
    { id: 'supported', t: 'Supported gap (transparent review)', d: 'You searched named databases with stated terms and dates and can describe what you found.', ex: 'A search of Scopus and Web of Science (2015–2025) identified no study that…' },
    { id: 'critical', t: 'Critical or theoretical problem', d: 'The problem is a tension, contradiction or blind spot in how something is understood; it does not depend on the absence of studies.', ex: 'Existing readings treat X as progressive, yet the narrative repeatedly punishes it.' }
  ];
  const relTypes = [
    { id: 'territory', t: 'Establishes the context' }, { id: 'finding', t: 'Key finding' }, { id: 'theory', t: 'Theoretical source' },
    { id: 'method', t: 'Methodological precedent' }, { id: 'debate', t: 'Position in a debate' }, { id: 'contrast', t: 'Contrasting finding' }, { id: 'limitation', t: 'Shows a limitation or gap' }
  ];
  const sigTypes = [
    { id: 'theoretical', t: 'Theoretical', d: 'Refines, tests or extends a theory or concept.', ph: 'e.g. The study tests whether cultural proximity explains streaming-era choices.' },
    { id: 'empirical', t: 'Empirical', d: 'Provides evidence about an understudied group, text or practice.', ph: 'e.g. It provides first-hand accounts from young Saudi women who watch dizi online.' },
    { id: 'methodological', t: 'Methodological', d: 'Uses or adapts a method in a way that others can apply.', ph: 'e.g. It combines focus groups with viewing diaries.' },
    { id: 'cultural', t: 'Cultural', d: 'Clarifies meanings, identities or values in a culture.', ph: 'e.g. It shows how family values are negotiated through foreign drama.' },
    { id: 'contextual', t: 'Contextual', d: 'Adds a region, period, platform or industry that is missing.', ph: 'e.g. It extends Gulf audience research to streaming platforms.' },
    { id: 'practical', t: 'Practical or industry-related', d: 'Informs producers, platforms, educators or policy.', ph: 'e.g. It may inform how regional platforms curate imported drama.' }
  ];
  const contribTypes = [
    { id: 'theoretical', t: 'Theoretical contribution', d: 'What the study adds to a theory or concept.', ph: 'e.g. The study is expected to refine cultural proximity for platform viewing.' },
    { id: 'empirical', t: 'Empirical contribution', d: 'What new evidence the study provides.', ph: 'e.g. It offers qualitative evidence from an under-represented audience.' },
    { id: 'methodological', t: 'Methodological contribution', d: 'How the study’s method can inform other research.', ph: 'e.g. It shows how viewing diaries can support focus-group data.' },
    { id: 'contextual', t: 'Contextual contribution', d: 'What the study adds about a place, period, platform or industry.', ph: 'e.g. It adds a Saudi streaming context to research on transnational drama.' },
    { id: 'critical', t: 'Critical interpretive contribution', d: 'A new or better-supported reading of texts.', ph: 'e.g. It offers a reading of family conflict as negotiation rather than rebellion.' }
  ];
  const theoryModes = [
    { id: 'theory', t: 'A named theory', d: 'e.g. reception theory, cultivation theory.' },
    { id: 'concept', t: 'A conceptual framework', d: 'Key concepts without one overarching theory.' },
    { id: 'critical', t: 'A critical approach', d: 'e.g. feminist or postcolonial critique.' },
    { id: 'none', t: 'No formal theory warranted', d: 'Explain briefly why (e.g. exploratory or descriptive design).' }
  ];
  const theories = [
    { id: 'representation', t: 'Cultural representation (Hall)', n: 'Hall’s theory of cultural representation' }, { id: 'reception', t: 'Reception theory / encoding–decoding', n: 'reception theory' }, { id: 'feminist', t: 'Feminist film theory', n: 'feminist film theory' },
    { id: 'semiotics', t: 'Semiotics and semiology', n: 'semiotics' }, { id: 'auteur', t: 'Auteur theory', n: 'auteur theory' }, { id: 'genre', t: 'Genre theory', n: 'genre theory' }, { id: 'narrative', t: 'Narrative theory', n: 'narrative theory' },
    { id: 'uses', t: 'Uses and gratifications', n: 'uses and gratifications theory' }, { id: 'cultivation', t: 'Cultivation theory', n: 'cultivation theory' }, { id: 'proximity', t: 'Cultural proximity', n: 'cultural proximity theory' }, { id: 'other', t: 'Other (write below)', n: '' }
  ];
  const moveNames = { territory: 'Research territory', scholarly: 'Scholarly context', gap: 'Gap or critical problem', rationale: 'Rationale', purpose: 'Purpose', questions: 'Objectives and questions', theory: 'Theoretical positioning', contribution: 'Contribution and organisation' };

  return {
    lang: 'en', dir: 'ltr', colon: ': ', sep: ', ',
    numerals: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'],
    steps: ['Profile', 'Context', 'Background', 'Gap', 'Problem', 'Rationale', 'Aims & questions', 'Theory', 'Contribution', 'Construct', 'Refine', 'Evaluate', 'Final report'],
    stepText: [
      { h: 'Step 1 — Research Profile and Academic Context', p: 'Record the essentials of your study and where the introduction will appear.',
        whyH: 'The introduction depends on the study', why: 'Introductions differ across research traditions. An interpretive reading of a film may open with a critical puzzle or a representational problem; an audience survey usually builds on prior empirical evidence and a defined population. Your approach, design, stage of research and publication decide which moves the introduction needs and how cautious its claims should be.',
        ex: 'Title — Negotiating family and romance: Young Saudi women watching Turkish serials on streaming platforms · Qualitative, focus groups · Journal article · Planned study · No subheadings.',
        out: 'Expected output — a structured research profile that guides the introductory argument' },
      { h: 'Step 2 — Establish the Broader Research Context', p: 'Move from the general field to the specific phenomenon your study addresses.',
        whyH: 'From territory to a focused issue', why: 'The opening shows readers why this topic matters now. Begin close to your topic, not at the beginning of cinema history. State the phenomenon, what is happening now, where, and why it matters to film and television studies, and support factual claims with references. Avoid sweeping statements (“since the dawn of cinema”, “in today’s world”) and background that the argument does not need.',
        ex: 'Turkish television serials have become one of the most watched forms of imported drama in the Gulf [reference]. Since the arrival of regional streaming platforms, young viewers increasingly watch them on demand rather than on broadcast television [reference].',
        weak: 'Since the beginning of human history people have told stories, and cinema and television are very important in our modern world.',
        better: 'Regional streaming platforms have changed how young Gulf viewers encounter Turkish serials, moving viewing from scheduled broadcast to on-demand selection [reference].',
        out: 'Expected output — an academically grounded opening context' },
      { h: 'Step 3 — Establish the Scholarly Background', p: 'Synthesise the scholarship that your study builds on; use the citation matrix to organise sources.',
        whyH: 'Synthesis, not a list of summaries', why: 'The introduction gives only the background needed to understand the gap and the problem; the full Literature Review comes later. Group studies by what they show, how they were done or where they disagree, and write sentences that connect several sources (“Studies of X agree that…, whereas Y…”). A sequence of “Author (Year) found…” sentences is a list, not a synthesis.',
        ex: 'Reception studies agree that Turkish serials attract Arab audiences through a combination of cultural closeness and aspirational modernity [references], although they differ on whether this modernity unsettles or confirms family norms [references].',
        weak: 'Smith (2018) studied Turkish drama. Ahmed (2019) also studied Turkish drama. Lee (2020) found that viewers like the actors.',
        better: 'Studies of Turkish drama in the Arab world agree that its appeal combines familiarity and difference [Smith, 2018; Ahmed, 2019], but most examine broadcast viewing and older audiences [Lee, 2020].',
        out: 'Expected output — a concise critical overview of relevant scholarship' },
      { h: 'Step 4 — Identify the Research Gap or Critical Problem', p: 'Define what is missing, contradictory or problematic, and show the evidence for each claim.',
        whyH: 'A gap is a claim that needs evidence', why: 'Not having found a study does not prove that none exists. Decide honestly which level your claim reaches: limited attention, a potential gap inferred from selected studies, a gap supported by a transparent search, or a critical problem that does not depend on absence at all. Link each gap to the studies in your matrix and describe how you searched. Many strong introductions in film and television studies rest on a critical or interpretive problem rather than a missing topic.',
        ex: 'Potential gap · Empirical — The studies reviewed here examine broadcast viewing; none of those identified addresses how young Saudi women choose Turkish serials on streaming platforms. Evidence: three reception studies (2015–2023) in the matrix, all on broadcast television.',
        weak: 'No one has ever studied Turkish drama in Saudi Arabia.',
        better: 'The reception studies reviewed here focus on broadcast viewing by adult audiences; how young Saudi women select and interpret Turkish serials on streaming platforms has received limited attention.',
        out: 'Expected output — an evidence-informed research gap or critical problem statement' },
      { h: 'Step 5 — Formulate the Research Problem', p: 'State the scholarly problem that follows from the context and the gap.',
        whyH: 'Topic, issue, problem, question and gap are different', why: 'A topic names an area (Turkish drama). A practical social issue describes a concern in society (young people watch a lot of foreign drama). A scholarly research problem states what is not understood and why that matters for knowledge (we do not know how platform viewing changes the negotiation of family values that earlier studies described). A research question asks something answerable; a gap describes what the literature lacks. Write the problem as a statement, not a question, and set its boundaries.',
        ex: 'Existing accounts of how Arab women negotiate family values through Turkish serials were developed for broadcast viewing; it remains unclear whether these negotiations change when viewing becomes individual, selective and on demand.',
        weak: 'Young people watch too much Turkish drama, which affects society.',
        better: 'It remains unclear whether the negotiation of family values described in broadcast-era studies persists when young Saudi women select Turkish serials individually on streaming platforms.',
        out: 'Expected output — a concise, academically defensible problem statement' },
      { h: 'Step 6 — Establish the Research Rationale and Significance', p: 'Explain why the study is needed now and for whom it matters.',
        whyH: 'Genuine significance, not exaggeration', why: 'The rationale explains why the problem deserves study: what will remain unclear if it is not studied, and why now. Significance names the kinds of value the study can have — theoretical, empirical, methodological, cultural, contextual or practical. Keep each claim proportionate to the design: a study of twenty viewers can deepen understanding, but it cannot “transform the field” or represent “all Arab audiences”.',
        ex: 'Because streaming is now the main route through which young Gulf viewers encounter imported drama, understanding their choices is necessary for updating reception theory and for regional platforms’ curation policies.',
        weak: 'This study is extremely important and will revolutionise our understanding of Arab audiences.',
        better: 'The study can show whether concepts developed for broadcast reception still explain platform viewing, a question relevant both to reception research and to regional streaming services.',
        out: 'Expected output — a well-supported rationale and significance statement' },
      { h: 'Step 7 — Formulate the Research Aim, Objectives and Questions', p: 'State the aim, objectives and questions, then check that they follow from the problem.',
        whyH: 'One argument from problem to question', why: 'The aim responds to the problem; objectives break the aim into steps; questions ask what the study will answer. Their form depends on the method: qualitative and interpretive studies use open questions (how, in what ways, what meanings); surveys and quantitative content analysis may examine measurable relationships and may test hypotheses derived from theory. The Research Alignment Checker below compares key terms across the problem, gap, aim, questions and contribution.',
        ex: 'Aim — This study explores how young Saudi women select and interpret Turkish serials on streaming platforms. Main question — How do young Saudi women negotiate family and romance in Turkish serials they choose to watch on streaming platforms?',
        weak: 'Do Saudi women like Turkish drama?',
        better: 'How do young Saudi women interpret family and romantic relationships in the Turkish serials they choose on streaming platforms?',
        out: 'Expected output — a coherent set of research aims, objectives and questions' },
      { h: 'Step 8 — Introduce the Theoretical or Conceptual Positioning', p: 'Briefly name the perspective that informs the study and why it suits the problem.',
        whyH: 'Positioning, not the full framework', why: 'In the introduction, one to three sentences are usually enough: the theory, concept or critical approach, the concepts you will use, and why they fit the problem. The full theoretical framework belongs in its own section. Not every study needs a named theory: exploratory or descriptive designs may rely on sensitising concepts, and that choice can be stated briefly.',
        ex: 'The study is informed by reception theory, particularly the concept of negotiated reading, which allows viewers’ interpretations to be read as active responses rather than effects.',
        weak: 'This study uses reception theory, cultivation theory, uses and gratifications, feminist theory and semiotics.',
        better: 'The study draws on reception theory, particularly negotiated reading, because the problem concerns how viewers reconcile imported narratives with local family norms.',
        out: 'Expected output — a concise theoretical or conceptual positioning statement' },
      { h: 'Step 9 — State the Study’s Contribution', p: 'Say what the study adds, in wording that matches the stage of your research.',
        whyH: 'Credible, proportionate claims', why: 'A contribution answers the reader’s question “so what?”. For a planned or ongoing study, use anticipatory wording (is expected to, aims to, may). For a completed study, refer to what the findings actually show. Avoid “the first study” or “the only research” unless you can show the search that supports it. A short statement of how the paper is organised may follow, especially in theses.',
        ex: 'The study is expected to extend reception research on Turkish drama to platform viewing and to clarify how selection and interpretation interact.',
        weak: 'This is the first and only study that will fill the gap completely.',
        better: 'The study is expected to add evidence from an under-represented audience and to refine concepts of negotiated reading for streaming-era viewing.',
        out: 'Expected output — a credible scholarly contribution statement' },
      { h: 'Step 10 — Construct the Complete Research Introduction', p: 'Assemble the eight moves, reorder or omit them, and edit the full draft.',
        whyH: 'An adaptable rhetorical progression', why: 'Each move is filled from your earlier steps using only your own words. Reorder the moves, switch optional ones off, edit any move, and edit the full draft directly. Subheadings are not added unless your publication permits or requires them (Step 1). The draft updates automatically until you edit it yourself.',
        ex: '', out: '' },
      { h: 'Step 11 — Academic Writing and Refinement', p: 'Check the argument, paragraphs, transitions, claims and references with transparent prompts.',
        whyH: 'Rule-based prompts, not automatic rewriting', why: 'The checks count long sentences and paragraphs, look for repeated words, clichéd openings, unsupported generalisations, claims about scholarship without citations, absolute gap claims, overclaiming, missing transitions, mixed person and unfinished placeholders, and detect cue words for each move. They point to places worth revising; you decide what to change. The tool does not paraphrase your text or change its meaning.',
        ex: 'Instead of “Studies have shown that audiences prefer local drama.” write “Several audience studies in the Gulf report a preference for local drama [references].”',
        out: '' },
      { h: 'Step 12 — Introduction Quality Evaluation', p: 'Review the automatic checks and rate the introduction on ten criteria.',
        whyH: 'Educational self-assessment', why: 'Suggested scores come from the rule-based checks and are only a starting point. Read each criterion, decide your own score and use the recommendations to revise. This rubric supports learning and revision; it is not a peer-review or supervisory decision.',
        ex: '', out: '' },
      { h: 'Step 13 — Final Introduction Report', p: 'Prepare your final version and a structured report you can edit, copy, print, save as PDF or export.',
        whyH: 'Researcher-reviewed final text', why: 'Paste or refine your final introduction, add the references you cited, then generate the report. Before submission, verify every citation against the original source and check that the introduction matches the methods, findings and conclusion of the full paper.',
        ex: '', out: '' }
    ],

    /* Field labels, hints and placeholders */
    f: {
      's1.title': { label: 'Research title', hint: 'Working or final title.', ph: 'e.g. Negotiating family and romance: Young Saudi women watching Turkish serials on streaming platforms' },
      's1.topic': { label: 'Main research topic', hint: 'One sentence naming what the study is about.', ph: 'e.g. Young Saudi women’s choice and interpretation of Turkish serials on streaming platforms' },
      's1.field': { label: 'Academic specialisation', hint: 'The area of film and television studies the study belongs to.' },
      's1.approach': { label: 'Research approach', hint: '' },
      's1.design': { label: 'Research design', hint: 'The list follows the approach you chose.' },
      's1.context': { label: 'Research context', hint: 'The institutional, industrial, historical or media context of the study.', ph: 'e.g. Regional streaming platforms (Shahid, Netflix MENA) after 2019' },
      's1.materials': { label: 'Films, series, audiences or materials', hint: 'What you analyse or whom you study.', ph: 'e.g. Turkish serials available on streaming platforms; women aged 18–30' },
      's1.scope': { label: 'Geographical and cultural scope', hint: 'Countries, communities, languages or periods covered.', ph: 'e.g. Riyadh and Jeddah, Saudi Arabia' },
      's1.venue': { label: 'Target publication type', hint: '' },
      's1.lang': { label: 'Writing language', hint: '' },
      's1.status': { label: 'Stage of the research', hint: 'This changes how cautiously the contribution is worded.' },
      's1.headings': { label: 'Subheadings in the introduction', hint: 'Check the journal or university template.' },
      's2.field': { label: 'Broad scholarly field', hint: 'The discipline or subfield the conversation belongs to.', ph: 'e.g. Television audience and reception studies' },
      's2.phenomenon': { label: 'Research phenomenon', hint: 'One sentence: the phenomenon your study addresses.', ph: 'e.g. Turkish serials have become one of the most watched forms of imported drama in the Gulf.' },
      's2.current': { label: 'Current academic or industry context', hint: 'One or two sentences: what is happening now that makes the topic timely.', ph: 'e.g. Since 2019, regional streaming platforms have made these serials available on demand.' },
      's2.setting': { label: 'Cultural or geographical setting', hint: 'Optional sentence on where the phenomenon takes place.', ph: 'e.g. In Saudi Arabia, young women form a large share of streaming subscribers.' },
      's2.importance': { label: 'Importance within film and television studies', hint: 'One sentence: why scholars in the field should care.', ph: 'e.g. Such shifts matter for reception research, which has explained the appeal of Turkish drama through broadcast viewing.' },
      's2.refs': { label: 'Supporting references (in-text citations)', hint: 'e.g. Author, Year; Author, Year. Added to the first sentence if it has no citation. List full references in Step 13.', ph: 'e.g. Berg et al., 2025' },
      's3.traditions': { label: 'Relevant research traditions', hint: 'Notes: schools or traditions of research (not shown in the draft).', ph: 'e.g. Transnational television studies; feminist reception studies' },
      's3.theories': { label: 'Theoretical approaches used in previous studies', hint: 'Notes.', ph: 'e.g. Cultural proximity; negotiated reading' },
      's3.findings': { label: 'Established findings', hint: 'Notes: what is reasonably well established.', ph: 'e.g. Appeal combines familiarity and aspirational modernity' },
      's3.debates': { label: 'Key scholarly debates', hint: 'A sentence with citations; it follows your synthesis in the draft.', ph: 'e.g. Scholars disagree on whether these serials unsettle or confirm family norms [references].' },
      's3.disagreements': { label: 'Areas of disagreement or contradictory findings', hint: 'A sentence with citations (optional).', ph: '' },
      's3.methods': { label: 'Methodological patterns', hint: 'A sentence on how previous studies were done (optional).', ph: 'e.g. Most of these studies rely on surveys of adult broadcast viewers [references].' },
      's3.synthesis': { label: 'Synthesis paragraph', hint: 'Connect several sources in each sentence; aim for 60–180 words with citations.', ph: 'e.g. Reception studies agree that… [references], whereas…' },
      's4.basis': { label: 'How did you search? (basis for the gap)', hint: 'Databases, search terms, years and languages. Required for a “supported” gap.', ph: 'e.g. Scopus, Web of Science and Al-Manhal, 2015–2025, terms “Turkish drama” AND (“audience” OR “reception”) AND (Saudi OR Gulf), Arabic and English' },
      's5.issue': { label: 'Central research issue', hint: 'The broad issue (may be practical or social).', ph: 'e.g. Platform viewing of imported drama among young Saudi women' },
      's5.problem': { label: 'Scholarly research problem', hint: 'A statement (not a question) of what is not understood and why it matters for knowledge.', ph: 'e.g. It remains unclear whether… because…' },
      's5.evidence': { label: 'Supporting evidence', hint: 'Studies, data or observations that show the problem is real.', ph: 'e.g. Broadcast-era studies [references]; platform data [reference]' },
      's5.tension': { label: 'Unresolved question or tension', hint: 'One sentence (optional) that sharpens the problem.', ph: 'e.g. Earlier studies describe negotiation in family viewing, yet platform viewing is individual.' },
      's5.boundaries': { label: 'Research boundaries', hint: 'What the study covers and leaves out; it follows the purpose in the draft.', ph: 'e.g. The study focuses on women aged 18–30 in two Saudi cities and on serials released after 2019.' },
      's5.relevance': { label: 'Relevance to the disciplinary approach', hint: 'Notes: why this problem belongs to your field and approach.', ph: 'e.g. A reception problem: meaning is made by viewers.' },
      's6.rationale': { label: 'Research rationale', hint: 'Why the study is needed now; what remains unclear without it.', ph: 'e.g. Because streaming is now the main route…, it is necessary to…' },
      's7.aim': { label: 'Main research aim', hint: 'A full sentence with a purpose verb: examines, explores, analyses, compares, assesses.', ph: 'e.g. This study explores how young Saudi women select and interpret Turkish serials on streaming platforms.' },
      's7.objectives': { label: 'Specific research objectives', hint: 'One per line, each starting with a verb (to identify, to analyse…).', ph: 'To identify…\nTo analyse…\nTo compare…' },
      's7.mainQ': { label: 'Main research question', hint: 'One answerable question that follows from the problem.', ph: 'e.g. How do young Saudi women negotiate family and romance in the Turkish serials they choose on streaming platforms?' },
      's7.subQs': { label: 'Supporting research questions', hint: 'One per line (optional).', ph: '' },
      's7.hypotheses': { label: 'Hypotheses (where relevant)', hint: 'For quantitative designs that test relationships derived from theory; one per line.', ph: 'e.g. H1: Frequency of platform viewing is positively associated with…' },
      's8.mode': { label: 'Type of positioning', hint: '' },
      's8.theory': { label: 'Theory or perspective', hint: 'Choose one, or “Other”.' },
      's8.theoryOther': { label: 'Theory or perspective (in your words)', hint: 'Name it as it appears in the literature.', ph: 'e.g. Transnational television flows' },
      's8.concepts': { label: 'Key theoretical concepts', hint: 'Two or three concepts you will actually use.', ph: 'e.g. negotiated reading, cultural proximity' },
      's8.approach': { label: 'Critical approach (optional)', hint: 'A sentence such as “It adopts a feminist reading of…”.', ph: '' },
      's8.relation': { label: 'Relationship between the theory and the problem', hint: 'One sentence: what the perspective helps you see in this problem.', ph: 'e.g. This lens treats viewers’ interpretations as active negotiations…' },
      's8.justification': { label: 'Justification for the selected perspective', hint: 'Why this lens rather than another; or why no formal theory is warranted.', ph: '' },
      's9.statement': { label: 'Overall contribution statement', hint: 'One or two sentences in wording that matches the stage of your research.', ph: 'e.g. The study is expected to…' },
      's9.organisation': { label: 'Organisation of the paper (optional)', hint: 'Common in theses and long articles.', ph: 'e.g. The article first reviews…, then describes…, before discussing…' },
      's11.terms': { label: 'Key terms to use consistently', hint: 'One per line; the checker reports terms that do not appear in the draft.', ph: 'streaming platforms\nnegotiated reading' },
      's12.self': { label: 'Reflection and revision plan (optional)', hint: 'What will you revise first?', ph: '' },
      's13.final': { label: 'Final research introduction', hint: 'Starts from your Step 10 draft; edit freely.', ph: '' },
      's13.refs': { label: 'References cited in the introduction (APA 7)', hint: 'One per line. Full references entered in the citation matrix are added automatically to the report.', ph: 'e.g. Author, A. A. (Year). Title. Journal, volume(issue), pages. https://doi.org/…' },
      's13.notes': { label: 'Notes for your supervisor (optional)', hint: '', ph: '' }
    },
    approaches, designs, fields, venues, langs, statuses, headingModes, gapTypes, gapStatuses, relTypes, sigTypes, contribTypes, theoryModes, theories, moveNames,
    gapStatusName: { limited: 'Limited attention', potential: 'Potential gap', supported: 'Supported gap', critical: 'Critical problem' },
    moveHints: {
      territory: 'From Step 2: the phenomenon, current context, setting and importance.',
      scholarly: 'From Step 3: your synthesis, debates, disagreements and methodological patterns.',
      gap: 'From Steps 4–5: the primary gap with its evidence, then the problem statement.',
      rationale: 'From Step 6: rationale and the significance you selected.',
      purpose: 'From Steps 7 and 5: the aim and the boundaries of the study.',
      questions: 'From Step 7: objectives, questions and hypotheses.',
      theory: 'From Step 8: theoretical or conceptual positioning.',
      contribution: 'From Step 9: contribution and, if given, the organisation of the paper.'
    },
    headingDefaults: { territory: 'Background', scholarly: 'Previous research', gap: 'Research gap and problem', rationale: 'Rationale and significance', purpose: 'Purpose of the study', questions: 'Research questions', theory: 'Theoretical perspective', contribution: 'Contribution and structure' },

    /* Templates: they only arrange the researcher's own entries. */
    tpl: {
      profile: (st) => {
        const s = st.s1, L = [];
        const add = (k, v) => { if (has(v)) L.push(k + ': ' + T(v)); };
        add('Title', s.title); add('Topic', s.topic); add('Specialisation', pick(fields, s.field).t);
        add('Approach and design', [pick(approaches, s.approach).t, pick(designs, s.design).t].filter(has).join(' — '));
        add('Context', s.context); add('Materials or participants', s.materials); add('Scope', s.scope);
        add('Publication', pick(venues, s.venue).t); add('Language', pick(langs, s.lang).t); add('Stage', pick(statuses, s.status).t); add('Subheadings', pick(headingModes, s.headings).t);
        return L.join('\n');
      },
      territory: (st) => join([withCite(st.s2.phenomenon, st.s2.refs), end(st.s2.current), end(st.s2.setting), end(st.s2.importance)]),
      scholarly: (st) => join([end(st.s3.synthesis), end(st.s3.debates), end(st.s3.disagreements), end(st.s3.methods)]),
      gap: (st, x) => {
        const g = x && x.gap; let lead = '';
        if (g && has(g.statement)) {
          const s = end(g.statement);
          if (g.status === 'limited') { const lc = lcFirst(s); lead = startsConnector(s) ? s : lc ? 'However, ' + lc : s; }
          else if (g.status === 'potential') lead = 'The studies reviewed here point to a possible gap: ' + s;
          else if (g.status === 'supported') lead = (has(st.s4.basis) ? 'A review of ' + frag(st.s4.basis) + ' points to the following gap: ' : 'The literature reviewed points to the following gap: ') + s;
          else if (g.status === 'critical') lead = 'This raises a critical problem: ' + s;
          else lead = s;
        }
        return join([lead, g ? end(g.evidence) : '', end(st.s5.problem), end(st.s5.tension)]);
      },
      rationale: (st) => join([end(st.s6.rationale)].concat(sigTypes.filter((t) => st.s6.sig.indexOf(t.id) !== -1).map((t) => end(st.s6.sigText[t.id])))),
      purpose: (st) => join([end(st.s7.aim), end(st.s5.boundaries)]),
      questions: (st, x) => {
        const L = x && x.lines ? x.lines : (t) => String(t || '').split(/\n+/).filter(has);
        const obj = L(st.s7.objectives).map((o) => frag(o).replace(/^to\s+/i, '')).map((o) => o.charAt(0).toLowerCase() + o.slice(1));
        const sq = L(st.s7.subQs).map(qmark), hy = L(st.s7.hypotheses).map(frag);
        return join([
          obj.length ? 'Specifically, it seeks to ' + listJoin(obj) + '.' : '',
          has(st.s7.mainQ) ? 'The study addresses the following main question: ' + qmark(st.s7.mainQ) : '',
          sq.length ? 'It also asks: ' + sq.map((q, i) => '(' + (i + 1) + ') ' + q).join(' ') : '',
          hy.length ? 'The following hypotheses are tested: ' + hy.join('; ') + '.' : ''
        ]);
      },
      theory: (st) => {
        const s = st.s8; if (!s.mode || s.mode === 'none') return '';
        const nm = has(s.theoryOther) ? frag(s.theoryOther) : frag(pick(theories, s.theory).n);
        const first = has(nm) ? 'The study is informed by ' + nm + (has(s.concepts) ? ', drawing in particular on ' + frag(s.concepts) : '') + '.' : has(s.concepts) ? 'The study draws on the concepts of ' + frag(s.concepts) + '.' : '';
        return join([first, end(s.approach), end(s.relation), end(s.justification)]);
      },
      contribution: (st) => join([end(st.s9.statement)].concat(contribTypes.filter((t) => st.s9.types.indexOf(t.id) !== -1).map((t) => end(st.s9.typeText[t.id]))).concat([end(st.s9.organisation)]))
    },

    /* Transparent word lists used by the rule engine */
    lex: {
      longLimit: 40, paraMax: 220,
      stop: ['about', 'after', 'against', 'among', 'which', 'their', 'there', 'these', 'those', 'where', 'while', 'would', 'could', 'should', 'study', 'studie', 'studi', 'research', 'film', 'television', 'drama', 'with', 'from', 'that', 'this', 'have', 'been', 'into', 'than', 'they', 'them', 'also', 'such', 'other', 'between', 'through', 'within', 'however', 'whether', 'because'],
      stopOverlap: ['this', 'that', 'these', 'those', 'with', 'from', 'into', 'study', 'studies', 'research', 'paper', 'article', 'thesis', 'aims', 'examine', 'examines', 'explore', 'explores', 'analyse', 'analyses', 'analyze', 'analysis', 'investigate', 'investigates', 'understand', 'question', 'questions', 'what', 'which', 'when', 'where', 'there', 'their', 'have', 'been', 'does', 'more', 'most', 'remains', 'unclear', 'little', 'known', 'limited', 'attention', 'existing', 'previous', 'however', 'whether', 'about', 'through', 'within', 'between', 'among', 'other', 'such', 'also', 'expected', 'contribute', 'contribution', 'provide', 'offer', 'will', 'would', 'could', 'should', 'how', 'why', 'gap', 'problem', 'issue', 'aim', 'objective'],
      vague: ['various', 'some aspects', 'a lot of', 'many things', 'interesting', 'certain issues', 'and so on', 'etc', 'very'],
      overclaim: ['first study', 'the first', 'the only', 'only study', 'unique', 'revolutionise', 'revolutionize', 'revolutionary', 'groundbreaking', 'ground-breaking', 'transform the field', 'fill the gap completely', 'fully explain', 'prove', 'proves', 'definitive', 'extremely important', 'of great importance', 'paramount importance', 'novel contribution'],
      absolute: ['no study', 'no studies', 'no research', 'no previous', 'never been studied', 'never been examined', 'has not been studied at all', 'has never', 'nobody has', 'no one has', 'completely ignored', 'totally neglected', 'entirely absent', 'none of the studies'],
      absence: ['no study', 'no studies', 'no research', 'not been studied', 'not been examined', 'never', 'absent', 'lack of studies'],
      generalise: ['all audiences', 'all viewers', 'everyone', 'everybody', 'always', 'all arab', 'all women', 'all films', 'it is well known', 'it is widely known', 'it is clear that', 'undoubtedly', 'without doubt', 'obviously', 'clearly shows', 'in every', 'all societies'],
      cliche: ['since the beginning', 'since the dawn', 'throughout history', 'since ancient times', 'in today’s world', "in today's world", 'nowadays', 'in the modern world', 'in our modern', 'from time immemorial', 'everyone knows', 'it is well known', 'in this day and age'],
      claimCues: ['studies show', 'studies have shown', 'research shows', 'research has shown', 'research suggests', 'scholars argue', 'scholars have argued', 'it has been found', 'previous studies', 'previous research', 'the literature', 'evidence suggests', 'has been widely', 'many studies', 'several studies', 'critics have'],
      reportVerbs: ['found', 'finds', 'argued', 'argues', 'showed', 'shows', 'studied', 'examined', 'examines', 'explored', 'explores', 'investigated', 'reported', 'concluded', 'analysed', 'analyzed', 'noted', 'suggested', 'stated', 'discussed'],
      synthesisCues: ['similarly', 'likewise', 'in contrast', 'by contrast', 'whereas', 'while', 'however', 'together', 'across', 'both', 'consistent with', 'agree', 'disagree', 'diverge', 'converge', 'taken together', 'collectively', 'most of these', 'several studies', 'in common'],
      tension: ['remains unclear', 'unclear', 'little is known', 'not known', 'unknown', 'yet', 'however', 'although', 'tension', 'contradict', 'contradictory', 'debate', 'disagree', 'overlook', 'overlooked', 'underexplored', 'under-explored', 'limited', 'insufficient', 'neglected', 'problematic', 'paradox', 'whether'],
      social: ['society', 'youth', 'young people', 'harmful', 'negative effect', 'negative effects', 'addiction', 'danger', 'dangerous', 'moral', 'problem in society', 'values are threatened'],
      scholarly: ['studies', 'research', 'scholars', 'scholarship', 'literature', 'theory', 'theoretical', 'concept', 'evidence', 'analysis', 'explain', 'understood', 'understanding'],
      purposeVerbs: ['examines', 'examine', 'explores', 'explore', 'analyses', 'analyse', 'analyzes', 'analyze', 'investigates', 'investigate', 'compares', 'compare', 'assesses', 'assess', 'evaluates', 'evaluate', 'identifies', 'identify', 'interprets', 'interpret', 'traces', 'trace', 'develops', 'develop', 'tests', 'test', 'aims to', 'seeks to', 'reads', 'considers'],
      objectiveVerbs: ['to', 'identify', 'analyse', 'analyze', 'examine', 'explore', 'compare', 'assess', 'evaluate', 'describe', 'determine', 'interpret', 'investigate', 'develop', 'map', 'trace', 'measure', 'test', 'establish', 'understand'],
      yesNoStart: ['do', 'does', 'did', 'is', 'are', 'was', 'were', 'can', 'could', 'will', 'has', 'have', 'should'],
      measurableQ: ['relationship', 'relationships', 'associated', 'association', 'correlat', 'difference', 'differences', 'effect', 'effects', 'predict', 'predicts', 'influence', 'extent', 'level', 'levels', 'frequency', 'how often', 'how many', 'how much', 'proportion', 'compare', 'compared', 'impact'],
      certainty: ['demonstrates', 'demonstrate', 'shows', 'show', 'proves', 'prove', 'confirms', 'confirm', 'reveals', 'reveal', 'establishes', 'establish'],
      modal: ['expected', 'may', 'might', 'could', 'aims to', 'seeks to', 'is likely', 'potential', 'potentially', 'would', 'will help', 'intends', 'anticipated'],
      transitions: ['because', 'given', 'since', 'the studies reviewed', 'the study', 'taken together', 'in light of', 'however', 'yet', 'moreover', 'furthermore', 'in addition', 'similarly', 'in contrast', 'by contrast', 'therefore', 'thus', 'consequently', 'accordingly', 'nevertheless', 'although', 'while', 'despite', 'building on', 'against this background', 'to address', 'in response', 'this study', 'the present study', 'this article', 'drawing on', 'specifically', 'finally', 'first', 'second', 'as a result', 'for this reason', 'in this context', 'within this'],
      firstI: [' i ', 'my study', 'i will', 'i argue', 'i examine'],
      firstWe: ['we ', 'our study', 'we argue', 'we examine'],
      thirdPerson: ['the researcher', 'the researchers', 'the author'],
      moveCues: {
        territory: ['has become', 'have become', 'increasingly', 'widely', 'in recent years', 'growing', 'popular', 'prominent', 'central', 'major', 'expansion', 'rise of'],
        scholarly: ['studies', 'research has', 'scholars', 'previous research', 'literature', 'have shown', 'has examined', 'have examined', 'argue', 'argued', 'et al'],
        gap: ['however', 'yet', 'little', 'few studies', 'remains', 'unclear', 'underexplored', 'limited attention', 'overlooked', 'gap', 'tension', 'debate', 'contradict', 'neglected'],
        rationale: ['therefore', 'necessary', 'needed', 'need to', 'matters', 'significant', 'important because', 'timely', 'rationale', 'warrants', 'it is essential'],
        purpose: ['this study', 'this article', 'this paper', 'this thesis', 'aims to', 'the aim', 'the purpose', 'examines', 'explores', 'investigates', 'analyses', 'analyzes'],
        questions: ['research question', 'research questions', 'asks', 'objectives', 'seeks to', 'hypothesis', 'hypotheses', 'how do', 'in what ways'],
        theory: ['theory', 'theoretical', 'framework', 'concept', 'concepts', 'drawing on', 'informed by', 'perspective', 'lens'],
        contribution: ['contributes', 'contribution', 'contribute', 'extends', 'adds to', 'offers', 'implications', 'advances', 'is organised', 'is organized', 'is structured', 'proceeds as follows']
      }
    },

    statusLabel: { ok: 'Good', warn: 'Revise', bad: 'Missing', info: 'Note' },

    /* Messages of the rule-based checks: each key gives a title and one function per status. */
    gapMsg: {
      ok: { t: 'Gap evidence', ok: () => 'The claim, its evidence and its level are consistent.' },
      noStatement: { t: 'Gap statement', bad: () => 'Write the gap or problem as one clear sentence.' },
      noEvidence: { t: 'Evidence', bad: () => 'Every gap needs evidence: cite or link the studies that show it, or describe the tension.' },
      supportedNoBasis: { t: 'Search basis', warn: () => 'A “supported” gap needs a transparent search: name the databases, terms, years and languages, or choose “potential gap”.' },
      supportedThin: { t: 'Evidence base', warn: () => 'A supported gap usually rests on several studies. Link at least two studies from the matrix or cite them in the evidence.' },
      absolute: { t: 'Absolute claim', warn: (x) => 'Avoid absolute wording such as “' + x.list.join('”, “') + '” unless a transparent search supports it. Prefer “the studies reviewed here…” or “has received limited attention”.' },
      absenceCritical: { t: 'Critical problem', info: () => 'A critical problem does not need to claim that no studies exist; state the tension or contradiction instead.' },
      twoSides: { t: 'Two positions', warn: () => 'Contradictions and debates need at least two positions: link or cite the studies on each side.' },
      noStatus: { t: 'Level of the claim', warn: () => 'Choose whether this is limited attention, a potential gap, a supported gap or a critical problem.' },
      noStudies: { t: 'Matrix links', info: () => 'Link the studies from the citation matrix that support this gap, or add citations to the evidence.' }
    },
    claimMsg: {
      ok: { t: 'Claim', ok: () => 'No absolute, exaggerated or unsupported wording detected.' },
      absolute: { t: 'Absolute claim', warn: (x) => 'Absolute wording: ' + x.list.join(', ') + '. State the basis of the claim or soften it.' },
      overclaim: { t: 'Overclaiming', warn: (x) => 'Exaggerated wording: ' + x.list.join(', ') + '. Describe the contribution precisely instead.' },
      general: { t: 'Generalisation', warn: (x) => 'Sweeping generalisation: ' + x.list.join(', ') + '. Limit the claim to what the evidence covers.' },
      unsupported: { t: 'Claims without citations', warn: (x) => 'These sentences refer to scholarship without a citation: ' + x.list.join(' | ') }
    },
    problemMsg: {
      ok: { t: 'Problem statement', ok: () => 'The problem is stated as a scholarly tension with its boundaries.' },
      question: { t: 'Question form', warn: () => 'This reads as a research question. State the problem as a statement; put the question in Step 7.' },
      noTension: { t: 'Tension', info: () => 'No sign of tension (remains unclear, yet, contradiction, little is known…). Check that this is a problem and not only a topic.' },
      social: { t: 'Practical issue', warn: () => 'This sounds like a social concern. Show what is not understood in scholarship and support it with evidence.' },
      noBoundaries: { t: 'Boundaries', info: () => 'State what the study covers (population, texts, period, place) and what it leaves out.' },
      long: { t: 'Length', warn: () => 'The problem statement is long. Keep the core problem to one or two sentences.' }
    },
    synthMsg: {
      cites: { t: 'Citations', ok: (x) => x.n + ' citations found in the synthesis.', warn: (x) => (x.n ? 'Only ' + x.n + ' citation(s)' : 'No citations') + ' found. A synthesis connects several sources.' },
      chain: { t: 'List of summaries', warn: () => 'Most sentences begin with “Author (Year) found…”. Group the studies by what they show or where they disagree.' },
      noCues: { t: 'Connecting language', info: () => 'Use words that relate sources: similarly, whereas, in contrast, across these studies, taken together.' },
      matrixUnused: { t: 'Matrix', info: () => 'None of the authors in your matrix appear in the synthesis.' },
      matrixUsed: { t: 'Matrix', ok: (x) => x.n + ' author(s) from your matrix appear in the synthesis.' }
    },
    contextMsg: {
      ok: { t: 'Opening context', ok: () => 'The opening is focused and avoids clichés.' },
      cliche: { t: 'Clichéd opening', warn: (x) => 'The first sentence opens with “' + x.list.join(', ') + '”. Begin close to your phenomenon.' },
      general: { t: 'Generalisation', warn: (x) => 'Sweeping wording: ' + x.list.join(', ') + '.' },
      noCite: { t: 'Support', info: () => 'No citation yet. Factual claims about the field or industry need references.' },
      long: { t: 'Length', warn: () => 'The opening context is long. Keep only what the argument needs.' }
    },
    rationaleMsg: {
      ok: { t: 'Rationale', ok: () => 'The rationale is proportionate.' },
      overclaim: { t: 'Exaggeration', warn: (x) => 'Exaggerated or absolute wording: ' + x.list.join(', ') + '.' },
      noTypes: { t: 'Significance', info: () => 'Select at least one type of significance and explain it.' },
      sigEmpty: { t: 'Significance', info: () => 'Some selected types of significance have no explanation yet.' }
    },
    contribMsg: {
      ok: { t: 'Contribution', ok: () => 'The contribution is worded in proportion to the evidence and the stage of research.' },
      overclaim: { t: 'Overclaiming', warn: (x) => 'Avoid: ' + x.list.join(', ') + '.' },
      certainty: { t: 'Wording and stage', warn: (x) => 'Your study is not completed, but the contribution uses “' + x.list.join(', ') + '”. Use anticipatory wording: is expected to, aims to, may.' },
      noLink: { t: 'Link to the gap', info: () => 'The contribution shares no key terms with the gap or problem. Show that it answers that gap.' },
      noTypes: { t: 'Types', info: () => 'Select the kind(s) of contribution to make the statement precise.' }
    },
    theoryMsg: {
      ok: { t: 'Positioning', ok: () => 'The perspective is named and related to the problem.' },
      noneOk: { t: 'No formal theory', ok: () => 'You explain why no formal theory is used.' },
      noneWhy: { t: 'No formal theory', info: () => 'Briefly justify why the design does not need a formal theory.' },
      nameDrop: { t: 'Too many theories', warn: () => 'Several theories are listed. Choose the one or two that you will actually use.' },
      noRelation: { t: 'Relation to the problem', warn: () => 'Explain what this perspective helps you see in your problem.' },
      noConcepts: { t: 'Concepts', info: () => 'Name the two or three concepts you will use.' },
      noLinkQ: { t: 'Link to the questions', info: () => 'The concepts share no terms with the aim, question or problem. Check the connection.' }
    },
    alignMsg: {
      core: { t: 'Core elements', bad: (x) => 'Missing: ' + x.list.map((k) => ({ problem: 'research problem (Step 5)', aim: 'aim', question: 'main question' }[k])).join(', ') + '.' },
      probAim: { t: 'Problem → aim', ok: (x) => 'Shared key terms: ' + x.list.join(', ') + '.', warn: () => 'The aim shares no key terms with the problem. Make sure the aim responds to the problem.' },
      aimQ: { t: 'Aim → main question', ok: (x) => 'Shared key terms: ' + x.list.join(', ') + '.', warn: () => 'The main question shares no key terms with the aim.' },
      gapAim: { t: 'Gap → aim', ok: (x) => 'Shared key terms: ' + x.list.join(', ') + '.', warn: () => 'The aim and problem do not echo the gap. Readers should see that the study addresses that gap.' },
      aimVerb: { t: 'Purpose verb', ok: () => 'The aim states a purpose.', warn: () => 'Use a purpose verb (examines, explores, analyses, compares…) so that the aim is not just a topic.' },
      objForm: { t: 'Objectives', ok: (x) => x.n + ' objective(s), each beginning with a verb.', warn: (x) => x.n > 6 ? x.n + ' objectives are many for one introduction; combine related ones.' : 'Start each objective with a verb: ' + x.list.join(' | '), info: () => 'No objectives entered (optional for many journal articles).' },
      qType: { t: 'Question type and design', ok: (x) => x.kind === 'survey' || x.kind === 'qcontent' ? 'The questions or hypotheses address measurable relationships, suitable for the design.' : 'The questions are open and exploratory, suitable for the design.', warn: (x) => x.kind === 'survey' || x.kind === 'qcontent' ? 'For this design, questions usually name measurable variables or relationships (extent, difference, association), or hypotheses are stated.' : 'Yes/no questions limit qualitative and interpretive inquiry: ' + (x.list || []).join(' | ') + '. Ask how, in what ways or what meanings.', info: () => 'In mixed methods, state questions for each strand and, if possible, one integration question.' },
      hyp: { t: 'Hypotheses', warn: () => 'Hypotheses are unusual in qualitative or critical designs; consider removing them or using open questions.', info: () => 'This design often tests hypotheses derived from theory; add them if your field expects them.' },
      subQ: { t: 'Questions and objectives', info: (x) => x.a + ' objectives but ' + x.b + ' supporting questions. Usually each objective corresponds to a question.' },
      contribGap: { t: 'Contribution → gap', ok: (x) => 'Shared key terms: ' + x.list.join(', ') + '.', warn: () => 'The contribution does not echo the gap or problem. State what the study adds in relation to that gap.' },
      theoryQ: { t: 'Theory → questions', info: () => 'Explain the relationship between your theory and the problem (Step 8).' }
    },
    langMsg: {
      long: { t: 'Sentence length', ok: () => 'No very long sentences.', warn: (x) => x.n + ' sentence(s) over 40 words: ' + x.list.join(' | ') },
      repeat: { t: 'Repetition', ok: () => 'No word is repeated unusually often.', warn: (x) => 'Frequently repeated: ' + x.list.join(', ') + '. Vary the wording or use pronouns where meaning stays clear.' },
      cliche: { t: 'Opening sentence', warn: (x) => 'The introduction opens with a cliché (' + x.list.join(', ') + '). Start with your phenomenon.' },
      general: { t: 'Unsupported generalisation', warn: (x) => 'Sweeping wording: ' + x.list.join(', ') + '. Limit or support the claim.' },
      unsupported: { t: 'Claims and references', warn: (x) => 'Claims about scholarship without a citation: ' + x.list.join(' | ') },
      absolute: { t: 'Absolute gap claim', warn: (x) => 'Absolute wording: ' + x.list.join(', ') + '. Is it supported by a transparent search?' },
      overclaim: { t: 'Overclaiming', warn: (x) => 'Exaggerated wording: ' + x.list.join(', ') + '.' },
      vague: { t: 'Vague wording', info: (x) => 'Vague words: ' + x.list.join(', ') + '. Be specific.' },
      paraLong: { t: 'Paragraph length', warn: (x) => x.n + ' paragraph(s) over 220 words. Split by function (context, scholarship, gap…).' },
      paraShort: { t: 'One-sentence paragraphs', info: (x) => x.n + ' paragraph(s) with one sentence. Develop or merge them.' },
      transitions: { t: 'Transitions', ok: (x) => x.n + ' of ' + x.m + ' paragraphs open with a linking expression.', warn: (x) => 'Only ' + x.n + ' of ' + x.m + ' paragraphs open with a linking expression. Show how each paragraph follows from the previous one.' },
      person: { t: 'Consistent voice', info: (x) => 'Several voices are used (' + x.list.join(', ').trim() + '). Choose one, following the journal.' },
      abbr: { t: 'Abbreviations', info: (x) => 'Define on first use: ' + x.list.join(', ') + '.' },
      placeholder: { t: 'Placeholders', bad: (x) => 'Unfinished placeholders: ' + x.list.join(', ') + '. Replace them with real citations or text.' },
      terms: { t: 'Key terms', ok: (x) => 'All ' + x.n + ' key terms appear in the draft.', warn: (x) => 'Key terms not found in the draft: ' + x.list.join(', ') + '. Check that you use one consistent term.' }
    },
    checkText: {
      draft: { t: 'Introduction draft', bad: 'No draft yet. Build it in Step 10.' },
      length: { t: 'Length', info: (a) => a[0] + ' words in ' + a[1] + ' paragraph(s). Journal introductions are often a few paragraphs; follow your target publication.' },
      moves: { t: 'Essential moves', ok: 'Territory, scholarly context, gap and purpose are present.', warn: (m) => 'Possibly missing: ' + m + '.', bad: (m) => 'Missing an essential move: ' + m + '.' },
      gapEvidence: { t: 'Gap and evidence', ok: (s) => 'The gap has evidence' + (s ? ' (' + s + ')' : '') + '.', warn: (s) => 'The evidence does not yet support the level claimed' + (s ? ' (' + s + ')' : '') + '.', bad: 'No gap or critical problem with evidence (Step 4).' },
      gapClaim: { t: 'Absolute gap claims', ok: 'No absolute “no study has…” claims.', warn: (m) => 'Absolute wording without a transparent search: ' + m + '.' },
      problem: { t: 'Research problem', ok: 'The problem is a scholarly statement.', warn: (m) => 'Revise the problem: ' + m + '.', bad: 'No research problem (Step 5).' },
      alignment: { t: 'Alignment', ok: 'Problem, gap, aim, questions and contribution are connected.', warn: (m) => 'Check: ' + m + '.', bad: 'Problem, aim or main question missing.' },
      theory: { t: 'Theoretical positioning', ok: 'Positioning is stated or its absence is justified.', warn: 'Choose a positioning in Step 8 and relate it to the problem.' },
      contribution: { t: 'Contribution', ok: 'Credible, proportionate contribution.', warn: (m) => 'Revise the wording of the contribution' + (m ? ': ' + m : '') + '.', bad: 'No contribution statement (Step 9).' },
      citations: { t: 'Citations', ok: (n) => n + ' in-text citations.', warn: (n) => 'Only ' + n + ' citation(s). Introductions normally support context, background and gap with references.', bad: 'No in-text citations found.' },
      unsupported: { t: 'Claims and references', ok: 'Claims about scholarship are cited.', warn: (n) => n + ' sentence(s) refer to scholarship without a citation.' },
      general: { t: 'Generalisations', ok: 'No sweeping generalisations.', warn: (m) => 'Sweeping wording: ' + m + '.' },
      opening: { t: 'Opening sentence', ok: 'The opening avoids clichés.', warn: (m) => 'Clichéd opening: ' + m + '.' },
      paragraphs: { t: 'Paragraphs', ok: 'Paragraph length is reasonable.', warn: (n) => n ? n + ' very long paragraph(s).' : 'The introduction is one long block; divide it into paragraphs by function.' },
      transitions: { t: 'Transitions', ok: (a) => a[0] + ' of ' + a[1] + ' paragraphs open with a link.', warn: (a) => 'Only ' + a[0] + ' of ' + a[1] + ' paragraphs open with a link.' },
      headings: { t: 'Subheadings', ok: 'Subheadings follow the publication setting.', warn: (m) => m ? 'Lines that look like subheadings although none are permitted: ' + m + '.' : 'Your publication requires subheadings; switch them on in Step 10.' },
      placeholder: { t: 'Placeholders', bad: (m) => 'Replace: ' + m + '.' },
      language: { t: 'Language', warn: (l) => l === 'ar' ? 'The required language is Arabic, but the draft is not mainly Arabic.' : 'The required language is English, but the draft is not mainly English.' }
    },

    /* Rubric (Step 12 and Tool G) */
    rubric: [
      { id: 'context', t: 'Relevance of the broader context', d: 'Focused, current and supported opening that leads to the topic.' },
      { id: 'background', t: 'Quality of scholarly background', d: 'Critical synthesis of the most relevant studies, not a list.' },
      { id: 'gap', t: 'Evidence for the gap or critical problem', d: 'The gap is claimed at the right level and supported by evidence.' },
      { id: 'problem', t: 'Clarity of the research problem', d: 'A scholarly problem with tension and boundaries.' },
      { id: 'rationale', t: 'Strength of the rationale', d: 'Why the study is needed now, without exaggeration.' },
      { id: 'alignment', t: 'Alignment of aims, objectives and questions', d: 'Aim, objectives and questions follow from the problem and suit the design.' },
      { id: 'theory', t: 'Appropriate theoretical positioning', d: 'A brief, relevant positioning or a justified absence of theory.' },
      { id: 'contribution', t: 'Clarity and credibility of contribution', d: 'Specific, proportionate and linked to the gap.' },
      { id: 'coherence', t: 'Coherence and logical organisation', d: 'Moves follow logically, with clear paragraphs and transitions.' },
      { id: 'language', t: 'Academic language and referencing accuracy', d: 'Precise, concise language; claims supported by accurate citations.' }
    ],
    rubricDesc: {
      context: ['Broad, clichéd or unsupported opening.', 'Relevant but general; some claims lack support.', 'Focused, current and referenced; leads directly to the topic.'],
      background: ['Absent or a list of summaries.', 'Relevant studies, partly synthesised.', 'Synthesised by themes, debates and methods, with citations.'],
      gap: ['No gap, or an absolute claim without evidence.', 'Gap stated with some evidence, level unclear.', 'Gap or problem claimed at the right level with clear evidence.'],
      problem: ['Topic or social concern, not a problem.', 'Problem stated but vague or without boundaries.', 'Precise scholarly problem with tension, evidence and boundaries.'],
      rationale: ['Missing or exaggerated.', 'Plausible but general.', 'Specific, timely and proportionate.'],
      alignment: ['Aim or questions missing or unrelated to the problem.', 'Mostly aligned; some terms or forms do not match.', 'Problem, aim, objectives, questions and design fully aligned.'],
      theory: ['Missing, or a list of theories.', 'Named but not related to the problem.', 'Brief, relevant and justified (or absence justified).'],
      contribution: ['Missing or overclaimed (“first”, “only”).', 'Stated but general or weakly linked to the gap.', 'Specific, credible and worded for the research stage.'],
      coherence: ['Moves out of order; abrupt shifts.', 'Logical overall; some paragraphs or transitions weak.', 'Clear progression; each paragraph has one function and links to the next.'],
      language: ['Many errors, generalisations or missing citations.', 'Generally clear; some imprecision or unsupported claims.', 'Precise, concise, consistent and accurately referenced.']
    },
    rubricRec: {
      context: 'Open with the specific phenomenon, add current evidence with citations and remove historical background the argument does not need.',
      background: 'Group studies by finding, method or position and write sentences that connect several sources; keep detail for the Literature Review.',
      gap: 'Choose the honest level of the gap (Step 4), link supporting studies and describe your search; replace absolute claims.',
      problem: 'Rewrite the problem as a statement of what is not understood and why it matters; add evidence and boundaries.',
      rationale: 'Explain what will remain unclear without the study and why now; remove exaggerated adjectives.',
      alignment: 'Repeat the key terms of the problem in the aim and questions; adjust the question form to your design.',
      theory: 'Name one perspective and one or two concepts and explain what they let you see in the problem; or justify not using a formal theory.',
      contribution: 'State the kind of contribution and link it to the gap; use anticipatory wording if the study is not completed.',
      coherence: 'Give each paragraph one function, open it with a link to the previous one, and follow the order in Step 10.',
      language: 'Cite every claim about scholarship, shorten long sentences, remove clichés and check references against sources.'
    },
    levels: [
      { min: 4.5, t: 'Ready for supervisor review', d: 'The introduction is coherent and well supported. Verify citations and polish.' },
      { min: 3.5, t: 'Solid draft — targeted revision', d: 'Revise the criteria rated 3 or below.' },
      { min: 2.5, t: 'Developing — revise key parts', d: 'Strengthen the gap, problem and alignment before polishing language.' },
      { min: 0, t: 'Early draft — rebuild the argument', d: 'Return to Steps 2–9 to clarify the argument before rewriting.' }
    ],

    /* Tool E — coherence checklist */
    checklist: [
      { id: 'open', t: 'Focused opening', d: 'The first sentence introduces the phenomenon, not world history.' },
      { id: 'funnel', t: 'From general to specific', d: 'Each paragraph narrows the focus towards the gap.' },
      { id: 'one', t: 'One function per paragraph', d: 'Context, scholarship, gap, purpose… are not mixed in one paragraph.' },
      { id: 'topic', t: 'Topic sentences', d: 'Each paragraph opens with a sentence that states its point.' },
      { id: 'trans', t: 'Transitions', d: 'Each paragraph links to the previous one (however, building on this, to address this…).' },
      { id: 'synth', t: 'Synthesis', d: 'Studies are grouped and compared, not summarised one by one.' },
      { id: 'gap', t: 'Gap at the right level', d: 'The gap is supported by evidence and not overstated.' },
      { id: 'prob', t: 'Problem follows from the gap', d: 'The problem grows out of the context and scholarship.' },
      { id: 'aim', t: 'Aim answers the problem', d: 'Aim and questions repeat the key terms of the problem.' },
      { id: 'theory', t: 'Brief positioning', d: 'Theory is introduced briefly and linked to the problem.' },
      { id: 'contr', t: 'Proportionate contribution', d: 'No “first” or “only” claims; wording fits the research stage.' },
      { id: 'terms', t: 'Consistent terminology', d: 'Key terms are defined once and used consistently.' },
      { id: 'cite', t: 'Claims are cited', d: 'Every statement about scholarship or industry has a reference.' },
      { id: 'match', t: 'Matches the paper', d: 'The introduction promises only what the methods and findings deliver.' }
    ],

    /* Tool A — structure builder */
    selector: {
      q: [
        { id: 'kind', t: 'What kind of study is it?', o: [{ id: 'textual', t: 'Interpretive film or TV analysis' }, { id: 'critical', t: 'Critical / theoretical argument' }, { id: 'qual', t: 'Qualitative audience or production study' }, { id: 'quant', t: 'Survey or quantitative content analysis' }, { id: 'mixed', t: 'Mixed methods' }] },
        { id: 'venue', t: 'Where will it appear?', o: [{ id: 'journal', t: 'Journal' }, { id: 'thesis', t: 'Thesis' }, { id: 'conference', t: 'Conference' }, { id: 'chapter', t: 'Book chapter' }] },
        { id: 'status', t: 'Stage of the research', o: [{ id: 'proposal', t: 'Planned / in progress' }, { id: 'completed', t: 'Completed' }] }
      ],
      why: {
        textual: 'Interpretive analyses often build their case around a critical puzzle or a reading that existing scholarship has not offered; the theoretical lens is introduced early because it shapes the reading.',
        critical: 'A critical argument often states the problem early and positions it against existing readings; explicit research questions are optional and may be implicit in the argument.',
        qual: 'Qualitative audience and production studies usually move from context and prior studies to a gap, then state an exploratory aim and open questions; theory may be introduced briefly after the questions.',
        quant: 'Surveys and quantitative content analyses usually introduce theory before the gap because hypotheses and variables are derived from it.',
        mixed: 'Mixed-methods introductions explain why both strands are needed; questions are often stated for each strand and for their integration.',
        journal: 'Journals favour concise introductions without subheadings; the organisation of the paper is optional.',
        thesis: 'Theses usually include all moves and end with the organisation of the thesis.',
        conference: 'Conference papers move quickly to the gap and purpose; the rationale can merge with the gap.',
        chapter: 'Chapters relate the study to the volume’s theme; theoretical framing is often prominent.',
        proposal: 'Use anticipatory wording for the contribution (is expected to, aims to).',
        completed: 'The contribution may refer to what the findings show; keep it consistent with the conclusion.'
      }
    },

    /* Guidance cards for the sections outside the Builder */
    funnel: [
      { t: '1. Field', d: 'The scholarly conversation you join (e.g. television reception studies).' },
      { t: '2. Phenomenon', d: 'What is happening (e.g. Turkish serials are widely watched in the Gulf).' },
      { t: '3. Current situation', d: 'Why now (e.g. viewing has moved to streaming platforms).' },
      { t: '4. Focused issue', d: 'What this means for knowledge (e.g. broadcast-era explanations may no longer hold).' }
    ],
    openings: [
      { weak: 'Since the dawn of humanity, people have loved stories, and today television is everywhere.', better: 'Turkish serials have become one of the most watched forms of imported drama in the Gulf [reference].', why: 'Starts at the phenomenon, not in world history.' },
      { weak: 'Cinema is very important in the modern world and has many effects on society.', better: 'Since 2018, the reopening of cinemas in Saudi Arabia has created a new domestic market for feature films [reference].', why: 'A specific, dated and referenced claim.' },
      { weak: 'Everyone knows that streaming has changed everything.', better: 'Regional streaming platforms now commission original drama alongside imported serials [reference], changing what audiences can choose.', why: 'Replaces a generalisation with a supported observation.' }
    ],
    synthGuide: [
      { t: 'How much background?', items: ['Only what readers need to understand the gap and the problem.', 'Usually one or two paragraphs in a journal article.', 'Detailed discussion belongs in the Literature Review.'] },
      { t: 'Ways to synthesise', items: ['By finding: what several studies agree on.', 'By debate: where scholars disagree.', 'By method: how the topic has been studied.', 'By context: where and when studies were done.'] },
      { t: 'Useful patterns', items: ['Studies of X agree that… [refs], although they differ on…', 'Across these studies, … remains assumed rather than examined.', 'While early work focused on…, more recent studies…'] }
    ],
    summaryVsSynth: {
      weak: 'Smith (2018) studied Turkish drama in Jordan. Ahmed (2019) studied Turkish drama in Egypt. Lee (2020) studied Korean drama in Saudi Arabia.',
      better: 'Studies of imported drama in the Arab world agree that its appeal combines familiarity and difference (Ahmed, 2019; Lee, 2020; Smith, 2018), but they focus on broadcast viewing and on audiences outside the Gulf.'
    },
    distinctions: [
      ['General topic', 'An area of interest; not yet a problem.', 'Turkish drama in Saudi Arabia.'],
      ['Practical social issue', 'A concern in society or industry.', 'Young people watch a lot of foreign drama online.'],
      ['Research gap', 'What the scholarship lacks or leaves unresolved.', 'Reception studies have focused on broadcast viewing by adults.'],
      ['Scholarly research problem', 'What is not understood, and why it matters for knowledge.', 'It remains unclear whether broadcast-era accounts of negotiation explain individual platform viewing.'],
      ['Research question', 'An answerable question that the study will address.', 'How do young Saudi women interpret family relationships in the serials they choose online?']
    ],
    sigRows: [
      ['Theoretical', 'Tests whether a concept explains a new situation.', '“Will revolutionise reception theory.”'],
      ['Empirical', 'Adds evidence from an under-represented group or text.', '“Will represent all Arab women.”'],
      ['Methodological', 'Shows how a method can be adapted.', '“Introduces a completely new method.”'],
      ['Cultural', 'Clarifies meanings or identities in a culture.', '“Will solve the identity crisis of youth.”'],
      ['Contextual', 'Adds a region, period, platform or industry.', '“The first study ever in the Gulf.”'],
      ['Practical', 'May inform producers, platforms or educators.', '“Will change industry policy.”']
    ],
    questionGuide: [
      ['Interviews, focus groups, reception', 'Open, exploratory: How…? In what ways…? What meanings…?', 'How do young viewers describe their choice of Turkish serials?', 'No'],
      ['Textual, semiotic, narrative, discourse analysis', 'Interpretive: How does the film construct / represent…? What signs…?', 'How does the series construct female independence through mise-en-scène?', 'No'],
      ['Critical / theoretical', 'Argumentative; questions may be implicit in the thesis statement.', 'What does a feminist reading reveal about the genre’s ending conventions?', 'No'],
      ['Survey, experiment', 'Measurable: To what extent…? Is there a relationship / difference…?', 'To what extent is frequency of viewing associated with perceived cultural proximity?', 'Often'],
      ['Quantitative content analysis', 'Frequency and comparison: How often…? How do categories differ…?', 'How frequently are women shown in professional roles across 2015–2024 series?', 'Sometimes'],
      ['Mixed methods', 'Questions for each strand plus one integration question.', 'How do survey patterns and interview accounts together explain platform choice?', 'For the quantitative strand']
    ],
    rewrite: [
      { t: 'Research territory', tpl: ['[Phenomenon] has become [a central / an increasingly visible] feature of [context] [reference].', 'In recent years, [development] has changed how [audiences / producers] [verb] [reference].'], tip: 'Start with your phenomenon and support it.' },
      { t: 'Scholarly context', tpl: ['Studies of [topic] agree that [shared finding] [refs], although they differ on [point] [refs].', 'Research has approached [topic] mainly through [method / theory] [refs].'], tip: 'Each sentence connects several sources.' },
      { t: 'Gap or critical problem', tpl: ['However, these studies [limitation]; [specific aspect] has received limited attention.', 'The studies reviewed here suggest that [aspect] has not yet been examined in [context].', 'Existing readings treat [text] as [X], yet [observation] suggests [tension].'], tip: 'Match the wording to the level of evidence.' },
      { t: 'Rationale', tpl: ['Because [reason], it is necessary to [what the study does].', 'Understanding [aspect] matters for [field / practice] because [reason].'], tip: 'Say why now and for whom.' },
      { t: 'Purpose', tpl: ['This study [examines / explores / analyses] how [participants / texts] [phenomenon] in [context].', 'This article offers a [feminist / semiotic] reading of [text] to [purpose].'], tip: 'Use a purpose verb and the key terms of the problem.' },
      { t: 'Objectives and questions', tpl: ['Specifically, it seeks to [objective 1]; [objective 2]; and [objective 3].', 'The study addresses the following question: How do [participants] [verb] [phenomenon]?'], tip: 'Questions follow the design.' },
      { t: 'Theoretical positioning', tpl: ['The study is informed by [theory], particularly the concept of [concept], which [what it helps to see].', 'Drawing on [approach], the analysis treats [object] as [conceptual view].'], tip: 'Brief; the full framework comes later.' },
      { t: 'Contribution and organisation', tpl: ['The study is expected to contribute to [field] by [contribution].', 'The article first [section 1], then [section 2], before [section 3].'], tip: 'Proportionate wording; no “first” or “only”.' }
    ],
    transitionBank: [
      { t: 'From context to scholarship', items: ['Against this background, scholars have…', 'This development has attracted growing scholarly attention…'] },
      { t: 'From scholarship to gap', items: ['However, these studies…', 'Yet, less is known about…', 'Despite this attention, …'] },
      { t: 'From gap to purpose', items: ['To address this gap, this study…', 'In response, the present article…', 'Building on this work, …'] },
      { t: 'Adding and contrasting', items: ['Similarly, … / Likewise, …', 'In contrast, … / Whereas …', 'Moreover, … / In addition, …'] }
    ],
    mistakes: [
      { t: 'Starting too broadly', d: 'Opening with the history of cinema or “today’s world”.', fix: 'Start with the phenomenon your study addresses.' },
      { t: 'Repeating the literature review', d: 'Long summaries of individual studies.', fix: 'Synthesise the studies needed for the gap; keep detail for the review.' },
      { t: '“No study has ever…”', d: 'Claiming a gap because you have not found studies.', fix: 'State the level honestly and describe your search.' },
      { t: 'Confusing topic and problem', d: 'Naming an area instead of what is not understood.', fix: 'Write what remains unclear and why it matters.' },
      { t: 'Exaggerated significance', d: '“Extremely important”, “revolutionary”, “the first”.', fix: 'Name the specific kind of significance.' },
      { t: 'Misaligned aim and questions', d: 'The questions ask something the problem did not raise.', fix: 'Repeat the problem’s key terms in the aim and questions.' },
      { t: 'Theory as a list', d: 'Naming many theories without using them.', fix: 'Choose one perspective and explain its relevance.' },
      { t: 'Promising what the study cannot deliver', d: 'The introduction promises generalisations a small qualitative study cannot support.', fix: 'Align the introduction with the methods and findings.' }
    ],
    guideTopics: ['Introduction to the tool', 'Academic purpose and intended users', 'Overview of features', 'The complete Builder workflow', 'Step-by-step instructions for all 13 steps', 'Field-level instruction tables', 'Examples of appropriate entries', 'Common mistakes and how to avoid them', 'Guidance on scholarly referencing', 'Instructions for academic refinement', 'Understanding the evaluation rubric', 'Saving, editing, printing and exporting', 'Frequently asked questions', 'Troubleshooting', 'Academic integrity and limitations'],

    /* Tool H — examples library (illustrative; citations shown as [reference]) */
    examples: [
      { area: 'Saudi streaming drama', approach: 'Qualitative textual analysis', title: 'Belonging and the family home in Saudi streaming drama', moves: [
        { m: 'territory', t: 'Saudi drama series commissioned by streaming platforms have multiplied since 2019 [reference].' },
        { m: 'scholarly', t: 'Studies of Gulf television have examined national identity in broadcast drama [references], mainly through its representation of heritage.' },
        { m: 'gap', t: 'Yet how platform originals represent belonging in contemporary urban settings has received limited attention.' },
        { m: 'purpose', t: 'This article analyses how two Saudi streaming dramas construct belonging through the family home, generational conflict and the city.' },
        { m: 'theory', t: 'Drawing on Hall’s concept of representation, it treats identity as constructed through signs rather than reflected.' },
        { m: 'contribution', t: 'The analysis is expected to extend research on Gulf television identity to platform drama.' }], why: 'Moves quickly from a supported context to a modest, specific gap and a clear analytical purpose.' },
      { area: 'Turkish series reception', approach: 'Qualitative focus groups', title: 'Young Saudi women choosing Turkish serials on streaming platforms', moves: [
        { m: 'territory', t: 'Turkish serials remain among the most watched imported dramas in the Gulf [reference].' },
        { m: 'scholarly', t: 'Reception studies agree that their appeal combines cultural closeness and aspirational modernity [references].' },
        { m: 'gap', t: 'The studies reviewed here, however, examine broadcast viewing; how young women choose these serials on demand remains unclear.' },
        { m: 'rationale', t: 'Because streaming is now the main route to these serials, broadcast-era explanations need re-examination.' },
        { m: 'questions', t: 'The study asks: How do young Saudi women select and interpret Turkish serials on streaming platforms?' },
        { m: 'contribution', t: 'It is expected to refine concepts of negotiated reading for platform viewing.' }], why: 'The gap is claimed at the “potential” level and linked to a clear exploratory question.' },
      { area: 'Feminist cinema', approach: 'Feminist critical analysis', title: 'Independence and punishment in a Saudi feature film', moves: [
        { m: 'territory', t: 'Since 2018, Saudi feature films have increasingly placed women at the centre of their narratives [reference].' },
        { m: 'scholarly', t: 'Critics have read these films as signs of social change [references].' },
        { m: 'gap', t: 'Yet several of these narratives end by returning independent heroines to family authority, a tension that existing readings rarely address.' },
        { m: 'theory', t: 'Drawing on feminist film theory, the article reads narrative closure as a site of ideological negotiation.' },
        { m: 'purpose', t: 'It examines how one film’s ending reframes its heroine’s independence.' },
        { m: 'contribution', t: 'The reading offers a more cautious account of progress in recent Saudi cinema.' }], why: 'A critical problem that does not depend on a missing topic; questions remain implicit.' },
      { area: 'Semiotic analysis', approach: 'Semiotic analysis', title: 'Colour and status in a historical television drama', moves: [
        { m: 'territory', t: 'Historical drama is one of the most produced genres in Arab television [reference].' },
        { m: 'scholarly', t: 'Research on the genre has focused on historical accuracy and national memory [references].' },
        { m: 'gap', t: 'Its visual codes, particularly costume colour, have received less analytical attention.' },
        { m: 'theory', t: 'Using Barthes’ distinction between denotation and connotation, the study treats costume as a sign system.' },
        { m: 'questions', t: 'It asks how costume colour signifies power and moral status across the series.' },
        { m: 'contribution', t: 'The analysis is expected to show how semiotic reading can complement memory-focused research.' }], why: 'Theory comes early because it defines what will be read and how.' },
      { area: 'Narrative structures in TV drama', approach: 'Narrative analysis', title: 'Seasonal arcs and episodic closure in Gulf crime series', moves: [
        { m: 'territory', t: 'Gulf crime series increasingly adopt season-long arcs familiar from international streaming drama [reference].' },
        { m: 'scholarly', t: 'Narrative studies of television distinguish episodic and serial storytelling [references].' },
        { m: 'gap', t: 'Whether regional series adapt these forms or combine them with local storytelling conventions remains an open question.' },
        { m: 'purpose', t: 'This study analyses the narrative structure of three Gulf crime series released between 2020 and 2024.' },
        { m: 'contribution', t: 'It is expected to contribute to debates on the transnational circulation of serial form.' }], why: 'Short and specific; the open question is stated as a debate rather than an absence.' },
      { area: 'Streaming audiences', approach: 'Survey (quantitative)', title: 'Platform use and perceived cultural proximity among university students', moves: [
        { m: 'territory', t: 'University students in Saudi Arabia are among the most active users of streaming platforms [reference].' },
        { m: 'theory', t: 'Cultural proximity theory predicts a preference for content that shares language and values [references].' },
        { m: 'gap', t: 'Survey evidence on whether this preference holds on algorithm-driven platforms is limited and mixed [references].' },
        { m: 'questions', t: 'The study tests whether frequency of platform use is associated with perceived proximity to imported drama.' },
        { m: 'contribution', t: 'It is expected to provide evidence for updating proximity theory for platform viewing.' }], why: 'Theory precedes the gap because the hypothesis is derived from it.' },
      { area: 'Production and creative industries', approach: 'Mixed methods', title: 'Film incentives and local crews in Saudi Arabia', moves: [
        { m: 'territory', t: 'Production incentives have attracted international shoots to Saudi Arabia since 2020 [reference].' },
        { m: 'scholarly', t: 'Research on film incentives has examined economic returns [references] but less often the experiences of local crews.' },
        { m: 'gap', t: 'Whether incentives build local skills is therefore not well understood.' },
        { m: 'purpose', t: 'This study combines a crew survey with interviews to examine how incentive-funded productions develop local expertise.' },
        { m: 'contribution', t: 'It is expected to inform both creative-industries research and incentive policy.' }], why: 'Explains why both strands are needed and links the contribution to policy cautiously.' }
    ],
    published: [
      { area: 'Turkish series reception', approach: 'Qualitative', ref: 'Berg, M., Alardawi, M., & Al Obeidli, N. (2025). Cultural skimming, authenticity, and streaming preferences: Turkish serials (dizi) among young audiences in Qatar, Saudi Arabia, and the UAE. Critical Studies in Television. https://doi.org/10.1177/17496020251404332', lesson: 'Practise: identify where the introduction moves from Turkish serials in the Gulf to streaming preferences, and decide which gap level it claims.' },
      { area: 'Turkish series reception', approach: 'Qualitative', ref: 'Alardawi, M., Bajnaid, A., & Brereton, P. (2021). The influence of Turkish drama on socio-cultural values of Saudi women. Modern Applied Science, 15(4), 47. https://doi.org/10.5539/mas.v15n4p47', lesson: 'Practise: separate the practical social issue from the scholarly problem in its opening.' },
      { area: 'Feminist cinema', approach: 'Qualitative textual analysis', ref: 'Alardawi, M. M., Saqah, F. A., & Zakari, H. M. (2023). The representation of women in Saudi film: The case of Amra and the Second Marriage. Asian Social Science, 19(6), 123. https://doi.org/10.5539/ass.v19n6p123', lesson: 'Practise: locate the theoretical positioning and note how briefly it is introduced.' },
      { area: 'Saudi streaming drama', approach: 'Qualitative case study', ref: 'Alardawi, M., & Brereton, P. (2024). Arabic script television formats between adaptation and cultural identity: A case study of The Killing. International Journal of Psychological Studies, 16(4), 1. https://doi.org/10.5539/ijps.v16n4p1', lesson: 'Practise: find how the introduction connects format adaptation to cultural identity.' },
      { area: 'Streaming audiences', approach: 'Qualitative', ref: 'Qutub, A., & Alardawi, M. (2022). Saudi viewers’ perceptions of Attack on Titan Japanese animation online series. Asian Social Science, 18(1), 65. https://doi.org/10.5539/ass.v18n1p65', lesson: 'Practise: identify the research territory and the context of online viewing.' },
      { area: 'Streaming audiences', approach: 'Quantitative survey', ref: 'Alardawi, M. (2026). Exposure to AI-themed films and perceptions of artificial intelligence: A survey of Saudi young adults in Saudi Arabia. Online Media and Global Communication, 5(3), 498–527. https://doi.org/10.1515/omgc-2025-0083', lesson: 'Practise: note where theory and hypotheses appear and how they shape the questions.' },
      { area: 'Representation (quantitative)', approach: 'Quantitative content analysis', ref: 'Żerebecki, B. G., Opree, S. J., Hofhuis, J., & Janssen, S. (2024). Successful minority representations on TV count: A quantitative content analysis approach. Journal of Homosexuality, 71(7), 1703–1726. https://doi.org/10.1080/00918369.2023.2191287', lesson: 'Practise: compare how a quantitative introduction states measurable aims with an interpretive one.' },
      { area: 'Film audiences (mixed methods)', approach: 'Mixed methods', ref: 'Merrington, P., Hanchard, M., Wessels, B., Pidd, M., Rogers, K., Forrest, D., Higson, A., Smits, R., Townsend, N., & Yates, S. (2019). Using mixed-methods, a data model and a computational ontology in film audience research. Cultural Trends, 28(2–3), 118–131. https://doi.org/10.1080/09548963.2019.1617934', lesson: 'Practise: identify the methodological rationale for combining strands.' }
    ],

    /* Interface text */
    ui: {
      next: 'Next step', finish: 'Go to the final report', stepOf: (a, b) => 'Step ' + a + ' of ' + b,
      savedAt: (t) => 'Saved on this device · ' + t, notSaved: 'Not saved yet',
      required: 'This field is required.', tooShort: (n) => 'Please write at least ' + n + ' words.', chooseOne: 'Please choose one option.',
      fixErrors: 'Please complete the highlighted fields before continuing.', needDraft: 'Build or write the introduction draft first.',
      needGap: 'Add at least one gap or critical problem with a statement, evidence and level.',
      chooseApproachFirst: 'Choose the approach first', chooseDesign: 'Choose a design', example: 'Example', weak: 'Weak', better: 'Better', tip: 'Tip:', fix: 'Fix:',
      copy: 'Copy', copied: 'Copied.', copyFail: 'Copying failed; select the text and copy it manually.',
      // Matrix
      mxTitle: 'Scholarly Context and Citation Matrix', mxIntro: 'Record the studies your introduction relies on. Each row can be linked to a gap in Step 4. Full references are added to your report.',
      mxCols: { cite: 'In-text citation', ref: 'Full reference (APA 7)', claim: 'Claim or finding used', theory: 'Theory or concept', method: 'Method / design', context: 'Context (place, period, texts)', rel: 'Role in your argument', note: 'Your critical note' },
      mxPh: { cite: 'e.g. Berg et al., 2025', ref: 'Author, A. A. (Year). Title. Journal, vol(issue), pages. https://doi.org/…', claim: '', theory: '', method: '', context: '', note: '' },
      mxAdd: 'Add study', mxDel: 'Remove study', mxEmpty: 'No studies yet. Add one, or import a CSV or JSON file.', mxCount: (n) => n + ' stud' + (n === 1 ? 'y' : 'ies'),
      mxCsv: 'Export CSV', mxJson: 'Export JSON', mxImport: 'Import CSV or JSON', mxImported: (n) => n + ' studies imported.', mxImportFail: 'The file could not be read. Use the exported CSV/JSON format.',
      mxReplaceNote: 'Imported studies are added to the existing ones.', mxStudy: (n) => 'Study ' + n, mxConfirmDel: 'Click again to remove',
      // Gaps
      gapAdd: 'Add a gap or problem', gapDel: 'Remove', gapN: (n) => 'Gap or problem ' + n, gapType: 'Type of gap or problem', gapStatement: 'Gap or problem statement', gapStatementHint: 'One sentence, in your own words.',
      gapEvidence: 'Supporting evidence', gapEvidenceHint: 'Which studies, observations or contradictions show it? Include citations.', gapStudies: 'Studies from your matrix that support it', gapNoStudies: 'Add studies to the matrix in Step 3 to link them here.',
      gapStatus: 'Level of the claim', gapPrimary: 'Use this gap in the introduction', gapPrimaryOn: 'Used in the introduction', gapEmpty: 'No gap yet. Add one to continue.', gapLadder: 'Four levels of a gap claim',
      claimTitle: 'Gap and significance claim checker', claimHint: 'Paste a sentence that claims a gap, novelty or importance.', claimPh: 'e.g. No study has ever examined…',
      // Significance & contribution
      sigTitle: 'Types of significance', sigHint: 'Tick the types that apply and explain each in one sentence.',
      contribTitle: 'Types of contribution', contribHint: 'Tick the kinds of contribution and write one proportionate sentence for each.',
      stageNote: { proposal: 'Your study is planned: use anticipatory wording (is expected to, aims to, may).', progress: 'Your study is in progress: the contribution is still anticipated.', completed: 'Your study is completed: you may refer to what the findings show.', '': 'Choose the stage of research in Step 1.' },
      // Alignment
      alignTitle: 'Research Alignment Checker', alignHint: 'Compares key terms and forms across your problem, gap, aim, objectives, questions and contribution. Shared terms are a prompt, not proof of alignment.',
      chain: { problem: 'Problem', gap: 'Gap', aim: 'Aim', objectives: 'Objectives', question: 'Main question', contribution: 'Contribution' }, chainEmpty: 'Not entered yet',
      qGuideTitle: 'Question forms by design', qCols: ['Design', 'Typical question form', 'Example', 'Hypotheses?'], kindNote: (d) => 'Your design: ' + d,
      // Composer
      composerHint: 'Turn moves on or off, reorder them and edit any move. Each move becomes one paragraph.', moveUp: 'Move up', moveDown: 'Move down',
      resetSection: 'Reset', sectionReset: 'The move was refilled from your steps.', sectionEmpty: 'This move is empty — complete the related step or write here.',
      words: (n) => n + ' words', headingFor: (s) => 'Subheading for ' + s, useHeadings: 'Show subheadings', headingsOff: 'Subheadings are off because your publication setting (Step 1) does not permit them.',
      draftTitle: 'Full introduction draft', rebuild: 'Rebuild from moves', rebuildConfirm: 'Click again to replace your edits', rebuilt: 'Draft rebuilt from the moves.',
      draftAutoNote: 'Updates automatically from the moves above.', draftEditedNote: 'You edited the draft directly, so it no longer updates automatically. Use “Rebuild from moves” to start again.',
      structApply: 'Apply this order to the Builder (Step 10)', structApplied: 'The suggested order was applied in Step 10.', selEmpty: 'Answer the questions to see a suggested order.', selResult: 'Suggested order', selOff: 'Optional — switched off', selWhy: 'Why',
      // Refinement
      langCheckTitle: 'Refinement Assistant', movesTitle: 'Moves detected through cue words', movesHint: '✓ cue words found · ? not found. A prompt to look, not a verdict.',
      useDraft: 'Use my Builder draft', checkPh: 'Paste an introduction or a paragraph…', checklistTitle: 'Introduction Coherence Checklist', checklistDone: (a, b) => a + ' of ' + b + ' checked',
      templatesTitle: 'Structured writing templates', transitionsTitle: 'Transition bank', openingsTitle: 'Effective opening paragraphs', mistakesTitle: 'Common mistakes',
      // Evaluation
      checksTitle: 'Automatic checks', applyScores: 'Use the suggested scores', scoresApplied: 'Suggested scores applied; adjust them as you see fit.', suggestedScore: 'Suggested score:',
      overall: 'Overall', outOf5: '/ 5', recommendations: 'Revision recommendations', noRecs: 'No criterion is rated 3 or below.', notRated: 'Not rated yet.',
      evalDisclaimer: 'This evaluation is an educational self-assessment that supports revision. It is not a peer-review, editorial or supervisory decision.',
      rubricCols: ['Criterion', '1–2 · Needs work', '3 · Developing', '4–5 · Strong'],
      // Final
      finalFromDraft: 'Copy the Step 10 draft here', replaceConfirm: 'Click again to replace', finalCopied: 'Draft copied into the final version.', copyFinal: 'Copy final introduction',
      reportRegen: 'Regenerate report', regenConfirm: 'Click again to discard report edits', reportRebuilt: 'Report regenerated.', reportCopy: 'Copy report', print: 'Print / Save as PDF', doc: 'Download Word (.doc)', txt: 'Download text (.txt)',
      fileReport: 'research-introduction-report', fileData: 'research-introduction-project.json', fileMatrix: 'citation-matrix',
      report: { title: 'Research Introduction Report', generated: (d) => 'Generated on ' + d + ' · Research Introduction Writing and Refinement in Film and Television Studies', researchTitle: 'Research title', profile: 'Research profile', context: 'Research context', background: 'Scholarly background', matrix: 'Citation matrix', gap: 'Research gap or critical problem', problem: 'Research problem statement', rationale: 'Research rationale and significance', aims: 'Aims, objectives and questions', theory: 'Theoretical positioning', contribution: 'Study contribution', draft: 'Complete introduction', evaluation: 'Evaluation results', self: 'Researcher’s reflection', recs: 'Revision recommendations', noRecs: 'No revision recommendations.', refs: 'References entered by the researcher', noRefs: 'No references entered.', final: 'Final introduction', notes: 'Notes', footer: 'Academic Tool Developed by Dr. Merfat Alardawi. The report contains only the researcher’s entries and rule-based feedback; verify all citations before submission.' },
      lbl: { aim: 'Aim', objectives: 'Objectives', mainQ: 'Main question', subQs: 'Supporting questions', hypotheses: 'Hypotheses', evidence: 'Evidence', basis: 'Search basis', type: 'Type', status: 'Level', traditions: 'Traditions', theories: 'Theories', findings: 'Findings', debates: 'Debates', disagreements: 'Disagreements', methods: 'Methods', field: 'Field', phenomenon: 'Phenomenon', current: 'Current context', setting: 'Setting', importance: 'Importance', refs: 'Citations', issue: 'Issue', tension: 'Tension', boundaries: 'Boundaries', relevance: 'Relevance', perspective: 'Perspective', concepts: 'Concepts', approach: 'Critical approach', relation: 'Relation to the problem', justification: 'Justification', organisation: 'Organisation', significance: 'Significance', types: 'Types' },
      empty: '—',
      // Data
      deleteAll: 'Click again to delete all', deleted: 'All saved data has been deleted from this browser.', imported: 'Project imported.', importFail: 'This file is not a project exported from this tool.',
      exAll: 'All', exHyp: 'Illustrative example', exPub: 'Verified published study', whyWorks: 'Why it works:', lesson: 'Learning task:',
      glossCols: ['Term', 'Equivalent', 'Definition', 'Arabic definition'],
      refGroups: { structure: 'Rhetorical structure of introductions', gaps: 'Gaps, problems and positioning', theory: 'Theory, questions and contribution', arabic: 'Arabic research introductions', standards: 'Reporting and style standards', examples: 'Film and television studies used in the examples', tutorials: 'Video tutorials in the attached reference file' },
      refTypes: { book: 'Book', article: 'Peer-reviewed article', guide: 'Style manual', standard: 'Reporting standard', example: 'Published example', video: 'Video tutorial' },
      distCols: ['Concept', 'What it is', 'Film/TV example'], sigCols: ['Type', 'Genuine significance', 'Exaggerated claim'],
      goStep: (n) => 'Open Step ' + n, guideOpen: 'Open the User Guide', guideStep: (n, t) => 'Step ' + n + ' — ' + t
    }
  };
})();
