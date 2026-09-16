import Link from "next/link";
import { EXAM_DESCRIPTIONS, EXAM_LABELS } from "@/lib/exams/constants";
import type { ExamCategory } from "@/lib/exams/types";
import { Card } from "@/components/ui/card";

interface ExamCardProps {
  examType: ExamCategory;
  paperCount: number;
}

export function ExamCard({ examType, paperCount }: ExamCardProps) {
  return (
    <Link href={`/exam/${examType}`} className="block transition hover:-translate-y-0.5">
      <Card className="h-full hover:border-indigo-200 hover:shadow-md">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {EXAM_LABELS[examType]}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {EXAM_DESCRIPTIONS[examType]}
            </p>
          </div>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
            {paperCount} 套
          </span>
        </div>
      </Card>
    </Link>
  );
}
