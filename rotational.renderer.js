import { defaultColors } from "./common.config.js";
import { SeededRandom, preventSvgCache, wait } from "./helpers.js";
import { svgFrames } from "./rotational.config.js";
import { makeUnique } from "./rotational.generator.js";

function createPatternRotationalBase({ svgFrame = svgFrames.circle }) {
  const $pattern =
    $tmplPatternRotational.content.firstElementChild.cloneNode(true);

  const $partContainer = $pattern.querySelector(".part-container");

  $partContainer.style.mask = `url(${svgFrame})`;

  // apply bg and border
  $pattern.querySelector(".frame-fill>use").href.baseVal = svgFrame;
  $pattern.querySelector(".frame-stroke>use").href.baseVal = svgFrame;

  return $pattern;
}

// todo(vmyshko): extract to rotational
function createPatternRotational({
  config: {
    figs = [],
    onlyUniqueFigs = false, // [2 and more]
    canOverlap = true, // [2 and more] figs can overlap each other - have same deg
    svgFrame = svgFrames.circle,
  },

  seed,
}) {
  // todo(vmyshko): add questionIndex to seed
  const random = new SeededRandom(seed);
  const $pattern = createPatternRotationalBase({ svgFrame });
  const $partContainer = $pattern.querySelector(".part-container");

  const figsUsed = new Set();
  figs.forEach((fig) => {
    const {
      pickFrom, // pick random from inner array
      startDeg = 0, // initial rotation, before rules: 0, -45
      stepDeg = 90, // min rotation step by rules
      skipZero = true, // no zero rotation by rules
    } = fig;

    const $svg = $tmplRotationalPart.content.firstElementChild.cloneNode(true);
    const $use = $svg.querySelector("use");

    try {
      // todo(vmyshko): probably should be in generator
      const currentFig = onlyUniqueFigs
        ? makeUnique({
            prevValuesSet: figsUsed,
            genFn: () => random.sample(pickFrom),
          })
        : random.sample(pickFrom);

      $use.href.baseVal = currentFig;

      $partContainer.appendChild($svg);
    } catch (error) {
      console.warn(error);
    }
  });

  return $pattern;
}

function createCustomQuestionMark({ config }) {
  const $patternQuestionMark = createPatternRotationalBase({
    svgFrame: config.svgFrame,
  });

  $patternQuestionMark.classList.add("pattern-question-mark");

  return $patternQuestionMark;
}

export function renderRotationalQuestion({
  config,
  questionData,
  questionIndex,
}) {
  async function rotateTo($elem, deg) {
    // to help user to understand rotations
    await wait(0);
    $elem.style.transform = `rotate(${deg}deg)`;
  }

  const {
    //
    patternsInRow,
    patternsInCol,
    //
    mtxDegs,
    answers,
    correctAnswer,
    seed,
  } = questionData;

  // todo(vmyshko): make it better, to randomize colors between questions,
  // mb use question hash/id as seed
  const random = new SeededRandom(seed + questionIndex);
  // todo(vmyshko): those who can't overlap -- rotate as pair

  const questionPatterns = [];

  const $basePattern = createPatternRotational({ config, seed });

  const shuffledDefaultColors = random.shuffle(defaultColors);

  //create patterns

  for (let rowIndex = 0; rowIndex < patternsInCol; rowIndex++) {
    // row

    if (config.shiftColorsBetweenRows) {
      // todo(vmyshko): do not alter config colors!
      // config.figs.forEach((fig) => {
      //   fig.colorsFrom?.push(fig.colorsFrom.shift());
      // });
    }

    // ***

    for (let colIndex = 0; colIndex < patternsInRow; colIndex++) {
      if (mtxDegs[rowIndex][colIndex] === null) {
        //question-mark

        const $patternQuestionMark = createCustomQuestionMark({ config });
        questionPatterns.push($patternQuestionMark);
        continue;
      }

      const $pattern = $basePattern.cloneNode(true);

      // get parts
      const parts = [...$pattern.querySelectorAll(".rotational-part")];

      parts.forEach(($part, partIndex) => {
        const colors =
          config.figs[partIndex].colorsFrom ?? shuffledDefaultColors;

        // todo(vmyshko): apply rule? color?
        $part.style.setProperty("--color", colors[partIndex]);

        const currentDeg = mtxDegs[rowIndex][colIndex][partIndex];
        rotateTo($part, currentDeg);
      });

      questionPatterns.push($pattern);
    } //col
  } //row

  // *******
  // ANSWERS
  // *******

  const answerPatterns = answers.map(({ degs, id, isCorrect }) => {
    const $pattern = $basePattern.cloneNode(true);

    // get parts
    const parts = [...$pattern.querySelectorAll(".rotational-part")];

    // todo(vmyshko): extract answers appliance
    parts.forEach(($part, partIndex) => {
      const colors = config.figs[partIndex].colorsFrom ?? shuffledDefaultColors;
      // todo(vmyshko): apply rule? color?
      $part.style.setProperty("--color", colors[partIndex]);

      // todo(vmyshko): should it come from config?
      const viewBox = "0 0 100 100";
      $part.setAttribute("viewBox", viewBox);

      rotateTo($part, degs[partIndex]);
    });

    return { $pattern, id, isCorrect };
  });

  //debug
  setTimeout(() => {
    preventSvgCache();
  }, 0);

  return {
    questionPatterns,
    answerPatterns,
  };
}
