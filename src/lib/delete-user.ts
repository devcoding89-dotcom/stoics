import { getAuth, deleteUser, reauthenticateWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";
import { firebaseApp } from "@/firebase";

/**
 * Handles the complete deletion of the currently authenticated user.
 * This includes deleting their Firestore document and their Firebase Auth account.
 * It also handles re-authentication if required.
 *
 * @throws {Error} Throws an error if the user is not authenticated or if deletion fails.
 */
export async function deleteCurrentUser() {
  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);
  const user = auth.currentUser;

  if (!user) {
    throw new Error("No user is currently signed in.");
  }

  try {
    // 1. Delete Firestore document first.
    const userDocRef = doc(firestore, 'users', user.uid);
    await deleteDoc(userDocRef);

    // 2. Delete the Firebase Authentication user.
    await deleteUser(user);

  } catch (error: any) {
    // If deletion fails because it requires a recent login, re-authenticate and retry.
    if (error.code === 'auth/requires-recent-login') {
      console.log("Re-authentication required. Prompting user...");

      try {
        // We assume Google is the primary provider for re-authentication.
        // This could be expanded to handle email/password as well.
        const provider = new GoogleAuthProvider();
        // The reauthenticateWithPopup will throw an error if it fails or is cancelled by the user
        await reauthenticateWithPopup(user, provider);

        // Re-authentication successful, now retry the deletion.
        console.log("Re-authentication successful. Retrying deletion...");
        const userDocRef = doc(firestore, 'users', user.uid);
        await deleteDoc(userDocRef);
        await deleteUser(user);
        
      } catch (reauthError: any) {
        console.error("Re-authentication failed:", reauthError);
        // We throw a more user-friendly error here.
        throw new Error("Re-authentication failed. Please try signing out and signing back in before deleting your account.");
      }
    } else {
      // Re-throw any other errors (e.g., network issues, other permission errors).
      console.error("An unexpected error occurred during account deletion:", error);
      throw error;
    }
  }
}
