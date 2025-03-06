import {
  generateBooleanFiguresQuestion,
  figureGenRules,
} from "../../generators/boolean-figures.generator.js";
import { colors, defaultViewBox } from "../common.config.js";
import { scaleViewBox } from "../../helpers/common.js";
import { renderFigurePatternsQuestion } from "../../renderers/figure-patterns.renderer.js";

const alternateViewBox = "2 2 100 100";

export const booleanFiguresConfigs = {
  // difficulty - 4
  iq32_dot4xor: {
    skip: true,
    order: 32,
    // todo(vmyshko): orig is not xor, its v seq AND. so impl diff gen types
    figureGenRule: figureGenRules.random,
    patternsInCol: 3,
    figureLink: "./images/boolean-figures/dot-4.svg",
    figureCount: 4,
    staticFigures: ["circle"],
    viewBox: scaleViewBox("4 4 100 100", 0.7),
    strokeWidth: (5 / 0.7).toFixed(2),
    color: colors.black,
    // maxAnswerCount: 8, //16

    generator: generateBooleanFiguresQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  iq12_like_quarters4xor: {
    // todo(vmyshko): similar in crop-figures, decide which to keep #2
    order: 12,
    figureGenRule: figureGenRules.random, // todo(vmyshko): group in sub-arrays instead?
    patternsInCol: 3,
    figureLink: "./images/shuffle-quarters.svg",
    figureCount: 4,
    // maxAnswerCount: 8, //16
    color: colors.blue,

    staticFigures: ["line-h", "line-v", "circle"],

    // todo(vmyshko): new field introduced to boolean figs to replace figureCount
    figures: ["quarter-1", "quarter-2", "quarter-3", "quarter-4"],

    generator: generateBooleanFiguresQuestion,

    renderer: renderFigurePatternsQuestion,
    questionMarkFigure: "circle",
    viewBox: defaultViewBox,
  },

  iq12alt_triangles4xor: {
    order: 12,
    figureGenRule: figureGenRules.symmetric, // todo(vmyshko): group in sub-arrays instead?
    patternsInCol: 3,
    figureLink: "./images/boolean-figures/triangles-8.svg",
    figureCount: 8,
    viewBox: defaultViewBox,
    color: colors.blue,
    // maxAnswerCount: 8, //16

    generator: generateBooleanFiguresQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  flake4xor: {
    skip: true, // dupes konforki
    figureGenRule: figureGenRules.random,
    patternsInCol: 3,
    // maxAnswerCount: 20,
    figureLink: "./images/boolean-figures/16-lines.svg",
    figureCount: 4,
    // viewBox: scaleViewBox(basicViewBox, 0.7),
    viewBox: alternateViewBox,
    strokeWidth: 5,
    color: "deeppink",

    generator: generateBooleanFiguresQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  // difficulty - 6

  iq31alt_circle6xor: {
    order: 31,
    figureGenRule: figureGenRules.random,
    patternsInCol: 3,
    figureLink: "./images/boolean-figures/circle-6.svg",
    figureCount: 6,
    staticFigures: ["circle"],
    viewBox: scaleViewBox(alternateViewBox, 0.7),
    strokeWidth: (5 / 0.7).toFixed(2),
    color: colors.red,
    // maxAnswerCount: 8,

    generator: generateBooleanFiguresQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  iq32alt_hexsym6xor: {
    order: 32,
    figureGenRule: figureGenRules.symmetric,
    patternsInCol: 3,
    figureLink: "./images/boolean-figures/hex-12.svg",
    figureCount: 12,
    viewBox: scaleViewBox(alternateViewBox, 0.7),
    strokeWidth: (3 / 0.7).toFixed(2),
    color: "black",
    // maxAnswerCount: 8,

    generator: generateBooleanFiguresQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  ortosym6xor: {
    skip: true, // same as hex, but hex is beautiful
    figureGenRule: figureGenRules.symmetric,
    patternsInCol: 3,
    figureLink: "./images/boolean-figures/12-lines-orto.svg",
    figureCount: 12,
    viewBox: scaleViewBox(alternateViewBox, 0.7),
    strokeWidth: (3 / 0.7).toFixed(2),
    color: "black",
    // maxAnswerCount: 8,

    generator: generateBooleanFiguresQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  // difficulty - 8

  crossDots8xor: {
    skip: true, // same as dice but uglier
    // todo(vmyshko): impl mul-dots xor-lines [new feature]
    figureGenRule: figureGenRules.random,
    patternsInCol: 3,
    figureLink: "./images/boolean-figures/cross-dots-8.svg",
    figureCount: 8, // todo(vmyshko): replace by fig-name array, like in shuffle
    staticFigures: ["circle", "dot"],
    viewBox: scaleViewBox("4 4 100 100", 0.7),
    strokeWidth: (5 / 0.7).toFixed(2),
    color: "black",
    // maxAnswerCount: 8,

    generator: generateBooleanFiguresQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  iq33alt_dice8xor: {
    order: 33,
    figureGenRule: figureGenRules.random,
    patternsInCol: 3,
    figureLink: "./images/boolean-figures/dice-8.svg",
    figureCount: 8,
    // staticFigures: ["circle"],
    viewBox: scaleViewBox("4 4 100 100", 0.7),
    strokeWidth: (5 / 0.7).toFixed(2),
    color: "black",
    // maxAnswerCount: 8,

    generator: generateBooleanFiguresQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  flake8xor_iq33: {
    skip: true, // easier than linessym visually
    // todo(vmyshko): allow v sequence
    figureGenRule: figureGenRules.random,
    patternsInCol: 3,
    figureLink: "./images/boolean-figures/16-lines.svg",
    figureCount: 8,
    viewBox: alternateViewBox,
    strokeWidth: 3,
    color: "crimson",

    generator: generateBooleanFiguresQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  linessym8xor: {
    // todo(vmyshko): fix empty row 2 col 3
    // http://127.0.0.1:8080/quiz.html#seed=0.10673593757500122

    skip: true,
    figureGenRule: figureGenRules.symmetric, // todo(vmyshko): use enums for other configs as well
    patternsInCol: 3,
    figureLink: "./images/boolean-figures/16-lines.svg",
    figureCount: 16,
    viewBox: scaleViewBox(alternateViewBox, 0.7),
    strokeWidth: (3 / 0.7).toFixed(2),
    color: "black",
    // maxAnswerCount: 8,

    generator: generateBooleanFiguresQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  // difficulty - 10

  pentagon10xor: {
    skip: true, // because dro4
    figureGenRule: figureGenRules.random,
    patternsInCol: 3,
    figureLink: "./images/boolean-figures/pentagon-10.svg",
    figureCount: 10,
    strokeWidth: (3 / 0.7).toFixed(2),
    color: "black",
    // maxAnswerCount: 8,

    generator: generateBooleanFiguresQuestion,

    viewBox: scaleViewBox(alternateViewBox, 0.7),
    // staticFigures: ["pentagon"],
    // questionMarkFigure: "pentagon",
    renderer: renderFigurePatternsQuestion,
  },
};
