"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExamCard } from "@/components/ExamCard";
import { SyncStatusBar } from "@/components/SyncStatusBar";
import { Button } from "@/components/ui/button";
import { EXAM_GROUPS } from "@/lib/exams/constants";
import {
  ensureSeedData,
  getSetting,
  listAllMeta,
  setSetting,
  upsertPaper,
} from "@/lib/db";
import { downloadLatestForType } from "@/lib/exams/sync";
import type { ExamCategory, ExamMeta } from "@/lib/exams/types";

export default function HomePage() {
  const [meta, setMeta] = useState<ExamMeta[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string>();

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
    try {
      const examTypes = EXAM_GROUPS.flatMap((group) => group.types);
      for (const examType of examTypes) {
        const latest = await downloadLatestForType(examType);
        for (const paper of latest) {
          await upsertPaper({
            ...paper,
            downloadedAt: new Date().toISOString(),
          });
        }
      }
      const now = new Date().toISOString();
      await setSetting("lastSyncedAt", now);
      setLastSyncedAt(now);
      setMeta(await listAllMeta());
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
              支持托业、托福、雅思与日语 JLPT N1–N5。内置近 5 年真题练习版，联网可同步最新试卷，也可一键生成模拟卷。
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

      <footer className="mt-12 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
        说明：本项目提供的是原创练习题与考试结构模拟，非官方真题原文。正式备考请结合官方教材与授权资源。
      </footer>
    </div>
  );
}
