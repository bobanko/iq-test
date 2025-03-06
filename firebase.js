import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js";
import {
  getFirestore,
  query,
  orderBy,
  limit,
  collection,
  getDocs,
  getDoc,
  addDoc,
  doc,
  setDoc,
  Timestamp,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import {
  getAuth,
  signInAnonymously,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  //   EmailAuthProvider,
  linkWithCredential,
  linkWithRedirect,
  linkWithPopup,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

import { firebaseConfig } from "./configs/firebase.config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// functions

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
