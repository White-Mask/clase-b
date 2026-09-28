"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Brain,
  CheckCircle2,
  CloudRain,
  Gauge,
  Hash,
  Leaf,
  RotateCcw,
  ShieldAlert,
  Star,
  TrafficCone,
  Users,
} from "lucide-react";
import { motion } from "motion/react";

import { chapters } from "@/data/chapters";
import {
  getChapterBatch,
  getQuestionsByChapter,
  CHAPTER_BATCH_SIZE,
} from "@/lib/questions";
import { shuffleQuestionOptions } from "@/lib/quiz";
import { startPreparedQuiz } from "@/lib/start-quiz";
import { getChapterMastery } from "@/lib/storage";
import { AppButton } from "@/components/ui/AppButton";
import { Layers } from "lucide-react";

const icons = {
  Gauge,
  Brain,
  Users,
  TrafficCone,
  CloudRain,
  Leaf,
  ShieldAlert,
};

const levelStyles = {
  none: { icon: "bg-slate-100 text-slate-500", text: "text-slate-500" },
  learning: { icon: "bg-rose-100 text-rose-600", text: "text-rose-600" },
  progress: { icon: "bg-amber-100 text-amber-600", text: "text-amber-600" },
  advanced: { icon: "bg-blue-100 text-blue-600", text: "text-blue-600" },
  mastered: { icon: "bg-emerald-100 text-emerald-600", text: "text-emerald-600" },
};

const levelLabel = {
  none: "Sin comenzar",
  learning: "Repasando",
  progress: "En progreso",
  advanced: "Avanzado",
  mastered: "Dominado",
};

type Props = { params: Promise<{ id: string }> };

export default function ChapterIntro({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();

  const chapter = chapters.find((c) => c.id === id);
  const chapterQuestions = chapter ? getQuestionsByChapter(id) : [];

  const [mastery, setMastery] = useState(() =>
    chapterQuestions.length > 0
      ? getChapterMastery(id, chapterQuestions.map((q) => q.id))
      : null
  );

  useEffect(() => {
    function refresh() {
      if (chapterQuestions.length > 0) {
        setMastery(getChapterMastery(id, chapterQuestions.map((q) => q.id)));
      }
    }
    window.addEventListener("clase-b-stats-change", refresh);
    return () => window.removeEventListener("clase-b-stats-change", refresh);
  }, [id, chapterQuestions]);

  if (!chapter) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-slate-400">Capítulo no encontrado.</p>
      </main>
    );
  }

  const Icon = icons[chapter!.icon];
  const styles = levelStyles[mastery?.level ?? "none"];
  const hasActivity = mastery && mastery.attempted > 0;
  const unseenCount = mastery ? mastery.total - mastery.attempted : chapterQuestions.length;
  const sessionSize = Math.min(CHAPTER_BATCH_SIZE, chapterQuestions.length);
  const sessionsCompleted = mastery ? Math.floor(mastery.attempted / CHAPTER_BATCH_SIZE) : 0;
  const stars = mastery?.stars ?? 0;

  function handleStart() {
    if (chapterQuestions.length === 0) return;
    const batch = getChapterBatch(chapterQuestions, CHAPTER_BATCH_SIZE);
    startPreparedQuiz({
      questions: batch.map(shuffleQuestionOptions),
      mode: "chapter",
      title: chapter!.name,
    });
    router.push("/quiz");
  }

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <div className="mx-auto w-full max-w-[620px] px-5 pb-12 pt-6 sm:px-8 sm:pt-8">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="flex h-11 w-11 items-center justify-center rounded-2xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
          aria-label="Volver al inicio"
        >
          <ArrowLeft size={21} />
        </button>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-10"
        >
          {/* Icon */}
          <div
            className={`mx-auto flex h-20 w-20 items-center justify-center rounded-[26px] ${styles.icon}`}
          >
            <Icon size={34} strokeWidth={2.2} />
          </div>

          {/* Title */}
          <div className="mt-7 text-center">
            <p className={`text-xs font-black uppercase tracking-[0.16em] ${styles.text}`}>
              {levelLabel[mastery?.level ?? "none"]}
            </p>

            <h1 className="mt-2 text-2xl font-black tracking-[-0.03em] text-slate-950 sm:text-3xl">
              {chapter.name}
            </h1>

            <p className="mx-auto mt-2 max-w-xs text-sm font-medium leading-6 text-slate-500">
              {chapter.description}
            </p>
          </div>

          {/* Stars */}
          {hasActivity && (
            <div className="mt-5 flex justify-center gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.1 + i * 0.1,
                    type: "spring",
                    stiffness: 280,
                    damping: 14,
                  }}
                >
                  <Star
                    size={44}
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

          {/* Stats grid */}
          <div className="mt-8 grid grid-cols-3 gap-2">
            <Stat
              icon={<CheckCircle2 size={16} strokeWidth={2.5} />}
              value={
                hasActivity && mastery.accuracy !== null
                  ? `${mastery.accuracy}%`
                  : "—"
              }
              label="precisión"
            />
            <Stat
              icon={<RotateCcw size={16} strokeWidth={2.5} />}
              value={hasActivity ? String(sessionsCompleted) : "0"}
              label="sesiones"
            />
            <Stat
              icon={<Hash size={16} strokeWidth={2.5} />}
              value={
                hasActivity
                  ? `${mastery.attempted}/${mastery.total}`
                  : `0/${chapterQuestions.length}`
              }
              label="vistas"
            />
          </div>

          {/* Next session info */}
          <div className="mt-4 rounded-2xl border-2 border-slate-100 bg-white px-4 py-3">
            {unseenCount > 0 ? (
              <p className="text-sm font-semibold leading-5 text-slate-600">
                Próxima sesión:{" "}
                <span className="font-black text-slate-900">{sessionSize} preguntas</span>
                {unseenCount <= chapterQuestions.length && hasActivity ? (
                  <span className="text-slate-400">
                    {" "}· {unseenCount} nuevas por ver
                  </span>
                ) : null}
              </p>
            ) : (
              <p className="text-sm font-semibold leading-5 text-slate-600">
                ¡Ya viste todas las preguntas! Próxima sesión repasa las{" "}
                <span className="font-black text-slate-900">más difíciles</span>.
              </p>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <AppButton fullWidth onClick={handleStart}>
              {hasActivity ? "Nueva sesión" : "Comenzar"}
            </AppButton>
            <AppButton
              fullWidth
              variant="secondary"
              onClick={() => router.push(`/flashcards/${id}`)}
            >
              <Layers size={16} className="mr-2 inline text-violet-500" />
              Estudiar con tarjetas
            </AppButton>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl border-2 border-slate-200 bg-white px-3 py-3 text-center">
      <span className="text-slate-400">{icon}</span>
      <p className="text-lg font-black text-slate-950">{value}</p>
      <p className="text-[10px] font-bold text-slate-400">{label}</p>
    </div>
  );
}
