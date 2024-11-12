import { renderFigurePatternsQuestion } from "./figure-patterns.renderer.js";
import { generateResizableQuestion } from "./resizable.generator.js";

const alternateViewBox = "2 2 100 100";

export const resizableConfigs = {
  default_resize: {
    patternsInCol: 3,
    figureLink: "./images/pattern-resizable.svg",

    viewBox: alternateViewBox,
    scale: 0.9 / 2,
    strokeWidth: (3 / 0.9).toFixed(2),

    maxAnswerCount: 8,

    generator: generateResizableQuestion,
    renderer: renderFigurePatternsQuestion,
  },
};
