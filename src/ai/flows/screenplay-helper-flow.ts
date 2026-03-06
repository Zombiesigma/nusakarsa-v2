'use server';
/**
 * @fileOverview AI assistant for screenplay writing.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScreenplayHelperInputSchema = z.object({
  context: z.string().describe('The current text content of the scene.'),
  task: z.enum(['summarize', 'naturalize_dialogue', 'suggest_plot']).describe('The specific task for the AI assistant.'),
});
export type ScreenplayHelperInput = z.infer<typeof ScreenplayHelperInputSchema>;

const ScreenplayHelperOutputSchema = z.object({
  result: z.string().describe('The suggestion or analysis from the AI.'),
});
export type ScreenplayHelperOutput = z.infer<typeof ScreenplayHelperOutputSchema>;

export async function screenplayHelper(input: ScreenplayHelperInput): Promise<ScreenplayHelperOutput> {
  return screenplayHelperFlow(input);
}

const prompt = ai.definePrompt({
  name: 'screenplayHelperPrompt',
  input: {schema: ScreenplayHelperInputSchema},
  output: {schema: ScreenplayHelperOutputSchema},
  prompt: `You are a professional screenplay doctor. Based on the provided scene context and task, give a concise suggestion.
  
Task: {{{task}}}
Context:
{{{context}}}

Provide a helpful suggestion in 1-2 paragraphs.`,
});

const screenplayHelperFlow = ai.defineFlow(
  {
    name: 'screenplayHelperFlow',
    inputSchema: ScreenplayHelperInputSchema,
    outputSchema: ScreenplayHelperOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('AI assistant failed to generate a response.');
    }
    return output;
  }
);
