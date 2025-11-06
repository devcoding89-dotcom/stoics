'use server';
/**
 * @fileOverview A flow to handle sending a One-Time Password (OTP) for email login.
 * This is a simplified, insecure implementation for prototyping purposes.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { initializeApp, getApps, App, applicationDefault } from 'firebase-admin/app';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import { firebaseConfig } from '@/firebase/config';

// Helper function to initialize Firebase Admin SDK if not already done.
// This ensures that we have a properly authenticated instance.
function ensureFirebaseAdminInitialized(): App {
  const apps = getApps();
  if (apps.length > 0) {
    return apps[0]!;
  }
  // When running in a Google Cloud environment, applicationDefault() will find
  // the correct credentials to authenticate. For local development, it might
  // require additional setup (e.g., GOOGLE_APPLICATION_CREDENTIALS env var).
  // We include the projectId for more robust initialization.
  return initializeApp({
    credential: applicationDefault(),
    projectId: firebaseConfig.projectId,
  });
}

const SendOtpInputSchema = z.object({
  email: z.string().email().describe('The email address to send the OTP to.'),
});
export type SendOtpInput = z.infer<typeof SendOtpInputSchema>;

const SendOtpOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type SendOtpOutput = z.infer<typeof SendOtpOutputSchema>;

export async function sendOtp(input: SendOtpInput): Promise<SendOtpOutput> {
  return sendOtpFlow(input);
}

export const sendOtpFlow = ai.defineFlow(
  {
    name: 'sendOtpFlow',
    inputSchema: SendOtpInputSchema,
    outputSchema: SendOtpOutputSchema,
  },
  async ({ email }) => {
    // Ensure Firebase is initialized before proceeding
    ensureFirebaseAdminInitialized();
    const firestore = getAdminFirestore();

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Check if user exists
    const usersRef = firestore.collection('users');
    const q = usersRef.where('email', '==', email);
    const querySnapshot = await q.get();
    
    let userId;
    if (querySnapshot.empty) {
      // User does not exist, so we should not send an OTP.
      // Throw an error to be handled by the client.
      throw new Error("User with this email does not exist. Please register first.");
    } else {
      userId = querySnapshot.docs[0].id;
    }

    const userRef = firestore.doc(`users/${userId}`);

    // In a real app, this `setDoc` would be a `updateDoc`.
    // We use `setDoc` with `merge` to be safe if the fields don't exist yet.
    await userRef.set({ otp, otpExpiry }, { merge: true });

    // !! SIMULATION ONLY !!
    // In a real application, you would use a service like SendGrid, Mailgun, or Firebase Extensions
    // to send an actual email to the user.
    // For this prototype, we will just log the OTP to the server console.
    console.log(`================================`);
    console.log(`OTP for ${email}: ${otp}`);
    console.log(`================================`);

    return {
      success: true,
      message: 'OTP has been generated and logged to the console.',
    };
  }
);
