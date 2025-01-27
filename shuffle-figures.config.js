import {
  generateShuffleFiguresQuestion,
  shuffleTypes,
} from "./shuffle-figures.generator.js";
import { colors, defaultViewBox, rgbColors } from "./common.config.js";
import { renderFigurePatternsQuestion } from "./figure-patterns.renderer.js";
import { generateShuffleFigurePatternsQuestion } from "./shuffle-figure-patterns.generator.js";

// todo(vmyshko): currently, shift is used for most multi-color
// it (or any other similar) should provide randomness,
// and color uniqueness inside 1 figure -- no duplicates
// maybe shiftage between pre-generated unique color-pairs? tripples?

// todo(vmyshko): allow to disable background for pattern, to use it from svg

// todo(vmyshko): maybe invent new config strucure for nested svgs with variability?
// the main idea is infinite-nesting blocks to build any svg structure
// use smth similar to react-templates but with generative blocks?

// what do i want?
// group figures into blocks
// color/rotate full block
// generate props for blocks
// put blocks into blocks
// rotate block parts

// it can be sepatated by:
// figure -- just <use> with link
// block -- rotation + color, is container for figures/uses

// SAMPLE -- quarters
/* 

block:
  block:
    fig: 'q-1'
    rot: 0
  block:
    fig: 'q-1'
    rot: 180
  color: red
  rot: 0

block:
  block:
    fig: 'q-1'
    rot: 0
  block:
    fig: 'q-1'
    rot: 180
  color: blue!
  rot: 180!

  in js:

  const block = {
    items: {
    },
    rot: 0,

  }

*/

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
const quarterColors = [colors.yellow, colors.blue, colors.red, colors.dark];
const frameColors = [colors.blue, colors.red, colors.white];
export const shuffleFiguresConfigs = {
  // star from tg
  // todo(vmyshko): this one seems broken, rotation logic is not clear and random
  rotStarTg: {
    patternsInCol: 3,
    patternsInCol: 3,
    viewBox: defaultViewBox,
    maxAnswerCount: 8,

    figureLink: "./images/rotation-star-tg.svg",

    figureParts: [
      {
        figures: [
          shuffleTypes.single({ items: ["background"] }),
          shuffleTypes.single({ items: ["star-bg"] }),
        ],

        // todo(vmyshko): should be fill/stroke instead of color?

        color: shuffleTypes.single({
          // todo(vmyshko): move blue-2 to colors? use material colors?
          items: ["#008DF4", colors.red],
        }),
      },
      {
        figures: [shuffleTypes.single({ items: ["star-arrow"] })],
        rotation: shuffleTypes.unique123({
          items: [0, 360 / 5, (360 / 5) * 2, (360 / 5) * 3, (360 / 5) * 4],
        }),
      },
    ],

    generator: generateShuffleFigurePatternsQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  color3Frames: {
    patternsInCol: 3,
    viewBox: defaultViewBox,
    maxAnswerCount: 8,

    questionMarkFigure: "frame-outer",

    figureLink: "./images/shuffle-frames.svg",

    figureParts: [
      {
        figures: [shuffleTypes.single({ items: ["fill-outer"] })],
        color: shuffleTypes.randomInCol({
          rowShift: 1,
          colShift: 3,
          items: frameColors,
          // shuffle: true,
        }),
      },
      {
        figures: [shuffleTypes.single({ items: ["fill-middle"] })],
        color: shuffleTypes.randomInCol({
          rowShift: 2,
          colShift: 3,
          items: frameColors,
          // shuffle: true,
        }),
      },
      {
        figures: [shuffleTypes.single({ items: ["fill-inner"] })],
        color: shuffleTypes.randomInCol({
          rowShift: 3,
          colShift: 3,
          items: frameColors,
          // shuffle: true,
        }),
      },

      {
        figures: [shuffleTypes.single({ items: ["frame-outer"] })],
        strokeWidth: shuffleTypes.shiftedBy({
          rowShift: 1,
          colShift: 0,
          items: [1, 5],
          shuffle: true,
        }),
      },
      {
        figures: [shuffleTypes.single({ items: ["frame-middle"] })],
        strokeWidth: shuffleTypes.shiftedBy({
          rowShift: 1,
          colShift: 1,
          items: [1, 5],
          shuffle: true,
        }),
      },
      {
        figures: [shuffleTypes.single({ items: ["frame-inner"] })],
        // todo(vmyshko): no inner frame in origin

        strokeWidth: shuffleTypes.single({ items: [1] }),
        // strokeWidth: shuffleTypes.shiftedBy({
        //   rowShift: 1,
        //   colShift: 0,
        //   items: [1, 5],
        // }),
      },
    ],

    generator: generateShuffleFigurePatternsQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  color3FramesBg: {
    patternsInCol: 3,
    viewBox: defaultViewBox,
    maxAnswerCount: 8,

    questionMarkFigure: "frame-outer",

    figureLink: "./images/shuffle-frames.svg",

    figureParts: [
      {
        figures: [shuffleTypes.single({ items: ["fill-outer"] })],
        color: shuffleTypes.randomInCol({
          rowShift: 1,
          colShift: 3,
          items: [colors.blue, colors.white],
          // shuffle: true,
        }),
      },
      {
        figures: [shuffleTypes.single({ items: ["fill-middle"] })],
        color: shuffleTypes.randomInCol({
          rowShift: 2,
          colShift: 3,
          items: [colors.blue, colors.white],
          // shuffle: true,
        }),
      },
      {
        figures: [shuffleTypes.single({ items: ["fill-inner"] })],
        color: shuffleTypes.randomInCol({
          rowShift: 3,
          colShift: 3,
          items: [colors.blue, colors.white],
          // shuffle: true,
        }),
      },

      {
        figures: [shuffleTypes.single({ items: ["frame-outer"] })],
        strokeWidth: shuffleTypes.randomInRow({
          rowShift: 1,
          colShift: 0,
          items: [1, 5],
          shuffle: true,
        }),
      },
      {
        figures: [shuffleTypes.single({ items: ["frame-middle"] })],
        strokeWidth: shuffleTypes.randomInRow({
          rowShift: 1,
          colShift: 1,
          items: [1, 5],
          shuffle: true,
        }),
      },
      {
        figures: [shuffleTypes.single({ items: ["frame-inner"] })],
        // todo(vmyshko): no inner frame in origin

        strokeWidth: shuffleTypes.single({ items: [1] }),
        // strokeWidth: shuffleTypes.shiftedBy({
        //   rowShift: 1,
        //   colShift: 0,
        //   items: [1, 5],
        // }),
      },
    ],

    generator: generateShuffleFigurePatternsQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  rotColorQuarters: {
    patternsInCol: 3,
    viewBox: defaultViewBox,
    maxAnswerCount: 8,
    questionMarkFigure: "circle",

    figureLink: "./images/shuffle-quarters.svg",

    figureParts: [
      {
        figures: [shuffleTypes.single({ items: ["quarter-1"] })],
        color: shuffleTypes.shiftedBy({
          rowShift: 2,
          items: quarterColors,
        }),
      },
      {
        figures: [shuffleTypes.single({ items: ["quarter-2"] })],
        // rotation: shuffleTypes.single({ items: [180] }),
        color: shuffleTypes.shiftedBy({
          rowShift: 2,
          colShift: 1,
          items: quarterColors,
        }),
      },
      {
        figures: [shuffleTypes.single({ items: ["quarter-3"] })],
        color: shuffleTypes.shiftedBy({
          rowShift: 2,
          items: quarterColors,
        }),
      },
      {
        figures: [shuffleTypes.single({ items: ["quarter-4"] })],
        color: shuffleTypes.shiftedBy({
          rowShift: 2,
          colShift: 1,
          items: quarterColors,
        }),
      },

      {
        figures: [shuffleTypes.single({ items: ["line-h"] })],
      },
      {
        figures: [shuffleTypes.single({ items: ["line-v"] })],
      },
      {
        figures: [shuffleTypes.single({ items: ["circle"] })],
      },
    ],

    generator: generateShuffleFigurePatternsQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  // rotColorSisiAnisi: {
  //   patternsInCol: 3,
  //   patternsInRow: 2,
  //   viewBox: defaultViewBox,
  //   maxAnswerCount: 8,
  //   questionMarkFigure: "circle",

  //   figureLink: "./images/arrow-icons.svg",

  //   figureParts: [
  //     {
  //       figures: [shuffleTypes.single({ items: ["circle"] })],
  //       color: shuffleTypes.rowProgression({ items: ["#f3d3bd", "#6c4f36"] }),
  //     },
  //     {
  //       figures: [shuffleTypes.single({ items: ["arrow-nipple"] })],
  //       color: shuffleTypes.rowProgression({
  //         rowShift: 2,
  //         items: ["#c28875", "#544039"],
  //       }),
  //       rotation: shuffleTypes.unique123({
  //         items: [135, 180, 180 + 45],
  //       }),
  //     },
  //   ],

  //   generator: generateShuffleFigurePatternsQuestion,
  //   renderer: renderFigurePatternsQuestion,
  // },

  rotColorTriangles: {
    patternsInCol: 3,
    viewBox: defaultViewBox,
    maxAnswerCount: 8,

    figureLink: "./images/shuffle-2-triangles.svg",

    figureParts: [
      {
        figures: [shuffleTypes.single({ items: ["triangle-top"] })],
        color: shuffleTypes.shiftedBy({
          rowShift: 2,
          items: [colors.blue, colors.red, colors.yellow],
        }),
      },
      {
        figures: [shuffleTypes.single({ items: ["triangle-bottom"] })],
        color: shuffleTypes.shiftedBy({
          rowShift: 2,
          colShift: 2,
          items: [colors.blue, colors.red, colors.yellow],
        }),
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

    viewBox: "0 0 106 106",
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
            rowShift: 2,
            items: ["one", "two", "three", "four", "five", "six"],
          }),
        ],
        color: shuffleTypes.shiftedBy({
          items: [colors.yellow, colors.red, colors.blue],
          rowShift: 2,
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

    generator: generateShuffleFigurePatternsQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  rotIcons: {
    patternsInCol: 2, // hard to solve
    patternsInCol: 3,
    viewBox: defaultViewBox,
    scale: 0.7,

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
        // todo(vmyshko): impl or not?
        // scale: shuffleTypes.single({ items: [0.7] }),
      },
    ],

    generator: generateShuffleFigurePatternsQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  colRotHalves: {
    patternsInCol: 3,
    patternsInCol: 2,
    viewBox: "0 0 104 104",
    maxAnswerCount: 8,

    noRotationAnimation: true,

    figureLink: "./images/shuffle-halves.svg",

    figureParts: [
      {
        figures: [shuffleTypes.unique123({ items: ["shuffle-halves"] })],
        color: shuffleTypes.unique123({ items: [...rgbColors] }),
        rotation: shuffleTypes.unique123({ items: [0, 180] }),
      },
    ],

    generator: generateShuffleFigurePatternsQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  cardSuits: {
    patternsInCol: 3,
    viewBox: defaultViewBox,
    maxAnswerCount: 8,

    figureLink: "./images/card-suits.svg",

    figureParts: [
      {
        figures: [
          // todo(vmyshko): make possible random between sets
          // todo(vmyshko):  diamonds are bad for rotation
          shuffleTypes.unique123({
            items: ["heart-1", "heart-2", "heart-3"],
            items: ["spade-1", "spade-2", "spade-3"],
            items: ["club-1", "club-2", "club-3"],
            items: ["club-1", "mix-2", "mix-3"],
          }),
        ],

        color: shuffleTypes.single({ items: ["black"] }),
        rotation: shuffleTypes.unique123({ items: [0, 90, 180] }),
      },
    ],

    generator: generateShuffleFigurePatternsQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  figRotLetters: {
    patternsInCol: 3,
    viewBox: defaultViewBox,
    maxAnswerCount: 8,

    figureLink: "./images/letters-ptu.svg",

    figureParts: [
      {
        figures: [
          shuffleTypes.unique123({
            items: ["letter-p", "letter-t", "letter-u"],
          }),
        ],

        // todo(vmyshko):  impl ability to gen 1-color-for-all (incl answers?)
        color: shuffleTypes.single({
          items: [colors.black],
        }),
        rotation: shuffleTypes.unique123({ items: [0, 90, 180] }),
      },
    ],

    generator: generateShuffleFigurePatternsQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  fig2_RectTriangleCircle: {
    patternsInCol: 3,
    viewBox: "0 0 106 106",
    scale: 0.8,
    maxAnswerCount: 8,

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
    generator: generateShuffleFigurePatternsQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  fig1_RectTriangleCircle: {
    patternsInCol: 3,
    viewBox: "0 0 106 106",
    scale: 0.8,
    maxAnswerCount: 8,

    figureLink: "./images/inner-rect-triangle-circle.svg",

    figureParts: [
      {
        figures: [
          shuffleTypes.unique123({ items: ["circle", "rect", "triangle"] }),
        ],

        // color: shuffleTypes.single({ items: [colors.blue] }),
        color: shuffleTypes.rowProgression({ items: [...rgbColors] }),
      },
    ],
    generator: generateShuffleFigurePatternsQuestion,
    renderer: renderFigurePatternsQuestion,
  },
};
