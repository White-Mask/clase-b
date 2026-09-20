"use client";

type QuestionNavigatorProps = {
  total: number;
  currentIndex: number;
  answers: Record<string, string[]>;
  questionIds: string[];
  onSelect: (index: number) => void;
};

export function QuestionNavigator({
  total,
  currentIndex,
  answers,
  questionIds,
  onSelect,
}: QuestionNavigatorProps) {
  return (
    <div className="mt-10">
      <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">
        Preguntas
      </p>

      <div className="flex flex-wrap gap-2">
        {Array.from({ length: total }).map(
          (_, index) => {
            const id = questionIds[index];

            const answered =
              (answers[id]?.length ?? 0) > 0;

            const active =
              index === currentIndex;

            return (
              <button
                key={id}
                type="button"
                onClick={() => onSelect(index)}
                aria-label={`Ir a la pregunta ${
                  index + 1
                }`}
                className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black transition ${
                  active
                    ? "bg-slate-950 text-white"
                    : answered
                      ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                }`}
              >
                {index + 1}
              </button>
            );
          }
        )}
      </div>
    </div>
  );
}
