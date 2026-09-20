"use client";

import {
  ArrowLeft,
  ArrowRight,
  Flag,
} from "lucide-react";

type QuizNavigationProps = {
  currentIndex: number;
  total: number;
  hasAnswer: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
};

export function QuizNavigation({
  currentIndex,
  total,
  hasAnswer,
  onPrevious,
  onNext,
  onSubmit,
}: QuizNavigationProps) {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === total - 1;

  return (
    <div className="mt-10 flex items-center justify-between gap-3 border-t border-slate-200 pt-6">
      <button
        type="button"
        onClick={onPrevious}
        disabled={isFirst}
        className="flex min-h-12 items-center gap-2 rounded-2xl px-4 text-sm font-extrabold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <ArrowLeft size={18} />
        <span className="hidden sm:inline">
          Anterior
        </span>
      </button>

      {!isLast ? (
        <button
          type="button"
          onClick={onNext}
          disabled={!hasAnswer}
          className="flex min-h-12 items-center gap-2 rounded-2xl bg-slate-950 px-6 text-sm font-extrabold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
        >
          Siguiente
          <ArrowRight size={18} />
        </button>
      ) : (
        <button
          type="button"
          onClick={onSubmit}
          disabled={!hasAnswer}
          className="flex min-h-12 items-center gap-2 rounded-2xl bg-blue-600 px-6 text-sm font-extrabold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
        >
          Enviar
          <Flag size={17} />
        </button>
      )}
    </div>
  );
}
