import {
  answerGenerator_addToAbc,
  answerGenerator_mulThenSub,
  answerGenerator_numToAbc,
  answerGenerator_subThenAdd,
  preGenBytes_addProgression,
  preGenBytes_addThenDiv,
  preGenBytes_addToAbc,
  preGenBytes_equalSumPerRowCol,
  preGenBytes_mulThenSub,
  preGenBytes_numToAbc,
  preGenBytes_subIncrementAll,
  preGenBytes_subPerRow,
  preGenBytes_subProgression,
  preGenBytes_subThenAdd,
  preRenderPatternNUMBER,
} from "../../generators/number-progressions.generator.js";
import { generateSequenceQuestion } from "../../generators/shuffle-figures.generator.js";
import { renderValuesQuestion } from "../../renderers/value.renderer.js";

export const numberProgressionConfigs = {
  iq18alt_equalSumPerRowCol: {
    order: 18,
    // skip: true,
    patternsInRow: 3,
    patternsInCol: 3,
    maxAnswerCount: 6,

    // todo(vmyshko): make random 7-11
    colRowSum: 8,

    byteGenConfig: [
      // used to gen answers
      {
        max: 8,
      },
    ],

    preGenBytes: preGenBytes_equalSumPerRowCol,

    preRenderPattern: preRenderPatternNUMBER,
    generator: generateSequenceQuestion,
    renderer: renderValuesQuestion,
  },
  //  desc here
  iq15_numToAbc: {
    skip: true,
    patternsInCol: 2, // todo(vmyshko): rename to row count or smth
    maxAnswerCount: 6,

    answerGenerator: answerGenerator_numToAbc,
    preGenBytes: preGenBytes_numToAbc,

    preRenderPattern: preRenderPatternNUMBER,
    generator: generateSequenceQuestion,
    renderer: renderValuesQuestion,
  },
  iq16_addToAbc: {
    order: 16,
    // todo(vmyshko): sort by asc
    patternsInCol: 3, // limits by maxAnswerCount as well
    maxAnswerCount: 6,

    answerGenerator: answerGenerator_addToAbc,
    preGenBytes: preGenBytes_addToAbc,

    preRenderPattern: preRenderPatternNUMBER,
    generator: generateSequenceQuestion,
    renderer: renderValuesQuestion,
  },
  iq17_addProgression: {
    skip: true,
    // todo(vmyshko): seems orig 135 is not possible
    patternsInCol: 3,
    maxAnswerCount: 6,
    maxRange: 20,

    byteGenConfig: [
      // used to gen answers
      {
        max: 20, //maxRange
      },
    ],

    preGenBytes: preGenBytes_addProgression,

    preRenderPattern: preRenderPatternNUMBER,
    generator: generateSequenceQuestion,
    renderer: renderValuesQuestion,
  },
  iq18_subProgression: {
    skip: true,
    // todo(vmyshko): impossible orig 741
    patternsInCol: 3,
    maxAnswerCount: 6,
    maxRange: 20,

    byteGenConfig: [
      // used to gen answers
      {
        max: 20, //maxRange
      },
    ],

    preGenBytes: preGenBytes_subProgression,

    preRenderPattern: preRenderPatternNUMBER,
    generator: generateSequenceQuestion,
    renderer: renderValuesQuestion,
  },
  iq15alt_subIncrementAll: {
    order: 15,
    // skip: true,
    patternsInRow: 3,
    patternsInCol: 3,
    maxAnswerCount: 6,

    maxRange: 10,
    // todo(vmyshko): make random 7-11
    colRowSum: 8,

    byteGenConfig: [
      // used to gen default answers
      {
        max: 8,
      },
    ],

    preGenBytes: preGenBytes_subIncrementAll,

    preRenderPattern: preRenderPatternNUMBER,
    generator: generateSequenceQuestion,
    renderer: renderValuesQuestion,
  },
  subPerRow: {
    skip: true,

    patternsInRow: 3,
    patternsInCol: 3,
    maxAnswerCount: 6,
    maxRange: 30,

    byteGenConfig: [
      // used to gen default answers
      {
        max: 30,
      },
    ],

    preGenBytes: preGenBytes_subPerRow,

    preRenderPattern: preRenderPatternNUMBER,
    generator: generateSequenceQuestion,
    renderer: renderValuesQuestion,
  },

  // todo(vmyshko): not sure about config.maxRange for those... should it be configurable at all?
  // same for row/col
  addThenDiv: {
    skip: true,
    patternsInRow: 3,
    patternsInCol: 3,
    maxAnswerCount: 6,
    maxRange: 20,

    byteGenConfig: [
      // used to gen default answers
      {
        max: 20,
      },
    ],

    preGenBytes: preGenBytes_addThenDiv,

    preRenderPattern: preRenderPatternNUMBER,
    generator: generateSequenceQuestion,
    renderer: renderValuesQuestion,
  },

  mulThenSubProgression: {
    skip: true,
    patternsInRow: 3,
    patternsInCol: 3,
    maxAnswerCount: 6,
    maxRange: 10,

    answerGenerator: answerGenerator_mulThenSub,
    preGenBytes: preGenBytes_mulThenSub,

    preRenderPattern: preRenderPatternNUMBER,
    generator: generateSequenceQuestion,
    renderer: renderValuesQuestion,
  },

  iq17alt_subThenAdd: {
    order: 17,
    // skip: true,
    patternsInRow: 3,
    patternsInCol: 3,
    maxAnswerCount: 6,
    maxRange: 15, //maxDiff

    answerGenerator: answerGenerator_subThenAdd,
    preGenBytes: preGenBytes_subThenAdd,

    preRenderPattern: preRenderPatternNUMBER,
    generator: generateSequenceQuestion,
    renderer: renderValuesQuestion,
    renderer: renderValuesQuestion,
  },
};
