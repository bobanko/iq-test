import { renderMatrixQuestion } from "./matrix.renderer.js";
import { generateBooleanMatrixQuestion } from "./boolean-matrix.generator.js";

const _booleanMatrixConfigs = {
  //  desc here
  add: {
    ruleSet: 0,
    patternsInCol: 3,
    mtxSize: 3,
    // maxAnswerCount: 20,
  },
  sub: {
    ruleSet: 1,
    patternsInCol: 3,
    mtxSize: 3,
    // maxAnswerCount: 20,
  },
  colorDiff: {
    ruleSet: 2,
    patternsInCol: 3,
    mtxSize: 3,
    // maxAnswerCount: 20,
  },
  addSubColor: {
    ruleSet: 3,
    patternsInCol: 3,
    mtxSize: 3,
    // maxAnswerCount: 20,
  },
  xor: {
    ruleSet: 4,
    patternsInCol: 3,
    mtxSize: 3,
    // maxAnswerCount: 20,
  },
  sumAll3: {
    ruleSet: 5,
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
