import questionsData from "@/data/questions.json";
import type { Question } from "@/types/question";
import { getQuestionStats } from "@/lib/storage";
import { shuffle } from "@/lib/quiz";

export const questions = questionsData as Question[];

export const CHAPTER_BATCH_SIZE = 7;
export const MISTAKES_BATCH_SIZE = 7;

export function getAllQuestions(): Question[] {
  return questions;
}

export function getQuestionsByChapter(chapter: string): Question[] {
  return questions.filter((question) => question.chapter === chapter);
}

export function getQuestionById(id: string): Question | undefined {
  return questions.find((question) => question.id === id);
}

/**
 * Picks the next batch of questions for a chapter session.
 * Prioritizes unseen questions, then fills with weakest seen.
 */
export function getMistakeBatch(batchSize: number = MISTAKES_BATCH_SIZE): Question[] {
  const stats = getQuestionStats();
  const mistakeStats = stats
    .filter((s) => s.incorrect > 0 && s.streak < 3)
    .sort((a, b) => {
      if (b.incorrect !== a.incorrect) return b.incorrect - a.incorrect;
      if (a.streak !== b.streak) return a.streak - b.streak;
      return new Date(b.lastAttempt).getTime() - new Date(a.lastAttempt).getTime();
    });

  return mistakeStats
    .slice(0, batchSize)
    .map((s) => questions.find((q) => q.id === s.questionId))
    .filter((q): q is Question => q !== undefined);
}

export function getChapterBatch(
  chapterQuestions: Question[],
  batchSize: number = CHAPTER_BATCH_SIZE
): Question[] {
  const stats = getQuestionStats();
  const seenIds = new Set(stats.map((s) => s.questionId));

  const unseen = shuffle(
    chapterQuestions.filter((q) => !seenIds.has(q.id))
  );

  if (unseen.length >= batchSize) {
    return unseen.slice(0, batchSize);
  }

  const seen = chapterQuestions.filter((q) => seenIds.has(q.id));
  const weakest = seen.sort((a, b) => {
    const sa = stats.find((s) => s.questionId === a.id);
    const sb = stats.find((s) => s.questionId === b.id);
    const accA = sa ? sa.correct / Math.max(sa.attempts, 1) : 0;
    const accB = sb ? sb.correct / Math.max(sb.attempts, 1) : 0;
    return accA - accB;
  });

  return [...unseen, ...weakest].slice(0, batchSize);
}
