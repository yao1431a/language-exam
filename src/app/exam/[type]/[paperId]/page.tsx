"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { QuestionViewer } from "@/components/QuestionViewer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getPaper, saveAttempt } from "@/lib/db";
import { scorePaper } from "@/lib/exams/generator";
import type { ExamCategory, ExamPaper } from "@/lib/exams/types";

export default function ExamSessionPage() {
  const params = useParams<{ type: string; paperId: string }>();
  const examType = params.type as ExamCategory;
  const paperId = params.paperId;

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

  if (!paper) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center text-slate-600">
        试卷加载中或未找到本地数据。
      </div>
    );
  }

  if (result) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Card>
          <h1 className="text-2xl font-bold text-slate-900">考试结果</h1>
          <p className="mt-2 text-slate-600">{paper.title}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-indigo-50 p-4 text-center">
              <p className="text-sm text-indigo-700">得分</p>
              <p className="text-3xl font-bold text-indigo-900">{result.score}</p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-4 text-center">
              <p className="text-sm text-emerald-700">答对</p>
              <p className="text-3xl font-bold text-emerald-900">{result.correct}</p>
            </div>
            <div className="rounded-xl bg-slate-100 p-4 text-center">
              <p className="text-sm text-slate-600">总题数</p>
              <p className="text-3xl font-bold text-slate-900">{result.total}</p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/exam/${examType}`}>
              <Button variant="secondary">返回列表</Button>
            </Link>
            <Button onClick={() => setResult(null)}>重新查看试卷</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <Link href={`/exam/${examType}`} className="text-sm text-indigo-600 hover:underline">
          ← 返回试卷列表
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">{paper.title}</h1>
      </div>
      <QuestionViewer
        paper={paper}
        answers={answers}
        currentIndex={currentIndex}
        onAnswer={handleAnswer}
        onNavigate={setCurrentIndex}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
