import { defaultViewBox } from "./common.config.js";
import { renderFigurePatternsQuestion } from "./figure-patterns.renderer.js";
import { generatePatternsQuestion_colRowSum } from "./formula-col-row-sum.generator.js";

export const colRowSumFiguresConfigs = {
  colSubFigsMany: {
    patternsInCol: 3,
    patternsInRow: 3,
    viewBox: defaultViewBox,
    noRotationAnimation: true,

    maxAnswerCount: 8,

    figureLink: "./images/spark-icons.svg",

    figures: [
      //"spark-1",
      "spark-2",
      "spark-3",
      //"spark-4", "spark-5"
    ],
    figureTypesCountToUse: 2,
    colRowSum: 4, // possible 3*9=27 positions
    // shufflePositions: false,

    generator: generatePatternsQuestion_colRowSum,
    renderer: renderFigurePatternsQuestion,
  },

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
    // shufflePositions: false,

    generator: generatePatternsQuestion_colRowSum,
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

    generator: generatePatternsQuestion_colRowSum,
    renderer: renderFigurePatternsQuestion,
  },
};
