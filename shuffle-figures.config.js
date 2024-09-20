import {
  generateShuffleFiguresQuestion,
  shuffleTypes,
} from "./shuffle-figures.generator.js";
import { scaleViewBox } from "./common.js";
import { renderFiguresQuestion } from "./figures.renderer.js";

const defaultViewBox = "0 0 100 100";
const alternateViewBox = "2 2 100 100";

const _shuffleFiguresConfigs = {
  triangles8xor: {
    shuffleType: shuffleTypes.random,
    patternsInCol: 3,
    figureLink: "./images/boolean-figures/triangles-8.svg",
    figureCount: 8,
    viewBox: defaultViewBox,
    strokeWidth: 1,
    color: "var(--red)",
    maxAnswerCount: 8,
  },
};

// todo(vmyshko): get rid of this patcher, keep everything in config obj instead
export const shuffleFiguresConfigs = Object.fromEntries(
  Object.entries(_shuffleFiguresConfigs).map((entry) => {
    const [_key, value] = entry;

    value.generator = generateShuffleFiguresQuestion;
    value.renderer = renderFiguresQuestion;

    return entry;
  })
);
