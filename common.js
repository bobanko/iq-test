import { shuffle } from "./helpers.js";

export function wrapAnswers({
  $answerBlock,
  $tmplAnswer,
  answerQuestions,
  $correctAnswerQuestion,
}) {
  // wrap answers
  const answerLetters = "abcdef";

  $answerBlock.replaceChildren();
  for (let [index, $question] of shuffle(answerQuestions).entries()) {
    // answer
    const fragment = $tmplAnswer.content.cloneNode(true); //fragment
    const $answer = fragment.firstElementChild;

    const $answerLetter = $answer.querySelector(".answer-letter");
    $answerLetter.textContent = answerLetters[index];

    $answer.appendChild($question);
    $answer.addEventListener("click", () =>
      toggleAnswerSelect({ $answer, $answerBlock })
    );

    $answerBlock.appendChild($answer);

    if ($question === $correctAnswerQuestion) {
      console.log({ answerLetter: answerLetters[index] });
    }
  }

  // todo(vmyshko): return correct answer letter?
}

function toggleAnswerSelect({ $answer, $answerBlock }) {
  $answerBlock
    .querySelectorAll(".answer")
    .forEach(($answer) => $answer.classList.remove("selected"));

  $answer.classList.add("selected");
}
