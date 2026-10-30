"use client";

import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import {
  SESSION_MODE_LABELS,
} from "@/lib/coach/plan";
import type { SessionMode } from "@/lib/coach/types";
import {
  exportBackup,
  getSessionMode,
  importBackup,
  regenerateTodayPlan,
  type BackupPayload,
} from "@/lib/db";

export default function SettingsPage() {
  const [mode, setMode] = useState<SessionMode>("deep");
  const [aiStatus, setAiStatus] = useState("检测中…");
  const [message, setMessage] = useState<string>();

  useEffect(() => {
    void getSessionMode().then(setMode);
    void fetch("/api/coach/status")
      .then((res) => res.json())
      .then((data: { message?: string }) => {
        setAiStatus(data.message || "未知状态");
      })
      .catch(() => setAiStatus("无法连接状态接口"));
  }, []);

  async function saveMode(next: SessionMode) {
    setMode(next);
    await regenerateTodayPlan(next);
    setMessage(`已切换为 ${SESSION_MODE_LABELS[next]}，今日计划已重建`);
  }

  async function handleExport() {
    const payload = await exportBackup();
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `fluency-lab-backup-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage("备份已下载");
  }

  async function handleImport(file: File) {
    const text = await file.text();
    const payload = JSON.parse(text) as BackupPayload;
    await importBackup(payload);
    setMessage("备份已导入，刷新页面即可看到数据");
  }

  return (
    <div className="min-h-screen">
      <SiteHeader crumb={[{ href: "/settings", label: "设置" }]} />
      <main className="mx-auto max-w-3xl space-y-8 px-4 py-10 sm:px-6">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl">
            设置
          </h1>
          <p className="mt-2 text-[color:var(--muted)]">
            API Key、会话模式、迁机备份。
          </p>
        </div>

        <section className="rounded-3xl border border-[color:var(--line)] bg-white/90 p-6">
          <h2 className="text-lg font-medium">AI 反馈</h2>
          <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
            在项目根目录创建 <code className="text-[color:var(--ink)]">.env.local</code>
            ，参考 <code className="text-[color:var(--ink)]">.env.example</code>
            。配置 <code>ANTHROPIC_API_KEY</code> 或{" "}
            <code>OPENAI_API_KEY</code> 后重启{" "}
            <code>npm run dev</code>。
          </p>
          <p className="mt-3 rounded-xl bg-[color:var(--panel)] px-4 py-3 text-sm">
            状态：{aiStatus}
          </p>
        </section>

        <section className="rounded-3xl border border-[color:var(--line)] bg-white/90 p-6">
          <h2 className="text-lg font-medium">默认会话时长</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {(["focus", "deep", "fullday"] as SessionMode[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => void saveMode(item)}
                className={`rounded-xl px-4 py-2 text-sm ${
                  mode === item
                    ? "bg-[color:var(--accent)] text-white"
                    : "border border-[color:var(--line)]"
                }`}
              >
                {SESSION_MODE_LABELS[item]}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-[color:var(--line)] bg-white/90 p-6">
          <h2 className="text-lg font-medium">迁机备份</h2>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            换 Mac mini 前先导出 JSON；新机导入后词汇、口语会话与句本可恢复。
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button onClick={() => void handleExport()}>导出备份</Button>
            <label className="inline-flex cursor-pointer items-center rounded-xl border border-[color:var(--line)] px-4 py-2 text-sm">
              导入备份
              <input
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void handleImport(file);
                }}
              />
            </label>
          </div>
        </section>

        {message && (
          <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            {message}
          </p>
        )}
      </main>
    </div>
  );
}
