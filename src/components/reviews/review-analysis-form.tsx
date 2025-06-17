
"use client";

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Wand2 } from 'lucide-react';
import type { AnalyzeReviewSentimentInput, AnalyzeReviewSentimentOutput } from '@/ai/flows/analyze-review-sentiment';

const formSchema = z.object({
  reviewText: z.string().min(10, { message: "Review text must be at least 10 characters." }).max(2000, { message: "Review text must not exceed 2000 characters." }),
});

type ReviewFormValues = z.infer<typeof formSchema>;

interface ReviewAnalysisFormProps {
  onAnalysisComplete: (result: AnalyzeReviewSentimentOutput) => void;
  onAnalysisError: (error: string) => void;
}

export function ReviewAnalysisForm({ onAnalysisComplete, onAnalysisError }: ReviewAnalysisFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reviewText: '',
    },
  });

  const onSubmit: SubmitHandler<ReviewFormValues> = async (data) => {
    setIsLoading(true);
    try {
      // Dynamically import the server action
      const { analyzeReviewSentiment } = await import('@/ai/flows/analyze-review-sentiment');
      const input: AnalyzeReviewSentimentInput = { reviewText: data.reviewText };
      const result = await analyzeReviewSentiment(input);
      onAnalysisComplete(result);
    } catch (error) {
      console.error("Error analyzing review:", error);
      onAnalysisError(error instanceof Error ? error.message : "An unknown error occurred during analysis.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="reviewText"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold text-foreground">Customer Review Text</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Paste or type the customer review here..."
                  className="min-h-[150px] resize-y text-base shadow-sm"
                  {...field}
                  aria-describedby="reviewText-help"
                />
              </FormControl>
              <p id="reviewText-help" className="text-sm text-muted-foreground">
                Enter the full text of the customer's review for sentiment analysis.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto text-base py-3 px-6 shadow-md hover:shadow-lg transition-shadow">
          {isLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-5 w-5" />
          )}
          Analyze Review
        </Button>
      </form>
    </Form>
  );
}
