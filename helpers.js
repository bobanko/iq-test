export function pickRandom(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

export function fromRange(min, max) {
  const randomIndex = Math.floor(min + Math.random() * (max - min + 1));
  return randomIndex;
}
