"use client";

import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { AudioPlayer } from "@/components/AudioPlayer";
import type { CoachNote } from "@/lib/coach/types";
import {
  listCoachNotes,
  markTaskDone,
  updateCoachNote,
} from "@/lib/db";

export default function NotesPage() {
  const [notes, setNotes] = useState<CoachNote[]>([]);

  async function reload() {
    setNotes(await listCoachNotes());
  }

  useEffect(() => {
    void reload();
  }, []);

  async function markMastered(note: CoachNote) {
    await updateCoachNote({ ...note, mastered: true });
    await reload();
    await markTaskDone("notes");
  }

  const active = notes.filter((note) => !note.mastered);
  const mastered = notes.filter((note) => note.mastered);

  return (
    <div className="min-h-screen">
      <SiteHeader crumb={[{ href: "/notes", label: "好句 / 错句本" }]} />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="font-[family-name:var(--font-display)] text-3xl">
          好句 / 错句本
        </h1>
        <p className="mt-2 text-[color:var(--muted)]">
          来自 AI 反馈的升级句与高分表达，建议第二天再说一遍。
        </p>

        <section className="mt-8 space-y-4">
          <h2 className="text-lg font-medium">待掌握（{active.length}）</h2>
          {active.length === 0 && (
            <p className="rounded-2xl border border-dashed border-[color:var(--line)] px-4 py-8 text-center text-sm text-[color:var(--muted)]">
              还没有笔记。去口语页提交一次 AI 反馈吧。
            </p>
          )}
          {active.map((note) => (
            <article
              key={note.id}
              className="rounded-2xl border border-[color:var(--line)] bg-white/90 p-5"
            >
              <p className="text-xs uppercase tracking-wide text-[color:var(--muted)]">
                {note.kind}
              </p>
              {note.original && (
                <p className="mt-2 text-sm text-[color:var(--muted)]">
                  原文：{note.original}
                </p>
              )}
              <p className="mt-2 text-base leading-7 text-[color:var(--ink)]">
                {note.better}
              </p>
              {note.why && (
                <p className="mt-2 text-sm text-[color:var(--muted)]">{note.why}</p>
              )}
              <div className="mt-4">
                <AudioPlayer text={note.better} lang="en-US" label="跟读此句" />
              </div>
              <div className="mt-4">
                <Button
                  variant="secondary"
                  onClick={() => void markMastered(note)}
                >
                  已掌握
                </Button>
              </div>
            </article>
          ))}
        </section>

        {mastered.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-medium">已掌握（{mastered.length}）</h2>
            <ul className="mt-3 space-y-2 text-sm text-[color:var(--muted)]">
              {mastered.slice(0, 20).map((note) => (
                <li key={note.id}>· {note.better}</li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
