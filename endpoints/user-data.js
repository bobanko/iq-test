import { doc, getDoc, serverTimestamp, setDoc } from "./firebase.js";
import { db } from "./firebase.init.js";

export async function getUserData(userId) {
  const userDataRef = doc(db, "user-data", userId);

  const userData = await getDoc(userDataRef);

  if (userData.exists()) {
    console.log("userData data:", userData.data());

    return userData.data();
  } else {
    console.log("No such document!");
    return null;
  }
}

export async function updateUserData({ userId, userData }) {
  const userDataRef = doc(db, "user-data", userId);

  await setDoc(
    userDataRef,
    {
      ...userData,
      lastLogin: serverTimestamp(),
    },
    { merge: true }
  )
    .then(() => {
      // Profile updated!
      console.log("user profile updated", userDataRef);
    })
    .catch((error) => {
      // An error occurred
      console.error("user profile update error", error);
    });
}
