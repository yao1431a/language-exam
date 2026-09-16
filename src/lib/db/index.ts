import Dexie, { type EntityTable } from "dexie";
import type { ExamAttempt, ExamMeta, ExamPaper } from "@/lib/exams/types";
import { buildAllSeedPapers } from "@/lib/exams/seed";

class LanguageExamDB extends Dexie {
  papers!: EntityTable<ExamPaper, "id">;
  meta!: EntityTable<ExamMeta, "id">;
  attempts!: EntityTable<ExamAttempt, "id">;
  settings!: EntityTable<{ key: string; value: string }, "key">;

  constructor() {
    super("LanguageExamDB");
    this.version(1).stores({
      papers: "id, examType, year, session, isOfficial, isMock",
      meta: "id, examType, year, session, isOfficial, isMock",
      attempts: "id, paperId, examType, startedAt",
      settings: "key",
    });
  }
}

export const db = new LanguageExamDB();

function toMeta(paper: ExamPaper): ExamMeta {
  const questionCount = paper.sections.reduce(
    (sum, section) => sum + section.questions.length,
    0,
  );
  return {
    id: paper.id,
    examType: paper.examType,
    title: paper.title,
    year: paper.year,
    session: paper.session,
    isOfficial: paper.isOfficial,
    isMock: paper.isMock,
    version: paper.version,
    questionCount,
    downloadedAt: paper.downloadedAt,
  };
}

export async function ensureSeedData(): Promise<number> {
  const count = await db.papers.count();
  if (count > 0) return count;

  const papers = buildAllSeedPapers();
  await db.transaction("rw", db.papers, db.meta, async () => {
    await db.papers.bulkPut(papers);
    await db.meta.bulkPut(papers.map(toMeta));
    await db.settings.put({ key: "seedVersion", value: "1" });
    await db.settings.put({
      key: "seededAt",
      value: new Date().toISOString(),
    });
  });

  return papers.length;
}

export async function upsertPaper(paper: ExamPaper): Promise<void> {
  await db.transaction("rw", db.papers, db.meta, async () => {
    await db.papers.put(paper);
    await db.meta.put(toMeta(paper));
  });
}

export async function listPapersByType(examType: string): Promise<ExamPaper[]> {
  return db.papers.where("examType").equals(examType).reverse().sortBy("year");
}

export async function getPaper(id: string): Promise<ExamPaper | undefined> {
  return db.papers.get(id);
}

export async function listAllMeta(): Promise<ExamMeta[]> {
  return db.meta.orderBy("year").reverse().toArray();
}

export async function saveAttempt(attempt: ExamAttempt): Promise<void> {
  await db.attempts.put(attempt);
}

export async function getSetting(key: string): Promise<string | undefined> {
  const row = await db.settings.get(key);
  return row?.value;
}

export async function setSetting(key: string, value: string): Promise<void> {
  await db.settings.put({ key, value });
}
