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
  questions: QuestionResult[];

  correctQuestions: number;
  incorrectQuestions: number;
  unansweredQuestions: number;

  score: number;
  maxScore: number;

  percentage: number;

  isFullOfficialSimulation: boolean;
  passed: boolean | null;
};

export function buildQuizResult(
  session: QuizSession
): QuizResultSummary {
  const questionResults: QuestionResult[] =
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

  const correctQuestions =
    questionResults.filter(
      (item) => item.correct
    ).length;

  const unansweredQuestions =
    questionResults.filter(
      (item) =>
        item.selectedAnswers.length === 0
    ).length;

  const incorrectQuestions =
    session.questions.length -
    correctQuestions;

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

  const percentage =
    maxScore === 0
      ? 0
      : Math.round(
          (score / maxScore) * 100
        );

  const isFullOfficialSimulation =
    session.mode === "exam" &&
    session.questions.length ===
      CLASS_B_EXAM.questionCount &&
    maxScore === CLASS_B_EXAM.maxScore;

  const passed =
    isFullOfficialSimulation
      ? score >=
        CLASS_B_EXAM.passingScore
      : null;

  return {
    questions: questionResults,

    correctQuestions,
    incorrectQuestions,
    unansweredQuestions,

    score,
    maxScore,

    percentage,

    isFullOfficialSimulation,
    passed,
  };
}
