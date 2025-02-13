import { colors, defaultViewBox, rgbColors } from "./common.config.js";
import { renderFigurePatternsQuestion } from "./figure-patterns.renderer.js";
import { generateShuffleFigurePatternsQuestion } from "./shuffle-figure-patterns.generator.js";
import {
  generateSequenceQuestion,
  shuffleTypes,
} from "./shuffle-figures.generator.js";

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
// shuffle all rows/cols patterns with rule

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

export const shuffleFiguresConfigs = {
  // exact match with base test
  iq29_figDice: {
    order: 29,
    // todo(vmyshko): randomize colors per fig
    // todo(vmyshko): try maybe shift start fig?

    // gen config
    patternsInCol: 3,
    patternsInRow: 3,
    // maxAnswerCount: 10,

    // const [rowShift, colShift] = [0, 0]; // all same
    // const [rowShift, colShift] = [1, 0]; // row changes
    // const [rowShift, colShift] = [0, 1]; // col changes
    // const [rowShift, colShift] = [1, 1]; // 123 but each row shifts 1 left // secondary mtx diag same
    // const [rowShift, colShift] = [2, 1]; // (orig for dice) 123 but each row shifts 2 left (or 1 right) // main mtx diag same
    // const [rowShift, colShift] = [1, 2]; //same as [2,1] but Vertical
    // todo(vmyshko): how to combine both secondary and primary diags? [2,1] & [1,2]

    preGenConfig: [
      // todo(vmyshko): add named bytes?
      {
        // figs
        count: 6,
        // todo(vmyshko): randomize shifts [2,1] and [1,2]
        shifts: [2, 1], // orig dice
      },
      {
        //colors
        count: 3,
        shifts: [2, 1], // orig dice
        shuffle: true,
      },
    ],

    preRenderConfig: {
      sets: {
        figs: ["one", "two", "three", "four", "five", "six"],
        colors: [colors.yellow, colors.red, colors.blue],
      },

      // shift or randomize?
      figureParts: [
        {
          figures: [{ static: "frame" }, { byteIndex: 0, from: "figs" }],
          color: { byteIndex: 1, from: "colors" },
        },
      ],
    },

    // render config
    figureLink: "./images/shuffle-dice-cult.svg",
    viewBox: "0 0 106 106",

    //----

    generator: generateSequenceQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  iq39_cardSuits: {
    order: 39,
    // todo(vmyshko): recheck logic, seems unsolvable, diff with orig
    patternsInCol: 3,
    // maxAnswerCount: 8,
    // noRotationAnimation: true,

    // todo(vmyshko): move to pregenconf?
    fullShuffle: true,

    preGenConfig: [
      // todo(vmyshko): add named bytes?
      {
        // figs
        count: 3,
        shifts: [2, 1],
      },
      {
        //rots
        count: 3,
        shifts: [0, 1],
      },
    ],

    preRenderConfig: {
      sets: {
        // todo(vmyshko):  diamonds are bad for rotation
        //alts
        // todo(vmyshko): make possible random between those
        // items: ["heart-1", "heart-2", "heart-3"],
        // items: ["spade-1", "spade-2", "spade-3"],
        // items: ["club-1", "club-2", "club-3"],
        figs: ["club-1", "mix-2", "mix-3"],
        rots: [0, 90, 180],
      },

      // shift or randomize?
      figureParts: [
        {
          figures: [{ byteIndex: 0, from: "figs" }],
          // color: { static: colors.black },
          rotation: { byteIndex: 1, from: "rots" },
        },
      ],
    },

    figureLink: "./images/card-suits.svg",
    viewBox: defaultViewBox,

    generator: generateSequenceQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  iq27_figRotLetters: {
    order: 27,
    // each fig rotates 90deg cw H
    // figs shuffled in cols
    patternsInCol: 3,
    // maxAnswerCount: 8,

    preGenConfig: [
      {
        // figs
        count: 3,
        // todo(vmyshko): add random [1,2]
        shifts: [2, 1],
        shuffle: true,
      },
      {
        //rots
        count: 3,
        shifts: [0, 1],
      },
      // {
      //   //cols
      //   count: 3,
      //   // todo(vmyshko): allow random
      //   shifts: [0, 1],
      // },
    ],

    preRenderConfig: {
      sets: {
        figs: ["letter-p", "letter-t", "letter-u"],
        rots: [0, 90, 180],
        cols: [...rgbColors],
      },

      // shift or randomize?
      figureParts: [
        {
          figures: [{ byteIndex: 0, from: "figs" }],
          color: { static: colors.blue },
          // color: { byteIndex: 0, from: "cols" },
          rotation: { byteIndex: 1, from: "rots" },
        },
      ],
    },

    figureLink: "./images/letters-ptu.svg",
    viewBox: defaultViewBox,

    generator: generateSequenceQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  iq19_rotIcons: {
    order: 19,
    // todo(vmyshko): gen answers with question colors only
    patternsInCol: 2, // hard to solve

    preGenConfig: [
      {
        // figs
        count: 3,
        shifts: [2, 1],
      },
      {
        //rots
        count: 2,
        shifts: [1, 0],
      },
      // {
      //   //cols
      //   count: 3,
      //   // todo(vmyshko): allow random
      //   shifts: [0, 1],
      // },
    ],

    shuffleRows: true,
    preRenderConfig: {
      sets: {
        figs: ["battery", "drop", "signal"],
        cols: [...rgbColors],
        rots: [0, 180],
      },

      // shift or randomize?
      figureParts: [
        {
          figures: [{ byteIndex: 0, from: "figs" }],
          rotation: { byteIndex: 1, from: "rots" },
          // color: { byteIndex: 1, from: "cols" },
          color: { static: colors.blue },
        },
      ],
    },

    figureLink: "./images/mobile-icons.svg",
    viewBox: defaultViewBox,
    scale: 0.7,

    generator: generateSequenceQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  iq30_rotColorTriangles: {
    order: 30,
    // todo(vmyshko): randomize colors
    // todo(vmyshko): randomize base rotation

    patternsInCol: 3,
    patternsInRow: 3,
    // maxAnswerCount: 18,

    preGenConfig: [
      {
        //cols1
        count: 3,
        // todo(vmyshko): allow random
        shifts: [0, 1],
      },
      // {
      //   //cols2
      //   count: 3,
      //   // todo(vmyshko): allow random
      //   shifts: [0, 1, 1],
      // },
      {
        //rots
        count: 2,
        shifts: [1, 0],
      },
    ],

    shuffleRows: true,

    // todo(vmyshko): add in-row shuffle

    preRenderConfig: {
      sets: {
        cols: [colors.yellow, colors.blue, colors.red],
        rots: [0, 180],
      },

      // shift or randomize?
      figureParts: [
        {
          figures: [{ static: "triangle-bottom" }],
          color: { byteIndex: 0, from: "cols" },
          rotation: { byteIndex: 1, from: "rots" },
        },
        {
          figures: [{ static: "triangle-top" }],
          color: { byteIndex: 0, from: "cols", shift: 1 },
          rotation: { byteIndex: 1, from: "rots" },
        },
        {
          figures: [{ static: "diagonal" }],
          rotation: { byteIndex: 1, from: "rots" },
        },
      ],
    },

    figureLink: "./images/shuffle-2-triangles.svg",
    viewBox: defaultViewBox,
    noRotationAnimation: true,

    generator: generateSequenceQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  rotColorSisiAnisi: {
    skip: true,
    patternsInCol: 3,
    patternsInRow: 2,
    // maxAnswerCount: 8,

    preGenConfig: [
      {
        //rots
        count: 3,
        shifts: [1, 1],
        shuffle: true,
      },
      {
        //cols - one for two, like theme
        count: 2,
        // todo(vmyshko): allow random
        shifts: [1, 0],
        shuffle: true,
      },
    ],

    preRenderConfig: {
      sets: {
        rots: [135, 180, 180 + 45],
        cols1: ["#c28875", "#544039"],
        cols2: ["#f3d3bd", "#6c4f36"],
      },

      // shift or randomize?
      figureParts: [
        {
          figures: [{ static: "circle" }],
          color: { byteIndex: 1, from: "cols2" },
        },
        {
          figures: [{ static: "arrow-nipple" }],
          color: { byteIndex: 1, from: "cols1" },
          rotation: { byteIndex: 0, from: "rots" },
        },
      ],
    },

    figureLink: "./images/arrows.svg",
    viewBox: defaultViewBox,
    questionMarkFigure: "circle",

    generator: generateSequenceQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  iq14alt_fig2_RectTriangleCircle: {
    order: 14,
    patternsInCol: 3,
    patternsInCol: 2,
    // maxAnswerCount: 8,

    preGenConfig: [
      {
        //figs-1
        count: 3,
        shifts: [1, 1],
        shuffle: true,
      },
      {
        //figs-2
        count: 3,
        shifts: [1, 2, 1],
        shuffle: true,
      },
      // {
      //   //colors
      //   count: 3,
      //   shifts: [0, 0],
      //   shuffle: true,
      // },
    ],

    preRenderConfig: {
      sets: {
        figs1: ["circle", "rect", "triangle"],
        figs2: ["inner-circle", "inner-rect", "inner-triangle"],
        cols: [colors.red, colors.green, colors.blue],
      },

      // shift or randomize?
      figureParts: [
        {
          figures: [{ byteIndex: 0, from: "figs1" }],
          // color: { byteIndex: 2, from: "cols" },
          color: { static: colors.blue },
        },
        {
          figures: [{ byteIndex: 1, from: "figs2" }],
          // color: { byteIndex: 2, from: "cols" },
          color: { static: colors.blue },
        },
      ],
    },

    figureLink: "./images/inner-rect-triangle-circle.svg",
    viewBox: "0 0 106 106",
    scale: 0.8,

    //rotations? groups?
    generator: generateSequenceQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  iq38_color3Frames: {
    order: 38,
    // todo(vmyshko): randomize columns (not impl yet)
    patternsInCol: 3,
    // maxAnswerCount: 8,

    preGenConfig: [
      {
        //color-theme
        count: 3,
        shifts: [1, 1],
        shuffle: true,
      },
      {
        //frame
        count: 2,
        shifts: [1, 1],
        shuffle: true,
      },
    ],

    preRenderConfig: {
      sets: {
        col: [colors.red, colors.blue, colors.white],
        frame: [1, 5],
      },

      // shift or randomize?
      figureParts: [
        {
          figures: [{ static: "fill-outer" }],
          color: { byteIndex: 0, from: "col" },
        },
        {
          figures: [{ static: "fill-middle" }],
          color: { byteIndex: 0, from: "col", shift: 1 },
        },
        {
          figures: [{ static: "fill-inner" }],
          color: { byteIndex: 0, from: "col", shift: 2 },
        },
        {
          figures: [{ static: "frame-outer" }],
          strokeWidth: { byteIndex: 1, from: "frame" },
        },
        {
          figures: [{ static: "frame-middle" }],
          strokeWidth: { byteIndex: 1, from: "frame", shift: 1 },
        },
        {
          figures: [{ static: "frame-inner" }],
          strokeWidth: { static: 1 },
        },
      ],
    },

    figureLink: "./images/shuffle-frames.svg",
    viewBox: defaultViewBox,
    questionMarkFigure: "frame-outer",

    generator: generateSequenceQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  iq13_rotColorQuarters: {
    order: 13,
    // skip: true,

    patternsInCol: 2,
    maxAnswerCount: 6,

    preGenConfig: [
      {
        //color-theme
        count: 3,
        shifts: [1, 1],
        shuffle: true,
      },
      {
        //rot
        count: 2,
        shifts: [1, 0],
      },
    ],

    preRenderConfig: {
      sets: {
        col: [colors.yellow, colors.blue, colors.red, colors.dark],
        rot: [0, 90],
      },

      // shift or randomize?
      figureParts: [
        {
          figures: [{ static: "quarter-1" }, { static: "quarter-3" }],
          color: { byteIndex: 0, from: "col" },
          rotation: { byteIndex: 1, from: "rot" },
        },
        {
          figures: [{ static: "quarter-2" }, { static: "quarter-4" }],
          color: { byteIndex: 0, from: "col", shift: 1 },
          rotation: { byteIndex: 1, from: "rot" },
        },
        {
          figures: [
            { static: "line-h" },
            { static: "line-v" },
            { static: "circle" },
          ],
          rotation: { byteIndex: 1, from: "rot" },
        },
      ],
    },

    figureLink: "./images/shuffle-quarters.svg",
    viewBox: defaultViewBox,
    questionMarkFigure: "circle",

    generator: generateSequenceQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  fig1_RectTriangleCircle_iq14like: {
    skip: true,
    patternsInCol: 3,
    maxAnswerCount: 8,

    //new
    preGenConfig: [
      {
        //figs
        count: 3,
        shifts: [1, 1],
      },
      {
        //colors
        count: 3,
        shifts: [1, 0],
      },
    ],

    preRenderConfig: {
      sets: {
        fig: ["circle", "rect", "triangle"],
        col: [colors.red, colors.green, colors.blue],
      },

      figureParts: [
        {
          figures: [{ byteIndex: 0, from: "fig" }],
          color: { byteIndex: 1, from: "col" },
        },
      ],
    },

    //---
    figureLink: "./images/inner-rect-triangle-circle.svg",
    viewBox: "0 0 106 106",
    scale: 0.8,

    generator: generateSequenceQuestion,
    renderer: renderFigurePatternsQuestion,
  },
};

var kek = {
  // star from tg
  // todo(vmyshko): this one seems broken, rotation logic is not clear and random
  rotStarTg: {
    skip: true,
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

  iq37_color3FramesBg: {
    skip: true,
    // todo(vmyshko): probably broken logic, unsolvable
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

  id30_rotColorTriangles: {
    // todo(vmyshko): randomize colors
    // todo(vmyshko): randomize base rotation
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

  iq20_colRotHalves: {
    skip: true,
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
        // color: shuffleTypes.unique123({ items: [...defaultColors] }),
        rotation: shuffleTypes.unique123({ items: [0, 180] }),
      },
    ],

    generator: generateShuffleFigurePatternsQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  iq14_fig2_RectTriangleCircle: {
    order: 14,
    skip: true,
    patternsInCol: 3,
    viewBox: "0 0 106 106",
    scale: 0.8,
    // maxAnswerCount: 8,

    figureLink: "./images/inner-rect-triangle-circle.svg",

    patternsInCol: 2,

    // todo(vmyshko): only presented colors for answers
    // todo(vmyshko): more chaotic shuffle, as in orig
    // todo(vmyshko): restyle svgs
    figureParts: [
      {
        figures: [
          shuffleTypes.unique123({ items: ["circle", "rect", "triangle"] }),

          shuffleTypes.unique123({
            items: ["inner-circle", "inner-rect", "inner-triangle"],
          }),
        ],

        color: shuffleTypes.single({ items: [...rgbColors] }),
        rotation: shuffleTypes.single({ items: [0] }),
      },
    ],

    //rotations? groups?
    generator: generateShuffleFigurePatternsQuestion,
    renderer: renderFigurePatternsQuestion,
  },
};
