import { getUid } from "../helpers/common.js";
import { generateUniqueValues } from "../helpers/generate-unique-values.js";
import { SeededRandom } from "../helpers/random.helpers.js";

// todo(vmyshko): this WHOLE file is copy of shuffle-figures.generator.js
// it's made for testing conception of multiple figure-parts
// it needed to be unified with old version

const defaultPatternCount = { patternsInCol: 3, patternsInRow: 3 };
// todo(vmyshko): refac to reuse same code? only yield differs (mostly)
export const shuffleTypes = {
  /**
   * single for all cols/rows but basically random
   * @param {*} param0
   * @returns same item for all rows/cols but basically random
   */
  // single for all cols/rows but basically random
  single: ({ items }) =>
    function* ({ random, config }) {
      const { patternsInCol = 3, patternsInRow = 3 } = {
        ...defaultPatternCount,
        ...config,
      };

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

  // todo(vmyshko): copy documentation

  shiftedBy: ({ items, rowShift = 0, colShift = 0 }) =>
    function* shifted123({ random, config }) {
      const { patternsInCol = 3, patternsInRow = 3 } = config;

      const shuffledItems = [...items];

      // todo(vmyshko): these should be separated
      // todo(vmyshko): ...but random should concat both
      const mainDiagIndex = ({ rowIndex, colIndex, itemsCount }) =>
        itemsCount - rowIndex + colIndex;
      const secondaryDiagIndex = ({ rowIndex, colIndex }) =>
        rowIndex * rowShift + colIndex + colShift;

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

// todo(vmyshko): too complex, refac... but how?

const getDefaultValueGen = (defaultValue) =>
  function* defaultValueGen({ config }) {
    const { patternsInCol = 3, patternsInRow = 3 } = config;

    for (let rowIndex = 0; rowIndex < patternsInCol; rowIndex++) {
      for (let colIndex = 0; colIndex < patternsInRow; colIndex++) {
        yield defaultValue;
      }
    }
  };

const defaultColor = "transparent";

function* shuffleFiguresGenerator({ random, config }) {
  const { patternsInCol = 3, patternsInRow = 3 } = config;
  const { figureParts } = config;

  // init all gens
  // todo(vmyshko): get rid of default gens? or make them generic?
  const figurePartsGens = figureParts.map(
    ({
      figures,
      color = getDefaultValueGen(defaultColor),
      rotation = getDefaultValueGen(0),
      strokeWidth = getDefaultValueGen(0),
    }) => ({
      figures: figures.map((fig) => fig({ random, config })),
      color: color({ random, config }),
      rotation: rotation({ random, config }),
      strokeWidth: strokeWidth({ random, config }),
    })
  );

  for (let rowIndex = 0; rowIndex < patternsInCol; rowIndex++) {
    for (let colIndex = 0; colIndex < patternsInRow; colIndex++) {
      // todo(vmyshko): make possible to get multiple figureParts -- update figures.renderer first!
      // seems it already works

      yield {
        figureParts: figurePartsGens.map((figurePartGen) => {
          return {
            figures: figurePartGen.figures.map((f) => f.next().value),
            color: figurePartGen.color.next().value,
            rotation: figurePartGen.rotation.next().value,
            strokeWidth: figurePartGen.strokeWidth.next().value,
          };
        }),
      };
    } //col
  } //row
}

function generateAnswer({ random, config, correctAnswer }) {
  const { figureParts, colorGroups, rotationGroups } = config;

  // todo(vmyshko): get rid of this copy-pasta

  // init all gens
  const figurePartsGens = figureParts.map(
    ({
      figures,
      color = getDefaultValueGen(defaultColor),
      rotation = getDefaultValueGen(0),
      strokeWidth = getDefaultValueGen(0),
    }) => ({
      figures: figures.map((fig) => fig({ random, config })),
      color: color({ random, config }),
      rotation: rotation({ random, config }),
      strokeWidth: strokeWidth({ random, config }),
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

      // todo(vmyshko): these all should be generic
      const colorPool = [...figurePartGen.color];
      const rotationPool = [...figurePartGen.rotation];
      const strokeWidthPool = [...figurePartGen.strokeWidth];

      return {
        color: random.sample(colorPool),
        rotation: random.sample(rotationPool),
        strokeWidth: random.sample(strokeWidthPool),
        //----
        figures: random.sample(figureGroupsPool),
      };
    }),
  };
}

/**
 * @deprecated new one is in the shuffle-figures.gen
 */
export function generateShuffleFigurePatternsQuestion({
  config,
  seed,
  questionIndex,
}) {
  //
  const {
    patternsInRow = 3,
    maxAnswerCount = 6, //over 8 will not fit
  } = config;

  const random = new SeededRandom(seed + questionIndex);

  const patterns = [
    ...shuffleFiguresGenerator({
      random,
      config,
    }),
  ];

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
    getValueHashFn: ({ figureParts = [] }) =>
      figureParts
        .map(
          // todo(vmyshko): why defaults are not set yet? re-check!
          ({ figures, rotation = 0, color = defaultColor, strokeWidth = 0 }) =>
            `${figures.toString()};${color};${rotation};${strokeWidth}`
        )
        .toString(),
  });

  // todo(vmyshko): review, do those all are used?
  return {
    seed,
    patternsInRow,
    //
    patterns,
    answers,
  };
}
