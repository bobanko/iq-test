import {
  generateNumberProgressionQuestion,
  progressionTypes,
} from "./number-progressions.generator.js";
import { renderValuesQuestion } from "./value.renderer.js";

const _numberProgressionConfigs = {
  //  desc here
  numToAbc: {
    progressionType: progressionTypes.numToAbc,
    patternsInCol: 5, // todo(vmyshko): rename to row count or smth
    maxAnswerCount: 6,
  },
  addToAbc: {
    progressionType: progressionTypes.addToAbc,
    patternsInCol: 3, // limits by maxAnswerCount as well
    maxAnswerCount: 6,
  },
  addProgression: {
    progressionType: progressionTypes.addProgression,
    patternsInCol: 3,
    maxAnswerCount: 6,
    maxRange: 20,
  },
  subProgression: {
    progressionType: progressionTypes.subProgression,
    patternsInCol: 3,
    maxAnswerCount: 6,
    maxRange: 20,
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