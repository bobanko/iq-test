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

  const { isCorrect, total } = stats;

  const resultIq = minIq + (isCorrect / total) * (maxIq - minIq);

  return Math.floor(resultIq);
}
