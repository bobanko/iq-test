import { collection, doc, serverTimestamp, setDoc } from "./firebase.js";
import { db } from "./firebase.init.js";
import { getCurrentUser } from "./auth.js";

export async function saveQuizResults({ quizResults, seed, stats }) {
  // set

  const user = await getCurrentUser();

  const quizResultRef = doc(collection(db, "quiz-results"));

  await setDoc(quizResultRef, {
    _userId: user.uid,
    datePassed: serverTimestamp(),

    seed,
    stats, //answered,correct,wrong iq etc...
    // to keep it at the end in firebase doc
    zAnswers: quizResults,
  });

  console.log("quizResultRef written with ID: ", quizResultRef.id);

  return quizResultRef.id;
}
