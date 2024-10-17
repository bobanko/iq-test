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

function isUniqueAnswer([operator, varA, varB]) {
  const answer = operator.fn(varA.value, varB.value);

  if ([varA.value, varB.value].includes(answer)) return false;

  return true;
}

function* getPossibleCombinations({ varA, varB, maxAnswer = 20 }) {
  // todo(vmyshko): refac to more generic clean approach?

  //div
  const divA = getDivisors(varA.value);
  if (divA.includes(varB.value)) {
    yield [operators.div, varA, varB, operators.div.fn(varA.value, varB.value)];
  }
  const divB = getDivisors(varB.value);
  if (divB.includes(varA.value)) {
    yield [operators.div, varB, varA, operators.div.fn(varB.value, varA.value)];
  }

  //mul -- limit max answer
  if (varA.value * varB.value <= maxAnswer) {
    yield [operators.mul, varA, varB, operators.mul.fn(varA.value, varB.value)];
  }

  //sub -- only positive answers
  if (varA.value > varB.value) {
    yield [operators.sub, varA, varB, operators.sub.fn(varA.value, varB.value)];
  } else {
    //b>a
    yield [operators.sub, varB, varA, operators.sub.fn(varB.value, varA.value)];
  }

  //add -- limit max answer
  if (varA.value + varB.value <= maxAnswer) {
    yield [operators.add, varA, varB, operators.add.fn(varA.value, varB.value)];
  }
}

const operators = {
  add: { value: "+", fn: (a, b) => a + b },
  sub: { value: "-", fn: (a, b) => a - b },
  mul: { value: "×", fn: (a, b) => a * b },
  div: { value: "÷", fn: (a, b) => a / b },
  eqal: { value: "=", fn: (a, b) => a === b },
};

function* formulaGenerator({ random, config }) {
  const freeValues = getFreeValues(9).map((x) => x + 1);

  const variables = {
    x: { color: "red", label: "x", value: null },
    y: { color: "green", label: "y", value: null },
    z: { color: "blue", label: "z", value: null },
    firstConst: { color: "yellow", label: null, value: null },
    answerConst: { color: "white", label: null, value: null },
  };

  // 9,5,4 -- only 2 combs
  variables.x.value = random.popFrom(freeValues);
  variables.y.value = random.popFrom(freeValues);
  variables.z.value = random.popFrom(freeValues);

  const maxAnswer = 10;

  const xyCombs = [
    ...getPossibleCombinations({
      varA: variables.x,
      varB: variables.y,
      maxAnswer,
    }),
  ];

  const xzCombs = [
    ...getPossibleCombinations({
      varA: variables.x,
      varB: variables.z,
      maxAnswer,
    }),
  ];

  const yzCombs = [
    ...getPossibleCombinations({
      varA: variables.y,
      varB: variables.z,
      maxAnswer,
    }),
  ];

  const combPool = [...xyCombs, ...xzCombs, ...yzCombs];

  function processAnswer([firstOp, varA, varB, answerValue]) {
    const xyz = [variables.x, variables.y, variables.z];
    const answerVar = xyz.find(({ value }) => value === answerValue);
    const answer = answerVar ?? {
      color: "white",
      value: answerValue,
    };

    return { operator: firstOp, varA, varB, answer };
  }

  const combSlice = random.popRangeFrom(combPool, 4);

  const sortedCombs = combSlice
    .map(processAnswer)
    .toSorted(({ answer: answer1 }, { answer: answer2 }) => {
      return (answer2.label ?? "").localeCompare(answer1.label ?? "");
    });

  let xyzFound = false;
  for (let comb of sortedCombs) {
    const { operator, varA, varB, answer } = comb;

    // todo(vmyshko): remove x+y=z -> z-y=x;
    if (
      [varA, varB, answer]
        .map((v) => v.label)
        .toSorted()
        .join("") === "xyz"
    ) {
      if (xyzFound) {
        console.log("found dupe xyz");
        continue;
      }
      xyzFound = true;
    }

    console.log(
      [variables.x.value, variables.y.value, variables.z.value],
      comb
    );

    // todo(vmyshko): yield obj instead of tuple/arr
    yield [varA, operator, varB, operators.eqal, answer];
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
    //
    patterns,
    answers,
    correctAnswer,
    //
  };
}
