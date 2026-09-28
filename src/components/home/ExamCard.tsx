"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowRight,
  ClipboardCheck,
  Info,
} from "lucide-react";

import { questions } from "@/lib/questions";
import {
  buildExam,
  canBuildFullExam,
} from "@/lib/exam";
import { startExamSession } from "@/lib/start-quiz";

export function ExamCard() {
  const router = useRouter();

  const ready =
    canBuildFullExam(questions);

  const progress = Math.min(
    Math.round(
      (questions.length / 35) * 100
    ),
    100
  );

  function handleStart() {
    const exam =
      buildExam(questions);

    startExamSession(
      exam.questions,
      exam.isComplete
    );

    router.push("/quiz");
  }

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 16,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: 0.1,
      }}
      className="overflow-hidden rounded-[28px] border-2 border-blue-200 bg-blue-50"
    >
      <div className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white">
            <ClipboardCheck
              size={23}
              strokeWidth={2.5}
            />
          </div>

          {ready ? (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-emerald-700">
              Oficial
            </span>
          ) : (
            <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-blue-600">
              Preview
            </span>
          )}
        </div>

        <p className="mt-5 text-xs font-black uppercase tracking-[0.14em] text-blue-600">
          Simulacro
        </p>

        <h2 className="mt-1 text-2xl font-black tracking-[-0.025em] text-slate-950">
          Examen Clase B
        </h2>

        <p className="mt-2 max-w-md text-sm font-medium leading-6 text-slate-500">
          {ready
            ? "35 preguntas, 38 puntos y resultado oficial al finalizar."
            : "Puedes probar la experiencia completa mientras construimos el banco oficial."}
        </p>

        <div className="mt-6 grid grid-cols-3 gap-2">
          <ExamStat
            value="35"
            label="preguntas"
          />
          <ExamStat
            value="38"
            label="puntos"
          />
          <ExamStat
            value="33"
            label="apruebas"
          />
        </div>

        {!ready && (
          <div className="mt-5 rounded-2xl border border-blue-200 bg-white/80 p-4">
            <div className="flex items-start gap-3">
              <Info
                size={18}
                className="mt-0.5 shrink-0 text-blue-500"
              />

              <div className="min-w-0 flex-1">
                <p className="text-sm font-black text-slate-900">
                  Banco en desarrollo
                </p>

                <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
                  {questions.length} de 35 preguntas cargadas.
                </p>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                  <motion.div
                    initial={{
                      width: 0,
                    }}
                    animate={{
                      width: `${progress}%`,
                    }}
                    transition={{
                      duration: 0.8,
                    }}
                    className="h-full rounded-full bg-blue-600"
                  />
                </div>

                <p className="mt-2 text-[11px] font-bold text-slate-400">
                  {progress}% completado
                </p>
              </div>
            </div>
          </div>
        )}

        <motion.button
          type="button"
          onClick={handleStart}
          whileTap={{
            y: 3,
            scale: 0.99,
          }}
          className="mt-6 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 border-blue-800 bg-blue-600 px-5 text-sm font-black text-white shadow-[0_4px_0_#1e40af] transition hover:-translate-y-0.5 hover:bg-blue-700 active:translate-y-1 active:shadow-none"
        >
          {ready
            ? "Comenzar simulacro"
            : "Probar simulacro"}

          <ArrowRight size={18} />
        </motion.button>
      </div>
    </motion.section>
  );
}

function ExamStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl bg-white/80 px-2 py-3 text-center">
      <p className="text-lg font-black text-slate-950">
        {value}
      </p>

      <p className="mt-0.5 text-[10px] font-bold text-slate-400 sm:text-xs">
        {label}
      </p>
    </div>
  );
}
