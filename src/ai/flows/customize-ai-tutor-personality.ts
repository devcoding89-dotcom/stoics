'use server';
/**
 * @fileOverview Allows teachers to customize the AI tutoring tool's communication style and provide context.
 *
 * - customizeAITutorPersonality - A function that handles the customization of the AI tutor's personality.
 * - CustomizeAITutorPersonalityInput - The input type for the customizeAITutorPersonality function.
 * - CustomizeAITutorPersonalityOutput - The return type for the customizeAITutorPersonality function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CustomizeAITutorPersonalityInputSchema = z.object({
  teacherInstructions: z
    .string()
    .describe(
      'Specific instructions from the teacher on how the AI tutor should communicate, including tone, style, and specific context.'
    ),
});
export type CustomizeAITutorPersonalityInput = z.infer<typeof CustomizeAITutorPersonalityInputSchema>;

const CustomizeAITutorPersonalityOutputSchema = z.object({
  confirmationMessage: z
    .string()
    .describe('A confirmation message indicating that the AI tutor personality has been successfully customized.'),
});
export type CustomizeAITutorPersonalityOutput = z.infer<typeof CustomizeAITutorPersonalityOutputSchema>;

export async function customizeAITutorPersonality(
  input: CustomizeAITutorPersonalityInput
): Promise<CustomizeAITutorPersonalityOutput> {
  return customizeAITutorPersonalityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'customizeAITutorPersonalityPrompt',
  input: {schema: CustomizeAITutorPersonalityInputSchema},
  output: {schema: CustomizeAITutorPersonalityOutputSchema},
  prompt: `You are an AI that customizes the personality of an AI tutor based on teacher instructions.

  Instructions:
  {{{teacherInstructions}}}
  
  Confirmation Message: The AI tutor personality has been successfully customized based on the provided instructions.
  `, // Removed the JSON format requirement from here
});

const customizeAITutorPersonalityFlow = ai.defineFlow(
  {
    name: 'customizeAITutorPersonalityFlow',
    inputSchema: CustomizeAITutorPersonalityInputSchema,
    outputSchema: CustomizeAITutorPersonalityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
