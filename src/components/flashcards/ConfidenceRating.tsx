"use client";

import { motion } from "motion/react";

type ConfidenceRatingProps = {
  onRate: (confidence: 1 | 2 | 3) => void;
};

const options = [
  {
    confidence: 1 as const,
    label: "No la sabía",
    emoji: "✗",
    bg: "bg-rose-50 border-rose-200 text-rose-700",
    active: "bg-rose-500 border-rose-700 text-white shadow-[0_4px_0_#be123c]",
  },
  {
    confidence: 2 as const,
    label: "Dudé",
    emoji: "~",
    bg: "bg-amber-50 border-amber-200 text-amber-700",
    active: "bg-amber-500 border-amber-700 text-white shadow-[0_4px_0_#b45309]",
  },
  {
    confidence: 3 as const,
    label: "La sabía",
    emoji: "✓",
    bg: "bg-emerald-50 border-emerald-200 text-emerald-700",
    active: "bg-emerald-500 border-emerald-700 text-white shadow-[0_4px_0_#065f46]",
  },
];

export function ConfidenceRating({ onRate }: ConfidenceRatingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6"
    >
      <p className="mb-3 text-center text-xs font-black uppercase tracking-[0.14em] text-slate-400">
        ¿Cuánto lo sabías?
      </p>

      <div className="grid grid-cols-3 gap-2">
        {options.map((opt) => (
          <motion.button
            key={opt.confidence}
            type="button"
            onClick={() => onRate(opt.confidence)}
            whileTap={{ y: 3, scale: 0.98 }}
            className={`flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl border-2 px-2 py-3 text-center transition ${opt.active} hover:brightness-105`}
          >
            <span className="text-lg font-black">{opt.emoji}</span>
            <span className="text-[11px] font-black leading-tight">{opt.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
