import {
  generateShuffleFiguresQuestion,
  shuffleTypes,
} from "./shuffle-figures.generator.js";
import { scaleViewBox } from "./common.js";
import { renderFiguresQuestion } from "./figures.renderer.js";
import { colors, defaultColors, rgbColors } from "./common.config.js";

const defaultViewBox = "0 0 100 100";
const alternateViewBox = "2 2 100 100";

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

  // colRotHalves: {
  //   patternsInCol: 3,
  //   patternsInCol: 2,
  //   viewBox: scaleViewBox(defaultViewBox, 1),
  //   viewBox: scaleViewBox(alternateViewBox, 1),
  //   viewBox: scaleViewBox("0 0 104 104", 1),
  //   maxAnswerCount: 8,

  //   figureLink: "./images/shuffle-halves.svg",

  //   figureGroups: [
  //     {
  //       figures: ["shuffle-halves"],
  //       shuffleType: shuffleTypes.unique123,
  //     },
  //   ],
  //   colorGroups: [
  //     {
  //       colors: [...defaultColors],
  //       colors: [...rgbColors],
  //       shuffleType: shuffleTypes.unique123,
  //     },
  //   ],
  //   rotationGroups: [
  //     {
  //       // rotations: [0, 90, 180],
  //       rotations: [0, 180],
  //       shuffleType: shuffleTypes.unique123,
  //     },
  //   ],

  //   generator: generateShuffleFiguresQuestion,
  //   renderer: renderFiguresQuestion,
  // },

  // figRotSpades: {
  //   patternsInCol: 3,
  //   viewBox: scaleViewBox(defaultViewBox, 1),
  //   viewBox: scaleViewBox("0 0 106 106", 1),
  //   maxAnswerCount: 8,

  //   figureLink: "./images/shuffle-spades.svg",

  //   figureGroups: [
  //     {
  //       figures: ["spade-1", "spade-2", "spade-3"],
  //       shuffleType: shuffleTypes.unique123,
  //     },
  //   ],
  //   colorGroups: [
  //     {
  //       colors: ["black"],
  //       shuffleType: shuffleTypes.unique123,
  //     },
  //   ],
  //   rotationGroups: [
  //     {
  //       rotations: [0, 90, 180],
  //       shuffleType: shuffleTypes.unique123,
  //     },
  //   ],

  //   generator: generateShuffleFiguresQuestion,
  //   renderer: renderFiguresQuestion,
  // },

  // figRotLetters: {
  //   patternsInCol: 3,
  //   viewBox: scaleViewBox(defaultViewBox, 1),
  //   // viewBox: scaleViewBox("0 0 80 80", 1),
  //   maxAnswerCount: 8,

  //   figureLink: "./images/letters-ptu.svg",

  //   figureGroups: [
  //     {
  //       figures: ["letter-p", "letter-t", "letter-u"],
  //       shuffleType: shuffleTypes.unique123,
  //     },
  //   ],
  //   colorGroups: [
  //     {
  //       colors: ["black"],
  //       shuffleType: shuffleTypes.unique123,
  //     },
  //   ],
  //   // colors: [...defaultColors],
  //   rotationGroups: [
  //     {
  //       rotations: [0, 90, 180],
  //       shuffleType: shuffleTypes.unique123,
  //     },
  //   ],

  //   generator: generateShuffleFiguresQuestion,
  //   renderer: renderFiguresQuestion,
  // },

  // fig1_RectTriangleCircle: {
  //   patternsInCol: 3,
  //   viewBox: scaleViewBox("0 0 106 106", 0.8),
  //   maxAnswerCount: 8,

  //   shuffleType: shuffleTypes.unique123,

  //   figureLink: "./images/inner-rect-triangle-circle.svg",

  //   // patternsInCol: 2,

  //   figureGroups: [
  //     {
  //       figures: ["circle", "rect", "triangle"],
  //       shuffleType: shuffleTypes.unique123,
  //     },
  //     // todo(vmyshko): add colors /rotations per fig group?
  //     {
  //       figures: ["inner-circle", "inner-rect", "inner-triangle"],
  //       shuffleType: shuffleTypes.unique123,
  //     },
  //   ],

  //   colorGroups: [
  //     {
  //       // todo(vmyshko): can be more than 3
  //       colors: [...rgbColors],
  //       shuffleType: shuffleTypes.unique123,
  //     },
  //   ],

  //   rotationGroups: [
  //     {
  //       rotations: [0],
  //       shuffleType: shuffleTypes.unique123,
  //     },
  //   ],

  //   //rotations? groups?

  //   generator: generateShuffleFiguresQuestion,
  //   renderer: renderFiguresQuestion,
  // },

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
