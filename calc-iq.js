/**
 *
 * @param {Object} stats
 * @param stats.isCorrect correctly answered count
 * @param stats.total question count
 * @returns
 */
export function calcStaticIqByStats(stats) {
  const minIq = 60;
  const maxIq = 140;

  const { isCorrect: correctAnswerCount, total: maxCorrectAnswers } = stats;

  const iqRange = maxIq - minIq;

  const resultIq = minIq + (correctAnswerCount / maxCorrectAnswers) * iqRange;

  return Math.floor(resultIq);
}
