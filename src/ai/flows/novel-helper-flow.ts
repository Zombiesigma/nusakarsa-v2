'use server';
/**
 * @fileOverview AI assistant for novel writing.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NovelHelperInputSchema = z.object({
  context: z.string().describe('The current text content of the novel chapter.'),
  task: z.enum(['tone_polish', 'describe_scene', 'show_dont_tell']).describe('The specific task for the AI assistant.'),
});
export type NovelHelperInput = z.infer<typeof NovelHelperInputSchema>;

const NovelHelperOutputSchema = z.object({
  result: z.string().describe('The suggestion or analysis from the AI.'),
});
export type NovelHelperOutput = z.infer<typeof NovelHelperOutputSchema>;

export async function novelHelper(input: NovelHelperInput): Promise<NovelHelperOutput> {
  return novelHelperFlow(input);
}

const prompt = ai.definePrompt({
  name: 'novelHelperPrompt',
  input: {schema: NovelHelperInputSchema},
  output: {schema: NovelHelperOutputSchema},
  prompt: `You are a world-class novel editor. Based on the provided context and task, give a concise suggestion.
  
Task: {{{task}}}
Context:
{{{context}}}

Provide a helpful suggestion in 1-2 paragraphs.`,
});

const novelHelperFlow = ai.defineFlow(
  {
    name: 'novelHelperFlow',
    inputSchema: NovelHelperInputSchema,
    outputSchema: NovelHelperOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('AI assistant failed to generate a response.');
    }
    return output;
  }
);
