import { NextResponse } from "next/server";
import { buildLatestPaper } from "@/lib/exams/seed";
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

export async function GET() {
  const latestPapers = EXAM_TYPES.map((examType) => buildLatestPaper(examType));
  const payload: SyncPayload = {
    latestPapers,
    serverTime: new Date().toISOString(),
    catalogVersion: 2,
  };

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
