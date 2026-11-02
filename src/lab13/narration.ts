// Bilingual voice-over for CMET205 Lab 13 — one clip per sentence.
// `text`:  the sentence as written for people (and for a human re-recording).
// `parts`: what is synthesised — ["ar", …] by the Arabic voice (full tashkeel),
//          ["en", …] by an English voice. English terms are never read by the Arabic engine;
//          where a term would break a sentence awkwardly, the Arabic equivalent is spoken and
//          the English term stays on screen.
// Built by scripts/lab13-tts.py (mixing in scripts/lab13_mix.py: per-part trimming,
// loudness matching, short pauses) → public/lab13/vo/<id>.mp3, src/lab13/vo-durations.json,
// src/lab13/vo-words.json. Clips play strictly one after another (see timing.ts).

export type Part = ["ar" | "en", string];
export type Seg = { id: string; text: string; parts: Part[]; hold?: number };

export const NARRATION = {
  title: [
    {
      id: "t1",
      text: "تجربة قياس هبوط الضغط في العمود المحشو.",
      parts: [["ar", "تَجْرِبَةُ قِيَاسِ هُبُوطِ الضَّغْطِ فِي العَمُودِ المَحْشُوِّ."]],
      hold: 0.5,
    },
  ],
  objectives: [
    {
      id: "o1",
      text: "نهدف إلى قياس هبوط الضغط، ودراسة تأثير تدفق الهواء والماء.",
      parts: [["ar", "نَهْدِفُ إِلَى قِيَاسِ هُبُوطِ الضَّغْطِ، وَدِرَاسَةِ تَأْثِيرِ تَدَفُّقِ الهَوَاءِ وَالمَاءِ."]],
    },
    {
      id: "o2",
      text: "كما نتعرف على حالتي Loading وFlooding.",
      parts: [
        ["ar", "كَمَا نَتَعَرَّفُ عَلَى حَالَتَيْ"],
        ["en", "Loading, and flooding."],
      ],
      hold: 0.2,
    },
  ],
  diagram: [
    {
      id: "d1",
      text: "في المخطط: العمود الزجاجي المحشو، Packed glass column، مملوء بحلقات Raschig rings.",
      parts: [
        ["ar", "فِي المُخَطَّطِ: العَمُودُ الزُّجَاجِيُّ المَحْشُوُّ،"],
        ["en", "Packed glass column,"],
        ["ar", "مَمْلُوءٌ بِحَلَقَاتِ"],
        ["en", "Raschig rings."],
      ],
    },
    {
      id: "d2",
      text: "ثم خزان ماء ومضخة، وWater flow meter وDistributor.",
      parts: [
        ["ar", "ثُمَّ خَزَّانُ مَاءٍ، وَمِضَخَّةٌ،"],
        ["en", "Water flow meter, and distributor."],
      ],
    },
    {
      id: "d3",
      text: "ويمر الهواء عبر Air control valve وAir flow meter، ويقيس فرق الضغط U-tube manometer.",
      parts: [
        ["ar", "وَيَمُرُّ الهَوَاءُ عَبْرَ"],
        ["en", "Air control valve, and air flow meter."],
        ["ar", "وَيَقِيسُ فَرْقَ الضَّغْطِ"],
        ["en", "U-tube manometer."],
      ],
      hold: 0.4,
    },
  ],
  flow: [
    {
      id: "w1",
      text: "تدفع المضخة الماء إلى أعلى العمود، ثم ينزل خلال الحشوات.",
      parts: [["ar", "تَدْفَعُ المِضَخَّةُ المَاءَ إِلَى أَعْلَى العَمُودِ، ثُمَّ يَنْزِلُ خِلَالَ الحَشَوَاتِ."]],
    },
    {
      id: "w2",
      text: "بينما يصعد الهواء من الأسفل، وهذا هو Countercurrent flow.",
      parts: [
        ["ar", "بَيْنَمَا يَصْعَدُ الهَوَاءُ مِنَ الأَسْفَلِ، وَهَذَا هُوَ"],
        ["en", "Countercurrent flow."],
      ],
    },
    {
      id: "w3",
      text: "وتزيد الحلقات مساحة التلامس، فيفقد الهواء جزءًا من ضغطه.",
      parts: [["ar", "وَتَزِيدُ الحَلَقَاتُ مِسَاحَةَ التَّلَامُسِ، فَيَفْقِدُ الهَوَاءُ جُزْءًا مِنْ ضَغْطِهِ."]],
      hold: 0.3,
    },
  ],
  dry: [
    {
      id: "y1",
      text: "في الاختبار الجاف، تبقى المضخة متوقفة.",
      parts: [["ar", "فِي الاخْتِبَارِ الجَافِّ، تَبْقَى المِضَخَّةُ مُتَوَقِّفَةً."]],
    },
    {
      id: "y2",
      text: "نبدأ الهواء قرب 20 L/min، ونسجل ست قراءات بعد استقرار التدفق.",
      parts: [["ar", "نَبْدَأُ الهَوَاءَ قُرْبَ عِشْرِينَ لِتْرًا فِي الدَّقِيقَةِ، وَنُسَجِّلُ سِتَّ قِرَاءَاتٍ، بَعْدَ اسْتِقْرَارِ التَّدَفُّقِ."]],
      hold: 0.9,
    },
  ],
  wet: [
    {
      id: "e1",
      text: "في الاختبار المبلل، نشغّل الماء ونثبّت تدفقه، ثم نكرر القراءات.",
      parts: [["ar", "فِي الاخْتِبَارِ المُبَلَّلِ، نُشَغِّلُ المَاءَ، وَنُثَبِّتُ تَدَفُّقَهُ، ثُمَّ نُكَرِّرُ القِرَاءَاتِ."]],
    },
    {
      id: "e2",
      text: "وتُؤكَّد قيمة تدفق الماء مع المدرس.",
      parts: [["ar", "وَتُؤَكَّدُ قِيمَةُ تَدَفُّقِ المَاءِ، مَعَ المُدَرِّسِ."]],
      hold: 0.6,
    },
  ],
  manometer: [
    {
      id: "m1",
      text: "يتصل المانومتر بأسفل الحشوة وأعلاها.",
      parts: [["ar", "يَتَّصِلُ المَانُومِيتَرُ بِأَسْفَلِ الحَشْوَةِ، وَأَعْلَاهَا."]],
    },
    {
      id: "m2",
      text: "الضغط في الأسفل أكبر، فيظهر فرق في المنسوب.",
      parts: [["ar", "الضَّغْطُ فِي الأَسْفَلِ أَكْبَرُ، فَيَظْهَرُ فَرْقٌ فِي المَنْسُوبِ."]],
    },
    {
      id: "m3",
      text: "وهبوط الضغط يساوي تقريبًا: كثافة الماء × تسارع الجاذبية × فرق المنسوب بالمتر.",
      parts: [["ar", "وَهُبُوطُ الضَّغْطِ يُسَاوِي تَقْرِيبًا: كَثَافَةَ المَاءِ، فِي تَسَارُعِ الجَاذِبِيَّةِ، فِي فَرْقِ المَنْسُوبِ بِالمِتْرِ."]],
      hold: 0.9,
    },
  ],
  regimes: [
    {
      id: "r1",
      text: "Dry packing: يمر الهواء وحده بين الحلقات.",
      parts: [
        ["en", "Dry packing."],
        ["ar", "يَمُرُّ الهَوَاءُ وَحْدَهُ بَيْنَ الحَلَقَاتِ."],
      ],
    },
    {
      id: "r2",
      text: "Wet packing: يزداد هبوط الضغط.",
      parts: [
        ["en", "Wet packing."],
        ["ar", "يَزْدَادُ هُبُوطُ الضَّغْطِ."],
      ],
    },
    {
      id: "r3",
      text: "Loading: يتراكم الماء في الحشوة.",
      parts: [
        ["en", "Loading."],
        ["ar", "يَتَرَاكَمُ المَاءُ فِي الحَشْوَةِ."],
      ],
    },
    {
      id: "r4",
      text: "Flooding: هنا محاكاة تفسيرية فقط.",
      parts: [
        ["en", "Flooding."],
        ["ar", "هُنَا مُحَاكَاةٌ تَفْسِيرِيَّةٌ فَقَطْ."],
      ],
      hold: 0.7,
    },
  ],
  curves: [
    {
      id: "c1",
      text: "هذه منحنيات توضيحية، وليست نتائج مقاسة.",
      parts: [["ar", "هَذِهِ مُنْحَنَيَاتٌ تَوْضِيحِيَّةٌ، وَلَيْسَتْ نَتَائِجَ مُقَاسَةً."]],
    },
    {
      id: "c2",
      text: "المنحنى المبلل أعلى من الجاف، ويرتفع بحدة بعد Loading.",
      parts: [
        ["ar", "المُنْحَنَى المُبَلَّلُ أَعْلَى مِنَ الجَافِّ، وَيَرْتَفِعُ بِحِدَّةٍ بَعْدَ"],
        ["en", "Loading."],
      ],
      hold: 0.7,
    },
  ],
  readings: [
    { id: "g1", text: "انتظر استقرار التدفق.", parts: [["ar", "انْتَظِرِ اسْتِقْرَارَ التَّدَفُّقِ."]] },
    { id: "g2", text: "واقرأ المانومتر بمستوى العين.", parts: [["ar", "وَاقْرَأِ المَانُومِيتَرَ بِمُسْتَوَى العَيْنِ."]] },
    { id: "g3", text: "وتحقق من عدم وجود تسرب.", parts: [["ar", "وَتَحَقَّقْ مِنْ عَدَمِ وُجُودِ تَسَرُّبٍ."]], hold: 0.3 },
  ],
  shutdown: [
    { id: "s1", text: "للإيقاف: أوقف المضخة، واسمح بالتصريف.", parts: [["ar", "لِلْإِيقَافِ: أَوْقِفِ المِضَخَّةَ، وَاسْمَحْ بِالتَّصْرِيفِ."]] },
    { id: "s2", text: "ثم أوقف الهواء، والمفتاح الرئيسي.", parts: [["ar", "ثُمَّ أَوْقِفِ الهَوَاءَ، وَالمِفْتَاحَ الرَّئِيسِيَّ."]] },
    {
      id: "s3",
      text: "واتبع تعليمات المدرس وإجراءات المختبر.",
      parts: [["ar", "وَاتَّبِعْ تَعْلِيمَاتِ المُدَرِّسِ، وَإِجْرَاءَاتِ المُخْتَبَرِ."]],
      hold: 0.4,
    },
  ],
  end: [],
} satisfies Record<string, Seg[]>;

/** Scenes without narration keep this length (s). */
export const SILENT_SCENE_SECONDS = 2.8;

export type SceneKey = keyof typeof NARRATION;
