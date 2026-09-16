import type { ExamCategory, Question } from "./types";

type BankEntry = Omit<Question, "id">;

const ENGLISH_BANK: BankEntry[] = [
  {
    type: "single",
    prompt: "Choose the word that best completes the sentence: The manager asked the team to submit their reports ___ Friday.",
    options: ["by", "until", "since", "during"],
    correctAnswer: "by",
    explanation: "'By Friday' indicates a deadline.",
  },
  {
    type: "single",
    prompt: "What is the main idea of the passage about remote work?",
    passage:
      "Companies worldwide have adopted hybrid schedules, balancing office collaboration with home flexibility. Surveys show productivity often rises when employees control their environment.",
    options: [
      "Remote work eliminates all office costs",
      "Hybrid models blend flexibility with collaboration",
      "Employees dislike working from home",
      "Productivity always decreases remotely",
    ],
    correctAnswer: "Hybrid models blend flexibility with collaboration",
  },
  {
    type: "single",
    prompt: "Listen to the announcement: Which gate has changed?",
    passage: "Attention passengers: Flight 482 to Singapore will now depart from Gate 27 instead of Gate 14.",
    options: ["Gate 14", "Gate 27", "Gate 41", "Gate 9"],
    correctAnswer: "Gate 27",
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
];

const JAPANESE_BANK: Record<string, BankEntry[]> = {
  n1: [
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
  ],
  n5: [
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
  ],
};

function jlptLevel(examType: ExamCategory): string {
  return examType.replace("jlpt-", "");
}

export function getQuestionBank(examType: ExamCategory): BankEntry[] {
  if (examType.startsWith("jlpt-")) {
    return JAPANESE_BANK[jlptLevel(examType)] ?? JAPANESE_BANK.n5;
  }
  return ENGLISH_BANK;
}

export function createQuestion(
  examType: ExamCategory,
  sectionId: string,
  index: number,
  year: number,
  session: string,
): Question {
  const bank = getQuestionBank(examType);
  const template = bank[index % bank.length];
  return {
    ...template,
    id: `${examType}-${year}-${session}-${sectionId}-q${index + 1}`,
    prompt: `[${year}/${session}] ${template.prompt}`,
  };
}
