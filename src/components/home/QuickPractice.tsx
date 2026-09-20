"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowUpRight, Zap } from "lucide-react";

import { PRACTICE_AMOUNTS } from "@/lib/exam-config";
import { questions } from "@/lib/questions";
import { startQuiz } from "@/lib/start-quiz";

export function QuickPractice() {
  const router = useRouter();

  function handleStart(amount: number) {
    startQuiz({
      questions,
      amount,
      mode: "practice",
      title: `Práctica de ${Math.min(
        amount,
        questions.length
      )} preguntas`,
    });

    router.push("/quiz");
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.08 }}
      className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm font-bold text-amber-600">
          <Zap size={17} fill="currentColor" />
          Práctica rápida
        </div>

        <h2 className="text-xl font-black tracking-tight text-slate-950">
          ¿Cuánto quieres practicar?
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Elige la cantidad de preguntas.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {PRACTICE_AMOUNTS.map((amount, index) => {
          const available = Math.min(
            amount,
            questions.length
          );

          return (
            <motion.button
              key={amount}
              type="button"
              onClick={() => handleStart(amount)}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.12 + index * 0.05,
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-slate-300 hover:bg-white hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-slate-950">
                  {available}
                </span>

                <ArrowUpRight
                  size={17}
                  className="text-slate-300 transition group-hover:text-slate-900"
                />
              </div>

              <span className="mt-1 block text-xs font-medium text-slate-500">
                preguntas
              </span>
            </motion.button>
          );
        })}
      </div>

      {questions.length < 20 && (
        <p className="mt-4 text-xs leading-5 text-slate-400">
          Por ahora el banco contiene {questions.length} preguntas.
          Cuando ampliemos el banco aparecerán las cantidades
          completas.
        </p>
      )}
    </motion.section>
  );
}
