/* =========================================================
   Research Abstract Writing and Refinement in Film and Television Studies
   English interface text, guidance, options, examples and templates.
   rabstract-ar.js has exactly the same keys and structure.
   Templates only rearrange the researcher's own entries; they never add
   findings, numbers or claims.
   Academic tool developed by Dr. Merfat Alardawi
   ========================================================= */
window.RC = (function () {
  'use strict';
  const T = (x) => String(x || '').trim();
  const has = (x) => !!T(x);
  const end = (s) => { s = T(s); if (!s) return ''; s = s.charAt(0).toUpperCase() + s.slice(1); return /[.!?…”")\]]$/.test(s) ? s : s + '.'; };
  const frag = (s) => T(s).replace(/[.;:]+$/, '');
  const join = (a) => a.filter(has).join(' ');
  const qmark = (s) => { s = frag(s); return /\?$/.test(s) ? s : s + '?'; };
  const pick = (list, id) => (list.find((x) => x.id === id) || {});

  const approaches = [
    { id: 'qual', t: 'Qualitative', d: 'Interviews, focus groups, textual, semiotic, narrative or discourse analysis.' },
    { id: 'quant', t: 'Quantitative', d: 'Surveys, quantitative content analysis or experiments.' },
    { id: 'mixed', t: 'Mixed methods', d: 'Qualitative and quantitative strands that are integrated.' }
  ];
  const designs = [
    { id: 'interviews', a: 'qual', kind: 'interview', t: 'Semi-structured interviews', ph: 'a qualitative design based on semi-structured interviews' },
    { id: 'focus', a: 'qual', kind: 'interview', t: 'Focus groups', ph: 'a qualitative design based on focus groups' },
    { id: 'reception', a: 'qual', kind: 'interview', t: 'Audience reception study (interviews or focus groups)', ph: 'a qualitative audience reception design' },
    { id: 'ethno', a: 'qual', kind: 'interview', t: 'Ethnography or netnography', ph: 'an ethnographic design' },
    { id: 'textual', a: 'qual', kind: 'textual', t: 'Film or television textual analysis', ph: 'a qualitative textual analysis design' },
    { id: 'semiotic', a: 'qual', kind: 'textual', t: 'Semiotic / semiological analysis', ph: 'a semiotic analysis design' },
    { id: 'narrative', a: 'qual', kind: 'textual', t: 'Narrative analysis', ph: 'a narrative analysis design' },
    { id: 'discourse', a: 'qual', kind: 'textual', t: 'Discourse or critical discourse analysis', ph: 'a discourse analysis design' },
    { id: 'qca', a: 'qual', kind: 'textual', t: 'Qualitative content analysis', ph: 'a qualitative content analysis design' },
    { id: 'case', a: 'qual', kind: 'textual', t: 'Comparative case study of texts', ph: 'a comparative qualitative case study design' },
    { id: 'historical', a: 'qual', kind: 'review', t: 'Historical or document analysis', ph: 'a historical, document-based design' },
    { id: 'narrrev', a: 'qual', kind: 'review', t: 'Narrative literature review', ph: 'a narrative literature review' },
    { id: 'survey', a: 'quant', kind: 'survey', t: 'Survey / questionnaire', ph: 'a cross-sectional survey design' },
    { id: 'quantca', a: 'quant', kind: 'qcontent', t: 'Quantitative content analysis', ph: 'a quantitative content analysis design' },
    { id: 'experiment', a: 'quant', kind: 'survey', t: 'Experiment or quasi-experiment', ph: 'an experimental design' },
    { id: 'convergent', a: 'mixed', kind: 'mixed', t: 'Convergent mixed-methods design', ph: 'a convergent mixed-methods design' },
    { id: 'explanatory', a: 'mixed', kind: 'mixed', t: 'Explanatory sequential design', ph: 'an explanatory sequential mixed-methods design' },
    { id: 'exploratory', a: 'mixed', kind: 'mixed', t: 'Exploratory sequential design', ph: 'an exploratory sequential mixed-methods design' },
    { id: 'multica', a: 'mixed', kind: 'mixed', t: 'Quantitative content analysis with qualitative thematic analysis', ph: 'a mixed-methods design combining quantitative content analysis and qualitative thematic analysis' }
  ];
  const formats = [
    { id: 'structured', t: 'Structured abstract', d: 'Explicit headings such as Purpose, Methods, Findings — use only when the publication asks for it.' },
    { id: 'unstructured', t: 'Unstructured abstract', d: 'One coherent paragraph (sometimes two) with no headings; the moves still follow one another.' }
  ];
  const fields = [
    { id: 'film', t: 'Film and cinema studies' }, { id: 'tv', t: 'Television and drama studies' }, { id: 'criticism', t: 'Film and television criticism' },
    { id: 'audience', t: 'Audience and reception studies' }, { id: 'representation', t: 'Cultural representation and identity' }, { id: 'feminist', t: 'Feminist film and television studies' },
    { id: 'semiotic', t: 'Narrative and semiotic analysis' }, { id: 'streaming', t: 'Streaming platforms and digital media' }, { id: 'production', t: 'Film and television production' },
    { id: 'industries', t: 'Audiovisual communication and creative industries' }
  ];
  const venues = [
    { id: 'journal', t: 'Journal article', d: 'Follow the journal’s author guidelines exactly.' },
    { id: 'thesis', t: 'Thesis or dissertation', d: 'Follow your university’s regulations; often longer.' },
    { id: 'conference', t: 'Conference submission', d: 'Follow the call for papers; results may be preliminary.' },
    { id: 'chapter', t: 'Book chapter', d: 'Follow the editors’ instructions.' }
  ];
  const langs = [
    { id: 'en', t: 'English', d: 'The abstract is written in English.' },
    { id: 'ar', t: 'Arabic', d: 'The abstract is written in Arabic.' },
    { id: 'both', t: 'Arabic and English', d: 'Two equivalent versions are required.' }
  ];
  const sectionNames = { background: 'Background and problem', aim: 'Aim', methods: 'Methods', results: 'Findings', conclusion: 'Contribution and conclusion', limits: 'Limitations (optional)' };

  return {
    lang: 'en', dir: 'ltr', colon: ': ', sep: ', ',
    numerals: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    steps: ['Research information', 'Background', 'Aim', 'Methodology', 'Findings', 'Contribution', 'Construct', 'Refine', 'Word count', 'Keywords', 'Evaluate', 'Final & export'],
    stepText: [
      { h: 'Step 1 — Research Information', p: 'Record the key facts about your completed study and the publication you are writing for.',
        whyH: 'Write the abstract last, from the finished study', why: 'An abstract summarises research that has been done. Its form depends on where it will appear: the target journal, university or conference decides the word limit, whether headings are used and the language. Check those requirements before you write.',
        ex: 'Title — Watching Turkish drama on Shahid: How young Saudi women negotiate romance narratives · Journal article · Qualitative, focus groups · Unstructured, 250 words, English.',
        out: 'Expected output — a research profile that will guide the abstract' },
      { h: 'Step 2 — Research Background and Context', p: 'Write one or two sentences that place the study in its scholarly context and state the problem.',
        whyH: 'Context in one or two sentences', why: 'The opening tells readers why the study matters: the phenomenon, what is known, and what is missing or problematic. It is not a literature review — no citations, no history, no definitions unless essential. In most abstracts it takes about a fifth of the words or fewer.',
        ex: 'Turkish television drama is widely watched in the Gulf, yet little is known about how young viewers negotiate its romantic narratives within local cultural norms.',
        weak: 'Since the beginning of cinema in 1895 many scholars such as Bordwell (1989), Hall (1980) and others have studied films, and television has also become very important in the modern world, especially with the internet.',
        better: 'Streaming platforms have changed how Gulf audiences discover Turkish drama, yet audience research has rarely examined young viewers’ choices between broadcast and streaming versions.',
        out: 'Expected output — a concise academic background statement' },
      { h: 'Step 3 — Research Aim and Objectives', p: 'State precisely what the study set out to do.',
        whyH: 'Purpose, not topic', why: 'A topic names what the study is about (“Saudi streaming dramas”); a purpose states what the study does with it (“This study examines how Saudi streaming dramas represent cultural identity and belonging”). Use a clear purpose verb — examines, explores, analyses, compares, assesses — in the past or present tense.',
        ex: 'This study examines how Saudi streaming dramas represent cultural identity and belonging.',
        weak: 'This research is about Saudi streaming dramas and identity.',
        better: 'This study analyses how two Saudi streaming dramas construct cultural identity and belonging through characters, settings and family conflict.',
        out: 'Expected output — a concise statement of the research aim' },
      { h: 'Step 4 — Research Methodology', p: 'Summarise how the study was done. The fields change with the design you choose.',
        whyH: 'Only what readers need to judge the findings', why: 'Readers use the methods sentence to decide whether the findings are credible: what kind of data, from whom or from which texts, how they were selected and how they were analysed. Leave out procedural detail that belongs in the methods section, and never describe a qualitative study in statistical language.',
        ex: 'Semi-structured interviews were conducted with 18 Saudi women aged 20–35 who regularly watch Turkish drama, recruited through purposive sampling, and analysed using reflexive thematic analysis.',
        out: 'Expected output — a methodologically accurate and concise methodology statement' },
      { h: 'Step 5 — Key Research Findings', p: 'Enter your actual findings. The tool never invents results.',
        whyH: 'The most important results, stated plainly', why: 'Findings are the part of an abstract readers most often look for, yet they are often the thinnest. Report the main result first and link it to the research question. In qualitative work, state the main themes and what they mean rather than listing codes; in quantitative work, give the key values; in mixed methods, show how the strands relate.',
        ex: 'Participants preferred broadcast dizi to streaming originals, describing them as emotionally engaging and culturally appropriate.',
        weak: 'The study found many important and interesting results about the participants and their viewing.',
        better: 'Participants preferred broadcast serials, describing them as emotionally engaging yet culturally appropriate, whereas streaming originals were seen as culturally distant.',
        out: 'Expected output — a clear statement of the study’s most significant findings' },
      { h: 'Step 6 — Research Contribution and Implications', p: 'Explain what the study adds and for whom, without going beyond the evidence.',
        whyH: 'Findings, implications and generalisations are different', why: 'A finding is what the study showed. An implication is what this means for theory, method or practice. A generalisation claims more than the data allow — for example from eight interviews to “all Saudi women”. Claim originality only if you can support it.',
        ex: 'The study extends cultural proximity theory to streaming-era reception and offers the concept of “cultural skimming” for analysing algorithmically driven viewing.',
        out: 'Expected output — a concise contribution or implication statement' },
      { h: 'Step 7 — Construct the Complete Abstract', p: 'Combine your statements into a structured or unstructured abstract, then reorder and edit.',
        whyH: 'One coherent text', why: 'The sections below are filled from your earlier steps using only your own words. Turn sections on or off, change their order, edit them, and choose headings if the publication requires a structured abstract. The full draft updates automatically until you edit it directly.',
        ex: '',
        out: '' },
      { h: 'Step 8 — Academic Language and Refinement', p: 'Check clarity, conciseness and precision with transparent rule-based prompts, then revise.',
        whyH: 'Rule-based prompts, not automatic rewriting', why: 'The checks count long sentences, repeated words, vague or overclaiming phrases, citations, undefined abbreviations, future tense and unfinished placeholders, and look for cue words of each abstract move. They point to places worth revising; you decide what to change. The tool does not paraphrase and does not change your meaning.',
        ex: 'Instead of “This paper will show that…”, write “The analysis shows that…” or “Findings indicate that…”.',
        out: '' },
      { h: 'Step 9 — Word Count and Journal Requirements', p: 'Check your abstract against the limit and the rules of your target publication.',
        whyH: 'Requirements differ', why: 'Word limits commonly range from about 150 to 300 words, but the presets here are only examples: the actual limit, format, keyword number and other rules are set by the target journal, university or conference. Add any extra rule from the guidelines and tick it when met.',
        ex: 'Example rules — “No more than 250 words”; “Use the headings Purpose, Design/methodology/approach, Findings, Originality/value”; “Four to six keywords”; “No references in the abstract”.',
        out: '' },
      { h: 'Step 10 — Academic Keywords', p: 'Choose keywords that help readers and databases find the study.',
        whyH: 'Searchable, specific, disciplinary', why: 'Keywords should reflect the topic, the key concepts or theory, the method where relevant, and the film or television and cultural context. Use established disciplinary terms rather than translating word for word, avoid very general words (“media”, “study”) and check the number the publication allows.',
        ex: 'Turkish drama; dizi; audience reception; cultural proximity; streaming platforms; Gulf audiences',
        out: 'Expected output — a refined set of academic keywords' },
      { h: 'Step 11 — Abstract Quality Evaluation', p: 'Review the automatic checks and rate the draft on ten criteria.',
        whyH: 'Self-assessment for revision', why: 'Suggested scores come from the rule-based checks and are a starting point only. Read each criterion, decide your own score and use the recommendations to revise. The evaluation supports refinement; it does not replace supervision, peer review or editorial assessment.',
        ex: '',
        out: '' },
      { h: 'Step 12 — Final Abstract and Export', p: 'Prepare your final version and a report you can print, save as PDF or edit.',
        whyH: 'Researcher-reviewed final text', why: 'Paste or edit your final version below, then generate the report. Verify the abstract once more against the full paper and the publication guidelines before submission: numbers, names, terms and claims must match the paper exactly.',
        ex: '',
        out: '' }
    ],

    /* Field labels, hints and placeholders */
    f: {
      's1.title': { label: 'Research title', hint: 'The working or final title of the paper, thesis or presentation.', ph: 'e.g. Watching Turkish drama on Shahid: How young Saudi women negotiate romance narratives' },
      's1.journal': { label: 'Target journal or publication (optional)', hint: 'Name the journal, university or conference whose rules apply.', ph: 'e.g. Critical Studies in Television' },
      's1.problem': { label: 'Main research problem', hint: 'One or two sentences: what is not known or is problematic.', ph: 'e.g. Little is known about how young Gulf viewers choose between broadcast and streaming Turkish serials.' },
      's1.question': { label: 'Main research question (optional)', hint: 'The question the study answers.', ph: 'e.g. How do young Saudi women interpret romantic relationships in Turkish drama?' },
      's1.objectives': { label: 'Research objectives (optional)', hint: 'One per line.', ph: 'e.g. To identify viewing motivations\nTo examine how romance narratives are negotiated' },
      's1.field': { label: 'Academic specialisation', hint: 'The area of film and television studies the study belongs to.' },
      's1.approach': { label: 'Research approach', hint: '' },
      's1.design': { label: 'Research design', hint: 'The list follows the approach you chose. The methodology fields in Step 4 adapt to this choice.' },
      's1.venue': { label: 'Publication type', hint: '' },
      's1.lang': { label: 'Required abstract language', hint: '' },
      's1.format': { label: 'Abstract format required by the publication', hint: 'If the guidelines do not say, use the Abstract Structure Selector below the builder.' },
      's1.limit': { label: 'Abstract word limit', hint: 'Configurable examples — use the limit stated by your target publication.' },
      's1.customLimit': { label: 'Custom word limit', hint: 'Enter the number of words allowed.', ph: 'e.g. 220' },
      's2.topic': { label: 'Research topic (a short phrase)', hint: 'Used for keyword suggestions; it is not copied into the abstract.', ph: 'e.g. Gulf audiences of Turkish drama' },
      's2.context': { label: 'Scholarly context or phenomenon', hint: 'One sentence on the phenomenon and why it matters. No citations.', ph: 'e.g. Turkish television drama is among the most widely watched imported programming in the Gulf.' },
      's2.issue': { label: 'Central issue (optional)', hint: 'What is changing, contested or unexplained.', ph: 'e.g. Streaming platforms now offer both broadcast serials and streaming originals.' },
      's2.problem': { label: 'Research problem or gap', hint: 'What is not yet known — specific, not “little research exists”.', ph: 'e.g. Few studies have examined how young viewers choose between these forms.' },
      's2.justification': { label: 'Justification (optional)', hint: 'Why answering the problem matters.', ph: 'e.g. Understanding these choices helps explain transnational television flows in the region.' },
      's3.aim': { label: 'Main research aim', hint: 'Start with a purpose verb: This study examines / explores / analyses / compares…', ph: 'e.g. This study explores how young Gulf audiences engage with Turkish serials across broadcast and streaming platforms.' },
      's3.objectives': { label: 'Specific objectives (optional)', hint: 'Usually not all included in the abstract; they help you check the aim.', ph: 'One per line' },
      's3.question': { label: 'Research question (optional)', hint: 'Include it in the abstract only if it adds clarity.', ph: 'e.g. How do participants explain their preference for broadcast or streaming dizi?' },
      's3.focus': { label: 'Research focus (optional)', hint: 'The specific texts, audience or setting in a short phrase.', ph: 'e.g. university students in Qatar, Saudi Arabia and the UAE' },
      's4.sample': { label: 'Participants or sample', hint: 'Who took part, how many, and relevant characteristics.', ph: 'e.g. 18 Saudi women aged 20–35 who regularly watch Turkish drama' },
      's4.sampling': { label: 'Sampling or selection strategy', hint: 'How participants or materials were chosen.', ph: 'e.g. purposive and snowball sampling' },
      's4.collection': { label: 'Data collection method', hint: 'How the data were generated.', ph: 'e.g. semi-structured interviews conducted online' },
      's4.corpus': { label: 'Selected audiovisual materials', hint: 'Films, series, episodes or scenes analysed.', ph: 'e.g. 12 episodes of two Saudi streaming dramas released in 2023' },
      's4.framework': { label: 'Analytical framework', hint: 'The theory or coding framework guiding analysis.', ph: 'e.g. Barthes’s semiology' },
      's4.analysis': { label: 'Data analysis technique', hint: 'Name the procedure precisely.', ph: 'e.g. reflexive thematic analysis' },
      's4.context': { label: 'Research context', hint: 'Place, period or platform.', ph: 'e.g. Jeddah, Saudi Arabia, 2024' },
      's4.qual': { label: 'Qualitative component', hint: 'Data, participants and analysis of the qualitative strand.', ph: 'e.g. four focus groups with 24 viewers analysed thematically' },
      's4.quant': { label: 'Quantitative component', hint: 'Sample, instrument and analysis of the quantitative strand.', ph: 'e.g. an online survey of 410 viewers analysed with chi-square tests' },
      's4.integration': { label: 'Integration of the two strands', hint: 'How the strands were combined.', ph: 'e.g. a joint display comparing survey patterns with focus-group themes' },
      's5.main': { label: 'Main finding', hint: 'The single most important result, in one or two sentences.', ph: 'e.g. Participants preferred broadcast dizi, describing them as emotionally engaging and culturally appropriate.' },
      's5.support': { label: 'Supporting finding (optional)', hint: 'A second result that adds to the main one.', ph: 'e.g. Social media, especially TikTok and Instagram, drove the discovery of new serials.' },
      's5.themes': { label: 'Major themes or patterns (qualitative)', hint: 'Name the themes and what they show — not a list of codes.', ph: 'e.g. Viewers framed romance as acceptable when it remained within family-centred storylines.' },
      's5.stats': { label: 'Key quantitative results', hint: 'Report direction, size and significance accurately.', ph: 'e.g. Exposure was associated with viewing AI as a threat (p = .003, Cramér’s V = .14).' },
      's5.answer': { label: 'How the findings answer the research question (optional)', hint: 'One sentence linking results to the question.', ph: 'e.g. These preferences show that cultural appropriateness shapes platform choice.' },
      's6.contribution': { label: 'Main scholarly contribution', hint: 'What the study adds to knowledge.', ph: 'e.g. The study introduces the concept of “cultural skimming” to describe fragmented, algorithm-driven serial viewing.' },
      's6.theory': { label: 'Theoretical contribution (optional)', hint: 'Which theory or concept is extended or questioned.', ph: 'e.g. It extends cultural proximity theory to streaming-era reception.' },
      's6.method': { label: 'Methodological contribution (optional)', hint: 'Only if the method itself is new or adapted.', ph: 'e.g. It shows how participant-led focus groups capture platform choices.' },
      's6.context': { label: 'Contextual contribution (optional)', hint: 'What the study adds about a region, period or platform.', ph: 'e.g. It provides evidence from Gulf audiences, who are under-represented in reception studies.' },
      's6.practical': { label: 'Practical implications (optional, only if supported)', hint: 'For producers, platforms, educators or policy.', ph: 'e.g. Platforms may benefit from culturally adapted originals.' },
      's6.limits': { label: 'Limitations (optional)', hint: 'Include in the abstract only if the publication expects it.', ph: 'e.g. The sample was limited to university students.' },
      's7.headings': { label: 'Headings', hint: 'Use the headings named in the guidelines; you can rename each one in the composer.' },
      's7.paras': { label: 'Paragraphs', hint: 'Most unstructured abstracts are one paragraph.' },
      's9.kwMin': { label: 'Minimum number of keywords', hint: 'From the guidelines.', ph: '3' },
      's9.kwMax': { label: 'Maximum number of keywords', hint: 'From the guidelines.', ph: '6' },
      's11.self': { label: 'Overall self-assessment (optional)', hint: 'Your own judgement: what is strongest, what still needs work.', ph: 'e.g. Findings are clear; the contribution sentence still sounds too general.' },
      's12.final': { label: 'Researcher’s final version', hint: 'Edit freely. This text is not changed by the tool.', ph: 'Your final abstract…' }
    },
    /* Methodology field wording for each kind of design */
    mf: {
      interview: {
        sample: { label: 'Participants', hint: 'Number and relevant characteristics.', ph: 'e.g. 18 Saudi women aged 20–35 who regularly watch Turkish drama' },
        sampling: { label: 'Recruitment approach', hint: 'How participants were found and selected.', ph: 'e.g. purposive and snowball sampling through social media' },
        collection: { label: 'Interviews or focus groups', hint: 'Type, number and mode.', ph: 'e.g. semi-structured online interviews' },
        analysis: { label: 'Analytical procedure', hint: 'Name the approach precisely.', ph: 'e.g. reflexive thematic analysis (Braun and Clarke)' },
        context: { label: 'Research context', hint: 'Place and period.', ph: 'e.g. Jeddah and Riyadh, 2024' }
      },
      textual: {
        corpus: { label: 'Selected films, series, episodes or scenes', hint: 'What exactly was analysed.', ph: 'e.g. the Netflix film Amra and the Second Marriage (2022)' },
        sampling: { label: 'Selection rationale', hint: 'Why these texts were chosen.', ph: 'e.g. chosen as the first Saudi feature to foreground a middle-aged female protagonist' },
        framework: { label: 'Analytical framework', hint: 'Theory or model guiding interpretation.', ph: 'e.g. representation theory and feminist film theory' },
        analysis: { label: 'Interpretive procedure', hint: 'How the analysis was carried out.', ph: 'e.g. scene-by-scene analysis of characters, dialogue and mise-en-scène' },
        context: { label: 'Production or cultural context', hint: 'Platform, period or industry context.', ph: 'e.g. Saudi film production after 2018' }
      },
      survey: {
        sample: { label: 'Population and sample', hint: 'Who, how many, key characteristics.', ph: 'e.g. 346 Saudi viewers aged 14–38' },
        sampling: { label: 'Sampling method', hint: 'Probability or non-probability, and how.', ph: 'e.g. snowball sampling on social media platforms' },
        collection: { label: 'Data collection instrument', hint: 'Questionnaire, scale or experimental task.', ph: 'e.g. an online questionnaire' },
        analysis: { label: 'Statistical analysis', hint: 'The tests or models used.', ph: 'e.g. chi-square tests and binary logistic regression' },
        context: { label: 'Research context', hint: 'Country, platform or period.', ph: 'e.g. Saudi Arabia, 2025' }
      },
      qcontent: {
        corpus: { label: 'Sample of texts', hint: 'Units of analysis and number.', ph: 'e.g. all scenes featuring three minority characters in season 1' },
        sampling: { label: 'Sampling of texts', hint: 'How the material was selected.', ph: 'e.g. census of the first season' },
        framework: { label: 'Coding scheme', hint: 'Categories or codebook used.', ph: 'e.g. a codebook of six representation strategies' },
        analysis: { label: 'Analysis and reliability', hint: 'Statistics and inter-coder reliability.', ph: 'e.g. descriptive statistics; Krippendorff’s alpha for reliability' },
        context: { label: 'Context', hint: 'Platform, country or period.', ph: 'e.g. Netflix, 2019' }
      },
      mixed: {
        qual: { label: 'Qualitative component', hint: 'Data, participants and analysis.', ph: 'e.g. 20 interviews analysed thematically' },
        quant: { label: 'Quantitative component', hint: 'Sample, instrument and analysis.', ph: 'e.g. a survey of 300 viewers analysed with regression' },
        integration: { label: 'Integration', hint: 'How the two strands were combined and compared.', ph: 'e.g. survey results informed the interview guide; findings were merged in a joint display' },
        sample: { label: 'Overall participants (optional)', hint: 'If not already described in the strands.', ph: 'e.g. young adult viewers in three Gulf countries' },
        context: { label: 'Research context', hint: 'Place, period or platform.', ph: 'e.g. Qatar, Saudi Arabia and the UAE' }
      },
      review: {
        corpus: { label: 'Sources examined', hint: 'Documents, archives or literature included.', ph: 'e.g. 35 published studies and Netflix, YouTube and MBC reports' },
        sampling: { label: 'Selection of sources', hint: 'How sources were identified.', ph: 'e.g. searched in Scopus and Google Scholar, 2010–2025' },
        framework: { label: 'Guiding framework', hint: 'Theory or lens used.', ph: 'e.g. cultural negotiation' },
        analysis: { label: 'Analytical approach', hint: 'How sources were analysed.', ph: 'e.g. narrative synthesis organised by theme' }
      }
    },
    kindNames: { interview: 'Interview and focus-group studies', textual: 'Film and television textual, semiotic, narrative and discourse analysis', survey: 'Surveys and experiments', qcontent: 'Quantitative content analysis', mixed: 'Mixed-methods studies', review: 'Historical, document and review studies' },
    kindTips: {
      interview: { t: 'What to report for an interview or focus-group study', d: 'Design, participants (number and key characteristics), recruitment, the interviews or focus groups, and the analytical procedure. Do not report percentages or “significance” for qualitative data.' },
      textual: { t: 'What to report for textual, semiotic or narrative analysis', d: 'The films, series, episodes or scenes analysed, why they were selected, the analytical framework and the interpretive procedure. Participants and sampling statistics are not relevant.' },
      survey: { t: 'What to report for a survey or experiment', d: 'Population, sample size and sampling, the instrument, and the statistical analysis. Results later need direction and key values.' },
      qcontent: { t: 'What to report for quantitative content analysis', d: 'The units and sample of texts, the coding scheme, reliability and the statistical analysis.' },
      mixed: { t: 'What to report for a mixed-methods study', d: 'Both strands (data and analysis) and how they were integrated. Integration is what distinguishes mixed methods from two separate studies.' },
      review: { t: 'What to report for historical, document or review studies', d: 'The sources examined, how they were identified, the guiding lens and how the material was analysed.' }
    },
    methodGuide: {
      interview: { report: ['Design (e.g. qualitative reception study)', 'Participants: number and relevant characteristics', 'Recruitment or sampling', 'Interviews or focus groups', 'Analytical procedure (e.g. reflexive thematic analysis)'], weak: 'We talked to some women about Turkish dramas and found many themes.', better: 'Semi-structured interviews with eight Saudi women aged 18–40 who watch Turkish drama were analysed using thematic analysis.' },
      textual: { report: ['The films, series, episodes or scenes analysed', 'Selection rationale', 'Analytical framework (e.g. Barthes, feminist film theory)', 'Interpretive procedure'], weak: 'This study watched the film carefully and analysed it.', better: 'Drawing on representation and feminist theory, the study analyses the portrayal of female characters in the Netflix film Amra and the Second Marriage.' },
      survey: { report: ['Population and sample size', 'Sampling method', 'Instrument', 'Statistical analysis'], weak: 'A questionnaire was given to many people and the results were analysed.', better: 'An online survey of 346 Saudi viewers aged 14–38 was analysed with descriptive statistics and hypothesis tests.' },
      qcontent: { report: ['Units and sample of texts', 'Coding scheme or codebook', 'Inter-coder reliability', 'Statistical analysis'], weak: 'We counted scenes in the series.', better: 'All scenes featuring three minority characters in the first season were coded with a six-category representation codebook.' },
      mixed: { report: ['Mixed-methods design (convergent, explanatory or exploratory)', 'Qualitative strand', 'Quantitative strand', 'How the strands were integrated'], weak: 'We used a survey and interviews.', better: 'A convergent design combined a survey of 76 users with interviews and observation; the strands were compared to explain adoption intentions.' },
      review: { report: ['Sources examined and their number', 'How sources were identified', 'Guiding lens', 'How the material was synthesised'], weak: 'The study read many sources about television.', better: 'Drawing on 35 sources and industry reports, the study offers a narrative review of Turkish drama consumption among Saudi women.' }
    },

    approaches, designs, fields, venues, langs, formats,
    limits: [{ id: '150', t: '150 words' }, { id: '200', t: '200 words' }, { id: '250', t: '250 words' }, { id: '300', t: '300 words' }, { id: 'custom', t: 'Custom limit' }],
    headingSets: {
      generic: { background: 'Background', aim: 'Aim', methods: 'Methods', results: 'Results', conclusion: 'Conclusions', limits: 'Limitations' },
      emerald: { background: '', aim: 'Purpose', methods: 'Design/methodology/approach', results: 'Findings', conclusion: 'Originality/value', limits: 'Research limitations/implications' },
      purpose: { background: '', aim: 'Purpose', methods: 'Methodology', results: 'Results', conclusion: 'Originality/value', limits: 'Limitations' },
      qual: { background: 'Context', aim: 'Aim', methods: 'Approach and data', results: 'Key findings', conclusion: 'Contribution', limits: 'Limitations' }
    },
    headingNames: { generic: 'Background · Aim · Methods · Results · Conclusions', emerald: 'Purpose · Design/methodology/approach · Findings · Originality/value (Emerald-style)', purpose: 'Purpose · Methodology · Results · Originality/value', qual: 'Context · Aim · Approach and data · Key findings · Contribution' },
    sectionNames,
    sectionHints: {
      background: 'One or two sentences; no citations.', aim: 'Purpose verb plus focus.', methods: 'Data, sample or texts, and analysis.',
      results: 'Your actual main and supporting findings.', conclusion: 'Contribution and supported implications.', limits: 'Only if the publication expects it.'
    },
    moveNames: { ctx: 'Context', aim: 'Purpose', met: 'Method', res: 'Findings', con: 'Contribution' },
    moveSection: { ctx: 'background', aim: 'aim', met: 'methods', res: 'results', con: 'conclusion' },

    fiRows: [
      ['Participants preferred broadcast dizi to streaming originals.', 'Platforms producing originals for Gulf audiences may need closer cultural adaptation.', 'Arab audiences reject all streaming content.'],
      ['Higher exposure to AI-themed films was associated with viewing AI as a threat.', 'Media literacy programmes could address film-based fears about AI.', 'Watching AI films causes young people to fear technology.'],
      ['The Arabic adaptation altered characters and narrative length.', 'Format adaptation research should examine cultural localisation of characters.', 'Arabic adaptations are always inferior to the originals.']
    ],
    findingsGuide: [
      { t: 'Qualitative findings', items: ['State the main themes and what they reveal, in relation to the question.', 'Use participants’ concepts where they matter (e.g. “culturally sanctioned fantasy”).', 'Do not list codes or report percentages for interview data.', 'Avoid “many participants” unless you can say what they shared.'], weak: 'Themes were: family, love, religion, culture, fashion, language.', better: 'Participants accepted romance when it stayed within family-centred storylines, and rejected portrayals they saw as culturally distant.' },
      { t: 'Quantitative findings', items: ['Give direction and key values (sizes, percentages, test statistics or effect sizes) as the journal expects.', 'Report the result that answers the main question first.', 'Do not call a result “significant” without the statistic or effect.', 'Avoid causal language for correlational designs.'], weak: 'There was a significant relationship between viewing and perceptions.', better: 'Higher exposure to AI-themed films was associated with viewing AI as a threat (p = .003, Cramér’s V = .14).' },
      { t: 'Mixed-methods findings', items: ['Report the key result of each strand briefly.', 'Say how they relate: confirm, extend or contradict each other.', 'Show what integration revealed that one strand alone would not.'] }
    ],
    hedging: [
      { t: 'Hedged reporting verbs', items: ['suggests', 'indicates', 'points to', 'may reflect', 'appears to'] },
      { t: 'Supported claims', items: ['shows', 'demonstrates (only with strong evidence)', 'identifies', 'reveals', 'documents'] },
      { t: 'Contribution phrases', items: ['extends … to …', 'offers a framework for …', 'provides evidence from …', 'contributes to debates on …', 'introduces the concept of …'] },
      { t: 'Avoid without evidence', items: ['proves', 'the first study ever', 'all audiences', 'always / never', 'revolutionary'] }
    ],
    rewrite: [
      { t: 'Context', tpl: ['[Phenomenon] has become [significant / widespread] in [context], yet [gap].', 'Although research on [topic] has examined [X], little is known about [Y].'], tip: 'One or two sentences; end with the gap.' },
      { t: 'Purpose', tpl: ['This study examines / explores / analyses how [focus] [verb] [object].', 'Drawing on [theory], this article investigates [aim].'], tip: 'A purpose verb and a precise focus; avoid “This paper is about”.' },
      { t: 'Method', tpl: ['Using [design], the study analysed [data] from [sample / texts].', '[Number] [participants] were interviewed and the data analysed using [procedure].'], tip: 'Past tense for what was done.' },
      { t: 'Findings', tpl: ['The analysis shows that [main finding].', 'Participants [verb] [finding], whereas [contrast].', '[Variable] was associated with [outcome] ([statistic]).'], tip: 'Lead with the most important result.' },
      { t: 'Contribution', tpl: ['These findings extend [theory] to [context].', 'The study offers [concept / framework] for analysing [phenomenon].', 'The findings have implications for [audience] in [context].'], tip: 'Present tense for conclusions; stay within the evidence.' }
    ],
    tenses: [
      ['Context', 'Present (established knowledge)', 'Turkish drama is widely watched in the Gulf.'],
      ['Purpose', 'Present or past', 'This study examines… / This study examined…'],
      ['Method', 'Past (what was done)', 'Interviews were conducted with 18 viewers.'],
      ['Findings', 'Past (what was found)', 'Participants preferred broadcast serials.'],
      ['Contribution', 'Present (what it means now)', 'The findings extend cultural proximity theory.']
    ],
    mistakes: [
      { t: 'Writing the abstract first', d: 'An abstract written before the study is finished often promises results that the paper does not deliver.', fix: 'Write or revise it last, from the final paper.' },
      { t: 'Too much background', d: 'Long histories and definitions crowd out the findings.', fix: 'One or two sentences of context ending with the gap.' },
      { t: 'No findings', d: 'Saying “results are discussed” instead of stating them (an indicative rather than informative abstract).', fix: 'State the main finding explicitly.' },
      { t: 'Citations and references', d: 'Most journals do not allow references in abstracts.', fix: 'Remove citations; name theories, not authors, unless essential.' },
      { t: 'Overclaiming', d: '“Proves”, “the first study”, or generalising from a small qualitative sample.', fix: 'Use precise, hedged language that matches the evidence.' },
      { t: 'Inconsistency with the paper', d: 'Numbers, sample sizes or terms that differ from the main text.', fix: 'Check every figure and term against the paper.' },
      { t: 'Undefined abbreviations', d: 'Readers may meet the abstract on its own.', fix: 'Spell out abbreviations or avoid them.' },
      { t: 'Ignoring the guidelines', d: 'Wrong length, missing headings or too many keywords can delay review.', fix: 'Check the target publication’s instructions in Step 9.' }
    ],
    venueNotes: [
      ['Journal article', 'Set by each journal; check the author guidelines.', 'Structured or unstructured, as the journal specifies.', 'Usually requested; number set by the journal.'],
      ['Thesis or dissertation', 'Set by the university; often longer than journal abstracts.', 'Usually unstructured; may include the research questions.', 'Sometimes required by the repository.'],
      ['Conference submission', 'Set by the call for papers.', 'Often unstructured; may include expected rather than final findings when allowed.', 'Sometimes requested for programme indexing.'],
      ['Book chapter', 'Set by the editors or publisher.', 'Usually unstructured.', 'Often requested for indexing.']
    ],
    structTypes: [
      { t: 'Informative unstructured abstract', d: 'One paragraph that moves from context to purpose, method, findings and contribution without headings.', when: 'Most film, television and humanities journals; theses; chapters — unless headings are required.', parts: ['Context and problem', 'Purpose', 'Method', 'Findings', 'Contribution'] },
      { t: 'Structured abstract (general)', d: 'Labelled sections; easier to scan and compare.', when: 'When the journal requires it, often in health, education and some communication journals.', parts: ['Background', 'Aim', 'Methods', 'Results', 'Conclusions'] },
      { t: 'Structured abstract (Purpose · Design/methodology/approach · Findings · Originality/value)', d: 'A widely used structured format in management and social science publishing; optional headings may cover limitations and implications.', when: 'When the publisher’s guidelines name these headings.', parts: ['Purpose', 'Design/methodology/approach', 'Findings', 'Research limitations/implications (optional)', 'Practical or social implications (optional)', 'Originality/value'] },
      { t: 'Indicative (descriptive) abstract', d: 'Describes what the paper does but not what it found.', when: 'Rarely suitable for empirical articles; sometimes used for reviews, essays or theoretical pieces.', parts: ['Topic and purpose', 'Scope and approach', 'What the paper discusses'] }
    ],
    selector: {
      q: [
        { id: 'guide', t: 'What do the publication guidelines say about the abstract format?', o: [{ id: 'structured', t: 'Headings are required' }, { id: 'unstructured', t: 'A single paragraph is required' }, { id: 'none', t: 'Nothing / I cannot find it' }] },
        { id: 'venue', t: 'Where will the abstract appear?', o: [{ id: 'journal', t: 'Journal' }, { id: 'thesis', t: 'Thesis' }, { id: 'conference', t: 'Conference' }, { id: 'chapter', t: 'Book chapter' }] },
        { id: 'approach', t: 'What kind of study is it?', o: [{ id: 'qual', t: 'Qualitative / interpretive' }, { id: 'quant', t: 'Quantitative' }, { id: 'mixed', t: 'Mixed methods' }, { id: 'theory', t: 'Theoretical or review' }] },
        { id: 'limit', t: 'What is the word limit?', o: [{ id: 'short', t: '150 words or fewer' }, { id: 'mid', t: '151–250 words' }, { id: 'long', t: 'More than 250 words' }] }
      ],
      result(s) {
        if (!s.guide) return null;
        if (s.guide === 'structured') return { t: 'Use a structured abstract with exactly the headings in the guidelines.', why: ['The guidelines decide; reviewers and indexing systems expect the named headings.', 'Choose the matching heading set in Step 7 and rename any heading to match the wording exactly.', s.limit === 'short' ? 'With a short limit, keep each section to one sentence.' : 'Give the Findings section the most words.'] };
        if (s.guide === 'unstructured') return { t: 'Use an unstructured, one-paragraph abstract.', why: ['The guidelines decide.', 'Keep the five moves in order — context, purpose, method, findings, contribution — linked by clear transitions.', s.approach === 'theory' ? 'For theoretical work, the “findings” move states the main argument.' : 'Make sure the findings are stated, not only announced.'] };
        const why = ['When guidelines are silent, an informative unstructured paragraph that follows the five moves is the safer default, because headings that the publication does not use would have to be removed.'];
        if (s.venue === 'thesis') why.push('Check your university’s thesis regulations: some require the research questions or a longer abstract.');
        if (s.venue === 'conference') why.push('Check the call for papers; some conferences accept expected findings for work in progress.');
        if (s.approach === 'mixed') why.push('Mention how the two strands were integrated, not only that both were used.');
        if (s.approach === 'theory') why.push('For theoretical or review work, an indicative element is acceptable, but state the main argument.');
        if (s.limit === 'short') why.push('With 150 words or fewer, compress context and method to one sentence each.');
        if (s.limit === 'long') why.push('With more than 250 words, a second paragraph for findings and contribution can improve readability.');
        why.push('If you can find recent abstracts in the target journal, follow their pattern.');
        return { t: 'Use an informative unstructured abstract (one paragraph).', why };
      }
    },
    extractor: [
      { path: 's1.title', q: 'What is the working title of your study?', hint: 'Shared with Step 1.', step: 0 },
      { path: 's1.problem', q: 'What problem does the study address?', hint: 'Shared with Step 1.', step: 0, area: 1 },
      { path: 's3.aim', q: 'What did the study set out to do?', hint: 'Shared with Step 3.', step: 2, area: 1 },
      { path: 's3.question', q: 'Which question does it answer?', hint: 'Shared with Step 3.', step: 2, area: 1 },
      { path: 's4.sample', q: 'Who or what did you study, and how many?', hint: 'Shared with Step 4.', step: 3, area: 1 },
      { path: 's4.analysis', q: 'How were the data analysed?', hint: 'Shared with Step 4.', step: 3 },
      { path: 's5.main', q: 'What is your single most important finding?', hint: 'Shared with Step 5.', step: 4, area: 1 },
      { path: 's6.contribution', q: 'What does your study add, and for whom?', hint: 'Shared with Step 6.', step: 5, area: 1 },
      { path: 's1.journal', q: 'Where will you submit it?', hint: 'Shared with Step 1.', step: 0 }
    ],

    /* Templates: only the researcher's own entries, joined into sentences */
    tpl: {
      profile(st) {
        const s = st.s1, lim = s.limit === 'custom' ? s.customLimit : s.limit;
        return [
          'Title: ' + (T(s.title) || '—'),
          'Research problem: ' + (T(s.problem) || '—'),
          'Approach and design: ' + ([pick(approaches, s.approach).t, pick(designs, s.design).t].filter(Boolean).join(' — ') || '—'),
          'Specialisation: ' + (pick(fields, s.field).t || '—'),
          'Publication: ' + ([pick(venues, s.venue).t, T(s.journal)].filter(Boolean).join(' — ') || '—'),
          'Abstract language: ' + (pick(langs, s.lang).t || '—') + ' · Format: ' + (pick(formats, s.format).t || '—') + ' · Word limit: ' + (T(lim) || '—')
        ].join('\n');
      },
      background(st) { const s = st.s2; return join([end(s.context), end(s.issue), end(s.problem), end(s.justification)]); },
      aim(st) { const s = st.s3; return join([end(s.aim), s.useQ && has(s.question) ? 'It addresses the question: ' + qmark(s.question) : '']); },
      methods(st, k) {
        const m = st.s4, d = pick(designs, st.s1.design), out = [];
        if (d.ph) out.push('The study adopted ' + d.ph + '.');
        if (k === 'interview') {
          if (has(m.collection) && has(m.sample)) out.push('Data were collected through ' + frag(m.collection) + ' with ' + frag(m.sample) + '.');
          else if (has(m.collection)) out.push('Data were collected through ' + frag(m.collection) + '.');
          else if (has(m.sample)) out.push('Participants were ' + frag(m.sample) + '.');
          if (has(m.sampling)) out.push('Participants were recruited through ' + frag(m.sampling) + '.');
          if (has(m.context)) out.push('The study was conducted in ' + frag(m.context) + '.');
          if (has(m.analysis)) out.push('The data were analysed using ' + frag(m.analysis) + '.');
        } else if (k === 'textual' || k === 'review') {
          if (has(m.corpus)) out.push('The study examined ' + frag(m.corpus) + (has(m.sampling) ? ', selected through ' + frag(m.sampling) : '') + '.');
          else if (has(m.sampling)) out.push('Material was selected through ' + frag(m.sampling) + '.');
          if (has(m.framework)) out.push('The analysis drew on ' + frag(m.framework) + '.');
          if (has(m.analysis)) out.push('The analytical procedure involved ' + frag(m.analysis) + '.');
          if (has(m.context)) out.push('The material is situated in ' + frag(m.context) + '.');
        } else if (k === 'survey') {
          if (has(m.sample)) out.push('Data were collected from ' + frag(m.sample) + (has(m.sampling) ? ', recruited through ' + frag(m.sampling) : '') + (has(m.collection) ? ', using ' + frag(m.collection) : '') + '.');
          else if (has(m.collection)) out.push('Data were collected using ' + frag(m.collection) + '.');
          if (has(m.context)) out.push('The study was conducted in ' + frag(m.context) + '.');
          if (has(m.analysis)) out.push('Data were analysed using ' + frag(m.analysis) + '.');
        } else if (k === 'qcontent') {
          if (has(m.corpus)) out.push('The study coded ' + frag(m.corpus) + (has(m.sampling) ? ', selected through ' + frag(m.sampling) : '') + '.');
          if (has(m.framework)) out.push('Coding followed ' + frag(m.framework) + '.');
          if (has(m.analysis)) out.push('Data were analysed using ' + frag(m.analysis) + '.');
          if (has(m.context)) out.push('The material is situated in ' + frag(m.context) + '.');
        } else if (k === 'mixed') {
          if (has(m.sample)) out.push('Participants were ' + frag(m.sample) + '.');
          if (has(m.qual)) out.push('The qualitative strand involved ' + frag(m.qual) + '.');
          if (has(m.quant)) out.push('The quantitative strand involved ' + frag(m.quant) + '.');
          if (has(m.integration)) out.push('The strands were integrated through ' + frag(m.integration) + '.');
          if (has(m.context)) out.push('The study was conducted in ' + frag(m.context) + '.');
        }
        return out.join(' ');
      },
      results(st) { const s = st.s5, a = st.s1.approach; return join([end(s.main), end(s.support), a !== 'quant' ? end(s.themes) : '', a !== 'qual' ? end(s.stats) : '', end(s.answer)]); },
      conclusion(st) { const s = st.s6; return join([end(s.contribution), end(s.theory), end(s.method), end(s.context), end(s.practical)]); },
      limits(st) { return end(st.s6.limits); }
    },

    /* Word lists for the transparent checks */
    lex: {
      longLimit: 35,
      stop: ['about', 'their', 'there', 'these', 'those', 'which', 'while', 'where', 'study', 'studie', 'research', 'paper', 'article', 'using', 'through', 'among', 'between', 'within', 'other', 'would', 'could', 'should', 'being', 'after', 'before', 'under', 'whose', 'whether', 'because', 'however', 'also', 'into', 'from', 'with', 'that', 'this', 'than', 'were', 'have', 'such'],
      allowRepeat: ['film', 'televis', 'drama', 'audience', 'participant', 'viewer', 'finding'],
      vague: ['very', 'really', 'a lot of', 'lots of', 'things', 'stuff', 'various', 'some aspects', 'and so on', 'etc', 'many important', 'interesting', 'in today’s world', 'nowadays', 'since the dawn of'],
      overclaim: ['prove', 'proves', 'proved', 'proven', 'the first study', 'first ever', 'for the first time', 'always', 'never', 'all audiences', 'all viewers', 'definitively', 'undoubtedly', 'clearly shows', 'revolutionary', 'groundbreaking', 'unprecedented'],
      future: ['will be', 'will show', 'will examine', 'will discuss', 'will explore', 'will analyse', 'will analyze', 'this paper will', 'this study will', 'is going to', 'are going to'],
      firstPerson: ['i', 'we', 'our', 'my', 'us'],
      intensifiers: ['extremely', 'highly significant', 'very significant', 'crucial', 'vital', 'huge', 'enormous'],
      moveCues: {
        ctx: ['although', 'yet', 'however', 'little is known', 'few studies', 'has become', 'have become', 'widely', 'growing', 'increasingly', 'remains', 'gap', 'despite', 'popular', 'under-researched', 'limited research'],
        aim: ['this study', 'this article', 'this paper', 'this research', 'aims to', 'aimed to', 'the purpose', 'the aim', 'examines', 'examined', 'explores', 'explored', 'investigates', 'investigated', 'analyses', 'analyzes', 'analysed', 'seeks to', 'objective'],
        met: ['interview', 'focus group', 'survey', 'questionnaire', 'sample', 'participants', 'respondents', 'analysis', 'analysed', 'analyzed', 'data', 'method', 'design', 'coded', 'thematic', 'semiotic', 'content analysis', 'episodes', 'scenes', 'drawing on', 'using'],
        res: ['found', 'findings', 'results', 'shows', 'showed', 'show', 'reveal', 'revealed', 'indicate', 'indicated', 'suggest', 'participants preferred', 'emerged', 'identified', 'associated', 'significant'],
        con: ['refine', 'refines', 'extend', 'deepens', 'advances', 'sheds light', 'contribute', 'contributes', 'contribution', 'implication', 'implications', 'extends', 'offers', 'highlights', 'informs', 'recommend', 'future research', 'the study provides', 'originality', 'value']
      },
      quantCues: ['statistically', 'significant', 'p <', 'p =', 'p<', 'p=', 'correlation', 'regression', 'chi-square', 'anova', 't-test', 'mean', 'standard deviation', 'percentage', 'percent', '%', 'hypothesis', 'variable'],
      qualCues: ['themes', 'thematic', 'interpretive', 'interviews', 'focus groups', 'semiotic', 'narrative analysis', 'discourse'],
      purposeVerbs: ['examine', 'examines', 'examined', 'explore', 'explores', 'explored', 'investigate', 'investigates', 'investigated', 'analyse', 'analyses', 'analysed', 'analyze', 'analyzes', 'analyzed', 'compare', 'compares', 'compared', 'assess', 'assesses', 'assessed', 'evaluate', 'evaluates', 'identify', 'identifies', 'interrogate', 'interrogates', 'trace', 'traces', 'aims to', 'aimed to', 'seeks to', 'sought to', 'argues', 'proposes', 'develops'],
      topicOnly: ['is about', 'deals with', 'talks about', 'the topic of', 'is concerned with the subject'],
      vagueFindings: ['many results', 'several results', 'important results', 'interesting results', 'various findings', 'results are discussed', 'findings are discussed', 'will be presented', 'are presented'],
      litReview: ['previous studies', 'many scholars', 'researchers such as', 'according to', 'et al', 'literature review'],
      generalise: ['all saudi', 'all arab', 'all women', 'all audiences', 'all viewers', 'everyone', 'in general', 'universally', 'always'],
      generalKw: ['media', 'study', 'research', 'film', 'films', 'television', 'tv', 'analysis', 'society', 'culture', 'people', 'communication', 'internet'],
      generalKwAr: ['اعلام', 'الاعلام', 'دراسه', 'الدراسه', 'بحث', 'البحث', 'فيلم', 'تلفزيون', 'التلفزيون', 'تحليل', 'مجتمع', 'المجتمع', 'ثقافه', 'اتصال'],
      kwStop: ['a', 'an', 'the', 'of', 'in', 'on', 'and', 'or', 'to', 'for', 'with', 'by', 'from', 'how', 'what', 'why', 'this', 'that', 'study', 'studies', 'examines', 'examine', 'explores', 'explore', 'analysis', 'analyses', 'investigates', 'case', 'among', 'between', 'through', 'its', 'their', 'is', 'are', 'was', 'were', 'as', 'at', 'into', 'aims', 'aim', 'paper', 'article', 'research', 'young']
    },

    /* Messages for the consistency checks */
    checkText: {
      draft: { t: 'Abstract draft', bad: 'There is no draft yet. Complete Steps 2–6 and build the abstract in Step 7.' },
      limit: { t: 'Word limit', ok: (a) => a[0] + ' words — within the limit of ' + a[1] + '.', bad: (a) => a[0] + ' words — ' + (a[0] - a[1]) + ' over the limit of ' + a[1] + '. Shorten background and method first.', info: (a) => a[0] + ' words of ' + a[1] + ' allowed. You have room to report findings more fully.', warn: 'No word limit is set. Set the limit from the guidelines in Step 1 or 9.' },
      format: { t: 'Format', ok: 'The draft matches the selected format.', warn: (x) => 'Check the headings: ' + x + '.' },
      moves: { t: 'Abstract moves', ok: 'Context, purpose, method, findings and contribution are all present.', warn: (x) => 'Not clearly present: ' + x + '.', bad: (x) => 'Missing an essential move: ' + x + '.' },
      placeholder: { t: 'Unfinished placeholders', bad: (x) => 'Replace the bracketed placeholders: ' + x + '.' },
      cite: { t: 'Citations', ok: 'No citations found.', warn: (x) => 'Most journals do not allow references in abstracts: ' + x + '.' },
      method: { t: 'Methodological accuracy', ok: 'The method description fits the selected approach.', warn: (x) => x === 'n' ? 'A quantitative study should report its sample size or number of units.' : x === 'mix' ? 'Describe how the qualitative and quantitative strands were integrated.' : x ? 'Statistical terms in a qualitative methods description: ' + x + '. Check that the wording fits your approach.' : 'Choose the research approach in Step 1.', info: (x) => 'Qualitative terms in a quantitative design: ' + x + '. Check that this is intended.' },
      findings: { t: 'Findings', ok: 'Findings are stated.', bad: 'No main finding has been entered (Step 5).', warn: (x) => x === 'num' ? 'Quantitative or mixed findings usually include key values.' : 'The qualitative findings read like a list of codes; state what the themes show.', info: () => 'Link the findings to the research question in one sentence (Step 5).' },
      vagueRes: { t: 'Vague findings', warn: (x) => 'Replace announcements with results: ' + x + '.' },
      overclaim: { t: 'Claims and generalisation', ok: 'No overclaiming words found.', warn: (x) => 'Check these claims against your evidence: ' + x + '.' },
      aim: { t: 'Purpose statement', ok: 'The aim uses a clear purpose verb.', info: 'The aim may name a topic rather than a purpose. Use a verb such as examines, explores or analyses.' },
      balance: { t: 'Balance of sections', ok: 'The sections are well balanced.', warn: (x) => x === 'bg' ? 'Background takes more than 30% of the words; shorten it.' : 'Findings take less than 15% of the words; report them more fully.' },
      tense: { t: 'Tense', ok: 'No future-tense announcements.', warn: (x) => 'Report what was done and found, not what “will” be: ' + x + '.' },
      abbr: { t: 'Abbreviations', ok: 'No undefined abbreviations.', warn: (x) => 'Define or remove: ' + x + '.' },
      sentences: { t: 'Sentence length', ok: 'No sentence is longer than 35 words.', warn: (n) => n + ' sentence(s) longer than 35 words.' },
      language: { t: 'Abstract language', warn: (x) => x === 'ar' ? 'The draft does not appear to be in Arabic, the language you selected.' : 'The draft does not appear to be in English, the language you selected.', info: () => 'You need two equivalent abstracts. Write each version fully; check that both report the same facts.' },
      title: { t: 'Title and abstract alignment', ok: 'Key words of the title appear in the abstract.', info: 'Few title words appear in the abstract. Check that both describe the same study.' },
      keywords: { t: 'Keywords', ok: 'Keywords meet the selected requirements.', warn: (x) => 'Check: ' + x + '.', bad: (x) => 'Check: ' + x + '.' },
      rules: { t: 'Publication rules', ok: 'All the rules you entered are marked as met.', warn: (n) => n + ' rule(s) not yet marked as met.' }
    },
    langMsg: {
      long: { t: 'Long sentences', ok: () => 'No sentence is longer than 35 words.', warn: (x) => x.n + ' sentence(s) longer than 35 words. Consider splitting: “' + x.list[0] + '”' },
      repeat: { t: 'Repetition', ok: () => 'No content word is repeated three or more times.', warn: (x) => 'Repeated words: ' + x.list.join(', ') + '. Vary or remove repetition where it is not a key term.' },
      vague: { t: 'Vague wording', warn: (x) => 'Replace with precise terms: ' + x.list.join(', ') + '.' },
      overclaim: { t: 'Overclaiming', warn: (x) => 'Check against the evidence: ' + x.list.join(', ') + '.' },
      future: { t: 'Future tense', warn: (x) => 'Report what was done: ' + x.list.join(', ') + '.' },
      cite: { t: 'Citations', warn: (x) => 'Remove references from the abstract: ' + x.list.join(', ') + '.' },
      abbr: { t: 'Abbreviations', warn: (x) => 'Define on first use or avoid: ' + x.list.join(', ') + '.' },
      placeholder: { t: 'Placeholders', bad: (x) => 'Unfinished: ' + x.list.join(', ') + '.' },
      question: { t: 'Questions', info: () => 'The abstract contains a question. Research questions are fine; rhetorical questions are usually not.' },
      first: { t: 'First person', info: (x) => 'First person (' + x.list.join(', ') + ') is accepted by some journals and not others. Follow the guidelines.' },
      intens: { t: 'Intensifiers', info: (x) => 'Consider removing: ' + x.list.join(', ') + '.' }
    },
    kwMsg: {
      none: { t: 'Keywords', bad: () => 'Add at least one keyword.' },
      count: { t: 'Number of keywords', ok: (x) => x.n + ' keyword(s) — within the selected range.', warn: (x) => x.n + ' keyword(s) — outside the selected range.' },
      dup: { t: 'Duplicates', warn: (x) => 'Repeated: ' + x.list.join(', ') + '.' },
      general: { t: 'Too general', warn: (x) => 'Use more specific terms than: ' + x.list.join(', ') + '.' },
      long: { t: 'Too long', warn: (x) => 'Keywords are usually one to four words: ' + x.list.join(', ') + '.' },
      title: { t: 'Repeats the title', info: (x) => 'Some journals advise keywords that add to the title: ' + x.list.join(', ') + '.' },
      pair: { t: 'Bilingual pairs', warn: (x) => x.n + ' keyword(s) lack an Arabic or English equivalent.' },
      cats: { t: 'Coverage', info: (x) => 'Consider keywords for: ' + x.list.map((c) => ({ topic: 'topic', method: 'method', context: 'cultural or geographical context' }[c])).join(', ') + '.' }
    },
    kwCats: [{ id: 'topic', t: 'Topic' }, { id: 'concept', t: 'Concept or theory' }, { id: 'method', t: 'Method' }, { id: 'medium', t: 'Film / TV context' }, { id: 'context', t: 'Cultural or geographical context' }],
    statusLabel: { ok: 'Good', warn: 'Revise', bad: 'Missing', info: 'Note' },

    rubric: [
      { id: 'context', t: 'Clarity of research context', d: 'The opening states the phenomenon and the problem briefly.' },
      { id: 'aim', t: 'Precision of the research aim', d: 'A clear purpose verb and a specific focus.' },
      { id: 'method', t: 'Accuracy of methodological description', d: 'Data, sample or texts and analysis, in terms that fit the approach.' },
      { id: 'findings', t: 'Adequacy of reported findings', d: 'Main findings stated, specific and answering the question.' },
      { id: 'contribution', t: 'Clarity of scholarly contribution', d: 'What the study adds, without overclaiming.' },
      { id: 'organisation', t: 'Logical organisation', d: 'Moves in a logical order with clear transitions.' },
      { id: 'language', t: 'Academic language', d: 'Clear, precise, consistent tense and register.' },
      { id: 'concise', t: 'Conciseness', d: 'No unnecessary background, repetition or detail.' },
      { id: 'terms', t: 'Terminological accuracy', d: 'Correct disciplinary terms, defined abbreviations, suitable keywords.' },
      { id: 'compliance', t: 'Compliance with publication requirements', d: 'Length, format, keywords and other rules.' }
    ],
    rubricDesc: {
      context: ['Missing, or a long literature summary.', 'Present but general; the gap is vague.', 'One or two sentences ending with a specific gap.'],
      aim: ['No aim, or only a topic.', 'An aim that is broad or loosely worded.', 'A precise purpose verb with a specific focus.'],
      method: ['Missing or inaccurate.', 'Partly described; key elements missing.', 'Design, data, sample or texts and analysis, accurately named.'],
      findings: ['Findings announced but not stated.', 'Stated but general.', 'Specific findings that answer the question.'],
      contribution: ['Missing or overclaimed.', 'Stated generally.', 'Specific, supported contribution.'],
      organisation: ['Moves missing or out of order.', 'All moves present; transitions weak.', 'Logical flow from context to contribution.'],
      language: ['Unclear or informal.', 'Generally clear; some long or vague sentences.', 'Clear, precise and consistent.'],
      concise: ['Well over the limit or padded.', 'Some unnecessary words.', 'Every sentence does work.'],
      terms: ['Inaccurate or undefined terms.', 'Mostly accurate.', 'Accurate disciplinary terminology throughout.'],
      compliance: ['Ignores the guidelines.', 'Minor deviations.', 'Fully compliant.']
    },
    rubricRec: {
      context: 'Reduce the opening to one or two sentences that end with a specific gap.',
      aim: 'Rewrite the aim with a purpose verb (examines, explores, analyses) and a specific focus.',
      method: 'Name the design, data, sample or texts and analytical procedure in terms that fit your approach.',
      findings: 'State the main finding explicitly and link it to the research question.',
      contribution: 'Say what the study adds and for whom, and remove claims the evidence cannot support.',
      organisation: 'Check that the five moves appear in order and add transitions between them.',
      language: 'Split long sentences, replace vague words and keep tenses consistent.',
      concise: 'Cut background and procedural detail before cutting findings.',
      terms: 'Check terms against the paper, define abbreviations and refine the keywords.',
      compliance: 'Recheck the word limit, format, keyword number and any other rule in Step 9.'
    },
    levels: [
      { min: 4.5, t: 'Ready for final checking', d: 'Verify every detail against the paper and guidelines.' },
      { min: 3.5, t: 'Strong draft', d: 'Revise the criteria rated 3 or below.' },
      { min: 2.5, t: 'Developing draft', d: 'Several elements need revision.' },
      { min: 0, t: 'Early draft', d: 'Return to the builder steps for the weakest criteria.' }
    ],
    checklist: [
      { id: 'last', t: 'Written from the final paper', d: 'The abstract matches the finished study, not the plan.' },
      { id: 'moves', t: 'All five moves present', d: 'Context, purpose, method, findings, contribution.' },
      { id: 'gap', t: 'Context ends with a specific gap', d: 'Not “little research exists”.' },
      { id: 'purpose', t: 'Purpose, not topic', d: 'A purpose verb and focus.' },
      { id: 'method', t: 'Method accurate and brief', d: 'Terms fit qualitative, quantitative or mixed design.' },
      { id: 'findings', t: 'Findings stated, not announced', d: 'At least one specific result.' },
      { id: 'claims', t: 'Claims match the evidence', d: 'No generalisation beyond the sample or texts.' },
      { id: 'consistent', t: 'Consistent with the paper', d: 'Numbers, names and terms match.' },
      { id: 'nocite', t: 'No citations or undefined abbreviations', d: 'Unless the guidelines allow them.' },
      { id: 'concise', t: 'Concise sentences', d: 'No repetition; long sentences split.' },
      { id: 'limit', t: 'Within the word limit and format', d: 'As stated by the publication.' },
      { id: 'bilingual', t: 'Equivalent language versions', d: 'If two languages are required, both report the same facts.' }
    ],

    examples: [
      { area: 'Turkish television series', approach: 'Qualitative — focus groups', title: 'Romance within limits: Young Saudi women’s reception of Turkish television drama',
        moves: [
          { m: 'ctx', t: 'Turkish television drama is widely watched in the Gulf, yet little is known about how young women negotiate its romantic storylines within local norms.' },
          { m: 'aim', t: 'This study explores how young Saudi women interpret romance in Turkish dizi.' },
          { m: 'met', t: 'Six focus groups with university students in Jeddah were analysed using reflexive thematic analysis.' },
          { m: 'res', t: 'Participants accepted romance when it remained within family-centred narratives, but rejected portrayals they regarded as culturally distant.' },
          { m: 'con', t: 'The findings refine cultural proximity theory by showing how proximity is actively negotiated rather than simply perceived.' }
        ], kw: 'Turkish drama; dizi; audience reception; cultural proximity; Saudi women', why: 'Each move is one sentence; the findings are specific and the contribution names the theory it refines.' },
      { area: 'Saudi cinema', approach: 'Qualitative — textual analysis', title: 'Belonging on screen: Cultural identity in contemporary Saudi feature films',
        moves: [
          { m: 'ctx', t: 'Since cinemas reopened in Saudi Arabia, local feature films have become a site for debating national identity.' },
          { m: 'aim', t: 'This article analyses how three Saudi feature films construct cultural identity and belonging.' },
          { m: 'met', t: 'Drawing on representation theory, the study examines characters, settings and narrative resolution through close textual analysis.' },
          { m: 'res', t: 'The films frame belonging through family obligation and urban mobility, while tradition is presented as negotiable rather than fixed.' },
          { m: 'con', t: 'The analysis contributes to scholarship on Gulf cinema by showing how films mediate social change.' }
        ], kw: 'Saudi cinema; cultural identity; representation; textual analysis', why: 'No participants or statistics: the method names the texts, the framework and the procedure.' },
      { area: 'Feminist film criticism', approach: 'Qualitative — feminist textual analysis', title: 'Looking back: Female agency and the gaze in Arab women’s cinema',
        moves: [
          { m: 'ctx', t: 'Feminist film theory has long questioned how cinema positions women as objects of looking, but Arab women directors remain under-examined in this debate.' },
          { m: 'aim', t: 'This study examines how two films by Arab women directors construct female agency.' },
          { m: 'met', t: 'Using feminist film theory, it analyses framing, point of view and narrative closure in selected scenes.' },
          { m: 'res', t: 'Both films use point-of-view shots and open endings to grant female characters narrative control.' },
          { m: 'con', t: 'The findings extend debates on the gaze to Arab women’s cinema.' }
        ], kw: 'feminist film theory; the gaze; Arab women directors; female agency', why: 'Theory appears in context and method without citations; the contribution stays within the two films.' },
      { area: 'Semiotic analysis', approach: 'Qualitative — semiotic analysis', title: 'Signs of home: A semiotic reading of the family house in a Gulf television series',
        moves: [
          { m: 'ctx', t: 'Domestic space is a recurring setting in Gulf television drama, yet its symbolic meanings are rarely analysed.' },
          { m: 'aim', t: 'This article explores how the family house signifies tradition and change in a Kuwaiti drama series.' },
          { m: 'met', t: 'Applying Barthes’s semiology to 20 key scenes, the study analyses denotation, connotation and myth.' },
          { m: 'res', t: 'The house connotes continuity, while its gradual renovation signifies negotiated modernity.' },
          { m: 'con', t: 'The study shows how semiotic analysis can reveal cultural arguments embedded in set design.' }
        ], kw: 'semiotics; Barthes; mise-en-scène; Gulf television drama', why: 'The method states the framework and the scenes analysed; findings are interpretive, not numerical.' },
      { area: 'Streaming platform audiences', approach: 'Quantitative — survey (illustrative figures)', title: 'Binge-watching motivations among Saudi young adults on streaming platforms',
        moves: [
          { m: 'ctx', t: 'Streaming platforms have expanded rapidly in Saudi Arabia, but young adults’ binge-watching motivations remain under-studied.' },
          { m: 'aim', t: 'Drawing on uses and gratifications theory, this study examines motivations for binge-watching and their relation to viewing time.' },
          { m: 'met', t: 'An online survey of 420 Saudi adults aged 18–30 was analysed using multiple regression.' },
          { m: 'res', t: 'Relaxation and narrative engagement predicted weekly viewing time, whereas social motivations did not.' },
          { m: 'con', t: 'The findings refine uses and gratifications research for streaming contexts in the Gulf.' }
        ], kw: 'binge-watching; streaming platforms; uses and gratifications; Saudi young adults', why: 'The sample, instrument and analysis are stated; the figures here are invented for teaching only.' },
      { area: 'Creative industry professionals', approach: 'Qualitative — interviews', title: 'Writing for the platform: Saudi screenwriters’ experiences of streaming commissions',
        moves: [
          { m: 'ctx', t: 'Streaming commissions are reshaping television production in Saudi Arabia, but screenwriters’ perspectives are rarely heard.' },
          { m: 'aim', t: 'This study explores how Saudi screenwriters experience creative control in streaming productions.' },
          { m: 'met', t: 'Semi-structured interviews with 14 screenwriters were analysed thematically.' },
          { m: 'res', t: 'Writers described greater thematic freedom alongside tighter data-driven expectations about pace and episode length.' },
          { m: 'con', t: 'The study contributes to production studies by documenting platform influence on authorship in the Gulf.' }
        ], kw: 'production studies; screenwriters; streaming; Saudi television industry', why: 'The participants and method are clear; the findings report a tension rather than a list.' },
      { area: 'Mixed-methods audience research', approach: 'Mixed methods — explanatory sequential', title: 'Why viewers stay: A mixed-methods study of Korean drama audiences in Saudi Arabia',
        moves: [
          { m: 'ctx', t: 'Korean drama has gained a large following in Saudi Arabia, yet the reasons for sustained viewing are unclear.' },
          { m: 'aim', t: 'This study examines what sustains Saudi viewers’ engagement with Korean drama.' },
          { m: 'met', t: 'A survey identified viewing patterns, and follow-up interviews explained them; the strands were integrated in a joint display.' },
          { m: 'res', t: 'Survey patterns linked sustained viewing to emotional engagement, and interviews explained this through perceived moral seriousness of the narratives.' },
          { m: 'con', t: 'Integration shows how affective and moral dimensions together shape transnational fandom.' }
        ], kw: 'Korean drama; mixed methods; audience engagement; transnational fandom', why: 'The integration is stated in the method and visible in the findings.' }
    ],
    published: [
      { area: 'Turkish television series', approach: 'Qualitative — interviews', cc: true, ref: 'Alardawi, M., Bajnaid, A., & Brereton, P. (2021). The influence of Turkish drama on socio-cultural values of Saudi women. Modern Applied Science, 15(4), 47. https://doi.org/10.5539/mas.v15n4p47',
        moves: [{ m: 'ctx', t: '“…more than 60 country-specific studies in the Middle East and North Africa have investigated the impact of dramas on audiences, Research regarding Saudi Arabia is surprisingly lacking.”' }, { m: 'met', t: '“…semi-structured interviews were conducted with eight Saudi women (aged between 18 and 40) who have watched TDs.”' }, { m: 'con', t: '“It is the first qualitative examination of the impact of TDs on Saudi women’s attitudes.”' }],
        lesson: 'The gap is specific and evidenced; the method names the design, sample and analysis. A first-of-its-kind claim needs support from the literature review, as here.' },
      { area: 'Saudi cinema', approach: 'Mixed methods — content and thematic analysis', cc: true, ref: 'Alardawi, M. M., Saqah, F. A., & Zakari, H. M. (2023). The representation of women in Saudi film: The case of Amra and the Second Marriage. Asian Social Science, 19(6), 123. https://doi.org/10.5539/ass.v19n6p123',
        moves: [{ m: 'aim', t: '“The current study examines female stereotypes as portrayed in this film, employing a mixed-method approach of quantitative content analysis and qualitative thematic analysis.”' }, { m: 'res', t: '“Approximately 40% of these characters were portrayed as modern, and around 35% were depicted as belonging to the upper class.”' }],
        lesson: 'Aim and method combined in one sentence; quantitative findings give values, and qualitative findings name stereotypes.' },
      { area: 'Format adaptation', approach: 'Qualitative — comparative content analysis', cc: true, ref: 'Alardawi, M., & Brereton, P. (2024). Arabic script television formats between adaptation and cultural identity: A case study of The Killing. International Journal of Psychological Studies, 16(4), 1. https://doi.org/10.5539/ijps.v16n4p1',
        moves: [{ m: 'met', t: '“…42.48 hours of programming were viewed…”' }, { m: 'res', t: '“Results identified three significant elements displaying differences and similarities: characters, narrative structure, and length of the broadcast series.”' }],
        lesson: 'Textual studies can report the size of the corpus; the findings name concrete dimensions of difference.' },
      { area: 'Streaming platform audiences', approach: 'Quantitative — survey', cc: true, ref: 'Qutub, A., & Alardawi, M. (2022). Saudi viewers’ perceptions of Attack on Titan Japanese animation online series. Asian Social Science, 18(1), 65. https://doi.org/10.5539/ass.v18n1p65',
        moves: [{ m: 'met', t: '“Data collection was undertaken by means of an online survey of 346 viewers of the animation, aged between fourteen and thirty-eight.”' }],
        lesson: 'A quantitative method sentence states instrument, sample size and age range; the abstract ends with a direction for future research.' },
      { area: 'AI in film', approach: 'Quantitative — survey (structured abstract)', ref: 'Alardawi, M. (2026). Exposure to AI-themed films and perceptions of artificial intelligence: A survey of Saudi young adults in Saudi Arabia. Online Media and Global Communication, 5(3), 498–527. https://doi.org/10.1515/omgc-2025-0083',
        lesson: 'A structured abstract with the headings Purpose, Methodology, Results and Originality/value: it states the theory and hypothesis, the sample and tests, reports the key statistic with an effect size, and states the contextual contribution.' },
      { area: 'Turkish television series', approach: 'Qualitative — focus groups', ref: 'Berg, M., Alardawi, M., & Al Obeidli, N. (2025). Cultural skimming, authenticity, and streaming preferences: Turkish serials (dizi) among young audiences in Qatar, Saudi Arabia, and the UAE. Critical Studies in Television. Advance online publication. https://doi.org/10.1177/17496020251404332',
        lesson: 'An unstructured abstract that introduces new analytical terms (“culturally sanctioned fantasy”, “cultural skimming”) within the findings and ends with the debates it contributes to.' },
      { area: 'Mixed-methods audience research', approach: 'Mixed methods', ref: 'Merrington, P., Hanchard, M., Wessels, B., Pidd, M., Rogers, K., Forrest, D., Higson, A., Smits, R., Townsend, N., & Yates, S. (2019). Using mixed-methods, a data model and a computational ontology in film audience research. Cultural Trends, 28(2–3), 118–131. https://doi.org/10.1080/09548963.2019.1617934',
        lesson: 'A methodological abstract: it names the project and its data (surveys, interviews, focus groups, documents), explains the integrating data model and states both the benefit and the cost of the approach.' },
      { area: 'Creative arts enquiry', approach: 'Qualitative — documentary practice (structured abstract)', ref: 'Wood, M., & Brown, S. (2012). Film-based creative arts enquiry: Qualitative researchers as auteurs. Qualitative Research Journal, 12(1), 130–147. https://doi.org/10.1108/14439881211222787',
        lesson: 'An example of the Purpose · Design/methodology/approach · Findings · Practical and social implications · Originality/value format in a film-based study.' },
      { area: 'Television representation', approach: 'Quantitative — content analysis', ref: 'Żerebecki, B. G., Opree, S. J., Hofhuis, J., & Janssen, S. (2024). Successful minority representations on TV count: A quantitative content analysis approach. Journal of Homosexuality, 71(7), 1703–1726. https://doi.org/10.1080/00918369.2023.2191287',
        lesson: 'The abstract states the codebook categories, the series and characters coded, and summarises results by category before suggesting uses of the codebook.' },
      { area: 'Television audiences', approach: 'Qualitative — focus groups (structured abstract)', ref: 'Dorey, E., Roberts, V., Maddison, R., Meagher-Lundberg, P., Dixon, R., & Ni Mhurchu, C. (2010). Children and television watching: A qualitative study of New Zealand parents’ perceptions and views. Child: Care, Health and Development, 36(3), 414–420. https://doi.org/10.1111/j.1365-2214.2009.01031.x',
        lesson: 'A Background · Methods · Results · Conclusions abstract for a qualitative study: the results report barriers and strategies in words, not numbers.' }
    ],

    ui: {
      next: 'Next step', finish: 'Final step', example: 'Example: ', tip: 'Tip:', weak: 'Weaker', better: 'Stronger',
      stepOf: (a, b) => 'Step ' + a + ' of ' + b, savedAt: (t) => 'Saved on this device at ' + t, notSaved: 'Not saved yet',
      required: 'This field is required.', tooShort: (n) => 'Please write at least ' + n + ' words.', chooseOne: 'Please choose an option.', needNumber: 'Enter a number.',
      needDraft: 'Build the abstract draft first (Step 7).', needKw: 'Add at least one keyword.', fixErrors: 'Please complete the highlighted fields before continuing.',
      chooseDesign: 'Choose a design…', chooseApproachFirst: 'Choose the approach first, or pick a design…',
      structureHelp: 'Not sure whether the publication needs a structured abstract?', structureLink: 'Use the Abstract Structure Selector.',
      useQ: 'Include the research question in the abstract', useQHint: 'Useful when the question is short and adds clarity.',
      fiCols: ['Finding (what the study showed)', 'Implication (what it may mean)', 'Unsupported generalisation (avoid)'],
      paraOne: 'One paragraph', paraTwo: 'Two paragraphs (findings and contribution in the second)',
      composerHint: 'Each section is filled from your earlier steps. Edit a section here to keep your wording; use “Reset” to refill it from the steps.',
      draftTitle: 'Full abstract draft', rebuild: 'Rebuild from sections', rebuildConfirm: 'Replace your edits? Click again', rebuilt: 'The draft was rebuilt from the sections.',
      draftAutoNote: 'This draft updates automatically from the sections until you edit it here.', draftEditedNote: 'You have edited the full draft directly; section changes no longer update it. Use “Rebuild from sections” to start again.',
      copy: 'Copy', copied: 'Copied to the clipboard.', copyFail: 'Copying failed. Select the text and copy it manually.',
      merged: 'merged into the next heading', headingFor: (s) => 'Heading for ' + s, words: (n) => n + ' words', moveUp: 'Move up', moveDown: 'Move down',
      resetSection: 'Reset', sectionReset: 'The section was refilled from your steps.', sectionEmpty: 'Empty — complete the related step or write here.',
      kindHead: (d, k) => d + ' · ' + k,
      langCheckTitle: 'Language checks', movesTitle: 'Abstract moves detected', movesHint: 'Detected through cue words, so a move may be present even when it is not ticked. Use it as a prompt.',
      rewriteTitle: 'Structured rewriting templates', checklistTitle: 'Abstract refinement checklist',
      rulesTitle: 'Other rules from the guidelines', rulesHint: 'Add rules such as “no abbreviations”, “one paragraph” or “write in the third person”, and tick each one when met.', addRule: 'Add a rule', ruleDone: 'Met', ruleLabel: 'Rule', rulePh: 'e.g. No references in the abstract', removeRule: 'Remove rule', noRules: 'No extra rules added.',
      complianceTitle: 'Compliance summary',
      wordsLbl: 'words', charsLbl: 'Characters', charsNsLbl: 'Without spaces', sentLbl: 'Sentences', noLimit: 'No limit set.', overBy: (n) => n + ' words over the limit.', remaining: (n) => n + ' words remaining.',
      section: 'Section', sectionWcNote: 'Findings usually deserve the largest share; background the smallest.',
      kwIntro: 'Enter each keyword in English and Arabic where needed. Choose established disciplinary terms rather than literal translations.',
      addKw: 'Add a keyword', kwLang: { en: 'English keyword', ar: 'Arabic keyword' }, kwCat: 'Type', removeKw: 'Remove keyword', noKw: 'No keywords yet.',
      kwCandTitle: 'Candidate terms from your title and aim', kwCandHint: 'Taken from your own wording. Click to add; edit or translate afterwards.', noCands: 'No candidates yet — complete the title and aim.', kwAdded: (v) => 'Added “' + v + '”.',
      kwLine: (s) => 'Keywords: ' + s, kwLineBoth: (a, e) => 'الكلمات المفتاحية: ' + a + '\nKeywords: ' + e,
      checksTitle: 'Rule-based checks', applyScores: 'Use the suggested scores', scoresApplied: 'Suggested scores applied. Adjust any you disagree with.',
      suggestedScore: 'Suggested:', overall: 'Overall', outOf5: '/ 5', recommendations: 'Recommendations', noRecs: 'No criterion is rated 3 or below.', notRated: 'Rate the criteria to see a summary.',
      evalDisclaimer: 'This evaluation is an educational self-assessment. It supports refinement but does not replace supervision, peer review or editorial assessment.',
      finalFromDraft: 'Copy the current draft here', replaceConfirm: 'Replace your final version? Click again', finalCopied: 'The draft was copied into the final version.', copyFinal: 'Copy final version',
      reportRegen: 'Regenerate report', regenConfirm: 'Replace your edits? Click again', reportRebuilt: 'The report was regenerated.', reportCopy: 'Copy report', print: 'Print / Save as PDF', doc: 'Download editable (.doc)', txt: 'Download text (.txt)',
      fileReport: 'research-abstract-report', fileData: 'research-abstract-project.json',
      deleteAll: 'Delete everything? Click again', deleted: 'Your saved data were deleted from this browser.', imported: 'Project imported.', importFail: 'This file could not be imported.',
      empty: '—', bgWords: (n, m) => 'Background: ' + n + ' words' + (m ? ' (about ' + m + ' or fewer suits your limit).' : '.'),
      bgLong: 'The background is long for the word limit. Keep one or two sentences.', bgOk: 'The background length is proportionate.', bgCites: 'Remove citations and literature summaries from the background.',
      aimOk: 'The aim states a purpose with a clear verb.', aimTopic: 'This reads like a topic. Start with a purpose verb: This study examines / explores / analyses…', aimLong: 'The aim is long; keep it to one sentence.',
      qualQuant: (x) => 'Statistical terms in a qualitative design: ' + x + '. Check the wording.', methodOk: 'The statement fits the selected design.', methodMissing: 'Some required elements for this design are still empty.', methodLong: 'The methods statement is long for an abstract; keep only what readers need.',
      resNumbers: 'Quantitative findings usually include key values.', resCodes: 'This reads like a list of codes. Say what the themes show.', resOk: 'The findings are stated.', resVague: (x) => 'Replace announcements with results: ' + x + '.',
      overclaim: (x) => 'Check these claims against your evidence: ' + x + '.', conOk: 'The contribution avoids overclaiming words.', generalise: 'This may generalise beyond your sample or texts. Specify the group, texts or context.',
      checklistDone: (a, b) => a + ' of ' + b + ' checked',
      selResult: 'Recommendation', selEmpty: 'Answer the first question to see a recommendation.',
      paraN: (n) => 'Paragraph ' + n, whenToUse: 'When to use:', report_: 'Report:', fix: 'Fix:',
      tenseCols: ['Move', 'Usual tense', 'Example'], limitCols: ['Publication type', 'Word limit', 'Format', 'Keywords'], rubricCols: ['Criterion', '1 — weak', '3 — developing', '5 — strong'],
      goStep: (n) => 'Open Step ' + n,
      exAll: 'All', exHyp: 'Illustrative teaching example', exPub: 'Published study', ccQuoted: 'Quoted under CC BY 4.0', kwLbl: 'Keywords:', whyWorks: 'Why it works:', lesson: 'What to learn:',
      glossCols: ['Term (English)', 'Arabic term', 'Definition', 'التعريف'],
      refGroups: { standards: 'Reporting standards and style guides', writing: 'Writing and evaluating abstracts', arabic: 'Arabic and English abstracts', methods: 'Methodology sources used in the guidance', examples: 'Film and television studies used as examples', tutorials: 'Video tutorials in the attached reference file' },
      refTypes: { standard: 'Reporting standard', guide: 'Style guide', article: 'Peer-reviewed article', book: 'Book', example: 'Published example', video: 'Practical guidance (not peer-reviewed)' },
      report: { title: 'Research abstract report', generated: (d) => 'Generated on ' + d + ' with the Research Abstract Writing and Refinement tool', researchTitle: 'Research title', profile: 'Research profile', method: 'Research methodology', format: 'Selected abstract format', draft: 'Complete abstract (draft)', wordCount: 'Word count', keywords: 'Academic keywords', evaluation: 'Evaluation results', self: 'Self-assessment', recs: 'Suggested improvements', noRecs: 'No outstanding issues were found.', final: 'Researcher’s final version', footer: 'Academic Tool Developed by Dr. Merfat Alardawi. Verify the abstract against the full paper and the publication’s guidelines before submission.' }
    }
  };
})();
