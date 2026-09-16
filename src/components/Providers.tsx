"use client";

import { useEffect, useState } from "react";
import { ensureSeedData } from "@/lib/db";

export function Providers({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ensureSeedData()
      .then(() => setReady(true))
      .catch((err: Error) => setError(err.message));
  }, []);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-800">
          初始化本地题库失败：{error}
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
