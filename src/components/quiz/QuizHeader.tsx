"use client";

import { useRouter } from "next/navigation";
import {
  motion,
} from "motion/react";
import {
  X,
} from "lucide-react";

import { SegmentedProgress } from "@/components/quiz/SegmentedProgress";

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

  function handleExit() {
    const shouldExit =
      window.confirm(
        "¿Quieres salir de esta práctica?"
      );

    if (shouldExit) {
      router.push("/");
    }
  }

  return (
    <header className="sticky top-0 z-30 bg-[#f8fafc]/95 backdrop-blur-xl">
      <div className="mx-auto max-w-[760px] px-4 pb-2.5 pt-3 min-[390px]:px-5 sm:px-8 sm:pb-3 sm:pt-5">
        <div className="flex items-center gap-4">
          <motion.button
            type="button"
            onClick={handleExit}
            whileTap={{
              scale: 0.9,
            }}
            aria-label="Salir"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={21} />
          </motion.button>

          <SegmentedProgress
            current={answered}
            total={total}
          />

          <span className="min-w-[44px] text-right text-xs font-black text-slate-400">
            {current}/{total}
          </span>
        </div>

        <p className="mt-2 truncate pl-14 text-[10px] font-black uppercase tracking-[0.12em] text-slate-300">
          {title}
        </p>
      </div>
    </header>
  );
}
