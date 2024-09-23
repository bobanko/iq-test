function createFormulaPattern({ value = "", color = "white", config }) {
  const $patternContainer =
    $tmplPatternFormula.content.firstElementChild.cloneNode(true);

  const classes = {
    operator: "pattern-formula-operator",
    operand: "pattern-formula-variable",
  };

  const operators = ["+", "-", "×", "÷", "="];

  const isOperator = operators.includes(value);

  $patternContainer.classList.add(
    isOperator ? classes.operator : classes.operand
  );

  $patternContainer.textContent = value;

  if (!isOperator) {
    $patternContainer.classList.add(color);
  }

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
