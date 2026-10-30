import { z } from "zod";

export const speakFeedbackSchema = z.object({
  scores: z.object({
    fluency: z.number().min(0).max(9),
    lexical: z.number().min(0).max(9),
    grammar: z.number().min(0).max(9),
    pronunciation: z.number().min(0).max(9),
    overall: z.number().min(0).max(9),
  }),
  summary: z.string(),
  upgrades: z
    .array(
      z.object({
        original: z.string(),
        better: z.string(),
        why: z.string(),
      }),
    )
    .max(6),
  bandPhrases: z.array(z.string()).max(5),
  nextPracticeTip: z.string(),
});

export type SpeakFeedbackParsed = z.infer<typeof speakFeedbackSchema>;

export function buildSpeakCoachSystemPrompt() {
  return `You are an IELTS Speaking coach helping an adult learner aiming for band 7+.
The learner understands English well (CET-6 background, watches YouTube/US shows) but speaking output has atrophied: short simple sentences, hesitation on complex ideas.

Score roughly on IELTS 0–9 scales. Be honest but encouraging.
Focus feedback on: longer coherent turns, linking devices, precise vocabulary, complex but accurate grammar.
Pronunciation score should be cautious if only text transcript is available — infer from spelling of pauses/fillers if present, otherwise give a moderate estimate and say so briefly in summary.

Respond ONLY with valid JSON matching the schema fields:
scores {fluency, lexical, grammar, pronunciation, overall},
summary, upgrades[{original, better, why}], bandPhrases[string], nextPracticeTip.`;
}

export function buildSpeakCoachUserPrompt(input: {
  part: string;
  prompt: string;
  cues?: string[];
  transcript: string;
}) {
  const cues =
    input.cues && input.cues.length > 0
      ? `\nCue cards:\n- ${input.cues.join("\n- ")}`
      : "";
  return `IELTS Speaking ${input.part}
Question: ${input.prompt}${cues}

Learner transcript / draft answer:
"""
${input.transcript.trim()}
"""

Return JSON feedback now.`;
}
