"use client";

import { useState } from "react";
import {
  CheckCircle2,
  ListChecks,
  XCircle,
} from "lucide-react";

import type { QuizResultSummary } from "@/lib/results";
import { ReviewQuestion } from "@/components/results/ReviewQuestion";

type Filter =
  | "all"
  | "correct"
  | "incorrect";

type ReviewListProps = {
  result: QuizResultSummary;
};

export function ReviewList({
  result,
}: ReviewListProps) {
  const initialFilter: Filter =
    result.incorrectQuestions > 0
      ? "incorrect"
      : "all";

  const [filter, setFilter] =
    useState<Filter>(initialFilter);

  const filtered =
    result.questions.filter((item) => {
      if (filter === "correct") {
        return item.correct;
      }

      if (filter === "incorrect") {
        return !item.correct;
      }

      return true;
    });

  return (
    <section className="mt-10">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-400">
          Revisión
        </p>

        <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
          Revisa tus respuestas
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Entiende tus errores antes de volver a intentarlo.
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <FilterButton
          active={filter === "all"}
          onClick={() => setFilter("all")}
          icon={<ListChecks size={16} />}
          label={`Todas (${result.questions.length})`}
        />

        <FilterButton
          active={filter === "incorrect"}
          onClick={() =>
            setFilter("incorrect")
          }
          icon={<XCircle size={16} />}
          label={`Incorrectas (${result.incorrectQuestions})`}
        />

        <FilterButton
          active={filter === "correct"}
          onClick={() =>
            setFilter("correct")
          }
          icon={<CheckCircle2 size={16} />}
          label={`Correctas (${result.correctQuestions})`}
        />
      </div>

      <div className="mt-5 grid gap-4">
        {filtered.map((item) => {
          const originalIndex =
            result.questions.findIndex(
              (questionResult) =>
                questionResult.question.id ===
                item.question.id
            );

          return (
            <ReviewQuestion
              key={item.question.id}
              result={item}
              number={originalIndex + 1}
            />
          );
        })}
      </div>
    </section>
  );
}

function FilterButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-extrabold transition ${
        active
          ? "bg-slate-950 text-white"
          : "border border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-900"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
