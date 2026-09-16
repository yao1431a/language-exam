"use client";

import { useEffect, useRef, useState } from "react";

interface AudioPlayerProps {
  text: string;
  lang?: string;
  label?: string;
}

function normalizeLang(lang: string): string {
  return lang.replace("_", "-");
}

function langPrefix(lang: string): string {
  return normalizeLang(lang).split("-")[0]?.toLowerCase() ?? "en";
}

/** Prefer natural local voices; avoid novelty / compact / emoji voices. */
function scoreVoice(voice: SpeechSynthesisVoice, lang: string): number {
  const target = normalizeLang(lang).toLowerCase();
  const prefix = langPrefix(lang);
  const voiceLang = normalizeLang(voice.lang).toLowerCase();
  const name = voice.name.toLowerCase();

  let score = 0;

  if (voiceLang === target) score += 100;
  else if (voiceLang.startsWith(`${prefix}-`) || voiceLang === prefix) score += 70;
  else return -1;

  if (voice.localService) score += 25;

  // Prefer clearly gendered / natural system voices
  if (/\b(female|male|woman|man|samantha|alex|daniel|karen|moira|kyoko|otoya|google|microsoft|premium|enhanced|neural)\b/i.test(name)) {
    score += 20;
  }

  if (/compact|novelty|whisper|zarvox|bad news|good news|bells|organ|cellos|bubbles|boing|junior|dummy/i.test(name)) {
    score -= 80;
  }

  // Prefer non-default remote “mystery” voices less than named locals
  if (!voice.localService && /google|microsoft|samsung/.test(name)) score += 10;

  return score;
}

function pickVoice(
  voices: SpeechSynthesisVoice[],
  lang: string,
): SpeechSynthesisVoice | null {
  let best: SpeechSynthesisVoice | null = null;
  let bestScore = -1;

  for (const voice of voices) {
    const score = scoreVoice(voice, lang);
    if (score > bestScore) {
      best = voice;
      bestScore = score;
    }
  }

  return bestScore >= 0 ? best : null;
}

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return Promise.resolve([]);
  }

  const existing = window.speechSynthesis.getVoices();
  if (existing.length > 0) return Promise.resolve(existing);

  return new Promise((resolve) => {
    let settled = false;
    const finish = (voices: SpeechSynthesisVoice[]) => {
      if (settled) return;
      settled = true;
      window.speechSynthesis.removeEventListener("voiceschanged", onChange);
      resolve(voices);
    };

    const onChange = () => finish(window.speechSynthesis.getVoices());
    window.speechSynthesis.addEventListener("voiceschanged", onChange);

    // Some engines populate voices on a later tick without firing the event.
    window.setTimeout(() => finish(window.speechSynthesis.getVoices()), 400);
  });
}

export function AudioPlayer({
  text,
  lang = "en-US",
  label = "听力音频",
}: AudioPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [supported, setSupported] = useState(true);
  const [voiceLabel, setVoiceLabel] = useState<string>();
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const ok = typeof window !== "undefined" && "speechSynthesis" in window;
    setSupported(ok);
    if (!ok) return;

    let cancelled = false;
    loadVoices().then((voices) => {
      if (cancelled) return;
      voicesRef.current = voices;
      const match = pickVoice(voices, lang);
      if (match) setVoiceLabel(match.name);
    });

    return () => {
      cancelled = true;
      window.speechSynthesis.cancel();
    };
  }, [lang]);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    utteranceRef.current = null;
    setPlaying(false);
  }, [text]);

  async function handleToggle() {
    if (!supported || !text.trim()) return;

    if (playing) {
      // cancel is more reliable than pause across Chrome / Safari
      window.speechSynthesis.cancel();
      utteranceRef.current = null;
      setPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();

    if (voicesRef.current.length === 0) {
      voicesRef.current = await loadVoices();
    }

    const utterance = new SpeechSynthesisUtterance(text.trim());
    utterance.lang = normalizeLang(lang);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    const match = pickVoice(voicesRef.current, lang);
    if (match) {
      utterance.voice = match;
      utterance.lang = match.lang || utterance.lang;
      setVoiceLabel(match.name);
    }

    utterance.onend = () => {
      utteranceRef.current = null;
      setPlaying(false);
    };
    utterance.onerror = () => {
      utteranceRef.current = null;
      setPlaying(false);
    };

    utteranceRef.current = utterance;

    // Chrome occasionally drops the first speak() after cancel(); microtask helps.
    window.setTimeout(() => {
      if (utteranceRef.current !== utterance) return;
      window.speechSynthesis.speak(utterance);
      setPlaying(true);
    }, 40);
  }

  if (!supported) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        当前浏览器不支持语音播放，请更换 Chrome / Edge / Safari。
      </div>
    );
  }

  return (
    <div className="audio-player flex items-center gap-4 rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel)] px-4 py-4">
      <button
        type="button"
        onClick={() => {
          void handleToggle();
        }}
        aria-label={playing ? "暂停听力" : "播放听力"}
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[color:var(--accent)] text-white shadow-md transition hover:scale-105 active:scale-95"
      >
        {playing ? (
          <span className="flex gap-1">
            <span className="h-5 w-1.5 rounded-sm bg-white" />
            <span className="h-5 w-1.5 rounded-sm bg-white" />
          </span>
        ) : (
          <span className="ml-1 border-y-[10px] border-l-[16px] border-y-transparent border-l-white" />
        )}
      </button>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-[color:var(--ink)]">{label}</p>
        <p className="mt-1 text-xs text-[color:var(--muted)]">
          {playing
            ? "播放中，点击停止"
            : voiceLabel
              ? `点击播放（${voiceLabel}）`
              : "点击播放听力内容"}
        </p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[color:var(--line)]">
          <div
            className={`h-full rounded-full bg-[color:var(--accent)] ${playing ? "audio-wave" : "w-0"}`}
          />
        </div>
      </div>
    </div>
  );
}
