export const TEMPLATES = {
  low: {
    intro: [
      "After careful analysis, we must inform",
      "Our algorithm reluctantly confirms that",
      "Statistically speaking, it appears that",
    ],
    subtitle: [
      (p, s) => `Top ${p}% • ${s} (everyone starts somewhere)`,
      (p, s) => `Top ${p}% • Potential detected`,
      (p, s) => `Top ${p}% • Room for improvement 💪`,
    ],
    thinking: {
      type: "Persistent Explorer",
      bullets: [
        "Keeps trying (respect)",
        "Learns from mistakes (eventually)",
        "Doesn't give up easily (or does?)",
        "Clicks with confidence",
        "Thinks outside the box (way outside)",
      ],
    },
    statsJokes: [
      (acc) => `${acc}% (we believe in you)`,
      (acc) => `${acc}% (room to grow)`,
      (acc) => `${acc}% (the journey begins)`,
    ],
    footer: [
      "Try again. Seriously → 420iq.lol",
      "You got this (probably) → 420iq.lol",
      "Beat this score → 420iq.lol",
    ],
    seal: ["Keep Going", "Work In Progress", "Not Giving Up"],
  },

  average: {
    intro: [
      "Our somewhat reliable test confirms that",
      "After extensive button pressing, we confirm that",
      "Results indicate (with mild confidence) that",
    ],
    subtitle: [
      (p, s) => `Top ${p}% • ${s} • Perfectly balanced`,
      (p, s) => `Top ${p}% • Statistically normal (in a good way)`,
      (p, s) => `Top ${p}% • ${s} (not bad honestly)`,
    ],
    thinking: {
      type: "Balanced Thinker",
      bullets: [
        "Solid logic (most of the time)",
        "Steady decisions (no panic detected)",
        "Reliable thinking (usually)",
        "Consistent performer",
        "Average speed, above average confidence",
      ],
    },
    statsJokes: [
      (acc) => `${acc}% (not bad)`,
      (acc) => `${acc}% (respectable)`,
      (acc) => `${acc}% (could be worse)`,
    ],
    footer: [
      "Not bad. But you can do better 😉 → 420iq.lol",
      "Think someone can beat you? → 420iq.lol",
      "Run it back → 420iq.lol",
    ],
    seal: ["Certified Average", "Doing Fine", "No Complaints"],
  },

  above: {
    intro: [
      "We are mildly impressed to confirm that",
      "Our test (which is totally legit) shows that",
      "Verified by our questionable methodology that",
    ],
    subtitle: [
      (p, s) => `Top ${p}% Worldwide • ${s}`,
      (p, s) => `Top ${p}% • Smarter than most (allegedly)`,
      (p, s) => `Top ${p}% • ${s} (we double-checked)`,
    ],
    thinking: {
      type: "Sharp Thinker",
      bullets: [
        "Recognizes patterns quickly (or got lucky)",
        "Makes confident decisions (sometimes too confident)",
        "Learns fast (unverified)",
        "Above average intuition",
        "Pattern radar: strong",
      ],
    },
    statsJokes: [
      (acc) => `${acc}% (nice)`,
      (acc) => `${acc}% (clean work)`,
      (acc) => `${acc}% (we see you)`,
    ],
    footer: [
      "Think you can go higher? → 420iq.lol",
      "Beat this score → 420iq.lol",
      "Challenge someone → 420iq.lol",
    ],
    seal: ["Certified Smart", "Above Average", "Officially Not Dumb"],
  },

  smart: {
    intro: [
      "After some serious pattern clicking, we confirm that",
      "Our algorithm is somewhat impressed that",
      "This semi-scientifically validates that",
    ],
    subtitle: [
      (p, s) => `Top ${p}% Worldwide • ${s}`,
      (p, s) => `Top ${p}% • You didn't guess. You knew.`,
      (p, s) => `Top ${p}% • ${s} (for real)`,
    ],
    thinking: {
      type: "Analytical Mind",
      bullets: [
        "Strong pattern recognition (no luck involved… maybe)",
        "Fast reasoning (we timed it)",
        "Efficient thinking (or efficient guessing)",
        "High processing speed",
        "Suspicious accuracy levels",
      ],
    },
    statsJokes: [
      (acc) => `${acc}% (impressive)`,
      (acc) => `${acc}% (solid)`,
      (acc) => `${acc}% (okay we're paying attention now)`,
    ],
    footer: [
      "Prove it again → 420iq.lol",
      "Think someone can beat you? → 420iq.lol",
      "Don't believe this? Check it → 420iq.lol",
    ],
    seal: ["Certified Smart", "Legit Results", "Brain Verified"],
  },

  gifted: {
    intro: [
      "This somewhat scientifically proves that",
      "After intense clicking and guessing, we conclude that",
      "According to our definitely real methodology,",
    ],
    subtitle: [
      (p, s) => `Top ${p}% Worldwide • ${s} (probably)`,
      (p, s) => `Top ${p}% Worldwide • Certified Smart™`,
      (p, s) => `Top ${p}% Worldwide (allegedly)`,
      (p, s) => `Top ${p}% • ${s} (we checked twice)`,
    ],
    thinking: {
      type: "Chaotic Genius",
      bullets: [
        "Sees patterns instantly",
        "Trusts intuition (and it works)",
        "Thinks faster than necessary",
        "Fast pattern recognition (or lucky guesses)",
        "Intuitive decisions (no idea why)",
        "High processing speed (sometimes wrong)",
      ],
    },
    statsJokes: [
      (acc) => `${acc}% (okay wow)`,
      (acc) => `${acc}% (this is getting serious)`,
    ],
    footer: [
      "We checked twice. Still high → 420iq.lol",
      "Think someone can beat you? → 420iq.lol",
      "Don't believe this? Check it here → 420iq.lol",
      "Beat this score → 420iq.lol",
    ],
    seal: ["Definitely Not Fake", "100% Legit", "Trust Me Bro Certified"],
  },

  genius: {
    intro: [
      "According to our highly questionable methodology,",
      "We are legally required to inform you that",
      "After reviewing results multiple times,",
    ],
    subtitle: [
      (p, s) => `Top ${p}% • ${s} (suspiciously high)`,
      (p, s) => `Top ${p}% • This is getting weird`,
      (p, s) => `Top ${p}% • We're not saying you cheated`,
      (p, s) => `Top ${p}% • Certified Smart™ (???)`,
    ],
    thinking: {
      type: "Reality Bender",
      bullets: [
        "Processes patterns instantly",
        "Makes decisions before thinking",
        "Possibly not human",
        "Fast pattern recognition (or magic)",
        "Intuitive decisions (???)",
        "High processing speed (unfair)",
      ],
    },
    statsJokes: [
      (acc) => `${acc}% (this is getting weird)`,
      (acc) => `${acc}% (we have questions)`,
    ],
    footer: [
      "Try to beat this (good luck) → 420iq.lol",
      "We have questions → 420iq.lol",
      "Think you're smarter? Prove it → 420iq.lol",
    ],
    seal: ["We Have Questions", "Suspiciously High", "Beyond Human Limits"],
  },
};
