"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { RefreshCw, Home } from 'lucide-react';

export default function GlobalError({ 
  error,
  reset 
}: { 
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen w-full flex flex-col items-center justify-center gap-6 text-center px-6">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Application Error</h1>
            <p className="text-gray-600">A critical error occurred. Please try refreshing the page.</p>
            {error?.digest && (
              <p className="text-xs text-gray-500">Error ID: {error.digest}</p>
            )}
          </div>
          <div className="flex gap-3">
            <Button onClick={() => reset()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try again
            </Button>
            <Link href="/">
              <Button variant="outline">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}