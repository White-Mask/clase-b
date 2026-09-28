"use client";

import { Clock } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

export function HomeHero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className="pb-7 pt-10"
    >
      <p className="text-sm font-extrabold text-blue-600">
        Tu entrenamiento
      </p>

      <h1 className="mt-2 text-[34px] font-black leading-[1.05] tracking-[-0.045em] text-slate-950 sm:text-[42px]">
        ¿Practicamos?
      </h1>

      <p className="mt-3 max-w-lg text-sm font-medium leading-6 text-slate-500">
        Prepárate para el examen teórico Clase B a tu ritmo.
      </p>

      <Link
        href="/streak-info"
        className="mt-4 inline-flex items-center gap-2 rounded-2xl border-2 border-slate-100 bg-white px-3.5 py-2 transition hover:border-slate-200 hover:bg-slate-50"
      >
        <Clock size={14} className="shrink-0 text-slate-400" strokeWidth={2.5} />
        <span className="text-xs font-bold text-slate-500">
          Tiempo promedio para aprobar:{" "}
          <span className="font-black text-slate-800">2–3 semanas</span>
        </span>
      </Link>
    </motion.section>
  );
}
