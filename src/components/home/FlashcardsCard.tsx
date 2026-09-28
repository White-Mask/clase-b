"use client";

import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowRight, Layers } from "lucide-react";

import { getFlashCardGlobalStats } from "@/lib/flashcard-storage";
import { getAllFlashCards } from "@/lib/flashcards";

function subscribe(cb: () => void) {
  window.addEventListener("clase-b-flashcard-change", cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener("clase-b-flashcard-change", cb);
    window.removeEventListener("storage", cb);
  };
}

const totalCards = getAllFlashCards().length;

const EMPTY = { seen: 0, toReview: 0, learning: 0, learned: 0 };

let cachedRaw: string | null = null;
let cachedStats = EMPTY;

function getSnapshot() {
  const raw = localStorage.getItem("clase-b-flashcard-progress");
  if (raw === cachedRaw) return cachedStats;
  cachedRaw = raw;
  cachedStats = getFlashCardGlobalStats();
  return cachedStats;
}

function getServerSnapshot() { return EMPTY; }

export function FlashcardsCard() {
  const router = useRouter();
  const stats = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hasSeen = stats.seen > 0;
  const learnedPct = hasSeen ? Math.round((stats.learned / totalCards) * 100) : 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="overflow-hidden rounded-[28px] border-2 border-violet-200 bg-violet-50"
    >
      <div className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white">
            <Layers size={22} strokeWidth={2.5} />
          </div>
          <span className="rounded-full bg-violet-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-violet-600">
            {totalCards} tarjetas
          </span>
        </div>

        <p className="mt-5 text-xs font-black uppercase tracking-[0.14em] text-violet-600">
          Modo estudio
        </p>

        <h2 className="mt-1 text-2xl font-black tracking-[-0.025em] text-slate-950">
          Tarjetas de repaso
        </h2>

        <p className="mt-2 max-w-md text-sm font-medium leading-6 text-slate-500">
          Estudia conceptos sin alternativas. Califica tu certeza y el sistema prioriza lo que más necesitas repasar.
        </p>

        {hasSeen ? (
          <div className="mt-5 grid grid-cols-3 gap-2">
            <FlashStat value={stats.learned} label="Aprendidas" color="text-emerald-600" bg="bg-white/80" />
            <FlashStat value={stats.learning} label="Aprendiendo" color="text-amber-600" bg="bg-white/80" />
            <FlashStat value={stats.toReview} label="Por revisar" color="text-rose-600" bg="bg-white/80" />
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-3 gap-2">
            <FlashStat value={totalCards} label="tarjetas" color="text-slate-950" bg="bg-white/80" />
            <FlashStat value={7} label="capítulos" color="text-slate-950" bg="bg-white/80" />
            <FlashStat value={10} label="por sesión" color="text-slate-950" bg="bg-white/80" />
          </div>
        )}

        {hasSeen && (
          <div className="mt-4">
            <div className="h-2 overflow-hidden rounded-full bg-violet-200">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${learnedPct}%` }}
                transition={{ duration: 0.8 }}
                className="h-full rounded-full bg-violet-500"
              />
            </div>
            <p className="mt-1.5 text-[11px] font-bold text-violet-400">
              {stats.seen} de {totalCards} vistas · {learnedPct}% aprendidas
            </p>
          </div>
        )}

        <motion.button
          type="button"
          onClick={() => router.push("/flashcards")}
          whileTap={{ y: 3, scale: 0.99 }}
          className="mt-6 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 border-violet-800 bg-violet-600 px-5 text-sm font-black text-white shadow-[0_4px_0_#5b21b6] transition hover:-translate-y-0.5 hover:bg-violet-700 active:translate-y-1 active:shadow-none"
        >
          {hasSeen ? "Continuar repaso" : "Empezar a repasar"}
          <ArrowRight size={18} />
        </motion.button>
      </div>
    </motion.section>
  );
}

function FlashStat({ value, label, color, bg }: { value: number; label: string; color: string; bg: string }) {
  return (
    <div className={`rounded-2xl px-2 py-3 text-center ${bg}`}>
      <p className={`text-lg font-black ${color}`}>{value}</p>
      <p className="mt-0.5 text-[10px] font-bold text-slate-400">{label}</p>
    </div>
  );
}
