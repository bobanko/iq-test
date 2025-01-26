import { colors, defaultColors } from "./common.config.js";
import {
  generateCropFigurePatternsQuestion,
  generateCropFigurePatternsQuestion_colRowSum,
  generateCropFigurePatternsQuestionAlt,
  generateCropFigurePatternsQuestionXorCustom,
} from "./crop-figures.generator.js";
import { renderFigurePatternsQuestion } from "./figure-patterns.renderer.js";

const defaultViewBox = "0 0 100 100";

export const cropFiguresConfigs = {
  // todo(vmyshko): this is totally different variant type, so extract with gen/render
  colRowSumFiguresMany: {
    patternsInCol: 3,
    patternsInRow: 3,
    viewBox: defaultViewBox,
    noRotationAnimation: true,

    maxAnswerCount: 8,

    figureLink: "./images/card-suits.svg",

    figures: ["spade-1", "heart-1", "diamond-1", "club-1"],
    figureTypesCountToUse: 2,
    colRowSum: 4, // possible 3*9=27 positions

    generator: generateCropFigurePatternsQuestion_colRowSum,
    renderer: renderFigurePatternsQuestion,
  },

  colRowSumFigures: {
    patternsInCol: 3,
    patternsInRow: 3,
    viewBox: defaultViewBox,
    noRotationAnimation: true,

    maxAnswerCount: 8,

    figureLink: "./images/card-suits.svg",

    figures: ["spade-1", "heart-1", "diamond-1", "club-1"],
    figureTypesCountToUse: 1,
    colRowSum: 9, // possible 3*9=27 positions

    generator: generateCropFigurePatternsQuestion_colRowSum,
    renderer: renderFigurePatternsQuestion,
  },

  // todo(vmyshko): probably it does not fully match config for crops (no cropFigs), so extract
  xorQuarters: {
    patternsInCol: 3,
    patternsInRow: 3,
    viewBox: defaultViewBox,
    noRotationAnimation: true,

    maxAnswerCount: 8,

    figureLink: "./images/shuffle-quarters.svg",

    questionMarkFigure: "circle",

    figures: ["quarter-1", "quarter-2", "quarter-3", "quarter-4"],
    figureColors: [...defaultColors],

    //renamed
    staticFigures: ["line-h", "line-v"],

    generator: generateCropFigurePatternsQuestionXorCustom,
    renderer: renderFigurePatternsQuestion,
  },

  cropFigures1: {
    patternsInCol: 3,
    patternsInRow: 3,
    viewBox: defaultViewBox,
    noRotationAnimation: true,

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

  cropFigures2: {
    patternsInCol: 2,
    patternsInRow: 3,
    viewBox: defaultViewBox,
    noRotationAnimation: true,

    maxAnswerCount: 6,

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

    generator: generateCropFigurePatternsQuestionAlt,
    renderer: renderFigurePatternsQuestion,
  },
};
