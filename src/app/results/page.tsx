"use client";

import {
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  RotateCcw,
  Target,
} from "lucide-react";

import { CalculatingResult } from "@/components/results/CalculatingResult";
import { ResultHero } from "@/components/results/ResultHero";
import { ReviewList } from "@/components/results/ReviewList";

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
import { registerCompletedSession } from "@/lib/progress";

function saveResultStatsOnce(
  session: QuizSession
): void {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  const storageKey =
    `clase-b-result-saved-${session.id}`;

  if (
    sessionStorage.getItem(
      storageKey
    )
  ) {
    return;
  }

  /*
   * Marcamos primero la sesión como procesada.
   * Así React Strict Mode o un re-render no
   * puede sumar el mismo intento dos veces.
   */
  sessionStorage.setItem(
    storageKey,
    "true"
  );

  session.questions.forEach(
    (question) => {
      const selectedAnswers =
        session.answers[
          question.id
        ] ?? [];

      const correct =
        selectedAnswers.length >
          0 &&
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

  const result =
    buildQuizResult(session);

  registerCompletedSession(
    result
  );
}

export default function ResultsPage() {
  const router = useRouter();

  // Both server and client start with null + calculating=true so
  // hydration always matches. Session is loaded in useEffect (client only).
  const [session, setSession] =
    useState<QuizSession | null>(null);

  const [
    calculating,
    setCalculating,
  ] = useState(true);

  useEffect(() => {
    const currentSession = getQuizSession();
    if (currentSession?.submittedAt) {
      saveResultStatsOnce(currentSession);
      setSession(currentSession);
    }

    const timer =
      window.setTimeout(() => {
        setCalculating(false);
      }, 1200);

    return () =>
      window.clearTimeout(timer);
  }, []);

  // Always show loading first — keeps server/client render identical on mount
  if (calculating) {
    return <CalculatingResult />;
  }

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8fafc] px-5">
        <div className="text-center">
          <div className="text-5xl">
            🚗
          </div>

          <h1 className="mt-5 text-2xl font-black text-slate-950">
            No encontramos un resultado
          </h1>

          <button
            type="button"
            onClick={() =>
              router.replace("/")
            }
            className="mt-6 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white"
          >
            Volver al inicio
          </button>
        </div>
      </main>
    );
  }

  const currentSession = session;

  const result =
    buildQuizResult(
      currentSession
    );

  function handleMistakes() {
    const mistakeQuestions =
      result.questions
        .filter(
          (item) => !item.correct
        )
        .map(
          (item) => item.question
        );

    if (
      mistakeQuestions.length === 0
    ) {
      return;
    }

    const nextSession: QuizSession = {
      id: crypto.randomUUID(),
      mode: "mistakes",
      title: "Practicar mis errores",
      questions:
        mistakeQuestions.map(
          shuffleQuestionOptions
        ),
      answers: {},
      startedAt:
        new Date().toISOString(),
    };

    saveQuizSession(
      nextSession
    );

    router.push("/quiz");
  }

  function handleRetry() {
    const nextQuestions =
      currentSession.questions.map(
        shuffleQuestionOptions
      );

    const nextSession: QuizSession =
      {
        id: crypto.randomUUID(),
        mode:
          currentSession.mode,
        title:
          currentSession.title,
        questions:
          nextQuestions,
        answers: {},
        startedAt:
          new Date().toISOString(),
      };

    saveQuizSession(
      nextSession
    );

    router.push("/quiz");
  }

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <div className="mx-auto w-full max-w-[760px] px-5 pb-20 pt-6 sm:px-8 sm:pt-8">
        <button
          type="button"
          onClick={() =>
            router.push("/")
          }
          className="mb-5 flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-black text-slate-400 transition hover:text-slate-950"
        >
          <ArrowLeft size={17} />
          Inicio
        </button>

        <ResultHero
          result={result}
        />

        <div className="mt-5 space-y-2.5">
          {/* Primario: practicar errores (solo si hay errores) */}
          {result.incorrectQuestions > 0 && (
            <button
              type="button"
              onClick={handleMistakes}
              className="flex min-h-14 w-full items-center justify-center gap-2.5 rounded-2xl border-2 border-blue-800 bg-blue-600 px-5 text-sm font-black text-white shadow-[0_4px_0_#1e40af] transition hover:-translate-y-0.5 hover:bg-blue-700 active:translate-y-0.5 active:shadow-[0_2px_0_#1e40af]"
            >
              <Target size={17} strokeWidth={2.5} />
              Practicar mis{" "}
              {result.incorrectQuestions}{" "}
              {result.incorrectQuestions === 1 ? "error" : "errores"}
            </button>
          )}

          {/* Secundario: reintentar */}
          <button
            type="button"
            onClick={handleRetry}
            className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 active:bg-slate-100"
          >
            <RotateCcw size={17} strokeWidth={2.3} />
            Intentar de nuevo
          </button>

          {/* Terciario: inicio */}
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex min-h-11 w-full items-center justify-center text-sm font-semibold text-slate-400 transition hover:text-slate-700"
          >
            Volver al inicio
          </button>
        </div>

        <ReviewList
          result={result}
        />
      </div>
    </main>
  );
}
