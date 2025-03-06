export function seededRandom(seed) {
  // Park-Miller LCG algorithm
  let m = 4294967296; // 2^32
  let a = 1664525;
  let c = 1013904223;
  let z = seed || Math.floor(Math.random() * m);

  return () => {
    z = (a * z + c) % m;
    return z / m;
  };
}

// // Example usage:
// const seed = 123; // Seed for reproducibility
// const rng = seededRandom(seed);

// // Generate random numbers
// console.log(rng()); // First random number
// console.log(rng()); // Second random number
// console.log(rng()); //
