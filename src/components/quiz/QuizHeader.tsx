"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { X } from "lucide-react";

type QuizHeaderProps = {
  title: string;
  current: number;
  total: number;
  answered: number;
};

export function QuizHeader({
  title,
  current,
  total,
  answered,
}: QuizHeaderProps) {
  const router = useRouter();

  const progress =
    total === 0 ? 0 : (answered / total) * 100;

  function handleExit() {
    const shouldExit = window.confirm(
      "¿Quieres salir? Tus respuestas de este intento no se enviarán."
    );

    if (shouldExit) {
      router.push("/");
    }
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-4xl px-5 py-4 sm:px-8">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleExit}
            aria-label="Salir del quiz"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={21} />
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-4">
              <p className="truncate text-sm font-extrabold text-slate-900">
                {title}
              </p>

              <p className="shrink-0 text-xs font-bold text-slate-400">
                {current} / {total}
              </p>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <motion.div
                className="h-full rounded-full bg-blue-600"
                initial={false}
                animate={{
                  width: `${progress}%`,
                }}
                transition={{
                  type: "spring",
                  stiffness: 120,
                  damping: 20,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
