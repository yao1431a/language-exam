"use client";

import type { ExamPaper, Question } from "@/lib/exams/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
  const sectionName =
    paper.sections.find((section) =>
      section.questions.some((item) => item.id === question.id),
    )?.name ?? "题目";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{sectionName}</p>
          <h2 className="text-xl font-semibold text-slate-900">
            第 {currentIndex + 1} / {questions.length} 题
          </h2>
        </div>
        <Button variant="secondary" onClick={onSubmit}>
          交卷评分
        </Button>
      </div>

      <Card>
        {question.passage && (
          <div className="mb-4 rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
            {question.passage}
          </div>
        )}
        <p className="text-base leading-7 text-slate-900">{question.prompt}</p>

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
                    ? "border-indigo-500 bg-indigo-50 text-indigo-900"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </Card>

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
