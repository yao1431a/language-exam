import type { DailyPlan, DailyPlanTask, SessionMode } from "./types";

function todayKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

export function buildDailyTasks(mode: SessionMode): DailyPlanTask[] {
  const base: DailyPlanTask[] = [
    {
      id: "vocab",
      type: "vocab",
      title: "词汇唤醒（SRS）",
      href: "/vocab",
      done: false,
      meta: mode === "focus" ? "约 15–20 词" : "约 30–50 词 / 多轮",
    },
    {
      id: "speak",
      type: "speak",
      title: "口语训练 + 教练反馈",
      href: "/speak",
      done: false,
      meta:
        mode === "focus"
          ? "1 组题（Part1 或 Part2）"
          : mode === "deep"
            ? "Part1 + Part2 + Part3"
            : "多轮 Part1/2/3，穿插跟读",
    },
    {
      id: "notes",
      type: "notes",
      title: "复习好句 / 错句本",
      href: "/notes",
      done: false,
      meta: "把昨天的升级表达再说一遍",
    },
  ];

  if (mode !== "focus") {
    base.push({
      id: "shadow",
      type: "shadow",
      title: "跟读精听（服务口语节奏）",
      href: "/speak?mode=shadow",
      done: false,
      meta: "选一段示范音跟读 2–3 遍",
    });
  }

  if (mode === "fullday") {
    base.push({
      id: "mock",
      type: "mock",
      title: "轻量诊断（工具箱模考）",
      href: "/toolbox",
      done: false,
      meta: "可选：IELTS 听力或阅读专项",
    });
  }

  return base;
}

export function createDailyPlan(mode: SessionMode): DailyPlan {
  const date = todayKey();
  return {
    id: `plan-${date}`,
    date,
    mode,
    tasks: buildDailyTasks(mode),
    createdAt: new Date().toISOString(),
  };
}

export const SESSION_MODE_LABELS: Record<SessionMode, string> = {
  focus: "Focus · 40–60 分钟",
  deep: "Deep · 2–3 小时",
  fullday: "FullDay · 4–6 小时",
};
