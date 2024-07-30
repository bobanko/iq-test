import { shuffle } from "./helpers.js";

export function wrapAnswers({
  $answerList,
  $tmplAnswer,
  answerPatterns,
  $correctAnswerPattern,
}) {
  // wrap answers
  const answerLetters = "abcdef";

  $answerList.replaceChildren();
  for (let [index, $pattern] of shuffle(answerPatterns).entries()) {
    // answer
    const fragment = $tmplAnswer.content.cloneNode(true); //fragment
    const $answer = fragment.firstElementChild;

    const $answerLetter = $answer.querySelector(".answer-letter");
    $answerLetter.textContent = answerLetters[index];

    $answer.appendChild($pattern);
    $answer.addEventListener("click", () =>
      toggleAnswerSelect({ $answer, $answerList })
    );

    $answerList.appendChild($answer);

    if ($pattern === $correctAnswerPattern) {
      console.log({ answerLetter: answerLetters[index] });
    }
  }

  // todo(vmyshko): return correct answer letter?
}

function toggleAnswerSelect({ $answer, $answerList }) {
  $answerList
    .querySelectorAll(".answer")
    .forEach(($answer) => $answer.classList.remove("selected"));

  $answer.classList.add("selected");
}
