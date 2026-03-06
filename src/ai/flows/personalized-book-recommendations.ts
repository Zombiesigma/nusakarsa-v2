'use server';
/**
 * @fileOverview A Genkit flow for personalized ebook recommendations.
 *
 * - personalizeBookRecommendations - A function that generates personalized book recommendations.
 * - PersonalizeBookRecommendationsInput - The input type for the personalizeBookRecommendations function.
 * - PersonalizeBookRecommendationsOutput - The return type for the personalizeBookRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizeBookRecommendationsInputSchema = z.object({
  readingHistory: z
    .array(
      z.object({
        title: z.string().describe('The title of the book.'),
        author: z.string().describe('The author of the book.'),
        category: z.string().optional().describe('The category or genre of the book.'),
      })
    )
    .describe('A list of books the user has read or is currently reading.'),
  preferences: z
    .string()
    .optional()
    .describe('Additional free-form preferences from the user (e.g., favorite genres, themes, authors to avoid).'),
});
export type PersonalizeBookRecommendationsInput = z.infer<typeof PersonalizeBookRecommendationsInputSchema>;

const PersonalizeBookRecommendationsOutputSchema = z.object({
  recommendations: z
    .array(
      z.object({
        title: z.string().describe('The title of the recommended book.'),
        author: z.string().describe('The author of the recommended book.'),
        reason: z.string().describe('A brief explanation of why this book is recommended based on user preferences and reading history.'),
      })
    )
    .describe('A list of personalized book recommendations.'),
});
export type PersonalizeBookRecommendationsOutput = z.infer<typeof PersonalizeBookRecommendationsOutputSchema>;

export async function personalizeBookRecommendations(input: PersonalizeBookRecommendationsInput): Promise<PersonalizeBookRecommendationsOutput> {
  return personalizeBookRecommendationsFlow(input);
}

const personalizeBookRecommendationsPrompt = ai.definePrompt({
  name: 'personalizeBookRecommendationsPrompt',
  input: {schema: PersonalizeBookRecommendationsInputSchema},
  output: {schema: PersonalizeBookRecommendationsOutputSchema},
  prompt: `You are an expert librarian and book recommender for an ebook platform called Nusakarsa Digital.
Your goal is to provide personalized book recommendations to users based on their reading history and explicit preferences.

Here is the user's reading history:
{{#each readingHistory}}
- Title: {{{this.title}}}, Author: {{{this.author}}}{{#if this.category}}, Category: {{{this.category}}}{{/if}}
{{/each}}

Here are the user's additional preferences:
{{#if preferences}}{{{preferences}}}{{else}}No additional preferences provided.{{/if}}

Based on the above information, suggest 3-5 books that the user is likely to enjoy. For each recommendation, provide the book's title, author, and a clear, concise reason why you are recommending it, connecting it back to their history or preferences. Ensure the recommendations are diverse but still relevant.

Respond in JSON format according to the output schema.`,
});

const personalizeBookRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizeBookRecommendationsFlow',
    inputSchema: PersonalizeBookRecommendationsInputSchema,
    outputSchema: PersonalizeBookRecommendationsOutputSchema,
  },
  async (input) => {
    const {output} = await personalizeBookRecommendationsPrompt(input);
    return output!;
  }
);
