'use server';
/**
 * @fileOverview AI assistant for poetry writing.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PoetryHelperInputSchema = z.object({
  context: z.string().describe('The current text content of the poem.'),
  task: z.enum(['rhyme_polish', 'deepen_metaphor', 'emotional_boost']).describe('The specific task for the AI assistant.'),
});
export type PoetryHelperInput = z.infer<typeof PoetryHelperInputSchema>;

const PoetryHelperOutputSchema = z.object({
  result: z.string().describe('The suggestion or analysis from the AI.'),
});
export type PoetryHelperOutput = z.infer<typeof PoetryHelperOutputSchema>;

export async function poetryHelper(input: PoetryHelperInput): Promise<PoetryHelperOutput> {
  return poetryHelperFlow(input);
}

const prompt = ai.definePrompt({
  name: 'poetryHelperPrompt',
  input: {schema: PoetryHelperInputSchema},
  output: {schema: PoetryHelperOutputSchema},
  prompt: `You are an expert poetry critic. Based on the provided context and task, give a concise suggestion to improve the poem.
  
Task: {{{task}}}
Context:
{{{context}}}

Provide a helpful suggestion in 1-2 paragraphs.`,
});

const poetryHelperFlow = ai.defineFlow(
  {
    name: 'poetryHelperFlow',
    inputSchema: PoetryHelperInputSchema,
    outputSchema: PoetryHelperOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('AI assistant failed to generate a response.');
    }
    return output;
  }
);
