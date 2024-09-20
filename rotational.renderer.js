import { SeededRandom, preventSvgCache, wait } from "./helpers.js";
import { defaultColors, svgFrames } from "./rotational.config.js";
import { makeUnique } from "./rotational.generator.js";

function createPatternRotationalBase({ svgFrame = svgFrames.circle }) {
  const patternTmpl = $tmplPatternRotational.content.cloneNode(true); //fragment
  const $pattern = patternTmpl.firstElementChild;

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

    const partTmpl = $tmplRotationalPart.content.cloneNode(true); //fragment
    const $svg = partTmpl.firstElementChild;
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
    rowsNum,
    colsNum,
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

  for (let row = 0; row < rowsNum; row++) {
    // row

    if (config.shiftColorsBetweenRows) {
      // todo(vmyshko): do not alter config colors!
      // config.figs.forEach((fig) => {
      //   fig.colorsFrom?.push(fig.colorsFrom.shift());
      // });
    }

    // ***

    for (let col = 0; col < colsNum; col++) {
      const $pattern = $basePattern.cloneNode(true);

      // get parts
      const parts = [...$pattern.querySelectorAll(".rotational-part")];

      parts.forEach(($part, partIndex) => {
        const colors =
          config.figs[partIndex].colorsFrom ?? shuffledDefaultColors;

        // todo(vmyshko): apply rule? color?
        $part.classList.add(colors[partIndex]);

        const currentDeg = mtxDegs[row][col][partIndex];
        rotateTo($part, currentDeg);
      });

      questionPatterns.push($pattern);
    } //col
  } //row

  // todo(vmyshko): this is custom question-mark, return it?
  const $patternQuestionMark = createPatternRotationalBase({
    svgFrame: config.svgFrame,
  });

  $patternQuestionMark.classList.add("pattern-question-mark");

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
      $part.classList.add(colors[partIndex]);

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
    $questionMark: $patternQuestionMark,
    answerPatterns,
  };
}
