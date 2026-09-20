"use client";

import { motion } from "motion/react";
import {
  CheckCircle2,
  PartyPopper,
  Target,
  XCircle,
} from "lucide-react";

import type { QuizResultSummary } from "@/lib/results";

type ResultHeroProps = {
  result: QuizResultSummary;
};

export function ResultHero({
  result,
}: ResultHeroProps) {
  const official =
    result.isFullOfficialSimulation;

  const success =
    official
      ? result.passed === true
      : result.percentage >= 70;

  const title = official
    ? result.passed
      ? "¡Aprobaste!"
      : "Aún no esta vez"
    : "Práctica completada";

  const subtitle = official
    ? result.passed
      ? "Alcanzaste el puntaje necesario para aprobar este simulacro."
      : "Revisa tus errores y vuelve a intentarlo cuando quieras."
    : "Revisa tus respuestas y descubre qué temas conviene reforzar.";

  return (
    <section className="relative overflow-hidden rounded-[36px] bg-slate-950 px-6 py-10 text-white shadow-xl sm:px-10 sm:py-12">
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />

      {success && (
        <>
          {Array.from({ length: 12 }).map(
            (_, index) => (
              <motion.span
                key={index}
                className="absolute h-2 w-2 rounded-sm bg-white/70"
                initial={{
                  opacity: 0,
                  x: "50%",
                  y: 20,
                  rotate: 0,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  x: `${
                    10 +
                    ((index * 17) % 80)
                  }%`,
                  y: [
                    20,
                    30 + (index % 4) * 30,
                    180 + (index % 3) * 25,
                  ],
                  rotate:
                    180 + index * 35,
                }}
                transition={{
                  duration:
                    1.6 + (index % 3) * 0.2,
                  delay: index * 0.04,
                  ease: "easeOut",
                }}
              />
            )
          )}
        </>
      )}

      <div className="relative">
        <motion.div
          initial={{
            scale: 0,
            rotate: -15,
          }}
          animate={{
            scale: 1,
            rotate: 0,
          }}
          transition={{
            type: "spring",
            stiffness: 180,
            damping: 13,
          }}
          className={`flex h-16 w-16 items-center justify-center rounded-[22px] ${
            success
              ? "bg-emerald-400 text-emerald-950"
              : "bg-rose-400 text-rose-950"
          }`}
        >
          {success ? (
            <PartyPopper size={30} />
          ) : (
            <Target size={30} />
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.18em] text-white/45">
            {official
              ? "Resultado del simulacro"
              : "Resultado de práctica"}
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
            {title}
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-white/60 sm:text-base">
            {subtitle}
          </p>
        </motion.div>

        <div className="mt-9 grid gap-3 sm:grid-cols-3">
          <ResultStat
            value={`${result.score}/${result.maxScore}`}
            label="puntos"
          />

          <ResultStat
            value={`${result.percentage}%`}
            label="rendimiento"
          />

          <ResultStat
            value={`${result.correctQuestions}/${result.questions.length}`}
            label="correctas"
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-3 text-xs font-bold">
          <div className="flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-2 text-emerald-300">
            <CheckCircle2 size={15} />
            {result.correctQuestions} correctas
          </div>

          <div className="flex items-center gap-2 rounded-full bg-rose-400/10 px-3 py-2 text-rose-300">
            <XCircle size={15} />
            {result.incorrectQuestions} incorrectas
          </div>
        </div>
      </div>
    </section>
  );
}

function ResultStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur-sm">
      <div className="text-2xl font-black">
        {value}
      </div>

      <div className="mt-1 text-xs font-medium text-white/45">
        {label}
      </div>
    </div>
  );
}
