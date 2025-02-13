export { SeededRandom } from "./random.helpers.js";

export function preventSvgCache() {
  // todo(vmyshko): debug: prevent svg cache
  [...document.querySelectorAll("use")].forEach((use) => {
    const [url, hash] = use.href.baseVal.split("#");
    use.href.baseVal = `${url}?${Date.now()}#${hash}`;
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

/**
 * if index goes out of range, it starts from beginning, and vise-versa
 * @param {Object} parameters
 * @param parameters.length total safe range length (from 0 to length)
 * @param parameters.index if index goes out
 * @returns safe index in range from 0 to length-1
 *
 * to check validity!
 * @example getSafeIndex({length: 5, index: 6}) => 1
 * @example getSafeIndex({length: 5, index: -2}) => 3
 */
export function getSafeIndex({ length, index }) {
  return (length + index) % length;
}
