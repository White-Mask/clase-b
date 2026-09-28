import conceptsData from "@/data/flashcard-concepts.json";
import { getAllFlashCardProgress } from "@/lib/flashcard-storage";

export const FLASHCARD_SESSION_SIZE = 10;

export type FlashCard = {
  id: string;
  chapter: string;
  topic: string;
  title: string;
  front: string;
  content: string;
  example?: string;
  page?: number;
  tags?: string[];
};

const allConcepts = conceptsData as FlashCard[];

export function getAllFlashCards(): FlashCard[] {
  return allConcepts;
}

export function getFlashCardsByChapter(chapter: string): FlashCard[] {
  return allConcepts.filter((c) => c.chapter === chapter);
}

export function buildFlashCardSession(chapter: string): FlashCard[] {
  const cards = getFlashCardsByChapter(chapter);
  if (cards.length === 0) return [];

  const all = getAllFlashCardProgress();
  const progressMap = new Map(all.map((p) => [p.cardId, p]));

  const unseen = cards.filter((c) => !progressMap.has(c.id));
  const toReview = cards.filter((c) => progressMap.get(c.id)?.category === "to_review");
  const learning = cards.filter((c) => progressMap.get(c.id)?.category === "learning");
  const learned = cards.filter((c) => progressMap.get(c.id)?.category === "learned");

  const byOldest = (a: FlashCard, b: FlashCard) => {
    const pa = progressMap.get(a.id)?.lastReviewed ?? "";
    const pb = progressMap.get(b.id)?.lastReviewed ?? "";
    return pa.localeCompare(pb);
  };

  const prioritized = [
    ...shuffle(unseen),
    ...toReview.sort(byOldest),
    ...learning.sort(byOldest),
    ...learned.sort(byOldest),
  ];

  return prioritized.slice(0, FLASHCARD_SESSION_SIZE);
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
