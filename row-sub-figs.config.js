import { defaultViewBox } from "./common.config.js";
import { renderFigurePatternsQuestion } from "./figure-patterns.renderer.js";
import { generatePatternsQuestion_rowSub } from "./row-sub-figs.generator.js";

export const rowSubFiguresConfigs = {
  // todo(vmyshko): fix empty col 2
  // http://127.0.0.1:8080/quiz.html#seed=0.10673593757500122
  iq36_rowSubFigsMany: {
    order: 36,
    patternsInCol: 3,
    patternsInRow: 3,
    viewBox: defaultViewBox,
    // noRotationAnimation: true,

    figureLink: "./images/spark-icons.svg",

    figures: [
      //"spark-1",
      "spark-2",
      "spark-3",
      //"spark-4", "spark-5"
    ],
    figureTypesCountToUse: 2,
    // shufflePositions: false,
    // maxAnswerCount: 8,

    // todo(vmyshko): restrict empty patterns
    generator: generatePatternsQuestion_rowSub,
    renderer: renderFigurePatternsQuestion,
  },
};
