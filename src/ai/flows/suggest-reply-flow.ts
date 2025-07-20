'use server';
/**
 * @fileOverview Suggests a reply to a chat conversation.
 *
 * - suggestReply - A function that suggests a reply.
 * - SuggestReplyInput - The input type for the suggestReply function.
 * - SuggestReplyOutput - The return type for the suggestReply function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestReplyInputSchema = z.object({
  history: z.string().describe('The chat conversation history.'),
});
export type SuggestReplyInput = z.infer<typeof SuggestReplyInputSchema>;

const SuggestReplyOutputSchema = z.object({
  reply: z.string().describe('A suggested reply to the conversation.'),
});
export type SuggestReplyOutput = z.infer<typeof SuggestReplyOutputSchema>;

export async function suggestReply(input: SuggestReplyInput): Promise<SuggestReplyOutput> {
  return suggestReplyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestReplyPrompt',
  input: {schema: SuggestReplyInputSchema},
  output: {schema: SuggestReplyOutputSchema},
  prompt: `You are a helpful and friendly club member in a chat room. Based on the following conversation history, suggest a concise and relevant reply from the perspective of "You".

  Conversation History:
  {{{history}}}

  Please provide a suggested reply.`,
});

const suggestReplyFlow = ai.defineFlow(
  {
    name: 'suggestReplyFlow',
    inputSchema: SuggestReplyInputSchema,
    outputSchema: SuggestReplyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
