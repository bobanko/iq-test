import { firebaseConfig } from "./firebase.config.js";
import { getAnalytics, getFirestore, initializeApp } from "./firebase.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
