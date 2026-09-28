import type { QuizResultSummary } from "@/lib/results";

export type DailyActivity = {
  date: string;
  sessions: number;
  questions: number;
  correct: number;
};

export type UserProgress = {
  totalSessions: number;
  totalQuestions: number;
  totalCorrect: number;
  currentStreak: number;
  bestStreak: number;
  lastActiveDate: string | null;
  activeDays: DailyActivity[];
  bestExamScore: number | null;
};

const STORAGE_KEY =
  "clase-b-user-progress";

export const EMPTY_PROGRESS: UserProgress = {
  totalSessions: 0,
  totalQuestions: 0,
  totalCorrect: 0,
  currentStreak: 0,
  bestStreak: 0,
  lastActiveDate: null,
  activeDays: [],
  bestExamScore: null,
};

function getLocalDateKey(
  date = new Date()
): string {
  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseLocalDate(
  value: string
): Date {
  const [
    year,
    month,
    day,
  ] = value
    .split("-")
    .map(Number);

  return new Date(
    year,
    month - 1,
    day
  );
}

function differenceInDays(
  from: string,
  to: string
): number {
  const start =
    parseLocalDate(from);

  const end =
    parseLocalDate(to);

  const startUtc =
    Date.UTC(
      start.getFullYear(),
      start.getMonth(),
      start.getDate()
    );

  const endUtc =
    Date.UTC(
      end.getFullYear(),
      end.getMonth(),
      end.getDate()
    );

  return Math.round(
    (endUtc - startUtc) /
      86_400_000
  );
}

export function getProgress():
  UserProgress {
  if (
    typeof window ===
    "undefined"
  ) {
    return EMPTY_PROGRESS;
  }

  try {
    const raw =
      localStorage.getItem(
        STORAGE_KEY
      );

    if (!raw) {
      return EMPTY_PROGRESS;
    }

    const parsed =
      JSON.parse(raw) as Partial<UserProgress>;

    return {
      ...EMPTY_PROGRESS,
      ...parsed,
      activeDays:
        parsed.activeDays ?? [],
    };
  } catch {
    return EMPTY_PROGRESS;
  }
}

export function saveProgress(
  progress: UserProgress
): void {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(progress)
  );

  window.dispatchEvent(
    new Event(
      "clase-b-progress-change"
    )
  );
}

export function registerCompletedSession(
  result: QuizResultSummary
): UserProgress {
  const current =
    getProgress();

  const today =
    getLocalDateKey();

  const alreadyActiveToday =
    current.lastActiveDate ===
    today;

  let currentStreak =
    current.currentStreak;

  if (!alreadyActiveToday) {
    if (
      current.lastActiveDate
    ) {
      const difference =
        differenceInDays(
          current.lastActiveDate,
          today
        );

      if (difference === 1) {
        currentStreak += 1;
      } else if (
        difference > 1
      ) {
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }
  }

  const existingDay =
    current.activeDays.find(
      (item) =>
        item.date === today
    );

  const activeDays =
    existingDay
      ? current.activeDays.map(
          (item) =>
            item.date === today
              ? {
                  ...item,
                  sessions:
                    item.sessions +
                    1,
                  questions:
                    item.questions +
                    result.totalQuestions,
                  correct:
                    item.correct +
                    result.correctQuestions,
                }
              : item
        )
      : [
          ...current.activeDays,
          {
            date: today,
            sessions: 1,
            questions:
              result.totalQuestions,
            correct:
              result.correctQuestions,
          },
        ];

  const bestExamScore =
    result.isFullOfficialSimulation
      ? Math.max(
          current.bestExamScore ??
            0,
          result.score
        )
      : current.bestExamScore;

  const next: UserProgress = {
    totalSessions:
      current.totalSessions + 1,

    totalQuestions:
      current.totalQuestions +
      result.totalQuestions,

    totalCorrect:
      current.totalCorrect +
      result.correctQuestions,

    currentStreak,

    bestStreak: Math.max(
      current.bestStreak,
      currentStreak
    ),

    lastActiveDate: today,

    activeDays:
      activeDays.slice(-90),

    bestExamScore,
  };

  saveProgress(next);

  return next;
}

export function getAccuracy(
  progress: UserProgress
): number | null {
  if (
    progress.totalQuestions === 0
  ) {
    return null;
  }

  return Math.round(
    (progress.totalCorrect /
      progress.totalQuestions) *
      100
  );
}

export function getWeekActivity(
  progress: UserProgress
) {
  const today =
    new Date();

  const day =
    today.getDay();

  const mondayOffset =
    day === 0
      ? -6
      : 1 - day;

  const monday =
    new Date(today);

  monday.setDate(
    today.getDate() +
      mondayOffset
  );

  return Array.from(
    { length: 7 },
    (_, index) => {
      const date =
        new Date(monday);

      date.setDate(
        monday.getDate() +
          index
      );

      const key =
        getLocalDateKey(date);

      const activity =
        progress.activeDays.find(
          (item) =>
            item.date === key
        );

      return {
        date: key,
        active: Boolean(
          activity
        ),
        sessions:
          activity?.sessions ??
          0,
        isToday:
          key ===
          getLocalDateKey(),
      };
    }
  );
}
