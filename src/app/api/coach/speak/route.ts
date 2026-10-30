import { NextResponse } from "next/server";
import { coachSpeaking } from "@/lib/coach/provider";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      part?: string;
      prompt?: string;
      cues?: string[];
      transcript?: string;
    };

    const transcript = body.transcript?.trim() ?? "";
    const prompt = body.prompt?.trim() ?? "";
    const part = body.part?.trim() || "part1";

    if (!prompt || transcript.length < 20) {
      return NextResponse.json(
        { error: "请提供题目，且回答稿至少约 20 个字符" },
        { status: 400 },
      );
    }

    const result = await coachSpeaking({
      part,
      prompt,
      cues: body.cues,
      transcript,
    });

    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "教练反馈失败";
    const status = message.includes("未配置") ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
