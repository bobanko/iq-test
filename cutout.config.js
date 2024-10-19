import { renderCutoutQuestion } from "./cutout.renderer.js";
import { generateCutoutQuestion } from "./cutout.generator.js";

const defaultCutoutViewBox = "0 0 320 320";

const figsFn = (prefix, count = 1) =>
  Array(count)
    .fill(null)
    .map((_, index) => `${prefix}${index + 1}`);

export const cutoutConfigs = {
  cutout_linesOrig: {
    viewBox: defaultCutoutViewBox,
    figureLink: "./images/cutout-lines-orig.svg",
    figures: ["pattern"],

    cutoutSize: 93,
    cutoutPoints: [
      [118.5, 86.5],
      [41.5, 109.5],
      [90.5, 91.5],
      [122.5, 94.5],
      [108.5, 113.5],
      [95.5, 121.5],
    ],

    patternsInCol: 1,
    patternsInRow: 1,
    maxAnswerCount: 6,

    generator: generateCutoutQuestion,
    renderer: renderCutoutQuestion,
  },

  cutout_linesMod: {
    viewBox: defaultCutoutViewBox,
    figureLink: "./images/cutout-lines-mod.svg",
    figures: ["pattern"],

    cutoutSize: 80,
    cutoutPoints: [
      [136.5, 98.5],
      [59.5, 108.5],
      [99.5, 101.5],
      [73.5, 83.5],
      [89.5, 68.5],
      [108.5, 137.5],
    ],

    patternsInCol: 1,
    patternsInRow: 1,
    maxAnswerCount: 6,

    generator: generateCutoutQuestion,
    renderer: renderCutoutQuestion,
  },

  cutout_ravenA8: {
    viewBox: defaultCutoutViewBox,
    figureLink: "./images/cutout-raven-a8.svg",
    figures: ["pattern"],

    cutoutSize: 80,
    cutoutPoints: [
      [202, 202],
      [202, 122],
      [202, 42],
      [122, 202],
      [122, 122],
      [122, 42],
      [42, 202],
      [42, 122],
      [42, 42],
    ],

    patternsInCol: 1,
    patternsInRow: 1,
    maxAnswerCount: 6,

    generator: generateCutoutQuestion,
    renderer: renderCutoutQuestion,
  },

  cutout_star: {
    viewBox: defaultCutoutViewBox,
    figureLink: "./images/cutout-star.svg",
    figures: ["pattern"],

    cutoutSize: 80,
    cutoutPoints: [
      [242, 87],
      [2, 87],
      [122, 2],
      [42, 242],
      [42, 108],
      [86, 82],
      [180, 202],
      [158, 82],
      [122, 192],
      [208, 102],
      [208, 239],
      [62, 148],
      [122, 131],
      [67, 205],
      [180, 152],
      [122, 33],
      [2, 2],
    ],

    patternsInCol: 1,
    patternsInRow: 1,
    maxAnswerCount: 6,

    generator: generateCutoutQuestion,
    renderer: renderCutoutQuestion,
  },
};
