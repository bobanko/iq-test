import { defaultViewBox } from "../common.config.js";
import { renderFigurePatternsQuestion } from "../../renderers/figure-patterns.renderer.js";
import {
  preGenBytesROWSUBFIGS,
  preRenderPatternROWSUBFIGS,
} from "../../generators/row-sub-figs.generator.js";
import { generateSequenceQuestion } from "../../generators/shuffle-figures.generator.js";

export const rowSubFiguresConfigs = {
  iq36_rowSubFigsMany: {
    skip: true, // broken
    order: 36,
    patternsInCol: 3,
    patternsInRow: 3,

    // shufflePositions: false,
    // maxAnswerCount: 8,

    byteGenConfig: [
      {
        max: 4,
      },
      {
        max: 4,
      },
      {
        max: 4,
      },
    ],

    preRenderConfig: {
      figureIds: [
        //"spark-1",
        "spark-2",
        "spark-3",
        //"spark-4", "spark-5"
      ],
      // color: colors.green,
      // color: colors.blue,
      // todo(vmyshko): make similar as for shuffels?
    },

    preGenBytes: preGenBytesROWSUBFIGS,
    preRenderPattern: preRenderPatternROWSUBFIGS,
    generator: generateSequenceQuestion,

    viewBox: defaultViewBox,
    figureLink: "./images/spark-icons.svg",
    renderer: renderFigurePatternsQuestion,
  },
};
