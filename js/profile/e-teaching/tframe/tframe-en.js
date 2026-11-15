/* =========================================================
   Theoretical Framework Development in Film and Television Studies
   English interface text, guidance, theory profiles, examples and templates.
   tframe-ar.js has exactly the same keys and structure.
   Templates only arrange the researcher's own entries; library summaries are
   inserted only when the researcher asks for them, as an editable starting point.
   Academic tool developed by Dr. Merfat Alardawi
   ========================================================= */
window.RC = (function () {
  'use strict';
  const T = (x) => String(x || '').trim();
  const has = (x) => !!T(x);
  const end = (s) => { s = T(s); if (!s) return ''; s = s.charAt(0).toUpperCase() + s.slice(1); return /[.!?…”")\]]$/.test(s) ? s : s + '.'; };
  const frag = (s) => T(s).replace(/[.;:]+$/, '');
  const cref = (c) => { const r = frag(c.reference || c.source).replace(/^(.+?)\s*\((\d{4}[a-z]?|n\.d\.)\)$/, '$1, $2').replace(/^\(|\)$/g, ''); return r ? ' (' + r + ')' : ''; };
  const lc = (s) => /^[A-Z][a-z]/.test(s) ? s.charAt(0).toLowerCase() + s.slice(1) : s;
  const join = (a) => a.filter(has).join(' ');
  const pick = (list, id) => (list.find((x) => x.id === id) || {});
  const listJoin = (a) => a.length < 2 ? a.join('') : a.length === 2 ? a[0] + ' and ' + a[1] : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1];

  const approaches = [
    { id: 'qual', t: 'Qualitative', d: 'Interviews, focus groups, reception, textual, semiotic, narrative or discourse analysis.' },
    { id: 'quant', t: 'Quantitative', d: 'Surveys, quantitative content analysis or experiments.' },
    { id: 'mixed', t: 'Mixed methods', d: 'Integrated qualitative and quantitative strands.' },
    { id: 'theory', t: 'Theoretical / interpretive', d: 'Critical, conceptual or historical argument.' }
  ];
  const designs = [
    { id: 'interviews', a: 'qual', kind: 'interview', t: 'Semi-structured interviews' },
    { id: 'focus', a: 'qual', kind: 'interview', t: 'Focus groups' },
    { id: 'reception', a: 'qual', kind: 'interview', t: 'Audience reception study' },
    { id: 'textual', a: 'qual', kind: 'textual', t: 'Interpretive film or television textual analysis' },
    { id: 'semiotic', a: 'qual', kind: 'textual', t: 'Semiotic / semiological analysis' },
    { id: 'narrative', a: 'qual', kind: 'textual', t: 'Narrative analysis' },
    { id: 'discourse', a: 'qual', kind: 'textual', t: 'Discourse or critical discourse analysis' },
    { id: 'qca', a: 'qual', kind: 'textual', t: 'Qualitative content analysis' },
    { id: 'survey', a: 'quant', kind: 'survey', t: 'Survey / questionnaire' },
    { id: 'quantca', a: 'quant', kind: 'qcontent', t: 'Quantitative content analysis' },
    { id: 'experiment', a: 'quant', kind: 'survey', t: 'Experiment or quasi-experiment' },
    { id: 'convergent', a: 'mixed', kind: 'mixed', t: 'Convergent mixed-methods design' },
    { id: 'sequential', a: 'mixed', kind: 'mixed', t: 'Sequential mixed-methods design' },
    { id: 'critical', a: 'theory', kind: 'critical', t: 'Critical theoretical analysis' },
    { id: 'historical', a: 'theory', kind: 'critical', t: 'Historical or archival analysis' }
  ];
  const fields = [
    { id: 'film', t: 'Film and cinema studies' }, { id: 'tv', t: 'Television and drama studies' }, { id: 'criticism', t: 'Film and television criticism' },
    { id: 'audience', t: 'Audience and reception studies' }, { id: 'representation', t: 'Cultural representation and identity' }, { id: 'feminist', t: 'Feminist film and television studies' },
    { id: 'semiotic', t: 'Semiotics and semiology' }, { id: 'narrative', t: 'Narrative and discourse analysis' }, { id: 'streaming', t: 'Streaming platforms and digital audiences' },
    { id: 'industries', t: 'Audiovisual production and creative industries' }, { id: 'culture', t: 'Media culture and contemporary screen studies' }
  ];
  const foci = [
    { id: 'representation', t: 'Representation', d: 'How groups, places or ideas are depicted.' },
    { id: 'audience', t: 'Audience interpretation', d: 'How viewers make sense of texts.' },
    { id: 'narrative', t: 'Narrative construction', d: 'How stories are structured and told.' },
    { id: 'aesthetics', t: 'Cinematic aesthetics', d: 'Style, form, image and sound.' },
    { id: 'identity', t: 'Cultural identity', d: 'Belonging, nation, community, hybridity.' },
    { id: 'gender', t: 'Gender', d: 'Gendered roles, looking and subjectivity.' },
    { id: 'ideology', t: 'Ideology', d: 'Power, values and naturalised meanings.' },
    { id: 'meaning', t: 'Meaning-making', d: 'Signs, codes and signification.' },
    { id: 'consumption', t: 'Media consumption', d: 'Viewing practices, motives and effects.' },
    { id: 'industry', t: 'Industrial or institutional structures', d: 'Production, ownership, platforms, policy.' }
  ];
  const roles = [
    { id: 'interpret', t: 'Interpretive lens', d: 'Guides how texts or accounts are read.' },
    { id: 'explain', t: 'Explanatory framework', d: 'Explains why a pattern occurs.' },
    { id: 'critique', t: 'Critical-evaluative perspective', d: 'Questions power, ideology or norms.' },
    { id: 'sensitise', t: 'Sensitising concepts', d: 'Offers concepts that orient an exploratory study.' },
    { id: 'hypothesise', t: 'Hypothesis-generating theory', d: 'Supplies testable expectations.' }
  ];
  const typeNames = { formal: 'Formal theory', tradition: 'Theoretical tradition', critical: 'Critical perspective', model: 'Conceptual model', method: 'Analytical method grounded in theory' };
  const typeDesc = {
    formal: 'A set of related propositions that explains or interprets a phenomenon and can guide specific questions.',
    tradition: 'A body of scholarship sharing assumptions and concepts, containing several theories and debates.',
    critical: 'A political or ethical standpoint that examines power, inequality or ideology.',
    model: 'A schematic account of how elements relate (for example, stages of communication).',
    method: 'A procedure for analysing texts that carries theoretical assumptions about meaning.'
  };
  const kindNames = { textual: 'Textual / semiotic / narrative analysis', interview: 'Interviews, focus groups, reception', survey: 'Surveys and experiments', qcontent: 'Quantitative content analysis', mixed: 'Mixed methods', critical: 'Critical, theoretical or historical analysis' };
  const objNames = { interpret: 'Interpret', explain: 'Explain', critique: 'Critique', sensitise: 'Sensitise', hypothesise: 'Generate hypotheses' };

  /* Theory profiles (summaries for orientation; read the foundational sources before citing). */
  const theoryText = {
    feminist: { name: 'Feminist film theory', theorists: 'Laura Mulvey, Teresa de Lauretis, E. Ann Kaplan, bell hooks', background: 'Developed from the 1970s within film studies and second-wave feminism, combining semiotics, psychoanalysis and later cultural studies.',
      assumptions: ['Cinema is not neutral: its forms and narratives are shaped by gendered power relations.', 'Ways of looking (the camera, characters, spectators) are organised along gendered lines.', 'Representation can reproduce or contest patriarchal norms.'],
      concepts: ['male gaze', 'to-be-looked-at-ness', 'female spectatorship', 'objectification', 'oppositional gaze'],
      questions: 'How do films position women as subjects or objects of looking and narrative?', methods: 'Close textual analysis of shots, framing, narrative closure; can be combined with reception interviews.',
      applications: 'Analysing the gaze, narrative agency and visual objectification; studying women filmmakers and female audiences.', strengths: 'Connects cinematic form to power; strong tradition of close reading.', limits: 'Early psychoanalytic versions assume a single gendered spectator; intersectional critiques broadened the field.',
      example: 'Illustrative: reading how framing and narrative closure treat an independent heroine in a recent Saudi feature film.' },
    auteur: { name: 'Auteur theory', theorists: 'François Truffaut and Cahiers du cinéma critics, Andrew Sarris, Peter Wollen (auteur-structuralism)', background: 'Emerged in 1950s French criticism (“la politique des auteurs”) and was developed in English-language criticism in the 1960s.',
      assumptions: ['A film can express the vision of an individual director.', 'Recurring themes and styles across a body of work reveal authorship.', 'Authorship can be traced even within industrial production.'],
      concepts: ['auteur', 'personal style', 'thematic consistency', 'mise-en-scène', 'oeuvre'],
      questions: 'What recurring themes and stylistic choices characterise a director’s work?', methods: 'Comparative close analysis of several films by one director; production documents and interviews.',
      applications: 'Studies of directors’ bodies of work and of authorship in television (showrunners).', strengths: 'Focuses attention on style and recurring meaning.', limits: 'Can overstate individual control and neglect collaboration, industry and audiences.',
      example: 'Illustrative: tracing recurring motifs of the city across the films of one Saudi director.' },
    genre: { name: 'Genre theory', theorists: 'Rick Altman, Steve Neale, Thomas Schatz', background: 'Developed from structuralist and industrial approaches to popular cinema from the 1970s onwards.',
      assumptions: ['Genres are shared systems of conventions understood by industry, critics and audiences.', 'Genres change historically through repetition and difference.', 'Genre shapes production decisions and viewer expectations.'],
      concepts: ['convention', 'iconography', 'semantic/syntactic approach', 'hybridity', 'genre expectations'],
      questions: 'How do texts use, adapt or hybridise the conventions of a genre?', methods: 'Corpus-based textual analysis; content analysis of conventions; industry and reception material.',
      applications: 'Studying crime, historical drama, horror or comedy series and their regional adaptations.', strengths: 'Links texts, industry and audiences.', limits: 'Genre boundaries are unstable; classification can become an end in itself.',
      example: 'Illustrative: how Gulf crime series combine international serial conventions with local storytelling.' },
    semiology: { name: 'Semiology (Roland Barthes)', theorists: 'Roland Barthes, building on Ferdinand de Saussure', background: 'From structural linguistics; Barthes applied it to images, advertising and popular culture in the 1950s–1960s.',
      assumptions: ['Meaning is produced through signs, not simply found in reality.', 'Signs work on several levels: denotation and connotation.', 'Second-order meanings (myth) can make ideology appear natural.'],
      concepts: ['sign (signifier / signified)', 'denotation', 'connotation', 'myth', 'anchorage'],
      questions: 'What do the signs in a text connote, and which cultural myths do they naturalise?', methods: 'Qualitative close reading of images, costume, colour, objects and settings.',
      applications: 'Analysing posters, title sequences, costume and visual codes in film and television.', strengths: 'Precise vocabulary for layered visual meaning.', limits: 'Readings depend on the analyst; does not show how audiences actually interpret.',
      example: 'Illustrative: reading costume colour as a sign of power in a historical drama.' },
    metz: { name: 'Film semiotics (Christian Metz)', theorists: 'Christian Metz', background: 'A 1960s–1970s attempt to describe cinema as a language-like system, distinct from Barthes’ cultural semiology.',
      assumptions: ['Film signifies through codes specific to cinema and codes shared with other media.', 'Cinema is “a language without a language system”: it has no fixed vocabulary like verbal language.', 'Shot sequences can be classified into syntagmatic types.'],
      concepts: ['cinematic codes', 'grande syntagmatique', 'syntagm', 'paradigm', 'denotation in film'],
      questions: 'How do editing patterns and sequence types organise meaning in a film?', methods: 'Formal segmentation of sequences and analysis of cinematic codes.',
      applications: 'Analysing editing, sequence structure and the specificity of film language.', strengths: 'Systematic attention to film form.', limits: 'Highly formal; later work by Metz turned to psychoanalysis.',
      example: 'Illustrative: classifying the sequence types of an episode to show how time is compressed.' },
    structuralism: { name: 'Structuralism and post-structuralism', theorists: 'Claude Lévi-Strauss, early Roland Barthes, Peter Wollen; post-structuralism: late Barthes, Jacques Derrida, Michel Foucault', background: 'Structuralism sought underlying systems of meaning; post-structuralism questioned fixed structures and stable meanings from the late 1960s.',
      assumptions: ['Structuralism: meaning arises from relations and oppositions within a system.', 'Post-structuralism: meaning is unstable, plural and shaped by discourse and power.', 'The author is not the sole source of meaning.'],
      concepts: ['binary opposition', 'structure', 'discourse', 'intertextuality', 'death of the author'],
      questions: 'Which oppositions organise the text, and how stable are its meanings?', methods: 'Textual and discourse analysis; deconstructive reading.',
      applications: 'Analysing oppositions (tradition/modernity), intertextuality and discourse in screen texts.', strengths: 'Reveals deep patterns and challenges fixed readings.', limits: 'Can be abstract; post-structuralist readings are hard to evaluate empirically.',
      example: 'Illustrative: the opposition between village and city in a television serial.' },
    hall: { name: 'Stuart Hall’s theory of representation', theorists: 'Stuart Hall', background: 'Developed within British cultural studies (1990s), drawing on semiotics and Foucault’s discourse theory.',
      assumptions: ['Meaning is constructed through representation, not reflected from reality (constructionist approach).', 'Representation is connected to power and to the production of “difference”.', 'Stereotypes fix and naturalise difference.'],
      concepts: ['representation', 'constructionist approach', 'discourse', 'stereotyping', 'the Other'],
      questions: 'How are groups or identities represented, and what power relations does this reproduce?', methods: 'Textual and discourse analysis; can be combined with audience research.',
      applications: 'Studies of gender, ethnicity, nation and religion on screen.', strengths: 'Connects signs, discourse and power.', limits: 'Focus on texts; audience readings need complementary approaches.',
      example: 'Illustrative: how Saudi streaming drama represents urban women’s work.' },
    encoding: { name: 'Encoding/decoding model', theorists: 'Stuart Hall; empirical development by David Morley', background: 'Proposed by Hall at the Birmingham Centre for Contemporary Cultural Studies (1973; 1980) against linear transmission models.',
      assumptions: ['Messages are encoded with preferred meanings but are decoded by audiences in social contexts.', 'Encoding and decoding are not necessarily symmetrical.', 'Decodings can be dominant-hegemonic, negotiated or oppositional.'],
      concepts: ['preferred reading', 'dominant-hegemonic position', 'negotiated reading', 'oppositional reading', 'codes'],
      questions: 'How do different audiences decode the preferred meanings of a programme?', methods: 'Focus groups and interviews combined with textual analysis of the programme.',
      applications: 'Audience studies of news, drama and imported series.', strengths: 'Links text and audience; widely used in reception studies.', limits: 'The three positions can be applied too mechanically.',
      example: 'Illustrative: how young viewers negotiate romance narratives in Turkish serials.' },
    reception: { name: 'Reception theory', theorists: 'Hans Robert Jauss, Wolfgang Iser; in film, Janet Staiger', background: 'From literary reception aesthetics (1960s–1970s) and later historical reception studies of film.',
      assumptions: ['Meaning is realised in the act of reception, not fixed in the text.', 'Readers bring a “horizon of expectations” shaped by history and culture.', 'Reception varies across historical and social contexts.'],
      concepts: ['horizon of expectations', 'implied reader', 'interpretive community', 'historical reception', 'context of viewing'],
      questions: 'How have viewers in a given context interpreted and evaluated a film or series?', methods: 'Interviews, focus groups, analysis of reviews, fan discussions and historical documents.',
      applications: 'Studying how audiences or critics received films in specific periods and places.', strengths: 'Centres viewers and context.', limits: 'Generalisation from particular audiences is limited.',
      example: 'Illustrative: how Saudi online reviewers received a Korean series.' },
    uses: { name: 'Uses and gratifications theory', theorists: 'Elihu Katz, Jay G. Blumler, Michael Gurevitch', background: 'Developed in communication research from the 1940s and formalised in the 1970s as a shift from “what media do to people” to “what people do with media”.',
      assumptions: ['Audiences are active and goal-directed in choosing media.', 'Media compete with other sources of need satisfaction.', 'People can report their motives for media use.'],
      concepts: ['needs', 'motives', 'gratifications sought', 'gratifications obtained', 'active audience'],
      questions: 'Why do viewers choose a type of content, and which needs does it satisfy?', methods: 'Surveys with motive scales; interviews; mixed methods.',
      applications: 'Studies of binge-watching, streaming choices and genre preferences.', strengths: 'Clear focus on motives; supports measurement.', limits: 'Relies on self-report; tends to neglect texts and power.',
      example: 'Illustrative: motives of Saudi viewers for watching foreign medical dramas.' },
    cultivation: { name: 'Cultivation theory', theorists: 'George Gerbner, Larry Gross', background: 'Developed from the Cultural Indicators project (1960s–1970s) on long-term exposure to television.',
      assumptions: ['Long-term, heavy exposure to television shapes viewers’ conceptions of social reality.', 'Television presents relatively consistent messages across programmes.', 'Effects are cumulative and small but meaningful.'],
      concepts: ['cultivation', 'heavy vs light viewers', 'mainstreaming', 'resonance', 'message system analysis'],
      questions: 'Is the amount of viewing associated with particular perceptions of reality?', methods: 'Content analysis of message systems plus surveys comparing heavy and light viewers.',
      applications: 'Studies of perceptions of violence, gender roles or other cultures linked to viewing.', strengths: 'Testable propositions; long research tradition.', limits: 'Assumes consistent messages; less suited to fragmented, on-demand viewing; correlation is not causation.',
      example: 'Illustrative: whether frequent viewing of imported drama is associated with perceptions of family roles.' },
    narrative: { name: 'Narrative theory (narratology)', theorists: 'Tzvetan Todorov, Gérard Genette, Seymour Chatman, David Bordwell', background: 'From structuralist narratology and later cognitive approaches to film narration.',
      assumptions: ['Stories can be distinguished from the way they are told (story/discourse; fabula/syuzhet).', 'Narratives are organised by recognisable structures and devices.', 'Viewers actively construct the story from cues.'],
      concepts: ['story and discourse', 'fabula / syuzhet', 'narration', 'point of view', 'equilibrium–disruption'],
      questions: 'How is the story organised and narrated, and with what effects?', methods: 'Segmentation and close narrative analysis; content analysis of narrative features.',
      applications: 'Seriality in television, plot structure, point of view and time.', strengths: 'Precise tools for structure and narration.', limits: 'Formal analysis may neglect context and ideology unless combined with other perspectives.',
      example: 'Illustrative: how season-long arcs and episodic closure combine in a crime series.' },
    psycho: { name: 'Psychoanalytic film theory', theorists: 'Christian Metz, Jean-Louis Baudry, Laura Mulvey', background: 'Developed in the 1970s from Freud and Lacan to explain cinematic spectatorship and desire.',
      assumptions: ['Cinema engages unconscious processes such as desire and identification.', 'The cinematic apparatus positions a spectator.', 'Pleasure in looking is structured by sexual difference (in Mulvey’s version).'],
      concepts: ['identification', 'scopophilia', 'the imaginary signifier', 'suture', 'apparatus'],
      questions: 'How does a film structure desire and identification for its spectator?', methods: 'Theoretical close reading of form and narrative.',
      applications: 'Analyses of spectatorship, desire and gendered looking.', strengths: 'Explains pleasure and identification beyond conscious meaning.', limits: 'Theorises an ideal spectator rather than real audiences; difficult to test.',
      example: 'Illustrative: identification structures in a psychological thriller.' },
    postcolonial: { name: 'Postcolonial theory', theorists: 'Edward Said, Homi K. Bhabha, Gayatri Chakravorty Spivak; in film, Ella Shohat and Robert Stam', background: 'From critiques of colonial discourse from the late 1970s onwards.',
      assumptions: ['Colonial power shaped knowledge and images of “the East” and the “Other”.', 'Representations can reproduce or resist Eurocentric hierarchies.', 'Identities are hybrid and shaped by histories of power.'],
      concepts: ['Orientalism', 'the Other', 'hybridity', 'Eurocentrism', 'subaltern'],
      questions: 'How do films represent Arab or non-Western peoples, and from whose perspective?', methods: 'Textual and discourse analysis; production and reception contexts.',
      applications: 'Studies of Orientalist imagery, transnational cinema and diasporic film.', strengths: 'Exposes power in cross-cultural representation.', limits: 'Risk of reading all texts only as power; needs attention to local agency and industry.',
      example: 'Illustrative: images of the Arabian desert in international productions filmed in Saudi Arabia.' },
    frankfurt: { name: 'Critical theory and the Frankfurt School', theorists: 'Max Horkheimer, Theodor W. Adorno, Walter Benjamin, Herbert Marcuse', background: 'Developed by the Institute for Social Research (1930s–1940s); “the culture industry” appeared in Dialectic of Enlightenment.',
      assumptions: ['Mass culture is industrially produced and standardised.', 'The culture industry promotes conformity and passive consumption.', 'Critique should reveal domination behind apparent entertainment.'],
      concepts: ['culture industry', 'standardisation', 'pseudo-individuality', 'commodification', 'instrumental reason'],
      questions: 'How does the industrial production of entertainment shape content and consumption?', methods: 'Critical analysis of texts, industry practices and discourse.',
      applications: 'Critique of formula production, platform standardisation and commodified culture.', strengths: 'Strong critique of commercial culture.', limits: 'Views audiences as passive; later cultural studies challenged this.',
      example: 'Illustrative: standardisation of formats in platform-commissioned series.' },
    cultstudies: { name: 'Cultural studies', theorists: 'Raymond Williams, Stuart Hall, David Morley, Ien Ang', background: 'Developed at the Birmingham Centre for Contemporary Cultural Studies from the 1960s.',
      assumptions: ['Culture is ordinary and a site of struggle over meaning.', 'Audiences actively use and interpret popular culture.', 'Texts must be understood in social, historical and political contexts.'],
      concepts: ['hegemony', 'identity', 'everyday life', 'popular culture', 'circuit of culture'],
      questions: 'How do people use popular screen culture to negotiate identity and power?', methods: 'Ethnography, interviews, textual analysis; often combined approaches.',
      applications: 'Studies of fandom, identity, youth and transnational television.', strengths: 'Brings together texts, audiences and power.', limits: 'Broad; requires a clearly stated focus and concepts.',
      example: 'Illustrative: how young Gulf audiences negotiate identity through transnational drama.' },
    polecon: { name: 'Political economy of media', theorists: 'Vincent Mosco, Nicholas Garnham, Graham Murdock, Peter Golding', background: 'A critical tradition from the 1970s examining ownership, markets and power in communication.',
      assumptions: ['Economic structures (ownership, finance, markets) shape media production and content.', 'Media are commodities and also institutions with public roles.', 'Power relations in industries should be analysed historically.'],
      concepts: ['commodification', 'concentration of ownership', 'spatialisation', 'structuration', 'public interest'],
      questions: 'How do ownership, funding and platform strategies shape what is produced and seen?', methods: 'Analysis of industry data, policy documents, company strategies; content analysis.',
      applications: 'Studies of streaming platforms, co-productions, film incentives and policy.', strengths: 'Explains structural conditions of production.', limits: 'May underplay texts, creativity and audience meanings.',
      example: 'Illustrative: how platform partnerships shape the supply of Turkish serials to Arab audiences.' },
    proximity: { name: 'Cultural proximity', theorists: 'Joseph D. Straubhaar', background: 'Proposed in the early 1990s in international communication as an alternative to media imperialism arguments.',
      assumptions: ['Audiences tend to prefer content that is culturally close (language, values, humour, religion).', 'Preferences are layered: local, regional and global content coexist.', 'Proximity is shaped by audiences’ social and cultural capital.'],
      concepts: ['cultural proximity', 'cultural-linguistic markets', 'asymmetrical interdependence', 'cultural capital', 'regional flows'],
      questions: 'Why do audiences prefer some imported programmes over others?', methods: 'Audience surveys, interviews and analysis of programme flows.',
      applications: 'Studies of regional and transnational television flows, such as Turkish serials in the Arab world.', strengths: 'Explains regional flows and preferences.', limits: 'Proximity is not fixed; on-demand and algorithmic viewing complicate it.',
      example: 'Illustrative: why Turkish serials appeal to Gulf audiences more than some Western series.' }
  };
  const pairText = {
    activePassive: 'Tension: cultivation assumes cumulative effects on relatively passive viewers, whereas reception-oriented approaches assume active, contextual interpretation.',
    selection: 'Tension: uses and gratifications emphasises active selection, cultivation emphasises non-selective cumulative exposure.',
    author: 'Tension: auteur theory locates meaning in the director; structuralist and post-structuralist approaches decentre the author.',
    agency: 'Tension: individual creative agency versus structural economic constraints; combine only if you explain how they interact.',
    spectator: 'Tension: psychoanalytic theory theorises an ideal spectator, reception studies examine real, situated viewers.',
    massCulture: 'Tension: the Frankfurt School sees passive mass audiences; cultural studies and reception research see active, negotiating audiences.',
    signs: 'Complementary: both analyse signification, Barthes in cultural images, Metz in film-specific codes; keep their purposes distinct.',
    meaning: 'Complementary: Barthes’ semiology offers tools for reading signs; Hall’s representation theory connects them to discourse and power.',
    representationGender: 'Complementary: representation theory and feminist theory together address how gender is constructed on screen.',
    representationPower: 'Complementary: both connect representation to power, Hall through discourse and difference, postcolonial theory through colonial histories.',
    gaze: 'Complementary: Mulvey’s feminist argument draws directly on psychoanalytic concepts of looking and identification.',
    activeAudience: 'Complementary: both treat audiences as active interpreters in social context.',
    choice: 'Complementary: cultural proximity can explain which content satisfies viewers’ motives.',
    form: 'Complementary: genre conventions and narrative structures can be analysed together.',
    industryCritique: 'Complementary: both critique commercial media, one philosophically, one through economic analysis.',
    textIndustry: 'Different levels: one explains texts, the other industrial conditions; state how the levels connect.',
    textAudience: 'Different levels: representation in the text and decoding by audiences; useful together in text-and-audience designs.'
  };
  const sectionNames = { intro: 'Introduction to the perspective', history: 'Historical and intellectual development', assumptions: 'Core assumptions', concepts: 'Principal concepts', applications: 'Relevant scholarly applications', debates: 'Debates and limitations', justification: 'Justification for the selected approach', application: 'Application to the current research', connections: 'Connections with questions and methodology', synthesis: 'Concluding synthesis' };

  return {
    lang: 'en', dir: 'ltr', colon: ': ', sep: ', ',
    numerals: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
    steps: ['Research context', 'Theoretical needs', 'Explore theories', 'Compare', 'Select & justify', 'Concepts', 'Theory & questions', 'Theory & method', 'Framework map', 'Write', 'Evaluate & refine', 'Final report'],
    stepText: [
      { h: 'Step 1 — Define the Research Context', p: 'Record the study for which you need a theoretical framework.',
        whyH: 'Theory serves the study', why: 'A theoretical framework is chosen for a specific problem, set of questions, materials and design. Recording them first prevents choosing a theory because it is fashionable rather than because it fits. The approach and design you choose here shape the compatibility notes in the Theory Explorer.',
        ex: 'Title — Belonging and the family home in Saudi streaming drama · Problem: little is known about how platform originals represent belonging in urban settings · Qualitative textual analysis of two series.',
        out: 'Expected output — a structured research profile for theoretical selection' },
      { h: 'Step 2 — Identify the Theoretical Needs of the Study', p: 'Decide what kind of explanation or interpretation your study requires.',
        whyH: 'Need before name', why: 'Before naming a theory, state what the study needs theory to do: interpret representations, explain viewing patterns, critique ideology, offer sensitising concepts for an exploratory study, or generate hypotheses. The focus you select (representation, gender, audience interpretation…) is used to explain theoretical compatibility in the next step.',
        ex: 'Focus: representation, cultural identity · Role: interpretive lens · Need: the study needs concepts that explain how identity is constructed through signs and narrative rather than reflected.',
        weak: 'I need a theory because the university requires one.',
        better: 'The study needs a perspective that treats identity as constructed through representation, so that the analysis can explain how the series produce belonging rather than describe what they show.',
        out: 'Expected output — a clearly defined theoretical need' },
      { h: 'Step 3 — Explore Relevant Theoretical Perspectives', p: 'Use the Theory Explorer to read profiles and build a shortlist.',
        whyH: 'Compatibility, not automatic recommendation', why: 'Each profile states the kind of perspective (formal theory, tradition, critical perspective, conceptual model or analytical method), its theorists, assumptions, concepts, typical questions, methodological compatibility, strengths and limitations, with foundational references. Badges show how a perspective relates to your focus and design; they explain, they do not choose for you. Shortlist two to four perspectives to compare.',
        ex: 'Shortlist: Stuart Hall’s theory of representation · Semiology (Barthes) · Cultural studies.',
        out: 'Expected output — a shortlist of relevant theoretical perspectives' },
      { h: 'Step 4 — Compare and Evaluate Theories', p: 'Compare the shortlisted perspectives and judge their relevance to your study.',
        whyH: 'Assumptions matter', why: 'Theories differ in what they assume about texts, audiences and power. The matrix places assumptions, focus, concepts, typical questions, methodological implications, strengths and limitations side by side. Relations between perspectives are shown where they are documented: complementary, in tension, or operating at different levels. Write in your own words why each perspective is or is not relevant.',
        ex: 'Hall (representation) and Barthes (semiology) are complementary: Barthes provides tools for reading signs, Hall connects them to discourse and power.',
        out: 'Expected output — an academically justified comparison of relevant theories' },
      { h: 'Step 5 — Select and Justify the Theoretical Approach', p: 'Choose the main perspective, and a second one only if combining them is justified.',
        whyH: 'One coherent approach is often enough', why: 'A justification explains why the theory is relevant, how it addresses the problem, which aspects of the phenomenon it helps interpret, why alternatives are less appropriate or serve other purposes, and how it relates to the methodology. Combining theories needs an intellectual reason; combining perspectives with conflicting assumptions without explanation weakens the framework.',
        ex: 'Hall’s constructionist theory of representation is selected because the problem concerns how belonging is produced through images and narrative; uses and gratifications is less appropriate because the study does not examine viewers’ motives.',
        weak: 'This study uses many theories to understand the topic from all sides.',
        better: 'The study adopts Hall’s theory of representation, supported by Barthes’ concepts of denotation and connotation for the close reading of visual signs; cultivation theory was not adopted because the study does not measure long-term effects.',
        out: 'Expected output — a theoretically informed selection and justification statement' },
      { h: 'Step 6 — Identify and Define Key Theoretical Concepts', p: 'Build the Theoretical Concepts Matrix.',
        whyH: 'Defined, sourced and used', why: 'Every key concept needs a definition from its original theorist or a reliable source, its theoretical context, its relevance to the problem and questions, and the way it will be applied in analysis. In qualitative research, concepts guide interpretation; they are not automatically measurable variables. In quantitative research, add an operational definition (how the concept is measured).',
        ex: 'Connotation — secondary, culturally associated meaning of a sign (Barthes, 1972) · Applied to costume, colour and setting in the selected scenes · Linked to RQ1.',
        out: 'Expected output — a structured matrix of key theoretical concepts' },
      { h: 'Step 7 — Connect Theory to Research Questions', p: 'Map each research question to concepts, analytical focus, evidence and procedure.',
        whyH: 'Theory guides interpretation, not findings', why: 'The Theory–Research Alignment Matrix shows which concepts each question uses, what the analysis will focus on, which evidence it will examine and through which procedure. A theory should guide what you look at and how you interpret it; it should not predetermine what you will find. The checker flags questions without concepts, unused concepts and wording that presupposes results.',
        ex: 'RQ1 How do the series construct belonging through the family home? → representation, connotation · focus: domestic space, framing · evidence: 12 scenes · procedure: semiotic close reading.',
        out: 'Expected output — a coherent alignment between theory, questions and analysis' },
      { h: 'Step 8 — Connect Theory to Methodology', p: 'Explain how the theory informs design, data, selection, categories, interpretation and presentation.',
        whyH: 'A methodological pathway', why: 'A framework is credible when it visibly shapes the method: what is selected (films, scenes, documents or participants), which analytical categories are used, how material is interpreted and how findings are presented. The pathway card adapts to your design and theory, for example semiotic analysis, feminist criticism, reception research, surveys or mixed methods.',
        ex: 'Scenes are selected where domestic space is central; analytical categories are derived from denotation, connotation and stereotyping; findings are presented by theme with annotated frames.',
        out: 'Expected output — a theory–methodology integration statement' },
      { h: 'Step 9 — Construct a Theoretical Framework Map', p: 'Build, edit and arrange a visual map of your framework.',
        whyH: 'Relations, not automatic causality', why: 'The map shows the problem, theory, concepts, questions, analytical dimensions and method. Choose a hierarchical, relational or network layout, drag elements, add or remove them and connect them. Plain lines are the default; arrows and causal links are available but should be used only when the theory and design justify directional or causal claims, which is unusual in interpretive research.',
        ex: '', out: '' },
      { h: 'Step 10 — Write the Theoretical Framework', p: 'Assemble the ten parts of the framework section and edit the full draft.',
        whyH: 'Critical engagement, not description', why: 'Each part is filled from your earlier steps and from three short writing fields (historical development, scholarly applications, debates and limitations). Library summaries can be inserted as a starting point, but you must rewrite them in your own words and cite the sources you have read. Do not invent quotations: any quotation needs an exact source and page number.',
        ex: '', out: '' },
      { h: 'Step 11 — Evaluate and Refine the Framework', p: 'Review rule-based checks, refine the draft and rate it on ten criteria.',
        whyH: 'Educational self-review', why: 'The checks look for missing justification, undefined or unused concepts, unmapped questions, conflicting combinations, causal links in interpretive designs, descriptive rather than critical writing, quotations without page numbers, unsupported claims and wording that presupposes findings. Suggested scores are a starting point; this assessment supports self-review and does not replace supervision or expert evaluation.',
        ex: '', out: '' },
      { h: 'Step 12 — Final Theoretical Framework Report', p: 'Prepare the final framework and a report you can edit, copy, print, save as PDF or export.',
        whyH: 'Researcher-reviewed final text', why: 'The report brings together the research context, selected perspective, comparison, justification, concepts, alignment matrix, methodology integration, the framework map, the complete draft, evaluation results, revision recommendations and references. Verify every citation against the original source before submission.',
        ex: '', out: '' }
    ],

    f: {
      's1.title': { label: 'Research title', hint: 'Working or final title.', ph: 'e.g. Belonging and the family home in Saudi streaming drama' },
      's1.problem': { label: 'Research problem', hint: 'What is not understood, in one or two sentences.', ph: 'e.g. Little is known about how platform originals represent belonging in contemporary urban settings.' },
      's1.questions': { label: 'Research questions', hint: 'One question per line; they are numbered RQ1, RQ2… in later steps.', ph: 'How do the series construct belonging through the family home?\nHow is generational conflict represented?' },
      's1.objectives': { label: 'Research objectives', hint: 'One per line (optional).', ph: '' },
      's1.field': { label: 'Academic specialisation', hint: '' },
      's1.approach': { label: 'Research methodology', hint: '' },
      's1.design': { label: 'Research design', hint: 'The list follows the methodology.' },
      's1.materials': { label: 'Research materials or participants', hint: 'Films, series, scenes, documents or participants.', ph: 'e.g. Two Saudi streaming series (2021–2023), 12 selected scenes' },
      's1.context': { label: 'Cultural and geographical context', hint: '', ph: 'e.g. Saudi Arabia; regional streaming platforms' },
      's1.analytic': { label: 'Proposed analytical approach', hint: 'How you expect to analyse the material.', ph: 'e.g. Semiotic close reading of scenes' },
      's2.primary': { label: 'Main focus', hint: 'The focus that matters most.' },
      's2.why': { label: 'Why does the study need theoretical grounding?', hint: 'What should theory help you explain or interpret?', ph: 'e.g. The study needs concepts that explain how identity is constructed through representation…' },
      's2.role': { label: 'Role of theory in the analysis', hint: '' },
      's3.notes': { label: 'Notes on your shortlist (optional)', hint: 'Why these perspectives are worth comparing.', ph: '' },
      's3.customName': { label: 'Another perspective not in the library (optional)', hint: 'Name it as it appears in the literature; it is added to your shortlist.', ph: 'e.g. Cultural negotiation framework' },
      's3.customDesc': { label: 'Its core assumptions and concepts', hint: 'In your own words, with a source.', ph: '' },
      's5.primary': { label: 'Main theoretical perspective', hint: 'Choose from your shortlist.' },
      's5.relevance': { label: 'Why is the selected theory relevant?', hint: 'One or two sentences.', ph: '' },
      's5.problem': { label: 'How does it address the research problem?', hint: '', ph: '' },
      's5.aspects': { label: 'Which aspects of the phenomenon does it explain or help interpret?', hint: '', ph: '' },
      's5.alternatives': { label: 'Why are alternative approaches less appropriate or serving different purposes?', hint: 'Name at least one alternative.', ph: '' },
      's5.method': { label: 'How does the theory relate to the methodology?', hint: '', ph: '' },
      's5.combine': { label: 'Why is combining theories intellectually justified?', hint: 'Required only if you select a secondary perspective.', ph: '' },
      's8.design': { label: 'Research design', hint: 'How the theory shapes the overall design.', ph: '' },
      's8.collection': { label: 'Data collection', hint: 'What the theory leads you to collect or ask.', ph: '' },
      's8.selection': { label: 'Selection of films, scenes, documents or participants', hint: '', ph: '' },
      's8.categories': { label: 'Analytical categories', hint: 'One per line; usually derived from your concepts.', ph: 'denotation\nconnotation\nstereotyping' },
      's8.interpretation': { label: 'Interpretation of research materials', hint: 'How the theory guides interpretation.', ph: '' },
      's8.presentation': { label: 'Presentation of findings', hint: '', ph: '' },
      's10.history': { label: 'Historical and intellectual development', hint: 'Your own summary with citations.', ph: '' },
      's10.assumptions': { label: 'Core assumptions', hint: 'Your own wording; you may insert the library summary and then rewrite it.', ph: '' },
      's10.applications': { label: 'Relevant scholarly applications', hint: 'Studies in film and television that used the perspective, with citations.', ph: '' },
      's10.debates': { label: 'Theoretical debates and limitations', hint: 'Critiques and limits, with citations.', ph: '' },
      's10.synthesis': { label: 'Concluding synthesis', hint: 'One or two sentences on your theoretical position.', ph: '' },
      's11.self': { label: 'Reflection and revision plan (optional)', hint: '', ph: '' },
      's12.final': { label: 'Final theoretical framework', hint: 'Starts from your Step 10 draft; edit freely.', ph: '' },
      's12.refs': { label: 'References (APA 7)', hint: 'One per line. References from the concepts matrix are added to the report automatically.', ph: '' },
      's12.notes': { label: 'Notes for your supervisor (optional)', hint: '', ph: '' }
    },
    approaches, designs, fields, foci, roles, typeNames, typeDesc, kindNames, objNames, theoryText, pairText, sectionNames,
    pairKind: { tension: 'Tension', complement: 'Complementary', levels: 'Different levels' },
    cmpRows: [{ key: 'type', t: 'Kind of perspective' }, { key: 'assumptions', t: 'Core assumptions' }, { key: 'background', t: 'Explanatory focus and background' }, { key: 'concepts', t: 'Key concepts' }, { key: 'questions', t: 'Research questions addressed' }, { key: 'methods', t: 'Methodological implications' }, { key: 'strengths', t: 'Analytical strengths' }, { key: 'limits', t: 'Limitations' }],
    rateOpts: [{ id: '3', t: 'Highly relevant' }, { id: '2', t: 'Partly relevant' }, { id: '1', t: 'Not relevant' }],
    nodeTypes: { problem: 'Research problem', theory: 'Theoretical perspective', concept: 'Concept', question: 'Research question', dimension: 'Analytical dimension', method: 'Methodology' },
    edgeKinds: [{ id: 'link', t: 'Relation (line)' }, { id: 'direction', t: 'Direction (arrow)' }, { id: 'causal', t: 'Causal claim (bold arrow)' }],
    layouts: [{ id: 'hier', t: 'Hierarchical', d: 'Problem → theory → concepts → questions → dimensions → method.' }, { id: 'radial', t: 'Relational', d: 'The theory at the centre, concepts and questions around it.' }, { id: 'network', t: 'Network', d: 'All elements on a circle; good for many relations.' }],
    edgeLabels: { informs: 'informs', defines: 'defines', guides: 'guides', examines: 'examines', applies: 'applies' },
    sectionHints: {
      intro: 'From Step 5: the selected perspective and why it is relevant.', history: 'Your writing field below (with citations).', assumptions: 'Your writing field below.', concepts: 'From the concepts matrix (Step 6).',
      applications: 'Your writing field below (with citations).', debates: 'Your writing field below (with citations).', justification: 'From Step 5: problem, aspects, alternatives and combination.',
      application: 'From Steps 5 and 8: methodology and interpretation.', connections: 'From the alignment matrix (Step 7).', synthesis: 'Your writing field below.'
    },
    tpl: {
      profile: (st) => {
        const s = st.s1, L = []; const add = (k, v) => { if (has(v)) L.push(k + ': ' + T(v)); };
        add('Title', s.title); add('Problem', s.problem); add('Questions', s.questions.split(/\n+/).filter(has).map((q, i) => 'RQ' + (i + 1) + ' ' + T(q)).join(' · '));
        add('Specialisation', pick(fields, s.field).t); add('Methodology and design', [pick(approaches, s.approach).t, pick(designs, s.design).t].filter(has).join(' — '));
        add('Materials or participants', s.materials); add('Context', s.context); add('Analytical approach', s.analytic);
        return L.join('\n');
      },
      need: (st) => join([st.s2.focus.length ? 'The study concerns ' + listJoin(foci.filter((f) => st.s2.focus.indexOf(f.id) !== -1).map((f) => f.t.toLowerCase())) + '.' : '', end(st.s2.why), st.s2.role ? 'Theory will act as ' + (({ interpret: 'an interpretive lens', explain: 'an explanatory framework', critique: 'a critical-evaluative perspective', sensitise: 'a source of sensitising concepts', hypothesise: 'a source of testable hypotheses' })[st.s2.role]) + '.' : '']),
      intro: (st, x) => { const p = x.name(st.s5.primary), sec = st.s5.secondary.map(x.name).filter(has); return join([has(p) ? 'This study is grounded in ' + p + (sec.length ? ', complemented by ' + listJoin(sec) : '') + '.' : '', end(st.s5.relevance)]); },
      history: (st) => end(st.s10.history),
      assumptions: (st) => end(st.s10.assumptions),
      concepts: (st) => join(st.concepts.filter((c) => has(c.concept)).map((c) => has(c.definition) ? (T(c.concept).charAt(0).toUpperCase() + T(c.concept).slice(1) + ' refers to ' + lc(frag(c.definition)) + cref(c) + '.') : '')),
      applications: (st) => end(st.s10.applications),
      debates: (st) => end(st.s10.debates),
      justification: (st) => join([end(st.s5.problem), end(st.s5.aspects), end(st.s5.alternatives), st.s5.secondary.length ? end(st.s5.combine) : '']),
      application: (st) => join([end(st.s5.method), end(st.s8.interpretation)]),
      connections: (st, x) => join(x.questions.map((q, i) => { const r = st.s7[i] || {}; const cs = (r.concepts || []).map(x.concept).filter(has); return cs.length ? 'RQ' + (i + 1) + ' (' + frag(q).replace(/\?$/, '') + '?) is examined through ' + listJoin(cs) + (has(r.focus) ? ', focusing on ' + frag(r.focus) : '') + '.' : ''; })),
      synthesis: (st) => end(st.s10.synthesis),
      methodStmt: (st) => join([end(st.s8.design), end(st.s8.collection), end(st.s8.selection), x0(st.s8.categories), end(st.s8.interpretation), end(st.s8.presentation)])
    },
    lex: {
      longLimit: 40, paraMax: 230,
      stop: ['about', 'which', 'their', 'there', 'these', 'those', 'where', 'while', 'would', 'could', 'should', 'theory', 'theori', 'study', 'studie', 'studi', 'research', 'film', 'television', 'with', 'from', 'that', 'this', 'have', 'been', 'into', 'than', 'they', 'also', 'such', 'other', 'between', 'through', 'within', 'concept'],
      stopOverlap: ['this', 'that', 'these', 'with', 'from', 'into', 'study', 'studies', 'research', 'theory', 'theories', 'theoretical', 'question', 'questions', 'what', 'which', 'when', 'where', 'there', 'their', 'have', 'been', 'does', 'more', 'most', 'about', 'through', 'within', 'between', 'among', 'other', 'such', 'also', 'how', 'why', 'aims', 'examine', 'examines', 'explore', 'explores', 'analyse', 'analysis'],
      critical: ['however', 'critics', 'critique', 'criticised', 'criticized', 'limitation', 'limitations', 'limited', 'debate', 'debated', 'contested', 'challenge', 'challenged', 'argue', 'argued', 'whereas', 'in contrast', 'tension', 'problematic', 'neglects', 'overlooks', 'questioned'],
      predetermine: ['will prove', 'will confirm', 'to prove that', 'to confirm that', 'will show that', 'will demonstrate that', 'in order to prove', 'expected to confirm the theory'],
      causal: ['causes', 'caused by', 'leads to', 'lead to', 'results in', 'effect of', 'effects of', 'impact of', 'determines'],
      claimCues: ['studies show', 'studies have shown', 'research shows', 'research has shown', 'scholars argue', 'it has been found', 'previous studies', 'the literature', 'many studies', 'critics have'],
      overclaim: ['the best theory', 'the only theory', 'perfectly explains', 'fully explains', 'proves', 'definitive', 'universal'],
      vague: ['various', 'many things', 'some aspects', 'interesting', 'etc'],
      cliche: ['since the beginning', 'since the dawn', 'throughout history', 'nowadays', 'in today’s world', "in today's world"],
      transitions: ['however', 'moreover', 'furthermore', 'in addition', 'similarly', 'in contrast', 'therefore', 'thus', 'consequently', 'accordingly', 'although', 'while', 'building on', 'drawing on', 'in this study', 'for this reason', 'in this context', 'this study', 'the study', 'specifically', 'finally', 'taken together', 'rq']
    },
    statusLabel: { ok: 'Good', warn: 'Revise', bad: 'Missing', info: 'Note' },
    needMsg: {
      ok: { t: 'Theoretical need', ok: () => 'The focus, need and role of theory are stated.' },
      noFocus: { t: 'Focus', bad: () => 'Choose at least one focus of the study.' },
      many: { t: 'Focus', warn: () => 'More than four foci are selected. A framework works best when the main focus is clear.' },
      noNeed: { t: 'Need', warn: () => 'Explain what theory should help you explain or interpret, not only that a theory is required.' }
    },
    selectMsg: {
      ok: { t: 'Selection', ok: () => 'The selection is justified and coherent.' },
      noPrimary: { t: 'Main perspective', bad: () => 'Choose the main perspective from your shortlist.' },
      many: { t: 'Number of perspectives', warn: () => 'Three or more perspectives are combined. One coherent approach, with at most one complementary perspective, is usually clearer.' },
      tension: { t: 'Assumptions in tension', warn: (x) => x.list.join(' ') + ' Explain how you reconcile them, or choose one.' },
      noCombine: { t: 'Combination', warn: () => 'You selected a secondary perspective: explain why combining them is intellectually justified.' },
      noAlt: { t: 'Alternatives', warn: () => 'Name at least one alternative and say why it is less appropriate or serves a different purpose.' },
      methodFit: { t: 'Methodological fit', info: (x) => 'This perspective is not usually used with ' + x.kind + '. Explain in “relation to methodology” how you will apply it.' },
      notShort: { t: 'Shortlist', info: () => 'Compare at least two perspectives before choosing, so that the choice is reasoned.' }
    },
    conceptMsg: {
      ok: { t: 'Concepts', ok: (x) => x.n + ' concepts, defined and sourced.' },
      few: { t: 'Number of concepts', bad: () => 'Add at least two key concepts with definitions.' },
      noDef: { t: 'Definitions', warn: (x) => 'Concepts without a definition: ' + x.list.join(', ') + '.' },
      noRef: { t: 'Sources', warn: (x) => 'Concepts without an original theorist or reference: ' + x.list.join(', ') + '.' },
      noApp: { t: 'Analytical application', info: (x) => 'Explain how these concepts will be applied: ' + x.list.join(', ') + '.' },
      noOp: { t: 'Operational definitions', info: (x) => 'Your design is quantitative: add how these concepts are measured: ' + x.list.join(', ') + '.' },
      variable: { t: 'Concepts as variables', info: () => 'In qualitative research, concepts guide interpretation; avoid describing them as variables to be measured.' },
      many: { t: 'Number of concepts', info: () => 'More than eight concepts may be hard to apply consistently; keep those you will actually use.' }
    },
    alignMsg: {
      noQ: { t: 'Research questions', bad: () => 'Enter your research questions in Step 1.' },
      unmapped: { t: 'Questions without concepts', warn: (x) => 'Link concepts to: ' + x.list.join(', ') + '.' },
      unused: { t: 'Unused concepts', info: (x) => 'These concepts are not linked to any question: ' + x.list.join(', ') + '.' },
      noEvidence: { t: 'Evidence and procedure', info: (x) => 'Add the evidence and procedure for: ' + x.list.join(', ') + '.' },
      predetermine: { t: 'Predetermined findings', warn: (x) => 'Wording such as “' + x.list.join('”, “') + '” presupposes results. Theory should guide interpretation, not decide findings.' },
      probTheory: { t: 'Problem → theory', ok: (x) => 'The problem and the theory’s concepts share terms: ' + x.list.join(', ') + '.', info: () => 'The problem shares no terms with your concepts. Check that the theory addresses the problem.' },
      ok: { t: 'Alignment', ok: () => 'Every question is linked to concepts, evidence and procedure.' }
    },
    mapMsg: {
      ok: { t: 'Map', ok: (x) => x.n + ' elements and ' + x.m + ' connections.' },
      empty: { t: 'Map', bad: () => 'The map is empty. Use “Build from my entries”.' },
      isolated: { t: 'Unconnected elements', info: (x) => 'Not connected: ' + x.list.join(', ') + '.' },
      causal: { t: 'Causal links', warn: () => 'Your design is interpretive, but the map contains causal links. Use plain relations unless the theory justifies causal claims.' },
      noTheory: { t: 'Theory in the map', warn: () => 'The map has no theoretical perspective element.' }
    },
    langMsg: {
      long: { t: 'Sentence length', ok: () => 'No very long sentences.', warn: (x) => x.n + ' sentence(s) over 40 words: ' + x.list.join(' | ') },
      critical: { t: 'Critical engagement', ok: (x) => x.n + ' signs of critical engagement (debate, limitation, contrast).', warn: () => 'The draft mainly describes theory. Add debates, critiques, limitations and why they matter for your study.' },
      quotes: { t: 'Quotations', warn: (x) => 'Quotations without a page number: ' + x.list.join(' | ') + '. Give the exact source and page, or paraphrase.' },
      unsupported: { t: 'Claims and references', warn: (x) => 'Claims about scholarship without a citation: ' + x.list.join(' | ') },
      cites: { t: 'Citations', ok: (x) => x.n + ' cited works.', warn: (x) => (x.n ? 'Only ' + x.n + ' cited work(s).' : 'No citations.') + ' A framework section normally cites the original theorists and recent applications.' },
      predetermine: { t: 'Predetermined findings', warn: (x) => 'Presupposes results: ' + x.list.join(', ') + '.' },
      causal: { t: 'Causal language', info: (x) => 'Causal wording in an interpretive design: ' + x.list.join(', ') + '. Is it intended?' },
      overclaim: { t: 'Overclaiming', warn: (x) => 'Exaggerated wording: ' + x.list.join(', ') + '.' },
      namedrop: { t: 'Theories named but not selected', info: (x) => 'Theories mentioned that are not part of your framework: ' + x.list.join(', ') + '. Explain their role (for example, as alternatives) or remove them.' },
      cliche: { t: 'Opening', warn: (x) => 'Clichéd opening: ' + x.list.join(', ') + '.' },
      paraLong: { t: 'Paragraph length', warn: (x) => x.n + ' paragraph(s) over 230 words.' },
      placeholder: { t: 'Placeholders', bad: (x) => 'Unfinished placeholders: ' + x.list.join(', ') + '.' },
      vague: { t: 'Vague wording', info: (x) => 'Vague words: ' + x.list.join(', ') + '.' }
    },
    checkText: {
      draft: { t: 'Framework draft', bad: 'No draft yet. Build it in Step 10.' },
      need: { t: 'Theoretical need', ok: 'The need for theory is stated.', warn: 'State what theory should do for the study (Step 2).' },
      selection: { t: 'Selected perspective', ok: 'A main perspective is selected.', bad: 'No main perspective (Step 5).' },
      justification: { t: 'Justification', ok: 'Relevance, problem, alternatives and methodology are explained.', warn: (m) => 'Incomplete justification: ' + m + '.' },
      combination: { t: 'Coherence of assumptions', ok: 'No unexplained conflict between perspectives.', warn: 'Perspectives with conflicting assumptions are combined without explanation.' },
      concepts: { t: 'Concepts', ok: (n) => n + ' concepts defined and sourced.', warn: (n) => 'Some of the ' + n + ' concepts lack a definition or source.', bad: 'Fewer than two key concepts.' },
      alignment: { t: 'Theory–question alignment', ok: 'All questions are linked to concepts.', warn: (m) => 'Not linked: ' + m + '.', bad: 'No research questions.' },
      method: { t: 'Theory–methodology integration', ok: 'The theory’s role in the method is explained.', warn: 'Explain how the theory shapes selection, categories and interpretation (Step 8).' },
      map: { t: 'Framework map', ok: 'The map shows the framework.', warn: (m) => m, bad: 'No map yet (Step 9).' },
      critical: { t: 'Critical engagement', ok: 'Debates and limitations are discussed.', warn: 'The draft is mainly descriptive.' },
      citations: { t: 'Citations', ok: (n) => n + ' cited works.', warn: (n) => 'Only ' + n + ' cited work(s).', bad: 'No citations in the draft.' },
      quotes: { t: 'Quotations', ok: 'No unsourced quotations.', warn: 'Quotations without page numbers.' },
      predetermine: { t: 'Open interpretation', ok: 'Theory guides interpretation without presupposing findings.', warn: 'Wording presupposes findings.' },
      placeholder: { t: 'Placeholders', bad: (m) => 'Replace: ' + m + '.' },
      language: { t: 'Language', warn: (l) => l === 'ar' ? 'The draft is not mainly in Arabic.' : 'The draft is not mainly in English.' }
    },
    rubric: [
      { id: 'relevance', t: 'Relevance of theory', d: 'The perspective fits the problem, focus and materials.' },
      { id: 'concepts', t: 'Accuracy of theoretical concepts', d: 'Concepts are defined accurately and sourced to their theorists.' },
      { id: 'justification', t: 'Strength of theoretical justification', d: 'Choice explained, including alternatives.' },
      { id: 'coherence', t: 'Coherence of theoretical assumptions', d: 'Combined perspectives share compatible assumptions or the tension is explained.' },
      { id: 'problem', t: 'Alignment with the research problem', d: 'The theory addresses the problem directly.' },
      { id: 'questions', t: 'Alignment with research questions', d: 'Each question is linked to concepts and analysis.' },
      { id: 'method', t: 'Methodological compatibility', d: 'The theory visibly shapes selection, categories and interpretation.' },
      { id: 'critical', t: 'Critical engagement with scholarship', d: 'Debates, critiques and limitations are discussed.' },
      { id: 'applicability', t: 'Analytical applicability', d: 'Concepts can actually be applied to the material.' },
      { id: 'writing', t: 'Academic writing and referencing', d: 'Clear, precise and accurately referenced.' }
    ],
    rubricDesc: {
      relevance: ['Chosen by name or fashion; weak fit.', 'Relevant, but the fit is not explained.', 'Clearly suited to the problem, focus and materials.'],
      concepts: ['Concepts undefined or inaccurate.', 'Defined, but some sources or contexts missing.', 'Accurate, sourced definitions in their theoretical context.'],
      justification: ['No justification.', 'Relevance stated; alternatives not considered.', 'Relevance, problem, alternatives and methodology explained.'],
      coherence: ['Conflicting assumptions combined.', 'Mostly coherent; tensions not discussed.', 'Coherent, or tensions explicitly reconciled.'],
      problem: ['Theory unrelated to the problem.', 'Partly related.', 'Directly addresses the problem.'],
      questions: ['Questions not linked to theory.', 'Some questions linked.', 'Every question linked to concepts and analysis.'],
      method: ['Theory absent from the method.', 'Mentioned in the method.', 'Shapes selection, categories, interpretation and presentation.'],
      critical: ['Purely descriptive.', 'Some critique or limitations.', 'Engages debates and explains their consequences.'],
      applicability: ['Concepts too abstract to apply.', 'Applicable with clarification.', 'Clear analytical use of each concept.'],
      writing: ['Unclear; citations missing.', 'Generally clear; some referencing problems.', 'Precise, coherent and accurately referenced.']
    },
    rubricRec: {
      relevance: 'Return to Step 2: state the focus and what theory must do, then check the fit of each shortlisted perspective.',
      concepts: 'Define each concept from its original source and state its theoretical context and application.',
      justification: 'Explain relevance, how the theory addresses the problem, why alternatives are less appropriate and how it relates to the method.',
      coherence: 'Check the comparison for tensions; reconcile them explicitly or keep one perspective.',
      problem: 'Use the problem’s key terms when explaining the theory’s relevance.',
      questions: 'Link each research question to concepts, evidence and procedure in Step 7.',
      method: 'Show how the theory determines selection, categories, interpretation and presentation in Step 8.',
      critical: 'Add debates, critiques and limitations with citations, and explain their implications for your study.',
      applicability: 'Show, for each concept, what you will look for in the material.',
      writing: 'Cite original theorists and recent applications, remove unsourced quotations and long sentences.'
    },
    levels: [
      { min: 4.5, t: 'Ready for supervisor review', d: 'The framework is coherent and well grounded.' },
      { min: 3.5, t: 'Solid framework — targeted revision', d: 'Revise the criteria rated 3 or below.' },
      { min: 2.5, t: 'Developing — strengthen key links', d: 'Work on justification, concepts and alignment.' },
      { min: 0, t: 'Early draft — rebuild the reasoning', d: 'Return to Steps 2–7 before rewriting.' }
    ],
    checklist: [
      { id: 'need', t: 'Need stated', d: 'The framework section explains why theory is needed.' },
      { id: 'type', t: 'Kind of perspective', d: 'Theory, tradition, critical perspective, model or method is named correctly.' },
      { id: 'orig', t: 'Original sources', d: 'Key ideas are attributed to the original theorists.' },
      { id: 'assume', t: 'Assumptions explained', d: 'Core assumptions are stated, not only concepts.' },
      { id: 'defs', t: 'Concepts defined', d: 'Each concept is defined and applied.' },
      { id: 'apps', t: 'Applications', d: 'Relevant film and television applications are discussed.' },
      { id: 'crit', t: 'Critique', d: 'Debates and limitations are discussed.' },
      { id: 'just', t: 'Justification', d: 'Alternatives are considered.' },
      { id: 'combo', t: 'Combination justified', d: 'Any combination of theories is explained.' },
      { id: 'rq', t: 'Linked to questions', d: 'Each question is connected to theory.' },
      { id: 'meth', t: 'Linked to method', d: 'The theory shapes the method.' },
      { id: 'open', t: 'Open interpretation', d: 'The theory does not decide the findings in advance.' }
    ],
    selector: { why: {} },
    distinctions: [
      ['Theory', 'A set of related propositions that explains or interprets a phenomenon.', 'Hall’s constructionist theory of representation.'],
      ['Theoretical framework', 'The selected theory (or theories) applied to a specific study: assumptions, concepts and their relation to the questions and method.', 'Representation theory with denotation/connotation, applied to two Saudi series.'],
      ['Conceptual framework', 'The researcher’s own map of concepts and relations, which may draw on several sources, not only one theory.', 'A map linking belonging, domestic space, generation and the city.'],
      ['Literature review', 'A critical synthesis of previous studies that establishes what is known and the gap.', 'Studies of identity in Gulf television drama.'],
      ['Analytical method', 'The procedure used to analyse material, which may carry theoretical assumptions.', 'Semiotic close reading of scenes.']
    ],
    pathways: {
      semiotic: { t: 'Semiotic analysis', items: ['Select scenes or images where the signs relevant to your question are dense.', 'Describe denotation first, then connotations and the cultural codes that support them.', 'Use concepts (sign, connotation, myth) as analytical categories.', 'Present findings with annotated frames and explain the myths or ideologies naturalised.'] },
      feminist: { t: 'Feminist film criticism', items: ['Select films or scenes that foreground gender, looking or narrative agency.', 'Analyse framing, point of view, narrative closure and who controls the look.', 'Use concepts such as gaze, objectification or agency as categories; consider intersectionality.', 'Present readings that connect form to gendered power, noting counter-readings.'] },
      reception: { t: 'Audience reception research', items: ['Select participants whose social positions matter for decoding.', 'Design interview or focus-group questions around the text’s preferred meanings and viewers’ contexts.', 'Code accounts for dominant, negotiated and oppositional readings without forcing them.', 'Present findings with participants’ words and the contexts that explain their readings.'] },
      narrative: { t: 'Narrative analysis', items: ['Segment episodes or films into sequences.', 'Analyse story/discourse, time, point of view and closure.', 'Use narrative concepts as categories across the corpus.', 'Present patterns with examples and their effects on meaning.'] },
      survey: { t: 'Survey or experiment', items: ['Derive hypotheses or expectations from the theory.', 'Operationalise each concept with measurable items or scales.', 'Sample the population the theory speaks about.', 'Interpret results in relation to the theory, without claiming causality from correlation.'] },
      mixed: { t: 'Mixed methods', items: ['State which strand each theoretical concept informs.', 'Use quantitative measures for patterns and qualitative data for meanings.', 'Plan how results will be integrated through the theory.', 'Explain divergence between strands theoretically.'] },
      critical: { t: 'Critical or theoretical analysis', items: ['Define the theoretical argument and the texts or documents it examines.', 'Use the perspective’s concepts to structure the argument.', 'Engage counter-arguments and limitations.', 'Make the contribution to theory explicit.'] }
    },
    descVsCrit: { weak: 'Representation theory was developed by Stuart Hall. It says that meaning is constructed. It has many concepts such as stereotyping and discourse.', better: 'Hall’s (1997) constructionist view of representation is useful here because it treats belonging as produced through images rather than reflected; however, its focus on texts means that viewers’ readings cannot be inferred, a limitation this study acknowledges by not making claims about audiences.' },
    rewrite: [
      { t: 'Introducing the perspective', tpl: ['This study is grounded in [theory] ([theorist], [year]), which [core claim].', 'The framework draws on [tradition], particularly [theorist]’s concept of [concept].'], tip: 'Name the kind of perspective and the original source.' },
      { t: 'Assumptions', tpl: ['[Theory] assumes that [assumption] ([source]).', 'A central premise of this perspective is that [premise].'], tip: 'Assumptions explain why the concepts matter.' },
      { t: 'Concepts', tpl: ['[Concept] refers to [definition] ([source]); in this study it guides the analysis of [material].'], tip: 'Define, source and apply.' },
      { t: 'Applications', tpl: ['[Author] ([year]) applied [theory] to [film/TV material] and showed that [finding].', 'In Arab television studies, [theory] has been used to [purpose] ([sources]).'], tip: 'Prefer recent film and television applications.' },
      { t: 'Debates and limitations', tpl: ['Critics have argued that [theory] [limitation] ([source]).', 'This limitation matters for the present study because [reason]; it is addressed by [strategy].'], tip: 'Explain the consequence for your study.' },
      { t: 'Justification', tpl: ['[Theory] is preferred to [alternative] because [reason related to the problem].', 'Combining [A] and [B] is justified because [shared assumption / different levels].'], tip: 'Alternatives make the choice credible.' },
      { t: 'Application and connections', tpl: ['In this study, [concept] guides the analysis of [RQ1] by focusing on [dimension].', 'The analytical categories [list] are derived from [theory].'], tip: 'Show the theory at work in the method.' },
      { t: 'Synthesis', tpl: ['Taken together, the framework positions the study as [theoretical position], allowing it to [contribution].'], tip: 'End with your own position.' }
    ],
    mistakes: [
      { t: 'Theory as a label', d: 'Naming a theory without using its concepts.', fix: 'Show where each concept appears in the analysis.' },
      { t: 'A list of theories', d: 'Summarising several theories one after another.', fix: 'Select one perspective and justify any addition.' },
      { t: 'Confusing framework and literature review', d: 'Reviewing studies instead of explaining theory.', fix: 'Discuss assumptions, concepts and their application.' },
      { t: 'Conflicting assumptions', d: 'Combining effects theories and active-audience theories without comment.', fix: 'Reconcile or choose.' },
      { t: 'Concepts as variables in qualitative work', d: 'Treating interpretive concepts as measurable variables.', fix: 'Use them as sensitising or analytical categories.' },
      { t: 'Theory deciding the findings', d: 'Questions written to confirm the theory.', fix: 'Use open questions and report surprises.' },
      { t: 'Second-hand definitions', d: 'Defining concepts from textbooks or websites only.', fix: 'Cite original theorists and recent applications.' },
      { t: 'Invented quotations', d: 'Quotations without page numbers or from memory.', fix: 'Quote only from sources you hold, with page numbers.' }
    ],
    guideTopics: ['Overview of the tool', 'Academic purpose', 'Intended users', 'The complete workflow', 'Instructions for all 12 steps', 'Field definitions', 'Examples of entries', 'Common mistakes', 'Theory Explorer', 'Comparison Matrix', 'Framework Visualizer', 'Writing and refining', 'Evaluation results', 'Saving and exporting', 'Troubleshooting and FAQ', 'Academic integrity'],
    examples: [
      { area: 'Feminist interpretations of Saudi cinema', approach: 'Feminist critical analysis', title: 'Narrative closure and female agency in a Saudi feature film', theory: 'Feminist film theory (Mulvey; de Lauretis)', concepts: 'male gaze · narrative agency · closure', rq: 'How does the ending reframe the heroine’s independence?', method: 'Close reading of framing, point of view and closure in key scenes.', why: 'The theory determines what is analysed (looking, agency, closure) without deciding the reading in advance.' },
      { area: 'Cultural representation in Saudi streaming drama', approach: 'Qualitative textual analysis', title: 'Belonging and the family home', theory: 'Hall’s theory of representation, with Barthes’ semiology for sign analysis', concepts: 'representation · connotation · stereotyping', rq: 'How is belonging constructed through domestic space?', method: 'Semiotic reading of 12 scenes; categories from denotation and connotation.', why: 'Two complementary perspectives: one explains meaning and power, the other gives tools for reading signs.' },
      { area: 'Audience reception of Turkish series', approach: 'Focus groups', title: 'Negotiating romance in Turkish serials', theory: 'Encoding/decoding with cultural proximity as a sensitising concept', concepts: 'preferred reading · negotiated reading · cultural proximity', rq: 'How do young women decode romance narratives?', method: 'Focus groups; coding for reading positions and proximity talk.', why: 'Theory structures the questions and coding, while leaving room for readings that do not fit the three positions.' },
      { area: 'Semiotic film analysis', approach: 'Semiotic analysis', title: 'Colour and status in a historical drama', theory: 'Barthes’ semiology (not Metz’s film semiotics, because the focus is cultural connotation rather than film syntax)', concepts: 'sign · connotation · myth', rq: 'How does costume colour signify power?', method: 'Segment scenes; describe denotation, then connotation and myth.', why: 'The example distinguishes two semiotic traditions by analytical purpose.' },
      { area: 'Narrative analysis of television drama', approach: 'Narrative analysis', title: 'Seasonal arcs and episodic closure', theory: 'Narrative theory (Bordwell; Chatman) with genre theory', concepts: 'syuzhet/fabula · seriality · convention', rq: 'How do series balance episodic and serial structures?', method: 'Sequence segmentation across three series.', why: 'Narrative and genre theory operate together on form, a documented complementary pairing.' },
      { area: 'Streaming audiences and viewing motivations', approach: 'Survey', title: 'Motives for streaming imported drama', theory: 'Uses and gratifications', concepts: 'gratifications sought · obtained · active audience', rq: 'Which motives predict time spent on imported drama?', method: 'Survey with motive scales; operational definitions for each concept.', why: 'A formal theory that generates testable expectations, suited to a quantitative design.' },
      { area: 'Critical interpretations of cinematic aesthetics', approach: 'Critical analysis', title: 'Desert landscapes in international productions filmed in Saudi Arabia', theory: 'Postcolonial theory (Said; Shohat & Stam)', concepts: 'Orientalism · the Other · spectacle', rq: 'How do landscape aesthetics construct Saudi Arabia for global audiences?', method: 'Comparative visual analysis of selected sequences and promotional material.', why: 'A critical perspective that connects aesthetics to power, with attention to limits of the reading.' }
    ],
    published: [
      { area: 'Audience reception of Turkish series', ref: 'Alardawi, M. (2025). Saudi women and Turkish dramas: Identity and media influence. World Journal of Social Science, 12(1), 12. https://doi.org/10.5430/wjss.v12n1p12', lesson: 'The article proposes a Cultural Negotiation Framework from its findings. Practise: distinguish a framework developed from data from a theory applied in advance.' },
      { area: 'Streaming audiences and viewing motivations', ref: 'Alardawi, M., Daghistani, M., Almonaie, S., Khaled, A., & Zahra, M. (2024). Saudi viewers watching foreign medical dramas: A uses and gratification approach. Global Journal of Health Science, 16(10), 23. https://doi.org/10.5539/gjhs.v16n10p23', lesson: 'Uses the uses and gratifications approach. Practise: identify how the theory shapes the questions and instrument.' },
      { area: 'Feminist interpretations of Saudi cinema', ref: 'Alardawi, M. M., Saqah, F. A., & Zakari, H. M. (2023). The representation of women in Saudi film: The case of Amra and the Second Marriage. Asian Social Science, 19(6), 123. https://doi.org/10.5539/ass.v19n6p123', lesson: 'Draws on representation theory and feminist theory. Practise: decide whether the two are combined at the same level or for different purposes.' },
      { area: 'Streaming audiences and viewing motivations', ref: 'Qutub, A., & Alardawi, M. (2022). Saudi viewers’ perceptions of Attack on Titan Japanese animation online series. Asian Social Science, 18(1), 65. https://doi.org/10.5539/ass.v18n1p65', lesson: 'Refers to flow theory. Practise: identify the concepts used and how they guide the analysis of viewers’ experience.' },
      { area: 'Audience reception of Turkish series', ref: 'Alardawi, M., Bajnaid, A., & Brereton, P. (2021). The influence of Turkish drama on socio-cultural values of Saudi women. Modern Applied Science, 15(4), 47. https://doi.org/10.5539/mas.v15n4p47', lesson: 'Refers to cultivation theory and cognitive dissonance. Practise: check how effects-oriented assumptions shape the design.' },
      { area: 'Cultural representation and identity', ref: 'Alardawi, M. (2020). The impact of exposure to the Game of Thrones on Saudi male identity. Asian Social Science, 16(11), 56. https://doi.org/10.5539/ass.v16n11p56', lesson: 'Discusses cultivation, cultural identity and uses and gratifications. Practise: assess whether the combination is reconciled.' },
      { area: 'Cultural representation in Saudi streaming drama', ref: 'Alardawi, M., & Brereton, P. (2024). Arabic script television formats between adaptation and cultural identity: A case study of The Killing. International Journal of Psychological Studies, 16(4), 1. https://doi.org/10.5539/ijps.v16n4p1', lesson: 'Draws on adaptation theory and cultural identity (hybridity). Practise: map the concepts to the case analysis.' },
      { area: 'Streaming audiences and viewing motivations', ref: 'Alardawi, M., & Brereton, P. (2025). “Squid Game”: Pleasure and consumption of Korean drama by young Saudi audiences. Mediatization Studies, 8, 69–89. https://doi.org/10.17951/ms.2024.8.69-89', lesson: 'A mixed-methods study of pleasure and consumption. Practise: identify which concepts inform each strand.' },
      { area: 'Audience reception of Turkish series', ref: 'Berg, M., Alardawi, M., & Al Obeidli, N. (2025). Cultural skimming, authenticity, and streaming preferences: Turkish serials (dizi) among young audiences in Qatar, Saudi Arabia, and the UAE. Critical Studies in Television. https://doi.org/10.1177/17496020251404332', lesson: 'Develops the concept of “cultural skimming” from focus-group data. Practise: see how a new concept is related to existing theory.' }
    ],

    ui: {
      next: 'Next step', finish: 'Go to the final report', stepOf: (a, b) => 'Step ' + a + ' of ' + b,
      savedAt: (t) => 'Saved on this device · ' + t, notSaved: 'Not saved yet',
      required: 'This field is required.', tooShort: (n) => 'Please write at least ' + n + ' words.', chooseOne: 'Please choose one option.',
      fixErrors: 'Please complete the highlighted fields before continuing.', needFocus: 'Choose at least one focus.', needShort: 'Add at least one perspective to your shortlist.',
      needRel: 'Write the relevance of each shortlisted perspective (at least 4 words each).', needConcepts: 'Add at least two concepts with a name and a definition.', needAlign: 'Link at least one concept to each research question.', needMap: 'The map needs at least three elements.', needDraft: 'Build or write the framework draft first.',
      chooseApproachFirst: 'Choose the methodology first', chooseDesign: 'Choose a design', example: 'Example', weak: 'Weak', better: 'Better', tip: 'Tip:', fix: 'Fix:',
      copy: 'Copy', copied: 'Copied.', copyFail: 'Copying failed; select the text and copy it manually.',
      focusTitle: 'Focus of the study', focusHint: 'Tick everything the study concerns, then choose the main focus.',
      // Explorer
      exSearch: 'Search theories', exSearchPh: 'e.g. gaze, representation, Hall', exFocus: 'Focus', exKind: 'Design', exObj: 'Analytical purpose', exAll: 'All', exNone: 'No perspective matches these filters.',
      exAdd: 'Add to shortlist', exRemove: 'Remove from shortlist', exShort: 'Shortlisted', exCount: (n) => n + ' in shortlist', exDetails: 'Read the profile',
      fTheorists: 'Principal theorists', fBackground: 'Historical and disciplinary background', fAssumptions: 'Foundational assumptions', fConcepts: 'Main concepts', fQuestions: 'Typical research questions', fMethods: 'Methodological compatibility', fApplications: 'Typical research applications', fStrengths: 'Strengths', fLimits: 'Limitations', fExample: 'Film and television example', fRefs: 'Foundational references (verify before citing)', fType: 'Kind of perspective',
      badgeFocus: (x) => 'Matches your focus: ' + x, badgeKind: 'Compatible with your design', badgeKindNo: 'Less usual with your design', badgeObj: 'Serves your role of theory', compatNote: 'Badges compare the profile with your Steps 1–2; they explain compatibility and do not choose for you.',
      customTag: 'Your perspective',
      // Compare
      cmpEmpty: 'Shortlist perspectives in Step 3 to compare them.', cmpRel: 'Relevance to your study (your words)', cmpRate: 'Your judgement', cmpPairs: 'Relations between the perspectives', cmpNoPairs: 'No documented relation between these perspectives in the library; explain in your own words whether they are compatible.',
      cmpPick: 'Choose two to four perspectives to compare', cmpToolEmpty: 'Tick at least two perspectives.', cmpCustomNote: 'Your own perspective — describe it in Step 3.',
      // Select
      secondary: 'Secondary perspective (optional)', secondaryHint: 'Only if combining is intellectually justified.', noneSecondary: 'No secondary perspective',
      // Concepts
      cmTitle: 'Theoretical Concepts Matrix', cmIntro: 'Each concept needs a definition, a source and a clear analytical use.', cmAdd: 'Add concept', cmDel: 'Remove', cmEmpty: 'No concepts yet.', cmCount: (n) => n + ' concept(s)',
      cmCols: { concept: 'Concept', definition: 'Definition', source: 'Original theorist or source', theory: 'Theoretical context', relevance: 'Relevance to the problem', questions: 'Related questions (e.g. RQ1, RQ2)', application: 'Analytical application', reference: 'Supporting reference (in-text)', operational: 'Operational definition (quantitative)' },
      cmQuick: 'Quick add from your selected theory (you write the definition):', cmCsv: 'Export CSV', cmJson: 'Export JSON', cmImport: 'Import CSV or JSON', cmImported: (n) => n + ' concepts imported.', cmImportFail: 'The file could not be read. Use the exported format.', cmN: (n) => 'Concept ' + n, confirmDel: 'Click again to remove',
      // Alignment
      alTitle: 'Theory–Research Alignment Matrix', alCols: ['Question', 'Concepts', 'Analytical focus', 'Research evidence', 'Procedure'], alFocusPh: 'e.g. domestic space, framing', alEvidencePh: 'e.g. 12 scenes', alProcPh: 'e.g. semiotic close reading', alNoQ: 'Enter your research questions in Step 1.', alNoC: 'Add concepts in Step 6.',
      // Method
      pathwayTitle: 'Methodological pathway', pathwayFor: (t) => 'Suggested pathway: ' + t,
      // Map
      mapBuild: 'Build from my entries', mapBuildConfirm: 'Click again to replace the map', mapBuilt: 'The map was rebuilt from your entries.', mapLayout: 'Layout', mapReset: 'Reset positions', mapSvg: 'Download map (SVG)',
      mapNodes: 'Elements', mapEdges: 'Connections', mapAddNode: 'Add element', mapAddEdge: 'Add connection', mapType: 'Type', mapLabel: 'Label', mapFrom: 'From', mapTo: 'To', mapKind: 'Kind', mapEdgeLabel: 'Label (optional)', mapDel: 'Remove',
      mapHint: 'Drag elements to arrange them. Plain lines show relations; use arrows only when direction or causality is justified.', mapEmpty: 'No elements yet.', mapAria: 'Theoretical framework map',
      // Writing
      composerHint: 'Turn parts on or off, reorder and edit them. Each part becomes one paragraph.', moveUp: 'Move up', moveDown: 'Move down', resetSection: 'Reset', sectionReset: 'The part was refilled from your steps.', sectionEmpty: 'This part is empty — complete the related step or write here.',
      words: (n) => n + ' words', insertLib: 'Insert the library summary as a starting point', inserted: 'Library summary inserted. Rewrite it in your own words and cite the sources.', insertConfirm: 'Click again to replace your text',
      draftTitle: 'Full theoretical framework draft', rebuild: 'Rebuild from parts', rebuildConfirm: 'Click again to replace your edits', rebuilt: 'Draft rebuilt.', draftAutoNote: 'Updates automatically from the parts above.', draftEditedNote: 'You edited the draft directly, so it no longer updates automatically.',
      writeFields: 'Your writing fields', checkTitle: 'Writing checker', checkLabel: 'Text to check', checkPh: 'Paste a framework section or a paragraph…', useDraft: 'Use my Builder draft',
      // Evaluation
      refineTitle: 'Refinement checks', checksTitle: 'Automatic checks', checklistTitle: 'Framework refinement checklist', checklistDone: (a, b) => a + ' of ' + b + ' checked',
      applyScores: 'Use the suggested scores', scoresApplied: 'Suggested scores applied; adjust them as you see fit.', suggestedScore: 'Suggested score:', overall: 'Overall', outOf5: '/ 5', recommendations: 'Revision recommendations', noRecs: 'No criterion is rated 3 or below.', notRated: 'Not rated yet.',
      evalDisclaimer: 'This evaluation supports scholarly self-review. It does not replace academic supervision or expert evaluation.', rubricCols: ['Criterion', '1–2 · Needs work', '3 · Developing', '4–5 · Strong'],
      // Final
      finalFromDraft: 'Copy the Step 10 draft here', replaceConfirm: 'Click again to replace', finalCopied: 'Draft copied into the final version.', copyFinal: 'Copy final framework',
      reportRegen: 'Regenerate report', regenConfirm: 'Click again to discard report edits', reportRebuilt: 'Report regenerated.', reportCopy: 'Copy report', print: 'Print / Save as PDF', doc: 'Download Word (.doc)', txt: 'Download text (.txt)',
      fileReport: 'theoretical-framework-report', fileData: 'theoretical-framework-project.json', fileConcepts: 'concepts-matrix', fileMap: 'framework-map',
      report: { title: 'Theoretical Framework Report', generated: (d) => 'Generated on ' + d + ' · Theoretical Framework Development in Film and Television Studies', context: 'Research title and context', need: 'Theoretical need', selected: 'Selected theoretical perspective', comparison: 'Theory comparison', justification: 'Justification for theory selection', concepts: 'Key theoretical concepts', alignment: 'Theory–research alignment matrix', method: 'Theory–methodology integration', map: 'Visual framework', mapRel: 'Connections in the map', draft: 'Complete theoretical framework draft', evaluation: 'Evaluation results', self: 'Researcher’s reflection', recs: 'Revision recommendations', noRecs: 'No revision recommendations.', final: 'Final theoretical framework', refs: 'References', libRefs: 'Foundational references for the selected perspectives (cite only those you have read)', noRefs: 'No references entered.', notes: 'Notes', footer: 'Academic Tool Developed by Dr. Merfat Alardawi. The report contains the researcher’s entries and rule-based feedback; verify all citations before submission.' },
      lbl: { relevance: 'Relevance', problem: 'Addresses the problem', aspects: 'Aspects explained', alternatives: 'Alternatives', method: 'Relation to methodology', combine: 'Combination', secondary: 'Secondary', rating: 'Judgement', design: 'Design', collection: 'Data collection', selection: 'Selection', categories: 'Analytical categories', interpretation: 'Interpretation', presentation: 'Presentation' },
      empty: '—',
      deleteAll: 'Click again to delete all', deleted: 'All saved data has been deleted from this browser.', imported: 'Project imported.', importFail: 'This file is not a project exported from this tool.',
      exAllAreas: 'All', exHyp: 'Illustrative example', exPub: 'Verified published study', whyWorks: 'Why it works:', lesson: 'Learning task:', exTheory: 'Theory', exConcepts: 'Concepts', exRq: 'Question', exMethod: 'Method',
      glossCols: ['Term', 'Equivalent', 'Definition', 'Arabic definition'],
      refGroups: { frameworks: 'Theoretical and conceptual frameworks', theories: 'Foundational theoretical works', film: 'Film and media theory debates', examples: 'Film and television studies used in the examples', tutorials: 'Video tutorials in the attached reference file' },
      refTypes: { book: 'Book', article: 'Peer-reviewed article', chapter: 'Book chapter', example: 'Published example', video: 'Video tutorial' },
      distCols: ['Concept', 'What it is', 'Film/TV example'],
      guideStep: (n, t) => 'Step ' + n + ' — ' + t
    }
  };
  function x0(s) { const a = String(s || '').split(/\n+/).map(T).filter(has); return a.length ? 'The analytical categories are ' + listJoin(a) + '.' : ''; }
})();
