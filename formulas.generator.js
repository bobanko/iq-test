import { getUid } from "./common.js";
import { generateUniqueValues } from "./generate-unique-values.js";
import { SeededRandom } from "./random.helpers.js";

export const formulaGenerators = {
  formulaGenerator,
  formulaEmojiGenerator,
};
// helpers

function getFreeValues(valueCount) {
  return Array(valueCount)
    .fill(null)
    .map((_, index) => index);
}

function getDivisors(intValue) {
  const result = [];
  for (let i = 2; i <= intValue / 2; i++) {
    if (intValue % i == 0) {
      result.push(i);
    }
  }
  return result;
}

function isAdjacent(a, b) {
  if (getDivisors(a).includes(b)) {
    return true;
  }
  if (getDivisors(b).includes(a)) {
    return true;
  }

  if (a + b <= 10) return true;

  return false;
}

function* getPossibleCombinations({ varA, varB, maxAnswer = 20 }) {
  const divA = getDivisors(varA.value);
  const divB = getDivisors(varB.value);

  //div
  if (divA.includes(varB.value)) {
    yield [operators.div, varA, varB];
  }
  if (divB.includes(varA.value)) {
    yield [operators.div, varB, varA];
  }

  //mul
  if (varA.value * varB.value <= maxAnswer) {
    yield [operators.mul, varA, varB];
    // yield [operators.mul, varB, varA];
  }

  //sub
  if (varA.value > varB.value) {
    yield [operators.sub, varA, varB];
  } else {
    //b>a
    yield [operators.sub, varB, varA];
  }

  //add
  if (varA.value + varB.value <= maxAnswer) {
    yield [operators.add, varA, varB];
  }
}

const operators = {
  add: { value: "+", fn: (a, b) => a + b },
  sub: { value: "-", fn: (a, b) => a - b },
  mul: { value: "×", fn: (a, b) => a * b },
  div: { value: "÷", fn: (a, b) => a / b },
  eqal: { value: "=", fn: (a, b) => a === b },
};

// todo(vmyshko): probably only one generator
function* formulaGenerator({ random, config }) {
  const freeValues = getFreeValues(9).map((x) => x + 1);

  const variables = {
    x: { color: "red", label: "x", value: null },
    y: { color: "green", label: "y", value: null },
    z: { color: "blue", label: "z", value: null },
    firstConst: { color: "yellow", label: null, value: null },
    answerConst: { color: "white", label: null, value: null },
  };

  // 1st row
  // todo(vmyshko): limit not both high, at least 2 formulas
  // 1 -- _,2,3,4,5,6,7,8,9,
  // 2 -- 1,_,3,4,5,6,7,8,_
  // 3 -- 1,2,_,4,5,6,7,_,9
  // 4 -- 1,2,3,_,_,6,_,8,_
  // 5 -- 1,2,3,4
  // 6 -- 1,2,3,4
  // 7 -- 1,2,3
  // 8 -- 1,2,4
  // 9 -- 1,_,3
  // ---
  // 10 - 1,2,_ //exclude
  variables.x.value = random.popFrom(freeValues);

  do {
    // todo(vmyshko): fix
    variables.y.value = random.popFrom(freeValues);
  } while (!isAdjacent(variables.x.value, variables.y.value));

  const xyCombs = [
    ...getPossibleCombinations({
      varA: variables.x,
      varB: variables.y,
      maxAnswer: 10,
    }),
  ];

  function isUniqueAnswer([operator, varA, varB]) {
    const answer = operator.fn(varA.value, varB.value);

    if ([varA.value, varB.value].includes(answer)) return false;

    return true;
  }

  if (xyCombs.length === 0) debugger;

  {
    const [firstOp, varA, varB] = random.popWhere(xyCombs, isUniqueAnswer);

    variables.z.value = firstOp.fn(varA.value, varB.value);

    yield [varA, firstOp, varB, operators.eqal, variables.z];
    console.log([varA, firstOp, varB, operators.eqal, variables.z]);
  }

  // 2nd row

  {
    // const [firstOp, varA, varB] = random.popWhere(xyCombs, isUniqueAnswer);
    const [firstOp, varA, varB] = random.popFrom(xyCombs);

    variables.firstConst.value = firstOp.fn(varA.value, varB.value);

    if (
      [variables.x, variables.y, variables.z].some(
        (variable) => variable.value === variables.firstConst.value
      )
    ) {
      // firstConst is same as one of the xyz -- replace?

      const varToReplaceBy = [variables.x, variables.y, variables.z].find(
        (variable) => variable.value === variables.firstConst.value
      );

      // todo(vmyshko): if no const -- open blue?
      yield [varA, firstOp, varB, operators.eqal, varToReplaceBy];
    } else {
      yield [varA, firstOp, varB, operators.eqal, variables.firstConst];
    }
    console.log([varA, firstOp, varB, operators.eqal, variables.firstConst]);
  }

  // 3rd row
  {
    const xoryzCombs = [
      ...getPossibleCombinations({
        // varA: random.sample([variables.x, variables.y]),
        varA: variables.y,
        varB: variables.z,
        maxAnswer: 10,
      }),
    ];

    const [firstOp, varA, varB] = random.popWhere(
      xoryzCombs,
      ([operator, varA, varB]) => {
        // skip mul for x*1 equasions
        if ([varA.value, varB.value].includes(1) && operator === operators.mul)
          return false;

        const answer = operator.fn(varA.value, varB.value);

        if ([varA.value, varB.value].includes(answer)) return false;

        return true;
      }
    );

    variables.answerConst.value = firstOp.fn(varA.value, varB.value);

    yield [varA, firstOp, varB, operators.eqal, variables.answerConst];
    // yield [varA, firstOp, varB, operators.eqal, variables.answerConst];
    console.log([varA, firstOp, varB, operators.eqal, variables.answerConst]);
  }
}

function* formulaEmojiGenerator({ random, config }) {
  //
  const freeValues = getFreeValues(9).map((x) => x + 1);

  const variables = {
    x: { color: "red", label: "x", value: null },
    y: { color: "green", label: "y", value: null },
    z: { color: "blue", label: "z", value: null },
  };

  // 1st row
  {
    variables.x.value = random.popFrom(freeValues);

    const firstOp =
      variables.x.value < 5
        ? //allow mul only for lower x values
          random.sample([operators.add, operators.mul])
        : operators.add;

    const answerConst = {
      color: "white",
      value: firstOp.fn(variables.x.value, variables.x.value),
    };

    yield [variables.x, firstOp, variables.x, operators.eqal, answerConst];
  }
  // 2nd row
  {
    variables.y.value = random.popFrom(freeValues);

    const xyCombs = [
      ...getPossibleCombinations({
        varA: variables.x,
        varB: variables.y,
        maxAnswer: 20,
      }),
    ];

    const [firstOp, varA, varB] = random.sample(xyCombs);

    const answerConst = {
      color: "white",
      value: firstOp.fn(varA.value, varB.value),
    };

    yield [varA, firstOp, varB, operators.eqal, answerConst];
  }
  // 3rd row
  {
    variables.z.value = random.popFrom(freeValues);

    const yzCombs = [
      ...getPossibleCombinations({
        varA: variables.y,
        varB: variables.z,
        maxAnswer: 20,
      }),
    ];

    const [firstOp, varA, varB] = random.sample(yzCombs);

    const answerConst = {
      color: "white",
      value: firstOp.fn(varA.value, varB.value),
    };

    yield [varA, firstOp, varB, operators.eqal, answerConst];
  }
  // 4th row
  {
    const zxCombs = [
      ...getPossibleCombinations({
        varA: variables.z,
        varB: variables.x,
        maxAnswer: 20,
      }),
    ];

    const [firstOp, varA, varB] = random.sample(zxCombs);

    const answerConst = {
      color: "white",
      value: firstOp.fn(varA.value, varB.value),
    };

    yield [varA, firstOp, varB, operators.eqal, answerConst];
  }
}

// todo(vmyshko): fix slippage
// should be in range:
// FROM: answer-[0,6]
// TO:   answer+[0,6]
// where 6 is random, but FROM should be > 0
function generateAnswer({ random, config, correctAnswer }) {
  const { maxAnswerCount = 6 } = config;
  var answerValue = correctAnswer.value;

  const shiftage = random.fromRange(
    Math.max(answerValue - maxAnswerCount, 0),
    answerValue + maxAnswerCount
  );

  return {
    ...correctAnswer,
    value: shiftage,
    isCorrect: false,
    id: getUid(),
  };
}

export function generateFormulasQuestion({ config, seed, questionIndex }) {
  const patternsInRow = 5; //always 5 = 3 vars + 2 ops -- a+b=c --like

  const {
    maxAnswerCount = 6, //over 8 will not fit
    figureCount, // single pattern figure count [2..n]
  } = config;

  const random = new SeededRandom(seed + questionIndex);

  const rowPatterns = [
    ...config.formulaGenerator({
      random,
      config,
    }),
  ];

  const patterns = [...rowPatterns.flat()];

  //last block
  const correctAnswer = patterns.at(-1);
  correctAnswer.isCorrect = true;
  correctAnswer.id = getUid();

  // *******
  // ANSWERS
  // *******

  const answers = generateUniqueValues({
    existingValues: [correctAnswer],
    maxValuesCount: maxAnswerCount - 1,
    generateFn: () => {
      return generateAnswer({
        correctAnswer,
        random,
        config,
      });
    },
    getValueHashFn: ({ value }) => value.toString(),
  });

  // todo(vmyshko): review, do those all are used?
  return {
    seed,
    patternsInRow,
    figureCount,
    //
    patterns,
    answers,
    correctAnswer,
    //
  };
}
