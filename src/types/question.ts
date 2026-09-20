export type QuestionType = "single" | "multiple";

export type QuestionDifficulty = "easy" | "medium" | "hard";

export type QuestionOption = {
  id: string;
  text: string;
};

export type QuestionSource = {
  title: string;
  page?: number;
};

export type Question = {
  id: string;

  chapter: string;
  topic: string;

  question: string;

  type: QuestionType;

  options: QuestionOption[];

  correctAnswers: string[];

  explanation: string;

  points: 1 | 2;

  difficulty: QuestionDifficulty;

  tags: string[];

  source?: QuestionSource;
};

export type UserAnswer = {
  questionId: string;
  selectedAnswers: string[];
};

export type QuizMode =
  | "practice"
  | "chapter"
  | "mistakes"
  | "exam";

export type QuizResult = {
  totalQuestions: number;
  correctQuestions: number;
  incorrectQuestions: number;

  score: number;
  maxScore: number;

  passed: boolean;

  answers: UserAnswer[];
};
