"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { v4 as uuid } from "uuid";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { AudioPlayer } from "@/components/AudioPlayer";
import type { SpeakCoachFeedback, SpeakingPart } from "@/lib/coach/types";
import {
  markTaskDone,
  saveCoachNote,
  saveSpeakingSession,
} from "@/lib/db";
import { getPromptById, pickRandomPrompts } from "@/lib/speak/prompts";

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: {
    resultIndex: number;
    results: ArrayLike<{
      isFinal: boolean;
      0?: { transcript?: string };
    }>;
  }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

function getSpeechRecognitionCtor():
  | (new () => SpeechRecognitionLike)
  | undefined {
  if (typeof window === "undefined") return undefined;
  const w = window as Window & {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition;
}

export default function SpeakPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-[color:var(--muted)]">
          加载口语页…
        </div>
      }
    >
      <SpeakPageInner />
    </Suspense>
  );
}

function SpeakPageInner() {
  const search = useSearchParams();
  const shadowMode = search.get("mode") === "shadow";

  const [partFilter, setPartFilter] = useState<SpeakingPart | "any">("part1");
  const [promptId, setPromptId] = useState("");
  const prompt = useMemo(
    () => (promptId ? getPromptById(promptId) : undefined),
    [promptId],
  );

  const [transcript, setTranscript] = useState("");
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>();
  const [seconds, setSeconds] = useState(0);
  const [prepLeft, setPrepLeft] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<SpeakCoachFeedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [listening, setListening] = useState(false);

  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const prepTimerRef = useRef<number | null>(null);

  function nextPrompt(nextPart: SpeakingPart | "any" = partFilter) {
    const [item] = pickRandomPrompts(nextPart, 1);
    if (!item) return;
    setPromptId(item.id);
    setPartFilter(nextPart === "any" ? item.part : nextPart);
    setTranscript("");
    setFeedback(null);
    setError(undefined);
    setSeconds(0);
    setPrepLeft(null);
    setAudioUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return undefined;
    });
  }

  useEffect(() => {
    nextPrompt(shadowMode ? "part2" : "part1");
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (prepTimerRef.current) window.clearInterval(prepTimerRef.current);
      recognitionRef.current?.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startTimer() {
    if (timerRef.current) window.clearInterval(timerRef.current);
    setSeconds(0);
    timerRef.current = window.setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
  }

  function stopTimer() {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  async function startRecording() {
    setError(undefined);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
        stream.getTracks().forEach((track) => track.stop());
      };
      mediaRef.current = recorder;
      recorder.start();
      setRecording(true);
      startTimer();
    } catch {
      setError("无法访问麦克风，请检查权限；仍可手打稿请 AI 点评。");
    }
  }

  function stopRecording() {
    mediaRef.current?.stop();
    setRecording(false);
    stopTimer();
  }

  function startDictation() {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      setError("当前浏览器不支持语音转写，请手打或粘贴回答稿。");
      return;
    }
    const recognition = new Ctor();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;
    let finalText = transcript ? `${transcript} ` : "";
    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const piece = event.results[i][0]?.transcript ?? "";
        if (event.results[i].isFinal) finalText += `${piece} `;
        else interim += piece;
      }
      setTranscript(`${finalText}${interim}`.trim());
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }

  function stopDictation() {
    recognitionRef.current?.stop();
    setListening(false);
  }

  function startPart2Prep() {
    if (prepTimerRef.current) window.clearInterval(prepTimerRef.current);
    setPrepLeft(60);
    prepTimerRef.current = window.setInterval(() => {
      setPrepLeft((left) => {
        if (left === null) return null;
        if (left <= 1) {
          if (prepTimerRef.current) window.clearInterval(prepTimerRef.current);
          void startRecording();
          return 0;
        }
        return left - 1;
      });
    }, 1000);
  }

  async function requestCoach() {
    if (!prompt) return;
    setLoading(true);
    setError(undefined);
    try {
      const response = await fetch("/api/coach/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          part: prompt.part,
          prompt: prompt.prompt,
          cues: prompt.cues,
          transcript,
        }),
      });
      const data = (await response.json()) as {
        error?: string;
        feedback?: SpeakCoachFeedback;
      };
      if (!response.ok || !data.feedback) {
        throw new Error(data.error || "反馈失败");
      }
      const fb = data.feedback;
      setFeedback(fb);

      const sessionId = uuid();
      await saveSpeakingSession({
        id: sessionId,
        promptId: prompt.id,
        part: prompt.part,
        promptText: prompt.prompt,
        transcript,
        feedback: fb,
        durationSec: seconds || undefined,
        createdAt: new Date().toISOString(),
      });

      for (const upgrade of fb.upgrades ?? []) {
        await saveCoachNote({
          id: uuid(),
          kind: "upgrade",
          sourceSessionId: sessionId,
          original: upgrade.original,
          better: upgrade.better,
          why: upgrade.why,
          dueAt: new Date().toISOString(),
          mastered: false,
          createdAt: new Date().toISOString(),
        });
      }
      for (const phrase of fb.bandPhrases ?? []) {
        await saveCoachNote({
          id: uuid(),
          kind: "phrase",
          sourceSessionId: sessionId,
          better: phrase,
          dueAt: new Date().toISOString(),
          mastered: false,
          createdAt: new Date().toISOString(),
        });
      }

      await markTaskDone("speak");
      if (shadowMode) await markTaskDone("shadow");
    } catch (err) {
      setError(err instanceof Error ? err.message : "反馈失败");
    } finally {
      setLoading(false);
    }
  }

  const demoText = prompt
    ? `${prompt.prompt}${
        prompt.cues?.length ? `. Think about ${prompt.cues.join(", ")}.` : ""
      }`
    : "";

  return (
    <div className="min-h-screen">
      <SiteHeader
        crumb={[
          {
            href: "/speak",
            label: shadowMode ? "跟读精听" : "口语训练",
          },
        ]}
      />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="font-[family-name:var(--font-display)] text-3xl">
          {shadowMode ? "跟读 / 示范音" : "口语训练"}
        </h1>
        <p className="mt-2 text-[color:var(--muted)]">
          录音可选；至少提交文字稿才能拿 AI 反馈。Part 2 可先 1
          分钟准备再开录。
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {(["part1", "part2", "part3", "any"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setPartFilter(item);
                nextPrompt(item);
              }}
              className={`rounded-lg px-3 py-1.5 text-sm ${
                partFilter === item
                  ? "bg-[color:var(--accent)] text-white"
                  : "border border-[color:var(--line)] bg-white"
              }`}
            >
              {item === "any" ? "随机" : item.toUpperCase()}
            </button>
          ))}
          <Button variant="secondary" onClick={() => nextPrompt(partFilter)}>
            换题
          </Button>
        </div>

        {prompt && (
          <div className="mt-6 rounded-3xl border border-[color:var(--line)] bg-white/90 p-6">
            <p className="text-xs uppercase tracking-wide text-[color:var(--muted)]">
              {prompt.part} · {prompt.theme}
            </p>
            <p className="mt-3 text-lg leading-8">{prompt.prompt}</p>
            {prompt.cues && (
              <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-[color:var(--muted)]">
                {prompt.cues.map((cue) => (
                  <li key={cue}>{cue}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {demoText && (
          <div className="mt-5">
            <AudioPlayer text={demoText} lang="en-US" label="题目示范音" />
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {prompt?.part === "part2" && (
            <Button variant="secondary" onClick={startPart2Prep}>
              Part2 准备倒计时 60s
            </Button>
          )}
          {!recording ? (
            <Button onClick={() => void startRecording()}>开始录音</Button>
          ) : (
            <Button variant="secondary" onClick={stopRecording}>
              停止录音（{seconds}s）
            </Button>
          )}
          {!listening ? (
            <Button variant="secondary" onClick={startDictation}>
              语音转写
            </Button>
          ) : (
            <Button variant="secondary" onClick={stopDictation}>
              停止转写
            </Button>
          )}
          {prepLeft !== null && prepLeft > 0 && (
            <span className="text-sm text-amber-800">准备中：{prepLeft}s</span>
          )}
        </div>

        {audioUrl && <audio className="mt-4 w-full" controls src={audioUrl} />}

        <label className="mt-6 block text-sm text-[color:var(--muted)]">
          回答稿（转写或手打）
          <textarea
            className="mt-2 min-h-40 w-full rounded-2xl border border-[color:var(--line)] bg-white p-4 text-sm leading-7 outline-none focus:border-[color:var(--accent)]"
            value={transcript}
            onChange={(event) => setTranscript(event.target.value)}
            placeholder="Speak or type your answer in English..."
          />
        </label>

        <div className="mt-4">
          <Button
            size="lg"
            disabled={loading || transcript.trim().length < 20}
            onClick={() => void requestCoach()}
          >
            {loading ? "AI 点评中…" : "提交 AI 反馈"}
          </Button>
        </div>

        {error && <p className="mt-4 text-sm text-rose-700">{error}</p>}

        {feedback && (
          <section className="mt-8 space-y-4 rounded-3xl border border-[color:var(--line)] bg-white/90 p-6">
            <h2 className="font-[family-name:var(--font-display)] text-2xl">
              AI 反馈
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {(
                [
                  ["整体", feedback.scores.overall],
                  ["流利", feedback.scores.fluency],
                  ["词汇", feedback.scores.lexical],
                  ["语法", feedback.scores.grammar],
                  ["发音", feedback.scores.pronunciation],
                ] as const
              ).map(([label, score]) => (
                <div
                  key={label}
                  className="rounded-xl bg-[color:var(--panel)] px-3 py-3 text-center"
                >
                  <p className="text-xs text-[color:var(--muted)]">{label}</p>
                  <p className="mt-1 text-xl font-semibold">{score}</p>
                </div>
              ))}
            </div>
            <p className="text-sm leading-7">{feedback.summary}</p>
            {(feedback.upgrades?.length ?? 0) > 0 && (
              <div>
                <h3 className="font-medium">表达升级</h3>
                <ul className="mt-2 space-y-3 text-sm">
                  {feedback.upgrades.map((item) => (
                    <li
                      key={`${item.original}-${item.better}`}
                      className="rounded-xl bg-[color:var(--panel)] p-3 leading-6"
                    >
                      <p className="text-[color:var(--muted)]">
                        原文：{item.original}
                      </p>
                      <p className="mt-1 text-[color:var(--accent)]">
                        更好：{item.better}
                      </p>
                      <p className="mt-1">{item.why}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {(feedback.bandPhrases?.length ?? 0) > 0 && (
              <div>
                <h3 className="font-medium">可复用高分表达</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                  {feedback.bandPhrases.map((phrase) => (
                    <li key={phrase}>{phrase}</li>
                  ))}
                </ul>
              </div>
            )}
            <p className="text-sm text-[color:var(--muted)]">
              下一步：{feedback.nextPracticeTip}
            </p>
          </section>
        )}
      </main>
    </div>
  );
}
