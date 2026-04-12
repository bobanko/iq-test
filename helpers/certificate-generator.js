import { getSeededRandom } from "./seeded-random.js";
import { TEMPLATES } from "./certificate-templates.js";

export function getIQTier(iq) {
  if (iq < 65) return "low";
  if (iq < 80) return "average";
  if (iq < 100) return "above";
  if (iq < 120) return "smart";
  if (iq < 135) return "gifted";
  return "genius";
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
