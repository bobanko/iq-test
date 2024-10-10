import { getUid } from "./common.js";
import { generateUniqueValues } from "./generate-unique-values.js";
import { SeededRandom } from "./random.helpers.js";

// todo(vmyshko): do i need this? or apply only varcolors by default? boolean-figures may be affected
function varColor(color) {
  return `var(--${color})`;
}

function* shuffleFiguresGenerator({ random, config }) {
  // todo(vmyshko): set some default color if no presented?
  const { figureGroups, colors = ["black"], rotations = [0] } = config;

  // todo(vmyshko): get from config?
  for (let row of [1, 2, 3]) {
    const possibleFigColors = [...colors];

    const figureGroupsPool = figureGroups.map((fg) => random.shuffle([...fg]));
    const rotationsPool = [...rotations];

    // todo(vmyshko): get from config?
    for (let col of [1, 2, 3]) {
      const colorIsStatic = possibleFigColors.length === 1;

      const randomFigColor = varColor(
        colorIsStatic
          ? possibleFigColors.at(0)
          : random.popFrom(possibleFigColors)
      );

      const rotation = random.popFrom(rotationsPool);

      const pickedFigs = figureGroupsPool.reduce(
        (acc, figGroup) => [
          ...acc,
          // todo(vmyshko): extract to separate fn, into random.helpers
          figGroup[(col + row) % figGroup.length],
        ],
        []
      );

      yield [
        {
          rotation,
          figures: pickedFigs,
          color: randomFigColor,
        },
      ];
    } //col
  } //row
}

function generateAnswer({ random, config, correctAnswer }) {
  const { figureGroups, rotations = [0] } = config;

  const figureGroupsPool = figureGroups.map((fg) => [...fg]);

  const pickedFigs = figureGroupsPool.reduce(
    (acc, figGroup) => [...acc, random.popFrom(figGroup)],
    []
  );

  const rotation = random.sample(rotations);

  return {
    color: correctAnswer.color,
    rotation,
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
    maxAnswerCount = 6, //over 8 will not fit
    figureCount, // single pattern figure count [2..n]
  } = config;

  const patternsInRow = 3;

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
    getValueHashFn: ({ figures, rotation }) =>
      `${figures.toString()};${rotation}`,
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
