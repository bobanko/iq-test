import { generateMovableQuestion } from "./movable-matrix.generator.js";
import { renderMovableQuestion } from "./matrix.renderer.js";

const _movableConfigs = {
  //  desc here
  easy1: {
    colorCount: 1, // how many cells will be painted
    ruleSet: 2, // [TRDL movement, diagonal, both, ...]

    // todo(vmyshko):  below is config from rotational, it not used as-is -- remove
    // UNUSED yet
    shiftColorsBetweenRows: false,
    noOverlap: false, // [2 and more] figs can overlap each other - have same deg
  },
  medium2: {
    colorCount: 2, // how many cells will be painted
    ruleSet: 1,
  },
  hard3: {
    colorCount: 3, // how many cells will be painted
    ruleSet: 0,
  },
};

export const movableConfigs = Object.fromEntries(
  Object.entries(_movableConfigs).map((entry) => {
    const [_key, value] = entry;

    value.generator = generateMovableQuestion;
    value.renderer = renderMovableQuestion;

    return entry;
  })
);
