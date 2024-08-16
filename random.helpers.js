import { seededRandom } from "./seeded-random.js";

export function setRandomSeed(seed = 1) {
  window.random = seededRandom(seed);

  // todo(vmyshko): to fig rng first pseudo random results
  window.random();
  window.random();
  window.random();
}

function random() {
  return window.random();
}

export function pickRandom(array) {
  const randomIndex = Math.floor(random() * array.length);
  return array[randomIndex];
}

export function spliceRandom(array) {
  const randomIndex = Math.floor(random() * array.length);

  return array.splice(randomIndex, 1)[0];
}

export function shuffle(array) {
  const result = [...array];

  result.sort(() => 0.5 - random());

  return result;
}

export function fromRange(min, max) {
  const randomIndex = Math.floor(min + random() * (max - min + 1));
  return randomIndex;
}

//basic init
setRandomSeed();
