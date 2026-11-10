/* =========================================================
   Refining and Formulating Research Titles — English language file
   Interface text, guidance data, rule lexicon and title templates.
   Academic tool developed by Dr. Merfat Alardawi
   ========================================================= */
(function () {
  'use strict';

  const clean = (x) => String(x || '').trim().replace(/[.?!;:،,\s]+$/, '');
  const v = (x, p) => clean(x) || '[' + p + ']';
  const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  const split = (s) => String(s || '').split(/[,;،\n]+/).map(clean).filter(Boolean);
  const timeTail = (t) => clean(t) ? ' (' + clean(t) + ')' : '';
  /* Title case for generated titles: capitalise major words, keep short function words lower case
     (except at the start or after a colon). Words with internal capitals (e.g. iPhone, UAE) are kept. */
  const SMALL = ['a', 'an', 'the', 'and', 'or', 'nor', 'but', 'of', 'in', 'on', 'at', 'to', 'for', 'by', 'with', 'from', 'as', 'via', 'into', 'onto', 'among', 'between', 'through', 'vs'];
  const tc = (s) => String(s).split(/(\s+)/).map((w, i, arr) => {
    if (/^\s+$/.test(w) || !w) return w;
    const prev = arr.slice(0, i).join('').trim();
    const first = !prev || /[:(]$/.test(prev);
    const core = w.replace(/^[“"'(\[]+/, '');
    if (/[A-Z]/.test(core.slice(1)) || /^\[/.test(w)) return w;
    if (!first && SMALL.indexOf(core.toLowerCase().replace(/[^a-z]/g, '')) !== -1) return w.toLowerCase();
    return w.replace(/[A-Za-z]/, (c) => c.toUpperCase()).replace(/-([a-z])/g, (m, c) => '-' + c.toUpperCase());
  }).join('');

  const METHODS = [
    { id: 'semiotic', t: 'Semiotic analysis', title: 'A Semiotic Analysis', fit: ['qual', 'mixed'] },
    { id: 'narrative', t: 'Narrative analysis', title: 'A Narrative Analysis', fit: ['qual', 'mixed'] },
    { id: 'feminist', t: 'Feminist film and television criticism', title: 'A Feminist Critical Reading', fit: ['qual', 'mixed'] },
    { id: 'representation', t: 'Cultural representation analysis', title: 'An Analysis of Cultural Representation', fit: ['qual', 'mixed'] },
    { id: 'reception', t: 'Audience reception study', title: 'An Audience Reception Study', fit: ['qual', 'mixed'] },
    { id: 'thematic', t: 'Thematic analysis', title: 'A Thematic Analysis', fit: ['qual', 'mixed'] },
    { id: 'discourse', t: 'Discourse analysis', title: 'A Discourse Analysis', fit: ['qual', 'mixed'] },
    { id: 'comparative', t: 'Comparative analysis', title: 'A Comparative Analysis', fit: ['qual', 'mixed', 'quant'] },
    { id: 'case', t: 'Case study', title: 'A Case Study', fit: ['qual', 'mixed'] },
    { id: 'mixed', t: 'Mixed-methods research', title: 'A Mixed-Methods Study', fit: ['mixed'] },
    { id: 'content', t: 'Quantitative content analysis', title: 'A Content Analysis', fit: ['quant', 'mixed'] },
    { id: 'survey', t: 'Survey study', title: 'A Survey Study', fit: ['quant', 'mixed'] }
  ];

  window.RC = {
    lang: 'en',
    numerals: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],

    ui: {
      notSaved: 'Not saved yet',
      savedAt: (t) => 'Saved on this device · ' + t,
      restored: 'Your saved progress has been restored.',
      deleteConfirm: 'Click again to confirm deletion',
      deleted: 'All saved data has been deleted from this device.',
      imported: 'Data imported successfully.',
      importFail: 'The file could not be read. Choose a file exported from this tool.',
      next: 'Next →', finish: 'View report',
      stepOf: (a, b) => 'Step ' + a + ' of ' + b,
      fixErrors: 'Please complete the highlighted fields before continuing.',
      required: 'This field is required.',
      tooShort: (n) => 'Please write at least ' + n + ' words.',
      chooseOne: 'Please choose one of the options.',
      needCompare: 'Enter at least two alternative titles to compare.',
      copied: 'Copied to the clipboard.',
      copyFail: 'Copying failed; select the text and copy it manually.',
      revisionUsed: 'The suggested version was copied into your refined title. Edit it as you wish.',
      titleUsed: 'The title was placed in the Initial title field. Edit it as you wish.',
      altSaved: 'Saved as an alternative title.',
      altExists: 'This title is already saved as an alternative.',
      maxAlts: 'You can save up to four alternative titles.',
      selected: 'Selected as your preferred title. You can still edit it below.',
      scoresApplied: 'Suggested scores applied. Adjust them to reflect your own judgement.',
      notRated: 'Not rated',
      remove: 'Remove',
      regenConfirm: 'Click again to replace your edits',
      regenerated: 'The report was regenerated from your latest answers.',
      loaded: 'Loaded from the Title Builder.',
      nothingToLoad: 'There is no title in the Title Builder yet.',
      empty: 'Not specified yet',
      fileReport: 'research-title-report',
      fileData: 'research-title-data.json',
      detected: 'Detected in your title', notDetected: 'Not detected', manual: 'Check manually',
      status: { ok: 'Good', warn: 'Review', bad: 'Problem', info: 'Note' },
      yes: 'Yes', no: 'No',
      all: 'All',
      outOf5: '/ 5',
      overall: 'Overall mean',
      recommendations: 'Recommendations for improvement',
      noRecs: 'All criteria were rated 4 or 5. Discuss the title with your supervisor to confirm.',
      levels: [
        { min: 4.5, t: 'Strong title', d: 'The title appears clear, focused and aligned. Ask your supervisor for feedback before finalising it.' },
        { min: 3.5, t: 'Good, needs refinement', d: 'The title is workable; address the criteria rated 3 or lower.' },
        { min: 2.5, t: 'Developing', d: 'Return to the refinement step and revise the weaker dimensions.' },
        { min: 0, t: 'Early draft', d: 'Revisit your focus and orientation, then reformulate the title.' }
      ],
      words: (n) => n + (n === 1 ? ' word' : ' words'),
      kwCoverage: (a, b) => a + ' of ' + b + ' selected keywords appear in the title',
      cmp: { none: 'Write both titles to see the comparison.', words: 'Length (words)', added: 'Concepts added', removed: 'Concepts removed', resolved: 'Resolved', introduced: 'New issue', remaining: 'Still present' },
      cmpRows: [
        { id: 'precise', t: 'Precise wording (no vague terms)' },
        { id: 'lean', t: 'No filler or redundant words' },
        { id: 'neutral', t: 'No promotional, evaluative or unsupported causal claims' },
        { id: 'reflects', t: 'Reflects the research focus' },
        { id: 'context', t: 'States the context or material' },
        { id: 'discipline', t: 'Uses Film and Television Studies terminology' },
        { id: 'length', t: 'Within the recommended length' },
        { id: 'method', t: 'Consistent with the proposed approach' }
      ],
      alt: {
        label: (x) => 'Title ' + x, letters: ['A', 'B', 'C'],
        structure: 'Structure', compound: 'Main title + subtitle', single: 'Single phrase', question: 'Question',
        strengths: 'Strengths', weaknesses: 'Points to review', distinct: 'Concepts only in this title', terms: 'Terminology', suggestions: 'Suggestions for refinement',
        methodTerms: 'Method terms: ', theoryTerms: 'Names the theoretical perspective', noTerms: 'No explicit theory or method terms',
        select: 'Select and edit this title', none: '—'
      },
      gen: { use: 'Use as initial title', save: 'Save as alternative', none: 'Complete Steps 1–3 to generate formulations.' },
      matrix: { title: 'Research title', problem: 'Research problem', aim: 'Research aim', questions: 'Research questions', theory: 'Theoretical perspective', method: 'Methodology' },
      links: { titleProblem: 'Title ↔ Research problem', titleAim: 'Title ↔ Research aim', titleQuestions: 'Title ↔ Research questions', titleTheory: 'Title ↔ Theoretical perspective', titleMethod: 'Title ↔ Methodology', problemAim: 'Research problem ↔ Research aim' },
      linkMsg: {
        missing: 'One or both elements have not been specified yet.',
        titleProblem: ['The title shares key concepts with the research problem.', 'The title shares no key concept with the research problem; it may promise a different study.'],
        titleAim: ['The title reflects the central concepts of the aim.', 'The title does not reflect the concepts in the aim; align the focus and wording.'],
        titleQuestions: ['The title covers concepts addressed by the research questions.', 'The research questions use concepts that the title does not signal.'],
        titleTheory: ['The title names the theoretical perspective, as you decided.', 'You decided to name the theory in the title, but it does not appear.', 'You decided not to name the theory in the title; make sure the abstract and keywords carry it.', 'No theoretical perspective specified, or the decision is still open.'],
        titleMethod: ['Method wording in the title is consistent with the proposed approach.', 'Method wording conflicts with the proposed approach, or with your decision about naming the method.'],
        problemAim: ['The aim responds to concepts in the research problem.', 'The aim repeats no key concept from the problem; check that it responds to it directly.']
      },
      refGroups: { attached: '1. Sources in the attached reference file: title-writing tutorials', published: '2. Published film and television studies titles in the attached file', recent: '3. Recent scholarship on research titles (2020–2026)', foundational: '4. Foundational and methodological sources', arabic: '5. Arabic sources' },
      refTypes: { video: 'Video tutorial transcript', published: 'Attached published article', journal: 'Peer-reviewed journal', book: 'Book', guide: 'Style guide', arabic: 'Arabic peer-reviewed journal (ASJP)' },
      pending: 'Details to be completed',
      exTags: { hypothetical: 'Hypothetical teaching example', published: 'Published title (attached file)' },
      exLabels: { weak: 'Weak or overly general title', better: 'Improved academic title', why: 'Why it is better:', terms: 'Appropriate terminology:', method: 'Relevant approach:', structure: 'Structure:', lesson: 'What it shows:', source: 'Source:' },
      report: {
        title: 'Research Title Report',
        generated: (d) => 'Generated on ' + d + ' with the Refining and Formulating Research Titles tool (Dr. Merfat Alardawi). Educational self-assessment; it does not replace academic supervision.',
        topic: '1. Research topic', focus: '2. Research focus', problem: '3. Research problem or aim', method: '4. Proposed methodology', theory: '5. Theoretical perspective',
        initial: '6. Initial working title', alternatives: '7. Alternative title formulations', selected: '8. Selected refined title', evaluation: '9. Evaluation results (self-assessment)', recs: '10. Recommendations for further improvement',
        subfield: 'Subfield', context: 'Context', timeframe: 'Timeframe', material: 'Audiovisual material or population', approach: 'Approach', concepts: 'Key concepts', scope: 'Scope', include: 'Included', exclude: 'Excluded',
        questions: 'Research questions', design: 'Methodological orientation', mention: 'Named in the title', refined: 'Refined title (Step 5)', keywords: 'Keywords',
        noRecs: 'No outstanding recommendations were generated. Review the title with your supervisor.'
      }
    },

    steps: ['Topic', 'Focus', 'Orientation', 'Initial title', 'Refinement', 'Evaluation', 'Compare', 'Final report'],

    subfields: [
      { id: 'film', t: 'Film and Cinema Studies' },
      { id: 'tv', t: 'Television Studies' },
      { id: 'drama', t: 'Drama and Audiovisual Narrative' },
      { id: 'criticism', t: 'Film and Television Criticism' },
      { id: 'audience', t: 'Audience and Reception Studies' },
      { id: 'representation', t: 'Cultural Representation and Identity' },
      { id: 'feminist', t: 'Feminist Film and Television Studies' },
      { id: 'semiotics', t: 'Semiotics and Narrative Analysis' },
      { id: 'streaming', t: 'Streaming Platforms and Digital Media' },
      { id: 'production', t: 'Film and Television Production' },
      { id: 'industries', t: 'Creative and Audiovisual Industries' }
    ],
    approaches: [
      { id: 'qual', t: 'Qualitative' },
      { id: 'mixed', t: 'Mixed methods' },
      { id: 'quant', t: 'Quantitative' }
    ],
    centres: [
      { id: 'representation', t: 'A representation' },
      { id: 'narrative', t: 'Narrative or form' },
      { id: 'audience', t: 'An audience experience' },
      { id: 'practice', t: 'A production or professional practice' },
      { id: 'industry', t: 'An industry, platform or policy' }
    ],
    methods: METHODS,
    decisions: [
      { id: 'yes', t: 'Name it in the title' },
      { id: 'no', t: 'Keep it out of the title' },
      { id: 'unsure', t: 'Not decided yet' }
    ],
    theories: ['Encoding/decoding (Hall)', 'Feminist film theory', 'Cultural proximity', 'Uses and gratifications', 'Cultivation theory', 'Representation (Hall)', 'Narratology', 'Social semiotics'],

    structures: [
      { id: 'descriptive', t: 'Descriptive', d: 'Names the phenomenon, the material and the context plainly.', ex: 'Family Conflict in Saudi Ramadan Dramas (2019–2025)' },
      { id: 'analytical', t: 'Analytical', d: 'Foregrounds the analytical concept or process under study.', ex: 'Negotiating Tradition: Constructing Gender Roles in Saudi Streaming Series' },
      { id: 'comparative', t: 'Comparative', d: 'Signals two or more units being compared.', ex: 'Urban Space in Saudi and Egyptian Television Drama: A Comparative Analysis' },
      { id: 'theory', t: 'Theory-oriented', d: 'Names the theoretical lens when it defines the contribution.', ex: 'Female Spectatorship and Turkish Serials through the Lens of Feminist Film Theory' },
      { id: 'method', t: 'Methodology-oriented', d: 'Names the design when it helps readers judge the study.', ex: 'Heritage in Saudi Historical Drama: A Semiotic Analysis' },
      { id: 'compound', t: 'Main title and subtitle', d: 'A concise main title followed by a colon and an explanatory subtitle.', ex: '“Watching Together, Apart”: Family Viewing of Streaming Series in Jeddah' }
    ],

    rubric: [
      { id: 'clarity', t: 'Clarity and readability', d: 'A reader outside your project understands the title at first reading.' },
      { id: 'focus', t: 'Focus and specificity', d: 'One central phenomenon, with the material or population named precisely.' },
      { id: 'concise', t: 'Conciseness', d: 'Every word carries meaning; no filler, repetition or padding.' },
      { id: 'terminology', t: 'Accuracy of academic terminology', d: 'Discipline terms are used correctly; no hype, evaluative or unexplained terms.' },
      { id: 'alignment', t: 'Alignment with the research problem', d: 'The title promises exactly the study that the problem and aim describe.' },
      { id: 'theory', t: 'Theoretical appropriateness', d: 'Any theory named in the title genuinely frames the study; otherwise it is left out deliberately.' },
      { id: 'method', t: 'Methodological consistency', d: 'Wording matches the design (no causal or measurement claims in a qualitative study).' },
      { id: 'discipline', t: 'Relevance to the discipline', d: 'The title is recognisably a Film and Television Studies title.' },
      { id: 'scope', t: 'Feasibility and appropriate scope', d: 'The boundaries (context, period, corpus) are realistic for the project.' },
      { id: 'significance', t: 'Potential scholarly significance', d: 'The title signals what is distinctive about the study.' }
    ],
    rubricRec: {
      clarity: 'Read the title aloud to someone outside the project; remove anything they stumble over.',
      focus: 'Name one central phenomenon and the exact material or population (which series, which audience, which period).',
      concise: 'Delete filler (“a study of”), repeated words and details that belong in the abstract.',
      terminology: 'Replace hype and value judgements with neutral, discipline-specific terms; spell out uncommon abbreviations.',
      alignment: 'Compare the title with your research problem and aim; use the same key concepts in all three.',
      theory: 'Name a theory only if it defines your contribution; otherwise place it in the abstract and keywords.',
      method: 'Match the wording to the design: interpretive verbs for qualitative studies, measurable variables for quantitative ones.',
      discipline: 'Add the audiovisual object (film, series, platform, audience) or a recognised field concept.',
      scope: 'Narrow the context, period or corpus so that the study is feasible within your timeline.',
      significance: 'Signal the distinctive element: a new corpus, context, audience or theoretical angle.'
    },

    checklist: [
      { id: 'reflects', t: 'Accurately reflects the study', d: 'Names the central phenomenon you actually investigate.', detect: 'notReflect' },
      { id: 'specific', t: 'Names the material or population', d: 'Which films, series, platform or audience?', detect: 'noMaterial' },
      { id: 'context', t: 'Signals the context', d: 'Place, culture, platform or period, where relevant.', detect: 'noContext' },
      { id: 'vague', t: 'Avoids vague terms', d: 'e.g. “media”, “society”, “role”, “issues”, “aspects”.', detect: 'vague' },
      { id: 'filler', t: 'No filler phrases', d: 'e.g. “a study of”, “an investigation into”, “some aspects of”.', detect: 'filler' },
      { id: 'redundant', t: 'No redundant repetition', d: 'The same concept is not repeated.', detect: 'redundant' },
      { id: 'length', t: 'Concise length', d: 'Recommended: about 8–16 words; titles above 20 words become hard to read.', detect: 'tooLong' },
      { id: 'promo', t: 'No promotional words', d: 'e.g. “novel”, “innovative”, “comprehensive”.', detect: 'promo' },
      { id: 'claims', t: 'No unsupported causal or evaluative claims', d: 'e.g. “the impact of”, “negative”, “harmful”, unless the design tests them.', detect: 'causal' },
      { id: 'abbrev', t: 'No unexplained abbreviations', d: 'Only widely recognised acronyms (e.g. TV, AI, UAE).', detect: 'abbrev' },
      { id: 'discipline', t: 'Discipline-specific terminology', d: 'Uses recognised Film and Television Studies concepts.', detect: 'noDiscipline' },
      { id: 'methodTerms', t: 'Method terms only when useful', d: 'No more than one or two method terms, and consistent with the design.', detect: 'methodOverload' },
      { id: 'keywords', t: 'Searchable keywords', d: 'Contains the terms researchers would type into a database.', detect: null },
      { id: 'grammar', t: 'Grammatically complete phrase', d: 'Articles and prepositions are kept; the title reads naturally.', detect: null },
      { id: 'journal', t: 'Follows the target guidelines', d: 'Checked against the university or journal title instructions.', detect: null }
    ],

    examples: [
      { sub: 'representation', area: 'Cultural identity in Saudi television drama',
        weak: 'The Role of Saudi Drama in Society',
        better: 'Negotiating Tradition and Modernity: Cultural Identity in Saudi Television Dramas on Streaming Platforms (2019–2025)',
        why: 'Replaces the vague “role” and “society” with the actual concepts, names the material and platform context, and sets a period.',
        terms: 'cultural identity, negotiation, television drama, streaming platforms', method: 'Qualitative textual analysis of selected series.' },
      { sub: 'audience', area: 'Audience reception of Turkish television series',
        weak: 'The Impact of Turkish Series on Arab Viewers',
        better: 'Watching Turkish Serials in Saudi Arabia: Young Women’s Readings of Romance and Family',
        why: '“Impact” promises a causal effect that interviews cannot test; the revision states what the qualitative study examines (readings) and narrows the audience.',
        terms: 'reception, audience readings, Turkish serials (dizi)', method: 'Semi-structured interviews or focus groups with thematic analysis.' },
      { sub: 'feminist', area: 'Gender representation in cinema',
        weak: 'Women in Films: A Comprehensive New Study',
        better: 'Female Agency in Contemporary Saudi Cinema: A Feminist Reading of Women-Directed Feature Films',
        why: 'Removes the promotional words (“comprehensive”, “new”), names the analytical concept, the corpus and the critical lens.',
        terms: 'female agency, feminist film criticism, women-directed cinema', method: 'Feminist textual analysis of a purposive film sample.' },
      { sub: 'semiotics', area: 'Semiotic analysis of film',
        weak: 'A Study of Signs and Symbols and Meanings in Some Films',
        better: 'Signs of Heritage: A Semiotic Analysis of Costume and Space in Saudi Historical Films',
        why: 'Deletes the filler and the list of near-synonyms, specifies the semiotic resources analysed (costume, space) and the corpus.',
        terms: 'semiotic analysis, signification, costume, mise-en-scène', method: 'Semiotic analysis (e.g. Barthesian or social semiotic).' },
      { sub: 'streaming', area: 'Streaming platforms and audience engagement',
        weak: 'Netflix and People',
        better: 'Binge-Watching and Social Talk: Young Saudi Audiences’ Engagement with Netflix Original Series',
        why: 'The weak title is too short to signal a study; the revision names the practice, the audience and the content type.',
        terms: 'audience engagement, binge-watching, platform originals', method: 'Mixed methods: survey followed by focus groups.' },
      { sub: 'film', area: 'Narrative and visual representation in contemporary cinema',
        weak: 'How Movies Show the City in a Negative Way',
        better: 'Narrating the City: Visual and Narrative Representation of Jeddah in Contemporary Saudi Cinema',
        why: '“Negative” presupposes the finding; the revision uses neutral analytical terms and names the city and corpus.',
        terms: 'narrative representation, visual style, urban space', method: 'Qualitative narrative and visual analysis.' },
      { sub: 'production', area: 'Film and television production',
        weak: 'Problems of Production in the Saudi Film Industry and Its Problems',
        better: 'Independent Film Production in Saudi Arabia: Filmmakers’ Experiences of Festival Funding',
        why: 'Removes the repetition of “problems”, replaces the deficit framing with the practice studied and names the participants.',
        terms: 'independent production, festival funding, production studies', method: 'Qualitative interviews with filmmakers.' },
      { sub: 'tv', area: 'Comparative television studies',
        weak: 'A Comparison Between Saudi and Egyptian Series and Their Differences and Similarities in TV',
        better: 'Family on Screen: Representing Intergenerational Relations in Saudi and Egyptian Ramadan Series',
        why: 'States what is compared (intergenerational relations) instead of announcing “differences and similarities”, and removes redundant words.',
        terms: 'intergenerational relations, Ramadan series, comparative analysis', method: 'Comparative qualitative content analysis.' }
    ],

    published: [
      { sub: 'audience', title: '“Squid Game”: Pleasure and Consumption of Korean Drama by Young Saudi Audiences', ref: 'Alardawi & Brereton (2024), Mediatization Studies.',
        structure: 'Main title + subtitle: the text studied, then the concepts (pleasure, consumption) and the audience.',
        lesson: 'Places the most searchable term (the series title) first and states the audience precisely.' },
      { sub: 'production', title: 'Exploring Challenges and Opportunities for Saudi Podcasters: A Qualitative Study', ref: 'Alardawi (2024), Management & Marketing.',
        structure: 'Gerund-led main title + methodology subtitle.',
        lesson: 'Naming the design in the subtitle tells readers immediately that this is a qualitative study.' },
      { sub: 'audience', title: 'Saudi Viewers Watching Foreign Medical Dramas: A Uses and Gratification Approach', ref: 'Alardawi et al. (2024), Global Journal of Health Science.',
        structure: 'Population + genre in the main title; theoretical approach in the subtitle.',
        lesson: 'A theory-oriented subtitle is appropriate when the theory frames the whole study.' },
      { sub: 'tv', title: 'Arabic Script Television Formats between Adaptation and Cultural Identity: A Case Study of The Killing', ref: 'Alardawi & Brereton (2024), International Journal of Psychological Studies.',
        structure: 'Conceptual tension (“between adaptation and cultural identity”) + case-study subtitle.',
        lesson: 'The subtitle narrows a broad conceptual topic to a single, named case.' },
      { sub: 'feminist', title: 'The Representation of Women in Saudi Film: The Case of Amra and the Second Marriage', ref: 'Alardawi, Saqah, & Zakari (2023), Asian Social Science.',
        structure: 'Representation + national cinema; the case named in the subtitle.',
        lesson: 'A clear representation title that becomes specific through the named film.' },
      { sub: 'streaming', title: 'Cultural Skimming, Authenticity, and Streaming Preferences: Turkish Serials (Dizi) among Young Audiences in Qatar, Saudi Arabia, and the UAE', ref: 'Berg, Alardawi, & Al Obeidli (2025), Critical Studies in Television.',
        structure: 'Concept-led main title + material, audience and three national contexts.',
        lesson: 'Shows how a multi-context study states each context explicitly; the original-language term (dizi) aids discoverability.' },
      { sub: 'film', title: 'Exposure to AI-Themed Films and Perceptions of Artificial Intelligence: A Survey of Saudi Young Adults in Saudi Arabia', ref: 'Alardawi (2026), attached article.',
        structure: 'Two variables in the main title + design and population in the subtitle.',
        lesson: 'Variable-based wording and “survey” signal a quantitative design.' },
      { sub: 'audience', title: 'The Impact of Exposure to the Game of Thrones on Saudi Male Identity', ref: 'Alardawi (2020), Asian Social Science.',
        structure: 'Single phrase with effect-oriented wording.',
        lesson: '“Impact” sets an explanatory expectation; such wording suits designs that examine effects, and the abstract should explain how the effect was studied.' },
      { sub: 'tv', title: 'A Historical Analysis of the Genesis of the Television in Saudi Arabia', ref: 'Alardawi (2025), Asian Social Science.',
        structure: 'Method-led single phrase.',
        lesson: 'Opening with the approach (historical analysis) frames the study type at once.' }
    ],

    msg: {
      dims: {
        clarity: 'Clarity', precision: 'Precision', specificity: 'Specificity', conciseness: 'Conciseness', terminology: 'Academic terminology',
        scope: 'Research scope', theory: 'Theoretical relevance', method: 'Methodological alignment', readability: 'Readability', discipline: 'Relevance to Film and Television Studies'
      },
      ok: {
        clarity: 'The title reads as a clear, complete phrase.',
        precision: 'No vague terms or unexplained abbreviations were detected.',
        specificity: 'The title names your central phenomenon and the material or population.',
        conciseness: 'The length is within the recommended range and no redundancy was detected.',
        terminology: 'No promotional or evaluative wording was detected.',
        scope: 'The title signals the context of the study.',
        theory: 'The theoretical wording matches your decision in Step 3.',
        method: 'The wording is consistent with your proposed approach and your decision about naming the method.',
        readability: 'The title is easy to read in one pass.',
        discipline: 'The title uses recognisable Film and Television Studies vocabulary.'
      },
      issues: {
        empty: { t: 'No title', d: 'Write a title to see the analysis.', r: 'Start from your keywords in Step 4.' },
        tooShort: { t: 'Too short', d: 'Very short titles rarely indicate the scope of a study.', r: 'Add the material, population or context.' },
        long: { t: 'Long title', d: 'The title is longer than about 16 words.', r: 'Check whether every element is essential; move details to the abstract.' },
        tooLong: { t: 'Too long', d: 'Titles above about 20 words are hard to read and to remember.', r: 'Delete secondary details (sample size, every method) and keep the core concepts.' },
        endPeriod: { t: 'Ends with a full stop', d: 'A title is a phrase, not a sentence.', r: 'Remove the final full stop.' },
        question: { t: 'Question title', d: 'Question titles occur more often in the humanities, but they are less common than phrase titles.', r: 'Keep the question form only if it captures the study better than a phrase; check your target guidelines.' },
        vague: { t: 'Vague terms', d: 'Words such as “media”, “society”, “role” or “issues” do not tell the reader what is studied.', r: 'Replace each vague word with the precise concept, text or group.' },
        filler: { t: 'Filler phrases', d: 'Phrases such as “a study of” or “an investigation into” add length without information.', r: 'Delete the filler and start with the key concept.' },
        fillerWords: { t: 'Filler words', d: 'Filler phrases lengthen the title.', r: 'Remove phrases such as “a study of”.' },
        redundant: { t: 'Redundant repetition', d: 'The same concept appears more than once.', r: 'Keep each key concept once.' },
        promo: { t: 'Promotional wording', d: 'Words such as “novel”, “innovative” or “comprehensive” claim value instead of describing the study.', r: 'Describe what you study and let the findings show its value.' },
        evaluative: { t: 'Evaluative wording', d: 'Value judgements (“negative”, “harmful”, “best”) presuppose your findings.', r: 'Use neutral analytical terms (e.g. “representation of” rather than “distortion of”).' },
        causal: { t: 'Causal claim in a qualitative study', d: 'Words such as “impact”, “effect” or “influence” promise a causal test that interpretive designs do not provide.', r: 'Use wording that matches your design: “readings of”, “experiences of”, “representation of”, “negotiation of”.' },
        causalQuant: { t: 'Causal or effect wording', d: 'Effect wording sets an explanatory expectation.', r: 'Make sure the design (e.g. experimental or controlled analysis) supports the claim; otherwise use “relationship” or “association”.' },
        abbrev: { t: 'Unexplained abbreviation', d: 'Abbreviations that are not widely recognised reduce clarity and searchability.', r: 'Spell out the abbreviation (well-known forms such as TV or AI are acceptable).' },
        colonHeavy: { t: 'Several colons', d: 'More than one colon fragments the title.', r: 'Use a single main title and one subtitle.' },
        listy: { t: 'List-like title', d: 'Many “and” links turn the title into a list of topics.', r: 'Group the elements under one central concept.' },
        hardToRead: { t: 'Hard to read', d: 'Long titles must be read twice to be understood.', r: 'Shorten to the essential concepts.' },
        methodOverload: { t: 'Too many method terms', d: 'Several method terms make the title read like a methods section.', r: 'Keep at most one design term, or move methods to the abstract.' },
        methodMissing: { t: 'Method not named', d: 'You decided to name the method in the title, but it does not appear.', r: 'Add a short subtitle such as “: A Semiotic Analysis”, or change your decision.' },
        methodNotWanted: { t: 'Method named against your decision', d: 'You decided to keep the method out of the title, but method terms appear.', r: 'Remove the method terms, or revisit your decision in Step 3.' },
        quantInQual: { t: 'Quantitative wording in a qualitative study', d: 'Terms such as “survey”, “correlation” or “effect” signal a quantitative design.', r: 'Use interpretive wording, or revisit your proposed approach.' },
        quantNeedsMeasure: { t: 'Interpretive wording in a quantitative study', d: 'The title signals an interpretive study but the approach is quantitative.', r: 'Name the variables or patterns measured.' },
        theoryMissing: { t: 'Theory not named', d: 'You decided to name the theoretical perspective, but it does not appear in the title.', r: 'Add the theory briefly (e.g. “through the Lens of …”), or change your decision.' },
        theoryNotWanted: { t: 'Theory named against your decision', d: 'You decided to keep the theory out of the title, but its terms appear.', r: 'Confirm that naming the theory is intended.' },
        noTheory: { t: 'No theoretical perspective specified', d: 'This can be deliberate in inductive qualitative research.', r: 'If a lens frames your analysis, specify it in Step 3 and decide whether the title should name it.' },
        theoryUndecided: { t: 'Decision about the theory is open', d: 'Naming a theory in the title should be a deliberate choice.', r: 'Decide in Step 3 whether the theory defines your contribution.' },
        notReflect: { t: 'Does not reflect the study', d: 'The title shares no key concept with your phenomenon or focus.', r: 'Build the title from the concepts entered in Steps 1 and 2.' },
        noContext: { t: 'Context not signalled', d: 'The context you specified (place, platform, period) is not visible.', r: 'Add the context, e.g. “in Saudi Television” or “on Streaming Platforms”.' },
        noMaterial: { t: 'Material or population not named', d: 'Readers cannot tell which texts or which audience are studied.', r: 'Name the corpus or the participants.' },
        broad: { t: 'Overly broad', d: 'A short title with general words could describe many different studies.', r: 'Narrow by naming who, what, where and when.' },
        noDiscipline: { t: 'Weak discipline signal', d: 'The title does not name an audiovisual object or a Film and Television Studies concept.', r: 'Add the medium (film, series, platform, audience) or a field concept (representation, narrative, reception).' },
        noKeywords: { t: 'Few selected keywords', d: 'Fewer than half of the keywords you selected in Step 4 appear.', r: 'Include the most searchable keywords, ideally near the start and the end of the title.' }
      },
      resolved: {
        vague: 'Vague terms were replaced with precise concepts.',
        filler: 'Filler phrases were removed.',
        redundant: 'Repetition was removed.',
        promo: 'Promotional wording was removed.',
        evaluative: 'Evaluative wording was replaced with neutral terms.',
        causal: 'Unsupported causal wording was removed.',
        abbrev: 'The abbreviation was spelled out or removed.',
        tooLong: 'The title is now within a readable length.',
        long: 'The title is now shorter.',
        tooShort: 'The title now carries enough information.',
        notReflect: 'The title now reflects the central phenomenon.',
        noContext: 'The context is now signalled.',
        noMaterial: 'The material or population is now named.',
        noDiscipline: 'Field-specific terminology was added.',
        methodMismatch: 'The wording now matches the proposed approach.',
        methodOverload: 'Method terms were reduced.',
        colonHeavy: 'The structure was simplified to one main title and subtitle.',
        listy: 'The title is no longer a list of topics.',
        endPeriod: 'The final full stop was removed.'
      }
    },

    lex: {
      minWords: 5, idealMax: 16, maxWords: 20, maxConj: 3,
      normalize: (t) => t.replace(/[’‘`]/g, "'").replace(/[“”]/g, '"'),
      stop: ['the', 'and', 'for', 'from', 'with', 'into', 'onto', 'among', 'between', 'through', 'within', 'their', 'its', 'his', 'her', 'this', 'that', 'these', 'those', 'how', 'what', 'why', 'which', 'who', 'whom', 'are', 'was', 'were', 'has', 'have', 'been', 'being', 'does', 'did', 'case', 'study', 'studi', 'analysis', 'analys', 'approach', 'research', 'toward', 'towards', 'via', 'about', 'over', 'under', 'upon', 'across', 'than', 'then', 'more', 'most', 'some', 'such', 'other'],
      stem: (w) => {
        let x = w.replace(/'s$/, '');
        if (x.length > 5) x = x.replace(/(ations|ation|ings|ing|ities|ity|ness|ments|ment|ers|er|ies|es|s)$/, (m) => (m === 'ies' ? 'y' : ''));
        else if (x.length > 3) x = x.replace(/s$/, '');
        return x;
      },
      allowRepeat: ['film', 'television', 'cinema'],
      knownAcronyms: ['TV', 'AI', 'UAE', 'KSA', 'USA', 'UK', 'EU', 'MBC', 'BBC', 'HBO', 'MENA', 'COVID', 'VR', 'II', 'III', 'IV'],
      conjunction: /(^|\s)and(\s|$)|,/g,
      vague: ['media', 'the media', 'society', 'people', 'the world', 'role', 'the role', 'issues', 'aspects', 'things', 'matters', 'general public', 'in general'],
      filler: ['a study of', 'a study on', 'a study about', 'study of the', 'an investigation of', 'an investigation into', 'investigating the', 'research on', 'a look at', 'some aspects of', 'aspects of', 'towards an understanding of', 'an attempt to', 'an overview of', 'issues of', 'issues related to'],
      promo: ['novel', 'innovative', 'groundbreaking', 'ground-breaking', 'comprehensive', 'unique', 'powerful', 'revolutionary', 'cutting-edge', 'definitive', 'unprecedented', 'first-ever', 'remarkable'],
      evaluative: ['negative', 'positive', 'harmful', 'dangerous', 'best', 'worst', 'better', 'worse', 'distorted', 'distortion', 'corrupt', 'corrupting', 'immoral', 'bad', 'good', 'failure', 'decline'],
      causal: ['impact', 'impacts', 'effect', 'effects', 'influence', 'influences', 'causes', 'cause', 'leads to', 'lead to', 'determines', 'determine', 'proves', 'prove', 'eliminates', 'guarantees', 'shapes', 'consequences'],
      methodTerms: ['analysis', 'study', 'survey', 'interviews', 'interview', 'focus groups', 'focus group', 'ethnography', 'ethnographic', 'case study', 'mixed-methods', 'mixed methods', 'thematic', 'semiotic', 'narrative analysis', 'discourse analysis', 'content analysis', 'experiment', 'experimental', 'correlation', 'correlational', 'regression', 'questionnaire', 'reception study', 'comparative', 'textual analysis', 'quantitative', 'qualitative'],
      quantTerms: ['survey', 'correlation', 'correlational', 'regression', 'predictors', 'predict', 'predicting', 'relationship between', 'questionnaire', 'experiment', 'experimental', 'measuring', 'statistical', 'quantitative', 'frequency'],
      qualTerms: ['thematic', 'ethnography', 'ethnographic', 'interviews', 'focus groups', 'semiotic', 'narrative', 'discourse', 'meanings', 'meaning', 'experiences', 'readings', 'interpretation', 'interpreting', 'reception', 'lived', 'qualitative', 'negotiating', 'negotiation', 'representation', 'constructing'],
      discipline: ['film', 'films', 'filmmaking', 'filmmakers', 'cinema', 'cinematic', 'movie', 'movies', 'screen', 'television', 'tv', 'series', 'serial', 'serials', 'drama', 'dramas', 'soap opera', 'sitcom', 'episode', 'episodes', 'documentary', 'documentaries', 'animation', 'anime', 'streaming', 'netflix', 'shahid', 'platform', 'platforms', 'audience', 'audiences', 'viewers', 'viewing', 'spectators', 'spectatorship', 'fandom', 'fans', 'binge-watching', 'reception', 'representation', 'narrative', 'genre', 'director', 'directors', 'screenplay', 'screenwriting', 'script', 'mise-en-scène', 'mise-en-scene', 'cinematography', 'auteur', 'broadcast', 'broadcasting', 'dizi', 'k-drama', 'telenovela', 'festival', 'production', 'audiovisual', 'visual', 'podcast', 'podcasters']
    },

    tpl: {
      topic: (s1, lab) => {
        const sub = lab.subfield || '[subfield]', appr = lab.approach ? lab.approach.toLowerCase() : '[approach]';
        return 'This study examines ' + v(s1.phenomenon, 'phenomenon') + ' in ' + v(s1.material, 'audiovisual material or population') + ' within ' + v(s1.context, 'context') + (clean(s1.timeframe) ? ' during ' + clean(s1.timeframe) : '') + '. It belongs to ' + sub + ' and follows a ' + appr + ' approach.';
      },
      focus: (s2, lab) => {
        const parts = ['The study focuses on ' + v(s2.focus, 'central focus') + (lab.centre ? ' (' + lab.centre.toLowerCase() + ')' : '') + '.'];
        const c = split(s2.concepts);
        if (c.length) parts.push('Key concepts: ' + c.join(', ') + '.');
        if (clean(s2.scope)) parts.push('Scope: ' + clean(s2.scope) + '.');
        if (clean(s2.include)) parts.push('Included: ' + clean(s2.include) + '.');
        if (clean(s2.exclude)) parts.push('Excluded: ' + clean(s2.exclude) + '.');
        return parts.join(' ');
      },
      orientation: (s3, lab) => {
        const out = [];
        const th = clean(s3.theory);
        if (th && s3.theoryMention === 'yes') out.push('Name the theory: “' + th + '”.');
        else if (th && s3.theoryMention === 'no') out.push('Keep “' + th + '” in the abstract and keywords rather than the title.');
        else if (th) out.push('Decide whether “' + th + '” defines your contribution.');
        else out.push('No theoretical term will appear in the title.');
        if (lab.method && s3.methodMention === 'yes') out.push('Methodological term for a subtitle: “' + lab.methodTitle + '”.');
        else if (lab.method && s3.methodMention === 'no') out.push('The method (' + lab.method.toLowerCase() + ') will be described in the abstract, not the title.');
        else if (lab.method) out.push('Decide whether naming the design (' + lab.method.toLowerCase() + ') helps readers.');
        else out.push('Choose a methodological orientation.');
        return out.join(' ');
      },
      keywords: (st, lab) => {
        const s1 = st.s1, s2 = st.s2, s3 = st.s3;
        const list = [clean(s1.phenomenon), clean(s1.material), clean(s1.context)].concat(split(s2.concepts));
        if (clean(s3.theory) && s3.theoryMention !== 'no') list.push(clean(s3.theory));
        if (lab.methodTitle && s3.methodMention === 'yes') list.push(lab.methodTitle.replace(/^(A|An)\s/, ''));
        return [...new Set(list.filter(Boolean))].slice(0, 12);
      },
      titles: (st, lab) => {
        const s1 = st.s1, s2 = st.s2, s3 = st.s3;
        const P = cap(v(s1.phenomenon, 'Phenomenon')), M = v(s1.material, 'Material'), C = clean(s1.context);
        const inCtx = C && window.RTA.overlap(M, C) === 0 ? (/^(in|on|at|across|among|within|from|via|through)\s/i.test(C) ? ' ' + C : ' in ' + C) : '';
        const T = timeTail(s1.timeframe);
        const K = split(s2.concepts)[0];
        const cmp = clean(s2.compare);
        const TH = clean(s3.theory);
        const MT = lab.methodTitle || '';
        const hook = clean(st.s4.hook);
        const base = P + ' in ' + M + inCtx;
        const out = [
          { id: 'descriptive', text: base + T },
          { id: 'analytical', text: (K ? cap(K) + ' and ' + P : 'Constructing ' + P) + ' in ' + M + inCtx + T },
          { id: 'comparative', text: P + ' in ' + (cmp || M) + (cmp ? '' : inCtx) + ': A Comparative Analysis' },
          { id: 'theory', text: TH ? base + ' through the Lens of ' + TH : base + ': [Theoretical Perspective]' },
          { id: 'method', text: base + T + ': ' + (MT || '[Methodological Orientation]') },
          { id: 'compound', text: (hook ? cap(hook) : (K ? cap(K) : P)) + ': ' + (hook || K ? P + ' in ' + M : M) + inCtx + T }
        ];
        return out.map((o) => ({ id: o.id, text: tc(o.text) }));
      },
      clean: (t) => {
        let x = String(t || '').trim();
        x = x.replace(/^(a|an)\s+(study|investigation|analysis|look)\s+(of|on|into|about|at)\s+(the\s+)?/i, '');
        x = x.replace(/\b(a|an)\s+(study|investigation)\s+(of|on|into|about)\s+/ig, '');
        x = x.replace(/\b(some\s+)?aspects\s+of\s+/ig, '');
        x = x.replace(/\b(novel|innovative|groundbreaking|comprehensive|unique|powerful|revolutionary|cutting-edge|definitive|unprecedented)\s+/ig, '');
        x = x.replace(/[.\s]+$/, '').replace(/\s{2,}/g, ' ').replace(/\s+:/g, ':').trim();
        return cap(x);
      },
      altLetter: (i) => ['A', 'B', 'C'][i] || String(i + 1)
    }
  };
})();
