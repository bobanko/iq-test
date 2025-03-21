import { getUid } from "../helpers/common.js";
import { getLetter } from "../helpers/helpers.js";
import { generateColRowSumMatrix } from "./col-row-sum.generator.js";

// helpers

function getFreeValues(valueCount) {
  return Array(valueCount)
    .fill(null)
    .map((_, index) => index);
}

export function answerGenerator_mulThenSub({ random, config }) {
  return random.fromRange(1, config.maxRange * 4 - 4); //number
}

export function preGenBytes_mulThenSub({ random, config }) {
  // rand .*2 -2; .*3 -3; .*4 .-4;
  // 1st  = rnd#1
  // mid  = 1st * 2 // [..3,4]
  // last = mid - 2 // [..3,4]

  const freeValues = getFreeValues(config.maxRange).map((x) => x + 1);

  const result = [];

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

    result.push([firstValueInRow, middleValueInRow, lastValueInRow]);
  } //for

  return result.flat();
}

export function preGenBytes_addThenDiv({ random, config }) {
  // rand .+x ./y
  // 1st  = mid - rnd#3
  // mid  = last * 2 //or more? rnd#2
  // last = rnd#1

  const lastMidMultiplier = 2; // 3 -- too complex
  // todo(vmyshko): impl negative diff?
  const firstMidDiff = random.fromRange(1, 10);

  const freeValues = getFreeValues(config.maxRange - firstMidDiff).map(
    (x) => x + 1
  );

  const result = [];

  for (let rowIndex = 0; rowIndex < config.patternsInCol; rowIndex++) {
    // stop generation, if no unique values left
    if (!freeValues.length) return;

    // last value in row
    const lastValueInRow = random.popFrom(freeValues) + firstMidDiff;

    // middle col
    const middleValueInRow = lastValueInRow * lastMidMultiplier;

    // last value
    const firstValueInRow = middleValueInRow - firstMidDiff;

    result.push([firstValueInRow, middleValueInRow, lastValueInRow]);
  } //for

  return result.flat();
}

export function preGenBytes_subPerRow({ random, config }) {
  // rand-rand=x; x3
  // 1st  = gen a,b,c
  // mid  = random.from(0, answer)
  // last = first - mid

  const freeValues = getFreeValues(config.maxRange).map((x) => x + 1);

  const result = [];

  for (let rowIndex = 0; rowIndex < config.patternsInCol; rowIndex++) {
    // stop generation, if no unique values left
    if (!freeValues.length) return;

    // last value in row
    const firstValueInRow = random.popFrom(freeValues);

    // middle col
    const middleValueInRow = random.fromRange(1, firstValueInRow - 1);

    // last value
    const lastValueInRow = firstValueInRow - middleValueInRow;

    result.push([firstValueInRow, middleValueInRow, lastValueInRow]);
  } //for

  return result.flat();
}

export function preGenBytes_numToAbc({ random, config }) {
  // 1=a, 2=b
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

  return [row1, row2].flat();
}

export function answerGenerator_numToAbc({ random, config }) {
  // todo(vmyshko): make it configurable to allow mix -- letters/numbers?
  return random.sample([
    getLetter(random.fromRange(0, config.maxAnswerCount - 1)), //letter
    random.fromRange(0, config.maxAnswerCount - 1), //number
  ]);
}

export function preGenBytes_subThenAdd({ random, config }) {
  // rand.-12 .+9; x3
  // 1st  = rnd-row#1
  // mid  = 1st - rnd-glob#2
  // last = mid + rnd-glob#3

  // todo(vmyshko): make +- | -+ randomness?
  const maxDiff = config.maxRange;
  const firstMidDiff = random.fromRange(1, maxDiff);
  const midLastDiff = random.fromRange(1, maxDiff);
  const freeValues = getFreeValues(100 - maxDiff * 2).map((x) => x + maxDiff);

  const result = [];

  for (let rowIndex = 0; rowIndex < config.patternsInCol; rowIndex++) {
    // middle col
    const middleValueInRow = random.popFrom(freeValues);
    // 1st value
    const firstValueInRow = middleValueInRow + firstMidDiff;
    // last value
    const lastValueInRow = middleValueInRow + midLastDiff;

    result.push([firstValueInRow, middleValueInRow, lastValueInRow]);
  } //for

  return result.flat();
}

export function preGenBytes_subProgression({ random, config }) {
  // rand-n-n
  const results = preGenBytes_addProgression({
    random,
    config,
  });

  return results.reverse();
}

export function preGenBytes_addProgression({ random, config }) {
  // rand+n+n
  // patternsInCol -- max is 2 for this type?
  const halfRangeMax = Math.floor(config.maxRange / 2);

  const row1col3 = random.fromRange(3, halfRangeMax);

  const step = Math.floor(row1col3 / 3);

  const row1col2 = row1col3 - step;
  const row1col1 = row1col2 - step;

  const row1 = [row1col1, row1col2, row1col3];

  const row2col3 = random.fromRange(row1col3 + step * 3, config.maxRange);
  const row2col2 = row2col3 - step;
  const row2col1 = row2col2 - step;

  const row2 = [row2col1, row2col2, row2col3];

  return [row1, row2].flat();
}

export function answerGenerator_subThenAdd({
  correctAnswer: correctAnswerBytes,
  random,
  config,
}) {
  return random.fromRange(config.maxRange, 100 - config.maxRange); //number
}

export function answerGenerator_addToAbc({
  correctAnswer: correctAnswerBytes,
  random,
  config,
}) {
  return random.sample([
    getLetter(random.fromRange(0, config.maxAnswerCount - 1)), //letter
    random.fromRange(0, config.maxAnswerCount - 1), //number
  ]);
}

export function preGenBytes_addToAbc({ random, config }) {
  // 1+2=c
  // 1st  = gen a,b,c
  // mid  = random.from(0, answer)
  // last =  first - mid

  const freeValues = getFreeValues(config.maxAnswerCount).map((x) => x + 1);

  const result = [];

  for (let rowIndex = 0; rowIndex < config.patternsInCol; rowIndex++) {
    // stop generation, if no unique values left
    if (!freeValues.length) return;

    // last value in row
    const firstValueInRow = random.popFrom(freeValues);

    // middle col
    const middleValueInRow = random.fromRange(0, firstValueInRow - 1);

    // last value
    const lastValueInRow = firstValueInRow - middleValueInRow;

    result.push([
      //reordered!
      lastValueInRow,
      middleValueInRow,
      getLetter(firstValueInRow - 1),
    ]);
  } //for

  return result.flat();
}

export function preGenBytes_subIncrementAll({ random, config }) {
  // rand.-1 .-2; (.-3) .-4 .-5; (-6) .-7 .-8;
  const patternCount = config.patternsInCol * config.patternsInRow;

  // the last one to dicsover

  const maxDecrement = (patternCount * (patternCount - 1)) / 2;

  const randomShift = random.fromRange(0, config.maxRange);

  const result = [];
  for (let patternIndex = 0; patternIndex < patternCount; patternIndex++) {
    const decrement = patternCount - patternIndex;
    // +1+2+3+4+5
    // +1+3+6+10+15

    // 39-2
    // 39 - ((patternIndex * (patternIndex + 1)) / 2 + 1) // -0,-1,-3,-6,10,15,21,28,..36,
    // 39 - ((patternIndex * (patternIndex + 1)) / 2 + 1) // -0,-1,-2,-3,-4,-5,-6,-7,..-8,
    // 39 - ((patternIndex * (patternIndex + 1)) / 2 + 1) // 38,37,35,32,28,23,17,10,..2

    result.push([
      maxDecrement + randomShift - ((patternIndex + 1) * patternIndex) / 2,
    ]);
  } //for

  return result.flat();
}

export function preGenBytes_equalSumPerRowCol({ random, config }) {
  // 1+2+3=6; 3+2+1=6; 1+3+2=6; same for cols
  return generateColRowSumMatrix({ random, config }).flat();
}

export function preRenderPatternNUMBER({ bytes: byteValue, preRenderConfig }) {
  if (byteValue === null) return null; // for [?]

  return {
    debugInfo: byteValue,
    value: byteValue,
    id: getUid(),
  };
}
