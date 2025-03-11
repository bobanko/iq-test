export function calcStaticIqByStats(stats) {
  const minIq = 60;
  const maxIq = 140;

  const { isCorrect, total } = stats;

  return minIq + (isCorrect / total) * (maxIq - minIq);
}
