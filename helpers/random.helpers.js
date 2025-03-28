import { getSeededRandom } from "./seeded-random.js";

export class SeededRandom {
  random;
  _seed;

  constructor(seed) {
    this._seed = seed;
    this.random = getSeededRandom(seed);
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

  /**
   * pops random element that meets condition
   * @param {array} array to pop from
   * @param {Function} conditionFn if return true - element will be popped out
   * @returns popped element that meets condition
   */
  popWhere(array, conditionFn) {
    const shuffledArray = this.shuffle(array);

    for (let attemptValue of shuffledArray) {
      if (conditionFn(attemptValue)) {
        const indexToDelete = array.indexOf(attemptValue);
        array.splice(indexToDelete, 1);

        return attemptValue;
      }
    }

    console.warn("no elements met condition", array);

    return null;
  }

  popRangeFrom(array, count) {
    const poppedItems = [];
    for (let i = 0; i < count && array.length > 0; i++) {
      poppedItems.push(this.popFrom(array));
    }

    return poppedItems;
  }

  shuffle(array) {
    const { random } = this;

    const result = [...array];
    // Fisher-Yates shuffle by grok
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]]; // Swap
    }

    return result;
  }

  fromRange(min, max) {
    const { random } = this;

    const randomIndex = Math.floor(min + random() * (max - min + 1));
    return randomIndex;
  }
}
