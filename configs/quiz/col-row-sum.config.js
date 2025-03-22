import { defaultViewBox } from "../common.config.js";
import { renderFigurePatternsQuestion } from "../../renderers/figure-patterns.renderer.js";
import { preGenBytes_equalSumPerRowColWrapped } from "../../generators/col-row-sum.generator.js";
import { generateSequenceQuestion } from "../../generators/shuffle-figures.generator.js";

import {
  answerGeneratorROWSUBFIGS,
  preRenderPatternROWSUBFIGS,
} from "../../generators/row-sub-figs.generator.js";

export const colRowSumFiguresConfigs = {
  iq35_colRowSumFiguresMany: {
    order: 35,
    patternsInCol: 3,
    patternsInRow: 3,
    viewBox: defaultViewBox,
    // noRotationAnimation: true,

    // maxAnswerCount: 8,

    figureLink: "./images/card-suits.svg",

    figureTypesCountToUse: 2,
    colRowSum: 4 + 2, // possible 3*9=27 positions

    // shufflePositions: false,

    preRenderConfig: {
      figureIds: ["spade-1", "heart-1", "diamond-1", "club-1"],
    },

    byteGenConfig: [
      // used to gen answers
      {
        max: 4,
      },
      {
        max: 5,
      },
      // {
      //   max: 3,
      // },
    ],

    answerGenerator: answerGeneratorROWSUBFIGS,
    preGenBytes: preGenBytes_equalSumPerRowColWrapped,

    preRenderPattern: preRenderPatternROWSUBFIGS,
    generator: generateSequenceQuestion,
    // todo(vmyshko): do not show unused figs in answers
    renderer: renderFigurePatternsQuestion,
  },

  colRowSumFigures: {
    order: 34,
    skip: true,
    patternsInCol: 3,
    patternsInRow: 3,
    viewBox: defaultViewBox,
    // noRotationAnimation: true,

    // maxAnswerCount: 8,

    figureLink: "./images/card-suits.svg",

    figureTypesCountToUse: 1,
    colRowSum: 9, // possible 3*9=27 positions

    //-----

    preRenderConfig: {
      figureIds: ["spade-1", "heart-1", "diamond-1", "club-1"],
    },

    byteGenConfig: [
      // used to gen answers
      {
        max: 9 - 2,
      },
    ],

    answerGenerator: answerGeneratorROWSUBFIGS,
    preGenBytes: preGenBytes_equalSumPerRowColWrapped,

    preRenderPattern: preRenderPatternROWSUBFIGS,
    generator: generateSequenceQuestion,
    renderer: renderFigurePatternsQuestion,
  },
};
