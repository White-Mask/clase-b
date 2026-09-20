export type QuestionStat = {
  questionId: string;
  attempts: number;
  correct: number;
  incorrect: number;
  streak: number;
  lastAttempt: string;
};

const STORAGE_KEY = "clase-b-question-stats";

export function getQuestionStats(): QuestionStat[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    return JSON.parse(stored) as QuestionStat[];
  } catch {
    return [];
  }
}

export function saveQuestionResult(
  questionId: string,
  wasCorrect: boolean
): void {
  if (typeof window === "undefined") {
    return;
  }

  const stats = getQuestionStats();

  const existing = stats.find(
    (item) => item.questionId === questionId
  );

  if (existing) {
    existing.attempts += 1;

    if (wasCorrect) {
      existing.correct += 1;
      existing.streak += 1;
    } else {
      existing.incorrect += 1;
      existing.streak = 0;
    }

    existing.lastAttempt =
      new Date().toISOString();
  } else {
    stats.push({
      questionId,
      attempts: 1,
      correct: wasCorrect ? 1 : 0,
      incorrect: wasCorrect ? 0 : 1,
      streak: wasCorrect ? 1 : 0,
      lastAttempt: new Date().toISOString(),
    });
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(stats)
  );
}

export function getMistakeIds(): string[] {
  return getQuestionStats()
    .filter(
      (stat) =>
        stat.incorrect > 0 &&
        stat.streak < 3
    )
    .sort((a, b) => {
      if (b.incorrect !== a.incorrect) {
        return b.incorrect - a.incorrect;
      }

      return (
        new Date(b.lastAttempt).getTime() -
        new Date(a.lastAttempt).getTime()
      );
    })
    .map((stat) => stat.questionId);
}

export function getGlobalStats() {
  const stats = getQuestionStats();

  const attempts = stats.reduce(
    (total, item) => total + item.attempts,
    0
  );

  const correct = stats.reduce(
    (total, item) => total + item.correct,
    0
  );

  const incorrect = stats.reduce(
    (total, item) => total + item.incorrect,
    0
  );

  const accuracy =
    attempts === 0
      ? 0
      : Math.round((correct / attempts) * 100);

  const bestStreak =
    stats.length === 0
      ? 0
      : Math.max(
          ...stats.map((item) => item.streak)
        );

  return {
    attempts,
    correct,
    incorrect,
    accuracy,
    bestStreak,
  };
}

export function clearQuestionStats(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(STORAGE_KEY);
}
