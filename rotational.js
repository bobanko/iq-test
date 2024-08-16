import { wrapAnswers } from "./common.js";
import { pickRandom, preventSvgCache, shuffle, wait } from "./helpers.js";
import { defaultColors, genConfigs, svgFrames } from "./rotational.config.js";
import {
  generateRotationalQuestion,
  makeUnique,
} from "./rotational.generator.js";

async function rotateTo($elem, deg) {
  // to help user to understand rotations
  await wait(0);
  $elem.style.transform = `rotate(${deg}deg)`;
}

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

function createPatternQuestionMark({ svgFrame = svgFrames.circle }) {
  const $pattern = createPatternRotationalBase({ svgFrame });

  $pattern.classList.add("pattern-question-mark");

  // todo(vmyshko): add ?

  return $pattern;
}

function createPatternRotational({
  figs = [],
  onlyUniqueFigs = false, // [2 and more]
  canOverlap = true, // [2 and more] figs can overlap each other - have same deg
  svgFrame = svgFrames.circle,
}) {
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
            genFn: () => pickRandom(pickFrom),
          })
        : pickRandom(pickFrom);

      $use.href.baseVal = currentFig;

      $partContainer.appendChild($svg);
    } catch (error) {
      console.warn(error);
    }
  });

  return $pattern;
}

function displayRotationalQuestion({ config, seed = 0 }) {
  const {
    //
    rowsNum,
    colsNum,
    //
    mtxDegs,
    answersDegs,
    // todo(vmyshko): how to understand which answer is correct,
    // ...when elems were made?
    correctDegs,
  } = generateRotationalQuestion({ config, seed });

  // todo(vmyshko): those who can't overlap -- rotate as pair

  const patterns = [];

  const $basePattern = createPatternRotational(config);
  const shuffledDefaultColors = shuffle(defaultColors);

  for (let row = 0; row < rowsNum; row++) {
    // row

    // coloring logic here
    config.figs.forEach((fig) => {
      if (!fig.colorsFrom) {
        fig.colorsFrom = shuffledDefaultColors;
      }
    });

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
        const colors = config.figs[partIndex].colorsFrom;

        // todo(vmyshko): apply rule? color?
        $part.classList.add(colors[partIndex]);

        const currentDeg = mtxDegs[row][col][partIndex];
        rotateTo($part, currentDeg);
      });

      patterns.push($pattern);
    } //col
  } //row

  $patternArea.replaceChildren(...patterns);

  // replace last pattern with ? and move it to answers
  const $correctAnswerPattern = patterns.at(-1);

  const $patternQuestionMark = createPatternQuestionMark({
    svgFrame: config.svgFrame,
  });

  //new,old
  $patternArea.replaceChild($patternQuestionMark, $correctAnswerPattern);

  // *******
  // ANSWERS
  // *******

  const answerPatterns = [$correctAnswerPattern];

  for (let currentDegs of answersDegs) {
    const $pattern = $basePattern.cloneNode(true);

    // get parts
    const parts = [...$pattern.querySelectorAll(".rotational-part")];

    parts.forEach(($part, index) => {
      const colors = config.figs[index].colorsFrom;
      // todo(vmyshko): apply rule? color?
      $part.classList.add(colors[index]);

      rotateTo($part, currentDegs[index]);
    });

    answerPatterns.push($pattern);
  }

  wrapAnswers({
    $answerList,
    answerPatterns,
    $tmplAnswer,
  });

  preventSvgCache();
}

// question buttons

function questionButtonClick($currentButton) {
  const questionButtons = [
    ...$questionList.querySelectorAll(".question-button"),
  ];
  questionButtons.forEach(($button) => {
    $button.classList.remove("selected");
  });

  $currentButton.classList.add("selected");

  // todo(vmyshko): load question
}

function addQuestionButton(callbackFn = () => void 0) {
  const questionButtons = [
    ...$questionList.querySelectorAll(".question-button"),
  ];

  const questionButtonTmpl = $tmplQuestionButton.content.cloneNode(true); //fragment
  const $questionButton = questionButtonTmpl.firstElementChild;

  $questionButton.textContent = questionButtons.length + 1;
  $questionList.appendChild($questionButton);

  $questionButton.addEventListener("click", () => {
    questionButtonClick($questionButton);
    callbackFn($questionButton);
  });
}

{
  // basic question list init
  // todo(vmyshko): add seed for each q
  const seed = 1;
  // todo(vmyshko): save answers between buttons

  // Object.entries(genConfigs);

  const questionTypes = [
    "oneQuarter90", //1
    "oneFig90", //1

    "letters45", //1.2
    "oneQuarter45", //1.2
    "oneFig45", //1.2

    "pentagon", //1.25
    "hexagonCircle", //1.25
    "hexagonSector1", //1.25

    "twoQuarters90", //2
    "quarterFig90", //2
    "hexagonSector2", //2.1

    "twoQuarters45", //2.2
    "clock4590", //2.2
    "twoArrowClock", //2.2

    "clock459090", //3
    "hexagonSector3", //3
    "triadSector", //3

    "threeQuarters", //3.2 hard

    "quarterFigs15mensa", //???
  ];

  questionTypes.forEach((configName) => {
    addQuestionButton(() => {
      const config = genConfigs[configName];
      console.log("🔮", configName);
      displayRotationalQuestion({ config, seed: Math.random() });
    });
  });

  $questionList.firstElementChild.click();
}
