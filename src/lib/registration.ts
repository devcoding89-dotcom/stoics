import { collection, getCountFromServer, Firestore } from "firebase/firestore";

// This is a client-side implementation and is not safe from race conditions.
// For a production app, this logic should be moved to a Cloud Function
// triggered by user creation to ensure uniqueness and transactional safety.

// Function to generate the next letter in the sequence (A, B, C, ..., Z, AA, AB, ...)
const getNextLetter = (count: number, batchSize: number): string => {
  let letterIndex = Math.floor(count / batchSize);
  let result = '';
  while (letterIndex >= 0) {
    result = String.fromCharCode(65 + (letterIndex % 26)) + result;
    letterIndex = Math.floor(letterIndex / 26) - 1;
  }
  return result;
};

/**
 * Generates a new registration number based on the total number of users.
 * @param firestore - The Firestore instance.
 * @returns A promise that resolves to the new registration number string (e.g., "1A").
 */
export async function generateRegistrationNumber(firestore: Firestore): Promise<string> {
  try {
    const usersRef = collection(firestore, "users");
    const snapshot = await getCountFromServer(usersRef);
    const userCount = snapshot.data().count;

    const nextNumber = userCount + 1;
    const batchSize = 999; // New letter series starts after every 999 users.

    const numericPart = (nextNumber % batchSize === 0) ? batchSize : nextNumber % batchSize;
    const letterPart = getNextLetter(userCount, batchSize);

    return `${numericPart}${letterPart}`;
  } catch (error) {
    console.error("Error generating registration number:", error);
    // Fallback to a random-based ID if counting fails to ensure a value is always returned.
    return `ERR-${Date.now()}`;
  }
}
