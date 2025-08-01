import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface BackendWakeupProps {
  onRetry: () => void;
  error?: string | null;
}

export function BackendWakeup({ onRetry, error }: BackendWakeupProps) {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 500); // Progress over ~50 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Backend Service is Starting Up</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          The backend service is currently waking up from sleep mode. This typically 
          takes about 30-60 seconds on Render's free tier.
        </p>
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
            Error: {error}
          </div>
        )}
        <Progress value={progress} className="w-full" />
        <p className="text-sm text-muted-foreground">
          {progress < 100 ? 'Please wait...' : 'Ready to retry!'}
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onRetry} 
          disabled={progress < 100}
          className="w-full"
        >
          Retry Connection
        </Button>
      </CardFooter>
    </Card>
  );
}
