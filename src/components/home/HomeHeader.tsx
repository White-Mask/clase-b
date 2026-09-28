"use client";

import { motion } from "motion/react";
import { CarFront, Flame } from "lucide-react";
import Link from "next/link";

import { useProgress } from "@/hooks/useProgress";

function streakStyle(streak: number): { container: string; flame: string } {
  if (streak === 0)  return { container: "border-slate-200 bg-white text-slate-400",       flame: "text-slate-300" };
  if (streak < 4)    return { container: "border-amber-200 bg-amber-50 text-amber-600",    flame: "text-amber-400" };
  if (streak < 7)    return { container: "border-orange-200 bg-orange-50 text-orange-600", flame: "text-orange-500" };
  if (streak < 10)   return { container: "border-red-200 bg-red-50 text-red-600",          flame: "text-red-500" };
  if (streak < 14)   return { container: "border-rose-300 bg-rose-50 text-rose-700",       flame: "text-rose-600" };
  if (streak < 21)   return { container: "border-violet-200 bg-violet-50 text-violet-600", flame: "text-violet-500" };
  return              { container: "border-blue-200 bg-blue-50 text-blue-600",             flame: "text-blue-500" };
}

export function HomeHeader() {
  const progress = useProgress();
  const streak = progress.currentStreak;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-[#f8fafc]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5 sm:h-[78px] sm:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <motion.div
            whileTap={{ scale: 0.94 }}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-slate-950 text-white shadow-sm sm:h-12 sm:w-12"
          >
            <CarFront
              size={21}
              strokeWidth={2.3}
            />
          </motion.div>

          <div className="min-w-0">
            <p className="truncate text-[17px] font-black tracking-[-0.025em] text-slate-950 sm:text-lg">
              Clase B
            </p>

            <p className="mt-0.5 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
              Chile
            </p>
          </div>
        </div>

        <Link href="/streak-info" aria-label="Ver info de racha">
          <motion.div
            key={streak}
            initial={{ scale: 0.92 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
            title={`${streak} ${streak === 1 ? "día" : "días"} de racha`}
            className={`flex h-10 min-w-[64px] items-center justify-center gap-2 rounded-[14px] border-2 px-3 transition hover:brightness-95 sm:h-11 ${streakStyle(streak).container}`}
          >
            <Flame
              size={19}
              strokeWidth={2.7}
              className={streakStyle(streak).flame}
            />

            <span className="text-sm font-black tabular-nums">
              {streak}
            </span>
          </motion.div>
        </Link>
      </div>
    </header>
  );
}
