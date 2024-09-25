const emojiSets = [
  ["🐖", "🐘", "🐙"], //animals#1
  ["🐓", "🦀", "🐻"], //animals#2
  ["🦒", "🐧", "🦉"], //animals#3
];

function createFormulaPattern({
  value = "",
  label = null,
  color = "white",
  config,
}) {
  const $patternContainer =
    $tmplPatternFormula.content.firstElementChild.cloneNode(true);

  const classes = {
    operator: "pattern-formula-operator",
    var: "pattern-formula-variable-emoji",
    const: "pattern-formula-const",
  };

  const operators = ["+", "-", "×", "÷", "="];

  const isOperator = operators.includes(value);
  const isVar = label != null;

  $patternContainer.classList.add(
    isOperator ? classes.operator : isVar ? classes.var : classes.const
  );

  const emojis = ["🍆", "🦀", "👾", "🐞", "🐷", "🐸", "🐹", "🦊", "🌚", "🍄"];

  if (!isOperator) {
    $patternContainer.textContent = isVar ? emojis[value] : value;
  } else {
    $patternContainer.textContent = value;
  }

  if (!isOperator) {
    $patternContainer.classList.add(color);
  }

  return $patternContainer;
}

export function renderFormulasEmojiQuestion({ config, questionData }) {
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
  });

  $patternQuestionMark.classList.add("pattern-question-mark");

  return {
    questionPatterns,
    $questionMark: $patternQuestionMark,
    answerPatterns,
  };
}
