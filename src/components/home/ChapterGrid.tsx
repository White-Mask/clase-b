"use client";

import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  Brain,
  ChevronRight,
  CloudRain,
  Gauge,
  Leaf,
  ShieldAlert,
  TrafficCone,
  Users,
} from "lucide-react";

import { chapters } from "@/data/chapters";
import {
  getQuestionsByChapter,
  CHAPTER_BATCH_SIZE,
} from "@/lib/questions";
import {
  getChapterMastery,
  type ChapterMastery,
} from "@/lib/storage";

const icons = {
  Gauge,
  Brain,
  Users,
  TrafficCone,
  CloudRain,
  Leaf,
  ShieldAlert,
};

const levelColors = {
  none: {
    icon: "bg-slate-100 text-slate-500",
    bar: "bg-slate-300",
    badge: "text-slate-500 bg-slate-100",
  },
  learning: {
    icon: "bg-rose-50 text-rose-500",
    bar: "bg-rose-400",
    badge: "text-rose-600 bg-rose-50",
  },
  progress: {
    icon: "bg-amber-50 text-amber-500",
    bar: "bg-amber-400",
    badge: "text-amber-700 bg-amber-50",
  },
  advanced: {
    icon: "bg-blue-50 text-blue-500",
    bar: "bg-blue-400",
    badge: "text-blue-700 bg-blue-50",
  },
  mastered: {
    icon: "bg-emerald-50 text-emerald-600",
    bar: "bg-emerald-400",
    badge: "text-emerald-700 bg-emerald-50",
  },
};

function subscribe(callback: () => void) {
  window.addEventListener("clase-b-stats-change", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("clase-b-stats-change", callback);
    window.removeEventListener("storage", callback);
  };
}

let cachedStatsRaw: string | null = null;
let cachedMasteries: Record<string, ChapterMastery> = {};

function getSnapshot() {
  const raw = localStorage.getItem("clase-b-question-stats");
  if (raw === cachedStatsRaw) return cachedMasteries;
  cachedStatsRaw = raw;
  const next: Record<string, ChapterMastery> = {};
  for (const ch of chapters) {
    const qs = getQuestionsByChapter(ch.id);
    next[ch.id] = getChapterMastery(ch.id, qs.map((q) => q.id));
  }
  cachedMasteries = next;
  return next;
}

const EMPTY_MASTERIES: Record<string, ChapterMastery> = {};

function getServerSnapshot() {
  return EMPTY_MASTERIES;
}

export function ChapterGrid() {
  const router = useRouter();

  const masteries = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  function handleChapter(chapterId: string) {
    router.push(`/chapter/${chapterId}`);
  }

  return (
    <section className="mt-10">
      <h2 className="text-lg font-black tracking-tight text-slate-950">
        Practicar por tema
      </h2>

      <p className="mt-1 text-sm font-medium text-slate-400">
        Refuerza un contenido específico.
      </p>

      <div className="mt-4 overflow-hidden rounded-[24px] border-2 border-slate-200 bg-white">
        {chapters.map((chapter, index) => {
          const Icon = icons[chapter.icon];
          const chapterQuestions = getQuestionsByChapter(chapter.id);
          const disabled = chapterQuestions.length === 0;
          const mastery = masteries[chapter.id];
          const colors = levelColors[mastery?.level ?? "none"];
          const hasActivity = mastery && mastery.attempted > 0;
          const completionPct = mastery
            ? Math.round((mastery.attempted / mastery.total) * 100)
            : 0;
          const sessionSize = Math.min(CHAPTER_BATCH_SIZE, chapterQuestions.length);

          return (
            <motion.button
              key={chapter.id}
              type="button"
              disabled={disabled}
              onClick={() => handleChapter(chapter.id)}
              whileTap={disabled ? undefined : { scale: 0.99 }}
              className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition ${
                index !== chapters.length - 1 ? "border-b-2 border-slate-100" : ""
              } ${disabled ? "cursor-not-allowed opacity-40" : "hover:bg-slate-50"}`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition ${colors.icon}`}
              >
                <Icon size={19} strokeWidth={2.3} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="min-w-0 truncate text-sm font-black text-slate-800">
                    {chapter.name}
                  </p>

                  {hasActivity && (
                    <span
                      className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-black ${colors.badge}`}
                    >
                      {completionPct}%
                    </span>
                  )}
                </div>

                <div className="mt-1.5 flex items-center gap-2">
                  {hasActivity ? (
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all ${colors.bar}`}
                        style={{ width: `${completionPct}%` }}
                      />
                    </div>
                  ) : (
                    <p className="text-xs font-bold text-slate-400">
                      {chapterQuestions.length === 0
                        ? "Próximamente"
                        : `${sessionSize} por sesión · ${chapterQuestions.length} en total`}
                    </p>
                  )}
                </div>
              </div>

              {!disabled && (
                <ChevronRight size={16} className="shrink-0 text-slate-300" />
              )}
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
