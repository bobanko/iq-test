import { renderMatrixQuestion } from "./matrix.renderer.js";
import {
  generateBooleanMatrixQuestion,
  ruleSets,
} from "./boolean-matrix.generator.js";

export const booleanMatrixConfigs = {
  iq7_vseq_colorDiff: {
    ruleSet: ruleSets.colorDiffRowPatterns,
    patternsInCol: 3,
    mtxSize: 3,

    // todo(vmyshko): impl v sequence?
    generator: generateBooleanMatrixQuestion,
    renderer: renderMatrixQuestion,
  },

  iq8_sub: {
    ruleSet: ruleSets.subRowPatterns,
    patternsInCol: 3,
    mtxSize: 3,

    generator: generateBooleanMatrixQuestion,
    renderer: renderMatrixQuestion,
  },

  iq9_add: {
    ruleSet: ruleSets.addRowPatterns,
    patternsInCol: 3,
    mtxSize: 3,
    // maxAnswerCount: 20,

    generator: generateBooleanMatrixQuestion,
    renderer: renderMatrixQuestion,
  },

  iq10_addSubColor: {
    ruleSet: ruleSets.addAndSubRowPatterns,
    patternsInCol: 3,
    mtxSize: 3,

    generator: generateBooleanMatrixQuestion,
    renderer: renderMatrixQuestion,
  },
  xor: {
    ruleSet: ruleSets.xorRowPatterns,
    patternsInCol: 3,
    mtxSize: 3,

    generator: generateBooleanMatrixQuestion,
    renderer: renderMatrixQuestion,
  },
  sumAll3: {
    ruleSet: ruleSets.sumAll3RowPatterns,
    patternsInCol: 3,
    mtxSize: 3,

    generator: generateBooleanMatrixQuestion,
    renderer: renderMatrixQuestion,
  },
};
