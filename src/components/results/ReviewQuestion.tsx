"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  BookOpen,
  Check,
  ChevronDown,
  Lightbulb,
  X,
} from "lucide-react";

import type { QuestionResult } from "@/lib/results";

type ReviewQuestionProps = {
  result: QuestionResult;
  number: number;
};

export function ReviewQuestion({
  result,
  number,
}: ReviewQuestionProps) {
  const [showExplanation, setShowExplanation] =
    useState(false);

  const {
    question,
    selectedAnswers,
    correct,
  } = result;

  return (
    <article
      className={`overflow-hidden rounded-[26px] border bg-white shadow-sm ${
        correct
          ? "border-emerald-200"
          : "border-rose-200"
      }`}
    >
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
              correct
                ? "bg-emerald-100 text-emerald-700"
                : "bg-rose-100 text-rose-700"
            }`}
          >
            {correct ? (
              <Check
                size={20}
                strokeWidth={3}
              />
            ) : (
              <X
                size={20}
                strokeWidth={3}
              />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-extrabold uppercase tracking-[0.13em] text-slate-400">
              Pregunta {number}
            </p>

            <h3 className="mt-2 text-base font-black leading-6 text-slate-950 sm:text-lg">
              {question.question}
            </h3>
          </div>
        </div>

        <div className="mt-5 grid gap-2">
          {question.options.map((option) => {
            const wasSelected =
              selectedAnswers.includes(option.id);

            const isCorrectAnswer =
              question.correctAnswers.includes(
                option.id
              );

            const wrongSelection =
              wasSelected && !isCorrectAnswer;

            return (
              <div
                key={option.id}
                className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${
                  isCorrectAnswer
                    ? "border-emerald-200 bg-emerald-50 text-emerald-950"
                    : wrongSelection
                      ? "border-rose-200 bg-rose-50 text-rose-950"
                      : "border-slate-100 bg-slate-50 text-slate-500"
                }`}
              >
                <div
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${
                    isCorrectAnswer
                      ? "bg-emerald-600 text-white"
                      : wrongSelection
                        ? "bg-rose-600 text-white"
                        : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {isCorrectAnswer ? (
                    <Check
                      size={13}
                      strokeWidth={3}
                    />
                  ) : wrongSelection ? (
                    <X
                      size={13}
                      strokeWidth={3}
                    />
                  ) : (
                    option.id.toUpperCase()
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold leading-5">
                    {option.text}
                  </p>

                  {wasSelected && (
                    <p className="mt-1 text-[10px] font-extrabold uppercase tracking-wide opacity-60">
                      Tu respuesta
                    </p>
                  )}

                  {isCorrectAnswer && (
                    <p className="mt-1 text-[10px] font-extrabold uppercase tracking-wide opacity-60">
                      Respuesta correcta
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {!correct && (
          <button
            type="button"
            onClick={() =>
              setShowExplanation(
                (value) => !value
              )
            }
            className="mt-5 flex w-full items-center justify-between rounded-2xl bg-slate-950 px-4 py-3.5 text-left text-sm font-extrabold text-white transition hover:bg-slate-800"
          >
            <span className="flex items-center gap-2">
              <Lightbulb size={17} />
              Ver explicación
            </span>

            <motion.span
              animate={{
                rotate: showExplanation
                  ? 180
                  : 0,
              }}
            >
              <ChevronDown size={18} />
            </motion.span>
          </button>
        )}

        <AnimatePresence>
          {!correct && showExplanation && (
            <motion.div
              initial={{
                height: 0,
                opacity: 0,
              }}
              animate={{
                height: "auto",
                opacity: 1,
              }}
              exit={{
                height: 0,
                opacity: 0,
              }}
              className="overflow-hidden"
            >
              <div className="mt-3 rounded-2xl bg-amber-50 p-4">
                <div className="flex gap-3">
                  <Lightbulb
                    size={19}
                    className="mt-0.5 shrink-0 text-amber-600"
                  />

                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-amber-700">
                      ¿Por qué?
                    </p>

                    <p className="mt-2 text-sm font-medium leading-6 text-amber-950">
                      {question.explanation}
                    </p>
                  </div>
                </div>

                {question.source && (
                  <div className="mt-4 flex items-center gap-2 border-t border-amber-200/70 pt-3 text-xs font-semibold text-amber-700">
                    <BookOpen size={14} />

                    {question.source.title}

                    {question.source.page
                      ? ` · pág. ${question.source.page}`
                      : ""}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </article>
  );
}
