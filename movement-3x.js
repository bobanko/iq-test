function generateMatrixQuiz() {
  //1
  //2
  //3
  //
  // gen answers

  const answers = [1, 2, 3, 4, 5, 6];

  $answerBlock.replaceChildren(); //clear

  const answerLetters = "abcdef";
  let letterCount = 0;
  for (let answer of answers) {
    // answer wrapper
    const fragment = $tmplAnswer.content.cloneNode(true); //fragment
    const $answer = fragment.firstElementChild;

    const $answerLetter = $answer.querySelector(".answer-letter");
    $answerLetter.textContent = answerLetters[letterCount++];

    // question
    const questionTmpl = $tmplQuestionMatrix.content.cloneNode(true); //fragment
    const $questionMatrix = questionTmpl.firstElementChild;

    $answer.appendChild($questionMatrix);

    $answer.addEventListener("click", () => toggleAnswerSelect($answer));

    $answerBlock.appendChild($answer);
  }
}

$btnGenerate.addEventListener("click", generateMatrixQuiz);

generateMatrixQuiz();

function toggleAnswerSelect($newAnswer) {
  $answerBlock
    .querySelectorAll(".answer")
    .forEach(($answer) => $answer.classList.remove("selected"));

  $newAnswer.classList.add("selected");
}
