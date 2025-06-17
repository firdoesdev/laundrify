
"use client";
import React, { useState, useEffect } from 'react';
import { ReviewAnalysisForm } from '@/components/reviews/review-analysis-form';
import { AnalysisResultCard } from '@/components/reviews/analysis-result-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, MessageCircle, ThumbsUp, ThumbsDown } from "lucide-react";
import type { AnalyzeReviewSentimentOutput } from '@/ai/flows/analyze-review-sentiment';
import { useToast } from "@/hooks/use-toast";
import { sampleReviews } from '@/lib/data';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function ReviewsPage() {
  const [analysisResult, setAnalysisResult] = useState<AnalyzeReviewSentimentOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [currentReviewText, setCurrentReviewText] = useState('');

  const handleAnalysisComplete = (result: AnalyzeReviewSentimentOutput) => {
    setAnalysisResult(result);
    setError(null);
    toast({
      title: "Analysis Complete",
      description: "Review sentiment has been successfully analyzed.",
      variant: "default",
    });
  };

  const handleAnalysisError = (errorMessage: string) => {
    setError(errorMessage);
    setAnalysisResult(null);
    toast({
      title: "Analysis Error",
      description: errorMessage,
      variant: "destructive",
    });
  };

  const handleUseSampleReview = (reviewText: string) => {
    setCurrentReviewText(reviewText);
    // Optionally, you could also reset the form if ReviewAnalysisForm exposes a reset method via ref
    // For simplicity, we'll just update a key on the form to re-initialize it with new defaultValues
    // This requires ReviewAnalysisForm to accept a `key` prop and potentially `defaultReviewText`
    // Or, more simply, we can just rely on the user to see the text area update and then submit.
    // For a better UX, the form should ideally be part of this component or have a shared state mechanism.
    // For now, this example will focus on getting the text into the form's parent state.
    // The ReviewAnalysisForm would need to be modified to accept an initial value or be controlled.
    // As a workaround, we'll pass a key to ReviewAnalysisForm to force re-render if text changes.
    if (document.querySelector('textarea[name="reviewText"]')) {
      (document.querySelector('textarea[name="reviewText"]') as HTMLTextAreaElement).value = reviewText;
    }
  };
  
  // This effect updates the textarea value if currentReviewText changes. This is a bit of a hack.
  // A better way is to make ReviewAnalysisForm a controlled component or use react-hook-form's setValue.
  useEffect(() => {
    if (formKey !== currentReviewText && document.querySelector('textarea[name="reviewText"]')) {
      const textarea = document.querySelector('textarea[name="reviewText"]') as HTMLTextAreaElement;
      textarea.value = currentReviewText;
      // Trigger change event for react-hook-form to pick up
      const event = new Event('input', { bubbles: true });
      textarea.dispatchEvent(event);
    }
  }, [currentReviewText]);


  // Key to re-render form when sample review is selected
  const [formKey, setFormKey] = useState(Date.now().toString());
  useEffect(() => {
    setFormKey(Date.now().toString());
  }, [currentReviewText]);


  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-headline">Review Sentiment Analysis</h1>
         <Image 
            src="https://placehold.co/300x150.png" 
            alt="AI analysis illustration" 
            width={300} 
            height={150} 
            className="rounded-lg shadow-md hidden md:block"
            data-ai-hint="AI technology"
          />
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Analyze Customer Feedback</CardTitle>
          <CardDescription>
            Use our AI-powered tool to understand the sentiment behind customer reviews and get suggestions for how to respond.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ReviewAnalysisForm
            key={formKey} // Force re-render if a sample review is loaded
            onAnalysisComplete={handleAnalysisComplete}
            onAnalysisError={handleAnalysisError}
          />
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="shadow-md">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {analysisResult && <AnalysisResultCard result={analysisResult} />}

      <Card className="mt-8 shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Sample Reviews</CardTitle>
          <CardDescription>Try analyzing one of these sample reviews.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sampleReviews.map((review, index) => (
            <div key={review.id} className="p-4 border rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-foreground">{review.customerName}</p>
                  <p className="text-sm text-muted-foreground italic">"{review.reviewText}"</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleUseSampleReview(review.reviewText)}>
                  Use this review
                </Button>
              </div>
              <div className="flex items-center mt-2 text-sm text-muted-foreground">
                {review.rating && (
                  <>
                    {Array.from({ length: 5 }).map((_, i) => (
                      i < review.rating! ? <ThumbsUp key={i} className="h-4 w-4 text-green-500 mr-0.5" /> : <ThumbsDown key={i} className="h-4 w-4 text-red-400 mr-0.5 opacity-70" />
                    ))}
                    <span className="ml-1">({review.rating}/5)</span>
                    <span className="mx-2">|</span>
                  </>
                )}
                <span>{review.date}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

