"use client";

import {
  useEffect,
  useState,
} from "react";

type AnimatedNumberProps = {
  value: number;
  duration?: number;
};

export function AnimatedNumber({
  value,
  duration = 850,
}: AnimatedNumberProps) {
  const [display, setDisplay] =
    useState(0);

  useEffect(() => {
    let frame = 0;

    const startedAt =
      performance.now();

    function update(
      now: number
    ) {
      const elapsed =
        now - startedAt;

      const progress =
        Math.min(
          elapsed / duration,
          1
        );

      const eased =
        1 -
        Math.pow(
          1 - progress,
          3
        );

      setDisplay(
        Math.round(
          value * eased
        )
      );

      if (progress < 1) {
        frame =
          requestAnimationFrame(
            update
          );
      }
    }

    frame =
      requestAnimationFrame(
        update
      );

    return () =>
      cancelAnimationFrame(
        frame
      );
  }, [value, duration]);

  return display;
}
