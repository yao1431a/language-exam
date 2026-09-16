/**
 * Procedural expansion of the local practice bank.
 * Generates many unique original items (not copyrighted exam content).
 */

import type { BankEntry } from "./providers";

function shuffleInPlace<T>(items: T[]): T[] {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

function optionsWithCorrect(correct: string, wrong: string[]): string[] {
  const uniqueWrong = [...new Set(wrong.filter((item) => item && item !== correct))];
  while (uniqueWrong.length < 3) {
    uniqueWrong.push(`选项${uniqueWrong.length + 1}`);
  }
  return shuffleInPlace([correct, ...uniqueWrong.slice(0, 3)]);
}

const EN_LISTEN_SCRIPTS: {
  audio: string;
  prompt: string;
  correct: string;
  wrong: string[];
}[] = [
  {
    audio:
      "Attention passengers. The express train to Riverside will depart from platform four in seven minutes.",
    prompt: "Where will the express train depart from?",
    correct: "Platform 4",
    wrong: ["Platform 7", "Platform 2", "Gate 4"],
  },
  {
    audio:
      "Good morning. The marketing workshop has moved to Room C on the third floor. Please bring your badges.",
    prompt: "Where is the marketing workshop now?",
    correct: "Room C on the third floor",
    wrong: ["Room C on the second floor", "Room B on the third floor", "The lobby"],
  },
  {
    audio:
      "Your package will arrive between two and four this afternoon. Someone must be available to sign for it.",
    prompt: "What must the customer do?",
    correct: "Be available to sign between 2 and 4 p.m.",
    wrong: ["Pick it up at the warehouse", "Call before noon", "Leave the door unlocked overnight"],
  },
  {
    audio:
      "Due to heavy traffic, the airport shuttle is running approximately fifteen minutes behind schedule.",
    prompt: "What is the delay?",
    correct: "About 15 minutes",
    wrong: ["About 50 minutes", "No delay", "One hour"],
  },
  {
    audio:
      "Please silence your phones. The keynote speech begins at nine thirty sharp in the main auditorium.",
    prompt: "When does the keynote begin?",
    correct: "9:30 a.m.",
    wrong: ["9:13 a.m.", "10:30 a.m.", "8:30 a.m."],
  },
  {
    audio:
      "If you reserved a vegetarian lunch, please collect your meal ticket at desk number two.",
    prompt: "What should vegetarian diners do?",
    correct: "Collect a meal ticket at desk 2",
    wrong: ["Go straight to the cafeteria", "Call the chef", "Sit in section A"],
  },
  {
    audio:
      "The museum opens at ten on weekdays and at nine on weekends. Last entry is one hour before closing.",
    prompt: "When does the museum open on Saturday?",
    correct: "9 a.m.",
    wrong: ["10 a.m.", "11 a.m.", "8 a.m."],
  },
  {
    audio:
      "All connecting passengers for Flight 905 to Boston should proceed immediately to Gate A seventeen.",
    prompt: "Which gate is for Flight 905?",
    correct: "Gate A17",
    wrong: ["Gate A9", "Gate B17", "Gate A15"],
  },
  {
    audio:
      "The library will close early today at five p.m. for staff training. Online renewals remain available.",
    prompt: "Why is the library closing early?",
    correct: "Staff training",
    wrong: ["A public holiday", "Power outage", "Renovation next month"],
  },
  {
    audio:
      "Please leave oversized luggage at the cloakroom beside the east entrance before the tour starts.",
    prompt: "Where should large bags be left?",
    correct: "Cloakroom by the east entrance",
    wrong: ["At the west ticket office", "On the bus", "At the hotel lobby"],
  },
  {
    audio:
      "Our customer service line is open from eight a.m. to eight p.m. Monday through Saturday, closed on Sundays.",
    prompt: "When is customer service closed?",
    correct: "Sundays",
    wrong: ["Saturdays", "Monday mornings", "Weekday evenings"],
  },
  {
    audio:
      "The fire drill will begin in five minutes. Please exit calmly using the stairs, not the elevators.",
    prompt: "How should people exit?",
    correct: "Use the stairs",
    wrong: ["Use the elevators", "Wait in the lobby", "Stay at their desks"],
  },
  {
    audio:
      "Tonight's chemistry seminar is canceled. It will be rescheduled for next Thursday at the same time.",
    prompt: "What happened to the seminar?",
    correct: "It was canceled and moved to next Thursday",
    wrong: ["It starts earlier tonight", "It moved to Friday", "It is online only tonight"],
  },
  {
    audio:
      "Drivers should note that Main Street is closed between Oak and Pine for road repairs until Friday.",
    prompt: "Which street is closed?",
    correct: "Main Street between Oak and Pine",
    wrong: ["Oak Street entirely", "Pine Avenue only", "Main Street after Friday only"],
  },
  {
    audio:
      "To confirm your dental appointment, press one. To reschedule, press two. To speak with a receptionist, press zero.",
    prompt: "What should you press to reschedule?",
    correct: "2",
    wrong: ["1", "0", "9"],
  },
  {
    audio:
      "The hotel breakfast buffet is served from six thirty until ten. Room service is available twenty-four hours.",
    prompt: "Until what time is the buffet served?",
    correct: "10:00 a.m.",
    wrong: ["6:30 a.m.", "Noon", "9:00 a.m."],
  },
  {
    audio:
      "Students must submit lab reports online by midnight on Wednesday. Late work loses ten percent per day.",
    prompt: "What is the deadline?",
    correct: "Wednesday midnight",
    wrong: ["Tuesday midnight", "Wednesday noon", "Friday midnight"],
  },
  {
    audio:
      "Because of strong winds, the ferry service to Harbor Island is suspended until further notice.",
    prompt: "Why is the ferry suspended?",
    correct: "Strong winds",
    wrong: ["Low ticket sales", "Engine maintenance next month", "A holiday schedule"],
  },
  {
    audio:
      "Please pick up your conference badges at registration between seven and nine a.m. Sessions start at nine fifteen.",
    prompt: "When do sessions start?",
    correct: "9:15 a.m.",
    wrong: ["7:00 a.m.", "9:00 a.m.", "8:15 a.m."],
  },
  {
    audio:
      "The store is offering a twenty percent discount on all winter coats through the end of this week only.",
    prompt: "What is on discount?",
    correct: "Winter coats",
    wrong: ["All clothing forever", "Summer shoes", "Electronics"],
  },
];

const EN_CLOZE: { sentence: string; correct: string; wrong: string[] }[] = [
  { sentence: "Please ___ the form before Friday.", correct: "submit", wrong: ["submitting", "submitted", "submission"] },
  { sentence: "The results were ___ than expected.", correct: "better", wrong: ["more good", "best", "good"] },
  { sentence: "She is interested ___ renewable energy.", correct: "in", wrong: ["on", "at", "for"] },
  { sentence: "If it rains, we ___ cancel the picnic.", correct: "will", wrong: ["would", "would have", "are"] },
  { sentence: "The report must be finished ___ Monday.", correct: "by", wrong: ["until", "since", "during"] },
  { sentence: "He has lived here ___ five years.", correct: "for", wrong: ["since", "during", "from"] },
  { sentence: "Neither answer ___ correct.", correct: "is", wrong: ["are", "be", "were"] },
  { sentence: "They succeeded ___ working as a team.", correct: "by", wrong: ["with", "for", "from"] },
  { sentence: "The data ___ carefully analyzed.", correct: "were", wrong: ["was being", "is", "be"] },
  { sentence: "I look forward to ___ from you.", correct: "hearing", wrong: ["hear", "heard", "hears"] },
  { sentence: "The policy applies ___ all employees.", correct: "to", wrong: ["for", "with", "on"] },
  { sentence: "Sales increased ___ 8% last quarter.", correct: "by", wrong: ["with", "at", "to"] },
  { sentence: "She asked me ___ the window.", correct: "to close", wrong: ["closing", "close", "closed"] },
  { sentence: "We should avoid ___ late at night.", correct: "driving", wrong: ["drive", "to driving", "drove"] },
  { sentence: "The meeting was postponed ___ next week.", correct: "until", wrong: ["for", "during", "since"] },
  { sentence: "He is capable ___ solving complex problems.", correct: "of", wrong: ["to", "for", "with"] },
  { sentence: "There ___ several options available.", correct: "are", wrong: ["is", "be", "was"] },
  { sentence: "Please turn ___ your phones during the talk.", correct: "off", wrong: ["on", "out", "down"] },
  { sentence: "The company aims ___ reduce waste.", correct: "to", wrong: ["for", "at", "in"] },
  { sentence: "She apologized ___ being late.", correct: "for", wrong: ["to", "about", "of"] },
  { sentence: "The book is divided ___ three parts.", correct: "into", wrong: ["in", "to", "for"] },
  { sentence: "We need more time ___ finish the project.", correct: "to", wrong: ["for", "in", "at"] },
  { sentence: "His advice was extremely ___.", correct: "valuable", wrong: ["value", "valuably", "valued"] },
  { sentence: "They arrived ___ the airport early.", correct: "at", wrong: ["to", "in", "on"] },
  { sentence: "The problem can be solved ___ cooperation.", correct: "through", wrong: ["during", "among", "under"] },
];

const EN_SYNONYMS: { word: string; correct: string; wrong: string[] }[] = [
  { word: "rapid", correct: "fast", wrong: ["slow", "rare", "calm"] },
  { word: "purchase", correct: "buy", wrong: ["sell", "borrow", "repair"] },
  { word: "assist", correct: "help", wrong: ["ignore", "delay", "argue"] },
  { word: "essential", correct: "necessary", wrong: ["optional", "minor", "random"] },
  { word: "approximate", correct: "roughly", wrong: ["exactly", "never", "rarely"] },
  { word: "commence", correct: "begin", wrong: ["end", "pause", "cancel"] },
  { word: "sufficient", correct: "enough", wrong: ["scarce", "empty", "extra only"] },
  { word: "reluctant", correct: "unwilling", wrong: ["eager", "joyful", "careless"] },
  { word: "precise", correct: "exact", wrong: ["vague", "noisy", "late"] },
  { word: "hazard", correct: "danger", wrong: ["benefit", "habit", "reward"] },
  { word: "decline", correct: "decrease", wrong: ["increase", "remain", "explode"] },
  { word: "obtain", correct: "get", wrong: ["lose", "hide", "avoid"] },
  { word: "prior", correct: "previous", wrong: ["later", "current", "future"] },
  { word: "verify", correct: "confirm", wrong: ["guess", "deny", "invent"] },
  { word: "allocate", correct: "assign", wrong: ["waste", "hide", "delay"] },
  { word: "robust", correct: "strong", wrong: ["fragile", "tiny", "silent"] },
  { word: "clarify", correct: "make clear", wrong: ["confuse", "ignore", "complicate"] },
  { word: "prohibit", correct: "forbid", wrong: ["allow", "encourage", "suggest"] },
  { word: "feasible", correct: "possible", wrong: ["impossible", "illegal", "decorative"] },
  { word: "outcome", correct: "result", wrong: ["cause", "method", "tool"] },
];

const EN_READING: {
  passage: string;
  prompt: string;
  correct: string;
  wrong: string[];
}[] = [
  {
    passage:
      "City officials announced a pilot bike-lane program on two downtown streets. If traffic flow remains stable after six months, the lanes will become permanent.",
    prompt: "What will make the bike lanes permanent?",
    correct: "Stable traffic flow after six months",
    wrong: ["Immediate public votes", "Lower subway fares", "A new mayor"],
  },
  {
    passage:
      "Remote work has reduced commuting time for many employees, yet some managers report weaker informal mentoring for junior staff.",
    prompt: "What concern do some managers raise?",
    correct: "Weaker informal mentoring",
    wrong: ["Longer commuting time", "Higher office rent", "Fewer remote tools"],
  },
  {
    passage:
      "The museum's new exhibit focuses on coastal wildlife. Tickets include an audio guide, and members receive a twenty percent discount.",
    prompt: "What do tickets include?",
    correct: "An audio guide",
    wrong: ["A free meal", "Parking only", "A private tour always"],
  },
  {
    passage:
      "To cut energy costs, the factory will shift non-urgent production to nighttime hours when electricity rates are lower.",
    prompt: "Why shift production to nighttime?",
    correct: "Lower electricity rates",
    wrong: ["More daytime staff", "Higher demand at night", "Noise restrictions only"],
  },
  {
    passage:
      "Although the app is free to download, advanced analytics require a monthly subscription after a fourteen-day trial.",
    prompt: "When do users need a subscription?",
    correct: "After a 14-day trial for advanced analytics",
    wrong: ["Immediately on download", "Only after one year", "Never"],
  },
  {
    passage:
      "Researchers found that students who slept at least seven hours scored higher on memory tests than those who slept five hours or less.",
    prompt: "What is linked to higher memory scores?",
    correct: "Sleeping at least seven hours",
    wrong: ["Sleeping five hours or less", "Skipping breakfast", "Studying all night"],
  },
  {
    passage:
      "The airline will waive change fees for tickets booked before March if travel is affected by severe weather alerts.",
    prompt: "When are change fees waived?",
    correct: "For pre-March tickets affected by severe weather",
    wrong: ["For all tickets forever", "Only for first-class seats", "Never for weather delays"],
  },
  {
    passage:
      "Local farmers' markets now accept digital payments, which organizers say has increased weekend attendance among younger shoppers.",
    prompt: "What change increased younger shoppers' attendance?",
    correct: "Accepting digital payments",
    wrong: ["Higher prices", "Fewer stalls", "Closing on weekends"],
  },
];

export function buildExpandedEnglishBank(): BankEntry[] {
  const items: BankEntry[] = [];

  for (const item of EN_LISTEN_SCRIPTS) {
    items.push({
      type: "listening",
      prompt: item.prompt,
      passage: item.audio,
      audioText: item.audio,
      audioLang: "en-US",
      options: optionsWithCorrect(item.correct, item.wrong),
      correctAnswer: item.correct,
    });
  }

  for (const item of EN_CLOZE) {
    items.push({
      type: "single",
      prompt: `Choose the best word: ${item.sentence}`,
      options: optionsWithCorrect(item.correct, item.wrong),
      correctAnswer: item.correct,
    });
  }

  for (const item of EN_SYNONYMS) {
    items.push({
      type: "single",
      prompt: `Select the closest meaning of '${item.word}'.`,
      options: optionsWithCorrect(item.correct, item.wrong),
      correctAnswer: item.correct,
    });
  }

  for (const item of EN_READING) {
    items.push({
      type: "single",
      prompt: item.prompt,
      passage: item.passage,
      options: optionsWithCorrect(item.correct, item.wrong),
      correctAnswer: item.correct,
    });
  }

  // Variation packs: paraphrase prompts with stable answers for more volume
  const formalPairs = [
    ["Lots of people think the idea is good.", "Many people consider the idea beneficial."],
    ["The company got bigger last year.", "The company expanded last year."],
    ["We need to talk about the problem.", "We need to discuss the issue."],
    ["The numbers went up a lot.", "The figures increased significantly."],
    ["She said no to the offer.", "She declined the offer."],
    ["Please send the file soon.", "Please send the file at your earliest convenience."],
    ["The meeting is about budgets.", "The meeting concerns budget planning."],
    ["He fixed the bug quickly.", "He resolved the defect promptly."],
  ];
  for (const [informal, formal] of formalPairs) {
    items.push({
      type: "single",
      prompt: "Which sentence is more appropriate for formal writing?",
      options: optionsWithCorrect(formal, [
        informal,
        informal.replace(/\.$/, "!"),
        "Yeah, whatever works.",
      ]),
      correctAnswer: formal,
    });
  }

  return items;
}

type JaLevel = "n1" | "n2" | "n3" | "n4" | "n5";

const JA_LISTEN: Record<
  JaLevel,
  { audio: string; prompt: string; correct: string; wrong: string[] }[]
> = {
  n5: [
    {
      audio: "明日の日本語のクラスは、十時からです。教室は二階です。",
      prompt: "クラスは何時からですか。",
      correct: "十時",
      wrong: ["九時", "十一時", "二時"],
    },
    {
      audio: "このバスは駅前に止まります。次は公園です。",
      prompt: "次の停留所はどこですか。",
      correct: "公園",
      wrong: ["駅前", "学校", "病院"],
    },
    {
      audio: "図書館は午前九時から午後五時までです。月曜は休みです。",
      prompt: "図書館が休みの日はどれですか。",
      correct: "月曜日",
      wrong: ["火曜日", "土曜日", "毎日"],
    },
    {
      audio: "田中さんは今、食堂にいます。後で事務所へ行きます。",
      prompt: "田中さんは今どこにいますか。",
      correct: "食堂",
      wrong: ["事務所", "教室", "家"],
    },
    {
      audio: "雨が降っていますから、傘を持って行ってください。",
      prompt: "何を持って行きますか。",
      correct: "傘",
      wrong: ["本", "切符", "かばんだけ"],
    },
  ],
  n4: [
    {
      audio: "会議は三時に始まりますが、資料は二時半までに会議室へ持って来てください。",
      prompt: "資料はいつまでに持って行きますか。",
      correct: "二時半まで",
      wrong: ["三時まで", "四時まで", "今日中"],
    },
    {
      audio: "駅の案内です。一番線は急行、二番線は各駅停車です。",
      prompt: "急行は何番線ですか。",
      correct: "一番線",
      wrong: ["二番線", "三番線", "案内所"],
    },
    {
      audio: "薬局は銀行のとなりにあります。スーパーの前ではありません。",
      prompt: "薬局はどこにありますか。",
      correct: "銀行のとなり",
      wrong: ["スーパーの前", "駅の中", "病院の中"],
    },
    {
      audio: "明日の見学は中止になりました。来週の金曜日に延期します。",
      prompt: "見学はどうなりましたか。",
      correct: "来週金曜に延期",
      wrong: ["明日実施", "来月に変更", "中止のまま"],
    },
  ],
  n3: [
    {
      audio:
        "受付は一階です。会場は二階のホールですが、開始十五分前までに受付を済ませてください。",
      prompt: "受付はどこで行いますか。",
      correct: "一階",
      wrong: ["二階のホール", "地下", "屋外"],
    },
    {
      audio:
        "電車が遅れております。到着は約二十分ほど遅れる見込みです。定期券の払い戻しは行っておりません。",
      prompt: "どのくらい遅れますか。",
      correct: "約二十分",
      wrong: ["約二分", "約一時間", "遅れなし"],
    },
    {
      audio:
        "展示会の整理券は午前十時から配布します。午後は先着順ではなく、整理券が必要です。",
      prompt: "午後の入場に必要なものは何ですか。",
      correct: "整理券",
      wrong: ["学生証だけ", "予約メールだけ", "何もいらない"],
    },
  ],
  n2: [
    {
      audio:
        "本日の説明会は予定より早く終了する見込みです。質疑応答は別室で受け付けますので、希望者は退出後に案内板をご確認ください。",
      prompt: "質疑応答はどこで行いますか。",
      correct: "別室",
      wrong: ["この会場のまま", "オンラインのみ", "翌日"],
    },
    {
      audio:
        "台風の影響で、午後の便は欠航となる可能性があります。最新情報は空港の掲示板か公式アプリでご確認ください。",
      prompt: "乗客は何を確認すべきですか。",
      correct: "掲示板または公式アプリ",
      wrong: ["タクシー乗り場だけ", "ホテルの食堂", "免税店の割引"],
    },
    {
      audio:
        "申請書類に不備がある場合は、メールで連絡します。返信がない場合、一週間後に申請は自動的に取り下げとなります。",
      prompt: "返信がないとどうなりますか。",
      correct: "一週間後に取り下げ",
      wrong: ["すぐに承認", "電話で再連絡のみ", "手数料が戻る"],
    },
  ],
  n1: [
    {
      audio:
        "本講演は都合により開始時刻を繰り下げ、十四時開始といたします。資料は入口で配布し、録音はご遠慮ください。",
      prompt: "開始時刻はどうなりますか。",
      correct: "十四時に繰り下げ",
      wrong: ["予定通り", "中止", "十五時に繰り上げ"],
    },
    {
      audio:
        "混雑緩和のため、入場は時間指定制とします。指定時刻の前後十五分以外は入場できませんのでご注意ください。",
      prompt: "入場できない条件はどれですか。",
      correct: "指定時刻の前後十五分以外",
      wrong: ["指定時刻ぴったりだけ不可", "終日入場可", "会員はいつでも可と明言"],
    },
    {
      audio:
        "研究倫理に関する講習は必修です。未受講の場合、実験室の利用申請は受理されません。オンライン受講も認められます。",
      prompt: "未受講だとどうなりますか。",
      correct: "実験室利用申請が受理されない",
      wrong: ["単位が自動的に増える", "受講不要になる", "オンライン不可"],
    },
  ],
};

const JA_VOCAB: Record<JaLevel, { word: string; reading?: string; meaning: string; wrong: string[] }[]> = {
  n5: [
    { word: "食べる", reading: "たべる", meaning: "吃", wrong: ["喝", "看", "写"] },
    { word: "飲む", reading: "のむ", meaning: "喝", wrong: ["吃", "跑", "听"] },
    { word: "見る", reading: "みる", meaning: "看", wrong: ["听", "说", "买"] },
    { word: "聞く", reading: "きく", meaning: "听", wrong: ["看", "写", "开"] },
    { word: "買う", reading: "かう", meaning: "买", wrong: ["卖", "借", "送"] },
    { word: "行く", reading: "いく", meaning: "去", wrong: ["来", "回", "停"] },
    { word: "来る", reading: "くる", meaning: "来", wrong: ["去", "走", "坐"] },
    { word: "友達", reading: "ともだち", meaning: "朋友", wrong: ["老师", "家人", "客人"] },
    { word: "電車", reading: "でんしゃ", meaning: "电车", wrong: ["飞机", "自行车", "船"] },
    { word: "今日", reading: "きょう", meaning: "今天", wrong: ["昨天", "明天", "每周"] },
    { word: "明日", reading: "あした", meaning: "明天", wrong: ["今天", "昨天", "今年"] },
    { word: "安い", reading: "やすい", meaning: "便宜", wrong: ["贵", "远", "近"] },
    { word: "高い", reading: "たかい", meaning: "高的/贵的", wrong: ["低的", "短的", "小的"] },
    { word: "新しい", reading: "あたらしい", meaning: "新的", wrong: ["旧的", "热的", "冷的"] },
    { word: "古い", reading: "ふるい", meaning: "旧的", wrong: ["新的", "快的", "慢的"] },
  ],
  n4: [
    { word: "予約", reading: "よやく", meaning: "预约", wrong: ["取消", "见面", "旅行"] },
    { word: "連絡", reading: "れんらく", meaning: "联系", wrong: ["忘记", "反对", "比较"] },
    { word: "説明", reading: "せつめい", meaning: "说明", wrong: ["询问", "道歉", "祝贺"] },
    { word: "経験", reading: "けいけん", meaning: "经验", wrong: ["实验", "危险", "机会"] },
    { word: "準備", reading: "じゅんび", meaning: "准备", wrong: ["结束", "开始", "休息"] },
    { word: "特別", reading: "とくべつ", meaning: "特别", wrong: ["普通", "相同", "简单"] },
    { word: "必要", reading: "ひつよう", meaning: "必要", wrong: ["多余", "危险", "有趣"] },
    { word: "便利", reading: "べんり", meaning: "方便", wrong: ["麻烦", "危险", "昂贵"] },
    { word: "危険", reading: "きけん", meaning: "危险", wrong: ["安全", "方便", "有名"] },
    { word: "卒業", reading: "そつぎょう", meaning: "毕业", wrong: ["入学", "请假", "搬家"] },
    { word: "返事", reading: "へんじ", meaning: "答复", wrong: ["提问", "邀请", "拒绝信"] },
    { word: "都合", reading: "つごう", meaning: "方便（情况）", wrong: ["味道", "颜色", "声音"] },
  ],
  n3: [
    { word: "達成", reading: "たっせい", meaning: "达成", wrong: ["放弃", "延迟", "比较"] },
    { word: "確認", reading: "かくにん", meaning: "确认", wrong: ["否认", "猜测", "隐瞒"] },
    { word: "影響", reading: "えいきょう", meaning: "影响", wrong: ["原因", "结果无关", "借口"] },
    { word: "改善", reading: "かいぜん", meaning: "改善", wrong: ["恶化", "维持", "忽视"] },
    { word: "慎重", reading: "しんちょう", meaning: "慎重", wrong: ["轻率", "急躁", "冷淡"] },
    { word: "積極的", reading: "せっきょくてき", meaning: "积极的", wrong: ["消极的", "偶然的", "秘密的"] },
    { word: "深刻", reading: "しんこく", meaning: "严重", wrong: ["轻微", "有趣", "临时"] },
    { word: "提出", reading: "ていしゅつ", meaning: "提交", wrong: ["撤回后销毁", "阅读", "复印"] },
    { word: "環境", reading: "かんきょう", meaning: "环境", wrong: ["性格", "预算", "日程"] },
    { word: "参加", reading: "さんか", meaning: "参加", wrong: ["缺席", "观望", "反对"] },
    { word: "期間", reading: "きかん", meaning: "期间", wrong: ["地点", "金额", "人数"] },
    { word: "理由", reading: "りゆう", meaning: "理由", wrong: ["结果", "方法", "地点"] },
  ],
  n2: [
    { word: "提案", reading: "ていあん", meaning: "提案", wrong: ["否决", "拖延", "忽视"] },
    { word: "検討", reading: "けんとう", meaning: "研讨/研究", wrong: ["即决无视", "庆祝", "逃避"] },
    { word: "優先", reading: "ゆうせん", meaning: "优先", wrong: ["延后", "平等忽视", "禁止"] },
    { word: "効率", reading: "こうりつ", meaning: "效率", wrong: ["浪费", "外观", "气味"] },
    { word: "適切", reading: "てきせつ", meaning: "恰当", wrong: ["不当", "模糊", "夸张"] },
    { word: "明確", reading: "めいかく", meaning: "明确", wrong: ["含糊", "秘密", "临时"] },
    { word: "貢献", reading: "こうけん", meaning: "贡献", wrong: ["损害", "旁观", "索取"] },
    { word: "課題", reading: "かだい", meaning: "课题/问题", wrong: ["答案", "奖励", "假期"] },
    { word: "実施", reading: "じっし", meaning: "实施", wrong: ["中止", "仅讨论", "仅停留在计划"] },
    { word: "交渉", reading: "こうしょう", meaning: "交涉", wrong: ["独断", "沉默", "庆祝"] },
  ],
  n1: [
    { word: "懸念", reading: "けねん", meaning: "担忧", wrong: ["确信", "喜悦", "无関心"] },
    { word: "妥結", reading: "だけつ", meaning: "谈妥", wrong: ["决裂", "无限延期", "无视"] },
    { word: "踏まえる", reading: "ふまえる", meaning: "基于/根据", wrong: ["无视", "推翻", "隐瞒"] },
    { word: "示唆", reading: "しさ", meaning: "暗示/启示", wrong: ["命令", "否认", "嘲笑"] },
    { word: "顕著", reading: "けんちょ", meaning: "显著", wrong: ["微不足道", "隐蔽", "含糊"] },
    { word: "緩和", reading: "かんわ", meaning: "缓和", wrong: ["加剧", "固定", "忽视"] },
    { word: "精緻", reading: "せいち", meaning: "精细", wrong: ["粗糙", "草率", "空洞"] },
    { word: "懸念材料", reading: "けねんざいりょう", meaning: "令人担忧的因素", wrong: ["好消息", "既成事实", "无关细节"] },
    { word: "整合性", reading: "せいごうせい", meaning: "一致性", wrong: ["矛盾性", "偶然性", "趣味性"] },
    { word: "俯瞰", reading: "ふかん", meaning: "俯瞰/综观", wrong: ["只盯细节", "忽视整体", "盲目执行"] },
  ],
};

function buildJaLevelBank(level: JaLevel): BankEntry[] {
  const items: BankEntry[] = [];

  for (const listen of JA_LISTEN[level]) {
    items.push({
      type: "listening",
      prompt: listen.prompt,
      passage: listen.audio,
      audioText: listen.audio,
      audioLang: "ja-JP",
      options: optionsWithCorrect(listen.correct, listen.wrong),
      correctAnswer: listen.correct,
    });
  }

  for (const vocab of JA_VOCAB[level]) {
    const pool = JA_VOCAB[level];
    items.push({
      type: "single",
      prompt: `「${vocab.word}」的意思最接近？`,
      options: optionsWithCorrect(vocab.meaning, vocab.wrong),
      correctAnswer: vocab.meaning,
      explanation: vocab.reading ? `读音：${vocab.reading}` : undefined,
    });

    items.push({
      type: "single",
      prompt: `下列哪个词表示「${vocab.meaning}」？`,
      options: optionsWithCorrect(
        vocab.word,
        pool
          .filter((other) => other.word !== vocab.word)
          .slice(0, 3)
          .map((other) => other.word),
      ),
      correctAnswer: vocab.word,
    });

    if (vocab.reading) {
      items.push({
        type: "single",
        prompt: `「${vocab.word}」的正确读音是？`,
        options: optionsWithCorrect(vocab.reading, [
          vocab.reading.replace(/う$/, "お"),
          vocab.reading.replace(/ん$/, "む"),
          `${vocab.reading}う`,
        ]),
        correctAnswer: vocab.reading,
        explanation: `意思：${vocab.meaning}`,
      });
    }
  }

  // Grammar-style items per level
  const grammar: Record<JaLevel, { prompt: string; correct: string; wrong: string[]; passage?: string }[]> = {
    n5: [
      { prompt: "わたしは学生___。", correct: "です", wrong: ["だます", "であるよ", "でしたか"] },
      { prompt: "本を___ます。", correct: "読み", wrong: ["読む", "読んだ", "読んで"] },
      { prompt: "これは私___かばんです。", correct: "の", wrong: ["を", "が", "に"] },
    ],
    n4: [
      { prompt: "雨が降っている___、出かけます。", correct: "ので", wrong: ["のに", "ても", "たら"] },
      { prompt: "この仕事は明日___終わらせます。", correct: "までに", wrong: ["まで", "までで", "までは"] },
      { prompt: "彼は日本語が上手___なった。", correct: "に", wrong: ["を", "が", "で"] },
    ],
    n3: [
      { prompt: "時間がない___、タクシーで行きましょう。", correct: "から", wrong: ["のでに", "ても", "のに"] },
      { prompt: "彼の説明は分かり___。", correct: "やすい", wrong: ["にくい", "づらい", "がたい"] },
      { prompt: "申請は今日中に___ください。", correct: "出して", wrong: ["出す", "出した", "出させる"] },
    ],
    n2: [
      { prompt: "天候___、試合は決行されます。", correct: "にかかわらず", wrong: ["に沿って", "に応じて", "をめぐって"] },
      { prompt: "結果を___、次の方針を決めたい。", correct: "踏まえ", wrong: ["めぐり", "きっかけに", "ついでに"] },
      { prompt: "彼は忙しい___、手伝ってくれた。", correct: "にもかかわらず", wrong: ["に沿って", "に応じて", "に基づき"] },
    ],
    n1: [
      { prompt: "データ___すれば、改善は明らかだ。", correct: "に照らして", wrong: ["をめぐって", "に沿って", "を皮切りに"] },
      { prompt: "批判___、改革は進めるべきだ。", correct: "をよそに", wrong: ["に沿って", "に応じて", "を兼ねて"] },
      { prompt: "彼の成功は努力___ものだ。", correct: "あっての", wrong: ["ならではの", "ごときの", "ずくめの"] },
    ],
  };

  for (const item of grammar[level]) {
    items.push({
      type: "single",
      prompt: item.prompt,
      passage: item.passage,
      options: optionsWithCorrect(item.correct, item.wrong),
      correctAnswer: item.correct,
    });
  }

  return items;
}

export function buildExpandedJapaneseBank(): Record<string, BankEntry[]> {
  return {
    n1: buildJaLevelBank("n1"),
    n2: buildJaLevelBank("n2"),
    n3: buildJaLevelBank("n3"),
    n4: buildJaLevelBank("n4"),
    n5: buildJaLevelBank("n5"),
  };
}
