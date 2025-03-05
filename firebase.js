// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDB2Uf9Z8oyTQ3mvbktaxK8Ct8Gg3VOtV8",
  authDomain: "iq-test-c1b9f.firebaseapp.com",
  projectId: "iq-test-c1b9f",
  storageBucket: "iq-test-c1b9f.firebasestorage.app",
  messagingSenderId: "871445616761",
  appId: "1:871445616761:web:c4aeba30557b9774e91ca8",
  measurementId: "G-JBVTMMDW40",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
