'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

export function SetupNotice() {
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);
  const [missingVars, setMissingVars] = useState<string[]>([]);

  useEffect(() => {
    const requiredVars = [
      'NEXT_PUBLIC_APPWRITE_ENDPOINT',
      'NEXT_PUBLIC_APPWRITE_PROJECT_ID',
      'NEXT_PUBLIC_APPWRITE_DATABASE_ID',
      'NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID',
    ];

    const missing: string[] = [];
    requiredVars.forEach(varName => {
      const value = process.env[varName];
      if (!value || value.includes('your_') || value.includes('_here')) {
        missing.push(varName);
      }
    });

    setMissingVars(missing);
    setIsConfigured(missing.length === 0);
  }, []);

  if (isConfigured === null) return null;
  if (isConfigured) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <CardTitle>Appwrite Setup Required</CardTitle>
              <CardDescription>Configure your environment variables to continue</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm text-orange-800 mb-2">
              <strong>Missing Configuration:</strong>
            </p>
            <ul className="text-sm text-orange-700 space-y-1">
              {missingVars.map(varName => (
                <li key={varName} className="flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  <code className="bg-orange-100 px-2 py-0.5 rounded">{varName}</code>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">Quick Setup Steps:</h3>
            <ol className="space-y-2 text-sm">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold">
                  1
                </span>
                <div>
                  <p className="font-medium">Create Appwrite Project</p>
                  <p className="text-gray-600">
                    Go to{' '}
                    <a
                      href="https://cloud.appwrite.io"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      cloud.appwrite.io
                    </a>{' '}
                    and create a new project
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold">
                  2
                </span>
                <div>
                  <p className="font-medium">Create Database & Collections</p>
                  <p className="text-gray-600">
                    Create database "edusync-db" and 7 collections (see DEVELOPMENT_GUIDE.md)
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold">
                  3
                </span>
                <div>
                  <p className="font-medium">Update .env.local</p>
                  <p className="text-gray-600">
                    Edit <code className="bg-gray-100 px-1.5 py-0.5 rounded">.env.local</code> with
                    your Project ID, Database ID, and Bucket ID
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold">
                  4
                </span>
                <div>
                  <p className="font-medium">Restart Development Server</p>
                  <p className="text-gray-600">
                    Stop and restart <code className="bg-gray-100 px-1.5 py-0.5 rounded">npm run dev</code>
                  </p>
                </div>
              </li>
            </ol>
          </div>

          <div className="flex gap-3">
            <Button asChild className="flex-1">
              <a
                href="https://cloud.appwrite.io"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open Appwrite Console
              </a>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <a
                href="https://github.com/ArhanAnsari/edusync/blob/master/QUICKSTART.md"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Setup Guide
              </a>
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center pt-2">
            See <code>QUICKSTART.md</code> or <code>DEVELOPMENT_GUIDE.md</code> for detailed instructions
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
