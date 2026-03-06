'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating a concise AI summary of an ebook.
 *
 * - aiBookSummary - A function that generates a summary for a given book.
 * - AIBookSummaryInput - The input type for the aiBookSummary function.
 * - AIBookSummaryOutput - The return type for the aiBookSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIBookSummaryInputSchema = z.object({
  title: z.string().describe('The title of the book.'),
  author: z.string().describe('The author of the book.'),
  description: z
    .string()
    .optional()
    .describe('An optional short description or synopsis of the book.'),
});
export type AIBookSummaryInput = z.infer<typeof AIBookSummaryInputSchema>;

const AIBookSummaryOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise AI-generated summary of the book, focusing on main plot and themes.'),
});
export type AIBookSummaryOutput = z.infer<typeof AIBookSummaryOutputSchema>;

export async function aiBookSummary(input: AIBookSummaryInput): Promise<AIBookSummaryOutput> {
  return aiBookSummaryFlow(input);
}

const aiBookSummaryPrompt = ai.definePrompt({
  name: 'aiBookSummaryPrompt',
  input: {schema: AIBookSummaryInputSchema},
  output: {schema: AIBookSummaryOutputSchema},
  prompt: `You are an expert literary critic and summarizer. Your task is to provide a concise, AI-generated summary of a given ebook, focusing on its main plot and themes.

The summary should be no more than 3-4 sentences, allowing a user to quickly understand the book's essence before deciding to read it.

Book Title: {{{title}}}
Author: {{{author}}}
{{#if description}}
Description: {{{description}}}
{{/if}}`,
});

const aiBookSummaryFlow = ai.defineFlow(
  {
    name: 'aiBookSummaryFlow',
    inputSchema: AIBookSummaryInputSchema,
    outputSchema: AIBookSummaryOutputSchema,
  },
  async input => {
    const {output} = await aiBookSummaryPrompt(input);
    if (!output) {
      throw new Error('Failed to generate book summary.');
    }
    return output;
  }
);
