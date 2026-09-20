"use client";

import { AnimatePresence, motion } from "motion/react";
import { CheckSquare2, CircleDot } from "lucide-react";

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
  const multiple = question.type === "multiple";

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={question.id}
        custom={direction}
        variants={{
          enter: (value: number) => ({
            opacity: 0,
            x: value >= 0 ? 40 : -40,
          }),
          center: {
            opacity: 1,
            x: 0,
          },
          exit: (value: number) => ({
            opacity: 0,
            x: value >= 0 ? -40 : 40,
          }),
        }}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          duration: 0.22,
          ease: "easeOut",
        }}
      >
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <span className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-extrabold text-white">
            Pregunta {questionNumber}
          </span>

          <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
            {multiple ? (
              <>
                <CheckSquare2 size={15} />
                Selección múltiple
              </>
            ) : (
              <>
                <CircleDot size={15} />
                Una alternativa
              </>
            )}
          </span>
        </div>

        <h1 className="text-2xl font-black leading-[1.25] tracking-[-0.025em] text-slate-950 sm:text-3xl">
          {question.question}
        </h1>

        {multiple && (
          <div className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-xs font-semibold leading-5 text-amber-800">
            Esta pregunta puede tener más de una
            respuesta correcta. Selecciona todas las
            que correspondan.
          </div>
        )}

        <div className="mt-8 grid gap-3">
          {question.options.map((option) => (
            <AnswerOption
              key={option.id}
              id={option.id}
              text={option.text}
              selected={selectedAnswers.includes(
                option.id
              )}
              multiple={multiple}
              onClick={() => onAnswer(option.id)}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
