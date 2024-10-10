import {
  generateShuffleFiguresQuestion,
  shuffleTypes,
} from "./shuffle-figures.generator.js";
import { scaleViewBox } from "./common.js";
import { renderFiguresQuestion } from "./figures.renderer.js";
import { defaultColors, rgbColors } from "./common.config.js";

const defaultViewBox = "0 0 100 100";
const alternateViewBox = "2 2 100 100";

// shuffle types:
//1: progression|fixed|static
//2: random
//3: unique - 123,231,312; or 123,312,231;

// vars:
// 1-figure
// 2-figs
// fig+color
// fig+rotation
// color+rotation
// fig+color+rotation

// SAMPLE DRAFT
// modifiers: [
//   { type: "color", values: ["red", "green", "blue"] },
//   { type: "figure", values: ["triangle", "rect", "circle"] },
//   { type: "rotation", values: [0, 90, 180] },
// ],

export const shuffleFiguresConfigs = {
  // twoFigsRectTriangleCircle: {
  //   patternsInCol: 3,
  //   viewBox: scaleViewBox(alternateViewBox, 0.8),
  //   maxAnswerCount: 8,

  //   figureLink: "./images/inner-rect-triangle-circle.svg",

  //   figureGroups: [
  //     ["circle", "rect", "triangle"],
  //     ["inner-circle", "inner-rect", "inner-triangle"],
  //   ],
  //   colors: [...defaultColors],
  //   // colors: ["blue"],
  //   // rotations: [0, 90, 180, 270],

  //   generator: generateShuffleFiguresQuestion,
  //   renderer: renderFiguresQuestion,
  // },

  // rotColorTriangles: {
  //   patternsInCol: 2,
  //   viewBox: scaleViewBox(defaultViewBox, 1),
  //   maxAnswerCount: 8,

  //   figureLink: "./images/shuffle-2-triangles.svg",

  //   figureGroups: [
  //     ["triangle-top"],
  //     //  ["triangle-bottom"],

  //     ["diagonal"],
  //   ],
  //   colors: [...defaultColors],
  //   rotations: [0, 180],

  //   generator: generateShuffleFiguresQuestion,
  //   renderer: renderFiguresQuestion,
  // },

  // figDice: {
  //   patternsInCol: 2,
  //   viewBox: scaleViewBox(defaultViewBox, 1),
  //   viewBox: scaleViewBox("0 0 106 106", 1),
  //   maxAnswerCount: 8,

  //   figureLink: "./images/shuffle-dice-cult.svg",

  //   figureGroups: [["frame"], ["one", "two", "three", "four", "five", "six"]],
  //   colors: [...defaultColors],
  //   // colors: ["blue"],
  //   // rotations: [0, 90, 180],

  //   generator: generateShuffleFiguresQuestion,
  //   renderer: renderFiguresQuestion,
  // },

  // rotIcons: {
  //   patternsInCol: 2,
  //   viewBox: scaleViewBox(defaultViewBox, 0.7),
  //   maxAnswerCount: 8,

  //   figureLink: "./images/shuffle-icons.svg",

  //   figureGroups: [["battery", "drop", "signal"]],
  //   colors: [...rgbColors],
  //   // colors: ["blue"],
  //   rotations: [0, 90, 180],

  //   generator: generateShuffleFiguresQuestion,
  //   renderer: renderFiguresQuestion,
  // },

  // colRotHalves: {
  //   patternsInCol: 3,
  //   viewBox: scaleViewBox(defaultViewBox, 1),
  //   viewBox: scaleViewBox(alternateViewBox, 1),
  //   viewBox: scaleViewBox("0 0 104 104", 1),
  //   maxAnswerCount: 8,

  //   figureLink: "./images/shuffle-halves.svg",

  //   figureGroups: [
  //     ["shuffle-halves"],
  //     // ["inner-circle", "inner-rect", "inner-triangle"],
  //   ],
  //   colors: [...defaultColors],
  //   // colors: ["blue"],
  //   rotations: [0, 90, 180],

  //   generator: generateShuffleFiguresQuestion,
  //   renderer: renderFiguresQuestion,
  // },

  // figRotSpades: {
  //   patternsInCol: 3,
  //   viewBox: scaleViewBox(defaultViewBox, 1),
  //   viewBox: scaleViewBox("0 0 106 106", 1),
  //   maxAnswerCount: 8,

  //   figureLink: "./images/shuffle-spades.svg",

  //   figureGroups: [["spade-1", "spade-2", "spade-3"]],
  //   // colors: [...defaultColors],
  //   // colors: ["blue"],
  //   rotations: [0, 90, 180],

  //   generator: generateShuffleFiguresQuestion,
  //   renderer: renderFiguresQuestion,
  // },

  figRotLetters: {
    patternsInCol: 3,
    viewBox: scaleViewBox(defaultViewBox, 1),
    // viewBox: scaleViewBox("0 0 80 80", 1),
    maxAnswerCount: 8,

    figureLink: "./images/letters-ptu.svg",

    figureGroups: [
      {
        figures: ["letter-p", "letter-t", "letter-u"],
        shuffleType: shuffleTypes.unique123,
      },
    ],
    colorGroups: [
      {
        colors: ["black"],
        shuffleType: shuffleTypes.unique123,
      },
    ],
    // colors: [...defaultColors],
    rotationGroups: [
      {
        rotations: [0, 90, 180],
        shuffleType: shuffleTypes.unique123,
      },
    ],

    generator: generateShuffleFiguresQuestion,
    renderer: renderFiguresQuestion,
  },

  fig1_RectTriangleCircle: {
    patternsInCol: 3,
    viewBox: scaleViewBox("0 0 106 106", 0.8),
    maxAnswerCount: 8,

    shuffleType: shuffleTypes.unique123,

    figureLink: "./images/inner-rect-triangle-circle.svg",

    // patternsInCol: 2,

    figureGroups: [
      {
        figures: ["circle", "rect", "triangle"],
        shuffleType: shuffleTypes.unique123,
      },
      // todo(vmyshko): add colors /rotations per fig group?
      {
        figures: ["inner-circle", "inner-rect", "inner-triangle"],
        shuffleType: shuffleTypes.unique123,
      },
    ],

    colorGroups: [
      {
        // todo(vmyshko): can be more than 3
        colors: [...rgbColors],
        shuffleType: shuffleTypes.unique123,
      },
    ],

    rotationGroups: [
      {
        rotations: [0],
        shuffleType: shuffleTypes.unique123,
      },
    ],

    //rotations? groups?

    generator: generateShuffleFiguresQuestion,
    renderer: renderFiguresQuestion,
  },

  // fig2_RectTriangleCircle: {
  //   patternsInCol: 3,
  //   viewBox: scaleViewBox("0 0 106 106", 0.8),
  //   maxAnswerCount: 8,

  //   shuffleType: shuffleTypes.rowProgression,

  //   figureLink: "./images/inner-rect-triangle-circle.svg",

  //   figureGroups: [
  //     ["circle", "rect", "triangle"],
  //     ["inner-circle", "inner-rect", "inner-triangle"],
  //   ],

  //   colors: ["blue"],

  //   generator: generateShuffleFiguresQuestion,
  //   renderer: renderFiguresQuestion,
  // },
};
