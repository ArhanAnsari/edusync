'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { X, Cookie } from 'lucide-react';

// Extend Window interface to include gtag
declare global {
  interface Window {
    gtag: (command: string, ...args: any[]) => void;
  }
}

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasConsented = localStorage.getItem('cookieConsent');
    if (!hasConsented) {
      // Show consent after a short delay for better UX
      setTimeout(() => setShowConsent(true), 1000);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShowConsent(false);
    
    // Initialize analytics after consent
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
      });
    }
  };

  const declineCookies = () => {
    localStorage.setItem('cookieConsent', 'false');
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700 shadow-lg">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Cookie className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-white mb-1">We use cookies</h3>
              <p className="text-sm text-gray-300">
                We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
                By clicking "Accept All", you consent to our use of cookies. 
                <Link href="/cookies" className="text-blue-400 hover:text-blue-500 ml-1 underline">
                  Learn more
                </Link>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={declineCookies}
              className="border-gray-600 hover:bg-gray-800"
            >
              Decline
            </Button>
            <Button
              size="sm"
              onClick={acceptCookies}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Accept All
            </Button>
            <button
              onClick={declineCookies}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
