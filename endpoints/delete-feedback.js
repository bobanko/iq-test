import { doc, deleteDoc } from "./firebase.js";
import { db } from "./firebase.init.js";

export async function deleteFeedback(feedbackId) {
  if (!feedbackId) throw new Error("No feedbackId provided");
  await deleteDoc(doc(db, "feedback", feedbackId));
}
