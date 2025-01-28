import {
  generateMovableQuestion,
  movableMatrixRuleSets,
} from "./movable-matrix.generator.js";
import { renderMatrixQuestion } from "./matrix.renderer.js";

export const movableMatrixConfigs = {
  // iq1_
  // todo(vmyshko): impl move several cells in one direction, same color

  // this is orig question #2 from international-iq-test.com
  iq2_1cellMoveH2row: {
    colorCount: 1, // how many cells will be painted
    ruleSet: movableMatrixRuleSets.orthogonal,
    //
    patternsInRow: 3,
    patternsInCol: 2,
    //
    mtxSize: 3,
    maxAnswerCount: 6,

    // todo(vmyshko): should be possible to use only one color for all rows
    // same rule both rows
    generator: generateMovableQuestion,
    renderer: renderMatrixQuestion,
  },
  iq3_2cellMoveH: {
    colorCount: 2,
    ruleSet: movableMatrixRuleSets.orthogonal,
    //
    patternsInRow: 3,
    patternsInCol: 3,
    //
    mtxSize: 3,
    maxAnswerCount: 6,
    // two cells bidirectional but both H
    // todo(vmyshko): impl for otho two subsets H and V
    generator: generateMovableQuestion,
    renderer: renderMatrixQuestion,
  },
  iq5_Vseq2cellMoveV2row: {
    colorCount: 2,
    ruleSet: movableMatrixRuleSets.orthogonal,
    //
    patternsInRow: 3,
    patternsInCol: 2,
    //
    mtxSize: 3,
    maxAnswerCount: 6,
    // todo(vmyshko): allow vertical sequences
    // two cells diff colors move V, V sequence
    generator: generateMovableQuestion,
    renderer: renderMatrixQuestion,
  },

  color1ruleMix: {
    colorCount: 1,
    ruleSet: movableMatrixRuleSets.mixed,
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

    generator: generateMovableQuestion,
    renderer: renderMatrixQuestion,
  },
  color1ruleMix2: {
    colorCount: 1,
    ruleSet: movableMatrixRuleSets.mixed,
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

    generator: generateMovableQuestion,
    renderer: renderMatrixQuestion,
  },
  color1ruleOrt: {
    colorCount: 1,
    ruleSet: movableMatrixRuleSets.orthogonal,
    //
    patternsInRow: 4,
    patternsInCol: 4,
    //
    mtxSize: 3,
    maxAnswerCount: 7,

    generator: generateMovableQuestion,
    renderer: renderMatrixQuestion,
  },
  color2ruleOrt: {
    colorCount: 2,
    ruleSet: movableMatrixRuleSets.orthogonal,
    //
    patternsInRow: 5,
    patternsInCol: 5,
    //
    mtxSize: 2,
    // maxAnswerCount: 2,

    generator: generateMovableQuestion,
    renderer: renderMatrixQuestion,
  },
  color2ruleDiag: {
    colorCount: 2,
    ruleSet: movableMatrixRuleSets.diagonal,

    generator: generateMovableQuestion,
    renderer: renderMatrixQuestion,
  },
  color2ruleMix: {
    colorCount: 2,
    ruleSet: movableMatrixRuleSets.mixed,
    mtxSize: 2,

    generator: generateMovableQuestion,
    renderer: renderMatrixQuestion,
  },
  color3ruleOrt: {
    colorCount: 3,
    ruleSet: movableMatrixRuleSets.mixed,
    //
    patternsInRow: 2,
    patternsInCol: 2,
    //
    mtxSize: 4,

    generator: generateMovableQuestion,
    renderer: renderMatrixQuestion,
  },
};
