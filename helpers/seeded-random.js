export function getSeededRandom(rawSeed) {
  // Park-Miller LCG algorithm
  const m = 2 ** 32; // 2^32 modulus
  const a = 1664525; // multiplier
  const c = 1013904223; // increment

  let stateSeed = rawSeed || Math.floor(Math.random() * m);

  const randomFn = () => {
    stateSeed = (a * stateSeed + c) % m;
    return stateSeed / m;
  };

  // todo(vmyshko): for seed 0..1 do progrev
  // todo(vmyshko): to fig rng first pseudo random results
  randomFn(), randomFn(), randomFn(), randomFn(), randomFn();

  return randomFn;
}

// // Example usage:
// const seed = 123; // Seed for reproducibility
// const rng = getSeededRandom(seed);

// // Generate random numbers
// console.log(rng()); // First random number
// console.log(rng()); // Second random number
// console.log(rng()); //
