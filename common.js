import { SeededRandom } from "./helpers.js";

// todo(vmyshko): make it reusable, and more hashy
export const getUid = (() => {
  let _id = 0;

  return () => `${_id++}`;
})();

export function wrapAnswerPattern({ $tmplAnswer, $pattern, letter = "x" }) {
  const fragment = $tmplAnswer.content.cloneNode(true); //fragment
  const $answer = fragment.firstElementChild;

  const $answerLetter = $answer.querySelector(".answer-letter");
  $answerLetter.textContent = letter;

  $answer.appendChild($pattern);

  return $answer;
}

/**
 * @deprecated use wrapAnswerPattern instead
 */
export function wrapAnswers({
  $answerList,
  $tmplAnswer,
  answerPatterns,
  answerCallbackFn = () => void 0,
}) {
  // todo(vmyshko): why?
  console.warn("@deprecated use wrapAnswerPattern instead");
  // wrap answers
  const answerLetters = "abcdef";

  const random = new SeededRandom(123);

  $answerList.replaceChildren();
  for (let [index, $pattern] of random.shuffle(answerPatterns).entries()) {
    // answer

    const $answer = wrapAnswerPattern({
      $tmplAnswer,
      $pattern,
      letter: answerLetters[index],
    });

    $answer.addEventListener("click", () => {
      toggleAnswerSelect({ $answer, $answerList });
      answerCallbackFn(index);
    });

    $answerList.appendChild($answer);
  }
}

export function toggleAnswerSelect({ $answer, $answerList }) {
  $answerList
    .querySelectorAll(".answer")
    .forEach(($answer) => $answer.classList.remove("selected"));

  $answer.classList.add("selected");
}
