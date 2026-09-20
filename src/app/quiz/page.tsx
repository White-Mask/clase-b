"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { QuestionCard } from "@/components/quiz/QuestionCard";
import { QuestionNavigator } from "@/components/quiz/QuestionNavigator";
import { QuizHeader } from "@/components/quiz/QuizHeader";
import { QuizNavigation } from "@/components/quiz/QuizNavigation";

import {
  getQuizSession,
  saveQuizSession,
  type QuizSession,
} from "@/lib/quiz-session";

export default function QuizPage() {
  const router = useRouter();

  const [session, setSession] =
    useState<QuizSession | null>(() => getQuizSession());

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [direction, setDirection] =
    useState(1);

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8fa] px-5">
        <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="text-4xl">🚗</div>

          <h1 className="mt-4 text-xl font-black text-slate-950">
            No hay un quiz activo
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Vuelve al inicio y selecciona una práctica o
            simulacro para comenzar.
          </p>

          <button
            type="button"
            onClick={() => router.replace("/")}
            className="mt-6 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-slate-800"
          >
            Volver al inicio
          </button>
        </div>
      </main>
    );
  }

  const currentSession = session;

  const answeredCount =
    currentSession.questions.filter(
      (question) =>
        (currentSession.answers[question.id]?.length ?? 0) > 0
    ).length;

  const question =
    currentSession.questions[currentIndex];

  const selectedAnswers =
    currentSession.answers[question.id] ?? [];

  function updateAnswers(
    questionId: string,
    optionId: string
  ) {
    const targetQuestion =
      currentSession.questions.find(
        (item) => item.id === questionId
      );

    if (!targetQuestion) {
      return;
    }

    const currentAnswers =
      currentSession.answers[questionId] ?? [];

    let nextAnswers: string[];

    if (targetQuestion.type === "single") {
      nextAnswers = [optionId];
    } else {
      nextAnswers = currentAnswers.includes(optionId)
        ? currentAnswers.filter(
            (answer) => answer !== optionId
          )
        : [...currentAnswers, optionId];
    }

    const nextSession: QuizSession = {
      ...currentSession,
      answers: {
        ...currentSession.answers,
        [questionId]: nextAnswers,
      },
    };

    setSession(nextSession);
    saveQuizSession(nextSession);
  }

  function goTo(index: number) {
    if (
      index < 0 ||
      index >= currentSession.questions.length
    ) {
      return;
    }

    setDirection(
      index >= currentIndex ? 1 : -1
    );

    setCurrentIndex(index);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleNext() {
    goTo(currentIndex + 1);
  }

  function handlePrevious() {
    goTo(currentIndex - 1);
  }

  function handleSubmit() {
    const unanswered =
      currentSession.questions.filter(
        (item) =>
          (currentSession.answers[item.id]?.length ?? 0) === 0
      ).length;

    if (unanswered > 0) {
      const message =
        unanswered === 1
          ? "Te queda 1 pregunta sin responder. ¿Quieres enviarlo igualmente?"
          : `Te quedan ${unanswered} preguntas sin responder. ¿Quieres enviarlo igualmente?`;

      if (!window.confirm(message)) {
        return;
      }
    }

    saveQuizSession(currentSession);
    router.push("/results");
  }

  return (
    <main className="min-h-screen bg-[#f7f8fa]">
      <QuizHeader
        title={currentSession.title}
        current={currentIndex + 1}
        total={currentSession.questions.length}
        answered={answeredCount}
      />

      <div className="mx-auto max-w-4xl px-5 pb-16 pt-8 sm:px-8 sm:pt-12">
        <QuestionCard
          question={question}
          questionNumber={currentIndex + 1}
          selectedAnswers={selectedAnswers}
          direction={direction}
          onAnswer={(optionId) =>
            updateAnswers(
              question.id,
              optionId
            )
          }
        />

        <QuizNavigation
          currentIndex={currentIndex}
          total={currentSession.questions.length}
          hasAnswer={selectedAnswers.length > 0}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSubmit={handleSubmit}
        />

        <QuestionNavigator
          total={currentSession.questions.length}
          currentIndex={currentIndex}
          answers={currentSession.answers}
          questionIds={currentSession.questions.map(
            (item) => item.id
          )}
          onSelect={goTo}
        />
      </div>
    </main>
  );
}
