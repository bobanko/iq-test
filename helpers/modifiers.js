import { calculateMean, calculateStandardDeviation } from "./statistics.js";

// ===== Modifiers =====

const MODIFIERS = {
  "fast-thinker": {
    label: "Fast Thinker",
    emoji: "⚡️",
    color: "#e5f2fe",
  },
  "coinflip-master": {
    label: "Coinflip Master",
    emoji: "🎲",
    color: "#fdf4d2",
  },
  "slow-and-steady": {
    label: "Slow and Steady",
    emoji: "🛡️",
    color: "#e8f5e9",
  },
  unpredictable: {
    label: "Unpredictable",
    emoji: "🎲",
    color: "#fedfe9",
  },
  chaos: {
    label: "Chaos",
    emoji: "⚔️",
    color: "#fedfe9",
  },
  "streak-god": {
    label: "Streak God",
    emoji: "🔥",
    color: "#fff3e0",
  },
  "risk-taker": {
    label: "Risk Taker",
    emoji: "🏎️",
    color: "#fdf4d2",
  },
  overthinker: {
    label: "Overthinker",
    emoji: "☁️",
    color: "#f3e8fd",
  },
  "last-minute": {
    label: "Last Minute",
    emoji: "⏱️",
    color: "#fff3e0",
  },
  glitch: {
    label: "Glitch",
    emoji: "🎮",
    color: "#f6f7f9",
  },
  "pure-guess": {
    label: "Pure Guess",
    emoji: "🎰",
    color: "#fdf4d2",
  },
  bot: {
    label: "Bot",
    emoji: "🤖",
    color: "#e0e0e0",
  },
  "panic-mode": {
    label: "Panic Mode",
    emoji: "😱",
    color: "#fedfe9",
  },
  "reptile-brain": {
    label: "Reptile Brain",
    emoji: "🦎",
    color: "#e8f5e9",
  },
  "quantum-potato": {
    label: "Quantum Potato",
    emoji: "🥔",
    color: "#f5f0e1",
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

  // Streak God — streak ≥ 8 correct in a row
  if (getLongestCorrectStreak(answers) >= 8) {
    matched.push(MODIFIERS["streak-god"]);
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

  // Pure Guess — >60% of answers <3s
  const ultraFastRatio =
    answers.filter((a) => a.isAnswered && a.timeSpent / 1000 < 3).length /
    total;
  if (ultraFastRatio > 0.6) {
    matched.push(MODIFIERS["pure-guess"]);
  }

  // Bot — answered 0–2 questions
  const answeredCount = answers.filter((a) => a.isAnswered).length;
  if (answeredCount <= 2) {
    matched.push(MODIFIERS["bot"]);
  }

  // Reptile Brain — very fast answers and accuracy > 50%
  if (avgSpeedSec < 5 && accuracy > 0.5) {
    matched.push(MODIFIERS["reptile-brain"]);
  }

  // Quantum Potato — alternating correct/incorrect streak ≥ 8
  if (getLongestAlternatingStreak(answers) >= 8) {
    matched.push(MODIFIERS["quantum-potato"]);
  }

  // Panic Mode — last 10 questions avg speed < 50% of first 30
  if (total > 10) {
    const firstPart = perQuestionSec.slice(0, -10);
    const lastPart = perQuestionSec.slice(-10);
    const firstAvg = calculateMean(firstPart);
    const lastAvg = calculateMean(lastPart);
    if (lastAvg < firstAvg * 0.5) {
      matched.push(MODIFIERS["panic-mode"]);
    }
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

function getLongestAlternatingStreak(answers) {
  let max = 1;
  let current = 1;
  for (let i = 1; i < answers.length; i++) {
    const prev = answers[i - 1].isCorrect;
    const curr = answers[i].isCorrect;
    if (prev !== null && curr !== null && prev !== curr) {
      current++;
      if (current > max) max = current;
    } else {
      current = 1;
    }
  }
  return max;
}
