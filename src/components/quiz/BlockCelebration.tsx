"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check, Star } from "lucide-react";

type BlockCelebrationProps = {
  open: boolean;
  completed: number;
  total: number;
  correctCount?: number;
  onContinue: () => void;
};

const confetti = [
  { x: -130, y: -110, rotate: 45, color: "bg-blue-500" },
  { x: -85, y: -155, rotate: 120, color: "bg-amber-400" },
  { x: -30, y: -125, rotate: 210, color: "bg-violet-500" },
  { x: 30, y: -160, rotate: 80, color: "bg-emerald-400" },
  { x: 80, y: -130, rotate: 160, color: "bg-rose-400" },
  { x: 135, y: -100, rotate: 260, color: "bg-blue-500" },
  { x: -148, y: -40, rotate: 300, color: "bg-amber-400" },
  { x: 148, y: -30, rotate: 100, color: "bg-violet-500" },
  { x: -110, y: 50, rotate: 190, color: "bg-emerald-400" },
  { x: 115, y: 55, rotate: 20, color: "bg-rose-400" },
  { x: -60, y: 90, rotate: 240, color: "bg-blue-500" },
  { x: 65, y: 92, rotate: 330, color: "bg-amber-400" },
];

function starsFromAccuracy(correct: number, total: number): 0 | 1 | 2 | 3 {
  if (total === 0) return 0;
  const pct = correct / total;
  if (pct >= 0.9) return 3;
  if (pct >= 0.7) return 2;
  if (pct >= 0.5) return 1;
  return 0;
}

export function BlockCelebration({
  open,
  completed,
  total,
  correctCount,
  onContinue,
}: BlockCelebrationProps) {
  const finished = completed >= total;
  const progress = Math.round((completed / total) * 100);

  const hasScore = finished && correctCount !== undefined;
  const stars = hasScore ? starsFromAccuracy(correctCount!, total) : 0;
  const accuracy = hasScore ? Math.round((correctCount! / total) * 100) : null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[#f8fafc] px-5"
        >
          <div className="relative w-full max-w-md text-center">

            {/* ── FINISHED STATE ─────────────────────────────────── */}
            {finished ? (
              <>
                {/* Confetti */}
                <div className="pointer-events-none absolute left-1/2 top-[100px]">
                  {confetti.map((p, i) => (
                    <motion.span
                      key={i}
                      initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                      animate={{
                        x: p.x,
                        y: p.y,
                        scale: [0, 1.4, 1],
                        opacity: [0, 1, 0],
                        rotate: p.rotate,
                      }}
                      transition={{ duration: 1.2, delay: i * 0.03, ease: "easeOut" }}
                      className={`absolute h-3 w-3 rounded-sm ${p.color}`}
                    />
                  ))}
                </div>

                {/* Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 14 }}
                  className="mx-auto flex h-24 w-24 items-center justify-center rounded-[30px] border-2 border-blue-700 bg-blue-600 text-white shadow-[0_6px_0_#1e40af]"
                >
                  <Check size={44} strokeWidth={3} />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.16 }}
                >
                  <p className="mt-7 text-xs font-black uppercase tracking-[0.16em] text-blue-600">
                    Sesión completada
                  </p>

                  <h2 className="mt-2 text-4xl font-black tracking-[-0.045em] text-slate-950">
                    ¡Lo hiciste!
                  </h2>

                  {/* Stars */}
                  {hasScore && (
                    <div className="mt-4 flex justify-center gap-2">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            delay: 0.3 + i * 0.1,
                            type: "spring",
                            stiffness: 300,
                            damping: 15,
                          }}
                        >
                          <Star
                            size={32}
                            className={
                              i < stars
                                ? "fill-amber-400 text-amber-400"
                                : "fill-slate-200 text-slate-200"
                            }
                          />
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Score summary */}
                  {hasScore && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.55 }}
                      className="mx-auto mt-5 flex w-fit items-center gap-6 rounded-2xl border-2 border-slate-100 bg-white px-7 py-4"
                    >
                      <div className="text-center">
                        <p className="text-3xl font-black text-slate-950">
                          {correctCount}
                          <span className="text-lg text-slate-400">/{total}</span>
                        </p>
                        <p className="mt-0.5 text-[11px] font-bold text-slate-400">correctas</p>
                      </div>

                      <div className="h-10 w-px bg-slate-100" />

                      <div className="text-center">
                        <p className="text-3xl font-black text-slate-950">
                          {accuracy}%
                        </p>
                        <p className="mt-0.5 text-[11px] font-bold text-slate-400">precisión</p>
                      </div>
                    </motion.div>
                  )}

                  {!hasScore && (
                    <p className="mx-auto mt-3 max-w-xs text-sm font-semibold leading-6 text-slate-500">
                      Respondiste todas las preguntas. Ahora ve cómo te fue.
                    </p>
                  )}
                </motion.div>

                {/* CTA */}
                <motion.button
                  type="button"
                  onClick={onContinue}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: hasScore ? 0.7 : 0.35 }}
                  whileTap={{ y: 3, scale: 0.99 }}
                  className="mt-7 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 border-blue-800 bg-blue-600 px-5 text-sm font-black text-white shadow-[0_4px_0_#1e40af] transition hover:bg-blue-700"
                >
                  Ver mis resultados
                  <ArrowRight size={18} />
                </motion.button>
              </>
            ) : (
              /* ── MID-BLOCK STATE ──────────────────────────────── */
              <>
                <div className="pointer-events-none absolute left-1/2 top-[120px]">
                  {confetti.slice(0, 8).map((p, i) => (
                    <motion.span
                      key={i}
                      initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                      animate={{
                        x: p.x * 0.7,
                        y: p.y * 0.7,
                        scale: [0, 1.2, 1],
                        opacity: [0, 1, 0],
                        rotate: p.rotate,
                      }}
                      transition={{ duration: 1, delay: i * 0.03, ease: "easeOut" }}
                      className={`absolute h-2.5 w-2.5 rounded-sm ${p.color}`}
                    />
                  ))}
                </div>

                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 190, damping: 13 }}
                  className="mx-auto flex h-24 w-24 items-center justify-center rounded-[30px] border-2 border-blue-700 bg-blue-600 text-white shadow-[0_6px_0_#1e40af]"
                >
                  <Check size={42} strokeWidth={3} />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 }}
                >
                  <p className="mt-8 text-xs font-black uppercase tracking-[0.16em] text-blue-600">
                    Bloque completado
                  </p>

                  <h2 className="mt-2 text-4xl font-black tracking-[-0.045em] text-slate-950">
                    ¡Buen ritmo!
                  </h2>

                  <p className="mx-auto mt-3 max-w-xs text-sm font-semibold leading-6 text-slate-500">
                    Completaste {completed} de {total} preguntas. Las respuestas aparecerán al final.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.28 }}
                  className="mt-8 rounded-[24px] border-2 border-slate-200 bg-white p-5"
                >
                  <div className="flex items-end justify-between">
                    <span className="text-sm font-black text-slate-700">
                      {completed} / {total}
                    </span>
                    <span className="text-xs font-bold text-slate-400">{progress}%</span>
                  </div>

                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                      className="h-full rounded-full bg-blue-600"
                    />
                  </div>
                </motion.div>

                <motion.button
                  type="button"
                  onClick={onContinue}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.38 }}
                  whileTap={{ y: 3, scale: 0.99 }}
                  className="mt-6 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 border-blue-800 bg-blue-600 px-5 text-sm font-black text-white shadow-[0_4px_0_#1e40af]"
                >
                  Seguir practicando
                  <ArrowRight size={18} />
                </motion.button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
