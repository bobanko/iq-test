import { generateBooleanLinesQuestion } from "./boolean-lines.generator.js";
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

const basicViewBox = "2 2 100 100";

const _booleanMatrixConfigs = {
  xor16: {
    ruleSet: 0,
    patternsInCol: 3,
    figureLink: "./images/boolean-lines/16-lines.svg",
    figureCount: 16,
    viewBox: scaleViewBox(basicViewBox, 0.7),
    strokeWidth: (2 / 0.7).toFixed(2),
    color: "black",
    maxAnswerCount: 8,
    // todo(vmyshko): impl rotation for generations to fit etalone
  },
  flake_xor8: {
    ruleSet: 0,
    patternsInCol: 3,
    figureLink: "./images/boolean-lines/16-lines.svg",
    figureCount: 8,
    // viewBox: scaleViewBox(basicViewBox, 0.7),
    viewBox: basicViewBox,
    strokeWidth: 2,
    color: "crimson",
  },
  flake_xor4cut8: {
    ruleSet: 0,
    patternsInCol: 3,
    // maxAnswerCount: 20,
    figureLink: "./images/boolean-lines/16-lines.svg",
    figureCount: 4,
    // viewBox: scaleViewBox(basicViewBox, 0.7),
    viewBox: basicViewBox,
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
