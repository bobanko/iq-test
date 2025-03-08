export { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
export { getAnalytics } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js";
export {
  getFirestore,
  query,
  where,
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
  getCountFromServer,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

export {
  getAuth,
  signInAnonymously,
  updateProfile,
  updateEmail,
  signInWithPopup,
  GoogleAuthProvider,
  //   EmailAuthProvider,
  linkWithCredential,
  linkWithRedirect,
  linkWithPopup,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
