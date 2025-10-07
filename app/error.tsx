'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { RefreshCw, Home } from 'lucide-react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string } ; reset: () => void }) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-[60vh] w-full flex flex-col items-center justify-center gap-6 text-center px-6">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[hsl(var(--foreground))]">Something went wrong</h1>
            <p className="text-[hsl(var(--muted-foreground))]">An unexpected error occurred. You can try again or go back to the homepage.</p>
            {error?.digest && (
              <p className="text-xs text-[hsl(var(--muted-foreground))]">Error ID: {error.digest}</p>
            )}
          </div>
          <div className="flex gap-3">
            <Button onClick={() => reset()}>
              <RefreshCw className="mr-2" />
              Try again
            </Button>
            <Link href="/">
              <Button variant="outline">
                <Home className="mr-2" />
                Go Home
              </Button>
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
