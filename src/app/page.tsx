"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SyncStatusBar } from "@/components/SyncStatusBar";
import { LANGUAGES } from "@/lib/exams/catalog";
import {
  ensureSeedData,
  getSetting,
  setSetting,
  upsertPaper,
} from "@/lib/db";
import { syncAllPapers } from "@/lib/exams/sync";

export default function HomePage() {
  const [syncing, setSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string>();
  const [syncMessage, setSyncMessage] = useState<string>();

  useEffect(() => {
    ensureSeedData();
    getSetting("lastSyncedAt").then((value) => {
      if (value) setLastSyncedAt(value);
    });
  }, []);

  async function handleSync() {
    setSyncing(true);
    setSyncMessage(undefined);
    try {
      const { papers } = await syncAllPapers();
      for (const paper of papers) {
        await upsertPaper({
          ...paper,
          downloadedAt: new Date().toISOString(),
        });
      }
      const now = new Date().toISOString();
      await setSetting("lastSyncedAt", now);
      setLastSyncedAt(now);
      setSyncMessage(`已同步 ${papers.length} 套练习卷到本地`);
    } catch (error) {
      setSyncMessage(error instanceof Error ? error.message : "同步失败");
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, var(--hero-from) 0%, var(--hero-to) 55%, #2f8f6f 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.25) 0, transparent 40%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.18) 0, transparent 35%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <p className="rise-in text-sm tracking-[0.2em] text-emerald-100/90">
            语测馆
          </p>
          <h1 className="rise-in-delay mt-4 max-w-3xl font-[family-name:var(--font-display)] text-4xl leading-tight text-white sm:text-6xl">
            先选语言，再备官方水平考试
          </h1>
          <p className="rise-in-delay mt-5 max-w-xl text-base leading-7 text-emerald-50/90 sm:text-lg">
            完整试卷、专项突破、模拟组卷。支持离线作答，联网可同步题库。
          </p>
          <div className="rise-in-delay mt-8">
            <a
              href="#languages"
              className="inline-flex rounded-xl bg-white px-5 py-3 text-sm font-medium text-[color:var(--hero-from)] transition hover:bg-emerald-50"
            >
              选择语言开始
            </a>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <SyncStatusBar
          onSync={handleSync}
          syncing={syncing}
          lastSyncedAt={lastSyncedAt}
        />
        {syncMessage && (
          <p className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            {syncMessage}
          </p>
        )}

        <section id="languages" className="mt-12">
          <div className="mb-6">
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-[color:var(--ink)]">
              选择语言
            </h2>
            <p className="mt-2 text-[color:var(--muted)]">
              首页按语言组织；具体考试与级别在下一页选择，便于持续扩展。
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LANGUAGES.map((language) => {
              const content = (
                <div
                  className={`lang-tile h-full rounded-3xl border bg-white/80 p-6 ${
                    language.available
                      ? "border-[color:var(--line)]"
                      : "border-dashed border-[color:var(--line)] opacity-70"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p
                        className="text-xs font-medium tracking-wide"
                        style={{ color: language.accent }}
                      >
                        {language.nameEn}
                      </p>
                      <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl">
                        {language.name}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
                        {language.tagline}
                      </p>
                    </div>
                    <span
                      className="rounded-full px-3 py-1 text-xs font-medium text-white"
                      style={{
                        background: language.available
                          ? language.accent
                          : "#9ca3af",
                      }}
                    >
                      {language.available ? "可练习" : "即将开放"}
                    </span>
                  </div>
                  {language.available && (
                    <p className="mt-6 text-sm text-[color:var(--accent)]">
                      进入考试列表 →
                    </p>
                  )}
                </div>
              );

              return language.available ? (
                <Link key={language.id} href={`/lang/${language.id}`}>
                  {content}
                </Link>
              ) : (
                <div key={language.id}>{content}</div>
              );
            })}
          </div>
        </section>

        <section className="mt-14 border-t border-[color:var(--line)] pt-8 text-sm leading-7 text-[color:var(--muted)]">
          <p>
            导航路径：语言 → 考试（及级别）→ 完整试卷 / 专项练习 / 模拟组卷。
            后续新增韩语 TOPIK、法语 DELF、德语 Goethe、汉语 HSK 等，只需扩展语言目录，无需改首页结构。
          </p>
        </section>
      </main>
    </div>
  );
}
