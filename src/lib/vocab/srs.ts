import type { VocabCard } from "@/lib/coach/types";
import { VOCAB_SEEDS } from "./seed";

function nowIso() {
  return new Date().toISOString();
}

export function createCardFromSeed(
  seed: (typeof VOCAB_SEEDS)[number],
  index: number,
): VocabCard {
  return {
    id: `vocab-${seed.word.replace(/\s+/g, "-")}-${index}`,
    word: seed.word,
    phonetic: seed.phonetic,
    meaningZh: seed.meaningZh,
    example: seed.example,
    theme: seed.theme,
    ease: 2.5,
    intervalDays: 0,
    repetitions: 0,
    dueAt: nowIso(),
    createdAt: nowIso(),
  };
}

export function buildSeedCards(): VocabCard[] {
  return VOCAB_SEEDS.map((seed, index) => createCardFromSeed(seed, index));
}

/** Simplified SM-2 style update */
export function reviewCard(
  card: VocabCard,
  result: "know" | "fuzzy" | "unknown",
): VocabCard {
  const next = { ...card, lastResult: result };
  const today = new Date();

  if (result === "unknown") {
    next.repetitions = 0;
    next.intervalDays = 0;
    next.ease = Math.max(1.3, next.ease - 0.2);
    next.dueAt = today.toISOString();
    return next;
  }

  if (result === "fuzzy") {
    next.repetitions = Math.max(0, next.repetitions);
    next.intervalDays = 1;
    next.ease = Math.max(1.3, next.ease - 0.05);
  } else {
    next.repetitions += 1;
    if (next.repetitions === 1) next.intervalDays = 1;
    else if (next.repetitions === 2) next.intervalDays = 3;
    else next.intervalDays = Math.round(next.intervalDays * next.ease);
    next.ease = Math.min(3.0, next.ease + 0.05);
  }

  const due = new Date(today);
  due.setDate(due.getDate() + Math.max(1, next.intervalDays));
  next.dueAt = due.toISOString();
  return next;
}

export function isDue(card: VocabCard, at = new Date()): boolean {
  return new Date(card.dueAt).getTime() <= at.getTime();
}
