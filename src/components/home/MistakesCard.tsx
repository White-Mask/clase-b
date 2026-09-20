"use client";

import {
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowRight,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";

import {
  getMistakeIds,
} from "@/lib/storage";

import {
  questions,
} from "@/lib/questions";

import {
  startQuiz,
} from "@/lib/start-quiz";

export function MistakesCard() {
  const router = useRouter();

  const [mistakeIds, setMistakeIds] =
    useState<string[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setMistakeIds(getMistakeIds());
    }, 0);

    return () =>
      window.clearTimeout(timer);
  }, []);

  const mistakeQuestions =
    mistakeIds
      .map((id) =>
        questions.find(
          (question) =>
            question.id === id
        )
      )
      .filter(
        (question) =>
          question !== undefined
      );

  function handleStart() {
    if (
      mistakeQuestions.length === 0
    ) {
      return;
    }

    startQuiz({
      questions: mistakeQuestions,
      amount:
        mistakeQuestions.length,
      mode: "mistakes",
      title: "Practicar mis errores",
    });

    router.push("/quiz");
  }

  const hasMistakes =
    mistakeQuestions.length > 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: 0.15,
      }}
      className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
          hasMistakes
            ? "bg-rose-50 text-rose-600"
            : "bg-emerald-50 text-emerald-600"
        }`}
      >
        {hasMistakes ? (
          <RotateCcw size={20} />
        ) : (
          <CheckCircle2 size={20} />
        )}
      </div>

      <h2 className="mt-5 text-xl font-black tracking-tight text-slate-950">
        {hasMistakes
          ? "Practica tus errores"
          : "Sin errores pendientes"}
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {hasMistakes
          ? `Tienes ${mistakeQuestions.length} ${
              mistakeQuestions.length === 1
                ? "pregunta"
                : "preguntas"
            } que conviene volver a practicar.`
          : "Las preguntas que falles aparecerán aquí para que puedas reforzarlas."}
      </p>

      {hasMistakes && (
        <button
          type="button"
          onClick={handleStart}
          className="group mt-5 flex items-center gap-2 text-sm font-extrabold text-slate-900"
        >
          Practicar ahora

          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-1"
          />
        </button>
      )}
    </motion.section>
  );
}
