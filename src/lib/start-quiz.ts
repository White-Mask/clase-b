import type { Question } from "@/types/question";

import {
  createQuiz,
  shuffleQuestionOptions,
} from "@/lib/quiz";

import {
  saveQuizSession,
  type QuizSessionMode,
} from "@/lib/quiz-session";

type StartQuizOptions = {
  questions: Question[];
  amount: number;
  mode: QuizSessionMode;
  title: string;
};

type StartPreparedQuizOptions = {
  questions: Question[];
  mode: QuizSessionMode;
  title: string;
};

export function startQuiz({
  questions,
  amount,
  mode,
  title,
}: StartQuizOptions) {
  if (questions.length === 0) {
    throw new Error(
      "No hay preguntas disponibles para iniciar este quiz."
    );
  }

  const selectedQuestions =
    createQuiz(
      questions,
      amount
    );

  saveQuizSession({
    id: crypto.randomUUID(),
    mode,
    title,
    questions:
      selectedQuestions,
    answers: {},
    startedAt:
      new Date().toISOString(),
  });
}

export function startPreparedQuiz({
  questions,
  mode,
  title,
}: StartPreparedQuizOptions) {
  if (questions.length === 0) {
    throw new Error(
      "No hay preguntas disponibles para iniciar este quiz."
    );
  }

  saveQuizSession({
    id: crypto.randomUUID(),
    mode,
    title,
    questions:
      questions.map(
        shuffleQuestionOptions
      ),
    answers: {},
    startedAt:
      new Date().toISOString(),
  });
}

export function startExamSession(
  questions: Question[],
  isComplete: boolean
) {
  if (questions.length === 0) {
    throw new Error(
      "No hay preguntas disponibles para iniciar el simulacro."
    );
  }

  saveQuizSession({
    id: crypto.randomUUID(),
    mode: "exam",
    title: isComplete
      ? "Simulacro Clase B"
      : "Preview del simulacro",
    questions,
    answers: {},
    startedAt:
      new Date().toISOString(),
    exam: {
      isComplete,
    },
  });
}
