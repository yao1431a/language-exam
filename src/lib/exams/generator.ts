import { EXAM_LABELS, SECTION_TEMPLATES } from "./constants";
import { getQuestionBank } from "./question-bank";
import type { ExamCategory, ExamPaper, Question } from "./types";

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickQuestions(
  examType: ExamCategory,
  sectionId: string,
  count: number,
): Question[] {
  const bank = getQuestionBank(examType);
  const selected = shuffle(bank).slice(0, Math.min(count, bank.length));
  const stamp = Date.now();

  return selected.map((item, index) => ({
    ...item,
    id: `mock-${examType}-${sectionId}-${stamp}-${index + 1}`,
    prompt: `[模拟题] ${item.prompt}`,
  }));
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
