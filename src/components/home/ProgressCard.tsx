"use client";

import {
  useEffect,
  useState,
} from "react";
import { motion } from "motion/react";
import {
  Flame,
  Target,
  Trophy,
} from "lucide-react";

import {
  getGlobalStats,
} from "@/lib/storage";

type Stats = {
  attempts: number;
  correct: number;
  incorrect: number;
  accuracy: number;
  bestStreak: number;
};

const emptyStats: Stats = {
  attempts: 0,
  correct: 0,
  incorrect: 0,
  accuracy: 0,
  bestStreak: 0,
};

export function ProgressCard() {
  const [stats, setStats] =
    useState<Stats>(emptyStats);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setStats(getGlobalStats());
    }, 0);

    return () =>
      window.clearTimeout(timer);
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: 0.2,
      }}
      className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
    >
      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-400">
        Tu progreso
      </p>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <ProgressItem
          icon={<Target size={18} />}
          value={
            stats.attempts === 0
              ? "—"
              : `${stats.accuracy}%`
          }
          label="precisión"
        />

        <ProgressItem
          icon={<Trophy size={18} />}
          value={String(
            stats.attempts
          )}
          label="respondidas"
        />

        <ProgressItem
          icon={<Flame size={18} />}
          value={String(
            stats.bestStreak
          )}
          label="racha"
        />
      </div>
    </motion.section>
  );
}

function ProgressItem({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="min-w-0 rounded-2xl bg-slate-50 p-3 sm:p-4">
      <div className="text-slate-400">
        {icon}
      </div>

      <div className="mt-4 text-xl font-black text-slate-950 sm:text-2xl">
        {value}
      </div>

      <div className="mt-1 truncate text-[11px] font-medium text-slate-500 sm:text-xs">
        {label}
      </div>
    </div>
  );
}
