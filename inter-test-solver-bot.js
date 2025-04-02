// how-to-use:
// set preferred correctCount
// run in open console at https://international-iq-test.com/

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const answerIndexes = [
  5, 1, 0, 2, 3, 1, 5, 0, 3, 5, 5, 0, 4, 3, 1, 4, 3, 3, 3, 3, 1, 4, 2, 4, 4, 3,
  3, 0, 1, 4, 5, 2, 1, 2, 5, 5, 3, 1, 2, 5,
];

function getSelector(index) {
  return `.ans${index + 1}`;
}

const correctCount = 25;
const answerVariantsCount = 6;

let correctLeft = correctCount;
for (let currenAnswerIndex of answerIndexes) {
  if (correctLeft <= 0) {
    // make incorrect when all correct done
    currenAnswerIndex = (currenAnswerIndex + 1) % answerVariantsCount;
    console.log(`❌ IN-correct: ${currenAnswerIndex}`);
  } else {
    console.log(`✅ correct: ${currenAnswerIndex}`);
  }
  //
  const selector = `.ans${currenAnswerIndex + 1}`;

  document.querySelector(selector).children[1].click();
  console.log("selector", selector);
  correctLeft--;

  await wait(300);
}
