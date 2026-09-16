/**
 * External open-source question providers.
 *
 * IMPORTANT: Official TOEIC / TOEFL / IELTS / JLPT past papers are copyrighted.
 * We only fetch openly licensed vocabulary/grammar datasets and generate
 * original practice questions from them — never scrape official exam PDFs.
 */

import type { ExamCategory, Question } from "./types";

export type BankEntry = Omit<Question, "id">;

interface JlptVocabWord {
  word: string;
  meaning: string;
  furigana?: string;
  romaji?: string;
  level: number;
}

interface JlptGrammarItem {
  id: number;
  grammar: string;
  romaji: string;
  meaning: string;
  example: string;
  level: number;
}

const JLPT_VOCAB_API = "https://jlpt-vocab-api.vercel.app/api/words";
const JLPT_GRAMMAR_API = "https://jlpt-grammar-api.vercel.app/api/grammar";

const LEVEL_MAP: Record<string, number> = {
  n1: 1,
  n2: 2,
  n3: 3,
  n4: 4,
  n5: 5,
};

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function distractors(words: JlptVocabWord[], correct: JlptVocabWord, count = 3): string[] {
  return shuffle(words.filter((w) => w.word !== correct.word && w.meaning))
    .slice(0, count)
    .map((w) => w.meaning.split(";")[0].trim());
}

export function vocabToQuestions(words: JlptVocabWord[], limit = 40): BankEntry[] {
  const usable = words.filter((w) => w.word && w.meaning);
  const pool = shuffle(usable).slice(0, limit);

  return pool.flatMap((word, index) => {
    const meaning = word.meaning.split(";")[0].trim();
    const wrong = distractors(usable, word);
    while (wrong.length < 3) wrong.push(`选项${wrong.length + 1}`);

    const meaningOptions = shuffle([meaning, ...wrong.slice(0, 3)]);
    const readingOptions = shuffle([
      word.furigana || word.romaji || word.word,
      ...shuffle(usable)
        .filter((w) => w.word !== word.word)
        .slice(0, 3)
        .map((w) => w.furigana || w.romaji || w.word),
    ]);

    const items: BankEntry[] = [
      {
        type: "single",
        prompt: `「${word.word}」的意思是？`,
        options: meaningOptions,
        correctAnswer: meaning,
        explanation: word.furigana
          ? `读音：${word.furigana}（${word.romaji ?? ""}）`
          : word.romaji,
      },
    ];

    if (word.furigana || word.romaji) {
      items.push({
        type: "single",
        prompt: `「${word.word}」的正确读音是？`,
        options: readingOptions,
        correctAnswer: word.furigana || word.romaji || word.word,
        explanation: `意思：${meaning}`,
      });
    }

    // Alternate question style for variety
    if (index % 3 === 0) {
      items.push({
        type: "single",
        prompt: `下列哪个词表示「${meaning}」？`,
        options: shuffle([
          word.word,
          ...shuffle(usable)
            .filter((w) => w.word !== word.word)
            .slice(0, 3)
            .map((w) => w.word),
        ]),
        correctAnswer: word.word,
      });
    }

    return items;
  });
}

export function grammarToQuestions(items: JlptGrammarItem[], limit = 20): BankEntry[] {
  return shuffle(items)
    .slice(0, limit)
    .map((item) => {
      const wrong = shuffle(items.filter((g) => g.id !== item.id))
        .slice(0, 3)
        .map((g) => g.meaning);
      return {
        type: "single" as const,
        prompt: `语法「${item.grammar}」的含义是？`,
        passage: item.example,
        options: shuffle([item.meaning, ...wrong]),
        correctAnswer: item.meaning,
        explanation: `罗马音：${item.romaji}`,
      };
    });
}

export async function fetchJlptVocab(level: number, limit = 80): Promise<JlptVocabWord[]> {
  // Prefer a stable first page; some offsets on the public API return empty arrays.
  const pages: JlptVocabWord[] = [];
  const pageSize = Math.min(limit, 50);
  for (const offset of [0, pageSize, pageSize * 2]) {
    if (pages.length >= limit) break;
    const url = `${JLPT_VOCAB_API}?level=${level}&limit=${pageSize}&offset=${offset}`;
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) continue;
    const data = (await response.json()) as { words?: JlptVocabWord[] };
    if (data.words?.length) pages.push(...data.words);
  }

  // Fallback: random endpoint if list pagination failed
  if (pages.length === 0) {
    for (let i = 0; i < Math.min(limit, 30); i += 1) {
      const response = await fetch(`${JLPT_VOCAB_API}/random?level=${level}`, {
        cache: "no-store",
      });
      if (!response.ok) continue;
      const word = (await response.json()) as JlptVocabWord;
      if (word?.word) pages.push(word);
    }
  }

  // Deduplicate by word
  const seen = new Set<string>();
  return pages.filter((word) => {
    if (!word.word || seen.has(word.word)) return false;
    seen.add(word.word);
    return true;
  }).slice(0, limit);
}

export async function fetchJlptGrammar(level: number): Promise<JlptGrammarItem[]> {
  // Grammar API currently documents N5/N4; fall back gracefully for higher levels
  const label = `N${level}`;
  try {
    const response = await fetch(`${JLPT_GRAMMAR_API}/${label}`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return [];
    return (await response.json()) as JlptGrammarItem[];
  } catch {
    return [];
  }
}

export async function fetchOpenJlptQuestions(
  examType: ExamCategory,
): Promise<{ questions: BankEntry[]; sources: string[] }> {
  if (!examType.startsWith("jlpt-")) {
    return { questions: [], sources: [] };
  }

  const levelKey = examType.replace("jlpt-", "");
  const level = LEVEL_MAP[levelKey] ?? 5;
  const sources: string[] = [];
  const questions: BankEntry[] = [];

  try {
    const words = await fetchJlptVocab(level, 60);
    questions.push(...vocabToQuestions(words, 50));
    sources.push("jlpt-vocab-api.vercel.app (open JLPT vocabulary)");
  } catch (error) {
    console.warn("JLPT vocab fetch failed", error);
  }

  try {
    const grammar = await fetchJlptGrammar(Math.min(level, 5));
    if (grammar.length > 0) {
      questions.push(...grammarToQuestions(grammar, 15));
      sources.push("jlpt-grammar-api.vercel.app (open JLPT grammar)");
    }
  } catch (error) {
    console.warn("JLPT grammar fetch failed", error);
  }

  return { questions, sources };
}

export const OPEN_SOURCE_ATTRIBUTION = [
  "JLPT Vocabulary API — https://jlpt-vocab-api.vercel.app",
  "JLPT Grammar API — https://jlpt-grammar-api.vercel.app (N5/N4)",
  "Official ETS / IELTS / JLPT past papers are copyrighted and are NOT downloaded.",
];
