import { firebaseConfig } from "./firebase.config.js";
import {
  getAnalytics,
  getAuth,
  getFirestore,
  initializeApp,
  signInAnonymously,
  updateProfile,
} from "./firebase.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// functions

// todo(vmyshko): extract api/endpoints

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

export function updateUserData(userData) {
  const { displayName, email } = userData;

  const auth = getAuth();

  return updateProfile(auth.currentUser, {
    displayName,
    email,
  })
    .then(() => {
      // Profile updated!
      // ...
      console.log("user profile updated");
    })
    .catch((error) => {
      // An error occurred
      // ...
      console.error("user profile update error", error);
    });
}
