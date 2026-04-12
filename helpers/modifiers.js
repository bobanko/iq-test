import { calculateMean, calculateStandardDeviation } from "./statistics.js";

// ===== Helpers =====

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

// ===== Modifiers =====

const MODIFIERS = [
  {
    label: "Fast Thinker",
    emoji: "⚡️",
    color: "#e5f2fe",
    check: (ctx) => ctx.totalTimeMin < 10 && ctx.accuracy >= 0.4,
  },
  {
    label: "Coinflip Master",
    emoji: "🎲",
    color: "#fdf4d2",
    check: (ctx) => ctx.accuracy < 0.25 && ctx.avgSpeedSec < 8,
  },
  {
    label: "Slow and Steady",
    emoji: "🛡️",
    color: "#e8f5e9",
    check: (ctx) => ctx.totalTimeMin > 30 && ctx.accuracy >= 0.7,
  },
  {
    label: "Unpredictable",
    emoji: "🎲",
    color: "#fedfe9",
    check: (ctx) =>
      ctx.timeStd > 1.5 * ctx.timeMedian &&
      ctx.accuracy > 0.2 &&
      ctx.accuracy < 0.7,
  },
  {
    label: "Chaos",
    emoji: "⚔️",
    color: "#fedfe9",
    check: (ctx) => ctx.timeStd > 1.5 * ctx.timeMedian,
  },
  {
    label: "Streak God",
    emoji: "🔥",
    color: "#fff3e0",
    check: (ctx) => getLongestCorrectStreak(ctx.answers) >= 8,
  },
  {
    label: "Risk Taker",
    emoji: "🏎️",
    color: "#fdf4d2",
    check: (ctx) =>
      ctx.answers.filter((a) => a.timeSpent / 1000 < 5).length / ctx.total >
        0.4 && ctx.accuracy < 0.4,
  },
  {
    label: "Overthinker",
    emoji: "☁️",
    color: "#f3e8fd",
    check: (ctx) => {
      const threshold = ctx.timeMedian + 2 * ctx.timeStd;
      return ctx.perQuestionSec.filter((t) => t > threshold).length >= 3;
    },
  },
  {
    label: "Last Minute",
    emoji: "⏱️",
    color: "#fff3e0",
    check: (ctx) => {
      const timeThreshold = ctx.totalTimeMs * 0.9;
      let cumulative = 0;
      let count = 0;
      for (const a of ctx.answers) {
        cumulative += a.timeSpent;
        if (cumulative > timeThreshold && a.isAnswered) count++;
      }
      return count / ctx.total > 0.6;
    },
  },
  {
    label: "Glitch",
    emoji: "🎮",
    color: "#f6f7f9",
    check: (ctx) =>
      ctx.answers.filter((a) => !a.isAnswered).length / ctx.total > 0.15,
  },
  {
    label: "Pure Guess",
    emoji: "🎰",
    color: "#fdf4d2",
    check: (ctx) =>
      ctx.answers.filter((a) => a.isAnswered && a.timeSpent / 1000 < 3).length /
        ctx.total >
      0.6,
  },
  {
    label: "Bot",
    emoji: "🤖",
    color: "#e0e0e0",
    check: (ctx) => ctx.answers.filter((a) => a.isAnswered).length <= 2,
  },
  {
    label: "Reptile Brain",
    emoji: "🦎",
    color: "#e8f5e9",
    check: (ctx) => ctx.avgSpeedSec < 5 && ctx.accuracy > 0.5,
  },
  {
    label: "Quantum Potato",
    emoji: "🥔",
    color: "#f5f0e1",
    check: (ctx) => getLongestAlternatingStreak(ctx.answers) >= 8,
  },
  {
    label: "Panic Mode",
    emoji: "😱",
    color: "#fedfe9",
    check: (ctx) => {
      if (ctx.total <= 10) return false;
      const firstAvg = calculateMean(ctx.perQuestionSec.slice(0, -10));
      const lastAvg = calculateMean(ctx.perQuestionSec.slice(-10));
      return lastAvg < firstAvg * 0.5;
    },
  },
];

const MAX_MODIFIERS = 5;

/**
 * @param {Array<{isCorrect: boolean|null, isAnswered: boolean, timeSpent: number}>} answers per-question data
 * @returns {Array<{label: string, emoji: string, color: string}>} 1–3 modifiers
 */
export function getModifiers(answers) {
  const totalTimeMs = answers.reduce((s, a) => s + a.timeSpent, 0);
  const totalTimeSec = totalTimeMs / 1000;
  const total = answers.length;
  const perQuestionSec = answers.map((a) => a.timeSpent / 1000);

  const ctx = {
    answers,
    total,
    totalTimeMs,
    totalTimeMin: totalTimeSec / 60,
    avgSpeedSec: totalTimeSec / total,
    accuracy: answers.filter((a) => a.isCorrect === true).length / total,
    perQuestionSec,
    timeStd: calculateStandardDeviation(
      perQuestionSec,
      calculateMean(perQuestionSec),
    ),
    timeMedian: getMedian(perQuestionSec),
  };

  return MODIFIERS.filter((m) => m.check(ctx)).slice(0, MAX_MODIFIERS);
}
