import { renderFigurePatternsQuestion } from "./figure-patterns.renderer.js";
import { generateResizableQuestion } from "./resizable.generator.js";

const alternateViewBox = "2 2 100 100";

const upscaleFactor = 1.9;
export const resizableConfigs = {
  iq23_default_resize: {
    // todo(vmyshko): extract colors to config
    patternsInCol: 3,
    figureLink: "./images/pattern-resizable.svg",

    figsToScale: ["circle", "rect", "star", "triangle"],

    upscaleFactor,
    scaleTypes: [
      { figures: ["horizontal"], scaleX: upscaleFactor },
      { figures: ["vertical"], scaleY: upscaleFactor },
      {
        figures: ["horizontal", "vertical"],
        scaleX: upscaleFactor,
        scaleY: upscaleFactor,
      },
    ],

    viewBox: alternateViewBox,
    scale: 0.9 / 2,
    strokeWidth: 5,

    maxAnswerCount: 8,

    generator: generateResizableQuestion,
    renderer: renderFigurePatternsQuestion,
  },
};
