import { getUid } from "../helpers/common.js";
import { generateUniqueValues } from "../helpers/generate-unique-values.js";
import { SeededRandom } from "../helpers/random.helpers.js";

function cutoutGenerator({ random, config }) {
  const randomCutout = random.sample(config.cutoutPoints);
  const randomVariant = random.sample(config.variants || []);

  return {
    cutout: randomCutout,
    variant: randomVariant,
  };
}

function generateAnswer({ random, config }) {
  return {
    ...cutoutGenerator({ random, config }),
    isCorrect: false,
    id: getUid(),
  };
}

export function generateCutoutQuestion({ config, seed, questionIndex }) {
  //
  const {
    maxAnswerCount = 6, //over 8 will not fit
    patternsInRow,
  } = config;

  const random = new SeededRandom(seed + questionIndex);

  const questionPattern = cutoutGenerator({
    random,
    config,
  });

  const patterns = [questionPattern];

  const correctAnswer = {
    ...questionPattern,
    isCorrect: true,
    id: getUid(),
  };

  // correctAnswer.isCorrect = true;
  // correctAnswer.id = getUid();

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
    getValueHashFn: ({ cutout, variant }) => `${cutout};${variant};`,
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
