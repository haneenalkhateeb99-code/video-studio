// Arabic (MSA) voice-over for CMET205 Lab 13 — short version, one clip per sentence.
// `text`: the script for people (and for a human re-recording).
// `tts`:  the same sentence prepared for the speech engine — full tashkeel on Arabic words,
//         and each English term written in whichever form the voice pronounces best
//         (checked with speech recognition): some stay in Latin letters, others are
//         transliterated in Arabic letters with vowels.
// Clips are played strictly one after another with a pause between them (see timing.ts).
// Audio: public/lab13/vo/<id>.mp3 from scripts/lab13-tts.py, which also writes
// src/lab13/vo-durations.json and src/lab13/vo-words.json (word timings for the animations).

export type Seg = { id: string; text: string; tts: string; hold?: number };

export const NARRATION = {
  title: [{ id: "t1", text: "تجربة قياس هبوط الضغط في العمود المحشو.", tts: "تَجْرِبَةُ قِيَاسِ هُبُوطِ الضَّغْطِ فِي العَمُودِ المَحْشُوِّ.", hold: 0.5 }],
  objectives: [
    {
      id: "o1",
      text: "نهدف إلى قياس هبوط الضغط، ودراسة تأثير تدفق الهواء والماء.",
      tts: "نَهْدِفُ إِلَى قِيَاسِ هُبُوطِ الضَّغْطِ، وَدِرَاسَةِ تَأْثِيرِ تَدَفُّقِ الهَوَاءِ وَالمَاءِ.",
    },
    { id: "o2", text: "كما نتعرف على حالتي Loading وFlooding.", tts: "كَمَا نَتَعَرَّفُ عَلَى حَالَتَيْ لُودِينْغ، وَفْلَادِينْغ.", hold: 0.2 },
  ],
  diagram: [
    {
      id: "d1",
      text: "في المخطط: Packed glass column، مملوء بحلقات Raschig rings.",
      tts: "فِي المُخَطَّطِ: Packed glass column، مَمْلُوءٌ بِحَلَقَاتِ Rashig rings.",
    },
    {
      id: "d2",
      text: "ثم خزان ماء، ومضخة، وWater flow meter، وDistributor.",
      tts: "ثُمَّ خَزَّانُ مَاءٍ، وَمِضَخَّةٌ، وَ Water flow meter، وَ Distributor.",
    },
    {
      id: "d3",
      text: "ويمر الهواء عبر Air control valve وAir flow meter، ويقيس U-tube manometer فرق الضغط.",
      tts: "وَيَمُرُّ الهَوَاءُ عَبْرَ Air control valve، وَ Air flow meter، وَيَقِيسُ يُو تْيُوب مَانُومِيتَر فَرْقَ الضَّغْطِ.",
      hold: 0.4,
    },
  ],
  flow: [
    {
      id: "w1",
      text: "تدفع المضخة الماء إلى أعلى العمود، ثم ينزل خلال الحشوات.",
      tts: "تَدْفَعُ المِضَخَّةُ المَاءَ إِلَى أَعْلَى العَمُودِ، ثُمَّ يَنْزِلُ خِلَالَ الحَشَوَاتِ.",
    },
    {
      id: "w2",
      text: "بينما يصعد الهواء من الأسفل: Countercurrent flow.",
      tts: "بَيْنَمَا يَصْعَدُ الهَوَاءُ مِنَ الأَسْفَلِ: Counter current flow.",
    },
    {
      id: "w3",
      text: "وتزيد Raschig rings مساحة التلامس، فيفقد الهواء جزءًا من ضغطه.",
      tts: "وَتَزِيدُ Rashig rings مِسَاحَةَ التَّلَامُسِ، فَيَفْقِدُ الهَوَاءُ جُزْءًا مِنْ ضَغْطِهِ.",
      hold: 0.3,
    },
  ],
  dry: [
    { id: "y1", text: "في الاختبار الجاف، تبقى المضخة متوقفة.", tts: "فِي الاخْتِبَارِ الجَافِّ، تَبْقَى المِضَخَّةُ مُتَوَقِّفَةً." },
    {
      id: "y2",
      text: "نبدأ الهواء قرب 20 L/min، ونسجل ست قراءات بعد استقرار التدفق.",
      tts: "نَبْدَأُ الهَوَاءَ قُرْبَ عِشْرِينَ لِتْرًا فِي الدَّقِيقَةِ، وَنُسَجِّلُ سِتَّ قِرَاءَاتٍ، بَعْدَ اسْتِقْرَارِ التَّدَفُّقِ.",
      hold: 0.9,
    },
  ],
  wet: [
    {
      id: "e1",
      text: "في الاختبار المبلل، نشغّل الماء ونثبّت تدفقه، ثم نكرر القراءات.",
      tts: "فِي الاخْتِبَارِ المُبَلَّلِ، نُشَغِّلُ المَاءَ، وَنُثَبِّتُ تَدَفُّقَهُ، ثُمَّ نُكَرِّرُ القِرَاءَاتِ.",
    },
    { id: "e2", text: "وتُؤكَّد قيمة تدفق الماء مع المدرس.", tts: "وَتُؤَكَّدُ قِيمَةُ تَدَفُّقِ المَاءِ، مَعَ المُدَرِّسِ.", hold: 0.6 },
  ],
  manometer: [
    { id: "m1", text: "يتصل المانومتر بأسفل الحشوة وأعلاها.", tts: "يَتَّصِلُ المَانُومِيتَرُ بِأَسْفَلِ الحَشْوَةِ، وَأَعْلَاهَا." },
    {
      id: "m2",
      text: "الضغط في الأسفل أكبر، فيظهر فرق في المنسوب: Δh.",
      tts: "الضَّغْطُ فِي الأَسْفَلِ أَكْبَرُ، فَيَظْهَرُ فَرْقٌ فِي المَنْسُوبِ: دِلْتَا إِتْش.",
    },
    {
      id: "m3",
      text: "وΔP يساوي تقريبًا كثافة الماء × g × Δh بالمتر.",
      tts: "وَدِلْتَا بِي يُسَاوِي تَقْرِيبًا: كَثَافَةَ المَاءِ، فِي جِي، فِي دِلْتَا إِتْش بِالمِتْرِ.",
      hold: 0.9,
    },
  ],
  regimes: [
    { id: "r1", text: "في حالة Dry packing، يمر الهواء وحده.", tts: "فِي حَالَةِ Dry packing، يَمُرُّ الهَوَاءُ وَحْدَهُ." },
    { id: "r2", text: "وفي Wet packing، يزداد هبوط الضغط.", tts: "وَفِي وِيتْ بَاكِينْغ، يَزْدَادُ هُبُوطُ الضَّغْطِ." },
    { id: "r3", text: "وعند Loading، يتراكم الماء في الحشوة.", tts: "وَعِنْدَ لُودِينْغ، يَتَرَاكَمُ المَاءُ فِي الحَشْوَةِ." },
    { id: "r4", text: "أما Flooding، فهنا محاكاة تفسيرية فقط.", tts: "أَمَّا Flooding، فَهُنَا مُحَاكَاةٌ تَفْسِيرِيَّةٌ فَقَطْ.", hold: 0.7 },
  ],
  curves: [
    { id: "c1", text: "هذه منحنيات توضيحية، وليست نتائج مقاسة.", tts: "هَذِهِ مُنْحَنَيَاتٌ تَوْضِيحِيَّةٌ، وَلَيْسَتْ نَتَائِجَ مُقَاسَةً." },
    {
      id: "c2",
      text: "المنحنى المبلل أعلى من الجاف، ويرتفع بحدة بعد Loading.",
      tts: "المُنْحَنَى المُبَلَّلُ أَعْلَى مِنَ الجَافِّ، وَيَرْتَفِعُ بِحِدَّةٍ بَعْدَ لُودِينْغ.",
      hold: 0.7,
    },
  ],
  readings: [
    { id: "g1", text: "انتظر استقرار التدفق.", tts: "انْتَظِرِ اسْتِقْرَارَ التَّدَفُّقِ." },
    { id: "g2", text: "واقرأ المانومتر بمستوى العين.", tts: "وَاقْرَأِ المَانُومِيتَرَ بِمُسْتَوَى العَيْنِ." },
    { id: "g3", text: "وتحقق من عدم وجود تسرب.", tts: "وَتَحَقَّقْ مِنْ عَدَمِ وُجُودِ تَسَرُّبٍ.", hold: 0.3 },
  ],
  shutdown: [
    { id: "s1", text: "للإيقاف: أوقف المضخة، واسمح بالتصريف.", tts: "لِلْإِيقَافِ: أَوْقِفِ المِضَخَّةَ، وَاسْمَحْ بِالتَّصْرِيفِ." },
    { id: "s2", text: "ثم أوقف الهواء، والمفتاح الرئيسي.", tts: "ثُمَّ أَوْقِفِ الهَوَاءَ، وَالمِفْتَاحَ الرَّئِيسِيَّ." },
    { id: "s3", text: "واتبع تعليمات المدرس وإجراءات المختبر.", tts: "وَاتَّبِعْ تَعْلِيمَاتِ المُدَرِّسِ، وَإِجْرَاءَاتِ المُخْتَبَرِ.", hold: 0.4 },
  ],
  end: [],
} satisfies Record<string, Seg[]>;

/** Scenes without narration keep this length (s). */
export const SILENT_SCENE_SECONDS = 2.8;

export type SceneKey = keyof typeof NARRATION;
