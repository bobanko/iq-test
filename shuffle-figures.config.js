import {
  generateShuffleFiguresQuestion,
  shuffleTypes,
} from "./shuffle-figures.generator.js";
import { scaleViewBox } from "./common.js";
import { renderFiguresQuestion } from "./figures.renderer.js";
import { colors, defaultColors, rgbColors } from "./common.config.js";
import { renderFigurePatternsQuestion } from "./figure-patterns.renderer.js";
import { generateShuffleFigurePatternsQuestion } from "./shuffle-figure-patterns.generator.js";

const defaultViewBox = "0 0 100 100";
const alternateViewBox = "2 2 100 100";

// todo(vmyshko): maybe invent new config strucure for nested svgs with variability?
// the main idea is infinite-nesting blocks to build any svg structure
// use smth similar to react-templates but with generative blocks?
// SAMPLE:
// double-triangles

{
  /* <pattern-fig>
  <block rot: [0,180]>
  #triangle, rot:0, color: red,
  #triangle, rot:180, color: blue
  #diagonal
  </block>
  
  </pattern-fig> */
}

//pattern

// figurePattern
// id
// rotation [0,180]
// [
// figure: triangle-top [fixed]
//  color: red [gen]

// triangle-bottom [fixed]
//  color: blue [gen]

// diagonal [fixed]
// ]

export const shuffleFiguresConfigs = {
  rotColorTriangles: {
    patternsInCol: 3,
    viewBox: scaleViewBox(defaultViewBox, 1),
    maxAnswerCount: 8,

    figureLink: "./images/shuffle-2-triangles.svg",

    figureParts: [
      {
        figures: [shuffleTypes.single({ items: ["triangle-top"] })],
        color: shuffleTypes.shiftedBy({
          shift: 2,
          items: [colors.blue, colors.red, colors.yellow],
        }),
        // rotation: shuffleTypes.rowProgression({ items: [0, 180] }),
      },
      {
        figures: [shuffleTypes.single({ items: ["triangle-bottom"] })],
        color: shuffleTypes.shiftedBy({
          shift: 2,
          colShift: 2,
          items: [colors.blue, colors.red, colors.yellow],
        }),
        // rotation: shuffleTypes.rowProgression({ items: [180, 0] }),
      },
      {
        figures: [shuffleTypes.single({ items: ["diagonal"] })],
      },
    ],

    generator: generateShuffleFigurePatternsQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  // exact match with base test
  figDice: {
    patternsInCol: 3,
    patternsInRow: 3,
    viewBox: scaleViewBox(defaultViewBox, 1),
    viewBox: scaleViewBox("0 0 106 106", 1),
    maxAnswerCount: 8,

    figureLink: "./images/shuffle-dice-cult.svg",

    // -----
    // todo(vmyshko):
    // figure-renderer should get (per pattern):
    // multiple parts: {
    //  figures = [],
    //  color: figureColor,
    //  rotation = 0,
    // }

    // figure-pattern, has:
    // ..multiple figure-parts:
    //    figure-part (svg), has:
    //       figures: [1..n],(use-s)
    //       color: '',
    //       rotation: 0,

    figureParts: [
      {
        // todo(vmyshko): probably it would be better not to call any fns in config
        // ...then will be possible to get raw data in generator if needed (for answer generation)
        //generators?
        figures: [
          shuffleTypes.single({ items: ["frame"] }),
          shuffleTypes.shiftedBy({
            shift: 2,
            items: ["one", "two", "three", "four", "five", "six"],
          }),
        ],
        color: shuffleTypes.shiftedBy({
          items: [colors.yellow, colors.red, colors.blue],
          shift: 2,
        }),
        // todo(vmyshko): or ignore for defaults
        rotation: shuffleTypes.single({ items: [0] }),
      },
      // {
      //   figures: [],
      //   color: "",
      //   rotation: "",
      // },
    ],

    generator: generateShuffleFiguresQuestion,
    renderer: renderFiguresQuestion,
  },

  rotIcons: {
    patternsInCol: 2, // hard to solve
    patternsInCol: 3,
    viewBox: scaleViewBox(defaultViewBox, 0.7),
    maxAnswerCount: 8,

    figureLink: "./images/shuffle-icons.svg",

    figureParts: [
      {
        figures: [
          shuffleTypes.unique123({ items: ["battery", "drop", "signal"] }),
        ],
        color: shuffleTypes.unique123({ items: [...rgbColors] }),
        // todo(vmyshko): or ignore for defaults
        rotation: shuffleTypes.unique123({ items: [0, 90, 180] }),
      },
    ],

    generator: generateShuffleFiguresQuestion,
    renderer: renderFiguresQuestion,
  },

  colRotHalves: {
    patternsInCol: 3,
    patternsInCol: 2,
    viewBox: scaleViewBox(defaultViewBox, 1),
    viewBox: scaleViewBox(alternateViewBox, 1),
    viewBox: scaleViewBox("0 0 104 104", 1),
    maxAnswerCount: 8,

    figureLink: "./images/shuffle-halves.svg",

    figureParts: [
      {
        figures: [shuffleTypes.unique123({ items: ["shuffle-halves"] })],
        color: shuffleTypes.unique123({ items: [...rgbColors] }),
        rotation: shuffleTypes.unique123({ items: [0, 180] }),
      },
    ],

    generator: generateShuffleFiguresQuestion,
    renderer: renderFiguresQuestion,
  },

  figRotSpades: {
    patternsInCol: 3,
    viewBox: scaleViewBox(defaultViewBox, 1),
    viewBox: scaleViewBox("0 0 106 106", 1),
    maxAnswerCount: 8,

    figureLink: "./images/shuffle-spades.svg",

    figureParts: [
      {
        figures: [
          shuffleTypes.unique123({ items: ["spade-1", "spade-2", "spade-3"] }),
        ],

        color: shuffleTypes.single({ items: ["black"] }),
        rotation: shuffleTypes.unique123({ items: [0, 90, 180] }),
      },
    ],

    generator: generateShuffleFiguresQuestion,
    renderer: renderFiguresQuestion,
  },

  figRotLetters: {
    patternsInCol: 3,
    viewBox: scaleViewBox(defaultViewBox, 1),
    // viewBox: scaleViewBox("0 0 80 80", 1),
    maxAnswerCount: 8,

    figureLink: "./images/letters-ptu.svg",

    figureParts: [
      {
        figures: [
          shuffleTypes.unique123({
            items: ["letter-p", "letter-t", "letter-u"],
          }),
        ],

        color: shuffleTypes.single({ items: ["black"] }),
        rotation: shuffleTypes.unique123({ items: [0, 90, 180] }),
      },
    ],

    generator: generateShuffleFiguresQuestion,
    renderer: renderFiguresQuestion,
  },

  fig2_RectTriangleCircle: {
    patternsInCol: 3,
    viewBox: scaleViewBox("0 0 106 106", 0.8),
    maxAnswerCount: 8,

    shuffleType: shuffleTypes.unique123,

    figureLink: "./images/inner-rect-triangle-circle.svg",

    // patternsInCol: 2,

    figureParts: [
      {
        figures: [
          shuffleTypes.unique123({ items: ["circle", "rect", "triangle"] }),

          shuffleTypes.unique123({
            items: ["inner-circle", "inner-rect", "inner-triangle"],
          }),
        ],

        color: shuffleTypes.unique123({ items: [...rgbColors] }),
        rotation: shuffleTypes.single({ items: [0] }),
      },
    ],

    //rotations? groups?

    generator: generateShuffleFiguresQuestion,
    renderer: renderFiguresQuestion,
  },

  fig1_RectTriangleCircle: {
    patternsInCol: 3,
    viewBox: scaleViewBox("0 0 106 106", 0.8),
    maxAnswerCount: 8,

    shuffleType: shuffleTypes.rowProgression,

    figureLink: "./images/inner-rect-triangle-circle.svg",

    figureParts: [
      {
        figures: [
          shuffleTypes.unique123({ items: ["circle", "rect", "triangle"] }),

          // shuffleTypes.unique123({
          //   items: ["inner-circle", "inner-rect", "inner-triangle"],
          // }),
        ],

        color: shuffleTypes.single({ items: [...rgbColors] }),
        color: shuffleTypes.single({ items: [colors.blue] }),
        rotation: shuffleTypes.single({ items: [0] }),
      },
    ],

    generator: generateShuffleFiguresQuestion,
    renderer: renderFiguresQuestion,
  },
};
