import { scaleViewBox } from "./common.js";
import { renderFiguresQuestion } from "./figures.renderer.js";
import { generateResizableQuestion } from "./resizable.generator.js";

const defaultViewBox = "0 0 100 100";
const alternateViewBox = "2 2 100 100";

export const resizableConfigs = {
  default_resize: {
    patternsInCol: 3,
    figureLink: "./images/pattern-resizable.svg",

    viewBox: scaleViewBox(alternateViewBox, 0.9 / 2),
    strokeWidth: (3 / 0.9).toFixed(2),

    maxAnswerCount: 8,

    generator: generateResizableQuestion,
    renderer: renderFiguresQuestion,
  },
};
