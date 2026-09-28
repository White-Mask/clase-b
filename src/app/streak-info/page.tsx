"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock3,
  ExternalLink,
  Flame,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";

import { useProgress } from "@/hooks/useProgress";

/* ─────────────────────────────────────────────────────────────
 * Streak tiers
 *
 * IMPORTANTE:
 * Los niveles representan CONSTANCIA, no preparación académica.
 * Llegar a Élite no significa estar preparado para aprobar.
 * ───────────────────────────────────────────────────────────── */

const STREAK_TIERS = [
  {
    min: 1,
    max: 3,
    days: "1–3 días",
    label: "Comenzando",
    sub: "Tu racha está arrancando",
    flame: "text-amber-500",
    progressBg: "bg-amber-500",
    softBg: "bg-amber-50",
    activeBg: "bg-amber-50",
    border: "border-amber-300",
    text: "text-amber-700",
  },
  {
    min: 4,
    max: 6,
    days: "4–6 días",
    label: "Constante",
    sub: "Ya estás creando el hábito",
    flame: "text-orange-500",
    progressBg: "bg-orange-500",
    softBg: "bg-orange-50",
    activeBg: "bg-orange-50",
    border: "border-orange-300",
    text: "text-orange-700",
  },
  {
    min: 7,
    max: 9,
    days: "7–9 días",
    label: "En racha",
    sub: "Una semana de constancia",
    flame: "text-red-500",
    progressBg: "bg-red-500",
    softBg: "bg-red-50",
    activeBg: "bg-red-50",
    border: "border-red-300",
    text: "text-red-700",
  },
  {
    min: 10,
    max: 13,
    days: "10–13 días",
    label: "Imparable",
    sub: "Sigues sumando días",
    flame: "text-rose-500",
    progressBg: "bg-rose-500",
    softBg: "bg-rose-50",
    activeBg: "bg-rose-50",
    border: "border-rose-300",
    text: "text-rose-700",
  },
  {
    min: 14,
    max: 20,
    days: "14–20 días",
    label: "Legendario",
    sub: "Dos semanas de constancia",
    flame: "text-violet-500",
    progressBg: "bg-violet-500",
    softBg: "bg-violet-50",
    activeBg: "bg-violet-50",
    border: "border-violet-300",
    text: "text-violet-700",
  },
  {
    min: 21,
    max: Infinity,
    days: "21+ días",
    label: "Élite",
    sub: "Tres semanas y contando",
    flame: "text-blue-500",
    progressBg: "bg-blue-500",
    softBg: "bg-blue-50",
    activeBg: "bg-blue-50",
    border: "border-blue-300",
    text: "text-blue-700",
  },
] as const;

type Tier = (typeof STREAK_TIERS)[number];

/* ─────────────────────────────────────────────────────────────
 * Helpers
 * ───────────────────────────────────────────────────────────── */

function getCurrentTier(streak: number): Tier | null {
  if (streak <= 0) return null;

  return (
    STREAK_TIERS.find(
      (tier) => streak >= tier.min && streak <= tier.max
    ) ?? STREAK_TIERS[STREAK_TIERS.length - 1]
  );
}

function getProgressInfo(streak: number, tier: Tier | null) {
  if (!tier) return null;

  const currentIndex = STREAK_TIERS.indexOf(tier);
  const isElite = tier.max === Infinity;

  if (isElite) {
    return {
      currentIndex,
      isElite: true as const,
      nextTier: null,
      daysToNext: null,
      progress: 100,
    };
  }

  const nextTier = STREAK_TIERS[currentIndex + 1] ?? null;

  if (!nextTier) {
    return {
      currentIndex,
      isElite: true as const,
      nextTier: null,
      daysToNext: null,
      progress: 100,
    };
  }

  /*
   * El progreso representa el camino desde que se entra al nivel
   * hasta DESBLOQUEAR el siguiente.
   *
   * Ejemplo Comenzando:
   * Día 1 -> 0 %
   * Día 2 -> 33 %
   * Día 3 -> 67 %
   * Día 4 -> entra en Constante
   *
   * Esto evita mostrar 100 % en el día 3 y a la vez decir
   * "te falta 1 día".
   */
  const distanceToNextTier = nextTier.min - tier.min;
  const progressInsideLevel = streak - tier.min;

  const progress = Math.max(
    0,
    Math.min(
      100,
      (progressInsideLevel / distanceToNextTier) * 100
    )
  );

  return {
    currentIndex,
    isElite: false as const,
    nextTier,
    daysToNext: nextTier.min - streak,
    progress,
  };
}

/* ─────────────────────────────────────────────────────────────
 * Page
 * ───────────────────────────────────────────────────────────── */

export default function StreakInfoPage() {
  const router = useRouter();

  const { currentStreak: streak } = useProgress();

  const currentTier = getCurrentTier(streak);
  const info = getProgressInfo(streak, currentTier);

  const currentTierIndex = currentTier
    ? STREAK_TIERS.indexOf(currentTier)
    : -1;

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <div className="mx-auto w-full max-w-[620px] px-5 pb-16 pt-4 sm:px-8 sm:pt-6">

        {/* ───────────────── Back ───────────────── */}

        <button
          type="button"
          onClick={() => router.back()}
          className="
            -ml-2
            flex h-11 w-11
            items-center justify-center
            rounded-full
            text-slate-400
            transition
            hover:bg-white
            hover:text-slate-700
            active:scale-95
          "
          aria-label="Volver"
        >
          <ArrowLeft size={21} strokeWidth={2} />
        </button>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="pt-5"
        >
          {/* ───────────────── Header ───────────────── */}

          <header>
            <div className="flex items-center gap-3.5">
              <div
                className="
                  flex h-12 w-12 shrink-0
                  items-center justify-center
                  rounded-2xl
                  bg-orange-50
                "
              >
                <Flame
                  size={25}
                  strokeWidth={2.3}
                  className={
                    currentTier
                      ? currentTier.flame
                      : "text-orange-400"
                  }
                  aria-hidden
                />
              </div>

              <div>
                <p
                  className="
                    text-[11px]
                    font-extrabold
                    uppercase
                    tracking-[0.16em]
                    text-orange-500
                  "
                >
                  Racha diaria
                </p>

                <h1
                  className="
                    mt-0.5
                    text-[26px]
                    font-black
                    leading-tight
                    tracking-[-0.035em]
                    text-slate-950
                  "
                >
                  Colores de la llama
                </h1>
              </div>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Tu llama evoluciona mientras mantienes tu racha.
            </p>
          </header>

          {/* ───────────────── Current streak ───────────────── */}

          <section
            className="mt-6"
            aria-labelledby="current-flame-title"
          >
            {!currentTier || !info ? (
              /*
               * SIN RACHA
               */
              <div
                className="
                  rounded-[22px]
                  border border-slate-200
                  bg-white
                  p-5
                "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex h-11 w-11
                      shrink-0
                      items-center justify-center
                      rounded-full
                      bg-slate-100
                    "
                  >
                    <Flame
                      size={21}
                      className="text-slate-300"
                      strokeWidth={2.3}
                      aria-hidden
                    />
                  </div>

                  <div>
                    <h2
                      id="current-flame-title"
                      className="text-sm font-black text-slate-900"
                    >
                      Empieza tu racha
                    </h2>

                    <p className="mt-0.5 text-xs leading-5 text-slate-500">
                      Practica hoy para encender tu primera llama.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /*
               * RACHA ACTIVA
               */
              <motion.div
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`
                  overflow-hidden
                  rounded-[22px]
                  border
                  ${currentTier.border}
                  ${currentTier.activeBg}
                `}
              >
                <div className="p-5">

                  {/* Current tier */}

                  <div className="flex items-center gap-3">
                    <div
                      className="
                        flex h-11 w-11
                        shrink-0
                        items-center justify-center
                        rounded-full
                        bg-white/70
                      "
                    >
                      <Flame
                        size={22}
                        strokeWidth={2.4}
                        className={currentTier.flame}
                        aria-hidden
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p
                        className="
                          text-[10px]
                          font-extrabold
                          uppercase
                          tracking-[0.15em]
                          text-slate-400
                        "
                      >
                        Tu llama actual
                      </p>

                      <div
                        className="
                          mt-1
                          flex flex-wrap
                          items-baseline
                          gap-x-2
                          gap-y-0.5
                        "
                      >
                        <h2
                          id="current-flame-title"
                          className={`
                            text-lg
                            font-black
                            ${currentTier.text}
                          `}
                        >
                          {currentTier.label}
                        </h2>

                        <span className="text-xs font-bold text-slate-500">
                          Día {streak}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Elite */}

                  {info.isElite ? (
                    <div
                      className="
                        mt-4
                        flex items-center gap-2
                        rounded-xl
                        bg-white/60
                        px-3.5 py-3
                      "
                    >
                      <Sparkles
                        size={16}
                        className={currentTier.flame}
                        aria-hidden
                      />

                      <p
                        className={`
                          text-xs
                          font-bold
                          ${currentTier.text}
                        `}
                      >
                        {streak} días de constancia y contando
                      </p>
                    </div>
                  ) : (
                    /*
                     * PROGRESO HACIA EL SIGUIENTE NIVEL
                     */
                    <div className="mt-5">
                      <div
                        className="
                          h-2
                          overflow-hidden
                          rounded-full
                          bg-white/80
                        "
                        role="progressbar"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={Math.round(info.progress)}
                        aria-label={`Progreso hacia ${info.nextTier?.label}`}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${info.progress}%`,
                          }}
                          transition={{
                            duration: 0.55,
                            ease: "easeOut",
                          }}
                          className={`
                            h-full
                            rounded-full
                            ${currentTier.progressBg}
                          `}
                        />
                      </div>

                      <div
                        className="
                          mt-2.5
                          flex flex-wrap
                          items-center
                          justify-between
                          gap-x-4 gap-y-1
                        "
                      >
                        <p
                          className={`
                            text-xs
                            font-extrabold
                            ${currentTier.text}
                          `}
                        >
                          {info.daysToNext === 1
                            ? "1 día más"
                            : `${info.daysToNext} días más`}
                        </p>

                        <p className="text-xs font-medium text-slate-500">
                          para desbloquear{" "}
                          <strong className="font-extrabold text-slate-700">
                            {info.nextTier?.label}
                          </strong>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </section>

          {/* ───────────────── Journey ───────────────── */}

          <section
            className="mt-8"
            aria-labelledby="levels-title"
          >
            <div>
              <p
                className="
                  text-[10px]
                  font-extrabold
                  uppercase
                  tracking-[0.15em]
                  text-slate-400
                "
              >
                Tu recorrido
              </p>

              <div
                className="
                  mt-1
                  flex items-baseline
                  justify-between
                  gap-4
                "
              >
                <h2
                  id="levels-title"
                  className="text-base font-black text-slate-900"
                >
                  Niveles de la llama
                </h2>

                {currentTier && (
                  <p className="text-[11px] font-semibold text-slate-400">
                    Nivel {currentTierIndex + 1} de{" "}
                    {STREAK_TIERS.length}
                  </p>
                )}
              </div>
            </div>

            <div
              className="relative mt-3"
              role="list"
            >
              {/* vertical timeline */}

              <div
                aria-hidden
                className="
                  pointer-events-none
                  absolute
                  bottom-8
                  left-[19px]
                  top-8
                  w-px
                  bg-slate-200
                "
              />

              <div className="space-y-1">
                {STREAK_TIERS.map((tier, index) => {
                  const isActive =
                    index === currentTierIndex;

                  const isNext =
                    currentTierIndex >= 0 &&
                    index === currentTierIndex + 1;

                  const isPast =
                    currentTierIndex > index;

                  return (
                    <motion.div
                      key={tier.label}
                      initial={{
                        opacity: 0,
                        x: -5,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        delay: 0.08 + index * 0.035,
                      }}
                      role="listitem"
                      aria-label={`${tier.label}, ${tier.days}${
                        isActive
                          ? ", nivel actual"
                          : isNext
                          ? ", siguiente nivel"
                          : ""
                      }`}
                      className="
                        relative
                        flex
                        min-h-[62px]
                        items-center
                        gap-3
                      "
                    >
                      {/* Flame */}

                      <div
                        className={`
                          relative z-10
                          flex h-10 w-10
                          shrink-0
                          items-center justify-center
                          rounded-full
                          ${
                            isActive
                              ? tier.softBg
                              : "bg-[#f8fafc]"
                          }
                        `}
                      >
                        <Flame
                          size={20}
                          strokeWidth={2.35}
                          className={tier.flame}
                          aria-hidden
                        />
                      </div>

                      {/* Content */}

                      <div
                        className={`
                          flex
                          min-w-0
                          flex-1
                          items-center
                          justify-between
                          gap-3
                          rounded-2xl
                          px-3.5
                          py-2.5
                          ${
                            isActive
                              ? `${tier.activeBg} border ${tier.border}`
                              : isNext
                              ? "border border-slate-200 bg-white"
                              : "border border-transparent"
                          }
                        `}
                      >
                        <div className="min-w-0">
                          <div
                            className="
                              flex flex-wrap
                              items-baseline
                              gap-x-2
                              gap-y-0
                            "
                          >
                            <p
                              className={`
                                text-sm
                                font-extrabold
                                ${
                                  isActive
                                    ? tier.text
                                    : "text-slate-700"
                                }
                              `}
                            >
                              {tier.label}
                            </p>

                            <span
                              className="
                                text-[11px]
                                font-bold
                                text-slate-400
                              "
                            >
                              {tier.days}
                            </span>
                          </div>

                          <p
                            className={`
                              mt-0.5
                              text-[12px]
                              ${
                                isActive || isNext
                                  ? "text-slate-500"
                                  : "text-slate-400"
                              }
                            `}
                          >
                            {tier.sub}
                          </p>
                        </div>

                        {/* We intentionally don't repeat "Actual".
                            The upper card already establishes it. */}

                        {isNext && (
                          <span
                            className="
                              shrink-0
                              rounded-full
                              bg-slate-100
                              px-2.5 py-1
                              text-[9px]
                              font-extrabold
                              uppercase
                              tracking-[0.06em]
                              text-slate-500
                            "
                          >
                            Siguiente
                          </span>
                        )}

                        {/* Invisible semantic helper.
                            Keeps completed levels distinguishable
                            without replacing their flame/color. */}

                        {isPast && (
                          <span className="sr-only">
                            Nivel anterior
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ───────────────── Study estimate ───────────────── */}

          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="
              mt-9
              overflow-hidden
              rounded-[22px]
              border border-slate-200
              bg-white
            "
            aria-labelledby="study-estimate-title"
          >
            <div className="p-5">

              {/* Header */}

              <div className="flex items-start gap-3">
                <div
                  className="
                    flex h-10 w-10
                    shrink-0
                    items-center justify-center
                    rounded-xl
                    bg-blue-50
                    text-blue-500
                  "
                >
                  <Clock3
                    size={19}
                    strokeWidth={2.3}
                    aria-hidden
                  />
                </div>

                <div>
                  <h2
                    id="study-estimate-title"
                    className="text-sm font-black text-slate-900"
                  >
                    Tiempo estimado de preparación
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Una referencia para organizar tu estudio.
                  </p>
                </div>
              </div>

              {/* Main number */}

              <div
                className="
                  mt-5
                  rounded-2xl
                  bg-blue-50
                  px-5 py-5
                  text-center
                "
              >
                <p
                  className="
                    text-[10px]
                    font-extrabold
                    uppercase
                    tracking-[0.14em]
                    text-blue-500
                  "
                >
                  Preparación estimada
                </p>

                <p
                  className="
                    mt-1
                    text-[30px]
                    font-black
                    tracking-[-0.04em]
                    text-blue-700
                  "
                >
                  ≈ 6 semanas
                </p>

                <p className="mt-1 text-xs font-semibold text-slate-500">
                  con unas 5 horas de estudio por semana
                </p>
              </div>

              {/* Disclaimer */}

              <p className="mt-4 text-xs leading-5 text-slate-500">
                Es una referencia. El tiempo puede variar según tus
                conocimientos previos y tu ritmo de estudio.
              </p>

              {/* Source */}

              <div
                className="
                  mt-4
                  border-t border-slate-100
                  pt-3
                "
              >
              </div>
            </div>
          </motion.section>
        </motion.div>
      </div>
    </main>
  );
}