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

// ===== Archetypes =====

const ARCHETYPES = {
  "slow-low": {
    name: "NPC Energy 💤",
    desc: "You took your time… and still missed. Maybe the test just wasn't your vibe.",
    motto: "I was just here for the atmosphere.",
  },
  "medium-low": {
    name: "Random Access Mind 💾",
    desc: "Average pace, random results. Your brain buffered through the whole test.",
    motto: "Loading… please wait.",
  },
  "fast-low": {
    name: "Chaotic Clicker 👾",
    desc: "You play fast, think faster, and sometimes just guess.",
    motto: "It works… somehow.",
  },
  "slow-medium": {
    name: "Slow Burn Genius 🧠",
    desc: "You think long and deep — not always right, but always thorough.",
    motto: "Give me 5 more minutes.",
  },
  "medium-medium": {
    name: "Pattern Addict 🧩",
    desc: "Balanced speed, balanced accuracy. The definition of consistent.",
    motto: "If it fits, it clicks.",
  },
  "fast-medium": {
    name: "Speed Demon ⚡️",
    desc: "Fast and mostly right. You trust your gut — and it usually delivers.",
    motto: "Done before you blinked.",
  },
  "slow-high": {
    name: "Lost Philosopher 🤯",
    desc: "Slow but deadly accurate. You question everything — and get it right.",
    motto: "I see the matrix.",
  },
  "medium-high": {
    name: "Confident Guesser 😎",
    desc: "Smooth pace, sharp mind. You make it look easy.",
    motto: "First try. Every time.",
  },
  "fast-high": {
    name: "Chaotic Genius 🔥",
    desc: "Blazing fast, eerily precise. You don't think — you just know.",
    motto: "Why walk when you can fly?",
  },
};

/**
 * @param {number} speed sec per question
 * @returns {"slow"|"medium"|"fast"} broad speed category
 */
function getBroadSpeedTier(speed) {
  if (speed < 15) return "fast";
  if (speed < 40) return "medium";
  return "slow";
}

/**
 * @param {number} accuracy fraction (0-1)
 * @returns {"low"|"medium"|"high"} broad accuracy category
 */
function getBroadAccuracyTier(accuracy) {
  if (accuracy < 0.3) return "low";
  if (accuracy < 0.8) return "medium";
  return "high";
}

/**
 * @param {number} speed sec per question
 * @param {number} accuracy fraction (0-1)
 */
export function getArchetype(speed, accuracy) {
  const speedTier = getBroadSpeedTier(speed);
  const accuracyTier = getBroadAccuracyTier(accuracy);
  return ARCHETYPES[`${speedTier}-${accuracyTier}`];
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
