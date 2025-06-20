
// Service Worker for Lumatori Mindful Flow PWA
const CACHE_NAME = 'mindful-flow-v1.0.0';
const OFFLINE_PAGE = '/offline.html';

// Critical resources to cache immediately
const CRITICAL_RESOURCES = [
  '/',
  '/offline.html',
  '/manifest.json'
];

// API endpoints that should be cached
const API_CACHE_PATTERNS = [
  /\/api\/journal/,
  /\/api\/habits/,
  /\/api\/insights/
];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching critical resources');
        return cache.addAll(CRITICAL_RESOURCES);
      })
      .then(() => {
        // Skip waiting to activate immediately
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Claim all clients
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle navigation requests (pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => {
          // Return offline page if navigation fails
          return caches.match(OFFLINE_PAGE);
        })
    );
    return;
  }

  // Handle API requests with network-first strategy
  if (url.pathname.startsWith('/api/') || url.hostname.includes('supabase')) {
    event.respondWith(
      networkFirstStrategy(request)
    );
    return;
  }

  // Handle static assets with cache-first strategy
  if (request.destination === 'script' || 
      request.destination === 'style' || 
      request.destination === 'image') {
    event.respondWith(
      cacheFirstStrategy(request)
    );
    return;
  }

  // Default: try network first, fall back to cache
  event.respondWith(
    fetch(request)
      .catch(() => caches.match(request))
  );
});

// Network-first strategy for API calls
async function networkFirstStrategy(request) {
  try {
    const response = await fetch(request);
    
    // Cache successful responses
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // Return cached version if available
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for failed API calls
    return new Response(
      JSON.stringify({ 
        error: 'Offline', 
        message: 'This request requires an internet connection' 
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Cache-first strategy for static assets
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('Failed to fetch and cache:', request.url);
    throw error;
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);
  
  if (!event.data) {
    return;
  }

  let notificationData;
  try {
    notificationData = event.data.json();
  } catch (error) {
    console.error('Failed to parse push notification data:', error);
    return;
  }

  const options = {
    body: notificationData.body || 'You have a new notification',
    icon: '/placeholder.svg',
    badge: '/placeholder.svg',
    tag: notificationData.tag || 'mindful-flow',
    data: notificationData.data || {},
    actions: [
      {
        action: 'open',
        title: 'Open App'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ],
    requireInteraction: false,
    silent: false
  };

  event.waitUntil(
    self.registration.showNotification(
      notificationData.title || 'Mindful Flow',
      options
    )
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  // Determine the URL to open
  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.focus();
            if (urlToOpen !== '/') {
              client.navigate(urlToOpen);
            }
            return;
          }
        }
        
        // Open new window if app is not open
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Background sync for offline data
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'journal-sync') {
    event.waitUntil(syncJournalEntries());
  } else if (event.tag === 'habit-sync') {
    event.waitUntil(syncHabitCompletions());
  }
});

// Sync journal entries when back online
async function syncJournalEntries() {
  try {
    // Get pending journal entries from IndexedDB
    const pendingEntries = await getPendingJournalEntries();
    
    for (const entry of pendingEntries) {
      try {
        await fetch('/api/journal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry)
        });
        
        // Remove from pending queue
        await removePendingJournalEntry(entry.id);
      } catch (error) {
        console.error('Failed to sync journal entry:', error);
      }
    }
  } catch (error) {
    console.error('Journal sync failed:', error);
  }
}

// Sync habit completions when back online
async function syncHabitCompletions() {
  try {
    // Get pending habit completions from IndexedDB
    const pendingCompletions = await getPendingHabitCompletions();
    
    for (const completion of pendingCompletions) {
      try {
        await fetch('/api/habits/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(completion)
        });
        
        // Remove from pending queue
        await removePendingHabitCompletion(completion.id);
      } catch (error) {
        console.error('Failed to sync habit completion:', error);
      }
    }
  } catch (error) {
    console.error('Habit sync failed:', error);
  }
}

// IndexedDB helper functions (simplified)
async function getPendingJournalEntries() {
  // Implementation would use IndexedDB
  return [];
}

async function removePendingJournalEntry(id) {
  // Implementation would use IndexedDB
}

async function getPendingHabitCompletions() {
  // Implementation would use IndexedDB
  return [];
}

async function removePendingHabitCompletion(id) {
  // Implementation would use IndexedDB
}
