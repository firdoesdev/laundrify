
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Smile, Frown, Meh, Lightbulb } from 'lucide-react';
import type { AnalyzeReviewSentimentOutput } from '@/ai/flows/analyze-review-sentiment';

interface AnalysisResultCardProps {
  result: AnalyzeReviewSentimentOutput;
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function AnalysisResultCard({ result }: AnalysisResultCardProps) {
  const sentiment = result.sentiment.toLowerCase();
  let SentimentIcon = Meh;
  let sentimentColorClass = 'bg-gray-100 text-gray-700 border-gray-300';

  if (sentiment.includes('positive')) {
    SentimentIcon = Smile;
    sentimentColorClass = 'bg-green-100 text-green-700 border-green-300';
  } else if (sentiment.includes('negative')) {
    SentimentIcon = Frown;
    sentimentColorClass = 'bg-red-100 text-red-700 border-red-300';
  } else if (sentiment.includes('neutral')) {
    SentimentIcon = Meh;
    sentimentColorClass = 'bg-blue-100 text-blue-700 border-blue-300';
  }

  return (
    <Card className="shadow-xl animate-in fade-in duration-500">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-headline text-foreground">Analysis Result</CardTitle>
          <Badge variant="outline" className={cn('text-sm px-3 py-1', sentimentColorClass)}>
            <SentimentIcon className="mr-2 h-5 w-5" />
            {result.sentiment}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-muted-foreground mb-2 flex items-center">
            <Lightbulb className="mr-2 h-5 w-5 text-accent" />
            Suggested Response Approach
          </h3>
          <p className="text-foreground/90 leading-relaxed bg-muted/30 p-4 rounded-md border border-dashed">
            {result.suggestedResponse}
          </p>
        </div>
        
        <div className="border-t pt-4">
            <p className="text-xs text-muted-foreground">
                AI-powered analysis. Always review suggestions before responding to customers.
            </p>
        </div>
      </CardContent>
    </Card>
  );
}
