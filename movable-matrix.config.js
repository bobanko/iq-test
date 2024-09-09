import { generateMovableQuestion } from "./movable-matrix.generator.js";
import { renderMovableQuestion } from "./matrix.renderer.js";

const _movableConfigs = {
  //  desc here
  color1ruleMix: {
    colorCount: 1, // how many cells will be painted
    ruleSet: 2, // [TRDL movement, diagonal, both, ...]

    // todo(vmyshko):  below is config from rotational, it not used as-is -- remove
    // UNUSED yet
    shiftColorsBetweenRows: false,
    noOverlap: false, // [2 and more] figs can overlap each other - have same deg
  },
  color1ruleOrt: {
    colorCount: 1, // how many cells will be painted
    ruleSet: 0,
  },
  color2ruleOrt: {
    colorCount: 2, // how many cells will be painted
    ruleSet: 0,
  },
  color2ruleDiag: {
    colorCount: 2, // how many cells will be painted
    ruleSet: 1,
  },
  color2ruleMix: {
    colorCount: 2, // how many cells will be painted
    ruleSet: 2,
  },
  color3ruleOrt: {
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
