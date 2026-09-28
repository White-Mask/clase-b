"use client";

import {
  AnimatePresence,
  motion,
} from "motion/react";
import { CheckSquare2 } from "lucide-react";

import type { Question } from "@/types/question";
import { AnswerOption } from "@/components/quiz/AnswerOption";

type QuestionCardProps = {
  question: Question;
  questionNumber: number;
  selectedAnswers: string[];
  direction: number;
  onAnswer: (optionId: string) => void;
};

export function QuestionCard({
  question,
  questionNumber,
  selectedAnswers,
  direction,
  onAnswer,
}: QuestionCardProps) {
  const multiple =
    question.type === "multiple";

  return (
    <AnimatePresence
      mode="wait"
      custom={direction}
    >
      <motion.section
        key={question.id}
        custom={direction}
        variants={{
          enter: (
            value: number
          ) => ({
            opacity: 0,
            x:
              value >= 0
                ? 40
                : -40,
          }),

          center: {
            opacity: 1,
            x: 0,
          },

          exit: (
            value: number
          ) => ({
            opacity: 0,
            x:
              value >= 0
                ? -40
                : 40,
          }),
        }}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          duration: 0.2,
          ease: "easeOut",
        }}
      >
        <div className="mb-5 sm:mb-7">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] font-black uppercase tracking-[0.14em] text-blue-600 sm:text-xs">
              Pregunta {questionNumber}
            </span>

            {question.points === 2 && (
              <span className="rounded-full bg-violet-100 px-2.5 py-1 text-[10px] font-black text-violet-600 sm:px-3 sm:py-1.5">
                2 puntos
              </span>
            )}
          </div>

          <h1 className="mt-3 text-[24px] font-black leading-[1.24] tracking-[-0.035em] text-slate-950 min-[390px]:text-[26px] sm:mt-4 sm:text-[32px]">
            {question.question}
          </h1>

          {multiple && (
            <div className="mt-4 flex items-start gap-2 rounded-2xl bg-amber-50 px-3.5 py-3 text-xs font-bold leading-5 text-amber-700 sm:px-4">
              <CheckSquare2
                size={16}
                className="mt-0.5 shrink-0"
              />

              <span>
                Puede haber más de una
                respuesta correcta.
              </span>
            </div>
          )}
        </div>

        <div className="grid gap-3">
          {question.options.map(
            (option) => (
              <AnswerOption
                key={option.id}
                id={option.id}
                text={option.text}
                selected={selectedAnswers.includes(
                  option.id
                )}
                multiple={multiple}
                onClick={() =>
                  onAnswer(option.id)
                }
              />
            )
          )}
        </div>
      </motion.section>
    </AnimatePresence>
  );
}
