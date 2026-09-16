"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EXAM_LABELS } from "@/lib/exams/constants";
import { listPapersByType } from "@/lib/db";
import type { ExamCategory, ExamPaper } from "@/lib/exams/types";

export default function ExamListPage() {
  const params = useParams<{ type: string }>();
  const examType = params.type as ExamCategory;
  const [papers, setPapers] = useState<ExamPaper[]>([]);

  useEffect(() => {
    listPapersByType(examType).then(setPapers);
  }, [examType]);

  const official = papers.filter((paper) => paper.isOfficial && !paper.isMock);
  const mock = papers.filter((paper) => paper.isMock);
  const downloaded = papers.filter((paper) => paper.downloadedAt);

  return (
    <div className="mx-auto min-h-screen max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/" className="text-sm text-indigo-600 hover:underline">
            ← 返回首页
          </Link>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            {EXAM_LABELS[examType]}
          </h1>
          <p className="mt-2 text-slate-600">
            共 {papers.length} 套试卷，含近 5 年真题练习版
            {downloaded.length > 0 && `，已下载最新 ${downloaded.length} 套`}
          </p>
        </div>
        <Link href={`/mock?type=${examType}`}>
          <Button variant="secondary">生成模拟卷</Button>
        </Link>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">真题练习版</h2>
        {official.map((paper) => (
          <Card key={paper.id}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-medium text-slate-900">{paper.title}</h3>
                <p className="mt-1 text-sm text-slate-500">
                  {paper.year} 年 · 场次 {paper.session}
                  {paper.downloadedAt && " · 已同步最新版"}
                </p>
              </div>
              <Link href={`/exam/${examType}/${paper.id}`}>
                <Button>开始考试</Button>
              </Link>
            </div>
          </Card>
        ))}
      </section>

      {mock.length > 0 && (
        <section className="mt-10 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">模拟试卷</h2>
          {mock.map((paper) => (
            <Card key={paper.id}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-medium text-slate-900">{paper.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">自动生成</p>
                </div>
                <Link href={`/exam/${examType}/${paper.id}`}>
                  <Button variant="secondary">继续练习</Button>
                </Link>
              </div>
            </Card>
          ))}
        </section>
      )}
    </div>
  );
}
