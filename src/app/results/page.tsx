"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  RotateCcw,
} from "lucide-react";

import { ResultHero } from "@/components/results/ResultHero";
import { ReviewList } from "@/components/results/ReviewList";
import { ScoreProgress } from "@/components/results/ScoreProgress";

import {
  getQuizSession,
  saveQuizSession,
  type QuizSession,
} from "@/lib/quiz-session";

import { buildQuizResult } from "@/lib/results";

import {
  isAnswerCorrect,
  shuffleQuestionOptions,
} from "@/lib/quiz";

import { saveQuestionResult } from "@/lib/storage";

function saveResultStatsOnce(
  session: QuizSession
): void {
  if (typeof window === "undefined") {
    return;
  }

  const storageKey =
    `clase-b-result-saved-${session.id}`;

  const alreadySaved =
    sessionStorage.getItem(storageKey);

  if (alreadySaved) {
    return;
  }

  session.questions.forEach(
    (question) => {
      const selectedAnswers =
        session.answers[question.id] ?? [];

      const correct =
        selectedAnswers.length > 0 &&
        isAnswerCorrect(
          question,
          selectedAnswers
        );

      saveQuestionResult(
        question.id,
        correct
      );
    }
  );

  sessionStorage.setItem(
    storageKey,
    "true"
  );
}

export default function ResultsPage() {
  const router = useRouter();

  const [session] =
    useState<QuizSession | null>(() => {
      const currentSession =
        getQuizSession();

      if (currentSession) {
        saveResultStatsOnce(
          currentSession
        );
      }

      return currentSession;
    });

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8fa] px-5">
        <div className="w-full max-w-md rounded-[30px] border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="text-5xl">
            🚗
          </div>

          <h1 className="mt-5 text-2xl font-black text-slate-950">
            No encontramos un resultado
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Inicia una práctica para ver aquí
            tus resultados.
          </p>

          <button
            type="button"
            onClick={() =>
              router.replace("/")
            }
            className="mt-6 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-slate-800"
          >
            Volver al inicio
          </button>
        </div>
      </main>
    );
  }

  const currentSession = session;

  const result =
    buildQuizResult(currentSession);

  function handleRetry() {
    const nextQuestions =
      currentSession.questions.map(
        shuffleQuestionOptions
      );

    const nextSession: QuizSession = {
      id: crypto.randomUUID(),
      mode: currentSession.mode,
      title: currentSession.title,
      questions: nextQuestions,
      answers: {},
      startedAt:
        new Date().toISOString(),
    };

    saveQuizSession(nextSession);

    router.push("/quiz");
  }

  return (
    <main className="min-h-screen bg-[#f7f8fa]">
      <div className="mx-auto max-w-4xl px-5 pb-20 pt-6 sm:px-8 sm:pt-10">
        <button
          type="button"
          onClick={() =>
            router.push("/")
          }
          className="mb-5 flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-extrabold text-slate-500 transition hover:text-slate-950"
        >
          <ArrowLeft size={17} />
          Inicio
        </button>

        <ResultHero
          result={result}
        />

        <div className="mt-5">
          <ScoreProgress
            percentage={
              result.percentage
            }
          />
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleRetry}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 text-sm font-extrabold text-white transition hover:bg-slate-800"
          >
            <RotateCcw size={17} />
            Intentar de nuevo
          </button>

          <button
            type="button"
            onClick={() =>
              router.push("/")
            }
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-extrabold text-slate-700 transition hover:border-slate-300"
          >
            Elegir otra práctica
          </button>
        </div>

        <ReviewList
          result={result}
        />
      </div>
    </main>
  );
}
