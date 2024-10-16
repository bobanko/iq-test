import { getUid } from "./common.js";
import { generateUniqueValues } from "./generate-unique-values.js";
import { SeededRandom } from "./random.helpers.js";

// todo(vmyshko): this WHOLE file is copy of shuffle-figures.generator.js
// it's made for testing conception of multiple figure-parts
// it needed to be unified with old version

// todo(vmyshko): refac to reuse same code? only yield differs (mostly)
export const shuffleTypes = {
  // single for all cols/rows but basically random
  single: ({ items }) =>
    function* ({ random, config }) {
      const { patternsInCol = 3, patternsInRow = 3 } = config;

      const shuffledItems = random.shuffle(items);

      for (let rowIndex = 0; rowIndex < patternsInCol; rowIndex++) {
        for (let colIndex = 0; colIndex < patternsInRow; colIndex++) {
          yield shuffledItems.at(0);
        }
      }
    },
  /**
   * returns same item for same row
   * @example row1: [A, A, A];
   *          row2: [B, B, B];
   *          row3: [C, C, C];
   */
  rowProgression: ({ items }) =>
    function* rowProgression({ random, config }) {
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
  colProgression: ({ items }) =>
    function* colProgression({ random, config }) {
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
  random: ({ items }) =>
    function* random({ random, config }) {
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
  unique123: ({ items }) =>
    function* unique123({ random, config }) {
      const { patternsInCol = 3, patternsInRow = 3 } = config;

      const shuffledItems = random.shuffle(items);

      // todo(vmyshko): these should be separated
      // todo(vmyshko): ...but random should concat both
      const mainDiagIndex = ({ rowIndex, colIndex, itemsCount }) =>
        itemsCount - rowIndex + colIndex;
      const secondaryDiagIndex = ({ rowIndex, colIndex }) =>
        rowIndex + colIndex;

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

  shiftedBy: ({ items, shift = 0, colShift = 0 }) =>
    function* shifted123({ random, config }) {
      const { patternsInCol = 3, patternsInRow = 3 } = config;

      const shuffledItems = [...items];

      // todo(vmyshko): these should be separated
      // todo(vmyshko): ...but random should concat both
      const mainDiagIndex = ({ rowIndex, colIndex, itemsCount }) =>
        itemsCount - rowIndex + colIndex;
      const secondaryDiagIndex = ({ rowIndex, colIndex }) =>
        rowIndex * shift + colIndex + colShift;

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

// todo(vmyshko): too complex, refac... but how?
function* defaultColorGen({ config }) {
  const { patternsInCol = 3, patternsInRow = 3 } = config;

  for (let rowIndex = 0; rowIndex < patternsInCol; rowIndex++) {
    for (let colIndex = 0; colIndex < patternsInRow; colIndex++) {
      yield "black";
    }
  }
}

function* defaultRotationGen({ config }) {
  const { patternsInCol = 3, patternsInRow = 3 } = config;

  for (let rowIndex = 0; rowIndex < patternsInCol; rowIndex++) {
    for (let colIndex = 0; colIndex < patternsInRow; colIndex++) {
      yield 0;
    }
  }
}

function* shuffleFiguresGenerator({ random, config }) {
  const { patternsInCol = 3, patternsInRow = 3 } = config;
  // todo(vmyshko): set some default color if no presented?
  const { figureParts } = config;

  // init all gens
  const figurePartsGens = figureParts.map(
    ({ figures, color = defaultColorGen, rotation = defaultRotationGen }) => ({
      figures: figures.map((fig) => fig({ random, config })),
      color: color({ random, config }),
      rotation: rotation({ random, config }),
    })
  );

  for (let rowIndex = 0; rowIndex < patternsInCol; rowIndex++) {
    for (let colIndex = 0; colIndex < patternsInRow; colIndex++) {
      // todo(vmyshko): make possible to get multiple figureParts -- update figures.renderer first!

      yield {
        figureParts: figurePartsGens.map((figurePartGen) => {
          return {
            figures: figurePartGen.figures.map((f) => f.next().value),
            color: varColor(figurePartGen.color.next().value),
            rotation: figurePartGen.rotation.next().value,
          };
        }),
      };
    } //col
  } //row
}

function generateAnswer({ random, config, correctAnswer }) {
  const { figureParts, colorGroups, rotationGroups } = config;

  // init all gens
  const figurePartsGens = figureParts.map(
    ({ figures, color = defaultColorGen, rotation = defaultRotationGen }) => ({
      figures: figures.map((fig) => fig({ random, config })),
      color: color({ random, config }),
      rotation: rotation({ random, config }),
    })
  );

  return {
    isCorrect: false,
    id: getUid(),
    figureParts: figurePartsGens.map((figurePartGen) => {
      // 123
      // 123
      // 123
      // make
      // 111 222 333
      // todo(vmyshko): extract this fn - it makes pairs/tuples from multiple arrays
      // @example [[a,b,c],[a,b,c]] => [[a,a],[b,b],[c,c]]
      const allFigsArrs = figurePartGen.figures.map((fig) => [...fig]);
      const figureGroupsPool = allFigsArrs
        .at(0)
        .map((_, index) =>
          allFigsArrs.reduce((acc, arr) => [...acc, arr[index]], [])
        );

      const colorPool = [...figurePartGen.color];
      const rotationPool = [...figurePartGen.rotation];

      return {
        color: varColor(random.sample(colorPool)),
        rotation: random.sample(rotationPool),
        figures: random.sample(figureGroupsPool),
      };
    }),
  };
}

export function generateShuffleFigurePatternsQuestion({
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

  const figurePatterns = [
    ...shuffleFiguresGenerator({
      random,
      config,
    }),
  ];

  //last block
  const correctAnswer = figurePatterns.at(-1);
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
    getValueHashFn: ({ figureParts = [] }) =>
      figureParts
        .map(
          ({ figures, rotation = 0, color = "black" }) =>
            `${figures.toString()};${color};${rotation};`
        )
        .toString(),
  });

  // todo(vmyshko): review, do those all are used?
  return {
    seed,
    patternsInRow,
    //
    patterns: figurePatterns,
    answers,
    correctAnswer,
    //
  };
}