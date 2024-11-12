import { defaultColors, rgbColors } from "./common.config.js";
import { generateCropFigurePatternsQuestion } from "./crop-figures.generator.js";
import { renderFigurePatternsQuestion } from "./figure-patterns.renderer.js";
import { shuffleTypes } from "./shuffle-figure-patterns.generator.js";

const defaultViewBox = "0 0 100 100";

export const cropFiguresConfigs = {
  cropFigures1: {
    patternsInCol: 3,
    patternsInCol: 3,
    viewBox: defaultViewBox,

    maxAnswerCount: 8,

    figureLink: "./images/xor-halves.svg",

    figures: ["half-1", "half-2", "separator"],
    figureColors: [...defaultColors],
    cropFigures: [
      "cutout-1",
      "cutout-2",
      "cutout-3",
      "cutout-4",
      "cutout-5",
      "cutout-6",
      "cutout-7",
      "cutout-8",
      "cutout-9",
    ],

    generator: generateCropFigurePatternsQuestion,
    renderer: renderFigurePatternsQuestion,
  },
};
