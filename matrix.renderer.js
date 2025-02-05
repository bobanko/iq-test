import { createQuestionMark } from "./common.renderer.js";

function getPointFlatIndex({ point, mtxSize }) {
  return point.row * mtxSize + point.col;
}

function createPaintedMatrix({ points = [], mtxSize }) {
  const $patternMatrix =
    $tmplPatternMatrix.content.firstElementChild.cloneNode(true);

  $patternMatrix.style.setProperty("--size", mtxSize);

  Array(mtxSize ** 2)
    .fill(null)
    .forEach((_) => {
      const $matrixCell =
        $tmplMatrixCell.content.firstElementChild.cloneNode(true);

      $patternMatrix.appendChild($matrixCell);
    });

  // todo(vmyshko): check for same colors in one cell

  //inset 0px 0px 0px 3px gold,
  // inset 0px 0px 0px 5px black,
  //  inset 0px 0px 0px 9px #00bc62,
  // inset 0px 0px 0px 11px black
  for (let point of points) {
    const flatIndex = getPointFlatIndex({ point, mtxSize });

    const $cell = $patternMatrix.children[flatIndex];

    $cell.style.setProperty("--color", point.color);

    if (point.icon) {
      $cell.textContent = point.icon;
    }
  }

  return $patternMatrix;
}

export function renderMatrixQuestion({ config, questionData, questionIndex }) {
  const { mtxSize, patterns, answers } = questionData;

  const questionPatterns = patterns.map((pattern) =>
    pattern
      ? createPaintedMatrix({ points: pattern.points, mtxSize })
      : createQuestionMark()
  );

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

  return { questionPatterns, answerPatterns };
}
