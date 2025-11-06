'use server';
/**
 * @fileOverview A flow to handle sending a One-Time Password (OTP) for email login.
 * This is a simplified, insecure implementation for prototyping purposes.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getFirestore, collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';

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
    const firestore = getFirestore();
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes expiry

    // Check if user exists
    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    let userId;
    if (querySnapshot.empty) {
      // For this prototype, we are not creating a new user here.
      // A real implementation might create a user record at this stage.
      throw new Error("User with this email does not exist. Please register first.");
    } else {
      userId = querySnapshot.docs[0].id;
    }

    const userRef = doc(firestore, 'users', userId);

    // In a real app, this `setDoc` would be a `updateDoc`.
    // We use `setDoc` with `merge` to be safe if the fields don't exist yet.
    await setDoc(userRef, { otp, otpExpiry }, { merge: true });

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
