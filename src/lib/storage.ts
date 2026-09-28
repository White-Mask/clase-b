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

  window.dispatchEvent(
    new Event(
      "clase-b-stats-change"
    )
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

export type ChapterMastery = {
  attempted: number;
  total: number;
  accuracy: number | null;
  stars: 0 | 1 | 2 | 3;
  level: "none" | "learning" | "progress" | "advanced" | "mastered";
  mistakeCount: number;
};

export function getChapterMastery(
  chapterId: string,
  allQuestionIds: string[]
): ChapterMastery {
  const stats = getQuestionStats();
  const chapterStats = stats.filter((s) =>
    allQuestionIds.includes(s.questionId)
  );

  const attempted = chapterStats.length;
  const total = allQuestionIds.length;
  const totalCorrect = chapterStats.reduce((sum, s) => sum + s.correct, 0);
  const totalAttempts = chapterStats.reduce((sum, s) => sum + s.attempts, 0);
  const accuracy =
    totalAttempts === 0
      ? null
      : Math.round((totalCorrect / totalAttempts) * 100);
  const mistakeCount = chapterStats.filter(
    (s) => s.incorrect > 0 && s.streak < 3
  ).length;

  let stars: 0 | 1 | 2 | 3 = 0;
  let level: ChapterMastery["level"] = "none";

  if (accuracy !== null) {
    if (accuracy >= 90) {
      stars = 3;
      level = "mastered";
    } else if (accuracy >= 75) {
      stars = 2;
      level = "advanced";
    } else if (accuracy >= 60) {
      stars = 1;
      level = "progress";
    } else {
      stars = 0;
      level = "learning";
    }
  }

  return { attempted, total, accuracy, stars, level, mistakeCount };
}

const EXAM_HISTORY_KEY =
  "clase-b-exam-question-history";

export function getExamUsedIds(): Set<string> {
  if (typeof window === "undefined") {
    return new Set();
  }

  try {
    const stored = localStorage.getItem(
      EXAM_HISTORY_KEY
    );

    if (!stored) {
      return new Set();
    }

    return new Set(
      JSON.parse(stored) as string[]
    );
  } catch {
    return new Set();
  }
}

export function addExamUsedIds(
  ids: string[]
): void {
  if (typeof window === "undefined") {
    return;
  }

  const current = getExamUsedIds();

  for (const id of ids) {
    current.add(id);
  }

  localStorage.setItem(
    EXAM_HISTORY_KEY,
    JSON.stringify([...current])
  );
}

export function clearExamHistory(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(EXAM_HISTORY_KEY);
}
