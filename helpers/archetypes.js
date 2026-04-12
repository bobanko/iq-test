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
