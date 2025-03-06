// ***
// todo(vmyshko): extract to helpers
export function updateHashParameter(key, value) {
  // Get current hash and remove the leading "#" symbol
  const hash = window.location.hash.substring(1);

  // Convert the hash string into an object of key-value pairs
  const params = new URLSearchParams(hash);

  // Update or add the specified parameter
  params.set(key, value);

  setHash(params.toString());
}

export function setHash(hash) {
  // Update the hash in the URL
  window.location.hash = hash;
}

export function getHash() {
  // Get the current hash and remove the leading "#" symbol
  const hash = window.location.hash.substring(1);

  return hash;
}

export function getHashParameter(key) {
  const hash = getHash();

  // Use URLSearchParams to parse the hash parameters
  const params = new URLSearchParams(hash);

  // Return the value of the specified parameter
  return params.get(key);
}
