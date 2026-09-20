"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  Brain,
  ChevronRight,
  CloudRain,
  Gauge,
  Leaf,
  ShieldAlert,
  TrafficCone,
  Users,
} from "lucide-react";

import { chapters } from "@/data/chapters";
import { getQuestionsByChapter } from "@/lib/questions";
import { startQuiz } from "@/lib/start-quiz";

const icons = {
  Gauge,
  Brain,
  Users,
  TrafficCone,
  CloudRain,
  Leaf,
  ShieldAlert,
};

export function ChapterGrid() {
  const router = useRouter();

  function handleChapter(
    chapterId: string,
    chapterName: string
  ) {
    const chapterQuestions =
      getQuestionsByChapter(chapterId);

    if (chapterQuestions.length === 0) {
      return;
    }

    startQuiz({
      questions: chapterQuestions,
      amount: chapterQuestions.length,
      mode: "chapter",
      title: chapterName,
    });

    router.push("/quiz");
  }

  return (
    <section>
      <div className="mb-5">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-400">
          Estudiar
        </p>

        <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
          Practica por capítulo
        </h2>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {chapters.map((chapter, index) => {
          const Icon = icons[chapter.icon];
          const chapterQuestions =
            getQuestionsByChapter(chapter.id);

          const disabled =
            chapterQuestions.length === 0;

          return (
            <motion.button
              key={chapter.id}
              type="button"
              disabled={disabled}
              onClick={() =>
                handleChapter(
                  chapter.id,
                  chapter.name
                )
              }
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                delay: 0.12 + index * 0.04,
              }}
              whileHover={
                disabled ? undefined : { y: -3 }
              }
              whileTap={
                disabled
                  ? undefined
                  : { scale: 0.99 }
              }
              className={`group flex w-full items-center gap-4 rounded-[24px] border p-4 text-left shadow-sm transition ${
                disabled
                  ? "cursor-not-allowed border-slate-100 bg-slate-50 opacity-55"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
              }`}
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition ${
                  disabled
                    ? "bg-slate-100 text-slate-300"
                    : "bg-slate-100 text-slate-700 group-hover:bg-slate-950 group-hover:text-white"
                }`}
              >
                <Icon
                  size={21}
                  strokeWidth={2.2}
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-extrabold text-slate-950">
                    {chapter.name}
                  </h3>

                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                    {chapterQuestions.length}
                  </span>
                </div>

                <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                  {chapter.description}
                </p>
              </div>

              {!disabled && (
                <ChevronRight
                  size={18}
                  className="shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-700"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
