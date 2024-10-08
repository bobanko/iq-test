import {
  generateShuffleFiguresQuestion,
  // shuffleTypes,
} from "./shuffle-figures.generator.js";
import { scaleViewBox } from "./common.js";
import { renderFiguresQuestion } from "./figures.renderer.js";

const defaultViewBox = "0 0 100 100";
const alternateViewBox = "2 2 100 100";

export const shuffleFiguresConfigs = {
  triangles8xor: {
    // shuffleType: shuffleTypes.random,
    patternsInCol: 3,
    figureLink: "./images/inner-rect-triangle-circle.svg",
    figureCount: 8,
    viewBox: scaleViewBox(alternateViewBox, 0.8),
    strokeWidth: 1,
    color: "var(--red)",
    maxAnswerCount: 8,

    generator: generateShuffleFiguresQuestion,
    renderer: renderFiguresQuestion,
  },
};
