import questionsData from "@/data/questions.json";
import type { Question } from "@/types/question";

export const questions = questionsData as Question[];

export function getAllQuestions(): Question[] {
  return questions;
}

export function getQuestionsByChapter(chapter: string): Question[] {
  return questions.filter((question) => question.chapter === chapter);
}

export function getQuestionById(id: string): Question | undefined {
  return questions.find((question) => question.id === id);
}
