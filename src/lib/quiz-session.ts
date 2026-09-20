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
  answers: Record<string, string[]>;
  startedAt: string;
};

const SESSION_KEY = "clase-b-current-quiz";

export function saveQuizSession(session: QuizSession): void {
  if (typeof window === "undefined") return;

  sessionStorage.setItem(
    SESSION_KEY,
    JSON.stringify(session)
  );
}

export function getQuizSession(): QuizSession | null {
  if (typeof window === "undefined") return null;

  try {
    const value = sessionStorage.getItem(SESSION_KEY);

    if (!value) return null;

    return JSON.parse(value) as QuizSession;
  } catch {
    return null;
  }
}

export function clearQuizSession(): void {
  if (typeof window === "undefined") return;

  sessionStorage.removeItem(SESSION_KEY);
}
