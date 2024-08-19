import { seededRandom } from "./seeded-random.js";

export class SeededRandom {
  random;
  constructor(seed) {
    this.random = seededRandom(seed);

    // todo(vmyshko): to fig rng first pseudo random results
    this.random(), this.random(), this.random(), this.random(), this.random();
  }

  /**
   *
   * @param {Array} array collection to pick from
   * @returns random element from collection
   */
  sample(array) {
    const { random } = this;
    const randomIndex = Math.floor(random() * array.length);
    return array[randomIndex];
  }

  popFrom(array) {
    const { random } = this;
    const randomIndex = Math.floor(random() * array.length);

    return array.splice(randomIndex, 1)[0];
  }

  shuffle(array) {
    const { random } = this;

    const result = [...array];

    result.sort(() => 0.5 - random());

    return result;
  }

  fromRange(min, max) {
    const { random } = this;

    const randomIndex = Math.floor(min + random() * (max - min + 1));
    return randomIndex;
  }
}
