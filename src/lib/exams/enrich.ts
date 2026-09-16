import { fetchOpenJlptQuestions, type BankEntry } from "./providers";
import { setEnrichedBank } from "./question-bank";
import { EXAM_LABELS, SECTION_TEMPLATES } from "./constants";
import type { ExamCategory, ExamPaper } from "./types";

const JLPT_TYPES: ExamCategory[] = [
  "jlpt-n1",
  "jlpt-n2",
  "jlpt-n3",
  "jlpt-n4",
  "jlpt-n5",
];

export interface EnrichResult {
  examType: ExamCategory;
  added: number;
  sources: string[];
  error?: string;
}

function buildEnrichedPaper(
  examType: ExamCategory,
  questions: BankEntry[],
): ExamPaper {
  const now = new Date();
  const sections = SECTION_TEMPLATES[examType];
  const perSection = Math.max(8, Math.floor(questions.length / sections.length));

  return {
    id: `${examType}-open-api-${now.toISOString().slice(0, 10)}`,
    examType,
    title: `${EXAM_LABELS[examType]} 开源题库扩充卷 ${now.toLocaleDateString("zh-CN")}`,
    year: now.getFullYear(),
    session: String(now.getMonth() + 1).padStart(2, "0"),
    isOfficial: false,
    isMock: false,
    version: 3,
    createdAt: now.toISOString(),
    downloadedAt: now.toISOString(),
    sections: sections.map((section, sectionIndex) => {
      const slice = questions.slice(
        sectionIndex * perSection,
        sectionIndex * perSection + perSection,
      );
      return {
        ...section,
        questions: slice.map((item, i) => ({
          ...item,
          id: `${examType}-open-${section.id}-q${i + 1}`,
          prompt: `[开源同步] ${item.prompt}`,
        })),
      };
    }),
  };
}

export async function enrichFromOpenApis(
  examTypes: ExamCategory[] = JLPT_TYPES,
): Promise<{ results: EnrichResult[]; papers: ExamPaper[] }> {
  const results: EnrichResult[] = [];
  const papers: ExamPaper[] = [];

  for (const examType of examTypes) {
    if (!examType.startsWith("jlpt-")) {
      results.push({
        examType,
        added: 0,
        sources: [],
        error: "英语考试无公开官方真题 API；已使用本地扩充练习题",
      });
      continue;
    }

    try {
      const { questions, sources } = await fetchOpenJlptQuestions(examType);
      setEnrichedBank(examType, questions);
      if (questions.length > 0) {
        papers.push(buildEnrichedPaper(examType, questions));
      }
      results.push({ examType, added: questions.length, sources });
    } catch (error) {
      results.push({
        examType,
        added: 0,
        sources: [],
        error: error instanceof Error ? error.message : "获取失败",
      });
    }
  }

  return { results, papers };
}
