import { collection, doc, serverTimestamp, setDoc } from "./firebase.js";
import { db, getCurrentUser } from "./firebase.init.js";

export async function saveQuizResults({ quizData, stats }) {
  // set

  const { answers, seed } = quizData;

  const user = await getCurrentUser();

  const quizResultRef = doc(collection(db, "quiz-results"));

  await setDoc(quizResultRef, {
    userId: user.uid,
    datePassed: serverTimestamp(),

    seed,
    stats, //answered,correct,wrong iq etc...
    answers,
  });

  console.log("quizResultRef written with ID: ", quizResultRef.id);
}
