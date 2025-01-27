import { defaultViewBox } from "./common.config.js";
import { renderFigurePatternsQuestion } from "./figure-patterns.renderer.js";
import { generatePatternsQuestion_rowSub } from "./row-sub-figs.generator.js";

export const rowSubFiguresConfigs = {
  //✅36
  rowSubFigsMany: {
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
    // shufflePositions: false,

    generator: generatePatternsQuestion_rowSub,
    renderer: renderFigurePatternsQuestion,
  },
};
