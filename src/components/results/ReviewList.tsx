"use client";

import {
  useMemo,
  useState,
} from "react";
import { motion } from "motion/react";
import {
  Check,
  ListFilter,
  X,
} from "lucide-react";

import type { QuizResultSummary } from "@/lib/results";
import { ReviewQuestion } from "@/components/results/ReviewQuestion";

type Filter =
  | "all"
  | "wrong"
  | "correct";

type ReviewListProps = {
  result: QuizResultSummary;
};

export function ReviewList({
  result,
}: ReviewListProps) {
  const [filter, setFilter] =
    useState<Filter>("all");

  const questions =
    useMemo(() => {
      if (filter === "wrong") {
        return result.questions.filter(
          (item) => !item.correct
        );
      }

      if (filter === "correct") {
        return result.questions.filter(
          (item) => item.correct
        );
      }

      return result.questions;
    }, [filter, result.questions]);

  return (
    <section className="mt-10">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
          Revisión
        </p>

        <h2 className="mt-1 text-2xl font-black tracking-[-0.03em] text-slate-950">
          Revisa tus respuestas
        </h2>

        <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
          Ahora sí puedes ver qué
          respondiste, cuál era la
          alternativa correcta y por qué.
        </p>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        <FilterButton
          active={filter === "all"}
          onClick={() =>
            setFilter("all")
          }
          icon={
            <ListFilter size={15} />
          }
          label="Todas"
          count={
            result.totalQuestions
          }
        />

        <FilterButton
          active={
            filter === "wrong"
          }
          onClick={() =>
            setFilter("wrong")
          }
          icon={<X size={15} />}
          label="Incorrectas"
          count={
            result.incorrectQuestions
          }
        />

        <FilterButton
          active={
            filter === "correct"
          }
          onClick={() =>
            setFilter("correct")
          }
          icon={<Check size={15} />}
          label="Correctas"
          count={
            result.correctQuestions
          }
        />
      </div>

      <motion.div
        layout
        className="mt-4 grid gap-3"
      >
        {questions.length > 0 ? (
          questions.map((item) => {
            const originalIndex =
              result.questions.findIndex(
                (question) =>
                  question.question.id ===
                  item.question.id
              );

            return (
              <ReviewQuestion
                key={
                  item.question.id
                }
                result={item}
                index={originalIndex}
              />
            );
          })
        ) : (
          <motion.div
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="rounded-[24px] border-2 border-emerald-200 bg-emerald-50 p-6 text-center"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
              <Check
                size={22}
                strokeWidth={3}
              />
            </div>

            <p className="mt-4 font-black text-emerald-800">
              ¡Ningún error!
            </p>

            <p className="mt-1 text-xs font-semibold text-emerald-600">
              No tienes preguntas
              incorrectas en este intento.
            </p>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}

function FilterButton({
  active,
  onClick,
  icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count: number;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{
        scale: 0.96,
      }}
      aria-pressed={active}
      className={`flex min-h-12 min-w-0 items-center justify-center gap-1 rounded-xl border-2 px-1 text-[10px] font-black tracking-[-0.02em] transition min-[390px]:text-[11px] sm:gap-1.5 sm:px-3 sm:text-xs ${
        active
          ? "border-slate-950 bg-slate-950 text-white"
          : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
      }`}
    >
      <span className="hidden shrink-0 sm:block">
        {icon}
      </span>

      <span className="whitespace-nowrap">
        {label}
      </span>

      <span
        className={`shrink-0 tabular-nums ${
          active
            ? "text-white/70"
            : "text-slate-400"
        }`}
      >
        {count}
      </span>
    </motion.button>
  );
}
