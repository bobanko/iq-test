import { renderRotationalQuestion } from "./rotational.renderer.js";
import { generateRotationalQuestion } from "./rotational.generator.js";

import { colorMixins, colors, defaultViewBox } from "./common.config.js";
import { renderFigurePatternsQuestion } from "./figure-patterns.renderer.js";
import { generateSequenceQuestion } from "./shuffle-figures.generator.js";

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

  hexCircle_iq40like_shuffleBased: {
    // skip: true,
    //new
    preGenConfig: [
      {
        //degs
        count: 5,
        shifts: [1, 2],
        // shuffle: true,
      },
      {
        //degs
        count: 5,
        shifts: [1, 1],
        // shuffle: true,
      },
    ],

    preRenderConfig: {
      sets: {
        // rot: Array(6)
        rot: Array(5)
          .fill(null)
          // .map((_, i) => (360 / 6) * i),
          .map((_, i) => (360 / 5) * i),
      },

      figureParts: [
        {
          figures: [{ static: "pentagon" }],
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
    // questionMarkFigure: "hexagon",
    questionMarkFigure: "pentagon",

    generator: generateSequenceQuestion,
    renderer: renderFigurePatternsQuestion,
  },

  // clock 2
  clock4590_iq34: {
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
  twoArrowClock_id34like: {
    preGenConfig: [
      {
        //degs
        count: 360 / 45,
        shifts: [3, 1],
        // shuffle: true,
      },
      {
        //degs
        count: 360 / 90,
        shifts: [3, 1],
        // shuffle: true,
      },
    ],

    preRenderConfig: {
      sets: {
        rot1: Array(360 / 45)
          .fill(null)
          .map((_, i) => 45 * i),
        rot2: Array(360 / 90)
          .fill(null)
          .map((_, i) => 90 * i),
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

  quarterFig90: {
    figs: [
      {
        pickFrom: [svgFigs.square, svgFigs.circle],
        startDeg: 45, // initial rotation, before rules: 0, -45
        stepDeg: 90, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
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
    answerCount: 6, // how many answers to generate per question

    preGenConfig: [
      {
        //degs
        count: 360 / 45,
        shifts: [3, 1],
      },
      {
        //degs
        count: 360 / 90,
        shifts: [1, 3, 1],
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
  twoQuarters90sameDir_iq11like: {
    preGenConfig: [
      {
        //degs
        count: 360 / 45,
        shifts: [3, 1],
      },
      {
        //degs
        count: 360 / 90,
        shifts: [1, 3, 1],
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

  //  2 quarters 90deg diff deg (no overlap)
  twoQuarters90: {
    // skip: true,
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

  pentagon_iq40: {
    skip: true,
    // todo(vmyshko): add row progression angle multiplier *1,2,3
    // todo(vmyshko): add more figs to increase possible answers from 5
    figs: [
      {
        pickFrom: [svgFigs.circle],
        startDeg: 0, // initial rotation, before rules: 0, -45
        stepDeg: 360 / 5, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },

      //static
      // {
      //   pickFrom: [svgHrefs.framePentagon],
      //   startDeg: 0, // initial rotation, before rules: 0, -45
      //   stepDeg: 0, // min rotation step by rules
      //   skipZero: false, // no zero rotation by rules
      // },
    ],

    svgFrame: svgFrames.pentagon,

    shiftColorsBetweenRows: true,
    onlyUniqueFigs: false, // [2 and more]
    noOverlap: false, // [2 and more] figs can overlap each other - have same deg
    answerCount: 5, // how many answers to generate per question

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
