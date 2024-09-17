function createValuePattern({ value = "", config }) {
  const { color = "black" } = config;

  // todo(vmyshko): is it ok to use svg as contaienr directly?
  const $patternContainer =
    $tmplPatternValue.content.firstElementChild.cloneNode(true); //fragment

  $patternContainer.textContent = value;
  $patternContainer.style.setProperty("--color", color);

  return $patternContainer;
}

export function renderValuesQuestion({ config, questionData }) {
  const { patternsInRow, patterns, answers } = questionData;

  // todo(vmyshko): put replace with append for fast rendering
  $patternArea.replaceChildren(); //clear
  $patternArea.style.setProperty("--size", patternsInRow);

  //

  patterns.forEach(({ value, id }) => {
    const $valuePattern = createValuePattern({ value, config });
    $patternArea.appendChild($valuePattern);
  });

  // todo(vmyshko): this should be done (once) outside for all renderers
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

  const answerPatterns = answers.map(({ value, id, isCorrect }) => {
    return {
      $pattern: createValuePattern({ value, config }),
      id,
      isCorrect,
    };
  });

  // todo(vmyshko): it should return question patterns too
  return answerPatterns;
}
