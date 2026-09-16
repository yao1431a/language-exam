import { NextResponse } from "next/server";
import { enrichFromOpenApis } from "@/lib/exams/enrich";
import type { ExamCategory } from "@/lib/exams/types";

export async function POST(request: Request) {
  let examTypes: ExamCategory[] | undefined;
  try {
    const body = await request.json();
    if (Array.isArray(body.examTypes)) {
      examTypes = body.examTypes as ExamCategory[];
    }
  } catch {
    // empty body is fine — enrich all JLPT levels
  }

  try {
    const result = await enrichFromOpenApis(examTypes);
    return NextResponse.json({
      ok: true,
      ...result,
      message: "已从开源 JLPT API 拉取词汇/语法并生成练习题",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "扩充失败",
      },
      { status: 502 },
    );
  }
}
