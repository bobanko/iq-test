import { renderMatrixQuestion } from "./matrix.renderer.js";
import { generateBooleanMatrixQuestion } from "./boolean-matrix.generator.js";

const _booleanMatrixConfigs = {
  //  desc here
  add2x2: {
    colorCount: 1, // how many cells will be painted
    ruleSet: 0,
    // TO IMPL
    patternsInCol: 3,
    mtxSize: 3,
    // maxAnswerCount: 20,
  },
  sub2x2: {
    colorCount: 1, // how many cells will be painted
    ruleSet: 1,
    // TO IMP
    patternsInCol: 3,
    mtxSize: 3,
    // maxAnswerCount: 20,
  },
  colorDiff2x2: {
    colorCount: 1, // how many cells will be painted
    ruleSet: 2,
    // TO IMP
    patternsInCol: 3,
    mtxSize: 3,
    // maxAnswerCount: 20,
  },
  colorAddSubColor2x2: {
    colorCount: 1, // how many cells will be painted
    ruleSet: 3,
    // TO IMP
    patternsInCol: 3,
    mtxSize: 3,
    // maxAnswerCount: 20,
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
