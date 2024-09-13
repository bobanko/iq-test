import { generateBooleanLinesQuestion } from "./boolean-lines.generator.js";
import { renderFiguresQuestion } from "./figures.renderer.js";

const _booleanMatrixConfigs = {
  xor4: {
    ruleSet: 0,
    patternsInCol: 3,
    figureCount: 4,
    // maxAnswerCount: 20,
  },
  xor8: {
    ruleSet: 0,
    patternsInCol: 3,
    figureCount: 8,
  },
};

// todo(vmyshko): get rid of this patcher, keep everything in config obj instead
export const booleanLinesConfigs = Object.fromEntries(
  Object.entries(_booleanMatrixConfigs).map((entry) => {
    const [_key, value] = entry;

    value.generator = generateBooleanLinesQuestion;
    value.renderer = renderFiguresQuestion;

    return entry;
  })
);
