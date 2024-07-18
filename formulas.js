function pickRandom(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

function pickRandomOperation() {
  const operations = ["+", "-", "*"];
  return pickRandom(operations);
}

// todo(vmyshko): extract to helpers
function fromRange(min, max) {
  const randomIndex = Math.floor(min + Math.random() * (max - min + 1));
  return randomIndex;
}

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
  if (mulResult.includes(x * y) && useMulForZ) {
    // use multi
    z = x * y;
    formulas.push(`x * y = z; ${x} * ${y} = ${z}; 🈴 * 🛜 = ✅;`);
  } else {
    // use sum
    z = x + y;
    formulas.push(`x + y = z; ${x} + ${y} = ${z}; 🈴 + 🛜 = ✅;`);
  }

  // formula #2
  // constant
  let c;

  // multi for c is possible and 50% chance fired
  if (Number.isInteger(y / x) && !useMulForZ) {
    // todo(vmyshko): add 50% prob
    //use multi
    c = y / x;
    formulas.push(`y = x * c; ${x} * ${c} = ${y}; 🈴 * ${c} = 🛜;`);
  } else {
    // use sum
    c = y - x;
    formulas.push(`x + c = y; ${x} + ${c} = ${y}; 🈴 + ${c} = 🛜;`);
  }

  // formula #3
  //   // q
  let q;
  // todo(vmyshko): add prob %
  if (Number.isInteger(z / x)) {
    //use multi
    q = z / x;
    formulas.push(`x * q = z; ${x} * ${q} = ${z}; 🈴 * ❓ = ✅`);
  }
  // prevent q === y case
  else if (z !== x + y) {
    // use sum
    q = z - x;
    formulas.push(`x + q = z; ${x} + ${q} = ${z}; 🈴 + ❓ = ✅`);
  } else {
    // custom case
    // different formula ops

    // can be: q @ c @ [x|y|z]
    q = z - c;
    formulas.push(`c + q = z; ${c} + ${q} = ${z}; ${c} + ❓ = ✅`);
    //OR
    // q+q / q*q
  }

  // Вывод уравнений
  console.log("Сгенерированные уравнения:");
  for (let f of formulas) {
    console.log(f);
  }

  // Вывод значения Q, которое нужно угадать
  console.log(`Неизвестная, которую нужно угадать: Q = ${q}`);
}

$btnGenerate.addEventListener(
  "click",
  // Вызов функции для генерации уравнений
  generateEquation
);
