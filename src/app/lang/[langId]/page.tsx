"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { getLanguage } from "@/lib/exams/catalog";

export default function LanguagePage() {
  const params = useParams<{ langId: string }>();
  const language = getLanguage(params.langId);

  if (!language) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <p>未找到该语言。</p>
        <Link href="/" className="text-[color:var(--accent)]">
          返回首页
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SiteHeader
        crumb={[
          { href: "/", label: "首页" },
          { href: `/lang/${language.id}`, label: language.name },
        ]}
      />

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <p className="text-sm" style={{ color: language.accent }}>
          {language.nameEn}
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl text-[color:var(--ink)]">
          {language.name}考试
        </h1>
        <p className="mt-3 max-w-2xl text-[color:var(--muted)]">{language.tagline}</p>

        <div className="mt-10 space-y-4">
          {language.exams.map((exam) => (
            <div
              key={exam.id}
              className="rounded-3xl border border-[color:var(--line)] bg-white/85 p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-[family-name:var(--font-display)] text-2xl">
                    {exam.name}
                  </h2>
                  <p className="mt-2 text-sm text-[color:var(--muted)]">
                    {exam.description}
                  </p>
                </div>
                {!exam.levels && exam.category && exam.available && (
                  <Link
                    href={`/exam/${exam.category}`}
                    className="rounded-xl bg-[color:var(--accent)] px-4 py-2 text-sm text-white"
                  >
                    进入练习
                  </Link>
                )}
              </div>

              {exam.levels && (
                <div className="mt-6">
                  <p className="mb-3 text-sm font-medium text-[color:var(--ink)]">
                    选择级别
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {exam.levels.map((level) => (
                      <Link
                        key={level.id}
                        href={`/exam/${level.id}`}
                        className="rounded-xl border border-[color:var(--line)] bg-[color:var(--panel)] px-4 py-2 text-sm transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
                      >
                        {level.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {!exam.available && (
                <p className="mt-4 text-sm text-[color:var(--muted)]">即将开放</p>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
