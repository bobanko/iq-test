import { toggleAnswerSelect, wrapAnswerPattern } from "./common.js";
import { wait } from "./helpers.js";
import { SeededRandom } from "./random.helpers.js";

function createPaintedMatrix({ points = [], mtxSize }) {
  const patternTmpl = $tmplPatternMatrix.content.cloneNode(true); //fragment
  const $patternMatrix = patternTmpl.firstElementChild;

  $patternMatrix.style.setProperty("--size", mtxSize);

  Array(mtxSize ** 2)
    .fill(null)
    .forEach((_) => {
      const matrixCellTmpl = $tmplMatrixCell.content.cloneNode(true); //fragment
      const $matrixCell = matrixCellTmpl.firstElementChild;

      $patternMatrix.appendChild($matrixCell);
    });

  for (let { index, color } of points) {
    $patternMatrix.children[index].classList.add(color);
  }

  return $patternMatrix;
}

// todo(vmyshko): this should be used to render any matrix, not only movable
export function renderMovableQuestion({
  config,
  questionData,
  questionIndex,
  quizAnswers,
  updateProgressQuiz,
}) {
  //

  const { patternsInRow, mtxSize, patternsInCol, questions, answers, seed } =
    questionData;

  const random = new SeededRandom(seed + questionIndex);

  // todo(vmyshko): put replace with append for fast rendering
  $patternArea.replaceChildren(); //clear

  $patternArea.style.setProperty("--size", patternsInRow);

  //

  questions.forEach(({ points, id }) => {
    const $patternMatrix = createPaintedMatrix({ points, mtxSize });
    $patternArea.appendChild($patternMatrix);
    // todo(vmyshko): apply id
  });

  // replace last pattern with ? and move it to answers
  const $correctAnswerPattern = $patternArea.lastChild;

  const patternQuestionMarkTmpl =
    $tmplPatternQuestionMark.content.cloneNode(true); //fragment
  const $patternQuestionMark = patternQuestionMarkTmpl.firstElementChild;

  $patternQuestionMark.classList.add("pattern-matrix");
  //new,old
  $patternArea.replaceChild($patternQuestionMark, $correctAnswerPattern);

  // *******
  // ANSWERS
  // *******

  const answerPatterns = answers.map(({ points, id, isCorrect }) => {
    return {
      $pattern: createPaintedMatrix({ points, mtxSize }),
      id,
      isCorrect,
    };
  });

  // todo(vmyshko): below code copied from rotational.renderer -- refac and extract
  const answerLetters = "abcdef";
  $answerList.replaceChildren();

  // $correctAnswer -- answerPatterns[0]

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
}
