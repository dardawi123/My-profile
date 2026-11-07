/* =========================================================
   بوصلة المشكلة البحثية — ملف اللغة العربية
   البيانات والتسميات ومُركِّبات الجمل الخاصة بالعربية
   إعداد: د. مرفت العرضاوي
   ========================================================= */
window.RC = {
  lang: 'ar',
  numerals: ['١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩', '١٠', '١١', '١٢'],
  stepNames: ['الموقع البحثي', 'الظاهرة والسياق', 'الفجوة', 'الأهمية', 'المنهج', 'الصياغة'],
  ptypes: [{ id: 'theoretical', t: 'مشكلة نظرية' }, { id: 'applied', t: 'مشكلة تطبيقية' }],
  approaches: [{ id: 'qual', t: 'المنهج النوعي' }, { id: 'mixed', t: 'المنهج المختلط' }],

  ui: {
    example: 'مثال: ',
    exampleSep: ' — مثال: ',
    inFilm: 'في السينما والتلفزيون: ',
    lesson: 'الدرس:',
    filmExample: 'مثال سينمائي: ',
    sampleLabel: 'العيّنة (أعمال أو مشاركون)',
    samplePh: 'مثال: ثمانية مسلسلات أو 20 مشاركاً',
    copy: 'انسخ المسودة كاملة',
    copied: 'تم النسخ ✓',
    filled: (p) => 'اكتمال المدخلات: ' + p + '٪',
    copyHeads: {
      statement: 'عبارة المشكلة:',
      purpose: 'عبارة الهدف:',
      questions: 'الأسئلة:',
      credit: '— أُعدّت باستخدام «بوصلة المشكلة البحثية»، إعداد د. مرفت العرضاوي'
    },
    levels: [
      { t: 'مشكلة محكمة وجاهزة', d: 'عبارتك تستوفي المعايير؛ اعرضها على مشرفك أو زميل ناقد قبل اعتمادها.' },
      { t: 'قريبة من النضج', d: 'تحتاج إلى تعزيز بعض الجوانب، خاصة التوثيق والاتساق مع المنهج.' },
      { t: 'في طور التشكّل', d: 'عد إلى بنّاء العبارة وراجع الفجوة والعواقب والعيّنة.' },
      { t: 'فكرة أولية', d: 'ابدأ بتحديد الموقع البحثي والظاهرة المركزية، ثم ابحث في الأدبيات عن الفجوة.' }
    ]
  },

  sites: [
    { id: 'text', t: 'النص الفيلمي والتلفزيوني', d: 'السرد والصورة والصوت والتمثيل والنوع الفني في الأفلام والمسلسلات.', ex: 'كيف تُمثَّل المرأة العاملة في الدراما السعودية المعاصرة؟', sl: 'المدوّنة الفيلمية (الأعمال المختارة)', sp: 'مثال: ثمانية مسلسلات عُرضت على منصة شاهد' },
    { id: 'audience', t: 'الجمهور والتلقّي', d: 'كيف يفسّر المشاهدون الأعمال ويعيشون تجربة المشاهدة (Hall, 1980؛ Staiger, 1992).', ex: 'كيف يتلقى الشباب الأفلام السعودية المعروضة في المهرجانات؟', sl: 'المشاركون', sp: 'مثال: طالبات جامعيات يشاهدن الدراما التركية المدبلجة' },
    { id: 'production', t: 'الإنتاج وثقافة صُنّاعه', d: 'ممارسات صنّاع الأعمال وغرف الكتابة والعمل الإبداعي (Caldwell, 2008؛ Mayer et al., 2009).', ex: 'كيف تتفاوض كاتبات السيناريو مع الرقابة الذاتية؟', sl: 'المشاركون أو موقع الإنتاج', sp: 'مثال: كتّاب ومنتجون في ثلاث شركات إنتاج بالرياض' },
    { id: 'practice', t: 'البحث عبر الممارسة', d: 'الفيلم أو السيناريو بوصفه أداة معرفة ونتاجاً بحثياً (Batty & Kerrigan, 2018).', ex: 'ماذا يكشف إخراج فيلم قصير عن سرد الذاكرة الشفهية؟', sl: 'العمل الإبداعي المنتَج', sp: 'مثال: فيلم وثائقي قصير من إنتاج الباحث' },
    { id: 'industry', t: 'الصناعة والسياسات والتعليم', d: 'المنصات والتوزيع والسياسات الثقافية وتعليم صناعة الأفلام (Daou, 2025).', ex: 'كيف يُعاد تشكيل تعليم صناعة الأفلام في ظل الذكاء الاصطناعي؟', sl: 'المؤسسات أو المشاركون', sp: 'مثال: أعضاء هيئة تدريس وطلبة في برنامجين للفنون السينمائية' }
  ],

  gaps: [
    { id: 'evidence', t: 'فجوة الأدلة', short: 'نتائج متعارضة', d: 'تعارض نتائج دراسات سليمة منفردة عند جمعها.', ex: 'تباين نتائج أثر الدراما المدبلجة على قيم المراهقين بين قوي ومحدود.', tpl: 'غير أن نتائج الدراسات السابقة حول {topic} متعارضة؛ فبينما تشير إلى {prev}، يظل الحسم غائباً بشأن {missing}.' },
    { id: 'knowledge', t: 'فجوة المعرفة', short: 'موضوع لم يُدرس', d: 'معرفة غائبة عن الحقل أو نتائج تخالف المتوقع.', ex: 'لم تُدرس جماليات شريط الصوت في الأفلام السعودية القصيرة.', tpl: 'وعلى الرغم من ذلك، تركّز الأدبيات على {prev}، ولم تتناول بعدُ {missing}.' },
    { id: 'practical', t: 'فجوة الممارسة والمعرفة', short: 'الممارسة تخالف التنظير', d: 'تعارض بين ما يمارسه المحترفون وما توصي به الأدبيات.', ex: 'تدعو أدلة الكتابة إلى بنية الفصول الثلاثة بينما تعمل غرف الكتابة الخليجية بآليات مغايرة.', tpl: 'غير أن ثمة فجوة بين ما تقرره الأدبيات، إذ تركّز على {prev}، وما يجري فعلياً في الممارسة؛ ويظل {missing} غير مفهوم.' },
    { id: 'method', t: 'الفجوة المنهجية', short: 'منهج واحد مهيمن', d: 'اعتماد موضوع ما على منهج واحد يستدعي مقاربة مختلفة.', ex: 'اعتماد دراسات تلقي الدراما العربية على الاستبانات دون مقابلات تكشف المعنى.', tpl: 'غير أن معظم الدراسات تناولت {topic} من خلال {prev}، مما ترك {missing} دون معالجة منهجية ملائمة.' },
    { id: 'empirical', t: 'الفجوة الإمبريقية', short: 'مقولات لم تُختبر', d: 'مقولات أو افتراضات لم يُتحقق منها ميدانياً.', ex: 'مقولات «النظرة الذكورية» (Mulvey, 1975) نادراً ما اختُبرت مع مشاهدات عربيات.', tpl: 'غير أن المقولات المتعلقة بـ{topic} ظلت نظرية إلى حد بعيد؛ إذ تناولت الأدبيات {prev} دون تحقق ميداني من {missing}.' },
    { id: 'theory', t: 'الفجوة النظرية', short: 'نظرية قاصرة', d: 'نظرية قديمة أو نماذج متنافسة تعجز عن تفسير الظاهرة.', ex: 'قصور التحليل النفسي عن تفسير تعدد هويات المتفرجات وتقاطعاتها (Smelik, 2016).', tpl: 'غير أن الأطر السائدة تفسّر {topic} من خلال {prev}، وهي تعجز عن تفسير {missing}.' },
    { id: 'population', t: 'فجوة الفئة', short: 'فئة غير ممثَّلة', d: 'فئات ناقصة التمثيل في الأدلة بحسب النوع أو العمر أو الهوية.', ex: 'تركيز الدراسات على المراحل المتوسطة وإغفال الابتدائية (Kumar et al., 2025)؛ وسينمائياً: جمهور كبار السن.', tpl: 'غير أن الدراسات السابقة حول {topic} تركّزت على {prev}، بينما ظل {missing} غير ممثَّل بالقدر الكافي.' },
    { id: 'context', t: 'فجوة السياق', short: 'سياق جديد', d: 'نتائج تتركز في سياقات جغرافية أو ثقافية قد لا تصدق في غيرها.', ex: 'أغلب دراسات تصورات الذكاء الاصطناعي في الأفلام غربية؛ فما حال الشباب السعودي؟', tpl: 'غير أن معظم الدراسات حول {topic} أُجريت في {prev}، ولا يُعرف إلى أي حد تصدق نتائجها في سياق {setting}؛ إذ يظل {missing} غير مدروس.' },
    { id: 'frontier', t: 'فجوة الأفق الجديد', short: 'ظاهرة مستجدة', d: 'تقنية أو تحول جديد يفتح أرضاً لم يدرسها أحد تقريباً.', ex: 'الذكاء الاصطناعي التوليدي في تعليم صناعة الأفلام (Daou, 2025).', tpl: 'غير أن {topic} ظاهرة مستجدة؛ فالأدبيات المتاحة تقتصر على {prev}، ولا تزال {missing} أرضاً بحثية شبه بكر.' }
  ],

  designs: {
    qual: [
      { id: 'case', t: 'دراسة الحالة', when: 'لفهم ظاهرة معاصرة في عمل أو مؤسسة أو مهرجان محدد بعمق.', src: 'Creswell & Poth, 2018', verb: 'استكشاف', m: 'المقابلات المتعمقة وتحليل الوثائق والمشاهدة المنظمة' },
      { id: 'ethno', t: 'الإثنوغرافيا ودراسات الإنتاج', when: 'لفهم ثقافة صنّاع الأعمال من الداخل في مواقع التصوير وغرف الكتابة.', src: 'Caldwell, 2008; Mayer et al., 2009', verb: 'فهم', m: 'الملاحظة بالمشاركة والمقابلات وتحليل الخطاب المهني' },
      { id: 'phenom', t: 'الظاهراتية', when: 'لوصف التجربة المعيشة للمشاهدة أو الإبداع كما يعيشها أصحابها.', src: 'Creswell & Poth, 2018', verb: 'وصف وتأويل', m: 'مقابلات شبه منظمة حول التجربة المعيشة' },
      { id: 'grounded', t: 'النظرية المجذّرة', when: 'حين تغيب نظرية مناسبة ويلزم بناء تفسير من البيانات.', src: 'Creswell & Poth, 2018', verb: 'بناء تفسير نظري لـ', m: 'مقابلات متتابعة وترميز مفتوح ومحوري وانتقائي' },
      { id: 'textual', t: 'التحليل النصي والسيميائي', when: 'لتحليل بنية المعنى في اللقطات والمشاهد والسرد.', src: 'Rose, 2016; Bordwell, 1989', verb: 'تحليل', m: 'تحليل منظم للقطات والمشاهد وفق إطار تحليلي معلن' },
      { id: 'cda', t: 'تحليل الخطاب النقدي', when: 'لكشف علاقات القوة والأيديولوجيا في التمثيلات النصية والبصرية.', src: 'Kumar et al., 2025 (Fairclough)', verb: 'الكشف عن', m: 'نموذج فيركلاف ثلاثي الأبعاد: النص والممارسة الخطابية والممارسة الاجتماعية' },
      { id: 'thematic', t: 'التحليل الموضوعاتي', when: 'لاستخلاص أنماط المعنى من مقابلات أو مجموعات نقاش مع الجمهور أو الصنّاع.', src: 'Braun & Clarke, 2006', verb: 'استكشاف', m: 'مقابلات أو مجموعات نقاش مركّزة تُحلَّل تحليلاً موضوعاتياً تأملياً' },
      { id: 'pbr', t: 'البحث عبر الممارسة', when: 'حين يكون إنتاج الفيلم أو السيناريو ذاته طريقة لتوليد المعرفة.', src: 'Batty & Kerrigan, 2018', verb: 'استقصاء', m: 'إنتاج عمل إبداعي مصحوب بمدونة تأملية وتحليل نقدي للعملية' }
    ],
    mixed: [
      { id: 'conv', t: 'التصميم التقاربي', when: 'جمع بيانات كمية ونوعية في آن واحد ثم مقارنتها لتكوين فهم شامل.', src: 'Creswell & Plano Clark, 2018', verb: 'فهم', m: 'استبانة وتحليل مضمون كمي بالتوازي مع مقابلات أو مجموعات نقاش، ثم مقارنة النتائج', mx: 'conv' },
      { id: 'expl', t: 'التفسيري المتتابع', when: 'مرحلة كمية أولاً، ثم مرحلة نوعية لتفسير نتائجها المفاجئة أو المهمة.', src: 'Creswell & Plano Clark, 2018', verb: 'تفسير', m: 'استبانة واسعة تتبعها مقابلات متعمقة مع عينة مختارة من المستجيبين', mx: 'expl' },
      { id: 'explo', t: 'الاستكشافي المتتابع', when: 'مرحلة نوعية أولاً لاستكشاف الظاهرة، ثم أداة كمية لاختبارها أو تعميمها.', src: 'Creswell & Plano Clark, 2018', verb: 'استكشاف', m: 'مقابلات أو تحليل نصي أولاً، ثم بناء أداة كمية واختبارها على عينة أوسع', mx: 'explo' }
    ]
  },

  assumes: [
    { id: 'inhouse', t: 'افتراض داخلي', d: 'مسلّمات تتقاسمها مدرسة بحثية بعينها.', ex: 'تفترض مدرسة «الشاشة» التحليلنفسية أن المتفرج موقع نصي يصنعه الفيلم لا شخص حقيقي.' },
    { id: 'metaphor', t: 'الاستعارة الجذرية', d: 'صورة كبرى تحكم فهم الموضوع.', ex: 'استعارة «الحقنة» التي تصوّر الفيلم مادة تُحقن في جمهور سلبي.' },
    { id: 'paradigm', t: 'افتراض النموذج المعرفي', d: 'مسلّمات أنطولوجية ومعرفية ومنهجية.', ex: 'افتراض أن المعنى كامن في النص ويُستخرج بالتحليل، لا أنه يُبنى في التلقي.' },
    { id: 'ideology', t: 'افتراض أيديولوجي', d: 'مسلّمات سياسية وأخلاقية وجندرية.', ex: 'افتراض أن البياض معيار غير مرئي لا يحتاج إلى تسمية (Dyer, 1993 في Smelik, 2016).' },
    { id: 'field', t: 'افتراض الحقل', d: 'مسلّمات تتقاسمها مدارس متنافسة في الحقل كله.', ex: 'افتراض أن نظريات السينما الغربية صالحة تلقائياً لتفسير السينما العربية.' }
  ],

  checks: [
    { id: 'c1', t: 'محددة وموجزة', d: 'فقرة واحدة تتناول ظاهرة مركزية واحدة.' },
    { id: 'c2', t: 'السياق واضح', d: 'تحدد الحدود الزمانية والمكانية والوسيطية والعيّنة.' },
    { id: 'c3', t: 'الفجوة موثقة', d: 'مدعومة بمراجع حديثة تبيّن ما ركزت عليه الدراسات وما غاب.' },
    { id: 'c4', t: 'العواقب مذكورة', d: 'تبيّن ما يترتب على بقاء الفجوة ومن يتأثر بها.' },
    { id: 'c5', t: 'مثيرة للاهتمام (I)', d: 'تهم الباحث ومجتمع الدراسات السينمائية والتلفزيونية.' },
    { id: 'c6', t: 'أصيلة (N)', d: 'تضيف معرفة جديدة أو تسائل افتراضاً قائماً لا مجرد تكرار.' },
    { id: 'c7', t: 'قابلة للتنفيذ (F)', d: 'الوصول إلى الأعمال أو المشاركين أو الأرشيف متاح ضمن الوقت والموارد.' },
    { id: 'c8', t: 'أخلاقية (E)', d: 'تراعي الموافقة المستنيرة وحقوق الملكية والخصوصية.' },
    { id: 'c9', t: 'ذات صلة (R)', d: 'تتصل بالحقل والصناعة والسياق المحلي.' },
    { id: 'c10', t: 'متسقة مع الهدف والأسئلة', d: 'الهدف والأسئلة والمنهج تنبع من المشكلة نفسها.' },
    { id: 'c11', t: 'أسئلة مفتوحة غير موجِّهة', d: 'تبدأ بـ«كيف/ما» ولا تفترض الإجابة مسبقاً.' },
    { id: 'c12', t: 'مبرر المنهج واضح', d: 'تبرر لماذا النوعي، أو لماذا يلزم الدمج في المختلط.' }
  ],

  cases: [
    { t: 'Kumar et al. (2025): تمثيل النوع في كتب الإنجليزية الابتدائية بباكستان', method: 'نوعي: تحليل خطاب نقدي', gap: 'فجوة فئة وسياق', how: 'بيّنوا أن الأدبيات ركّزت على المرحلتين المتوسطة والثانوية، وتركت المرحلة الابتدائية بعد إصلاحات مناهج 2020 دون دراسة، ثم سدّوا الفجوة بنموذج فيركلاف.', lesson: 'صيغة «ركّزت الأدبيات على… وأُغفل…» مع حد زمني واضح تجعل الفجوة مقنعة.' },
    { t: 'Berg (2025): الاندماج والإقصاء والتفاوض على الهوية لدى اللاجئين', method: 'نوعي: مقابلات شبه منظمة (62)', gap: 'مشكلة متطورة', how: 'بدأت الدراسة بمشكلة «هشاشة المعلومات»، ثم أعادت الباحثة صياغتها حين ظهر «الإقصاء الرقمي» صورةً من صور الإقصاء، عبر تأمل ذاتي وتحليل موضوعاتي تكراري.', lesson: 'في البحث النوعي قد تتطور المشكلة مع البيانات؛ وثّق هذا التطور وموقعك بوصفك باحثاً.' },
    { t: 'دراسة سعودية: أفلام الذكاء الاصطناعي وتصورات الشباب', method: 'كمي: مسح (410)', gap: 'فجوة السياق', how: 'انطلقت من أن الأدبيات غربية التوجه، وطبّقت نظرية الغرس في سياق غير غربي، وصاغت أسئلة وفرضيات متسقة مع النظرية.', lesson: 'يمكن تحويلها إلى تصميم تفسيري متتابع يضيف مقابلات تفسر لماذا يرى الشباب الذكاء الاصطناعي تهديداً.' },
    { t: 'Smelik (2016): نظرية الفيلم النسوية', method: 'نظري: مراجعة نقدية', gap: 'فجوة نظرية وخلاف', how: 'تتبع كيف ولّد الخلاف حول «النظرة الذكورية» مشكلات جديدة: المتفرجة، والعرق، والذكورة، والكوير.', lesson: 'الخلافات النظرية في الحقل مصدر غني للمشكلات البحثية.' },
    { t: 'Daou (2025): إعادة تصور تعليم صناعة الأفلام في السعودية بالذكاء الاصطناعي', method: 'فصل مراجعة', gap: 'أفق جديد', how: 'ربط نمو قطاع السينما ضمن رؤية 2030 بظهور الذكاء الاصطناعي في التعليم، موازناً بين فرصه ومخاطره على الإبداع.', lesson: 'الظواهر المستجدة محلياً تفتح مشكلات تطبيقية ملحّة لمسارنا.' }
  ],

  refs: [
    { t: 'أولاً: مراجع الملف المرفق', items: [
      'Berg, M. (2025). Refugee integration in Germany: The interplay of othering, digital exclusion, and identity negotiation. Journal of International Migration and Integration, 26(1). https://doi.org/10.1007/s12134-025-01238-0',
      'Daou, M. I. (2025). Reimagining filmmaking education in Saudi Arabia through the use of AI. In AI in the Middle East for growth and business (pp. 263–279). Springer. https://doi.org/10.1007/978-3-031-75589-7_15',
      'Kumar, A., Kumari, A., McKeown, D., & Syed, H. A. (2025). Tale of textbooks: A critical discourse analysis of gender representation in Pakistani elementary English language textbooks. Linguistics and Education, 88.',
      'Mulvey, L. (1975). Visual pleasure and narrative cinema. Screen, 16(3), 6–18.',
      'Smelik, A. (2016). Feminist film theory. In N. A. Naples (Ed.), The Wiley Blackwell encyclopedia of gender and sexuality studies. Wiley. https://doi.org/10.1002/9781118663219.wbegss1482',
      'Exposure to AI-themed movies and Saudi young adults’ perceptions of artificial intelligence: A Cultivation Theory study (n = 410) [Source details to be completed; included in the attached file].',
      'What is a research problem? [Video transcript]. (n.d.). Included in the attached file.',
      'The problem statement [Video transcript]. (n.d.). Included in the attached file.'
    ] },
    { t: 'ثانياً: أدبيات منهجية إضافية (محكّمة وكثيرة الاستشهاد)', items: [
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
    { t: 'ثالثاً: مراجع الدراسات السينمائية والتلفزيونية', items: [
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

  /* ---------- مُركِّب عبارة المشكلة والهدف والأسئلة ---------- */
  compose: function (s, sel) {
    const f = s.f;
    const ph = (v, p) => (v && v.trim()) ? v.trim() : '[' + p + ']';
    const topic = ph(f.topic, 'الظاهرة المركزية');
    const setting = ph(f.setting, 'السياق');
    const sample = ph(f.sample, 'العيّنة');
    const prevT = ph(f.prev, 'ما ركزت عليه الدراسات السابقة');
    const missing = ph(f.missing, 'الجانب الغائب');
    const fill = (tpl) => tpl.split('{topic}').join(topic).split('{setting}').join(setting).split('{prev}').join(prevT).split('{missing}').join(missing);
    const siteSel = sel.siteSel, gapSel = sel.gapSel, des = sel.des;

    const p1 = (f.context && f.context.trim()) ? f.context.trim() : ('يحظى ' + topic + ' في ' + setting + ' باهتمام متزايد في الدراسات السينمائية والتلفزيونية.');
    const p2 = gapSel ? fill(gapSel.tpl) : ('غير أن الدراسات السابقة ركّزت على ' + prevT + '، بينما لم تتناول ' + missing + '.');
    const cons = ph(f.consequence, 'العواقب المترتبة على الفجوة');
    const ben = ph(f.beneficiaries, 'المستفيدين');
    const p3 = 'ويترتب على هذا القصور ' + cons + '، وهو ما يهم ' + ben + '؛ ' +
      (s.ptype === 'applied' ? 'ومن ثمّ تكتسب الدراسة أهمية تطبيقية في تقديم فهم يوجّه الممارسة.' : 'ومن ثمّ تكتسب الدراسة أهمية نظرية في توسيع المعرفة بـ' + topic + '.');
    const desName = des ? des.t : '[التصميم]';
    const verb = des ? des.verb : '[استكشاف]';
    const meth = des ? des.m : '[أدوات جمع البيانات]';
    const th = (f.theory && f.theory.trim()) ? ('، مستندةً إلى ' + f.theory.trim()) : '';
    const scope = siteSel && (siteSel.id === 'text' || siteSel.id === 'practice') ? ' كما يتجلى في ' : ' لدى ';
    const p4 = s.approach === 'mixed'
      ? ('لذا تهدف هذه الدراسة، باتباع ' + desName + ' في المنهج المختلط، إلى ' + verb + ' ' + topic + scope + sample + ' في ' + setting + th + '، من خلال ' + meth + '.')
      : ('لذا تهدف هذه الدراسة النوعية، باتباع منهج ' + desName + '، إلى ' + verb + ' ' + topic + scope + sample + ' في ' + setting + th + '، من خلال ' + meth + '.');
    const statement = [
      { label: 'السياق', text: p1 }, { label: 'القضية والفجوة', text: p2 },
      { label: 'الأهمية', text: p3 }, { label: 'الهدف', text: p4 }
    ];

    const purpose = s.approach === 'mixed'
      ? ('الغرض من هذه الدراسة ذات التصميم ' + desName + ' هو ' + verb + ' ' + topic + ' لدى ' + sample + ' في ' + setting + '؛ إذ تُجمع البيانات الكمية والنوعية وتُدمج لأن أياً منهما وحده لا يكفي لفهم المشكلة فهماً كاملاً.')
      : ('الغرض من هذه الدراسة (' + desName + ') هو ' + verb + ' ' + topic + ' لدى ' + sample + ' في ' + setting + '. ويُعرَّف ' + topic + ' مبدئياً بوصفه [تعريف عامل أولي قابل للتطوير].');

    const sid = siteSel ? siteSel.id : 'text';
    const central = {
      text: 'كيف تُبنى صورة ' + topic + ' في ' + sample + ' ضمن ' + setting + '؟',
      audience: 'كيف يتلقى ' + sample + ' ' + topic + ' ويفسّرونه في ' + setting + '؟',
      production: 'كيف يتعامل ' + sample + ' مع ' + topic + ' في ممارساتهم الإنتاجية ضمن ' + setting + '؟',
      practice: 'ما الذي تكشفه عملية إنتاج ' + sample + ' عن ' + topic + ' في ' + setting + '؟',
      industry: 'كيف يتشكّل ' + topic + ' في ' + setting + ' من منظور ' + sample + '؟'
    }[sid];
    const subs = {
      text: ['ما الأنماط السردية والبصرية والصوتية التي تُقدَّم بها ' + topic + '؟', 'كيف تتقاطع هذه التمثيلات مع سياقها الثقافي والصناعي؟'],
      audience: ['ما المعاني التي يمنحها ' + sample + ' لـ' + topic + '؟', 'كيف تشكّل خبراتهم وهوياتهم قراءاتهم المتفقة أو التفاوضية أو المعارضة؟'],
      production: ['ما القيود والفرص التي يواجهها ' + sample + ' في التعامل مع ' + topic + '؟', 'كيف يبررون قراراتهم الإبداعية ويصفونها؟'],
      practice: ['ما القرارات الإبداعية الحاسمة في العملية، ولماذا؟', 'كيف يسهم العمل الناتج في المعرفة المتعلقة بـ' + topic + '؟'],
      industry: ['ما العوامل المؤسسية والتقنية المؤثرة في ' + topic + '؟', 'ما الفرص والمخاطر التي يدركها ' + sample + '؟']
    }[sid];
    let questions = [{ k: 'السؤال المركزي', t: central }, { k: 'سؤال فرعي ١', t: subs[0] }, { k: 'سؤال فرعي ٢', t: subs[1] }];
    if (s.approach === 'mixed') {
      const mx = des ? des.mx : 'conv';
      questions = [
        { k: 'السؤال الكمي', t: 'ما مدى انتشار ' + topic + ' وما علاقته بخصائص ' + sample + ' في ' + setting + '؟' },
        { k: 'السؤال النوعي', t: central },
        { k: 'السؤال التكاملي', t: mx === 'expl' ? ('كيف تفسّر البيانات النوعية النتائج الكمية المتعلقة بـ' + topic + '؟')
          : (mx === 'explo' ? ('إلى أي حد تصدق الأنماط المستكشفة نوعياً على عينة أوسع من ' + sample + '؟')
          : ('إلى أي حد تتقارب النتائج الكمية والنوعية أو تتباعد في فهم ' + topic + '؟')) }
      ];
    }

    const warnings = [];
    if (!s.site) warnings.push('لم تحدد الموقع البحثي؛ استُخدمت صيغة النص الفيلمي افتراضياً.');
    if (!s.gap) warnings.push('اختر نوع الفجوة لتصبح جملة القضية أدق.');
    if (!s.design) warnings.push('اختر التصميم البحثي حتى تتسق عبارة الهدف مع المنهج.');
    if (f.topic && f.topic.trim().split(/\s+/).length > 8) warnings.push('الظاهرة المركزية طويلة؛ اختصرها في مفهوم واحد واضح.');
    if (f.context && !/\(|\d{4}/.test(f.context)) warnings.push('أضف استشهاداً موثقاً في جملة السياق.');
    if (/(تأثير|أثر|علاقة)/.test(f.topic || '') && s.approach === 'qual') warnings.push('كلمات مثل «أثر» و«علاقة» توحي بمنهج كمي؛ في النوعي فضّل «كيف/ما» و«تجربة/معنى/تمثيل».');
    if (!warnings.length) warnings.push('المسودة مكتملة البنية؛ راجع اللغة وافحصها بالمعايير أدناه.');

    return { statement, purpose, questions, warnings };
  },

  /* ---------- أسئلة مختبر الاستشكال ---------- */
  labQuestions: function (L, atype) {
    const ph = (v, p) => (v && v.trim()) ? v.trim() : '[' + p + ']';
    const lf = ph(L.field, 'مجال الأدبيات');
    const la = ph(L.assumption, 'الافتراض السائد');
    const lalt = ph(L.alt, 'الافتراض البديل');
    const typeQ = {
      inhouse: 'هل يتبنى باحثون من مدارس أخرى هذا الافتراض، أم أنه حكر على مدرسة واحدة؟',
      metaphor: 'ما الاستعارة التي تحكم تصورنا لـ' + lf + '، وما الذي تحجبه عنا؟',
      paradigm: 'ما الذي يحدث للسؤال إذا انتقلنا من نموذج يرى المعنى في النص إلى نموذج يراه مبنياً في السياق؟',
      ideology: 'من المستفيد من بقاء هذا الافتراض دون مساءلة، ومن يغيب صوته بسببه؟',
      field: 'هل يصدق هذا الافتراض على السينما والدراما العربية والسعودية، أم أنه نتاج سياق غربي؟'
    }[atype] || 'اختر نوع الافتراض أعلاه للحصول على سؤال مخصص.';
    return [
      'تفترض أدبيات ' + lf + ' أن «' + la + '». ما الأدلة التي قام عليها هذا الافتراض، ومتى وأين تشكّل؟',
      typeQ,
      'ماذا لو انطلقنا من أن «' + lalt + '»؟ ما الظواهر التي تصبح مرئية حينها؟',
      'سؤال بحثي مقترح: كيف يمكن فهم ' + lf + ' إذا ما انطلقنا من أن ' + lalt + '، بدلاً من الافتراض السائد بأن ' + la + '؟'
    ];
  }
};
