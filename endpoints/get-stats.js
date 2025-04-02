import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  Timestamp,
  where,
} from "./firebase.js";

import { db } from "./firebase.init.js";

const quizResultsCol = collection(db, "quiz-results");

// todo(vmyshko): cache or/and put stats in separate table on server

export async function getResultsTotalCount() {
  //total
  const testsTotal = await getCountFromServer(quizResultsCol);
  return testsTotal.data().count;
}

export async function getResultsLast24hCount() {
  const tsOneDayAgo = Timestamp.fromDate(
    new Date(Date.now() - 24 * 60 * 60 * 1000)
  ); // last 24h

  const testsLast24h = await getCountFromServer(
    query(quizResultsCol, where("datePassed", ">=", tsOneDayAgo))
  );

  return testsLast24h.data().count;
}

export async function getResultsLast10() {
  const testResultsSnapshot = await getDocs(
    query(quizResultsCol, orderBy("datePassed", "desc"), limit(10))
  );

  const testResults = testResultsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const userIds = [...new Set(testResults.map((result) => result._userId))]; // Unique IDs

  const usersRef = collection(db, "user-data");
  const usersQuery = query(usersRef, where("__name__", "in", userIds));
  const usersSnapshot = await getDocs(usersQuery);
  const users = Object.fromEntries(
    usersSnapshot.docs.map((doc) => [doc.id, doc.data()])
  );

  const resultsWithUsers = testResults.map((result) => ({
    ...result,
    user: users[result._userId] || null, // Attach user data or null if missing
  }));

  return resultsWithUsers;
}

export function getRecentResultsInCountry(countryCode) {
  return getResultsLast10(); //stub
}

export async function getAllResults() {
  const resultsSnapshot = await getDocs(quizResultsCol);

  return resultsSnapshot.docs.map((doc) => doc.data());
}

export async function getResultById(id) {
  const docRef = doc(db, "quiz-results", id);

  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No such document!");
    throw Error(`no document with id: ${id}`);
  }
}
