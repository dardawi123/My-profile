/* =========================================================
   Research Methodology Formulation and Refinement in Film and Television Studies
   English interface text, guidance, options, examples and draft templates.
   rmethods-ar.js has exactly the same keys and structure.
   Academic tool developed by Dr. Merfat Alardawi
   ========================================================= */
window.RC = (function () {
  'use strict';
  const sep = ', ';
  const list = (arr) => arr.length <= 1 ? (arr[0] || '') : arr.slice(0, -1).join(sep) + ' and ' + arr[arr.length - 1];
  const lc = (s) => s ? s.charAt(0).toLowerCase() + s.slice(1) : s;
  const fill = (x, prompt) => (x && String(x).trim()) ? String(x).trim() : '[' + prompt + ']';
  const designPhrase = (t) => { const x = lc(t).replace(/ \(.*\)$/, ''); const d = /design$/.test(x) ? x : x + ' design'; return (/^[aeiou]/.test(d) ? 'an ' : 'a ') + d; };
  const end = (s) => { s = String(s || '').trim(); return !s ? '' : (/[.!?…\]]$/.test(s) ? s : s + '.'); };

  return {
    lang: 'en',
    numerals: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],

    /* ---------- Builder steps ---------- */
    steps: ['Context & problem', 'Approach', 'Paradigm', 'Design', 'Sampling', 'Data collection', 'Data analysis', 'Ethics & quality', 'Draft & refine', 'Evaluate & report'],
    stepText: [
      { h: 'Step 1 — Research Context and Problem', p: 'Start from what the study must answer. Every later decision is judged against these entries.',
        whyH: 'Why start here', why: 'A methodology has no value in itself: it is appropriate or inappropriate for a particular problem and set of questions. The question should rule out many options before you consider any method.',
        ex: 'Problem — little is known about how young Saudi women interpret the portrayal of family authority in streamed Gulf dramas. Main question — How do young Saudi women interpret the portrayal of family authority in Gulf dramas streamed on Shahid?',
        out: 'Expected output — a structured overview of the study’s methodological requirements' },
      { h: 'Step 2 — Select the Research Approach', p: 'Choose between qualitative, quantitative and mixed-methods research, and justify the choice.',
        whyH: 'Three factors decide the approach', why: 'The nature of your aims and questions comes first; then the methodological norms of your field; then practicalities such as access to data, time and skills. The suggestion below reads the wording of your questions and objectives only — treat it as a prompt for reflection, not a decision.',
        ex: 'Justification — “A qualitative approach suits the study because it seeks to understand how viewers make sense of televised family relations in their own terms, not to measure how many hold a given view.”',
        out: 'Expected output — a preliminary approach with an academic justification' },
      { h: 'Step 3 — Identify the Research Paradigm', p: 'State the philosophical orientation that underpins your choices, where this is appropriate.',
        whyH: 'A paradigm shapes, but does not dictate, method', why: 'Paradigms are sets of assumptions about reality (ontology), knowledge (epistemology) and the role of the researcher. They influence what counts as evidence and how quality is judged. Not every study must name one; many film-analytic studies state their theoretical frame instead.',
        ex: 'Orientation — “The study takes an interpretivist position: meanings of televised family authority are understood as constructed by viewers in context, and the researcher’s interpretation is part of the analysis.”',
        out: 'Expected output — a clearly articulated methodological orientation, where appropriate' },
      { h: 'Step 4 — Select the Research Design', p: 'Choose the overall plan that connects your questions to data and analysis.',
        whyH: 'Design is not the same as method', why: 'A design (for example a case study or an explanatory sequential design) is the logic of the whole study. Interviews or scene analysis are methods used within a design. Designs that do not fit your approach are marked.',
        ex: 'Rationale — “A comparative case study of two Saudi Ramadan series allows the representation of family authority to be examined in depth within each case and then compared across production contexts.”',
        out: 'Expected output — a proposed design with a clear methodological rationale' },
      { h: 'Step 5 — Sampling and Case Selection', p: 'Decide who or what will be studied, and why these participants, cases or texts.',
        whyH: 'Adequacy, not a magic number', why: 'Qualitative samples are chosen for the information they can offer, not for statistical representativeness. Sample adequacy depends on the aim, the specificity of the sample, the use of theory, the quality of dialogue and the analysis strategy (information power; Malterud et al., 2016). Saturation fits some traditions, such as grounded theory, but not all (Braun & Clarke, 2021).',
        ex: 'Inclusion — “Saudi women aged 18–30 who have watched at least two Gulf dramas on Shahid in the past year.” Selection — “Ramadan series of 2022–2024 with a family conflict as the main plot line.”',
        out: 'Expected output — a justified sampling or case-selection plan' },
      { h: 'Step 6 — Data Collection Methods', p: 'Select how data will be gathered, distinguishing existing audiovisual material from data you will generate with participants.',
        whyH: 'Two kinds of data', why: 'Film and television research often combines existing material (films, episodes, scripts, reviews, platform pages) with data generated through participant-based methods (interviews, focus groups, surveys, observation). The two need different procedures and different ethical safeguards.',
        ex: 'Procedure — “Twelve semi-structured interviews (45–60 minutes) will be held online in Arabic, guided by a pilot-tested interview guide, audio-recorded with consent and transcribed verbatim.”',
        out: 'Expected output — a clearly defined and justified data collection strategy' },
      { h: 'Step 7 — Data Analysis Procedures', p: 'Choose analytical approaches that fit your questions and your data.',
        whyH: 'Not all film analysis is coding', why: 'Formal analysis of cinematography, editing, mise-en-scène and sound is interpretive close analysis, not qualitative coding. Thematic analysis and content analysis are suited to large bodies of talk or text. Choose what answers the question.',
        ex: 'Procedure — “Interview transcripts will be analysed with reflexive thematic analysis (Braun & Clarke, 2019): familiarisation, coding, generating, reviewing and naming themes, and writing up.”',
        out: 'Expected output — a structured and justified data analysis plan' },
      { h: 'Step 8 — Research Ethics and Methodological Quality', p: 'Identify ethical safeguards and quality procedures suited to your research tradition.',
        whyH: 'Quality criteria differ by tradition', why: 'Interpretive film criticism, reflexive thematic analysis, grounded theory, quantitative content analysis and mixed-methods research are judged by different standards. Recommended items for your choices are highlighted; mismatches are flagged.',
        ex: 'Quality — “A reflexive journal will record the researcher’s position as a Saudi female viewer and how it shaped interpretation; thick description will support readers’ judgements of transferability.”',
        out: 'Expected output — an ethics and quality-assurance statement appropriate to the study' },
      { h: 'Step 9 — Methodology Formulation and Refinement', p: 'The tool assembles a draft methodology section from your entries. Edit it freely, then use the suggestions to refine it.',
        whyH: 'Justify every choice', why: 'A methodology section should explain not only what you will do but why each choice suits your questions — and what the choices cannot do. Gaps in your entries appear as [bracketed prompts] in the draft.',
        ex: 'Limitation — “Findings from twelve interviews are not statistically generalisable; the study aims at analytical insight and transferability, supported by thick description.”',
        out: 'Expected output — an editable methodology section for further development' },
      { h: 'Step 10 — Methodological Evaluation and Final Report', p: 'Rate your methodology on ten criteria, review the recommendations, then edit and export your report.',
        whyH: 'A tool for reflection', why: 'Suggested scores come from the rule-based checks in this tool. Adjust them using your own judgement and your supervisor’s feedback.',
        ex: '',
        out: 'Final report — all your decisions, the draft methodology and the evaluation in one editable document' }
    ],

    /* ---------- Field texts ---------- */
    f: {
      's1.title': { label: 'Research title (working)', ph: 'e.g. Family authority in streamed Gulf drama: A reception study of young Saudi women' },
      's1.scope': { label: 'Research context and scope', ph: 'e.g. Saudi Arabia; Gulf dramas streamed on Shahid, 2022–2024', hint: 'Place, culture, platform, period, and what is excluded.' },
      's1.problem': { label: 'Research problem', ph: 'What is not yet known or understood, and why does it matter?', hint: 'Two to four sentences. Used to check alignment with your questions and design.' },
      's1.mainQ': { label: 'Main research question', ph: 'e.g. How do young Saudi women interpret the portrayal of family authority in Gulf dramas streamed on Shahid?' },
      's1.subQs': { label: 'Supporting research questions', ph: 'One question per line', hint: 'Optional, but recommended. Each line is read as one question.' },
      's1.objectives': { label: 'Research objectives', ph: 'One objective per line, e.g. To identify how viewers describe…', hint: 'Start each objective with a verb: identify, examine, compare, explain…' },
      's1.theory': { label: 'Theoretical framework (where applicable)', ph: 'e.g. Hall’s encoding/decoding model; feminist television criticism', hint: 'Leave empty for an inductive design such as grounded theory.' },
      's2.approach': { label: 'Research approach' },
      's2.just': { label: 'Your justification for this approach', ph: 'Explain why this approach fits your problem, questions and objectives…', hint: 'At least 15 words. Use the suggestion and the descriptions above.' },
      's3.paradigm': { label: 'Methodological orientation' },
      's3.note': { label: 'Notes on your orientation (optional)', ph: 'e.g. how your position as a researcher relates to the study' },
      's4.design': { label: 'Research design' },
      's4.rationale': { label: 'Design rationale', ph: 'Why does this design suit your questions, data and context?', hint: 'At least 15 words.' },
      's5.units': { label: 'What will you sample?' },
      's5.strategies': { label: 'Sampling or selection strategies' },
      's5.include': { label: 'Inclusion criteria', ph: 'e.g. women aged 18–30 who watched at least two Gulf dramas on Shahid in 2023–2024' },
      's5.exclude': { label: 'Exclusion criteria (optional)', ph: 'e.g. media professionals; series not available in Arabic' },
      's5.size': { label: 'Proposed sample size or case scope', ph: 'e.g. 12–16 interviews / 2 series, 30 episodes / 400 survey responses' },
      's5.procedure': { label: 'Recruitment or selection procedure', ph: 'e.g. invitations through university mailing lists, followed by referrals' },
      's5.access': { label: 'Feasibility and access (optional)', ph: 'e.g. access to the archive; gatekeepers; language; time' },
      's5.rationale': { label: 'Why are these participants, cases or texts relevant?', ph: 'Explain the link between the sample and your questions…', hint: 'At least 10 words.' },
      's6.methods': { label: 'Data collection methods' },
      's6.instruments': { label: 'Instruments and materials (optional)', ph: 'e.g. interview guide with 10 open questions; viewing log; coding frame; questionnaire with validated scales' },
      's6.procedure': { label: 'Collection procedure', ph: 'Who, where, how long, in which language, how recorded…', hint: 'At least 10 words.' },
      's7.methods': { label: 'Analytical approaches' },
      's7.dims': { label: 'Dimensions of audiovisual analysis', hint: 'Shown because you selected an approach that analyses audiovisual texts.' },
      's7.procedure': { label: 'Analysis procedure', ph: 'The stages you will follow, and how you will move from data to findings…', hint: 'At least 10 words.' },
      's7.software': { label: 'Software or tools (optional)', ph: 'e.g. NVivo, MAXQDA, ELAN, SPSS, R, a shot log in a spreadsheet' },
      's8.ethics': { label: 'Ethical considerations' },
      's8.quality': { label: 'Quality and rigour procedures' },
      's8.notes': { label: 'Additional ethical or quality notes (optional)', ph: 'e.g. how sensitive topics will be handled; storage period' },
      's9.limits': { label: 'Limitations and methodological justifications', ph: 'What can your design not do, and why is it still the most appropriate choice?', hint: 'At least 8 words. Included in section 10 of the draft.' }
    },

    /* ---------- Research approaches ---------- */
    approaches: [
      { id: 'qual', t: 'Qualitative research',
        d: 'Studies meanings, experiences, interpretations and processes in depth and in context, usually with smaller, purposefully chosen samples and non-numerical data (talk, texts, images, sounds).',
        purpose: 'Understanding how and why; exploring meanings and interpretations', data: 'Interviews, focus groups, observation, audiovisual texts, documents', logic: 'Mainly inductive or abductive; interpretation is central', outcome: 'Themes, interpretations, concepts, rich description',
        strengths: 'Depth; attention to context and to participants’ own terms; flexibility; suited to new or complex phenomena and to texts.',
        limits: 'Not statistically generalisable; depends on the researcher’s interpretation, which must be made transparent; time-consuming analysis.',
        ftv: 'How do Saudi viewers make sense of Turkish drama heroines?',
        stmt: 'A qualitative approach is suited to examining meanings, interpretations and processes in depth and in their context, rather than measuring their frequency.' },
      { id: 'quant', t: 'Quantitative research',
        d: 'Measures variables and examines patterns, differences or relationships numerically, usually with larger or systematic samples and statistical analysis.',
        purpose: 'Measuring how many, how often, to what extent; testing relationships', data: 'Surveys with scales, coded content counts, experiments, platform metrics', logic: 'Mainly deductive; hypotheses or descriptive questions', outcome: 'Frequencies, statistics, tested relationships',
        strengths: 'Breadth; comparability; can estimate prevalence and test relationships; replicable procedures.',
        limits: 'Can miss meaning and context; depends on valid measures; correlation does not establish causation.',
        ftv: 'Is exposure to AI-themed films associated with young adults’ perceptions of AI?',
        stmt: 'A quantitative approach is suited to measuring the variables of interest and examining patterns and relationships across a larger sample.' },
      { id: 'mixed', t: 'Mixed-methods research',
        d: 'Collects and analyses both qualitative and quantitative data and deliberately integrates them to answer questions neither strand could answer alone.',
        purpose: 'Combining breadth and depth; explaining or developing one strand with the other', data: 'Both kinds, collected concurrently or in phases', logic: 'Often pragmatic; integration is the defining feature', outcome: 'Integrated findings and meta-inferences',
        strengths: 'Breadth and depth together; one strand can explain, build on or check the other.',
        limits: 'Demanding in time and skills; needs a clear design and an explicit integration strategy, not two separate studies.',
        ftv: 'A survey of viewing habits followed by focus groups that explain the patterns found.',
        stmt: 'A mixed-methods approach is suited because the questions require both breadth (measured patterns) and depth (interpretation of meaning), and the two strands are integrated.' }
    ],

    /* ---------- Paradigms ---------- */
    paradigms: [
      { id: 'interpretivism', t: 'Interpretivism', fit: ['qual', 'mixed'],
        d: 'Social and cultural realities are understood through the meanings people give them; research aims at understanding (Verstehen) rather than explanation by laws.',
        use: 'Reception studies, audience experiences, readings of texts in context.',
        stmt: 'The study adopts an interpretivist orientation: the meanings under study are understood as produced by people in context, and interpretation is central to analysis.' },
      { id: 'constructivism', t: 'Constructivism', fit: ['qual', 'mixed'],
        d: 'Knowledge is co-constructed by researcher and participants; multiple realities exist. Often paired with constructivist grounded theory.',
        use: 'Studies of how viewers or practitioners construct meanings and identities.',
        stmt: 'The study adopts a constructivist orientation: knowledge is understood as co-constructed between researcher and participants, and multiple perspectives are expected.' },
      { id: 'critical', t: 'Critical theory', fit: ['qual', 'quant', 'mixed'],
        d: 'Research examines power, ideology and inequality and may aim at change. Includes feminist, postcolonial and critical cultural approaches.',
        use: 'Representation of gender, ethnicity or class; ideology in media texts; industry power.',
        stmt: 'The study adopts a critical orientation: representations and practices are examined in relation to power, ideology and inequality.' },
      { id: 'postpositivism', t: 'Post-positivism', fit: ['quant', 'mixed'],
        d: 'A reality exists but can be known only imperfectly; research tests claims with rigorous, replicable procedures and acknowledges error.',
        use: 'Surveys, experiments, quantitative content analysis of representation.',
        stmt: 'The study adopts a post-positivist orientation: claims are tested through systematic, replicable procedures while recognising that measurement is imperfect.' },
      { id: 'pragmatism', t: 'Pragmatism', fit: ['mixed', 'qual', 'quant'],
        d: 'The research question drives the choice of methods; what works to answer it matters more than allegiance to one paradigm. Common in mixed methods (Johnson & Onwuegbuzie, 2004).',
        use: 'Mixed-methods audience and industry studies.',
        stmt: 'The study adopts a pragmatist orientation: methods are chosen for their ability to answer the research questions, and different kinds of evidence are combined.' },
      { id: 'implicit', t: 'No single named paradigm', fit: ['qual', 'quant', 'mixed'],
        d: 'Many film-analytic and theoretical studies state their theoretical and analytical framework rather than a paradigm. This is acceptable if assumptions are made clear where they shape decisions.',
        use: 'Textual, historical or theoretical film studies; applied studies where the field does not expect a paradigm statement.',
        stmt: 'The study does not adopt a single named paradigm; its theoretical and analytical assumptions are stated where they shape design decisions.' }
    ],

    /* ---------- Designs (design explorer + Step 4) ---------- */
    designs: [
      { id: 'case', family: 'qual', fit: ['qual', 'mixed'], t: 'Case study',
        d: 'An in-depth study of a bounded case — a film, a series, a festival, a production company, a platform — in its real-life context, using several sources of evidence (Yin, 2018).',
        when: 'When the case is bounded and its context matters; for how and why questions.',
        ex: 'How a Saudi streaming original was commissioned, produced and promoted.',
        data: 'Interviews, documents, the texts themselves, observation.',
        caution: 'Define the case boundaries and justify why this case (typical, extreme, revelatory).',
        stmt: 'A case study design allows the phenomenon to be studied in depth within its real-life context, drawing on several sources of evidence.' },
      { id: 'comparative', family: 'qual', fit: ['qual', 'mixed'], t: 'Comparative case study',
        d: 'Two or more cases are studied in depth and then compared to identify similarities, differences and the conditions that explain them.',
        when: 'When the comparison itself answers the question (e.g. an original and its adaptation).',
        ex: 'The original Danish series and its Arabic adaptation of The Killing.',
        data: 'The texts, production documents, interviews, reception data.',
        caution: 'Use the same analytical dimensions for every case; justify the basis of comparison.',
        stmt: 'A comparative case study design allows each case to be analysed in depth and then compared on the same dimensions.' },
      { id: 'phenomenology', family: 'qual', fit: ['qual'], t: 'Phenomenological study',
        d: 'Describes and interprets the lived experience of a phenomenon from the perspective of those who experience it (e.g. interpretative phenomenological analysis; Smith et al., 2022).',
        when: 'When the question is about what an experience is like and what it means to people.',
        ex: 'The lived experience of binge-watching among female university students.',
        data: 'In-depth interviews with a small, homogeneous sample.',
        caution: 'Keep the focus on experience, not opinions; small, homogeneous samples are usual.',
        stmt: 'A phenomenological design allows the lived experience of the phenomenon to be described and interpreted from participants’ own perspectives.' },
      { id: 'ethnography', family: 'qual', fit: ['qual', 'mixed'], t: 'Ethnography',
        d: 'Extended engagement with a group or setting to understand its culture and practices from within, mainly through participant observation.',
        when: 'When everyday practices in a setting matter: a film set, a writers’ room, family viewing.',
        ex: 'Collective viewing practices of Ramadan drama in Saudi households.',
        data: 'Participant observation, field notes, informal interviews, artefacts.',
        caution: 'Requires sustained access and time; reflexivity about the researcher’s role is essential.',
        stmt: 'An ethnographic design allows practices and meanings to be understood from within the setting through sustained engagement.' },
      { id: 'digital-ethno', family: 'qual', fit: ['qual', 'mixed'], t: 'Digital ethnography',
        d: 'Ethnographic study of online communities and digitally mediated practices, such as fandoms, comment sections and platform cultures (Pink et al., 2016; Kozinets, 2020).',
        when: 'When the phenomenon lives online: fan discussions, social TV, reaction videos.',
        ex: 'How fans of Turkish series negotiate cultural values in Arabic X (Twitter) and TikTok communities.',
        data: 'Online observation, posts and threads, screenshots, online interviews.',
        caution: 'Public does not mean consent-free; follow internet research ethics (franzke et al., 2020).',
        stmt: 'A digital ethnographic design allows online practices and meanings to be studied in their own setting through sustained observation.' },
      { id: 'grounded', family: 'qual', fit: ['qual'], t: 'Grounded theory',
        d: 'Develops a theory or explanatory model grounded in data, through concurrent data collection and analysis, constant comparison and theoretical sampling (Charmaz, 2014).',
        when: 'When existing theory does not explain a process and you aim to build one.',
        ex: 'A model of how young Saudi screenwriters navigate commissioning on streaming platforms.',
        data: 'Interviews, often with observation or documents; theoretical sampling.',
        caution: 'Choosing grounded theory commits you to its procedures; do not use the label for a general thematic analysis.',
        stmt: 'A grounded theory design allows an explanatory model of the process to be developed from the data through constant comparison and theoretical sampling.' },
      { id: 'narrative', family: 'qual', fit: ['qual'], t: 'Narrative inquiry',
        d: 'Studies the stories people tell about their lives and experiences, attending to how stories are structured and told (Clandinin & Connelly, 2000; Riessman, 2008).',
        when: 'When biographical or career stories are the data: filmmakers’ careers, viewers’ media life histories.',
        ex: 'Career narratives of Saudi women directors since 2018.',
        data: 'Life-story or narrative interviews, personal documents.',
        caution: 'Analyse the stories as stories (structure, sequence, positioning), not only their topics.',
        stmt: 'A narrative inquiry design allows participants’ experiences to be studied through the stories they tell and how they tell them.' },
      { id: 'textual', family: 'qual', fit: ['qual', 'mixed'], t: 'Interpretive textual study (film and television texts)',
        d: 'A text-based design common in film studies: a justified corpus of films, episodes or scenes is closely analysed to interpret form, narrative, representation and meaning. Its analytical method is chosen in Step 7 (formal, semiotic, narrative or discourse analysis).',
        when: 'When the question is about the texts themselves: style, narrative, representation, adaptation.',
        ex: 'How Saudi films since 2018 construct female mobility through framing and mise-en-scène.',
        data: 'Films, episodes, selected scenes; scripts and paratexts where relevant.',
        caution: 'Justify the corpus and the scenes chosen; state the theoretical lens that guides interpretation.',
        stmt: 'An interpretive textual design allows the selected audiovisual texts to be analysed closely as constructions of meaning, guided by an explicit theoretical lens.' },
      { id: 'survey', family: 'quant', fit: ['quant', 'mixed'], t: 'Cross-sectional survey',
        d: 'Collects standardised data from a sample at one point in time to describe patterns or examine relationships between variables.',
        when: 'For how many, how often and relationship questions across a population.',
        ex: 'Viewing habits and platform preferences of Saudi university students.',
        data: 'Questionnaires with validated scales and closed items.',
        caution: 'Non-probability (e.g. snowball) samples limit generalisation; report this.',
        stmt: 'A cross-sectional survey design allows standardised data to be collected from a sample to describe patterns and examine relationships between variables.' },
      { id: 'qca-quant', family: 'quant', fit: ['quant', 'mixed'], t: 'Quantitative content analysis',
        d: 'A systematic, replicable design that codes manifest features of a sample of media content with a codebook and reports frequencies and relationships (Krippendorff, 2019; Neuendorf, 2017).',
        when: 'For questions about how often and how prominently something appears across many texts.',
        ex: 'The frequency and prominence of minority characters in prime-time television (Żerebecki et al., 2024).',
        data: 'A defined sample of episodes, films, trailers or posts; a codebook.',
        caution: 'Needs a tested codebook, trained coders and inter-coder reliability.',
        stmt: 'A quantitative content analysis design allows defined features of the content to be coded systematically and their frequency and relationships to be measured reliably.' },
      { id: 'experimental', family: 'quant', fit: ['quant'], t: 'Experimental or quasi-experimental design',
        d: 'Manipulates exposure (e.g. to a trailer or scene) and compares outcomes between groups, with or without random assignment.',
        when: 'When the question is about the effect of a specific exposure.',
        ex: 'Does viewing a trailer with Arabic subtitles rather than dubbing change perceived authenticity?',
        data: 'Pre- and post-tests, control groups, measured responses.',
        caution: 'Artificial settings limit ecological validity; ethics of exposure must be considered.',
        stmt: 'An experimental design allows the effect of the exposure to be examined by comparing outcomes between conditions.' },
      { id: 'convergent', family: 'mixed', fit: ['mixed'], t: 'Convergent design',
        d: 'Qualitative and quantitative data are collected in the same phase, analysed separately, then merged to compare and combine results (Creswell & Plano Clark, 2018).',
        when: 'When you need two complementary views of the same topic at the same time.',
        ex: 'A survey of platform use and focus groups on platform choice, merged in a joint display.',
        data: 'A survey and interviews or focus groups in parallel.',
        caution: 'Plan how results will be merged and how disagreements will be handled.',
        stmt: 'A convergent mixed-methods design allows qualitative and quantitative data to be collected in parallel and merged to provide a more complete understanding.' },
      { id: 'expl-seq', family: 'mixed', fit: ['mixed'], t: 'Explanatory sequential design',
        d: 'A quantitative phase comes first; a qualitative phase then explains or elaborates its results, often with participants selected from the first phase.',
        when: 'When survey results need to be explained in viewers’ own words.',
        ex: 'A preliminary survey followed by focus groups exploring why young viewers enjoy Squid Game (Alardawi & Brereton, 2024).',
        data: 'Survey, then interviews or focus groups.',
        caution: 'The second phase must be designed from the first phase’s results.',
        stmt: 'An explanatory sequential design allows quantitative results to be collected first and then explained in depth through a qualitative phase.' },
      { id: 'expl-seq-x', family: 'mixed', fit: ['mixed'], t: 'Exploratory sequential design',
        d: 'A qualitative phase comes first to explore a topic; its findings are used to build an instrument or hypotheses tested in a quantitative phase.',
        when: 'When no suitable measure exists and must be developed from viewers’ own categories.',
        ex: 'Focus groups on what “authenticity” means to viewers, used to build and test a survey scale.',
        data: 'Interviews or focus groups, then a survey.',
        caution: 'Allow time for instrument development and testing between phases.',
        stmt: 'An exploratory sequential design allows the phenomenon to be explored qualitatively first, with the findings used to develop a quantitative phase.' }
    ],

    /* ---------- Sampling ---------- */
    units: [
      { id: 'people', t: 'Participants (viewers, students, practitioners)' },
      { id: 'texts', t: 'Audiovisual texts (films, episodes, scenes, trailers)' },
      { id: 'online', t: 'Online content (posts, comments, fan material)' },
      { id: 'docs', t: 'Documents (scripts, policies, reviews, press, archives)' }
    ],
    sampling: [
      { id: 'purposive', t: 'Purposive sampling', for: ['people', 'texts', 'online', 'docs'], fam: 'qual',
        d: 'Participants or texts are chosen because they are information-rich for the question (Patton, 2015; Palinkas et al., 2015).',
        stmt: 'purposive sampling, to select information-rich participants or texts' },
      { id: 'criterion', t: 'Criterion sampling', for: ['people', 'texts', 'online', 'docs'], fam: 'qual',
        d: 'All cases that meet predefined criteria are included, e.g. every Saudi Ramadan series of 2023 with a female lead.',
        stmt: 'criterion sampling based on explicit inclusion criteria' },
      { id: 'maxvar', t: 'Maximum variation sampling', for: ['people', 'texts'], fam: 'qual',
        d: 'Cases are chosen to cover a wide range (age, region, genre, platform) so that shared patterns and differences can be seen.',
        stmt: 'maximum variation sampling, to capture a wide range of perspectives or texts' },
      { id: 'snowball', t: 'Snowball sampling', for: ['people'], fam: 'qual',
        d: 'Participants refer others; useful for hard-to-reach groups such as industry professionals, but the sample may share networks.',
        stmt: 'snowball sampling through participants’ referrals' },
      { id: 'theoretical', t: 'Theoretical sampling', for: ['people', 'texts', 'online', 'docs'], fam: 'gt',
        d: 'Grounded theory only: later sampling decisions are driven by the concepts emerging from the analysis.',
        stmt: 'theoretical sampling, guided by the concepts emerging from the analysis' },
      { id: 'case-select', t: 'Case and text selection criteria (typical, extreme, critical, revelatory)', for: ['texts', 'docs', 'people', 'online'], fam: 'qual',
        d: 'Cases or texts are selected for an explicit reason: typical of a pattern, extreme, critical for a theory, or newly accessible.',
        stmt: 'explicit case selection criteria' },
      { id: 'convenience', t: 'Convenience sampling', for: ['people', 'online'], fam: 'any',
        d: 'Whoever is easily available. Sometimes unavoidable, but it is the weakest rationale and must be acknowledged as a limitation.',
        stmt: 'convenience sampling (acknowledged as a limitation)' },
      { id: 'probability', t: 'Probability sampling (random, stratified)', for: ['people', 'texts'], fam: 'quant',
        d: 'Every unit has a known chance of selection; needed for statistical generalisation in surveys and quantitative content analysis.',
        stmt: 'probability sampling, to support statistical generalisation' }
    ],

    /* ---------- Data collection ---------- */
    collection: [
      { id: 'semi', t: 'Semi-structured interviews', unit: 'people', kind: 'generated', fam: 'qual',
        d: 'A guide of open questions with flexibility to follow up. The most common method for viewers’ and practitioners’ perspectives.',
        stmt: 'semi-structured interviews' },
      { id: 'indepth', t: 'In-depth (unstructured or narrative) interviews', unit: 'people', kind: 'generated', fam: 'qual',
        d: 'Long, open conversations led by the participant’s account; suited to phenomenology and narrative inquiry.',
        stmt: 'in-depth interviews' },
      { id: 'focus', t: 'Focus groups', unit: 'people', kind: 'generated', fam: 'qual',
        d: 'Group discussions that show how meanings are negotiated among viewers; well established in audience research.',
        stmt: 'focus groups' },
      { id: 'observation', t: 'Observation (participant or non-participant)', unit: 'people', kind: 'generated', fam: 'qual',
        d: 'Watching practices as they happen — on set, in a writers’ room, during family viewing — with field notes.',
        stmt: 'observation with field notes' },
      { id: 'online-obs', t: 'Digital ethnography (online observation)', unit: 'online', kind: 'existing', fam: 'qual',
        d: 'Systematic observation and collection of online interactions such as fan threads and comment sections.',
        stmt: 'online observation of digital interactions' },
      { id: 'documents', t: 'Document analysis', unit: 'docs', kind: 'existing', fam: 'qual',
        d: 'Scripts, policies, press coverage, reviews, festival catalogues and archives as data.',
        stmt: 'collection of relevant documents' },
      { id: 'av-texts', t: 'Audiovisual text collection (corpus)', unit: 'texts', kind: 'existing', fam: 'any',
        d: 'Assembling the films, episodes or programmes to be studied, with a record of versions, sources and access dates.',
        stmt: 'assembly of a defined corpus of audiovisual texts' },
      { id: 'scenes', t: 'Film and television scene selection', unit: 'texts', kind: 'existing', fam: 'qual',
        d: 'Selecting the scenes or sequences for close analysis with explicit criteria (e.g. every scene in which the father makes a decision).',
        stmt: 'selection of scenes or sequences according to explicit criteria' },
      { id: 'coding-frame', t: 'Content analysis procedures (sampling units and coding frame)', unit: 'texts', kind: 'existing', fam: 'any',
        d: 'Defining units of analysis and a coding frame or codebook before coding the corpus (Schreier, 2012).',
        stmt: 'definition of units of analysis and a coding frame for the corpus' },
      { id: 'survey-q', t: 'Survey questionnaire', unit: 'people', kind: 'generated', fam: 'quant',
        d: 'Standardised questions and scales, usually online; appropriate for quantitative and mixed-methods designs.',
        stmt: 'a structured questionnaire' }
    ],

    /* ---------- Data analysis ---------- */
    analysis: [
      { id: 'rta', t: 'Reflexive thematic analysis', needs: ['people', 'online', 'docs'], fam: 'qual', coding: true,
        d: 'Identifies patterns of shared meaning across a dataset through six recursive phases; the researcher’s subjectivity is a resource, not a bias to remove (Braun & Clarke, 2006, 2019).',
        stmt: 'reflexive thematic analysis (Braun & Clarke, 2019), moving recursively through familiarisation, coding, theme generation, review, definition and writing' },
      { id: 'qca', t: 'Qualitative content analysis', needs: ['people', 'texts', 'online', 'docs'], fam: 'qual', coding: true,
        d: 'Systematically describes the meaning of material with a coding frame, which may be concept-driven (deductive) or data-driven (inductive) (Hsieh & Shannon, 2005; Schreier, 2012).',
        stmt: 'qualitative content analysis with a coding frame (Schreier, 2012)' },
      { id: 'narr-an', t: 'Narrative analysis', needs: ['people', 'texts', 'docs'], fam: 'qual', coding: false,
        d: 'Analyses how stories are structured — events, sequence, characters, turning points, point of view — in interviews or in films and series.',
        stmt: 'narrative analysis of structure, sequence and point of view' },
      { id: 'discourse', t: 'Discourse analysis (including critical discourse analysis)', needs: ['people', 'texts', 'online', 'docs'], fam: 'qual', coding: false,
        d: 'Examines how language and images construct objects, identities and power relations; critical discourse analysis links texts to social practice (Fairclough, 2013).',
        stmt: 'discourse analysis of how language and images construct identities and relations of power' },
      { id: 'semiotic', t: 'Semiotic analysis', needs: ['texts', 'online', 'docs'], fam: 'qual', coding: false,
        d: 'Reads signs and codes — denotation, connotation, myth — in images, sounds and editing, drawing on Barthes’s concepts (Chandler, 2022).',
        stmt: 'semiotic analysis of signs, codes and connotations' },
      { id: 'film-text', t: 'Film and television textual (formal) analysis', needs: ['texts'], fam: 'qual', coding: false,
        d: 'Close analysis of form and style — cinematography, editing, mise-en-scène, sound and narration — and how they create meaning and effect (Bordwell et al., 2020). Interpretive, not a coding procedure.',
        stmt: 'close textual analysis of film and television form and style' },
      { id: 'comparative-an', t: 'Comparative analysis', needs: ['people', 'texts', 'docs', 'online'], fam: 'any', coding: false,
        d: 'Systematic comparison across cases, versions, periods or groups on the same dimensions.',
        stmt: 'systematic comparison across cases on the same analytical dimensions' },
      { id: 'reception', t: 'Reception analysis', needs: ['people', 'online'], fam: 'qual', coding: false,
        d: 'Analyses how audiences decode texts — preferred, negotiated or oppositional readings (Hall, 1980) — by relating their interpretations to the texts.',
        stmt: 'reception analysis relating viewers’ interpretations to the texts (Hall, 1980)' },
      { id: 'stats', t: 'Statistical analysis', needs: ['people', 'texts', 'online'], fam: 'quant', coding: false,
        d: 'Descriptive and inferential statistics for survey or coded content data (e.g. frequencies, chi-square, correlation, regression).',
        stmt: 'statistical analysis (descriptive and inferential)' },
      { id: 'integration', t: 'Mixed-methods integration procedures', needs: ['people', 'texts', 'online', 'docs'], fam: 'mixed', coding: false,
        d: 'Connecting the strands through merging, explaining or building, for example with joint displays, and drawing meta-inferences (Fetters et al., 2013).',
        stmt: 'integration of the strands through joint displays and meta-inferences (Fetters et al., 2013)' }
    ],
    filmDims: [
      { id: 'cinematography', t: 'Cinematography', d: 'Framing, shot scale, angle, camera movement, lighting, colour.' },
      { id: 'editing', t: 'Editing', d: 'Continuity, rhythm, cutting patterns, montage, point-of-view structures.' },
      { id: 'mise', t: 'Mise-en-scène', d: 'Setting, costume, props, performance, staging and composition.' },
      { id: 'sound', t: 'Sound', d: 'Dialogue, music, effects, silence; diegetic and non-diegetic sound.' },
      { id: 'narrative-str', t: 'Narrative structure', d: 'Plot and story, time, causality, point of view, serial structure across episodes.' },
      { id: 'character', t: 'Character representation', d: 'How characters are introduced, positioned, given agency and judged.' },
      { id: 'ideology', t: 'Cultural and ideological meanings', d: 'Values, norms and power relations that the text supports, questions or negotiates.' }
    ],

    /* ---------- Ethics & quality ---------- */
    ethics: [
      { id: 'consent', t: 'Informed consent', for: ['people'], d: 'Participants receive clear information and agree freely; they can withdraw.', stmt: 'Participants will receive an information sheet and give informed consent before taking part, and may withdraw at any time without consequence.' },
      { id: 'confid', t: 'Confidentiality and anonymisation', for: ['people', 'online'], d: 'Pseudonyms; removal of identifying details; care with quotations that can be searched.', stmt: 'Identities will be protected through pseudonyms and the removal of identifying details from transcripts and quotations.' },
      { id: 'protection', t: 'Data protection', for: ['people', 'online'], d: 'Collect only what is needed; comply with applicable data protection rules and institutional policy.', stmt: 'Only data necessary for the research questions will be collected, in line with institutional policy and applicable data protection regulations.' },
      { id: 'storage', t: 'Secure data storage', for: ['people', 'online', 'docs', 'texts'], d: 'Encrypted storage, restricted access, defined retention and deletion.', stmt: 'Recordings and data files will be stored securely with restricted access, and retained and deleted according to institutional requirements.' },
      { id: 'copyright', t: 'Copyright and use of audiovisual material', for: ['texts', 'online'], d: 'Use legally obtained copies; reproduce stills or clips only as permitted for criticism and research, with attribution.', stmt: 'Audiovisual texts will be accessed through legal sources, and any stills or excerpts reproduced will be limited to what is necessary for analysis, with full attribution, in line with applicable copyright provisions.' },
      { id: 'online-ethics', t: 'Ethics of online data', for: ['online'], d: 'Consider users’ expectations of privacy, vulnerability and traceability of quotations (franzke et al., 2020).', stmt: 'Online material will be treated according to the AoIR ethical guidelines, considering users’ expectations of privacy and avoiding traceable verbatim quotations where appropriate (franzke et al., 2020).' },
      { id: 'approval', t: 'Formal ethics approval', for: ['people', 'online'], d: 'Approval from the institution’s research ethics committee before data collection.', stmt: 'Ethics approval will be obtained from the institutional research ethics committee before data collection begins.' },
      { id: 'wellbeing', t: 'Participant wellbeing and sensitive topics', for: ['people'], d: 'Plan for discomfort when discussing sensitive content; offer breaks, the right not to answer, and support information.', stmt: 'Because the topic may be sensitive, participants may decline any question or pause the session, and information about available support will be provided.' }
    ],
    quality: [
      { id: 'reflexivity', t: 'Researcher reflexivity', trad: ['qual', 'mixed'], d: 'Making the researcher’s position and its influence on the study visible, e.g. in a reflexive journal (Olmos-Vega et al., 2023).', stmt: 'researcher reflexivity, documented in a reflexive journal (Olmos-Vega et al., 2023)' },
      { id: 'thick', t: 'Thick description (transferability)', trad: ['qual', 'mixed'], d: 'Rich description of context, participants and texts so readers can judge transferability (Lincoln & Guba, 1985).', stmt: 'thick description of context and participants to support judgements of transferability' },
      { id: 'audit', t: 'Audit trail (dependability and confirmability)', trad: ['qual', 'mixed'], d: 'A record of decisions, codes, memos and versions that shows how findings were reached.', stmt: 'an audit trail of analytical decisions, supporting dependability and confirmability' },
      { id: 'member', t: 'Member reflections', trad: ['qual'], d: 'Sharing interpretations with participants to invite further insight — not to “verify” a single truth.', stmt: 'member reflections, inviting participants to comment on preliminary interpretations' },
      { id: 'peer', t: 'Peer debriefing or critical friend', trad: ['qual', 'mixed'], d: 'Discussing interpretations with a supervisor or peer to challenge assumptions.', stmt: 'peer debriefing with the supervisor to challenge interpretations' },
      { id: 'triang', t: 'Triangulation', trad: ['qual', 'mixed'], d: 'Using several data sources, methods or perspectives to gain a fuller picture (credibility).', stmt: 'triangulation of data sources to strengthen credibility' },
      { id: 'negative', t: 'Negative or deviant case analysis', trad: ['qual'], d: 'Seeking and explaining cases that do not fit the emerging interpretation.', stmt: 'analysis of negative cases that do not fit the emerging interpretation' },
      { id: 'icr', t: 'Inter-coder reliability', trad: ['quant', 'qca'], d: 'Two coders code a subsample and agreement is calculated (e.g. Krippendorff’s alpha). Essential in quantitative content analysis; not consistent with reflexive thematic analysis.', stmt: 'inter-coder reliability testing on a subsample (e.g. Krippendorff’s alpha)' },
      { id: 'pilot', t: 'Piloting instruments', trad: ['qual', 'quant', 'mixed'], d: 'Testing interview guides, questionnaires or codebooks before full data collection.', stmt: 'piloting of instruments before full data collection' },
      { id: 'validity', t: 'Validity and reliability of measures', trad: ['quant', 'mixed'], d: 'Using validated scales, checking internal consistency (e.g. Cronbach’s alpha) and construct validity.', stmt: 'validated measures with checks of reliability and validity' },
      { id: 'meta', t: 'Integration quality and meta-inferences', trad: ['mixed'], d: 'Explaining how the strands were integrated and how conclusions draw on both.', stmt: 'explicit integration procedures and meta-inferences drawing on both strands' },
      { id: 'transparency', t: 'Methodological transparency in reporting', trad: ['qual', 'quant', 'mixed'], d: 'Reporting decisions in enough detail for evaluation, guided by standards such as JARS-Qual or SRQR (Levitt et al., 2018; O’Brien et al., 2014).', stmt: 'transparent reporting of methodological decisions, guided by recognised reporting standards (Levitt et al., 2018)' }
    ],

    /* ---------- Rubric ---------- */
    rubric: [
      { id: 'problem', t: 'Alignment with the research problem', d: 'The methodology addresses the problem as stated.' },
      { id: 'questions', t: 'Consistency with research questions', d: 'Each question can be answered with the chosen data and analysis.' },
      { id: 'approach', t: 'Suitability of the research approach', d: 'The approach fits the nature of the questions and is justified.' },
      { id: 'design', t: 'Research design justification', d: 'The design fits the approach and its rationale is explained.' },
      { id: 'sampling', t: 'Sampling adequacy', d: 'The sample or corpus is relevant, defined by criteria and adequate for the aim.' },
      { id: 'collection', t: 'Data collection suitability', d: 'Methods produce the data the questions need.' },
      { id: 'analysis', t: 'Analytical coherence', d: 'Analysis fits the data, the design and the questions.' },
      { id: 'ethics', t: 'Ethical considerations', d: 'Safeguards match the kind of data and participants.' },
      { id: 'rigour', t: 'Methodological rigour', d: 'Quality procedures suit the research tradition.' },
      { id: 'feasibility', t: 'Feasibility and transparency', d: 'Access, time and limitations are realistic and openly stated.' }
    ],
    rubricRec: {
      problem: 'Restate the problem in two to four sentences and check that your objectives and questions use the same key concepts.',
      questions: 'Check each question against your data: a question about viewers needs participant data; a question about representation needs the texts.',
      approach: 'Strengthen the justification: explain why the nature of your questions calls for this approach, not only what the approach is.',
      design: 'Explain why this design rather than an alternative, and define its boundaries (the case, the phases or the corpus).',
      sampling: 'State inclusion criteria, the size or scope and how it will be judged adequate (e.g. information power), and the recruitment or selection route.',
      collection: 'Describe instruments and procedures in more detail (language, duration, recording, piloting) and connect each method to a question.',
      analysis: 'Name the analytical stages and explain how they lead from data to findings; for audiovisual texts, name the formal dimensions analysed.',
      ethics: 'Add the safeguards required for your data: consent and confidentiality for participants, copyright for audiovisual material, privacy for online data.',
      rigour: 'Choose quality procedures that belong to your tradition (e.g. reflexivity and thick description for interpretive work; inter-coder reliability for quantitative coding).',
      feasibility: 'State access arrangements and a realistic timeline, and write an honest limitations paragraph.'
    },
    levels: [
      { min: 4.5, t: 'Well-developed methodology', d: 'Coherent and well justified; refine the wording and discuss it with your supervisor.' },
      { min: 3.5, t: 'Sound with some gaps', d: 'The structure works; address the lower-rated criteria.' },
      { min: 2.5, t: 'Needs further development', d: 'Several decisions need clearer justification or better alignment.' },
      { min: 0, t: 'Early draft', d: 'Revisit the earlier steps, starting with the questions and the approach.' }
    ],

    /* ---------- Rule-based checks (quality checker) ---------- */
    chk: {
      problemQ: { t: 'Problem, questions and objectives present', ok: 'Problem, main question and objectives are stated.', bad: 'The problem, main question or objectives are missing.' },
      alignPQ: { t: 'Questions reflect the problem', ok: 'The main question shares key terms with the problem and objectives.', warn: 'The main question shares few key terms with the problem or objectives — check that they address the same issue.' },
      approachSet: { t: 'Approach chosen and justified', ok: 'An approach is chosen with a justification.', bad: 'No approach chosen yet.', warn: 'The justification is short — explain why the questions call for this approach.' },
      approachFit: { t: 'Approach fits the wording of the questions', ok: 'The wording of your questions is consistent with the chosen approach.', warn: 'The wording of your questions suggests a different approach (see Step 2). This may be fine — explain your choice.', info: 'The wording of your questions gives too few cues for a suggestion.' },
      paradigmFit: { t: 'Orientation consistent with the approach', ok: 'The orientation is consistent with the approach.', warn: 'This orientation is not usually paired with your approach — explain how you reconcile them.', info: 'No orientation chosen yet.' },
      designFit: { t: 'Design consistent with the approach', ok: 'The design belongs to your approach.', bad: 'This design does not belong to your approach — change one of them.', info: 'No design chosen yet.' },
      designWhy: { t: 'Design rationale', ok: 'The design rationale is developed.', warn: 'The design rationale is short or missing.' },
      mixedStrands: { t: 'Mixed methods: both strands and integration', ok: 'Both strands and an integration procedure are planned.', bad: 'A mixed-methods study needs a qualitative method, a quantitative method and an integration procedure.' },
      samplingSet: { t: 'Sampling strategy and criteria', ok: 'Strategy, inclusion criteria and size or scope are stated.', warn: 'Add the missing element: strategy, inclusion criteria or size/scope.' },
      theoretical: { t: 'Theoretical sampling used appropriately', ok: '—', warn: 'Theoretical sampling belongs to grounded theory; use purposive or criterion sampling for other designs.' },
      convenience: { t: 'Convenience sampling', warn: 'Convenience sampling is the weakest rationale; explain why it is unavoidable and treat it as a limitation.' },
      probQual: { t: 'Probability sampling in a qualitative study', info: 'Probability sampling is unusual in qualitative work, which seeks information-rich cases rather than statistical representativeness.' },
      unitsMatch: { t: 'Sample matches the collection methods', ok: 'What you sample matches how you collect data.', warn: 'Your collection methods involve material you have not listed in “What will you sample?” — align Steps 5 and 6.' },
      questionData: { t: 'Questions match the kind of data', ok: 'Your questions and data types are consistent.', warn: 'Your questions refer to viewers or practitioners, but no participant-based method is selected.', warn2: 'Your questions refer to texts or representation, but no audiovisual or document collection is selected.' },
      analysisFit: { t: 'Analysis fits the data', ok: 'Each analytical approach has suitable data.', warn: 'One or more analytical approaches lack suitable data (e.g. reception analysis without participant data; statistics without quantitative data).' },
      filmDims: { t: 'Dimensions of audiovisual analysis named', ok: 'Formal dimensions are named.', warn: 'You analyse audiovisual texts — name the formal dimensions (Step 7).' },
      ethicsPeople: { t: 'Safeguards for participants', ok: 'Consent, confidentiality and ethics approval are included.', bad: 'Participant-based research needs informed consent, confidentiality and formal ethics approval.' },
      ethicsTexts: { t: 'Copyright of audiovisual material', ok: 'Copyright and use of material are addressed.', warn: 'You analyse audiovisual texts — address copyright and the use of stills or clips.' },
      ethicsOnline: { t: 'Ethics of online data', ok: 'Online data ethics are addressed.', warn: 'You use online content — address users’ privacy expectations and traceable quotations.' },
      qualitySet: { t: 'Quality procedures selected', ok: 'Quality procedures are selected.', bad: 'No quality procedures selected yet.' },
      rtaIcr: { t: 'Quality criteria match the tradition', ok: 'Your quality procedures suit your tradition.', warn: 'Inter-coder reliability is not consistent with reflexive thematic analysis, which treats the researcher’s interpretation as a resource (Braun & Clarke, 2021). Consider reflexivity and peer debriefing instead.', warn2: 'Quantitative coding normally requires inter-coder reliability.', warn3: 'Mixed methods should explain integration quality and meta-inferences.' },
      gtTheory: { t: 'Theory in grounded theory', info: 'You named a theoretical framework and chose grounded theory: present the theory as sensitising concepts, not as a framework to test.' },
      limits: { t: 'Limitations stated', ok: 'Limitations are stated.', warn: 'Write a limitations paragraph (Step 9).' },
      procedure: { t: 'Procedures described', ok: 'Collection and analysis procedures are described.', warn: 'Describe the collection and analysis procedures in more detail.' }
    },
    statusLabel: { ok: 'Consistent', warn: 'Check', bad: 'Fix', info: 'Note' },

    /* ---------- Guides ---------- */
    guide: {
      ladder: [
        { t: 'Paradigm', d: 'Assumptions about reality and knowledge.', ex: 'Interpretivism' },
        { t: 'Approach', d: 'The broad type of research.', ex: 'Qualitative' },
        { t: 'Design', d: 'The logic of the whole study.', ex: 'Comparative case study' },
        { t: 'Data collection methods', d: 'How data are gathered.', ex: 'Focus groups; scene selection' },
        { t: 'Analytical techniques', d: 'How data are interpreted.', ex: 'Reflexive thematic analysis; formal analysis' }
      ],
      distinctions: [
        { t: 'Methodology is not method', d: 'Methodology is the reasoned strategy and its justification; methods are the specific techniques used within it.' },
        { t: 'Content analysis and thematic analysis are analytical techniques', d: 'They are not designs. They are used within a design such as a case study or a survey.' },
        { t: 'Case study, phenomenology, ethnography and grounded theory are designs or traditions', d: 'Each brings its own logic of sampling, data and quality. Grounded theory and phenomenology also have their own analytical procedures.' },
        { t: 'Reception and audience research is a field of inquiry', d: 'It can be qualitative (interviews, focus groups), quantitative (surveys) or mixed.' },
        { t: 'Film textual analysis is a tradition of close reading', d: 'It is interpretive analysis of form and meaning, not a coding procedure.' }
      ],
      compareRows: [
        { k: 'purpose', t: 'Purpose' }, { k: 'data', t: 'Typical data' }, { k: 'logic', t: 'Logic' }, { k: 'outcome', t: 'Outcome' },
        { k: 'strengths', t: 'Strengths' }, { k: 'limits', t: 'Limitations' }, { k: 'ftv', t: 'Film and TV example' }
      ],
      selector: [
        { id: 'purpose', q: 'What is the main purpose of your study?', o: [
          { id: 'a', t: 'To explore meanings, experiences or interpretations', w: { qual: 2 } },
          { id: 'b', t: 'To analyse films or programmes closely', w: { qual: 2 } },
          { id: 'c', t: 'To measure how many, how often or how strongly', w: { quant: 2 } },
          { id: 'd', t: 'To combine measured patterns with an explanation of meaning', w: { mixed: 2 } } ] },
        { id: 'data', q: 'What kind of data would answer your question?', o: [
          { id: 'a', t: 'Words, images and audiovisual material, interpreted', w: { qual: 2 } },
          { id: 'b', t: 'Numbers: scales, counts, ratings', w: { quant: 2 } },
          { id: 'c', t: 'Both', w: { mixed: 2 } } ] },
        { id: 'general', q: 'Do you need to generalise statistically to a population?', o: [
          { id: 'a', t: 'Yes', w: { quant: 2, mixed: 1 } },
          { id: 'b', t: 'No — depth and transferability matter more', w: { qual: 2 } },
          { id: 'c', t: 'Partly — breadth plus depth', w: { mixed: 2 } } ] },
        { id: 'known', q: 'How much is already known about your topic?', o: [
          { id: 'a', t: 'Little — it is new or under-studied', w: { qual: 1, mixed: 1 }, design: 'expl-seq-x' },
          { id: 'b', t: 'A lot — the variables are well defined', w: { quant: 1 } },
          { id: 'c', t: 'Patterns are known but not explained', w: { mixed: 2 }, design: 'expl-seq' } ] },
        { id: 'skills', q: 'Which skills and resources do you have?', o: [
          { id: 'a', t: 'Qualitative skills and limited time', w: { qual: 1 } },
          { id: 'b', t: 'Statistical training and access to a large sample', w: { quant: 1 } },
          { id: 'c', t: 'Both, and enough time for two strands', w: { mixed: 1 } } ] }
      ],
      selectorNote: 'This is a reflection aid based on your answers. The approach must still be justified by your research questions.',
      adequacy: [
        { h: 'Information power', t: 'The more information the sample holds for the aim, the fewer participants are needed. It depends on a narrow or broad aim, sample specificity, use of established theory, quality of dialogue and analysis strategy (Malterud et al., 2016).' },
        { h: 'Saturation', t: 'Saturation (no new codes or themes) fits grounded theory and some content analysis. Empirical studies suggest many interview studies reach it within roughly 9–17 interviews, depending on the study (Hennink & Kaiser, 2022). It does not fit reflexive thematic analysis, where meaning is generated, not exhausted (Braun & Clarke, 2021).' },
        { h: 'Case and corpus scope', t: 'For texts, justify the period, the platforms and the selection rule, and say whether the corpus is complete (all texts meeting the criteria) or a selection. For scenes, explain why these scenes are analytically significant.' },
        { h: 'Quantitative samples', t: 'Surveys and quantitative content analysis need sample sizes justified by the analysis planned (e.g. power analysis) and a sampling frame; non-probability samples limit generalisation.' }
      ],
      collectNote: 'Existing material (films, episodes, scripts, online posts, documents) is collected and documented; generated data (interviews, focus groups, surveys, observation) is produced with participants and needs consent, recording and transcription procedures.',
      filmNote: 'Formal analysis of film and television does not usually involve coding. It moves between description of form and interpretation of meaning, guided by an explicit theoretical lens. Combine it with coding only when the question requires systematic patterns across many texts.'
    },

    /* ---------- Hypothetical teaching examples ---------- */
    examples: [
      { area: 'Audience reception studies',
        rq: 'How do young Saudi women interpret the portrayal of family authority in Gulf dramas streamed on Shahid?',
        approach: 'Qualitative; interpretivist.', design: 'Reception study within a qualitative design.',
        data: 'Six focus groups (5–7 participants each) after viewing selected episodes; short individual follow-up interviews.',
        sampling: 'Purposive, maximum variation by age and region; inclusion — women aged 18–30 who watch Gulf drama.',
        analysis: 'Reflexive thematic analysis related to the episodes through Hall’s encoding/decoding model.',
        quality: 'Reflexive journal; thick description; peer debriefing.' },
      { area: 'Semiotic film analysis',
        rq: 'How do recent Saudi films signify female independence through objects and spaces?',
        approach: 'Qualitative; no single named paradigm (semiotic framework).', design: 'Interpretive textual study.',
        data: 'Corpus of six feature films (2019–2024); scenes in which the female lead enters a new space.',
        sampling: 'Criterion selection of films and scenes.',
        analysis: 'Semiotic analysis of denotation, connotation and myth, supported by formal analysis of framing and mise-en-scène.',
        quality: 'Explicit selection criteria; transparent interpretive steps; peer debriefing.' },
      { area: 'Feminist film criticism',
        rq: 'How is the female gaze constructed in films by Saudi women directors?',
        approach: 'Qualitative; critical (feminist).', design: 'Interpretive textual study with a comparative element.',
        data: 'Films by four directors; director interviews published in the press as supporting documents.',
        sampling: 'Purposive selection of directors and films; criterion selection of point-of-view sequences.',
        analysis: 'Formal analysis of point of view, framing and editing, interpreted through feminist film theory.',
        quality: 'Reflexivity about the researcher’s standpoint; negative case analysis.' },
      { area: 'Cultural representation studies',
        rq: 'How frequently and in what roles do non-Arab characters appear in Saudi Ramadan series, and how are they portrayed?',
        approach: 'Mixed methods; pragmatist.', design: 'Explanatory sequential: quantitative content analysis, then qualitative analysis of selected scenes.',
        data: 'All episodes of 2023 Ramadan series (quantitative phase); key scenes (qualitative phase).',
        sampling: 'Census of series meeting criteria; purposive selection of scenes from the quantitative results.',
        analysis: 'Descriptive statistics and chi-square; discourse analysis of scenes; joint display.',
        quality: 'Inter-coder reliability for the codebook; reflexivity for the qualitative phase; meta-inferences.' },
      { area: 'Television drama analysis',
        rq: 'How does serial narrative structure sustain moral ambiguity in a Saudi crime series?',
        approach: 'Qualitative.', design: 'Single case study of one series.',
        data: 'All episodes of one season; production interviews published by the platform.',
        sampling: 'Revelatory case; episodes selected by narrative turning points.',
        analysis: 'Narrative analysis of serial structure combined with formal analysis.',
        quality: 'Detailed episode log as an audit trail; thick description.' },
      { area: 'Streaming platform research',
        rq: 'How do Saudi subscribers choose between regional and global streaming platforms?',
        approach: 'Mixed methods; pragmatist.', design: 'Convergent design.',
        data: 'Online survey of platform use (N ≈ 300) and twelve interviews on choice.',
        sampling: 'Non-probability survey sample (limitation stated); purposive interview sample.',
        analysis: 'Descriptive and inferential statistics; reflexive thematic analysis; merging in a joint display.',
        quality: 'Validated scales; piloting; integration and meta-inferences.' },
      { area: 'Audiovisual production studies',
        rq: 'How do Saudi production companies adapt their practices to commissioning by streaming platforms?',
        approach: 'Qualitative; constructivist.', design: 'Grounded theory.',
        data: 'Interviews with producers, writers and commissioners; contracts and briefs where available.',
        sampling: 'Initial purposive sampling, then theoretical sampling.',
        analysis: 'Constructivist grounded theory coding, memo writing and constant comparison (Charmaz, 2014).',
        quality: 'Memos as audit trail; theoretical saturation; member reflections.' }
    ],

    /* ---------- Verified published examples ---------- */
    published: [
      { area: 'Audience reception studies', ref: 'Alardawi, Bajnaid & Brereton (2021)',
        rq: 'The influence of Turkish drama on the socio-cultural values of Saudi women.',
        design: 'Qualitative study.', data: 'Semi-structured interviews with eight Saudi women aged 18–40 who watch Turkish drama.',
        analysis: 'Thematic analysis.', lesson: 'A small, purposive sample suits a question about how viewers interpret values.' },
      { area: 'Audience reception studies', ref: 'Alardawi & Brereton (2024)',
        rq: 'Pleasure and consumption of the Korean drama Squid Game among young Saudi audiences.',
        design: 'Mixed methods in two stages.', data: 'A preliminary online survey (N = 50) of Saudi youths aged 18–21, followed by online focus groups with 23 participants.',
        analysis: 'Survey results informed the focus groups, which were analysed qualitatively.', lesson: 'A survey first, then focus groups that explain it — the logic of an explanatory sequential design.' },
      { area: 'Streaming platform research', ref: 'Berg, Alardawi & Al Obeidli (2025)',
        rq: 'How university students in Qatar, the UAE and Saudi Arabia engage with Turkish serials made as streaming originals.',
        design: 'Qualitative focus group study.', data: 'Ten focus groups per country (five male, five female), four to eight students each, in person or on Zoom; recruitment through personal networks and snowball sampling.',
        analysis: 'Thematic analysis using Braun and Clarke’s framework, with manual coding.', lesson: 'Gender-separated groups and mixed modes show how cultural context shapes data collection.' },
      { area: 'Streaming platform research', ref: 'Bengesser, Esser & Steemers (2022)',
        rq: 'Designing, piloting and refining a methodology for transnational audiences of British screen content.',
        design: 'Mixed methods, piloted in Denmark in 2020.', data: 'A survey combined with interviews, digital diaries and tasks.',
        analysis: 'Five integrated research steps connecting the strands.', lesson: 'Piloting a mixed-methods design and reporting its revisions is itself a methodological contribution.' },
      { area: 'Audience reception studies', ref: 'Merrington et al. (2019)',
        rq: 'Film audiences across regions of the UK.',
        design: 'Mixed methods.', data: 'Surveys, interviews, focus groups and document analysis.',
        analysis: 'A data model and computational ontology to integrate different kinds of data.', lesson: 'Large mixed-methods projects need an explicit plan for organising and integrating data.' },
      { area: 'Cultural representation studies', ref: 'Alardawi, Saqah & Zakari (2023)',
        rq: 'The representation of women in the Saudi film Amra and the Second Marriage.',
        design: 'Mixed methods applied to a film text.', data: 'The film.',
        analysis: 'Quantitative and qualitative content analysis combined.', lesson: 'Counting and interpretation can be combined within one textual study.' },
      { area: 'Cultural representation studies', ref: 'Żerebecki et al. (2024)',
        rq: 'How to measure successful minority representation on television.',
        design: 'Quantitative content analysis.', data: 'Television content coded with a purpose-built codebook.',
        analysis: 'Quantitative coding of representation features.', lesson: 'A codebook grounded in prior audience research makes representation measurable.' },
      { area: 'Television drama analysis', ref: 'Alardawi & Brereton (2024)',
        rq: 'Arabic script television formats between adaptation and cultural identity: The Killing.',
        design: 'Comparative qualitative case study.', data: 'The original series and its Arabic adaptation.',
        analysis: 'Thematic content analysis comparing the two versions.', lesson: 'A comparative case study needs the same dimensions applied to both versions.' },
      { area: 'Audiovisual production studies', ref: 'Alardawi (2024)',
        rq: 'Challenges and opportunities for Saudi podcasters.',
        design: 'Qualitative study.', data: 'In-depth interviews with Saudi podcasters and pioneers of the field.',
        analysis: 'Thematic analysis.', lesson: 'Practitioner interviews give access to production knowledge not visible in texts.' },
      { area: 'Audiovisual production studies', ref: 'Borish et al. (2021)',
        rq: 'Documentary film as a strategy for qualitative inquiry.',
        design: 'Community-based, participatory documentary research.', data: 'Filmed interviews in place and during activities.',
        analysis: 'Analysis of qualitative video data with video-editing software.', lesson: 'Filmmaking can be a method of data collection, analysis and dissemination.' }
    ],

    /* ---------- Lexicon for rule-based checks ---------- */
    lex: {
      qual: ['how do', 'how does', 'how are', 'how is', 'why', 'experience', 'meaning', 'interpret', 'perceive', 'perception', 'construct', 'negotiat', 'represent', 'portray', 'explore', 'understand', 'narrat', 'identity', 'discourse', 'make sense', 'describe'],
      quant: ['how many', 'how often', 'to what extent', 'extent', 'relationship', 'correlat', 'effect of', 'predict', 'difference', 'differ', 'frequency', 'proportion', 'percentage', 'level of', 'measure', 'significant', 'prevalence', 'associated', 'association'],
      mixed: ['and explain', 'followed by', 'both', 'patterns and', 'in depth and', 'breadth', 'integrat'],
      people: ['viewer', 'audience', 'spectator', 'fan', 'user', 'student', 'participant', 'women', 'men', 'youth', 'young', 'parent', 'producer', 'director', 'writer', 'practitioner', 'professional', 'creator', 'podcaster', 'subscriber', 'critic'],
      texts: ['film', 'series', 'episode', 'drama', 'scene', 'representation', 'portray', 'depict', 'narrative', 'character', 'programme', 'program', 'movie', 'documentar', 'sequence', 'genre', 'adaptation', 'cinematograph', 'mise-en-sc'],
      just: ['because', 'since', 'as it', 'therefore', 'in order to', 'allows', 'allow', 'enables', 'suited', 'suitable', 'appropriate', 'given', 'so that'],
      vague: ['etc', 'various', 'and so on', 'many things', 'different aspects', 'some aspects', 'a lot of'],
      stop: ['the', 'and', 'of', 'in', 'on', 'for', 'to', 'a', 'an', 'how', 'what', 'why', 'do', 'does', 'is', 'are', 'with', 'by', 'their', 'its', 'this', 'that', 'from', 'as', 'at', 'among', 'study', 'research', 'which', 'who']
    },

    /* ---------- Draft templates (Step 9) ---------- */
    tpl: {
      overview(st, L) {
        const s = st.s1, rows = [];
        if (s.title) rows.push('Working title: ' + s.title);
        if (s.mainQ) rows.push('Main question: ' + s.mainQ);
        const sq = (s.subQs || '').split('\n').filter((x) => x.trim()).length;
        const ob = (s.objectives || '').split('\n').filter((x) => x.trim()).length;
        rows.push('Supporting questions: ' + sq + ' · Objectives: ' + ob);
        rows.push('Theoretical framework: ' + (s.theory ? s.theory : 'not stated (acceptable for inductive designs)'));
        if (s.scope) rows.push('Context and scope: ' + s.scope);
        const needs = [];
        if (L.needsPeople) needs.push('participant data (viewers, students or practitioners)');
        if (L.needsTexts) needs.push('audiovisual texts or documents');
        rows.push('Your questions point to: ' + (needs.length ? list(needs) : 'no clear data type yet — make the object of study explicit'));
        return rows.join('\n');
      },
      approachOut(st, L) {
        if (!L.approach) return 'Choose an approach above.';
        return L.approach.t + (st.s2.just ? ' — ' + st.s2.just : ' — add your justification.');
      },
      paradigmOut(st, L) { return L.paradigm ? L.paradigm.stmt : 'Choose an orientation above.'; },
      designOut(st, L) { return L.design ? L.design.t + ': ' + L.design.stmt + (st.s4.rationale ? ' ' + st.s4.rationale : '') : 'Choose a design above.'; },
      samplingOut(st, L) {
        if (!L.sampling.length) return 'Choose at least one strategy.';
        return 'Strategy: ' + list(L.sampling.map((x) => lc(x.t))) + '. Size or scope: ' + fill(st.s5.size, 'add size or scope') + '.';
      },
      collectionOut(st, L) {
        if (!L.collection.length) return 'Choose at least one method.';
        const ex = L.collection.filter((x) => x.kind === 'existing').map((x) => lc(x.t));
        const gen = L.collection.filter((x) => x.kind === 'generated').map((x) => lc(x.t));
        return (ex.length ? 'Existing material: ' + list(ex) + '. ' : '') + (gen.length ? 'Data generated with participants: ' + list(gen) + '.' : '');
      },
      analysisOut(st, L) { return L.analysis.length ? 'Analysis: ' + list(L.analysis.map((x) => lc(x.t))) + (L.dims.length ? '. Dimensions: ' + list(L.dims.map((x) => lc(x.t))) : '') + '.' : 'Choose at least one approach.'; },
      ethicsOut(st, L) { return (L.ethics.length ? 'Ethics: ' + list(L.ethics.map((x) => lc(x.t))) + '. ' : '') + (L.quality.length ? 'Quality: ' + list(L.quality.map((x) => lc(x.t))) + '.' : ''); },

      draft(st, L) {
        const s1 = st.s1, out = [];
        out.push({ h: '1. Research approach', p: L.approach ? 'This study adopts a ' + lc(L.approach.t).replace(' research', '') + ' approach. ' + L.approach.stmt + ' ' + end(fill(st.s2.just, 'add your justification for the approach')) : '[Choose a research approach in Step 2.]' });
        out.push({ h: '2. Methodological orientation', p: L.paradigm ? L.paradigm.stmt + (st.s3.note ? ' ' + end(st.s3.note) : '') : '[Choose an orientation in Step 3.]' });
        out.push({ h: '3. Research design', p: L.design ? 'The study uses ' + designPhrase(L.design.t) + '. ' + L.design.stmt + ' ' + end(fill(st.s4.rationale, 'add the design rationale')) : '[Choose a design in Step 4.]' });
        const sq = (s1.subQs || '').split('\n').map((x) => x.trim()).filter(Boolean);
        out.push({ h: '4. Study context', p: 'The study is situated in ' + end(fill(s1.scope, 'add the research context and scope')) + ' It addresses the main question: ' + fill(s1.mainQ, 'add the main question') + (sq.length ? ' Supporting questions are: ' + sq.join(' ') : '') + (s1.theory ? ' The analysis is informed by ' + end(s1.theory) : '') });
        const units = L.units.map((x) => lc(x.t.replace(/ \(.*\)$/, '')));
        out.push({ h: '5. Sampling and case selection', p: L.sampling.length ? 'The study will draw on ' + (units.length ? list(units) : '[state what will be sampled]') + ', selected through ' + list(L.sampling.map((x) => x.stmt)) + '. Inclusion criteria: ' + end(fill(st.s5.include, 'add inclusion criteria')) + (st.s5.exclude ? ' Exclusion criteria: ' + end(st.s5.exclude) : '') + ' The proposed sample or scope is ' + end(fill(st.s5.size, 'add size or scope')) + ' Recruitment or selection: ' + end(fill(st.s5.procedure, 'add the procedure')) + ' ' + end(fill(st.s5.rationale, 'explain why these participants, cases or texts are relevant')) + ' ' + L.adequacy + (st.s5.access ? ' Access and feasibility: ' + end(st.s5.access) : '') : '[Choose sampling strategies in Step 5.]' });
        const ex = L.collection.filter((x) => x.kind === 'existing').map((x) => x.stmt);
        const gen = L.collection.filter((x) => x.kind === 'generated').map((x) => x.stmt);
        out.push({ h: '6. Data collection', p: L.collection.length ? (ex.length ? 'Existing material will be gathered through ' + list(ex) + '. ' : '') + (gen.length ? 'Data will be generated with participants through ' + list(gen) + '. ' : '') + (st.s6.instruments ? 'Instruments: ' + end(st.s6.instruments) + ' ' : '') + end(fill(st.s6.procedure, 'describe the collection procedure')) : '[Choose data collection methods in Step 6.]' });
        out.push({ h: '7. Data analysis', p: L.analysis.length ? 'The data will be analysed through ' + list(L.analysis.map((x) => x.stmt)) + '. ' + (L.dims.length ? 'The audiovisual analysis will attend to ' + list(L.dims.map((x) => lc(x.t))) + '. ' : '') + end(fill(st.s7.procedure, 'describe the analysis procedure')) + (st.s7.software ? ' Tools: ' + end(st.s7.software) : '') : '[Choose analytical approaches in Step 7.]' });
        out.push({ h: '8. Ethical considerations', p: L.ethics.length ? L.ethics.map((x) => x.stmt).join(' ') + (st.s8.notes ? ' ' + end(st.s8.notes) : '') : '[Choose ethical considerations in Step 8.]' });
        out.push({ h: '9. Methodological quality', p: L.quality.length ? 'Quality will be supported through ' + list(L.quality.map((x) => x.stmt)) + '. ' + L.qualityFrame : '[Choose quality procedures in Step 8.]' });
        out.push({ h: '10. Limitations and methodological justification', p: end(fill(st.s9.limits, 'state the limitations and why the design remains appropriate')) + ' ' + L.limitNote });
        return out;
      },
      adequacy(design, approach) {
        if (approach === 'quant') return 'Sample size will be justified by the planned statistical analysis and the sampling frame.';
        if (design === 'grounded') return 'Data collection will continue until theoretical saturation, when new data no longer develop the categories.';
        if (design === 'case' || design === 'comparative' || design === 'textual') return 'The boundaries of the case or corpus are defined by the criteria above.';
        return 'Sample adequacy will be judged by information power — the relevance of the information the sample holds for the aim — rather than a fixed number (Malterud et al., 2016).';
      },
      qualityFrame(approach) {
        return approach === 'quant' ? 'These procedures address validity and reliability.'
          : approach === 'mixed' ? 'Each strand is judged by its own criteria, and the integration by the coherence of the meta-inferences.'
            : 'These procedures address credibility, transferability, dependability and confirmability (Lincoln & Guba, 1985).';
      },
      limitNote(approach) {
        return approach === 'quant' ? 'Findings apply to the population sampled and depend on the validity of the measures.'
          : approach === 'mixed' ? 'The limitations of each strand are partly offset by the other, but integration depends on the comparability of the data.'
            : 'The aim is analytical insight and transferability rather than statistical generalisation.';
      },
      bracketPrompt: 'Complete the bracketed prompts.'
    },

    /* ---------- Draft refinement messages ---------- */
    refine: {
      brackets: (n) => n + ' bracketed prompt' + (n === 1 ? '' : 's') + ' still to complete.',
      short: (h) => '“' + h + '” is very short — add detail or justification.',
      noJust: (h) => '“' + h + '” describes what you will do but not why — add a justification (e.g. “because…”, “this allows…”).',
      vague: (w) => 'Replace vague wording (' + w + ') with specific terms.',
      ok: 'No issues detected by the rules. Read the draft aloud and check it with your supervisor.',
      edited: 'You have edited the draft. Suggestions are based on your edited text.'
    },

    /* ---------- Interface text ---------- */
    ui: {
      next: 'Next step', prev: 'Previous step', finish: 'Go to evaluation',
      stepOf: (a, b) => 'Step ' + a + ' of ' + b,
      notSaved: 'Not saved yet', savedAt: (t) => 'Saved on this device at ' + t,
      required: 'This field is required.', tooShort: (n) => 'Please write at least ' + n + ' words.', chooseOne: 'Please choose an option.',
      fixErrors: 'Some required entries are missing. Please complete the highlighted fields.',
      empty: '—', words: (n) => n + (n === 1 ? ' word' : ' words'),
      restored: 'Your saved progress has been restored.',
      suggestion: 'Suggestion from the wording of your questions',
      suggestTitle: { qual: 'Qualitative', quant: 'Quantitative', mixed: 'Mixed methods', unclear: 'No clear suggestion' },
      conf: { low: 'low confidence', moderate: 'moderate confidence' },
      cues: { qual: 'Qualitative cues', quant: 'Quantitative cues', mixed: 'Mixed-methods cues', none: 'none found' },
      suggestNote: 'Based only on the wording of your problem, questions and objectives. Your context, field norms and resources also matter.',
      fitBad: 'Not usually used with your approach', recommended: 'Recommended for your choices',
      showAll: 'Show all designs', showFit: 'Show only designs for my approach',
      strengths: 'Strengths', limits: 'Limitations', when: 'When to use', example: 'Film and TV example', data: 'Typical data', caution: 'Watch out',
      kindExisting: 'Existing material', kindGenerated: 'Generated with participants',
      collectSummary: (e, g) => 'Existing material: ' + e + ' · Generated with participants: ' + g,
      dimsHint: 'Select the formal dimensions you will analyse.',
      draftTitle: 'Draft methodology section', regen: 'Rebuild draft from my entries', regenConfirm: 'Replace my edits? Click again',
      regenerated: 'The draft has been rebuilt from your entries.', copyDraft: 'Copy draft',
      refineTitle: 'Refinement suggestions',
      suggestedScore: 'Suggested:', applyScores: 'Apply suggested scores', scoresApplied: 'Suggested scores applied. Adjust them as you see fit.',
      overall: 'Overall educational assessment', outOf5: 'out of 5', notRated: 'Rate the criteria to see the assessment.',
      recommendations: 'Recommendations for refinement', noRecs: 'No criterion is rated 3 or below.',
      evalDisclaimer: 'This self-evaluation is an educational aid. It does not replace academic supervision, expert methodological review or formal ethics approval.',
      report: {
        title: 'Research Methodology Report', generated: (d) => 'Generated on ' + d + ' with the Research Methodology Formulation and Refinement tool (Dr. Merfat Alardawi).',
        titleProblem: 'Research title and problem', qo: 'Research questions and objectives', mainQ: 'Main question', subQs: 'Supporting questions', objectives: 'Objectives', theory: 'Theoretical framework',
        approach: 'Proposed methodological approach', orientation: 'Orientation', design: 'Research design', sampling: 'Sampling plan', collection: 'Data collection procedures', analysis: 'Data analysis strategy',
        ethics: 'Ethical considerations', quality: 'Methodological quality criteria', draft: 'Draft methodology statement', evaluation: 'Evaluation results', recs: 'Recommended improvements', noRecs: 'No specific recommendations from the rubric or the rule-based checks.',
        checks: 'Rule-based consistency checks'
      },
      reportRegen: 'Rebuild report', reportCopy: 'Copy report', print: 'Print', doc: 'Download Word (.doc)', txt: 'Download text (.txt)',
      copied: 'Copied to the clipboard.', copyFail: 'Copying failed — select the text and copy it manually.',
      fileReport: 'research-methodology-report', fileData: 'research-methodology-data.json',
      exportData: 'Export my data (JSON)', importData: 'Import data', deleteData: 'Delete my saved data', deleteConfirm: 'Delete everything? Click again',
      deleted: 'Your saved data has been deleted.', imported: 'Your data has been imported.', importFail: 'This file could not be imported.',
      loaded: 'Loaded from the Builder.', yes: 'Yes', no: 'No',
      selectorResult: 'Suggested approach', selectorDesigns: 'Designs to consider', selectorPick: 'Answer the questions to see a suggestion.', useInBuilder: 'Use this approach in the Builder', usedInBuilder: 'Approach set in Step 2 of the Builder.',
      matrix: { problem: 'Research problem', questions: 'Research questions', objectives: 'Objectives', theory: 'Theoretical framework', design: 'Research design', collection: 'Data collection', analysis: 'Data analysis' },
      links: { problemQuestions: 'Problem ↔ questions', questionsObjectives: 'Questions ↔ objectives', questionsDesign: 'Questions ↔ approach and design', designCollection: 'Design ↔ data collection', collectionAnalysis: 'Data collection ↔ analysis', theoryAnalysis: 'Theory ↔ analysis' },
      linkMsg: {
        missing: 'One side of this link is still empty.',
        overlapOk: 'The two share key terms.', overlapWeak: 'They share few key terms — check that they address the same issue.',
        theoryNone: 'No theoretical framework stated — acceptable for inductive designs; otherwise add one.', theoryOk: 'The framework is stated; explain in the analysis section how it guides interpretation.', theoryGt: 'In grounded theory, present the framework as sensitising concepts.'
      },
      checkerIntro: 'The checks below read your Builder entries. They test consistency, not quality of thought.',
      checkerEmpty: 'Start the Builder to see the checks.',
      manualTitle: 'Questions to ask yourself',
      manual: [
        'Could another researcher follow your procedure from the description alone?',
        'Have you explained why you rejected the obvious alternative design?',
        'Does each research question have a data source and an analytical approach?',
        'Have you stated what your study cannot claim?',
        'Is the timeline realistic for your degree and your access to participants or material?'
      ],
      glossSearch: 'Search the terminology', glossEmpty: 'No matching term.', glossCols: ['Term', 'Arabic', 'Definition', 'Arabic definition'],
      allDesigns: 'All designs', exAll: 'All areas', exHyp: 'Hypothetical teaching example', exPub: 'Published study',
      exLabels: { rq: 'Research question', approach: 'Approach and orientation', design: 'Design', data: 'Data sources', sampling: 'Sampling', analysis: 'Analysis', quality: 'Quality', lesson: 'What it teaches', topic: 'Study focus', source: 'Source' },
      refGroups: { core: 'Attached reference file: film, television and audiovisual research', alardawi: 'Published studies used as examples', method: 'Methodology: design, sampling and analysis', quality: 'Quality, reflexivity, ethics and reporting', film: 'Film and media analysis' },
      refTypes: { article: 'Journal article', book: 'Book', chapter: 'Book chapter', guide: 'Guidelines' },
      pending: 'Details to be completed',
      nothing: 'Nothing to show yet.'
    }
  };
})();
