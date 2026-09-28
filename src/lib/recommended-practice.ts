import type { Question } from "@/types/question";

import {
  getQuestionStats,
  type QuestionStat,
} from "@/lib/storage";

import { shuffle } from "@/lib/quiz";

type TopicPerformance = {
  topic: string;
  attempts: number;
  correct: number;
  accuracy: number;
};

const RECOMMENDED_AMOUNT = 7;

function getStatMap() {
  const stats = getQuestionStats();

  return new Map(
    stats.map((stat) => [
      stat.questionId,
      stat,
    ])
  );
}

function getTopicPerformance(
  questions: Question[],
  statMap: Map<
    string,
    QuestionStat
  >
): TopicPerformance[] {
  const topics = new Map<
    string,
    {
      attempts: number;
      correct: number;
    }
  >();

  for (const question of questions) {
    const stat =
      statMap.get(question.id);

    if (!stat) continue;

    const current =
      topics.get(question.topic) ?? {
        attempts: 0,
        correct: 0,
      };

    current.attempts +=
      stat.attempts;

    current.correct +=
      stat.correct;

    topics.set(
      question.topic,
      current
    );
  }

  return Array.from(
    topics.entries()
  )
    .map(
      ([
        topic,
        performance,
      ]) => ({
        topic,
        attempts:
          performance.attempts,
        correct:
          performance.correct,
        accuracy:
          performance.attempts ===
          0
            ? 1
            : performance.correct /
              performance.attempts,
      })
    )
    .sort(
      (a, b) =>
        a.accuracy -
          b.accuracy ||
        b.attempts -
          a.attempts
    );
}

function addUnique(
  destination: Question[],
  candidates: Question[],
  amount: number
) {
  for (const question of candidates) {
    if (
      destination.length >=
      amount
    ) {
      break;
    }

    const exists =
      destination.some(
        (item) =>
          item.id ===
          question.id
      );

    if (!exists) {
      destination.push(
        question
      );
    }
  }
}

export function createRecommendedPractice(
  questions: Question[],
  amount = RECOMMENDED_AMOUNT
): Question[] {
  const target = Math.min(
    amount,
    questions.length
  );

  if (target === 0) {
    return [];
  }

  const statMap =
    getStatMap();

  /*
   * Usuario nuevo:
   * todavía no tenemos suficiente
   * información para personalizar.
   */
  if (statMap.size === 0) {
    return shuffle(questions).slice(
      0,
      target
    );
  }

  const selected: Question[] =
    [];

  /*
   * Aproximadamente 30% de la
   * sesión puede venir de errores.
   *
   * Para 7 preguntas = máximo 2.
   */
  const mistakeTarget =
    Math.min(
      Math.ceil(target * 0.3),
      target
    );

  const mistakes =
    shuffle(
      questions.filter(
        (question) => {
          const stat =
            statMap.get(
              question.id
            );

          return (
            stat &&
            stat.incorrect > 0
          );
        }
      )
    ).sort((a, b) => {
      const aStat =
        statMap.get(a.id)!;

      const bStat =
        statMap.get(b.id)!;

      const aAccuracy =
        aStat.correct /
        aStat.attempts;

      const bAccuracy =
        bStat.correct /
        bStat.attempts;

      return (
        aAccuracy -
        bAccuracy
      );
    });

  addUnique(
    selected,
    mistakes,
    mistakeTarget
  );

  /*
   * Después reforzamos temas
   * donde la precisión histórica
   * es más baja.
   */
  const weakTopics =
    getTopicPerformance(
      questions,
      statMap
    )
      .filter(
        (topic) =>
          topic.attempts > 0 &&
          topic.accuracy < 0.8
      )
      .slice(0, 3)
      .map(
        (topic) => topic.topic
      );

  const weakTopicQuestions =
    shuffle(
      questions.filter(
        (question) =>
          weakTopics.includes(
            question.topic
          )
      )
    );

  const weakTarget =
    Math.min(
      Math.ceil(target * 0.3),
      target
    );

  addUnique(
    selected,
    weakTopicQuestions,
    Math.min(
      selected.length +
        weakTarget,
      target
    )
  );

  /*
   * Priorizamos preguntas que
   * nunca se han practicado.
   */
  const unseen =
    shuffle(
      questions.filter(
        (question) =>
          !statMap.has(
            question.id
          )
      )
    );

  addUnique(
    selected,
    unseen,
    target
  );

  /*
   * Si aún faltan preguntas,
   * usamos las menos vistas.
   */
  const leastSeen =
    shuffle(questions).sort(
      (a, b) => {
        const aAttempts =
          statMap.get(a.id)
            ?.attempts ?? 0;

        const bAttempts =
          statMap.get(b.id)
            ?.attempts ?? 0;

        return (
          aAttempts -
          bAttempts
        );
      }
    );

  addUnique(
    selected,
    leastSeen,
    target
  );

  /*
   * Última red de seguridad.
   */
  addUnique(
    selected,
    shuffle(questions),
    target
  );

  /*
   * Mezclamos el resultado final
   * para que el usuario no pueda
   * saber cuáles son sus errores.
   */
  return shuffle(
    selected.slice(0, target)
  );
}
