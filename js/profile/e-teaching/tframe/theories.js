/* =========================================================
   Theoretical Framework Development — shared theory library data
   Language-neutral structure of the Theory Explorer: the kind of perspective,
   the research foci and designs it is usually compatible with, the analytical
   purposes it serves, documented relations between perspectives and verified
   foundational references (APA 7). The descriptive text of every profile is in
   tframe-ar.js / tframe-en.js (RC.theoryText) with identical ids.
   Compatibility here is a teaching aid, not an automatic recommendation.
   ========================================================= */
window.TFR_THEORIES = {
  /* type: formal theory | tradition | critical perspective | model | analytical method */
  list: [
    { id: 'feminist', type: 'critical', foci: ['gender', 'representation', 'ideology', 'aesthetics'], kinds: ['textual', 'critical', 'interview', 'qcontent'], obj: ['critique', 'interpret'],
      refs: ['Mulvey, L. (1975). Visual pleasure and narrative cinema. Screen, 16(3), 6–18. https://doi.org/10.1093/screen/16.3.6', 'de Lauretis, T. (1984). Alice doesn’t: Feminism, semiotics, cinema. Indiana University Press.'] },
    { id: 'auteur', type: 'tradition', foci: ['aesthetics', 'industry', 'meaning'], kinds: ['textual', 'critical'], obj: ['interpret'],
      refs: ['Sarris, A. (1962). Notes on the auteur theory in 1962. Film Culture, 27, 1–8.', 'Wollen, P. (1969). Signs and meaning in the cinema. Secker & Warburg.'] },
    { id: 'genre', type: 'tradition', foci: ['narrative', 'aesthetics', 'industry', 'audience', 'meaning'], kinds: ['textual', 'qcontent', 'critical', 'mixed'], obj: ['interpret', 'explain'],
      refs: ['Altman, R. (1999). Film/genre. British Film Institute.', 'Neale, S. (2000). Genre and Hollywood. Routledge.'] },
    { id: 'semiology', type: 'method', foci: ['meaning', 'representation', 'ideology', 'aesthetics'], kinds: ['textual'], obj: ['interpret', 'critique'],
      refs: ['Barthes, R. (1972). Mythologies (A. Lavers, Trans.). Hill and Wang. (Original work published 1957)', 'Barthes, R. (1977). Image, music, text (S. Heath, Trans.). Fontana.'] },
    { id: 'metz', type: 'model', foci: ['meaning', 'aesthetics', 'narrative'], kinds: ['textual'], obj: ['interpret'],
      refs: ['Metz, C. (1974). Film language: A semiotics of the cinema (M. Taylor, Trans.). Oxford University Press.'] },
    { id: 'structuralism', type: 'tradition', foci: ['meaning', 'narrative', 'ideology'], kinds: ['textual', 'critical'], obj: ['interpret', 'critique'],
      refs: ['Wollen, P. (1969). Signs and meaning in the cinema. Secker & Warburg.', 'Barthes, R. (1977). Image, music, text (S. Heath, Trans.). Fontana.'] },
    { id: 'hall', type: 'formal', foci: ['representation', 'identity', 'ideology', 'meaning', 'gender'], kinds: ['textual', 'interview', 'critical', 'qcontent'], obj: ['interpret', 'critique'],
      refs: ['Hall, S. (Ed.). (1997). Representation: Cultural representations and signifying practices. Sage.'] },
    { id: 'encoding', type: 'model', foci: ['audience', 'meaning', 'ideology'], kinds: ['interview', 'textual', 'mixed'], obj: ['interpret', 'explain'],
      refs: ['Hall, S. (1980). Encoding/decoding. In S. Hall, D. Hobson, A. Lowe, & P. Willis (Eds.), Culture, media, language (pp. 128–138). Hutchinson.', 'Morley, D. (1980). The “Nationwide” audience: Structure and decoding. British Film Institute.'] },
    { id: 'reception', type: 'tradition', foci: ['audience', 'meaning', 'identity'], kinds: ['interview', 'mixed', 'critical'], obj: ['interpret'],
      refs: ['Jauss, H. R. (1982). Toward an aesthetic of reception (T. Bahti, Trans.). University of Minnesota Press.', 'Staiger, J. (1992). Interpreting films: Studies in the historical reception of American cinema. Princeton University Press.'] },
    { id: 'uses', type: 'formal', foci: ['consumption', 'audience'], kinds: ['survey', 'interview', 'mixed'], obj: ['explain', 'hypothesise'],
      refs: ['Katz, E., Blumler, J. G., & Gurevitch, M. (1973). Uses and gratifications research. Public Opinion Quarterly, 37(4), 509–523. https://doi.org/10.1086/268109'] },
    { id: 'cultivation', type: 'formal', foci: ['consumption', 'ideology', 'representation'], kinds: ['survey', 'qcontent', 'mixed'], obj: ['explain', 'hypothesise'],
      refs: ['Gerbner, G., & Gross, L. (1976). Living with television: The violence profile. Journal of Communication, 26(2), 172–199. https://doi.org/10.1111/j.1460-2466.1976.tb01397.x'] },
    { id: 'narrative', type: 'tradition', foci: ['narrative', 'aesthetics', 'meaning'], kinds: ['textual', 'qcontent'], obj: ['interpret', 'sensitise'],
      refs: ['Bordwell, D. (1985). Narration in the fiction film. University of Wisconsin Press.', 'Chatman, S. (1978). Story and discourse: Narrative structure in fiction and film. Cornell University Press.'] },
    { id: 'psycho', type: 'tradition', foci: ['gender', 'aesthetics', 'meaning', 'identity'], kinds: ['textual', 'critical'], obj: ['interpret', 'critique'],
      refs: ['Metz, C. (1982). The imaginary signifier: Psychoanalysis and the cinema. Indiana University Press.', 'Mulvey, L. (1975). Visual pleasure and narrative cinema. Screen, 16(3), 6–18. https://doi.org/10.1093/screen/16.3.6'] },
    { id: 'postcolonial', type: 'critical', foci: ['representation', 'identity', 'ideology'], kinds: ['textual', 'critical', 'interview'], obj: ['critique', 'interpret'],
      refs: ['Said, E. W. (1978). Orientalism. Pantheon Books.', 'Shohat, E., & Stam, R. (1994). Unthinking Eurocentrism: Multiculturalism and the media. Routledge.'] },
    { id: 'frankfurt', type: 'critical', foci: ['industry', 'ideology', 'consumption'], kinds: ['critical', 'textual'], obj: ['critique'],
      refs: ['Horkheimer, M., & Adorno, T. W. (2002). Dialectic of enlightenment: Philosophical fragments (E. Jephcott, Trans.). Stanford University Press. (Original work published 1947)'] },
    { id: 'cultstudies', type: 'tradition', foci: ['identity', 'ideology', 'audience', 'representation', 'consumption'], kinds: ['interview', 'textual', 'mixed', 'critical'], obj: ['interpret', 'critique', 'sensitise'],
      refs: ['Hall, S. (1980). Encoding/decoding. In S. Hall, D. Hobson, A. Lowe, & P. Willis (Eds.), Culture, media, language (pp. 128–138). Hutchinson.', 'Williams, R. (1974). Television: Technology and cultural form. Fontana.'] },
    { id: 'polecon', type: 'critical', foci: ['industry', 'ideology', 'consumption'], kinds: ['critical', 'qcontent', 'mixed'], obj: ['explain', 'critique'],
      refs: ['Mosco, V. (2009). The political economy of communication (2nd ed.). Sage.'] },
    { id: 'proximity', type: 'formal', foci: ['consumption', 'audience', 'identity', 'industry'], kinds: ['survey', 'interview', 'mixed'], obj: ['explain', 'hypothesise', 'sensitise'],
      refs: ['Straubhaar, J. D. (1991). Beyond media imperialism: Asymmetrical interdependence and cultural proximity. Critical Studies in Mass Communication, 8(1), 39–59. https://doi.org/10.1080/15295039109366779'] }
  ],
  /* Documented relations used to explain compatibility (text in RC.pairText). */
  pairs: [
    { a: 'cultivation', b: 'reception', kind: 'tension', key: 'activePassive' },
    { a: 'cultivation', b: 'encoding', kind: 'tension', key: 'activePassive' },
    { a: 'cultivation', b: 'uses', kind: 'tension', key: 'selection' },
    { a: 'auteur', b: 'structuralism', kind: 'tension', key: 'author' },
    { a: 'auteur', b: 'polecon', kind: 'tension', key: 'agency' },
    { a: 'psycho', b: 'reception', kind: 'tension', key: 'spectator' },
    { a: 'frankfurt', b: 'cultstudies', kind: 'tension', key: 'massCulture' },
    { a: 'frankfurt', b: 'reception', kind: 'tension', key: 'massCulture' },
    { a: 'semiology', b: 'metz', kind: 'complement', key: 'signs' },
    { a: 'semiology', b: 'hall', kind: 'complement', key: 'meaning' },
    { a: 'hall', b: 'feminist', kind: 'complement', key: 'representationGender' },
    { a: 'hall', b: 'postcolonial', kind: 'complement', key: 'representationPower' },
    { a: 'feminist', b: 'psycho', kind: 'complement', key: 'gaze' },
    { a: 'encoding', b: 'reception', kind: 'complement', key: 'activeAudience' },
    { a: 'encoding', b: 'cultstudies', kind: 'complement', key: 'activeAudience' },
    { a: 'uses', b: 'proximity', kind: 'complement', key: 'choice' },
    { a: 'genre', b: 'narrative', kind: 'complement', key: 'form' },
    { a: 'polecon', b: 'frankfurt', kind: 'complement', key: 'industryCritique' },
    { a: 'genre', b: 'polecon', kind: 'levels', key: 'textIndustry' },
    { a: 'hall', b: 'encoding', kind: 'levels', key: 'textAudience' }
  ]
};
