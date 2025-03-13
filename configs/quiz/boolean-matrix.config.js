import {
  generateBooleanMatrixQuestion,
  ruleSets,
} from "../../generators/boolean-matrix.generator.js";
import { renderMatrixQuestion } from "../../renderers/matrix.renderer.js";

export const booleanMatrixConfigs = {
  iq07_mtxbool_vseq_colorDiff: {
    order: 7,
    ruleSet: ruleSets.colorDiffRowPatterns,
    patternsInCol: 3,
    mtxSize: 3,

    // todo(vmyshko): impl v sequence?
    // can be done simply using grid-auto-flow: column; on $patternArea
    generator: generateBooleanMatrixQuestion,
    renderer: renderMatrixQuestion,
  },

  // todo(vmyshko): both origs excluded as too easy
  iq08_d1_mtxbool_sub: {
    skip: true,
    order: 8,
    ruleSet: ruleSets.subRowPatterns,
    patternsInCol: 3,
    mtxSize: 3,

    generator: generateBooleanMatrixQuestion,
    renderer: renderMatrixQuestion,
  },

  iq09_d1_mtxbool_add: {
    skip: true,
    order: 9,
    ruleSet: ruleSets.addRowPatterns,
    patternsInCol: 3,
    mtxSize: 3,
    // maxAnswerCount: 20,

    generator: generateBooleanMatrixQuestion,
    renderer: renderMatrixQuestion,
  },

  iq10_mtxbool_addSubColor: {
    order: 10,
    ruleSet: ruleSets.addAndSubRowPatterns,
    patternsInCol: 3,
    mtxSize: 3,

    generator: generateBooleanMatrixQuestion,
    renderer: renderMatrixQuestion,
  },

  iq08alt_mtxbool_xor: {
    order: 8,
    ruleSet: ruleSets.xorRowPatterns,
    patternsInCol: 3,
    mtxSize: 3,

    generator: generateBooleanMatrixQuestion,
    renderer: renderMatrixQuestion,
  },

  iq09alt_mtxbool_sumAll3: {
    order: 9,
    ruleSet: ruleSets.sumAll3RowPatterns,
    patternsInCol: 3,
    mtxSize: 3,

    generator: generateBooleanMatrixQuestion,
    renderer: renderMatrixQuestion,
  },
};
