import { getAuth, signInAnonymously } from "./firebase.js";

export function getCurrentUser() {
  return getAuth().currentUser;
}

export function onAuthStateChanged(handler) {
  getAuth().onAuthStateChanged(handler);
}

export async function signAnonUser() {
  const auth = getAuth();

  try {
    const { user } = await signInAnonymously(auth);

    // Signed in..
    console.log("signed anon", user);

    return user;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ...

    console.log(errorMessage, errorCode);
    return null;
  }
}
