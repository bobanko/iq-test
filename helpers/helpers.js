export { SeededRandom } from "./random.helpers.js";

export function preventSvgCache(cacheKey = Date.now()) {
  // todo(vmyshko): debug: prevent svg cache
  [...document.querySelectorAll("use")].forEach(($use) => {
    const [url, hash] = $use.href.baseVal.split("#");
    $use.href.baseVal = `${url}?${cacheKey}#${hash}`;
  });
}

/**
 * returns letter by it's index 0,1,2 => a,b,c...
 * @param {number} index letter index, a is 0
 * @returns letter by index
 * @example getLetter(0) => 'a'
 * @example getLetter(2) => 'c'
 */
export function getLetter(index) {
  return String.fromCodePoint(index + 97);
}

export function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
