// use server'
'use server';
/**
 * @fileOverview Analyzes the sentiment of customer reviews and suggests response approaches.
 *
 * - analyzeReviewSentiment - A function that handles the sentiment analysis process.
 * - AnalyzeReviewSentimentInput - The input type for the analyzeReviewSentiment function.
 * - AnalyzeReviewSentimentOutput - The return type for the analyzeReviewSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeReviewSentimentInputSchema = z.object({
  reviewText: z
    .string()
    .describe('The text content of the customer review.'),
});
export type AnalyzeReviewSentimentInput = z.infer<typeof AnalyzeReviewSentimentInputSchema>;

const AnalyzeReviewSentimentOutputSchema = z.object({
  sentiment: z.string().describe('The sentiment of the review (positive, negative, or neutral).'),
  suggestedResponse: z.string().describe('A suggested response approach to the review.'),
});
export type AnalyzeReviewSentimentOutput = z.infer<typeof AnalyzeReviewSentimentOutputSchema>;

export async function analyzeReviewSentiment(input: AnalyzeReviewSentimentInput): Promise<AnalyzeReviewSentimentOutput> {
  return analyzeReviewSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeReviewSentimentPrompt',
  input: {schema: AnalyzeReviewSentimentInputSchema},
  output: {schema: AnalyzeReviewSentimentOutputSchema},
  prompt: `You are a sentiment analysis expert specializing in customer reviews for a laundry service.

You will analyze the sentiment of the review and suggest a response approach for management.

Review: {{{reviewText}}}

Analyze the sentiment of the review and suggest a response approach.
Consider the following when determining the sentiment:
- Positive: The review expresses satisfaction with the service.
- Negative: The review expresses dissatisfaction with the service.
- Neutral: The review expresses a neutral opinion about the service.

Based on the sentiment, suggest a response approach for management.
For example, if the sentiment is negative, suggest an apology and offer to resolve the issue.
If the sentiment is positive, suggest a thank you and express gratitude for the feedback.
If the sentiment is neutral, suggest acknowledging the feedback and expressing interest in improving the service.
`,
});

const analyzeReviewSentimentFlow = ai.defineFlow(
  {
    name: 'analyzeReviewSentimentFlow',
    inputSchema: AnalyzeReviewSentimentInputSchema,
    outputSchema: AnalyzeReviewSentimentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
