export function stringToHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char; // Multiply by 31 and add char code
    hash = hash & hash; // Keep it 32-bit integer
  }
  return Math.abs(hash); // Ensure positive number
}
