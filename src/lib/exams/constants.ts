import type { ExamCategory } from "./types";

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
