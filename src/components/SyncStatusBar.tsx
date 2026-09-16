"use client";

import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { Button } from "@/components/ui/button";

interface SyncStatusBarProps {
  onSync?: () => void;
  syncing?: boolean;
  lastSyncedAt?: string;
}

export function SyncStatusBar({
  onSync,
  syncing = false,
  lastSyncedAt,
}: SyncStatusBarProps) {
  const online = useOnlineStatus();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
      <div className="flex items-center gap-2">
        <span
          className={`h-2.5 w-2.5 rounded-full ${online ? "bg-emerald-500" : "bg-amber-500"}`}
        />
        <span className="font-medium text-slate-800">
          {online ? "已联网" : "离线模式"}
        </span>
        <span className="text-slate-500">
          {online
            ? "可下载最新真题并同步题库"
            : "可使用已下载的真题与模拟卷"}
        </span>
      </div>
      <div className="flex items-center gap-3">
        {lastSyncedAt && (
          <span className="text-slate-500">
            上次同步：{new Date(lastSyncedAt).toLocaleString("zh-CN")}
          </span>
        )}
        <Button
          variant="secondary"
          size="sm"
          disabled={!online || syncing}
          onClick={onSync}
        >
          {syncing ? "同步中..." : "同步最新真题"}
        </Button>
      </div>
    </div>
  );
}
