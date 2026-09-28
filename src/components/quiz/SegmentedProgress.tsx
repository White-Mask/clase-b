"use client";

import { motion } from "motion/react";

type SegmentedProgressProps = {
  current: number;
  total: number;
  blockSize?: number;
};

export function SegmentedProgress({
  current,
  total,
  blockSize = 7,
}: SegmentedProgressProps) {
  const blocks = Math.ceil(
    total / blockSize
  );

  return (
    <div className="flex flex-1 gap-1.5">
      {Array.from({
        length: blocks,
      }).map((_, blockIndex) => {
        const blockStart =
          blockIndex * blockSize;

        const blockLength = Math.min(
          blockSize,
          total - blockStart
        );

        const completedInBlock =
          Math.min(
            Math.max(
              current - blockStart,
              0
            ),
            blockLength
          );

        const percentage =
          (completedInBlock /
            blockLength) *
          100;

        return (
          <div
            key={blockIndex}
            className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200"
          >
            <motion.div
              initial={false}
              animate={{
                width: `${percentage}%`,
              }}
              transition={{
                type: "spring",
                stiffness: 130,
                damping: 22,
              }}
              className="h-full rounded-full bg-blue-600"
            />
          </div>
        );
      })}
    </div>
  );
}
