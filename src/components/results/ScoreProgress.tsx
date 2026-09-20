"use client";

import { motion } from "motion/react";

type ScoreProgressProps = {
  percentage: number;
};

export function ScoreProgress({
  percentage,
}: ScoreProgressProps) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-slate-400">
            Rendimiento
          </p>

          <p className="mt-1 text-lg font-black text-slate-950">
            Tu resultado
          </p>
        </div>

        <span className="text-3xl font-black tracking-tight text-slate-950">
          {percentage}%
        </span>
      </div>

      <div className="mt-5 h-4 overflow-hidden rounded-full bg-slate-100">
        <motion.div
          initial={{ width: 0 }}
          animate={{
            width: `${percentage}%`,
          }}
          transition={{
            duration: 0.9,
            delay: 0.25,
            ease: "easeOut",
          }}
          className="h-full rounded-full bg-blue-600"
        />
      </div>
    </section>
  );
}
