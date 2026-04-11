import { calcStaticIqByStats } from "../calc-iq.js";

// ===== Best IQ per user =====

export function getBestIqPerUser(allResults) {
  const bestIqByUser = {};
  for (const result of allResults) {
    const userId = result._userId;
    const iq = calcStaticIqByStats(result.stats);
    if (!(userId in bestIqByUser) || iq > bestIqByUser[userId]) {
      bestIqByUser[userId] = iq;
    }
  }
  return bestIqByUser;
}

// ===== Ranking stats for a given IQ =====

export function calcRankingStats(allBestIqs, targetIq) {
  const sorted = allBestIqs.toSorted((a, b) => b - a);
  const totalCount = sorted.length;

  const globalRank = 1 + sorted.filter((iq) => iq > targetIq).length;

  const belowCount = sorted.filter((iq) => iq < targetIq).length;
  const sameCount = sorted.filter((iq) => iq === targetIq).length;
  const percentileRank = ((belowCount + sameCount / 2) / totalCount) * 100;
  const topPercent = 100 - percentileRank;

  return { globalRank, percentileRank, topPercent, totalCount };
}
