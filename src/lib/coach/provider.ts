import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import {
  buildSpeakCoachSystemPrompt,
  buildSpeakCoachUserPrompt,
  speakFeedbackSchema,
  type SpeakFeedbackParsed,
} from "./feedback";
import { localSpeakFeedback } from "./local";

export type AiProviderName = "anthropic" | "openai" | "local";

/** Real LLM only when explicitly enabled AND a key exists. */
export function isCloudAiEnabled(): boolean {
  const flag = process.env.AI_COACH_ENABLED?.trim().toLowerCase();
  if (flag !== "1" && flag !== "true" && flag !== "yes") return false;
  return Boolean(
    process.env.ANTHROPIC_API_KEY?.trim() || process.env.OPENAI_API_KEY?.trim(),
  );
}

export function resolveProvider(): {
  provider: Exclude<AiProviderName, "local">;
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
}): Promise<{
  feedback: SpeakFeedbackParsed;
  provider: AiProviderName;
  modelId: string;
}> {
  // Default path: no cloud call — keep practising without keys.
  if (!isCloudAiEnabled()) {
    return {
      feedback: localSpeakFeedback(input),
      provider: "local",
      modelId: "heuristic-v1",
    };
  }

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
  cloudEnabled: boolean;
  provider?: AiProviderName;
  message: string;
} {
  const cloudEnabled = isCloudAiEnabled();
  if (!cloudEnabled) {
    const hasKey = Boolean(
      process.env.ANTHROPIC_API_KEY?.trim() ||
        process.env.OPENAI_API_KEY?.trim(),
    );
    return {
      configured: true,
      cloudEnabled: false,
      provider: "local",
      message: hasKey
        ? "当前使用本地启发式点评（已检测到 Key，但未开启 AI_COACH_ENABLED）"
        : "当前使用本地启发式点评（未连云端 AI；接口已保留）",
    };
  }

  try {
    const { provider, modelId } = resolveProvider();
    return {
      configured: true,
      cloudEnabled: true,
      provider,
      message: `云端 AI 已开启：${provider}（${modelId}）`,
    };
  } catch (error) {
    return {
      configured: false,
      cloudEnabled: false,
      provider: "local",
      message: error instanceof Error ? error.message : "未配置 AI",
    };
  }
}
