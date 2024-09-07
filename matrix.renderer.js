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
export function renderMovableQuestion({ config, questionData, questionIndex }) {
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

  return answerPatterns;
}
