import type { Question } from "@/types/question";

export function shuffle<T>(items: T[]): T[] {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

export function shuffleQuestionOptions(question: Question): Question {
  const labels = ["a", "b", "c", "d"];
  const shuffled = shuffle(question.options);
  const idRemap: Record<string, string> = {};
  const newOptions = shuffled.map((opt, i) => {
    const newId = labels[i] ?? opt.id;
    idRemap[opt.id] = newId;
    return { ...opt, id: newId };
  });
  const newCorrectAnswers = question.correctAnswers.map((id) => idRemap[id] ?? id);
  return { ...question, options: newOptions, correctAnswers: newCorrectAnswers };
}

export function createQuiz(
  questions: Question[],
  amount: number
): Question[] {
  const safeAmount = Math.min(
    Math.max(amount, 1),
    questions.length
  );

  return shuffle(questions)
    .slice(0, safeAmount)
    .map(shuffleQuestionOptions);
}

export function isAnswerCorrect(
  question: Question,
  selectedAnswers: string[]
): boolean {
  if (selectedAnswers.length !== question.correctAnswers.length) {
    return false;
  }

  const selected = [...selectedAnswers].sort();
  const correct = [...question.correctAnswers].sort();

  return selected.every(
    (answer, index) => answer === correct[index]
  );
}

export function calculateScore(
  questions: Question[],
  answers: Record<string, string[]>
) {
  let score = 0;
  let maxScore = 0;
  let correctQuestions = 0;

  for (const question of questions) {
    maxScore += question.points;

    const selectedAnswers = answers[question.id] ?? [];

    if (isAnswerCorrect(question, selectedAnswers)) {
      score += question.points;
      correctQuestions += 1;
    }
  }

  return {
    score,
    maxScore,
    correctQuestions,
    incorrectQuestions: questions.length - correctQuestions,
  };
}
