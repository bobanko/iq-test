import { SeededRandom } from "./random.helpers.js";

function createFormulaPattern({
  value = "",
  label = null,
  color = "white",
  seed,
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

  const emojiSets = [
    ["🐸", "🐹", "🦊"],
    ["🍩", "🍆", "🍑"], //food#1
    ["🥦", "🌽", "🥕"],
    ["🍉", "🍒", "🫐"],

    // todo(vmyshko): pick better animals
    // ["🐖", "🐘", "🐙"], //animals#1
    // ["🐓", "🦀", "🐻"], //animals#2
    // ["🦒", "🐧", "🦉"], //animals#3

    //random sets
    // ["👾", "🐞", "🌚"],
    // ["🐷", "🍄", "🤖"],
  ];

  const random = new SeededRandom(seed);

  const emojiSet = random.sample(emojiSets);

  if (!isOperator) {
    $patternContainer.textContent = isVar
      ? emojiSet["xyz".indexOf(label)]
      : value;
  } else {
    $patternContainer.textContent = value;
  }

  if (!isOperator) {
    $patternContainer.classList.add(color);
  }

  return $patternContainer;
}

export function renderFormulasEmojiQuestion({ config, questionData }) {
  const { patterns, answers, seed } = questionData;

  const questionPatterns = patterns.map((pattern) => {
    return createFormulaPattern({ ...pattern, seed, config });
  });

  const answerPatterns = answers.map((pattern) => {
    const { id, isCorrect } = pattern;
    return {
      $pattern: createFormulaPattern({ ...pattern, seed, config }),
      id,
      isCorrect,
    };
  });

  const $patternQuestionMark = createFormulaPattern({
    seed,
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
