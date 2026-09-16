import type { ExamCategory, Question } from "./types";
import type { BankEntry } from "./providers";

export type { BankEntry };

const ENGLISH_BANK: BankEntry[] = [
  {
    type: "listening",
    prompt: "According to the announcement, which gate has changed?",
    passage:
      "Attention passengers: Flight 482 to Singapore will now depart from Gate 27 instead of Gate 14.",
    audioText:
      "Attention passengers: Flight 482 to Singapore will now depart from Gate 27 instead of Gate 14.",
    audioLang: "en-US",
    options: ["Gate 14", "Gate 27", "Gate 41", "Gate 9"],
    correctAnswer: "Gate 27",
  },
  {
    type: "listening",
    prompt: "What should early arrivals do first?",
    passage:
      "If you arrive early, go to the registration desk on the second floor. Workshops start at 10 a.m. sharp.",
    audioText:
      "If you arrive early, go to the registration desk on the second floor. Workshops start at 10 a.m. sharp.",
    audioLang: "en-US",
    options: [
      "Register on the second floor before workshops",
      "Start the workshop at 9 a.m.",
      "Skip registration if early",
      "Go to the third floor",
    ],
    correctAnswer: "Register on the second floor before workshops",
  },
  {
    type: "listening",
    prompt: "What time does the meeting start?",
    passage: "Please join us in Conference Room B at a quarter past three this afternoon.",
    audioText:
      "Please join us in Conference Room B at a quarter past three this afternoon.",
    audioLang: "en-US",
    options: ["3:15 p.m.", "2:45 p.m.", "3:45 p.m.", "4:15 p.m."],
    correctAnswer: "3:15 p.m.",
  },
  {
    type: "listening",
    prompt: "What should the customer do next?",
    passage:
      "Your order has shipped. Track it with code X R 441. Contact support only if delivery exceeds five business days.",
    audioText:
      "Your order has shipped. Track it with code X R 441. Contact support only if delivery exceeds five business days.",
    audioLang: "en-US",
    options: [
      "Track the package with XR-441",
      "Call support immediately",
      "Cancel the order",
      "Ignore the tracking code",
    ],
    correctAnswer: "Track the package with XR-441",
  },
  {
    type: "single",
    prompt: "Choose the word that best completes the sentence: The manager asked the team to submit their reports ___ Friday.",
    options: ["by", "until", "since", "during"],
    correctAnswer: "by",
    explanation: "'By Friday' indicates a deadline.",
  },
  {
    type: "single",
    prompt: "Select the synonym of 'meticulous'.",
    options: ["careless", "thorough", "rapid", "casual"],
    correctAnswer: "thorough",
  },
  {
    type: "single",
    prompt: "In academic writing, which sentence is most formal?",
    options: [
      "Lots of folks think climate change is bad.",
      "Climate change poses significant global risks.",
      "Climate change is kinda scary.",
      "Everyone knows the planet is heating up.",
    ],
    correctAnswer: "Climate change poses significant global risks.",
  },
  {
    type: "single",
    prompt: "The quarterly revenue ___ by 12% compared with last year.",
    options: ["increased", "increasing", "increase", "increases"],
    correctAnswer: "increased",
  },
  {
    type: "single",
    prompt: "Please ___ the attached invoice and confirm receipt.",
    options: ["review", "reviewing", "reviewed", "to review"],
    correctAnswer: "review",
  },
  {
    type: "single",
    prompt: "Which option best paraphrases: 'The proposal was rejected due to budget constraints'?",
    options: [
      "The proposal failed because there was not enough money",
      "The proposal succeeded despite costs",
      "The budget was increased for the proposal",
      "The proposal was delayed for more research",
    ],
    correctAnswer: "The proposal failed because there was not enough money",
  },
  {
    type: "single",
    prompt: "Choose the correct preposition: She is responsible ___ marketing in Asia.",
    options: ["for", "of", "to", "with"],
    correctAnswer: "for",
  },
  {
    type: "single",
    prompt: "What does the speaker recommend?",
    passage:
      "If you arrive early, go to the registration desk on the second floor. Workshops start at 10 a.m. sharp.",
    options: [
      "Register on the second floor before workshops",
      "Start the workshop at 9 a.m.",
      "Skip registration if early",
      "Go to the third floor",
    ],
    correctAnswer: "Register on the second floor before workshops",
  },
  {
    type: "single",
    prompt: "Identify the error: 'Neither of the candidates have submitted their forms.'",
    options: [
      "have → has",
      "Neither → None",
      "their → his",
      "No error",
    ],
    correctAnswer: "have → has",
  },
  {
    type: "single",
    prompt: "The word 'mitigate' is closest in meaning to:",
    options: ["worsen", "reduce", "ignore", "celebrate"],
    correctAnswer: "reduce",
  },
  {
    type: "single",
    prompt: "According to the memo, what should employees do first?",
    passage:
      "All staff must update their security passwords by Friday. After updating, notify IT via the portal. Training sessions are optional.",
    options: [
      "Update passwords",
      "Attend training",
      "Call the manager",
      "Ignore the portal",
    ],
    correctAnswer: "Update passwords",
  },
  {
    type: "single",
    prompt: "Choose the best transition: Sales fell in Q1; ___, they recovered strongly in Q2.",
    options: ["however", "therefore", "moreover", "likewise"],
    correctAnswer: "however",
  },
  {
    type: "single",
    prompt: "Which sentence uses the passive voice correctly?",
    options: [
      "The report was completed by the intern.",
      "The intern was completed the report.",
      "The report completed by the intern.",
      "Was completed the report by the intern.",
    ],
    correctAnswer: "The report was completed by the intern.",
  },
  {
    type: "single",
    prompt: "The presentation will focus ___ market trends in Southeast Asia.",
    options: ["on", "in", "at", "to"],
    correctAnswer: "on",
  },
  {
    type: "single",
    prompt: "What is the author's attitude toward electric vehicles?",
    passage:
      "While charging infrastructure remains uneven, falling battery costs and strong policy support make electric vehicles increasingly practical for urban commuters.",
    options: ["Cautiously optimistic", "Strongly opposed", "Indifferent", "Sarcastic"],
    correctAnswer: "Cautiously optimistic",
  },
  {
    type: "single",
    prompt: "Select the correct collocation: make a ___.",
    options: ["decision", "advice", "progresses", "researches"],
    correctAnswer: "decision",
  },
  {
    type: "single",
    prompt: "If the flight is delayed, passengers ___ receive meal vouchers.",
    options: ["will", "would", "should to", "must to"],
    correctAnswer: "will",
  },
  {
    type: "single",
    prompt: "Which word best completes: 'The committee reached a ___ after three hours of debate.'",
    options: ["consensus", "conflict", "confusion", "complaint"],
    correctAnswer: "consensus",
  },
  {
    type: "single",
    prompt: "The antonym of 'scarce' is:",
    options: ["abundant", "rare", "limited", "sparse"],
    correctAnswer: "abundant",
  },
  {
    type: "single",
    prompt: "What time does the meeting start?",
    passage: "Please join us in Conference Room B at a quarter past three this afternoon.",
    options: ["3:15 p.m.", "2:45 p.m.", "3:45 p.m.", "4:15 p.m."],
    correctAnswer: "3:15 p.m.",
  },
  {
    type: "single",
    prompt: "Choose the sentence with correct subject-verb agreement.",
    options: [
      "The list of requirements is long.",
      "The list of requirements are long.",
      "The lists of requirement is long.",
      "The list of requirements be long.",
    ],
    correctAnswer: "The list of requirements is long.",
  },
  {
    type: "single",
    prompt: "In IELTS Writing Task 1, which is most appropriate?",
    options: [
      "The chart shows a steady rise in exports between 2010 and 2020.",
      "I think the chart looks nice.",
      "Exports went up a lot, you know.",
      "As can be seen, stuff increased.",
    ],
    correctAnswer: "The chart shows a steady rise in exports between 2010 and 2020.",
  },
  {
    type: "single",
    prompt: "The phrase 'in light of' is closest to:",
    options: ["considering", "ignoring", "before", "instead of"],
    correctAnswer: "considering",
  },
  {
    type: "single",
    prompt: "Which option is a supporting detail, not the main idea?",
    passage:
      "Urban parks improve public health. For example, a 2023 survey found residents near parks walked 20% more each week.",
    options: [
      "A 2023 survey found residents near parks walked more",
      "Urban parks improve public health",
      "Parks matter for cities",
      "Public health can benefit from green space",
    ],
    correctAnswer: "A 2023 survey found residents near parks walked more",
  },
  {
    type: "single",
    prompt: "Complete: She has been working here ___ 2019.",
    options: ["since", "for", "during", "by"],
    correctAnswer: "since",
  },
  {
    type: "single",
    prompt: "The noun form of 'decide' is:",
    options: ["decision", "decisive", "decidedly", "deciding"],
    correctAnswer: "decision",
  },
  {
    type: "single",
    prompt: "What should the customer do next?",
    passage:
      "Your order has shipped. Track it with code XR-441. Contact support only if delivery exceeds five business days.",
    options: [
      "Track the package with XR-441",
      "Call support immediately",
      "Cancel the order",
      "Ignore the tracking code",
    ],
    correctAnswer: "Track the package with XR-441",
  },
  {
    type: "single",
    prompt: "Choose the most precise academic verb: The study ___ a correlation between sleep and memory.",
    options: ["demonstrates", "says", "talks", "guesses"],
    correctAnswer: "demonstrates",
  },
];

const JAPANESE_BANK: Record<string, BankEntry[]> = {
  n1: [
    {
      type: "listening",
      prompt: "アナウンスの内容として正しいものはどれですか。",
      passage:
        "本日の講演会は会場の都合により、開始時刻を午後一時三十分に変更いたしました。受付は一階ロビーで行います。",
      audioText:
        "本日の講演会は会場の都合により、開始時刻を午後一時三十分に変更いたしました。受付は一階ロビーで行います。",
      audioLang: "ja-JP",
      options: [
        "開始は午後一時半、受付は一階",
        "開始は午前十時、受付は二階",
        "講演会は中止",
        "受付のみ変更",
      ],
      correctAnswer: "開始は午後一時半、受付は一階",
    },
    {
      type: "single",
      prompt: "次の文の（　）に入る最も適切な語を選びなさい：彼の説明は非常に（　）で、聴衆を完全に納得させた。",
      options: ["曖昧", "説得力がある", "単調", "軽率"],
      correctAnswer: "説得力がある",
    },
    {
      type: "single",
      prompt: "「忖度」の読み方として正しいものは？",
      options: ["そんたく", "しんだく", "そんだく", "しんたく"],
      correctAnswer: "そんたく",
    },
    {
      type: "single",
      prompt: "「折衝」に最も近い意味は？",
      options: ["交渉", "散歩", "感謝", "沈黙"],
      correctAnswer: "交渉",
    },
    {
      type: "single",
      prompt: "（　）に入れる語：彼は真相を（　）に話した。",
      options: ["包み隠さず", "ぼんやり", "急いで", "適当に"],
      correctAnswer: "包み隠さず",
    },
    {
      type: "single",
      prompt: "「一蹴する」の意味は？",
      options: ["簡単に退ける", "丁寧に迎える", "一緒に歩く", "深く考える"],
      correctAnswer: "簡単に退ける",
    },
    {
      type: "single",
      prompt: "「齟齬」の読みは？",
      options: ["そご", "そこ", "しょご", "じょご"],
      correctAnswer: "そご",
    },
    {
      type: "single",
      prompt: "文脈理解：会議は紛糾し、結論は先送りになった。この文の意味に近いのは？",
      options: [
        "議論がまとまらず決定が延期された",
        "会議が短く終わった",
        "全員が賛成した",
        "結論がすぐに出た",
      ],
      correctAnswer: "議論がまとまらず決定が延期された",
    },
    {
      type: "single",
      prompt: "「憂慮」に最も近いのは？",
      options: ["心配", "喜び", "無関心", "感謝"],
      correctAnswer: "心配",
    },
  ],
  n2: [
    {
      type: "single",
      prompt: "（　）に入る最適な語：雨が降りそうなので、傘を（　）行きましょう。",
      options: ["持って", "持ち", "持た", "持て"],
      correctAnswer: "持って",
    },
    {
      type: "single",
      prompt: "「検討」の意味として最も近いものは？",
      options: ["すぐ決める", "よく考える", "断る", "忘れる"],
      correctAnswer: "よく考える",
    },
    {
      type: "single",
      prompt: "「締め切り」の読みは？",
      options: ["しめきり", "しめぎり", "けっめきり", "しきり"],
      correctAnswer: "しめきり",
    },
    {
      type: "single",
      prompt: "「〜に限る」の用法として正しいのは？",
      options: ["疲れたときは寝るに限る", "疲れたときは寝るを限る", "疲れたときは寝るが限る", "疲れたときは寝るへ限る"],
      correctAnswer: "疲れたときは寝るに限る",
    },
    {
      type: "single",
      prompt: "「順調」の反対に近い語は？",
      options: ["不調", "完璧", "急速", "豊富"],
      correctAnswer: "不調",
    },
    {
      type: "single",
      prompt: "「提出する」の意味は？",
      options: ["出す・差し出す", "拾う", "隠す", "捨てる"],
      correctAnswer: "出す・差し出す",
    },
    {
      type: "single",
      prompt: "次の敬語として適切なのは？",
      options: ["ご覧になりますか", "見ますか（丁寧ではない）", "見てやる", "見るぞ"],
      correctAnswer: "ご覧になりますか",
    },
    {
      type: "single",
      prompt: "「対策」に最も近い意味は？",
      options: ["対応策", "偶然", "冗談", "風景"],
      correctAnswer: "対応策",
    },
  ],
  n3: [
    {
      type: "single",
      prompt: "「急ぎ」の読み方は？",
      options: ["いそぎ", "きゅうぎ", "はやぎ", "きゅうき"],
      correctAnswer: "いそぎ",
    },
    {
      type: "single",
      prompt: "友達に「お疲れ様」と言うのはどんな場面？",
      options: ["朝の挨拶", "仕事の後", "食事の前", "寝る前"],
      correctAnswer: "仕事の後",
    },
    {
      type: "single",
      prompt: "「予約」の読みは？",
      options: ["よやく", "よやくう", "よあく", "よやくん"],
      correctAnswer: "よやく",
    },
    {
      type: "single",
      prompt: "「〜てしまう」の意味として近いのは？",
      options: ["完了・残念な結果", "これから始める", "禁止する", "勧める"],
      correctAnswer: "完了・残念な結果",
    },
    {
      type: "single",
      prompt: "「連絡」の意味は？",
      options: ["コミュニケーションを取る", "走る", "食べる", "寝る"],
      correctAnswer: "コミュニケーションを取る",
    },
    {
      type: "single",
      prompt: "正しい助詞：駅（　）行きます。",
      options: ["へ / に", "を", "が", "より"],
      correctAnswer: "へ / に",
    },
    {
      type: "single",
      prompt: "「失敗」の反対語に近いのは？",
      options: ["成功", "開始", "増加", "説明"],
      correctAnswer: "成功",
    },
    {
      type: "single",
      prompt: "「説明してください」の丁寧度として適切か？",
      options: ["適切（丁寧依頼）", "失礼すぎる", "命令のみ", "意味不明"],
      correctAnswer: "適切（丁寧依頼）",
    },
  ],
  n4: [
    {
      type: "single",
      prompt: "「図書館」の読み方は？",
      options: ["としょかん", "ずしょかん", "としょけん", "ずしょけん"],
      correctAnswer: "としょかん",
    },
    {
      type: "single",
      prompt: "「昨日は雨でした」の意味は？",
      options: ["It will rain tomorrow", "It rained yesterday", "It is raining now", "It is sunny today"],
      correctAnswer: "It rained yesterday",
    },
    {
      type: "single",
      prompt: "「食べ物」の読みは？",
      options: ["たべもの", "しょくべつ", "たべもつ", "たべもん"],
      correctAnswer: "たべもの",
    },
    {
      type: "single",
      prompt: "正しい文はどれ？",
      options: ["私は学生です", "私は学生だます", "私は学生ですます", "私は学生で"],
      correctAnswer: "私は学生です",
    },
    {
      type: "single",
      prompt: "「電車」の意味は？",
      options: ["train", "bicycle", "airplane", "ship"],
      correctAnswer: "train",
    },
    {
      type: "single",
      prompt: "「〜たい」の使い方：水が（　）。",
      options: ["飲みたい", "飲むたい", "飲んだい", "飲みたいですます"],
      correctAnswer: "飲みたい",
    },
    {
      type: "single",
      prompt: "「病院」の読みは？",
      options: ["びょういん", "びょうえん", "びょいん", "びょうにん"],
      correctAnswer: "びょういん",
    },
    {
      type: "single",
      prompt: "「静か」の反対に近い語は？",
      options: ["うるさい", "美しい", "高い", "新しい"],
      correctAnswer: "うるさい",
    },
  ],
  n5: [
    {
      type: "listening",
      prompt: "アナウンスによると、電車はどのくらい遅れていますか。",
      passage: "三番線の電車は五分ほど遅れております。ご迷惑をおかけします。",
      audioText: "三番線の電車は五分ほど遅れております。ご迷惑をおかけします。",
      audioLang: "ja-JP",
      options: ["三分", "五分", "十分", "遅れなし"],
      correctAnswer: "五分",
    },
    {
      type: "single",
      prompt: "「水」の読み方は？",
      options: ["みず", "かわ", "うみ", "あめ"],
      correctAnswer: "みず",
    },
    {
      type: "single",
      prompt: "「ありがとう」の意味は？",
      options: ["Hello", "Thank you", "Goodbye", "Sorry"],
      correctAnswer: "Thank you",
    },
    {
      type: "single",
      prompt: "「本」の読みは？",
      options: ["ほん", "もと", "き", "はな"],
      correctAnswer: "ほん",
    },
    {
      type: "single",
      prompt: "「猫」の意味は？",
      options: ["cat", "dog", "bird", "fish"],
      correctAnswer: "cat",
    },
    {
      type: "single",
      prompt: "正しい挨拶は？",
      options: ["おはようございます", "おはようございす", "おはようござます", "おはよです"],
      correctAnswer: "おはようございます",
    },
    {
      type: "single",
      prompt: "「一、二、三」の読みは？",
      options: ["いち、に、さん", "ひと、ふた、み", "わん、つー、すりー", "いっ、にい、さん"],
      correctAnswer: "いち、に、さん",
    },
    {
      type: "single",
      prompt: "「学校」の読みは？",
      options: ["がっこう", "がくこう", "がっこ", "がくこうう"],
      correctAnswer: "がっこう",
    },
    {
      type: "single",
      prompt: "「大きい」の反対は？",
      options: ["小さい", "高い", "長い", "新しい"],
      correctAnswer: "小さい",
    },
  ],
};

/** Runtime-enriched questions fetched from open APIs (filled by enrich pipeline). */
let enrichedBank: Partial<Record<ExamCategory, BankEntry[]>> = {};

export function setEnrichedBank(
  examType: ExamCategory,
  questions: BankEntry[],
): void {
  enrichedBank[examType] = questions;
}

export function getEnrichedBank(examType: ExamCategory): BankEntry[] {
  return enrichedBank[examType] ?? [];
}

function jlptLevel(examType: ExamCategory): string {
  return examType.replace("jlpt-", "");
}

export function getLocalQuestionBank(examType: ExamCategory): BankEntry[] {
  if (examType.startsWith("jlpt-")) {
    return JAPANESE_BANK[jlptLevel(examType)] ?? JAPANESE_BANK.n5;
  }
  return ENGLISH_BANK;
}

export function getQuestionBank(examType: ExamCategory): BankEntry[] {
  const local = getLocalQuestionBank(examType);
  const remote = getEnrichedBank(examType);
  if (remote.length === 0) return local;
  return [...remote, ...local];
}

function pickListeningTemplate(
  examType: ExamCategory,
  index: number,
): BankEntry {
  const bank = getQuestionBank(examType);
  const listening = bank.filter(
    (item) =>
      item.type === "listening" ||
      Boolean(item.passage && /gate|flight|meeting|attention|駅|案内|放送/i.test(item.passage)),
  );
  const pool = listening.length > 0 ? listening : bank;
  const template = pool[index % pool.length];
  const isJa = examType.startsWith("jlpt-");
  const audioText =
    template.audioText ||
    template.passage ||
    (isJa
      ? "次のアナウンスを聞いてください。駅の案内放送です。三番線の電車は五分遅れです。"
      : "Attention passengers. The express train to Central Station will depart from platform 3 in five minutes.");

  return {
    ...template,
    type: "listening",
    audioText,
    audioLang: isJa ? "ja-JP" : "en-US",
    passage: template.passage,
  };
}

export function createQuestion(
  examType: ExamCategory,
  sectionId: string,
  index: number,
  year: number,
  session: string,
): Question {
  const isListening = sectionId === "listening";
  const template = isListening
    ? pickListeningTemplate(examType, index)
    : getQuestionBank(examType)[index % getQuestionBank(examType).length];

  return {
    ...template,
    id: `${examType}-${year}-${session}-${sectionId}-q${index + 1}`,
    prompt: `[${year}/${session}] ${template.prompt}`,
    type: isListening ? "listening" : template.type,
  };
}

export function bankSize(examType: ExamCategory): {
  local: number;
  enriched: number;
  total: number;
} {
  const local = getLocalQuestionBank(examType).length;
  const enriched = getEnrichedBank(examType).length;
  return { local, enriched, total: local + enriched };
}
