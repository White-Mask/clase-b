"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { AppLoading } from "@/components/ui/AppLoading";
import { BlockCelebration } from "@/components/quiz/BlockCelebration";
import { isAnswerCorrect } from "@/lib/quiz";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { QuestionOverview } from "@/components/quiz/QuestionOverview";
import { QuizFooter } from "@/components/quiz/QuizFooter";
import { QuizHeader } from "@/components/quiz/QuizHeader";

import { PRACTICE_BLOCK_SIZE } from "@/lib/exam-config";

import {
  saveQuizSession,
  type QuizSession,
} from "@/lib/quiz-session";

import { useQuizSession } from "@/hooks/useQuizSession";

export default function QuizPage() {
  const router = useRouter();

  const session =
    useQuizSession();

  const [
    currentIndex,
    setCurrentIndex,
  ] = useState(0);

  const [direction, setDirection] =
    useState(1);

  const [
    overviewOpen,
    setOverviewOpen,
  ] = useState(false);

  const [
    celebrationOpen,
    setCelebrationOpen,
  ] = useState(false);

  const [
    celebrationCompleted,
    setCelebrationCompleted,
  ] = useState(0);

  const [
    celebrationCorrect,
    setCelebrationCorrect,
  ] = useState<number | undefined>(undefined);

  if (!session) {
    return (
      <AppLoading message="Preparando tu práctica..." />
    );
  }

  const currentSession =
    session;

  const question =
    currentSession.questions[
      currentIndex
    ];

  const selectedAnswers =
    currentSession.answers[
      question.id
    ] ?? [];

  const answeredCount =
    currentSession.questions.filter(
      (item) =>
        (currentSession.answers[
          item.id
        ]?.length ?? 0) > 0
    ).length;

  const total =
    currentSession.questions.length;

  const isExam =
    currentSession.mode === "exam";

  function updateAnswers(
    questionId: string,
    optionId: string
  ) {
    const targetQuestion =
      currentSession.questions.find(
        (item) =>
          item.id === questionId
      );

    if (!targetQuestion) {
      return;
    }

    const currentAnswers =
      currentSession.answers[
        questionId
      ] ?? [];

    const nextAnswers =
      targetQuestion.type ===
      "single"
        ? [optionId]
        : currentAnswers.includes(
              optionId
            )
          ? currentAnswers.filter(
              (answer) =>
                answer !==
                optionId
            )
          : [
              ...currentAnswers,
              optionId,
            ];

    const nextSession: QuizSession =
      {
        ...currentSession,

        answers: {
          ...currentSession.answers,

          [questionId]:
            nextAnswers,
        },
      };

    saveQuizSession(nextSession);
  }

  function goTo(
    index: number
  ) {
    if (
      index < 0 ||
      index >= total
    ) {
      return;
    }

    setDirection(
      index >= currentIndex
        ? 1
        : -1
    );

    setCurrentIndex(index);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function openMilestone(
    completed: number
  ) {
    setCelebrationCompleted(completed);

    if (completed >= total) {
      const correct = currentSession.questions.filter((q) =>
        isAnswerCorrect(q, currentSession.answers[q.id] ?? [])
      ).length;
      setCelebrationCorrect(correct);
    } else {
      setCelebrationCorrect(undefined);
    }

    setCelebrationOpen(true);
  }

  function handleNext() {
    const completed =
      currentIndex + 1;

    const isBlockEnd =
      completed %
        PRACTICE_BLOCK_SIZE ===
      0;

    if (
      !isExam &&
      isBlockEnd
    ) {
      openMilestone(completed);
      return;
    }

    goTo(currentIndex + 1);
  }

  function handleCelebrationContinue() {
    setCelebrationOpen(false);

    if (
      celebrationCompleted >=
      total
    ) {
      handleSubmit();
      return;
    }

    goTo(
      celebrationCompleted
    );
  }

  function handleLastQuestion() {
    if (!isExam) {
      openMilestone(total);
      return;
    }

    handleSubmit();
  }

  function handleSubmit() {
    const unanswered =
      currentSession.questions.filter(
        (item) =>
          (currentSession.answers[
            item.id
          ]?.length ?? 0) === 0
      ).length;

    if (unanswered > 0) {
      const message =
        unanswered === 1
          ? "Te queda 1 pregunta sin responder. ¿Quieres finalizar igualmente?"
          : `Te quedan ${unanswered} preguntas sin responder. ¿Quieres finalizar igualmente?`;

      if (
        !window.confirm(message)
      ) {
        return;
      }
    }

    const submittedSession: QuizSession = {
      ...currentSession,
      submittedAt:
        new Date().toISOString(),
    };

    saveQuizSession(
      submittedSession
    );

    router.push("/results");
  }

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <QuizHeader
        title={
          currentSession.title
        }
        current={
          currentIndex + 1
        }
        total={total}
        answered={answeredCount}
      />

      <div className="mx-auto min-h-[calc(100dvh-180px)] max-w-[760px] px-5 pb-8 pt-5 sm:px-8 sm:pb-10 sm:pt-10">
        <QuestionCard
          question={question}
          questionNumber={
            currentIndex + 1
          }
          selectedAnswers={
            selectedAnswers
          }
          direction={direction}
          onAnswer={(optionId) =>
            updateAnswers(
              question.id,
              optionId
            )
          }
        />
      </div>

      <QuizFooter
        currentIndex={
          currentIndex
        }
        total={total}
        hasAnswer={
          selectedAnswers.length > 0
        }
        answered={answeredCount}
        onPrevious={() =>
          goTo(
            currentIndex - 1
          )
        }
        onNext={handleNext}
        onSubmit={
          handleLastQuestion
        }
        onOpenOverview={() =>
          setOverviewOpen(true)
        }
      />

      <QuestionOverview
        open={overviewOpen}
        currentIndex={
          currentIndex
        }
        questionIds={currentSession.questions.map(
          (item) => item.id
        )}
        answers={
          currentSession.answers
        }
        onClose={() =>
          setOverviewOpen(false)
        }
        onSelect={goTo}
      />

      <BlockCelebration
        open={celebrationOpen}
        completed={celebrationCompleted}
        total={total}
        correctCount={celebrationCorrect}
        onContinue={handleCelebrationContinue}
      />
    </main>
  );
}
