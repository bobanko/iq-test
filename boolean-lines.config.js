import {
  generateBooleanLinesQuestion,
  ruleSets,
} from "./boolean-lines.generator.js";
import { renderFiguresQuestion } from "./figures.renderer.js";

/**
 *
 * @param {string} viewBox like '0 0 100 100'
 * @param {number} scale 0.5 is 50%, 1.5 is 150%
 * @returns scaled viewBox
 */
function scaleViewBox(viewBox, scale) {
  const [x, y, width, height] = viewBox.split(" ").map((value) => +value);

  return [
    x + (width - width / scale) / 2,
    y + (height - height / scale) / 2,
    width / scale,
    height / scale,
  ]
    .map((value) => value.toFixed(2))
    .join(" ");
}

const defaultViewBox = "0 0 100 100";
const alternateViewBox = "2 2 100 100";

const _booleanMatrixConfigs = {
  crossDots8xor: {
    // todo(vmyshko): impl mul-dots xor-lines [new feature]
    ruleSet: ruleSets.random,
    patternsInCol: 3,
    figureLink: "./images/boolean-lines/cross-dots-8.svg",
    figureCount: 8,
    staticFigures: ["circle", "dot"],
    viewBox: scaleViewBox("4 4 100 100", 0.7),
    strokeWidth: (5 / 0.7).toFixed(2),
    color: "black",
    maxAnswerCount: 8,
  },

  dice8xor: {
    ruleSet: ruleSets.random,
    patternsInCol: 3,
    figureLink: "./images/boolean-lines/dice-8.svg",
    figureCount: 8,
    // staticFigures: ["circle"],
    viewBox: scaleViewBox("4 4 100 100", 0.7),
    strokeWidth: (5 / 0.7).toFixed(2),
    color: "black",
    maxAnswerCount: 8,
  },

  dot4xor: {
    ruleSet: ruleSets.random,
    patternsInCol: 3,
    figureLink: "./images/boolean-lines/dot-4.svg",
    figureCount: 4,
    staticFigures: ["circle"],
    viewBox: scaleViewBox("4 4 100 100", 0.7),
    strokeWidth: (5 / 0.7).toFixed(2),
    color: "black",
    maxAnswerCount: 8,
  },

  circle6xor: {
    ruleSet: ruleSets.random,
    patternsInCol: 3,
    figureLink: "./images/boolean-lines/circle-6.svg",
    figureCount: 6,
    staticFigures: ["circle"],
    viewBox: scaleViewBox(alternateViewBox, 0.7),
    strokeWidth: (5 / 0.7).toFixed(2),
    color: "var(--red)",
    maxAnswerCount: 8,
  },

  triangles8xor: {
    ruleSet: ruleSets.symmetric,
    patternsInCol: 3,
    figureLink: "./images/boolean-lines/triangles-8.svg",
    figureCount: 8,
    viewBox: defaultViewBox,
    strokeWidth: 1,
    color: "var(--blue)",
    maxAnswerCount: 8,
  },

  arc12xor: {
    ruleSet: ruleSets.random,
    patternsInCol: 3,
    figureLink: "./images/boolean-lines/arc-12.svg",
    figureCount: 12,
    viewBox: alternateViewBox,
    strokeWidth: 4,
    color: "var(--green)",
    maxAnswerCount: 8,
  },

  arc4xor: {
    ruleSet: ruleSets.random,
    patternsInCol: 3,
    figureLink: "./images/boolean-lines/arc-4.svg",
    figureCount: 4,
    viewBox: alternateViewBox,
    strokeWidth: 4,
    color: "black",
    maxAnswerCount: 8,
  },

  pentagon10xor: {
    ruleSet: ruleSets.random,
    patternsInCol: 3,
    figureLink: "./images/boolean-lines/pentagon-10.svg",
    figureCount: 10,
    viewBox: scaleViewBox(alternateViewBox, 0.7),
    strokeWidth: (2 / 0.7).toFixed(2),
    color: "black",
    maxAnswerCount: 8,
  },

  hex12xor: {
    ruleSet: ruleSets.symmetric,
    patternsInCol: 3,
    figureLink: "./images/boolean-lines/hex-12.svg",
    figureCount: 12,
    viewBox: scaleViewBox(alternateViewBox, 0.7),
    strokeWidth: (3 / 0.7).toFixed(2),
    color: "black",
    maxAnswerCount: 8,
  },

  xor12orto: {
    ruleSet: ruleSets.symmetric,
    patternsInCol: 3,
    figureLink: "./images/boolean-lines/12-lines-orto.svg",
    figureCount: 12,
    viewBox: scaleViewBox(alternateViewBox, 0.7),
    strokeWidth: (2 / 0.7).toFixed(2),
    color: "black",
    maxAnswerCount: 8,
  },

  xor16symmetric: {
    ruleSet: ruleSets.symmetric, // todo(vmyshko): use enums for other configs as well
    patternsInCol: 3,
    figureLink: "./images/boolean-lines/16-lines.svg",
    figureCount: 16,
    viewBox: scaleViewBox(alternateViewBox, 0.7),
    strokeWidth: (2 / 0.7).toFixed(2),
    color: "black",
    maxAnswerCount: 8,
  },
  flake_xor8: {
    ruleSet: ruleSets.random,
    patternsInCol: 3,
    figureLink: "./images/boolean-lines/16-lines.svg",
    figureCount: 8,
    // viewBox: scaleViewBox(basicViewBox, 0.7),
    viewBox: alternateViewBox,
    strokeWidth: 2,
    color: "crimson",
  },
  flake_xor4cut8: {
    ruleSet: ruleSets.random,
    patternsInCol: 3,
    // maxAnswerCount: 20,
    figureLink: "./images/boolean-lines/16-lines.svg",
    figureCount: 4,
    // viewBox: scaleViewBox(basicViewBox, 0.7),
    viewBox: alternateViewBox,
    strokeWidth: 5,
    color: "deeppink",
  },
};

// todo(vmyshko): get rid of this patcher, keep everything in config obj instead
export const booleanLinesConfigs = Object.fromEntries(
  Object.entries(_booleanMatrixConfigs).map((entry) => {
    const [_key, value] = entry;

    value.generator = generateBooleanLinesQuestion;
    value.renderer = renderFiguresQuestion;

    return entry;
  })
);
