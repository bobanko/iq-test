function createValuePattern({ value = "", config }) {
  const { color = "black" } = config;

  const $patternContainer =
    $tmplPatternValue.content.firstElementChild.cloneNode(true);

  $patternContainer.textContent = value;
  $patternContainer.style.setProperty("--color", color);

  return $patternContainer;
}

export function renderValuesQuestion({ config, questionData }) {
  const { patterns, answers } = questionData;

  const questionPatterns = patterns.map(({ value, id }) => {
    return createValuePattern({ value, config });
  });

  const answerPatterns = answers.map(({ value, id, isCorrect }) => {
    return {
      $pattern: createValuePattern({ value, config }),
      id,
      isCorrect,
    };
  });

  return { questionPatterns, answerPatterns };
}
