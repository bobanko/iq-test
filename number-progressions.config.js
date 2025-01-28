import {
  generateNumberProgressionQuestion,
  progressionTypes,
} from "./number-progressions.generator.js";
import { renderValuesQuestion } from "./value.renderer.js";

const _numberProgressionConfigs = {
  equalSumPerRowCol: {
    progressionType: progressionTypes.equalSumPerRowCol,
    patternsInRow: 3,
    patternsInCol: 3,
    maxAnswerCount: 6,
    // todo(vmyshko): sum can be random
    colRowSum: 8,
  },
  //  desc here
  iq15_numToAbc: {
    progressionType: progressionTypes.numToAbc,
    patternsInCol: 5, // todo(vmyshko): rename to row count or smth
    maxAnswerCount: 6,
  },
  iq16_addToAbc: {
    // todo(vmyshko): sort by asc
    progressionType: progressionTypes.addToAbc,
    patternsInCol: 3, // limits by maxAnswerCount as well
    maxAnswerCount: 6,
  },
  iq17_addProgression: {
    // todo(vmyshko): seems orig 135 is not possible
    progressionType: progressionTypes.addProgression,
    patternsInCol: 3,
    maxAnswerCount: 6,
    maxRange: 20,
  },
  iq18_subProgression: {
    // todo(vmyshko): impossible orig 741
    progressionType: progressionTypes.subProgression,
    patternsInCol: 3,
    maxAnswerCount: 6,
    maxRange: 20,
  },
  subIncrementAll: {
    progressionType: progressionTypes.subIncrementAll,
    patternsInRow: 3,
    patternsInCol: 3,
    maxAnswerCount: 6,
    maxRange: 10,
  },
  subPerRow: {
    progressionType: progressionTypes.subPerRow,
    patternsInRow: 3,
    patternsInCol: 3,
    maxAnswerCount: 6,
    maxRange: 30,
  },

  // todo(vmyshko): not sure about config.maxRange for those... should it be configurable at all?
  // same for row/col
  addThenDiv: {
    progressionType: progressionTypes.addThenDiv,
    patternsInRow: 3,
    patternsInCol: 3,
    maxAnswerCount: 6,
    maxRange: 20,
  },

  mulThenSubProgression: {
    progressionType: progressionTypes.mulThenSubProgression,
    patternsInRow: 3,
    patternsInCol: 3,
    maxAnswerCount: 6,
    maxRange: 10,
  },

  subThenAdd: {
    progressionType: progressionTypes.subThenAdd,
    patternsInRow: 3,
    patternsInCol: 3,
    maxAnswerCount: 6,
    maxRange: 15, //maxDiff
  },
};

export const numberProgressionConfigs = Object.fromEntries(
  Object.entries(_numberProgressionConfigs).map((entry) => {
    const [_key, value] = entry;

    value.generator = generateNumberProgressionQuestion;
    value.renderer = renderValuesQuestion;

    return entry;
  })
);
