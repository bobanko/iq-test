import { renderMatrixQuestion } from "./matrix.renderer.js";
import {
  generateBooleanMatrixQuestion,
  ruleSets,
} from "./boolean-matrix.generator.js";

export const booleanMatrixConfigs = {
  mtxbool_vseq_colorDiff_iq7: {
    ruleSet: ruleSets.colorDiffRowPatterns,
    patternsInCol: 3,
    mtxSize: 3,

    // todo(vmyshko): impl v sequence?
    generator: generateBooleanMatrixQuestion,
    renderer: renderMatrixQuestion,
  },

  // todo(vmyshko): both origs excluded as too easy
  // d1_mtxbool_sub_iq8: {
  //   ruleSet: ruleSets.subRowPatterns,
  //   patternsInCol: 3,
  //   mtxSize: 3,

  //   generator: generateBooleanMatrixQuestion,
  //   renderer: renderMatrixQuestion,
  // },

  // d1_mtxbool_add_iq9: {
  //   ruleSet: ruleSets.addRowPatterns,
  //   patternsInCol: 3,
  //   mtxSize: 3,
  //   // maxAnswerCount: 20,

  //   generator: generateBooleanMatrixQuestion,
  //   renderer: renderMatrixQuestion,
  // },

  mtxbool_addSubColor_iq10: {
    ruleSet: ruleSets.addAndSubRowPatterns,
    patternsInCol: 3,
    mtxSize: 3,

    generator: generateBooleanMatrixQuestion,
    renderer: renderMatrixQuestion,
  },
  mtxbool_xor: {
    ruleSet: ruleSets.xorRowPatterns,
    patternsInCol: 3,
    mtxSize: 3,

    generator: generateBooleanMatrixQuestion,
    renderer: renderMatrixQuestion,
  },
  mtxbool_sumAll3: {
    ruleSet: ruleSets.sumAll3RowPatterns,
    patternsInCol: 3,
    mtxSize: 3,

    generator: generateBooleanMatrixQuestion,
    renderer: renderMatrixQuestion,
  },
};
