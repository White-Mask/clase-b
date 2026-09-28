"use client";

import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Brain,
  ChevronRight,
  CloudRain,
  Gauge,
  Layers,
  Leaf,
  ShieldAlert,
  TrafficCone,
  Users,
} from "lucide-react";

import { chapters } from "@/data/chapters";
import { getFlashCardsByChapter } from "@/lib/flashcards";
import {
  getFlashCardChapterStats,
  getFlashCardGlobalStats,
  type FlashCardChapterStats,
} from "@/lib/flashcard-storage";

const icons = {
  Gauge,
  Brain,
  Users,
  TrafficCone,
  CloudRain,
  Leaf,
  ShieldAlert,
};

function subscribe(cb: () => void) {
  window.addEventListener("clase-b-flashcard-change", cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener("clase-b-flashcard-change", cb);
    window.removeEventListener("storage", cb);
  };
}

let cachedRaw: string | null = null;
let cachedStats: { chapters: Record<string, FlashCardChapterStats>; global: ReturnType<typeof getFlashCardGlobalStats> } | null = null;

function getSnapshot() {
  const raw = localStorage.getItem("clase-b-flashcard-progress");
  if (raw === cachedRaw && cachedStats) return cachedStats;
  cachedRaw = raw;
  const chapterStats: Record<string, FlashCardChapterStats> = {};
  for (const ch of chapters) {
    const ids = getFlashCardsByChapter(ch.id).map((c) => c.id);
    chapterStats[ch.id] = getFlashCardChapterStats(ch.id, ids);
  }
  cachedStats = { chapters: chapterStats, global: getFlashCardGlobalStats() };
  return cachedStats;
}

const EMPTY = {
  chapters: {} as Record<string, FlashCardChapterStats>,
  global: { seen: 0, toReview: 0, learning: 0, learned: 0 },
};
function getServerSnapshot() { return EMPTY; }

export default function FlashcardsHubPage() {
  const router = useRouter();
  const stats = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const global = stats.global;
  const totalCards = chapters.reduce((sum, ch) => {
    return sum + (stats.chapters[ch.id]?.total ?? getFlashCardsByChapter(ch.id).length);
  }, 0);

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <div className="mx-auto w-full max-w-[620px] px-5 pb-16 pt-6 sm:px-8 sm:pt-8">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="flex h-11 w-11 items-center justify-center rounded-2xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
          aria-label="Volver al inicio"
        >
          <ArrowLeft size={21} />
        </button>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-8"
        >
          {/* Header */}
          <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-violet-100 text-violet-600">
            <Layers size={28} strokeWidth={2.2} />
          </div>

          <h1 className="mt-5 text-2xl font-black tracking-[-0.03em] text-slate-950 sm:text-3xl">
            Tarjetas de repaso
          </h1>
          <p className="mt-1.5 text-sm font-medium leading-6 text-slate-500">
            Estudia conceptos clave. Califica tu certeza y el sistema prioriza las que más necesitas repasar.
          </p>

          {/* Global progress */}
          {global.seen > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 rounded-[20px] border-2 border-violet-100 bg-violet-50 p-5"
            >
              <p className="text-xs font-black uppercase tracking-[0.14em] text-violet-500 mb-4">
                Progreso global
              </p>
              <div className="grid grid-cols-3 gap-3">
                <GlobalStat value={global.learned} label="Aprendidas" color="text-emerald-600" />
                <GlobalStat value={global.learning} label="Aprendiendo" color="text-amber-600" />
                <GlobalStat value={global.toReview} label="Por revisar" color="text-rose-600" />
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-violet-200">
                <div
                  className="h-full rounded-full bg-violet-500 transition-all duration-500"
                  style={{ width: `${Math.round((global.seen / totalCards) * 100)}%` }}
                />
              </div>
              <p className="mt-2 text-[11px] font-bold text-violet-400">
                {global.seen} de {totalCards} tarjetas vistas
              </p>
            </motion.div>
          )}

          {/* Chapter list */}
          <section className="mt-8">
            <h2 className="text-base font-black text-slate-950">
              Estudiar por capítulo
            </h2>
            <p className="mt-1 text-xs font-medium text-slate-400">
              Elige un tema para comenzar una sesión de 10 tarjetas.
            </p>

            <div className="mt-4 overflow-hidden rounded-[24px] border-2 border-slate-200 bg-white">
              {chapters.map((chapter, i) => {
                const Icon = icons[chapter.icon];
                const s = stats.chapters[chapter.id];
                const total = s?.total ?? getFlashCardsByChapter(chapter.id).length;
                const seen = s?.seen ?? 0;
                const learned = s?.learned ?? 0;
                const pct = total > 0 ? Math.round((learned / total) * 100) : 0;
                const hasSeen = seen > 0;

                return (
                  <motion.button
                    key={chapter.id}
                    type="button"
                    onClick={() => router.push(`/flashcards/${chapter.id}`)}
                    whileTap={{ scale: 0.99 }}
                    className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-slate-50 ${
                      i !== chapters.length - 1 ? "border-b-2 border-slate-100" : ""
                    }`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
                      <Icon size={19} strokeWidth={2.3} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="min-w-0 truncate text-sm font-black text-slate-800">
                          {chapter.name}
                        </p>
                        {hasSeen && (
                          <span className="shrink-0 rounded-full bg-violet-100 px-1.5 py-0.5 text-[10px] font-black text-violet-600">
                            {pct}%
                          </span>
                        )}
                      </div>
                      <div className="mt-1.5">
                        {hasSeen ? (
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-full rounded-full bg-violet-400 transition-all"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="shrink-0 text-[10px] font-bold text-slate-400">
                              {learned}/{total}
                            </span>
                          </div>
                        ) : (
                          <p className="text-xs font-bold text-slate-400">
                            {total} tarjetas · sesiones de 10
                          </p>
                        )}
                      </div>
                    </div>

                    <ChevronRight size={16} className="shrink-0 text-slate-300" />
                  </motion.button>
                );
              })}
            </div>
          </section>

          {/* Legend */}
          <div className="mt-6 rounded-2xl border-2 border-slate-100 bg-white p-4">
            <p className="mb-3 text-xs font-black text-slate-500">Clasificación de tarjetas</p>
            <div className="space-y-2">
              <LegendRow emoji="✗" color="text-rose-600" label="No la sabía" desc="Se prioriza en la próxima sesión" />
              <LegendRow emoji="~" color="text-amber-600" label="Dudé" desc="Aparece con regularidad hasta dominarlo" />
              <LegendRow emoji="✓" color="text-emerald-600" label="La sabía" desc="Marcada como aprendida tras 2 sesiones seguidas" />
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

function GlobalStat({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="rounded-2xl bg-white px-2 py-3 text-center">
      <p className={`text-xl font-black ${color}`}>{value}</p>
      <p className="mt-0.5 text-[10px] font-bold text-slate-400">{label}</p>
    </div>
  );
}

function LegendRow({ emoji, color, label, desc }: { emoji: string; color: string; label: string; desc: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className={`mt-0.5 shrink-0 text-sm font-black ${color}`}>{emoji}</span>
      <div>
        <p className="text-xs font-black text-slate-700">{label}</p>
        <p className="text-[11px] font-medium text-slate-400">{desc}</p>
      </div>
    </div>
  );
}
