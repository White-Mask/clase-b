"use client";

import { motion } from "motion/react";
import { Check, Flame } from "lucide-react";

import { useProgress } from "@/hooks/useProgress";
import { getWeekActivity } from "@/lib/progress";

const DAYS = [
  "L",
  "M",
  "M",
  "J",
  "V",
  "S",
  "D",
];

export function WeeklyActivity() {
  const progress = useProgress();
  const week = getWeekActivity(progress);

  if (progress.totalSessions === 0) {
    return null;
  }

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.35,
      }}
      className="rounded-[26px] border-2 border-slate-200 bg-white px-5 py-5 shadow-sm sm:px-6"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <motion.div
            initial={{
              scale: 0.8,
              rotate: -10,
            }}
            animate={{
              scale: 1,
              rotate: 0,
            }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 17,
            }}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-500"
          >
            <Flame
              size={21}
              strokeWidth={2.7}
            />
          </motion.div>

          <div className="min-w-0">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black tracking-[-0.04em] text-slate-950">
                {progress.currentStreak}
              </span>

              <span className="text-sm font-black text-slate-700">
                {progress.currentStreak === 1
                  ? "día de racha"
                  : "días de racha"}
              </span>
            </div>

            <p className="mt-0.5 text-xs font-bold text-slate-400">
              Sigue practicando cada día
            </p>
          </div>
        </div>

        {progress.bestStreak > 1 && (
          <div className="hidden shrink-0 rounded-xl bg-slate-50 px-3 py-2 text-right sm:block">
            <p className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-400">
              Mejor
            </p>

            <p className="mt-0.5 text-xs font-black text-slate-700">
              {progress.bestStreak} días
            </p>
          </div>
        )}
      </div>

      <div className="mt-5 border-t-2 border-slate-100 pt-4">
        <div className="grid grid-cols-7 gap-2">
          {week.map((day, index) => (
            <div
              key={day.date}
              className="flex min-w-0 flex-col items-center"
            >
              <span
                className={`text-[10px] font-black ${
                  day.isToday
                    ? "text-blue-600"
                    : "text-slate-400"
                }`}
              >
                {DAYS[index]}
              </span>

              <motion.div
                initial={
                  day.active
                    ? {
                        scale: 0.7,
                      }
                    : false
                }
                animate={{
                  scale: 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 240,
                  damping: 17,
                }}
                className={`relative mt-2 flex h-8 w-8 items-center justify-center rounded-full border-2 sm:h-9 sm:w-9 ${
                  day.active
                    ? "border-blue-700 bg-blue-600 text-white shadow-[0_2px_0_#1d4ed8]"
                    : day.isToday
                      ? "border-blue-300 bg-blue-50 text-blue-500"
                      : "border-slate-200 bg-slate-50 text-slate-300"
                }`}
              >
                {day.active ? (
                  <Check
                    size={14}
                    strokeWidth={4}
                  />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                )}
              </motion.div>

              <span
                className={`mt-1 text-[9px] font-black ${
                  day.isToday
                    ? "text-blue-500"
                    : "invisible"
                }`}
              >
                hoy
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
