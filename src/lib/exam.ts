import type { Question } from "@/types/question";

import { CLASS_B_EXAM } from "@/lib/exam-config";
import {
  shuffle,
  shuffleQuestionOptions,
} from "@/lib/quiz";

export type ExamBuildResult = {
  questions: Question[];
  isComplete: boolean;
  cycled: boolean;
  missing: {
    regular: number;
    double: number;
    total: number;
  };
};

export function canBuildFullExam(
  questions: Question[]
): boolean {
  const regular =
    questions.filter(
      (question) =>
        question.points === 1
    ).length;

  const double =
    questions.filter(
      (question) =>
        question.points === 2
    ).length;

  const requiredRegular =
    CLASS_B_EXAM.questionCount -
    CLASS_B_EXAM.doublePointQuestions;

  return (
    regular >= requiredRegular &&
    double >=
      CLASS_B_EXAM.doublePointQuestions
  );
}

export function buildExam(
  questions: Question[],
  usedIds: Set<string> = new Set()
): ExamBuildResult {
  const requiredDouble =
    CLASS_B_EXAM.doublePointQuestions;

  const requiredRegular =
    CLASS_B_EXAM.questionCount -
    requiredDouble;

  const allDouble = questions.filter(
    (q) => q.points === 2
  );

  const allRegular = questions.filter(
    (q) => q.points === 1
  );

  const freshDouble = allDouble.filter(
    (q) => !usedIds.has(q.id)
  );

  const freshRegular = allRegular.filter(
    (q) => !usedIds.has(q.id)
  );

  // If either pool is exhausted, reset and use the full bank
  const cycled =
    freshDouble.length < requiredDouble ||
    freshRegular.length < requiredRegular;

  const doublePool = shuffle(
    cycled ? allDouble : freshDouble
  );

  const regularPool = shuffle(
    cycled ? allRegular : freshRegular
  );

  const selectedDouble =
    doublePool.slice(0, requiredDouble);

  const selectedRegular =
    regularPool.slice(0, requiredRegular);

  const isComplete =
    selectedDouble.length ===
      requiredDouble &&
    selectedRegular.length ===
      requiredRegular;

  /*
   * Si todavía estamos desarrollando
   * el banco, usamos todas las
   * disponibles como preview.
   *
   * Nunca lo consideramos un
   * simulacro completo.
   */
  if (!isComplete) {
    const preview =
      shuffle(questions).map(
        shuffleQuestionOptions
      );

    return {
      questions: preview,
      isComplete: false,
      cycled: false,
      missing: {
        regular: Math.max(
          requiredRegular -
            regularPool.length,
          0
        ),
        double: Math.max(
          requiredDouble -
            doublePool.length,
          0
        ),
        total: Math.max(
          CLASS_B_EXAM.questionCount -
            questions.length,
          0
        ),
      },
    };
  }

  const examQuestions =
    shuffle([
      ...selectedRegular,
      ...selectedDouble,
    ]).map(shuffleQuestionOptions);

  return {
    questions: examQuestions,
    isComplete: true,
    cycled,
    missing: {
      regular: 0,
      double: 0,
      total: 0,
    },
  };
}
