"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import {
  SESSION_MODE_LABELS,
} from "@/lib/coach/plan";
import type { DailyPlan, SessionMode } from "@/lib/coach/types";
import {
  getOrCreateTodayPlan,
  getSessionMode,
  listCoachNotes,
  listDueVocab,
  listSpeakingSessions,
  regenerateTodayPlan,
} from "@/lib/db";

export default function TodayPlanPage() {
  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [mode, setMode] = useState<SessionMode>("deep");
  const [stats, setStats] = useState({ dueVocab: 0, sessions: 0, notes: 0 });

  useEffect(() => {
    void (async () => {
      const [today, sessionMode, due, sessions, notes] = await Promise.all([
        getOrCreateTodayPlan(),
        getSessionMode(),
        listDueVocab(100),
        listSpeakingSessions(50),
        listCoachNotes(),
      ]);
      setPlan(today);
      setMode(sessionMode);
      setStats({
        dueVocab: due.length,
        sessions: sessions.length,
        notes: notes.filter((n) => !n.mastered).length,
      });
    })();
  }, []);

  async function handleModeChange(next: SessionMode) {
    setMode(next);
    const regenerated = await regenerateTodayPlan(next);
    setPlan(regenerated);
  }

  const doneCount = plan?.tasks.filter((t) => t.done).length ?? 0;
  const total = plan?.tasks.length ?? 0;

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
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="rise-in text-sm tracking-[0.2em] text-emerald-100/90">
            语力馆 · Fluency Lab
          </p>
          <h1 className="rise-in-delay mt-4 max-w-3xl font-[family-name:var(--font-display)] text-4xl leading-tight text-white sm:text-5xl">
            今日计划：输出萎缩，就用练习把它养回来
          </h1>
          <p className="rise-in-delay mt-5 max-w-2xl text-base leading-7 text-emerald-50/90">
            主线是口语 + 词汇唤醒 + AI 反馈。目标雅思 Academic 7.0+。旧刷题入口在「工具箱」。
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-2xl">
              会话时长
            </h2>
            <p className="mt-1 text-sm text-[color:var(--muted)]">
              你白天空闲多，推荐 Deep 或 FullDay
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(["focus", "deep", "fullday"] as SessionMode[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => void handleModeChange(item)}
                className={`rounded-xl px-4 py-2 text-sm transition ${
                  mode === item
                    ? "bg-[color:var(--accent)] text-white"
                    : "border border-[color:var(--line)] bg-white/80 text-[color:var(--ink)]"
                }`}
              >
                {SESSION_MODE_LABELS[item]}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Stat label="待复习词汇" value={String(stats.dueVocab)} />
          <Stat label="口语会话记录" value={String(stats.sessions)} />
          <Stat label="未掌握句本" value={String(stats.notes)} />
        </div>

        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-[family-name:var(--font-display)] text-2xl">
              任务清单
            </h2>
            <p className="text-sm text-[color:var(--muted)]">
              {doneCount}/{total} 完成
            </p>
          </div>
          <div className="space-y-3">
            {plan?.tasks.map((task) => (
              <Link
                key={task.id}
                href={task.href}
                className={`block rounded-2xl border px-5 py-4 transition ${
                  task.done
                    ? "border-emerald-200 bg-emerald-50/80"
                    : "border-[color:var(--line)] bg-white/85 hover:border-[color:var(--accent)]"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium text-[color:var(--ink)]">
                      {task.done ? "✓ " : ""}
                      {task.title}
                    </p>
                    {task.meta && (
                      <p className="mt-1 text-sm text-[color:var(--muted)]">
                        {task.meta}
                      </p>
                    )}
                  </div>
                  <span className="text-sm text-[color:var(--accent)]">开始 →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-[color:var(--line)] bg-white/80 p-6">
          <h3 className="font-[family-name:var(--font-display)] text-xl">
            使用前确认
          </h3>
          <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
            AI 点评需要在本机配置 API Key（Anthropic 或 OpenAI）。Cursor
            订阅用于开发本项目，不能直接给练习页调用。请到设置页查看状态。
          </p>
          <div className="mt-4">
            <Link href="/settings">
              <Button variant="secondary">打开设置</Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[color:var(--line)] bg-white/85 px-5 py-4">
      <p className="text-xs text-[color:var(--muted)]">{label}</p>
      <p className="mt-2 font-[family-name:var(--font-display)] text-3xl">
        {value}
      </p>
    </div>
  );
}
