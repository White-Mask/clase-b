"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowRight,
  Clock3,
  Trophy,
} from "lucide-react";

import { CLASS_B_EXAM } from "@/lib/exam-config";
import { questions } from "@/lib/questions";
import { startQuiz } from "@/lib/start-quiz";

export function ExamCard() {
  const router = useRouter();

  const availableQuestions = Math.min(
    CLASS_B_EXAM.questionCount,
    questions.length
  );

  function handleStart() {
    startQuiz({
      questions,
      amount: CLASS_B_EXAM.questionCount,
      mode: "exam",
      title: "Simulacro Clase B",
    });

    router.push("/quiz");
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      whileHover={{ y: -4 }}
      className="relative overflow-hidden rounded-[32px] bg-slate-950 p-7 text-white shadow-xl sm:p-9"
    >
      <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-violet-500/20 blur-3xl" />

      <div className="relative">
        <div className="mb-7 flex items-center justify-between">
          <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-white/80">
            Simulacro
          </span>

          <div className="flex items-center gap-2 text-sm text-white/60">
            <Clock3 size={16} />
            Examen Clase B
          </div>
        </div>

        <div className="max-w-xl">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
            Pon a prueba lo que sabes.
          </h2>

          <p className="mt-3 max-w-lg text-sm leading-6 text-white/65 sm:text-base">
            Practica con un simulacro de 35
            preguntas y descubre si alcanzarías
            el puntaje necesario para aprobar.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3">
          <Stat
            value="35"
            label="preguntas"
          />

          <Stat
            value="38"
            label="puntos máx."
          />

          <Stat
            value="33"
            label="para aprobar"
          />
        </div>

        <button
          type="button"
          onClick={handleStart}
          className="group mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-4 text-sm font-extrabold text-slate-950 transition hover:bg-slate-100 sm:w-auto"
        >
          Comenzar simulacro

          <ArrowRight
            size={18}
            className="transition-transform group-hover:translate-x-1"
          />
        </button>

        {questions.length <
          CLASS_B_EXAM.questionCount && (
          <p className="mt-4 text-xs leading-5 text-amber-200/70">
            Versión de desarrollo: actualmente
            probará {availableQuestions} preguntas.
            Cuando completemos el banco utilizará
            las 35.
          </p>
        )}

        <div className="mt-5 flex items-center gap-2 text-xs text-white/45">
          <Trophy size={14} />
          Necesitas 33 de 38 puntos para aprobar
        </div>
      </div>
    </motion.section>
  );
}

function Stat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur-sm">
      <div className="text-xl font-black sm:text-2xl">
        {value}
      </div>

      <div className="mt-1 text-[11px] font-medium text-white/50 sm:text-xs">
        {label}
      </div>
    </div>
  );
}
