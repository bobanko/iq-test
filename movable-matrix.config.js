import { generateMovableQuestion } from "./movable-matrix.generator.js";
import { renderMatrixQuestion } from "./matrix.renderer.js";

const _movableMatrixConfigs = {
  //  desc here
  color1ruleMix: {
    colorCount: 1, // how many cells will be painted
    ruleSet: 2, // [TRDL movement, diagonal, both, ...]
    // TO IMPL
    patternsInRow: 3,
    patternsInCol: 3,
    //
    mtxSize: 2,
    maxAnswerCount: 7,
    // todo(vmyshko):  below is config from rotational, it not used as-is -- remove
    // UNUSED yet
    shiftColorsBetweenRows: false,
    noOverlap: false, // [2 and more] figs can overlap each other - have same deg
  },
  color1ruleMix2: {
    colorCount: 1, // how many cells will be painted
    ruleSet: 2, // [TRDL movement, diagonal, both, ...]
    // TO IMPL
    patternsInRow: 2,
    patternsInCol: 2,
    //
    mtxSize: 2,
    maxAnswerCount: 7,
    // todo(vmyshko):  below is config from rotational, it not used as-is -- remove
    // UNUSED yet
    shiftColorsBetweenRows: false,
    noOverlap: false, // [2 and more] figs can overlap each other - have same deg
  },
  color1ruleOrt: {
    colorCount: 1, // how many cells will be painted
    ruleSet: 0,
    //
    patternsInRow: 4,
    patternsInCol: 4,
    //
    mtxSize: 3,
    maxAnswerCount: 7,
  },
  color2ruleOrt: {
    colorCount: 2, // how many cells will be painted
    ruleSet: 0,
    //
    patternsInRow: 5,
    patternsInCol: 5,
    //
    mtxSize: 2,
    // maxAnswerCount: 2,
  },
  color2ruleDiag: {
    colorCount: 2, // how many cells will be painted
    ruleSet: 1,
  },
  color2ruleMix: {
    colorCount: 2, // how many cells will be painted
    ruleSet: 2,
    mtxSize: 2,
  },
  color3ruleOrt: {
    colorCount: 3, // how many cells will be painted
    ruleSet: 2,
    //
    patternsInRow: 2,
    patternsInCol: 2,
    //
    mtxSize: 4,
  },
};

export const movableMatrixConfigs = Object.fromEntries(
  Object.entries(_movableMatrixConfigs).map((entry) => {
    const [_key, value] = entry;

    value.generator = generateMovableQuestion;
    value.renderer = renderMatrixQuestion;

    return entry;
  })
);
