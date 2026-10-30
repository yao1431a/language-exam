"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { LANGUAGES } from "@/lib/exams/catalog";
import { markTaskDone } from "@/lib/db";

export default function ToolboxPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader crumb={[{ href: "/toolbox", label: "工具箱" }]} />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h1 className="font-[family-name:var(--font-display)] text-3xl">
          考试工具箱
        </h1>
        <p className="mt-2 max-w-2xl text-[color:var(--muted)]">
          旧版刷题能力保留于此，用作每周轻量诊断，不是日常主线。主线请回「今日计划」做口语与词汇。
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LANGUAGES.filter((lang) => lang.available).map((language) => (
            <Link
              key={language.id}
              href={`/lang/${language.id}`}
              onClick={() => {
                void markTaskDone("mock");
              }}
              className="rounded-3xl border border-[color:var(--line)] bg-white/85 p-6 transition hover:border-[color:var(--accent)]"
            >
              <p
                className="text-xs font-medium tracking-wide"
                style={{ color: language.accent }}
              >
                {language.nameEn}
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl">
                {language.name}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
                {language.tagline}
              </p>
              <p className="mt-6 text-sm text-[color:var(--accent)]">
                进入考试列表 →
              </p>
            </Link>
          ))}
        </div>

        <p className="mt-10 text-sm text-[color:var(--muted)]">
          冲刺雅思时优先用英语 IELTS 听力 / 阅读专项；TOEIC / JLPT
          仅作额外练习。
        </p>
      </main>
    </div>
  );
}
