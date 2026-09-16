import type { ExamCategory, SyncPayload } from "./types";

export async function fetchLatestCatalog(): Promise<SyncPayload> {
  const response = await fetch("/api/sync?enrich=1", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("同步失败，请检查网络连接");
  }
  return response.json();
}

export async function enrichOpenQuestionBank(): Promise<{
  ok: boolean;
  message?: string;
  results?: { examType: string; added: number; sources: string[]; error?: string }[];
}> {
  const response = await fetch("/api/enrich", { method: "POST" });
  if (!response.ok) {
    throw new Error("开源题库扩充失败");
  }
  return response.json();
}

export async function downloadLatestForType(
  examType: ExamCategory,
): Promise<SyncPayload["latestPapers"]> {
  const payload = await fetchLatestCatalog();
  return payload.latestPapers.filter((paper) => paper.examType === examType);
}

export async function syncAllPapers(): Promise<{
  papers: SyncPayload["latestPapers"];
  attribution?: string[];
  bankStats?: SyncPayload["bankStats"];
}> {
  const payload = await fetchLatestCatalog();
  return {
    papers: payload.latestPapers,
    attribution: payload.attribution,
    bankStats: payload.bankStats,
  };
}
