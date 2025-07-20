'use server';
/**
 * @fileOverview Generates a summary of recent club activity.
 *
 * - summarizeClubActivity - A function that generates a summary of recent club activity.
 * - SummarizeClubActivityInput - The input type for the summarizeClubActivity function.
 * - SummarizeClubActivityOutput - The return type for the summarizeClubActivity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeClubActivityInputSchema = z.object({
  recentAnnouncements: z.string().describe('Recent announcements made by the club.'),
  newMembers: z.string().describe('List of newly joined members.'),
  activeTopics: z.string().describe('Currently active topics in the chatroom.'),
});
export type SummarizeClubActivityInput = z.infer<typeof SummarizeClubActivityInputSchema>;

const SummarizeClubActivityOutputSchema = z.object({
  summary: z.string().describe('A summary of recent club activity.'),
});
export type SummarizeClubActivityOutput = z.infer<typeof SummarizeClubActivityOutputSchema>;

export async function summarizeClubActivity(input: SummarizeClubActivityInput): Promise<SummarizeClubActivityOutput> {
  return summarizeClubActivityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeClubActivityPrompt',
  input: {schema: SummarizeClubActivityInputSchema},
  output: {schema: SummarizeClubActivityOutputSchema},
  prompt: `You are a helpful assistant that summarizes recent club activity.

  Recent Announcements: {{{recentAnnouncements}}}
  New Members: {{{newMembers}}}
  Active Topics: {{{activeTopics}}}

  Please provide a concise summary of the above information.`,
});

const summarizeClubActivityFlow = ai.defineFlow(
  {
    name: 'summarizeClubActivityFlow',
    inputSchema: SummarizeClubActivityInputSchema,
    outputSchema: SummarizeClubActivityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
