import { collection, doc, serverTimestamp, setDoc } from "./firebase.js";
import { db } from "./firebase.init.js";
import { getCurrentUser } from "./auth.js";

export async function saveFeedback(payload = {}) {
  const user = await getCurrentUser();

  const feedbackRef = doc(collection(db, "feedback"));

  const userId = user?.uid ?? null;
  const userRef = userId ? doc(db, "user-data", userId) : null;

  await setDoc(feedbackRef, {
    _userId: userId,
    userRef,
    createdAt: serverTimestamp(),
    ...payload,
  });

  console.log("feedback written with ID:", feedbackRef.id);
  return feedbackRef.id;
}
