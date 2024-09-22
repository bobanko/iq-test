import { getUid } from "./common.js";
import { generateUniqueValues } from "./generate-unique-values.js";
import { SeededRandom } from "./random.helpers.js";

// helpers

function getFreeValues(valueCount) {
  return Array(valueCount)
    .fill(null)
    .map((_, index) => index);
}

const variables = [
  { value: "r", color: "red" },
  { value: "g", color: "green" },
  { value: "b", color: "blue" },
  { value: "y", color: "yellow" },
];

const freeOps = ["+", "-", "×", "÷", "="];

// todo(vmyshko): probably only one generator
const generators = {
  // =====
  ["formulaTypes.random"]: {
    rowGenerator: function* ({ random, config }) {
      // 1st  =
      // op1  =
      // mid  =
      // op2  =
      // last =

      const freeValues = getFreeValues(10).map((x) => x + 1);

      for (let rowIndex = 0; rowIndex < config.patternsInCol; rowIndex++) {
        // stop generation, if no unique values left
        if (!freeValues.length) return;

        const firstOp = random.sample(freeOps);
        const lastOp = random.sample(freeOps);

        // first value
        const firstValueInRow = random.sample(variables);

        // middle col
        const middleValueInRow = random.sample(variables);

        // last value
        const lastValueInRow = random.sample(variables);

        yield [
          {
            ...firstValueInRow,
            type: "var",
            id: getUid(),
          },
          {
            value: firstOp,
            type: "op",
            id: getUid(),
          },
          {
            ...middleValueInRow,
            type: "var",
            id: getUid(),
          },
          {
            value: lastOp,
            type: "op",
            id: getUid(),
          }, //
          {
            ...lastValueInRow,
            type: "var",
            id: getUid(),
          },
        ];
      } //for
    },
    answerGenerator: ({ random, config }) =>
      random.fromRange(0, config.maxAnswerCount - 1), //number
  },
};

export function generateFormulasQuestion({ config, seed, questionIndex }) {
  const patternsInRow = 5; //always 5 = 3 vars + 2 ops -- a+b=c --like

  const {
    patternsInCol = 3, // can be reduced by gen-non-unique reason
    maxAnswerCount = 6, //over 8 will not fit
    figureCount, // single pattern figure count [2..n]
  } = config;

  const random = new SeededRandom(seed + questionIndex);

  const rowPatterns = [
    ...generators[config.formulaType].rowGenerator({
      random,
      config,
    }),
  ];

  const patterns = [...rowPatterns.flat()];

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
        value: generators[config.formulaType].answerGenerator({
          random,
          config,
        }),
        type: "value",
        id: getUid(),
      };
    },
    getValueHashFn: ({ value }) => value.toString(),
  });

  // todo(vmyshko): review, do those all are used?
  return {
    seed,
    patternsInRow,
    patternsInCol,
    figureCount,
    //
    patterns,
    answers,
    correctAnswer,
    //
  };
}
