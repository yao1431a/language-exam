"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import {
  EXAM_LABELS,
  getExamByCategory,
} from "@/lib/exams/catalog";
import { listPapersByType } from "@/lib/db";
import type { ExamCategory, ExamPaper } from "@/lib/exams/types";

export default function ExamHubPage() {
  const params = useParams<{ type: string }>();
  const examType = params.type as ExamCategory;
  const context = getExamByCategory(examType);
  const [papers, setPapers] = useState<ExamPaper[]>([]);

  useEffect(() => {
    listPapersByType(examType).then(setPapers);
  }, [examType]);

  const official = papers.filter((paper) => paper.isOfficial && !paper.isMock);
  const mock = papers.filter((paper) => paper.isMock);
  const label = EXAM_LABELS[examType] ?? examType;
  const language = context?.language;
  const exam = context?.exam;
  const skills = exam?.skills ?? [];

  return (
    <div className="min-h-screen">
      <SiteHeader
        crumb={[
          { href: "/", label: "首页" },
          ...(language
            ? [{ href: `/lang/${language.id}`, label: language.name }]
            : []),
          { href: `/exam/${examType}`, label },
        ]}
      />

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-[color:var(--ink)]">
          {label}
        </h1>
        <p className="mt-3 text-[color:var(--muted)]">
          选择练习方式：完整试卷、专项突破，或一键生成模拟卷。
        </p>

        <section className="mt-10">
          <h2 className="font-[family-name:var(--font-display)] text-2xl">
            专项练习
          </h2>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            按题型单独训练，适合查漏补缺。
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {skills.map((skill) => (
              <Link
                key={skill.id}
                href={`/exam/${examType}/practice/${skill.id}`}
                className="rounded-2xl border border-[color:var(--line)] bg-white/85 p-5 transition hover:border-[color:var(--accent)]"
              >
                <h3 className="text-lg font-semibold">{skill.label}</h3>
                <p className="mt-2 text-sm text-[color:var(--muted)]">
                  {skill.description}
                </p>
                <p className="mt-4 text-sm text-[color:var(--accent)]">开始专项 →</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl">
                完整试卷
              </h2>
              <p className="mt-2 text-sm text-[color:var(--muted)]">
                近 5 年练习卷，共 {official.length} 套
              </p>
            </div>
            <Link href={`/mock?type=${examType}`}>
              <Button variant="secondary">生成模拟卷</Button>
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {official.slice(0, 12).map((paper) => (
              <div
                key={paper.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[color:var(--line)] bg-white/85 px-5 py-4"
              >
                <div>
                  <h3 className="font-medium">{paper.title}</h3>
                  <p className="mt-1 text-sm text-[color:var(--muted)]">
                    {paper.year} · 场次 {paper.session}
                    {paper.downloadedAt ? " · 已同步" : ""}
                  </p>
                </div>
                <Link href={`/exam/${examType}/${paper.id}`}>
                  <Button>开始考试</Button>
                </Link>
              </div>
            ))}
            {official.length === 0 && (
              <p className="rounded-2xl border border-dashed border-[color:var(--line)] px-5 py-8 text-center text-sm text-[color:var(--muted)]">
                本地暂无试卷，请返回首页联网同步后重试。
              </p>
            )}
          </div>
        </section>

        {mock.length > 0 && (
          <section className="mt-12">
            <h2 className="font-[family-name:var(--font-display)] text-2xl">
              我的模拟 / 专项卷
            </h2>
            <div className="mt-5 space-y-3">
              {mock.slice(0, 8).map((paper) => (
                <div
                  key={paper.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[color:var(--line)] bg-white/85 px-5 py-4"
                >
                  <div>
                    <h3 className="font-medium">{paper.title}</h3>
                    <p className="mt-1 text-sm text-[color:var(--muted)]">本地生成</p>
                  </div>
                  <Link href={`/exam/${examType}/${paper.id}`}>
                    <Button variant="secondary">继续练习</Button>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
