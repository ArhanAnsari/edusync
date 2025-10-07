'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center gap-6 text-center px-6">
      <div className="space-y-2">
        <h1 className="text-5xl font-bold tracking-tight text-[hsl(var(--foreground))]">404</h1>
        <p className="text-lg text-[hsl(var(--muted-foreground))]">The page you’re looking for doesn’t exist or has been moved.</p>
      </div>
      <div className="flex gap-3">
        <Link href="/">
          <Button>
            <Home className="mr-2" />
            Go Home
          </Button>
        </Link>
        <Link href="/docs">
          <Button variant="outline">
            <Search className="mr-2" />
            Browse Docs
          </Button>
        </Link>
      </div>
    </div>
  );
}
