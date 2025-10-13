// Service Worker for EduSync Offline Functionality
const CACHE_NAME = 'edusync-v1';
const OFFLINE_URL = '/offline.html';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/offline.html',
  '/logo.png',
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Precaching assets');
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (!request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    (async () => {
      try {
        // Try network first for API calls
        if (request.url.includes('/api/')) {
          try {
            const networkResponse = await fetch(request);
            return networkResponse;
          } catch (error) {
            // If offline, return cached response or error
            const cache = await caches.open(CACHE_NAME);
            const cachedResponse = await cache.match(request);
            if (cachedResponse) {
              return cachedResponse;
            }
            return new Response(
              JSON.stringify({ error: 'Offline - This feature requires an internet connection' }),
              {
                status: 503,
                headers: { 'Content-Type': 'application/json' }
              }
            );
          }
        }

        // For other requests, try cache first, then network
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(request);

        if (cachedResponse) {
          // Return cached version and update cache in background
          fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
          }).catch(() => {});
          return cachedResponse;
        }

        // Not in cache, fetch from network
        const networkResponse = await fetch(request);

        // Cache successful responses
        if (networkResponse && networkResponse.status === 200) {
          cache.put(request, networkResponse.clone());
        }

        return networkResponse;

      } catch (error) {
        // Network failed, try cache
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
          return cachedResponse;
        }

        // If HTML page, return offline page
        if (request.destination === 'document') {
          const offlineResponse = await cache.match(OFFLINE_URL);
          if (offlineResponse) {
            return offlineResponse;
          }
        }

        // Fallback error response
        return new Response('Offline - Content not available', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({
            'Content-Type': 'text/plain'
          })
        });
      }
    })()
  );
});

// Background sync for quiz attempts and submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-quiz-attempts') {
    event.waitUntil(syncQuizAttempts());
  } else if (event.tag === 'sync-submissions') {
    event.waitUntil(syncSubmissions());
  }
});

async function syncQuizAttempts() {
  try {
    const db = await openIndexedDB();
    const pendingAttempts = await db.getAll('pendingQuizAttempts');
    
    for (const attempt of pendingAttempts) {
      try {
        const response = await fetch('/api/sync/quiz-attempts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(attempt)
        });
        
        if (response.ok) {
          await db.delete('pendingQuizAttempts', attempt.id);
        }
      } catch (error) {
        console.error('[SW] Failed to sync quiz attempt:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Sync quiz attempts failed:', error);
  }
}

async function syncSubmissions() {
  try {
    const db = await openIndexedDB();
    const pendingSubmissions = await db.getAll('pendingSubmissions');
    
    for (const submission of pendingSubmissions) {
      try {
        const response = await fetch('/api/sync/submissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submission)
        });
        
        if (response.ok) {
          await db.delete('pendingSubmissions', submission.id);
        }
      } catch (error) {
        console.error('[SW] Failed to sync submission:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Sync submissions failed:', error);
  }
}

function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('EduSyncOffline', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pendingQuizAttempts')) {
        db.createObjectStore('pendingQuizAttempts', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('pendingSubmissions')) {
        db.createObjectStore('pendingSubmissions', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}
