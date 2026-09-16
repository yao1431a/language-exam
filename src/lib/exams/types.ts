export type ExamCategory =
  | "toeic"
  | "toefl"
  | "ielts"
  | "jlpt-n1"
  | "jlpt-n2"
  | "jlpt-n3"
  | "jlpt-n4"
  | "jlpt-n5";

export type QuestionType = "single" | "multiple" | "text" | "listening";

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  passage?: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
}

export interface ExamSection {
  id: string;
  name: string;
  durationMinutes: number;
  questions: Question[];
}

export interface ExamPaper {
  id: string;
  examType: ExamCategory;
  title: string;
  year: number;
  session: string;
  isOfficial: boolean;
  isMock: boolean;
  version: number;
  sections: ExamSection[];
  createdAt: string;
  downloadedAt?: string;
}

export interface ExamMeta {
  id: string;
  examType: ExamCategory;
  title: string;
  year: number;
  session: string;
  isOfficial: boolean;
  isMock: boolean;
  version: number;
  questionCount: number;
  downloadedAt?: string;
}

export interface SyncPayload {
  latestPapers: ExamPaper[];
  serverTime: string;
  catalogVersion: number;
  attribution?: string[];
  bankStats?: Record<string, { local: number; enriched: number; total: number }>;
}

export interface MockGenerateRequest {
  examType: ExamCategory;
  questionCount?: number;
  sections?: string[];
}

export interface ExamAttempt {
  id: string;
  paperId: string;
  examType: ExamCategory;
  startedAt: string;
  finishedAt?: string;
  answers: Record<string, string | string[]>;
  score?: number;
  totalQuestions: number;
}
