import { getUid } from "./common.js";
import { generateUniqueValues } from "./generate-unique-values.js";
import { SeededRandom } from "./random.helpers.js";

// todo(vmyshko): refac to reuse same code? only yield differs
export const shuffleTypes = {
  /**
   * returns same item for same row
   * @example row1: [A, A, A];
   *          row2: [B, B, B];
   *          row3: [C, C, C];
   */
  rowProgression: function* rowProgression({ items, random, config }) {
    const { patternsInCol = 3, patternsInRow = 3 } = config;

    const shuffledItems = random.shuffle(items);

    for (let rowIndex = 0; rowIndex < patternsInCol; rowIndex++) {
      for (let colIndex = 0; colIndex < patternsInRow; colIndex++) {
        yield shuffledItems[rowIndex % shuffledItems.length];
      }
    }
  },
  /**
   * returns same item for same col
   * @example row1: [A, B, C];
   *          row2: [A, B, C];
   *          row3: [A, B, C];
   */
  colProgression: function* colProgression({ items, random, config }) {
    const { patternsInCol = 3, patternsInRow = 3 } = config;

    const shuffledItems = random.shuffle(items);

    for (let rowIndex = 0; rowIndex < patternsInCol; rowIndex++) {
      for (let colIndex = 0; colIndex < patternsInRow; colIndex++) {
        yield shuffledItems[colIndex % shuffledItems.length];
      }
    }
  },
  /**
   * truly random, items can repeat in row/col
   */
  random: function* random({ items, random, config }) {
    // todo(vmyshko): impl
    const { patternsInCol = 3, patternsInRow = 3 } = config;

    for (let rowIndex = 0; rowIndex < patternsInCol; rowIndex++) {
      const shuffledItems = random.shuffle(items);
      for (let colIndex = 0; colIndex < patternsInRow; colIndex++) {
        yield shuffledItems[(rowIndex + colIndex) % shuffledItems.length];
      }
    }
  },
  /**
   * returns unique sequence per each row/col
   * @example row1: [A, B, C];
   *          row2: [B, C, A];
   *          row3: [C, A, B];
   * OR
   * @example row1: [A, B, C];
   *          row2: [C, A, B];
   *          row1: [B, C, A];
   *
   */
  unique123: function* unique123({ items, random, config }) {
    const { patternsInCol = 3, patternsInRow = 3 } = config;

    const shuffledItems = random.shuffle(items);

    // todo(vmyshko): these should be separated
    // todo(vmyshko): ...but random should concat both
    const mainDiagIndex = ({ rowIndex, colIndex, itemsCount }) =>
      itemsCount - rowIndex + colIndex;
    const secondaryDiagIndex = ({ rowIndex, colIndex }) => rowIndex + colIndex;

    const indexFn = random.sample([mainDiagIndex, secondaryDiagIndex]);

    for (let rowIndex = 0; rowIndex < patternsInCol; rowIndex++) {
      for (let colIndex = 0; colIndex < patternsInRow; colIndex++) {
        yield shuffledItems[
          indexFn({ rowIndex, colIndex, itemsCount: shuffledItems.length }) %
            shuffledItems.length
        ];
      }
    }
  },

  shiftedBy: (shift = 0) =>
    function* shifted123({ items, random, config }) {
      const { patternsInCol = 3, patternsInRow = 3 } = config;

      const shuffledItems = [...items];

      // todo(vmyshko): these should be separated
      // todo(vmyshko): ...but random should concat both
      const mainDiagIndex = ({ rowIndex, colIndex, itemsCount }) =>
        itemsCount - rowIndex + colIndex;
      const secondaryDiagIndex = ({ rowIndex, colIndex }) =>
        rowIndex * shift + colIndex;

      const indexFn = secondaryDiagIndex;

      for (let rowIndex = 0; rowIndex < patternsInCol; rowIndex++) {
        for (let colIndex = 0; colIndex < patternsInRow; colIndex++) {
          yield shuffledItems[
            indexFn({ rowIndex, colIndex, itemsCount: shuffledItems.length }) %
              shuffledItems.length
          ];
        }
      }
    },

  // todo(vmyshko):  impl shifted progressions
};

// todo(vmyshko): do i need this? or apply only varcolors by default? boolean-figures may be affected
function varColor(color) {
  return `var(--${color})`;
}

function* shuffleFiguresGenerator({ random, config }) {
  const { patternsInCol = 3, patternsInRow = 3, shuffleType } = config;
  // todo(vmyshko): set some default color if no presented?
  const { figureGroups, colorGroups, rotationGroups } = config;

  const figureGroupGens = figureGroups.map((fg) =>
    fg.shuffleType({ random, config, items: fg.figures })
  );

  const colorGroupGens = colorGroups.map((cg) =>
    cg.shuffleType({ random, config, items: cg.colors })
  );

  const rotationGroupGens = rotationGroups.map((rg) =>
    rg.shuffleType({ random, config, items: rg.rotations })
  );

  // todo(vmyshko): get from config?
  for (let rowIndex = 0; rowIndex < patternsInCol; rowIndex++) {
    // todo(vmyshko): get from config?
    for (let colIndex = 0; colIndex < patternsInRow; colIndex++) {
      yield [
        {
          rotation: rotationGroupGens.map((rgg) => rgg.next().value),
          figures: figureGroupGens.map((fgg) => fgg.next().value),
          color: colorGroupGens.map((cgg) => cgg.next().value).map(varColor),
        },
      ];
    } //col
  } //row
}

function generateAnswer({ random, config, correctAnswer }) {
  const { figureGroups, colorGroups, rotationGroups } = config;

  const figureGroupsPool = figureGroups.map((fg) => [...fg.figures]);
  const colorGroupsPool = colorGroups.map((cg) => [...cg.colors]);
  const rotationGroupsPool = rotationGroups.map((rg) => [...rg.rotations]);

  const pickedFigs = figureGroupsPool.reduce(
    (acc, figGroup) => [...acc, random.popFrom(figGroup)],
    []
  );

  const pickedColors = colorGroupsPool
    .reduce((acc, cg) => [...acc, random.popFrom(cg)], [])
    .map(varColor);

  const pickedRotations = rotationGroupsPool.reduce(
    (acc, rg) => [...acc, random.popFrom(rg)],
    []
  );

  return {
    color: pickedColors,
    rotation: pickedRotations,
    figures: pickedFigs,
    isCorrect: false,
    id: getUid(),
  };
}

export function generateShuffleFiguresQuestion({
  config,
  seed,
  questionIndex,
}) {
  //
  const {
    patternsInRow = 3,
    maxAnswerCount = 6, //over 8 will not fit
    figureCount, // single pattern figure count [2..n]
  } = config;

  const random = new SeededRandom(seed + questionIndex);

  const rowPatterns = [
    ...shuffleFiguresGenerator({
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
    getValueHashFn: ({ figures, rotation = 0, color = "black" }) =>
      `${figures.toString()};${rotation};${color}`,
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
