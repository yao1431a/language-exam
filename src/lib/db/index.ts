import Dexie, { type EntityTable } from "dexie";
import type { ExamAttempt, ExamMeta, ExamPaper } from "@/lib/exams/types";
import { buildAllSeedPapers } from "@/lib/exams/seed";

const DB_NAME = "LanguageExamDB";
const CURRENT_SEED_VERSION = "4";
/** Keep >= any schema version previously opened on this origin. */
const SCHEMA_VERSION = 11;

class LanguageExamDB extends Dexie {
  papers!: EntityTable<ExamPaper, "id">;
  meta!: EntityTable<ExamMeta, "id">;
  attempts!: EntityTable<ExamAttempt, "id">;
  settings!: EntityTable<{ key: string; value: string }, "key">;

  constructor() {
    super(DB_NAME);
    this.version(SCHEMA_VERSION).stores({
      papers: "id, examType, year, session, isOfficial, isMock",
      meta: "id, examType, year, session, isOfficial, isMock",
      attempts: "id, paperId, examType, startedAt",
      settings: "key",
    });
  }
}

export const db = new LanguageExamDB();

let readyPromise: Promise<void> | null = null;
let seedPromise: Promise<number> | null = null;

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

async function resetDatabase(): Promise<void> {
  try {
    db.close();
  } catch {
    // ignore
  }
  await Dexie.delete(DB_NAME);
}

function storesReady(): boolean {
  try {
    const native = (
      db as unknown as { backendDB: () => IDBDatabase }
    ).backendDB();
    return (
      native.objectStoreNames.contains("papers") &&
      native.objectStoreNames.contains("meta") &&
      native.objectStoreNames.contains("attempts") &&
      native.objectStoreNames.contains("settings")
    );
  } catch {
    return false;
  }
}

async function openWithTimeout(ms = 8000): Promise<void> {
  await Promise.race([
    db.open(),
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("打开本地题库超时")), ms);
    }),
  ]);
}

export async function ensureDatabaseReady(): Promise<void> {
  if (!readyPromise) {
    readyPromise = (async () => {
      try {
        await openWithTimeout();
        if (!storesReady()) {
          throw new Error("本地题库结构损坏");
        }
      } catch {
        await resetDatabase();
        await openWithTimeout();
        if (!storesReady()) {
          throw new Error("无法初始化本地题库");
        }
      }
    })().catch((error) => {
      readyPromise = null;
      throw error;
    });
  }
  return readyPromise;
}

async function seedCatalog(): Promise<number> {
  await ensureDatabaseReady();

  const seedVersion = (await db.settings.get("seedVersion"))?.value;
  const count = await db.papers.count();

  if (count > 0 && seedVersion === CURRENT_SEED_VERSION) {
    return count;
  }

  const papers = buildAllSeedPapers();
  await db.transaction("rw", db.papers, db.meta, db.settings, async () => {
    const existing = await db.papers.toArray();
    const keep = existing.filter(
      (paper) => paper.isMock || paper.id.includes("open-api"),
    );
    await db.papers.clear();
    await db.meta.clear();
    await db.papers.bulkPut([...papers, ...keep]);
    await db.meta.bulkPut([...papers, ...keep].map(toMeta));
    await db.settings.put({ key: "seedVersion", value: CURRENT_SEED_VERSION });
    await db.settings.put({
      key: "seededAt",
      value: new Date().toISOString(),
    });
  });

  return papers.length;
}

export async function ensureSeedData(): Promise<number> {
  if (!seedPromise) {
    seedPromise = seedCatalog().catch((error) => {
      seedPromise = null;
      throw error;
    });
  }
  return seedPromise;
}

export async function upsertPaper(paper: ExamPaper): Promise<void> {
  await ensureDatabaseReady();
  await db.transaction("rw", db.papers, db.meta, async () => {
    await db.papers.put(paper);
    await db.meta.put(toMeta(paper));
  });
}

export async function listPapersByType(examType: string): Promise<ExamPaper[]> {
  await ensureDatabaseReady();
  return db.papers.where("examType").equals(examType).reverse().sortBy("year");
}

export async function getPaper(id: string): Promise<ExamPaper | undefined> {
  await ensureDatabaseReady();
  return db.papers.get(id);
}

export async function listAllMeta(): Promise<ExamMeta[]> {
  await ensureDatabaseReady();
  return db.meta.orderBy("year").reverse().toArray();
}

export async function saveAttempt(attempt: ExamAttempt): Promise<void> {
  await ensureDatabaseReady();
  await db.attempts.put(attempt);
}

export async function getSetting(key: string): Promise<string | undefined> {
  await ensureDatabaseReady();
  const row = await db.settings.get(key);
  return row?.value;
}

export async function setSetting(key: string, value: string): Promise<void> {
  await ensureDatabaseReady();
  await db.settings.put({ key, value });
}
