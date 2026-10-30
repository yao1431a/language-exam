export type SessionMode = "focus" | "deep" | "fullday";

export type SpeakingPart = "part1" | "part2" | "part3";

export interface SpeakingPrompt {
  id: string;
  part: SpeakingPart;
  theme: string;
  prompt: string;
  /** Part 2 cue bullets */
  cues?: string[];
}

export interface SpeakCoachScores {
  fluency: number;
  lexical: number;
  grammar: number;
  pronunciation: number;
  overall: number;
}

export interface SpeakCoachFeedback {
  scores: SpeakCoachScores;
  summary: string;
  upgrades: { original: string; better: string; why: string }[];
  bandPhrases: string[];
  nextPracticeTip: string;
}

export interface VocabCard {
  id: string;
  word: string;
  phonetic?: string;
  meaningZh: string;
  example: string;
  theme: string;
  /** SM-2-ish */
  ease: number;
  intervalDays: number;
  repetitions: number;
  dueAt: string;
  lastResult?: "know" | "fuzzy" | "unknown";
  createdAt: string;
}

export interface SpeakingSession {
  id: string;
  promptId: string;
  part: SpeakingPart;
  promptText: string;
  transcript: string;
  feedback?: SpeakCoachFeedback;
  durationSec?: number;
  createdAt: string;
}

export interface CoachNote {
  id: string;
  kind: "upgrade" | "phrase" | "error";
  sourceSessionId?: string;
  original?: string;
  better: string;
  why?: string;
  dueAt: string;
  mastered: boolean;
  createdAt: string;
}

export interface DailyPlanTask {
  id: string;
  type: "vocab" | "speak" | "notes" | "shadow" | "mock";
  title: string;
  href: string;
  done: boolean;
  meta?: string;
}

export interface DailyPlan {
  id: string;
  date: string;
  mode: SessionMode;
  tasks: DailyPlanTask[];
  createdAt: string;
}
