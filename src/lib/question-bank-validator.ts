import type { Question } from "@/types/question";

export type ValidationIssue = {
  type: "error" | "warning";
  questionId?: string;
  message: string;
};

export function validateQuestionBank(
  questions: Question[]
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const ids = new Set<string>();

  for (const question of questions) {
    if (ids.has(question.id)) {
      issues.push({
        type: "error",
        questionId: question.id,
        message:
          "ID de pregunta duplicado.",
      });
    }

    ids.add(question.id);

    if (
      question.options.length < 2
    ) {
      issues.push({
        type: "error",
        questionId: question.id,
        message:
          "La pregunta necesita al menos 2 alternativas.",
      });
    }

    if (
      question.correctAnswers.length ===
      0
    ) {
      issues.push({
        type: "error",
        questionId: question.id,
        message:
          "La pregunta no tiene respuesta correcta.",
      });
    }

    const optionIds = new Set(
      question.options.map(
        (option) => option.id
      )
    );

    for (
      const answer
      of question.correctAnswers
    ) {
      if (
        !optionIds.has(answer)
      ) {
        issues.push({
          type: "error",
          questionId: question.id,
          message: `La respuesta correcta "${answer}" no existe entre las alternativas.`,
        });
      }
    }

    if (
      question.type === "single" &&
      question.correctAnswers.length !==
        1
    ) {
      issues.push({
        type: "error",
        questionId: question.id,
        message:
          "Una pregunta single debe tener exactamente una respuesta correcta.",
      });
    }

    if (
      question.type === "multiple" &&
      question.correctAnswers.length < 2
    ) {
      issues.push({
        type: "warning",
        questionId: question.id,
        message:
          "Una pregunta multiple normalmente debería tener más de una respuesta correcta.",
      });
    }

    if (
      question.points !== 1 &&
      question.points !== 2
    ) {
      issues.push({
        type: "error",
        questionId: question.id,
        message:
          "Los puntos deben ser 1 o 2.",
      });
    }

    if (
      !question.explanation.trim()
    ) {
      issues.push({
        type: "warning",
        questionId: question.id,
        message:
          "Falta explicación.",
      });
    }

    if (
      !question.chapter.trim()
    ) {
      issues.push({
        type: "error",
        questionId: question.id,
        message:
          "Falta capítulo.",
      });
    }

    if (
      !question.topic.trim()
    ) {
      issues.push({
        type: "error",
        questionId: question.id,
        message:
          "Falta tema.",
      });
    }

    if (
      question.source?.page !==
        undefined &&
      question.source.page < 1
    ) {
      issues.push({
        type: "error",
        questionId: question.id,
        message:
          "La página de la fuente no es válida.",
      });
    }
  }

  const doubleQuestions =
    questions.filter(
      (question) =>
        question.points === 2
    ).length;

  if (doubleQuestions < 3) {
    issues.push({
      type: "warning",
      message:
        "El banco todavía no contiene al menos 3 preguntas de doble puntaje.",
    });
  }

  return issues;
}
