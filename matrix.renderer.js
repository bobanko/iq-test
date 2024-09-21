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

  for (let point of points) {
    const flatIndex = getPointFlatIndex({ point, mtxSize });

    $patternMatrix.children[flatIndex].classList.add(point.color);
  }

  return $patternMatrix;
}

export function renderMatrixQuestion({ config, questionData, questionIndex }) {
  const { patternsInRow, mtxSize, patterns, answers } = questionData;

  // todo(vmyshko): remove from renderer?
  {
    // todo(vmyshko): extract this to common, cause other question-types should reset this
    // 100 + 10 + 100 + 10 + 100 + 10
    const targetWidthPx = 340; //px - total width that we want to get
    const maxPatternSizePx = 100;
    const outerBorderPx = 10 * 2; //px
    const gapsPx = 10 * (patternsInRow - 1);
    const patternSizePx =
      (targetWidthPx - outerBorderPx - gapsPx) / patternsInRow;
    $patternArea.style.setProperty(
      "--pattern-size",
      `${Math.min(patternSizePx, maxPatternSizePx)}px`
    );
  }
  //

  const questionPatterns = patterns.map(({ points, id }) => {
    return createPaintedMatrix({ points, mtxSize });
    // todo(vmyshko): apply id
  });

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
