import { wrapAnswers } from "./common.js";
import { fromRange, pickRandom } from "./helpers.js";

// ---------

function generateEquation() {
  // @ -- operator

  // Q - question var

  // x @ y = z
  // [x|z] @ c = y
  // z = [y|x] @ Q

  // steps:
  // gen

  // x = y * 2
  // z - x = y
  // z = y * Q

  // z - y*2 = y
  // y*3 - y*2 = y

  // y*5 - y*3 = y

  //   last
  // x = y @ z

  // 1 2 3 4 5 6 7 8 9 // 10

  // 2*2=4
  // 2*3=6
  // 2*4=8
  // 3*3=9

  // 9=3*3   //3
  // 8=2*2*2 // 2,4
  // 7=//
  // 6=4*2   //2,3
  // 5=//
  // 4=2*2   //2
  // 3=//
  // 2=//
  // 1=//

  //   umnojabelnie pari - 1-4

  // ------

  // multis
  //   m1= fromRange(1,4)
  //   m2= fromRange(1,4)

  // rules
  // if c == 1, then no multi for c
  // if x,y,z == 1 then can multi (probably)

  // at least 2 should be multi (1,2,3,4)
  // c can't be 1

  // how-to:
  // x - y = z -- just sort desc
  // x = y * z -- use multi, get x as result
  // x + y = z -- sort asc
  //

  console.log("generate formulas:");
  const formulas = [];

  const mulResult = [4, 6, 8, 9];

  const multipliers = [2, 3, 4];
  const mulParts = {
    [4]: [2, 2],
    [6]: [2, 3],
    [8]: [2, 4],
    [9]: [3, 3],
  };

  const x = fromRange(1, 4); // smallest
  const y = fromRange(x + 1, 9 - x); // second

  // formula #1
  // z
  let z;

  // todo(vmyshko): calc probabilities, increase prob of mul?
  const useMulForZ = pickRandom([true, false]);
  // multi for z is possible and 50% chance fired

  if (mulResult.includes(x * y) && ![x, y].includes(1) && useMulForZ) {
    // use multi
    z = x * y;
    console.log(`x * y = z; ${x} * ${y} = ${z}; 🈴 * 🛜 = ✅;`);

    formulas.push("x * y = z");
  } else {
    // use sum
    z = x + y;
    console.log(`x + y = z; ${x} + ${y} = ${z}; 🈴 + 🛜 = ✅;`);
    formulas.push("x + y = z");
  }

  // formula #2
  // constant
  let c;

  // todo(vmyshko): use all pairs [x|y] [x|z] [y|z]

  // 2 + 6 = 8

  // from: x + y = z
  // y - x | y * x |
  // x + z |  z / x |
  // y + z | z / y -- not possible

  // todo(vmyshko): same for q
  // but add:
  // q + q | q * q
  // q + c | q * c | q - c

  // multi for c is possible and 50% chance fired
  if (Number.isInteger(y / x) && !useMulForZ) {
    // todo(vmyshko): add 50% prob
    //use multi
    c = y / x;
    console.log(`y = x * c; ${x} * ${c} = ${y}; 🈴 * ${c} = 🛜;`);
    formulas.push("x * c = y");
  } else {
    // use sum
    c = y - x;
    console.log(`x + c = y; ${x} + ${c} = ${y}; 🈴 + ${c} = 🛜;`);
    formulas.push("x + c = y");
  }

  // formula #3
  //   // q
  let q;
  // todo(vmyshko): add prob %
  if (Number.isInteger(z / x)) {
    //use multi
    q = z / x;
    console.log(`x * q = z; ${x} * ${q} = ${z}; 🈴 * ❓ = ✅`);
    formulas.push("x * q = z");
  }
  // prevent q === y case
  else if (z !== x + y) {
    // use sum
    q = z - x;
    console.log(`x + q = z; ${x} + ${q} = ${z}; 🈴 + ❓ = ✅`);
    formulas.push("x + q = z");
  } else {
    // custom case
    // different formula ops

    // can be: q @ c @ [x|y|z]
    q = z - c;
    console.log(`c + q = z; ${c} + ${q} = ${z}; ${c} + ❓ = ✅`);
    formulas.push("c + q = z");
    //OR
    // q+q / q*q
  }

  // log results

  console.log(`Q = ${q}`);

  return {
    formulas,
    x,
    y,
    z,
    c,
    q,
  };
}

function processEquation() {
  const { formulas, x, y, z, c, q } = generateEquation();
  const variables = {
    x,
    y,
    z,
    c,
    q,
  };

  const varColors = {
    x: "red",
    y: "blue",
    z: "green",
    c: "yellow",
    q: "gray",
  };

  $questionBlock.replaceChildren();

  for (let formula of formulas) {
    const parts = formula.split(" ");

    const fragment = $tmplQuestionRow.content.cloneNode(true); //fragment
    const $questionRow = fragment.firstElementChild;

    for (let part of parts) {
      const isVariable = "xyzcq".includes(part);
      const isOperator = "+-*=".includes(part);

      if (isVariable) {
        const fragment = $tmplQuestionPart.content.cloneNode(true); //fragment
        const $questionPart = fragment.firstElementChild;

        if (part === "c") {
          $questionPart.textContent = variables[part];
        } else if (part === "q") {
          $questionPart.textContent = "?";
        } else {
          //xyz
          //set color's first letter
          //   $questionPart.textContent = varColors[part][0];
          //skip
        }

        $questionPart.classList.add(varColors[part]);

        $questionRow.appendChild($questionPart);
      }

      if (isOperator) {
        const fragment = $tmplQuestionOperator.content.cloneNode(true); //fragment
        const $questionOperator = fragment.firstElementChild;

        $questionOperator.textContent = part;

        $questionRow.appendChild($questionOperator);
      }
    }

    $questionBlock.appendChild($questionRow);
  }

  // add answers

  const possibleAnswers = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  possibleAnswers.delete(q);

  const actualAnswers = [q];

  for (let i = 0; i < 5; i++) {
    const answer = pickRandom([...possibleAnswers]);

    possibleAnswers.delete(answer);
    actualAnswers.push(answer);
  }

  actualAnswers.sort((a, b) => a - b);

  console.log(actualAnswers);

  const answerQuestions = actualAnswers.map((answerText) => {
    const fragment = $tmplQuestionPart.content.cloneNode(true); //fragment
    const $questionPart = fragment.firstElementChild;

    $questionPart.textContent = answerText;
    $questionPart.classList.add(varColors["q"]);

    return $questionPart;
  });

  wrapAnswers({
    $answerBlock,
    $tmplAnswer,
    answerQuestions,
    $correctAnswerQuestion: answerQuestions[0],
  });
}

$btnGenerate.addEventListener("click", processEquation);

processEquation();
