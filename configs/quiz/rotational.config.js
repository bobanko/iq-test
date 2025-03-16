import { colorMixins, colors, defaultViewBox } from "../common.config.js";
import { renderRotationalQuestion } from "../../renderers/rotational.renderer.js";
import { generateRotationalQuestion } from "../../generators/rotational.generator.js";
import { generateSequenceQuestion } from "../../generators/shuffle-figures.generator.js";
import { renderFigurePatternsQuestion } from "../../renderers/figure-patterns.renderer.js";

const svgFigs = {
  quarter: "./images/clock-quarter.svg#quarter",
  circle: "./images/clock-circle.svg#circle",
  square: "./images/clock-square.svg#square",
  arrow: "./images/clock-arrow.svg#arrow",
  arrowAlt: "./images/clock-arrow-alt.svg#arrow-alt",

  //letters
  letterP: "./images/letters-ptu.svg#letter-p",
  letterT: "./images/letters-ptu.svg#letter-t",
  letterU: "./images/letters-ptu.svg#letter-u",

  // static
  hexFlake: "./images/hex-snowflake.svg#frame",
  hexTriad: "./images/hex-triad.svg#frame",
  hexSector60: "./images/hex-sector-60.svg#figure",
  hexSector120: "./images/hex-sector-120.svg#figure",
};

export const svgFrames = {
  pentagon: "./images/frame-pentagon.svg#frame",
  hexagon: "./images/frame-hexagon.svg#frame",
  circle: "./images/frame-circle.svg#frame",
  // todo(vmyshko): add square?
};

export const rotationalConfigs = {
  letters45_oldRender: {
    skip: true,

    figureLink: "./images/letters-ptu.svg",

    figs: [
      {
        pickFrom: [svgFigs.letterP, svgFigs.letterU, svgFigs.letterT],
        startDeg: 0, // initial rotation, before rules: 0, -45
        stepDeg: 45, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
        colorsFrom: [colors.black, colors.red, colors.green],
      },
    ],

    shiftColorsBetweenRows: false,
    onlyUniqueFigs: true, // [2 and more]
    noOverlap: false, // [2 and more] figs can overlap each other - have same deg
    answerCount: 6, // how many answers to generate per question

    generator: generateRotationalQuestion,
    renderer: renderRotationalQuestion,
    // renderer: renderFigurePatternsQuestion,
  },
  //  1 quarter (/arrow/circle/custom) 90deg
  oneQuarter90newRenderer: {
    // todo(vmyshko): broken!!!
    skip: true,
    figureLink: "./images/clock-quarter.svg",

    figs: [
      {
        pickFrom: [svgFigs.quarter],
        colorsFrom: [colors.black, colors.red, colors.green],
        startDeg: 45, // initial rotation, before rules: 0, -45
        stepDeg: 90, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
    ],

    shiftColorsBetweenRows: true,
    onlyUniqueFigs: true, // [2 and more]
    noOverlap: false, // [2 and more] figs can overlap each other - have same deg
    answerCount: 4, // how many answers to generate per question

    generator: generateRotationalQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  oneQuarter90: {
    skip: true,
    figs: [
      {
        pickFrom: [svgFigs.quarter],
        startDeg: 45, // initial rotation, before rules: 0, -45
        stepDeg: 90, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
    ],

    shiftColorsBetweenRows: true,
    onlyUniqueFigs: true, // [2 and more]
    noOverlap: false, // [2 and more] figs can overlap each other - have same deg
    answerCount: 4, // how many answers to generate per question

    generator: generateRotationalQuestion,
    renderer: renderRotationalQuestion,
  },

  iq40_hexCircle_like_pentagon_shuffleBased: {
    order: 40,

    byteGenConfig: [
      {
        fn: ({ row, col, rndGlobal }) => (row + 1) * col + rndGlobal,
        max: 5,
      },
      {
        fn: ({}) => 0,
        max: 2, // to get extra color in answers
      },
    ],

    preRenderConfig: {
      sets: {
        rot: Array(5)
          .fill(null)
          .map((_, i) => (360 / 5) * i),
        col: [colors.red, colors.green],
      },

      figureParts: [
        {
          figures: [{ static: "pentagon" }],
          color: { static: colors.white },
        },

        {
          figures: [{ static: "arrow-circle" }],
          rotation: { byteIndex: 0, from: "rot" },
          color: { byteIndex: 1, from: "col" },
          stroke: { static: colorMixins.darken },
        },
      ],
    },

    figureLink: "./images/arrows.svg",
    viewBox: defaultViewBox,
    // questionMarkFigure: "hexagon",
    questionMarkFigure: "pentagon",

    generator: generateSequenceQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  iq40alt_hexCircle_like_hexagon_shuffleBased: {
    // todo(vmyshko): this is replacement for pentagon orig, due to lack of answers (5)
    skip: true,
    order: 40,

    byteGenConfig: [
      {
        fn: ({ row, col, rndGlobal }) => (row + 1) * col + rndGlobal,
        max: 6,
      },
    ],

    preRenderConfig: {
      sets: {
        rot: Array(6)
          .fill(null)
          .map((_, i) => (360 / 6) * i),
      },

      figureParts: [
        {
          figures: [{ static: "hexagon" }],
          color: { static: colors.white },
        },

        {
          figures: [{ static: "arrow-circle" }],
          rotation: { byteIndex: 0, from: "rot" },
          color: { static: colors.red },
          stroke: { static: colorMixins.darken },
        },
      ],
    },

    figureLink: "./images/arrows.svg",
    viewBox: defaultViewBox,
    questionMarkFigure: "hexagon",

    generator: generateSequenceQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  // clock 2
  iq34_clock4590: {
    skip: true,
    figs: [
      {
        pickFrom: [svgFigs.arrow],
        startDeg: 0, // initial rotation, before rules: 0, -45
        stepDeg: 45, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
      {
        pickFrom: [svgFigs.circle, svgFigs.square],
        startDeg: 0, // initial rotation, before rules: 0, -45
        stepDeg: 90, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
    ],

    shiftColorsBetweenRows: true,
    onlyUniqueFigs: true, // [2 and more]
    noOverlap: false, // [2 and more] figs can overlap each other - have same deg
    answerCount: 6, // how many answers to generate per question

    generator: generateRotationalQuestion,
    renderer: renderRotationalQuestion,
  },
  // true clock 45/45
  iq34alt_twoArrowClock: {
    order: 34,

    byteGenConfig: [
      {
        // -1* to move hour arrow ccw
        fn: ({ row, col, rndGlobal }) => -1 * (col + row + rndGlobal),
        max: 360 / 90,
      },
      {
        fn: ({ row, col, rndGlobal }) => col + row + rndGlobal,
        max: 360 / 45,
      },
    ],

    preRenderConfig: {
      sets: {
        rot1: Array(360 / 90)
          .fill(null)
          .map((_, i) => 90 * i),
        rot2: Array(360 / 45)
          .fill(null)
          .map((_, i) => 45 * i),
      },

      figureParts: [
        {
          figures: [{ static: "circle" }],
          color: { static: colors.white },
        },

        {
          figures: [{ static: "arrow-hour" }],
          rotation: { byteIndex: 0, from: "rot1" },
          color: { static: colors.red },
          stroke: { static: colorMixins.darken },
        },
        {
          figures: [{ static: "arrow-minute" }],
          rotation: { byteIndex: 1, from: "rot2" },
          color: { static: colors.green },
          stroke: { static: colorMixins.darken },
        },
      ],
    },

    figureLink: "./images/arrows.svg",
    viewBox: defaultViewBox,
    // questionMarkFigure: "hexagon",
    questionMarkFigure: "circle",

    generator: generateSequenceQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  // clock 3
  // todo(vmyshko): redraw square/circle + and/or add arrows as alt
  clock459090: {
    skip: true,
    figs: [
      {
        pickFrom: [svgFigs.arrow],
        startDeg: 0, // initial rotation, before rules: 0, -45
        stepDeg: 45, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
      {
        pickFrom: [svgFigs.circle],
        startDeg: 0, // initial rotation, before rules: 0, -45
        stepDeg: 90, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
      {
        pickFrom: [svgFigs.square],
        startDeg: 45, // initial rotation, before rules: 0, -45
        stepDeg: 90, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
    ],

    shiftColorsBetweenRows: true,
    onlyUniqueFigs: true, // [2 and more]
    noOverlap: false, // [2 and more] figs can overlap each other - have same deg
    answerCount: 6, // how many answers to generate per question

    generator: generateRotationalQuestion,
    renderer: renderRotationalQuestion,
  },

  //  1 quarter 45deg
  oneQuarter45: {
    skip: true,
    figs: [
      {
        pickFrom: [svgFigs.quarter],
        startDeg: 0, // initial rotation, before rules: 0, -45
        stepDeg: 45, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
    ],

    shiftColorsBetweenRows: true,
    onlyUniqueFigs: true, // [2 and more]
    noOverlap: false, // [2 and more] figs can overlap each other - have same deg
    answerCount: 6, // how many answers to generate per question

    generator: generateRotationalQuestion,
    renderer: renderRotationalQuestion,
  },

  iq28alt_quarterFig90: {
    order: 28,

    byteGenConfig: [
      {
        fn: ({ row, col, rndRow }) => col + rndRow,
        max: 360 / 90,
      },
      {
        fn: ({ row, col, rndRow }) => col * 3 + rndRow,
        max: 360 / 90,
      },
    ],

    preRenderConfig: {
      sets: {
        rot1: Array(360 / 90)
          .fill(null)
          .map((_, i) => 90 * i + 45),
        rot2: Array(360 / 90)
          .fill(null)
          .map((_, i) => 90 * i + 45),
      },

      figureParts: [
        {
          figures: [{ static: "circle" }],
          color: { static: colors.white },
        },

        {
          figures: [{ static: "quarter" }],
          rotation: { byteIndex: 0, from: "rot1" },
          color: { static: colors.blue },
          stroke: { static: colorMixins.darken },
          "mix-blend-mode": { static: "multiply" },
        },
        {
          figures: [{ static: "arrow-circle" }],
          rotation: { byteIndex: 1, from: "rot2" },
          color: { static: colors.yellow },
          stroke: { static: colorMixins.darken },
          "mix-blend-mode": { static: "multiply" },
        },
      ],
    },

    figureLink: "./images/arrows.svg",
    viewBox: defaultViewBox,
    questionMarkFigure: "circle",

    generator: generateSequenceQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  //  2 quarters 45deg (semi-overlap/full overlap)
  twoQuarters45: {
    skip: true,
    figs: [
      {
        pickFrom: [svgFigs.quarter],
        startDeg: 0, // initial rotation, before rules: 0, -45
        stepDeg: 45, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
      {
        pickFrom: [svgFigs.quarter],
        startDeg: 0, // initial rotation, before rules: 0, -45
        stepDeg: 45, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
    ],

    shiftColorsBetweenRows: true,
    onlyUniqueFigs: false, // [2 and more]
    noOverlap: false, // [2 and more] figs can overlap each other - have same deg
    answerCount: 6, // how many answers to generate per question

    generator: generateRotationalQuestion,
    renderer: renderRotationalQuestion,
  },

  //  2 quarters 90deg same deg
  iq11alt_twoQuarters90sameDir: {
    skip: true,
    order: 11,

    byteGenConfig: [
      {
        fn: ({ row, col, rndRow }) => col + rndRow,
        max: 360 / 90,
      },
      {
        fn: ({ row, col, rndRow }) => col + rndRow,
        max: 360 / 90,
      },
    ],

    preRenderConfig: {
      sets: {
        rot1: Array(360 / 90)
          .fill(null)
          .map((_, i) => 90 * i),
        rot2: Array(360 / 90)
          .fill(null)
          .map((_, i) => 90 * i + 45),
      },

      figureParts: [
        {
          figures: [{ static: "hexagon" }],
          color: { static: colors.white },
        },

        {
          figures: [{ static: "quarter" }],
          rotation: { byteIndex: 0, from: "rot1" },
          color: { static: colors.red },
          stroke: { static: colorMixins.darken },
          "mix-blend-mode": { static: "multiply" },
        },
        {
          figures: [{ static: "quarter" }],
          rotation: { byteIndex: 1, from: "rot2" },
          color: { static: colors.green },
          stroke: { static: colorMixins.darken },
          "mix-blend-mode": { static: "multiply" },
        },
      ],
    },

    figureLink: "./images/arrows.svg",
    viewBox: defaultViewBox,
    questionMarkFigure: "circle",

    generator: generateSequenceQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  iq11_twoQuarters90sameDeg_iq11: {
    order: 11,

    patternsInCol: 2,
    // maxAnswerCount: 10,
    byteGenConfig: [
      {
        fn: ({ row, col, rndRow }) => col + rndRow,
        max: 360 / 90,
      },
      {
        fn: ({ row, col, rndRow, rndCol }) => 0 * row,
        //two colors to have additional alt versions
        max: 2,
      },
    ],

    preRenderConfig: {
      sets: {
        rot1: Array(360 / 90)
          .fill(null)
          .map((_, i) => 90 * i),
        cols: [colors.red, colors.green],
      },

      figureParts: [
        {
          figures: [{ static: "circle" }],
          color: { static: colors.white },
        },
        {
          figures: [{ static: "quarter" }],
          rotation: { byteIndex: 0, from: "rot1" },
          color: { byteIndex: 1, from: "cols" },
          stroke: { static: colorMixins.darken },
          "mix-blend-mode": { static: "multiply" },
        },
        {
          figures: [{ static: "quarter" }],
          rotation: { byteIndex: 0, from: "rot1", shift: -1 },
          color: { byteIndex: 1, from: "cols", shift: 1 },
          stroke: { static: colorMixins.darken },
          "mix-blend-mode": { static: "multiply" },
        },
      ],
    },

    figureLink: "./images/arrows.svg",
    viewBox: defaultViewBox,
    questionMarkFigure: "circle",

    generator: generateSequenceQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  //  2 quarters 90deg diff deg (no overlap)
  twoQuarters90: {
    skip: true,
    figs: [
      {
        pickFrom: [svgFigs.quarter],
        startDeg: 45, // initial rotation, before rules: 0, -45
        stepDeg: 90, // min rotation step by rules
        skipZero: false, // no zero rotation by rules
      },
      {
        pickFrom: [svgFigs.quarter],
        startDeg: 45, // initial rotation, before rules: 0, -45
        stepDeg: 90, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
    ],

    shiftColorsBetweenRows: true,
    onlyUniqueFigs: false, // [2 and more]
    noOverlap: true, // [2 and more] figs can overlap each other - have same deg
    answerCount: 6, // how many answers to generate per question

    svgFrame: svgFrames.pentagon,

    generator: generateRotationalQuestion,
    renderer: renderRotationalQuestion,
  },

  //  3 quarters 90deg diff deg
  threeQuarters: {
    skip: true,
    figs: [
      {
        pickFrom: [svgFigs.quarter],
        startDeg: 0, // initial rotation, before rules: 0, -45
        stepDeg: 90, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
      {
        pickFrom: [svgFigs.quarter],
        startDeg: 45, // initial rotation, before rules: 0, -45
        stepDeg: 90, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
      {
        pickFrom: [svgFigs.quarter],
        startDeg: 0, // initial rotation, before rules: 0, -45
        stepDeg: 45, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
    ],

    shiftColorsBetweenRows: true,
    onlyUniqueFigs: false, // [2 and more]
    noOverlap: true, // [2 and more] figs can overlap each other - have same deg
    answerCount: 6, // how many answers to generate per question

    generator: generateRotationalQuestion,
    renderer: renderRotationalQuestion,
  },

  // 1 fig
  oneFig90: {
    skip: true,
    figs: [
      {
        pickFrom: [svgFigs.circle, svgFigs.square, svgFigs.arrow],
        startDeg: 0, // initial rotation, before rules: 0, -45
        stepDeg: 90, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
    ],

    shiftColorsBetweenRows: true,
    onlyUniqueFigs: true, // [2 and more]
    noOverlap: false, // [2 and more] figs can overlap each other - have same deg
    answerCount: 4, // how many answers to generate per question

    generator: generateRotationalQuestion,
    renderer: renderRotationalQuestion,
  },

  //  2 fig 45deg
  oneFig45: {
    skip: true,
    figs: [
      {
        pickFrom: [svgFigs.circle, svgFigs.square, svgFigs.arrow],
        startDeg: 0, // initial rotation, before rules: 0, -45
        stepDeg: 45, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
    ],

    shiftColorsBetweenRows: true,
    onlyUniqueFigs: true, // [2 and more]
    noOverlap: false, // [2 and more] figs can overlap each other - have same deg
    answerCount: 6, // how many answers to generate per question

    generator: generateRotationalQuestion,
    renderer: renderRotationalQuestion,
  },

  hexSector1: {
    skip: true,
    figs: [
      {
        pickFrom: [svgFigs.hexSector60],
        startDeg: 0, // initial rotation, before rules: 0, -45
        stepDeg: 360 / 6, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },

      // static
      {
        pickFrom: [svgFigs.hexFlake],
        startDeg: 0, // initial rotation, before rules: 0, -45
        stepDeg: 0, // min rotation step by rules
        skipZero: false, // no zero rotation by rules
      },
    ],

    // svgFrame: svgFrames.hexagon,

    shiftColorsBetweenRows: true,
    onlyUniqueFigs: false, // [2 and more]
    noOverlap: false, // [2 and more] figs can overlap each other - have same deg
    answerCount: 6, // how many answers to generate per question

    generator: generateRotationalQuestion,
    renderer: renderRotationalQuestion,
  },
  hexSector2: {
    skip: true,
    figs: [
      {
        pickFrom: [svgFigs.hexSector60],
        startDeg: 0, // initial rotation, before rules: 0, -45
        stepDeg: 360 / 6, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
      {
        pickFrom: [svgFigs.hexSector60],
        startDeg: 0, // initial rotation, before rules: 0, -45
        stepDeg: 360 / 6, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
      // static
      {
        pickFrom: [svgFigs.hexFlake],
        startDeg: 0, // initial rotation, before rules: 0, -45
        stepDeg: 0, // min rotation step by rules
        skipZero: false, // no zero rotation by rules
      },
    ],

    svgFrame: svgFrames.hexagon,

    shiftColorsBetweenRows: true,
    onlyUniqueFigs: false, // [2 and more]
    noOverlap: false, // [2 and more] figs can overlap each other - have same deg
    answerCount: 6, // how many answers to generate per question

    generator: generateRotationalQuestion,
    renderer: renderRotationalQuestion,
  },

  hexSector3: {
    skip: true,
    figs: [
      {
        pickFrom: [svgFigs.hexSector60],
        startDeg: 0, // initial rotation, before rules: 0, -45
        stepDeg: 360 / 6, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
      {
        pickFrom: [svgFigs.hexSector60],
        startDeg: 0, // initial rotation, before rules: 0, -45
        stepDeg: 360 / 6, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
      {
        pickFrom: [svgFigs.hexSector60],
        startDeg: 0, // initial rotation, before rules: 0, -45
        stepDeg: 360 / 6, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
      // static
      {
        pickFrom: [svgFigs.hexFlake],
        startDeg: 0, // initial rotation, before rules: 0, -45
        stepDeg: 0, // min rotation step by rules
        skipZero: false, // no zero rotation by rules
      },
    ],

    svgFrame: svgFrames.hexagon,

    shiftColorsBetweenRows: true,
    onlyUniqueFigs: false, // [2 and more]
    noOverlap: false, // [2 and more] figs can overlap each other - have same deg
    answerCount: 6, // how many answers to generate per question

    generator: generateRotationalQuestion,
    renderer: renderRotationalQuestion,
  },

  triadSector: {
    skip: true,
    figs: [
      {
        pickFrom: [svgFigs.hexSector120],
        startDeg: 0, // initial rotation, before rules: 0, -45
        stepDeg: 360 / 3, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
      {
        pickFrom: [svgFigs.hexSector120],
        startDeg: 0, // initial rotation, before rules: 0, -45
        stepDeg: 360 / 3, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
      {
        pickFrom: [svgFigs.hexSector120],
        startDeg: 0, // initial rotation, before rules: 0, -45
        stepDeg: 360 / 3, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },

      // static
      {
        pickFrom: [svgFigs.hexTriad],
        startDeg: 0, // initial rotation, before rules: 0, -45
        stepDeg: 0, // min rotation step by rules
        skipZero: false, // no zero rotation by rules
      },
    ],

    // svgFrame: svgFrames.hexagon,

    shiftColorsBetweenRows: true,
    onlyUniqueFigs: false, // [2 and more]
    noOverlap: false, // [2 and more] figs can overlap each other - have same deg
    answerCount: 6, // how many answers to generate per question

    generator: generateRotationalQuestion,
    renderer: renderRotationalQuestion,
  },

  quarterFigs15mensa: {
    skip: true,
    figs: [
      // todo(vmyshko): maybe make kinda groups between figs, to no-overlap, unique-color, etc.
      // like a group/arr which is shared between figs, and depletes from it,
      // also it may be possible to make same for degs
      {
        pickFrom: [svgFigs.quarter, svgFigs.hexSector60, svgFigs.hexSector120],
        startDeg: 0, // initial rotation, before rules: 0, -45
        stepDeg: 30, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },

      {
        pickFrom: [svgFigs.letterP, svgFigs.letterT, svgFigs.letterU],
        startDeg: 0, // initial rotation, before rules: 0, -45
        stepDeg: 90, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },

      {
        pickFrom: [svgFigs.square, svgFigs.circle],
        startDeg: 0, // initial rotation, before rules: 0, -45
        stepDeg: 45, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
      {
        pickFrom: [svgFigs.arrow, svgFigs.arrowAlt],
        startDeg: 0, // initial rotation, before rules: 0, -45
        stepDeg: 45, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
    ],

    shiftColorsBetweenRows: true,
    onlyUniqueFigs: true, // [2 and more]
    noOverlap: false, // [2 and more] figs can overlap each other - have same deg
    answerCount: 6, // how many answers to generate per question

    generator: generateRotationalQuestion,
    renderer: renderRotationalQuestion,
  },
};
