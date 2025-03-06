import { defaultViewBox } from "../common.config.js";
import { renderFigurePatternsQuestion } from "../../renderers/figure-patterns.renderer.js";
import { generatePatternsQuestion_colRowSum } from "../../generators/col-row-sum.generator.js";

export const colRowSumFiguresConfigs = {
  iq35_colRowSumFiguresMany: {
    order: 35,
    patternsInCol: 3,
    patternsInRow: 3,
    viewBox: defaultViewBox,
    // noRotationAnimation: true,

    // maxAnswerCount: 8,

    figureLink: "./images/card-suits.svg",

    figures: ["spade-1", "heart-1", "diamond-1", "club-1"],
    figureTypesCountToUse: 2,
    colRowSum: 4, // possible 3*9=27 positions
    // shufflePositions: false,

    // todo(vmyshko): do not show unused figs in answers
    generator: generatePatternsQuestion_colRowSum,
    renderer: renderFigurePatternsQuestion,
  },

  colRowSumFigures: {
    skip: true,
    patternsInCol: 3,
    patternsInRow: 3,
    viewBox: defaultViewBox,
    // noRotationAnimation: true,

    // maxAnswerCount: 8,

    figureLink: "./images/card-suits.svg",

    figures: ["spade-1", "heart-1", "diamond-1", "club-1"],
    figureTypesCountToUse: 1,
    colRowSum: 9, // possible 3*9=27 positions

    generator: generatePatternsQuestion_colRowSum,
    renderer: renderFigurePatternsQuestion,
  },
};
