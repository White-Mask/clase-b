"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, RotateCcw, Zap, Target, BookOpen } from "lucide-react";
import { motion } from "motion/react";

import { chapters } from "@/data/chapters";
import { getMistakeBatch, MISTAKES_BATCH_SIZE, questions } from "@/lib/questions";
import { getMistakeIds, getQuestionStats } from "@/lib/storage";
import { shuffleQuestionOptions } from "@/lib/quiz";
import { startPreparedQuiz } from "@/lib/start-quiz";
import { AppButton } from "@/components/ui/AppButton";

type MistakesData = {
  total: number;
  byChapter: Array<{ name: string; count: number }>;
  sessionsCompleted: number;
};

function computeMistakesData(): MistakesData {
  const stats = getQuestionStats();
  const allIds = getMistakeIds();
  // Only count IDs that still exist in the question bank
  const validIds = allIds.filter((id) => questions.some((q) => q.id === id));

  const byChapter = chapters
    .map((ch) => ({
      name: ch.shortName,
      count: validIds.filter((id) =>
        questions.find((q) => q.id === id && q.chapter === ch.id)
      ).length,
    }))
    .filter((ch) => ch.count > 0)
    .sort((a, b) => b.count - a.count);

  const mistakeStats = stats.filter((s) => s.incorrect > 0 && s.streak < 3);
  const totalAttempts = mistakeStats.reduce((sum, s) => sum + s.attempts, 0);
  const sessionsCompleted = Math.floor(totalAttempts / MISTAKES_BATCH_SIZE);

  return { total: validIds.length, byChapter, sessionsCompleted };
}

export default function MistakesPage() {
  const router = useRouter();

  const [data, setData] = useState<MistakesData>(() => computeMistakesData());

  useEffect(() => {
    function refresh() {
      setData(computeMistakesData());
    }
    window.addEventListener("clase-b-stats-change", refresh);
    return () => window.removeEventListener("clase-b-stats-change", refresh);
  }, []);

  const { total, byChapter, sessionsCompleted } = data;
  const batchSize = Math.min(MISTAKES_BATCH_SIZE, total);
  const maxCount = Math.max(...byChapter.map((c) => c.count), 1);

  function handleStart() {
    if (total === 0) return;
    const batch = getMistakeBatch(MISTAKES_BATCH_SIZE);
    startPreparedQuiz({
      questions: batch.map(shuffleQuestionOptions),
      mode: "mistakes",
      title: "Tus errores",
    });
    router.push("/quiz");
  }

  if (total === 0) {
    return (
      <main className="min-h-screen bg-[#f8fafc]">
        <div className="mx-auto w-full max-w-[620px] px-5 pb-12 pt-6 sm:px-8 sm:pt-8">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex h-11 w-11 items-center justify-center rounded-2xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <ArrowLeft size={21} />
          </button>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-16 text-center"
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[26px] bg-emerald-100 text-emerald-600">
              <Target size={34} strokeWidth={2.2} />
            </div>
            <h1 className="mt-6 text-2xl font-black tracking-[-0.03em] text-slate-950">
              ¡Sin errores pendientes!
            </h1>
            <p className="mx-auto mt-2 max-w-xs text-sm font-medium leading-6 text-slate-500">
              Sigue practicando para mantenerlo así.
            </p>
          </motion.div>
        </div>
      </main>
    );
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
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[26px] bg-rose-100 text-rose-500">
            <RotateCcw size={34} strokeWidth={2.2} />
          </div>

          {/* Title */}
          <div className="mt-7 text-center">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-rose-500">
              Refuerzo
            </p>
            <h1 className="mt-2 text-2xl font-black tracking-[-0.03em] text-slate-950 sm:text-3xl">
              Tus errores
            </h1>
            <p className="mx-auto mt-2 max-w-xs text-sm font-medium leading-6 text-slate-500">
              Preguntas que has respondido mal al menos una vez.
            </p>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-3 gap-2">
            <Stat icon={<RotateCcw size={16} strokeWidth={2.5} />} value={String(total)} label="pendientes" />
            <Stat icon={<BookOpen size={16} strokeWidth={2.5} />} value={String(sessionsCompleted)} label="sesiones" />
            <Stat icon={<Zap size={16} strokeWidth={2.5} />} value="×3" label="para superar" />
          </div>

          {/* Exit condition hint */}
          <div className="mt-3 rounded-2xl border-2 border-rose-100 bg-rose-50/60 px-4 py-3">
            <p className="text-sm font-semibold leading-5 text-rose-700">
              Responde correctamente{" "}
              <span className="font-black">3 veces seguidas</span> una pregunta
              para sacarla de esta sección.
            </p>
          </div>

          {/* By chapter breakdown */}
          {byChapter.length > 1 && (
            <div className="mt-4 rounded-[20px] border-2 border-slate-100 bg-white px-4 py-4">
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">
                Por capítulo
              </p>
              <div className="space-y-2">
                {byChapter.map((ch) => (
                  <div key={ch.name} className="flex items-center gap-2.5">
                    <span className="w-24 shrink-0 truncate text-[11px] font-bold text-slate-500">
                      {ch.name}
                    </span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-rose-50">
                      <div
                        className="h-full rounded-full bg-rose-400"
                        style={{ width: `${Math.round((ch.count / maxCount) * 100)}%` }}
                      />
                    </div>
                    <span className="w-6 shrink-0 text-right text-[11px] font-black text-slate-600">
                      {ch.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next session */}
          <div className="mt-4 rounded-2xl border-2 border-slate-100 bg-white px-4 py-3">
            <p className="text-sm font-semibold leading-5 text-slate-600">
              Próxima sesión:{" "}
              <span className="font-black text-slate-900">{batchSize} preguntas</span>
              <span className="text-slate-400"> · las más difíciles primero</span>
            </p>
          </div>

          <div className="mt-6">
            <AppButton fullWidth onClick={handleStart} variant="danger">
              Comenzar repaso
            </AppButton>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl border-2 border-slate-200 bg-white px-3 py-3 text-center">
      <span className="text-slate-400">{icon}</span>
      <p className="text-lg font-black text-slate-950">{value}</p>
      <p className="text-[10px] font-bold text-slate-400">{label}</p>
    </div>
  );
}
