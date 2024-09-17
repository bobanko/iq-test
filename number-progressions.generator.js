import { getUid } from "./common.js";
import { generateUniqueValues } from "./generate-unique-values.js";
import { SeededRandom } from "./random.helpers.js";
import { getLetter } from "./helpers.js";

export const progressionTypes = {
  numToAbc: 0, //15 -- 1=a, 2=b
  addToAbc: 1, //16 -- 1+2=c
  addProgression: 2, //17 -- rand+n+n
  subProgression: 3, //18 -- rand-n-n
};

// helpers

function getFreeValues(valueCount) {
  return Array(valueCount)
    .fill(null)
    .map((_, index) => index);
}

// ---

// todo(vmyshko): probably rewrite to true-generators? which gens 1-by-1 row, and another one makes answers, or same?
const generators = {
  // =====
  [progressionTypes.numToAbc]: {
    rowGenerator: function* ({ basicValue, random, config }) {
      //
      yield ["a", "c", "f"].map((value) => ({ value, id: getUid() }));
      yield [1, 3, 5].map((value) => ({ value, id: getUid() }));
    },
    answerGenerator: ({ random }) => random.fromRange(0, 10),
  },
  // =====
  [progressionTypes.addToAbc]: {
    rowGenerator: function* ({ random, config }) {
      // 1st  = gen a,b,c
      // mid  = random.from(0, answer)
      // last = mid - first

      const freeValues = getFreeValues(config.maxAnswerCount).map((x) => x + 1);

      for (let rowIndex = 0; rowIndex < config.patternsInCol; rowIndex++) {
        // stop generation, if no unique values left
        if (!freeValues.length) return;

        // last value in row
        const firstValueInRow = random.popFrom(freeValues);

        // middle col
        const middleValueInRow = random.fromRange(0, firstValueInRow - 1);

        // last value
        const lastValueInRow = firstValueInRow - middleValueInRow;

        yield [
          //reordered!
          lastValueInRow,
          middleValueInRow,
          getLetter(firstValueInRow - 1),
        ].map((value) => ({
          value,
          id: getUid(),
        }));
      } //for
    },
    answerGenerator: ({ random, config }) =>
      random.sample([
        getLetter(random.fromRange(0, config.maxAnswerCount - 1)), //letter
        random.fromRange(0, config.maxAnswerCount - 1), //number
      ]),
  },
  // =====
  [progressionTypes.addProgression]: {
    rowGenerator: function* ({ random, config }) {
      //
    },
    answerGenerator: ({ random }) => random.fromRange(0, 10),
  },
  [progressionTypes.subProgression]: {
    rowGenerator: function* ({ random, config }) {
      //
    },
    answerGenerator: ({ random }) => random.fromRange(0, 10),
  },
};

export function generateNumberProgressionQuestion({
  config,
  seed,
  questionIndex,
}) {
  const patternsInRow = 3; //always 3 -- a+b=c --like BUT can be more

  const {
    patternsInCol = 3, // can be reduced by gen-non-unique reason
    maxAnswerCount = 6, //over 8 will not fit
  } = config;

  const random = new SeededRandom(seed + questionIndex);

  const patterns = [];

  //---

  const rowPatterns = [
    ...generators[config.progressionType].rowGenerator({
      random,
      config,
    }),
  ];

  patterns.push(...rowPatterns.flat());

  //last block
  const correctAnswer = patterns.at(-1);
  correctAnswer.isCorrect = true;

  // *******
  // ANSWERS
  // *******

  const answers = generateUniqueValues({
    existingValues: [correctAnswer],
    maxValuesCount: maxAnswerCount - 1,
    generateFn: () => {
      return {
        // todo(vmyshko): rewrite to normal gen based on gen type and config?
        value: generators[config.progressionType].answerGenerator({
          random,
          config,
        }),
        id: getUid(),
      };
    },
    getValueHashFn: ({ value }) => value.toString(),
  });

  //
  return {
    seed,
    patternsInRow,
    patternsInCol,
    //
    patterns,
    answers,
    correctAnswer,
    //
  };
}
