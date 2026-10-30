import Dexie, { type EntityTable } from "dexie";
import type {
  CoachNote,
  DailyPlan,
  SessionMode,
  SpeakingSession,
  VocabCard,
} from "@/lib/coach/types";
import { createDailyPlan } from "@/lib/coach/plan";
import type { ExamAttempt, ExamMeta, ExamPaper } from "@/lib/exams/types";
import { buildAllSeedPapers } from "@/lib/exams/seed";
import { buildSeedCards, isDue } from "@/lib/vocab/srs";

const DB_NAME = "FluencyLabDB";
const CURRENT_SEED_VERSION = "fl-1";
const SCHEMA_VERSION = 1;

class FluencyLabDB extends Dexie {
  papers!: EntityTable<ExamPaper, "id">;
  meta!: EntityTable<ExamMeta, "id">;
  attempts!: EntityTable<ExamAttempt, "id">;
  settings!: EntityTable<{ key: string; value: string }, "key">;
  vocabCards!: EntityTable<VocabCard, "id">;
  speakingSessions!: EntityTable<SpeakingSession, "id">;
  coachNotes!: EntityTable<CoachNote, "id">;
  dailyPlans!: EntityTable<DailyPlan, "id">;

  constructor() {
    super(DB_NAME);
    this.version(SCHEMA_VERSION).stores({
      papers: "id, examType, year, session, isOfficial, isMock",
      meta: "id, examType, year, session, isOfficial, isMock",
      attempts: "id, paperId, examType, startedAt",
      settings: "key",
      vocabCards: "id, theme, dueAt",
      speakingSessions: "id, part, createdAt, promptId",
      coachNotes: "id, kind, dueAt, mastered, createdAt",
      dailyPlans: "id, date, mode",
    });
  }
}

export const db = new FluencyLabDB();

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
      native.objectStoreNames.contains("vocabCards") &&
      native.objectStoreNames.contains("speakingSessions") &&
      native.objectStoreNames.contains("coachNotes") &&
      native.objectStoreNames.contains("dailyPlans") &&
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
      setTimeout(() => reject(new Error("打开本地数据库超时")), ms);
    }),
  ]);
}

export async function ensureDatabaseReady(): Promise<void> {
  if (!readyPromise) {
    readyPromise = (async () => {
      try {
        await openWithTimeout();
        if (!storesReady()) {
          throw new Error("本地数据库结构损坏");
        }
      } catch {
        await resetDatabase();
        await openWithTimeout();
        if (!storesReady()) {
          throw new Error("无法初始化本地数据库");
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
  const paperCount = await db.papers.count();
  const vocabCount = await db.vocabCards.count();

  if (
    paperCount > 0 &&
    vocabCount > 0 &&
    seedVersion === CURRENT_SEED_VERSION
  ) {
    return paperCount;
  }

  const papers = buildAllSeedPapers();
  const vocab = buildSeedCards();

  await db.transaction(
    "rw",
    db.papers,
    db.meta,
    db.settings,
    db.vocabCards,
    async () => {
      const existingPapers = await db.papers.toArray();
      const keep = existingPapers.filter(
        (paper) => paper.isMock || paper.id.includes("open-api"),
      );
      await db.papers.clear();
      await db.meta.clear();
      await db.papers.bulkPut([...papers, ...keep]);
      await db.meta.bulkPut([...papers, ...keep].map(toMeta));

      if (vocabCount === 0) {
        await db.vocabCards.bulkPut(vocab);
      }

      await db.settings.put({ key: "seedVersion", value: CURRENT_SEED_VERSION });
      await db.settings.put({
        key: "seededAt",
        value: new Date().toISOString(),
      });
      if (!(await db.settings.get("sessionMode"))) {
        await db.settings.put({ key: "sessionMode", value: "deep" });
      }
    },
  );

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

export async function getSessionMode(): Promise<SessionMode> {
  const value = await getSetting("sessionMode");
  if (value === "focus" || value === "deep" || value === "fullday") return value;
  return "deep";
}

export async function listDueVocab(limit = 40): Promise<VocabCard[]> {
  await ensureDatabaseReady();
  const all = await db.vocabCards.toArray();
  return all.filter((card) => isDue(card)).slice(0, limit);
}

export async function listAllVocab(): Promise<VocabCard[]> {
  await ensureDatabaseReady();
  return db.vocabCards.toArray();
}

export async function saveVocabCard(card: VocabCard): Promise<void> {
  await ensureDatabaseReady();
  await db.vocabCards.put(card);
}

export async function saveSpeakingSession(
  session: SpeakingSession,
): Promise<void> {
  await ensureDatabaseReady();
  await db.speakingSessions.put(session);
}

export async function listSpeakingSessions(
  limit = 30,
): Promise<SpeakingSession[]> {
  await ensureDatabaseReady();
  return db.speakingSessions.orderBy("createdAt").reverse().limit(limit).toArray();
}

export async function saveCoachNote(note: CoachNote): Promise<void> {
  await ensureDatabaseReady();
  await db.coachNotes.put(note);
}

export async function listCoachNotes(): Promise<CoachNote[]> {
  await ensureDatabaseReady();
  return db.coachNotes.orderBy("createdAt").reverse().toArray();
}

export async function updateCoachNote(note: CoachNote): Promise<void> {
  await ensureDatabaseReady();
  await db.coachNotes.put(note);
}

export async function getOrCreateTodayPlan(): Promise<DailyPlan> {
  await ensureDatabaseReady();
  const date = new Date().toISOString().slice(0, 10);
  const existing = await db.dailyPlans.get(`plan-${date}`);
  if (existing) return existing;
  const mode = await getSessionMode();
  const plan = createDailyPlan(mode);
  await db.dailyPlans.put(plan);
  return plan;
}

export async function saveDailyPlan(plan: DailyPlan): Promise<void> {
  await ensureDatabaseReady();
  await db.dailyPlans.put(plan);
}

export async function markTaskDone(taskId: string): Promise<DailyPlan> {
  const plan = await getOrCreateTodayPlan();
  const next: DailyPlan = {
    ...plan,
    tasks: plan.tasks.map((task) =>
      task.id === taskId ? { ...task, done: true } : task,
    ),
  };
  await saveDailyPlan(next);
  return next;
}

export async function regenerateTodayPlan(mode: SessionMode): Promise<DailyPlan> {
  await setSetting("sessionMode", mode);
  const plan = createDailyPlan(mode);
  await saveDailyPlan(plan);
  return plan;
}

export interface BackupPayload {
  version: 1;
  exportedAt: string;
  settings: { key: string; value: string }[];
  vocabCards: VocabCard[];
  speakingSessions: SpeakingSession[];
  coachNotes: CoachNote[];
  dailyPlans: DailyPlan[];
}

export async function exportBackup(): Promise<BackupPayload> {
  await ensureDatabaseReady();
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    settings: await db.settings.toArray(),
    vocabCards: await db.vocabCards.toArray(),
    speakingSessions: await db.speakingSessions.toArray(),
    coachNotes: await db.coachNotes.toArray(),
    dailyPlans: await db.dailyPlans.toArray(),
  };
}

export async function importBackup(payload: BackupPayload): Promise<void> {
  await ensureDatabaseReady();
  if (payload.version !== 1) {
    throw new Error("不支持的备份版本");
  }
  await db.transaction(
    "rw",
    db.settings,
    db.vocabCards,
    db.speakingSessions,
    db.coachNotes,
    db.dailyPlans,
    async () => {
      if (payload.settings?.length) await db.settings.bulkPut(payload.settings);
      if (payload.vocabCards?.length) {
        await db.vocabCards.clear();
        await db.vocabCards.bulkPut(payload.vocabCards);
      }
      if (payload.speakingSessions?.length) {
        await db.speakingSessions.bulkPut(payload.speakingSessions);
      }
      if (payload.coachNotes?.length) {
        await db.coachNotes.bulkPut(payload.coachNotes);
      }
      if (payload.dailyPlans?.length) {
        await db.dailyPlans.bulkPut(payload.dailyPlans);
      }
    },
  );
}
