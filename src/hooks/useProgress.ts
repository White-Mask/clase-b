"use client";

import {
  useSyncExternalStore,
} from "react";

import {
  EMPTY_PROGRESS,
  getProgress,
  type UserProgress,
} from "@/lib/progress";

const EVENT =
  "clase-b-progress-change";

let cachedRaw: string | null =
  null;

let cachedProgress:
  UserProgress =
    EMPTY_PROGRESS;

function getSnapshot():
  UserProgress {
  const raw =
    localStorage.getItem(
      "clase-b-user-progress"
    );

  if (raw === cachedRaw) {
    return cachedProgress;
  }

  cachedRaw = raw;
  cachedProgress =
    getProgress();

  return cachedProgress;
}

function getServerSnapshot():
  UserProgress {
  return EMPTY_PROGRESS;
}

function subscribe(
  callback: () => void
) {
  window.addEventListener(
    EVENT,
    callback
  );

  window.addEventListener(
    "storage",
    callback
  );

  return () => {
    window.removeEventListener(
      EVENT,
      callback
    );

    window.removeEventListener(
      "storage",
      callback
    );
  };
}

export function useProgress() {
  return useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
}
