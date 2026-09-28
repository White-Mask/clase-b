"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Clock3,
  Trophy,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
} from "motion/react";

import { AppButton } from "@/components/ui/AppButton";
import { questions } from "@/lib/questions";
import { buildExam } from "@/lib/exam";
import { startExamSession } from "@/lib/start-quiz";
import { CLASS_B_EXAM } from "@/lib/exam-config";
import {
  getExamUsedIds,
  addExamUsedIds,
  clearExamHistory,
} from "@/lib/storage";

export default function ExamIntroPage() {
  const router = useRouter();

  const [countdown, setCountdown] =
    useState<number | null>(null);

  const examReady =
    buildExam(questions, new Set()).isComplete;

  function startCountdown() {
    if (countdown !== null) {
      return;
    }

    setCountdown(3);

    window.setTimeout(
      () => setCountdown(2),
      700
    );

    window.setTimeout(
      () => setCountdown(1),
      1400
    );

    window.setTimeout(() => {
      const usedIds = getExamUsedIds();
      const exam = buildExam(questions, usedIds);

      if (exam.cycled) {
        clearExamHistory();
      }

      addExamUsedIds(
        exam.questions.map((q) => q.id)
      );

      startExamSession(
        exam.questions,
        exam.isComplete
      );

      router.push("/quiz");
    }, 2100);
  }

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <div className="mx-auto w-full max-w-[620px] px-5 pb-12 pt-6 sm:px-8 sm:pt-8">
        <button
          type="button"
          onClick={() =>
            router.push("/")
          }
          className="flex h-11 w-11 items-center justify-center rounded-2xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
          aria-label="Volver al inicio"
        >
          <ArrowLeft size={21} />
        </button>

        <motion.div
          initial={{
            opacity: 0,
            y: 16,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="pt-10"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[26px] bg-blue-100 text-blue-600">
            <Trophy
              size={34}
              strokeWidth={2.4}
            />
          </div>

          <div className="mt-7 text-center">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
              Simulacro
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl">
              Examen Clase B
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm font-medium leading-6 text-slate-500">
              Responde todas las preguntas y
              conoce tu resultado solamente al
              finalizar.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-2">
            <Stat
              value="35"
              label="preguntas"
            />

            <Stat
              value="38"
              label="puntos"
            />

            <Stat
              value="33"
              label="para aprobar"
            />
          </div>

          <div className="mt-8 space-y-3 rounded-[24px] border-2 border-slate-200 bg-white p-5">
            <Rule>
              No verás si una respuesta es
              correcta mientras realizas el
              examen.
            </Rule>

            <Rule>
              Puedes cambiar tus respuestas
              antes de finalizar.
            </Rule>

            <Rule>
              Algunas preguntas pueden valer
              más de un punto.
            </Rule>
          </div>

          {!examReady && (
            <div className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-xs font-bold leading-5 text-amber-700">
              Versión de desarrollo: el banco
              actual contiene{" "}
              {questions.length} preguntas.
              Puedes probar el flujo del
              simulacro, pero el resultado no
              se considerará un examen completo.
            </div>
          )}

          <div className="mt-8">
            <AppButton
              fullWidth
              onClick={startCountdown}
            >
              {examReady
                ? "Comenzar examen"
                : "Probar simulacro"}
            </AppButton>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-slate-400">
            <Clock3 size={14} />
            Tu resultado aparecerá al enviar
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {countdown !== null && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950"
          >
            <AnimatePresence
              mode="wait"
            >
              <motion.div
                key={countdown}
                initial={{
                  opacity: 0,
                  scale: 0.5,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 1.5,
                }}
                transition={{
                  duration: 0.3,
                }}
                className="text-8xl font-black text-white"
              >
                {countdown}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
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
    <div className="rounded-2xl border-2 border-slate-200 bg-white p-3 text-center">
      <p className="text-xl font-black text-slate-950">
        {value}
      </p>

      <p className="mt-1 text-[10px] font-bold text-slate-400 sm:text-xs">
        {label}
      </p>
    </div>
  );
}

function Rule({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <Check
          size={13}
          strokeWidth={3}
        />
      </div>

      <p className="text-sm font-semibold leading-5 text-slate-600">
        {children}
      </p>
    </div>
  );
}
