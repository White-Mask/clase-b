"use client";

import { motion } from "motion/react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger";

type AppButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  type?: "button" | "submit";
  className?: string;
};

export function AppButton({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  fullWidth = false,
  type = "button",
  className = "",
}: AppButtonProps) {
  const variants = {
    primary:
      "bg-blue-600 text-white border-blue-800 shadow-[0_4px_0_#1e40af]",
    secondary:
      "bg-white text-slate-700 border-slate-200 shadow-[0_4px_0_#e2e8f0]",
    danger:
      "bg-rose-500 text-white border-rose-700 shadow-[0_4px_0_#be123c]",
  };

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      whileTap={
        disabled
          ? undefined
          : {
              y: 3,
              scale: 0.99,
            }
      }
      className={`
        min-h-14
        rounded-2xl
        border-2
        px-5
        py-3
        text-sm
        font-black
        transition
        ${variants[variant]}
        ${fullWidth ? "w-full" : ""}
        ${
          disabled
            ? "cursor-not-allowed opacity-40 shadow-none"
            : "hover:brightness-[1.03]"
        }
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
}
