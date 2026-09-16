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
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[color:var(--line)] bg-white/70 px-4 py-3 text-sm">
      <div className="flex items-center gap-2">
        <span
          className={`h-2.5 w-2.5 rounded-full ${online ? "bg-emerald-600" : "bg-amber-500"}`}
        />
        <span className="font-medium text-[color:var(--ink)]">
          {online ? "已联网" : "离线模式"}
        </span>
        <span className="text-[color:var(--muted)]">
          {online ? "可同步题库与最新练习卷" : "可继续作答已下载内容"}
        </span>
      </div>
      <div className="flex items-center gap-3">
        {lastSyncedAt && (
          <span className="text-[color:var(--muted)]">
            上次同步：{new Date(lastSyncedAt).toLocaleString("zh-CN")}
          </span>
        )}
        <Button
          variant="secondary"
          size="sm"
          disabled={!online || syncing}
          onClick={onSync}
        >
          {syncing ? "同步中..." : "同步题库"}
        </Button>
      </div>
    </div>
  );
}
