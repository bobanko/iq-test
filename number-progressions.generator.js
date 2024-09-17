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

function mapValueToPattern(value) {
  return {
    value,
    id: getUid(),
  };
}

// ---

// todo(vmyshko): probably rewrite to true-generators? which gens 1-by-1 row, and another one makes answers, or same?
const generators = {
  // =====
  [progressionTypes.numToAbc]: {
    rowGenerator: function* ({ random, config }) {
      // patternsInCol -- max is 2 for this type

      const col1 = 1;
      const col2 = random.fromRange(
        col1 + 1,
        Math.floor(config.maxAnswerCount / 2)
      );
      const col3 = random.fromRange(col2 + 1, config.maxAnswerCount);

      //1 ? 9

      const row2 = [col1, col2, col3];
      const row1 = row2.map((value) => getLetter(value - 1));

      yield row1.map(mapValueToPattern);
      yield row2.map(mapValueToPattern);
    },
    answerGenerator: ({ random, config }) =>
      // todo(vmyshko): make it configurable to allow mix -- letters/numbers?
      random.sample([
        getLetter(random.fromRange(0, config.maxAnswerCount - 1)), //letter
        random.fromRange(0, config.maxAnswerCount - 1), //number
      ]),
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
        ].map(mapValueToPattern);
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
      // patternsInCol -- max is 2 for this type?
      const halfRangeMax = Math.floor(config.maxRange / 2);

      const row1col3 = random.fromRange(3, halfRangeMax);

      const step = Math.floor(row1col3 / 3);

      const row1col2 = row1col3 - step;
      const row1col1 = row1col2 - step;

      const row1 = [row1col1, row1col2, row1col3];

      yield row1.map(mapValueToPattern);

      const row2col3 = random.fromRange(row1col3 + step * 3, config.maxRange);
      const row2col2 = row2col3 - step;
      const row2col1 = row2col2 - step;

      const row2 = [row2col1, row2col2, row2col3];

      yield row2.map(mapValueToPattern);
    },
    answerGenerator: ({ random, config }) =>
      random.fromRange(0, config.maxRange - 1), //number
  },
  //based on addProgression
  [progressionTypes.subProgression]: {
    rowGenerator: function* ({ random, config }) {
      const results = [
        ...generators[progressionTypes.addProgression].rowGenerator({
          random,
          config,
        }),
      ];

      yield results[0].reverse();
      yield results[1].reverse();
    },
    answerGenerator: ({ random, config }) =>
      random.fromRange(0, config.maxRange - 1), //number
  },
  //
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
