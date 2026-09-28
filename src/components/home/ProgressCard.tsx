"use client";

import {
  motion,
} from "motion/react";

import {
  Flame,
  Target,
  Trophy,
} from "lucide-react";

import { useProgress } from "@/hooks/useProgress";
import { getAccuracy } from "@/lib/progress";

export function ProgressCard() {
  const progress =
    useProgress();

  const accuracy =
    getAccuracy(progress);

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 18,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
        delay: 0.2,
      }}
      className="rounded-[28px] border-2 border-slate-200 bg-white p-6 shadow-[0_3px_0_#e2e8f0]"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
          Tu progreso
        </p>

        {progress.currentStreak >
          0 && (
          <motion.span
            initial={{
              scale: 0.8,
            }}
            animate={{
              scale: 1,
            }}
            className="rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-black text-orange-600"
          >
            🔥{" "}
            {
              progress.currentStreak
            }{" "}
            {progress.currentStreak ===
            1
              ? "día"
              : "días"}
          </motion.span>
        )}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <ProgressItem
          icon={
            <Target
              size={18}
            />
          }
          value={
            accuracy === null
              ? "—"
              : `${accuracy}%`
          }
          label="precisión"
        />

        <ProgressItem
          icon={
            <Trophy
              size={18}
            />
          }
          value={String(
            progress.totalQuestions
          )}
          label="preguntas"
        />

        <ProgressItem
          icon={
            <Flame
              size={18}
            />
          }
          value={String(
            progress.currentStreak
          )}
          label="racha"
          highlight={
            progress.currentStreak >
            0
          }
        />
      </div>

      {progress.totalSessions >
        0 && (
        <div className="mt-4 flex items-center justify-between border-t-2 border-slate-100 pt-4 text-xs font-bold text-slate-400">
          <span>
            {
              progress.totalSessions
            }{" "}
            {progress.totalSessions ===
            1
              ? "sesión"
              : "sesiones"}
          </span>

          <span>
            Mejor racha:{" "}
            {progress.bestStreak}
          </span>
        </div>
      )}
    </motion.section>
  );
}

function ProgressItem({
  icon,
  value,
  label,
  highlight = false,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`min-w-0 rounded-2xl border-2 p-3 sm:p-4 ${
        highlight
          ? "border-orange-200 bg-orange-50"
          : "border-slate-100 bg-slate-50"
      }`}
    >
      <div
        className={
          highlight
            ? "text-orange-500"
            : "text-slate-400"
        }
      >
        {icon}
      </div>

      <div className="mt-4 text-xl font-black text-slate-950 sm:text-2xl">
        {value}
      </div>

      <div className="mt-1 truncate text-[11px] font-bold text-slate-500 sm:text-xs">
        {label}
      </div>
    </div>
  );
}
