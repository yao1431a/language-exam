"use client";

import type { ExamPaper, Question } from "@/lib/exams/types";
import { AudioPlayer } from "@/components/AudioPlayer";
import { Button } from "@/components/ui/button";

interface QuestionViewerProps {
  paper: ExamPaper;
  answers: Record<string, string | string[]>;
  currentIndex: number;
  onAnswer: (questionId: string, value: string) => void;
  onNavigate: (index: number) => void;
  onSubmit: () => void;
}

function getAllQuestions(paper: ExamPaper): Question[] {
  return paper.sections.flatMap((section) => section.questions);
}

function isListeningQuestion(question: Question, sectionId?: string): boolean {
  return (
    question.type === "listening" ||
    sectionId === "listening" ||
    Boolean(question.audioText)
  );
}

export function QuestionViewer({
  paper,
  answers,
  currentIndex,
  onAnswer,
  onNavigate,
  onSubmit,
}: QuestionViewerProps) {
  const questions = getAllQuestions(paper);
  const question = questions[currentIndex];
  const section = paper.sections.find((item) =>
    item.questions.some((q) => q.id === question.id),
  );
  const listening = isListeningQuestion(question, section?.id);
  const audioText =
    question.audioText ||
    question.passage ||
    "Please listen carefully to the following announcement.";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-[color:var(--muted)]">{section?.name ?? "题目"}</p>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[color:var(--ink)]">
            第 {currentIndex + 1} / {questions.length} 题
          </h2>
        </div>
        <Button variant="secondary" onClick={onSubmit}>
          交卷评分
        </Button>
      </div>

      <div className="rounded-3xl border border-[color:var(--line)] bg-white/90 p-5 shadow-sm sm:p-6">
        {listening && (
          <div className="mb-5">
            <AudioPlayer
              text={audioText}
              lang={question.audioLang || (paper.examType.startsWith("jlpt-") ? "ja-JP" : "en-US")}
              label="听力播放"
            />
            <p className="mt-3 text-xs text-[color:var(--muted)]">
              先听音频再作答。需要时可展开文本核对。
            </p>
            <details className="mt-3">
              <summary className="cursor-pointer text-sm text-[color:var(--accent)]">
                查看听力文本
              </summary>
              <div className="mt-2 rounded-xl bg-[color:var(--panel)] p-4 text-sm leading-7 text-[color:var(--ink)]">
                {audioText}
              </div>
            </details>
          </div>
        )}

        {!listening && question.passage && (
          <div className="mb-4 rounded-xl bg-[color:var(--panel)] p-4 text-sm leading-7 text-[color:var(--ink)]">
            {question.passage}
          </div>
        )}

        <p className="text-base leading-7 text-[color:var(--ink)]">{question.prompt}</p>

        <div className="mt-6 space-y-3">
          {(question.options ?? []).map((option) => {
            const selected = answers[question.id] === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => onAnswer(question.id, option)}
                className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                  selected
                    ? "border-[color:var(--accent)] bg-[color:var(--accent-soft)] text-[color:var(--ink)]"
                    : "border-[color:var(--line)] bg-white hover:border-[color:var(--accent)]"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="secondary"
          disabled={currentIndex === 0}
          onClick={() => onNavigate(currentIndex - 1)}
        >
          上一题
        </Button>
        <Button
          disabled={currentIndex >= questions.length - 1}
          onClick={() => onNavigate(currentIndex + 1)}
        >
          下一题
        </Button>
      </div>
    </div>
  );
}
