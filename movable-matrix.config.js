import { generateMovableQuestion } from "./movable-matrix.generator.js";
import { renderMovableQuestion } from "./matrix.renderer.js";

const _movableConfigs = {
  //  desc here
  easy1: {
    // todo(vmyshko):
    // each fig has colors arr, as svgs
    // ? arr should be shared between figs, if you want unique figs took once?
    // same for colors
    // fig can be fixed/static, no rule for it, for static bgs, but startDeg still applies
    // OR put static figs separately?
    // fig order applies as z-index (naturally)
    // mirroring should be avail. same as degs for each fig.

    figs: [
      {
        pickFrom: [],
        startDeg: 0, // initial rotation, before rules: 0, -45
        stepDeg: 45, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
        // colorsFrom: ["black", "red", "green"],
      },
    ],

    shiftColorsBetweenRows: false,
    onlyUniqueFigs: true, // [2 and more]
    noOverlap: false, // [2 and more] figs can overlap each other - have same deg
    answerCount: 6, // how many answers to generate per question
  },
  medium2: {},
  hard3: {},
};

export const movableConfigs = Object.fromEntries(
  Object.entries(_movableConfigs).map((entry) => {
    const [_key, value] = entry;

    value.generator = generateMovableQuestion;
    value.renderer = renderMovableQuestion;

    return entry;
  })
);
