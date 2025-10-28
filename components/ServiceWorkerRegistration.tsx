'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const registerSW = async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
          console.log('[SW] Registered:', registration);

          // Auto-update logic
          setInterval(() => registration.update(), 60 * 1000);

          // Reload when new service worker takes control
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('[SW] New version installed, reloading...');
                  window.location.reload();
                }
              });
            }
          });
        } catch (error) {
          console.error('[SW] Registration failed:', error);
        }
      };

      registerSW();
    }
  }, []);

  return null;
}
