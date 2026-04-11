import { collection, getDocs, query, orderBy } from "./firebase.js";
import { db } from "./firebase.init.js";

export async function getAllFeedback() {
  const feedbackCol = collection(db, "feedback");
  const q = query(feedbackCol, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
