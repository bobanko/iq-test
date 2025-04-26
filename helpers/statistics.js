export function calculateMean(values) {
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
}

export function calculateStandardDeviation(values, mean) {
  const squaredDiffs = values.map((v) => (v - mean) ** 2);

  const squaredDiffsMean = calculateMean(squaredDiffs);

  return Math.sqrt(squaredDiffsMean);
}

export function calculateIQ({ rawScore, mean, standardDeviation }) {
  const baseIq = 100;
  const standardStep = 15; //standard step for iq tests
  return baseIq + ((rawScore - mean) / standardDeviation) * standardStep;
}
