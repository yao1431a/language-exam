import type { ExamCategory } from "./types";

export type LanguageId = "en" | "ja" | "ko" | "fr" | "de" | "zh";

export type PracticeSkill =
  | "listening"
  | "reading"
  | "vocab"
  | "grammar"
  | "writing"
  | "speaking";

export interface PracticeModule {
  id: PracticeSkill;
  label: string;
  description: string;
}

export interface ExamDefinition {
  id: string;
  category?: ExamCategory;
  name: string;
  shortName: string;
  description: string;
  levels?: { id: ExamCategory; label: string }[];
  skills: PracticeModule[];
  available: boolean;
}

export interface LanguageDefinition {
  id: LanguageId;
  name: string;
  nameEn: string;
  tagline: string;
  accent: string;
  available: boolean;
  exams: ExamDefinition[];
}

export const PRACTICE_SKILL_LABELS: Record<PracticeSkill, string> = {
  listening: "听力",
  reading: "阅读",
  vocab: "词汇",
  grammar: "语法",
  writing: "写作",
  speaking: "口语",
};

const ENGLISH_SKILLS: PracticeModule[] = [
  { id: "listening", label: "听力", description: "公告、对话与讲座理解" },
  { id: "reading", label: "阅读", description: "篇章理解与信息定位" },
  { id: "vocab", label: "词汇语法", description: "搭配、词义与句式" },
  { id: "writing", label: "写作", description: "学术与商务书面表达" },
  { id: "speaking", label: "口语", description: "回答与口头论述" },
];

const JLPT_SKILLS: PracticeModule[] = [
  { id: "vocab", label: "文字·词汇", description: "汉字读音与词义" },
  { id: "grammar", label: "语法", description: "句型与敬语" },
  { id: "reading", label: "阅读", description: "短文与长文理解" },
  { id: "listening", label: "听力", description: "会话与说明文听力" },
];

export const LANGUAGES: LanguageDefinition[] = [
  {
    id: "en",
    name: "英语",
    nameEn: "English",
    tagline: "商务、学术与移民类官方考试",
    accent: "#0f6e56",
    available: true,
    exams: [
      {
        id: "toeic",
        category: "toeic",
        name: "托业 TOEIC",
        shortName: "TOEIC",
        description: "职场英语听读能力",
        available: true,
        skills: ENGLISH_SKILLS.filter((s) =>
          ["listening", "reading", "vocab"].includes(s.id),
        ),
      },
      {
        id: "toefl",
        category: "toefl",
        name: "托福 TOEFL iBT",
        shortName: "TOEFL",
        description: "留学学术英语四科",
        available: true,
        skills: ENGLISH_SKILLS,
      },
      {
        id: "ielts",
        category: "ielts",
        name: "雅思 IELTS",
        shortName: "IELTS",
        description: "留学与移民英语四科",
        available: true,
        skills: ENGLISH_SKILLS,
      },
    ],
  },
  {
    id: "ja",
    name: "日语",
    nameEn: "Japanese",
    tagline: "日本语能力测试 JLPT",
    accent: "#b45309",
    available: true,
    exams: [
      {
        id: "jlpt",
        name: "日语能力测试 JLPT",
        shortName: "JLPT",
        description: "选择级别后练习真题与专项",
        available: true,
        levels: [
          { id: "jlpt-n1", label: "N1" },
          { id: "jlpt-n2", label: "N2" },
          { id: "jlpt-n3", label: "N3" },
          { id: "jlpt-n4", label: "N4" },
          { id: "jlpt-n5", label: "N5" },
        ],
        skills: JLPT_SKILLS,
      },
    ],
  },
  {
    id: "ko",
    name: "韩语",
    nameEn: "Korean",
    tagline: "TOPIK 等主流考试即将开放",
    accent: "#1d4ed8",
    available: false,
    exams: [
      {
        id: "topik",
        name: "TOPIK",
        shortName: "TOPIK",
        description: "韩国语能力考试",
        available: false,
        skills: JLPT_SKILLS,
      },
    ],
  },
  {
    id: "fr",
    name: "法语",
    nameEn: "French",
    tagline: "DELF / DALF 即将开放",
    accent: "#0369a1",
    available: false,
    exams: [
      {
        id: "delf",
        name: "DELF / DALF",
        shortName: "DELF",
        description: "法语能力文凭",
        available: false,
        skills: ENGLISH_SKILLS,
      },
    ],
  },
  {
    id: "de",
    name: "德语",
    nameEn: "German",
    tagline: "Goethe / TestDaF 即将开放",
    accent: "#9a3412",
    available: false,
    exams: [
      {
        id: "goethe",
        name: "Goethe-Zertifikat",
        shortName: "Goethe",
        description: "歌德学院德语考试",
        available: false,
        skills: ENGLISH_SKILLS,
      },
    ],
  },
  {
    id: "zh",
    name: "汉语",
    nameEn: "Chinese",
    tagline: "HSK 即将开放",
    accent: "#be123c",
    available: false,
    exams: [
      {
        id: "hsk",
        name: "HSK",
        shortName: "HSK",
        description: "汉语水平考试",
        available: false,
        skills: JLPT_SKILLS,
      },
    ],
  },
];

export function getLanguage(id: string): LanguageDefinition | undefined {
  return LANGUAGES.find((lang) => lang.id === id);
}

export function findExamInLanguage(
  languageId: string,
  examId: string,
): ExamDefinition | undefined {
  return getLanguage(languageId)?.exams.find((exam) => exam.id === examId);
}

export function getExamByCategory(
  category: ExamCategory,
): { language: LanguageDefinition; exam: ExamDefinition } | undefined {
  for (const language of LANGUAGES) {
    for (const exam of language.exams) {
      if (exam.category === category) return { language, exam };
      if (exam.levels?.some((level) => level.id === category)) {
        return { language, exam };
      }
    }
  }
  return undefined;
}

export function resolveExamCategories(exam: ExamDefinition): ExamCategory[] {
  if (exam.levels?.length) return exam.levels.map((level) => level.id);
  if (exam.category) return [exam.category];
  return [];
}

export const EXAM_LABELS: Record<ExamCategory, string> = {
  toeic: "托业 TOEIC",
  toefl: "托福 TOEFL iBT",
  ielts: "雅思 IELTS",
  "jlpt-n1": "日语 JLPT N1",
  "jlpt-n2": "日语 JLPT N2",
  "jlpt-n3": "日语 JLPT N3",
  "jlpt-n4": "日语 JLPT N4",
  "jlpt-n5": "日语 JLPT N5",
};

export const EXAM_DESCRIPTIONS: Record<ExamCategory, string> = {
  toeic: "商务英语能力测试，侧重听力和阅读",
  toefl: "学术英语能力测试，含阅读、听力、口语、写作",
  ielts: "国际英语语言测试，含听说读写四科",
  "jlpt-n1": "日语能力测试最高级，理解复杂日语",
  "jlpt-n2": "日语能力测试高级，理解日常与专业日语",
  "jlpt-n3": "日语能力测试中级，日常交流",
  "jlpt-n4": "日语能力测试初中级，基础会话",
  "jlpt-n5": "日语能力测试入门级，基础词汇与语法",
};

export const EXAM_GROUPS = [
  {
    id: "english",
    label: "英语考试",
    types: ["toeic", "toefl", "ielts"] as ExamCategory[],
  },
  {
    id: "japanese",
    label: "日语 JLPT",
    types: [
      "jlpt-n1",
      "jlpt-n2",
      "jlpt-n3",
      "jlpt-n4",
      "jlpt-n5",
    ] as ExamCategory[],
  },
];

export const YEARS = [2021, 2022, 2023, 2024, 2025];

export const SESSIONS_BY_EXAM: Partial<Record<ExamCategory, string[]>> = {
  toeic: ["01", "03", "05", "07", "09", "11"],
  toefl: ["01", "04", "07", "10"],
  ielts: ["01", "04", "07", "10"],
  "jlpt-n1": ["07", "12"],
  "jlpt-n2": ["07", "12"],
  "jlpt-n3": ["07", "12"],
  "jlpt-n4": ["07", "12"],
  "jlpt-n5": ["07", "12"],
};

export const SECTION_TEMPLATES: Record<
  ExamCategory,
  { id: string; name: string; durationMinutes: number }[]
> = {
  toeic: [
    { id: "listening", name: "听力 Listening", durationMinutes: 45 },
    { id: "reading", name: "阅读 Reading", durationMinutes: 75 },
  ],
  toefl: [
    { id: "reading", name: "阅读 Reading", durationMinutes: 35 },
    { id: "listening", name: "听力 Listening", durationMinutes: 36 },
    { id: "speaking", name: "口语 Speaking", durationMinutes: 16 },
    { id: "writing", name: "写作 Writing", durationMinutes: 29 },
  ],
  ielts: [
    { id: "listening", name: "听力 Listening", durationMinutes: 30 },
    { id: "reading", name: "阅读 Reading", durationMinutes: 60 },
    { id: "writing", name: "写作 Writing", durationMinutes: 60 },
    { id: "speaking", name: "口语 Speaking", durationMinutes: 15 },
  ],
  "jlpt-n1": [
    { id: "vocab", name: "语言知识·文字·词汇", durationMinutes: 60 },
    { id: "reading", name: "阅读", durationMinutes: 60 },
    { id: "listening", name: "听力", durationMinutes: 60 },
  ],
  "jlpt-n2": [
    { id: "vocab", name: "语言知识·文字·词汇", durationMinutes: 60 },
    { id: "reading", name: "阅读", durationMinutes: 60 },
    { id: "listening", name: "听力", durationMinutes: 60 },
  ],
  "jlpt-n3": [
    { id: "vocab", name: "语言知识", durationMinutes: 30 },
    { id: "reading", name: "阅读", durationMinutes: 70 },
    { id: "listening", name: "听力", durationMinutes: 40 },
  ],
  "jlpt-n4": [
    { id: "vocab", name: "语言知识", durationMinutes: 30 },
    { id: "reading", name: "阅读", durationMinutes: 60 },
    { id: "listening", name: "听力", durationMinutes: 35 },
  ],
  "jlpt-n5": [
    { id: "vocab", name: "语言知识", durationMinutes: 25 },
    { id: "reading", name: "阅读", durationMinutes: 50 },
    { id: "listening", name: "听力", durationMinutes: 30 },
  ],
};

export const SKILL_SECTION_MAP: Record<PracticeSkill, string[]> = {
  listening: ["listening"],
  reading: ["reading"],
  vocab: ["vocab", "reading"],
  grammar: ["vocab"],
  writing: ["writing"],
  speaking: ["speaking"],
};
