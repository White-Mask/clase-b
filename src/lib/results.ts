import type { Question } from "@/types/question";
import type { QuizSession } from "@/lib/quiz-session";

import { CLASS_B_EXAM } from "@/lib/exam-config";
import { isAnswerCorrect } from "@/lib/quiz";

export type QuestionResult = {
  question: Question;
  selectedAnswers: string[];
  correct: boolean;
  earnedPoints: number;
};

export type QuizResultSummary = {
  mode: QuizSession["mode"];
  title: string;

  totalQuestions: number;
  correctQuestions: number;
  incorrectQuestions: number;

  score: number;
  maxScore: number;
  percentage: number;

  isFullOfficialSimulation: boolean;
  passed: boolean | null;

  questions: QuestionResult[];
};

export function buildQuizResult(
  session: QuizSession
): QuizResultSummary {
  const questionResults =
    session.questions.map((question) => {
      const selectedAnswers =
        session.answers[question.id] ?? [];

      const correct =
        selectedAnswers.length > 0 &&
        isAnswerCorrect(
          question,
          selectedAnswers
        );

      return {
        question,
        selectedAnswers,
        correct,
        earnedPoints: correct
          ? question.points
          : 0,
      };
    });

  const score = questionResults.reduce(
    (total, item) =>
      total + item.earnedPoints,
    0
  );

  const maxScore =
    session.questions.reduce(
      (total, question) =>
        total + question.points,
      0
    );

  const correctQuestions =
    questionResults.filter(
      (item) => item.correct
    ).length;

  const incorrectQuestions =
    session.questions.length -
    correctQuestions;

  const percentage =
    maxScore === 0
      ? 0
      : Math.round(
          (score / maxScore) * 100
        );

  const doublePointQuestions =
    session.questions.filter(
      (question) =>
        question.points === 2
    ).length;

  const isFullOfficialSimulation =
    session.mode === "exam" &&
    session.exam?.isComplete === true &&
    session.questions.length ===
      CLASS_B_EXAM.questionCount &&
    maxScore ===
      CLASS_B_EXAM.maxScore &&
    doublePointQuestions ===
      CLASS_B_EXAM.doublePointQuestions;

  const passed =
    isFullOfficialSimulation
      ? score >=
        CLASS_B_EXAM.passingScore
      : null;

  return {
    mode: session.mode,
    title: session.title,

    totalQuestions:
      session.questions.length,

    correctQuestions,
    incorrectQuestions,

    score,
    maxScore,
    percentage,

    isFullOfficialSimulation,
    passed,

    questions: questionResults,
  };
}
