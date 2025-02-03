import { getUid } from "./common.js";
import { generateUniqueValues } from "./generate-unique-values.js";
import { SeededRandom } from "./random.helpers.js";
import { getLetter } from "./helpers.js";

export const progressionTypes = {
  numToAbc: 0, //15 -- 1=a, 2=b
  addToAbc: 1, //16 -- 1+2=c
  addProgression: 2, //17 -- rand+n+n
  subProgression: 3, //18 -- rand-n-n
  // extra
  subIncrementAll: 7, // rand.-1 .-2; (.-3) .-4 .-5; (-6) .-7 .-8;
  subPerRow: 8, // rand-rand=x; x3
  addThenDiv: 9, // rand .+x ./y
  mulThenSubProgression: 10, // rand .*2 -2; .*3 -3; .*4 .-4;
  subThenAdd: 11, // rand.-12 .+9; x3

  equalSumPerRowCol: 12, // 1+2+3=6; 3+2+1=6; 1+3+2=6; same for cols
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
      // last =  first - mid

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
      // todo(vmyshko): not the bestest solution to reuse generator
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
  // =====
  [progressionTypes.subIncrementAll]: {
    rowGenerator: function* ({ random, config }) {
      const patternCount = config.patternsInCol * config.patternsInRow;

      // the last one to dicsover

      const maxDecrement = (patternCount * (patternCount - 1)) / 2;

      const randomShift = random.fromRange(0, config.maxRange);

      for (let patternIndex = 0; patternIndex < patternCount; patternIndex++) {
        const decrement = patternCount - patternIndex;
        // +1+2+3+4+5
        // +1+3+6+10+15

        // 39-2
        // 39 - ((patternIndex * (patternIndex + 1)) / 2 + 1) // -0,-1,-3,-6,10,15,21,28,..36,
        // 39 - ((patternIndex * (patternIndex + 1)) / 2 + 1) // -0,-1,-2,-3,-4,-5,-6,-7,..-8,
        // 39 - ((patternIndex * (patternIndex + 1)) / 2 + 1) // 38,37,35,32,28,23,17,10,..2

        yield [
          maxDecrement + randomShift - ((patternIndex + 1) * patternIndex) / 2,
        ].map(mapValueToPattern);
      } //for
    },
    answerGenerator: ({ random, config }) =>
      random.fromRange(0, config.maxRange - 1), //number
  },
  // =====
  [progressionTypes.subPerRow]: {
    rowGenerator: function* ({ random, config }) {
      // 1st  = gen a,b,c
      // mid  = random.from(0, answer)
      // last = first - mid

      const freeValues = getFreeValues(config.maxRange).map((x) => x + 1);

      for (let rowIndex = 0; rowIndex < config.patternsInCol; rowIndex++) {
        // stop generation, if no unique values left
        if (!freeValues.length) return;

        // last value in row
        const firstValueInRow = random.popFrom(freeValues);

        // middle col
        const middleValueInRow = random.fromRange(1, firstValueInRow - 1);

        // last value
        const lastValueInRow = firstValueInRow - middleValueInRow;

        yield [firstValueInRow, middleValueInRow, lastValueInRow].map(
          mapValueToPattern
        );
      } //for
    },
    answerGenerator: ({ random, config }) =>
      random.fromRange(0, config.maxRange - 1), //number
  },
  // =====
  [progressionTypes.addThenDiv]: {
    rowGenerator: function* ({ random, config }) {
      // 1st  = mid - rnd#3
      // mid  = last * 2 //or more? rnd#2
      // last = rnd#1

      const lastMidMultiplier = 2; // 3 -- too complex
      // todo(vmyshko): impl negative diff?
      const firstMidDiff = random.fromRange(1, 10);

      const freeValues = getFreeValues(config.maxRange - firstMidDiff).map(
        (x) => x + 1
      );

      for (let rowIndex = 0; rowIndex < config.patternsInCol; rowIndex++) {
        // stop generation, if no unique values left
        if (!freeValues.length) return;

        // last value in row
        const lastValueInRow = random.popFrom(freeValues) + firstMidDiff;

        // middle col
        const middleValueInRow = lastValueInRow * lastMidMultiplier;

        // last value
        const firstValueInRow = middleValueInRow - firstMidDiff;

        yield [firstValueInRow, middleValueInRow, lastValueInRow].map(
          mapValueToPattern
        );
      } //for
    },
    answerGenerator: ({ random, config }) =>
      random.fromRange(0, config.maxRange - 1), //number
  },
  // =====
  [progressionTypes.mulThenSubProgression]: {
    rowGenerator: function* ({ random, config }) {
      // 1st  = rnd#1
      // mid  = 1st * 2 // [..3,4]
      // last = mid - 2 // [..3,4]

      const freeValues = getFreeValues(config.maxRange).map((x) => x + 1);

      for (let rowIndex = 0; rowIndex < config.patternsInCol; rowIndex++) {
        // stop generation, if no unique values left
        if (!freeValues.length) return;

        const modifier = rowIndex + 2;

        // last value in row
        const firstValueInRow = random.popFrom(freeValues);

        // middle col
        const middleValueInRow = firstValueInRow * modifier;

        // last value
        const lastValueInRow = middleValueInRow - modifier;

        yield [firstValueInRow, middleValueInRow, lastValueInRow].map(
          mapValueToPattern
        );
      } //for
    },
    answerGenerator: ({ random, config }) =>
      random.fromRange(1, config.maxRange * 4 - 4), //number
  },
  // =====
  [progressionTypes.subThenAdd]: {
    rowGenerator: function* ({ random, config }) {
      // 1st  = rnd-row#1
      // mid  = 1st - rnd-glob#2
      // last = mid + rnd-glob#3

      // todo(vmyshko): make +- | -+ randomness?
      const maxDiff = config.maxRange;
      const firstMidDiff = random.fromRange(1, maxDiff);
      const midLastDiff = random.fromRange(1, maxDiff);
      const freeValues = getFreeValues(100 - maxDiff * 2).map(
        (x) => x + maxDiff
      );

      for (let rowIndex = 0; rowIndex < config.patternsInCol; rowIndex++) {
        // middle col
        const middleValueInRow = random.popFrom(freeValues);
        // 1st value
        const firstValueInRow = middleValueInRow + firstMidDiff;
        // last value
        const lastValueInRow = middleValueInRow + midLastDiff;

        yield [firstValueInRow, middleValueInRow, lastValueInRow].map(
          mapValueToPattern
        );
      } //for
    },
    answerGenerator: ({ random, config }) =>
      random.fromRange(config.maxRange, 100 - config.maxRange), //number
  },
  [progressionTypes.equalSumPerRowCol]: {
    rowGenerator: function* ({ random, config }) {
      const { colRowSum } = config;

      // first row
      const cell_00 = random.fromRange(1, colRowSum - 2);

      // first row rest
      const cell_01 = random.fromRange(1, colRowSum - cell_00 - 1);
      const cell_02 = colRowSum - cell_00 - cell_01;

      //first col rest
      const cell_10 = random.fromRange(1, colRowSum - cell_00 - 1);
      const cell_20 = colRowSum - cell_00 - cell_10;

      // center cell
      const cell_11 = random.fromRange(
        // todo(vmyshko): min range is unknown for now, i set safe min for now (less combinations)
        Math.min(cell_02, cell_20),
        colRowSum - Math.max(cell_01, cell_10) - 1
      );

      // last middle cells
      const cell_12 = colRowSum - cell_11 - cell_10;
      const cell_21 = colRowSum - cell_11 - cell_01;

      // last cell
      const cell_22 = colRowSum - cell_02 - cell_12;

      // ----------------

      // todo(vmyshko): should return one by one, not rows? (for all progressions)
      yield [cell_00, cell_01, cell_02].map(mapValueToPattern);
      yield [cell_10, cell_11, cell_12].map(mapValueToPattern);
      yield [cell_20, cell_21, cell_22].map(mapValueToPattern);
    },
    answerGenerator: ({ random, config }) =>
      random.fromRange(1, config.colRowSum), //number
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

  const rowPatterns = [
    ...generators[config.progressionType].rowGenerator({
      random,
      config,
    }),
  ];

  const patterns = [...rowPatterns.flat()];

  //last block
  const [correctAnswer] = patterns.splice(-1, 1, null);
  correctAnswer.isCorrect = true;
  correctAnswer.id = getUid();

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

  // todo(vmyshko): review, whether all those are in use?
  return {
    seed,
    patternsInRow,
    patternsInCol,
    //
    patterns,
    answers,
  };
}
