export function pickRandom(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

export function spliceRandom(array) {
  const randomIndex = Math.floor(Math.random() * array.length);

  return array.splice(randomIndex, 1)[0];
}

export function fromRange(min, max) {
  const randomIndex = Math.floor(min + Math.random() * (max - min + 1));
  return randomIndex;
}
