const STORAGE_KEY = "clase-b-flashcard-progress";

export type FlashCardCategory = "to_review" | "learning" | "learned";

export type FlashCardProgress = {
  cardId: string;
  confidence: 1 | 2 | 3;
  reviewCount: number;
  lastReviewed: string;
  category: FlashCardCategory;
};

function computeCategory(
  confidence: 1 | 2 | 3,
  reviewCount: number
): FlashCardCategory {
  if (confidence === 1) return "to_review";
  if (confidence === 2) return "learning";
  return reviewCount >= 2 ? "learned" : "learning";
}

export function getAllFlashCardProgress(): FlashCardProgress[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as FlashCardProgress[];
  } catch {
    return [];
  }
}

export function getFlashCardProgress(cardId: string): FlashCardProgress | undefined {
  return getAllFlashCardProgress().find((p) => p.cardId === cardId);
}

export function saveFlashCardRating(cardId: string, confidence: 1 | 2 | 3): void {
  if (typeof window === "undefined") return;

  const all = getAllFlashCardProgress();
  const existing = all.find((p) => p.cardId === cardId);

  if (existing) {
    existing.confidence = confidence;
    existing.reviewCount += 1;
    existing.lastReviewed = new Date().toISOString();
    existing.category = computeCategory(confidence, existing.reviewCount);
  } else {
    all.push({
      cardId,
      confidence,
      reviewCount: 1,
      lastReviewed: new Date().toISOString(),
      category: computeCategory(confidence, 1),
    });
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  window.dispatchEvent(new Event("clase-b-flashcard-change"));
}

export type FlashCardChapterStats = {
  total: number;
  toReview: number;
  learning: number;
  learned: number;
  seen: number;
};

export function getFlashCardChapterStats(
  chapterId: string,
  allCardIds: string[]
): FlashCardChapterStats {
  const all = getAllFlashCardProgress();
  const chapterProgress = all.filter((p) => allCardIds.includes(p.cardId));

  const seen = chapterProgress.length;
  const toReview = chapterProgress.filter((p) => p.category === "to_review").length;
  const learning = chapterProgress.filter((p) => p.category === "learning").length;
  const learned = chapterProgress.filter((p) => p.category === "learned").length;

  return { total: allCardIds.length, seen, toReview, learning, learned };
}

export function getFlashCardGlobalStats() {
  const all = getAllFlashCardProgress();
  return {
    seen: all.length,
    toReview: all.filter((p) => p.category === "to_review").length,
    learning: all.filter((p) => p.category === "learning").length,
    learned: all.filter((p) => p.category === "learned").length,
  };
}
