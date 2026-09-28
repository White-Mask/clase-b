import type { Question } from "@/types/question";

export type QuizSessionMode =
  | "practice"
  | "chapter"
  | "mistakes"
  | "exam";

export type QuizSession = {
  id: string;
  mode: QuizSessionMode;
  title: string;
  questions: Question[];
  answers: Record<
    string,
    string[]
  >;
  startedAt: string;
  submittedAt?: string;

  exam?: {
    isComplete: boolean;
  };
};

const SESSION_KEY =
  "clase-b-current-quiz";

const SESSION_EVENT =
  "clase-b-quiz-session-change";

function notifySessionChange() {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  window.dispatchEvent(
    new Event(SESSION_EVENT)
  );
}

export function saveQuizSession(
  session: QuizSession
): void {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  sessionStorage.setItem(
    SESSION_KEY,
    JSON.stringify(session)
  );

  notifySessionChange();
}

export function getQuizSession():
  | QuizSession
  | null {
  if (
    typeof window ===
    "undefined"
  ) {
    return null;
  }

  try {
    const value =
      sessionStorage.getItem(
        SESSION_KEY
      );

    if (!value) {
      return null;
    }

    return JSON.parse(
      value
    ) as QuizSession;
  } catch {
    return null;
  }
}

export function clearQuizSession(): void {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  sessionStorage.removeItem(
    SESSION_KEY
  );

  notifySessionChange();
}
