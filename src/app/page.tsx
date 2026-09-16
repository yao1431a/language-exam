"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExamCard } from "@/components/ExamCard";
import { SyncStatusBar } from "@/components/SyncStatusBar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EXAM_GROUPS } from "@/lib/exams/constants";
import {
  ensureSeedData,
  getSetting,
  listAllMeta,
  setSetting,
  upsertPaper,
} from "@/lib/db";
import { syncAllPapers } from "@/lib/exams/sync";
import type { ExamCategory, ExamMeta } from "@/lib/exams/types";

export default function HomePage() {
  const [meta, setMeta] = useState<ExamMeta[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string>();
  const [syncMessage, setSyncMessage] = useState<string>();
  const [attribution, setAttribution] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
      await ensureSeedData();
      setMeta(await listAllMeta());
      const synced = await getSetting("lastSyncedAt");
      if (synced) setLastSyncedAt(synced);
    }
    load();
  }, []);

  async function handleSync() {
    setSyncing(true);
    setSyncMessage(undefined);
    try {
      const { papers, attribution: attrs, bankStats } = await syncAllPapers();
      for (const paper of papers) {
        await upsertPaper({
          ...paper,
          downloadedAt: new Date().toISOString(),
        });
      }
      const now = new Date().toISOString();
      await setSetting("lastSyncedAt", now);
      setLastSyncedAt(now);
      setMeta(await listAllMeta());
      if (attrs) setAttribution(attrs);

      const jlptAdded = bankStats
        ? Object.entries(bankStats)
            .filter(([key]) => key.startsWith("jlpt-"))
            .map(([, stats]) => stats.enriched)
            .reduce((a, b) => a + b, 0)
        : 0;

      setSyncMessage(
        `已同步 ${papers.length} 套试卷；开源 JLPT 题库本次可用约 ${jlptAdded} 道生成题。`,
      );
    } catch (error) {
      setSyncMessage(
        error instanceof Error ? error.message : "同步失败，请稍后重试",
      );
    } finally {
      setSyncing(false);
    }
  }

  function countByType(examType: ExamCategory): number {
    return meta.filter((item) => item.examType === examType).length;
  }

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-indigo-600">Language Exam Hub</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              语言考试练习平台
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              支持托业、托福、雅思与日语 JLPT N1–N5。内置近 5 年练习卷；联网可同步最新卷，并从开源 JLPT API 自动扩充日语题量。
            </p>
          </div>
          <Link href="/mock">
            <Button size="lg">生成模拟试卷</Button>
          </Link>
        </div>
        <SyncStatusBar
          onSync={handleSync}
          syncing={syncing}
          lastSyncedAt={lastSyncedAt}
        />
        {syncMessage && (
          <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            {syncMessage}
          </p>
        )}
      </header>

      <div className="space-y-10">
        {EXAM_GROUPS.map((group) => (
          <section key={group.id}>
            <h2 className="mb-4 text-xl font-semibold text-slate-900">
              {group.label}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.types.map((examType) => (
                <ExamCard
                  key={examType}
                  examType={examType}
                  paperCount={countByType(examType)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      <Card className="mt-10 space-y-2 text-sm leading-6 text-slate-700">
        <h2 className="text-base font-semibold text-slate-900">题源说明</h2>
        <p>
          官方托业 / 托福 / 雅思 / JLPT 历年真题受版权保护，本系统<strong>不会</strong>从网上抓取官方试卷原文。
        </p>
        <p>
          日语题量联网后会从开源词汇/语法 API 自动生成练习题；英语为本地扩充原创练习题。
        </p>
        {attribution.length > 0 && (
          <ul className="list-disc space-y-1 pl-5 text-slate-600">
            {attribution.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </Card>

      <footer className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
        正式备考请结合官方教材与授权资源。需要接入你自有的授权题库时，可配置外部 API 适配层。
      </footer>
    </div>
  );
}
