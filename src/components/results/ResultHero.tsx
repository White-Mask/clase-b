"use client";

import {
  motion,
  useReducedMotion,
} from "motion/react";

import {
  Check,
  RotateCcw,
  Sparkles,
  Star,
  X,
} from "lucide-react";

import type { QuizResultSummary } from "@/lib/results";
import { AnimatedNumber } from "@/components/results/AnimatedNumber";

type ResultHeroProps = {
  result: QuizResultSummary;
};

/* ─────────────────────────────────────────────
   CONFETTI
───────────────────────────────────────────── */

const CONFETTI = [
  { x: -190, y: 120, r: 160, delay: 0.00 },
  { x: -155, y: 175, r: 260, delay: 0.04 },
  { x: -125, y: 105, r: 90, delay: 0.08 },
  { x: -95, y: 190, r: 320, delay: 0.02 },
  { x: -60, y: 135, r: 180, delay: 0.12 },
  { x: -25, y: 205, r: 400, delay: 0.06 },

  { x: 25, y: 185, r: 140, delay: 0.10 },
  { x: 55, y: 115, r: 300, delay: 0.03 },
  { x: 90, y: 200, r: 210, delay: 0.09 },
  { x: 125, y: 125, r: 370, delay: 0.01 },
  { x: 155, y: 180, r: 120, delay: 0.11 },
  { x: 190, y: 110, r: 280, delay: 0.05 },

  { x: -170, y: 240, r: 360, delay: 0.08 },
  { x: -110, y: 255, r: 190, delay: 0.14 },
  { x: -45, y: 235, r: 290, delay: 0.03 },
  { x: 45, y: 250, r: 150, delay: 0.12 },
  { x: 110, y: 230, r: 330, delay: 0.06 },
  { x: 170, y: 245, r: 200, delay: 0.10 },
] as const;

const COLORS = [
  "bg-blue-500",
  "bg-amber-400",
  "bg-violet-500",
  "bg-rose-400",
  "bg-emerald-400",
];

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */

function getStars(
  result: QuizResultSummary,
): 0 | 1 | 2 | 3 {
  const official =
    result.isFullOfficialSimulation;

  if (official) {
    // No stars for failing — regardless of score
    if (result.passed !== true) return 0;
    // Aprobado con distinción
    if (result.percentage >= 95) return 3;
    if (result.percentage >= 89) return 2;
    return 1;
  }

  // Practice / chapter / mistakes
  if (result.percentage >= 90) return 3;
  if (result.percentage >= 70) return 2;
  if (result.percentage >= 50) return 1;

  return 0;
}

function getResultLabel(
  result: QuizResultSummary,
  stars: 0 | 1 | 2 | 3,
): string {
  const official = result.isFullOfficialSimulation;

  if (official) {
    if (result.passed !== true) return "No aprobado";
    if (stars === 3) return "Excelente";
    if (stars === 2) return "Muy bien";
    return "Aprobado";
  }

  // Practice modes
  if (stars === 3) return "Dominado";
  if (stars === 2) return "Muy bien";
  if (stars === 1) return "Buen inicio";
  return "Sigue practicando";
}

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */

export function ResultHero({
  result,
}: ResultHeroProps) {
  const reduceMotion = useReducedMotion();

  const official =
    result.isFullOfficialSimulation;

  const passed =
    official &&
    result.passed === true;

  const failed =
    official &&
    result.passed === false;

  const stars = getStars(result);

  const resultLabel = getResultLabel(result, stars);

  const totalQuestions =
    result.correctQuestions +
    result.incorrectQuestions;

  /*
   * Everyone gets a small completion celebration.
   * Higher scores get a stronger one.
   */
  const celebrationLevel =
    passed || result.percentage >= 90
      ? 3
      : result.percentage >= 70
        ? 2
        : 1;

  const title = official
    ? passed
      ? "¡Aprobaste!"
      : "No aprobaste"
    : "¡Práctica completada!";

  return (
    <section
      className="
        relative
        overflow-hidden
        rounded-[32px]
        border border-slate-200
        bg-white
        px-6
        pb-8
        pt-9
        text-center
        sm:px-10
        sm:pb-10
        sm:pt-10
      "
    >
      {/* soft background glow */}

      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="
          pointer-events-none
          absolute
          left-1/2 top-0
          h-[280px] w-[420px]
          -translate-x-1/2
          rounded-full
          bg-blue-50/80
          blur-[70px]
        "
      />

      {/* CONFETTI */}

      {!reduceMotion && (passed || (!official && result.percentage >= 70)) && (
        <Confetti
          level={celebrationLevel}
        />
      )}

      {/* ICON */}

      <motion.div
        initial={
          reduceMotion
            ? { opacity: 0 }
            : {
                opacity: 0,
                y: -45,
                scale: 0.55,
                rotate: -12,
              }
        }
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          rotate: 0,
        }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 12,
          mass: 0.75,
        }}
        className="
          relative z-10
          mx-auto
          flex h-[82px] w-[82px]
          items-center justify-center
          rounded-[26px]
          border-2 border-blue-700
          bg-blue-600
          text-white
          shadow-[0_7px_0_#1e40af]
        "
      >
        <motion.div
          animate={
            reduceMotion
              ? undefined
              : {
                  rotate: [
                    0,
                    -7,
                    7,
                    -3,
                    3,
                    0,
                  ],
                }
          }
          transition={{
            delay: 0.25,
            duration: 0.55,
          }}
        >
          {passed ? (
            <Check
              size={39}
              strokeWidth={3}
            />
          ) : failed ? (
            <RotateCcw
              size={34}
              strokeWidth={2.5}
            />
          ) : (
            <Sparkles
              size={35}
              strokeWidth={2.5}
            />
          )}
        </motion.div>

        {/* shine */}

        {!reduceMotion && (
          <motion.div
            aria-hidden
            initial={{
              x: -90,
              opacity: 0,
            }}
            animate={{
              x: 90,
              opacity: [
                0,
                0.5,
                0,
              ],
            }}
            transition={{
              delay: 0.4,
              duration: 0.65,
            }}
            className="
              pointer-events-none
              absolute
              inset-y-0
              w-5
              rotate-12
              bg-white/50
              blur-sm
            "
          />
        )}
      </motion.div>

      {/* TITLE */}

      <motion.div
        initial={{
          opacity: 0,
          y: 15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: reduceMotion
            ? 0
            : 0.25,
          duration: 0.4,
        }}
        className="relative z-10"
      >
        <p
          className="
            mt-7
            text-[10px]
            font-black
            uppercase
            tracking-[0.2em]
            text-blue-600
          "
        >
          {official ? "Simulacro oficial" : "Resultado"}
        </p>

        <h1
          className="
            mt-2
            text-[36px]
            font-black
            leading-none
            tracking-[-0.05em]
            text-slate-950
            sm:text-[42px]
          "
        >
          {title}
        </h1>
      </motion.div>

      {/* SCORE */}

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.8,
          y: 10,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        transition={{
          delay: reduceMotion
            ? 0
            : 0.5,
          type: "spring",
          stiffness: 210,
          damping: 15,
        }}
        className="
          relative z-10
          mt-8
        "
      >
        <div
          className="
            flex
            items-baseline
            justify-center
          "
        >
          <span
            className="
              text-[64px]
              font-black
              leading-none
              tracking-[-0.07em]
              text-slate-950
            "
          >
            <AnimatedNumber
              value={Math.round(
                result.percentage,
              )}
            />
          </span>

          <span
            className="
              ml-1
              text-2xl
              font-black
              text-slate-950
            "
          >
            %
          </span>
        </div>

        <p
          className="
            mt-2
            text-sm
            font-bold
            text-slate-400
          "
        >
          {result.correctQuestions} de{" "}
          {totalQuestions} correctas
        </p>
      </motion.div>

      {/* CERTAINTY */}

      <motion.div
        initial={{
          opacity: 0,
          y: 12,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: reduceMotion
            ? 0
            : 0.78,
          duration: 0.35,
        }}
        className="
          relative z-10
          mt-7
        "
      >
        <p
          className="
            text-[10px]
            font-black
            uppercase
            tracking-[0.16em]
            text-slate-400
          "
        >
          {official ? "Resultado oficial" : "Desempeño"}
        </p>

        <div
          className="
            mt-2
            flex
            justify-center
            gap-2
          "
        >
          {[0, 1, 2].map(
            (index) => {
              const earned =
                index < stars;

              return (
                <motion.div
                  key={index}
                  initial={
                    reduceMotion
                      ? undefined
                      : {
                          scale: 0,
                          rotate: -25,
                          y: 8,
                        }
                  }
                  animate={{
                    scale: 1,
                    rotate: 0,
                    y: 0,
                  }}
                  transition={{
                    delay:
                      0.9 +
                      index * 0.12,
                    type: "spring",
                    stiffness: 360,
                    damping: 12,
                  }}
                >
                  <motion.div
                    animate={
                      !reduceMotion &&
                      earned
                        ? {
                            scale: [
                              1,
                              1.35,
                              0.9,
                              1,
                            ],
                          }
                        : undefined
                    }
                    transition={{
                      delay:
                        1.05 +
                        index * 0.12,
                      duration: 0.4,
                    }}
                  >
                    <Star
                      size={38}
                      strokeWidth={2.2}
                      className={
                        earned
                          ? `
                            fill-amber-400
                            text-amber-400
                            drop-shadow-[0_3px_5px_rgba(245,158,11,.3)]
                          `
                          : `
                            fill-slate-100
                            text-slate-200
                          `
                      }
                    />
                  </motion.div>
                </motion.div>
              );
            },
          )}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: reduceMotion
              ? 0
              : 1.22,
          }}
          className="
            mt-2
            text-sm
            font-bold
            text-slate-600
          "
        >
          {resultLabel}
        </motion.p>
      </motion.div>

      {/* COMPACT STATS */}

      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: reduceMotion
            ? 0
            : 1.35,
          duration: 0.35,
        }}
        className="
          relative z-10
          mx-auto mt-7
          flex max-w-[320px]
          items-center justify-center
          gap-5
          rounded-2xl
          bg-slate-50
          px-5 py-3
        "
      >
        <div
          className="
            flex items-center
            gap-2
          "
        >
          <span
            className="
              flex h-7 w-7
              items-center justify-center
              rounded-full
              bg-blue-100
              text-blue-600
            "
          >
            <Check
              size={15}
              strokeWidth={3}
            />
          </span>

          <span
            className="
              text-sm
              font-black
              text-slate-700
            "
          >
            {result.correctQuestions}
          </span>

          <span
            className="
              text-xs
              font-semibold
              text-slate-400
            "
          >
            correctas
          </span>
        </div>

        <div
          className="
            h-5 w-px
            bg-slate-200
          "
        />

        <div
          className="
            flex items-center
            gap-2
          "
        >
          <span
            className="
              flex h-7 w-7
              items-center justify-center
              rounded-full
              bg-rose-100
              text-rose-500
            "
          >
            <X
              size={15}
              strokeWidth={3}
            />
          </span>

          <span
            className="
              text-sm
              font-black
              text-slate-700
            "
          >
            {result.incorrectQuestions}
          </span>

          <span
            className="
              text-xs
              font-semibold
              text-slate-400
            "
          >
            errores
          </span>
        </div>
      </motion.div>

      {/* official result only */}

      {official && (
        <motion.div
          initial={{
            opacity: 0,
            y: 8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 1.5,
          }}
          className="
            relative z-10
            mt-5
            text-sm
            font-bold
            text-slate-500
          "
        >
          {result.score} de{" "}
          {result.maxScore} puntos

          {failed && (
            <span className="ml-1 text-rose-500">
              · Te faltaron{" "}
              {Math.max(
                0,
                33 - result.score,
              )}{" "}
              para aprobar
            </span>
          )}
        </motion.div>
      )}
    </section>
  );
}

/* ─────────────────────────────────────────────
   CONFETTI COMPONENT
───────────────────────────────────────────── */

function Confetti({
  level,
}: {
  level: 1 | 2 | 3;
}) {
  const visibleCount =
    level === 3
      ? CONFETTI.length
      : level === 2
        ? 14
        : 10;

  return (
    <div
      aria-hidden
      className="
        pointer-events-none
        absolute
        left-1/2
        top-[80px]
        z-20
      "
    >
      {CONFETTI.slice(
        0,
        visibleCount,
      ).map(
        (
          particle,
          index,
        ) => (
          <motion.span
            key={index}
            initial={{
              x: 0,
              y: 0,
              opacity: 0,
              scale: 0,
              rotate: 0,
            }}
            animate={{
              x: particle.x,
              y: particle.y,
              opacity: [
                0,
                1,
                1,
                0,
              ],
              scale: [
                0,
                1.2,
                1,
                0.85,
              ],
              rotate:
                particle.r,
            }}
            transition={{
              delay:
                0.12 +
                particle.delay,
              duration:
                level === 3
                  ? 1.7
                  : 1.45,
              ease: [
                0.16,
                1,
                0.3,
                1,
              ],
            }}
            className={`
              absolute
              ${
                index % 3 === 0
                  ? "h-2.5 w-2.5 rounded-full"
                  : index % 3 === 1
                    ? "h-3 w-1.5 rounded-[2px]"
                    : "h-2 w-3 rounded-[2px]"
              }
              ${
                COLORS[
                  index %
                    COLORS.length
                ]
              }
            `}
          />
        ),
      )}

      {/* second burst only for excellent result */}

      {level === 3 &&
        CONFETTI.slice(0, 8).map(
          (
            particle,
            index,
          ) => (
            <motion.span
              key={`burst-${index}`}
              initial={{
                x: 0,
                y: 0,
                opacity: 0,
                scale: 0,
              }}
              animate={{
                x:
                  particle.x *
                  0.8,
                y:
                  particle.y *
                  0.8,
                opacity: [
                  0,
                  1,
                  0,
                ],
                scale: [
                  0,
                  1,
                  0.8,
                ],
                rotate:
                  particle.r +
                  180,
              }}
              transition={{
                delay:
                  0.7 +
                  particle.delay,
                duration: 1.25,
                ease: "easeOut",
              }}
              className={`
                absolute
                h-2 w-2
                rounded-full
                ${
                  COLORS[
                    (index + 2) %
                      COLORS.length
                  ]
                }
              `}
            />
          ),
        )}
    </div>
  );
}