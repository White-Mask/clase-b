import type { Question } from "@/types/question";

import { createQuiz } from "@/lib/quiz";
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

  const selectedQuestions = createQuiz(
    questions,
    amount
  );

  saveQuizSession({
    id: crypto.randomUUID(),
    mode,
    title,
    questions: selectedQuestions,
    answers: {},
    startedAt: new Date().toISOString(),
  });
}
