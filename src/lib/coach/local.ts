import type { SpeakFeedbackParsed } from "./feedback";

/** Offline / no-API heuristic coach — keeps practice usable without LLM keys. */
export function localSpeakFeedback(input: {
  part: string;
  prompt: string;
  transcript: string;
}): SpeakFeedbackParsed {
  const text = input.transcript.trim();
  const words = text.split(/\s+/).filter(Boolean);
  const sentences = text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const wordCount = words.length;
  const avgLen =
    sentences.length > 0 ? wordCount / sentences.length : wordCount;

  const hasLinker =
    /\b(because|although|however|whereas|therefore|for example|on the other hand|as a result|in terms of)\b/i.test(
      text,
    );
  const hasComplex =
    /\b(which|that|who|when|if|while|since)\b/i.test(text) || avgLen >= 12;
  const tooShort = wordCount < 40;
  const fillerHeavy = (text.match(/\b(um|uh|like|you know)\b/gi) ?? []).length >= 3;

  let fluency = 5.5;
  let lexical = 5.5;
  let grammar = 5.5;
  if (!tooShort) fluency += 0.5;
  if (wordCount >= 80) fluency += 0.5;
  if (fillerHeavy) fluency -= 0.5;
  if (hasLinker) lexical += 0.7;
  if (hasComplex) grammar += 0.7;
  if (avgLen >= 15) grammar += 0.3;
  if (tooShort) {
    fluency -= 0.8;
    lexical -= 0.5;
    grammar -= 0.5;
  }

  const clamp = (n: number) =>
    Math.round(Math.min(7.5, Math.max(4.0, n)) * 10) / 10;

  fluency = clamp(fluency);
  lexical = clamp(lexical);
  grammar = clamp(grammar);
  const pronunciation = 5.5;
  const overall = clamp((fluency + lexical + grammar + pronunciation) / 4);

  const upgrades: SpeakFeedbackParsed["upgrades"] = [];
  if (tooShort) {
    upgrades.push({
      original: text.slice(0, 80) || "(short answer)",
      better:
        "Aim for 4–6 sentences: main idea → reason → example → short conclusion.",
      why: "Band 7 answers usually develop ideas instead of stopping at one short sentence.",
    });
  }
  if (!hasLinker) {
    upgrades.push({
      original: "I like it. It is useful.",
      better:
        "I find it useful because it helps me practise longer turns; as a result, I feel more confident.",
      why: "Linking words (because / as a result / whereas) raise coherence scores.",
    });
  }
  if (!hasComplex) {
    upgrades.push({
      original: "I watch videos. I learn English.",
      better:
        "When I watch documentaries, I pick up natural phrases that I can reuse in speaking.",
      why: "A subordinate clause makes the sentence sound less choppy.",
    });
  }
  if (upgrades.length === 0) {
    upgrades.push({
      original: sentences[0] || text.slice(0, 60),
      better: `${sentences[0] || "My main point is clear"}, and what matters more is that I can support it with a concrete example.`,
      why: "Extend one idea with a specific example to push toward band 7.",
    });
  }

  return {
    scores: {
      fluency,
      lexical,
      grammar,
      pronunciation,
      overall,
    },
    summary: `本地启发式点评（未调用云端 AI）。约 ${wordCount} 词、${sentences.length} 句。${
      tooShort
        ? "回答偏短，先把内容拉长。"
        : hasLinker && hasComplex
          ? "已有连接与从句意识，继续练具体例子。"
          : "可加强连接词与复杂句。"
    } 发音分仅为占位；配置 API Key 并设置 AI_COACH_ENABLED=1 后可换真实 AI。`,
    upgrades: upgrades.slice(0, 4),
    bandPhrases: [
      "What I mean is…",
      "A good example of this is…",
      "On the other hand…",
      "In terms of my daily routine…",
    ],
    nextPracticeTip: tooShort
      ? "下一题用计时器说满 45–60 秒，先保证量，再追求准。"
      : "把上面 1–2 个升级句跟读三遍，再换一道同主题题复述。",
  };
}
