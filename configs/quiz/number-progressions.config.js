import {
  generateNumberProgressionQuestion,
  progressionTypes,
} from "../../generators/number-progressions.generator.js";
import { renderValuesQuestion } from "../../renderers/value.renderer.js";

export const numberProgressionConfigs = {
  iq18alt_equalSumPerRowCol: {
    order: 18,
    // skip: true,
    progressionType: progressionTypes.equalSumPerRowCol,
    patternsInRow: 3,
    patternsInCol: 3,
    maxAnswerCount: 6,
    // todo(vmyshko): make random 7-11
    colRowSum: 8,

    generator: generateNumberProgressionQuestion,
    renderer: renderValuesQuestion,
  },
  //  desc here
  iq15_numToAbc: {
    skip: true,
    progressionType: progressionTypes.numToAbc,
    patternsInCol: 2, // todo(vmyshko): rename to row count or smth
    maxAnswerCount: 6,

    generator: generateNumberProgressionQuestion,
    renderer: renderValuesQuestion,
  },
  iq16_addToAbc: {
    order: 16,
    // todo(vmyshko): sort by asc
    progressionType: progressionTypes.addToAbc,
    patternsInCol: 3, // limits by maxAnswerCount as well
    maxAnswerCount: 6,

    generator: generateNumberProgressionQuestion,
    renderer: renderValuesQuestion,
  },
  iq17_addProgression: {
    skip: true,
    // todo(vmyshko): seems orig 135 is not possible
    progressionType: progressionTypes.addProgression,
    patternsInCol: 3,
    maxAnswerCount: 6,
    maxRange: 20,

    generator: generateNumberProgressionQuestion,
    renderer: renderValuesQuestion,
  },
  iq18_subProgression: {
    skip: true,
    // todo(vmyshko): impossible orig 741
    progressionType: progressionTypes.subProgression,
    patternsInCol: 3,
    maxAnswerCount: 6,
    maxRange: 20,

    generator: generateNumberProgressionQuestion,
    renderer: renderValuesQuestion,
  },
  iq15alt_subIncrementAll: {
    order: 15,
    // skip: true,
    progressionType: progressionTypes.subIncrementAll,
    patternsInRow: 3,
    patternsInCol: 3,
    maxAnswerCount: 6,
    maxRange: 10,

    generator: generateNumberProgressionQuestion,
    renderer: renderValuesQuestion,
  },
  subPerRow: {
    skip: true,
    progressionType: progressionTypes.subPerRow,
    patternsInRow: 3,
    patternsInCol: 3,
    maxAnswerCount: 6,
    maxRange: 30,

    generator: generateNumberProgressionQuestion,
    renderer: renderValuesQuestion,
  },

  // todo(vmyshko): not sure about config.maxRange for those... should it be configurable at all?
  // same for row/col
  addThenDiv: {
    skip: true,
    progressionType: progressionTypes.addThenDiv,
    patternsInRow: 3,
    patternsInCol: 3,
    maxAnswerCount: 6,
    maxRange: 20,

    generator: generateNumberProgressionQuestion,
    renderer: renderValuesQuestion,
  },

  mulThenSubProgression: {
    skip: true,
    progressionType: progressionTypes.mulThenSubProgression,
    patternsInRow: 3,
    patternsInCol: 3,
    maxAnswerCount: 6,
    maxRange: 10,

    generator: generateNumberProgressionQuestion,
    renderer: renderValuesQuestion,
  },

  iq17alt_subThenAdd: {
    order: 17,
    // skip: true,
    progressionType: progressionTypes.subThenAdd,
    patternsInRow: 3,
    patternsInCol: 3,
    maxAnswerCount: 6,
    maxRange: 15, //maxDiff

    generator: generateNumberProgressionQuestion,
    renderer: renderValuesQuestion,
  },
};
