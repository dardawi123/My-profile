/* =========================================================
   Literature Review in Film and Television Studies
   English interface text, guidance, options, examples and templates.
   litreview-ar.js has exactly the same keys and structure.
   Academic tool developed by Dr. Merfat Alardawi
   ========================================================= */
window.RC = (function () {
  'use strict';
  const list = (a) => a.length <= 1 ? (a[0] || '') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1];
  const end = (s) => { s = String(s || '').trim(); return !s ? '' : (/[.!?…\]]$/.test(s) ? s : s + '.'); };
  const fill = (x, p) => (x && String(x).trim()) ? String(x).trim() : '[' + p + ']';
  const cite = (s) => {
    const a = String(s.authors || '').split(/;|\s&\s|\band\b/).map((x) => x.trim()).filter(Boolean);
    const sur = (x) => x.indexOf(',') !== -1 ? x.split(',')[0].trim() : x.trim().split(' ').pop();
    const who = !a.length ? '[author]' : a.length === 1 ? sur(a[0]) : a.length === 2 ? sur(a[0]) + ' and ' + sur(a[1]) : sur(a[0]) + ' et al.';
    return who + ' (' + (s.year || 'n.d.') + ')';
  };

  return {
    lang: 'en',
    numerals: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],

    steps: ['Scope', 'Search strategy', 'Screening', 'Evidence matrix', 'Critical appraisal', 'Synthesis', 'Research gaps', 'Structure', 'Writing', 'Evaluate & report'],
    stepText: [
      { h: 'Step 1 — Define the Literature Review Scope', p: 'Set out what the review is for, what it covers and which type of review it is.',
        whyH: 'A review answers a question', why: 'A literature review is not a list of everything published on a topic. It answers a review question for a purpose — to justify your study, map a field or evaluate evidence — and its type decides how systematic the search, selection and reporting must be.',
        ex: 'Review question — What does existing research show about how Arab women interpret Turkish television drama, and which methods has it used?',
        out: 'Expected output — a clearly defined literature review scope and purpose' },
      { h: 'Step 2 — Develop the Literature Search Strategy', p: 'Break the question into concepts, list terms in English and Arabic, and build search strings for each database.',
        whyH: 'Concepts, synonyms and Boolean logic', why: 'Synonyms of the same concept are joined with OR; different concepts are joined with AND; NOT removes unwanted results but can exclude relevant studies, so use it sparingly. Each database has its own syntax, and no single database covers film and television research fully.',
        ex: 'Concept 1 — Turkish drama: "Turkish drama" OR "Turkish series" OR dizi · Concept 2 — audience: viewer* OR audience* OR reception',
        out: 'Expected output — a structured bilingual literature search strategy' },
      { h: 'Step 3 — Screen and Select Relevant Studies', p: 'Set inclusion and exclusion criteria, record a decision for every study and keep a count of the selection process.',
        whyH: 'Transparent selection', why: 'Readers need to know why some studies are in the review and others are not. Screening normally runs in two stages: titles and abstracts first, then full texts. Record the reason for each exclusion.',
        ex: 'Inclusion — peer-reviewed empirical studies (2010–2026) of Arab audiences of Turkish drama, in English or Arabic. Exclusion — studies of other media forms; opinion pieces without data.',
        out: 'Expected output — a transparent and documented study-selection process' },
      { h: 'Step 4 — Extract and Organize Research Evidence', p: 'Record each selected study in the Literature Review Matrix.',
        whyH: 'Separate what a study says from what you think', why: 'The matrix keeps what the original study reports (aims, methods, findings, limitations) apart from your own interpretation (relevance and critical notes). This makes synthesis easier and protects you from misattributing claims.',
        ex: 'Reported — “Online questionnaire, 1,274 Saudi women aged 20–60”. Researcher’s note — “Large but non-probability sample; urban bias acknowledged.”',
        out: 'Expected output — a structured and editable evidence extraction matrix' },
      { h: 'Step 5 — Critically Evaluate Previous Studies', p: 'Appraise each included study against ten criteria suited to its kind of research.',
        whyH: 'Appraisal is not a score of worth', why: 'Appraisal asks how far a study’s design supports its claims and how relevant it is to your question. Empirical studies and interpretive film criticism are judged by different standards; this tool offers both sets of criteria.',
        ex: 'Sampling — “Partly: purposive sample of eight women; adequate for interpretation, but all urban and university-educated.”',
        out: 'Expected output — a structured critical appraisal of the selected literature' },
      { h: 'Step 6 — Compare and Synthesize Studies', p: 'Group studies into themes and compare them on theory, method, context and findings.',
        whyH: 'Themes, not one study after another', why: 'Synthesis means organising the literature around themes, concepts, debates or methodological patterns, then explaining where studies agree, disagree and why. A review that summarises one study per paragraph is descriptive, not critical.',
        ex: 'Theme — “Cultural proximity and its limits”: three studies report identification with Turkish family values; one survey finds that viewers reject cultural similarity as a motive.',
        out: 'Expected output — a thematic or conceptual synthesis framework' },
      { h: 'Step 7 — Identify Research Gaps and Scholarly Debates', p: 'State possible gaps and link each one to the studies that support it.',
        whyH: 'A gap needs evidence', why: 'A gap is an argument about the literature, not an absence in your search results. A study you did not find may exist in a database you did not search. Each gap here must point to studies in your matrix, and its status shows how well it is supported.',
        ex: 'Methodological gap — “Studies of Gulf audiences of Turkish drama rely on surveys and interviews; none combines audience data with analysis of the episodes discussed.” (linked to four studies)',
        out: 'Expected output — an evidence-informed research gap statement' },
      { h: 'Step 8 — Construct the Literature Review Structure', p: 'Choose an organising principle and outline the sections of your review.',
        whyH: 'Structure carries the argument', why: 'Thematic organisation suits most reviews; theoretical, methodological, chronological and comparative structures suit particular purposes. Whatever the structure, the review should lead the reader to your research gap and question.',
        ex: 'Thematic outline — 1 Transnational drama in the Gulf · 2 Cultural proximity · 3 Gender and identity negotiation · 4 Platforms and viewing practices · 5 Gaps · 6 Implications for this study.',
        out: 'Expected output — a structured literature review outline' },
      { h: 'Step 9 — Literature Review Writing and Refinement', p: 'Build synthesis paragraphs from the evidence you entered, then refine the draft.',
        whyH: 'Critical synthesis, not summary', why: 'Each paragraph should make a point about a theme, compare several studies, explain agreements and disagreements, evaluate methods and limitations, and say what this means for your study. The templates use only what you entered; nothing is invented.',
        ex: 'Synthesis — “While survey-based studies report enjoyment as the main motive, focus-group research suggests that viewers also negotiate values actively; this difference may reflect the methods used rather than the audiences studied.”',
        out: 'Expected output — an editable critical literature review draft' },
      { h: 'Step 10 — Literature Review Evaluation and Final Report', p: 'Rate your review on ten criteria, then edit and export the full report.',
        whyH: 'A tool for self-review', why: 'Suggested scores come from simple rules about your entries. They support self-review and do not replace assessment by your supervisor or an expert in the field.',
        ex: '', out: 'Final report — scope, search, selection, matrix, appraisal, synthesis, gaps, outline, draft, evaluation and references' }
    ],

    f: {
      's1.topic': { label: 'Research topic', ph: 'e.g. Arab audiences of Turkish television drama' },
      's1.problem': { label: 'Research problem', ph: 'What is not yet understood, and why does it matter?', hint: 'Two to four sentences.' },
      's1.question': { label: 'Main review question', ph: 'e.g. What does existing research show about how Arab women interpret Turkish television drama?' },
      's1.objectives': { label: 'Literature review objectives', ph: 'One per line, e.g. To map the theories used…', hint: 'One objective per line.' },
      's1.theory': { label: 'Theoretical perspective (where applicable)', ph: 'e.g. cultural proximity; uses and gratifications' },
      's1.context': { label: 'Geographical and cultural context', ph: 'e.g. Saudi Arabia and the Gulf' },
      's1.population': { label: 'Populations or audiovisual materials', ph: 'e.g. female viewers; Turkish serials (dizi)' },
      's1.period': { label: 'Publication period', ph: 'e.g. 2010–2026' },
      's1.approaches': { label: 'Preferred research approaches' },
      's1.reviewType': { label: 'Type of literature review' },
      's2.dbs': { label: 'Databases to search' },
      's2.yearFrom': { label: 'From year', ph: '2010' }, 's2.yearTo': { label: 'To year', ph: '2026' },
      's2.langs': { label: 'Languages' }, 's2.types': { label: 'Publication types' },
      's2.exclude': { label: 'Terms to exclude with NOT (optional)', ph: 'e.g. "video game"', hint: 'Use with care: NOT can remove relevant studies.' },
      's2.notes': { label: 'Search log notes (optional)', ph: 'e.g. date searched, number of results per database' },
      's3.include': { label: 'Inclusion criteria', ph: 'Topic, population, period, language, study type…' },
      's3.exclude': { label: 'Exclusion criteria', ph: 'What will be left out, and why' },
      's3.identified': { label: 'Records identified through searching', ph: 'e.g. 214' },
      's3.duplicates': { label: 'Duplicates removed', ph: 'e.g. 37' },
      's3.titleExcluded': { label: 'Excluded at title/abstract screening', ph: 'e.g. 120' },
      's8.structure': { label: 'Organising principle' },
      's9.limits': { label: 'Limitations of this review (optional)', ph: 'e.g. only English and Arabic; three databases searched' }
    },
    studyFields: [
      { id: 'authors', t: 'Author(s)', g: 'bib', ph: 'Surname, I.; Surname, I.', req: 1 },
      { id: 'year', t: 'Publication year', g: 'bib', ph: '2025', req: 1 },
      { id: 'title', t: 'Article title', g: 'bib', req: 1 },
      { id: 'journal', t: 'Journal or source', g: 'bib' },
      { id: 'doi', t: 'DOI or official URL', g: 'bib', ph: 'https://doi.org/…' },
      { id: 'objectives', t: 'Research objectives', g: 'rep', area: 1 },
      { id: 'questions', t: 'Research questions', g: 'rep', area: 1 },
      { id: 'theory', t: 'Theoretical framework', g: 'rep', ph: 'Separate several with commas' },
      { id: 'approach', t: 'Research methodology', g: 'rep', sel: 'approaches' },
      { id: 'design', t: 'Research design', g: 'rep' },
      { id: 'sample', t: 'Sample or audiovisual material', g: 'rep' },
      { id: 'context', t: 'Context (country, platform, period)', g: 'rep' },
      { id: 'collection', t: 'Data collection methods', g: 'rep' },
      { id: 'analysis', t: 'Data analysis methods', g: 'rep' },
      { id: 'findings', t: 'Main findings', g: 'rep', area: 1 },
      { id: 'limitations', t: 'Limitations reported by the authors', g: 'rep', area: 1 },
      { id: 'relevance', t: 'Relevance to the current study', g: 'own', area: 1 },
      { id: 'notes', t: 'Researcher’s critical observations', g: 'own', area: 1 }
    ],
    fieldGroups: { bib: 'Bibliographic details', rep: 'Reported by the original study', own: 'Your interpretation' },

    reviewTypes: [
      { id: 'narrative', t: 'Narrative review', d: 'A selective, expert-led overview that interprets a body of literature. Flexible, but its search and selection must still be explained.', req: 'Explain sources searched and how studies were chosen; no formal protocol required.', ftv: 'The literature chapter of most theses and articles.' },
      { id: 'critical', t: 'Critical review', d: 'Evaluates and challenges the literature, often proposing a new conceptual model or reading.', req: 'A clear evaluative stance and argued criteria; selection need not be exhaustive.', ftv: 'Questioning how “cultural proximity” has been used in Arab audience research.' },
      { id: 'integrative', t: 'Integrative review', d: 'Combines empirical and theoretical studies of different designs to produce a new synthesis or framework (Torraco, 2016; Whittemore & Knafl, 2005).', req: 'Systematic search, explicit criteria, appraisal adapted to diverse designs.', ftv: 'Integrating textual, audience and industry studies of streaming originals.' },
      { id: 'scoping', t: 'Scoping review', d: 'Maps the extent, range and nature of research on a broad topic and identifies gaps; usually does not appraise quality (Arksey & O’Malley, 2005; Peters et al., 2020).', req: 'Protocol, systematic search, charting of data; reported with PRISMA-ScR (Tricco et al., 2018).', ftv: 'Mapping research on Saudi cinema since 2018.' },
      { id: 'systematic', t: 'Systematic review', d: 'Answers a focused question with a pre-specified protocol, comprehensive search, explicit criteria, appraisal and transparent synthesis.', req: 'Protocol, comprehensive multi-database search, double screening, appraisal; reported with PRISMA 2020 (Page et al., 2021).', ftv: 'Effects of exposure to televised minority portrayals on attitudes.' }
    ],
    approaches: [
      { id: 'qual', t: 'Qualitative' }, { id: 'mixed', t: 'Mixed methods' }, { id: 'quant', t: 'Quantitative' },
      { id: 'textual', t: 'Textual or interpretive criticism' }, { id: 'review', t: 'Review or theoretical' }
    ],
    langs: [{ id: 'en', t: 'English' }, { id: 'ar', t: 'Arabic' }],
    pubTypes: [{ id: 'article', t: 'Peer-reviewed articles' }, { id: 'book', t: 'Books and chapters' }, { id: 'thesis', t: 'Theses' }, { id: 'conf', t: 'Conference papers' }],
    dbs: [
      { id: 'scopus', t: 'Scopus', d: 'Large multidisciplinary index; strong for communication and media journals.', syntax: 'TITLE-ABS-KEY( … ); truncation with *; exact phrase in "quotes"; PUBYEAR and LANGUAGE limits.' },
      { id: 'wos', t: 'Web of Science', d: 'Selective citation index (SSCI, AHCI); useful for citation tracking.', syntax: 'TS=( … ) searches topic fields; truncation with *; phrases in "quotes"; years set in the interface.' },
      { id: 'cmmc', t: 'Communication & Mass Media Complete (EBSCO)', d: 'Specialist database for communication, media and journalism research.', syntax: 'Field codes TI (title) and AB (abstract); truncation with *; phrases in "quotes".' },
      { id: 'ftli', t: 'Film & Television Literature Index (EBSCO)', d: 'Specialist index for film and television studies, including reviews and trade press.', syntax: 'Same EBSCO syntax: TI and AB field codes; truncation with *.' },
      { id: 'jstor', t: 'JSTOR', d: 'Archive of humanities journals and books; strong for older film scholarship; coverage of recent issues may be delayed.', syntax: 'Boolean operators in capitals; ti: for title; truncation with *.' },
      { id: 'gscholar', t: 'Google Scholar', d: 'Very broad and includes grey literature, but results are not reproducible and cannot be filtered precisely (Gusenbauer & Haddaway, 2020).', syntax: 'Keep strings short; OR between synonyms; phrases in "quotes"; no truncation; use allintitle: for titles.' },
      { id: 'arabic', t: 'Arabic databases (e.g. Dar Almandumah, Al Manhal)', d: 'Needed for research published in Arabic, which international indexes cover poorly.', syntax: 'Search with Arabic terms; check spelling variants (ة/ه, ي/ى) and with and without “ال”.' }
    ],
    screenStatus: [{ id: 'included', t: 'Included' }, { id: 'maybe', t: 'Undecided' }, { id: 'excluded', t: 'Excluded' }],
    excludeReasons: ['Not about the review topic', 'Wrong population or material', 'Outside the publication period', 'Not an eligible publication type', 'No empirical data (if required)', 'Language not covered', 'Full text not available'],

    appraisalSets: {
      empirical: [
        { id: 'c1', t: 'Clarity of research objectives', d: 'Are aims and questions clearly stated?' },
        { id: 'c2', t: 'Theoretical coherence', d: 'Is the theory explained and used consistently in design and interpretation?' },
        { id: 'c3', t: 'Methodological appropriateness', d: 'Does the approach suit the questions?' },
        { id: 'c4', t: 'Research design justification', d: 'Is the design explained and justified?' },
        { id: 'c5', t: 'Sampling or case selection', d: 'Are participants, cases or texts appropriate and described?' },
        { id: 'c6', t: 'Data collection procedures', d: 'Are procedures described in enough detail?' },
        { id: 'c7', t: 'Analytical rigour', d: 'Is the analysis described and do the findings follow from the data?' },
        { id: 'c8', t: 'Ethical considerations', d: 'Are consent, confidentiality and approval reported where relevant?' },
        { id: 'c9', t: 'Transparency and limitations', d: 'Are limitations and the researcher’s role discussed?' },
        { id: 'c10', t: 'Relevance to the review question', d: 'How directly does the study inform your question?' }
      ],
      textual: [
        { id: 'c1', t: 'Clarity of argument', d: 'Is the critical question or thesis clearly stated?' },
        { id: 'c2', t: 'Theoretical framing', d: 'Is the interpretive framework explicit and used consistently?' },
        { id: 'c3', t: 'Appropriateness of the critical approach', d: 'Does the approach (formal, semiotic, feminist…) suit the question?' },
        { id: 'c4', t: 'Justification of the corpus', d: 'Is the choice of films, episodes or scenes explained?' },
        { id: 'c5', t: 'Close textual evidence', d: 'Are claims grounded in specific scenes, shots or sequences?' },
        { id: 'c6', t: 'Attention to form and context', d: 'Does the analysis connect form, production and cultural context?' },
        { id: 'c7', t: 'Interpretive rigour', d: 'Are alternative readings considered; is the reading plausible?' },
        { id: 'c8', t: 'Engagement with scholarship', d: 'Is the argument positioned within existing criticism?' },
        { id: 'c9', t: 'Reflexivity and limitations', d: 'Does the critic acknowledge their position and the limits of the reading?' },
        { id: 'c10', t: 'Relevance to the review question', d: 'How directly does the work inform your question?' }
      ]
    },
    appraisalKinds: [{ id: 'empirical', t: 'Empirical study (qualitative, quantitative or mixed)' }, { id: 'textual', t: 'Interpretive film or television criticism' }],
    ratings: [{ id: 'yes', t: 'Yes', v: 2 }, { id: 'partly', t: 'Partly', v: 1 }, { id: 'no', t: 'No', v: 0 }, { id: 'na', t: 'Not applicable', v: null }],
    appraisalTools: [
      { id: 'casp', t: 'CASP checklists', d: 'Short checklists for qualitative studies and other designs; good for teaching and quick appraisal.' },
      { id: 'jbi', t: 'JBI critical appraisal tools', d: 'Design-specific checklists (qualitative, cross-sectional, etc.) used in JBI systematic and scoping reviews.' },
      { id: 'mmat', t: 'Mixed Methods Appraisal Tool (MMAT)', d: 'One tool covering qualitative, quantitative and mixed-methods studies; discourages overall numerical scores (Hong et al., 2018).' }
    ],
    appraisalNote: 'The criteria here are adapted for teaching from these established approaches. They are not a replacement for the original tools when a formal systematic review requires them. For interpretive criticism, empirical criteria such as sampling or ethics are replaced with criteria of argument, evidence and interpretation.',

    gapTypes: [
      { id: 'empirical', t: 'Empirical gap', d: 'A phenomenon, question or finding has not been studied, or only rarely.', ex: 'No study of how Saudi viewers engage with Turkish streaming originals since 2022.' },
      { id: 'theoretical', t: 'Theoretical gap', d: 'Existing theories do not explain a phenomenon, or have not been tested in this context.', ex: 'Cultural proximity theory does not explain the reported rejection of cultural similarity as a motive.' },
      { id: 'methodological', t: 'Methodological gap', d: 'A question has been studied only with certain methods.', ex: 'Audience studies rarely analyse the episodes their participants discuss.' },
      { id: 'contextual', t: 'Contextual or geographical gap', d: 'Findings come from other countries, platforms or periods.', ex: 'Most reception research on dizi comes from the Levant and the Balkans.' },
      { id: 'population', t: 'Population-related gap', d: 'Certain groups are missing (age, gender, region, profession).', ex: 'Male and older Saudi viewers are under-represented.' },
      { id: 'contradiction', t: 'Contradictory findings', d: 'Studies disagree, and the reason is not yet explained.', ex: 'Studies disagree on whether viewing encourages or resists value change.' },
      { id: 'material', t: 'Under-explored audiovisual material or context', d: 'Certain films, genres, platforms or production contexts are rarely studied.', ex: 'Saudi animated series have received little scholarly attention.' }
    ],
    gapStatus: {
      potential: { t: 'Potential gap', d: 'Not yet linked to studies in your matrix. Treat it as a hypothesis.' },
      verify: { t: 'Needs further verification', d: 'Supported by one study or by a limited search. Search further before relying on it.' },
      supported: { t: 'Supported by reviewed evidence', d: 'Linked to two or more included studies and a documented search.' }
    },
    absenceNote: 'The absence of a study from a limited search does not establish a genuine research gap. A study may exist in a database, language or publication type you did not search.',

    structures: [
      { id: 'thematic', t: 'Thematic', d: 'Sections follow themes or concepts across studies. Suits most reviews.' },
      { id: 'theoretical', t: 'Theoretical', d: 'Sections follow theories or debates, showing how each has been used and contested.' },
      { id: 'methodological', t: 'Methodological', d: 'Sections follow methods (e.g. textual analysis, surveys, ethnography), showing what each has revealed.' },
      { id: 'chronological', t: 'Chronological', d: 'Sections follow periods, when the development of the field over time is the point.' },
      { id: 'comparative', t: 'Comparative', d: 'Sections compare contexts, media or audiences (e.g. broadcast vs streaming).' }
    ],
    outlineParts: [
      { id: 'intro', t: 'Introductory overview', ph: 'Purpose of the review, scope, how the literature was identified, and how the chapter is organised.' },
      { id: 'themes', t: 'Main review themes', ph: 'One line per theme, in the order you will discuss them.' },
      { id: 'debates', t: 'Theoretical debates', ph: 'Which theories are used, contested or combined?' },
      { id: 'methods', t: 'Methodological comparisons', ph: 'Which methods dominate, and what do they reveal or miss?' },
      { id: 'critical', t: 'Critical evaluation of findings', ph: 'How strong and consistent is the evidence?' },
      { id: 'limits', t: 'Limitations and unresolved questions', ph: 'What remains unclear or contested?' },
      { id: 'gaps', t: 'Research gaps', ph: 'Your evidence-supported gaps.' },
      { id: 'conclusion', t: 'Concluding synthesis', ph: 'How the literature leads to your research question and design.' }
    ],

    guide: {
      critical: [
        { t: 'Describe', d: 'Report what a study did and found — necessary, but only the starting point.' },
        { t: 'Interpret', d: 'Explain what the findings mean and why they might have occurred.' },
        { t: 'Evaluate', d: 'Judge the strength of the evidence: design, sample, context, limitations.' },
        { t: 'Synthesise', d: 'Bring several studies together to make a point that none makes alone.' }
      ],
      descVsCrit: [
        { desc: 'Smith (2020) studied Turkish drama audiences in Jordan. She found that viewers enjoyed family storylines.', crit: 'Studies of Arab audiences consistently report the appeal of family storylines (Smith, 2020; Hamid, 2022), but most rely on self-reported enjoyment, so they say little about how viewers interpret the values these storylines carry.' },
        { desc: 'Many studies have looked at gender in Saudi films.', crit: 'Research on gender in Saudi film has moved from counting female roles to analysing agency and point of view, yet this shift has been largely confined to feature films, leaving television series under-examined.' }
      ],
      linkers: {
        agree: ['Similarly,', 'Consistent with this,', 'This finding is echoed by'],
        differ: ['In contrast,', 'However,', 'Whereas … , …', 'This contrasts with'],
        explain: ['This difference may reflect', 'One explanation is that'],
        evaluate: ['Although …, the study’s reliance on … limits', 'These findings should be read in light of'],
        implication: ['Taken together, these studies suggest', 'This leaves open the question of', 'The present study addresses this by']
      },
      citation: [
        { t: 'Author-prominent', d: 'Puts the researcher in focus: “Berg et al. (2025) argue that…”. Use when the author’s position matters.' },
        { t: 'Information-prominent', d: 'Puts the idea in focus: “…recommendation systems shape choice (Berg et al., 2025).” Use for synthesis.' },
        { t: 'Multiple citation', d: 'Groups studies that share a point: “(Alardawi, 2025; Berg et al., 2025)”. The basic tool of synthesis.' }
      ],
      aiNote: 'AI tools can help with searching, summarising and language, but they can invent references and misreport findings. Check every source and claim against the original publication; the review, its judgements and its argument must remain yours (attached tutorials).',
      prismaNote: 'PRISMA 2020 is a reporting guideline for systematic reviews; PRISMA-ScR is its extension for scoping reviews. They describe what to report, not how to conduct every review. A narrative or critical review does not need a PRISMA diagram, though a short account of the search and selection is good practice.',
      matrixNote: 'Columns marked “Reported” hold what the study itself states. Columns marked “Yours” hold your interpretation. Keep them apart.'
    },

    rubric: [
      { id: 'relevance', t: 'Relevance of selected literature', d: 'Studies clearly relate to the review question.' },
      { id: 'coverage', t: 'Coverage of important scholarly debates', d: 'Key theories, methods and contexts are represented.' },
      { id: 'search', t: 'Quality and transparency of the search strategy', d: 'Concepts, terms, databases and limits are documented.' },
      { id: 'critical', t: 'Critical engagement with previous studies', d: 'Studies are evaluated, not only described.' },
      { id: 'theory', t: 'Theoretical coherence', d: 'Theories are explained and compared consistently.' },
      { id: 'method', t: 'Methodological awareness', d: 'Methods and their consequences for findings are discussed.' },
      { id: 'synthesis', t: 'Depth of synthesis', d: 'Studies are integrated into themes and compared.' },
      { id: 'gaps', t: 'Evidence supporting research gaps', d: 'Gaps are linked to reviewed studies and search limits.' },
      { id: 'organisation', t: 'Logical organisation', d: 'The structure builds an argument towards the study.' },
      { id: 'writing', t: 'Academic writing and referencing accuracy', d: 'Clear prose; complete and accurate references.' }
    ],
    rubricRec: {
      relevance: 'Recheck each included study against your inclusion criteria and the review question; note the relevance of each in the matrix.',
      coverage: 'Look for missing theoretical positions, methods or contexts; consider an additional database or Arabic-language sources.',
      search: 'Document the concepts, synonyms, databases, limits, dates searched and numbers of results.',
      critical: 'Add appraisal notes and limitations for each study; use them when you write.',
      theory: 'Compare how studies use the same theory, and where they diverge.',
      method: 'Explain how methods shape findings — for example surveys versus focus groups.',
      synthesis: 'Assign studies to themes and record agreements and contradictions for each theme.',
      gaps: 'Link each gap to at least two included studies and acknowledge the limits of the search.',
      organisation: 'Choose an organising principle and complete the outline before drafting.',
      writing: 'Replace one-study-per-paragraph summaries with comparative sentences; check every reference against its source.'
    },
    levels: [
      { min: 4.5, t: 'Well-developed review', d: 'Critical, well organised and transparent; refine with your supervisor.' },
      { min: 3.5, t: 'Sound with some gaps', d: 'Strengthen the lower-rated criteria.' },
      { min: 2.5, t: 'Needs further development', d: 'Several parts remain descriptive or undocumented.' },
      { min: 0, t: 'Early draft', d: 'Return to the search, matrix and synthesis steps.' }
    ],

    chk: {
      scope: { t: 'Scope defined', ok: 'Topic, question, objectives and review type are set.', bad: 'Complete the topic, review question, objectives and review type (Step 1).' },
      search: { t: 'Search strategy documented', ok: 'At least two concepts with terms and two databases are recorded.', warn: 'Add at least two concepts with synonyms and two databases (Step 2).' },
      arabic: { t: 'Arabic-language search', ok: 'Arabic terms are included.', warn: 'Your scope includes Arabic, but no Arabic terms or Arabic databases are listed.' },
      criteria: { t: 'Selection criteria stated', ok: 'Inclusion and exclusion criteria are stated.', warn: 'State inclusion and exclusion criteria (Step 3).' },
      reasons: { t: 'Exclusion reasons recorded', ok: 'Every excluded study has a reason.', warn: 'Some excluded studies have no recorded reason.' },
      undecided: { t: 'Screening complete', ok: 'No study is left undecided.', warn: 'Some studies are still marked “undecided”.' },
      enough: { t: 'Number of included studies', ok: 'Several studies are included.', warn: 'Fewer than three studies are included — a synthesis needs more evidence.' },
      matrix: { t: 'Matrix completeness', ok: 'Included studies record method, findings and limitations.', warn: 'Some included studies lack method, findings or limitations.' },
      own: { t: 'Your critical notes', ok: 'Most included studies have your own relevance or critical notes.', warn: 'Add your own relevance or critical notes to more studies.' },
      appraised: { t: 'Critical appraisal', ok: 'Included studies have been appraised.', warn: 'Appraise more of your included studies (Step 5).' },
      themes: { t: 'Synthesis themes', ok: 'Themes are defined and studies assigned to them.', warn: 'Define themes and assign at least two studies to each (Step 6).' },
      contra: { t: 'Agreements and contradictions', ok: 'Agreements or contradictions are recorded for your themes.', warn: 'Record where studies agree and disagree within each theme.' },
      gapsLinked: { t: 'Gaps linked to evidence', ok: 'Every gap is linked to included studies.', warn: 'Some gaps are not linked to any study — they remain potential gaps.' },
      reviewFit: { t: 'Review type and procedures', ok: 'Your procedures are consistent with the review type.', warn: 'A systematic or scoping review needs a documented flow of records (Step 3) and at least three databases.' },
      outline: { t: 'Review outline', ok: 'An organising principle and outline are in place.', warn: 'Choose an organising principle and outline the review (Step 8).' },
      descriptive: { t: 'Critical rather than descriptive writing', ok: 'The draft uses comparative and evaluative language.', warn: 'The draft reads mostly as summary — add comparison, evaluation and synthesis.' }
    },
    statusLabel: { ok: 'Consistent', warn: 'Check', bad: 'Fix', info: 'Note' },

    examples: [
      { area: 'Audience reception of Turkish television drama', q: 'How have Arab women’s interpretations of Turkish drama been studied, and what do the studies conclude?', type: 'Narrative review', search: 'Scopus, CMMC, Google Scholar and Dar Almandumah; English and Arabic terms for Turkish drama, Arab women and reception; 2008–2026.', criteria: 'Empirical audience studies of Arab viewers; excluding studies of other media.', synthesis: 'Themes: pleasure and gratifications; cultural proximity; negotiation of gender roles; platform change.', gap: 'Methodological: audience data rarely connected to analysis of the episodes discussed.' },
      { area: 'Cultural identity in Saudi streaming drama', q: 'What is known about how Saudi streaming originals represent national identity?', type: 'Scoping review', search: 'Scopus, Web of Science, FTLI and Arabic databases; 2018–2026 (after cinema reopening and streaming growth).', criteria: 'Any study design, including textual analysis and industry studies.', synthesis: 'Charting by platform, genre, method and theme of identity.', gap: 'Contextual: few studies of regional platforms compared with Netflix originals.' },
      { area: 'Feminist film criticism', q: 'How has feminist film theory been applied to films by Arab women directors?', type: 'Critical review', search: 'FTLI, JSTOR, Scopus; key works traced backwards and forwards through citations.', criteria: 'Critical and theoretical studies; empirical studies only where they inform the debate.', synthesis: 'Organised theoretically: the gaze, voice, embodiment, and postcolonial feminism.', gap: 'Theoretical: Western concepts of the gaze applied without adaptation to local viewing contexts.' },
      { area: 'Semiotic analysis of films', q: 'Which semiotic approaches have been used to analyse Arab cinema, and with what results?', type: 'Integrative review', search: 'JSTOR, Scopus, Arabic databases; semiotic and film terms in both languages.', criteria: 'Studies applying semiotic analysis to Arab films.', synthesis: 'Organised methodologically: Barthesian, Peircean and social-semiotic approaches.', gap: 'Methodological: sound and music rarely included in semiotic readings.' },
      { area: 'Streaming platform audiences', q: 'How do audiences in the Gulf choose between regional and global streaming platforms?', type: 'Integrative review', search: 'Scopus, Web of Science, CMMC, Google Scholar, industry reports noted separately.', criteria: 'Empirical audience studies 2015–2026; industry reports kept as context, not evidence.', synthesis: 'Comparative structure: regional vs global platforms; motives, content, interfaces.', gap: 'Empirical: little research on recommendation systems in Arabic interfaces.' },
      { area: 'Visual narrative and cultural representation', q: 'How have studies analysed the visual representation of the family in Gulf television drama?', type: 'Narrative review', search: 'FTLI, Scopus, Dar Almandumah; terms for family, representation and Gulf drama.', criteria: 'Textual, content-analytic and audience studies of Gulf drama.', synthesis: 'Thematic: authority, generational change, space and the home, gender roles.', gap: 'Methodological: content counts dominate; close formal analysis of mise-en-scène is rare.' }
    ],
    published: [
      { area: 'Audience reception of Turkish television drama', ref: 'Alardawi (2025)', type: 'Narrative literature review', what: 'Effects of Turkish television dramas on the media behaviour, cultural identity and gender roles of Saudi women.', search: 'Google Scholar, JSTOR, Scopus, ProQuest and EBSCOhost; English and Arabic publications 2010–2025; peer-reviewed articles, dissertations and books.', screened: '50 sources screened; 35 included. Secondary data from platform and industry reports were used for context.', synthesis: 'Thematic synthesis leading to a proposed Cultural Negotiation Framework.', lesson: 'A narrative review can report its databases, period, criteria and numbers screened — and should state the limits of secondary data, as this review does.' }
    ],
    practiceNote: 'Practice entries come from published studies in the attached reference file. Bibliographic details and reported content are summarised from the articles; the “Your interpretation” fields are left for you.',
    practice: [
      { authors: 'Alardawi, M.', year: '2026', title: 'Exploring Saudi women’s consumption of Turkish dramas', journal: 'Journal of Humanities and Social Sciences Studies, 8(7), 160–179', doi: 'https://doi.org/10.32996/jhsss.2026.8.7.15', objectives: 'To examine motivations, viewing preferences and selective adoption of portrayed values among Saudi female viewers.', questions: '', theory: 'Uses and gratifications, cultural proximity, cultivation, social identity', approach: 'quant', design: 'Cross-sectional survey', sample: '1,274 Saudi women aged 20–60 who regularly watch Turkish dramas', context: 'Saudi Arabia', collection: 'Online questionnaire', analysis: 'Descriptive and inferential statistics', findings: 'Pleasure and passing time were the main gratifications; cultural similarity was rejected as a motive; younger, single and more educated respondents showed higher acceptance of non-traditional gender roles.', limitations: 'Predominantly young, urban and educated sample.', relevance: '', notes: '' },
      { authors: 'Berg, M.; Alardawi, M.; Al Obeidli, N.', year: '2025', title: 'Cultural skimming, authenticity, and streaming preferences: Turkish serials (dizi) among young audiences in Qatar, Saudi Arabia, and the UAE', journal: 'Critical Studies in Television (OnlineFirst)', doi: 'https://doi.org/10.1177/17496020251404332', objectives: 'To explore how university students in three Gulf countries engage with Turkish serials made as streaming originals.', questions: '', theory: 'Cultural proximity, authenticity', approach: 'qual', design: 'Focus group study', sample: 'Undergraduate students aged 18–25; ten focus groups per country', context: 'Qatar, Saudi Arabia, UAE; streaming platforms', collection: 'Focus groups, in person and on Zoom', analysis: 'Thematic analysis (Braun & Clarke, 2019)', findings: 'Participants linked platform choice to authenticity: regional platform content felt closer to lived experience, while streaming originals were seen as polished but emotionally distant.', limitations: 'University students only; not representative of all Gulf youth.', relevance: '', notes: '' },
      { authors: 'Alardawi, M.; Brereton, P.', year: '2024', title: 'Squid Game: Pleasure and consumption of Korean drama by young Saudi audiences', journal: 'Mediatization Studies, 8, 69–89', doi: 'https://doi.org/10.17951/ms.2024.8.69-89', objectives: 'To investigate why Squid Game succeeded among young Saudis and the pleasure they derive from it.', questions: '', theory: 'Audience pleasure, engagement', approach: 'mixed', design: 'Two-stage mixed methods', sample: 'Online survey of 50 Saudis aged 18–21; focus groups with 23 participants aged 18–30', context: 'Saudi Arabia; Netflix', collection: 'Online survey, focus groups', analysis: 'Survey description; qualitative analysis of focus groups', findings: 'Success attributed to the storyline, pandemic-era binge-watching and word-of-mouth marketing; viewers reported intense emotional engagement.', limitations: '', relevance: '', notes: '' },
      { authors: 'Alardawi, M.', year: '2025', title: 'Saudi women and Turkish dramas: Identity and media influence', journal: 'World Journal of Social Science, 12(1), 12–21', doi: 'https://doi.org/10.5430/wjss.v12n1p12', objectives: 'To review the effects of Turkish dramas on the media behaviour, cultural identity and gender roles of Saudi women.', questions: '', theory: 'Cultural negotiation', approach: 'review', design: 'Narrative literature review', sample: '35 sources (from 50 screened) and secondary platform data', context: 'Saudi Arabia, 2010–2025', collection: 'Database searching', analysis: 'Thematic narrative synthesis', findings: 'Turkish dramas encourage identity reflection and negotiation through empowered but culturally relevant female characters, amplified by digital platforms.', limitations: 'Reliance on secondary data; possible urban bias of platform data.', relevance: '', notes: '' }
    ],

    lex: {
      synth: ['similarly', 'in contrast', 'however', 'whereas', 'while', 'both', 'consistent with', 'unlike', 'together', 'taken together', 'across', 'by contrast', 'although', 'yet', 'this suggests', 'these studies', 'in line with', 'contrary to', 'compared with'],
      evalw: ['limit', 'limitation', 'weakness', 'strength', 'rely', 'relies', 'bias', 'small sample', 'generalis', 'generaliz', 'robust', 'questionable', 'overlook', 'neglect', 'fail to'],
      desc: ['found that', 'studied', 'examined', 'investigated', 'conducted', 'reported that', 'explored', 'focused on', 'looked at', 'this study'],
      vague: ['etc', 'many studies', 'some studies', 'various', 'a lot of', 'and so on'],
      stop: ['the', 'and', 'of', 'in', 'on', 'for', 'to', 'a', 'an', 'how', 'what', 'why', 'do', 'does', 'is', 'are', 'with', 'by', 'their', 'its', 'this', 'that', 'from', 'as', 'at', 'among', 'study', 'research']
    },

    tpl: {
      scope(st, L) {
        const s = st.s1, r = [];
        if (s.topic) r.push('Topic: ' + s.topic);
        if (s.question) r.push('Review question: ' + s.question);
        if (L.reviewType) r.push('Review type: ' + L.reviewType.t + ' — ' + L.reviewType.req);
        const sc = [s.context, s.population, s.period].filter(Boolean);
        if (sc.length) r.push('Scope: ' + sc.join(' · '));
        if (L.approaches.length) r.push('Preferred approaches: ' + list(L.approaches.map((x) => x.t.toLowerCase())));
        if (s.theory) r.push('Theoretical perspective: ' + s.theory);
        return r.join('\n') || 'Complete the fields above.';
      },
      searchSummary(st, L) {
        const c = st.s2.concepts.filter((x) => x.en || x.ar);
        if (!c.length) return 'Add concepts and terms above.';
        return c.length + ' concept' + (c.length === 1 ? '' : 's') + ' · ' + L.dbs.length + ' database' + (L.dbs.length === 1 ? '' : 's') + ' · ' + [st.s2.yearFrom, st.s2.yearTo].filter(Boolean).join('–');
      },
      screenSummary(n) { return 'Included: ' + n.included + ' · Undecided: ' + n.maybe + ' · Excluded: ' + n.excluded; },
      cite,
      reference(s) {
        const doi = s.doi ? ' ' + s.doi : '';
        const au = String(s.authors || '').split(';').map((x) => x.trim()).filter(Boolean);
        const ar = /[\u0600-\u06FF]/.test(au.join(''));
        const authors = au.length < 2 ? au.join('') : au.length === 2 ? au[0] + (ar ? ' و' : ', & ') + au[1] : au.slice(0, -1).join(ar ? '، ' : ', ') + (ar ? '، و' : ', & ') + au[au.length - 1];
        return (authors || '[Author]') + ' (' + (s.year || 'n.d.') + '). ' + end(s.title || '[Title]') + (s.journal ? ' ' + end(s.journal) : '') + doi;
      },
      paragraph(theme, studies, st) {
        const cs = studies.map(cite);
        const out = [];
        out.push(end(fill(theme.desc, 'state the point this theme makes about the literature')));
        if (studies.length) {
          out.push('This theme draws on ' + list(cs) + '.');
          const withF = studies.filter((s) => s.findings);
          if (withF[0]) out.push(cite(withF[0]) + (/ and | et al\.|&/.test(cite(withF[0])) ? ' report' : ' reports') + ' that ' + end(withF[0].findings.charAt(0).toLowerCase() + withF[0].findings.slice(1)));
          if (theme.agree) out.push('Similarly, ' + end(theme.agree.charAt(0).toLowerCase() + theme.agree.slice(1)));
          if (theme.contra) out.push('In contrast, ' + end(theme.contra.charAt(0).toLowerCase() + theme.contra.slice(1)));
          const ap = [...new Set(studies.map((s) => s.design).filter(Boolean))];
          if (ap.length > 1) out.push('These studies differ methodologically (' + ap.join('; ') + '), which may explain part of the variation in their findings.');
          const lim = studies.filter((s) => s.limitations);
          if (lim.length) out.push('Their conclusions should be read in light of reported limitations, such as ' + end(lim[0].limitations.charAt(0).toLowerCase() + lim[0].limitations.slice(1)));
          out.push('[Explain what this theme means for your study.]');
        } else out.push('[Assign studies to this theme in Step 6.]');
        return out.join(' ');
      },
      gapStatement(g, studies, L) {
        const t = L.gapType ? L.gapType.t.toLowerCase() : 'research gap';
        return (/^[aeiou]/.test(t) ? 'An ' : 'A ') + t + ' emerges from the reviewed literature: ' + end(fill(g.statement, 'state the gap')) + (studies.length ? ' This is based on ' + list(studies.map(cite)) + '.' : ' [Link this gap to studies in your matrix.]');
      },
      introDraft(st, L) {
        const n = L.included.length;
        return 'This review addresses the question: ' + fill(st.s1.question, 'review question') + ' It is ' + (L.reviewType ? (/^[aeiou]/i.test(L.reviewType.t) ? 'an ' : 'a ') + L.reviewType.t.toLowerCase() : 'a [review type]') + ' of research on ' + fill(st.s1.topic, 'topic') + (st.s1.context && String(st.s1.topic).toLowerCase().indexOf(st.s1.context.toLowerCase()) === -1 ? ' in ' + st.s1.context : '') + '. Literature was identified through ' + (L.dbs.length ? list(L.dbs.map((d) => d.t)) : '[databases]') + (st.s2.yearFrom || st.s2.yearTo ? ', covering ' + [st.s2.yearFrom, st.s2.yearTo].filter(Boolean).join('–') : '') + ', and ' + n + ' stud' + (n === 1 ? 'y was' : 'ies were') + ' included. The review follows a ' + (L.structure ? L.structure.t.toLowerCase() : '[organising principle]') + ' structure.';
      },
      conclusionDraft(st, L) {
        return 'Taken together, the reviewed studies ' + (L.themes.length ? 'cluster around ' + list(L.themes.map((t) => t.name.toLowerCase())) : '[summarise the themes]') + '. ' + (L.gaps.length ? 'The review identifies ' + L.gaps.length + ' gap' + (L.gaps.length === 1 ? '' : 's') + ', ' + list(L.gaps.map((g) => (L.gapTypes.find((x) => x.id === g.type) || {}).t || '').map((x) => x.toLowerCase())) + '. ' : '') + 'The present study addresses ' + fill('', 'state which gap your study addresses and how') + '.';
      }
    },

    refine: {
      ratio: (d, s) => 'Sentences that mainly describe single studies: ' + d + ' · comparative or evaluative sentences: ' + s + '.',
      descriptive: 'Most sentences describe single studies. Rewrite some to compare studies, evaluate methods or state what they show together.',
      oneStudy: (n) => n + ' paragraph(s) cite only one study — synthesis usually brings several together.',
      brackets: (n) => n + ' bracketed prompt(s) still to complete.',
      vague: (w) => 'Replace vague wording (' + w + ') with specific studies or claims.',
      ok: 'The draft uses comparative and evaluative language. Check each claim against your matrix and sources.',
      edited: 'You have edited the draft. The checks read your edited text.'
    },

    ui: {
      next: 'Next step', prev: 'Previous step', finish: 'Go to evaluation',
      stepOf: (a, b) => 'Step ' + a + ' of ' + b,
      notSaved: 'Not saved yet', savedAt: (t) => 'Saved on this device at ' + t,
      required: 'This field is required.', tooShort: (n) => 'Please write at least ' + n + ' words.', chooseOne: 'Please choose an option.',
      fixErrors: 'Some required entries are missing. Please complete the highlighted fields.',
      needStudies: 'Add at least one study to the matrix before continuing.',
      empty: '—', words: (n) => n + (n === 1 ? ' word' : ' words'), restored: 'Your saved progress has been restored.',
      concept: (n) => 'Concept ' + n, conceptEn: 'English terms (one per line or separated by commas)', conceptAr: 'Arabic terms', addConcept: 'Add concept', removeConcept: 'Remove concept',
      conceptPhEn: 'e.g. Turkish drama, Turkish series, dizi', conceptPhAr: 'مثال: الدراما التركية، المسلسلات التركية',
      phrase: 'Multi-word terms are put in "quotation marks" automatically. Add * to a word for truncation (e.g. viewer*).',
      stringsTitle: 'Search strings', copy: 'Copy', copied: 'Copied to the clipboard.', copyFail: 'Copying failed — select the text and copy it manually.',
      noStrings: 'Add terms to at least one concept to build search strings.',
      stringAr: 'Arabic search string', arNote: 'For Arabic databases and Google Scholar. Try spelling variants (ة/ه, ي/ى) and terms with and without “ال”.',
      gsNote: 'Simplified for Google Scholar: first terms only, no truncation.',
      addStudy: 'Add a study', editStudy: 'Edit', deleteStudy: 'Delete', deleteConfirm: 'Delete? Click again', save: 'Save study', cancel: 'Cancel', studyForm: 'Study details',
      loadPractice: 'Load practice studies', practiceLoaded: 'Practice studies added to your matrix.', practiceExists: 'Practice studies are already in your matrix.',
      filter: 'Filter the matrix', filterPh: 'Search authors, titles, methods, findings…', status: 'Screening decision', reason: 'Reason for exclusion', reasonPh: 'Choose or type a reason',
      allStatuses: 'All decisions', sortBy: 'Sort by', exportCsv: 'Export CSV', exportJson: 'Export JSON', noStudies: 'No studies yet. Add your first study or load the practice studies.',
      noMatch: 'No study matches the filter.', columns: 'Columns', compact: 'Key columns', full: 'All columns',
      flowTitle: 'Selection flow', flow: { identified: 'Records identified', duplicates: 'Duplicates removed', screened: 'Records screened', titleExcluded: 'Excluded at title/abstract', fulltext: 'Full texts assessed (in matrix)', excluded: 'Full texts excluded', included: 'Studies included', undecided: 'Undecided' },
      flowNote: 'Numbers you typed are combined with the decisions recorded in your matrix.',
      appraiseWhich: 'Study to appraise', appraiseKind: 'Kind of study', appraiseNone: 'Include at least one study (Step 3) to appraise it.', appraisalNotes: 'Overall appraisal notes',
      appraisalSummary: (y, p, n) => 'Yes: ' + y + ' · Partly: ' + p + ' · No: ' + n, notAppraised: 'Not yet appraised', appraised: 'Appraised',
      themeName: 'Theme name', themeDesc: 'Point this theme makes', themeDescPh: 'e.g. Viewers negotiate rather than adopt the values portrayed', agree: 'Where studies agree', contra: 'Where studies disagree, and possible reasons',
      addTheme: 'Add theme', removeTheme: 'Remove theme', themeStudies: 'Studies in this theme', noThemes: 'No themes yet.', themeSuggest: 'Example themes for film and television research:',
      exampleThemes: ['Cultural representation in Saudi television drama', 'Gender representation in contemporary cinema', 'Audience interpretations of international television series', 'Streaming platforms and changing viewing practices', 'Narrative and semiotic approaches in film criticism'],
      synthTable: 'Research Synthesis Matrix', compareBy: 'Compare studies by', dims: { theory: 'Theoretical perspective', approach: 'Methodology', design: 'Design', context: 'Context', sample: 'Population or material', findings: 'Findings', limitations: 'Limitations' },
      mapTitle: 'Research Evidence Map', mapNote: 'Lines connect each included study to its theories, its methodology and the themes you assigned. Hover or focus a study to highlight its links.', mapEmpty: 'Include studies and assign themes to see the map.', mapCols: ['Theories and concepts', 'Studies', 'Themes', 'Methodology'],
      gapType: 'Type of gap', gapStatement: 'Gap statement', gapStatementPh: 'What is missing, contradictory or unresolved?', gapEvidence: 'Supporting studies from your matrix', addGap: 'Add gap', removeGap: 'Remove gap', noGaps: 'No gaps yet.', gapDraft: 'Draft statement',
      outlineFromThemes: 'Fill themes and gaps from my entries', outlineFilled: 'Outline filled from your themes and gaps.',
      draftTitle: 'Literature review draft', regen: 'Rebuild draft from my entries', regenConfirm: 'Replace my edits? Click again', regenerated: 'The draft has been rebuilt.', copyDraft: 'Copy draft',
      refineTitle: 'Critical-writing check', checkText: 'Text to check', checkTextPh: 'Paste a paragraph from your literature review…',
      suggestedScore: 'Suggested:', applyScores: 'Apply suggested scores', scoresApplied: 'Suggested scores applied. Adjust them as you see fit.',
      overall: 'Overall educational assessment', outOf5: 'out of 5', notRated: 'Rate the criteria to see the assessment.', recommendations: 'Recommendations for refinement', noRecs: 'No criterion is rated 3 or below.',
      evalDisclaimer: 'This evaluation supports academic self-review. It does not replace assessment by your supervisor or an expert in the field.',
      report: {
        title: 'Literature Review Report', generated: (d) => 'Generated on ' + d + ' with the Literature Review in Film and Television Studies tool (Dr. Merfat Alardawi).',
        topic: 'Research topic and review question', scope: 'Literature review scope', search: 'Search strategy', criteria: 'Inclusion and exclusion criteria', selected: 'Selected studies', matrix: 'Literature review matrix', appraisal: 'Critical appraisal notes', themes: 'Synthesis themes', gaps: 'Research gaps', outline: 'Proposed literature review structure', draft: 'Draft synthesis paragraphs', evaluation: 'Evaluation results', refs: 'Reference list (from your entries — check against APA 7)', recs: 'Recommended improvements', noRecs: 'No specific recommendations.', include: 'Inclusion', exclude: 'Exclusion'
      },
      reportRebuilt: 'The report has been rebuilt from your entries.', reportRegen: 'Rebuild report', reportCopy: 'Copy report', print: 'Print', doc: 'Download Word (.doc)', txt: 'Download text (.txt)',
      fileReport: 'literature-review-report', fileData: 'literature-review-data.json', fileCsv: 'literature-review-matrix.csv',
      exportData: 'Export my project (JSON)', importData: 'Import project', deleteData: 'Delete my saved data', deleteAll: 'Delete everything? Click again',
      deleted: 'Your saved data has been deleted.', imported: 'Your project has been imported.', importFail: 'This file could not be imported.',
      checkerEmpty: 'Start the Builder to see the checks.',
      glossSearch: 'Search the terminology', glossEmpty: 'No matching term.', glossCols: ['Term', 'Arabic', 'Definition', 'Arabic definition'],
      exAll: 'All areas', exHyp: 'Hypothetical teaching example', exPub: 'Published review',
      exLabels: { q: 'Review question', type: 'Review type', search: 'Search', criteria: 'Criteria', synthesis: 'Synthesis', gap: 'Gap identified', what: 'Focus', screened: 'Screening', lesson: 'What it teaches', source: 'Source' },
      refGroups: { core: 'Attached reference file: studies used as examples', review: 'Literature review methods and reporting', appraisal: 'Search, appraisal and synthesis', gaps: 'Research gaps and writing', film: 'Film and television research' },
      refTypes: { article: 'Journal article', book: 'Book', chapter: 'Book chapter', guide: 'Guidelines or tool' },
      pending: 'Details to be completed', yes: 'Yes', no: 'No', reported: 'Reported', yours: 'Yours'
    }
  };
})();
