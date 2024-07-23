export function pickRandom(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

export function spliceRandom(array) {
  const randomIndex = Math.floor(Math.random() * array.length);

  return array.splice(randomIndex, 1)[0];
}

export function shuffle(array) {
  const result = [...array];

  result.sort(() => 0.5 - Math.random());

  return result;
}

export function fromRange(min, max) {
  const randomIndex = Math.floor(min + Math.random() * (max - min + 1));
  return randomIndex;
}

export function preventSvgCache() {
  // todo(vmyshko): debug: prevent svg cache
  [...document.querySelectorAll("use")].forEach((use) => {
    const [url, hash] = use.href.baseVal.split("#");
    use.href.baseVal = `${url}?${Date.now()}#${hash}`;
  });
}
