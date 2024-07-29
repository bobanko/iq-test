// questions

import { wrapAnswers } from "./common.js";
import {
  fromRange,
  pickRandom,
  preventSvgCache,
  shuffle,
  wait,
} from "./helpers.js";
import { defaultColors, genConfigs, svgFrames } from "./rotational.config.js";

async function rotateTo($elem, deg) {
  // to help user to understand rotations
  await wait(0);
  $elem.style.transform = `rotate(${deg}deg)`;
}

function getRandomDeg({ stepDeg = 45, skipZero = false } = {}) {
  if (stepDeg === 0) return 0;
  const randomDeg = fromRange(skipZero ? 1 : 0, 360 / stepDeg - 1) * stepDeg;

  if (isNaN(randomDeg)) throw Error("getRandomDeg: bad args");

  return normalizeDeg(randomDeg);
}

function normalizeDeg(deg) {
  return deg % 360;
}

// todo(vmyshko): gen answers/anything!
// todo(vmyshko): refac to have genFn and uniqueCheckFn only
function makeUnique({
  genFn,
  prevValuesSet,
  serializeFn = (value) => value.toString(),
}) {
  const maxLoopCount = 100;
  let loopCount = 0;
  do {
    const uniqueValue = genFn();

    const serializedValue = serializeFn(uniqueValue);
    if (!prevValuesSet.has(serializedValue)) {
      prevValuesSet.add(serializedValue);
      return uniqueValue;
    }

    loopCount++;
  } while (loopCount < maxLoopCount);

  throw Error(
    `makeUnique: generation attempts reached ${loopCount}. aborting...`
  );
}

function createQuestionRotational({
  figs = [],
  onlyUniqueFigs = false, // [2 and more]
  canOverlap = true, // [2 and more] figs can overlap each other - have same deg
  svgFrame = svgFrames.circle,
}) {
  // todo(vmyshko): make proper z-indexes for figs somehow?

  const questionTmpl = $tmplQuestionRotational.content.cloneNode(true); //fragment
  const $question = questionTmpl.firstElementChild;

  // todo(vmyshko): impl custom frame
  const $partContainer = $question.querySelector(".part-container");

  $partContainer.style.mask = `url(${svgFrame})`;

  // apply bg and border
  $question.querySelector(".frame-fill>use").href.baseVal = svgFrame;
  $question.querySelector(".frame-stroke>use").href.baseVal = svgFrame;

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

  return $question;
}

let lastConfig = null;
function generateRotationalQuiz(config = lastConfig) {
  lastConfig = config;
  // shuffle colors for new quiz
  defaultColors.splice(0, defaultColors.length, ...shuffle(defaultColors));

  const rowsNum = 3;
  const colsNum = 3;

  // todo(vmyshko): those who can't overlap -- rotate as pair

  // gen rules
  // todo(vmyshko): make unique rules, no dupes
  // todo(vmyshko): impl currentGenConfig.noOverlap
  const rules = config.figs.map((fig) =>
    getRandomDeg({ skipZero: fig.skipZero, stepDeg: fig.stepDeg })
  );

  // todo(vmyshko): maybe make different question types here:
  // arrow and circle
  // quarters (multiple)
  // quarters + circle + square

  console.log("rules", rules);

  const correctDegs = [];

  const questionElements = [];
  const deltaDegs = [];
  const $baseQuestion = createQuestionRotational(config);
  for (let row = 0; row < rowsNum; row++) {
    // row

    // todo(vmyshko): make this for each fig

    // make unique basic delta deg

    const rowDeltaDegs = makeUnique({
      genFn: () => {
        const _rowDeltaDegs = [];

        for (let fig of config.figs) {
          const randomDeg = makeUnique({
            genFn: () =>
              getRandomDeg({
                stepDeg: fig.stepDeg,
                // no skip, cause it's initial pos
                skipZero: false,
              }),
            prevValuesSet: new Set(_rowDeltaDegs),
          });

          _rowDeltaDegs.push(randomDeg);
        }

        return _rowDeltaDegs;
      },
      //flatten inner arrays
      prevValuesSet: new Set(deltaDegs.map((dd) => dd.toString())),
    });

    deltaDegs.push(rowDeltaDegs);

    // shuffle colors for new quiz
    defaultColors.splice(0, defaultColors.length, ...shuffle(defaultColors));

    config.figs.forEach((fig) => {
      fig.colorsFrom?.splice(
        0,
        fig.colorsFrom.length,
        ...shuffle(fig.colorsFrom)
      );
    });

    if (config.shiftColorsBetweenRows) {
      defaultColors.push(defaultColors.shift());

      config.figs.forEach((fig) => {
        fig.colorsFrom?.push(fig.colorsFrom.shift());
      });
    }

    if (config.shiftFigsBetweenRows) {
      console.log("not implemented");
      // todo(vmyshko): impl, but how?
    }

    for (let col = 0; col < colsNum; col++) {
      const $question = $baseQuestion.cloneNode(true);

      // get parts
      const parts = [...$question.querySelectorAll(".rotational-part")];

      parts.forEach(($part, index) => {
        // todo(vmyshko): shuffle colors between
        const colors = config.figs[index].colorsFrom ?? [...defaultColors];

        // todo(vmyshko): apply rule? color?
        $part.classList.add(colors[index]);

        // todo(vmyshko): grab last question degs as answer degs
        const currentDeg = normalizeDeg(
          config.figs[index].startDeg +
            deltaDegs[row][index] +
            rules[index] * col
        );

        rotateTo($part, currentDeg);

        if (row === 2 && col == 2) {
          //last question -- correct
          correctDegs.push(currentDeg);
        }
      });

      questionElements.push($question);
    } //col
  } //row

  $questionBlock.replaceChildren(...questionElements);

  // const oldEls = [...$questionBlock.children];
  // questionElements.forEach(async (elem, index) => {
  //   const oldEl = oldEls[index];

  //   // todo(vmyshko): make animation here
  //   if (oldEl) {
  //     // await oldEl.animate([{}, { opacity: "0", transform: "scale(0)" }], {
  //     //   duration: 200,
  //     //   iterations: 1,
  //     //   easing: "ease-in-out",
  //     // }).finished;

  //     oldEl.remove();
  //   }

  //   $questionBlock.appendChild(elem);

  //   // elem.animate([{ opacity: "0", transform: "scale(0)" }, {}], {
  //   //   duration: 200,
  //   //   iterations: 1,
  //   //   easing: "ease-in-out",
  //   // });
  // });

  console.log("deltaDegs", deltaDegs);
  console.log("correctDegs", correctDegs);

  // replace last question with ? and move it to answers
  const $correctAnswerQuestion = questionElements.at(-1);

  const questionMarkTmpl = $tmplQuestionMark.content.cloneNode(true); //fragment
  const $questionMark = questionMarkTmpl.firstElementChild;
  //new,old
  $questionBlock.replaceChild($questionMark, $correctAnswerQuestion);

  // *******
  // ANSWERS
  // *******

  const answerQuestions = [$correctAnswerQuestion];
  const usedDegsSet = new Set([correctDegs.toString()]);
  for (let answerIndex = 1; answerIndex < 6; answerIndex++) {
    // question

    const $question = $baseQuestion.cloneNode(true);

    // get parts
    const parts = [...$question.querySelectorAll(".rotational-part")];

    try {
      let whileCount = 0;
      do {
        whileCount++;
        if (whileCount > 100) {
          throw Error("possible infinite loop");
        }
        const currentDegs = makeUnique({
          genFn: () =>
            parts.map((_, index) =>
              normalizeDeg(
                correctDegs[index] +
                  getRandomDeg({
                    stepDeg: config.figs[index].stepDeg,
                    skipZero: false,
                  })
              )
            ),
          prevValuesSet: usedDegsSet,
        });

        if (
          config.noOverlap &&
          currentDegs.length !== new Set(currentDegs).size
        ) {
          console.log("overlap degs", currentDegs);
          continue;
        }

        parts.forEach(($part, index) => {
          const colors = config.figs[index].colorsFrom ?? [...defaultColors];
          // todo(vmyshko): apply rule? color?
          $part.classList.add(colors[index]);

          rotateTo($part, currentDegs[index]);
        });

        answerQuestions.push($question);

        break;
      } while (config.noOverlap);
    } catch (error) {
      console.warn(error);
    }
  }

  wrapAnswers({
    $answerBlock,
    answerQuestions,
    $tmplAnswer,
    $correctAnswerQuestion,
  });

  preventSvgCache();
}

$btnGenerate.addEventListener("click", () => generateRotationalQuiz());

// generateRotationalQuiz();

// init config options
Object.entries(genConfigs).map(([key, value]) => {
  const $option = document.createElement("option");

  $option.value = key;
  $option.textContent = key;

  $selectConfig.appendChild($option);
});

$selectConfig.addEventListener("change", (event) => {
  const configName = event.target.value;

  generateRotationalQuiz(genConfigs[configName]);
});

$selectConfig.dispatchEvent(new Event("change"));
