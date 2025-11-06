'use server';
/**
 * @fileOverview A flow to handle sending a One-Time Password (OTP) for email login.
 * This is a simplified, insecure implementation for prototyping purposes.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getFirestore, collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import { firebaseConfig } from '@/firebase/config';

// Initialize Firebase Admin SDK if not already initialized
if (!getApps().length) {
  initializeApp({
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

const sendOtpFlow = ai.defineFlow(
  {
    name: 'sendOtpFlow',
    inputSchema: SendOtpInputSchema,
    outputSchema: SendOtpOutputSchema,
  },
  async ({ email }) => {
    const firestore = getAdminFirestore();
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Check if user exists
    const usersRef = firestore.collection('users');
    const q = usersRef.where('email', '==', email);
    const querySnapshot = await q.get();
    
    let userId;
    if (querySnapshot.empty) {
      // For this prototype, we are not creating a new user here.
      // A real implementation might create a user record at this stage.
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
