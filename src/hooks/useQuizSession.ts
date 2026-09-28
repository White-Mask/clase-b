"use client";

import {
  useSyncExternalStore,
} from "react";

import {
  getQuizSession,
  type QuizSession,
} from "@/lib/quiz-session";

const SESSION_EVENT =
  "clase-b-quiz-session-change";

let cachedRaw: string | null =
  null;

let cachedSession:
  | QuizSession
  | null = null;

function getSnapshot():
  | QuizSession
  | null {
  if (
    typeof window ===
    "undefined"
  ) {
    return null;
  }

  const raw =
    sessionStorage.getItem(
      "clase-b-current-quiz"
    );

  if (raw === cachedRaw) {
    return cachedSession;
  }

  cachedRaw = raw;

  cachedSession =
    getQuizSession();

  return cachedSession;
}

function getServerSnapshot():
  | QuizSession
  | null {
  return null;
}

function subscribe(
  callback: () => void
) {
  window.addEventListener(
    SESSION_EVENT,
    callback
  );

  return () =>
    window.removeEventListener(
      SESSION_EVENT,
      callback
    );
}

export function useQuizSession() {
  return useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
}
