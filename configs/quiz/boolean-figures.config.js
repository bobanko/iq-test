import {
  preGenBytesBOOLEAN,
  preRenderPatternBOOLEAN,
} from "../../generators/boolean-figures.generator.js";
import { colors, defaultViewBox, rgbColors } from "../common.config.js";
import { scaleViewBox } from "../../helpers/common.js";
import { renderFigurePatternsQuestion } from "../../renderers/figure-patterns.renderer.js";
import { generateSequenceQuestion } from "../../generators/shuffle-figures.generator.js";

const alternateViewBox = "2 2 100 100";

export const booleanFiguresConfigs = {
  // difficulty - 4
  iq32_dot4xor: {
    skip: true,
    order: 32,
    // todo(vmyshko): orig is not xor, its v seq AND. so impl diff gen types

    patternsInCol: 3,
    figureLink: "./images/boolean-figures/dot-4.svg",

    staticFigures: ["circle"],
    viewBox: scaleViewBox("4 4 100 100", 0.7),
    strokeWidth: (5 / 0.7).toFixed(2),
    color: colors.black,
    // maxAnswerCount: 8, //16

    preGenBytes: preGenBytesBOOLEAN,
    preRenderPattern: preRenderPatternBOOLEAN,
    generator: generateSequenceQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  iq12_like_quarters4xor: {
    skip: true,
    // todo(vmyshko): similar in crop-figures, decide which to keep #2
    order: 12,
    patternsInCol: 3,
    figureCount: 4,
    // maxAnswerCount: 8, //16
    color: colors.blue,

    staticFigures: ["line-h", "line-v", "circle"],

    // todo(vmyshko): new field introduced to boolean figs to replace figureCount
    figures: ["quarter-1", "quarter-2", "quarter-3", "quarter-4"],

    preGenBytes: preGenBytesBOOLEAN,
    preRenderPattern: preRenderPatternBOOLEAN,
    generator: generateSequenceQuestion,

    questionMarkFigure: "circle",
    viewBox: defaultViewBox,
    figureLink: "./images/shuffle-quarters.svg",
    renderer: renderFigurePatternsQuestion,
  },

  iq12alt_triangles4xor: {
    // skip: true,
    order: 12,
    patternsInCol: 3,

    byteGenConfig: [
      {
        max: 2 ** 4, // 4 figs - 2**4 combinations
      },
    ],
    // todo(vmyshko): impl new config for xors
    preRenderConfig: {
      figureIds: ["g0", "g1", "g2", "g3"],
      // color: colors.green,
      color: colors.blue,
      // todo(vmyshko): make similar as for shuffels?
    },

    preGenBytes: preGenBytesBOOLEAN,
    preRenderPattern: preRenderPatternBOOLEAN,
    generator: generateSequenceQuestion,

    viewBox: defaultViewBox,
    figureLink: "./images/boolean-figures/triangles-8.svg",
    renderer: renderFigurePatternsQuestion,
  },

  triangles8xor_wechsler_wais_r: {
    skip: true,
    order: 12,
    patternsInCol: 3,

    byteGenConfig: [
      {
        max: 2 ** 8, // 8 figs - 2**8 combinations
      },
    ],
    preRenderConfig: {
      figureIds: ["0", "1", "2", "3", "4", "5", "6", "7"],
      color: "crimson",
      // todo(vmyshko): make similar as for shuffels?
    },

    preGenBytes: preGenBytesBOOLEAN,
    preRenderPattern: preRenderPatternBOOLEAN,
    generator: generateSequenceQuestion,

    viewBox: defaultViewBox,
    figureLink: "./images/triangles-8-wais-r.svg",
    renderer: renderFigurePatternsQuestion,
  },

  flake4xor: {
    skip: true, // dupes konforki

    patternsInCol: 3,
    // maxAnswerCount: 20,
    figureLink: "./images/boolean-figures/16-lines.svg",
    figureCount: 4,
    // viewBox: scaleViewBox(basicViewBox, 0.7),
    viewBox: alternateViewBox,
    strokeWidth: 5,
    color: "deeppink",

    preGenBytes: preGenBytesBOOLEAN,
    preRenderPattern: preRenderPatternBOOLEAN,
    generator: generateSequenceQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  // difficulty - 6

  iq31alt_circle6xor: {
    order: 31,
    patternsInCol: 3,

    byteGenConfig: [
      {
        max: 2 ** 6, // n figs - 2**n combinations
      },
    ],
    // todo(vmyshko): impl new config for xors
    preRenderConfig: {
      figureIds: ["0", "1", "2", "3", "4", "5"],
      color: colors.red,
      // todo(vmyshko): make similar as for shuffels?
    },

    figureLink: "./images/boolean-figures/circle-6.svg",

    staticFigures: ["circle"],
    viewBox: scaleViewBox(alternateViewBox, 0.7),
    strokeWidth: (5 / 0.7).toFixed(2),

    preGenBytes: preGenBytesBOOLEAN,
    preRenderPattern: preRenderPatternBOOLEAN,
    generator: generateSequenceQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  iq32alt_hexsym6xor: {
    order: 32,
    patternsInCol: 3,
    figureLink: "./images/boolean-figures/hex-12.svg",

    byteGenConfig: [
      {
        max: 2 ** 6, // n figs - 2**n combinations
      },
    ],
    // todo(vmyshko): impl new config for xors
    preRenderConfig: {
      figureIds: ["g0", "g1", "g2", "g3", "g4", "g5"],
      color: colors.black,
      // todo(vmyshko): make similar as for shuffels?
    },

    viewBox: scaleViewBox(alternateViewBox, 0.7),
    strokeWidth: (3 / 0.7).toFixed(2),

    preGenBytes: preGenBytesBOOLEAN,
    preRenderPattern: preRenderPatternBOOLEAN,
    generator: generateSequenceQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  ortosym6xor: {
    skip: true, // same as hex, but hex is beautiful
    // figureGenRule: figureGenRules.symmetric,
    patternsInCol: 3,
    figureLink: "./images/boolean-figures/12-lines-orto.svg",
    figureCount: 12,
    viewBox: scaleViewBox(alternateViewBox, 0.7),
    strokeWidth: (3 / 0.7).toFixed(2),
    color: "black",
    // maxAnswerCount: 8,

    preGenBytes: preGenBytesBOOLEAN,
    preRenderPattern: preRenderPatternBOOLEAN,
    generator: generateSequenceQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  // difficulty - 8

  crossDots8xor: {
    skip: true, // same as dice but uglier
    // todo(vmyshko): impl mul-dots xor-lines [new feature]

    patternsInCol: 3,
    figureLink: "./images/boolean-figures/cross-dots-8.svg",
    figureCount: 8, // todo(vmyshko): replace by fig-name array, like in shuffle
    staticFigures: ["circle", "dot"],
    viewBox: scaleViewBox("4 4 100 100", 0.7),
    strokeWidth: (5 / 0.7).toFixed(2),
    color: "black",
    // maxAnswerCount: 8,

    preGenBytes: preGenBytesBOOLEAN,
    preRenderPattern: preRenderPatternBOOLEAN,
    generator: generateSequenceQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  iq33alt_dice8xor: {
    order: 33,
    patternsInCol: 3,

    byteGenConfig: [
      {
        max: 2 ** 8, // n figs - 2**n combinations
      },
    ],
    // todo(vmyshko): impl new config for xors
    preRenderConfig: {
      figureIds: ["0", "1", "2", "3", "4", "5", "6", "7"],
      // color: colors.black,
    },

    figureLink: "./images/boolean-figures/dice-8.svg",

    // staticFigures: ["circle"],
    viewBox: scaleViewBox("4 4 100 100", 0.7),
    strokeWidth: (5 / 0.7).toFixed(2),

    preGenBytes: preGenBytesBOOLEAN,
    preRenderPattern: preRenderPatternBOOLEAN,
    generator: generateSequenceQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  flake8xor_iq33: {
    skip: true, // easier than linessym visually
    // todo(vmyshko): allow v sequence

    patternsInCol: 3,
    figureLink: "./images/boolean-figures/16-lines.svg",
    figureCount: 8,
    viewBox: alternateViewBox,
    strokeWidth: 3,
    color: "crimson",

    preGenBytes: preGenBytesBOOLEAN,
    preRenderPattern: preRenderPatternBOOLEAN,
    generator: generateSequenceQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  linessym8xor: {
    // todo(vmyshko): fix empty row 2 col 3
    // http://127.0.0.1:8080/quiz.html#seed=0.10673593757500122

    skip: true,
    // figureGenRule: figureGenRules.symmetric,
    patternsInCol: 3,
    figureLink: "./images/boolean-figures/16-lines.svg",
    figureCount: 16,
    viewBox: scaleViewBox(alternateViewBox, 0.7),
    strokeWidth: (3 / 0.7).toFixed(2),
    color: "black",
    // maxAnswerCount: 8,

    preGenBytes: preGenBytesBOOLEAN,
    preRenderPattern: preRenderPatternBOOLEAN,
    generator: generateSequenceQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  // difficulty - 10

  pentagon10xor: {
    skip: true, // because dro4

    patternsInCol: 3,
    figureLink: "./images/boolean-figures/pentagon-10.svg",
    figureCount: 10,
    strokeWidth: (3 / 0.7).toFixed(2),
    color: "black",
    // maxAnswerCount: 8,

    preGenBytes: preGenBytesBOOLEAN,
    preRenderPattern: preRenderPatternBOOLEAN,
    generator: generateSequenceQuestion,

    viewBox: scaleViewBox(alternateViewBox, 0.7),
    // staticFigures: ["pentagon"],
    // questionMarkFigure: "pentagon",
    renderer: renderFigurePatternsQuestion,
  },
};
