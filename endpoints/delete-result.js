import { doc, deleteDoc } from "./firebase.js";
import { db } from "./firebase.init.js";

export async function deleteResult(resultId) {
  if (!resultId) throw new Error("No resultId provided");
  await deleteDoc(doc(db, "quiz-results", resultId));
}
