"use client";

import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Flag,
  Grid2X2,
} from "lucide-react";

type QuizFooterProps = {
  currentIndex: number;
  total: number;
  hasAnswer: boolean;
  answered: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  onOpenOverview: () => void;
};

export function QuizFooter({
  currentIndex,
  total,
  hasAnswer,
  answered,
  onPrevious,
  onNext,
  onSubmit,
  onOpenOverview,
}: QuizFooterProps) {
  const isFirst =
    currentIndex === 0;

  const isLast =
    currentIndex === total - 1;

  return (
    <footer className="sticky bottom-0 z-20 border-t-2 border-slate-100 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[760px] items-center gap-2 px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-3 min-[390px]:px-5 sm:px-8 sm:pt-4">
        <motion.button
          type="button"
          disabled={isFirst}
          onClick={onPrevious}
          whileTap={
            isFirst
              ? undefined
              : { scale: 0.92 }
          }
          aria-label="Pregunta anterior"
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-slate-200 bg-white text-slate-500 shadow-[0_3px_0_#e2e8f0] disabled:opacity-30"
        >
          <ArrowLeft size={20} />
        </motion.button>

        <motion.button
          type="button"
          onClick={onOpenOverview}
          whileTap={{
            scale: 0.92,
          }}
          aria-label="Ver preguntas"
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-slate-200 bg-white text-slate-500 shadow-[0_3px_0_#e2e8f0]"
        >
          <Grid2X2 size={19} />
        </motion.button>

        <motion.button
          type="button"
          disabled={!hasAnswer}
          onClick={
            isLast
              ? onSubmit
              : onNext
          }
          whileTap={
            hasAnswer
              ? {
                  y: 3,
                  scale: 0.99,
                }
              : undefined
          }
          className={`flex min-h-14 flex-1 items-center justify-center gap-2 rounded-2xl border-2 px-5 text-sm font-black transition ${
            hasAnswer
              ? isLast
                ? "border-blue-800 bg-blue-600 text-white shadow-[0_4px_0_#1e40af]"
                : "border-blue-800 bg-blue-600 text-white shadow-[0_4px_0_#1e40af]"
              : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
          }`}
        >
          {isLast ? (
            <>
              {answered === total
                ? "Finalizar"
                : `Faltan ${total - answered}`}
              <Flag size={17} />
            </>
          ) : (
            <>
              Continuar
              <ArrowRight size={18} />
            </>
          )}
        </motion.button>
      </div>
    </footer>
  );
}
