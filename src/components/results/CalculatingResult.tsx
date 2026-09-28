"use client";

import { motion } from "motion/react";

export function CalculatingResult() {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#f8fafc] px-5">
      <div className="text-center">
        <div className="relative mx-auto h-24 w-24">
          <motion.div
            className="absolute inset-0 rounded-full border-[7px] border-slate-200"
          />

          <motion.div
            className="absolute inset-0 rounded-full border-[7px] border-transparent border-t-blue-600"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          <motion.div
            initial={{
              scale: 0.7,
            }}
            animate={{
              scale: [
                0.7,
                1,
                0.7,
              ],
            }}
            transition={{
              duration: 1.1,
              repeat: Infinity,
            }}
            className="absolute inset-0 flex items-center justify-center text-2xl"
          >
            🚗
          </motion.div>
        </div>

        <motion.h2
          initial={{
            opacity: 0,
            y: 8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mt-7 text-2xl font-black tracking-tight text-slate-950"
        >
          Calculando resultado...
        </motion.h2>

        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.25,
          }}
          className="mt-2 text-sm font-semibold text-slate-400"
        >
          Revisando tus respuestas
        </motion.p>
      </div>
    </div>
  );
}
