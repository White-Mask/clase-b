"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  Clock3,
  Lock,
  Sparkles,
  Zap,
} from "lucide-react";

import { questions } from "@/lib/questions";
import {
  startPreparedQuiz,
  startQuiz,
} from "@/lib/start-quiz";

import { createRecommendedPractice } from "@/lib/recommended-practice";

const PRACTICES = [
  {
    amount: 7,
    label: "Rápida",
    time: "~3 min",
    recommended: true,
  },
  {
    amount: 14,
    label: "Media",
    time: "~6 min",
    recommended: false,
  },
  {
    amount: 21,
    label: "Larga",
    time: "~10 min",
    recommended: false,
  },
] as const;

export function QuickPractice() {
  const router = useRouter();

  function handleStart(amount: number) {
    if (questions.length < amount) {
      return;
    }

    if (amount === 7) {
      const recommended =
        createRecommendedPractice(
          questions,
          7
        );

      startPreparedQuiz({
        questions: recommended,
        mode: "practice",
        title:
          "Práctica recomendada",
      });

      router.push("/quiz");
      return;
    }

    startQuiz({
      questions,
      amount,
      mode: "practice",
      title: `Práctica de ${amount} preguntas`,
    });

    router.push("/quiz");
  }

  return (
    <section>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-amber-500">
          <Zap
            size={22}
            fill="currentColor"
          />
        </div>

        <div>
          <h2 className="text-xl font-black tracking-[-0.025em] text-slate-950 sm:text-2xl">
            Práctica rápida
          </h2>

          <p className="mt-1 text-sm font-semibold text-slate-400">
            Elige cuánto quieres practicar.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {PRACTICES.map(
          (practice, index) => {
            const available =
              questions.length >=
              practice.amount;

            return (
              <PracticeCard
                key={practice.amount}
                {...practice}
                available={available}
                index={index}
                onClick={() =>
                  handleStart(
                    practice.amount
                  )
                }
              />
            );
          }
        )}
      </div>

      {questions.length < 21 && (
        <p className="mt-3 text-xs font-semibold leading-5 text-slate-400">
          Banco de desarrollo: actualmente hay{" "}
          {questions.length} preguntas disponibles.
        </p>
      )}
    </section>
  );
}

function PracticeCard({
  amount,
  label,
  time,
  recommended,
  available,
  index,
  onClick,
}: {
  amount: number;
  label: string;
  time: string;
  recommended: boolean;
  available: boolean;
  index: number;
  onClick: () => void;
}) {
  /*
   * En móvil la sesión recomendada es protagonista.
   * Las demás son compactas.
   *
   * En sm+ las tres recuperan la misma estructura
   * para formar una fila.
   */
  const secondaryMobile =
    !recommended;

  return (
    <motion.button
      type="button"
      disabled={!available}
      onClick={onClick}
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: index * 0.05,
      }}
      whileTap={
        available
          ? { scale: 0.98 }
          : undefined
      }
      whileHover={
        available
          ? { y: -2 }
          : undefined
      }
      className={[
        "relative w-full border-2 text-left transition",
        "disabled:cursor-not-allowed",
        secondaryMobile
          ? "rounded-[20px] px-4 py-3.5 sm:rounded-[24px] sm:p-5"
          : "rounded-[24px] p-5",
        recommended && available
          ? "border-blue-300 bg-blue-50 shadow-[0_4px_0_#bfdbfe]"
          : available
            ? "border-slate-200 bg-white shadow-[0_3px_0_#e2e8f0] hover:border-slate-300"
            : "border-slate-200 bg-slate-50 text-slate-400",
      ].join(" ")}
    >
      {recommended && (
        <span className="absolute -top-3 left-4 rounded-full bg-blue-600 px-3 py-1 text-[9px] font-black uppercase tracking-[0.13em] text-white">
          Recomendada
        </span>
      )}

      {/* MOBILE */}
      <div className="flex items-center sm:hidden">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span
              className={`font-black tracking-[-0.04em] ${
                recommended
                  ? "text-4xl text-slate-950"
                  : "text-2xl text-slate-900"
              }`}
            >
              {amount}
            </span>

            <span className="text-xs font-black text-slate-400">
              preguntas
            </span>
          </div>

          <div className="mt-1.5 flex items-center gap-3">
            <span
              className={`text-xs font-black ${
                recommended
                  ? "text-blue-600"
                  : "text-slate-500"
              }`}
            >
              {recommended
                ? "Para ti"
                : label}
            </span>

            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
              <Clock3 size={12} />
              {time}
            </span>
          </div>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            recommended && available
              ? "bg-blue-600 text-white"
              : available
                ? "bg-slate-100 text-slate-500"
                : "bg-slate-200 text-slate-400"
          }`}
        >
          {available ? (
            <Sparkles size={18} />
          ) : (
            <Lock size={17} />
          )}
        </div>
      </div>

      {/* TABLET / DESKTOP */}
      <div className="hidden sm:block">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-3xl font-black tracking-[-0.04em] text-slate-950">
              {amount}
            </p>

            <p className="mt-1 text-xs font-black text-slate-400">
              preguntas
            </p>
          </div>

          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
              recommended && available
                ? "bg-blue-600 text-white"
                : available
                  ? "bg-slate-100 text-slate-500"
                  : "bg-slate-200 text-slate-400"
            }`}
          >
            {available ? (
              <Sparkles size={18} />
            ) : (
              <Lock size={17} />
            )}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-2">
          <span
            className={`text-xs font-black ${
              recommended
                ? "text-blue-600"
                : "text-slate-500"
            }`}
          >
            {label}
          </span>

          <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
            <Clock3 size={12} />
            {time}
          </span>
        </div>
      </div>
    </motion.button>
  );
}
