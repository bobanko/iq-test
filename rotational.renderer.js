import { toggleAnswerSelect, wrapAnswerPattern } from "./common.js";
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
  quizAnswers,
  updateProgressQuiz,
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

  const patterns = [];

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

      patterns.push($pattern);
    } //col
  } //row

  $patternArea.style.setProperty("--size", rowsNum);
  $patternArea.replaceChildren(...patterns);

  // replace last pattern with ? and move it to answers
  const $correctAnswerPattern = patterns.at(-1);

  const $patternQuestionMark = createPatternRotationalBase({
    svgFrame: config.svgFrame,
  });

  $patternQuestionMark.classList.add("pattern-question-mark");

  //new,old
  $patternArea.replaceChild($patternQuestionMark, $correctAnswerPattern);

  // *******
  // ANSWERS
  // *******

  const answerPatterns = [];

  for (let { degs, id } of answers) {
    const $pattern = $basePattern.cloneNode(true);

    // get parts
    const parts = [...$pattern.querySelectorAll(".rotational-part")];

    parts.forEach(($part, partIndex) => {
      const colors = config.figs[partIndex].colorsFrom ?? shuffledDefaultColors;
      // todo(vmyshko): apply rule? color?
      $part.classList.add(colors[partIndex]);

      rotateTo($part, degs[partIndex]);
    });

    answerPatterns.push({ $pattern, id });
  }

  const answerLetters = "abcdef";
  $answerList.replaceChildren();

  random.shuffle(answerPatterns).forEach(({ $pattern, id }, answerIndex) => {
    const $answerButton = wrapAnswerPattern({
      $tmplAnswer,
      $pattern,
      letter: answerLetters[answerIndex],
    });
    $answerButton.dataset.id;
    $answerButton.dataset.id = id;

    $answerButton.addEventListener("click", async () => {
      toggleAnswerSelect({ $answer: $answerButton, $answerList });

      quizAnswers[questionIndex] = id;
      $questionList.children[questionIndex]?.classList.add("answered");

      // todo(vmyshko): not the best solution, but quizAnswers collection is bad
      const answeredCount = $questionList.querySelectorAll(".answered").length;

      updateProgressQuiz({
        answered: answeredCount,
      });

      // todo(vmyshko): bug when user is on last question and no nav happens, answers become disabled
      [...$answerList.children].forEach(($btn) => ($btn.disabled = true));
      // go to next question
      await wait(500);
      $questionList.children[questionIndex].nextSibling?.click();
    });

    $answerList.appendChild($answerButton);
  });

  // select previously selected answer if possible
  $answerList
    .querySelector(`[data-id='${quizAnswers[questionIndex]}']`)
    ?.classList.add("selected");

  preventSvgCache();
}
