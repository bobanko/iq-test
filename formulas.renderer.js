function createFormulaPattern({ value = "", type, color = "white", config }) {
  const $patternContainer =
    $tmplPatternFormula.content.firstElementChild.cloneNode(true);

  const classes = {
    ["op"]: "pattern-formula-operator",
    ["value"]: "pattern-formula-value",
    ["var"]: "pattern-formula-variable",
  };

  $patternContainer.classList.add(classes[type] ?? "value");

  $patternContainer.textContent = value;
  $patternContainer.classList.add(color);

  return $patternContainer;
}

export function renderFormulasQuestion({ config, questionData }) {
  const { patterns, answers } = questionData;

  const questionPatterns = patterns.map((pattern) => {
    return createFormulaPattern({ ...pattern, config });
  });

  const answerPatterns = answers.map((pattern) => {
    const { id, isCorrect } = pattern;
    return {
      $pattern: createFormulaPattern({ ...pattern, config }),
      id,
      isCorrect,
    };
  });

  const $patternQuestionMark = createFormulaPattern({
    type: "value",
    config,
    //
  });

  $patternQuestionMark.classList.add("pattern-question-mark");

  return {
    questionPatterns,
    $questionMark: $patternQuestionMark,
    answerPatterns,
  };
}
