import type { SpeakingPrompt } from "@/lib/coach/types";

/** Original practice prompts inspired by IELTS Speaking themes (not real exam papers). */

export const SPEAKING_PROMPTS: SpeakingPrompt[] = [
  {
    id: "p1-daily-1",
    part: "part1",
    theme: "daily",
    prompt: "What do you usually do in the mornings?",
  },
  {
    id: "p1-daily-2",
    part: "part1",
    theme: "daily",
    prompt: "Do you prefer weekdays or weekends? Why?",
  },
  {
    id: "p1-home-1",
    part: "part1",
    theme: "hometown",
    prompt: "What do you like most about the place where you live?",
  },
  {
    id: "p1-food-1",
    part: "part1",
    theme: "food",
    prompt: "What kinds of food do you enjoy cooking or eating at home?",
  },
  {
    id: "p1-media-1",
    part: "part1",
    theme: "media",
    prompt: "How often do you watch videos online, and what topics interest you?",
  },
  {
    id: "p1-work-1",
    part: "part1",
    theme: "work",
    prompt: "Do you like working from home? What are the advantages for you?",
  },
  {
    id: "p1-lang-1",
    part: "part1",
    theme: "language",
    prompt: "Why are you practising English at the moment?",
  },
  {
    id: "p1-leisure-1",
    part: "part1",
    theme: "leisure",
    prompt: "How do you usually relax after a busy day?",
  },
  {
    id: "p2-person-1",
    part: "part2",
    theme: "people",
    prompt: "Describe a person who has influenced the way you learn.",
    cues: [
      "who the person is",
      "how you know them",
      "what they taught or showed you",
      "and explain how this influence still matters today",
    ],
  },
  {
    id: "p2-place-1",
    part: "part2",
    theme: "travel",
    prompt: "Describe a place you would like to visit again.",
    cues: [
      "where it is",
      "when you went there",
      "what you did",
      "and explain why you want to return",
    ],
  },
  {
    id: "p2-skill-1",
    part: "part2",
    theme: "education",
    prompt: "Describe a skill you want to improve this year.",
    cues: [
      "what the skill is",
      "why it matters to you",
      "how you plan to practise",
      "and explain what success would look like",
    ],
  },
  {
    id: "p2-media-1",
    part: "part2",
    theme: "media",
    prompt: "Describe a film, show, or video series that taught you something useful.",
    cues: [
      "what it was about",
      "when you watched it",
      "what you learned",
      "and explain why you would recommend it",
    ],
  },
  {
    id: "p2-change-1",
    part: "part2",
    theme: "goals",
    prompt: "Describe a change you recently made to your daily routine.",
    cues: [
      "what you changed",
      "why you made the change",
      "how it has affected you",
      "and explain whether you will keep it",
    ],
  },
  {
    id: "p3-work-1",
    part: "part3",
    theme: "work",
    prompt: "How has remote work changed people's lifestyles in your country?",
  },
  {
    id: "p3-edu-1",
    part: "part3",
    theme: "education",
    prompt: "Do you think adults learn languages differently from children? Why?",
  },
  {
    id: "p3-tech-1",
    part: "part3",
    theme: "media",
    prompt: "What are the benefits and risks of getting news mainly from social media?",
  },
  {
    id: "p3-city-1",
    part: "part3",
    theme: "hometown",
    prompt: "Should governments invest more in public transport or private cars? Why?",
  },
  {
    id: "p3-health-1",
    part: "part3",
    theme: "health",
    prompt: "Why do many people struggle to keep healthy habits even when they know what to do?",
  },
  {
    id: "p3-lang-1",
    part: "part3",
    theme: "language",
    prompt: "In a globalised world, is one international language enough, or should people learn several?",
  },
];

export function pickRandomPrompts(
  part: SpeakingPrompt["part"] | "any",
  count: number,
): SpeakingPrompt[] {
  const pool =
    part === "any"
      ? [...SPEAKING_PROMPTS]
      : SPEAKING_PROMPTS.filter((item) => item.part === part);
  const copy = [...pool];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(count, copy.length));
}

export function getPromptById(id: string): SpeakingPrompt | undefined {
  return SPEAKING_PROMPTS.find((item) => item.id === id);
}
