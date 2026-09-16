"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import {
  EXAM_LABELS,
  PRACTICE_SKILL_LABELS,
  getExamByCategory,
  type PracticeSkill,
} from "@/lib/exams/catalog";
import { upsertPaper } from "@/lib/db";
import { generatePracticePaper } from "@/lib/exams/generator";
import type { ExamCategory } from "@/lib/exams/types";

export default function PracticeSkillPage() {
  const params = useParams<{ type: string; skill: string }>();
  const router = useRouter();
  const examType = params.type as ExamCategory;
  const skill = params.skill as PracticeSkill;
  const context = getExamByCategory(examType);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const skillMeta = context?.exam.skills.find((item) => item.id === skill);
  const label = EXAM_LABELS[examType] ?? examType;
  const skillLabel = PRACTICE_SKILL_LABELS[skill] ?? skill;

  async function handleStart() {
    setLoading(true);
    setError(undefined);
    try {
      const paper = generatePracticePaper(examType, skill, 12);
      await upsertPaper(paper);
      router.push(`/exam/${examType}/${paper.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成专项卷失败");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <SiteHeader
        crumb={[
          { href: "/", label: "首页" },
          ...(context
            ? [{ href: `/lang/${context.language.id}`, label: context.language.name }]
            : []),
          { href: `/exam/${examType}`, label },
          { href: `/exam/${examType}/practice/${skill}`, label: skillLabel },
        ]}
      />

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Link
          href={`/exam/${examType}`}
          className="text-sm text-[color:var(--accent)] hover:underline"
        >
          ← 返回考试主页
        </Link>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl">
          {skillLabel}专项练习
        </h1>
        <p className="mt-3 text-[color:var(--muted)]">
          {label} · {skillMeta?.description ?? "针对该题型集中训练"}
        </p>

        <div className="mt-8 rounded-3xl border border-[color:var(--line)] bg-white/90 p-6">
          <ul className="space-y-2 text-sm leading-7 text-[color:var(--muted)]">
            <li>· 约 12 题，每次随机抽题，聚焦 {skillLabel}</li>
            <li>· 听力专项含播放 / 暂停控件</li>
            <li>· 结果保存到本地，可随时回看</li>
          </ul>
          <div className="mt-6">
            <Button size="lg" disabled={loading} onClick={handleStart}>
              {loading ? "正在组卷..." : "开始专项练习"}
            </Button>
          </div>
          {error && <p className="mt-4 text-sm text-rose-700">{error}</p>}
        </div>
      </main>
    </div>
  );
}
