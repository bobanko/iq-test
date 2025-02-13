import { renderCutoutQuestion } from "./cutout.renderer.js";
import { generateCutoutQuestion } from "./cutout.generator.js";

const defaultCutoutViewBox = "0 0 320 320";

const figsFn = (prefix, count = 1) =>
  Array(count)
    .fill(null)
    .map((_, index) => `${prefix}${index + 1}`);

export const cutoutConfigs = {
  // todo(vmyshko): impl color change
  // todo(vmyshko): impl answer rotation
  // todo(vmyshko): impl altering patterns(figures

  cutout_ravenA8: {
    skip: true,
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
    // maxAnswerCount: 6,

    generator: generateCutoutQuestion,
    renderer: renderCutoutQuestion,
  },

  cutout_go: {
    order: 20,
    // todo(vmyshko): something is off (on iphone?), investigate
    viewBox: "4 4 320 320",
    viewBox: defaultCutoutViewBox,
    figureLink: "./images/cutout-go.svg",
    figures: ["pattern"],

    cutoutSize: 76,
    cutoutPoints: [
      [175, 175],
      [175, 122],
      [175, 69],
      [122, 175],
      // [122, 122], // center
      [122, 69],
      [69, 175],
      [69, 122],
      [69, 69],
    ],

    patternsInCol: 1,
    patternsInRow: 1,
    // maxAnswerCount: 8,

    generator: generateCutoutQuestion,
    renderer: renderCutoutQuestion,
  },

  iq37alt_cutout_spikes: {
    order: 37,
    viewBox: defaultCutoutViewBox,
    figureLink: "./images/cutout-spikes.svg",
    figures: [
      "pattern",
      // "questions"
    ],
    // variants: figsFn("lines-", 6),

    cutoutSize: 78,
    cutoutPoints: [
      [221, 201],
      [221, 41],
      [21, 201],
      [221, 121],
      [21, 41],
      [21, 121],
      [121, 81],
      [121, 161],
    ],

    patternsInCol: 1,
    patternsInRow: 1,
    // maxAnswerCount: 8,

    generator: generateCutoutQuestion,
    renderer: renderCutoutQuestion,
  },

  iq24alt_cutout_circlesStroked: {
    order: 24,
    viewBox: defaultCutoutViewBox,
    figureLink: "./images/cutout-circles-stroke.svg",
    figures: [
      "pattern",
      //"questions"
    ],
    // variants: figsFn("lines-", 6),
    styles: {
      // "--stroke": "#FF5455",
      // "--fill": "#2A468E",

      "--primary-color": "var(--stroke, #FF5455)",
      "--secondary-color": "var(--fill, #2A468E)",
    },

    cutoutSize: 78,
    cutoutPoints: [
      [169, 121],
      [239, 121],
      [73, 121],
      [3, 121],
      [121, 73],
      [121, 3],
      [121, 169],
      [121, 239],
    ],

    patternsInCol: 1,
    patternsInRow: 1,
    // maxAnswerCount: 8,

    generator: generateCutoutQuestion,
    renderer: renderCutoutQuestion,
  },

  iq25_cutout_raysBox: {
    order: 25,
    // skip: true,
    // todo(vmyshko): maybe colors can be random?
    viewBox: defaultCutoutViewBox,
    figureLink: "./images/cutout-rays-box.svg",
    figures: ["pattern"],
    variants: figsFn("lines-", 6),

    cutoutSize: 140,
    cutoutPoints: [[121 - 30, 116 - 30]],

    patternsInCol: 1,
    patternsInRow: 1,
    // maxAnswerCount: 8,

    generator: generateCutoutQuestion,
    renderer: renderCutoutQuestion,
  },

  cutout_4figs: {
    skip: true,
    viewBox: defaultCutoutViewBox,
    figureLink: "./images/cutout-4figs.svg",
    figures: ["pattern"],

    cutoutSize: 80,
    cutoutPoints: [
      // todo(vmyshko): add one more answer!
      [145, 120],
      [225, 120],
      [121, 120],
      [59, 120],
      [121, 197],
    ],

    patternsInCol: 1,
    patternsInRow: 1,
    maxAnswerCount: 5,

    generator: generateCutoutQuestion,
    renderer: renderCutoutQuestion,
  },

  iq24_cutout_linesOrig: {
    // todo(vmyshko): maybe scale up whole img to make it more readable on small screens
    skip: true,
    viewBox: defaultCutoutViewBox,
    figureLink: "./images/cutout-lines-orig.svg",
    figures: ["pattern"],

    cutoutSize: 93,
    cutoutPoints: [
      // todo(vmyshko): read cutout points from svg?
      [118.5, 86.5],
      [41.5, 109.5],
      [90.5, 91.5],
      [122.5, 94.5],
      [108.5, 113.5],
      [95.5, 121.5],
    ],

    patternsInCol: 1,
    patternsInRow: 1,
    // maxAnswerCount: 6,

    generator: generateCutoutQuestion,
    renderer: renderCutoutQuestion,
  },

  cutout_linesMod: {
    skip: true,
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
    // maxAnswerCount: 6,

    generator: generateCutoutQuestion,
    renderer: renderCutoutQuestion,
  },

  cutout_star: {
    skip: true,
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
    // maxAnswerCount: 6,

    generator: generateCutoutQuestion,
    renderer: renderCutoutQuestion,
  },
};
