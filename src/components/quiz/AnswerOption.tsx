"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";

type AnswerOptionProps = {
  id: string;
  text: string;
  selected: boolean;
  multiple: boolean;
  onClick: () => void;
};

const letters = ["A", "B", "C", "D", "E", "F"];

export function AnswerOption({
  id,
  text,
  selected,
  multiple,
  onClick,
}: AnswerOptionProps) {
  const letterIndex =
    id.length === 1
      ? id.toLowerCase().charCodeAt(0) - 97
      : -1;

  const letter =
    letterIndex >= 0 &&
    letterIndex < letters.length
      ? letters[letterIndex]
      : id.toUpperCase();

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.985 }}
      animate={
        selected
          ? { scale: [1, 1.015, 1] }
          : { scale: 1 }
      }
      transition={{ duration: 0.2 }}
      className={`group flex w-full items-center gap-4 rounded-[22px] border-2 p-4 text-left transition sm:p-5 ${
        selected
          ? "border-blue-600 bg-blue-50 shadow-sm"
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center font-black transition ${
          multiple
            ? "rounded-xl"
            : "rounded-full"
        } ${
          selected
            ? "bg-blue-600 text-white"
            : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
        }`}
      >
        {selected ? (
          <Check size={20} strokeWidth={3} />
        ) : (
          letter
        )}
      </div>

      <span
        className={`min-w-0 flex-1 text-sm font-bold leading-6 sm:text-[15px] ${
          selected
            ? "text-blue-950"
            : "text-slate-700"
        }`}
      >
        {text}
      </span>
    </motion.button>
  );
}
