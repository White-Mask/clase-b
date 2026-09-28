"use client";

import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Check, ChevronRight, RotateCcw } from "lucide-react";

import { getMistakeIds, getQuestionStats } from "@/lib/storage";
import { chapters } from "@/data/chapters";
import { questions } from "@/lib/questions";

function subscribe(callback: () => void) {
  window.addEventListener("clase-b-stats-change", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("clase-b-stats-change", callback);
    window.removeEventListener("storage", callback);
  };
}

type MistakeSummary = {
  count: number;
  byChapter: Array<{ id: string; name: string; count: number }>;
};

let cachedRaw: string | null = null;
let cachedSummary: MistakeSummary = { count: 0, byChapter: [] };

function getSnapshot(): MistakeSummary {
  const raw = localStorage.getItem("clase-b-question-stats");
  if (raw === cachedRaw) return cachedSummary;
  cachedRaw = raw;

  getQuestionStats();
  const ids = getMistakeIds();
  // Only count IDs that still exist in the question bank
  const validIds = ids.filter((id) => questions.some((q) => q.id === id));

  const byChapter = chapters
    .map((ch) => ({
      id: ch.id,
      name: ch.shortName,
      count: validIds.filter((id) =>
        questions.find((q) => q.id === id && q.chapter === ch.id)
      ).length,
    }))
    .filter((ch) => ch.count > 0)
    .sort((a, b) => b.count - a.count);

  cachedSummary = { count: validIds.length, byChapter };
  return cachedSummary;
}

const EMPTY: MistakeSummary = { count: 0, byChapter: [] };

function getServerSnapshot() {
  return EMPTY;
}

export function MistakesCard() {
  const router = useRouter();
  const { count, byChapter } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  if (count === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-7 flex items-center gap-4 rounded-[24px] border-2 border-emerald-100 bg-emerald-50/60 p-5"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
          <Check size={19} strokeWidth={3} />
        </div>

        <div>
          <p className="text-sm font-black text-slate-900">
            Sin errores pendientes
          </p>
          <p className="mt-0.5 text-xs font-bold text-slate-400">
            Sigue practicando para mantenerlo así.
          </p>
        </div>
      </motion.div>
    );
  }

  const maxCount = Math.max(...byChapter.map((c) => c.count), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-7 overflow-hidden rounded-[24px] border-2 border-rose-100 bg-white shadow-sm"
    >
      {/* Header row → navigate to /mistakes */}
      <button
        type="button"
        onClick={() => router.push("/mistakes")}
        className="group flex w-full items-center gap-4 p-5 text-left transition hover:bg-rose-50/40"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
          <RotateCcw size={21} strokeWidth={2.5} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black tracking-[-0.02em] text-slate-950">
              Tus errores
            </h3>
            <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-black text-rose-600">
              {count}
            </span>
          </div>
          <p className="mt-0.5 text-xs font-bold text-slate-400">
            {count === 1
              ? "1 pregunta para reforzar"
              : `${count} preguntas para reforzar`}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-500 transition group-hover:bg-rose-500 group-hover:text-white">
          <ChevronRight
            size={18}
            strokeWidth={2.5}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </div>
      </button>

      {/* Per-chapter breakdown */}
      {byChapter.length > 0 && (
        <div className="border-t-2 border-rose-50 px-5 pb-4 pt-3">
          <p className="mb-2.5 text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">
            Por capítulo
          </p>

          <div className="space-y-2">
            {byChapter.map((ch) => (
              <div key={ch.id} className="flex items-center gap-2.5">
                <span className="w-24 shrink-0 truncate text-[11px] font-bold text-slate-500">
                  {ch.name}
                </span>

                <div className="h-2 flex-1 overflow-hidden rounded-full bg-rose-50">
                  <div
                    className="h-full rounded-full bg-rose-400"
                    style={{
                      width: `${Math.round((ch.count / maxCount) * 100)}%`,
                    }}
                  />
                </div>

                <span className="w-6 shrink-0 text-right text-[11px] font-black text-slate-600">
                  {ch.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
