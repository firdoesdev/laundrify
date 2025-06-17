
"use client"; // Error components must be Client Components

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center p-6 bg-background">
      <AlertTriangle className="w-16 h-16 text-destructive mb-6" />
      <h2 className="text-3xl font-bold text-foreground mb-4 font-headline">Oops, something went wrong!</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        We encountered an unexpected issue. Please try again, or contact support if the problem persists.
      </p>
      <p className="text-xs text-muted-foreground mb-2">Error details (for debugging):</p>
      <pre className="text-xs bg-muted p-2 rounded-md max-w-full overflow-auto mb-8 text-left">
        {error.message}
        {error.digest && `\nDigest: ${error.digest}`}
      </pre>
      <div className="flex gap-4">
        <Button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
          variant="default"
          size="lg"
          className="shadow-md hover:shadow-lg transition-shadow"
        >
          Try again
        </Button>
        <Button
          onClick={
            () => window.location.href = '/dashboard'
          }
          variant="outline"
          size="lg"
          className="shadow-md hover:shadow-lg transition-shadow"
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}
