import { renderRotationalQuestion } from "./rotational.renderer.js";
import { generateRotationalQuestion } from "./rotational.generator.js";

import { colors } from "./common.config.js";
import { renderFigurePatternsQuestion } from "./figure-patterns.renderer.js";

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
  //  custom letters
  letters45_newRender: {
    // todo(vmyshko): put colors to use, shared between figs? how?

    // todo(vmyshko):
    // each fig has colors arr, as svgs
    // ? arr should be shared between figs, if you want unique figs took once?
    // same for colors
    // fig can be fixed/static, no rule for it, for static bgs, but startDeg still applies
    // OR put static figs separately?
    // fig order applies as z-index (naturally)
    // mirroring should be avail. same as degs for each fig.

    // questionMarkFigure: "circle",
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
    renderer: renderFigurePatternsQuestion,
  },

  letters45_oldRender: {
    // todo(vmyshko): put colors to use, shared between figs? how?

    // todo(vmyshko):
    // each fig has colors arr, as svgs
    // ? arr should be shared between figs, if you want unique figs took once?
    // same for colors
    // fig can be fixed/static, no rule for it, for static bgs, but startDeg still applies
    // OR put static figs separately?
    // fig order applies as z-index (naturally)
    // mirroring should be avail. same as degs for each fig.

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
  oneQuarter90: {
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

  // todo(vmyshko): rotate both figs in one direction, same deg
  //  2 quarters 90deg same deg
  // twoQuarters90sameDir: null,

  //  2 quarters 45deg (semi-overlap/full overlap)
  twoQuarters45: {
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

    generator: generateRotationalQuestion,
    renderer: renderRotationalQuestion,
  },

  //  3 quarters 90deg diff deg
  threeQuarters: {
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

  // clock 2
  clock4590: {
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
  twoArrowClock: {
    figs: [
      {
        pickFrom: [svgFigs.arrowAlt],
        startDeg: 0, // initial rotation, before rules: 0, -45
        stepDeg: 45, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
      {
        pickFrom: [svgFigs.arrow],
        startDeg: 0, // initial rotation, before rules: 0, -45
        stepDeg: 45, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
    ],

    shiftColorsBetweenRows: false,
    onlyUniqueFigs: false, // [2 and more]
    noOverlap: false, // [2 and more] figs can overlap each other - have same deg
    answerCount: 6, // how many answers to generate per question

    generator: generateRotationalQuestion,
    renderer: renderRotationalQuestion,
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

    generator: generateRotationalQuestion,
    renderer: renderRotationalQuestion,
  },

  pentagon: {
    figs: [
      {
        pickFrom: [svgFigs.circle, svgFigs.arrow],
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

  hexagonCircle: {
    figs: [
      {
        pickFrom: [svgFigs.circle],
        startDeg: 0, // initial rotation, before rules: 0, -45
        stepDeg: 360 / 6, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
      //static
      // {
      //   pickFrom: [svgHrefs.frameHexagon],
      //   startDeg: 30, // initial rotation, before rules: 0, -45
      //   stepDeg: 0, // min rotation step by rules
      //   skipZero: false, // no zero rotation by rules
      // },
    ],

    svgFrame: svgFrames.hexagon,

    shiftColorsBetweenRows: true,
    onlyUniqueFigs: false, // [2 and more]
    noOverlap: false, // [2 and more] figs can overlap each other - have same deg
    answerCount: 6, // how many answers to generate per question

    generator: generateRotationalQuestion,
    renderer: renderRotationalQuestion,
  },

  // todo(vmyshko): added for anisya
  sisiAnisiCircle: {
    figs: [
      {
        pickFrom: [svgFigs.circle],
        startDeg: 0, // initial rotation, before rules: 0, -45
        stepDeg: 360 / 6, // min rotation step by rules
        skipZero: true, // no zero rotation by rules
      },
      //static
      // {
      //   pickFrom: [svgHrefs.frameHexagon],
      //   startDeg: 30, // initial rotation, before rules: 0, -45
      //   stepDeg: 0, // min rotation step by rules
      //   skipZero: false, // no zero rotation by rules
      // },
    ],

    svgFrame: svgFrames.circle,

    shiftColorsBetweenRows: true,
    onlyUniqueFigs: false, // [2 and more]
    noOverlap: false, // [2 and more] figs can overlap each other - have same deg
    answerCount: 6, // how many answers to generate per question

    generator: generateRotationalQuestion,
    renderer: renderRotationalQuestion,
  },

  hexagonSector1: {
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
  hexagonSector2: {
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

  hexagonSector3: {
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
