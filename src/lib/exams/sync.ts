import type { ExamCategory, SyncPayload } from "./types";

export async function fetchLatestCatalog(): Promise<SyncPayload> {
  const response = await fetch("/api/sync", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("同步失败，请检查网络连接");
  }
  return response.json();
}

export async function syncExamType(examType: ExamCategory): Promise<number> {
  const payload = await fetchLatestCatalog();
  const latest = payload.latestPapers.filter((paper) => paper.examType === examType);
  return latest.length;
}

export async function downloadLatestForType(
  examType: ExamCategory,
): Promise<SyncPayload["latestPapers"]> {
  const payload = await fetchLatestCatalog();
  return payload.latestPapers.filter((paper) => paper.examType === examType);
}
