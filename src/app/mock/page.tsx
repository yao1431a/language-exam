"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
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
    <div className="min-h-screen">
      <SiteHeader
        crumb={[
          { href: "/", label: "首页" },
          { href: "/mock", label: "模拟组卷" },
        ]}
      />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Link
          href={`/exam/${examType}`}
          className="text-sm text-[color:var(--accent)] hover:underline"
        >
          ← 返回考试主页
        </Link>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl">
          生成模拟试卷
        </h1>
        <p className="mt-2 text-[color:var(--muted)]">
          随机抽题组卷。联网走服务端，离线在浏览器本地完成。
        </p>

        <div className="mt-8 space-y-6 rounded-3xl border border-[color:var(--line)] bg-white/90 p-6">
          <div>
            <label className="mb-2 block text-sm font-medium">考试类型</label>
            <select
              value={examType}
              onChange={(event) => setExamType(event.target.value as ExamCategory)}
              className="w-full rounded-xl border border-[color:var(--line)] px-4 py-3 text-sm"
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
            <label className="mb-2 block text-sm font-medium">题目数量（约）</label>
            <input
              type="number"
              min={5}
              max={40}
              value={questionCount}
              onChange={(event) => setQuestionCount(Number(event.target.value))}
              className="w-full rounded-xl border border-[color:var(--line)] px-4 py-3 text-sm"
            />
          </div>

          <Button size="lg" disabled={loading} onClick={handleGenerate}>
            {loading ? "生成中..." : "立即生成"}
          </Button>
        </div>

        {generated && (
          <div className="mt-6 rounded-3xl border border-[color:var(--line)] bg-white/90 p-6">
            <h2 className="text-lg font-semibold">{generated.title}</h2>
            <p className="mt-2 text-sm text-[color:var(--muted)]">
              共{" "}
              {generated.sections.reduce((sum, s) => sum + s.questions.length, 0)}{" "}
              题，已保存到本地
            </p>
            <div className="mt-4">
              <Link href={`/exam/${generated.examType}/${generated.id}`}>
                <Button>开始考试</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
