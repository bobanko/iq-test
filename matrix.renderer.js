import { getPointFlatIndex } from "./movable-matrix.generator.js";

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

  for (let point of points) {
    const flatIndex = getPointFlatIndex({ point, mtxSize });

    $patternMatrix.children[flatIndex].classList.add(point.color);
  }

  return $patternMatrix;
}

// todo(vmyshko): this should be used to render any matrix, not only movable
export function renderMovableQuestion({ config, questionData, questionIndex }) {
  const { patternsInRow, mtxSize, patternsInCol, patterns, answers, seed } =
    questionData;

  // todo(vmyshko): put replace with append for fast rendering
  $patternArea.replaceChildren(); //clear

  $patternArea.style.setProperty("--size", patternsInRow);

  {
    // 100 + 10 + 100 + 10 + 100 + 10
    const targetWidth = 340; //px - total width that we want to get
    const maxPatternSize = 100;
    const outerBorder = 10 * 2; //px
    const gaps = 10 * (patternsInRow - 1);
    const patternSize = (targetWidth - outerBorder - gaps) / patternsInRow;
    $patternArea.style.setProperty(
      "--pattern-size",
      `${Math.min(patternSize, maxPatternSize)}px`
    );
  }
  //

  patterns.forEach(({ points, id }) => {
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

  // todo(vmyshko): it should return question patterns too
  return answerPatterns;
}
