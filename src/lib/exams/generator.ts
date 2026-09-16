import {
  EXAM_LABELS,
  PRACTICE_SKILL_LABELS,
  SECTION_TEMPLATES,
  SKILL_SECTION_MAP,
  type PracticeSkill,
} from "./catalog";
import { createQuestion } from "./question-bank";
import type { ExamCategory, ExamPaper, Question } from "./types";

function pickQuestions(
  examType: ExamCategory,
  sectionId: string,
  count: number,
): Question[] {
  const stamp = Date.now();
  return Array.from({ length: count }, (_, index) => {
    const question = createQuestion(examType, sectionId, index, 2025, "mock");
    return {
      ...question,
      id: `mock-${examType}-${sectionId}-${stamp}-${index + 1}`,
      prompt: question.prompt.replace(/^\[\d+\/\w+\]/, "[模拟题]"),
    };
  });
}

export function generateMockPaper(
  examType: ExamCategory,
  questionCount = 10,
): ExamPaper {
  const sections = SECTION_TEMPLATES[examType];
  const perSection = Math.max(2, Math.floor(questionCount / sections.length));
  const now = new Date();

  return {
    id: `mock-${examType}-${now.getTime()}`,
    examType,
    title: `${EXAM_LABELS[examType]} 模拟试卷 ${now.toLocaleDateString("zh-CN")}`,
    year: now.getFullYear(),
    session: String(now.getMonth() + 1).padStart(2, "0"),
    isOfficial: false,
    isMock: true,
    version: 1,
    createdAt: now.toISOString(),
    sections: sections.map((section) => ({
      ...section,
      questions: pickQuestions(examType, section.id, perSection),
    })),
  };
}

export function generatePracticePaper(
  examType: ExamCategory,
  skill: PracticeSkill,
  questionCount = 10,
): ExamPaper {
  const sectionIds = SKILL_SECTION_MAP[skill];
  const templates = SECTION_TEMPLATES[examType].filter((section) =>
    sectionIds.includes(section.id),
  );
  const sections =
    templates.length > 0
      ? templates
      : [
          {
            id: skill,
            name: PRACTICE_SKILL_LABELS[skill],
            durationMinutes: 20,
          },
        ];

  const perSection = Math.max(
    3,
    Math.ceil(questionCount / Math.max(sections.length, 1)),
  );
  const now = new Date();

  return {
    id: `practice-${examType}-${skill}-${now.getTime()}`,
    examType,
    title: `${EXAM_LABELS[examType]} · ${PRACTICE_SKILL_LABELS[skill]}专项`,
    year: now.getFullYear(),
    session: String(now.getMonth() + 1).padStart(2, "0"),
    isOfficial: false,
    isMock: true,
    version: 1,
    createdAt: now.toISOString(),
    sections: sections.map((section) => ({
      ...section,
      name: PRACTICE_SKILL_LABELS[skill],
      questions: pickQuestions(examType, section.id, perSection),
    })),
  };
}

export function scorePaper(
  paper: ExamPaper,
  answers: Record<string, string | string[]>,
): { correct: number; total: number; score: number } {
  const questions = paper.sections.flatMap((section) => section.questions);
  let correct = 0;

  for (const question of questions) {
    const given = answers[question.id];
    const expected = question.correctAnswer;
    const match = Array.isArray(expected)
      ? Array.isArray(given) &&
        expected.length === given.length &&
        expected.every((value) => given.includes(value))
      : given === expected;
    if (match) correct += 1;
  }

  const total = questions.length;
  const score = total === 0 ? 0 : Math.round((correct / total) * 100);
  return { correct, total, score };
}
