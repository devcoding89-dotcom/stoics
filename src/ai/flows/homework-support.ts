// A Genkit flow for AI homework support, providing guidance to students on science, math, and general topics.
// It exports the HomeworkSupportInput and HomeworkSupportOutput types, and the homeworkSupport function.

'use server';
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HomeworkSupportInputSchema = z.object({
  question: z.string().describe('The homework question asked by the student.'),
  topic: z.string().describe('The topic of the homework question (e.g., science, math, general).'),
  context: z.string().optional().describe('Optional context or instructions from the teacher on how to answer homework questions.'),
});
export type HomeworkSupportInput = z.infer<typeof HomeworkSupportInputSchema>;

const HomeworkSupportOutputSchema = z.object({
  answer: z.string().describe('The AI-generated answer to the homework question.'),
  explanation: z.string().optional().describe('An optional explanation of the answer.'),
});
export type HomeworkSupportOutput = z.infer<typeof HomeworkSupportOutputSchema>;

export async function homeworkSupport(input: HomeworkSupportInput): Promise<HomeworkSupportOutput> {
  return homeworkSupportFlow(input);
}

const homeworkSupportPrompt = ai.definePrompt({
  name: 'homeworkSupportPrompt',
  input: {schema: HomeworkSupportInputSchema},
  output: {schema: HomeworkSupportOutputSchema},
  prompt: `You are an AI tutoring tool designed to help students with their homework.

  You will answer the question to the best of your ability.

  Question: {{{question}}}
  Topic: {{{topic}}}

  {{#if context}}
  Context from teacher: {{{context}}}
  {{/if}}
  `,
});

const homeworkSupportFlow = ai.defineFlow(
  {
    name: 'homeworkSupportFlow',
    inputSchema: HomeworkSupportInputSchema,
    outputSchema: HomeworkSupportOutputSchema,
  },
  async input => {
    const {output} = await homeworkSupportPrompt(input);
    return output!;
  }
);
