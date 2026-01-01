'use server';
/**
 * @fileOverview A flow to handle sending a One-Time Password (OTP) for email login.
 * This is a simplified, insecure implementation for prototyping purposes.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { initializeApp, getApps, App } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


// Helper function to initialize Firebase if not already done.
// This is separate from the main app's initialization to be self-contained for the flow.
function ensureFirebaseInitialized(): App {
  const apps = getApps();
  if (apps.length > 0) {
    // A named app might exist if other flows are running. Re-use it.
    const namedApp = apps.find(app => app.name === 'genkit-otp-flow');
    if (namedApp) return namedApp;
    // Or return the default app if it's the only one.
    if(apps.length === 1 && apps[0]) return apps[0];
  }
  // Use a unique name to avoid conflicts with the main app's Firebase instance
  return initializeApp(firebaseConfig, 'genkit-otp-flow');
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
    const app = ensureFirebaseInitialized();
    const firestore = getFirestore(app);

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where('email', '==', email));
    
    let querySnapshot;
    try {
        querySnapshot = await getDocs(q);
    } catch (serverError) {
        const permissionError = new FirestorePermissionError({
            path: 'users',
            operation: 'list'
        });
        errorEmitter.emit('permission-error', permissionError);
        throw permissionError;
    }
    
    if (querySnapshot.empty) {
      // Security: Do not reveal if the user exists or not in the error message.
      // This is a valid case (user not found), not a permissions error, so we throw a regular error.
      throw new Error("If an account exists for this email, an OTP has been sent.");
    } 
    
    const userDoc = querySnapshot.docs[0];
    if (!userDoc) {
      throw new Error("Could not find user document.");
    }

    const userRef = userDoc.ref;

    try {
        await updateDoc(userRef, { 
            otp, 
            otpExpiry: otpExpiry.toISOString() 
        });
    } catch (serverError) {
        const permissionError = new FirestorePermissionError({
            path: userRef.path,
            operation: 'update',
            requestResourceData: { otp: '******', otpExpiry: otpExpiry.toISOString() }
        });
        errorEmitter.emit('permission-error', permissionError);
        throw permissionError;
    }

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
