"use client";

import {
  AnimatePresence,
  motion,
} from "motion/react";
import {
  Check,
  X,
} from "lucide-react";

type QuestionOverviewProps = {
  open: boolean;
  currentIndex: number;
  questionIds: string[];
  answers: Record<
    string,
    string[]
  >;
  onClose: () => void;
  onSelect: (
    index: number
  ) => void;
};

export function QuestionOverview({
  open,
  currentIndex,
  questionIds,
  answers,
  onClose,
  onSelect,
}: QuestionOverviewProps) {
  const answered =
    questionIds.filter(
      (id) =>
        (answers[id]?.length ?? 0) >
        0
    ).length;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[2px]"
          />

          <motion.div
            initial={{
              y: "100%",
            }}
            animate={{
              y: 0,
            }}
            exit={{
              y: "100%",
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 28,
            }}
            className="fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[85dvh] max-w-[760px] overflow-y-auto overscroll-contain rounded-t-[28px] bg-white px-5 pb-[max(24px,env(safe-area-inset-bottom))] pt-3 shadow-2xl sm:rounded-t-[32px] sm:px-8 sm:pt-4"
          >
            <div className="mx-auto mb-7 h-1.5 w-12 rounded-full bg-slate-200" />

            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black tracking-[-0.03em] text-slate-950">
                  Tus preguntas
                </h2>

                <p className="mt-1 text-sm font-bold text-slate-400">
                  {answered} de{" "}
                  {questionIds.length}{" "}
                  respondidas
                </p>
              </div>

              <motion.button
                type="button"
                onClick={onClose}
                whileTap={{
                  scale: 0.9,
                }}
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"
              >
                <X size={20} />
              </motion.button>
            </div>

            <div className="mt-7 grid grid-cols-5 gap-2.5 min-[430px]:gap-3 sm:mt-8 sm:grid-cols-7">
              {questionIds.map(
                (id, index) => {
                  const hasAnswer =
                    (answers[id]
                      ?.length ?? 0) >
                    0;

                  const active =
                    currentIndex ===
                    index;

                  return (
                    <motion.button
                      key={id}
                      type="button"
                      onClick={() => {
                        onSelect(index);
                        onClose();
                      }}
                      whileHover={{
                        y: -2,
                      }}
                      whileTap={{
                        y: 2,
                        scale: 0.95,
                      }}
                      className={`relative aspect-square rounded-[20px] border-2 text-sm font-black transition ${
                        active
                          ? "border-blue-700 bg-blue-600 text-white shadow-[0_4px_0_#1d4ed8]"
                          : hasAnswer
                            ? "border-blue-300 bg-blue-100 text-blue-700 shadow-[0_3px_0_#bfdbfe]"
                            : "border-slate-300 bg-slate-100 text-slate-500 shadow-[0_3px_0_#cbd5e1]"
                      }`}
                    >
                      {index + 1}

                      {hasAnswer &&
                        !active && (
                          <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-white">
                            <Check
                              size={9}
                              strokeWidth={4}
                            />
                          </span>
                        )}
                    </motion.button>
                  );
                }
              )}
            </div>

            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 border-t-2 border-slate-100 pt-5">
              <Legend
                dotClassName="bg-blue-600 ring-2 ring-blue-200"
                label="Actual"
              />

              <Legend
                dotClassName="bg-blue-200 ring-2 ring-blue-300"
                label="Respondida"
              />

              <Legend
                dotClassName="bg-slate-200 ring-2 ring-slate-300"
                label="Pendiente"
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Legend({
  dotClassName,
  label,
}: {
  dotClassName: string;
  label: string;
}) {
  return (
    <span className="flex items-center gap-2">
      <span
        className={`h-3.5 w-3.5 rounded-full ${dotClassName}`}
      />

      <span className="text-xs font-black text-slate-500">
        {label}
      </span>
    </span>
  );
}
