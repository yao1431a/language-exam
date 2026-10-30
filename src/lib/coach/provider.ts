import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import {
  buildSpeakCoachSystemPrompt,
  buildSpeakCoachUserPrompt,
  speakFeedbackSchema,
  type SpeakFeedbackParsed,
} from "./feedback";

export type AiProviderName = "anthropic" | "openai";

export function resolveProvider(): {
  provider: AiProviderName;
  modelId: string;
} {
  const forced = process.env.AI_PROVIDER?.toLowerCase();
  const hasAnthropic = Boolean(process.env.ANTHROPIC_API_KEY?.trim());
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY?.trim());

  if (forced === "openai" && hasOpenAI) {
    return { provider: "openai", modelId: "gpt-4o-mini" };
  }
  if (forced === "anthropic" && hasAnthropic) {
    return { provider: "anthropic", modelId: "claude-sonnet-4-5" };
  }
  if (hasAnthropic) {
    return { provider: "anthropic", modelId: "claude-sonnet-4-5" };
  }
  if (hasOpenAI) {
    return { provider: "openai", modelId: "gpt-4o-mini" };
  }
  throw new Error(
    "未配置 AI Key：请在 .env.local 设置 ANTHROPIC_API_KEY 或 OPENAI_API_KEY",
  );
}

export async function coachSpeaking(input: {
  part: string;
  prompt: string;
  cues?: string[];
  transcript: string;
}): Promise<{ feedback: SpeakFeedbackParsed; provider: AiProviderName; modelId: string }> {
  const { provider, modelId } = resolveProvider();

  const model =
    provider === "anthropic"
      ? createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY })(modelId)
      : createOpenAI({ apiKey: process.env.OPENAI_API_KEY })(modelId);

  const { object } = await generateObject({
    model,
    schema: speakFeedbackSchema,
    system: buildSpeakCoachSystemPrompt(),
    prompt: buildSpeakCoachUserPrompt(input),
    temperature: 0.4,
  });

  return { feedback: object, provider, modelId };
}

export function providerStatus(): {
  configured: boolean;
  provider?: AiProviderName;
  message: string;
} {
  try {
    const { provider, modelId } = resolveProvider();
    return {
      configured: true,
      provider,
      message: `已配置 ${provider}（${modelId}）`,
    };
  } catch (error) {
    return {
      configured: false,
      message: error instanceof Error ? error.message : "未配置 AI",
    };
  }
}
