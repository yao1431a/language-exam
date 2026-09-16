import { NextResponse } from "next/server";
import { generateMockPaper } from "@/lib/exams/generator";
import type { ExamCategory } from "@/lib/exams/types";

export async function POST(request: Request) {
  const body = await request.json();
  const examType = body.examType as ExamCategory;
  const questionCount = Number(body.questionCount ?? 10);

  if (!examType) {
    return NextResponse.json({ error: "缺少 examType" }, { status: 400 });
  }

  const paper = generateMockPaper(examType, questionCount);
  return NextResponse.json({ paper });
}
