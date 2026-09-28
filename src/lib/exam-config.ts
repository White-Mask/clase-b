export const CLASS_B_EXAM = {
  questionCount: 35,
  maxScore: 38,
  passingScore: 33,
  doublePointQuestions: 3,
} as const;

export const PRACTICE_AMOUNTS = [
  {
    amount: 7,
    label: "Rápida",
    description: "~3 min",
  },
  {
    amount: 14,
    label: "Media",
    description: "~6 min",
  },
  {
    amount: 21,
    label: "Larga",
    description: "~10 min",
  },
] as const;

export const PRACTICE_BLOCK_SIZE = 7;
