"use client";

import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { AudioPlayer } from "@/components/AudioPlayer";
import type { VocabCard } from "@/lib/coach/types";
import {
  listDueVocab,
  markTaskDone,
  saveVocabCard,
} from "@/lib/db";
import { reviewCard } from "@/lib/vocab/srs";

export default function VocabPage() {
  const [queue, setQueue] = useState<VocabCard[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(0);

  async function reload() {
    const due = await listDueVocab(40);
    setQueue(due);
    setIndex(0);
    setFlipped(false);
  }

  useEffect(() => {
    void reload();
  }, []);

  const card = queue[index];

  async function answer(result: "know" | "fuzzy" | "unknown") {
    if (!card) return;
    const updated = reviewCard(card, result);
    await saveVocabCard(updated);
    setDone((n) => n + 1);
    setFlipped(false);
    if (index + 1 >= queue.length) {
      await markTaskDone("vocab");
      await reload();
      return;
    }
    setIndex((i) => i + 1);
  }

  return (
    <div className="min-h-screen">
      <SiteHeader crumb={[{ href: "/vocab", label: "词汇唤醒" }]} />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="font-[family-name:var(--font-display)] text-3xl">
          词汇唤醒
        </h1>
        <p className="mt-2 text-[color:var(--muted)]">
          本地 SRS：认识 / 模糊 / 不会。本轮已复习 {done} 张，队列{" "}
          {queue.length} 张。
        </p>

        {!card ? (
          <div className="mt-10 rounded-3xl border border-dashed border-[color:var(--line)] px-6 py-16 text-center">
            <p className="text-[color:var(--muted)]">今日到期词汇已清空，真棒。</p>
            <div className="mt-4">
              <Button variant="secondary" onClick={() => void reload()}>
                再扫一遍
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            <button
              type="button"
              onClick={() => setFlipped((v) => !v)}
              className="w-full rounded-3xl border border-[color:var(--line)] bg-white/90 px-6 py-12 text-left shadow-sm"
            >
              <p className="text-xs uppercase tracking-wide text-[color:var(--muted)]">
                {card.theme}
              </p>
              <p className="mt-3 font-[family-name:var(--font-display)] text-4xl">
                {card.word}
              </p>
              {card.phonetic && (
                <p className="mt-2 text-sm text-[color:var(--muted)]">
                  {card.phonetic}
                </p>
              )}
              {flipped ? (
                <div className="mt-6 space-y-2 text-base leading-7">
                  <p>{card.meaningZh}</p>
                  <p className="text-[color:var(--muted)]">{card.example}</p>
                </div>
              ) : (
                <p className="mt-8 text-sm text-[color:var(--accent)]">
                  点击卡片查看释义
                </p>
              )}
            </button>

            <AudioPlayer text={card.example} lang="en-US" label="例句朗读" />

            <div className="grid grid-cols-3 gap-3">
              <Button variant="secondary" onClick={() => void answer("unknown")}>
                不会
              </Button>
              <Button variant="secondary" onClick={() => void answer("fuzzy")}>
                模糊
              </Button>
              <Button onClick={() => void answer("know")}>认识</Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
