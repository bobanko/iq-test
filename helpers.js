export { SeededRandom } from "./random.helpers.js";

export function preventSvgCache() {
  // todo(vmyshko): debug: prevent svg cache
  [...document.querySelectorAll("use")].forEach((use) => {
    const [url, hash] = use.href.baseVal.split("#");
    use.href.baseVal = `${url}?${Date.now()}#${hash}`;
  });
}

export function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
