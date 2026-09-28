"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown, Lightbulb, X } from "lucide-react";

import type { QuestionResult } from "@/lib/results";

type ReviewQuestionProps = {
  result: QuestionResult;
  index: number;
};

export function ReviewQuestion({ result, index }: ReviewQuestionProps) {
  const [expanded, setExpanded] = useState(false);

  const { question, selectedAnswers, correct } = result;

  function getOptionState(optionId: string): "correct" | "wrong" | "missed" | "neutral" {
    const isCorrect = question.correctAnswers.includes(optionId);
    const isSelected = selectedAnswers.includes(optionId);

    if (isCorrect && isSelected) return "correct";
    if (isCorrect && !isSelected && !correct) return "missed"; // correct answer user didn't pick
    if (!isCorrect && isSelected) return "wrong";
    return "neutral";
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.035, 0.3) }}
      className={`overflow-hidden rounded-[24px] border-2 bg-white ${
        correct ? "border-emerald-200" : "border-rose-200"
      }`}
    >
      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
              correct
                ? "bg-emerald-100 text-emerald-600"
                : "bg-rose-100 text-rose-500"
            }`}
          >
            {correct ? (
              <Check size={19} strokeWidth={3} />
            ) : (
              <X size={19} strokeWidth={3} />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.13em] text-slate-400">
                Pregunta {index + 1}
              </span>

              {question.points === 2 && (
                <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[9px] font-black text-violet-600">
                  2 puntos
                </span>
              )}
            </div>

            <h3 className="mt-2 text-base font-black leading-6 text-slate-950">
              {question.question}
            </h3>
          </div>
        </div>

        {/* All options */}
        <div className="mt-4 grid gap-2">
          {question.options.map((option, i) => {
            const state = getOptionState(option.id);
            const letter = String.fromCharCode(65 + i); // A, B, C, D
            return (
              <div
                key={option.id}
                className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3 ${
                  state === "correct"
                    ? "border-emerald-300 bg-emerald-50"
                    : state === "missed"
                      ? "border-emerald-200 bg-emerald-50/60"
                      : state === "wrong"
                        ? "border-rose-300 bg-rose-50"
                        : "border-slate-100 bg-slate-50/50"
                }`}
              >
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                    state === "correct"
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : state === "missed"
                        ? "border-emerald-400 bg-emerald-100 text-emerald-600"
                        : state === "wrong"
                          ? "border-rose-500 bg-rose-500 text-white"
                          : "border-slate-200 bg-white text-slate-400"
                  }`}
                >
                  {state === "correct" || state === "missed" ? (
                    <Check size={13} strokeWidth={3} />
                  ) : state === "wrong" ? (
                    <X size={13} strokeWidth={3} />
                  ) : (
                    <span className="text-[10px] font-black">{letter}</span>
                  )}
                </div>

                <span
                  className={`text-sm font-semibold leading-5 ${
                    state === "correct"
                      ? "text-emerald-800"
                      : state === "missed"
                        ? "text-emerald-700"
                        : state === "wrong"
                          ? "text-rose-700"
                          : "text-slate-500"
                  }`}
                >
                  {option.text}
                </span>
              </div>
            );
          })}
        </div>

        {/* Explanation toggle */}
        {question.explanation && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-4 flex w-full items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-left text-xs font-black text-slate-600 transition hover:bg-slate-100"
          >
            <span className="flex items-center gap-2">
              <Lightbulb size={16} className="text-amber-500" />
              {expanded ? "Ocultar explicación" : "Ver explicación"}
            </span>

            <motion.span animate={{ rotate: expanded ? 180 : 0 }}>
              <ChevronDown size={16} />
            </motion.span>
          </button>
        )}
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="border-t-2 border-slate-100 bg-slate-50 px-5 py-5 sm:px-6">
              <div className="flex gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                  <Lightbulb size={16} />
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.1em] text-slate-400">
                    Por qué
                  </p>

                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                    {question.explanation}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
