import { EXAM_LABELS, SECTION_TEMPLATES, SESSIONS_BY_EXAM, YEARS } from "./constants";
import { createQuestion } from "./question-bank";
import type { ExamCategory, ExamPaper } from "./types";

const QUESTIONS_PER_SECTION = 10;

export function buildOfficialPaper(
  examType: ExamCategory,
  year: number,
  session: string,
): ExamPaper {
  const sections = SECTION_TEMPLATES[examType].map((section) => ({
    ...section,
    questions: Array.from({ length: QUESTIONS_PER_SECTION }, (_, i) =>
      createQuestion(examType, section.id, i, year, session),
    ),
  }));

  const sessionLabel = session === "07" ? "7月" : session === "12" ? "12月" : `${session}月`;

  return {
    id: `${examType}-${year}-${session}`,
    examType,
    title: `${EXAM_LABELS[examType]} ${year}年${sessionLabel} 真题（练习版）`,
    year,
    session,
    isOfficial: true,
    isMock: false,
    version: 1,
    sections,
    createdAt: new Date(`${year}-${session.padStart(2, "0")}-01`).toISOString(),
  };
}

export function buildAllSeedPapers(): ExamPaper[] {
  const papers: ExamPaper[] = [];
  const examTypes = Object.keys(SECTION_TEMPLATES) as ExamCategory[];

  for (const examType of examTypes) {
    const sessions = SESSIONS_BY_EXAM[examType] ?? ["01"];
    for (const year of YEARS) {
      for (const session of sessions) {
        papers.push(buildOfficialPaper(examType, year, session));
      }
    }
  }

  return papers;
}

export function buildLatestPaper(examType: ExamCategory): ExamPaper {
  const sessions = SESSIONS_BY_EXAM[examType] ?? ["12"];
  const latestSession = sessions[sessions.length - 1];
  const paper = buildOfficialPaper(examType, 2025, latestSession);
  return {
    ...paper,
    version: 2,
    title: `${EXAM_LABELS[examType]} 2025年最新真题（练习版）`,
    downloadedAt: new Date().toISOString(),
  };
}
