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
import { calcStaticIqByStats } from "../calc-iq.js";

const quizResultsCol = collection(db, "quiz-results");

// todo(vmyshko): cache or/and put stats in separate table on server

export async function getResultsTotalCount() {
  //total
  const testsTotal = await getCountFromServer(quizResultsCol);
  return testsTotal.data().count;
}

export async function getResultsLast24hCount() {
  const tsOneDayAgo = Timestamp.fromDate(
    new Date(Date.now() - 24 * 60 * 60 * 1000),
  ); // last 24h

  const testsLast24h = await getCountFromServer(
    query(quizResultsCol, where("datePassed", ">=", tsOneDayAgo)),
  );

  return testsLast24h.data().count;
}

export async function getResultsLast10() {
  const testResultsSnapshot = await getDocs(
    query(quizResultsCol, orderBy("datePassed", "desc"), limit(10)),
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
    usersSnapshot.docs.map((doc) => [doc.id, doc.data()]),
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

// todo(vmyshko): recheck after opus
export async function getTop10AllTime() {
  const resultsSnapshot = await getDocs(quizResultsCol);

  const results = resultsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const userIds = [...new Set(results.map((r) => r._userId))];

  // Firestore "in" supports max 30 items per query
  const usersRef = collection(db, "user-data");
  const users = {};
  for (let i = 0; i < userIds.length; i += 30) {
    const batch = userIds.slice(i, i + 30);
    const usersSnapshot = await getDocs(
      query(usersRef, where("__name__", "in", batch)),
    );
    usersSnapshot.docs.forEach((doc) => {
      users[doc.id] = doc.data();
    });
  }

  const resultsWithUsers = results.map((result) => ({
    ...result,
    user: users[result._userId] || null,
  }));

  // sort by correctness ratio descending, then by date ascending (earlier = better)
  resultsWithUsers.sort((a, b) => {
    const ratioA = (a.stats?.isCorrect ?? 0) / (a.stats?.total ?? 1);
    const ratioB = (b.stats?.isCorrect ?? 0) / (b.stats?.total ?? 1);
    if (ratioB !== ratioA) return ratioB - ratioA;
    return (
      (a.datePassed?.toMillis?.() ?? 0) - (b.datePassed?.toMillis?.() ?? 0)
    );
  });

  // keep only the best result per user
  const seenUsers = new Set();
  const uniqueResults = resultsWithUsers.filter((result) => {
    if (seenUsers.has(result._userId)) return false;
    seenUsers.add(result._userId);
    return true;
  });

  return uniqueResults.slice(0, 10);
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

export async function getStatsByCountry() {
  const resultsSnapshot = await getDocs(quizResultsCol);
  const results = resultsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const userIds = [...new Set(results.map((r) => r._userId))];

  const usersRef = collection(db, "user-data");
  const users = {};
  for (let i = 0; i < userIds.length; i += 30) {
    const batch = userIds.slice(i, i + 30);
    const usersSnapshot = await getDocs(
      query(usersRef, where("__name__", "in", batch)),
    );
    usersSnapshot.docs.forEach((doc) => {
      users[doc.id] = doc.data();
    });
  }

  const countryStats = {};
  results.forEach((result) => {
    const user = users[result._userId];
    const countryCode = user?.countryCode ?? "__";

    if (!countryStats[countryCode]) {
      countryStats[countryCode] = { totalIq: 0, count: 0 };
    }

    const iq = calcStaticIqByStats(result.stats);
    countryStats[countryCode].totalIq += iq;
    countryStats[countryCode].count += 1;
  });

  return Object.entries(countryStats)
    .map(([countryCode, { totalIq, count }]) => ({
      countryCode,
      count,
      avgIq: Math.round(totalIq / count),
    }))
    .sort((a, b) => b.count - a.count);
}
