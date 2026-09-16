import { NextResponse } from "next/server";
import { enrichFromOpenApis } from "@/lib/exams/enrich";
import { buildLatestPaper } from "@/lib/exams/seed";
import { bankSize } from "@/lib/exams/question-bank";
import { OPEN_SOURCE_ATTRIBUTION } from "@/lib/exams/providers";
import type { ExamCategory, SyncPayload } from "@/lib/exams/types";

const EXAM_TYPES: ExamCategory[] = [
  "toeic",
  "toefl",
  "ielts",
  "jlpt-n1",
  "jlpt-n2",
  "jlpt-n3",
  "jlpt-n4",
  "jlpt-n5",
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const enrich = searchParams.get("enrich") !== "0";

  const latestPapers = EXAM_TYPES.map((examType) => buildLatestPaper(examType));
  let enrichSummary: Awaited<ReturnType<typeof enrichFromOpenApis>> | null = null;

  if (enrich) {
    try {
      enrichSummary = await enrichFromOpenApis();
      latestPapers.push(...enrichSummary.papers);
    } catch (error) {
      console.warn("Open API enrich failed", error);
    }
  }

  const bankStats = Object.fromEntries(
    EXAM_TYPES.map((type) => [type, bankSize(type)]),
  );

  const payload: SyncPayload & {
    enrich?: typeof enrichSummary;
    bankStats: typeof bankStats;
    attribution: string[];
  } = {
    latestPapers,
    serverTime: new Date().toISOString(),
    catalogVersion: 3,
    enrich: enrichSummary ?? undefined,
    bankStats,
    attribution: OPEN_SOURCE_ATTRIBUTION,
  };

  return NextResponse.json(payload, {
    headers: { "Cache-Control": "no-store" },
  });
}
