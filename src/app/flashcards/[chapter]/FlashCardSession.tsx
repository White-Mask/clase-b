"use client";

import { use, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, CheckCircle2, RotateCcw } from "lucide-react";

import { chapters } from "@/data/chapters";
import { buildFlashCardSession } from "@/lib/flashcards";
import { saveFlashCardRating } from "@/lib/flashcard-storage";
import { FlashCardView } from "@/components/flashcards/FlashCardView";
import { AppButton } from "@/components/ui/AppButton";

type Props = { params: Promise<{ chapter: string }> };

export default function FlashCardSession({ params }: Props) {
  const { chapter } = use(params);
  const router = useRouter();

  const chapterMeta = chapters.find((c) => c.id === chapter);

  const [cards, setCards] = useState(() => buildFlashCardSession(chapter));
  const [index, setIndex] = useState(0);
  const [ratings, setRatings] = useState<(1 | 2 | 3 | null)[]>([]);
  const [done, setDone] = useState(false);

  function advance(confidence: 1 | 2 | 3 | null) {
    if (confidence !== null) {
      saveFlashCardRating(cards[index].id, confidence);
    }
    setRatings((prev) => [...prev, confidence]);
    if (index + 1 >= cards.length) {
      setDone(true);
    } else {
      setIndex((i) => i + 1);
    }
  }

  const handleRate = useCallback(
    (confidence: 1 | 2 | 3) => advance(confidence),
    [cards, index]
  );

  const handleSkip = useCallback(
    () => advance(null),
    [cards, index]
  );

  function handleRestart() {
    setCards(buildFlashCardSession(chapter));
    setIndex(0);
    setRatings([]);
    setDone(false);
  }

  if (!chapterMeta) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-slate-400">Capítulo no encontrado.</p>
      </main>
    );
  }

  if (cards.length === 0) {
    return (
      <main className="min-h-screen bg-[#f8fafc]">
        <div className="mx-auto w-full max-w-[620px] px-5 pb-12 pt-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-11 w-11 items-center justify-center rounded-2xl text-slate-400 hover:bg-slate-100"
          >
            <ArrowLeft size={21} />
          </button>
          <p className="mt-12 text-center text-sm text-slate-400">
            No hay tarjetas disponibles para este capítulo.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <div className="mx-auto w-full max-w-[620px] px-5 pb-16 pt-6 sm:px-8 sm:pt-8">
        <div className="flex items-center gap-3 mb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Volver"
          >
            <ArrowLeft size={21} />
          </button>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-violet-500">
              Tarjetas de repaso
            </p>
            <p className="truncate text-sm font-black text-slate-900">
              {chapterMeta.name}
            </p>
          </div>
        </div>

        {done ? (
          <SessionSummary
            total={cards.length}
            ratings={ratings}
            onRestart={handleRestart}
            onHome={() => router.push("/flashcards")}
          />
        ) : (
          <AnimatePresence mode="wait">
            <FlashCardView
              key={cards[index].id}
              card={cards[index]}
              index={index}
              total={cards.length}
              onRate={handleRate}
              onSkip={handleSkip}
            />
          </AnimatePresence>
        )}
      </div>
    </main>
  );
}

function SessionSummary({
  total,
  ratings,
  onRestart,
  onHome,
}: {
  total: number;
  ratings: (1 | 2 | 3 | null)[];
  onRestart: () => void;
  onHome: () => void;
}) {
  const learned = ratings.filter((r) => r === 3).length;
  const learning = ratings.filter((r) => r === 2).length;
  const toReview = ratings.filter((r) => r === 1).length;
  const skipped = ratings.filter((r) => r === null).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[26px] bg-violet-100 text-violet-600">
        <CheckCircle2 size={36} strokeWidth={2.2} />
      </div>

      <p className="text-xs font-black uppercase tracking-[0.14em] text-violet-500">
        Sesión completada
      </p>
      <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-slate-950">
        {total} tarjetas revisadas
      </h2>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <SummaryStat value={learned} label="La sabía" color="text-emerald-600" />
        <SummaryStat value={learning} label="Dudé" color="text-amber-600" />
        <SummaryStat value={toReview} label="No la sabía" color="text-rose-600" />
      </div>

      {skipped > 0 && (
        <p className="mt-3 text-xs font-medium text-slate-400">
          {skipped} {skipped === 1 ? "tarjeta" : "tarjetas"} sin calificar
        </p>
      )}

      <div className="mt-8 flex flex-col gap-3">
        <AppButton fullWidth onClick={onRestart}>
          <RotateCcw size={16} className="mr-2 inline" />
          Nueva sesión
        </AppButton>
        <AppButton fullWidth variant="secondary" onClick={onHome}>
          Volver al inicio
        </AppButton>
      </div>
    </motion.div>
  );
}

function SummaryStat({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl border-2 border-slate-100 bg-white px-2 py-4 text-center">
      <p className={`text-2xl font-black ${color}`}>{value}</p>
      <p className="mt-1 text-[10px] font-bold text-slate-400">{label}</p>
    </div>
  );
}
