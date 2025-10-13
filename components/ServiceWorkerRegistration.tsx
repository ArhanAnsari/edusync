'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    // Only register service worker in production
    if (
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
          
          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60000); // Check every minute
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    } else if (process.env.NODE_ENV === 'development') {
      console.log('[SW] Service Worker disabled in development mode');
    }
  }, []);

  return null;
}
