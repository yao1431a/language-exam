"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EXAM_GROUPS, EXAM_LABELS } from "@/lib/exams/constants";
import { upsertPaper } from "@/lib/db";
import { generateMockPaper } from "@/lib/exams/generator";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import type { ExamCategory, ExamPaper } from "@/lib/exams/types";

export default function MockPage() {
  const searchParams = useSearchParams();
  const initialType = (searchParams.get("type") as ExamCategory | null) ?? "toeic";
  const online = useOnlineStatus();

  const [examType, setExamType] = useState<ExamCategory>(initialType);
  const [questionCount, setQuestionCount] = useState(10);
  const [generated, setGenerated] = useState<ExamPaper | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("type")) {
      setExamType(searchParams.get("type") as ExamCategory);
    }
  }, [searchParams]);

  async function handleGenerate() {
    setLoading(true);
    try {
      let paper: ExamPaper;
      if (online) {
        const response = await fetch("/api/mock", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ examType, questionCount }),
        });
        const data = await response.json();
        paper = data.paper;
      } else {
        paper = generateMockPaper(examType, questionCount);
      }
      await upsertPaper(paper);
      setGenerated(paper);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4 py-8 sm:px-6">
      <Link href="/" className="text-sm text-indigo-600 hover:underline">
        ← 返回首页
      </Link>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">生成模拟试卷</h1>
      <p className="mt-2 text-slate-600">
        根据题库随机抽题组卷。联网时通过服务端生成，离线时在本地浏览器完成。
      </p>

      <Card className="mt-8 space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            考试类型
          </label>
          <select
            value={examType}
            onChange={(event) => setExamType(event.target.value as ExamCategory)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
          >
            {EXAM_GROUPS.flatMap((group) =>
              group.types.map((type) => (
                <option key={type} value={type}>
                  {EXAM_LABELS[type]}
                </option>
              )),
            )}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            题目数量（约）
          </label>
          <input
            type="number"
            min={5}
            max={40}
            value={questionCount}
            onChange={(event) => setQuestionCount(Number(event.target.value))}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
          />
        </div>

        <Button size="lg" disabled={loading} onClick={handleGenerate}>
          {loading ? "生成中..." : "立即生成"}
        </Button>
      </Card>

      {generated && (
        <Card className="mt-6">
          <h2 className="text-lg font-semibold text-slate-900">{generated.title}</h2>
          <p className="mt-2 text-sm text-slate-600">
            共 {generated.sections.reduce((sum, s) => sum + s.questions.length, 0)} 题，已保存到本地
          </p>
          <div className="mt-4">
            <Link href={`/exam/${generated.examType}/${generated.id}`}>
              <Button>开始考试</Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
