"use client";

import { useEffect, useRef, useState } from "react";

interface AudioPlayerProps {
  text: string;
  lang?: string;
  label?: string;
}

export function AudioPlayer({
  text,
  lang = "en-US",
  label = "听力音频",
}: AudioPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [supported, setSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    // Stop audio when question text changes
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setPlaying(false);
  }, [text]);

  function handleToggle() {
    if (!supported || !text.trim()) return;

    if (playing) {
      window.speechSynthesis.pause();
      // Some browsers treat pause poorly; cancel if still speaking after pause attempt
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.cancel();
      }
      setPlaying(false);
      return;
    }

    // Resume if paused
    if (window.speechSynthesis.paused && utteranceRef.current) {
      window.speechSynthesis.resume();
      setPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.92;
    const voices = window.speechSynthesis.getVoices();
    const match = voices.find((voice) =>
      voice.lang.toLowerCase().startsWith(lang.slice(0, 2).toLowerCase()),
    );
    if (match) utterance.voice = match;

    utterance.onend = () => setPlaying(false);
    utterance.onerror = () => setPlaying(false);
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setPlaying(true);
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
        onClick={handleToggle}
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
          {playing ? "播放中，点击暂停" : "点击播放听力内容"}
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
