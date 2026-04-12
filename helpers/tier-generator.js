import { getSeededRandom } from "./seeded-random.js";
import { TEMPLATES } from "./tier-templates.js";

/**
 * @param {number} iq 60-140
 * @returns iq tier
 */
export function getIQTier(iq) {
  if (iq < 65) return "low";
  if (iq < 80) return "average";
  if (iq < 100) return "above";
  if (iq < 120) return "smart";
  if (iq < 135) return "gifted";
  return "genius";
}

/**
 * @param {number} accuracy % of correct answers
 * @returns accuracy tier
 */
export function getAccuracyTier(accuracy) {
  if (accuracy < 0.1) return "lowest";
  if (accuracy < 0.15) return "very-low";
  if (accuracy < 0.3) return "low";
  if (accuracy < 0.6) return "medium";
  if (accuracy < 0.8) return "above-medium";
  return "high";
}

/**
 * @param {number} speed sec per question
 * @returns speed tier
 */
export function getSpeedTier(speed) {
  if (speed < 1) return "skipper";
  if (speed < 5) return "blazing";
  if (speed < 10) return "very-fast";
  if (speed < 15) return "fast";

  if (speed < 25) return "above-medium";
  if (speed < 30) return "medium";
  if (speed < 40) return "below-medium";
  if (speed < 50) return "slow";
  if (speed < 60) return "very-slow";

  return "crawl";
}

// ===== Generator =====

export function generateCertificateText({
  name,
  iq,
  accuracy,
  time,
  correct,
  total,
  seed,
}) {
  const randomFn = getSeededRandom(seed);

  function pick(arr) {
    return arr[Math.floor(randomFn() * arr.length)];
  }

  const tier = getIQTier(iq);
  const t = TEMPLATES[tier];

  const accText = pick(t.statsJokes)(accuracy);

  return {
    name,
    iq,

    intro: pick(t.intro),
    subtitle: pick(t.subtitle),

    stats: {
      accuracy: accText,
      time: `${time} (${pick([
        "no bathroom breaks",
        "locked in",
        "focused",
        "zero distractions",
      ])})`,
      questions: `${correct}/${total} (${pick([
        "we don't talk about the rest",
        "clean",
        "almost perfect",
        "close enough",
      ])})`,
    },

    thinkingType: t.thinking.type,
    thinkingBullets: t.thinking.bullets.slice(0, 3),

    footer: pick(t.footer),
    seal: pick(t.seal),

    tier,
  };
}
