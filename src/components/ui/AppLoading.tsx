"use client";

import { motion } from "motion/react";
import { CarFront } from "lucide-react";

type AppLoadingProps = {
  message?: string;
};

export function AppLoading({
  message = "Preparando todo...",
}: AppLoadingProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8fafc] px-5">
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.96,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 0.25,
        }}
        className="flex flex-col items-center text-center"
      >
        <motion.div
          initial={{
            y: 0,
          }}
          animate={{
            y: [0, -7, 0],
          }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="flex h-20 w-20 items-center justify-center rounded-[26px] border-2 border-blue-700 bg-blue-600 text-white shadow-[0_5px_0_#1d4ed8]"
        >
          <CarFront
            size={32}
            strokeWidth={2.5}
          />
        </motion.div>

        <motion.h1
          initial={{
            opacity: 0,
            y: 5,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.1,
          }}
          className="mt-6 text-xl font-black tracking-[-0.03em] text-slate-950"
        >
          Clase B
        </motion.h1>

        <p className="mt-2 text-sm font-bold text-slate-400">
          {message}
        </p>

        <div className="mt-6 flex gap-2">
          {[0, 1, 2].map((index) => (
            <motion.span
              key={index}
              animate={{
                y: [0, -6, 0],
                opacity: [0.35, 1, 0.35],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: index * 0.12,
                ease: "easeInOut",
              }}
              className="h-2.5 w-2.5 rounded-full bg-blue-500"
            />
          ))}
        </div>
      </motion.div>
    </main>
  );
}
