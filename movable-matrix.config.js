import {
  generateMovableQuestion,
  cellMoveRules,
} from "./movable-matrix.generator.js";
import { renderMatrixQuestion } from "./matrix.renderer.js";
import { colors, defaultColors } from "./common.config.js";

export const movableMatrixConfigs = {
  // orig questions (or close to orig) from international-iq-test.com
  // marked as "_id##" suffix, where ## is original question number
  // current difficulty level goes as prefix "d##_"

  // 2 3 1 5 order

  iq02_d1_mtxmov_1gby1cells: {
    order: 2,
    // one cell moves v or h
    colors: defaultColors,

    interPatternRules: [
      //
      cellMoveRules.orthogonal,
    ],

    cells: [
      {
        colorIndex: 0,
        ruleIndex: 0,
      },
    ],

    patternsInRow: 3,
    patternsInCol: 2,
    mtxSize: 3,
    maxAnswerCount: 6,

    generator: generateMovableQuestion,
    renderer: renderMatrixQuestion,
  },

  iq03_d2_mtxmov_2gby1cells: {
    order: 3,
    colors: defaultColors,

    interPatternRules: [
      //
      cellMoveRules.horizontal,
      cellMoveRules.vertical,
    ],
    interRowRules: [
      //
    ],
    cells: [
      {
        colorIndex: 0,
        ruleIndex: 0,
      },
      {
        colorIndex: 1,
        ruleIndex: 1,
      },
    ],
    //
    patternsInRow: 3,
    patternsInCol: 3,
    mtxSize: 3,
    maxAnswerCount: 6,

    generator: generateMovableQuestion,
    renderer: renderMatrixQuestion,
  },

  iq1_d3_mtxmov_1gby3cells: {
    order: 1,
    // two cells bidirectional but both H
    colors: defaultColors,

    interPatternRules: [
      //
      cellMoveRules.orthogonal,
    ],
    interRowRules: [
      //
    ],
    cells: [
      // todo(vmyshko): avoid these dupes in new config, we don't need such customization
      {
        colorIndex: 0,
        ruleIndex: 0,
      },
      {
        colorIndex: 0,
        ruleIndex: 0,
      },
      {
        colorIndex: 0,
        ruleIndex: 0,
      },
    ],

    //
    patternsInRow: 3,
    patternsInCol: 3,
    //
    mtxSize: 3,
    maxAnswerCount: 6,

    generator: generateMovableQuestion,
    renderer: renderMatrixQuestion,
  },

  iq5_q4_mtxmove_2gby2cells: {
    order: 5,
    colors: defaultColors,

    // two groups by two cells each, move ortho
    interPatternRules: [
      //
      cellMoveRules.orthogonal,
      cellMoveRules.orthogonal,
    ],
    interRowRules: [
      //
    ],
    cells: [
      {
        colorIndex: 0,
        ruleIndex: 0,
      },
      {
        colorIndex: 0,
        ruleIndex: 0,
      },
      //
      {
        colorIndex: 1,
        ruleIndex: 1,
      },
      {
        colorIndex: 1,
        ruleIndex: 1,
      },
    ],

    patternsInRow: 3,
    patternsInCol: 3,
    //
    mtxSize: 3,
    maxAnswerCount: 6,
    // todo(vmyshko): allow vertical sequences
    generator: generateMovableQuestion,
    renderer: renderMatrixQuestion,
  },
};

// todo(vmyshko): maybe new config schema?
const _mockNewConfig_iq999_question = {
  groups: [
    {
      color: "red",
      cellCount: 2,
      vrule: "v",
      hrule: "h",
      basegenrule: "to make cell lines or other patterns?",
    },
    {
      color: "green", //rnd
      cellCount: 1,
      vrule: "h",
      hrule: "v",
    },
  ],
};
