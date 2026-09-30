"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, BookOpen } from "lucide-react";
import { ConfidenceRating } from "@/components/flashcards/ConfidenceRating";
import type { FlashCard } from "@/lib/flashcards";

type Face = "front" | "back";
type Phase = "idle" | "folding" | "unfolding";

type FlashCardViewProps = {
  card: FlashCard;
  index: number;
  total: number;
  onRate: (confidence: 1 | 2 | 3) => void;
  onSkip: () => void;
};

export function FlashCardView({
  card,
  index,
  total,
  onRate,
  onSkip,
}: FlashCardViewProps) {
  const [face, setFace] = useState<Face>("front");
  const [phase, setPhase] = useState<Phase>("idle");
  const [nextFace, setNextFace] = useState<Face>("back");
  const [flipCount, setFlipCount] = useState(0);
  // fwd = right-to-left (front→back), bwd = left-to-right (back→front)
  const [flipDir, setFlipDir] = useState<"fwd" | "bwd">("fwd");

  function triggerFlip(to: Face) {
    if (phase !== "idle") return;
    setNextFace(to);
    setFlipDir(to === "back" ? "fwd" : "bwd");
    setPhase("folding");
  }

  function handleAnimComplete() {
    if (phase === "folding") {
      // Swap content at the edge (90°), then unfold
      setFace(nextFace);
      setFlipCount((c) => c + 1); // new key → remount with entry angle
      setPhase("unfolding");
    } else if (phase === "unfolding") {
      setPhase("idle");
    }
  }

  // Fold: 0 → ±90  |  Unfold: ∓90 → 0
  const foldTo = flipDir === "fwd" ? 90 : -90;
  const unfoldFrom = flipDir === "fwd" ? -90 : 90;

  return (
    <motion.div
      initial={{ opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -28 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      {/* Progress */}
      <div className="mb-4 flex items-center gap-3">
        <span className="shrink-0 text-xs font-black text-slate-400">
          {index + 1} / {total}
        </span>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
          <motion.div
            className="h-full rounded-full bg-violet-500"
            initial={{ width: 0 }}
            animate={{ width: `${((index + 1) / total) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Flip card — perspective wrapper keeps the 3D effect contained */}
      <div style={{ perspective: 1200 }}>
        <motion.div
          key={flipCount}
          initial={{ rotateY: phase === "unfolding" ? unfoldFrom : 0 }}
          animate={{ rotateY: phase === "folding" ? foldTo : 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          onAnimationComplete={handleAnimComplete}
        >
          {face === "front" ? (
            <FrontFace card={card} onFlip={() => triggerFlip("back")} />
          ) : (
            <BackFace
              card={card}
              onFlipBack={() => triggerFlip("front")}
              onRate={onRate}
              onSkip={onSkip}
            />
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────── Front face ─────────────────────────────── */

function FrontFace({
  card,
  onFlip,
}: {
  card: FlashCard;
  onFlip: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onFlip}
      className="w-full cursor-pointer rounded-[24px] border-2 border-slate-200 bg-white text-left transition hover:border-violet-200 hover:bg-violet-50/40"
    >
      <div className="p-6 sm:p-7">
        <h2 className="text-lg font-black leading-snug tracking-[-0.02em] text-slate-950 sm:text-xl">
          {card.front}
        </h2>

        <div className="mt-6 flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-violet-200 bg-violet-50 py-3">
          <span className="text-[11px] font-black text-violet-500">
            Tocar para voltear
          </span>
        </div>
      </div>
    </button>
  );
}

/* ─────────────────────────────── Back face ──────────────────────────────── */

function BackFace({
  card,
  onFlipBack,
  onRate,
  onSkip,
}: {
  card: FlashCard;
  onFlipBack: () => void;
  onRate: (confidence: 1 | 2 | 3) => void;
  onSkip: () => void;
}) {
  return (
    <div className="rounded-[24px] border-2 border-violet-200 bg-white">
      {/* Flip back row */}
      <button
        type="button"
        onClick={onFlipBack}
        className="flex w-full items-center gap-1.5 px-5 py-3 text-left text-[11px] font-bold text-slate-400 transition hover:text-violet-600"
      >
        <ArrowLeft size={12} strokeWidth={2.8} />
        Ver pregunta
      </button>

      {/* Explanation */}
      <div className="border-t-2 border-slate-100 px-6 py-5 sm:px-7">
        <p className="mb-2 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-600">
          Explicación
        </p>
        <p className="text-sm font-medium leading-6 text-slate-700">
          {card.content}
        </p>
      </div>

      {/* Example */}
      {card.example && (
        <div className="border-t-2 border-slate-100 bg-amber-50 px-6 py-4 sm:px-7">
          <p className="mb-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-amber-600">
            Ejemplo
          </p>
          <p className="text-sm font-medium leading-6 text-slate-700">
            {card.example}
          </p>
        </div>
      )}

      {/* Page */}
      {card.page && (
        <div className="border-t-2 border-slate-100 px-6 py-3 sm:px-7">
          <div className="flex items-center gap-2 text-slate-400">
            <BookOpen size={13} strokeWidth={2.5} />
            <span className="text-[11px] font-bold">
              Libro de conducción en Chile · Página {card.page}
            </span>
          </div>
        </div>
      )}

      {/* Confidence + continue */}
      <div className="border-t-2 border-slate-100 px-6 pb-6 pt-4 sm:px-7">
        <ConfidenceRating onRate={onRate} />
        <button
          type="button"
          onClick={onSkip}
          className="mt-3 w-full py-2 text-center text-[11px] font-bold text-slate-400 transition hover:text-slate-600"
        >
          Continuar sin calificar
        </button>
      </div>
    </div>
  );
}
