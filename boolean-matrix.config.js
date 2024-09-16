import { renderMatrixQuestion } from "./matrix.renderer.js";
import {
  generateBooleanMatrixQuestion,
  ruleSets,
} from "./boolean-matrix.generator.js";

const _booleanMatrixConfigs = {
  add: {
    ruleSet: ruleSets.addRowPatterns,
    patternsInCol: 3,
    mtxSize: 3,
    // maxAnswerCount: 20,
  },
  sub: {
    ruleSet: ruleSets.subRowPatterns,
    patternsInCol: 3,
    mtxSize: 3,
  },
  colorDiff: {
    ruleSet: ruleSets.colorDiffRowPatterns,
    patternsInCol: 3,
    mtxSize: 3,
  },
  addSubColor: {
    ruleSet: ruleSets.addAndSubRowPatterns,
    patternsInCol: 3,
    mtxSize: 3,
  },
  xor: {
    ruleSet: ruleSets.xorRowPatterns,
    patternsInCol: 3,
    mtxSize: 3,
  },
  sumAll3: {
    ruleSet: ruleSets.sumAll3RowPatterns,
    patternsInCol: 3,
    mtxSize: 3,
  },
};

export const booleanMatrixConfigs = Object.fromEntries(
  Object.entries(_booleanMatrixConfigs).map((entry) => {
    const [_key, value] = entry;

    value.generator = generateBooleanMatrixQuestion;
    value.renderer = renderMatrixQuestion;

    return entry;
  })
);
