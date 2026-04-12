export const TEMPLATES = {
  low: {
    intro: [
      "This certifies that",
      "After some effort, we confirm that",
      "Statistically speaking, it appears that",
    ],
    subtitle: [
      "Room for improvement • Keep going 💪",
      "Everyone starts somewhere",
      "Potential detected",
    ],
    thinking: {
      type: "Persistent Explorer",
      bullets: [
        "Keeps trying",
        "Learns from mistakes",
        "Doesn't give up easily",
      ],
    },
    statsJokes: [
      (acc) => `${acc}% (we believe in you)`,
      (acc) => `${acc}% (room to grow)`,
    ],
    footer: ["Try again → 420iq.lol", "You got this → 420iq.lol"],
    seal: ["Keep Going", "Work In Progress"],
  },

  average: {
    intro: [
      "This certifies that",
      "Officially confirmed that",
      "Results indicate that",
    ],
    subtitle: [
      "Right in the middle • Perfectly balanced",
      "Solid, consistent performance",
      "Statistically normal (in a good way)",
    ],
    thinking: {
      type: "Balanced Thinker",
      bullets: ["Solid logic", "Steady decisions", "Reliable thinking"],
    },
    statsJokes: [
      (acc) => `${acc}% (not bad)`,
      (acc) => `${acc}% (respectable)`,
    ],
    footer: [
      "Not bad. But you can do better 😉 → 420iq.lol",
      "Try again → 420iq.lol",
    ],
    seal: ["Certified Average", "Doing Fine"],
  },

  above: {
    intro: [
      "This certifies that",
      "We are pleased to confirm that",
      "Verified by our system that",
    ],
    subtitle: [
      "Above average • You're doing well",
      "Smarter than most",
      "Clearly above the baseline",
    ],
    thinking: {
      type: "Sharp Thinker",
      bullets: [
        "Recognizes patterns quickly",
        "Makes confident decisions",
        "Learns fast",
      ],
    },
    statsJokes: [(acc) => `${acc}% (nice)`, (acc) => `${acc}% (clean work)`],
    footer: ["Think you can go higher? → 420iq.lol", "Run it back → 420iq.lol"],
    seal: ["Certified Smart", "Above Average"],
  },

  smart: {
    intro: [
      "This certifies that",
      "Officially recognized that",
      "Validated by our test that",
    ],
    subtitle: [
      "Top ~10% • Definitely smart",
      "You didn't guess. You knew.",
      "Strong cognitive performance",
    ],
    thinking: {
      type: "Analytical Mind",
      bullets: [
        "Strong pattern recognition",
        "Fast reasoning",
        "Efficient thinking",
      ],
    },
    statsJokes: [(acc) => `${acc}% (impressive)`, (acc) => `${acc}% (solid)`],
    footer: [
      "Prove it again → 420iq.lol",
      "Think someone can beat you? → 420iq.lol",
    ],
    seal: ["Certified Smart", "Legit Results"],
  },

  gifted: {
    intro: [
      "This somewhat scientifically proves that",
      "After intense clicking and guessing, we conclude that",
      "According to our definitely real methodology,",
    ],
    subtitle: [
      "Top 1% Worldwide • Gifted (probably)",
      "Certified Smart™",
      "Top 1% Worldwide (allegedly)",
      "Gifted Intelligence Range (we checked twice)",
      "Probably Smart",
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
      "We are legally required to say that",
      "After reviewing results multiple times,",
    ],
    subtitle: [
      "Top 0.1% • Suspiciously high",
      "This is getting weird",
      "We're not saying you cheated",
      "Certified Smart™ (???)",
    ],
    thinking: {
      type: "Reality Bender",
      bullets: [
        "Processes patterns instantly",
        "Makes decisions before thinking",
        "Possibly not human",
        "Fast pattern recognition (or magic)",
        "Intuitive decisions (??? )",
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
