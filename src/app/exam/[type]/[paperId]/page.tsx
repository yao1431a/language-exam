"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { QuestionViewer } from "@/components/QuestionViewer";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { getPaper, saveAttempt } from "@/lib/db";
import { EXAM_LABELS, getExamByCategory } from "@/lib/exams/catalog";
import { scorePaper } from "@/lib/exams/generator";
import type { ExamCategory, ExamPaper } from "@/lib/exams/types";

export default function ExamSessionPage() {
  const params = useParams<{ type: string; paperId: string }>();
  const examType = params.type as ExamCategory;
  const paperId = params.paperId;
  const context = getExamByCategory(examType);

  const [paper, setPaper] = useState<ExamPaper | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState<{
    correct: number;
    total: number;
    score: number;
  } | null>(null);

  useEffect(() => {
    getPaper(paperId).then((loaded) => setPaper(loaded ?? null));
  }, [paperId]);

  function handleAnswer(questionId: string, value: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  async function handleSubmit() {
    if (!paper) return;
    const scored = scorePaper(paper, answers);
    setResult(scored);
    await saveAttempt({
      id: `attempt-${paper.id}-${Date.now()}`,
      paperId: paper.id,
      examType,
      startedAt: new Date().toISOString(),
      finishedAt: new Date().toISOString(),
      answers,
      score: scored.score,
      totalQuestions: scored.total,
    });
  }

  const crumb = [
    { href: "/", label: "首页" },
    ...(context
      ? [{ href: `/lang/${context.language.id}`, label: context.language.name }]
      : []),
    { href: `/exam/${examType}`, label: EXAM_LABELS[examType] ?? examType },
  ];

  if (!paper) {
    return (
      <div className="min-h-screen">
        <SiteHeader crumb={crumb} />
        <div className="mx-auto max-w-3xl px-4 py-16 text-center text-[color:var(--muted)]">
          试卷加载中或未找到本地数据。
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen">
        <SiteHeader crumb={crumb} />
        <div className="mx-auto max-w-3xl px-4 py-10">
          <div className="rounded-3xl border border-[color:var(--line)] bg-white/90 p-6">
            <h1 className="font-[family-name:var(--font-display)] text-3xl">考试结果</h1>
            <p className="mt-2 text-[color:var(--muted)]">{paper.title}</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-[color:var(--accent-soft)] p-4 text-center">
                <p className="text-sm text-[color:var(--accent)]">得分</p>
                <p className="text-3xl font-bold">{result.score}</p>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-4 text-center">
                <p className="text-sm text-emerald-700">答对</p>
                <p className="text-3xl font-bold text-emerald-900">{result.correct}</p>
              </div>
              <div className="rounded-2xl bg-[color:var(--panel)] p-4 text-center">
                <p className="text-sm text-[color:var(--muted)]">总题数</p>
                <p className="text-3xl font-bold">{result.total}</p>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`/exam/${examType}`}>
                <Button variant="secondary">返回考试主页</Button>
              </Link>
              <Button onClick={() => setResult(null)}>重新查看试卷</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SiteHeader crumb={crumb} />
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Link
          href={`/exam/${examType}`}
          className="text-sm text-[color:var(--accent)] hover:underline"
        >
          ← 返回试卷列表
        </Link>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl sm:text-3xl">
          {paper.title}
        </h1>
        <div className="mt-6">
          <QuestionViewer
            paper={paper}
            answers={answers}
            currentIndex={currentIndex}
            onAnswer={handleAnswer}
            onNavigate={setCurrentIndex}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
