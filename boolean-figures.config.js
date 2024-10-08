import {
  generateBooleanFiguresQuestion,
  figureGenRules,
} from "./boolean-figures.generator.js";
import { scaleViewBox } from "./common.js";
import { renderFiguresQuestion } from "./figures.renderer.js";

const defaultViewBox = "0 0 100 100";
const alternateViewBox = "2 2 100 100";

const _booleanFiguresConfigs = {
  crossDots8xor: {
    // todo(vmyshko): impl mul-dots xor-lines [new feature]
    figureGenRule: figureGenRules.random,
    patternsInCol: 3,
    figureLink: "./images/boolean-figures/cross-dots-8.svg",
    figureCount: 8,
    staticFigures: ["circle", "dot"],
    viewBox: scaleViewBox("4 4 100 100", 0.7),
    strokeWidth: (5 / 0.7).toFixed(2),
    color: "black",
    maxAnswerCount: 8,
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
  },

  dot4xor: {
    figureGenRule: figureGenRules.random,
    patternsInCol: 3,
    figureLink: "./images/boolean-figures/dot-4.svg",
    figureCount: 4,
    staticFigures: ["circle"],
    viewBox: scaleViewBox("4 4 100 100", 0.7),
    strokeWidth: (5 / 0.7).toFixed(2),
    color: "black",
    maxAnswerCount: 8,
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
  },

  triangles8xor: {
    figureGenRule: figureGenRules.symmetric,
    patternsInCol: 3,
    figureLink: "./images/boolean-figures/triangles-8.svg",
    figureCount: 8,
    viewBox: defaultViewBox,
    strokeWidth: 1,
    color: "var(--blue)",
    maxAnswerCount: 8,
  },

  arc12xor: {
    figureGenRule: figureGenRules.random,
    patternsInCol: 3,
    figureLink: "./images/boolean-figures/arc-12.svg",
    figureCount: 12,
    viewBox: alternateViewBox,
    strokeWidth: 4,
    color: "var(--green)",
    maxAnswerCount: 8,
  },

  arc4xor: {
    figureGenRule: figureGenRules.random,
    patternsInCol: 3,
    figureLink: "./images/boolean-figures/arc-4.svg",
    figureCount: 4,
    viewBox: alternateViewBox,
    strokeWidth: 4,
    color: "black",
    maxAnswerCount: 8,
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
  },
  flake_xor8: {
    figureGenRule: figureGenRules.random,
    patternsInCol: 3,
    figureLink: "./images/boolean-figures/16-lines.svg",
    figureCount: 8,
    viewBox: alternateViewBox,
    strokeWidth: 3,
    color: "crimson",
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
  },
};

// todo(vmyshko): get rid of this patcher, keep everything in config obj instead
export const booleanFiguresConfigs = Object.fromEntries(
  Object.entries(_booleanFiguresConfigs).map((entry) => {
    const [_key, value] = entry;

    value.generator = generateBooleanFiguresQuestion;
    value.renderer = renderFiguresQuestion;

    return entry;
  })
);
