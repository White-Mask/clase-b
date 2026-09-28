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

const letters = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
];

export function AnswerOption({
  id,
  text,
  selected,
  multiple,
  onClick,
}: AnswerOptionProps) {
  const letterIndex =
    id.length === 1
      ? id
          .toLowerCase()
          .charCodeAt(0) - 97
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
      whileHover={{
        y: selected ? -1 : -2,
      }}
      whileTap={{
        y: 3,
        scale: 0.985,
      }}
      animate={
        selected
          ? {
              scale: [
                1,
                1.015,
                1,
              ],
            }
          : {
              scale: 1,
            }
      }
      transition={{
        duration: 0.18,
      }}
      aria-pressed={selected}
      className={`flex min-h-[68px] w-full items-center gap-3 rounded-[20px] border-2 p-3.5 text-left transition sm:min-h-[76px] sm:gap-4 sm:rounded-[22px] sm:p-4 ${
        selected
          ? "border-blue-500 bg-blue-50 shadow-[0_4px_0_#93c5fd]"
          : "border-slate-200 bg-white shadow-[0_4px_0_#e2e8f0] hover:border-slate-300"
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center text-sm font-black transition sm:h-11 sm:w-11 ${
          multiple
            ? "rounded-xl"
            : "rounded-full"
        } ${
          selected
            ? "bg-blue-600 text-white"
            : "bg-slate-100 text-slate-500"
        }`}
      >
        {selected ? (
          <motion.div
            initial={{
              scale: 0,
              rotate: -20,
            }}
            animate={{
              scale: 1,
              rotate: 0,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 16,
            }}
          >
            <Check
              size={18}
              strokeWidth={3}
            />
          </motion.div>
        ) : (
          letter
        )}
      </div>

      <span
        className={`min-w-0 flex-1 text-[14px] font-bold leading-[1.45] sm:text-[15px] sm:leading-6 ${
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
