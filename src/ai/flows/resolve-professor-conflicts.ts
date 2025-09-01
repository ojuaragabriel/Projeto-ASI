'use server';

/**
 * @fileOverview An AI-powered conflict resolution system for professor allocations.
 *
 * - resolveProfessorConflicts - A function that handles the conflict resolution process.
 * - ResolveProfessorConflictsInput - The input type for the resolveProfessorConflicts function.
 * - ResolveProfessorConflictsOutput - The return type for the resolveProfessorConflicts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ResolveProfessorConflictsInputSchema = z.object({
  courseName: z.string().describe('The name of the course in conflict.'),
  professorAHistory: z
    .string()
    .describe('The historical data for professor A, including how many times they have taught the course and their preference.'),
  professorBHistory: z
    .string()
    .describe('The historical data for professor B, including how many times they have taught the course and their preference.'),
  conflictDescription: z.string().describe('Description of the conflict.'),
});
export type ResolveProfessorConflictsInput = z.infer<typeof ResolveProfessorConflictsInputSchema>;

const ResolveProfessorConflictsOutputSchema = z.object({
  suggestedProfessor: z.string().describe('The professor recommended to be assigned to the course.'),
  justification: z.string().describe('The justification for the suggested professor assignment.'),
});
export type ResolveProfessorConflictsOutput = z.infer<typeof ResolveProfessorConflictsOutputSchema>;

export async function resolveProfessorConflicts(input: ResolveProfessorConflictsInput): Promise<ResolveProfessorConflictsOutput> {
  return resolveProfessorConflictsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'resolveProfessorConflictsPrompt',
  input: {schema: ResolveProfessorConflictsInputSchema},
  output: {schema: ResolveProfessorConflictsOutputSchema},
  prompt: `You are an AI assistant that helps resolve conflicts in professor course allocations.

You will be given the following information:

Course Name: {{{courseName}}}
Conflict Description: {{{conflictDescription}}}
Professor A History: {{{professorAHistory}}}
Professor B History: {{{professorBHistory}}}

Based on this information, recommend which professor should be assigned to the course and provide a justification.
Consider historical data, preferences, and the nature of the conflict when making your recommendation.

Ensure that the response is in a structured format with the suggested professor and a clear justification.
`,
});

const resolveProfessorConflictsFlow = ai.defineFlow(
  {
    name: 'resolveProfessorConflictsFlow',
    inputSchema: ResolveProfessorConflictsInputSchema,
    outputSchema: ResolveProfessorConflictsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
