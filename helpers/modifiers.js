import { calculateMean, calculateStandardDeviation } from "./statistics.js";

// ===== Modifiers =====

const MODIFIERS = {
  "fast-thinker": {
    label: "Fast Thinker",
    emoji: "bolt",
    color: "#e5f2fe",
  },
  "coinflip-master": {
    label: "Coinflip Master",
    emoji: "dice",
    color: "#fdf4d2",
  },
  "slow-and-steady": {
    label: "Slow and Steady",
    emoji: "shield",
    color: "#e8f5e9",
  },
  unpredictable: {
    label: "Unpredictable",
    emoji: "dice",
    color: "#fedfe9",
  },
  chaos: {
    label: "Chaos",
    emoji: "swords",
    color: "#fedfe9",
  },
  "precision-streak": {
    label: "Precision Streak",
    emoji: "direct-hit",
    color: "#e5f2fe",
  },
  "risk-taker": {
    label: "Risk Taker",
    emoji: "racing-car",
    color: "#fdf4d2",
  },
  overthinker: {
    label: "Overthinker",
    emoji: "cloud",
    color: "#f3e8fd",
  },
  "last-minute": {
    label: "Last Minute",
    emoji: "stopwatch",
    color: "#fff3e0",
  },
  glitch: {
    label: "Glitch",
    emoji: "video-game",
    color: "#f6f7f9",
  },
};

const MAX_MODIFIERS = 3;

/**
 * @param {Array<{isCorrect: boolean|null, isAnswered: boolean, timeSpent: number}>} answers per-question data
 * @returns {Array<{label: string, emoji: string, color: string}>} 1–3 modifiers
 */
export function getModifiers(answers) {
  const matched = [];

  const totalTimeMs = answers.reduce((s, a) => s + a.timeSpent, 0);
  const totalTimeSec = totalTimeMs / 1000;
  const totalTimeMin = totalTimeSec / 60;
  const total = answers.length;
  const accuracy = answers.filter((a) => a.isCorrect === true).length / total;
  const avgSpeedSec = totalTimeSec / total;

  const perQuestionSec = answers.map((a) => a.timeSpent / 1000);
  const timeMean = calculateMean(perQuestionSec);
  const timeStd = calculateStandardDeviation(perQuestionSec, timeMean);
  const timeMedian = getMedian(perQuestionSec);

  // Fast Thinker — t < 10 min and A >= 0.4
  if (totalTimeMin < 10 && accuracy >= 0.4) {
    matched.push(MODIFIERS["fast-thinker"]);
  }

  // Coinflip Master — A < 0.25 and avg speed < 8s
  if (accuracy < 0.25 && avgSpeedSec < 8) {
    matched.push(MODIFIERS["coinflip-master"]);
  }

  // Slow and Steady — t > 30 min and A >= 0.7
  if (totalTimeMin > 30 && accuracy >= 0.7) {
    matched.push(MODIFIERS["slow-and-steady"]);
  }

  // Unpredictable — high dispersion of time and accuracy
  if (timeStd > 1.5 * timeMedian && accuracy > 0.2 && accuracy < 0.7) {
    matched.push(MODIFIERS["unpredictable"]);
  }

  // Chaos — σ_time > 1.5 × median
  if (timeStd > 1.5 * timeMedian) {
    matched.push(MODIFIERS["chaos"]);
  }

  // Precision Streak — streak ≥ 6 correct in a row
  if (getLongestCorrectStreak(answers) >= 6) {
    matched.push(MODIFIERS["precision-streak"]);
  }

  // Risk Taker — many fast answers (<5s) and low accuracy
  const fastAnswerRatio =
    answers.filter((a) => a.timeSpent / 1000 < 5).length / total;
  if (fastAnswerRatio > 0.4 && accuracy < 0.4) {
    matched.push(MODIFIERS["risk-taker"]);
  }

  // Overthinker — has questions with time > median + 2σ
  const overthinkThreshold = timeMedian + 2 * timeStd;
  const overthinkCount = perQuestionSec.filter(
    (t) => t > overthinkThreshold,
  ).length;
  if (overthinkCount >= 3) {
    matched.push(MODIFIERS["overthinker"]);
  }

  // Last Minute — >60% of answers in the last 10% of total time
  const timeThreshold = totalTimeMs * 0.9;
  let cumulativeTime = 0;
  let answersInLastChunk = 0;
  for (const answer of answers) {
    cumulativeTime += answer.timeSpent;
    if (cumulativeTime > timeThreshold && answer.isAnswered) {
      answersInLastChunk++;
    }
  }
  if (answersInLastChunk / total > 0.6) {
    matched.push(MODIFIERS["last-minute"]);
  }

  // Glitch — >15% unanswered
  const skippedRatio = answers.filter((a) => !a.isAnswered).length / total;
  if (skippedRatio > 0.15) {
    matched.push(MODIFIERS["glitch"]);
  }

  return matched.slice(0, MAX_MODIFIERS);
}

function getMedian(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function getLongestCorrectStreak(answers) {
  let max = 0;
  let current = 0;
  for (const a of answers) {
    if (a.isCorrect === true) {
      current++;
      if (current > max) max = current;
    } else {
      current = 0;
    }
  }
  return max;
}
