"use client";

import { useEffect, useState } from "react";
import { ensureSeedData } from "@/lib/db";

export function Providers({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    ensureSeedData()
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "初始化本地题库失败");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="max-w-md rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-800">
          <p className="font-medium">初始化本地题库失败</p>
          <p className="mt-2 text-sm leading-6">{error}</p>
          <button
            type="button"
            className="mt-4 rounded-lg bg-rose-800 px-4 py-2 text-sm text-white"
            onClick={() => window.location.reload()}
          >
            刷新重试
          </button>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-700 shadow-sm">
          正在加载本地题库...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
