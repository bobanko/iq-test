import {
  generateBooleanFiguresQuestion,
  figureGenRules,
} from "./boolean-figures.generator.js";
import { defaultViewBox } from "./common.config.js";
import { scaleViewBox } from "./common.js";
import { renderFigurePatternsQuestion } from "./figure-patterns.renderer.js";

const alternateViewBox = "2 2 100 100";

export const booleanFiguresConfigs = {
  crossDots8xor: {
    // todo(vmyshko): impl mul-dots xor-lines [new feature]
    figureGenRule: figureGenRules.random,
    patternsInCol: 3,
    figureLink: "./images/boolean-figures/cross-dots-8.svg",
    figureCount: 8, // todo(vmyshko): replace by fig-name array, like in shuffle
    staticFigures: ["circle", "dot"],
    viewBox: scaleViewBox("4 4 100 100", 0.7),
    strokeWidth: (5 / 0.7).toFixed(2),
    color: "black",
    maxAnswerCount: 8,

    generator: generateBooleanFiguresQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  dice8xor: {
    figureGenRule: figureGenRules.random,
    patternsInCol: 3,
    figureLink: "./images/boolean-figures/dice-8.svg",
    figureCount: 8,
    // staticFigures: ["circle"],
    viewBox: scaleViewBox("4 4 100 100", 0.7),
    strokeWidth: (5 / 0.7).toFixed(2),
    color: "black",
    maxAnswerCount: 8,

    generator: generateBooleanFiguresQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  iq32_dot4xor: {
    // todo(vmyshko): orig is not xor, its v seq AND. so impl diff gen types
    figureGenRule: figureGenRules.random,
    patternsInCol: 3,
    figureLink: "./images/boolean-figures/dot-4.svg",
    figureCount: 4,
    staticFigures: ["circle"],
    viewBox: scaleViewBox("4 4 100 100", 0.7),
    strokeWidth: (5 / 0.7).toFixed(2),
    color: "black",
    maxAnswerCount: 8, //16

    generator: generateBooleanFiguresQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  circle6xor: {
    figureGenRule: figureGenRules.random,
    patternsInCol: 3,
    figureLink: "./images/boolean-figures/circle-6.svg",
    figureCount: 6,
    staticFigures: ["circle"],
    viewBox: scaleViewBox(alternateViewBox, 0.7),
    strokeWidth: (5 / 0.7).toFixed(2),
    color: "var(--red)",
    maxAnswerCount: 8,

    generator: generateBooleanFiguresQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  triangles8xorAns16: {
    figureGenRule: figureGenRules.symmetric, // todo(vmyshko): group in sub-arrays instead?
    patternsInCol: 3,
    figureLink: "./images/boolean-figures/triangles-8.svg",
    figureCount: 8,
    viewBox: defaultViewBox,
    strokeWidth: 1,
    color: "var(--blue)",
    maxAnswerCount: 8, //16

    generator: generateBooleanFiguresQuestion,
    renderer: renderFigurePatternsQuestion,
  },
  pentagon10xor: {
    figureGenRule: figureGenRules.random,
    patternsInCol: 3,
    figureLink: "./images/boolean-figures/pentagon-10.svg",
    figureCount: 10,
    viewBox: scaleViewBox(alternateViewBox, 0.7),
    strokeWidth: (3 / 0.7).toFixed(2),
    color: "black",
    maxAnswerCount: 8,

    generator: generateBooleanFiguresQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  hex12xor: {
    figureGenRule: figureGenRules.symmetric,
    patternsInCol: 3,
    figureLink: "./images/boolean-figures/hex-12.svg",
    figureCount: 12,
    viewBox: scaleViewBox(alternateViewBox, 0.7),
    strokeWidth: (3 / 0.7).toFixed(2),
    color: "black",
    maxAnswerCount: 8,

    generator: generateBooleanFiguresQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  xor12orto: {
    figureGenRule: figureGenRules.symmetric,
    patternsInCol: 3,
    figureLink: "./images/boolean-figures/12-lines-orto.svg",
    figureCount: 12,
    viewBox: scaleViewBox(alternateViewBox, 0.7),
    strokeWidth: (3 / 0.7).toFixed(2),
    color: "black",
    maxAnswerCount: 8,

    generator: generateBooleanFiguresQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  xor16symmetric: {
    figureGenRule: figureGenRules.symmetric, // todo(vmyshko): use enums for other configs as well
    patternsInCol: 3,
    figureLink: "./images/boolean-figures/16-lines.svg",
    figureCount: 16,
    viewBox: scaleViewBox(alternateViewBox, 0.7),
    strokeWidth: (3 / 0.7).toFixed(2),
    color: "black",
    maxAnswerCount: 8,

    generator: generateBooleanFiguresQuestion,
    renderer: renderFigurePatternsQuestion,
  },
  iq33_flake_xor8: {
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
  flake_xor4cut8: {
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
};
